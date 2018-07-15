import { defineOperation, IChannel, IEstimatePayload, ISetWorkItemPayload } from "./channels";

export class MockChannel implements IChannel {
    estimate = defineOperation<IEstimatePayload>(p => Promise.resolve());

    setWorkItem = defineOperation<ISetWorkItemPayload>(p => Promise.resolve());

    start(): Promise<void> {
        return Promise.resolve();
    }

    end(): Promise<void> {
        return Promise.resolve();
    }
}