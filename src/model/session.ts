export enum SessionMode {
    Azure,
    Offline
}

export interface ISession {
    id: string;
    name: string;

    createdAt: Date;
    createdBy: string;
}