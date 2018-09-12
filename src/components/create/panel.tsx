import { ChoiceGroup, Dropdown, IChoiceGroupOption, IDropdownOption, IRenderFunction, Label, Panel, PanelType, TextField, TooltipHost } from "office-ui-fabric-react";
import * as React from "react";
import { connect } from "react-redux";
import { ICardSet } from "../../model/cards";
import { SessionMode, SessionSource } from "../../model/session";
import { create, init, setCardSet, setIteration, setMode, setName, setSource, setTeam } from "../../pages/create/createActions";
import { IState } from "../../reducer";
import { IIteration, ITeam } from "../../services/teams";
import styled from "../../styles/themed-styles";
import { DefaultButton, PrimaryButton } from "../buttons";
import { getIconForMode } from "../cardIcon";
import { Title } from "../title";
import { CardSetPicker } from "./cardSetPicker";

const { icon: onlineIcon, description: onlineDescription } = getIconForMode(SessionMode.Online);
const { icon: offlineIcon, description: offlineDescription } = getIconForMode(SessionMode.Offline);

const renderOptionWithTooltip: IRenderFunction<IChoiceGroupOption> = (option, defaultRender) => {
    return (
        <TooltipHost content={option!.title}>
            {defaultRender!(option)}
        </TooltipHost>
    );
};

const modeOptions: IChoiceGroupOption[] = [
    {
        iconProps: {
            iconName: onlineIcon
        },
        key: SessionMode.Online.toString(),
        text: "Online",
        title: onlineDescription,
        onRenderField: renderOptionWithTooltip
    },
    {
        iconProps: {
            iconName: offlineIcon
        },
        key: SessionMode.Offline.toString(),
        text: "Offline",
        title: offlineDescription,
        onRenderField: renderOptionWithTooltip
    }
];

const sourceOptions: IChoiceGroupOption[] = [
    {
        iconProps: {
            iconName: "Sprint"
        },
        key: SessionSource.Sprint.toString(),
        text: "Sprint",
        onRenderField: renderOptionWithTooltip
    },
    {
        iconProps: {
            iconName: "QueryList"
        },
        key: SessionSource.Query.toString(),
        text: "Query",
        onRenderField: renderOptionWithTooltip
    }
];

const Header = styled.div`
    padding: 40px;
`;

const HeaderTitle = Title.extend`
    font-size: 21px;
    font-weight: semi-bold;
`;

const Footer = styled.div`
    display: flex;
    justify-content: flex-end;
`;

const FooterButton = styled.span`
    margin-left: 8px;
`;

const Group = styled.div`
    margin-bottom: 20px;
`;

const CPanel = styled(Panel)`
    margin: 20px;
    
    .ms-Panel-main {        
        border-radius: 6px;        
        box-shadow: 0px 25.6px 57.6px rgba(0, 0, 0, 0.22), 0px 4.8px 14.4px rgba(0, 0, 0, 0.18);    
    }

    .ms-Panel-contentInner {
        top: 84px;
    }
`;

export interface ICreatePanelOwnProps {
    onDismiss(): void;
}

interface ICreatePanelProps {
    name: string;
    cardSet: string;
    mode: SessionMode;
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
    onSetMode: setMode,
    onSetName: setName,
    onSetSource: setSource,
    onSetTeam: setTeam,
    onSetIteration: setIteration,
    onSetCardSet: setCardSet,
    onCreate: create
};

class CreatePanel extends React.Component<ICreatePanelProps & typeof Actions & ICreatePanelOwnProps> {
    public componentDidMount() {
        this.props.onInit();
    }

    public render(): JSX.Element {
        const { name, cardSet, mode, source, onDismiss, onSetName, cardSets } = this.props;

        return (
            <CPanel
                hasCloseButton={true}
                isOpen={true}
                type={PanelType.custom}
                customWidth="400px"
                onRenderNavigation={this.renderHeader}
                onRenderFooterContent={this.renderFooter}
                isFooterAtBottom={true}
                onDismiss={onDismiss}
            >
                <div>
                    <Group>
                        <TextField
                            onChanged={onSetName}
                            label="Name"
                            value={name}
                        />
                    </Group>

                    <Group>
                        <Label>Mode</Label>
                        <ChoiceGroup
                            selectedKey={mode.toString()}
                            onChanged={this.onChangeMode}
                            options={modeOptions}
                        />
                    </Group>

                    <Group>
                        <Label>Work items</Label>
                        <ChoiceGroup
                            selectedKey={source.toString()}
                            onChanged={this.onChangeSource}
                            options={sourceOptions}
                        />

                        {this.renderSourceSelection()}
                    </Group>

                    <Group>
                        <Label>Cards</Label>
                        <CardSetPicker cardSets={cardSets} selectedCardSetId={cardSet || ""} onChange={this.onChangeCardSet} />
                    </Group>
                </div>
            </CPanel>
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

    private renderHeader = () => {
        return (
            <Header>
                <HeaderTitle>Create new session</HeaderTitle>
            </Header>
        );
    }

    private renderFooter = () => {
        const { isValid, onDismiss } = this.props;

        return (
            <Footer>
                <DefaultButton onClick={onDismiss}>Cancel</DefaultButton>
                <FooterButton>
                    <PrimaryButton
                        onClick={this.onCreate}
                        disabled={!isValid}
                    >
                        Create
                    </PrimaryButton>
                </FooterButton>
            </Footer>
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

    private onChangeCardSet = (cardSet: ICardSet) => {
        const { onSetCardSet } = this.props;
        onSetCardSet(cardSet.id);
    }

    private onCreate = () => {
        const { onCreate } = this.props;
        onCreate();
    }
}

export default connect(
    (state: IState) => ({
        name: state.create.session.name,
        cardSet: state.create.session.cardSet,
        mode: state.create.session.mode,
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
