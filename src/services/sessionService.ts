import * as Q from "q";

import VSS_Extension_Service = require("VSS/SDK/Services/ExtensionData");

import { ISession } from "../model/session";

// TOOD: CS: Back compat
const CollectionName = "estimate2-session";

export class SessionService {
    private static _instance;

    public static getInstance(): SessionService {
        if (!SessionService._instance) {
            SessionService._instance = new SessionService();
        }

        return SessionService._instance;
    }

    private _extensionService: VSS_Extension_Service.ExtensionDataService;
    private _collectionNames: string[];

    private constructor() { }

    public getSessionsAsync(): IPromise<ISession[]> {
        return this._getService().then(service =>
            service.getDocuments(CollectionName).then((documents: ISession[]) => {
                return documents;
            }));
    }

    private _getService(): IPromise<VSS_Extension_Service.ExtensionDataService> {
        if (this._extensionService) {
            return Q(this._extensionService);
        }

        return VSS.getService(VSS.ServiceIds.ExtensionData).then((extensionService: VSS_Extension_Service.ExtensionDataService) => {
            return extensionService.queryCollectionNames([CollectionName]).then(() => {
                this._extensionService = extensionService;
                return extensionService;
            });
        });
    }
}