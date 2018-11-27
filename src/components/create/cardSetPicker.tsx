import "./cardSetPicker.scss";
import {
    Dropdown,
    IDropdownOption,
    IRenderFunction
} from "office-ui-fabric-react";
import { ISelectableOption } from "office-ui-fabric-react/lib/utilities/selectableOption/SelectableOption.types";
import * as React from "react";
import { ICardSet } from "../../model/cards";
import { Card, CardSize } from "../cards/card";

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
                options={
                    (cardSets &&
                        cardSets.map(cs => ({
                            key: cs.id,
                            text: cs.name,
                            ...cs
                        }))) ||
                    []
                }
                onRenderOption={
                    this.renderCardSet as IRenderFunction<ISelectableOption>
                }
                onChanged={this.onChange as (option: IDropdownOption) => void}
            />
        );
    }

    private renderCardSet = (cardSet: ISelectableOption & ICardSet) => {
        return (
            <div className="card-set-picker">
                {cardSet.cards.map(c => (
                    <Card
                        key={c.identifier}
                        disabled={true}
                        size={CardSize.small}
                        front={{
                            label: c.identifier
                        }}
                    />
                ))}
            </div>
        );
    };

    private onChange = (cardSet: IDropdownOption & ICardSet) => {
        const { onChange } = this.props;
        onChange(cardSet);
    };
}
