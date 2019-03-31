import { getClient } from "azure-devops-extension-api";
import { CoreRestClient } from "azure-devops-extension-api/Core";
import { WorkRestClient } from "azure-devops-extension-api/Work";
import {
    WorkItemBatchGetRequest,
    WorkItemTrackingRestClient
} from "azure-devops-extension-api/WorkItemTracking";
import {
    Page,
    WorkItemTrackingProcessRestClient
} from "azure-devops-extension-api/WorkItemTrackingProcess";
import { IWorkItem } from "../model/workitem";
import { IField, IWorkItemType } from "../model/workItemType";
import { IService, Services } from "./services";
import {
    SessionServiceId,
    ISessionService,
    FieldConfiguration
} from "./sessions";

export interface IWorkItemService extends IService {
    getWorkItems(workItemIds: number[]): Promise<IWorkItem[]>;

    getWorkItemTypes(projectId: string): Promise<IWorkItemType[]>;

    getFields(projectId: string): Promise<IField[]>;

    saveEstimate(
        workItemId: number,
        estimationFieldRefName: string,
        estimate?: number | string
    ): Promise<void>;
}

export const WorkItemServiceId = "WorkItemService";

interface IWorkItemTypeInfo {
    icon?: string;
    color?: string;
    descriptionFieldRefName?: string;
    estimationFieldRefName?: string;
}

export class WorkItemService implements IWorkItemService {
    async getFields(projectId: string): Promise<IField[]> {
        const client = getClient(WorkItemTrackingRestClient);
        const fields = await client.getFields(projectId);

        const mappedFields: IField[] = fields.map(f => ({
            name: f.name,
            referenceName: f.referenceName
        }));
        mappedFields.sort((a, b) => a.name.localeCompare(b.name));

        return mappedFields;
    }

    async getWorkItemTypes(projectId: string): Promise<IWorkItemType[]> {
        // Get type fields
        const workClient = getClient(WorkRestClient);
        const processConfig = await workClient.getProcessConfiguration(
            projectId
        );
        const effortField = processConfig.typeFields["Effort"]!;

        const client = getClient(WorkItemTrackingRestClient);
        const workItemTypes = await client.getWorkItemTypes(projectId);

        // Merge with config
        const sessionService = Services.getService<ISessionService>(
            SessionServiceId
        );
        const configuration = await sessionService.getSettingsValue<{
            [name: string]: IWorkItemType;
        }>(projectId, FieldConfiguration);

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

            // Check for overrides from configuration
            if (configuration && configuration[wi.name]) {
                estimationFieldRefName =
                    configuration[wi.name].estimationFieldRefName;
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
        // really really slow, but this should not be the mainline scenario.

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

                    // Get work item types and their configuration
                    const currentProjectWorkItemTypes = await this.getWorkItemTypes(
                        project.id
                    );

                    const witEstimationFieldRefNameMapping: {
                        [workItemTypeName: string]: string | undefined;
                    } = {};
                    currentProjectWorkItemTypes.forEach(workItemType => {
                        witEstimationFieldRefNameMapping[workItemType.name] =
                            workItemType.estimationFieldRefName;
                    });

                    // Get process type id
                    const properties = await coreClient.getProjectProperties(
                        project.id,
                        ["System.ProcessTemplateType"]
                    );
                    const processTypeId = properties[0].value;

                    const workItemTypes = await processClient.getProcessWorkItemTypes(
                        processTypeId
                    );

                    // Map of friendly work item name (e.g. Bug) to reference name inherited customization
                    const witNameToRefNameMapping: {
                        [name: string]: string;
                    } = {};
                    workItemTypes.forEach(x => {
                        witNameToRefNameMapping[x.name] = x.referenceName;
                    });

                    // Get work item type definitions
                    await Promise.all(
                        Array.from(projectInfo.workItemTypes.keys()).map(
                            async workItemTypeName => {
                                const workItemType = await processClient.getProcessWorkItemType(
                                    processTypeId,
                                    witNameToRefNameMapping[workItemTypeName],
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
                                        descriptionFieldRefName,
                                        estimationFieldRefName:
                                            witEstimationFieldRefNameMapping[
                                                workItemType.name
                                            ]
                                    }
                                );
                            }
                        )
                    );
                }
            )
        );

        // Page in description & estimation fields
        const fields = new Set<string>();
        for (const project of projectById.values()) {
            for (const wit of project.workItemTypes.values()) {
                if (wit.descriptionFieldRefName) {
                    fields.add(wit.descriptionFieldRefName);
                }

                if (wit.estimationFieldRefName) {
                    fields.add(wit.estimationFieldRefName);
                }
            }
        }

        // Get work item data
        const workItemsFieldData = await workItemTrackingClient.getWorkItemsBatch(
            {
                ids: workItemIds,
                fields: Array.from(fields.values()),
                $expand: 0 /* WorkItemExpand.None */,
                errorPolicy: 2 /* WorkItemErrorPolicy.Omit */
            } as WorkItemBatchGetRequest
        );

        const mappedWorkItemsById: { [id: number]: IWorkItem } = {};
        mappedWorkItems.forEach(x => (mappedWorkItemsById[x.id] = x));

        for (const workItemFieldData of workItemsFieldData) {
            try {
                const workItem = mappedWorkItemsById[workItemFieldData.id];
                const workItemTypeInfo = projectById
                    .get(workItem.project)!
                    .workItemTypes.get(workItem.workItemType)!;

                if (workItemTypeInfo.descriptionFieldRefName) {
                    workItem.description =
                        workItemFieldData.fields[
                            workItemTypeInfo.descriptionFieldRefName
                        ];
                }

                if (workItemTypeInfo.estimationFieldRefName) {
                    workItem.estimate =
                        workItemFieldData.fields[
                            workItemTypeInfo.estimationFieldRefName
                        ];
                    workItem.estimationFieldRefName =
                        workItemTypeInfo.estimationFieldRefName;
                }
                workItem.icon = workItemTypeInfo.icon;
                workItem.color = workItemTypeInfo.color;
            } catch {
                // Ignore!
            }
        }

        // And, we're done.
        return mappedWorkItems;
    }

    async saveEstimate(
        workItemId: number,
        estimationFieldRefName: string,
        estimate?: string | number | undefined
    ): Promise<void> {
        const client = getClient(WorkItemTrackingRestClient);

        await client.updateWorkItem(
            [
                {
                    op: "add",
                    path: `/fields/${estimationFieldRefName}`,
                    value: estimate
                }
            ],
            workItemId
        );
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
