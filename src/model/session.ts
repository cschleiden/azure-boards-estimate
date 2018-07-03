export enum SessionSource {
    Sprint,
    Query,
    Ids
}

export interface IEstimate {
    userId: string;

    workItemId: number;

    estimate: string;
}

export interface ISession {
    id: string;

    name: string;

    version: number;

    source: SessionSource;
    sourceData?: string | number[];

    createdAt: Date;
    createdBy: string;
}