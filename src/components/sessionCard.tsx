import { Button } from "azure-devops-ui/Button";
import { History } from "history";
import * as React from "react";
import { makeUrlSafe } from "../lib/urlSafe";
import { ISessionDisplay, ISessionInfo } from "../model/session";
import { CardIcon } from "./cardIcon";
import "./sessionCard.scss";
import { Link } from "azure-devops-ui/Link";
import { MoreButton } from "azure-devops-ui/Menu";

const CardTitle: React.StatelessComponent = props => (
    <h2 className="session-card--title flex-grow" {...props} />
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

    onEndSession: (id: string) => void;
}

export class SessionCard extends React.Component<ICardProps> {
    render(): JSX.Element {
        const {
            session: {
                session: { id, mode, name, source, sourceData },
                sessionInfo
            },
            onEndSession
        } = this.props;

        return (
            <div className="session-card">
                <div className="session-card--content">
                    <div className="flex-row">
                        <CardTitle>
                            <Link
                                href={`/session/${id}/${makeUrlSafe(name)}`}
                                onClick={this.navigate}
                            >
                                {name}
                            </Link>
                        </CardTitle>

                        <MoreButton
                            className="session-card--menu"
                            contextualMenuProps={{
                                menuProps: {
                                    onActivate: (ev: any) =>
                                        ev.stopPropagation(),
                                    id: "card-more",
                                    items: [
                                        {
                                            id: "session-end",
                                            text: "End session",
                                            onActivate: () => onEndSession(id)
                                        }
                                    ]
                                }
                            }}
                        />
                    </div>

                    <CardInfo sessionInfo={sessionInfo} />

                    <CardMode>
                        <CardIcon mode={mode} source={source} />
                    </CardMode>
                </div>
            </div>
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
