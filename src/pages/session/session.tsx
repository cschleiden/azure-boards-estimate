import { Label, Spinner } from "office-ui-fabric-react";
import * as React from "react";
import { connect } from "react-redux";
import { Title } from "../../components/title";
import { ISession } from "../../model/session";
import { IState } from "../../reducer";
import { IPageProps } from "../props";
import { loadedSession, loadSession } from "./sessionActions";

interface ISessionParams {
    id: string;
}

interface ISessionProps extends IPageProps<ISessionParams> {
    session: ISession;
}

const Actions = {
    loadSession,
    loadedSession
};

class Session extends React.Component<ISessionProps & typeof Actions> {
    componentDidMount() {
        this.props.loadSession(this.props.match.params.id);
    }

    render(): JSX.Element {
        const { session } = this.props;

        if (!session) {
            return (
                <div>
                    <Spinner />
                </div>
            );
        }

        return (
            <div>
                <Title>Session {this.props.match.params.id}</Title>

                <Label>Test</Label>
            </div>
        );
    }
}


export default connect(
    (state: IState) => {
        return {
            session: state.session.session
        };
    },
    Actions
)(Session);