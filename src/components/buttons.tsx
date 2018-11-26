import { Button, IButtonProps } from "azure-devops-ui/Button";
import { IMenuButtonProps, MenuButton } from "azure-devops-ui/Menu";
import * as React from "react";
import "./buttons.scss";
import { Icon, css } from "office-ui-fabric-react";

export const DefaultButton = (props: IButtonProps) => <Button {...props} />;

export const IconButton: React.StatelessComponent<IButtonProps> = ({
    iconProps,
    ...props
}) => (
    <Button {...props} className={css("icon-button", props.className)}>
        <Icon iconName={iconProps!.iconName} />
        {props.children}
    </Button>
);

export const PrimaryButton = (props: IButtonProps) => (
    <Button {...props} primary />
);

export const MoreButton = (props: IMenuButtonProps) => (
    <MenuButton {...props} className="menu-button" />
);
