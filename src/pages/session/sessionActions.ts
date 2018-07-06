import { actionCreatorFactory } from "typescript-fsa";
import { ISession } from "../../model/session";

const factory = actionCreatorFactory("session");

export const loadSession = factory<string>("loadSession");
export const loadedSession = factory<ISession>("loadedSession");