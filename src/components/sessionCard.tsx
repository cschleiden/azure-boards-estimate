import { History } from "history";
import * as React from "react";
import { makeUrlSafe } from "../lib/urlSafe";
import { ISession } from "../model/session";
import { CardIcon } from "./cardIcon";
import "./sessionCard.scss";
import { Button } from "azure-devops-ui/Button";

const CardTitle: React.StatelessComponent = props => (
    <h2 className="session-card--title">{props.children}</h2>
);

const CardMode: React.StatelessComponent = props => (
    <div className="session-card--mode">{props.children}</div>
);

export interface ICardProps {
    history: History;
    session: ISession;
}

export class SessionCard extends React.Component<ICardProps> {
    render(): JSX.Element {
        const {
            session: { id, mode, name, source }
        } = this.props;

        return (
            <Button
                className="session-card"
                href={`/session/${id}/${makeUrlSafe(name)}`}
                onClick={this.navigate}
            >
                <div className="session-card--content">
                    <CardTitle>{name}</CardTitle>

                    <CardMode>
                        <CardIcon mode={mode} source={source} />
                    </CardMode>
                </div>
            </Button>
        );
    }

    private navigate = (e: React.MouseEvent | React.KeyboardEvent) => {
        const {
            history,
            session: { id, name }
        } = this.props;

        history.push(`/session/${id}/${makeUrlSafe(name)}`);
        e.preventDefault();
    };
}
