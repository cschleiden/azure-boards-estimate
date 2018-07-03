import { actionCreatorFactory } from "typescript-fsa";
import { SessionSource } from "../model/session";
import { IIteration, ITeam } from "../services/teams";

const factory = actionCreatorFactory("create");

export const init = factory<void>("init");

export const setName = factory<string>("setName");
export const setSource = factory<SessionSource>("setSource");

// Actions for source
export const setTeams = factory<ITeam[]>("setTeams");
export const setTeam = factory<string>("setTeam");
export const setIterations = factory<IIteration[]>("setIterations");
export const setIteration = factory<string>("setIteration");

export const create = factory<void>("create");
export const create2 = factory<{
    name: string;
}>("CREATE2");