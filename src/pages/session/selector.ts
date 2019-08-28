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

export function canPerformAdminActions(state: IState): boolean {
    if (
        state.session.session &&
        state.session.session.onlyCreatorCanSwitch &&
        state.session.currentUser
    ) {
        return (
            state.session.session.createdBy === state.session.currentUser.tfId
        );
    }

    return true;
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
