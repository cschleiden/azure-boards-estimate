import { IUserInfo } from "../../model/user";
import { EstimationServiceId, IEstimationService } from "../estimation";
import { Services } from "../services";
import { defineOperation, IChannel, IEstimatePayload, ISetWorkItemPayload } from "./channels";

export class OfflineChannel implements IChannel {
    estimate = defineOperation<IEstimatePayload>(async p => {
        this.estimate.incoming(p);
    });

    setWorkItem = defineOperation<ISetWorkItemPayload>(async p => {
    });

    join = defineOperation<IUserInfo>(async p => {
        // Do nothing for this data provider.
    });

    private sessionId: string;

    async start(sessionId: string): Promise<void> {
        this.sessionId = sessionId;

        const service = Services.getService<IEstimationService>(EstimationServiceId);
        const estimates = await service.getEstimates(this.sessionId);

        // Fire estimate events for each work item
        const workItemIds = Object.keys(estimates).map(x => Number(x));
        for (const workItemId of workItemIds) {
            const estimatesForWorkItem = estimates[workItemId];

            for (const estimate of estimatesForWorkItem) {
                this.estimate.incoming({
                    sessionId: this.sessionId,
                    estimate
                });
            }
        }
    }

    end(): Promise<void> {
        return Promise.resolve();
    }
}