import * as React from "react";
import { Link } from "react-router";

export class Home extends React.Component<void, void> {
    public render(): JSX.Element {
        return <div>
            Home 
            <Link to="/session">About</Link>
        </div>;
    }
}
