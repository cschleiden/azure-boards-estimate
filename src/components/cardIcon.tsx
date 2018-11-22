import "./cardIcon.scss";
import { TooltipHost } from "azure-devops-ui/Tooltip";
import * as React from "react";
import { SessionMode, SessionSource } from "../model/session";
import {
  ModeDescriptionOffline,
  ModeDescriptionOnline
} from "../resources/resources";
import { Icon } from "office-ui-fabric-react/lib/Icon";

export interface ICardTypeProps {
  mode: SessionMode;

  source: SessionSource;
}

export class CardIcon extends React.Component<ICardTypeProps> {
  render(): JSX.Element {
    const { mode, source } = this.props;

    const { icon, description } = getIconForMode(mode);

    return (
      <div className="card-icon">
        <TooltipHost content={description}>
          <Icon iconName={icon} />
        </TooltipHost>
        <TooltipHost>
          <Icon iconName={getIconForSource(source)} />
        </TooltipHost>
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
