import React, { Component } from "react";
import { connect } from "react-redux";
import {
  getSetting,
  createSetting,
  editSetting,
} from "../../../actions/SettingActions";
import {
  Grid,
  Paper,
} from "@material-ui/core/";
import { makeStyles, withStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    margin: "auto",
    maxWidth: "80%",
    [theme.breakpoints.down("md")]: {
      maxWidth: "100%",
    },
    padding: "10px",
  },
}));

class Setting extends Component {
  constructor(){
    super();
  }

  componentDidMount() {
    this.props.getSetting();
  }

  render(){
    const { classes } = this.props;
    
    return (
        <div className={classes.root}>
          <Grid container direction="column">
            <Paper variant="outlined">Hi, Bije</Paper>
            <Paper variant="outlined">Hi, Bije</Paper>
            <Paper variant="outlined">Hi, Bije</Paper>
          </Grid>
        </div>
    );
  }
}

const mapStateToProps = (state) => ({
  errors: state.errors,
  success: state.success,
  auth: state.auth,
  settingsCollection: state.settingsCollection,
});

export default connect(mapStateToProps, {
  getSetting,
  createSetting,
  editSetting,
})(withStyles(useStyles)(Setting));