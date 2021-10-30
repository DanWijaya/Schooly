export default function Select(theme) {
  return {
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
  };
}
