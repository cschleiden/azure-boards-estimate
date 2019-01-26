import { TitleSize } from "azure-devops-ui/Header";
import { Panel } from "azure-devops-ui/Panel";
import * as React from "react";
import { connect } from "react-redux";
import { IState } from "../../reducer";
import "./settings.scss";

export interface ISettingsPanelOwnProps {
    onDismiss(): void;
}

interface ISettingsPanelProps {}

const Actions = {};

class SettingsPanel extends React.Component<
    ISettingsPanelProps & typeof Actions & ISettingsPanelOwnProps
> {
    public componentDidMount() {
        // this.props.onInit();
    }

    public render(): JSX.Element {
        const { onDismiss } = this.props;

        return (
            <Panel
                titleProps={{
                    text: "Settings",
                    size: TitleSize.Large
                }}
                onDismiss={onDismiss}
                blurDismiss={false}
            >
                <div className="settings-panel--content" />
            </Panel>
        );
    }
}

export default connect(
    (state: IState) => ({}),
    Actions
)(SettingsPanel);
