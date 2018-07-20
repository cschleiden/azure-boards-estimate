import * as React from "react";
import styled, { css } from "../../styles/themed-styles";

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

const BaseButton = styled.button`
    border: none;
    background: transparent;
    padding: 0;
    outline: none;
    
    perspective: 1000;
    transform: perspective(1000px);
    transform-style: preserve-3d;
`;

const Base = styled.div`
    border: none;
    background: transparent;
    padding: 0;
    outline: none;
    
    perspective: 1000;
    transform: perspective(1000px);
    transform-style: preserve-3d;
`;

const Flip = styled.div<{
    size: CardSize;
}>`
    transition: 0.3s;
	transform-style: preserve-3d;
    
	position: relative;

    width: ${props => getWidth(props.size)}px;
    height: ${props => getHeight(props.size)}px;

    margin: 5px;
`;

const CardFrame = styled.div<{
    flipped: boolean;
    size: CardSize;
    disabled?: boolean;
}>`
    display: block;
    width: ${props => getWidth(props.size)}px;
    height: ${props => getHeight(props.size)}px;
    line-height: ${props => getHeight(props.size) - 1}px;   
    border-radius: 10px;
    font-size: ${props => getFontSize(props.size)}px;
    text-align: center;

    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.08);
    border-radius: 4px;
    
    user-select: none;

    transition: linear all 0.2s;
    backface-visibility: hidden;    
    transform-style: preserve-3d;

	position: absolute;
	top: 0;
    left: 0;
    
    ${props => !props.disabled && css`cursor: pointer;`}
`;

const Front = CardFrame.extend`
    transform: rotateY(0deg);

    ${props => props.flipped && css`
        transform: rotateY(180deg);
    `}

    ${props => !props.disabled && css`
        &:hover {
            background-color: red;
        }
    `}
`;


const Back = CardFrame.extend`
    transform: rotateY(-180deg);

    ${props => props.flipped && css`
        transform: rotateY(0deg);
    `}
`;

export enum CardSize {
    small,
    medium
}

export enum CardState {

}

export interface ICardData {
    label: string;
}

export interface ICardComponentProps {
    state?: CardState;
    size?: CardSize;

    front: ICardData;
    back?: ICardData;

    flipped?: boolean;

    disabled?: boolean;

    onClick?: () => void;
}

export class Card extends React.Component<ICardComponentProps> {
    render(): JSX.Element {
        const { front, back, disabled = false, flipped = false, onClick, size = CardSize.medium } = this.props;

        let BaseElement: any;
        if (onClick) {
            BaseElement = BaseButton;
        } else {
            BaseElement = Base;
        }

        return (
            <BaseElement onClick={onClick}>
                <Flip size={size}>
                    <Front flipped={flipped} size={size} disabled={disabled}>
                        {this.renderCard(front)}
                    </Front>
                    {back && (
                        <Back flipped={flipped} size={size} disabled={disabled}>
                            {this.renderCard(back)}
                        </Back>
                    )}
                </Flip>
            </BaseElement>
        );
    }

    private renderCard(data: ICardData): JSX.Element {
        return (
            <>{data.label}</>
        );
    }
}
