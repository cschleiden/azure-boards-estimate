import {
    IProjectPageService,
    IGlobalMessagesService,
    CommonServiceIds
} from "azure-devops-extension-api";
import { ProjectInfo } from "azure-devops-extension-api/Core";
import { getService } from "azure-devops-extension-sdk";
import { Task, SagaIterator } from "redux-saga";
import {
    call,
    cancel,
    fork,
    put,
    take,
    takeLatest,
    takeEvery,
    select
} from "redux-saga/effects";
import history from "../../lib/history";
import { ICardSet } from "../../model/cards";
import { IIdentity } from "../../model/identity";
import { ISession, SessionSource } from "../../model/session";
import { IWorkItem } from "../../model/workitem";
import { CardSetServiceId, ICardSetService } from "../../services/cardSets";
import { IdentityServiceId, IIdentityService } from "../../services/identity";
import { IQueriesService, QueriesServiceId } from "../../services/queries";
import { Services } from "../../services/services";
import { ISessionService, SessionServiceId } from "../../services/sessions";
import { ISprintService, SprintServiceId } from "../../services/sprints";
import { IWorkItemService, WorkItemServiceId } from "../../services/workItems";
import { fatalError } from "../home/sessionsActions";
import { channelSaga } from "./channelSaga";
import {
    endSession,
    leaveSession,
    loadedSession,
    loadSession,
    commitEstimate,
    updateStatus,
    userJoined,
    estimate,
    estimateUpdated
} from "./sessionActions";
import { connected } from "./channelActions";
import { IEstimate } from "../../model/estimate";
import { IState } from "../../reducer";
import { ISnapshot } from "../../model/snapshots";

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
        const session: ISession = yield call(
            [sessionService, sessionService.getSession],
            action.payload
        );

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

        // Wait for leave or end
        const a:
            | ReturnType<typeof leaveSession>
            | ReturnType<typeof endSession> = yield take([
            leaveSession.type,
            endSession.type
        ]);

        yield cancel(estimationTask);

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
            // No estimation field ref name given, we cannot save
            console.error("Cannot save ");
            continue;
        }

        try {
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
        } catch (e) {}
    }
}
