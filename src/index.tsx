import * as React from "react";
import * as ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { applyMiddleware, compose, createStore } from "redux";
import createSagaMiddleware from "redux-saga";
import App from "./App";
import { createSaga } from "./reducers/createSaga";
import { rootReducer } from "./reducers/reducer";
import { rootSaga } from "./reducers/sessionsSaga";
import registerServiceWorker from "./registerServiceWorker";
import "./services/registration";

const composeEnhancers = (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

// tslint:disable-next-line:no-string-literal
const monitor = window["__SAGA_MONITOR_EXTENSION__"]
const sagaMiddleware = createSagaMiddleware({ sagaMonitor: monitor });

const store = createStore(
  rootReducer,
  composeEnhancers(
    applyMiddleware(
      sagaMiddleware
    )
  )
);

sagaMiddleware.run(createSaga);
sagaMiddleware.run(rootSaga);

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("root") as HTMLElement
);

registerServiceWorker();
