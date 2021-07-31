import React from "react";
import { CircularProgress, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  loadingBackground: {
    backgroundColor: "white",
    position: "fixed",
    top: "0",
    left: "0",
    height: "100%",
    width: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    zIndex: theme.zIndex.tooltip,
  },
}));

function ProgressIndicator() {
  const classes = useStyles();

  return (
    <div className={classes.loadingBackground}>
      <CircularProgress size="3rem" disableShrink />
      <Typography variant="h4" style={{ marginTop: "1rem" }}>
        Memuat...
      </Typography>
    </div>
  );
}

export default ProgressIndicator;
