const ToggleViewQuiz = withStyles((theme) => ({
  root: {
    width: 42,
    height: 26,
    padding: 0,
    margin: theme.spacing(1),
  },
  switchBase: {
    padding: 2,
    color: theme.palette.warning.light,
    "&$checked": {
      transform: "translateX(16px)",
      color: theme.palette.common.white,
      "& + $track": {
        backgroundColor: theme.palette.warning.light,
        opacity: 1,
        border: "none",
      },
    },
    "&$focusVisible $thumb": {
      color: "#52D869",
      border: "6px solid #fff",
    },
  },
  thumb: {
    width: 10,
    height: 10,
  },
  track: {
    borderRadius: 24 / 2,
    border: `1px solid ${theme.palette.grey[400]}`,
    backgroundColor: theme.palette.grey[50],
    opacity: 1,
    transition: theme.transitions.create(["background-color", "border"]),
  },
  checked: {},
}))(Switch);


<FormControlLabel
  control={
    <ToggleViewQuiz
      icon={<FiberManualRecordIcon />}
      checkedIcon={<FiberManualRecordIcon />}
      disabled={this.state.isScheduled}
      checked={this.state.posted}
      onChange={this.handlePostToggle}
    />
  }
/>
