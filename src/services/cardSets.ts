import { defaultCardSets, ICardSet } from "../model/cards";
import { IService } from "./services";

export interface ICardSetService extends IService {
    getSets(): Promise<ICardSet[]>;

    getSet(cardSetId: string): Promise<ICardSet>;
}

export const CardSetServiceId = "CardSetService";

export class MockCardSetService implements ICardSetService {
    async getSet(cardSetId: string): Promise<ICardSet> {
        return defaultCardSets.filter(cs => cs.id === cardSetId)[0];
    }

    async getSets(): Promise<ICardSet[]> {
        return defaultCardSets;
    }
}

// tslint:disable-next-line:max-classes-per-file
export class CardSetService implements ICardSetService {
    getSet(cardSetId: string): Promise<ICardSet> {
        throw new Error("Method not implemented.");
    }

    getSets(): Promise<ICardSet[]> {
        throw new Error("Method not implemented.");
    }
}
