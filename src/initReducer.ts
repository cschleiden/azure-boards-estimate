import { Action } from "typescript-fsa";
import * as Actions from "./initActions";
import reducerMap, { reducerAction } from "./lib/reducerMap";
import { IIdentity } from "./model/identity";

const initialState = {
    currentIdentity: null as IIdentity | null
};

export type IInitState = typeof initialState;

const init = reducerAction(Actions.init, (state: IInitState, payload) => {
    state.currentIdentity = payload.identity;
});

export default <TPayload>(
    state: IInitState = initialState,
    action?: Action<TPayload>
) => {
    return reducerMap(action, state, {
        [Actions.init.type]: init
    });
};
