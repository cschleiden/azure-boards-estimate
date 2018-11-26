import { actionCreatorFactory } from "typescript-fsa";
import { ISession } from "../../model/session";

const factory = actionCreatorFactory("sessions");

export const loadSessions = factory<void>("loadSessions");

export const populate = factory<ISession[]>("populate");
