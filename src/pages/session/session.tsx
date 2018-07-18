import { Spinner } from "office-ui-fabric-react";
import * as React from "react";
import { connect } from "react-redux";
import { DefaultButton, MoreButton } from "../../components/buttons";
import { Card } from "../../components/cards/card";
import { Vote } from "../../components/cards/vote";
import { Header } from "../../components/header";
import { Splitter } from "../../components/splitter";
import { SubTitle } from "../../components/subtitle";
import { WorkItemCard } from "../../components/workitems/workItemCard";
import { WorkItemHeader } from "../../components/workitems/workItemHeader";
import { ICard, ICardSet } from "../../model/cards";
import { IWorkItem } from "../../model/IWorkItem";
import { ISession } from "../../model/session";
import { IState } from "../../reducer";
import styled from "../../styles/themed-styles";
import { IPageProps } from "../props";
import { loadedSession, loadSession, selectWorkItem } from "./sessionActions";

interface ISessionParams {
    id: string;
}

interface ISessionProps extends IPageProps<ISessionParams> {
    loading: boolean;
    session: ISession;
    workItems: IWorkItem[];
    cardSet: ICardSet;
    selectedWorkItem: IWorkItem | null;
}

const Actions = {
    loadSession,
    loadedSession,
    selectWorkItem
};

const Votes = styled.div`
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
        const { cardSet, session, loading, workItems, selectedWorkItem } = this.props;

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
                                    description=""
                                />
                            )}

                            <SubTitle>Other votes</SubTitle>

                            <Votes>
                                <Vote
                                    identity={{
                                        id: "123",
                                        displayName: "John Doe"
                                    }}
                                    estimate={cardSet.cards[0]}
                                    revealed={false}
                                />
                                <Vote
                                    identity={{
                                        id: "123",
                                        displayName: "Christopher Schleiden"
                                    }}
                                    estimate={cardSet.cards[0]}
                                    revealed={false}
                                />
                            </Votes>

                            <SubTitle>Your vote</SubTitle>

                            {cardSet && cardSet.cards.map(this.renderCard)}
                        </>
                    )} />
            </div>
        );
    }

    private renderCard(card: ICard): JSX.Element {
        return (
            <Card
                key={card.display}
                front={{
                    label: card.display
                }}
                flipped={false}
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
            loading: state.session.loading,
            session: state.session.session,
            cardSet: state.session.cardSet,
            workItems: state.session.workItems,
            selectedWorkItem: state.session.selectedWorkItem
        };
    },
    Actions
)(Session);