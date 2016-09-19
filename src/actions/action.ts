export interface IAction<T> {
    type: string;
    payload: T;
}

export interface IAsyncPayload<TResult, TData> {
    promise: Q.IPromise<TResult>;
    data?: TData;
}

export interface IAsyncAction<TResult, TData> {
    types: {
        succcess: string;
        failed?: string;
        pending?: string;
    };
    payload?: IAsyncPayload<TResult, TData>;
    meta?: any;
}

export const makeAsyncAction = <TResult, TData>(action: IAsyncAction<TResult, TData>): () => void => {
    return () => {
        return (dispatch: Function, getState: Function) => {
            dispatch(action);
        };
    };
};
