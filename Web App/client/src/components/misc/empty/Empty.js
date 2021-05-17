import React from "react";
import { withStyles } from "@material-ui/core/styles";
import { Typography } from "@material-ui/core/";

const styles = (theme) => ({
  greyBackground: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    padding: "15px",
    height: "100%",
    backgroundColor: "#e3e5e5",
  },
});

function Empty(props) {
  const { classes } = props;

  return (
    <div
      style={{ height: "200px", width: "100%", padding: "0px 10px 0px 10px" }}
    >
      <div className={classes.greyBackground}>
        <Typography align="center" color="textSecondary">
          Kosong
        </Typography>
      </div>
    </div>
  );
}

export default withStyles(styles)(Empty);
