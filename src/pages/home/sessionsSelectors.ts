import { getLookupValue } from "../../lib/lookup";
import {
    ISession,
    ISessionDisplay,
    ISessionInfo,
    SessionSource
} from "../../model/session";
import { ISessionsState } from "./sessionsReducer";

export function getDisplaySessions(
    state: ISessionsState,
    sessions: ISession[]
): ISessionDisplay[] {
    return sessions.map(session => {
        let info: ISessionInfo[] = [];

        switch (session.source) {
            case SessionSource.Sprint: {
                if (session.sourceData) {
                    const [
                        teamId,
                        iterationId
                    ] = (session.sourceData as string).split(";");

                    // Team
                    const team = getLookupValue(state.teamLookup || {}, teamId);
                    info.push({
                        label: "Team",
                        value: (team && team.name) || ""
                    });

                    // Iteration
                    const iteration = getLookupValue(
                        state.iterationLookup || {},
                        iterationId
                    );
                    info.push({
                        label: "Sprint",
                        value: (iteration && iteration.name) || ""
                    });
                }
                break;
            }

            case SessionSource.Query: {
                if (session.sourceData) {
                    const query = getLookupValue(
                        state.queryLookup || {},
                        session.sourceData as string
                    );
                    info.push({
                        label: "Query",
                        value: (query && query.name) || ""
                    });
                }
                break;
            }
        }

        return {
            session,
            sessionInfo: info
        };
    });
}
