import * as DevOps from "azure-devops-extension-sdk";
import { IIdentity } from "../model/identity";
import { IService } from "./services";

export interface IIdentityService extends IService {
    getCurrentIdentity(): IIdentity;
}

export const IdentityServiceId = "IdentityService";

export class IdentityService implements IIdentityService {
    getCurrentIdentity(): IIdentity {
        const currentUser = DevOps.getUser()!;

        return {
            id: currentUser.id,
            displayName: currentUser.displayName,
            imageUrl: currentUser.imageUrl
        };
    }
}
