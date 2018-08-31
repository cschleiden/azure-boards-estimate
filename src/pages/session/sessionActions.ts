import { actionCreatorFactory } from "typescript-fsa";
import { ICardSet } from "../../model/cards";
import { IEstimate, ISessionEstimates } from "../../model/estimate";
import { ISession } from "../../model/session";
import { IUserInfo } from "../../model/user";
import { IWorkItem } from "../../model/workitem";

const factory = actionCreatorFactory("session");

export const loadSession = factory<string>("load");
export const loadedSession = factory<{
    session: ISession;
    cardSet: ICardSet;
    workItems: IWorkItem[];
    estimates: ISessionEstimates;
}>("loaded");

export const leaveSession = factory<void>("leave");
export const endSession = factory<void>("end");

export const selectWorkItem = factory<number>("selectWorkItem");
export const workItemSelected = factory<number>("workItemSelected");
export const estimate = factory<IEstimate>("estimate");
export const estimateSet = factory<IEstimate>("estimateSet");
export const userJoined = factory<IUserInfo>("userJoined");