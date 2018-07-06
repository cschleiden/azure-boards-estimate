import { combineReducers } from "redux";
import create, { ICreateSessionState } from "./pages/create/createReducer";
import sessions, { ISessionsState } from "./pages/home/sessionsReducer";
import session, { ISessionState } from "./pages/session/sessionReducer";

export interface IState {
    create: ICreateSessionState;
    sessions: ISessionsState;
    session: ISessionState;
}

export const rootReducer = combineReducers({
    create,
    sessions,
    session
});