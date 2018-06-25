import { combineReducers } from "redux";
import { ISessionsState, sessions } from "./sessionsReducer";

export interface IState {
    sessions: ISessionsState;
}

export const rootReducer = combineReducers({
    sessions
});