import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import classnames from "classnames";
import { loginUser } from "../../../actions/UserActions";
import authBackground from "../AuthBackground.png";
import OutlinedTextField from "../../misc/text-field/OutlinedTextField";
import { Button, Divider, Grid, Link, Paper, TextField, Typography } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import VisibilityIcon from "@material-ui/icons/Visibility";
import VisibilityOffIcon from "@material-ui/icons/VisibilityOff";

const styles = (theme) => ({
  root: {
    backgroundImage: `url(${authBackground})`,
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    backgroundSize: "contain",
  },
  container: {
    margin: "auto",
    maxWidth: "350px",
    paddingTop: "20px",
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

    const { errors, passwordIsMasked, icon } = this.state;

    document.title = "Masuk ke Schooly";
    document.body.style = "background: linear-gradient(#6A8CF6, #FFFFFF); background-repeat: no-repeat";

    return(
      <div className={classes.root}>
        <div className={classes.container}>
          <Paper style={{padding: "20px"}}>
            <Grid
              container
              direction="column"
              alignItems="center"
              justify="space-between"
              spacing={3}
              style={{padding: "10px"}}
            >
              <Grid item>
                <Typography variant="h6">
                  <b>Masuk ke Schooly</b>
                </Typography>
              </Grid>
              <Grid item>
                <form noValidate onSubmit={this.onSubmit} style={{marginBottom: "20px"}}>
                  <div style={{marginBottom: "20px"}}>
                    <OutlinedTextField
                      on_change={this.onChange}
                      value={this.state.email}
                      error={errors.email}
                      id="email"
                      type="email"
                      classname={classnames("", {
                        invalid: errors.email || errors.emailnotfound
                      })}
                      html_for="email"
                      labelname="Email"
                      span_classname={classes.errorInfo}
                      error1={errors.email}
                      error2={errors.emailnotfound}
                    />
                  </div>
                  <OutlinedTextField
                    on_change={this.onChange}
                    value={this.state.password}
                    error={errors.password}
                    id="password"
                    type={passwordIsMasked ? "password" : "text"}
                    classname={classnames("", {
                      invalid: errors.password || errors.passwordincorrect
                    })}
                    html_for="password"
                    labelname="Kata Sandi"
                    span_classname={classes.errorInfo}
                    error1={errors.password}
                    error2={errors.passwordincorrect}
                  />
                  <Button
                    disableRipple
                    startIcon={icon ? <VisibilityIcon /> : <VisibilityOffIcon />}
                    onClick={this.togglePasswordVisibility}
                    style={{
                      backgroundColor: "transparent",
                      textTransform: "none",
                      fontSize: "12px",
                    }}
                  >
                    {this.state.passwordIsMasked ? "Tampilkan Kata Sandi" : "Sembunyikan Kata Sandi"}
                  </Button>
                  <Button
                    type="submit"
                    style={{
                      backgroundColor: "#61BD4F",
                      color: "white",
                      width: "100%",
                      marginTop: "25px"
                    }}
                  >
                    Masuk
                  </Button>
                </form>
              </Grid>
              <Divider style={{width: "300px"}} />
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
      </div>
    );
  };
};

Login.propTypes = {
  loginUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth, // Get Redux State and map it to props so it can be used inside the component.
  errors: state.errors
});

export default withRouter(
  connect(mapStateToProps, { loginUser })
  (withStyles(styles)(Login))
);
