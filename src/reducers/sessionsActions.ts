import { actionCreatorFactory } from "typescript-fsa";
import { ISession } from "../model/session";

const factory = actionCreatorFactory("session");

export const init = factory<void>("init");

export const populate = factory<ISession[]>("populate");