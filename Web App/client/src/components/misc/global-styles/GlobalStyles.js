import { createMuiTheme, responsiveFontSizes } from "@material-ui/core/styles";
import { fade } from "@material-ui/core/styles/colorManipulator";

export const globalStyles = responsiveFontSizes(createMuiTheme({
  palette: {
    primary: {
      main: "#2196f3",
      light: "#64b5f6",
      dark: "#1976d2",
    },
    secondary: {
      main: "#f48fb1",
      light: "#f6a5c0",
      dark: "#aa647b",
    },
    success: {
      main: "#61bd4f",
      light: "#81c784",
      dark: "#388e3c",
    },
    info: {
      main: "#90caf9",
      light: "#a6d4fa",
      dark: "#648dae",
    },
    warning: {
      main: "#ff9800",
      light: "#ffb74d",
      dark: "#f57c00",
    },
    error: {
      main: "#f44336",
      light: "#e57373",
      dark: "#d32f2f",
    },
    button: {
      main: fade("#2196f3", 0.15),
    },
    dropbox: {
      main: "#0d2481",
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
          backgroundColor: "#2196f3",
        },
        "&:hover": {
          backgroundColor: "transparent"
        },
      },
    },
    MuiPickersDay: {
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
    MuiSelect: {
      SelectDisplayProps: {
        style: {
          paddingTop: "14px",
          paddingBottom: "14px",
          paddingLeft: "15px",
        },
      },
    },
    MuiInput: {
      InputProps: {
        style: {
          padding: "0px",
        },
      },
      inputProps: {
        style: {
          borderBottom: "none",
          boxShadow: "none",
          margin: "0px",
          WebkitBoxShadow: "0 0 0 1000px white inset",
        },
      },
    },
    MuiFilledInput: {
      inputProps: {
        style: {
          borderBottom: "none",
          boxShadow: "none",
          margin: "0px 15px 0px 15px",
        },
      },
    },
    MuiOutlinedInput: {
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
