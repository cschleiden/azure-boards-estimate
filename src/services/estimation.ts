import { IEstimate } from "../model/estimate";
import { IService } from "./services";

export interface IEstimationService extends IService {
    estimate(sessionId: string, estimate: IEstimate): Promise<void>;
}