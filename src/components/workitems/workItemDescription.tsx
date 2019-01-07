import "./workItemDescription.scss";
import * as React from "react";
import { IWorkItem } from "../../model/workitem";

export const WorkItemDescription: React.StatelessComponent<{
    workItem: IWorkItem;
}> = props => (
    <div className="work-item-description">
        <div
            className="html-content"
            dangerouslySetInnerHTML={{
                __html: props.workItem.description
            }}
        />
    </div>
);
