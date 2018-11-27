import * as React from "react";
import "./subtitle.scss";

export const SubTitle: React.StatelessComponent = props => (
    <h2 className="subtitle">{props.children}</h2>
);
