import { Icon } from "office-ui-fabric-react";
import * as React from "react";
import { SessionSource } from "../model/session";

export interface ICardTypeProps {
    source: SessionSource;
}

export class CardIcon extends React.Component<ICardTypeProps> {
    render(): JSX.Element {
        const { source } = this.props;

        return (
            <Icon
                styles={{
                    root: {
                        fontSize: "48px"
                    }
                }}
                iconName={getIconForSource(source)}
            />
        )
    }
}

export function getIconForSource(source: SessionSource): string {
    switch (source) {
        case SessionSource.Query:
            return "Query";

        case SessionSource.Sprint:
            return "Sprint";

        case SessionSource.Ids:
            return "";
    }
}