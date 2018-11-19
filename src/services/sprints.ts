import { getClient } from "azure-devops-extension-api";
import { WorkRestClient } from "azure-devops-extension-api/Work";
import { IService } from "./services";

export interface ISprintService extends IService {
    getWorkItems(projectId: string, teamId: string, iterationId: string): Promise<number[]>;
}

export const SprintServiceId = "SprintService";

export class MockSprintService implements ISprintService {
    async getWorkItems(projectId: string, teamId: string, iterationId: string): Promise<number[]> {
        return [42, 23, 12];
    }
}

export class SprintService implements ISprintService {
    async getWorkItems(projectId: string, teamId: string, iterationId: string): Promise<number[]> {
        const teamContext = {
            project: "",
            projectId,
            team: "",
            teamId
        };

        // Get ownership for team
        const client = getClient(WorkRestClient);
        const iterationWorkItems = await client.getIterationWorkItems(teamContext, iterationId);

        return iterationWorkItems.workItemRelations.map(x => x.target.id);
    }
}