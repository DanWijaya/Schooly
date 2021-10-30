import { fade } from "@material-ui/core/styles/colorManipulator";

const palette = {
  primary: {
    light: "#64B5F6",
    main: "#2196F3",
    dark: "#1976D2",
    fade: fade("#2196F3", 0.15),
  },
  secondary: {
    light: "#E33371",
    main: "#DC004E",
    dark: "#9A0036",
    fade: fade("#DC004E", 0.15),
  },
  success: {
    light: "#81C784",
    main: "#61BD4F",
    dark: "#388E3C",
    fade: fade("#61BD4F", 0.15),
  },
  info: {
    light: "#4791DB",
    main: "#1976D2",
    dark: "#115293",
    fade: fade("#1976D2", 0.15),
  },
  warning: {
    light: "#FFB74D",
    main: "#FF9800",
    dark: "#F57C00",
    fade: fade("#FF9800", 0.15),
  },
  error: {
    light: "#E57373",
    main: "#F44336",
    dark: "#D32F2F",
    fade: fade("#F44336", 0.15),
  },
};

export default palette;
