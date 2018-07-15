import { actionCreatorFactory } from "typescript-fsa";
import { ICardSet } from "../../model/cards";
import { IWorkItem } from "../../model/IWorkItem";
import { ISession } from "../../model/session";

const factory = actionCreatorFactory("session");

export const loadSession = factory<string>("load");
export const loadedSession = factory<{
    session: ISession;
    cardSet: ICardSet;
    workItems: IWorkItem[];
}>("loaded");

export const leaveSession = factory<void>("leave");
export const endSession = factory<void>("end");

export const selectWorkItem = factory<number>("selectWorkItem");