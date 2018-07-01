import produce from "immer";
import { Action } from "redux";

export default function reducerMap<TState>(
    action: Action<any> | null | undefined,
    state: TState,
    map: { [key: string]: (state: TState, action: Action<any>) => TState }): TState {
    if (action && map.hasOwnProperty(action.type)) {
        return produce(state, draft => map[action.type](draft, action));
    }

    return state;
}