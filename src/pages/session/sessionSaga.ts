import { call, put, takeLatest } from "redux-saga/effects";
import { ISession } from "../../model/session";
import { Services } from "../../services/services";
import { ISessionService, SessionServiceId } from "../../services/sessions";
import { loadedSession, loadSession } from "./sessionActions";

export function* rootSessionSaga() {
    yield takeLatest(loadSession.type, sessionSaga);
}

export function* sessionSaga(action: ReturnType<typeof loadSession>) {

    const sessionService = Services.getService<ISessionService>(SessionServiceId);
    const session: ISession = yield call([sessionService, sessionService.getSession], action.payload);

    yield put(loadedSession(session));
}
