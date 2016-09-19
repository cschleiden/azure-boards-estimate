/// <reference path="../typings/index.d.ts" />

import * as React from "react";
import * as ReactDOM from "react-dom";

import * as Redux from "redux";
import { Provider } from "react-redux";

import { Router, Route, IndexRoute, browserHistory } from "react-router";
import { syncHistoryWithStore, routerMiddleware } from "react-router-redux";
import thunkMiddleware from "redux-thunk";

import * as createLogger from "redux-logger";
import promiseMiddleware from "./middleware/promise-middleware";

import rootReducer from "./reducers";

import Home from "./pages/home/home";
import Create from "./pages/create/create";

import "./styles/index.scss";

const store = Redux.createStore(
  rootReducer,
  Redux.compose(
    Redux.applyMiddleware(
      routerMiddleware(browserHistory),
      promiseMiddleware as any,
      thunkMiddleware,
      createLogger()),
    (window as any).devToolsExtension && (window as any).devToolsExtension({
      serializeState: (key, value) => value && value.data ? value.data : value,
      deserializeState: (state) => ({
        routing: state.routing,
        sessions: state.sessions.data
      })
    })));

// Work around typings error
const history: any = syncHistoryWithStore(browserHistory as any, store);

ReactDOM.render(
  <Provider store={ store }>
    <Router history={ history }>
      <Route path="/" component={ Home } />
      <Route path="/create" component={ Create } />
      <Route path="/settings" />
    </Router>
  </Provider>,
  document.getElementById("root")
);
