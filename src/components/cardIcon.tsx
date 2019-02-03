import "./cardIcon.scss";
import * as React from "react";
import { SessionMode, SessionSource } from "../model/session";
import {
    ModeDescriptionOffline,
    ModeDescriptionOnline
} from "../resources/resources";
import { Tooltip } from "azure-devops-ui/TooltipEx";
import { Icon } from "azure-devops-ui/Icon";

export interface ICardTypeProps {
    mode: SessionMode;

    source: SessionSource;
}

export class CardIcon extends React.Component<ICardTypeProps> {
    render(): JSX.Element {
        const { mode, source } = this.props;

        const { icon, description } = getIconForMode(mode);

        return (
            <div className="card-icon flex-row">
                <Tooltip text={description}>
                    <span>
                        <Icon iconName={icon} />
                    </span>
                </Tooltip>
                <Icon iconName={getIconForSource(source)} />
            </div>
        );
    }
}

export function getIconForSource(source: SessionSource): string {
    switch (source) {
        case SessionSource.Sprint:
            return "Sprint";

        case SessionSource.Query:
            return "QueryList";

        case SessionSource.Ids:
            return "WorkItem";
    }
}

export function getIconForMode(
    mode: SessionMode
): { icon: string; description: string } {
    switch (mode) {
        case SessionMode.Online:
            return {
                icon: "ConnectContacts",
                description: ModeDescriptionOnline
            };

        case SessionMode.Offline:
            return {
                icon: "Clock",
                description: ModeDescriptionOffline
            };
    }
}
