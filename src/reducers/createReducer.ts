import { Action } from "redux";
import reducerMap from "../lib/reducerMap";
import { ISession, SessionSource } from "../model/session";
import { IIteration, ITeam } from "../services/teams";
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

    team: "",
    iteration: "",

    isCreating: false
}

export type ICreateSessionState = typeof initialState;

const setName = (state: ICreateSessionState, action: ReturnType<typeof Actions.setName>): ICreateSessionState => {
    state.session.name = action.payload;

    return state;
}

const setSource = (state: ICreateSessionState, action: ReturnType<typeof Actions.setSource>): ICreateSessionState => {
    state.session.source = action.payload;

    return state;
}

const create = (state: ICreateSessionState, action: ReturnType<typeof Actions.create>): ICreateSessionState => {
    state.isCreating = true;

    return state;
}

const setTeams = (state: ICreateSessionState, action: ReturnType<typeof Actions.setTeams>): ICreateSessionState => {
    state.teams = action.payload;

    return state;
}

const setTeam = (state: ICreateSessionState, action: ReturnType<typeof Actions.setTeam>): ICreateSessionState => {
    state.team = action.payload;

    return state;
}

const setIterations = (state: ICreateSessionState, action: ReturnType<typeof Actions.setIterations>): ICreateSessionState => {
    state.iterations = action.payload;

    return state;
}

const setIteration = (state: ICreateSessionState, action: ReturnType<typeof Actions.setIteration>): ICreateSessionState => {
    state.iteration = action.payload;

    return state;
}

export default <TPayload>(
    state: ICreateSessionState = initialState,
    action?: Action<TPayload>) => {

    return reducerMap(action, state, {
        [Actions.setName.type]: setName,
        [Actions.setSource.type]: setSource,
        [Actions.create.type]: create,

        [Actions.setTeams.type]: setTeams,
        [Actions.setTeam.type]: setTeam,
        [Actions.setIterations.type]: setIterations,
        [Actions.setIteration.type]: setIteration
    });
};