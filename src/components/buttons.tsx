import { Button, IButtonProps } from "azure-devops-ui/Button";
import { IMenuButtonProps, MenuButton } from "azure-devops-ui/Menu";
import * as React from "react";
import styled from "../styles/themed-styles";

export const DefaultButton = styled((props: IButtonProps) => (
  <Button {...props} />
))`
  border-radius: 2px;
`;

export const PrimaryButton = styled((props: IButtonProps) => (
  <Button {...props} primary />
))`
  border-radius: 2px;
`;

export const MoreButton = styled((props: IMenuButtonProps) => (
  <MenuButton {...props} />
))`
  min-width: 0;
  padding: 4px !important;

  & i:last-of-type {
    display: none;
  }
`;
