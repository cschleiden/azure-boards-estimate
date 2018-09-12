import { History } from "history";
import * as React from "react";
import { ISession } from "../model/session";
import styled from "../styles/themed-styles";
import { CardIcon } from "./cardIcon";
import { makeUrlSafe } from "../lib/urlSafe";

const CardFrame = styled.a`
    text-decoration: none;
    color: black;
    transition: background-color .5s ease;
    border-radius: 4px;
    height: 100px;
    max-width: 440px;
    min-width: 200px;
    flex-basis: 200px;
    margin-right: 32px;
    margin-bottom: 32px;
    background-color: rgb(248, 248, 248);
    padding: 20px;
    cursor: pointer;

    display: flex;
    flex-direction: column; 

    &:hover {
        background-color: rgb(234, 234, 234);
    }

    &:hover, &:active, &:visited {
        color: black;
        text-decoration: none;
    }
`;

const CardTitle = styled.h2`
    font-weight: 600;
    font-size: 18px;
    margin: 0;
`;

const CardMode = styled.div`
    flex-grow: 1;
    display: flex;
    align-items: flex-end;
    justify-content: flex-end;
`;

export interface ICardProps {
    history: History;
    session: ISession;
}

export class SessionCard extends React.Component<ICardProps> {
    render(): JSX.Element {
        const { session: { id, mode, name, source } } = this.props;

        return (
            <CardFrame href={`/session/${id}/${makeUrlSafe(name)}`} onClick={this.navigate}>
                <CardTitle>{name}</CardTitle>

                <CardMode>
                    <CardIcon mode={mode} source={source} />
                </CardMode>
            </CardFrame>
        );
    }

    private navigate = (e: React.MouseEvent<HTMLAnchorElement>) => {
        const { history, session: { id, name } } = this.props;

        history.push(`/session/${id}/${makeUrlSafe(name)}`);
        e.preventDefault();
    }
}