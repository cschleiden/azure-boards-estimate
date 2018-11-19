import { Task } from "redux-saga";
import { call, cancel, fork, put, take, takeLatest } from "redux-saga/effects";
import history from "../../lib/history";
import { ICardSet } from "../../model/cards";
import { ISession, SessionSource } from "../../model/session";
import { IWorkItem } from "../../model/workitem";
import { CardSetServiceId, ICardSetService } from "../../services/cardSets";
import { Services } from "../../services/services";
import { ISessionService, SessionServiceId } from "../../services/sessions";
import { ISprintService, SprintServiceId } from "../../services/sprints";
import { IWorkItemService, WorkItemServiceId } from "../../services/workItems";
import { channelSaga } from "./channelSaga";
import { endSession, leaveSession, loadedSession, loadSession } from "./sessionActions";

export function* rootSessionSaga() {
    yield takeLatest(loadSession.type, sessionSaga);
}

export function* sessionSaga(action: ReturnType<typeof loadSession>) {
    const sessionService = Services.getService<ISessionService>(SessionServiceId);
    const session: ISession = yield call([sessionService, sessionService.getSession], action.payload);

    // Load cardset
    const cardService = Services.getService<ICardSetService>(CardSetServiceId);
    const cardSet: ICardSet = yield call([cardService, cardService.getSet], session.cardSet);

    // Load work items
    let workItemIds: number[];

    switch (session.source) {
        case SessionSource.Sprint: {
            const sprintService = Services.getService<ISprintService>(SprintServiceId);
            // TODO: Split team id
            const [projectId, teamId] = (session.sourceData as string).split(";");

            workItemIds = yield call([sprintService, sprintService.getWorkItems], projectId, teamId, session.sourceData as string);
            break;
        }

        case SessionSource.Ids: {
            workItemIds = session.sourceData as number[];
            break;
        }

        default:
            throw new Error("Unexpected session source");
    }

    const workItemService = Services.getService<IWorkItemService>(WorkItemServiceId);
    const workItems: IWorkItem[] = yield call([workItemService, workItemService.getWorkItems], workItemIds);

    // Start communication channel
    const channelTask: Task = yield fork(channelSaga, session);

    // Session is now loaded
    yield put(loadedSession({ session, cardSet, workItems, estimates: {} }));

    // Wait for leave or end
    const a: ReturnType<typeof leaveSession> | ReturnType<typeof endSession> = yield take([leaveSession.type, endSession.type]);
    switch (a.type) {
        case leaveSession.type: {
            yield cancel(channelTask);

            // Navigate back to session list
            history.push("/");
            break;
        }
    }
}
