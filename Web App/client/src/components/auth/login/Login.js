import React, { Component } from "react";
import { withRouter, Link } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import classnames from "classnames";
import { loginUser } from "../../../actions/UserActions";
import { clearErrors } from "../../../actions/ErrorActions";
import schoolyLogo from "../../../images/SchoolyLogo.png";
import loginArtLeft from "./LoginArtLeft.png";
import loginArtRight from "./LoginArtRight.png";
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
    maxWidth: "250px",
    maxHeight: "125px",
    marginBottom: "25px",
  },
  artThumbnail: {
    width: "100%",
    height: "100%",
    maxWidth: "300px",
  },
  loginContainer: {
    maxWidth: "80%",
    [theme.breakpoints.down("sm")]: {
      maxWidth: "100%",
    },
  },
  loginPaper: {
    margin: "auto",
    maxWidth: "400px",
    padding: "40px",
  },
  loginButton: {
    width: "100%",
    marginTop: "15px",
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
  disabledLink : {
    pointerEvents: "none"
  }
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

  onChange = (e, otherfield) => {
    let field = otherfield ? otherfield : e.target.id;
    if (this.state.errors[field]) {
      this.setState({ errors: { ...this.state.errors, [field]: null } });
    }
    this.setState({ [field]: e.target.value });
  };

  onSubmit = (e) => {
    e.preventDefault();
    const userData = {
      email: this.state.email.toLowerCase(),
      password: this.state.password,
    };
    this.props.loginUser(userData).catch((err) => {
      console.log(err);
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
            alt="Schooly Logo"
            src={schoolyLogo}
            className={classes.schoolyLogo}
          />
        </Link>
        <Grid container alignItems="flex-end" spacing={3} className={classes.loginContainer}>
          <Hidden smDown>
            <Grid item container justify="flex-end" xs={3}>
              <img
                alt="Login Art Left"
                src={loginArtLeft}
                className={classes.artThumbnail}
              />
            </Grid>
          </Hidden>
          <Grid item xs={12} md={6}>
            <Paper elevation={11} className={classes.loginPaper}>
              <Grid container direction="column" spacing={6}>
                <Grid item>
                  <Typography variant="h6" align="center">
                    <b>Masuk ke Schooly</b>
                  </Typography>
                </Grid>
                <Grid item>
                  <form noValidate onSubmit={this.onSubmit}>
                    <Grid container direction="column" spacing={5}>
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
                            errors.email
                          }
                          error={Boolean(
                            errors.email
                          )}
                          className={classnames("", {
                            invalid: errors.email
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
                          helperText={errors.password}
                          error={Boolean(
                            errors.password 
                          )}
                          className={classnames("", {
                            invalid: errors.password
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
                  <Link to="/akun/lupa-katasandi" className={classes.disabledLink}>Lupa kata sandi?</Link>
                    <Typography color="textSecondary">·</Typography>
                  <Link to="/daftar">Belum ada akun?</Link>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
          <Hidden smDown>
            <Grid item container justify="flex-start" xs={3}>
                <img
                  alt="Login Art Right"
                  src={loginArtRight}
                  className={classes.artThumbnail}
                />
            </Grid>
          </Hidden>
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
