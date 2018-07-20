export interface ICard {
    display: string;
    value: number | string | null;
}

export enum CardSetType {
    Numeric,
    Ordinal
}

export interface ICardSet {
    id: string;

    type: CardSetType;

    name: string;

    cards: ICard[];
}

export const defaultCardSets: ICardSet[] = [
    {
        id: "default",
        type: CardSetType.Numeric,
        name: "Default",
        cards: [
            {
                display: "1",
                value: 1
            },
            {
                display: "2",
                value: 2
            },
            {
                display: "3",
                value: 3
            },
            {
                display: "5",
                value: 5
            },
            {
                display: "8",
                value: 8
            },
            {
                display: "13",
                value: 13
            },
            {
                display: "20",
                value: 20
            },
            {
                display: "40",
                value: 40
            },
            {
                display: "?",
                value: null
            },
            {
                display: "∞",
                value: null
            },
            {
                display: "☕",
                value: null
            }
        ]
    },
    {
        id: "tshirts",
        type: CardSetType.Ordinal,
        name: "T-Shirts",
        cards: [
            {
                display: "XS",
                value: "XS"
            },
            {
                display: "S",
                value: "S"
            },
            {
                display: "M",
                value: "M"
            },
            {
                display: "L",
                value: "L"
            },
            {
                display: "XL",
                value: "XL"
            },
        ]
    }
]