import { IUserInfo } from "../../model/user";
import { EstimationServiceId, IEstimationService } from "../estimation";
import { Services } from "../services";
import { defineOperation, IChannel, IEstimatePayload, ISetWorkItemPayload } from "./channels";

export class OfflineChannel implements IChannel {
    estimate = defineOperation<IEstimatePayload>(async p => {
        // Store estimate
        this.service.estimate(this.sessionId, p.estimate);
    });

    setWorkItem = defineOperation<ISetWorkItemPayload>(async p => {
        // Ignore
    });

    join = defineOperation<IUserInfo>(async p => {
        // Do nothing for this data provider.
    });

    private sessionId: string;
    private service: IEstimationService;

    async start(sessionId: string): Promise<void> {
        this.sessionId = sessionId;

        this.service = Services.getService<IEstimationService>(EstimationServiceId);
        const estimates = await this.service.getEstimates(this.sessionId);

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