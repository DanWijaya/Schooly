import { createMuiTheme, responsiveFontSizes } from "@material-ui/core/styles";
import breakpoints from "./theme/breakpoints";
import palette from "./theme/palette";
import props from "./theme/props";
import overrides from "./theme/overrides";
import typography from "./theme/typography";

const theme = responsiveFontSizes(
  createMuiTheme({
    breakpoints: breakpoints,
    palette: palette,
    typography: typography,
  })
);

theme.props = props(theme);
theme.overrides = overrides(theme);

// For more information check the default theming of material UI.

export default theme;
