import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";

const styles = (theme) => ({
  root: {
    margin: "auto",
    maxWidth: "1000px",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    backgroundSize: "contain",
  },
  container: {
    margin: "auto",
    maxWidth: "350px",
    padding: "20px",
  },
  errorInfo: {
    color: "red",
    fontSize: "10px",
  }
});

class Tester extends Component {
  render() {
    const { classes } = this.props;

    return(
      <div style={{display: "flex", margin: "auto", flexDirection: "column"}}>
      </div>
    )
  }
}

export default (withStyles(styles)(Tester))
