import { actionCreatorFactory } from "typescript-fsa";
import { ISetWorkItemPayload } from "../../services/channels/channels";

const factory = actionCreatorFactory("channel");

export const setWorkItem = factory<ISetWorkItemPayload>("setWorkItem");