export enum SessionMode {
    Online,
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

    mode: SessionMode;

    version: number;

    source: SessionSource;
    sourceData?: string | number[];

    createdAt: Date;
    createdBy: string;

    cardSet: string;
}

export interface ISessionInfo {
    label: string;
    value: string;
}

export interface ISessionDisplay {
    session: ISession;
    sessionInfo: ISessionInfo[];
}
