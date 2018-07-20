import { IIdentity } from "./identity";

export interface IEstimate {
    identity: IIdentity;
    workItemId: number;
    estimate: string;
}

export interface ISessionEstimates {
    [workItemId: number]: IEstimate[];
}