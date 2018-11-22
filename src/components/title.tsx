import * as React from "react";
import "./title.scss";

export const Title: React.StatelessComponent<{}> = props => (
  <h1 className="title">{props.children}</h1>
);
