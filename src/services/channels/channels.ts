import { IEstimate } from "../../model/estimate";
import { IUserInfo } from "../../model/user";

export type IHandler<TPayload> = (payload: TPayload) => void;

export interface IIncoming<TPayload> {
    attachHandler(handler: IHandler<TPayload>): void;
}

export interface IInternalIncoming<TPayload> extends IIncoming<TPayload> {
    incoming(payload: TPayload): void;
}

export type IOutgoing<TPayload> = (payload: TPayload) => Promise<void>;

export type IBiDirectional<TPayload> = IIncoming<TPayload> &
    IOutgoing<TPayload>;

export function defineIncomingOperation<TPayload>(): IInternalIncoming<
    TPayload
> {
    const handlers: IHandler<TPayload>[] = [];

    return {
        attachHandler: (handler: IHandler<TPayload>): void => {
            handlers.push(handler);
        },
        incoming: (payload: TPayload) => {
            for (const handler of handlers) {
                handler(payload);
            }
        }
    };
}

export function defineOperation<TPayload>(
    invoke: (payload: TPayload) => Promise<void>
): IInternalIncoming<TPayload> & IOutgoing<TPayload> {
    const handlers: IHandler<TPayload>[] = [];

    const f = (payload: TPayload): Promise<void> => invoke(payload);

    return Object.assign(f, {
        attachHandler: (handler: IHandler<TPayload>): void => {
            handlers.push(handler);
        },
        incoming: (payload: TPayload) => {
            for (const handler of handlers) {
                handler(payload);
            }
        }
    });
}

export interface IChannel {
    /**
     * Receive an estimate from another client, or
     * send an estimate to the other clients.
     */
    estimate: IBiDirectional<IEstimate>;

    /**
     * Receive the new current work item from another client, or
     * send the current work item to the other clients.
     */
    setWorkItem: IBiDirectional<number>;

    /**
     * Reveal all votes
     */
    revealed: IBiDirectional<void>;

    join: IBiDirectional<IUserInfo>;

    left: IIncoming<string>;

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
