import { Spinner } from "office-ui-fabric-react";
import * as React from "react";
import { connect } from "react-redux";
import { DefaultButton, MoreButton } from "../../components/buttons";
import { Card } from "../../components/cards/card";
import { Header } from "../../components/header";
import { Splitter } from "../../components/splitter";
import { SubTitle } from "../../components/subtitle";
import { Votes } from "../../components/votes";
import { WorkItemCard } from "../../components/workitems/workItemCard";
import { WorkItemHeader } from "../../components/workitems/workItemHeader";
import { ICard, ICardSet } from "../../model/cards";
import { ISessionEstimates } from "../../model/estimate";
import { IIdentity } from "../../model/identity";
import { ISession } from "../../model/session";
import { IWorkItem } from "../../model/workitem";
import { IState } from "../../reducer";
import styled from "../../styles/themed-styles";
import { IPageProps } from "../props";
import { estimate, loadedSession, loadSession, selectWorkItem } from "./sessionActions";

interface ISessionParams {
    id: string;
}

interface ISessionProps extends IPageProps<ISessionParams> {
    identity: IIdentity;
    loading: boolean;
    session: ISession;
    workItems: IWorkItem[];
    estimates: ISessionEstimates;
    cardSet: ICardSet;
    selectedWorkItem: IWorkItem | null;
}

const Actions = {
    loadSession,
    loadedSession,
    selectWorkItem,
    estimate
};

const CardContainer = styled.div`
    display: flex;
`;

class Session extends React.Component<ISessionProps & typeof Actions, { flipped: boolean }> {
    constructor(props: any) {
        super(props);

        this.state = {
            flipped: false
        };
    }

    componentDidMount() {
        this.props.loadSession(this.props.match.params.id);
    }

    render(): JSX.Element {
        const { cardSet, estimates, session, loading, workItems, selectedWorkItem } = this.props;

        if (loading || !session) {
            return (
                <div>
                    <Spinner />
                </div>
            );
        }

        return (
            <div>
                <Header
                    title={session.name}
                    buttons={(
                        <>
                            <DefaultButton
                                iconProps={{
                                    iconName: "Leave"
                                }}
                                onClick={this.leave}
                            >
                                Leave session
                            </DefaultButton>
                            &nbsp;
                            <MoreButton
                                iconProps={{
                                    iconName: "More"
                                }}
                                menuProps={{
                                    items: [
                                        {
                                            key: "end",
                                            text: "End session",
                                            iconProps: {
                                                iconName: "Delete"
                                            }
                                        }
                                    ]
                                }}
                            />
                        </>
                    )}
                />

                <Splitter
                    left={(
                        <>
                            {workItems.map(workItem => (
                                <WorkItemCard
                                    key={workItem.id}
                                    selected={!!selectedWorkItem && selectedWorkItem.id === workItem.id}
                                    id={workItem.id}
                                    title={workItem.title}
                                    estimate={12}
                                    // tslint:disable-next-line:jsx-no-lambda
                                    onClick={() => this.props.selectWorkItem(workItem.id)}
                                />
                            ))}
                        </>
                    )}
                    right={(
                        <>
                            {selectedWorkItem && (
                                <WorkItemHeader
                                    id={selectedWorkItem.id}
                                    title={selectedWorkItem.title}
                                    description={selectedWorkItem.description}
                                />
                            )}

                            <SubTitle>Other votes</SubTitle>
                            <Votes cardSet={cardSet} estimates={estimates} workItemId={selectedWorkItem!.id} />

                            <SubTitle>Your vote</SubTitle>

                            <CardContainer>
                                {cardSet && cardSet.cards.map(this.renderCard)}
                            </CardContainer>
                        </>
                    )} />
            </div>
        );
    }

    private renderCard = (card: ICard): JSX.Element => {
        const { identity, selectedWorkItem } = this.props;

        return (
            <Card
                key={card.display}
                front={{
                    label: card.display
                }}
                flipped={false}
                // tslint:disable-next-line:jsx-no-lambda
                onClick={() => {
                    this.props.estimate({
                        identity,
                        workItemId: selectedWorkItem!.id,
                        estimate: card.display
                    });
                }}
            />
        );
    }

    private leave = () => {
        const { history } = this.props;
        history.push("/");
    }
}


export default connect(
    (state: IState) => {
        return {
            identity: state.init.currentIdentity,
            loading: state.session.loading,
            session: state.session.session,
            cardSet: state.session.cardSet,
            workItems: state.session.workItems,
            estimates: state.session.estimates,
            selectedWorkItem: state.session.selectedWorkItem
        };
    },
    Actions
)(Session);