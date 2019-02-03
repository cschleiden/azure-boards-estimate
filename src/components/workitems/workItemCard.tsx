import "./workItemCard.scss";
import * as React from "react";
import { WorkItemTypeIcon } from "./typeIcon";
import { css } from "../../lib/css";
import { Card } from "azure-devops-ui/Card";
import { TitleSize } from "azure-devops-ui/Header";
import { IWorkItem } from "../../model/workitem";

export interface IWorkItemCardProps {
    workItem: IWorkItem;

    estimate?: string;

    selected: boolean;

    onClick: () => void;
}

export class WorkItemCard extends React.Component<IWorkItemCardProps> {
    render(): JSX.Element {
        const {
            workItem: { id, title, icon, color },
            estimate,
            selected,
            onClick
        } = this.props;

        return (
            <Card
                className={css(
                    "flex-grow",
                    "bolt-card-white",
                    "work-item-card",
                    selected && "selected"
                )}
            >
                <div className="flex-grow" onClick={onClick}>
                    <div className="work-item-card--info">
                        <div className="work-item-card--meta">
                            <WorkItemTypeIcon icon={icon} color={color} />
                            <div className="work-item-card--id">{id}</div>
                        </div>
                        <div className="work-item-card--title">{title}</div>
                    </div>

                    <div className="work-item-card--estimate">{estimate}</div>
                </div>
            </Card>
        );
    }
}
