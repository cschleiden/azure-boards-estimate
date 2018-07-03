import { PrimaryButton } from "office-ui-fabric-react";
import * as React from "react";
import { connect } from "react-redux";
import { CardList } from "../../components/cardList";
import CreatePanel from "../../components/create/panel";
import { Title } from "../../components/title";
import { ISession, SessionSource } from "../../model/session";
import { IState } from "../../reducers/reducer";
import { init } from "../../reducers/sessionsActions";
import styled from "../../styles/themed-styles";
import { IPageProps } from "../props";

interface IHomePageProps extends IPageProps<{}> {
    sessions: ISession[];
}

const Actions = {
    onInit: init
};

const ActionArea = styled.div`    
    display: flex;
    justify-content: flex-end
`;

class HomePage extends React.Component<IHomePageProps & typeof Actions> {
    componentDidMount() {
        this.props.onInit();
    }

    render(): JSX.Element {
        const { history, match, sessions } = this.props;

        return (
            <div>
                <Title>Estimate</Title>

                <ActionArea>
                    <PrimaryButton
                        iconProps={{
                            iconName: "Add"
                        }}
                        onClick={this.create}
                    >
                        Create Session
                    </PrimaryButton>
                </ActionArea>

                <CardList
                    history={history}
                    sessions={sessions}
                />

                {match.path === "/create" && <CreatePanel
                    onDismiss={this.closeCreate}
                />}
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