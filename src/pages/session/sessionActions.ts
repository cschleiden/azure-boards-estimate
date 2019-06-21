import { actionCreatorFactory } from "typescript-fsa";
import { ICardSet, ICard } from "../../model/cards";
import { IEstimate, ISessionEstimates } from "../../model/estimate";
import { ISession } from "../../model/session";
import { IUserInfo } from "../../model/user";
import { IWorkItem } from "../../model/workitem";
import { ISnapshot } from "../../model/snapshots";

const factory = actionCreatorFactory("session");

export const loadSession = factory<string>("load");
export const loadedSession = factory<{
    session: ISession;
    cardSet: ICardSet;
    workItems: IWorkItem[];
    estimates: ISessionEstimates;
    userInfo: IUserInfo;
}>("loaded");

export const updateStatus = factory<string>("updateStatus");

export const errorSession = factory<string>("error");
export const leaveSession = factory<void>("leave");
export const endSession = factory<void>("end");

export const selectWorkItem = factory<number>("selectWorkItem");
export const workItemSelected = factory<number>("workItemSelected");

export const estimate = factory<IEstimate>("estimate");

/** Reveal all cards */
export const reveal = factory<void>("reveal");

/** Cards have been revealed */
export const revealed = factory<void>("revealed");

export const commitEstimate = factory<number | string | null>("commitCard");
export const estimateUpdated = factory<{
    workItemId: number;
    value: number | string | undefined;
    /** When set, this message was received remotely */
    remote?: boolean;
}>("estimateUpdated");

export const estimateSet = factory<IEstimate>("estimateSet");

export const userJoined = factory<IUserInfo>("userJoined");
export const userLeft = factory<string>("userLeft");

export const snapshotReceived = factory<ISnapshot>("snapshotReceived");
