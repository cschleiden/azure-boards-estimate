import { IEstimate } from "../../model/estimate";
import { IState } from "../../reducer";

export function getOwnEstimate(state: IState): IEstimate | null {
    return state.session.ownEstimate;
}