import { Icon, IIconProps, TooltipHost } from "office-ui-fabric-react";
import * as React from "react";
import { SessionMode, SessionSource } from "../model/session";
import { ModeDescriptionOffline, ModeDescriptionOnline } from "../resources/resources";
import styled from "../styles/themed-styles";

const StyledIcon = styled((props: IIconProps) => <Icon {...props} />)`
    margin-left: 10px;
`;

export interface ICardTypeProps {
    mode: SessionMode;

    source: SessionSource;
}

export class CardIcon extends React.Component<ICardTypeProps> {
    render(): JSX.Element {
        const { mode, source } = this.props;

        const { icon, description } = getIconForMode(mode);

        return (
            <>
                <TooltipHost content={description}>
                    <StyledIcon
                        styles={{
                            root: {
                                fontSize: "28px"
                            }
                        }}
                        iconName={icon}
                    />
                </TooltipHost>
                <TooltipHost>
                    <StyledIcon
                        styles={{
                            root: {
                                fontSize: "28px"
                            }
                        }}
                        iconName={getIconForSource(source)}
                    />
                </TooltipHost>
            </>
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
            return "";
    }
}

export function getIconForMode(mode: SessionMode): { icon: string; description: string; } {
    switch (mode) {
        case SessionMode.Online:
            return {
                icon: "Transition",
                description: ModeDescriptionOnline
            };

        case SessionMode.Offline:
            return {
                icon: "PlugDisconnected",
                description: ModeDescriptionOffline
            };
    }
}