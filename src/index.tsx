import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';
import { Provider } from "react-redux";

import * as Redux from 'redux';

import { syncHistoryWithStore, routerReducer } from "react-router-redux";

import { App } from './components/app';
import { About } from './components/about';
import { Session } from './components/session';
import { Home } from './components/home';

// Global styles
import './styles/index.css';

const store = Redux.createStore(
  Redux.combineReducers({
    routing: routerReducer
  }), (window as any).devToolsExtension && (window as any).devToolsExtension());

const history = syncHistoryWithStore(browserHistory, store); 

ReactDOM.render(
  <Provider store={ store }>
    <Router history={ history }>
      <Route path="/" component={ Home } />
      <Route path="/session" component={ Session } />
    </Router>
  </Provider>,
  document.getElementById("root")
);