import "./workItemStoryPoints.scss";
import * as React from "react";
import { IWorkItem } from "../../model/workitem";

export const WorkItemStoryPoints: React.StatelessComponent<{
    estimate: number;
}> = props => (
    <div className="work-item-estimate">
        <label>Storypoints</label>: {props.estimate}
    </div>
);
