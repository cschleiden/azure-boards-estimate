import { combineReducers } from "redux";
import init, { IInitState } from "./initReducer";
import create, { ICreateSessionState } from "./pages/create/createReducer";
import sessions, { ISessionsState } from "./pages/home/sessionsReducer";
import session, { ISessionState } from "./pages/session/sessionReducer";

export interface IState {
    create: ICreateSessionState;
    init: IInitState;
    sessions: ISessionsState;
    session: ISessionState;
}

export const rootReducer = combineReducers({
    create,
    init,
    sessions,
    session
});
