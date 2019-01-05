import { IWorkItemFormNavigationService } from "azure-devops-extension-api/WorkItemTracking";
import * as DevOps from "azure-devops-extension-sdk";
import * as React from "react";
import { IWorkItem } from "../../model/workitem";
import { WorkItemTypeIcon } from "./typeIcon";
import "./workItemHeader.scss";

export interface IWorkItemHeaderProps {
    workItem: IWorkItem;
}

export class WorkItemHeader extends React.Component<IWorkItemHeaderProps> {
    render(): JSX.Element {
        const {
            workItem: { id, project, title, workItemType, icon, color }
        } = this.props;

        // This is really fragile...
        const host = DevOps.getHost();
        const url = `https://dev.azure.com/${
            host.name
        }/${project}/_workitems/edit/${id}`;

        return (
            <div className="work-item-header">
                <div className="work-item-header--header">
                    <a
                        className="work-item-header--info"
                        href={url}
                        target="_blank"
                        onClick={async ev => {
                            ev.preventDefault();

                            const service = await DevOps.getService<
                                IWorkItemFormNavigationService
                            >(
                                "ms.vss-work-web.work-item-form-navigation-service"
                            );
                            service.openWorkItem(id);
                        }}
                    >
                        <WorkItemTypeIcon icon={icon} color={color} />
                        {workItemType} {id}
                    </a>
                    <div className="work-item-header--title">{title}</div>
                </div>
            </div>
        );
    }
}
