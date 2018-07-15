import { IEstimate } from "../../model/estimate";

export type IHandler<TPayload> = (payload: TPayload) => void;

export interface IOperation<TPayload> {
    (payload: TPayload): Promise<void>;

    attachHandler(handler: IHandler<TPayload>): void;
}

export interface IInternalOperation<TPayload> extends IOperation<TPayload> {
    incoming(payload: TPayload): void;
}

export function defineOperation<TPayload>(invoke: (payload: TPayload) => Promise<void>): IInternalOperation<TPayload> {
    const handlers: IHandler<TPayload>[] = [];

    const f = (payload: TPayload): Promise<void> => invoke(payload);

    return Object.assign(
        f,
        {
            attachHandler: (handler: IHandler<TPayload>): void => {
                handlers.push(handler);
            },
            incoming: (payload: TPayload) => {
                for (const handler of handlers) {
                    handler(payload);
                }
            }
        }
    )
}

export interface IEstimatePayload {
    sessionId: string;
    estimate: IEstimate;
}

export interface ISetWorkItemPayload {
    sessionId: string;
    workItemId: number;
}

export interface IChannel {
    estimate: IOperation<IEstimatePayload>;

    setWorkItem: IOperation<ISetWorkItemPayload>;

    start(): Promise<void>;
    end(): Promise<void>;
}
