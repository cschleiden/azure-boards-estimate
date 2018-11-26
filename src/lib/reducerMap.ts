import produce, { Draft } from "immer";
import { Action, ActionCreator } from "typescript-fsa";

export default function reducerMap<TState>(
    action: Action<any> | null | undefined,
    state: TState,
    map: { [key: string]: (state: TState, payload: any) => TState }
): TState {
    if (action && map.hasOwnProperty(action.type)) {
        return map[action.type](state, action.payload);
    }

    return state;
}

export function reducerAction<TState, TPayload>(
    action: ActionCreator<TPayload>,
    handler: (state: Draft<TState>, payload: TPayload) => void
): (state: TState, payload: TPayload) => TState {
    return (state: TState, payload: TPayload): TState => {
        return produce(state, draft => handler(draft, payload));
    };
}
