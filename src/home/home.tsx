import * as React from "react";
import { Link } from "react-router";
import { connect } from "react-redux";

import { ISession } from "../model/session";
import { addAction } from "../actions/sessionActionsCreators";

const Styles = require("./home.css");

const SessionComponent: React.StatelessComponent<{}> = (props: {}): JSX.Element => {
    return <li className={ "clearfix " + Styles.session as string }>
        <div className={ "left " + Styles.icon }></div>

        <div className={ Styles.line1 }>Session Nam</div>
        <div className={ Styles.line2 }>Session Nam2</div>

        <span className="bowtie-icon bowtie-edit-delete"></span>
    </li>;
};

interface IHomeProps {
    sessions: ISession[];
    create: (name: string) => void;
}

class Home extends React.Component<IHomeProps, void> {
    public render(): JSX.Element {
        let content: JSX.Element;

        let sessions = this._renderSessions();

        if (!sessions || sessions.length === 0) {
            content = <div>
                Create a new content
            </div>;
        } else {
            content = <ul className="list-reset">
                { sessions }
            </ul>;
        }

        return <div className="home">
            <h1>Sessions</h1>

            <div className="clearfix">
                <div className="right">
                    <a href="#" onClick={ () => this.props.create("test") }>+ Create new session</a>
                </div>
            </div>

            { content }
        </div>;
    }

    private _renderSessions(): JSX.Element[] {
        return this.props.sessions.map(x => <SessionComponent />);
    }
}

function mapStateToProps(state) {
    return {
        sessions: state.sessions.sessions
    };
}

function mapDispatchToProps(dispatch) {
    return {
        create: (name: string): void => dispatch(addAction(name))
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);
