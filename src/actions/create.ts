import { IAction, makeAsyncAction } from "./action";
import { ISession, SessionMode } from "../model/session";

export const SET_NAME = "set-name";
export const setName = (name: string): IAction<string> => {
    return {
        type: SET_NAME,
        payload: name
    };
};

export const SET_DESCRIPTION = "set-description";
export const setDescription = (name: string): IAction<string> => {
    return {
        type: SET_NAME,
        payload: name
    };
};


export const CHANGE_MODE = "change-mode";
export const changeMode = (mode: SessionMode): IAction<SessionMode> => {
    return {
        type: CHANGE_MODE,
        payload: mode
    };
};
