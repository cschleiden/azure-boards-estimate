import * as React from "react";
import { Link } from "react-router";
import { connect } from "react-redux";

import { IImmutable } from "immuts";

import { ISessionState } from "../stores/sessionStore";
import { ISession } from "../model/session";

import { addAction, removeAction } from "../actions/sessionActionsCreators";

import { Button, ButtonType } from "office-ui-fabric-react/lib/Button";

import { List } from "office-ui-fabric-react/lib/List";

import "./sessionList.scss";

interface ISessionProps {
    session: ISession;

    remove: (id: string) => void;
}

const SessionComponent: React.StatelessComponent<ISessionProps> = (props: ISessionProps): JSX.Element => {
    return <ul className="ms-List">
        <li className="ms-ListItem">
            <span className="ms-ListItem-primaryText">
                <a className="ms-Link" href="#">
                    { props.session.name }
                </a>
            </span>
            <span className="ms-ListItem-secondaryText">Workitems #12, #2434, #23423</span>
            <span className="ms-ListItem-metaText">7/8 2016 - 2: 42p</span>
            <div className="ms-ListItem-actions">
                <div className="ms-ListItem-action">
                    <Button buttonType={ ButtonType.icon } onClick={ () => props.remove(props.session.id) } icon="trash" rootProps={{ title: "Remove" }} />
                </div>
            </div>
        </li>
    </ul>;
};

interface IHomeProps {
    sessions: ISessionState; 

    create: () => void;
    remove: (id: string) => void;
}

function mapStateToProps(state: { sessions: IImmutable<ISessionState> }) {
    return {
        sessions: state.sessions.data
    };
}

function mapDispatchToProps(dispatch) {
    return {
        create: (): void => dispatch(addAction("test")),
        remove: (id: string): void => dispatch(removeAction(id))
    };
}

class Home extends React.Component<IHomeProps, void> {
    public shouldUpdateComponent(nextProps) {
        return this.props.sessions !== nextProps.sessions;
    }

    public render(): JSX.Element {
        let content: JSX.Element;

        const sessions = this.props.sessions.sessions;
        if (!sessions || sessions.length === 0) {
            content = <div>
                Start a new session TODO
            </div>;
        } else {
            content = <List
                items={ sessions }
                onRenderCell={ (item) => <SessionComponent session={ item } remove={ this.props.remove } /> } />;
        }

        return <div className="ms-Grid">
            <div className="ms-Grid-row">
                <div className="ms-Grid-col ms-u-sm12">
                    <span className="ms-font-su">Sessions</span>

                    <div className="clearfix">
                        <div className="right">
                            <Button
                                buttonType={ ButtonType.hero }
                                onClick={ () => this.props.create() }>Create new session</Button>
                        </div>
                    </div>

                    { content }
                </div>
            </div>
        </div>;
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);
