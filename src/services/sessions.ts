import {
    IExtensionDataManager,
    IExtensionDataService
} from "azure-devops-extension-api";
import {
    getAccessToken,
    getExtensionContext,
    getService
} from "azure-devops-extension-sdk";
import { ISession, SessionMode, SessionSource } from "../model/session";
import { IService } from "./services";
import * as DevOps from "azure-devops-extension-sdk";

export interface ISessionService extends IService {
    getSessions(): Promise<ISession[]>;

    getSession(id: string): Promise<ISession | null>;

    saveSession(session: ISession): Promise<ISession>;

    removeSession(id: string): Promise<void>;
}

export const SessionServiceId = "SessionService";

const SessionCollection = "sessions";

export class SessionService implements ISessionService {
    private manager: IExtensionDataManager | undefined;

    constructor() {
        // Prefetch service
        this.getManager();
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
