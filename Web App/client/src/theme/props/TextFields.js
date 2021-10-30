export default function TextFields.js(theme) {
  return {
    TextField: {
      InputLabelProps: {
        shrink: true,
      },
    },
    MuiInputLabel: {
      shrink: true,
      style: {
        backgroundColor: "transparent",
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
          margin: "0px 15px 2.5px 15px",
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
  };
}
