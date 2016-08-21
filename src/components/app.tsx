import * as React from "react";
import { Link } from "react-router";

export class App extends React.Component<void, void> {
    public render(): JSX.Element {
        return <div>Hello world
                <Link to={ "/about" }>About</Link>
            </div>;
    }
}
