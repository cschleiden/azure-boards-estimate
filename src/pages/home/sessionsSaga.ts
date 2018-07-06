import { call, put, takeLatest } from "redux-saga/effects";
import { ISession } from "../../model/session";
import { Services } from "../../services/services";
import { ISessionService, SessionServiceId } from "../../services/sessions";
import { loadSessions, populate } from "./sessionsActions";

export function* rootSessionsSaga() {
    yield takeLatest(loadSessions.type, initSaga);
}

export function* initSaga() {
    const sessionService = Services.getService<ISessionService>(SessionServiceId);
    const sessions: ISession[] = yield call([sessionService, sessionService.getSessions]);

    yield put(populate(sessions));
}