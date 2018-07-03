import { IEstimate } from "../../model/session";

export interface IChannel {
    start(): Promise<void>;

    end(): Promise<void>;

    estimate(sessionId: string, estimate: IEstimate): Promise<void>;

    attachEstimateHandler(handler: (sessionId: string, estimate: IEstimate) => void): void;
}