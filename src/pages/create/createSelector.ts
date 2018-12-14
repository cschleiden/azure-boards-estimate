import { ICreateSessionState } from "./createReducer";
import { ISession, SessionSource } from "../../model/session";

export function isValid(state: ICreateSessionState): boolean {
    const { session } = state;

    return (
        !!session.name &&
        session.name.trim() !== "" &&
        isSourceValid(session) &&
        !!session.cardSet
    );
}

function isSourceValid(session: ISession): boolean {
    switch (session.source) {
        default:
        case SessionSource.Ids:
            return false;

        case SessionSource.Query: {
            return !!session.sourceData;
        }

        case SessionSource.Sprint: {
            if (typeof session.sourceData !== "string") {
                return false;
            }

            const [team, iteration] = (session.sourceData || "").split(";");
            return !!team && !!iteration;
        }
    }
}
