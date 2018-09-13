import * as React from "react";
import styled from "src/styles/themed-styles";
import { Card } from "../../../components/cards/card";
import { SubTitle } from "../../../components/subtitle";
import { Votes } from "../../../components/votes";
import { WorkItemHeader } from "../../../components/workitems/workItemHeader";
import { ICard, ICardSet } from "../../../model/cards";
import { IIdentity } from "../../../model/identity";
import { IWorkItem } from "../../../model/workitem";
import { estimate } from "../sessionActions";
import { IState } from "../../../reducer";
import { connect } from "react-redux";
import { IEstimate } from "../../../model/estimate";

const CardContainer = styled.div`
    display: flex;
`;

interface IWorkItemProps {
    identity: IIdentity;
    selectedWorkItem: IWorkItem;
    cardSet: ICardSet;
    estimates: IEstimate[];
}

const Actions = {
    estimate
};

class WorkItemView extends React.Component<IWorkItemProps & typeof Actions> {
    render() {
        const { cardSet, selectedWorkItem, estimates } = this.props;

        return (
            <>
                <WorkItemHeader
                    id={selectedWorkItem.id}
                    title={selectedWorkItem.title}
                    description={selectedWorkItem.description}
                />

                <SubTitle>Other votes</SubTitle>
                <Votes cardSet={cardSet} estimates={estimates || []} />

                <SubTitle>Your vote</SubTitle>

                <CardContainer>
                    {cardSet && cardSet.cards.map(this.renderCard)}
                </CardContainer>
            </>
        );
    }

    private renderCard = (card: ICard): JSX.Element => {
        return (
            <Card
                key={card.display}
                front={{
                    label: card.display
                }}
                flipped={false}
                onClick={this.doEstimate.bind(this, card)}
            />
        );
    }

    private doEstimate = (card: ICard): void => {
        const { estimate, identity, selectedWorkItem } = this.props;

        estimate({
            identity,
            workItemId: selectedWorkItem.id,
            estimate: card.display
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
            estimates: session.estimates[session.selectedWorkItem!.id]
        };
    },
    Actions
)(WorkItemView);