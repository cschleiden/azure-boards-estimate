import { IIdentity } from "../model/identity";
import { IService } from "./services";

export interface IIdentityService extends IService {
    getCurrentIdentity(): Promise<IIdentity>;
}

export const IdentityServiceId = "IdentityService";

export class MockIdentityService implements IIdentityService {
    async getCurrentIdentity(): Promise<IIdentity> {
        return {
            id: "f6642bc9-e18c-4dcd-975b-55b4d857eb02",
            displayName: "Jane Doe"
        };
    }
} 