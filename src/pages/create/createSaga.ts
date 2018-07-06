import { all, call, put, select, take } from "redux-saga/effects";
import history from "../../lib/history";
import { IState } from "../../reducer";
import { CardSetServiceId, ICardSetService } from "../../services/cardSets";
import { Services } from "../../services/services";
import { ISessionService, SessionServiceId } from "../../services/sessions";
import { ITeamService, TeamServiceId } from "../../services/teams";
import { loadSessions } from "../home/sessionsActions";
import * as Actions from "./createActions";
import { ICreateSessionState } from "./createReducer";

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

    yield all([
        loadTeams(),
        loadCardSets()
    ]);
}

/** Load teams */
export function* loadTeams() {
    // TODO: Get source from state?
    const teamService = Services.getService<ITeamService>(TeamServiceId);
    const teams = yield call([teamService, teamService.getAllTeams]);
    yield put(Actions.setTeams(teams));
}

/**  */
export function* loadCardSets() {
    const cardSetService = Services.getService<ICardSetService>(CardSetServiceId);
    const cardSets = yield call([cardSetService, cardSetService.getSets]);
    yield put(Actions.setCardSets(cardSets));
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

        const { session }: ICreateSessionState = yield select<IState>(x => x.create);

        // Save session
        const sessionService = Services.getService<ISessionService>(SessionServiceId);
        yield call([sessionService, sessionService.saveSession], session);

        yield put(loadSessions());

        // Navigate to homepage
        yield call(history.push as any, "/");
    }
}