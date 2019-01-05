import { getClient } from "azure-devops-extension-api";
import { IService } from "./services";
import {
    WorkItemTrackingRestClient,
    QueryErrorPolicy,
    QueryExpand
} from "azure-devops-extension-api/WorkItemTracking";
import { IQuery } from "../model/query";

export interface IQueriesService extends IService {
    getQueries(projectId: string, queryIds: string[]): Promise<IQuery[]>;

    runQuery(projectId: string, queryId: string): Promise<number[]>;
}

export const QueriesServiceId = "QueriesService";

export class QueriesService implements IQueriesService {
    async getQueries(projectId: string, queryIds: string[]): Promise<IQuery[]> {
        const client = getClient(WorkItemTrackingRestClient);
        const queries = await client.getQueriesBatch(
            {
                ids: queryIds,
                errorPolicy: QueryErrorPolicy.Omit,
                $expand: QueryExpand.Minimal
            },
            projectId
        );

        return queries.map(q => ({
            id: q.id,
            name: q.name
        }));
    }

    async runQuery(projectId: string, queryId: string): Promise<number[]> {
        const client = getClient(WorkItemTrackingRestClient);
        const result = await client.queryById(queryId, projectId);

        if (result.workItems) {
            return result.workItems.map(x => x.id);
        } else if (result.workItemRelations) {
            return result.workItemRelations.map(x => x.target.id);
        }

        return [];
    }
}
