import { getClient } from "azure-devops-extension-api";
import { CoreRestClient } from "azure-devops-extension-api/Core";
import {
    GetWorkItemTypeExpand,
    Page,
    WorkItemTrackingProcessRestClient
} from "azure-devops-extension-api/WorkItemTrackingProcess";
import {
    WorkItemTrackingRestClient,
    WorkItemExpand,
    WorkItemErrorPolicy,
    WorkItemBatchGetRequest
} from "azure-devops-extension-api/WorkItemTracking";
import { IWorkItem } from "../model/workitem";
import { IService } from "./services";

export interface IWorkItemService extends IService {
    getWorkItems(workItemIds: number[]): Promise<IWorkItem[]>;
}

export const WorkItemServiceId = "WorkItemService";

export class MockWorkItemService implements IWorkItemService {
    async getWorkItems(workItemIds: number[]): Promise<IWorkItem[]> {
        return [
            {
                project: "AgileGit",
                id: 42,
                title: "Admin interface",
                description:
                    "Lorem ipsum dolor amet salvia actually microdosing polaroid drinking vinegar aesthetic put a bird on it prism master cleanse craft beer poutine. Cronut celiac church-key fanny pack butcher cloud bread. Portland af hammock cray sartorial PBR&B migas kale chips raclette. Poke schlitz forage leggings authentic yuccie prism. Banjo before they sold out aesthetic cloud bread, chartreuse helvetica YOLO shaman.",
                workItemType: "User Story"
            },
            {
                project: "AgileGit",
                id: 23,
                title: "Chat function",
                description:
                    "Kogi bushwick wayfarers pour-over. Aesthetic ugh godard, celiac shoreditch succulents crucifix portland roof party franzen chambray. Venmo umami polaroid trust fund. Gastropub plaid biodiesel, blue bottle vice craft beer umami messenger bag ramps microdosing tumeric waistcoat. Tbh 90's succulents affogato cold-pressed banh mi. Hexagon tbh polaroid authentic master cleanse kickstarter lo-fi selvage craft beer drinking vinegar 8-bit. Pickled schlitz bitters typewriter dreamcatcher quinoa.",
                workItemType: "Bug"
            },
            {
                project: "AgileGit",
                id: 12,
                title: "Integration tests",
                description:
                    "Copper mug heirloom health goth, gluten-free meditation live-edge tumblr wolf woke. Salvia truffaut gluten-free pabst brunch quinoa taxidermy, trust fund DIY tbh air plant vice master cleanse. Aesthetic pitchfork photo booth coloring book succulents pop-up. Af roof party bespoke occupy, wayfarers coloring book live-edge beard poke schlitz hella letterpress bitters skateboard tumblr. Air plant kale chips venmo, deep v butcher kogi microdosing everyday carry irony crucifix drinking vinegar cred VHS. Cloud bread vape raw denim hashtag disrupt, hexagon viral.",
                workItemType: "User Story"
            }
        ];
    }
}

export class WorkItemService implements IWorkItemService {
    async getWorkItems(workItemIds: number[]): Promise<IWorkItem[]> {
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
            $expand: WorkItemExpand.None,
            errorPolicy: WorkItemErrorPolicy.Omit
        } as WorkItemBatchGetRequest);

        const mappedWorkItems = workItems.map(wi => {
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
        const foo = new Map<string, { workItemTypes: Map<string, string> }>();
        for (const workItem of mappedWorkItems) {
            if (foo.has(workItem.project)) {
                const projectEntry = foo.get(workItem.project)!;
                // We can just override here
                projectEntry.workItemTypes.set(workItem.workItemType, "");
            } else {
                foo.set(workItem.project, {
                    workItemTypes: new Map<string, string>([
                        [workItem.workItemType, ""]
                    ])
                });
            }
        }

        const coreClient = getClient(CoreRestClient);
        const processClient = getClient(WorkItemTrackingProcessRestClient);

        await Promise.all(
            Array.from(foo.entries()).map(
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

                    // Get work item type definitions
                    await Promise.all(
                        Array.from(projectInfo.workItemTypes.keys()).map(
                            async workItemTypeName => {
                                const workItemType = await processClient.getProcessWorkItemType(
                                    processTypeId,
                                    workItemTypeName,
                                    GetWorkItemTypeExpand.Layout
                                );

                                // Look for the first page and get the first HTML control
                                const descriptionRefName = this._getDescription(
                                    workItemType.layout.pages
                                );
                                projectInfo.workItemTypes.set(
                                    workItemTypeName,
                                    descriptionRefName
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
                    null,
                    Array.from(foo.values()).map(x =>
                        Array.from(x.workItemTypes.values())
                    )
                ),
                $expand: WorkItemExpand.None,
                errorPolicy: WorkItemErrorPolicy.Omit
            } as WorkItemBatchGetRequest
        );

        const mappedWorkItemsById: { [id: number]: IWorkItem } = {};
        mappedWorkItems.forEach(x => (mappedWorkItemsById[x.id] = x));

        for (const workItemDescription of workItemDescriptions) {
            try {
                const wi = mappedWorkItemsById[workItemDescription.id];
                const descriptionRefName = foo
                    .get(wi.project)!
                    .workItemTypes.get(wi.workItemType)!;
                wi.description = workItemDescription.fields[descriptionRefName];
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
