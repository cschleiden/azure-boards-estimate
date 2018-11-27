import { CoreRestClient, TeamContext } from "azure-devops-extension-api/Core";
import { WorkRestClient } from "azure-devops-extension-api/Work";
import { getClient, IProjectPageService } from "azure-devops-extension-api";
import * as DevOps from "azure-devops-extension-sdk";
import { IService } from "./services";

export interface ITeam {
    id: string;
    name: string;
}

export interface IIteration {
    id: string;
    name: string;
}

export interface ITeamService extends IService {
    getAllTeams(projectId: string): Promise<ITeam[]>;

    getIterationsForTeam(teamId: string): Promise<IIteration[]>;
}

export const TeamServiceId = "TeamService";

export class MockTeamService implements ITeamService {
    public async getAllTeams(): Promise<ITeam[]> {
        return [
            {
                id: "1",
                name: "Team Green"
            },
            {
                id: "2",
                name: "Team Blue"
            },
            {
                id: "3",
                name: "Team Red"
            }
        ];
    }

    public async getIterationsForTeam(teamId: string): Promise<IIteration[]> {
        return [
            {
                id: "i1",
                name: "Sprint 136"
            },
            {
                id: "i2",
                name: "Sprint 137"
            }
        ];
    }
}

export class TeamService implements ITeamService {
    public async getAllTeams(projectId: string): Promise<ITeam[]> {
        const client = getClient(CoreRestClient);
        const teams = await client.getTeams(projectId);
        return teams.map(({ id, name }) => ({
            id,
            name
        }));
    }

    public async getIterationsForTeam(teamId: string): Promise<IIteration[]> {
        const projectService: IProjectPageService = await DevOps.getService<
            IProjectPageService
        >("ms.vss-tfs-web.tfs-page-data-service");
        const project = await projectService.getProject();
        if (!project) {
            throw new Error("Project is required");
        }

        const client = getClient(WorkRestClient);
        const teamIterations = await client.getTeamIterations({
            projectId: project.id,
            teamId
        } as TeamContext);

        return teamIterations.map(({ id, name }) => ({
            id,
            name
        }));
    }
}
