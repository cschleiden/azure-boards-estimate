export interface IAction<T> {
    type: string;
    payload?: T;
}

export interface IAsyncPayload<TResult, TData> {
    promise: Q.IPromise<TResult>;
    data?: TData;
}

export interface IAsyncAction<TResult, TData> extends IAction<IAsyncPayload<TResult, TData>> {
    meta?: any;
}

export const success = (type: string) => `${type}-success`;
export const failed = (type: string) => `${type}-failed`;
export const pending = (type: string) => `${type}-pending`;

export const makeAsyncAction = <TResult, TData>(action: IAsyncAction<TResult, TData>): () => void => {
    return () => {
        return (dispatch: Function, getState: Function) => {
            dispatch(action);
        };
    };
};
