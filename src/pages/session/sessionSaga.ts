import { call, fork, put, takeLatest } from "redux-saga/effects";
import { ICardSet } from "../../model/cards";
import { ISessionEstimates } from "../../model/estimate";
import { ISession, SessionSource } from "../../model/session";
import { IWorkItem } from "../../model/workitem";
import { CardSetServiceId, ICardSetService } from "../../services/cardSets";
import { Services } from "../../services/services";
import { ISessionService, SessionServiceId } from "../../services/sessions";
import { ISprintService, SprintServiceId } from "../../services/sprints";
import { IWorkItemService, WorkItemServiceId } from "../../services/workItems";
import { channelSaga } from "./channelSaga";
import { loadedSession, loadSession } from "./sessionActions";

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
            workItemIds = yield call([sprintService, sprintService.getWorkItems], session.sourceData, session.sourceData);
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

    const estimates: ISessionEstimates = yield fork(channelSaga, session);

    yield put(loadedSession({ session, cardSet, workItems, estimates }));
}
