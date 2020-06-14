import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import classnames from "classnames";
import { connect } from "react-redux";
import { loginUser } from "../../../actions/AuthActions";
import schoolyLogo from "../../../images/SchoolyLogo.png";
import authBackground from "../AuthBackground.png";
import OutlinedTextField from "../../misc/text-field/OutlinedTextField";
import { Button, Divider, Grid, Link, Paper, Typography } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import VisibilityIcon from "@material-ui/icons/Visibility";
import VisibilityOffIcon from "@material-ui/icons/VisibilityOff";

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
  loginGrid: {
    maxWidth: "400px",
    padding: "40px",
  },
  loginGridContent: {
    width: "300px",
  },
  schoolyLogo: {
    width: "30%",
    height: "30%",
    marginBottom: "30px",
  },
  errorInfo: {
    color: "red",
    fontSize: "10px"
  }
});

class Login extends Component {
  constructor() {
    super();
    this.state = {
      email: "",
      password: "",
      errors: {},
      passwordIsMasked: true, // true kalau dimask
      icon: true // true kalau keliatan
    };
  }

  componentDidMount() {
    // If logged in and user navigates to Login page, should redirect them to dashboard
    console.log("AA")
    if (this.props.auth.isAuthenticated) {
      // this.props.history.push("/dashboard");
      window.location.href = "./dashboard"
    }
  }

  handleChange(event) {}
  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.auth.isAuthenticated) {
      // this.props.history.push("/dashboard");
      window.location.href = "./dashboard"
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
    document.title = "Masuk ke Schooly";
    document.body.style = "background: linear-gradient(#6a8cf6, #ffffff); background-repeat: no-repeat";

    const { classes } = this.props;

    const { errors } = this.state;
    const { passwordIsMasked } = this.state;
    const { icon } = this.state

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
            className={classes.loginGrid}
          >
            <Grid item>
              <Typography variant="h6">
                <b>Masuk ke Schooly</b>
              </Typography>
            </Grid>
            <Grid item className={classes.loginGridContent}>
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
                  startIcon={icon ? <VisibilityIcon /> : <VisibilityOffIcon />}
                  onClick={this.togglePasswordVisibility}
                  disableRipple
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
                    backgroundColor: "#61bd4f",
                    color: "white",
                    width: "100%",
                    marginTop: "25px"
                  }}
                >
                  Masuk
                </Button>
              </form>
            </Grid>
            <Divider className={classes.loginGridContent} />
            <Grid item container justify="space-around">
              <Link href="/lupa-katasandi">
                Lupa Kata Sandi?
              </Link>
              |
              <Link href="/daftar">
                Belum Ada Akun?
              </Link>
            </Grid>
          </Grid>
        </Paper>
      </div>
    );
  }
}

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
  )
