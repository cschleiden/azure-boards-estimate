import { makeImmutable, IImmutable } from "immuts";

import { IAction, success, pending, failed } from "../actions/action";
import * as SessionActions from "../actions/sessions";
import { ISession, SessionMode } from "../model/session";

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
        case pending(SessionActions.FETCH_SESSIONS):
            return state.set(x => x.isLoading, true);

        case success(SessionActions.FETCH_SESSIONS):
            return state.set(x => x.isLoading, false);

        case SessionActions.ADD_SESSION:
            const payload: SessionActions.IAddActionPayload = action.payload;

            return state.update(x => x.sessions, s => s.concat([{
                id: (state.data.sessions.length + 1).toString(10),
                name: action.payload.name,
                createdAt: new Date(),
                createdBy: "user",
                description: "",
                mode: SessionMode.Azure,
                version: 1
            }]));

        case SessionActions.REMOVE_SESSION: {
            const payload: SessionActions.IRemoveActionPayload = action.payload;
            return state.update(x => x.sessions, x => x.filter(s => s.id !== payload.id));
        }
    };

    return state;
};