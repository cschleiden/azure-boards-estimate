import { Action } from "typescript-fsa";
import reducerMap, { reducerAction } from "../../lib/reducerMap";
import { ICardSet } from "../../model/cards";
import { IWorkItem } from "../../model/IWorkItem";
import { ISession } from "../../model/session";
import * as Actions from "./sessionActions";

export const initialState = {
    session: null as (ISession | null),
    cardSet: null as (ICardSet | null),
    workItems: null as (IWorkItem[] | null),
    selectedWorkItem: null as (IWorkItem | null),
    loading: false
}

export type ISessionState = typeof initialState;

const loadSession = reducerAction(
    Actions.loadSession,
    (state: ISessionState, payload) => {
        state.loading = true;
    }
);

const loadedSession = reducerAction(
    Actions.loadedSession,
    (state: ISessionState, { session, cardSet, workItems }) => {
        state.session = session;
        state.cardSet = cardSet;
        state.workItems = workItems;
        state.selectedWorkItem = null;
    }
);

export default <TPayload>(
    state: ISessionState = initialState,
    action?: Action<TPayload>
) => {
    return reducerMap(action, state, {
        [Actions.loadSession.type]: loadSession,
        [Actions.loadedSession.type]: loadedSession
    });
};