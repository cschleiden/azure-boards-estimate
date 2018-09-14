import { IUserInfo } from "../../model/user";
import { EstimationServiceId, IEstimationService } from "../estimation";
import { Services } from "../services";
import { defineIncomingOperation, defineOperation, IChannel } from "./channels";
import { IEstimate } from "../../model/estimate";

export class OfflineChannel implements IChannel {
    estimate = defineOperation<IEstimate>(async estimate => {
        // Store estimate
        await this.estimationService.estimate(this.sessionId, estimate);

        // Replay
        await this.estimate.incoming(estimate);
    });

    setWorkItem = defineOperation<number>(async workItemId => {
        await this.setWorkItem.incoming(workItemId);

        // After switching the work item, we need to replay all estimates for the work item
        const estimates = await this.estimationService.getEstimates(this.sessionId);
        if (estimates[workItemId]) {
            for (const estimate of estimates[workItemId]) {
                await this.estimate.incoming(estimate);
            }
        }
    });

    revealed = defineOperation<void>(async () => {
        await this.revealed.incoming(undefined);
    });

    join = defineOperation<IUserInfo>(async p => {
        // Do nothing for this channel.
    });

    left = defineIncomingOperation<string>();

    private sessionId: string;
    private estimationService: IEstimationService;

    async start(sessionId: string): Promise<void> {
        this.sessionId = sessionId;
        this.estimationService = Services.getService<IEstimationService>(EstimationServiceId);
    }

    end(): Promise<void> {
        return Promise.resolve();
    }
}