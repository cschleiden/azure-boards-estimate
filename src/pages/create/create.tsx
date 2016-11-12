import * as React from "react";
import { Link } from "react-router";
import { connect } from "react-redux";
import { push } from "react-router-redux";

import { IImmutable } from "immuts";

import { ISession, SessionMode } from "../../model/session";
import { ICreateSessionState } from "../../reducers/createReducer";
import { setName, setDescription, changeMode } from "../../actions/create";

import { TextField } from "office-ui-fabric-react/lib-amd/TextField";
import { Button, ButtonType } from "office-ui-fabric-react/lib-amd/Button";
import { List } from "office-ui-fabric-react/lib-amd/List";
import { ChoiceGroup } from "office-ui-fabric-react/lib-amd/ChoiceGroup";

interface IState {
    session: ISession;
}

const mapStateToProps = (state: { create: IImmutable<ICreateSessionState> }) => ({
    session: state.create.data.session
}) as IState;

interface IDispatch {
    setName: (string) => void;
    setDescription: (string) => void;
    changeMode: (SessionMode) => void;
}

const mapDispatchToProps = (dispatch) => ({
    setName: (name: string) => dispatch(setName(name)),
    setDescription: (description: string) => dispatch(setDescription(description)),
    changeMode: (mode: SessionMode) => dispatch(changeMode(mode))
}) as IDispatch;

class Create extends React.PureComponent<IState & IDispatch, void> {
    public render(): JSX.Element {
        return <div className="ms-Grid">
            <div className="ms-Grid-row">
                <div className="ms-Grid-col ms-u-sm12">
                    <span className="ms-font-su">Create new session</span>

                    <TextField label="Name" value={ this.props.session.name } onChanged={ this._changeName } />
                    <TextField label="Description" value={ this.props.session.description } />

                    <ChoiceGroup
                        label="Pick one image"
                        options={[
                            {
                                key: SessionMode[SessionMode.Azure],
                                isChecked: this.props.session.mode === SessionMode.Azure,
                                imageSrc: "/Modules/DevOffice.Fabric/dist/choicegroup-bar-unselected.png",
                                selectedImageSrc: "/Modules/DevOffice.Fabric/dist/choicegroup-bar-selected.png",
                                imageSize: { width: 50, height: 50 },
                                text: "Azure"
                            },
                            {
                                key: SessionMode[SessionMode.Offline],
                                isChecked: this.props.session.mode === SessionMode.Offline,
                                imageSrc: "/Modules/DevOffice.Fabric/dist/choicegroup-bar-unselected.png",
                                selectedImageSrc: "/Modules/DevOffice.Fabric/dist/choicegroup-bar-selected.png",
                                imageSize: { width: 50, height: 50 },
                                text: "Offline"
                            },
                            {
                                key: SessionMode[SessionMode.Local],
                                isChecked: this.props.session.mode === SessionMode.Local,
                                imageSrc: "/Modules/DevOffice.Fabric/dist/choicegroup-bar-unselected.png",
                                selectedImageSrc: "/Modules/DevOffice.Fabric/dist/choicegroup-bar-selected.png",
                                imageSize: { width: 50, height: 50 },
                                text: "Local"
                            },
                        ]}
                        onChanged={null} />

                    <Button>Create</Button>
                </div>
            </div>
        </div >;
    }

    private _changeName = (value) => {
        if (this.props.session.name !== value) {
            this.props.setName(value);
        }
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Create);