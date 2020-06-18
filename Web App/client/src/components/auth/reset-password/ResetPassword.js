import React, { Component } from "react";
import { withRouter, Link } from "react-router-dom";
import schoolyLogo from "../../../images/SchoolyLogo.png";
import authBackground from "../AuthBackground.png";
import PropTypes from "prop-types";
import OutlinedTextField from "../../misc/text-field/OutlinedTextField";
import { connect } from "react-redux";
import {savePassword} from "../../../actions/AuthActions";
import classnames from "classnames";
import { Button, Grid, Paper, Typography } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";

const styles = (theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    maxWidth: "750px",
    margin: "auto",
    backgroundImage: `url(${authBackground})`,
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    backgroundSize: "contain",
  },
  loginForgotGrid: {
    maxWidth: "400px",
    padding: "40px",
  },
  schoolyLogo: {
    width: "30%",
    height: "30%",
    marginBottom: "30px",
  },
  infoTitle: {
    textAlign: "center",
  },
  errorInfo: {
    color: "red",
    fontSize: "10px"
  },
  inputField: {
    width: "300px",
  },
});

class ResetPassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      errors: {},
      password: "",
      password2: ""
    };
  }
  onChange = (e) => {
    this.setState({ [e.target.id]: e.target.value})
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.errors) {
      this.setState({
        errors: nextProps.errors
      });
    }
  }

// dispatch is used as a callback which gets invoked once some async action is complete. 
// In redux-thunk dispatch is simply a function which dispatches an action to the Redux store after, let's say, you fetch data from an api (which is asynchronous).
  
  render() {
    
    document.title = "Lupa Akun"
    document.body.style = "background: linear-gradient(#6a8cf6, #ffffff); background-repeat: no-repeat";
    const { password, password2, errors } = this.state;
    const { classes, savePassword} = this.props;
    const { isPasswordReset, isPasswordUpdated } = this.props.passwordMatters
    const { hash } = this.props.match.params;

    const onSubmit = (e) => {
        e.preventDefault();
        console.log("Submitted")
    
        let passwordReset = {
            password : password2,
            hash: hash
        }
        console.log(hash)
        savePassword(passwordReset)
      }

    return (
      <div className={classes.root}>
        <img src={schoolyLogo} className={classes.schoolyLogo} alt="schooly logo" />
        <Paper>
            <Grid
              container
              direction="column"
              alignItems="center"
              justify="space-between"
              spacing={4}
              className={classes.loginForgotGrid}>
                <Grid item className={classes.infoTitle}>
                  <Typography variant="h6" gutterBottom>
                    <b>Ubah Kata Sandi</b>
                  </Typography>
                  <Typography variant="body1">
                    Masukkan Kata Sandi baru anda
                  </Typography>
                </Grid> 

              <Grid item >
                <form noValidate onSubmit={onSubmit}>
                <div style={{marginBottom: "20px"}}>
                    <OutlinedTextField
                      on_change={this.onChange}
                      value={password}
                      id="password"
                      type="password"
                      classname={classnames("", {
                        invalid: errors.email || errors.emailnotfound
                      })}
                      html_for="password"
                      labelname="Kata Sandi"
                      span_classname={classes.errorInfo}
                      error1={errors.reset_problem}
                    />
                </div>

                    <OutlinedTextField
                      on_change={this.onChange}
                      value={password2}
                      id="password2"
                      type="password"
                      classname={classnames("", {
                        invalid: errors.email || errors.emailnotfound
                      })}
                      html_for="password2"
                      labelname="Konfirmasi Kata Sandi"
                      span_classname={classes.errorInfo}
                      error1={errors.reset_problem}
                    />

                  <Button
                    type="submit"
                    style={{
                      backgroundColor: "#2196f3",
                      color: "white",
                      width: "100%",
                      marginTop: "30px"
                    }}
                  >
                    Ubah Kata Sandi
                  </Button>
                </form> 
              </Grid>
            </Grid>
        </Paper>
      </div>
    )
  }
}

ResetPassword.propTypes = {
  savePassword: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  passwordMatters: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
  auth: state.auth, // Get Redux State and map it to props so it can be used inside the component.
  errors: state.errors,
  passwordMatters: state.passwordMatters
});

export default withRouter(
  connect(mapStateToProps, { savePassword })
  (withStyles(styles)(ResetPassword)));
