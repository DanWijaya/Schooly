export default function Pickers(theme) {
  return {
    MuiPickersDay: {
      daySelected: {
        "&:focus, &:hover": {
          backgroundColor: theme.palette.primary.main,
        },
      },
    },
  };
}
