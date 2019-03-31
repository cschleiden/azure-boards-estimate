import { Action } from "typescript-fsa";
import reducerMap, { reducerAction } from "../../lib/reducerMap";
import { ICardSet } from "../../model/cards";
import { IEstimate, ISessionEstimates } from "../../model/estimate";
import { ISession } from "../../model/session";
import { IUserInfo } from "../../model/user";
import { IWorkItem } from "../../model/workitem";
import * as Actions from "./sessionActions";

export const initialState = {
    status: {
        loading: false,
        message: ""
    },
    session: null as ISession | null,
    cardSet: null as ICardSet | null,
    workItems: [] as IWorkItem[],
    selectedWorkItem: null as IWorkItem | null,
    ownEstimate: null as IEstimate | null,
    estimates: {} as ISessionEstimates,
    revealed: false,
    activeUsers: [] as IUserInfo[],
    currentUser: null as IUserInfo | null
};

export type ISessionState = typeof initialState;

const loadSession = reducerAction(
    Actions.loadSession,
    (state: ISessionState) => {
        state.status.loading = true;
    }
);

const loadedSession = reducerAction(
    Actions.loadedSession,
    (state: ISessionState, { session, cardSet, workItems, userInfo }) => {
        state.session = session;
        state.cardSet = cardSet;
        state.workItems = workItems;
        state.status.loading = false;
        state.activeUsers = [userInfo];
        state.currentUser = userInfo;
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

        // Update work item and hide estimates
        state.selectedWorkItem = workItem;
        state.revealed = false;

        // Clear own and other estimates
        state.estimates = {};
        state.ownEstimate = null;
    }
);

const userJoined = reducerAction(
    Actions.userJoined,
    (state: ISessionState, userInfo) => {
        addUser(state, userInfo);
    }
);

function addUser(state: ISessionState, userInfo: IUserInfo): void {
    if (!state.activeUsers.find(x => x.tfId === userInfo.tfId)) {
        state.activeUsers.push(userInfo);
    }
}

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
 * Incoming estimate
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
                // We don't have an estimate from this user
                state.estimates[workItemId].push(estimate);
            } else {
                // User might have changed their estimate
                state.estimates[workItemId][idx] = estimate;
            }
        }

        if (state.currentUser && identity.id === state.currentUser.tfId) {
            state.ownEstimate = estimate;
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
        [Actions.userLeft.type]: userLeft,
        [Actions.estimateUpdated.type]: reducerAction(
            Actions.estimateUpdated,
            (state, { workItemId, value }) => {
                const workItem = state.workItems.find(x => x.id === workItemId);
                if (workItem) {
                    workItem.estimate = value;
                }
            }
        ),
        [Actions.updateStatus.type]: reducerAction(
            Actions.updateStatus,
            (state, message) => {
                state.status.message = message;
            }
        ),
        [Actions.snapshotReceived.type]: reducerAction(
            Actions.snapshotReceived,
            (state, snapshot) => {
                // Only react to snapshot if we don't have a current work item. Otherwise assume that we're
                // already up-to-date.
                if (!state.selectedWorkItem) {
                    const {
                        currentWorkItemId,
                        revealed,
                        estimates,
                        userInfo
                    } = snapshot;
                    if (currentWorkItemId) {
                        const workItem = state.workItems.find(
                            x => x.id === currentWorkItemId
                        );
                        if (!workItem) {
                            throw new Error(
                                `Cannot find work item with id ${currentWorkItemId}`
                            );
                        }

                        state.selectedWorkItem = workItem;
                    }

                    state.revealed = revealed;
                    state.estimates = estimates;

                    addUser(state, userInfo);
                }
            }
        )
    });
};
