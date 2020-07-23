import React, { Component } from "react";
import TextField from "@material-ui/core/TextField";
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
  },
  label: {
    border: "1px solid #ccc",
    display: "inline-block",
    width: "100px",
    padding: "6px 12px",
    cursor: "pointer",
  },
});

class Tester extends Component {
  render() {
    const { classes } = this.props;

    return(
      <div style={{display: "flex", margin: "auto", flexDirection: "column"}}>
        <label className={classes.label}>
          <input type="file" style={{display: "none"}}/>
          Custom Upload
        </label>
      </div>
    )
  }
}

export default (withStyles(styles)(Tester))
