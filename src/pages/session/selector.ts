import { IEstimate } from "../../model/estimate";
import { IUserInfo } from "../../model/user";
import { IState } from "../../reducer";

export function getOwnEstimate(state: IState): IEstimate | null {
    return state.session.ownEstimate;
}

export function getActiveUsers(state: IState): IUserInfo[] {
    return state.session.activeUsers || [];
}
