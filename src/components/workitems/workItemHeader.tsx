import * as React from "react";
import "./workItemHeader.scss";
import { WorkItemTypeIcon } from "./typeIcon";

export interface IWorkItemHeaderProps {
    id: number;

    typeName: string;

    title: string;

    description: string;
}

export class WorkItemHeader extends React.Component<IWorkItemHeaderProps> {
    render(): JSX.Element {
        const { description, id, title, typeName } = this.props;

        return (
            <div className="work-item-header">
                <div className="work-item-header--header">
                    <a
                        className="work-item-header--info"
                        href={`_workitems/edit/${id}`}
                    >
                        <WorkItemTypeIcon />
                        {typeName} {id}
                    </a>
                    <div className="work-item-header--title">{title}</div>
                </div>

                <div className="work-item-header--description">
                    {description}
                </div>

                <div className="work-item-header--estimate">
                    <label>Storypoints</label>: {"42"}
                </div>
            </div>
        );
    }
}
