import "./session.scss";
import { Spinner, SpinnerSize } from "office-ui-fabric-react";
import * as React from "react";
import { connect } from "react-redux";
import { Splitter } from "../../components/splitter";
import { WorkItemCard } from "../../components/workitems/workItemCard";
import { ICardSet } from "../../model/cards";
import { ISessionEstimates } from "../../model/estimate";
import { IIdentity } from "../../model/identity";
import { ISession } from "../../model/session";
import { IWorkItem } from "../../model/workitem";
import { IState } from "../../reducer";
import { IPageProps } from "../props";
import WorkItemView from "./components/workItemView";
import {
    leaveSession,
    loadedSession,
    loadSession,
    selectWorkItem,
    endSession
} from "./sessionActions";
import { Page } from "azure-devops-ui/Page";
import { Card } from "azure-devops-ui/Card";
import { Header } from "azure-devops-ui/Header";

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
    leaveSession,
    endSession
};

class Session extends React.Component<
    ISessionProps & typeof Actions,
    { flipped: boolean }
> {
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
        const {
            cardSet,
            session,
            loading,
            workItems,
            selectedWorkItem,
            leaveSession
        } = this.props;

        if (loading || !session) {
            return (
                <div className="session-loading">
                    <Spinner size={SpinnerSize.large} />
                </div>
            );
        }

        return (
            <Page className="bolt-page-grey flex-grow">
                <Header
                    title={session.name}
                    commandBarItems={[
                        {
                            id: "action-leave",
                            important: true,
                            text: "Leave session",
                            iconProps: { iconName: "Home" },
                            onActivate: () => {
                                leaveSession();
                            }
                        },
                        {
                            id: "action-end",
                            important: false,
                            text: "End session",
                            iconProps: { iconName: "Delete" },
                            onActivate: () => {
                                this.props.endSession();
                            }
                        }
                    ]}
                />

                <div className="page-content page-content-top">
                    <Splitter
                        left={
                            <>
                                {workItems.map(workItem => (
                                    <WorkItemCard
                                        key={workItem.id}
                                        selected={
                                            !!selectedWorkItem &&
                                            selectedWorkItem.id === workItem.id
                                        }
                                        workItem={workItem}
                                        // TODO: Use real value
                                        estimate={cardSet.cards[0].identifier}
                                        onClick={() =>
                                            this.props.selectWorkItem(
                                                workItem.id
                                            )
                                        }
                                    />
                                ))}
                            </>
                        }
                        right={
                            (!!selectedWorkItem && <WorkItemView />) || <></>
                        }
                    />
                </div>
            </Page>
        );
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
