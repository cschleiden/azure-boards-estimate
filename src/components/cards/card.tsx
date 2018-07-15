import * as React from "react";
import styled, { css } from "../../styles/themed-styles";

const cardWidth = 50;
const cardHeight = 75;

const Base = styled.button`
    border: none;
    background: transparent;
    cursor: pointer;
    padding: 0;
    outline: none;
    
    perspective: 1000;
    transform: perspective(1000px);
    transform-style: preserve-3d;
`;

const Flip = styled.div`
    transition: 0.6s;
	transform-style: preserve-3d;
    
	position: relative;

    width: ${cardWidth}px;
    height: ${cardHeight}px;

    margin: 5px;
`;

const CardFrame = styled.div<{
    flipped: boolean;
}>`
    display: block;
    width:  ${cardWidth}px;
    height: ${cardHeight}px;
    line-height: ${cardHeight - 1}px;   
    border-radius: 10px;
    font-size: x-large;
    text-align: center;

    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.08);
    border-radius: 4px;
    
    user-select: none;

    transition: linear all 0.6s;
    backface-visibility: hidden;    
    transform-style: preserve-3d;

	position: absolute;
	top: 0;
	left: 0;
`;

const Front = CardFrame.extend`
    transform: rotateY(0deg);

    ${props => props.flipped && css`
        transform: rotateY(180deg);
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

export interface ICardData {
    label: string;
}

export interface ICardComponentProps {
    size?: CardSize;

    front: ICardData;
    back?: ICardData;

    flipped?: boolean;

    onClick?: () => void;
}

export class Card extends React.Component<ICardComponentProps> {
    render(): JSX.Element {
        const { front, back, flipped = false, onClick } = this.props;

        return (
            <Base onClick={onClick}>
                <Flip>
                    <Front flipped={flipped}>
                        {this.renderCard(front)}
                    </Front>
                    {back && (
                        <Back flipped={flipped}>
                            {this.renderCard(back)}
                        </Back>
                    )}
                </Flip>
            </Base>
        );
    }

    private renderCard(data: ICardData): JSX.Element {
        return (
            <>{data.label}</>
        );
    }
}
