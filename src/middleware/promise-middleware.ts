import objectAssign = require("object-assign");
import Q = require("q");

import { IAsyncAction, IAsyncPayload, success, pending, failed } from "../actions/action";

export default function promiseMiddleware({ dispatch }) {
    return next => <TResult, TData>(action: IAsyncAction<TResult, TData>) => {
        if (!action || !action.payload || !Q.isPromise(action.payload.promise)) {
            return next(action);
        }

        const { type, payload, meta } = action;
        const { promise, data } = payload;

        /**
         * Dispatch the pending action
         */
        dispatch(objectAssign({},
            { type: pending(type) },
            data ? { payload: data } : {},
            meta ? { meta } : {}
        ));

        /**
         * If successful, dispatch the fulfilled action, otherwise dispatch
         * rejected action.
         */
        return promise.then(
            result => {
                dispatch({
                    type: success(type),
                    payload: result,
                    meta,
                });
            },
            error => {
                dispatch({
                    type: failed(type),
                    payload: error,
                    meta,
                });
            }
        );
    };
}