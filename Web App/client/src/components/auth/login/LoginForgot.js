import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import classnames from "classnames";
import { createHash, password } from "../../../actions/AuthActions";
import schoolyLogo from "../../../images/SchoolyLogo.png";
import authBackground from "../AuthBackground.png";
import OutlinedTextField from "../../misc/text-field/OutlinedTextField";
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
  containedButton: {
    backgroundColor: theme.palette.primary.main,
    color: "white",
    width: "100%",
    marginTop: "30px",
    "&:focus, &:hover": {
      backgroundColor: theme.palette.primary.main,
      color: "white",
    },
  }
});

class LoginForgot extends Component {
  constructor(props) {
    super(props);
    this.state = {
      errors: {},
      activeStep: 0,
      email: "",
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
  onSubmit = (e) => {
    e.preventDefault();
    console.log("Submitted")
    this.props.createHash(this.state.email)
  }

  render() {
    document.title = "Schooly | Lupa Akun"
    document.body.style = "background: linear-gradient(#6A8CF6, #FFFFFF); background-repeat: no-repeat";

    const { errors, email } = this.state;
    const { classes} = this.props;
    const { isPasswordReset} = this.props.passwordMatters

    return (
      <div className={classes.root}>
        <img src={schoolyLogo} className={classes.schoolyLogo} alt="schooly logo" />
        <Paper>
            <Grid
              container
              direction="column"
              alignItems="center"
              justify="space-between"
              spacing={3}
              className={classes.loginForgotGrid}
            >
              {!isPasswordReset ?
                <Grid item className={classes.infoTitle}>
                  <Typography variant="h6" gutterBottom>
                    <b>Lupa Kata Sandi?</b>
                  </Typography>
                  <Typography variant="body1">
                    Masukkan email dan nomor telepon anda untuk melanjutkan.
                  </Typography>
                </Grid>
                :
                <Grid item className={classes.infoTitle}>
                  <Typography variant="h6" gutterBottom>
                  Sebuah email telah dikirimkan ke alamat email yang anda berikan.
                  </Typography>
                  <Typography variant="body1">
                    <b>Silahkan klik tautan itu untuk melanjutkan mengganti password</b>
                  </Typography>
                </Grid>
              }
              <Grid item style={{width:"300px"}} >
                {!isPasswordReset ?
                  <form noValidate onSubmit={this.onSubmit}>
                    <div style={{marginBottom: "20px"}}>
                      <OutlinedTextField
                        on_change={this.onChange}
                        value={email}
                        id="email"
                        type="email"
                        classname={classnames("", {
                          invalid: errors.email || errors.emailnotfound
                        })}
                        html_for="email"
                        labelname="Email"
                        span_classname={classes.errorInfo}
                        error1={errors.problem}
                      />
                    </div>
                    <Button
                      type="submit"
                      className={classes.containedButton}
                    >
                      Ubah Kata Sandi
                    </Button>
                  </form>
                  :
                  <Button
                    onClick={() => window.location.reload()}
                    className={classes.containedButton}
                  >
                    Kirim Ulang Email
                  </Button>
                }
              </Grid>
            </Grid>
        </Paper>
      </div>
    )
  }
}

LoginForgot.propTypes = {
  createHash: PropTypes.func.isRequired,
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
  connect(mapStateToProps, { createHash })
  (withStyles(styles)(LoginForgot)));
