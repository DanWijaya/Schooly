export default function IconButton(theme) {
  return {
    MuiIconButton: {
      root: {
        "&:focus, &:hover": {
          backgroundColor: "transparent",
        },
      },
    },
  };
}
