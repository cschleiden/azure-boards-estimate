import { SagaIterator } from "redux-saga";
import { call } from "redux-saga/effects";
import { IWorkItemType } from "../../model/workItemType";
import { Services } from "../../services/services";
import { ISessionService, SessionServiceId } from "../../services/sessions";
import { IWorkItemService, WorkItemServiceId } from "../../services/workItems";

export function* rootSessionSaga(): SagaIterator {
    // TODO
    const projectId = "p";

    // Get work item type configuration for project
    const workItemService = Services.getService<IWorkItemService>(
        WorkItemServiceId
    );
    const workItemTypes: IWorkItemType[] = yield call(
        [workItemService, workItemService.getWorkItemTypes],
        projectId
    );

    // Merge with config
    const sessionService = Services.getService<ISessionService>(
        SessionServiceId
    );
    const config = sessionService.getSettingsValue<IWorkItemType[]>(
        projectId,
        "work-item-types"
    );
}
