import { Action } from "typescript-fsa";
import { ILookup } from "../../lib/lookup";
import reducerMap, { reducerAction } from "../../lib/reducerMap";
import { IQuery } from "../../model/query";
import { ISession } from "../../model/session";
import { IIteration, ITeam } from "../../services/teams";
import * as Actions from "./sessionsActions";

export const initialState = {
    sessions: [] as ISession[],
    legacySessions: [] as ISession[],
    filteredSessions: null as ISession[] | null,

    teamLookup: null as null | ILookup<ITeam>,
    iterationLookup: null as null | ILookup<IIteration>,
    queryLookup: null as null | ILookup<IQuery>,

    loading: false,
    error: null as string | null
};

export type ISessionsState = typeof initialState;

const populate = reducerAction(
    Actions.populate,
    (state: ISessionsState, { sessions, legacySessions }) => {
        state.loading = false;
        state.sessions = sessions;
        state.legacySessions = legacySessions;
    }
);

const filter = reducerAction(Actions.filter, (state: ISessionsState, query) => {
    if (!query) {
        state.filteredSessions = null;
    } else {
        state.filteredSessions = state.sessions.filter(
            x =>
                x.name
                    .toLocaleLowerCase()
                    .indexOf(query.toLocaleLowerCase()) !== -1
        );
    }
});

const setIterationLookup = reducerAction(
    Actions.setIterationLookup,
    (state: ISessionsState, lookup) => {
        state.iterationLookup = lookup;
    }
);

const setTeamLookup = reducerAction(
    Actions.setTeamLookup,
    (state: ISessionsState, lookup) => {
        state.teamLookup = lookup;
    }
);

const setQueryLookup = reducerAction(
    Actions.setQueryLookup,
    (state: ISessionsState, lookup) => {
        state.queryLookup = lookup;
    }
);

const error = reducerAction(
    Actions.fatalError,
    (state: ISessionsState, error) => {
        state.error = error;
    }
);

const clearError = reducerAction(
    Actions.fatalError,
    (state: ISessionsState) => {
        state.error = null;
    }
);

export default <TPayload>(
    state: ISessionsState = initialState,
    action?: Action<TPayload>
) => {
    return reducerMap(action, state, {
        [Actions.loadSessions.type]: reducerAction(
            Actions.loadSessions,
            state => {
                state.loading = true;
            }
        ),
        [Actions.populate.type]: populate,
        [Actions.filter.type]: filter,

        [Actions.setIterationLookup.type]: setIterationLookup,
        [Actions.setTeamLookup.type]: setTeamLookup,
        [Actions.setQueryLookup.type]: setQueryLookup,

        [Actions.fatalError.type]: error,
        [Actions.clearError.type]: clearError
    });
};
