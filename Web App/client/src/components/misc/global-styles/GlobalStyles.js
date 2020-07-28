import { createMuiTheme, responsiveFontSizes } from "@material-ui/core/styles";
import { fade } from "@material-ui/core/styles/colorManipulator";

export const globalStyles = responsiveFontSizes(createMuiTheme({
  palette: {
    primary: {
      main: "#2196F3",
      light: "#64B5F6",
      dark: "#1976D2",
    },
    info: {
      main: "#1976D2",
      light: "#4791DB",
      dark: "#115293",
    },
    button: {
      main: fade("#2196F3", 0.15),
    },
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
          backgroundColor: "#2196F3",
        },
        "&:hover": {
          backgroundColor: "transparent"
        },
      },
    },
    MuiPickersDay: {
      daySelected: {
        "&:focus, &:hover": {
          backgroundColor: "#2196F3",
        },
      },
    },
    MuiIconButton: {
      root: {
        "&:focus": {
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
    MuiSelect: {
      SelectDisplayProps: {
        style: {
          paddingTop: "14px",
          paddingBottom: "14px",
          paddingLeft: "15px",
        },
      },
    },
    MuiTextField: {
      inputProps: {
        style: {
          borderBottom: "none",
          boxShadow: "none",
          margin: "0px 15px 0px 15px",
          WebkitBoxShadow: "0 0 0 1000px white inset",
        },
      },
    },
  },
}));
