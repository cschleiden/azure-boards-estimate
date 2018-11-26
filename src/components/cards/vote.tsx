import "./vote.scss";
import * as React from "react";
import { ICard } from "../../model/cards";
import { IIdentity } from "../../model/identity";
import { Card } from "./card";

export interface IVoteProps {
    identity: IIdentity;

    card: ICard;

    revealed: boolean;
}

export class Vote extends React.Component<IVoteProps> {
    render(): JSX.Element {
        const { identity, card, revealed } = this.props;

        return (
            <div className="vote-container">
                <Card
                    front={{
                        label: "..."
                    }}
                    back={{
                        label: card && card.identifier
                    }}
                    flipped={revealed}
                    disabled={true}
                />

                <div className="identity">{identity.displayName}</div>
            </div>
        );
    }
}
