import { IProjectPageService } from "azure-devops-extension-api";
import { ProjectInfo } from "azure-devops-extension-api/Core";
import { getService } from "azure-devops-extension-sdk";
import { call, put, takeLatest } from "redux-saga/effects";
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
    setTeamLookup
} from "./sessionsActions";

export function* rootSessionsSaga() {
    yield takeLatest(loadSessions.type, initSaga);
}

export function* initSaga() {
    const sessionService = Services.getService<ISessionService>(
        SessionServiceId
    );
    const sessions: ISession[] = yield call([
        sessionService,
        sessionService.getSessions
    ]);

    yield put(populate({ sessions, legacySessions: [] }));

    const legacySessions: ISession[] = yield call([
        sessionService,
        sessionService.getLegacySession
    ]);

    yield put(populate({ sessions, legacySessions }));

    //
    // Resolve session sources
    //

    // Get project
    const projectService: IProjectPageService = yield call(
        getService,
        "ms.vss-tfs-web.tfs-page-data-service"
    );
    const projectInfo: ProjectInfo = yield call([
        projectService,
        projectService.getProject
    ]);

    // Resolve iterations
    const teamAndIterationIds: [string, string][] = sessions
        .filter(s => s.source === SessionSource.Sprint)
        .map(s => (s.sourceData as string) || ";")
        .map<[string, string]>(x => {
            const segments = x.split(";");
            return [segments[0], segments[1]];
        })
        .filter(x => x[0] && x[1]);
    if (teamAndIterationIds && teamAndIterationIds.length > 0) {
        const sprintService = Services.getService<ISprintService>(
            SprintServiceId
        );
        const iterations: IIteration[] = yield call(
            [sprintService, sprintService.getIterations],
            projectInfo.id,
            teamAndIterationIds
        );

        yield put(setIterationLookup(toLookup(iterations, x => x.id)));
    }

    // Resolve teams
    const teamService = Services.getService<ITeamService>(TeamServiceId);
    const teams: ITeam[] = yield call(
        [teamService, teamService.getAllTeams],
        projectInfo.id
    );

    yield put(setTeamLookup(toLookup(teams, t => t.id)));

    // Resolve queries
    const queryIds = sessions
        .filter(s => s.source === SessionSource.Query)
        .map(s => s.sourceData as string);

    if (queryIds && queryIds.length > 0) {
        const queriesService = Services.getService<IQueriesService>(
            QueriesServiceId
        );

        const queries = yield call(
            [queriesService, queriesService.getQueries],
            projectInfo.id,
            queryIds
        );
        yield put(setQueryLookup(toLookup(queries, q => q.id)));
    }
}
