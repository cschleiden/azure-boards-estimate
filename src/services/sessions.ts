import { IExtensionDataManager } from "azure-devops-extension-api";
import { defaultCardSets } from "../model/cards";
import {
    ILegacySession,
    ISession,
    SessionMode,
    SessionSource
} from "../model/session";
import { IService } from "./services";
import { getStorageManager } from "./storage";

export interface ISessionService extends IService {
    getSessions(): Promise<ISession[]>;

    getLegacySession(): Promise<ISession[]>;

    getSession(id: string): Promise<ISession | null>;

    saveSession(session: ISession): Promise<ISession>;

    removeSession(id: string): Promise<void>;

    getSettingsValue<T>(projectId: string, id: string): Promise<T>;

    setSettingsValue<T>(projectId: string, id: string, value: T): Promise<void>;
}

export const SessionServiceId = "SessionService";

const SessionCollection = "sessions";

/**
 * Storage key for the field configuration
 */
export const FieldConfiguration = "field-configuration";

export class SessionService implements ISessionService {
    private manager: IExtensionDataManager | undefined;

    constructor() {
        // Prefetch service
        this.getManager();
    }

    async getSettingsValue<T>(projectId: string, id: string): Promise<T> {
        const manager = await this.getManager();

        return manager.getValue<T>(`${projectId}-${id}`);
    }

    async setSettingsValue<T>(
        projectId: string,
        id: string,
        value: T
    ): Promise<void> {
        const manager = await this.getManager();

        await manager.setValue(`${projectId}-${id}`, value);
    }

    async getSessions(): Promise<ISession[]> {
        const manager = await this.getManager();

        try {
            const sessions: ISession[] = await manager.getDocuments(
                SessionCollection,
                {
                    defaultValue: []
                }
            );

            return sessions;
        } catch {
            return [];
        }
    }

    async getLegacySession(): Promise<ISession[]> {
        const manager = await this.getManager();

        try {
            const legacySession: ILegacySession[] = await manager.getDocuments(
                "EstimationSessions"
            );

            return legacySession.map<ISession>(ls => ({
                id: ls.id,
                name: `Migrated: '${ls.name}'`,
                mode: SessionMode.Online,
                source: SessionSource.Ids,
                sourceData: ls.workItemIds,
                version: 1,
                createdAt: ls.createdAt,
                createdBy: ls.creatorId,
                cardSet: defaultCardSets[0].id // TODO!
            }));

            // Map
        } catch {
            return [];
        }
    }

    async getSession(id: string): Promise<ISession | null> {
        const manager = await this.getManager();

        try {
            const session: ISession | null = await manager.getDocument(
                SessionCollection,
                id,
                {
                    defaultValue: null
                }
            );

            return session;
        } catch {
            return null;
        }
    }

    async saveSession(session: ISession): Promise<ISession> {
        const manager = await this.getManager();
        await manager.setDocument(SessionCollection, session);
        return session;
    }

    async removeSession(id: string): Promise<void> {
        const manager = await this.getManager();

        try {
            await manager.deleteDocument(SessionCollection, id);
        } catch {
            // Ignore
        }
    }

    private async getManager(): Promise<IExtensionDataManager> {
        if (!this.manager) {
            this.manager = await getStorageManager();
        }

        return this.manager;
    }
}
