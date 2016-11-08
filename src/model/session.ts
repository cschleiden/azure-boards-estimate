export enum SessionMode {
    Azure,
    Local,
    Offline
}

export interface ISession {
    id: string;

    name: string;
    description: string;

    version: number;

    mode: SessionMode;

    createdAt: Date;
    createdBy: string;
}