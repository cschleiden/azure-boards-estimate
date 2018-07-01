import { ChoiceGroup, DefaultButton, Dropdown, IChoiceGroupOption, IDropdownOption, Label, Panel, PanelType, PrimaryButton, TextField } from "office-ui-fabric-react";
import * as React from "react";
import { connect } from "react-redux";
import { SessionMode, SessionSource } from "../../model/session";
import { create, init, setIteration, setMode, setName, setSource, setTeam } from "../../reducers/createActions";
import { IState } from "../../reducers/reducer";
import { IIteration, ITeam } from "../../services/teams";
import styled from "../../styles/themed-styles";
import { getIcon } from "../cardIcon";

const modeOptions: IChoiceGroupOption[] = [
    {
        iconProps: {
            iconName: getIcon(SessionMode.Azure)
        },
        key: SessionMode.Azure.toString(),
        text: "Azure",
        title: "Live estimation, provides the best experience via an Azure backend."
    },
    {
        iconProps: {
            iconName: getIcon(SessionMode.Local)
        },
        key: SessionMode.Local.toString(),
        text: "Local",
        title: "Local estimation, use this if you cannot connect to Azure."
    },
    {
        iconProps: {
            iconName: getIcon(SessionMode.Offline)
        },
        key: SessionMode.Offline.toString(),
        text: "Offline",
        title: ""
    }
];

const sourceOptions: IChoiceGroupOption[] = [
    {
        iconProps: {
            iconName: "Sprint"
        },
        key: SessionSource.Sprint.toString(),
        text: "Sprint"
    },
    {
        iconProps: {
            iconName: "QueryList"
        },
        key: SessionSource.Query.toString(),
        text: "Query"
    }
];

const FooterButton = styled.span`
    margin-right: 8px;
`;

export interface ICreatePanelOwnProps {
    onDismiss(): void;
}

interface ICreatePanelProps {
    name: string;
    mode: SessionMode;
    source: SessionSource;
    isValid: boolean;

    teams: ITeam[] | null;
    iterations: IIteration[] | null;

    team: string;
    iteration: string;
}

const Actions = {
    onInit: init,
    onSetName: setName,
    onSetMode: setMode,
    onSetSource: setSource,
    onSetTeam: setTeam,
    onSetIteration: setIteration,
    onCreate: create
};

class CreatePanel extends React.Component<ICreatePanelProps & typeof Actions & ICreatePanelOwnProps> {
    public componentDidMount() {
        this.props.onInit();
    }

    public render(): JSX.Element {
        const { name, mode, source, onDismiss, onSetName } = this.props;

        return (
            <Panel
                headerText="Create new session"
                hasCloseButton={true}
                isOpen={true}
                type={PanelType.custom}
                customWidth="400px"
                onRenderFooterContent={this.renderFooter}
                isFooterAtBottom={true}
                onDismiss={onDismiss}
            >
                <div>
                    <TextField
                        onChanged={onSetName}
                        label="Name"
                        value={name}
                    />

                    <Label>Type</Label>
                    <ChoiceGroup
                        selectedKey={mode.toString()}
                        onChanged={this.onChangeMode}
                        options={modeOptions}
                    />

                    <Label>Work items</Label>
                    <ChoiceGroup
                        selectedKey={source.toString()}
                        onChanged={this.onChangeSource}
                        options={sourceOptions}
                    />

                    {this.renderSourceSelection()}
                </div>
            </Panel>
        );
    }

    private renderSourceSelection = (): JSX.Element => {
        const { iterations, source, teams, team, iteration } = this.props;

        switch (source) {
            case SessionSource.Query:
                return (
                    <div>
                        <Dropdown
                            label="Query"
                        />
                    </div>
                );

            default:
            case SessionSource.Sprint:
                return (
                    <div>
                        <Dropdown
                            onChanged={this.onSetTeam}
                            label="Team"
                            selectedKey={team}
                            disabled={teams === null}
                            options={teams && teams.map(t => ({
                                key: t.id,
                                text: t.name
                            })) || [{
                                key: "loading",
                                text: "Loading"
                            }]}
                        />

                        <Dropdown
                            label="Sprint"
                            onChanged={this.onSetIteration}
                            selectedKey={iteration}
                            disabled={iterations === null}
                            options={iterations && iterations.map(t => ({
                                key: t.id,
                                text: t.name
                            })) || [{
                                key: "loading",
                                text: "Loading"
                            }]}
                        />
                    </div>
                );
        }
    }

    private renderFooter = () => {
        const { isValid } = this.props;

        return (
            <div>
                <FooterButton>
                    <PrimaryButton
                        onClick={this.onCreate}
                        disabled={!isValid}
                    >Create</PrimaryButton>
                </FooterButton>
                <DefaultButton>Cancel</DefaultButton>
            </div>
        );
    }

    private onChangeMode = (option: IChoiceGroupOption) => {
        const { onSetMode } = this.props;
        onSetMode(parseInt(option.key, 10) as SessionMode);
    }

    private onChangeSource = (option: IChoiceGroupOption) => {
        const { onSetSource } = this.props;
        onSetSource(parseInt(option.key, 10) as SessionSource);
    }

    private onSetTeam = (option: IDropdownOption) => {
        const { onSetTeam } = this.props;
        onSetTeam(option.key as string);
    }

    private onSetIteration = (option: IDropdownOption) => {
        const { onSetIteration } = this.props;
        onSetIteration(option.key as string);
    }

    private onCreate = () => {
        const { onCreate } = this.props;
        onCreate();
    }
}

export default connect(
    (state: IState) => ({
        name: state.create.name,
        mode: state.create.mode,
        source: state.create.source,
        isValid: state.create.name !== "",

        teams: state.create.teams,
        iterations: state.create.iterations,

        team: state.create.team,
        iteration: state.create.iteration
    }),
    Actions
)(CreatePanel);
