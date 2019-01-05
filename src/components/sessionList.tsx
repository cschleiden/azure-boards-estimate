import { History } from "history";
import * as React from "react";
import { ISessionDisplay } from "../model/session";
import { SessionCard } from "./sessionCard";
import "./sessionList.scss";

export interface ICardListProps {
    sessions: ISessionDisplay[];
    history: History;
}

export class SessionList extends React.Component<ICardListProps> {
    render(): JSX.Element {
        const { history, sessions } = this.props;

        return (
            <ul className="session-list">
                {sessions.map(session => (
                    <SessionCard
                        key={session.session.id}
                        session={session}
                        history={history}
                    />
                ))}
            </ul>
        );
    }
}
