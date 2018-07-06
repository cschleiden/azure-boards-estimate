import { defaultCardSets, ICardSet } from "../model/cards";
import { IService } from "./services";

export interface ICardSetService extends IService {
    getSets(): Promise<ICardSet[]>;
}

export const CardSetServiceId = "CardSetService";

export class MockCardSetService implements ICardSetService {
    async getSets(): Promise<ICardSet[]> {
        return defaultCardSets;
    }
}

// tslint:disable-next-line:max-classes-per-file
export class CardSetService implements ICardSetService {
    getSets(): Promise<ICardSet[]> {
        throw new Error("Method not implemented.");
    }
}
