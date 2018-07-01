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
    getAllTeams(): Promise<ITeam[]>;

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