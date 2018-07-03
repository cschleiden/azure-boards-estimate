import { ISession, SessionSource } from "../model/session";
import { IService } from "./services";

export interface ISessionService extends IService {
    getSessions(): Promise<ISession[]>;

    saveSession(session: ISession): Promise<ISession>;
}

export const SessionServiceId = "SessionService";

export class MockSessionService implements ISessionService {
    private sessions: ISession[] = [
        {
            id: "123",
            createdAt: new Date(),
            createdBy: "Christopher Schleiden",
            name: "Sprint 132",
            source: SessionSource.Sprint,
            sourceData: "123",
            version: 1
        },
        {
            id: "456",
            createdAt: new Date(),
            createdBy: "Christopher Schleiden",
            name: "Distributed Team",
            source: SessionSource.Sprint,
            sourceData: "123",
            version: 1
        }
    ];

    async getSessions(): Promise<ISession[]> {
        return this.sessions;
    }

    async saveSession(session: ISession): Promise<ISession> {
        const savedSession = { ...session, id: Math.random().toString(36).substr(2, 5) };
        this.sessions.push(savedSession);
        return savedSession;
    }
}