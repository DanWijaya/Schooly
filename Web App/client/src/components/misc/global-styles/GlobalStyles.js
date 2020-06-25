import { createMuiTheme, responsiveFontSizes } from "@material-ui/core/styles";
import { fade } from "@material-ui/core/styles/colorManipulator";

export const globalStyles = responsiveFontSizes(createMuiTheme({
  palette: {
    primary: {
      main: "#2196f3",
      light: "#64b5f6",
      dark: "#1976d2",
    },
    info: {
      main: "#1976d2",
      light: "#4791db",
      dark: "#115293",
    },
    custombutton: {
      main: fade("#2196f3", 0.15),
    }
  },
  overrides: {
    MuiButton: {
      root: {
        "&:focus, &:hover": {
          backgroundColor: "transparent",
        },
      },
    },
    MuiFab: {
      root: {
        "&:focus": {
          backgroundColor: "#2196f3",
        },
        "&:hover": {
          backgroundColor: "transparent"
        },
      }
    },
    MuiPickersDay:{
      daySelected: {
        "&:focus, &:hover": {
          backgroundColor: "#2196f3",
        },
      },
    },
    MuiIconButton: {
      root: {
        "&:focus, &:hover": {
          backgroundColor: "transparent",
        },
      },
    },
    MuiTab: {
      root: {
        "&:focus": {
          backgroundColor: "transparent",
        },
      },
    },
  },
  props: {
    MuiTab: {
      disableRipple: true,
    },
  },
}));
