import { ISessionEstimates } from "./estimate";
import { IUserInfo } from "./user";

/**
 * Represents a snapshot of the current state of the estimation session, as seen by the current user
 */
export interface ISnapshot {
    currentWorkItemId?: number;

    revealed: boolean;

    estimates: ISessionEstimates;

    userInfo: IUserInfo;
}
