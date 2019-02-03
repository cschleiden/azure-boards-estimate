import { TitleSize } from "azure-devops-ui/Header";
import { Panel } from "azure-devops-ui/Panel";
import { TextField } from "azure-devops-ui/TextField";
import { Tooltip } from "azure-devops-ui/TooltipEx";
import {
    ChoiceGroup,
    Dropdown,
    IChoiceGroupOption,
    IDropdownOption,
    IRenderFunction
} from "office-ui-fabric-react";
import * as React from "react";
import { connect } from "react-redux";
import { ICardSet } from "../../model/cards";
import { SessionMode, SessionSource } from "../../model/session";
import {
    create,
    init,
    reset,
    setCardSet,
    setIteration,
    setMode,
    setName,
    setQuery,
    setSource,
    setTeam
} from "../../pages/create/createActions";
import { isValid } from "../../pages/create/createSelector";
import { IState } from "../../reducer";
import { IIteration, ITeam } from "../../services/teams";
import { getIconForMode } from "../cardIcon";
import { QueryPicker } from "../controls/queryPicker";
import { CardSetPicker } from "./cardSetPicker";
import "./panel.scss";

const { icon: onlineIcon, description: onlineDescription } = getIconForMode(
    SessionMode.Online
);
const { icon: offlineIcon, description: offlineDescription } = getIconForMode(
    SessionMode.Offline
);

const renderOptionWithTooltip: IRenderFunction<IChoiceGroupOption> = (
    option: any,
    defaultRender: any
) => {
    return <Tooltip text={option!.title}>{defaultRender!(option)}</Tooltip>;
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
    },
    {
        iconProps: {
            iconName: "WorkItem"
        },
        key: SessionSource.Ids.toString(),
        text: "Work Items",
        onRenderField: renderOptionWithTooltip
    }
];

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
    queryId: string;

    cardSets: ICardSet[];
}

const Actions = {
    onInit: init,
    onReset: reset,
    onSetMode: setMode,
    onSetName: setName,
    onSetSource: setSource,
    onSetQuery: setQuery,
    onSetTeam: setTeam,
    onSetIteration: setIteration,
    onSetCardSet: setCardSet,
    onCreate: create
};

class CreatePanel extends React.Component<
    ICreatePanelProps & typeof Actions & ICreatePanelOwnProps
> {
    public componentDidMount() {
        this.props.onInit();
    }

    public render(): JSX.Element {
        const {
            name,
            cardSet,
            mode,
            source,
            onDismiss,
            cardSets,
            isValid
        } = this.props;

        return (
            <Panel
                titleProps={{
                    text: "Create new session",
                    size: TitleSize.Large
                }}
                onDismiss={onDismiss}
                blurDismiss={false}
                footerButtonProps={[
                    { onClick: this.dismiss, text: "Cancel" },
                    {
                        onClick: this.onCreate,
                        text: "Create",
                        disabled: !isValid,
                        primary: true
                    }
                ]}
            >
                <div className="create-panel--content">
                    <div className="create-panel--group">
                        <TextField
                            onChange={this.onChangeName}
                            value={name}
                            placeholder="Session title"
                        />
                    </div>

                    <div className="create-panel--group">
                        <label className="create-panel--group-label">
                            Mode
                        </label>
                        <ChoiceGroup
                            selectedKey={mode.toString()}
                            onChanged={this.onChangeMode}
                            options={modeOptions}
                        />
                    </div>

                    <div className="create-panel--group">
                        <label className="create-panel--group-label">
                            Work items
                        </label>
                        <ChoiceGroup
                            selectedKey={source.toString()}
                            onChanged={this.onChangeSource}
                            options={sourceOptions}
                        />

                        {this.renderSourceSelection()}
                    </div>

                    <div className="create-panel--group">
                        <label className="create-panel--group-label">
                            Cards
                        </label>
                        <CardSetPicker
                            cardSets={cardSets}
                            selectedCardSetId={cardSet || ""}
                            onChange={this.onChangeCardSet}
                        />
                    </div>
                </div>
            </Panel>
        );
    }

    private renderSourceSelection = (): JSX.Element => {
        const {
            iterations,
            source,
            teams,
            team,
            iteration,
            queryId
        } = this.props;

        switch (source) {
            case SessionSource.Query:
                return (
                    <div>
                        <QueryPicker
                            defaultSelectedQueryId={queryId || undefined}
                            onChanged={this.onSetQuery}
                        />
                    </div>
                );

            case SessionSource.Ids:
                return (
                    <div>
                        Go to the backlog or a query result and select
                        "Estimate" from the context menu
                    </div>
                );

            default:
            case SessionSource.Sprint:
                return (
                    <div>
                        <Dropdown
                            onChange={this.onSetTeam}
                            label="Team"
                            placeHolder="Select Team"
                            selectedKey={team}
                            disabled={teams === null}
                            options={
                                (teams &&
                                    teams.map(t => ({
                                        key: t.id,
                                        text: t.name
                                    }))) || [
                                    { key: "loading", text: "Loading" }
                                ]
                            }
                        />

                        <Dropdown
                            label="Sprint"
                            onChanged={this.onSetIteration}
                            placeHolder="Select Sprint"
                            selectedKey={iteration}
                            disabled={iterations === null}
                            options={
                                (iterations &&
                                    iterations.map(t => ({
                                        key: t.id,
                                        text: t.name
                                    }))) || [
                                    { key: "loading", text: "Loading" }
                                ]
                            }
                        />
                    </div>
                );
        }
    };

    private onChangeName = (ev: React.ChangeEvent, value: string) => {
        const { onSetName } = this.props;
        onSetName(value);
    };

    private onChangeMode = (option: IChoiceGroupOption) => {
        const { onSetMode } = this.props;
        onSetMode(parseInt(option.key, 10) as SessionMode);
    };
    private onChangeSource = (option: IChoiceGroupOption) => {
        const { onSetSource } = this.props;
        onSetSource(parseInt(option.key, 10) as SessionSource);
    };

    private onSetTeam = (
        _: React.FormEvent<HTMLDivElement>,
        option?: IDropdownOption
    ) => {
        const { onSetTeam } = this.props;
        onSetTeam(option!.key as string);
    };

    private onSetIteration = (option: IDropdownOption) => {
        const { onSetIteration } = this.props;
        onSetIteration(option.key as string);
    };

    private onSetQuery = (queryId: string) => {
        const { onSetQuery } = this.props;
        onSetQuery(queryId);
    };

    private onChangeCardSet = (cardSet: ICardSet) => {
        const { onSetCardSet } = this.props;
        onSetCardSet(cardSet.id);
    };

    private onCreate = () => {
        const { onCreate } = this.props;
        onCreate();
    };

    private dismiss = () => {
        const { onReset, onDismiss } = this.props;
        onReset();
        onDismiss();
    };
}

export default connect(
    (state: IState) => ({
        name: state.create.session.name,
        cardSet: state.create.session.cardSet,
        mode: state.create.session.mode,
        source: state.create.session.source,
        isValid: isValid(state.create),

        teams: state.create.teams,
        iterations: state.create.iterations,

        team: state.create.team,
        iteration: state.create.iteration,

        queryId: state.create.queryId,

        cardSets: state.create.cardSets || []
    }),
    Actions
)(CreatePanel);
