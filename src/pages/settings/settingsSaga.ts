import { IProjectPageService } from "azure-devops-extension-api";
import { ProjectInfo } from "azure-devops-extension-api/Core";
import { getService } from "azure-devops-extension-sdk";
import { SagaIterator } from "redux-saga";
import { call, put, takeEvery } from "redux-saga/effects";
import { IField, IWorkItemType } from "../../model/workItemType";
import { Services } from "../../services/services";
import { ISessionService, SessionServiceId } from "../../services/sessions";
import { IWorkItemService, WorkItemServiceId } from "../../services/workItems";
import { init, loaded, setField } from "./settingsActions";

export function* rootSettingsSaga(): SagaIterator {
    yield takeEvery(init.type, initSaga);

    yield takeEvery(setField.type, setFieldSaga);
}

const FieldConfiguration = "field-configuration";

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
    const sessionService = Services.getService<ISessionService>(
        SessionServiceId
    );
    const configuration: { [name: string]: IWorkItemType } = yield call(
        [sessionService, sessionService.getSettingsValue as any],
        projectInfo.id,
        FieldConfiguration
    );

    if (configuration) {
        for (const workItemType of workItemTypes) {
            if (configuration[workItemType.name]) {
                workItemType.estimationFieldRefName =
                    configuration[workItemType.name].estimationFieldRefName;
            }
        }
    }

    yield put(
        loaded({
            workItemTypes,
            fields
        })
    );
}

export function* setFieldSaga(
    action: ReturnType<typeof setField>
): SagaIterator {
    const workItemType = action.payload;

    const projectService: IProjectPageService = yield call(
        getService,
        "ms.vss-tfs-web.tfs-page-data-service"
    );
    const projectInfo: ProjectInfo = yield call([
        projectService,
        projectService.getProject
    ]);

    const service = Services.getService<ISessionService>(SessionServiceId);

    let configuration: { [name: string]: IWorkItemType } = yield call(
        [service, service.getSettingsValue as any],
        projectInfo.id,
        FieldConfiguration
    );
    if (!configuration) {
        configuration = {};
    }

    configuration[workItemType.name] = workItemType;

    yield call(
        [service, service.setSettingsValue as any],
        projectInfo.id,
        FieldConfiguration,
        configuration
    );
}
