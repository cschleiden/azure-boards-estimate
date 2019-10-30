import {
    CustomHeader,
    HeaderTitle,
    HeaderTitleArea
} from "azure-devops-ui/Header";
import {
    HeaderCommandBar,
    IHeaderCommandBarItem
} from "azure-devops-ui/HeaderCommandBar";
import { Page } from "azure-devops-ui/Page";
import { Tooltip } from "azure-devops-ui/TooltipEx";
import { VssPersona } from "azure-devops-ui/VssPersona";
import { Spinner, SpinnerSize } from "office-ui-fabric-react";
import * as React from "react";
import { connect } from "react-redux";
import { WorkItemCard } from "../../components/workitems/workItemCard";
import { ICardSet } from "../../model/cards";
import { ISessionEstimates } from "../../model/estimate";
import { IIdentity } from "../../model/identity";
import { ISession } from "../../model/session";
import { IUserInfo } from "../../model/user";
import { IWorkItem } from "../../model/workitem";
import { IState } from "../../reducer";
import { IPageProps } from "../props";
import WorkItemView from "./components/workItemView";
import { getActiveUsers, canPerformAdminActions } from "./selector";
import { SessionEstimateFilter } from "./components/sessionEstimateFilter"; 
import "./session.scss";
import {
    endSession,
    leaveSession,
    loadedSession,
    loadSession,
    selectWorkItem
} from "./sessionActions";
import { EstimateFilter } from "../../model/estimateFilter";

interface ISessionParams {
    id: string;
}

interface ISessionProps extends IPageProps<ISessionParams> {
    identity: IIdentity;
    status: {
        loading: boolean;
        message: string;
    };
    session: ISession;
    workItems: IWorkItem[];
    estimates: ISessionEstimates;
    estimateFilter: EstimateFilter;
    cardSet: ICardSet;
    selectedWorkItem: IWorkItem | null;
    activeUsers: IUserInfo[];

    canPerformAdminActions: boolean;
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

    estimateFilter: EstimateFilter = EstimateFilter.All;

    render(): JSX.Element {
        const {
            canPerformAdminActions,
            cardSet,
            session,
            status,
            workItems,
            selectedWorkItem,
            leaveSession,
            activeUsers
        } = this.props;

        if (status.loading || !session) {
            return (
                <div className="absolute-fill flex-column flex-grow flex-center justify-center">
                    <Spinner size={SpinnerSize.large} />
                    <div>{status.message}</div>
                </div>
            );
        }

        return (
            <Page
                className="absolute-fill"
                orientation={0 /* Orientation.Vertical */}
            >
                <CustomHeader className="bolt-header-with-commandbar">
                    <HeaderTitleArea>
                        <HeaderTitle>{session.name}</HeaderTitle>
                    </HeaderTitleArea>

                    <div className="session--active-users flex-row flex-justify-end flex-center flex-self-stretch">
                        {activeUsers.map(u => (
                            <Tooltip key={u.tfId} text={u.name}>
                                <div>
                                    <VssPersona
                                        identityDetailsProvider={{
                                            getDisplayName: () => u.name,
                                            getIdentityImageUrl: () =>
                                                u.imageUrl
                                        }}
                                        size="small"
                                    />
                                </div>
                            </Tooltip>
                        ))}
                    </div>

                    <HeaderCommandBar
                        items={
                            [
                                {
                                    id: "action-leave",
                                    important: true,
                                    text: "Leave session",
                                    iconProps: { iconName: "Home" },
                                    onActivate: () => {
                                        leaveSession();
                                    }
                                },
                                (!session.isLegacy && {
                                    id: "action-end",
                                    important: false,
                                    text: "End session",
                                    iconProps: { iconName: "Delete" },
                                    onActivate: () => {
                                        this.props.endSession();
                                    }
                                }) ||
                                    undefined
                            ].filter(x => !!x) as IHeaderCommandBarItem[]
                        }
                    />
                </CustomHeader>

                <div className="page-content page-content-top flex-row session-content">

                    <SessionEstimateFilter 
                        updateFilter={(value: EstimateFilter) => { 
                                        this.estimateFilter = value; }} 
                    />

                    <div className="work-item-list v-scroll-auto flex-column custom-scrollbar flex-noshrink">
                        {workItems.filter(workItem => {
                                switch(this.estimateFilter){
                                    case 0:
                                        return workItem.estimate;
                                    case 1:
                                        return (!workItem.estimate || workItem.estimate == 0);
                                    case 2:
                                        return true;
                                }
                            }
                        ).map(workItem => (
                            <WorkItemCard
                                key={workItem.id}
                                cardSet={cardSet}
                                selected={
                                    !!selectedWorkItem &&
                                    selectedWorkItem.id === workItem.id
                                }
                                workItem={workItem}
                                onClick={
                                    (canPerformAdminActions &&
                                        (() =>
                                            this.props.selectWorkItem(
                                                workItem.id
                                            ))) ||
                                    undefined
                                }
                            />
                        ))}
                    </div>
                    {!!selectedWorkItem && <WorkItemView />}
                    {!selectedWorkItem && (
                        <div className="flex-grow flex-column flex-center justify-center">
                            <i>Select a work item on the left to get started</i>
                        </div>
                    )}
                </div>
            </Page>
        );
    }
}

export default connect(
    (state: IState) => {
        return {
            identity: state.init.currentIdentity,
            status: state.session.status,
            session: state.session.session,
            cardSet: state.session.cardSet,
            workItems: state.session.workItems,
            estimates: state.session.estimates,
            estimateFilter: state.session.estimateFilter,
            selectedWorkItem: state.session.selectedWorkItem,
            activeUsers: getActiveUsers(state),
            canPerformAdminActions: canPerformAdminActions(state)
        };
    },
    Actions
)(Session);
