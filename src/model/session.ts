export enum SessionMode {
    Azure,
    Local,
    Offline
}

export enum SessionSource {
    Sprint,
    Query,
    Ids
}

export interface ISession {
    id: string;

    name: string;

    version: number;

    mode: SessionMode;

    source: SessionSource;
    sourceData?: string | number[];

    createdAt: Date;
    createdBy: string;
}