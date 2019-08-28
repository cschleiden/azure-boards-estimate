import {
    IGlobalMessagesService,
    IProjectPageService
} from "azure-devops-extension-api";
import { ProjectInfo } from "azure-devops-extension-api/Core";
import { getService, IUserContext } from "azure-devops-extension-sdk";
import { SagaIterator, Task } from "redux-saga";
import {
    call,
    cancel,
    fork,
    put,
    select,
    take,
    takeLatest
} from "redux-saga/effects";
import history from "../../lib/history";
import { ICardSet } from "../../model/cards";
import { IIdentity } from "../../model/identity";
import { ISession, SessionSource } from "../../model/session";
import { IWorkItem } from "../../model/workitem";
import { IState } from "../../reducer";
import { CardSetServiceId, ICardSetService } from "../../services/cardSets";
import { IdentityServiceId, IIdentityService } from "../../services/identity";
import { IQueriesService, QueriesServiceId } from "../../services/queries";
import { Services } from "../../services/services";
import { ISessionService, SessionServiceId } from "../../services/sessions";
import { ISprintService, SprintServiceId } from "../../services/sprints";
import { IWorkItemService, WorkItemServiceId } from "../../services/workItems";
import { fatalError } from "../home/sessionsActions";
import { connected } from "./channelActions";
import { channelSaga } from "./channelSaga";
import {
    commitEstimate,
    endSession,
    estimateUpdated,
    leaveSession,
    loadedSession,
    loadSession,
    selectWorkItem,
    updateStatus
} from "./sessionActions";

export function* rootSessionSaga() {
    yield takeLatest(loadSession.type, sessionSaga);
}

export function* sessionSaga(action: ReturnType<typeof loadSession>) {
    try {
        // Get project
        const projectService: IProjectPageService = yield call(
            getService,
            "ms.vss-tfs-web.tfs-page-data-service"
        );
        const projectInfo: ProjectInfo = yield call([
            projectService,
            projectService.getProject
        ]);

        // Get session
        const sessionService = Services.getService<ISessionService>(
            SessionServiceId
        );

        let session: ISession | undefined;
        session = yield call(
            [sessionService, sessionService.getSession],
            action.payload
        );

        if (!session) {
            // Check if it's a legacy session
            session = yield call(
                [sessionService, sessionService.getLegacySessions],
                action.payload
            );
        }

        if (!session) {
            throw new Error("Could not load session");
        }

        // Load cardset
        const cardService = Services.getService<ICardSetService>(
            CardSetServiceId
        );
        const cardSet: ICardSet = yield call(
            [cardService, cardService.getSet],
            session.cardSet
        );

        yield put(updateStatus("Loading work items..."));

        // Load work items
        let workItemIds: number[] = [];

        switch (session.source) {
            case SessionSource.Sprint: {
                const sprintService = Services.getService<ISprintService>(
                    SprintServiceId
                );

                if (session.sourceData) {
                    const [
                        teamId,
                        iterationId
                    ] = (session.sourceData as string).split(";");

                    if (teamId && iterationId) {
                        workItemIds = yield call(
                            [sprintService, sprintService.getWorkItems],
                            projectInfo.id,
                            teamId,
                            iterationId
                        );
                    }
                }
                break;
            }

            case SessionSource.Ids: {
                if (Array.isArray(session.sourceData)) {
                    workItemIds = session.sourceData as number[];
                }
                break;
            }

            case SessionSource.Query: {
                if (session.sourceData) {
                    const queriesService = Services.getService<IQueriesService>(
                        QueriesServiceId
                    );
                    workItemIds = yield call(
                        [queriesService, queriesService.runQuery],
                        projectInfo.id,
                        session.sourceData as string
                    );
                }
                break;
            }

            default:
                throw new Error("Unexpected session source");
        }

        const workItemService = Services.getService<IWorkItemService>(
            WorkItemServiceId
        );
        const workItems: IWorkItem[] = yield call(
            [workItemService, workItemService.getWorkItems],
            workItemIds
        );

        yield put(updateStatus("Connecting to server..."));

        // Start communication channel
        const channelTask: Task = yield fork(channelSaga, session);

        // Wait for connection
        yield take(connected.type);

        yield put(updateStatus("Connected."));

        // Session is now loaded
        const identityService = Services.getService<IIdentityService>(
            IdentityServiceId
        );
        const identity: IIdentity = yield call([
            identityService,
            identityService.getCurrentIdentity
        ]);
        yield put(
            loadedSession({
                session,
                cardSet,
                workItems,
                estimates: {},
                userInfo: {
                    tfId: identity.id,
                    name: identity.displayName,
                    imageUrl: identity.imageUrl
                }
            })
        );

        const estimationTask = yield fork(sessionEstimationSaga);
        const notificationTask = yield fork(notificationSaga);

        // Wait for leave or end
        const a:
            | ReturnType<typeof leaveSession>
            | ReturnType<typeof endSession> = yield take([
            leaveSession.type,
            endSession.type
        ]);

        yield cancel(estimationTask);
        yield cancel(notificationTask);

        switch (a.type) {
            case endSession.type: {
                const sessionService = Services.getService<ISessionService>(
                    SessionServiceId
                );
                yield call(
                    [sessionService, sessionService.removeSession],
                    session.id
                );
                break;
            }
        }

        yield cancel(channelTask);
        // Navigate back to session list
        history.push("/");
    } catch (e) {
        yield put(fatalError("Could not load session: " + e.message));

        // Navigate back to session list
        history.push("/");
    }
}

/**
 * Handle estimation
 */
function* sessionEstimationSaga(): SagaIterator {
    while (true) {
        const action: ReturnType<typeof commitEstimate> = yield take(
            commitEstimate
        );
        const value = action.payload;

        const workItem: IWorkItem = yield select<IState>(
            s => s.session.selectedWorkItem
        );
        if (!workItem || !value) {
            continue;
        }

        if (!workItem.estimationFieldRefName) {
            // No estimation field ref name given, we cannot save, show error message and abort
            const globalMessagesSvc: IGlobalMessagesService = yield call(
                getService,
                "ms.vss-tfs-web.tfs-global-messages-service"
            );
            globalMessagesSvc.addToast({
                duration: 5000,
                message: `Cannot save estimate, no field is configured for work items of type ${workItem.workItemType}`,
                forceOverrideExisting: true
            });
            continue;
        }

        try {
            // Save estimate to work item
            const workItemService = Services.getService<IWorkItemService>(
                WorkItemServiceId
            );
            yield call(
                [workItemService, workItemService.saveEstimate],
                workItem.id,
                workItem.estimationFieldRefName,
                value
            );

            yield put(
                estimateUpdated({
                    workItemId: workItem.id,
                    value
                })
            );

            // Move to next work item, if it exists or to first one
            const workItems: IWorkItem[] = yield select<IState>(
                s => s.session.workItems
            );
            const idx = workItems.findIndex(x => x.id === workItem.id);
            const nextWorkItemId =
                idx + 1 < workItems.length
                    ? workItems[idx + 1].id
                    : workItems[0].id;
            yield put(selectWorkItem(nextWorkItemId));
        } catch (e) {}
    }
}

function* notificationSaga(): SagaIterator {
    while (true) {
        const action: ReturnType<typeof estimateUpdated> = yield take(
            estimateUpdated
        );

        const workItem: IWorkItem = yield select<IState>(
            s => s.session.selectedWorkItem
        );
        if (workItem && workItem.id !== action.payload.workItemId) {
            // Only show message if the current work item is the one the estimate was updated for
            continue;
        }

        const globalMessagesSvc: IGlobalMessagesService = yield call(
            getService,
            "ms.vss-tfs-web.tfs-global-messages-service"
        );
        globalMessagesSvc.addToast({
            duration: 2000,
            message: "Estimate saved"
        });
    }
}
