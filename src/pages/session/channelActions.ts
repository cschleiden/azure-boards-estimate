import { actionCreatorFactory } from "typescript-fsa";

const factory = actionCreatorFactory("channel");

export const connected = factory<void>("connected");
