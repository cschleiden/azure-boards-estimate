/// <reference path="../typings/index.d.ts" />


import * as React from "react";
import * as ReactDOM from "react-dom";

import * as Redux from "redux";
import { Provider } from "react-redux";

import { Router, Route, IndexRoute, browserHistory } from "react-router";
import { syncHistoryWithStore, routerReducer } from "react-router-redux";

import { sessionReducer } from "./stores/sessionStore";

import { App } from "./components/app";
import { About } from "./components/about";
import { Session } from "./components/session";
import Home from "./home/home";

// Global styles
import "./styles/index.css";

const store = Redux.createStore(
  Redux.combineReducers({
    routing: routerReducer,
    sessions: sessionReducer
  }), (window as any).devToolsExtension && (window as any).devToolsExtension());

// Work around typings error
const history: any = syncHistoryWithStore(browserHistory as any, store); 

ReactDOM.render(
  <Provider store={ store }>
    <Router history={ history }>
      <Route path="/" component={ Home } />
      <Route path="/session" component={ Session } />
    </Router>
  </Provider>,
  document.getElementById("root")
);
