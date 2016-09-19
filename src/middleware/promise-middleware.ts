import * as Q from "q";
import objectAssign = require("object-assign");

import { IAsyncAction, IAsyncPayload } from "../actions/action";

export default function promiseMiddleware({ dispatch }) {
    return next => <TResult, TData>(action: IAsyncAction<TResult, TData>) => {
        if (!action || !action.payload || !Q.isPromise(action.payload.promise)) {
            return next(action);
        }

        const { types, payload, meta } = action;
        const { promise, data } = payload;

        /**
         * Dispatch the pending action
         */
        if (types.pending) {
            dispatch(objectAssign({},
                { type: types.pending },
                data ? { payload: data } : {},
                meta ? { meta } : {}
            ));
        }

        /**
         * If successful, dispatch the fulfilled action, otherwise dispatch
         * rejected action.
         */
        return promise.then(
            result => {
                dispatch({
                    type: types.succcess,
                    payload: result,
                    meta,
                });
            },
            error => {
                if (types.failed) {
                    dispatch({
                        type: types.failed,
                        payload: error,
                        meta,
                    });
                }
            }
        );
    };
}