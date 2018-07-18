import * as React from "react";
import { connect } from "react-redux";
import { MoreButton, PrimaryButton } from "../../components/buttons";
import CreatePanel from "../../components/create/panel";
import { Header } from "../../components/header";
import { SessionList } from "../../components/sessionList";
import { ISession } from "../../model/session";
import { IState } from "../../reducer";
import { IPageProps } from "../props";
import { loadSessions } from "./sessionsActions";

interface IHomePageProps extends IPageProps<{}> {
    sessions: ISession[];
}

const Actions = {
    onInit: loadSessions
};

class HomePage extends React.Component<IHomePageProps & typeof Actions> {
    componentDidMount() {
        this.props.onInit();
    }

    render(): JSX.Element {
        const { history, match, sessions } = this.props;

        return (
            <div>
                <Header
                    title="Estimate"
                    buttons={(
                        <>
                            <PrimaryButton
                                iconProps={{
                                    iconName: "Add"
                                }}
                                onClick={this.create}
                            >
                                Create Session
                            </PrimaryButton>
                            &nbsp;
                            <MoreButton
                                iconProps={{
                                    iconName: "More"
                                }}
                                menuProps={{
                                    items: [
                                        {
                                            key: "end",
                                            text: "Settings",
                                            iconProps: {
                                                iconName: "Settings"
                                            }
                                        }
                                    ]
                                }}
                            />
                        </>
                    )}
                />

                <SessionList
                    history={history}
                    sessions={sessions}
                />

                {match.path.indexOf("/create") !== -1 && (
                    <CreatePanel
                        onDismiss={this.closeCreate}
                    />
                )}
            </div>
        );
    }

    private create = () => {
        const { history } = this.props;
        history.push("/create");
    }

    private closeCreate = () => {
        const { history } = this.props;
        history.push("/");
    }
}

export default connect(
    (state: IState) => ({
        sessions: state.sessions.sessions
    }),
    Actions
)(HomePage);