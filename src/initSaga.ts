import { call, put } from "redux-saga/effects";
import { init } from "./initActions";
import { IIdentity } from "./model/identity";
import { IdentityServiceId, IIdentityService } from "./services/identity";
import { Services } from "./services/services";

export function* initSaga() {
    const identityService = Services.getService<IIdentityService>(
        IdentityServiceId
    );
    const currentIdentity: IIdentity = yield call([
        identityService,
        identityService.getCurrentIdentity
    ]);

    yield put(
        init({
            identity: currentIdentity
        })
    );
}
