import { IExtensionDataManager } from "azure-devops-extension-api";
import { IEstimate, ISessionEstimates } from "../model/estimate";
import { IService } from "./services";
import { getStorageManager } from "./storage";

export interface IOfflineEstimationService extends IService {
    estimate(sessionId: string, estimate: IEstimate): Promise<void>;

    getEstimates(sessionId: string): Promise<ISessionEstimates>;
}

export const EstimationServiceId = "EstimationService";

const OfflineEstimationCollection = "offlineSessions";

interface ISessionDocument {
    id: string;
    sessionEstimates: ISessionEstimates;
    __etag?: string;
}

export class OfflineEstimationService implements IOfflineEstimationService {
    private manager: IExtensionDataManager | undefined;

    constructor() {
        // Prefetch manager
        this.getManager();
    }

    async estimate(sessionId: string, estimate: IEstimate): Promise<void> {
        const document = await this.getDocument(sessionId);
        const { sessionEstimates } = document;

        let estimates = sessionEstimates[estimate.workItemId];
        if (!estimates) {
            estimates = sessionEstimates[estimate.workItemId] = [];
        }

        const idx = estimates.findIndex(
            x => x.identity.id === estimate.identity.id
        );
        if (idx !== -1) {
            estimates[idx] = estimate;
        } else {
            estimates.push(estimate);
        }

        const manager = await this.getManager();
        manager.setDocument(OfflineEstimationCollection, {
            ...document,
            sessionEstimates
        });
    }

    async getEstimates(sessionId: string): Promise<ISessionEstimates> {
        const document = await this.getDocument(sessionId);
        return document.sessionEstimates;
    }

    private async getDocument(sessionId: string): Promise<ISessionDocument> {
        const defaultValue: ISessionDocument = {
            id: sessionId,
            sessionEstimates: {}
        };

        const manager = await this.getManager();
        try {
            const document = await manager.getDocument(
                OfflineEstimationCollection,
                sessionId,
                {
                    defaultValue
                }
            );
            return document;
        } catch (e) {
            // Collection does not exist
            return defaultValue;
        }
    }

    private async getManager() {
        if (!this.manager) {
            this.manager = await getStorageManager();
        }

        return this.manager;
    }
}
