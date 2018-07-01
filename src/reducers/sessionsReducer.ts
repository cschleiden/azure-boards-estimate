import produce from "immer";
import { Action } from "redux";
import reducerMap from "../lib/reducerMap";
import { ISession } from "../model/session";
import * as Actions from "./sessionsActions";

export interface ISessionsState {
    sessions: ISession[];
}

const populate = (state: ISessionsState, action: ReturnType<typeof Actions.populate>): ISessionsState => {
    return produce(state, draft => {
        draft.sessions = action.payload.sessions;
    });
}

export default <TPayload>(
    state: ISessionsState = {
        sessions: []
    },
    action?: Action<TPayload>) => {

    return reducerMap(action, state, {
        [Actions.populate.type]: populate
    });
};