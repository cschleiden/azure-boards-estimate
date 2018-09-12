import { ISession, SessionMode, SessionSource } from "../model/session";
import { IService } from "./services";

export interface ISessionService extends IService {
    getSessions(): Promise<ISession[]>;

    getSession(id: string): Promise<ISession | null>;

    saveSession(session: ISession): Promise<ISession>;
}

export const SessionServiceId = "SessionService";

export class MockSessionService implements ISessionService {
    private sessions: ISession[];

    constructor() {
        const savedData = localStorage.getItem("sessions");
        if (savedData) {
            this.sessions = JSON.parse(savedData);
        } else {
            this.sessions = [
                {
                    id: "123",
                    createdAt: new Date(),
                    createdBy: "Christopher Schleiden",
                    mode: SessionMode.Online,
                    name: "Sprint 132",
                    source: SessionSource.Sprint,
                    sourceData: "123",
                    cardSet: "default",
                    version: 1
                },
                {
                    id: "456",
                    createdAt: new Date(),
                    createdBy: "Christopher Schleiden",
                    mode: SessionMode.Offline,
                    name: "Distributed Team",
                    source: SessionSource.Ids,
                    sourceData: "123",
                    cardSet: "tshirts",
                    version: 1
                }
            ];
        }
    }

    async getSessions(): Promise<ISession[]> {
        return this.sessions.slice(0).concat();
    }

    async getSession(id: string): Promise<ISession | null> {
        const result = this.sessions.filter(s => s.id === id);
        return result && result.length > 0 && result[0] || null;
    }

    async saveSession(session: ISession): Promise<ISession> {
        const savedSession = { ...session, id: Math.random().toString(36).substr(2, 5) };
        this.sessions.push(savedSession);

        localStorage.setItem("sessions", JSON.stringify(this.sessions));

        return savedSession;
    }
}