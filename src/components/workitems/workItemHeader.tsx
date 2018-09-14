import * as React from "react";
import styled from "../../styles/themed-styles";
import { WorkItemTypeIcon } from "./typeIcon";

export interface IWorkItemHeaderProps {
    id: number;

    title: string;

    description: string;
}

const Base = styled.div`
    min-height: 80px;
`;

const Header = styled.div`
    display: flex;
    flex-direction: column;    
    
    min-height: 32px;

    margin-bottom: 20px;
`;

const Info = styled.a`
    display: flex;
    align-items: center;

    color: rgba(0,0,0,.55);
    font-size: 14px;
    margin-right: 5px;

    text-decoration: none;
    text-transform: capitalize;

    &:hover {
        text-decoration: underline;
    }
`;

const Title = styled.div`
    flex-grow: 1;

    font-size: 18px;
    font-weight: 700;
`;

const Description = styled.div`    
    border-radius: 6px;
    background-color: rgb(244, 244, 244);

    padding: 10px;
`;

const Estimate = styled.div`

`;

export class WorkItemHeader extends React.Component<IWorkItemHeaderProps> {
    render(): JSX.Element {
        const { description, id, title } = this.props;

        return (
            <Base>
                <Header>
                    <Info href="_workitems/edit/42">
                        <WorkItemTypeIcon />
                        USER STORY {id}
                    </Info>
                    <Title>{title}</Title>
                </Header>

                <Description>
                    {description}
                </Description>

                <Estimate>
                    <label>Storypoints</label>: {"42"}
                </Estimate>
            </Base>
        );
    }
}