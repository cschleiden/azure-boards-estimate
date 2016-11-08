import { makeImmutable, IImmutable } from "immuts";
import { ISession, SessionMode } from "../model/session";

import { IAction, success, pending, failed } from "../actions/action";
import { SET_NAME, SET_DESCRIPTION, CHANGE_MODE } from "../actions/create";

export interface ICreateSessionState {
    session: ISession;
}

type State = IImmutable<ICreateSessionState>;

const initialState = makeImmutable<ICreateSessionState>({
    session: {
        id: null,
        createdAt: null,
        createdBy: null,

        name: "",
        description: "",
        mode: SessionMode.Azure,

        version: 1
    }
});

const setName = (state: State, action: IAction<string>) => state.set(x => x.session.name, action.payload);
const setDescription = (state: State, action: IAction<string>) => state.set(x => x.session.description, action.payload);
const changeMode = (state: State, action: IAction<SessionMode>) => state.set(x => x.session.mode, action.payload);

export const create = (
    state: IImmutable<ICreateSessionState> = initialState,
    action?: IAction<any>): IImmutable<ICreateSessionState> => {

    const map: { [key: string]: Function } = {
        [SET_NAME]: setName,
        [SET_DESCRIPTION]: setDescription,
        [CHANGE_MODE]: changeMode
    };

    if (action && map.hasOwnProperty(action.type)) {
        return map[action.type](state, action);
    }

    return state;
};