import { IProjectPageService } from "azure-devops-extension-api";
import { ProjectInfo } from "azure-devops-extension-api/Core";
import { getService } from "azure-devops-extension-sdk";
import { all, call, put, select, take } from "redux-saga/effects";
import history from "../../lib/history";
import { ISession } from "../../model/session";
import { IState } from "../../reducer";
import { CardSetServiceId, ICardSetService } from "../../services/cardSets";
import { Services } from "../../services/services";
import { ISessionService, SessionServiceId } from "../../services/sessions";
import { ITeamService, TeamServiceId } from "../../services/teams";
import { loadSessions } from "../home/sessionsActions";
import * as Actions from "./createActions";
import { IIdentityService, IdentityServiceId } from "../../services/identity";

export function* createSaga() {
    yield all([initSaga(), iterationSaga(), createSessionSaga()]);
}

/** Retrieve data for initial state */
export function* initSaga() {
    yield take(Actions.init.type);

    yield all([loadTeams(), loadCardSets()]);
}

/** Load teams */
export function* loadTeams() {
    const projectService: IProjectPageService = yield call(
        getService,
        "ms.vss-tfs-web.tfs-page-data-service"
    );
    const projectInfo: ProjectInfo = yield call([
        projectService,
        projectService.getProject
    ]);

    // TODO: Get source from state?
    const teamService = Services.getService<ITeamService>(TeamServiceId);
    const teams = yield call(
        [teamService, teamService.getAllTeams],
        projectInfo.id
    );
    yield put(Actions.setTeams(teams));
}

/**  */
export function* loadCardSets() {
    const cardSetService = Services.getService<ICardSetService>(
        CardSetServiceId
    );
    const cardSets = yield call([cardSetService, cardSetService.getSets]);
    yield put(Actions.setCardSets(cardSets));
}

export function* iterationSaga() {
    const action: ReturnType<typeof Actions.setTeam> = yield take(
        Actions.setTeam.type
    );

    const teamService = Services.getService<ITeamService>(TeamServiceId);
    const iterations = yield call(
        [teamService, teamService.getIterationsForTeam],
        action.payload
    );

    yield put(Actions.setIterations(iterations));
}

export function* createSessionSaga() {
    while (true) {
        yield take(Actions.create.type);

        let session: ISession = yield select<IState>(x => x.create.session);

        // Generate new id
        session = {
            ...session,
            id: Math.random()
                .toString(36)
                .substr(2, 5)
        };

        // Set creator's identity
        const identityService = Services.getService<IIdentityService>(
            IdentityServiceId
        );
        const identity = identityService.getCurrentIdentity();
        session.createdBy = identity.id;

        // Save session
        const sessionService = Services.getService<ISessionService>(
            SessionServiceId
        );
        yield call([sessionService, sessionService.saveSession], session);

        // Reset creation state
        yield put(Actions.reset());

        // Refresh all sessions
        yield put(loadSessions());

        // Navigate to homepage
        yield call(history.push as any, "/");
    }
}
