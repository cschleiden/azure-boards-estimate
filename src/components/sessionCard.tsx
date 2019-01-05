import { Button } from "azure-devops-ui/Button";
import { History } from "history";
import * as React from "react";
import { makeUrlSafe } from "../lib/urlSafe";
import { ISessionDisplay, ISessionInfo } from "../model/session";
import { CardIcon } from "./cardIcon";
import "./sessionCard.scss";

const CardTitle: React.StatelessComponent = props => (
    <h2 className="session-card--title">{props.children}</h2>
);

const CardMode: React.StatelessComponent = props => (
    <div className="session-card--mode">{props.children}</div>
);

const CardInfo: React.StatelessComponent<{
    sessionInfo: ISessionInfo[];
}> = props => (
    <div className="session-card--info">
        {props.sessionInfo.map(info => (
            <dl key={info.label}>
                <dt>{info.label}</dt>
                <dd>{info.value}</dd>
            </dl>
        ))}
    </div>
);

export interface ICardProps {
    history: History;
    session: ISessionDisplay;
}

export class SessionCard extends React.Component<ICardProps> {
    render(): JSX.Element {
        const {
            session: {
                session: { id, mode, name, source, sourceData },
                sessionInfo
            }
        } = this.props;

        return (
            <Button
                className="session-card"
                href={`/session/${id}/${makeUrlSafe(name)}`}
                onClick={this.navigate}
            >
                <div className="session-card--content">
                    <CardTitle>{name}</CardTitle>

                    <CardInfo sessionInfo={sessionInfo} />

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
            session: {
                session: { id, name }
            }
        } = this.props;

        history.push(`/session/${id}/${makeUrlSafe(name)}`);
        e.preventDefault();
    };
}
