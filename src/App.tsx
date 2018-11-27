import { IHostNavigationService } from "azure-devops-extension-api";
import "azure-devops-ui/FabricInit";
import * as DevOps from "azure-devops-extension-sdk";
import { initializeIcons } from "office-ui-fabric-react/lib/Icons";
import * as React from "react";
import { Route, Router, Switch } from "react-router-dom";
import history from "./lib/history";
import HomePage from "./pages/home/home";
import Session from "./pages/session/session";

// TODO: Quick hack
DevOps.getService<IHostNavigationService>(
    "ms.vss-features.host-navigation-service"
).then(navService => {
    // Send navigation updates to host frame
    history.listen(x => {
        navService.replaceHash(x.hash);
    });
});

initializeIcons();

class App extends React.Component {
    public render() {
        return (
            <Router history={history}>
                <>
                    <Switch>
                        <Route
                            exact={true}
                            path="/create/:ids?"
                            component={HomePage}
                        />
                        <Route exact={true} path="/" component={HomePage} />
                    </Switch>

                    <Route
                        exact={true}
                        path="/session/:id/:name?"
                        component={Session}
                    />
                </>
            </Router>
        );
    }
}

export default App;
