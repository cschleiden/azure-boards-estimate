import { actionCreatorFactory } from "typescript-fsa";
import { IIdentity } from "./model/identity";

const factory = actionCreatorFactory("init");

export const init = factory<{
    identity: IIdentity;
}>("init");
