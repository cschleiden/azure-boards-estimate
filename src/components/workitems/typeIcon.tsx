import * as React from "react";
import "./typeIcon.scss";

export interface IWorkItemTypeIconProps {
    icon?: string;
    color?: string;
}

export class WorkItemTypeIcon extends React.Component<IWorkItemTypeIconProps> {
    render(): JSX.Element | null {
        const { icon, color } = this.props;

        if (!icon || !color) {
            return null;
        }

        return (
            <img
                className="work-item-type-icon"
                src={`https://tfsprodch1su1.visualstudio.com/_apis/wit/workItemIcons/${icon}?color=${color}&v=2`}
            />
        );
    }
}
