import "./votes.scss";
import * as React from "react";
import { ICardSet } from "../model/cards";
import { IEstimate } from "../model/estimate";
import { Vote } from "./cards/vote";

export interface IVotesProps {
    estimates: IEstimate[];
    cardSet: ICardSet;

    revealed?: boolean;
}

export class Votes extends React.Component<IVotesProps> {
    render(): JSX.Element {
        const { estimates, cardSet, revealed } = this.props;

        const votes = estimates.slice(0);
        votes.sort((a, b) =>
            a.identity.displayName.localeCompare(b.identity.displayName)
        );

        return (
            <div className="flex-row">
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
            </div>
        );
    }
}
