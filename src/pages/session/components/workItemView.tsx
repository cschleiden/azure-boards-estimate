import { TextField } from "office-ui-fabric-react";
import * as React from "react";
import { connect } from "react-redux";
import styled from "src/styles/themed-styles";
import { PrimaryButton } from "../../../components/buttons";
import { Card } from "../../../components/cards/card";
import { SubTitle } from "../../../components/subtitle";
import { Votes } from "../../../components/votes";
import { WorkItemHeader } from "../../../components/workitems/workItemHeader";
import { ICard, ICardSet } from "../../../model/cards";
import { IEstimate } from "../../../model/estimate";
import { IIdentity } from "../../../model/identity";
import { IWorkItem } from "../../../model/workitem";
import { IState } from "../../../reducer";
import { estimate, reveal } from "../sessionActions";

const CardContainer = styled.div`
    display: flex;
`;

interface IWorkItemProps {
    identity: IIdentity;
    selectedWorkItem: IWorkItem;
    cardSet: ICardSet;
    estimates: IEstimate[];

    revealed: boolean;
}

const Actions = {
    estimate,
    reveal
};

class WorkItemView extends React.Component<IWorkItemProps & typeof Actions> {
    render() {
        const { cardSet, selectedWorkItem, estimates, revealed } = this.props;

        return (
            <>
                <WorkItemHeader
                    id={selectedWorkItem.id}
                    title={selectedWorkItem.title}
                    description={selectedWorkItem.description}
                />

                <SubTitle>Your vote</SubTitle>
                <CardContainer>
                    {cardSet && cardSet.cards.map(this.renderCard)}
                </CardContainer>

                <SubTitle>Other votes</SubTitle>
                <Votes cardSet={cardSet} estimates={estimates || []} revealed={revealed} />

                <SubTitle>Actions</SubTitle>
                {!revealed && (
                    <>
                        <PrimaryButton onClick={this.doReveal}>
                            Reveal
                        </PrimaryButton>
                    </>
                )}
                {revealed && (
                    <>
                        <div>
                            These were the cards selected, choose one to commit the value to the work item:
                        </div>
                        <div>
                            {estimates.map(e => this.renderCard(cardSet.cards.find(x => x.identifier === e.cardIdentifier)!))}
                        </div>
                        <div>
                            Or enter a custom value:
                            <TextField />
                        </div>
                    </>
                )}
            </>
        );
    }

    private renderCard = (card: ICard): JSX.Element => {
        const { revealed } = this.props;

        return (
            <Card
                key={card.identifier}
                front={{
                    label: card.identifier
                }}
                flipped={false}
                onClick={this.doEstimate.bind(this, card)}
                disabled={revealed}
            />
        );
    }

    private doReveal = () => {
        this.props.reveal();
    }

    private doEstimate = (card: ICard): void => {
        const { estimate, identity, selectedWorkItem } = this.props;

        estimate({
            identity,
            workItemId: selectedWorkItem.id,
            cardIdentifier: card.identifier
        });
    }
}

export default connect(
    (state: IState) => {
        const { session } = state;
        return {
            identity: state.init.currentIdentity,
            cardSet: session.cardSet,
            selectedWorkItem: session.selectedWorkItem!,
            estimates: session.estimates[session.selectedWorkItem!.id],
            revealed: session.revealed
        };
    },
    Actions
)(WorkItemView);