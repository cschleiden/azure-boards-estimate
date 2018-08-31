import { IEstimate } from "../../model/estimate";
import { IUserInfo } from "../../model/user";

export type IHandler<TPayload> = (payload: TPayload) => void;

export interface IOperation<TPayload> {
    (payload: TPayload): Promise<void>;

    attachHandler(handler: IHandler<TPayload>): void;
}

export interface IInternalOperation<TPayload> extends IOperation<TPayload> {
    incoming(payload: TPayload): void;
}

export function defineOperation<TPayload>(
    invoke: (payload: TPayload) => Promise<void>): IInternalOperation<TPayload> {
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
    /** 
     * Receive an estimate from another client, or
     * send an estimate to the other clients.
     */
    estimate: IOperation<IEstimatePayload>;

    /**
     * Receive the new current work item from another client, or
     * send the current work item to the other clients.
     */
    setWorkItem: IOperation<ISetWorkItemPayload>;

    join: IOperation<IUserInfo>;

    /**
     * Start a connection for the given session
     * 
     * @param sessionId Id of the session
     */
    start(sessionId: string): Promise<void>;

    /**
     * End the connection
     */
    end(): Promise<void>;
}
