import { Action } from "typescript-fsa";
import reducerMap, { reducerAction } from "../../lib/reducerMap";
import { ICardSet } from "../../model/cards";
import { ISession, SessionMode, SessionSource } from "../../model/session";
import { IIteration, ITeam } from "../../services/teams";
import * as Actions from "./createActions";

const initialState = {
    session: {
        id: "",
        cardSet: "",
        mode: SessionMode.Online as SessionMode,
        name: "",
        source: SessionSource.Sprint,
        createdAt: new Date(),
        createdBy: "",
        onlyCreatorCanSwitch: false,
        version: 1
    } as ISession,

    teams: null as ITeam[] | null,
    iterations: null as IIteration[] | null,
    cardSets: null as ICardSet[] | null,

    team: "",
    iteration: "",
    queryId: "",

    isCreating: false,

    /** If set, user cannot change source */
    sourceLocked: false
};

export type ICreateSessionState = typeof initialState;

const setName = reducerAction(
    Actions.setName,
    (state: ICreateSessionState, name) => {
        state.session.name = name;
    }
);

const setMode = reducerAction(
    Actions.setMode,
    (state: ICreateSessionState, mode: SessionMode) => {
        state.session.mode = mode;
    }
);

const setSource = reducerAction(
    Actions.setSource,
    (state: ICreateSessionState, source: SessionSource) => {
        state.session.source = source;
    }
);

const setLimitedToCreator = reducerAction(
    Actions.setLimitedToCreator,
    (state: ICreateSessionState, value: boolean) => {
        state.session.onlyCreatorCanSwitch = value;
    }
);

const setCardSet = reducerAction(
    Actions.setCardSet,
    (s: ICreateSessionState, cardSet) => {
        s.session.cardSet = cardSet;
    }
);

const create = reducerAction(Actions.create, (state: ICreateSessionState) => {
    state.isCreating = true;
});

const setCardSets = reducerAction(
    Actions.setCardSets,
    (s: ICreateSessionState, cardSets) => {
        s.cardSets = cardSets;
    }
);

const setTeams = reducerAction(
    Actions.setTeams,
    (state: ICreateSessionState, teams) => {
        state.teams = teams;
    }
);

const setTeam = reducerAction(
    Actions.setTeam,
    (state: ICreateSessionState, teamId) => {
        state.team = teamId;
        state.session.sourceData = `${state.team};${state.iteration}`;
    }
);

const setIterations = reducerAction(
    Actions.setIterations,
    (state: ICreateSessionState, iterations) => {
        state.iterations = iterations;
    }
);

const setIteration = reducerAction(
    Actions.setIteration,
    (state: ICreateSessionState, iterationId) => {
        state.iteration = iterationId;
        state.session.sourceData = `${state.team};${state.iteration}`;
    }
);

const setQuery = reducerAction(
    Actions.setQuery,
    (state: ICreateSessionState, queryId) => {
        state.queryId = queryId;
        state.session.sourceData = queryId;
    }
);

const init = reducerAction(
    Actions.init,
    (state: ICreateSessionState, workItemIds) => {
        if (workItemIds && workItemIds.length > 0) {
            state.session.source = SessionSource.Ids;
            state.session.sourceData = workItemIds;
            state.sourceLocked = true;
        }
    }
);

const reset = reducerAction(Actions.reset, (state: ICreateSessionState) => {
    // Reset but keep preloaded data
    Object.assign(state, {
        ...initialState,
        teams: state.teams,
        cardSets: state.cardSets
    });
});

export default <TPayload>(
    state: ICreateSessionState = initialState,
    action?: Action<TPayload>
) => {
    return reducerMap(action, state, {
        [Actions.init.type]: init,
        [Actions.reset.type]: reset,

        [Actions.setName.type]: setName,
        [Actions.setCardSet.type]: setCardSet,
        [Actions.setMode.type]: setMode,
        [Actions.setSource.type]: setSource,
        [Actions.setLimitedToCreator.type]: setLimitedToCreator,
        [Actions.create.type]: create,

        [Actions.setCardSets.type]: setCardSets,
        [Actions.setTeams.type]: setTeams,
        [Actions.setTeam.type]: setTeam,
        [Actions.setIterations.type]: setIterations,
        [Actions.setIteration.type]: setIteration,
        [Actions.setQuery.type]: setQuery
    });
};
