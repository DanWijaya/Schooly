import React, { Component } from "react";
import { withRouter, Link } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import classnames from "classnames";
import { savePassword } from "../../../actions/AuthActions";
import { clearErrors } from "../../../actions/ErrorActions";
import schoolyLogo from "../../../images/SchoolyLogo.png";
import resetPasswordArt from "./ResetPasswordArt.png";
import { Button, Grid, Hidden, Paper, TextField, Typography } from "@material-ui/core";
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
    width: "250px",
    height: "125px",
    marginBottom: "25px",
  },
  artThumbnail: {
    maxWidth: "100%",
    maxHeight: "100%",
  },
  resetPasswordPaper: {
    margin: "auto",
    padding: "40px",
    maxWidth: "650px",
    [theme.breakpoints.down("sm")]: {
      maxWidth: "400px",
    },
  },
  changePasswordButton: {
    marginTop: "15px",
    width: "100%",
    backgroundColor: theme.palette.primary.main,
    color: "white",
    "&:focus, &:hover": {
      backgroundColor: theme.palette.primary.main,
      color: "white",
    },
  },
});

class ResetPassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      errors: {},
      password: "",
      password2: "",
    };
  }
  onChange = (e) => {
    this.setState({ [e.target.id]: e.target.value });
  };

  componentDidMount() {
    this.props.handleNavbar(false);
  }

  componentWillUnmount() {
    this.props.clearErrors();
    this.props.handleNavbar(true);
  }

  //Dispatch is used as a callback which gets invoked once some async action is complete.
  //In redux-thunk dispatch is simply a function which dispatches an action to the Redux store after, let's say, you fetch data from an api (which is asynchronous).

  render() {
    const { password, password2 } = this.state;
    const { errors } = this.props;
    const { classes, savePassword } = this.props;
    const { hash } = this.props.match.params;

    const onSubmit = (e) => {
      e.preventDefault();
      console.log("Submitted");

      let passwordReset = {
        password: password,
        password2: password2,
        hash: hash,
      };
      savePassword(passwordReset);
    };

    document.title = "Schooly | Ubah Kata Sandi";

    return (
      <div className={classes.root}>
        <Link to="/">
          <img
            alt="Schooly Introduction"
            src={schoolyLogo}
            className={classes.schoolyLogo}
          />
        </Link>
        <Paper elevation={11} className={classes.resetPasswordPaper}>
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={7}>
              <Grid container direction="column" spacing={6}>
                <Grid item>
                  <Typography variant="h6" gutterBottom>
                    <b>Ubah Kata Sandi</b>
                  </Typography>
                  <Typography variant="body1" color="textSecondary">
                    Masukkan kata sandi baru Anda. Kata sandi harus terdiri dari minimal 8 karakter dengan kombinasi huruf kapital dan angka.
                  </Typography>
                </Grid>
                <Grid item>
                  <form noValidate onSubmit={onSubmit}>
                    <Grid container direction="column" spacing={6}>
                      <Grid item>
                        <TextField
                          fullWidth
                          variant="outlined"
                          id="password"
                          label="Kata Sandi Baru"
                          onChange={this.onChange}
                          value={password}
                          error={Boolean(errors.password_entry)}
                          type="password"
                          helperText={errors.password_entry}
                          classname={classnames("", {
                            invalid: errors.email || errors.emailnotfound,
                          })}
                        />
                      </Grid>
                      <Grid item>
                        <TextField
                          fullWidth
                          variant="outlined"
                          id="password2"
                          label="Konfirmasi Kata Sandi Baru"
                          onChange={this.onChange}
                          value={password2}
                          error={Boolean(errors.password_match)}
                          type="password"
                          helperText={errors.password_match}
                          classname={classnames("", {
                            invalid: errors.email || errors.emailnotfound,
                          })}
                        />
                      </Grid>
                      <Grid item>
                        <Button
                          variant="contained"
                          type="submit"
                          className={classes.changePasswordButton}
                        >
                          Ubah Kata Sandi
                        </Button>
                      </Grid>
                    </Grid>
                  </form>
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

ResetPassword.propTypes = {
  savePassword: PropTypes.func.isRequired,
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
  connect(mapStateToProps, { savePassword, clearErrors })(
    withStyles(styles)(ResetPassword)
  )
);
