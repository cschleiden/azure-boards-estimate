import { actionCreatorFactory } from "typescript-fsa";
import { ISession } from "../../model/session";
import { IIteration, ITeam } from "../../services/teams";
import { ILookup } from "../../lib/lookup";
import { IQuery } from "../../model/query";

const factory = actionCreatorFactory("sessions");

export const loadSessions = factory<void>("load");

export const populate = factory<{
    sessions: ISession[];
    legacySessions: ISession[];
}>("populate");

export const setIterationLookup = factory<ILookup<IIteration>>(
    "setIterationLookup"
);

export const setTeamLookup = factory<ILookup<ITeam>>("setTeamLookup");

export const setQueryLookup = factory<ILookup<IQuery>>("setQueryLookup");

export const filter = factory<string>("filter");
