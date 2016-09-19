import { createStore } from "redux";

import * as ImmutableJs from "immutable";
import { makeImmutable, IImmutable, makeImmutableJs } from "immuts";

import { IAction } from "../actions/action";
import * as Actions from "../actions/sessions";
import { ISession } from "../model/session";

export interface ISessionState {
    sessions: ISession[];
    isLoading: boolean;

    currentSession: ISession;
}

const initialState = makeImmutable({
    sessions: [],
    isLoading: false,
    currentSession: null
});

export const sessions = (
    state: IImmutable<ISessionState> = initialState,
    action?: any): IImmutable<ISessionState> => {
    switch (action.type) {
        case Actions.FETCH_SESSIONS_PENDING:
            return state.set(x => x.isLoading, true);

        case Actions.FETCH_SESSIONS_SUCCESS:
            return state.set(x => x.isLoading, false);

        case Actions.ADD_SESSION:
            const payload: Actions.IAddActionPayload = action.payload;

            return state.update(x => x.sessions, s => s.concat([{
                id: (state.data.sessions.length + 1).toString(10),
                name: action.payload.name,
                createdAt: new Date(),
                createdBy: "user"
            }]));

        case Actions.REMOVE_SESSION: {
            const payload: Actions.IRemoveActionPayload = action.payload;
            return state.update(x => x.sessions, x => x.filter(s => s.id !== payload.id));
        }
    };

    return state;
};