/// <reference path="../typings/index.d.ts" />

import * as React from "react";
import * as ReactDOM from "react-dom";

import * as Redux from "redux";
import { Provider } from "react-redux";

import { Router, Route, IndexRoute, browserHistory } from "react-router";
import { syncHistoryWithStore, routerReducer, routerMiddleware } from "react-router-redux";

import { sessionReducer } from "./reducers/sessionsReducer";

import { App } from "./components/app";
//import { Session } from "./components/session";

import Home from "./home/home";
import Create from "./pages/create/create";


import "./styles/index.scss";

const middleware = routerMiddleware(browserHistory)

const store = Redux.createStore(
  Redux.combineReducers({
    routing: routerReducer,
    sessions: sessionReducer
  }),
  Redux.compose(
    Redux.applyMiddleware(middleware),
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
