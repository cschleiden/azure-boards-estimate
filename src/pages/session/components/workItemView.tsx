import { TextField, ICommandBarItemProps } from "office-ui-fabric-react";
import * as React from "react";
import { connect } from "react-redux";
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
import "./workItemView.scss";
import { CustomCard, CardContent } from "azure-devops-ui/Card";
import { Header } from "azure-devops-ui/Header";
import { IHeaderCommandBarItem } from "azure-devops-ui/HeaderCommandBar";
import { WorkItemDescription } from "../../../components/workitems/workItemDescription";
import { WorkItemStoryPoints } from "../../../components/workitems/workItemStoryPoints";

interface IWorkItemProps {
    identity: IIdentity;
    selectedWorkItem: IWorkItem;
    cardSet: ICardSet;
    estimates: IEstimate[];

    revealed: boolean;
    canReveal: boolean;
}

const Actions = {
    estimate,
    reveal
};

class WorkItemView extends React.Component<IWorkItemProps & typeof Actions> {
    render() {
        const {
            cardSet,
            selectedWorkItem,
            estimates,
            canReveal,
            revealed
        } = this.props;

        return (
            <CustomCard className="flex-grow bolt-card-white">
                <Header
                    commandBarItems={
                        [
                            canReveal &&
                                ({
                                    id: "action-reveal",
                                    text: "Reveal",
                                    important: true,
                                    isPrimary: true,
                                    onActivate: this.doReveal
                                } as IHeaderCommandBarItem)
                        ].filter(x => !!x) as IHeaderCommandBarItem[]
                    }
                >
                    <WorkItemHeader workItem={selectedWorkItem} />
                </Header>

                <CardContent>
                    <div className="flex-grow flex-column">
                        <WorkItemDescription workItem={selectedWorkItem} />

                        <WorkItemStoryPoints estimate={0} />

                        <SubTitle>Your vote</SubTitle>
                        <div className="card-container">
                            {cardSet && cardSet.cards.map(this.renderCard)}
                        </div>

                        <SubTitle>All votes</SubTitle>
                        <Votes
                            cardSet={cardSet}
                            estimates={estimates || []}
                            revealed={revealed}
                        />

                        <SubTitle>Actions</SubTitle>
                        {revealed && (
                            <>
                                <div>
                                    These were the cards selected, choose one to
                                    commit the value to the work item:
                                </div>
                                <div>
                                    {(estimates || []).map(e =>
                                        this.renderCard(
                                            cardSet.cards.find(
                                                x =>
                                                    x.identifier ===
                                                    e.cardIdentifier
                                            )!
                                        )
                                    )}
                                </div>
                                <div>
                                    Or enter a custom value:
                                    <TextField />
                                </div>
                            </>
                        )}
                    </div>
                </CardContent>
            </CustomCard>
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
    };

    private doReveal = () => {
        this.props.reveal();
    };

    private doEstimate = (card: ICard): void => {
        const { estimate, identity, selectedWorkItem } = this.props;

        estimate({
            identity,
            workItemId: selectedWorkItem.id,
            cardIdentifier: card.identifier
        });
    };
}

export default connect(
    (state: IState) => {
        const { session } = state;

        const estimates = session.estimates[session.selectedWorkItem!.id];

        return {
            identity: state.init.currentIdentity!,
            cardSet: session.cardSet!,
            selectedWorkItem: session.selectedWorkItem!,
            estimates,
            revealed: session.revealed,
            canReveal: !session.revealed && estimates && estimates.length > 0
        };
    },
    Actions
)(WorkItemView);
