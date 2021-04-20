import { IProjectPageService } from "azure-devops-extension-api";
import { ProjectInfo } from "azure-devops-extension-api/Core";
import { getService } from "azure-devops-extension-sdk";
import { SagaIterator } from "redux-saga";
import { call, put, takeLatest, takeEvery } from "redux-saga/effects";
import { toLookup } from "../../lib/lookup";
import { ISession, SessionSource } from "../../model/session";
import { IQueriesService, QueriesServiceId } from "../../services/queries";
import { Services } from "../../services/services";
import { ISessionService, SessionServiceId } from "../../services/sessions";
import { ISprintService, SprintServiceId } from "../../services/sprints";
import {
    IIteration,
    ITeam,
    ITeamService,
    TeamServiceId
} from "../../services/teams";
import {
    loadSessions,
    populate,
    setIterationLookup,
    setQueryLookup,
    setTeamLookup,
    deleteSession
} from "./sessionsActions";

export function* rootSessionsSaga() {
    yield takeLatest(loadSessions.type, initSaga);

    yield takeEvery(deleteSession.type, deleteSaga);
}

export function* initSaga(): SagaIterator {
    const sessionService = Services.getService<ISessionService>(
        SessionServiceId
    );
    const sessions: any = yield call([
        sessionService,
        sessionService.getSessions
    ]);

    const legacySessions: any = yield call([
        sessionService,
        sessionService.getLegacySessions
    ]);

    yield put(populate({ sessions, legacySessions }));

    //
    // Resolve session sources
    //

    // Get project
    const projectService: any = yield call(
        getService,
        "ms.vss-tfs-web.tfs-page-data-service"
    );
    const projectInfo: any = yield call([
        projectService,
        projectService.getProject
    ]);

    // Resolve iterations
    const teamAndIterationIds: [string, string][] = sessions
        .filter((s: ISession) => s.source === SessionSource.Sprint)
        .map((s: ISession) => (s.sourceData as string) || ";")
        .map((x: String) => {
            const segments = x.split(";");
            return [segments[0], segments[1]];
        })
        .filter((x: [string, string]) => x[0] && x[1]);

    if (teamAndIterationIds && teamAndIterationIds.length > 0) {
        const sprintService = Services.getService<ISprintService>(
            SprintServiceId
        );
        const iterations: any = yield call(
            [sprintService, sprintService.getIterations],
            projectInfo.id,
            teamAndIterationIds
        );

        yield put(setIterationLookup(toLookup(iterations, x => x.id)));
    }

    // Resolve teams
    const teamService = Services.getService<ITeamService>(TeamServiceId);
    const teams: any = yield call(
        [teamService, teamService.getAllTeams],
        projectInfo.id
    );

    yield put(setTeamLookup(toLookup(teams, t => t.id)));

    // Resolve queries
    const queryIds: string[] = sessions
        .filter((s: ISession) => s.source === SessionSource.Query)
        .map((s: ISession) => s.sourceData as string);

    if (queryIds && queryIds.length > 0) {
        const queriesService = Services.getService<IQueriesService>(
            QueriesServiceId
        );

        const queries : any = yield call(
            [queriesService, queriesService.getQueries],
            projectInfo.id,
            queryIds
        );
        yield put(setQueryLookup(toLookup(queries, q => q.id)));
    }
}

function* deleteSaga(action: ReturnType<typeof deleteSession>): SagaIterator {
    const sessionService = Services.getService<ISessionService>(
        SessionServiceId
    );
    yield call([sessionService, sessionService.removeSession], action.payload);

    yield put(loadSessions());
}
