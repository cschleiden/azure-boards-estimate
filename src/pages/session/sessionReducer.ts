import { Action } from "typescript-fsa";
import reducerMap, { reducerAction } from "../../lib/reducerMap";
import { ICardSet } from "../../model/cards";
import { ISessionEstimates, IEstimate } from "../../model/estimate";
import { ISession } from "../../model/session";
import { IWorkItem } from "../../model/workitem";
import * as Actions from "./sessionActions";
import { IUserInfo } from "../../model/user";

export const initialState = {
    session: null as ISession | null,
    cardSet: null as ICardSet | null,
    workItems: [] as IWorkItem[],
    selectedWorkItem: null as IWorkItem | null,
    ownEstimate: null as IEstimate | null,
    estimates: {} as ISessionEstimates,
    loading: false,
    revealed: false,
    activeUsers: [] as IUserInfo[]
};

export type ISessionState = typeof initialState;

const loadSession = reducerAction(
    Actions.loadSession,
    (state: ISessionState, payload) => {
        state.loading = true;
    }
);

const loadedSession = reducerAction(
    Actions.loadedSession,
    (state: ISessionState, { session, cardSet, workItems, userInfo }) => {
        state.session = session;
        state.cardSet = cardSet;
        state.workItems = workItems;
        state.loading = false;
        state.activeUsers = [userInfo];
    }
);

const leaveSession = reducerAction(
    Actions.leaveSession,
    (state: ISessionState) => {
        state.session = null;
        state.cardSet = null;
        state.workItems = [];
        state.estimates = {};
        state.ownEstimate = null;
        state.selectedWorkItem = null;
    }
);

const workItemSelected = reducerAction(
    Actions.selectWorkItem,
    (state: ISessionState, id) => {
        const workItem = state.workItems.find(x => x.id === id);
        if (!workItem) {
            throw new Error(`Cannot find work item with id ${id}`);
        }

        state.selectedWorkItem = workItem;
        state.revealed = false;
    }
);

const userJoined = reducerAction(
    Actions.userJoined,
    (state: ISessionState, userInfo) => {
        if (!state.activeUsers.find(x => x.tfId === userInfo.tfId)) {
            state.activeUsers.push(userInfo);
        }
    }
);

const userLeft = reducerAction(
    Actions.userLeft,
    (state: ISessionState, userId) => {
        state.activeUsers = state.activeUsers.filter(x => x.tfId !== userId);
    }
);

/**
 * Local estimate
 */
const estimate = reducerAction(
    Actions.estimate,
    (state: ISessionState, estimate) => {
        state.ownEstimate = estimate;
    }
);

/**
 *
 */
const revealed = reducerAction(Actions.revealed, (state: ISessionState) => {
    state.revealed = true;
});

/**
 * Remote estimate
 */
const estimateSet = reducerAction(
    Actions.estimateSet,
    (state: ISessionState, estimate) => {
        const { workItemId, identity } = estimate;

        if (!state.selectedWorkItem) {
            // No selected work item, this means we have joined the session recently. Take the work item id of
            // this estimate as the selected work item.
            state.selectedWorkItem =
                state.workItems.find(x => x.id === workItemId) || null;
        }

        if (!state.estimates[workItemId]) {
            state.estimates[workItemId] = [estimate];
        } else {
            const idx = state.estimates[workItemId].findIndex(
                e => e.identity.id === identity.id
            );
            if (idx === -1) {
                state.estimates[workItemId].push(estimate);
            } else {
                state.estimates[workItemId][idx] = estimate;
            }
        }
    }
);

export default <TPayload>(
    state: ISessionState = initialState,
    action?: Action<TPayload>
) => {
    return reducerMap(action, state, {
        [Actions.loadSession.type]: loadSession,
        [Actions.loadedSession.type]: loadedSession,
        [Actions.leaveSession.type]: leaveSession,
        [Actions.workItemSelected.type]: workItemSelected,
        [Actions.revealed.type]: revealed,
        [Actions.estimateSet.type]: estimateSet,
        [Actions.estimate.type]: estimate,
        [Actions.userJoined.type]: userJoined,
        [Actions.userLeft.type]: userLeft
    });
};
