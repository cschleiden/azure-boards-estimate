import * as styledComponents from "styled-components";
import { ThemedStyledComponentsModule } from "styled-components";

export interface IThemeInterface {
    primaryColor: string;
    primaryColorInverted: string;
}

const {
    default: styled,
    css,
    injectGlobal,
    keyframes,
    ThemeProvider
} = styledComponents as ThemedStyledComponentsModule<IThemeInterface>;

export { css, injectGlobal, keyframes, ThemeProvider };
export default styled;
