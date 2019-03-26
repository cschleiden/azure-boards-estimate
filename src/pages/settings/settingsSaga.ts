import { IProjectPageService } from "azure-devops-extension-api";
import { ProjectInfo } from "azure-devops-extension-api/Core";
import { getService } from "azure-devops-extension-sdk";
import { SagaIterator } from "redux-saga";
import { call, put, takeEvery } from "redux-saga/effects";
import { IField, IWorkItemType } from "../../model/workItemType";
import { Services } from "../../services/services";
import { IWorkItemService, WorkItemServiceId } from "../../services/workItems";
import { init, loaded } from "./settingsActions";

export function* rootSettingsSaga(): SagaIterator {
    yield takeEvery(init.type, initSaga);
}

function* initSaga(): SagaIterator {
    const projectService: IProjectPageService = yield call(
        getService,
        "ms.vss-tfs-web.tfs-page-data-service"
    );
    const projectInfo: ProjectInfo = yield call([
        projectService,
        projectService.getProject
    ]);

    // Get work item type configuration for project
    const workItemService = Services.getService<IWorkItemService>(
        WorkItemServiceId
    );
    const workItemTypes: IWorkItemType[] = yield call(
        [workItemService, workItemService.getWorkItemTypes],
        projectInfo.id
    );

    const fields: IField[] = yield call(
        [workItemService, workItemService.getFields],
        projectInfo.id
    );

    // Merge with config
    // const sessionService = Services.getService<ISessionService>(
    //     SessionServiceId
    // );
    // const config = sessionService.getSettingsValue<IWorkItemType[]>(
    //     projectId,
    //     "work-item-types"
    // );

    yield put(
        loaded({
            workItemTypes,
            fields
        })
    );
}
