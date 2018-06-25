import { History } from "history";
import * as React from "react";
import { ISession } from "../model/session";
import styled from "../styles/themed-styles";
import { Card } from "./card";

const List = styled.ul`
    display: flex;
    padding: 0;
    flex-wrap: wrap;
`;

export interface ICardListProps {
    sessions: ISession[];
    history: History;
}

export class CardList extends React.Component<ICardListProps> {
    render(): JSX.Element {
        const { history, sessions } = this.props;

        return (
            <List>
                {sessions.map(session => <Card key={session.id} session={session} history={history} />)}
            </List>
        );
    }
}