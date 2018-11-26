import * as React from "react";
import { ICardSet } from "../model/cards";
import { IEstimate } from "../model/estimate";
import styled from "../styles/themed-styles";
import { Vote } from "./cards/vote";

export interface IVotesProps {
    estimates: IEstimate[];
    cardSet: ICardSet;

    revealed?: boolean;
}

const VoteList = styled.div`
    display: flex;
`;

export class Votes extends React.Component<IVotesProps> {
    render(): JSX.Element {
        const { estimates, cardSet, revealed } = this.props;

        const votes = estimates.slice(0);
        votes.sort((a, b) =>
            a.identity.displayName.localeCompare(b.identity.displayName)
        );

        return (
            <VoteList>
                {votes.map(vote => (
                    <Vote
                        key={vote.identity.id}
                        identity={vote.identity}
                        card={
                            cardSet.cards.find(
                                x => x.identifier === vote.cardIdentifier
                            )!
                        }
                        revealed={!!revealed}
                    />
                ))}

                {(!votes || votes.length === 0) && <div>No votes yet</div>}
            </VoteList>
        );
    }
}
