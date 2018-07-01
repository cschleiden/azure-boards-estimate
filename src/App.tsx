import { initializeIcons } from "office-ui-fabric-react/lib/Icons";
import * as React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { HomePage } from "./pages/home/home";
import { RootStyle } from "./styles/root";
initializeIcons();

class App extends React.Component {
  public render() {
    return (
      <BrowserRouter>
        <RootStyle>
          <Switch>
            <Route exact={true} path="/create" component={HomePage} />
            <Route exact={true} path="/" component={HomePage} />
          </Switch>
        </RootStyle>
      </BrowserRouter>
    );
  }
}

export default App;
