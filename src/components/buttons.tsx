import { DefaultButton as OfficeFabricDefaultButton, IButtonProps, PrimaryButton as OfficeFabricPrimaryButton } from "office-ui-fabric-react";
import * as React from "react";
import styled from "../styles/themed-styles";

export const DefaultButton = styled((props: IButtonProps) => <OfficeFabricDefaultButton {...props} />)`
    border-radius: 2px;
`;

export const PrimaryButton = styled((props: IButtonProps) => <OfficeFabricPrimaryButton {...props} />)`
    border-radius: 2px;
`;

export const MoreButton = DefaultButton.extend`
    min-width: 0;
    padding: 4px !important;

    & i:last-of-type {
        display: none;
    }
`;