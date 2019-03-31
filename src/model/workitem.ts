export interface IWorkItem {
    project: string;
    id: number;
    title: string;
    description: string;
    workItemType: string;
    estimate?: string | number;

    icon?: string;
    color?: string;
}
