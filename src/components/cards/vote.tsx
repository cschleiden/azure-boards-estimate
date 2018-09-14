import * as React from "react";
import { ICard } from "../../model/cards";
import { IIdentity } from "../../model/identity";
import styled from "../../styles/themed-styles";
import { Card } from "./card";

export interface IVoteProps {
    identity: IIdentity;

    card: ICard;

    revealed: boolean;
}

export const VoteContainer = styled.div`
    display: flex;
    flex-direction: column;

    align-items: center;
`;

export const Identity = styled.div`
    font-size: 14px;
`;

export class Vote extends React.Component<IVoteProps> {
    render(): JSX.Element {
        const { identity, card, revealed } = this.props;

        return (
            <VoteContainer>
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

                <Identity>
                    {identity.displayName}
                </Identity>
            </VoteContainer>
        );
    }
}