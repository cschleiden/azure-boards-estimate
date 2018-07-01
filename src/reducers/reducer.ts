import { combineReducers } from "redux";
import create, { ICreateSessionState } from "./createReducer";
import sessions, { ISessionsState } from "./sessionsReducer";

export interface IState {
    create: ICreateSessionState;
    sessions: ISessionsState;
}

export const rootReducer = combineReducers({
    create,
    sessions
});