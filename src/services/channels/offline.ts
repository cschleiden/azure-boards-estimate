import { ISessionEstimates } from "../../model/estimate";
import { EstimationServiceId, IEstimationService } from "../estimation";
import { Services } from "../services";
import { defineOperation, IChannel, IEstimatePayload, ISetWorkItemPayload } from "./channels";

export class OfflineChannel implements IChannel {
    estimate = defineOperation<IEstimatePayload>(async p => {
        this.estimate.incoming(p);
    });

    setWorkItem = defineOperation<ISetWorkItemPayload>(async p => {
        this.setWorkItem.incoming(p);
    });

    start(sessionId: string): Promise<ISessionEstimates> {
        const service = Services.getService<IEstimationService>(EstimationServiceId);
        return service.getEstimates(sessionId);
    }

    end(): Promise<void> {
        return Promise.resolve();
    }
}