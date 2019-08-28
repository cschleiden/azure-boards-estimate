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

    /** If set, only the creator of the session can toggle work items or commit values */
    onlyCreatorCanSwitch?: boolean;
    isLegacy?: boolean;
}

export interface ISessionInfo {
    label: string;
    value: string;
}

export interface ISessionDisplay {
    session: ISession;
    sessionInfo: ISessionInfo[];
}

//
// Back-compat
//

export interface ILegacySession {
    /** Unique identifier of session */
    id: string;

    /** Name of session */
    name: string;

    /** Ids of work items to estimate */
    workItemIds: number[];

    /** TfId of person who created this session */
    creatorId: string;

    /** Set of cards to be used */
    setOfCards: string[];

    /** Date and time when this session was started */
    createdAt: Date;

    /** Effort field to use for all work items */
    effortField: {
        refName: string;
        displayName: string;
    };

    /** Id of the team this session belongs to */
    teamId: string;
}
