import { Action } from "typescript-fsa";
import reducerMap, { reducerAction } from "../../lib/reducerMap";
import * as Actions from "./settingsActions";
import { IWorkItemType, IField } from "../../model/workItemType";

export const initialState = {
    workItemTypes: [] as IWorkItemType[],
    fields: null as IField[] | null,
    loading: true
};

export type ISettingsState = typeof initialState;

export default <TPayload>(
    state: ISettingsState = initialState,
    action?: Action<TPayload>
) => {
    return reducerMap(action, state, {
        [Actions.loaded.type]: reducerAction(
            Actions.loaded,
            (state, payload) => {
                state.workItemTypes = payload.workItemTypes;
                state.fields = payload.fields;
                state.loading = false;
            }
        ),
        [Actions.setField.type]: reducerAction(
            Actions.setField,
            (state, payload) => {
                const workItemType = state.workItemTypes.find(
                    x => x.name === payload.name
                );
                if (workItemType) {
                    workItemType.estimationFieldRefName =
                        payload.estimationFieldRefName;
                }
            }
        ),
        [Actions.close.type]: reducerAction(Actions.close, state => {
            return initialState;
        })
    });
};
