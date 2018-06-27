import { ChoiceGroup, DefaultButton, IChoiceGroupOption, Label, Panel, PanelType, PrimaryButton, TextField } from "office-ui-fabric-react";
import * as React from "react";
import { getIcon } from "../../components/cardIcon";
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

const FooterButton = styled.span`
    margin-right: 8px;
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

                <Panel
                    headerText="Create new session"
                    hasCloseButton={true}
                    isOpen={true}
                    type={PanelType.custom}
                    customWidth="400px"
                    onRenderFooterContent={this.renderFooter}
                    isFooterAtBottom={true}
                >
                    <div>
                        <TextField label="Name" />
                        <Label>Type</Label>
                        <ChoiceGroup
                            options={options}
                        />
                    </div>
                </Panel>
            </div>
        );
    }

    private renderFooter = () => {
        return (
            <div>
                <FooterButton>
                    <PrimaryButton>Create</PrimaryButton>
                </FooterButton>
                <DefaultButton>Cancel</DefaultButton>
            </div>
        );
    }

    private create = () => {
        const { history } = this.props;
        history.push("/create");
    }
}


const options: IChoiceGroupOption[] = [
    {
        iconProps: {
            iconName: getIcon(SessionMode.Azure)
        },
        key: SessionMode.Azure.toString(),
        text: "Azure"
    },
    {
        iconProps: {
            iconName: getIcon(SessionMode.Local)
        },
        key: SessionMode.Local.toString(),
        text: "Local",
    },
    {
        iconProps: {
            iconName: getIcon(SessionMode.Offline)
        },
        key: SessionMode.Offline.toString(),
        text: "Offline"
    }
];