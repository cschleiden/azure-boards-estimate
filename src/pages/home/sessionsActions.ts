import { actionCreatorFactory } from "typescript-fsa";
import { ISession } from "../../model/session";

const factory = actionCreatorFactory("sessions");

export const loadSessions = factory<void>("load");

export const populate = factory<ISession[]>("populate");

export const filter = factory<string>("filter");
