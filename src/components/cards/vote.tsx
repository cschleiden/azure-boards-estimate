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
`;

export class Vote extends React.Component<IVoteProps> {
    render(): JSX.Element {
        const { identity, estimate, revealed } = this.props;

        return (
            <X>
                <Card
                    front={{
                        label: "X"
                    }}
                    back={{
                        label: estimate && estimate.display
                    }}
                    flipped={revealed}
                />

                {identity.displayName}
            </X>
        );
    }
}