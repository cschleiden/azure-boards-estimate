import { IService } from "./services";

export interface ISprintService extends IService {
    getWorkItems(teamId: string, iterationId: string): Promise<number[]>;
}

export const SprintServiceId = "SprintService";

export class MockSprintService implements ISprintService {
    async getWorkItems(teamId: string, iterationId: string): Promise<number[]> {
        return [42, 23, 12];
    }
}

export class SprintService implements ISprintService {
    async getWorkItems(teamId: string, iterationId: string): Promise<number[]> {
        
    }
}