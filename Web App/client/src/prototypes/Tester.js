import React, { Component } from "react";
import { AppBar, Button, Divider, FormControl, Grid, IconButton, InputAdornment, Link, MenuItem, Paper, OutlinedInput, Select, TextField, Toolbar, Typography } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import VisibilityIcon from "@material-ui/icons/Visibility";
import VisibilityOffIcon from "@material-ui/icons/VisibilityOff";

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
        <TextField variant="outlined" /><Select variant="outlined" />
      </div>
    )
  }
}

export default (withStyles(styles)(Tester))
