import { PrimaryButton } from "office-ui-fabric-react";
import * as React from "react";
import { CardList } from "../../components/cardList";
import { Title } from "../../components/title";
import { ISession, SessionMode } from "../../model/session";
import styled from "../../styles/themed-styles";
import { IPageProps } from "../props";

export interface IHomePageProps extends IPageProps<{}> {
}

const Actions = styled.div`    
    display: flex;
    justify-content: flex-end
`;

export class HomePage extends React.Component<IHomePageProps> {
    render(): JSX.Element {
        const { history } = this.props;

        return (
            <div>
                <Title>Estimate</Title>

                <Actions>
                    <PrimaryButton
                        iconProps={{
                            iconName: "Add"
                        }}
                        onClick={this.create}
                    >
                        Create Session
                    </PrimaryButton>
                </Actions>

                <CardList
                    history={history}
                    sessions={[
                        {
                            id: "1",
                            mode: SessionMode.Azure,
                            name: "Sprint 149"
                        },
                        {
                            id: "2",
                            mode: SessionMode.Local,
                            name: "Mobile App"
                        },
                        {
                            id: "3",
                            mode: SessionMode.Offline,
                            name: "Backend"
                        }
                    ] as ISession[]} />
            </div>
        );
    }

    private create = () => {
        const { history } = this.props;
        history.push("/create");
    }
}