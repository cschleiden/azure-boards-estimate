import { getClient } from "azure-devops-extension-api";
import { CoreRestClient } from "azure-devops-extension-api/Core";
import {
    WorkItemBatchGetRequest,
    WorkItemTrackingRestClient
} from "azure-devops-extension-api/WorkItemTracking";
import {
    Page,
    WorkItemTrackingProcessRestClient
} from "azure-devops-extension-api/WorkItemTrackingProcess";
import { IWorkItem } from "../model/workitem";
import { IService } from "./services";
import { IWorkItemType } from "../model/workItemType";
import { WorkRestClient } from "azure-devops-extension-api/Work";

export interface IWorkItemService extends IService {
    getWorkItems(workItemIds: number[]): Promise<IWorkItem[]>;

    getWorkItemTypes(projectId: string): Promise<IWorkItemType[]>;
}

export const WorkItemServiceId = "WorkItemService";

interface IWorkItemTypeInfo {
    icon?: string;
    color?: string;
    descriptionFieldRefName?: string;
}

export class WorkItemService implements IWorkItemService {
    async getWorkItemTypes(projectId: string): Promise<IWorkItemType[]> {
        // Get type fields
        const workClient = getClient(WorkRestClient);
        const processConfig = await workClient.getProcessConfiguration(
            projectId
        );
        const effortField = processConfig.typeFields["Effort"]!;

        const client = getClient(WorkItemTrackingRestClient);
        const workItemTypes = await client.getWorkItemTypes(projectId);
        return workItemTypes.map(wi => {
            let estimationFieldRefName: string | undefined;

            if (
                wi.fields.some(
                    f =>
                        f.referenceName.toLocaleLowerCase() ===
                        effortField.referenceName.toLocaleLowerCase()
                )
            ) {
                // Work item type has effort field, use this
                estimationFieldRefName = effortField.referenceName;
            }

            return {
                name: wi.name,
                estimationFieldRefName
            };
        });
    }

    async getWorkItems(workItemIds: number[]): Promise<IWorkItem[]> {
        if (!workItemIds || workItemIds.length === 0) {
            return [];
        }

        // Get all work items
        const workItemTrackingClient = getClient(WorkItemTrackingRestClient);
        const workItems = await workItemTrackingClient.getWorkItemsBatch({
            ids: workItemIds,
            fields: [
                "System.Id",
                "System.Title",
                "System.WorkItemType",
                "System.TeamProject"
            ],
            $expand: 0 /* None */,
            errorPolicy: 2 /* Omit */
        } as WorkItemBatchGetRequest);

        const mappedWorkItems: IWorkItem[] = workItems.map(wi => {
            return {
                project: wi.fields["System.TeamProject"],
                id: wi.id,
                title: wi.fields["System.Title"],
                workItemType: wi.fields["System.WorkItemType"],
                description: ""
            };
        });

        // The rest of the method is getting the work item type definitions for the work items and then identifying which HTML fields
        // to use for the description. If most of the work items are in a single project this should be fast, if not it could be
        // really really slow.

        // Aggregate all projects
        const projectById = new Map<
            string,
            { workItemTypes: Map<string, IWorkItemTypeInfo> }
        >();
        for (const workItem of mappedWorkItems) {
            if (projectById.has(workItem.project)) {
                const projectEntry = projectById.get(workItem.project)!;
                // We can just override here
                projectEntry.workItemTypes.set(workItem.workItemType, {});
            } else {
                projectById.set(workItem.project, {
                    workItemTypes: new Map<string, IWorkItemTypeInfo>([
                        [workItem.workItemType, {}]
                    ])
                });
            }
        }

        const coreClient = getClient(CoreRestClient);
        const processClient = getClient(WorkItemTrackingProcessRestClient);

        await Promise.all(
            Array.from(projectById.entries()).map(
                async ([projectName, projectInfo]) => {
                    // Get id for project
                    // Unfortunately, the project properties API only accepts projectId and not name, so make this roundtrip here.
                    const project = await coreClient.getProject(projectName);

                    // Get process type id
                    const properties = await coreClient.getProjectProperties(
                        project.id,
                        ["System.ProcessTemplateType"]
                    );
                    const processTypeId = properties[0].value;

                    const workItemTypes = await processClient.getProcessWorkItemTypes(
                        processTypeId
                    );
                    const workItemTypeNameToRefNameMapping: {
                        [name: string]: string;
                    } = {};
                    workItemTypes.forEach(x => {
                        workItemTypeNameToRefNameMapping[x.name] =
                            x.referenceName;
                    });

                    // Get work item type definitions
                    await Promise.all(
                        Array.from(projectInfo.workItemTypes.keys()).map(
                            async workItemTypeName => {
                                const workItemType = await processClient.getProcessWorkItemType(
                                    processTypeId,
                                    workItemTypeNameToRefNameMapping[
                                        workItemTypeName
                                    ],
                                    4 /* GetWorkItemTypeExpand.Layout */
                                );

                                // Look for the first page and get the first HTML control
                                const descriptionFieldRefName = this._getDescription(
                                    workItemType.layout.pages
                                );
                                projectInfo.workItemTypes.set(
                                    workItemTypeName,
                                    {
                                        icon: workItemType.icon,
                                        color: workItemType.color,
                                        descriptionFieldRefName
                                    }
                                );
                            }
                        )
                    );
                }
            )
        );

        // Page in description fields
        const workItemDescriptions = await workItemTrackingClient.getWorkItemsBatch(
            {
                ids: workItemIds,
                fields: Array.prototype.concat.apply(
                    [],
                    Array.from(projectById.values()).map(x =>
                        Array.from(x.workItemTypes.values()).map(
                            x => x.descriptionFieldRefName
                        )
                    )
                ),
                $expand: 0 /* WorkItemExpand.None */,
                errorPolicy: 2 /* WorkItemErrorPolicy.Omit */
            } as WorkItemBatchGetRequest
        );

        const mappedWorkItemsById: { [id: number]: IWorkItem } = {};
        mappedWorkItems.forEach(x => (mappedWorkItemsById[x.id] = x));

        for (const workItemDescription of workItemDescriptions) {
            try {
                const wi = mappedWorkItemsById[workItemDescription.id];
                const workItemTypeInfo = projectById
                    .get(wi.project)!
                    .workItemTypes.get(wi.workItemType)!;
                wi.description =
                    workItemDescription.fields[
                        workItemTypeInfo.descriptionFieldRefName!
                    ];
                wi.icon = workItemTypeInfo.icon;
                wi.color = workItemTypeInfo.color;
            } catch {
                // Ignore!
            }
        }

        // And, we're done.
        return mappedWorkItems;
    }

    private _getDescription(pages: Page[]): string {
        for (const page of pages) {
            for (const section of page.sections) {
                for (const group of section.groups) {
                    for (const control of group.controls) {
                        if (control.controlType === "HtmlFieldControl") {
                            return control.id;
                        }
                    }
                }
            }
        }

        return "System.Description";
    }
}
