import { IRenderFunction } from "@uifabric/utilities/lib";
import { getClient, IProjectPageService } from "azure-devops-extension-api";
import {
    QueryHierarchyItem,
    WorkItemTrackingRestClient
} from "azure-devops-extension-api/WorkItemTracking";
import * as DevOps from "azure-devops-extension-sdk";
import { Dropdown, IDropdownOption } from "office-ui-fabric-react/lib/Dropdown";
import {
    ISelectableOption,
    SelectableOptionMenuItemType
} from "office-ui-fabric-react/lib/utilities/selectableOption/SelectableOption.types";
import * as React from "react";
import "./queryPicker.scss";
import { Button } from "azure-devops-ui/Button";

interface IQueryOption extends ISelectableOption {
    hasChildren: boolean;
    isExpanded: boolean;
    level: number;

    queryTreeItem: IQueryTreeItem;
}

interface IQueryTreeItem {
    parentId: string | null;
    item: QueryHierarchyItem;

    childrenFetched: boolean;
    isExpanded: boolean;
}

export interface IQueryPickerProps {
    defaultSelectedQueryId?: string;

    onChanged?(queryId: string): void;
}

export interface IQueryPickerState {
    options: IQueryOption[];

    isLoading: boolean;
}

export class QueryPicker extends React.Component<
    IQueryPickerProps,
    IQueryPickerState
> {
    private queryTree: IQueryTreeItem[] = [];
    private queryTreeLookup: { [key: string]: IQueryTreeItem } = {};

    constructor(props: IQueryPickerProps) {
        super(props);

        this.state = {
            options: [],
            isLoading: true
        };
    }

    async componentDidMount() {
        const { defaultSelectedQueryId } = this.props;

        const projectService: IProjectPageService = await DevOps.getService<
            IProjectPageService
        >("ms.vss-tfs-web.tfs-page-data-service");
        const project = await projectService.getProject();

        const queryItems = await getClient(
            WorkItemTrackingRestClient
        ).getQueries(project!.id, 4, 0);

        // Only take Shared Queries
        this._mapQueryItems(queryItems.filter(x => x.isPublic));

        if (defaultSelectedQueryId) {
            await this.setInitial(defaultSelectedQueryId);
        }

        this._updateState();

        this.setState({
            isLoading: false
        });
    }

    private async setInitial(id: string): Promise<void> {
        const client = getClient(WorkItemTrackingRestClient);

        // If selected query id is given, build up tree
        const projectService: IProjectPageService = await DevOps.getService<
            IProjectPageService
        >("ms.vss-tfs-web.tfs-page-data-service");
        const project = await projectService.getProject();
        const queryItem = await client.getQuery(project!.id, id, 4, 0);

        // Retrieve parent elements
        const path = queryItem.path;
        const pathSegments = path.split("/");
        // Remove own element since it's not a folder
        pathSegments.pop();

        let parent: IQueryTreeItem | null = null;
        for (let i = 0; i < pathSegments.length; ++i) {
            let parentQueryItem = await client.getQuery(
                project!.id,
                pathSegments.slice(0, i + 1).join("/"),
                4,
                1
            );

            if (this.queryTreeLookup[parentQueryItem.id]) {
                parent = this.queryTreeLookup[parentQueryItem.id];
            } else {
                parent = this._mapQueryItem(
                    parent && parent.item.id,
                    parentQueryItem
                );
            }

            for (const childItem of parentQueryItem.children) {
                this._mapQueryItem(parentQueryItem.id as string, childItem);
            }

            parent.isExpanded = true;
            parent.childrenFetched = true;
        }
    }

    render(): JSX.Element {
        const { defaultSelectedQueryId } = this.props;
        const { isLoading, options } = this.state;

        return (
            <Dropdown
                label={"Select query"}
                placeHolder={isLoading ? "Loading..." : "Select query"}
                options={options}
                onRenderItem={
                    this._onRenderItem as IRenderFunction<ISelectableOption>
                }
                onRenderOption={
                    this._onRenderOption as IRenderFunction<ISelectableOption>
                }
                onChanged={
                    this._onChanged as (
                        option: IDropdownOption,
                        index?: number
                    ) => void
                }
                disabled={isLoading}
                selectedKey={
                    (!isLoading && defaultSelectedQueryId) || undefined
                }
            />
        );
    }

    private _onChanged = (option: IQueryOption) => {
        const { onChanged } = this.props;
        if (onChanged) {
            onChanged(option.queryTreeItem.item.id);
        }
    };

    private _buildOptions(): IQueryOption[] {
        const result: IQueryOption[] = [];

        const stack: IQueryTreeItem[] = [];

        stack.push(...this.queryTree.slice(0).reverse());
        while (stack.length > 0) {
            const l = stack.length;
            for (let i = 0; i < l; ++i) {
                const treeItem = stack.pop()!;

                let level = 0;
                let parentId = treeItem.parentId;
                while (parentId) {
                    ++level;
                    parentId = this.queryTreeLookup[parentId].parentId;
                }

                result.push({
                    key: treeItem.item.id,
                    text: treeItem.item.name,
                    hasChildren: treeItem.item.hasChildren,
                    isExpanded: treeItem.isExpanded,
                    level,
                    queryTreeItem: treeItem,
                    itemType: treeItem.item.hasChildren
                        ? SelectableOptionMenuItemType.Header
                        : SelectableOptionMenuItemType.Normal
                });

                if (treeItem.item.hasChildren && treeItem.isExpanded) {
                    if (treeItem.childrenFetched) {
                        stack.push(
                            ...treeItem.item.children
                                .map(c => this.queryTreeLookup[c.id])
                                .reverse()
                        );
                    } else {
                        // Add dummy loading item if loading children
                        result.push({
                            key: treeItem.item.id + "-loading",
                            text: "Loading...",
                            hasChildren: false,
                            isExpanded: false,
                            // Indent by one level
                            level: level + 1,
                            queryTreeItem: treeItem
                        });
                    }
                }
            }
        }

        return result;
    }

    private _onRenderItem = (
        item: IQueryOption | undefined,
        defaultRender: (props: IQueryOption | undefined) => JSX.Element
    ): JSX.Element => {
        if (
            item &&
            item.key &&
            this.queryTreeLookup[item.key] &&
            this.queryTreeLookup[item.key].item.hasChildren
        ) {
            return (
                <div className="query-option" key={item.queryTreeItem.item.id}>
                    {this._onRenderOption(item)}
                </div>
            );
        }

        return defaultRender(item);
    };

    private _onRenderOption = (option: IQueryOption): JSX.Element => {
        const marginLeft = option.level * 10;

        return (
            <div
                className="query-item"
                key={option.queryTreeItem.item.id}
                style={{
                    paddingLeft: (option.hasChildren && marginLeft) || 0
                }}
            >
                {option.hasChildren && (
                    <Button
                        subtle={true}
                        iconProps={{
                            iconName: option.isExpanded
                                ? "ChevronDown"
                                : "ChevronRight"
                        }}
                        onClick={ev => this._toggle(ev, option)}
                    />
                )}
                {!option.hasChildren && (
                    <div
                        className="query-item--spacer"
                        style={{ marginLeft }}
                    />
                )}
                <div>{option.text}</div>
            </div>
        );
    };

    private _mapQueryItems(queryItems: QueryHierarchyItem[]) {
        for (const queryItem of queryItems) {
            this.queryTree.push(this._mapQueryItem(null, queryItem));
        }
    }

    private _mapQueryItem(
        parentId: string | null,
        queryItem: QueryHierarchyItem
    ): IQueryTreeItem {
        let parentItem: IQueryTreeItem | null = null;
        if (parentId) {
            parentItem = this.queryTreeLookup[parentId];
        }

        const treeItem: IQueryTreeItem = {
            parentId: parentId,
            item: queryItem,
            childrenFetched: false,
            isExpanded: false
        };

        if (parentItem) {
            if (!parentItem.item.children) {
                parentItem.item.children = [];
            }

            if (!parentItem.item.children.some(i => i.id === queryItem.id)) {
                parentItem.item.children.push(queryItem);

                // Ensure children are sorted
                parentItem.item.children.sort(comparer);
            }
        }

        this.queryTreeLookup[queryItem.id] = treeItem;

        return treeItem;
    }

    /** Expand/collapse a node */
    private _toggle = async (
        ev: React.MouseEvent<any> | React.KeyboardEvent<any>,
        option: IQueryOption
    ) => {
        // Do this first before React reuses the event (this saves persisting)
        ev.preventDefault();
        ev.stopPropagation();

        const queryTreeItem = this.queryTreeLookup[option.key];
        queryTreeItem.isExpanded = !queryTreeItem.isExpanded;

        if (!queryTreeItem.childrenFetched) {
            const projectService: IProjectPageService = await DevOps.getService<
                IProjectPageService
            >("ms.vss-tfs-web.tfs-page-data-service");
            const project = await projectService.getProject();

            getClient(WorkItemTrackingRestClient)
                .getQuery(project!.id, option.key as string, 4, 1)
                .then(queryItem => {
                    // Add in items
                    queryTreeItem.childrenFetched = true;

                    for (const childItem of queryItem.children) {
                        this._mapQueryItem(option.key as string, childItem);
                    }

                    this._updateState();
                });
        }

        this._updateState();
    };

    private _updateState() {
        // Re-build options
        this.setState({
            options: this._buildOptions()
        });
    }
}

function comparer(a: QueryHierarchyItem, b: QueryHierarchyItem): number {
    if (a.isFolder && !b.isFolder) {
        return -1;
    } else if (!a.isFolder && b.isFolder) {
        return 1;
    }

    return a.name.localeCompare(b.name);
}
