import { IIdentity } from "./identity";

export interface IEstimate {
    identity: IIdentity;
    workItemId: number;
    cardIdentifier: string;
}

export interface ISessionEstimates {
    [workItemId: number]: IEstimate[];
}
