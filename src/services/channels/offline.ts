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
        const { workItemId } = p;

        // After switching the work item, we need to replay all estimates for the work item
        const estimates = await this.service.getEstimates(this.sessionId);
        if (estimates[workItemId]) {
            for (const estimate of estimates[workItemId]) {
                this.estimate.incoming({
                    sessionId: this.sessionId,
                    estimate
                });
            }
        }
    });

    join = defineOperation<IUserInfo>(async p => {
        // Do nothing for this data provider.
    });

    private sessionId: string;
    private service: IEstimationService;

    async start(sessionId: string): Promise<void> {
        this.sessionId = sessionId;
        this.service = Services.getService<IEstimationService>(EstimationServiceId);
    }

    end(): Promise<void> {
        return Promise.resolve();
    }
}