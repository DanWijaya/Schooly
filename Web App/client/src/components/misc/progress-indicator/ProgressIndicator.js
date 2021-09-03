import React from "react";
import CircularProgress from "@material-ui/core/CircularProgress";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  progressIndicator: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    position: "fixed",
    top: "0",
    left: "0",
    width: "100%",
    height: "100%",
    zIndex: theme.zIndex.tooltip,
  },
}));

function ProgressIndicator() {
  const classes = useStyles();

  return (
    <div className={classes.progressIndicator}>
      <CircularProgress size="3rem" disableShrink />
      <Typography variant="h4" style={{ marginTop: "15px" }}>
        Memuat...
      </Typography>
    </div>
  );
}

export default ProgressIndicator;
