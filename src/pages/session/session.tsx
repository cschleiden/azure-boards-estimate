import { Spinner } from "office-ui-fabric-react";
import * as React from "react";
import { connect } from "react-redux";
import { DefaultButton, MoreButton } from "../../components/buttons";
import { Card } from "../../components/cards/card";
import { Header } from "../../components/header";
import { Splitter } from "../../components/splitter";
import { SubTitle } from "../../components/subtitle";
import { WorkItemCard } from "../../components/workitems/workItemCard";
import { WorkItemHeader } from "../../components/workitems/workItemHeader";
import { ICard, ICardSet } from "../../model/cards";
import { IWorkItem } from "../../model/IWorkItem";
import { ISession } from "../../model/session";
import { IState } from "../../reducer";
import { IPageProps } from "../props";
import { loadedSession, loadSession } from "./sessionActions";

interface ISessionParams {
    id: string;
}

interface ISessionProps extends IPageProps<ISessionParams> {
    session: ISession;
    workItems: IWorkItem[];
    cardSet: ICardSet;
    selectedWorkItem: IWorkItem | null;
}

const Actions = {
    loadSession,
    loadedSession
};

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
        const { cardSet, session, workItems, selectedWorkItem } = this.props;

        if (!session) {
            return (
                <div>
                    <Spinner />
                </div>
            );
        }

        return (
            <div>
                <Header
                    title={`Session ${this.props.match.params.id}`}
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

                            <Card
                                // tslint:disable-next-line:jsx-no-lambda
                                onClick={() => this.setState({ flipped: !this.state.flipped })}
                                front={{
                                    label: "front"
                                }}
                                back={{
                                    label: "back"
                                }}
                                flipped={this.state.flipped}
                            />

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
            session: state.session.session,
            cardSet: state.session.cardSet,
            workItems: state.session.workItems,
            selectedWorkItem: state.session.selectedWorkItem
        };
    },
    Actions
)(Session);