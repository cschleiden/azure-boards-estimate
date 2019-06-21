import { Dropdown } from "azure-devops-ui/Dropdown";
import { TitleSize } from "azure-devops-ui/Header";
import { ListSelection } from "azure-devops-ui/List";
import { IListBoxItem } from "azure-devops-ui/ListBox";
import { Panel } from "azure-devops-ui/Panel";
import {
    ITableColumn,
    renderSimpleCell,
    SimpleTableCell,
    Table
} from "azure-devops-ui/Table";
import { ArrayItemProvider } from "azure-devops-ui/Utilities/Provider";
import { Spinner, SpinnerSize } from "office-ui-fabric-react";
import * as React from "react";
import { connect } from "react-redux";
import { IField, IWorkItemType } from "../../model/workItemType";
import { IState } from "../../reducer";
import "./settings.scss";
import { close, init, setField } from "./settingsActions";

export interface ISettingsPanelOwnProps {
    onDismiss(): void;
}

interface ISettingsPanelProps {
    workItemTypes: IWorkItemType[];
    fields: null | IField[];
    loading: boolean;
}

const Actions = { init, close, setField };

class SettingsPanel extends React.Component<
    ISettingsPanelProps & typeof Actions & ISettingsPanelOwnProps
> {
    private columns: ITableColumn<IWorkItemType>[] = [
        {
            id: "name",
            name: "Work Item Type",
            renderCell: (
                rowIndex: number,
                columnIndex: number,
                tableColumn: ITableColumn<any>,
                tableItem: IWorkItemType
            ) =>
                renderSimpleCell(rowIndex, columnIndex, tableColumn, tableItem),
            width: -50
        },
        {
            id: "estimationFieldRefName",
            name: "Field",
            renderCell: (
                rowIndex: number,
                columnIndex: number,
                tableColumn: ITableColumn<any>,
                workItemType: IWorkItemType
            ) => {
                const selectedIdx = (this.props.fields || []).findIndex(
                    f => f.referenceName === workItemType.estimationFieldRefName
                );

                return (
                    <SimpleTableCell columnIndex={columnIndex}>
                        <Dropdown<IField>
                            {...{
                                onSelect: this.onSelect.bind(
                                    this,
                                    workItemType
                                ),
                                selection: new ListSelection({
                                    multiSelect: false,
                                    selectOnFocus: false,
                                    selectedRanges:
                                        selectedIdx >= 0
                                            ? [
                                                  {
                                                      beginIndex: selectedIdx,
                                                      endIndex: selectedIdx
                                                  }
                                              ]
                                            : undefined
                                }),
                                items: (this.props.fields || []).map(
                                    f =>
                                        ({
                                            id: f.referenceName,
                                            text: f.name,
                                            data: f
                                        } as IListBoxItem<IField>)
                                )
                            }}
                        />
                    </SimpleTableCell>
                );
            },
            width: -50
        }
    ];
    private onSelect = (
        workItemType: IWorkItemType,
        event: React.SyntheticEvent<HTMLElement>,
        item: IListBoxItem<IField>
    ) => {
        this.props.setField({
            ...workItemType,
            estimationFieldRefName: item.data!.referenceName
        });
    };

    public componentDidMount() {
        this.props.init();
    }

    public render(): JSX.Element {
        const { loading } = this.props;

        return (
            <Panel
                titleProps={{
                    text: "Settings",
                    size: TitleSize.Large
                }}
                onDismiss={this.onDismiss}
                blurDismiss={false}
                contentClassName="custom-scrollbar"
            >
                {loading ? (
                    <div className="flex-column flex-grow justify-center">
                        <Spinner size={SpinnerSize.large} />
                    </div>
                ) : (
                    <div className="settings-panel--content">
                        <p>
                            Select a field to store the estimation for each work
                            item type you are planning to estimate.
                        </p>

                        <p>
                            Please make sure the selected field has the correct
                            field type.
                        </p>

                        <Table<IWorkItemType>
                            columns={this.columns}
                            itemProvider={
                                new ArrayItemProvider(this.props.workItemTypes)
                            }
                        />
                    </div>
                )}
            </Panel>
        );
    }

    private onDismiss = () => {
        this.props.close();

        const { onDismiss } = this.props;
        onDismiss();
    };
}

export default connect(
    (state: IState) => ({
        workItemTypes: state.settings.workItemTypes,
        fields: state.settings.fields,
        loading: state.settings.loading
    }),
    Actions
)(SettingsPanel);
