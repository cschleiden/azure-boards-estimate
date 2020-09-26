import * as React from "react";
import "./title.scss";

export const Title: React.FunctionComponent<{}> = props => (
    <h1 className="title">{props.children}</h1>
);
