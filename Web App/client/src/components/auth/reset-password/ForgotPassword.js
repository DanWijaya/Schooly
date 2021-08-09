import React, { Component } from "react";
import { withRouter, Link } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import classnames from "classnames";
import { createHash } from "../../../actions/AuthActions";
import { clearErrors } from "../../../actions/ErrorActions";
import schoolyLogo from "../../../images/SchoolyLogo.png";
import resetPasswordArt from "./ResetPasswordArt.png";
import {
  Button,
  Divider,
  Grid,
  Hidden,
  Paper,
  TextField,
  Typography,
} from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";

const styles = (theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    margin: "auto",
    padding: "10px",
    background: "linear-gradient(#2196F3, #FFFFFF)",
    backgroundSize: "100% 300px",
    backgroundRepeat: "no-repeat",
  },
  schoolyLogo: {
    maxWidth: "250px",
    maxHeight: "125px",
    marginBottom: "25px",
  },
  artThumbnail: {
    maxWidth: "100%",
    maxHeight: "100%",
  },
  forgotPasswordPaper: {
    margin: "auto",
    width: "650px",
    [theme.breakpoints.down("md")]: {
      maxWidth: "360px",
    },
    padding: "40px",
  },
  changePasswordButton: {
    backgroundColor: theme.palette.primary.main,
    color: "white",
    "&:focus, &:hover": {
      backgroundColor: theme.palette.primary.main,
      color: "white",
    },
  },
  resendEmailButton: {
    width: "100%",
    backgroundColor: theme.palette.success.main,
    color: "white",
    "&:focus, &:hover": {
      backgroundColor: theme.palette.success.main,
      color: "white",
    },
  },
});

class ForgotPassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      errors: {},
      activeStep: 0,
      email: "",
    };
  }

  onChange = (e) => {
    this.setState({ [e.target.id]: e.target.value });
  };

  // Dispatch is used as a callback which gets invoked once some async action is complete.
  // In redux-thunk dispatch is simply a function which dispatches an action to the Redux store after, let's say, you fetch data from an api (which is asynchronous).
  onSubmit = (e) => {
    e.preventDefault();
    console.log("Submitted");
    this.props.createHash(this.state.email.toLowerCase());
  };

  componentDidMount() {
    this.props.handleNavbar(false);
  }
  componentWillUnmount() {
    this.props.clearErrors();
    this.props.handleNavbar(true);
  }

  render() {
    const { classes, errors } = this.props;

    const { email } = this.state;
    const { isPasswordReset } = this.props.passwordMatters;

    document.title = "Schooly | Lupa Kata Sandi";

    return (
      <div className={classes.root}>
        <Link to="/">
          <img
            alt="Schooly Logo"
            src={schoolyLogo}
            className={classes.schoolyLogo}
          />
        </Link>
        <Paper elevation={11} className={classes.forgotPasswordPaper}>
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} lg={7}>
              <Grid container direction="column" spacing={5}>
                {!isPasswordReset ? (
                  <Grid item>
                    <Typography variant="h6" gutterBottom>
                      <b>Lupa Kata Sandi?</b>
                    </Typography>
                    <Typography
                      variant="body1"
                      color="textSecondary"
                    >
                      Masukkan email akun Anda untuk melanjutkan.
                    </Typography>
                  </Grid>
                ) : (
                  <Grid item>
                    <Typography variant="h6" align="center" gutterBottom>
                      <b>Email telah dikirim</b>
                    </Typography>
                    <Typography
                      variant="body1"
                      align="center"
                      color="textSecondary"
                    >
                      Silahkan buka email tersebut untuk melanjutkan.
                    </Typography>
                  </Grid>
                )}
                <Grid item>
                  {!isPasswordReset ? (
                    <form noValidate onSubmit={this.onSubmit}>
                      <Grid container direction="column" spacing={5}>
                        <Grid item>
                          <TextField
                            fullWidth
                            variant="outlined"
                            id="email"
                            label="Email"
                            onChange={this.onChange}
                            value={email}
                            error={Boolean(errors.problem)}
                            type="email"
                            helperText={errors.problem}
                            className={classnames("", {
                              invalid: errors.email || errors.emailnotfound,
                            })}
                              />
                        </Grid>
                        <Grid item container justify="space-between">
                        <Grid item>
                          <Link to="/masuk">
                            <Button>
                              Kembali
                            </Button>
                          </Link>
                        </Grid>
                        <Grid item>
                          <Button
                            type="submit"
                            variant="contained"
                            className={classes.changePasswordButton}
                          >
                            Ubah Kata Sandi
                          </Button>
                        </Grid>
                        </Grid>
                      </Grid>
                    </form>
                  ) : (
                    <Button
                      onClick={() => window.location.reload()}
                      className={classes.resendEmailButton}
                    >
                      Kirim Ulang Email
                    </Button>
                  )}
                </Grid>
              </Grid>
            </Grid>
            <Hidden mdDown>
              <Grid item xs={5}>
                  <img
                    src={resetPasswordArt}
                    className={classes.artThumbnail}
                  />
              </Grid>
            </Hidden>
          </Grid>
        </Paper>
      </div>
    );
  }
}

ForgotPassword.propTypes = {
  createHash: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  passwordMatters: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth, // Get Redux State and map it to props so it can be used inside the component.
  errors: state.errors,
  passwordMatters: state.passwordMatters,
});

export default withRouter(
  connect(mapStateToProps, { createHash, clearErrors })(
    withStyles(styles)(ForgotPassword)
  )
);
