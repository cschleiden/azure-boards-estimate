import * as React from "react";
import styled, { css } from "../../styles/themed-styles";
import { WorkItemTypeIcon } from "./typeIcon";

export interface IWorkItemCardProps {
    id: number;

    title: string;

    estimate?: number;

    selected: boolean;

    onClick: () => void;
}

const Card = styled.div<{
    selected: boolean;
}>`
    border-left: 4px solid #0078D7;
    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.08);
    border-radius: 4px;
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;

    cursor: pointer;

    min-height: 40px;

    padding: 8px;
    margin-bottom: 15px;

    flex-grow: 1;

    transition: 0.3s linear all;

    &:hover {
        background-color: rgb(230, 230, 230);
    }

    ${props => props.selected && css`
        background-color: lightblue;
    `}
`;

const Info = styled.div`
    display: flex;
    align-items: center;
`;

const Id = styled.span`font-weight: bold; margin-right: 5px;`;

const Title = styled.span``;

const Estimate = styled.div`
    text-align: right;
    font-weight: bold;
`;

export class WorkItemCard extends React.Component<IWorkItemCardProps> {
    render(): JSX.Element {
        const { id, estimate, title, selected, onClick } = this.props;

        return (
            <Card selected={selected} onClick={onClick}>
                <Info>
                    <WorkItemTypeIcon />
                    <Id>{id}</Id>
                    <Title>{title}</Title>
                </Info>

                <Estimate>{estimate}</Estimate>
            </Card>
        );
    }
}