import { ISession } from "../model/session";

export interface ICommunicationService {
    start(session: ISession): Promise<void>;
}
