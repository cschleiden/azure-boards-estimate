import "./workItemCard.scss";
import * as React from "react";
import { WorkItemTypeIcon } from "./typeIcon";
import { css } from "../../lib/css";

export interface IWorkItemCardProps {
    id: number;

    title: string;

    estimate?: string;

    selected: boolean;

    onClick: () => void;
}

export class WorkItemCard extends React.Component<IWorkItemCardProps> {
    render(): JSX.Element {
        const { id, estimate, title, selected, onClick } = this.props;

        return (
            <div
                className={css("work-item-card", selected && "selected")}
                onClick={onClick}
            >
                <div className="work-item-card--info">
                    <div className="work-item-card--meta">
                        <WorkItemTypeIcon />
                        <div className="work-item-card--id">{id}</div>
                    </div>
                    <div className="work-item-card--title">{title}</div>
                </div>

                <div className="work-item-card--estimate">{estimate}</div>
            </div>
        );
    }
}
