import { Action } from "typescript-fsa";
import reducerMap, { reducerAction } from "../../lib/reducerMap";
import { ICardSet } from "../../model/cards";
import { ISessionEstimates } from "../../model/estimate";
import { ISession } from "../../model/session";
import { IWorkItem } from "../../model/workitem";
import * as Actions from "./sessionActions";

export const initialState = {
    session: null as (ISession | null),
    cardSet: null as (ICardSet | null),
    workItems: [] as IWorkItem[],
    selectedWorkItem: null as (IWorkItem | null),
    estimates: {} as ISessionEstimates,
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
        state.selectedWorkItem = workItems[0];
        state.loading = false;
    }
);

const workItemSelected = reducerAction(
    Actions.selectWorkItem,
    (state: ISessionState, id) => {
        const workItem = state.workItems.find(x => x.id === id);
        state.selectedWorkItem = workItem!;
    }
);

const estimateSet = reducerAction(
    Actions.estimateSet,
    (state: ISessionState, payload) => {
        const { workItemId, identity } = payload;

        if (!state.estimates[workItemId]) {
            state.estimates[workItemId] = [payload];
        } else {
            const idx = state.estimates[workItemId].findIndex(e => e.identity.id === identity.id);
            if (idx === -1) {
                state.estimates[workItemId].push(payload);
            } else {
                state.estimates[workItemId][idx] = payload;
            }
        }
    }
)

export default <TPayload>(
    state: ISessionState = initialState,
    action?: Action<TPayload>
) => {
    return reducerMap(action, state, {
        [Actions.loadSession.type]: loadSession,
        [Actions.loadedSession.type]: loadedSession,
        [Actions.workItemSelected.type]: workItemSelected,
        [Actions.estimateSet.type]: estimateSet
        // [Actions.estimate.type]: estimate
    });
};