import { actionCreatorFactory } from "typescript-fsa";
import { ISession } from "../model/session";

const factory = actionCreatorFactory("session");

export const populate = factory<{ sessions: ISession[] }>("POPULATE");