import * as Q from "q";
import * as Redux from "redux";
import { Action, createAction } from "redux-actions";

import { IAction, makeAsyncAction } from "./action";

import { ISession } from "../model/session";

export const FETCH_SESSIONS_PENDING = "fetch-sessions-pending";
export const FETCH_SESSIONS_SUCCESS = "fetch-sessions-success";
export const FETCH_SESSIONS_ERROR = "fetch-sessions-error";


export const fetchAction = makeAsyncAction<ISession[], void>({
    types: {
        succcess: FETCH_SESSIONS_SUCCESS,
        failed: FETCH_SESSIONS_ERROR,
        pending: FETCH_SESSIONS_PENDING
    },
    payload: {
        promise: Q.delay([], 2000)
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
