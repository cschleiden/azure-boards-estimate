import { Dropdown, IDropdownOption } from "office-ui-fabric-react";
import { ISelectableOption } from "office-ui-fabric-react/lib/utilities/selectableOption/SelectableOption.types";
import * as React from "react";
import { ICardSet } from "../../model/cards";
import styled from "../../styles/themed-styles";
import { Card, CardSize } from "../cards/card";

const CardContainer = styled.div`
    display: flex;
`;

export interface ICardSetPickerProps {
    cardSets: ICardSet[];

    selectedCardSetId: string;

    onChange(cardSet: ICardSet): void;
}

export class CardSetPicker extends React.Component<ICardSetPickerProps> {
    render(): JSX.Element {
        const { cardSets, selectedCardSetId } = this.props;

        return (
            <Dropdown
                selectedKey={selectedCardSetId}
                options={cardSets && cardSets.map(cs => ({
                    key: cs.id,
                    text: cs.name,
                    ...cs
                })) || []}
                onRenderOption={this.renderCardSet}
                onChanged={this.onChange}
            />
        );
    }

    private renderCardSet = (cardSet: ISelectableOption & ICardSet) => {
        return (
            <CardContainer>
                {cardSet.cards.map(c => (
                    <Card
                        key={c.display}
                        size={CardSize.small}
                        front={{
                            label: c.display
                        }}
                    />
                ))}
            </CardContainer>
        );
    }

    private onChange = (cardSet: IDropdownOption & ICardSet) => {
        const { onChange } = this.props;
        onChange(cardSet);
    }
}