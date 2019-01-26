import {
    IExtensionDataManager,
    IExtensionDataService
} from "azure-devops-extension-api";
import * as DevOps from "azure-devops-extension-sdk";
import {
    getAccessToken,
    getExtensionContext,
    getService
} from "azure-devops-extension-sdk";
import { ISession } from "../model/session";
import { IService } from "./services";

export interface ISessionService extends IService {
    getSessions(): Promise<ISession[]>;

    getSession(id: string): Promise<ISession | null>;

    saveSession(session: ISession): Promise<ISession>;

    removeSession(id: string): Promise<void>;

    getSettingsValue<T>(projectId: string, id: string): Promise<T>;

    setSettingsValue<T>(projectId: string, id: string, value: T): Promise<void>;
}

export const SessionServiceId = "SessionService";

const SessionCollection = "sessions";

export class SessionService implements ISessionService {
    private manager: IExtensionDataManager | undefined;

    constructor() {
        // Prefetch service
        this.getManager();
    }

    async getSettingsValue<T>(projectId: string, id: string): Promise<T> {
        const manager = await this.getManager();

        return manager.getValue<T>(`${projectId}/${id}`);
    }

    async setSettingsValue<T>(
        projectId: string,
        id: string,
        value: T
    ): Promise<void> {
        const manager = await this.getManager();

        await manager.setValue(`${projectId}/${id}`, value);
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
            await DevOps.ready();
            const context = getExtensionContext();
            const extensionDataService = await getService<
                IExtensionDataService
            >("ms.vss-features.extension-data-service");
            const accessToken = await getAccessToken();
            this.manager = await extensionDataService.getExtensionDataManager(
                context.id,
                accessToken
            );
        }

        return this.manager;
    }
}
