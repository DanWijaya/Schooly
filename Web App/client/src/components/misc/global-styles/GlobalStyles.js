import { createMuiTheme, responsiveFontSizes } from "@material-ui/core/styles";
import { fade } from "@material-ui/core/styles/colorManipulator";

export const globalStyles = responsiveFontSizes(
  createMuiTheme({
    palette: {
      primary: {
        main: "#2196f3",
        light: "#64b5f6",
        dark: "#1976d2",
        fade: fade("#2196f3", 0.15),
      },
      secondary: {
        main: "#dc004e",
        light: "#e33371",
        dark: "#9a0036",
      },
      success: {
        main: "#4caf50",
        light: "#81c784",
        dark: "#388e3c",
      },
      info: {
        main: "#1976d2",
        light: "#4791db",
        dark: "#115293",
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
      dropbox: {
        main: "#0d2481",
      },
      radio: {
        main: "#02AFF8",
      },
      checkbox: {
        main: "#049F90",
      },
      shorttext: {
        main: "#FD7D2E",
      },
      longtext: {
        main: "#B2417C",
      },
      copylink: {
        main: "#974994",
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
            backgroundColor: "transparent",
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
      MuiPickersDay: {
        daySelected: {
          "&:focus, &:hover": {
            backgroundColor: "#2196f3",
          },
        },
      },
      PrivateNotchedOutline: {
        legendLabelled: {
          maxWidth: "none",
        },
      },
      MuiFilledInput: {
        multiline: {
          padding: "18.5px 0px",
        },
      },
      MuiOutlinedInput: {
        multiline: {
          padding: "18.5px 0px"
        }
      },
      MuiAutocomplete: {
        input: {
          borderBottom: "none!important",
          boxShadow: "none!important",
          margin: "0px 15px 0px 15px!important",
          WebkitBoxShadow: "0 0 0 1000px white inset!important",
          width: "0!important"
        },
      }
    },
    props: {
      MuiTab: {
        disableRipple: true,
      },
      MuiInputLabel: {
        shrink: true,
        style: {
          backgroundColor: "white",
        },
      },
      MuiSelect: {
        SelectDisplayProps: {
          style: {
            paddingTop: "14px",
            paddingBottom: "14px",
            paddingLeft: "15px",
            backgroundColor: "white",
            "&:focus, &:hover, &:active": {
              backgroundColor: "white",
              opacity: 1,
            },
          },
        },
      },
      TextField: {
        InputLabelProps: {
          shrink: true,
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
            margin: "0px 15px 5px 15px",
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
  })
);
