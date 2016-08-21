import * as React from "react";
import { Link } from "react-router";

export class About extends React.Component<void, void> {
    public render(): JSX.Element {
        return <div>
            About
            <Link to="/">Home</Link>
        </div>;
    }
}
