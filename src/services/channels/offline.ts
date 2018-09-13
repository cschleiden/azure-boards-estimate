import { IUserInfo } from "../../model/user";
import { EstimationServiceId, IEstimationService } from "../estimation";
import { Services } from "../services";
import { defineIncomingOperation, defineOperation, IChannel } from "./channels";
import { IEstimate } from "../../model/estimate";

export class OfflineChannel implements IChannel {
    estimate = defineOperation<IEstimate>(async estimate => {
        // Store estimate
        this.service.estimate(this.sessionId, estimate);
    });

    setWorkItem = defineOperation<number>(async workItemId => {
        // After switching the work item, we need to replay all estimates for the work item
        const estimates = await this.service.getEstimates(this.sessionId);
        if (estimates[workItemId]) {
            for (const estimate of estimates[workItemId]) {
                this.estimate.incoming(estimate);
            }
        }
    });

    join = defineOperation<IUserInfo>(async p => {
        // Do nothing for this data provider.
    });

    left = defineIncomingOperation<string>();

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