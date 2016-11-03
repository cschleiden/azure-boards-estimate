import * as Q from "q";
import * as Redux from "redux";
import { Action, createAction } from "redux-actions";

import { IAction, makeAsyncAction } from "./action";

import { ISession } from "../model/session";
import { SessionService } from "../services/sessionService";

export const FETCH_SESSIONS = "fetch-sessions";

export const fetchAction = makeAsyncAction<ISession[], void>({
    type: FETCH_SESSIONS,
    payload: {
        promise: SessionService.getInstance().getSessionsAsync()
    }
});

export const ADD_SESSION = "add-session";

export interface IAddActionPayload {
    name: string;
}

export var addAction = (name: string): IAction<IAddActionPayload> => {
    return {
        type: ADD_SESSION,
        payload: {
            name: name
        }
    };
};


export const REMOVE_SESSION = "remove-session";

export interface IRemoveActionPayload {
    id: string;
}

export const removeAction = (id: string): IAction<IRemoveActionPayload> => ({
    type: REMOVE_SESSION,
    payload: {
        id: id
    }
});

export const DELETE_SESSION = "delete";
export const deleteAction = createAction<string, string>(DELETE_SESSION, (id: string) => id);
