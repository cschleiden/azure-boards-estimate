import { TitleSize } from "azure-devops-ui/Header";
import { Panel } from "azure-devops-ui/Panel";
import {
    renderSimpleCell,
    Table,
    TableColumnLayout,
    ITableColumn,
    SimpleTableCell
} from "azure-devops-ui/Table";
import { ArrayItemProvider } from "azure-devops-ui/Utilities/Provider";
import { Dropdown } from "azure-devops-ui/Dropdown";
import * as React from "react";
import { connect } from "react-redux";
import { IWorkItemType, IField } from "../../model/workItemType";
import { IState } from "../../reducer";
import "./settings.scss";
import { init } from "./settingsActions";
import { ListSelection } from "azure-devops-ui/List";
import { IListBoxItem } from "azure-devops-ui/ListBox";

export interface ISettingsPanelOwnProps {
    onDismiss(): void;
}

interface ISettingsPanelProps {
    workItemTypes: IWorkItemType[];
    fields: null | IField[];
}

const Actions = { init };

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
                tableItem: IWorkItemType
            ) => {
                const selectedIdx = (this.props.fields || []).findIndex(
                    f => f.referenceName === tableItem.estimationFieldRefName
                );

                return (
                    <SimpleTableCell columnIndex={columnIndex}>
                        <Dropdown<IField>
                            listBoxProps={{
                                onSelect: this.onSelect,
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
                                items: (this.props.fields || []).map(f => ({
                                    id: f.referenceName,
                                    text: f.name,
                                    ...f
                                }))
                            }}
                        />
                    </SimpleTableCell>
                );
            },
            width: -50
        }
    ];
    private onSelect = (
        event: React.SyntheticEvent<HTMLElement>,
        item: IListBoxItem<IField>
    ) => {};

    public componentDidMount() {
        this.props.init();
    }

    public render(): JSX.Element {
        const { onDismiss } = this.props;

        return (
            <Panel
                titleProps={{
                    text: "Settings",
                    size: TitleSize.Large
                }}
                onDismiss={onDismiss}
                blurDismiss={false}
                contentClassName="custom-scrollbar"
            >
                <div className="settings-panel--content">
                    <div>
                        Select a field to store the estimation for each work
                        item type you are planning to estimate.
                    </div>

                    <Table<IWorkItemType>
                        columns={this.columns}
                        itemProvider={
                            new ArrayItemProvider(this.props.workItemTypes)
                        }
                    />
                </div>
            </Panel>
        );
    }
}

export default connect(
    (state: IState) => ({
        workItemTypes: state.settings.workItemTypes,
        fields: state.settings.fields
    }),
    Actions
)(SettingsPanel);
