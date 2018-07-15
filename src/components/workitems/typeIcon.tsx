import * as React from "react";
import styled from "../../styles/themed-styles";

// tslint:disable-next-line:no-empty-interface
export interface IWorkItemTypeIconProps {
}

const Icon = styled.img`
    width: 14px;
    height: 14px;
    margin-right: 5px;
`;

export class WorkItemTypeIcon extends React.Component<IWorkItemTypeIconProps> {
    render(): JSX.Element {
        return (
            <Icon src="https://tfsprodch1su1.visualstudio.com/_apis/wit/workItemIcons/icon_book?color=009CCC&v=2" />
        );
    }
}