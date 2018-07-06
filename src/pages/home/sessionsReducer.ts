import { Action } from "typescript-fsa";
import reducerMap, { reducerAction } from "../../lib/reducerMap";
import { ISession } from "../../model/session";
import * as Actions from "./sessionsActions";

export const initialState = {
    sessions: [] as ISession[],

    loading: false
}

export type ISessionsState = typeof initialState;

const populate = reducerAction(
    Actions.populate,
    (state: ISessionsState, payload) => {
        state.sessions = payload;
    }
);

export default <TPayload>(
    state: ISessionsState = initialState,
    action?: Action<TPayload>
) => {
    return reducerMap(action, state, {
        [Actions.populate.type]: populate
    });
};