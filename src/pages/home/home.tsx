import { ConditionalChildren } from "azure-devops-ui/ConditionalChildren";
import { ObservableValue } from "azure-devops-ui/Core/Observable";
import { FilterBar } from "azure-devops-ui/FilterBar";
import { Header } from "azure-devops-ui/Header";
import { HeaderCommandBarWithFilter } from "azure-devops-ui/HeaderCommandBar";
import { Page } from "azure-devops-ui/Page";
import { Tab, TabBar } from "azure-devops-ui/Tabs";
import { KeywordFilterBarItem } from "azure-devops-ui/TextFilterBarItem";
import { Filter } from "azure-devops-ui/Utilities/Filter";
import { Card } from "azure-devops-ui/Card";
import * as React from "react";
import { connect } from "react-redux";
import CreatePanel from "../../components/create/panel";
import { SessionList } from "../../components/sessionList";
import { ISession } from "../../model/session";
import { IState } from "../../reducer";
import { IPageProps } from "../props";
import { loadSessions, filter } from "./sessionsActions";

interface IHomePageProps extends IPageProps<{}> {
    sessions: ISession[];
}

const Actions = {
    onInit: loadSessions,
    filter
};

class HomePage extends React.Component<IHomePageProps & typeof Actions> {
    filter: Filter;
    filterToggled = new ObservableValue<boolean>(false);

    constructor(props: IHomePageProps & typeof Actions) {
        super(props);

        this.filter = new Filter();
        this.filter.subscribe(state => {
            props.filter(state["keyword"] && state["keyword"]!.value);
        });
    }

    componentDidMount() {
        this.props.onInit();
    }

    render(): JSX.Element {
        const { history, match, sessions } = this.props;

        return (
            <Page className="bolt-page-grey flex-grow">
                <Header
                    title="Estimate"
                    commandBarItems={[
                        {
                            id: "action-create",
                            isPrimary: true,
                            important: true,
                            text: "Create Session",
                            iconProps: { iconName: "Add" },
                            onActivate: this.create
                        },
                        {
                            id: "end",
                            tooltipProps: { text: "Settings" },
                            iconProps: { iconName: "Settings" },
                            subtle: true
                        }
                    ]}
                />
                <TabBar
                    selectedTabId={"sessions"}
                    onSelectedTabChanged={this.onSelectedTabChanged}
                    renderAdditionalContent={this.renderTabBarCommands}
                    disableSticky={true}
                >
                    <Tab id="sessions" name="Sessions" />
                </TabBar>

                <ConditionalChildren renderChildren={this.filterToggled}>
                    <div className="page-content page-content-top">
                        <FilterBar
                            className="bolt-filterbar-white depth-8"
                            filter={this.filter}
                            onDismissClicked={this.onFilterBarDismissClicked}
                        >
                            <KeywordFilterBarItem filterItemKey="keyword" />
                        </FilterBar>
                    </div>
                </ConditionalChildren>

                <div className="page-content page-content-top">
                    <Card className="flex-grow bolt-card-white">
                        <SessionList history={history} sessions={sessions} />
                    </Card>
                </div>

                {match.path.indexOf("/create") !== -1 && (
                    <CreatePanel onDismiss={this.closeCreate} />
                )}
            </Page>
        );
    }

    private onFilterBarDismissClicked = () => {
        this.filter.reset();
        this.filterToggled.value = false;
    };

    private onSelectedTabChanged = () => {};

    private renderTabBarCommands = () => {
        return (
            <HeaderCommandBarWithFilter
                filter={this.filter}
                filterToggled={this.filterToggled}
                items={[]}
            />
        );
    };

    private create = () => {
        const { history } = this.props;
        history.push("/create");
    };

    private closeCreate = () => {
        const { history } = this.props;
        history.push("/");
    };
}

export default connect(
    (state: IState) => ({
        sessions:
            (state.sessions.filteredSessions &&
                state.sessions.filteredSessions.length > 0 &&
                state.sessions.filteredSessions) ||
            state.sessions.sessions
    }),
    Actions
)(HomePage);
