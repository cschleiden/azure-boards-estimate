import { Icon } from "office-ui-fabric-react";
import * as React from "react";
import { SessionMode } from "../model/session";

export interface ICardTypeProps {
    mode: SessionMode;
}

export class CardIcon extends React.Component<ICardTypeProps> {
    render(): JSX.Element {
        const { mode } = this.props;

        return (
            <Icon
                styles={{
                    root: {
                        fontSize: "48px"
                    }
                }}
                iconName={getIcon(mode)}
            />
        )
    }
}

export function getIcon(mode: SessionMode): string {
    switch (mode) {
        case SessionMode.Local:
            return "Transition";

        case SessionMode.Azure:
            return "AzureLogo";

        case SessionMode.Offline:
            return "PlugDisconnected";
    }
}