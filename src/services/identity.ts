import * as DevOps from "azure-devops-extension-sdk";
import { IIdentity } from "../model/identity";
import { IService } from "./services";

export interface IIdentityService extends IService {
    getCurrentIdentity(): IIdentity;
}

export const IdentityServiceId = "IdentityService";

export class MockIdentityService implements IIdentityService {
    getCurrentIdentity(): IIdentity {
        return {
            id: "f6642bc9-e18c-4dcd-975b-55b4d857eb02",
            displayName: "Jane Doe"
        };
    }
}

export class IdentityService implements IIdentityService {
    getCurrentIdentity(): IIdentity {
        const currentUser = DevOps.getUser()!;

        return {
            id: currentUser.id,
            displayName: currentUser.displayName
        };
    }
}
