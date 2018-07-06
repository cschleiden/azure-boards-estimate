import { Action } from "typescript-fsa";
import reducerMap, { reducerAction } from "../../lib/reducerMap";
import { ICardSet } from "../../model/cards";
import { ISession, SessionSource } from "../../model/session";
import { IIteration, ITeam } from "../../services/teams";
import * as Actions from "./createActions";

const initialState = {
    session: {
        id: "",
        name: "",
        source: SessionSource.Sprint,
        createdAt: new Date(),
        createdBy: "",
        version: 1
    } as ISession,

    teams: null as (ITeam[] | null),
    iterations: null as (IIteration[] | null),
    cardSets: null as (ICardSet[] | null),

    team: "",
    iteration: "",

    isCreating: false
}

export type ICreateSessionState = typeof initialState;

const setName = reducerAction(Actions.setName, (state: ICreateSessionState, payload) => {
    state.session.name = payload;
});

const setSource = reducerAction(Actions.setSource, (state: ICreateSessionState, payload) => {
    state.session.source = payload;
});

const create = reducerAction(Actions.create, (state: ICreateSessionState, payload) => {
    state.isCreating = true;
});

const setCardSets = reducerAction(Actions.setCardSets, (s: ICreateSessionState, p) => {
    s.cardSets = p;
});

const setTeams = reducerAction(Actions.setTeams, (state: ICreateSessionState, payload) => {
    state.teams = payload;
});

const setTeam = reducerAction(Actions.setTeam, (state: ICreateSessionState, payload) => {
    state.team = payload;
});

const setIterations = reducerAction(Actions.setIterations, (state: ICreateSessionState, payload) => {
    state.iterations = payload;
});

const setIteration = reducerAction(Actions.setIteration, (state: ICreateSessionState, payload) => {
    state.iteration = payload;
});

export default <TPayload>(
    state: ICreateSessionState = initialState,
    action?: Action<TPayload>) => {

    return reducerMap(action, state, {
        [Actions.setName.type]: setName,
        [Actions.setSource.type]: setSource,
        [Actions.create.type]: create,

        [Actions.setCardSets.type]: setCardSets,
        [Actions.setTeams.type]: setTeams,
        [Actions.setTeam.type]: setTeam,
        [Actions.setIterations.type]: setIterations,
        [Actions.setIteration.type]: setIteration
    });
};