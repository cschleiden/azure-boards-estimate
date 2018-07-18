import { actionCreatorFactory } from "typescript-fsa";
import { ICardSet } from "../../model/cards";
import { SessionMode, SessionSource } from "../../model/session";
import { IIteration, ITeam } from "../../services/teams";

const factory = actionCreatorFactory("create");

export const init = factory<void>("init");

export const setName = factory<string>("setName");
export const setMode = factory<SessionMode>("setMode");

export const setSource = factory<SessionSource>("setSource");
export const setCardSets = factory<ICardSet[]>("setCardSets");
export const setCardSet = factory<string>("setCardSet");
export const setTeams = factory<ITeam[]>("setTeams");
export const setTeam = factory<string>("setTeam");
export const setIterations = factory<IIteration[]>("setIterations");
export const setIteration = factory<string>("setIteration");

export const create = factory<void>("create");