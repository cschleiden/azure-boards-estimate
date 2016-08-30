import { IAction } from "./action";

export const ADD_SESSION = "add-session";

export interface IActionPayload {
    name: string;
}

export var addAction = (name: string): IAction<IActionPayload> => {
    return {
        type: ADD_SESSION,
        payload: {
            name: name
        }
    };
}