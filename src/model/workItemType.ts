import { WorkItemIcon } from "azure-devops-extension-api/WorkItemTracking";

export interface IWorkItemType {
    name: string;

    icon?: WorkItemIcon;

    color?: string;

    estimationFieldRefName: string | undefined;
}

export interface IField {
    name: string;

    referenceName: string;
}
