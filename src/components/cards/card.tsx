import "./card.scss";
import * as React from "react";
import { css } from "../../lib/css";

function getWidth(size: CardSize): number {
    switch (size) {
        case CardSize.small:
            return 20;

        case CardSize.medium:
            return 50;
    }
}

function getHeight(size: CardSize): number {
    switch (size) {
        case CardSize.small:
            return 30;

        case CardSize.medium:
            return 75;
    }
}

function getFontSize(size: CardSize): number {
    switch (size) {
        case CardSize.small:
            return 12;

        case CardSize.medium:
            return 24;
    }
}

export enum CardSize {
    small,
    medium
}

export enum CardState { }

export interface ICardData {
    label: string;
}

export interface ICardComponentProps {
    className?: string;

    state?: CardState;
    size?: CardSize;

    front: ICardData;
    back?: ICardData;

    flipped?: boolean;

    disabled?: boolean;
    selected?: boolean;
    showAverage?: boolean;
    onClick?: () => void;
}

export class Card extends React.Component<ICardComponentProps> {
    render(): JSX.Element {
        const {
            className,
            front,
            back,
            disabled = false,
            flipped = false,
            showAverage = false,
            onClick,
            size = CardSize.medium,
            selected
        } = this.props;

        const cardClassNames = css(
            flipped && "flipped",
            disabled && "disabled",
            selected && "selected"
        );

        const cardStyle: React.CSSProperties = {
            width: getWidth(size),
            height: getHeight(size),
            lineHeight: `${getHeight(size) - 1}px`,
            fontSize: getFontSize(size)
        };

        const content: JSX.Element = <div
            className="card--flip"
            style={{
                width: `${getWidth(size)}px`,
                height: `${getHeight(size)}px`
            }}
        >
            <div
                className={css(
                    "card--frame",
                    "card--front",
                    cardClassNames
                )}
                style={cardStyle}
            >
                {this.renderCard(front)}
            </div>
            {back && (
                <div
                    className={css(
                        "card--frame",
                        "card--back",
                        cardClassNames
                    )}
                    style={cardStyle}
                >
                    {this.renderCard(back)}
                </div>
            )}
        </div>

        const cssClassName: string = css(
            className,
            onClick && "card--base-button",
            !onClick && "card--base"
        )

        return (
            <React.Fragment>
                {
                    onClick ? <button className={cssClassName}
                        disabled={disabled}
                        onClick={onClick}>
                        {content}
                    </button> : <div className={cssClassName}>
                            {content}
                        </div>
                }
            </React.Fragment>
        );
    }

    private renderCard(data: ICardData): JSX.Element {
        return <>{data.label}</>;
    }
}
