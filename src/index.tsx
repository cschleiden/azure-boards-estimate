import * as React from "react";
import * as ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { applyMiddleware, compose, createStore } from "redux";
import createSagaMiddleware from "redux-saga";
import App from "./App";
import { initSaga } from "./initSaga";
import { createSaga } from "./pages/create/createSaga";
import { rootSessionsSaga } from "./pages/home/sessionsSaga";
import { rootSessionSaga } from "./pages/session/sessionSaga";
import { rootReducer } from "./reducer";
import registerServiceWorker from "./registerServiceWorker";
import "./services/registration";

const composeEnhancers = (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

// tslint:disable-next-line:no-string-literal
// const monitor = window["__SAGA_MONITOR_EXTENSION__"]
const sagaMiddleware = createSagaMiddleware(/* { sagaMonitor: monitor } */);

const store = createStore(
  rootReducer,
  composeEnhancers(
    applyMiddleware(
      sagaMiddleware
    )
  )
);

sagaMiddleware.run(initSaga);
sagaMiddleware.run(createSaga);
sagaMiddleware.run(rootSessionsSaga);
sagaMiddleware.run(rootSessionSaga);

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("root") as HTMLElement
);

registerServiceWorker();