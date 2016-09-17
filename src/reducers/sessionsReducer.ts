import { createStore } from "redux";

import * as ImmutableJs from "immutable";
import { makeImmutable, IImmutable, makeImmutableJs } from "immuts";

import { IAction } from "../actions/action";
import * as Actions from "../actions/sessionActionsCreators";
import { ISession } from "../model/session";

export interface ITest {
    name: string;
}

export interface ISessionState {
    sessions: ISession[];
    test: ITest;
}

const initialState: IImmutable<ISessionState> = makeImmutable<ISessionState>({
    sessions: [],
    test: {
        name: "foo"
    }
});

export var sessionReducer = (state: IImmutable<ISessionState> = initialState, action?): IImmutable<ISessionState> => {
    switch (action.type) {
        case Actions.ADD_SESSION:
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