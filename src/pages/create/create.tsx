import * as React from "react";
import { Link } from "react-router";
import { connect } from "react-redux";
import { push } from "react-router-redux";

import { IImmutable } from "immuts";

import { ISession } from "../../model/session";
import { ISessionState } from "../../reducers/sessionsReducer";
import { addAction, removeAction, fetchAction } from "../../actions/sessions";

import { Button, ButtonType } from "office-ui-fabric-react/lib/Button";
import { List } from "office-ui-fabric-react/lib/List";

interface ICreateProps {
    sessions: ISessionState;

    cancel: () => void;
    create: (name: string) => void;
    fetch: () => void;
}

function mapStateToProps(state: { sessions: IImmutable<ISessionState> }) {
    return {
        sessions: state.sessions.data
    };
}

function mapDispatchToProps(dispatch) {
    return {
        cancel: (): void => { push("/create"); },
        create: (id: string): void => dispatch(addAction("name")), 
        fetch: () => dispatch(fetchAction())
    };
}

class Create extends React.Component<ICreateProps, void> {
    public shouldUpdateComponent(nextProps) {
        return this.props.sessions !== nextProps.sessions;
    }

    public render(): JSX.Element {
        return <div className="ms-Grid">
            <div className="ms-Grid-row">
                <div className="ms-Grid-col ms-u-sm12">
                    <span className="ms-font-su">Create new session</span>

                    <Button onClick={ () => this.props.fetch() }>Test</Button>
                </div>
            </div>
        </div>;
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Create);