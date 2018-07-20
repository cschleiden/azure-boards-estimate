import { IIdentity } from "../model/identity";
import { IService } from "./services";

export interface IIdentityService extends IService {
    getCurrentIdentity(): Promise<IIdentity>;
}

export const IdentityServiceId = "IdentityService";

export class MockIdentityService implements IIdentityService {
    async getCurrentIdentity(): Promise<IIdentity> {
        return {
            id: "id",
            displayName: "Jane Doe"
        };
    }
} 