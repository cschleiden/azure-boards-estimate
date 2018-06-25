import { initializeIcons } from "office-ui-fabric-react/lib/Icons";
import * as React from "react";
import { BrowserRouter, Route } from "react-router-dom";
import { CreatePage } from "./pages/create/create";
import { HomePage } from "./pages/home/home";
import { RootStyle } from "./styles/root";

initializeIcons();

class App extends React.Component {
  public render() {
    return (
      <BrowserRouter>
        <RootStyle>
          <Route exact={true} path="/" component={HomePage} />
          <Route path="/create" component={CreatePage} />
        </RootStyle>
      </BrowserRouter>
    );
  }
}

export default App;
