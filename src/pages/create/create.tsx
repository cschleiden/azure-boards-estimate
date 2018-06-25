import * as React from "react";
import { IPageProps } from "../props";

export interface ICreatePageProps extends IPageProps<{}> {
}

export class CreatePage extends React.Component<ICreatePageProps> {
    public render(): JSX.Element {
        return (
            <div>
                Test
            </div>
        );
    }
}