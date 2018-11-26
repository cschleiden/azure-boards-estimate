import * as React from "react";
import "./header.scss";
import { Title } from "./title";

export interface IHeaderProps {
    title: string;

    buttons: JSX.Element;
}

export class Header extends React.Component<IHeaderProps> {
    render(): JSX.Element {
        const { title, buttons } = this.props;

        return (
            <div className="header">
                <Title>{title}</Title>

                <div className="header--actions">{buttons}</div>
            </div>
        );
    }
}
