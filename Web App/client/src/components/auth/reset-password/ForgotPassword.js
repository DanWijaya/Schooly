import React, { Component } from "react";
import { withRouter, Link } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { createHash } from "../../../actions/AuthActions";
import { clearErrors } from "../../../actions/ErrorActions";
import schoolyLogo from "../../../images/SchoolyLogo.png";
import resetPasswordArt from "./PasswordArt.png";
import {
  Button,
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
    padding: "40px",
    maxWidth: "650px",
    [theme.breakpoints.down("sm")]: {
      maxWidth: "400px",
    },
  },
  buttonsContainer: {
    marginTop: "15px",
  },
  backButton: {
    color: theme.palette.primary.main,
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
    marginTop: "15px",
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
    this.setState({ [e.target.id]: e.target.value, errors: {} });
  };

  // Dispatch is used as a callback which gets invoked once some async action is complete.
  // In redux-thunk dispatch is simply a function which dispatches an action to the Redux store after, let's say, you fetch data from an api (which is asynchronous).
  onSubmit = (e) => {
    e.preventDefault();
    this.props.createHash(this.state.email.toLowerCase()).catch((err) => {
      this.setState({ errors: err });
    });
  };

  componentDidMount() {
    this.props.handleNavbar(false);
  }

  componentWillUnmount() {
    this.props.clearErrors();
    this.props.handleNavbar(true);
  }

  render() {
    const { classes } = this.props;
    const { isPasswordReset } = this.props.passwordMatters;
    const { email, errors } = this.state;

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
          <Grid container alignItems="center" spacing={6}>
            <Grid item xs={12} md={7}>
              <Grid container direction="column" spacing={6}>
                {!isPasswordReset ? (
                  <Grid item>
                    <Typography variant="h6" gutterBottom>
                      <b>Lupa Kata Sandi?</b>
                    </Typography>
                    <Typography variant="body1" color="textSecondary">
                      Tautan untuk mengganti kata sandi Anda akan dikirimkan
                      kepada email untuk akun yang bersangkutan.
                    </Typography>
                  </Grid>
                ) : (
                  <Grid item>
                    <Typography variant="h6" gutterBottom>
                      <b>Email telah dikirim</b>
                    </Typography>
                    <Typography variant="body1" color="textSecondary">
                      Silahkan buka email tersebut untuk melanjutkan.
                    </Typography>
                  </Grid>
                )}
                <Grid item>
                  {!isPasswordReset ? (
                    <form noValidate onSubmit={this.onSubmit}>
                      <Grid container direction="column" spacing={6}>
                        <Grid item>
                          <TextField
                            fullWidth
                            variant="outlined"
                            id="email"
                            type="email"
                            label="Email"
                            onChange={this.onChange}
                            value={email}
                            error={Boolean(errors.problem)}
                            helperText={errors.problem}
                          />
                        </Grid>
                        <Grid
                          item
                          container
                          justify="space-between"
                          className={classes.buttonsContainer}
                        >
                          <Grid item>
                            <Link to="/masuk">
                              <Button className={classes.backButton}>
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
                              Kirim
                            </Button>
                          </Grid>
                        </Grid>
                      </Grid>
                    </form>
                  ) : (
                    <Button
                      variant="contained"
                      className={classes.resendEmailButton}
                      onClick={() => window.location.reload()}
                    >
                      Kirim Ulang Email
                    </Button>
                  )}
                </Grid>
              </Grid>
            </Grid>
            <Hidden smDown>
              <Grid item xs={5}>
                <img
                  alt="Reset Password Art"
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
