import { Button, IButtonProps } from "azure-devops-ui/Button";
import { IMenuButtonProps, MenuButton } from "azure-devops-ui/Menu";
import * as React from "react";
import styled from "../styles/themed-styles";

export const DefaultButton = (props: IButtonProps) => <Button {...props} />;

export const PrimaryButton = (props: IButtonProps) => (
  <Button {...props} primary />
);

export const MoreButton = styled((props: IMenuButtonProps) => (
  <MenuButton {...props} />
))`
  min-width: 0;

  & span {
    padding-right: 0;
  }

  & span:last-of-type {
    display: none;
  }
`;
