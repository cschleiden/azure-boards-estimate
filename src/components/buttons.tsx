import { Button, IButtonProps } from "azure-devops-ui/Button";
import * as React from "react";
import "./buttons.scss";
export { MoreButton } from "azure-devops-ui/Menu";

export const DefaultButton = (props: IButtonProps) => <Button {...props} />;

export const PrimaryButton = (props: IButtonProps) => (
    <Button {...props} primary />
);
