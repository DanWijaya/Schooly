import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import classnames from "classnames";
import { loginUser } from "../../../actions/UserActions";
import authBackground from "../AuthBackground.png";
import { Button, Divider, FormControl, FormHelperText, Grid, IconButton, InputAdornment, Link, OutlinedInput, Paper, TextField, Typography } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import ErrorIcon from "@material-ui/icons/Error";
import VisibilityIcon from "@material-ui/icons/Visibility";
import VisibilityOffIcon from "@material-ui/icons/VisibilityOff";

const styles = (theme) => ({
  root: {
    margin: "auto",
    maxWidth: "1000px",
    minHeight: "500px",
    padding: "10px",
    backgroundImage: `url(${authBackground})`,
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
    [theme.breakpoints.up("sm")]: {
      backgroundSize: "contain",
    },
  },
  mainPaper: {
    margin: "auto",
    maxWidth: "350px",
    padding: "40px",
  },
  errorInfo: {
    color: "red",
    fontSize: "10px",
  }
});

class Login extends Component {
  constructor() {
    super();
    this.state = {
      email: "",
      password: "",
      errors: {},
      passwordIsMasked: true, // True = masked
      icon: true // True = shown
    };
  }

  componentDidMount() {
    // If logged in and user navigates to Login page, should redirect them to dashboard
    if (this.props.auth.isAuthenticated) {
      this.props.history.push("/beranda");
    }
  }

  handleChange(event) {}
  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.auth.isAuthenticated) {
      window.location.href = "./beranda"
    }

    if (nextProps.errors) {
      this.setState({
        errors: nextProps.errors
      });
    }
  }

  onChange = e => {
    this.setState({ [e.target.id]: e.target.value });
  };

  onSubmit = e => {
    e.preventDefault();
    const userData = {
      email: this.state.email,
      password: this.state.password
    };
    this.props.loginUser(userData);
  };

  togglePasswordVisibility = () => {
    this.setState(prevState =>
      ({
        passwordIsMasked: !(prevState.passwordIsMasked),
        icon: !(prevState.icon
      )}
    ));
  }

  render() {
    const { classes } = this.props;

    const { passwordIsMasked, icon , errors} = this.state;
    document.title = "Masuk ke Schooly";
    document.body.style = "background: linear-gradient(#6A8CF6, #FFFFFF); background-repeat: no-repeat";
    console.log(Boolean(errors.password || errors.passwordincorrect))
    return(
      <div className={classes.root}>
        <Paper className={classes.mainPaper}>
          <Grid container direction="column" spacing={5}>
            <Grid item>
              <Typography variant="h6" align="center">
                <b>Masuk ke Schooly</b>
              </Typography>
            </Grid>
            <Grid item>
              <form noValidate onSubmit={this.onSubmit}>
                <Grid container direction="column" spacing={4} alignItems="stretch">
                  <Grid item>
                    <label for="email">Email</label>
                    <TextField
                      fullWidth
                      variant="outlined"
                      id="email"
                      onChange={this.onChange}
                      value={this.state.email}
                      error={Boolean(errors.email || errors.emailnotfound)}
                      type="email"
                      helperText={
                        <div style={{display: "flex", alignItems: "center"}}>
                          {errors.email || errors.emailnotfound ? <ErrorIcon style={{ height: "5%", width:"5%"}} /> : null}
                          <Typography variant="caption" style={{marginLeft: "4px"}}>
                            {errors.email}
                            {errors.emailnotfound}
                          </Typography>
                        </div>
                      }
                      className={classnames("", {
                        invalid: errors.email || errors.emailnotfound
                      })}
                    />
                  </Grid>
                  <Grid item>
                    <label>Kata Sandi</label>
                    <TextField
                      fullWidth
                      variant="outlined"
                      id="password"
                      onChange={this.onChange}
                      value={this.state.password}
                      error={Boolean(errors.password || errors.passwordincorrect)}
                      type={passwordIsMasked ? "password" : "text"}
                      helperText={
                        <div style={{ display:"flex", alignItems: "center"}}>
                          {errors.password || errors.passwordincorrect ? <ErrorIcon style={{ height: "5%", width:"5%"}} /> : null}
                          <Typography variant="caption" style={{marginLeft: "4px"}}>
                            {errors.password}
                            {errors.passwordincorrect}
                          </Typography>
                        </div>
                      }
                      className={classnames("", {
                        invalid: errors.password || errors.passwordincorrect
                      })}
                      InputProps={{
                        endAdornment:
                          <InputAdornment position="end">
                            <IconButton
                              size="small"
                              onClick={this.togglePasswordVisibility}
                            >
                              {icon ? <VisibilityIcon /> : <VisibilityOffIcon />}
                            </IconButton>
                          </InputAdornment>,
                      }}
                    />
                  </Grid>
                  <Grid item>
                    <Button
                      variant="contained"
                      type="submit"
                      style={{
                        backgroundColor: "#61BD4F",
                        color: "white",
                        width: "100%",
                      }}
                    >
                      Masuk
                    </Button>
                  </Grid>
                </Grid>
              </form>
            </Grid>
            <Divider />
            <Grid item container justify="space-around">
              <Link href="/akun/lupa-katasandi">
                Lupa Kata Sandi?
              </Link>
              |
              <Link href="/daftar">
                Belum ada Akun?
              </Link>
            </Grid>
          </Grid>
        </Paper>
      </div>
    )
  }
}

Login.propTypes = {
  loginUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth, // Get Redux State and map it to props so it can be used inside the component.
  errors: state.errors,
});

export default withRouter(
  connect(mapStateToProps, { loginUser })
  (withStyles(styles)(Login))
);
