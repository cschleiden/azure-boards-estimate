import { IEstimate, ISessionEstimates } from "../model/estimate";
import { IService } from "./services";

export interface IEstimationService extends IService {
    estimate(sessionId: string, estimate: IEstimate): Promise<void>;

    getEstimates(sessionId: string): Promise<ISessionEstimates>;
}

export const EstimationServiceId = "EstimationService";

export class MockEstimationService implements IEstimationService {
    private storage: { [sessionId: string]: ISessionEstimates } = {};

    estimate(sessionId: string, estimate: IEstimate): Promise<void> {
        if (!this.storage[sessionId]) {
            this.storage[sessionId] = {};
        }

        let estimates = this.storage[sessionId][estimate.workItemId];
        if (!estimates) {
            estimates = this.storage[sessionId][estimate.workItemId] = [];
        }

        const idx = estimates.findIndex(x => x.identity.id === estimate.identity.id);
        if (idx !== -1) {
            estimates[idx] = estimate;
        } else {
            estimates.push(estimate);
        }

        return Promise.resolve();
    }

    async getEstimates(sessionId: string): Promise<ISessionEstimates> {
        return this.storage[sessionId] || {};
    }
}