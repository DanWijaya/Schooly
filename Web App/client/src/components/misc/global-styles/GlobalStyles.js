import { createMuiTheme } from "@material-ui/core/styles";

export const globalStyles = createMuiTheme({
  palette: {
    primary: {
      main: "#2196f3",
    },
  },
  overrides: {
    MuiButton: {
      root: {
        "&:focus": {
          backgroundColor: "transparent",
        },
        "&:hover": {
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
      }
    },
    MuiPickersDay:{
      daySelected: {
        "&:focus": {
          backgroundColor: "#2196f3",
        },
        "&:hover": {
          backgroundColor: "transparent",
        },
      }
    },
    MuiIconButton: {
      root: {
        "&:focus": {
          backgroundColor: "transparent",
        },
        "&:hover": {
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
});
