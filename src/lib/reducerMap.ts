import { Action } from "redux";

export default function reducerMap<TState>(
    action: Action<any> | null | undefined,
    state: TState,
    map: { [key: string]: (state: TState, action: Action<any>) => TState }): TState {
    if (action && map.hasOwnProperty(action.type)) {
        return map[action.type](state, action);
    }

    return state;
}