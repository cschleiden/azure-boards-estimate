import * as React from "react";
import { Link } from "react-router";
import { connect } from "react-redux";
import { push } from 'react-router-redux'

import { IImmutable } from "immuts";

import { ISession } from "../../model/session";
import { ISessionState } from "../../reducers/sessionsReducer";
import { addAction, removeAction } from "../../actions/sessionActionsCreators";

import { Button, ButtonType } from "office-ui-fabric-react/lib/Button";
import { List } from "office-ui-fabric-react/lib/List";


interface ICreateProps {
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
        create: (): void => { push("/create"); },
        remove: (id: string): void => dispatch(removeAction(id))
    };
}

class Create extends React.Component<ICreateProps, void> {
    public shouldUpdateComponent(nextProps) {
        return this.props.sessions !== nextProps.sessions;
    }

    public render(): JSX.Element {
        return <div>Create</div>
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Create);