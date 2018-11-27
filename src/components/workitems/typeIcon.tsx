import * as React from "react";
import "./typeIcon.scss";

export interface IWorkItemTypeIconProps {}

export class WorkItemTypeIcon extends React.Component<IWorkItemTypeIconProps> {
    render(): JSX.Element {
        return (
            <img
                className="work-item-type-icon"
                src="https://tfsprodch1su1.visualstudio.com/_apis/wit/workItemIcons/icon_book?color=009CCC&v=2"
            />
        );
    }
}
