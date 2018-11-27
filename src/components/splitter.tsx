import * as React from "react";
import "./splitter.scss";

export interface ISplitterProps {
    left: JSX.Element;
    right: JSX.Element;
}

export class Splitter extends React.Component<ISplitterProps> {
    render(): JSX.Element {
        const { left, right } = this.props;

        return (
            <div className="splitter">
                <div className="splitter--left">{left}</div>
                <div className="splitter--right">{right}</div>
            </div>
        );
    }
}
