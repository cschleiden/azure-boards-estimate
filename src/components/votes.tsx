import * as React from "react";
import { ICardSet } from "../model/cards";
import { ISessionEstimates } from "../model/estimate";
import styled from "../styles/themed-styles";
import { Vote } from "./cards/vote";

export interface IVotesProps {
    workItemId: number;
    estimates: ISessionEstimates;
    cardSet: ICardSet;

    revealed?: boolean;
}

const VoteList = styled.div`
    display: flex;
`;

export class Votes extends React.Component<IVotesProps> {
    render(): JSX.Element {
        const { workItemId, estimates, cardSet, revealed } = this.props;

        let votes = estimates && estimates[workItemId] || [];
        votes = votes.slice(0);
        votes.sort((a, b) => a.identity.displayName.localeCompare(b.identity.displayName));

        return (
            <VoteList>
                {votes.map(vote => (
                    <Vote
                        key={vote.identity.id}
                        identity={vote.identity}
                        estimate={cardSet.cards.find(x => x.value === vote.estimate)!}
                        revealed={!!revealed}
                    />
                ))}

                {(!votes || votes.length === 0) && (
                    <div>No votes yet</div>
                )}
            </VoteList>
        );
    }
}