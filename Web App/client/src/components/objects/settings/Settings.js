import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import {
  getSetting,
  createSetting,
  editSetting,
} from "../../../actions/SettingActions";
import {
  Grid,
  Paper,
} from "@material-ui/core/";
import { withStyles } from "@material-ui/core/styles";

/* Ingat kalau :
 Di Class Component : Pakai withStyles 
 Functional Component: Pakai useStyles
*/

// Yang dibawah ini udah benar, tapi untuk functional component. (Nanti dihapus aja comment ini)
/* 
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

dan cara pakainya itu di bawah fungsi render, definisikan: 
const classes = useStyles();
*/


// Yang benar untuk class component seperti ini. Dan cara pakainya itu dibawah fungsi render, didefiniskan: 
// const { classes } = this.props;

const styles = (theme) => ({
  root: {
    margin: "auto",
    maxWidth: "80%",
    [theme.breakpoints.down("md")]: {
      maxWidth: "100%",
    },
    padding: "10px",
  },
})

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


// Aku tebaknya error tadi karena pakai useStyles, jadi dia ngerusak connect to mapStateToPropsnya, jadi pas didispatch payload ke storenya ada masalah. 
export default withRouter(connect(mapStateToProps, {
  getSetting,
  createSetting,
  editSetting,
})(withStyles(styles)(Setting)));