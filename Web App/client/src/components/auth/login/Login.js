import React, { Component } from "react";
import { withRouter, Link, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import classnames from "classnames";
import { loginUser } from "../../../actions/UserActions";
import { clearErrors } from "../../../actions/ErrorActions";
import loginArtLeft from "./LoginArtLeft.png";
import loginArtRight from "./LoginArtRight.png";
import schoolyLogo from "../../../images/SchoolyLogo.png";
import {
  Button,
  Divider,
  Grid,
  Hidden,
  IconButton,
  InputAdornment,
  Paper,
  TextField,
  Typography,
} from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import VisibilityIcon from "@material-ui/icons/Visibility";
import VisibilityOffIcon from "@material-ui/icons/VisibilityOff";

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
  loginPaper: {
    margin: "auto",
    maxWidth: "360px",
    padding: "40px",
  },
  loginButton: {
    width: "100%",
    backgroundColor: theme.palette.success.main,
    color: "white",
    "&:focus, &:hover": {
      backgroundColor: theme.palette.success.main,
      color: "white",
    },
  },
  toggleShowPasswordButton: {
    color: theme.palette.primary.main,
  },
  toggleErrorShowPasswordButton: {
    color: theme.palette.error.main,
  },
});

class Login extends Component {
  constructor() {
    super();
    this.state = {
      email: "",
      password: "",
      errors: {},
      isAuthenticated: false,
      passwordIsMasked: true, // True = masked
      icon: true, // True = shown
      passwordtextfieldFocus: false,
    };
  }

  componentDidMount() {
    // If logged in and user navigates to Login page, should redirect them to dashboard
    // this.props.auth.isAuthenticated = true, means that the user is logged in dan moved into the Landing page instantly.

    if (this.props.auth.isAuthenticated) {
      this.props.history.push("/beranda");
    }
    this.props.handleNavbar(false);
  }

  componentWillUnmount() {
    this.props.clearErrors();
    const { handleNavbar } = this.props;
    handleNavbar(true);
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    // This static function belongs to the class as a whole thing, not as a instance of the class.
    //  That's why there is no this keyword.
    if (nextProps.auth.isAuthenticated)
      // nextProps.auth.isAuthenticated = kalau true,
      return { isAuthenticated: nextProps.auth.isAuthenticated };
    // This is the same with this.setState({ isAuthenticated : nextProps.auth.isAuthenticated })
    else return null;
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      this.state.isAuthenticated &&
      this.props.auth.isAuthenticated !== prevProps.auth.isAuthenticated
    ) {
      // When students who haven't logged in open the assessment page,
      // The page will be redirected to the assessment page after that student logged in.
      if (this.props.location.state && this.props.location.state.url) {
        window.location.href = `.${this.props.location.state.url}`;
      } else {
        // to redirect to the Landing page.
        window.location.href = "./beranda";
      }
      this.props.handleLoading(true);
    }
  }

  onChange = (e) => {
    this.setState({ [e.target.id]: e.target.value });
  };

  onSubmit = (e) => {
    e.preventDefault();
    const userData = {
      email: this.state.email.toLowerCase(),
      password: this.state.password,
    };
    this.props.loginUser(userData).catch((err) => {
      this.setState({ errors: err });
    });
  };

  togglePasswordVisibility = () => {
    this.setState((prevState) => ({
      passwordIsMasked: !prevState.passwordIsMasked,
      icon: !prevState.icon,
    }));
  };

  setIsFocused = (bool) => {
    this.setState({ passwordtextfieldFocus: bool });
  };

  render() {
    const { classes } = this.props;
    const {
      passwordIsMasked,
      icon,
      errors,
      passwordtextfieldFocus,
    } = this.state;

    document.title = "Masuk ke Schooly";

    return (
      <div className={classes.root}>
        <Link to="/">
          <img
            src={schoolyLogo}
            className={classes.schoolyLogo}
          />
        </Link>
        <Grid container justify="space-between" alignItems="flex-end" spacing={2} style={{maxWidth: "80%"}}>
        <Grid item item xs={3}>
          <Hidden smDown>
            <img
              src={loginArtLeft}
              style={{
                maxWidth: "100%",
                maxHeight: "100%",
              }}
            />
          </Hidden>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper elevation={11} className={classes.loginPaper}>
            <Grid container direction="column" spacing={5}>
              <Grid item>
                <Typography variant="h6" align="center">
                  <b>Masuk ke Schooly</b>
                </Typography>
              </Grid>
              <Grid item>
                <form noValidate onSubmit={this.onSubmit}>
                  <Grid container direction="column" spacing={4}>
                    <Grid item>
                      <TextField
                        fullWidth
                        variant="outlined"
                        id="email"
                        type="email"
                        label="Email"
                        onChange={this.onChange}
                        value={this.state.email}
                        helperText={
                          errors.email || errors.emailnotfound || errors.notactive
                        }
                        error={Boolean(
                          errors.email || errors.emailnotfound || errors.notactive
                        )}
                        className={classnames("", {
                          invalid: errors.email || errors.emailnotfound,
                        })}
                      />
                    </Grid>
                    <Grid item>
                      <TextField
                        fullWidth
                        variant="outlined"
                        id="password"
                        type={passwordIsMasked ? "password" : "text"}
                        label="Kata Sandi"
                        onChange={this.onChange}
                        value={this.state.password}
                        helperText={errors.password || errors.passwordincorrect}
                        error={Boolean(
                          errors.password || errors.passwordincorrect
                        )}
                        className={classnames("", {
                          invalid: errors.password || errors.passwordincorrect,
                        })}
                        onFocus={() => {
                          this.setIsFocused(true);
                        }}
                        onBlur={() => {
                          this.setIsFocused(false);
                        }}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                size="small"
                                onClick={this.togglePasswordVisibility}
                              >
                                {icon ? (
                                  <VisibilityIcon
                                    className={
                                      passwordtextfieldFocus ?
                                      Boolean(errors.password || errors.passwordincorrect) ?
                                      classes.toggleErrorShowPasswordButton
                                        : classes.toggleShowPasswordButton
                                        : null
                                    }
                                  />
                                ) : (
                                  <VisibilityOffIcon
                                    className={
                                      passwordtextfieldFocus ?
                                      Boolean(errors.password || errors.passwordincorrect) ?
                                      classes.toggleErrorShowPasswordButton
                                        : classes.toggleShowPasswordButton
                                        : null
                                    }
                                  />
                                )}
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>
                    <Grid item>
                      <Button
                        type="submit"
                        variant="contained"
                        className={classes.loginButton}
                      >
                        Masuk
                      </Button>
                    </Grid>
                  </Grid>
                </form>
              </Grid>
              <Divider />
              <Grid item container justify="space-around">
                <Link to="/akun/lupa-katasandi">Lupa Kata Sandi?</Link>
                <Typography color="textSecondary">·</Typography>
                <Link to="/daftar">Belum ada Akun?</Link>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
        <Grid item xs={3}>
          <Hidden smDown>
            <img
              src={loginArtRight}
              style={{
                maxWidth: "100%",
                maxHeight: "100%",
              }}
            />
          </Hidden>
        </Grid>
        </Grid>
      </div>
    );
  }
}

Login.propTypes = {
  loginUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth, // Get Redux State and map it to props so it can be used inside the component.
  errors: state.errors,
});

export default withRouter(
  connect(mapStateToProps, { loginUser, clearErrors })(
    withStyles(styles)(Login)
  )
);
