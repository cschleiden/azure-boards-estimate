import { Action } from "typescript-fsa";
import reducerMap, { reducerAction } from "../../lib/reducerMap";
import { ISession } from "../../model/session";
import * as Actions from "./sessionsActions";

export const initialState = {
    sessions: [] as ISession[],
    filteredSessions: null as ISession[] | null,

    loading: false
};

export type ISessionsState = typeof initialState;

const populate = reducerAction(
    Actions.populate,
    (state: ISessionsState, payload) => {
        state.sessions = payload;
    }
);

const filter = reducerAction(Actions.filter, (state: ISessionsState, query) => {
    if (!query) {
        state.filteredSessions = null;
    } else {
        state.filteredSessions = state.sessions.filter(
            x =>
                x.name
                    .toLocaleLowerCase()
                    .indexOf(query.toLocaleLowerCase()) !== -1
        );
    }
});

export default <TPayload>(
    state: ISessionsState = initialState,
    action?: Action<TPayload>
) => {
    return reducerMap(action, state, {
        [Actions.populate.type]: populate,
        [Actions.filter.type]: filter
    });
};
