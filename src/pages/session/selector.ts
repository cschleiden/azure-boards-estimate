import { IEstimate } from "../../model/estimate";
import { IUserInfo } from "../../model/user";
import { IState } from "../../reducer";
import { ISnapshot } from "../../model/snapshots";

export function getOwnEstimate(state: IState): IEstimate | null {
    return state.session.ownEstimate;
}

export function getActiveUsers(state: IState): IUserInfo[] {
    return state.session.activeUsers || [];
}

export function getSnapshot(state: IState): ISnapshot {
    return {
        currentWorkItemId:
            (state.session.selectedWorkItem &&
                state.session.selectedWorkItem.id) ||
            undefined,
        revealed: state.session.revealed,
        estimates: state.session.estimates,
        // In this state, this has to be set
        userInfo: state.session.currentUser!
    };
}
