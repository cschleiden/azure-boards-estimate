import { all, call, put, select, take } from "redux-saga/effects";
import { Services } from "../services/services";
import { ITeamService, TeamServiceId } from "../services/teams";
import * as Actions from "./createActions";
import { IState } from "./reducer";

export function* createSaga() {
    yield all([
        initSaga(),
        iterationSaga(),
        createSessionSaga()
    ]);
}

/** Retrieve data for initial state */
export function* initSaga() {
    yield take(Actions.init.type);

    // TODO: Get source from state?
    const teamService = Services.getService<ITeamService>(TeamServiceId);
    const teams = yield call([teamService, teamService.getAllTeams]);
    yield put(Actions.setTeams(teams));
}

export function* iterationSaga() {
    const action: ReturnType<typeof Actions.setTeam> = yield take(Actions.setTeam.type);

    const teamService = Services.getService<ITeamService>(TeamServiceId);
    const iterations = yield call([teamService, teamService.getIterationsForTeam], action.payload);

    yield put(Actions.setIterations(iterations));
}

export function* createSessionSaga() {
    while (true) {
        yield take(Actions.create.type);

        const { name, mode } = yield select<IState>(x => x.create);

        yield put(Actions.create2({
            name,
            mode
        }));
    }
}