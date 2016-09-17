import { IAction } from "./action";

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