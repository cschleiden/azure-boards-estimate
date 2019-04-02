import * as React from "react";
import { ICardSet } from "../../model/cards";
import "./workItemEstimate.scss";
import { css } from "../../lib/css";

export const WorkItemEstimate: React.StatelessComponent<{
    className?: string;
    cardSet: ICardSet;
    estimate?: number | string;
}> = props => (
    <div className={css(props.className, "work-item-estimate")}>
        <label>Estimate</label>:&nbsp;
        {getEstimateDisplay(props.cardSet, props.estimate)}
    </div>
);

function getEstimateDisplay(
    cardSet: ICardSet,
    estimate?: string | number
): string {
    const cardIdx = cardSet.cards.findIndex(
        c => estimate != null && c.value == estimate
    );
    if (cardIdx >= 0) {
        return cardSet.cards[cardIdx].identifier;
    }

    return `${estimate != null ? estimate : "-"}`;
}
