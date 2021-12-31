import React, { Component } from "react";
import { withRouter, Link } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
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
import {
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
} from "@material-ui/icons";
import { withStyles } from "@material-ui/core/styles";
import { loginUser } from "../../../actions/UserActions";
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
  content: {
    maxWidth: "80%",
    [theme.breakpoints.down("sm")]: {
      maxWidth: "100%",
    },
  },
  schoolyLogo: {
    maxWidth: "250px",
    maxHeight: "125px",
    marginBottom: "25px",
  },
  loginArt: {
    width: "100%",
    height: "100%",
    maxWidth: "300px",
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
  toggleShowPasswordButtonError: {
    color: theme.palette.error.main,
  },
});

class Login extends Component {
  constructor() {
    super();
    this.state = {
      email: "",
      password: "",
      isAuthenticated: false,
      icon: true, // True = shown
      passwordIsMasked: true, // True = masked
      passwordtextfieldFocus: false,
      errors: {},
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
    //  That"s why there is no this keyword.
    if (nextProps.auth.isAuthenticated)
      // nextProps.auth.isAuthenticated = if true,
      return { isAuthenticated: nextProps.auth.isAuthenticated };
    // This is the same with this.setState({ isAuthenticated : nextProps.auth.isAuthenticated }).
    else return null;
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      this.state.isAuthenticated &&
      this.props.auth.isAuthenticated !== prevProps.auth.isAuthenticated
    ) {
      // When students who haven"t logged in open the assessment page,
      // The page will be redirected to the assessment page after that student logged in.
      if (this.props.location.state && this.props.location.state.url) {
        window.location.href = `.${this.props.location.state.url}`;
      } else {
        // To redirect to the Landing page.
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
      this.setState({ errors: err });
    });
  };

  togglePasswordVisibility = () => {
    this.setState((prevState) => ({
      icon: !prevState.icon,
      passwordIsMasked: !prevState.passwordIsMasked,
    }));
  };

  setIsFocused = (bool) => {
    this.setState({ passwordtextfieldFocus: bool });
  };

  render() {
    const { classes } = this.props;
    const {
      icon,
      passwordIsMasked,
      passwordtextfieldFocus,
      errors,
    } = this.state;

    document.title = "Masuk ke Schooly";

    return (
      <div className={classes.root}>
        <Link to="/">
          <img
            alt="Schooly Logo"
            src="/logos/SchoolyLogo.png"
            className={classes.schoolyLogo}
          />
        </Link>
        <Grid
          container
          alignItems="flex-end"
          spacing={3}
          className={classes.content}
        >
          <Hidden smDown>
            <Grid item xs={3} container justify="flex-end">
              <img
                alt="Login Art Left"
                src="/images/illustrations/LoginArtLeft.png"
                className={classes.loginArt}
              />
            </Grid>
          </Hidden>
          <Grid item xs={12} md={6}>
            <Paper elevation={11} className={classes.loginPaper}>
              <Grid container direction="column" spacing={6}>
                <Grid item>
                  <Typography variant="h6" align="center">
                    Masuk ke Schooly
                  </Typography>
                </Grid>
                <Grid item>
                  <form noValidate onSubmit={this.onSubmit}>
                    <Grid container direction="column" spacing={4}>
                      <Grid item>
                        <TextField
                          fullWidth
                          variant="outlined"
                          size="small"
                          id="email"
                          type="email"
                          label="Email"
                          onChange={this.onChange}
                          value={this.state.email}
                          error={Boolean(errors.email)}
                          helperText={errors.email}
                        />
                      </Grid>
                      <Grid item>
                        <TextField
                          fullWidth
                          variant="outlined"
                          size="small"
                          id="password"
                          type={passwordIsMasked ? "password" : "text"}
                          label="Kata Sandi"
                          onChange={this.onChange}
                          value={this.state.password}
                          error={Boolean(errors.password)}
                          helperText={errors.password}
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
                                        passwordtextfieldFocus
                                          ? Boolean(
                                              errors.password ||
                                                errors.passwordincorrect
                                            )
                                            ? classes.toggleShowPasswordButtonError
                                            : classes.toggleShowPasswordButton
                                          : null
                                      }
                                    />
                                  ) : (
                                    <VisibilityOffIcon
                                      className={
                                        passwordtextfieldFocus
                                          ? Boolean(
                                              errors.password ||
                                                errors.passwordincorrect
                                            )
                                            ? classes.toggleShowPasswordButtonError
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
                          variant="contained"
                          type="submit"
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
                  <Grid item>
                    <Link to="/akun/lupa-katasandi">
                      <Typography variant="subtitle2">
                        Lupa kata sandi?
                      </Typography>
                    </Link>
                  </Grid>
                  <Grid item>
                    <Typography color="textSecondary">·</Typography>
                  </Grid>
                  <Grid item>
                    <Link to="/daftar">
                      <Typography variant="subtitle2">
                        Belum ada akun?
                      </Typography>
                    </Link>
                  </Grid>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
          <Hidden smDown>
            <Grid item xs={3} container justify="flex-start">
              <img
                alt="Login Art Right"
                src="/images/illustrations/LoginArtRight.png"
                className={classes.loginArt}
              />
            </Grid>
          </Hidden>
        </Grid>
      </div>
    );
  }
}

Login.propTypes = {
  auth: PropTypes.object.isRequired,
  loginUser: PropTypes.func.isRequired,
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
