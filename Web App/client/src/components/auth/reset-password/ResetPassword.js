import React, { Component } from "react";
import { withRouter, Link } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import {
  Button,
  Grid,
  Hidden,
  Paper,
  TextField,
  Typography,
} from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import { savePassword } from "../../../actions/AuthActions";
import { clearErrors } from "../../../actions/ErrorActions";

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
  passwordArt: {
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
      password: "",
      password2: "",
      errors: {},
    };
  }

  componentDidMount() {
    this.props.handleNavbar(false);
  }

  componentWillUnmount() {
    this.props.clearErrors();
    this.props.handleNavbar(true);
  }

  onChange = (e) => {
    this.setState({
      [e.target.id]: e.target.value,
      errors: { ...this.state.errors, [e.target.id]: null },
    });
  };

  render() {
    const { classes, errors, savePassword } = this.props;
    const { hash } = this.props.match.params;
    const { password, password2 } = this.state;

    const onSubmit = (e) => {
      e.preventDefault();

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
            src="/logos/SchoolyLogo.png"
            className={classes.schoolyLogo}
          />
        </Link>
        <Paper elevation={11} className={classes.resetPasswordPaper}>
          <Grid container alignItems="center" spacing={6}>
            <Grid item xs={12} md={7}>
              <Grid container direction="column" spacing={6}>
                <Grid item>
                  <Typography variant="h6" gutterBottom>
                    Ubah Kata Sandi
                  </Typography>
                  <Typography variant="body1" color="textSecondary">
                    Masukkan kata sandi baru Anda. Kata sandi harus terdiri dari
                    minimal 8 karakter dengan kombinasi huruf kapital dan angka.
                  </Typography>
                </Grid>
                <Grid item>
                  <form noValidate onSubmit={onSubmit}>
                    <Grid container direction="column" spacing={6}>
                      <Grid item>
                        <TextField
                          fullWidth
                          variant="outlined"
                          size="small"
                          id="password"
                          type="password"
                          label="Kata Sandi Baru"
                          onChange={this.onChange}
                          value={password}
                          error={Boolean(errors.password_entry)}
                          helperText={errors.password_entry}
                        />
                      </Grid>
                      <Grid item>
                        <TextField
                          fullWidth
                          variant="outlined"
                          size="small"
                          id="password2"
                          type="password"
                          label="Konfirmasi Kata Sandi Baru"
                          onChange={this.onChange}
                          value={password2}
                          error={Boolean(errors.password_match)}
                          helperText={errors.password_match}
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
                  alt="Password Art"
                  src="/images/illustrations/PasswordArt.png"
                  className={classes.passwordArt}
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
  auth: PropTypes.object.isRequired,
  passwordMatters: PropTypes.object.isRequired,
  savePassword: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth, // Get Redux State and map it to props so it can be used inside the component.
  passwordMatters: state.passwordMatters,
  errors: state.errors,
});

export default withRouter(
  connect(mapStateToProps, { savePassword, clearErrors })(
    withStyles(styles)(ResetPassword)
  )
);
