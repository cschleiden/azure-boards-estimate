import * as React from "react";
import styled from "../styles/themed-styles";
import { Title } from "./title";

export interface IHeaderProps {
    title: string;

    buttons: JSX.Element;
}

const HeaderArea = styled.div` 
    display: flex;
    margin: 20px 0;
    line-height: 40px;
`;

const ActionArea = styled.div`    
    display: flex;
    justify-content: flex-end;
    align-self: flex-center;
`;

export class Header extends React.Component<IHeaderProps> {
    render(): JSX.Element {
        const { title, buttons } = this.props;

        return (
            <HeaderArea>
                <Title>{title}</Title>

                <ActionArea>
                    {buttons}
                </ActionArea>
            </HeaderArea>
        );
    }
}