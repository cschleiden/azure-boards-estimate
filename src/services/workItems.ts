import { IWorkItem } from "../model/IWorkItem";
import { IService } from "./services";

export interface IWorkItemService extends IService {
    getWorkItems(workItemIds: number[]): Promise<IWorkItem[]>;
}

export const WorkItemServiceId = "WorkItemService";

export class MockWorkItemService implements IWorkItemService {
    async getWorkItems(workItemIds: number[]): Promise<IWorkItem[]> {
        return [
            {
                id: 42,
                title: "As a user I'd like to",
                workItemType: "User Story"
            },
            {
                id: 23,
                title: "As a user I'd like to",
                workItemType: "User Story"
            },
            {
                id: 12,
                title: "As a user I'd like to",
                workItemType: "User Story"
            }
        ];
    }
}