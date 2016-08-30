import { createStore } from "redux";

import { IAction } from "../actions/action";
import * as Actions from "../actions/sessionActionsCreators";
import { ISession } from "../model/session";

export interface ISessionState {
    sessions: ISession[];
}

const initialState: ISessionState = {
    sessions: []
};

export var sessionReducer = (state: ISessionState = initialState, action?): ISessionState => {
    if (!state) {
        return initialState;
    }

    switch (action.type) {
        case Actions.ADD_SESSION:
            return {
                sessions: state.sessions.concat([{
                    id: "abc",
                    name: action.payload.name,
                    createdAt: new Date(),
                    createdBy: "user"
                }])
            };
    }

    return state;
};