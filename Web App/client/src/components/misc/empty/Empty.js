import React from "react";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  empty: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    height: "200px",
    width: "100%",
    padding: "10px",
    backgroundColor: "#E3E5E5",
  },
}));

function Empty(props) {
  const classes = useStyles();

  return (
    <div className={classes.empty}>
      <Typography align="center" color="textSecondary">
        Kosong
      </Typography>
    </div>
  );
}

export default Empty;
