import { initializeIcons } from "office-ui-fabric-react/lib/Icons";
import * as React from "react";
import { Route, Router, Switch } from "react-router-dom";
import history from "./lib/history";
import HomePage from "./pages/home/home";
import Session from "./pages/session/session";
import { RootStyle } from "./styles/root";

initializeIcons();

class App extends React.Component {
  public render() {
    return (
      <Router history={history}>
        <RootStyle>
          <Switch>
            <Route exact={true} path="/create/:ids?" component={HomePage} />
            <Route exact={true} path="/" component={HomePage} />
          </Switch>


          <Route exact={true} path="/session/:id" component={Session} />
        </RootStyle>
      </Router>
    );
  }
}

export default App;
