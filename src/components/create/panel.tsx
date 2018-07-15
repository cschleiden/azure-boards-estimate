import { ChoiceGroup, Dropdown, IChoiceGroupOption, IDropdownOption, Label, Panel, PanelType, TextField } from "office-ui-fabric-react";
import * as React from "react";
import { connect } from "react-redux";
import { ICardSet } from "../../model/cards";
import { SessionSource } from "../../model/session";
import { create, init, setIteration, setName, setSource, setTeam } from "../../pages/create/createActions";
import { IState } from "../../reducer";
import { IIteration, ITeam } from "../../services/teams";
import styled from "../../styles/themed-styles";
import { DefaultButton, PrimaryButton } from "../buttons";

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
    source: SessionSource;
    isValid: boolean;

    teams: ITeam[] | null;
    iterations: IIteration[] | null;

    team: string;
    iteration: string;

    cardSets: ICardSet[];
}

const Actions = {
    onInit: init,
    onSetName: setName,
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
        const { name, source, onDismiss, onSetName, cardSets } = this.props;

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

                    <Label>Work items</Label>
                    <ChoiceGroup
                        selectedKey={source.toString()}
                        onChanged={this.onChangeSource}
                        options={sourceOptions}
                    />

                    {this.renderSourceSelection()}

                    <Label>Cards</Label>
                    <Dropdown
                        options={cardSets && cardSets.map(cs => ({
                            key: cs.id,
                            text: cs.name
                        })) || []}
                    />
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
        const { isValid, onDismiss } = this.props;

        return (
            <div>
                <FooterButton>
                    <PrimaryButton
                        onClick={this.onCreate}
                        disabled={!isValid}
                    >
                        Create
                    </PrimaryButton>
                </FooterButton>
                <DefaultButton onClick={onDismiss}>Cancel</DefaultButton>
            </div>
        );
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
        name: state.create.session.name,
        source: state.create.session.source,
        isValid: state.create.session.name !== "",

        teams: state.create.teams,
        iterations: state.create.iterations,

        team: state.create.team,
        iteration: state.create.iteration,

        cardSets: state.create.cardSets
    }),
    Actions
)(CreatePanel);
