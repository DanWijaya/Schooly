import { createMuiTheme, responsiveFontSizes } from "@material-ui/core/styles";
import { fade } from "@material-ui/core/styles/colorManipulator";

const Styles = responsiveFontSizes(
  createMuiTheme({
    palette: {
      primary: {
        main: "#2196F3",
        light: "#64B5F6",
        dark: "#1976D2",
        fade: fade("#2196F3", 0.15),
      },
      secondary: {
        main: "#DC004E",
        light: "#E33371",
        dark: "#9A0036",
      },
      success: {
        main: "#61BD4F",
        light: "#81C784",
        dark: "#388E3C",
      },
      info: {
        main: "#1976D2",
        light: "#4791DB",
        dark: "#115293",
      },
      warning: {
        main: "#FF9800",
        light: "#FFB74D",
        dark: "#F57C00",
      },
      error: {
        main: "#F44336",
        light: "#E57373",
        dark: "#D32F2F",
        fade: fade("#F44336", 0.15),
      },
      dropbox: {
        main: "#0D2481",
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
        fade: fade("#974994", 0.15),
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
      MuiListItemIcon: {
        alignItemsFlexStart: {
          marginTop: "4px",
        },
      },
      MuiPickersDay: {
        daySelected: {
          "&:focus, &:hover": {
            backgroundColor: "#2196F3",
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
      MuiFilledInput: {
        multiline: {
          padding: "18.5px 0px",
        },
      },
      MuiOutlinedInput: {
        multiline: {
          padding: "18.5px 0px",
        },
      },
      MuiAutocomplete: {
        input: {
          borderBottom: "none!important",
          boxShadow: "none!important",
          margin: "0px 15px 0px 15px!important",
          WebkitBoxShadow: "0 0 0 1000px white inset!important",
          width: "0!important",
        },
      },
      PrivateNotchedOutline: {
        legendLabelled: {
          maxWidth: "none",
        },
      },
    },
    props: {
      MuiTab: {
        disableRipple: true,
      },
      MuiInputLabel: {
        shrink: true,
        style: {
          backgroundColor: "transparent",
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
            margin: "0px 15px",
          },
        },
      },
      MuiOutlinedInput: {
        inputProps: {
          style: {
            borderBottom: "none",
            boxShadow: "none",
            margin: "0px 15px",
            WebkitBoxShadow: "0 0 0 1000px white inset",
          },
        },
      },
    },
  })
);

export default Styles;
