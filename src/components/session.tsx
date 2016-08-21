import * as React from "react";
import { Link } from "react-router";

export class Session extends React.Component<void, void> {
    public render(): JSX.Element {
        return <div>
            Session
            <Link to="/">Home</Link>
        </div>;
    }
}
