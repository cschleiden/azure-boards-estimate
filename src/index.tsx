//
// Main entry point for the extension
//
import {
    CommonServiceIds,
    IHostNavigationService,
    ILocationService,
    IProjectPageService
} from "azure-devops-extension-api";
import * as DevOps from "azure-devops-extension-sdk";
import * as React from "react";
import * as ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { applyMiddleware, compose, createStore } from "redux";
import createSagaMiddleware from "redux-saga";
import App from "./App";
import "./index.scss";
import { initSaga } from "./initSaga";
import { createSaga } from "./pages/create/createSaga";
import { rootSessionsSaga } from "./pages/home/sessionsSaga";
import { rootSessionSaga } from "./pages/session/sessionSaga";
import { rootSettingsSaga } from "./pages/settings/settingsSaga";
import { rootReducer } from "./reducer";
import registerServiceWorker from "./registerServiceWorker";
import "./services/registration";

DevOps.register("estimate-context-menu", () => {
    return {
        execute: async (actionContext: any) => {
            var extensionContext = DevOps.getExtensionContext();
            let workItemIds: number[] | undefined;
            if (actionContext.rows) {
                workItemIds = actionContext.rows.map((row: any[]) =>
                    parseInt(row[0], 10)
                );
            } else {
                workItemIds = actionContext.workItemIds || [];
            }

            const projectPageService = await DevOps.getService<
                IProjectPageService
            >("ms.vss-tfs-web.tfs-page-data-service");
            const projectInfo = await projectPageService.getProject();

            if (workItemIds && projectInfo) {
                const locationService = await DevOps.getService<
                    ILocationService
                >("ms.vss-features.location-service");
                const url = await locationService.routeUrl(
                    "ms.vss-web.fallback-route-new-platform",
                    {
                        project: projectInfo.name,
                        parameters: `${extensionContext.publisherId}.${
                            extensionContext.extensionId
                        }.estimate-hub`
                    }
                );

                const nav = await DevOps.getService<IHostNavigationService>(
                    "ms.vss-features.host-navigation-service"
                );
                nav.navigate(`${url}#/create/${workItemIds.join(",")}`);
            }
        }
    };
});

const initPromise = DevOps.init();

// Ideally we'd have a separate webpack entry point, but for now re-use this one.
if (!window.location.search || !window.location.search.trim()) {
    initPromise.then(() => {
        const composeEnhancers =
            (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

        const sagaMiddleware = createSagaMiddleware();

        const store = createStore(
            rootReducer,
            composeEnhancers(applyMiddleware(sagaMiddleware))
        );

        sagaMiddleware.run(initSaga);
        sagaMiddleware.run(createSaga);
        sagaMiddleware.run(rootSettingsSaga);
        sagaMiddleware.run(rootSessionsSaga);
        sagaMiddleware.run(rootSessionSaga);

        ReactDOM.render(
            <Provider store={store}>
                <App />
            </Provider>,
            document.getElementById("root") as HTMLElement
        );
    });
}

registerServiceWorker();
