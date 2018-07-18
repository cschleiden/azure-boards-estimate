import * as React from "react";
import { ICard } from "../../model/cards";
import { IIdentity } from "../../model/identity";
import styled from "../../styles/themed-styles";
import { Card } from "./card";

export interface IVoteProps {
    identity: IIdentity;

    estimate: ICard;

    revealed: false;
}

export const X = styled.div`
    display: flex;
    flex-direction: column;

    align-items: center;
`;

export const Identity = styled.div`
    margin-left: 10px;
    font-size: 14px;
`;

export class Vote extends React.Component<IVoteProps> {
    render(): JSX.Element {
        const { identity, estimate, revealed } = this.props;

        return (
            <X>
                <Card
                    front={{
                        label: "..."
                    }}
                    back={{
                        label: estimate && estimate.display
                    }}
                    flipped={revealed}
                />

                <Identity>
                    {identity.displayName}
                </Identity>
            </X>
        );
    }
}