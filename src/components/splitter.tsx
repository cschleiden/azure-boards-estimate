import * as React from "react";
import styled from "../styles/themed-styles";

export interface ISplitterProps {
    left: JSX.Element;
    right: JSX.Element;
}

const Base = styled.div`
    display: flex;
    min-height: 80vh;
`;

const Pane = styled.div``;

const Left = Pane.extend`
    width: 200px;
    border-right: 1px solid lightgray;

    flex-grow: 0;
    flex-shrink: 0;

    padding-right: 20px;
`;

const Right = Pane.extend`
    flex-grow: 1;

    padding-left: 20px;
`;

export class Splitter extends React.Component<ISplitterProps> {
    render(): JSX.Element {
        const { left, right } = this.props;

        return (
            <Base>
                <Left>{left}</Left>
                <Right>{right}</Right>
            </Base>
        );
    }
}
