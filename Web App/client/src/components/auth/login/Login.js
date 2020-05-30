import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import classnames from "classnames";
import { connect } from "react-redux";
import { loginUser } from "../../../actions/AuthActions";
import schoolyLogoAlt from "../../../images/SchoolyLogoAlt.png";
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
  },
  mainGrid: {
    width: "400px",
    padding: "40px",
  },
  schoolyLogoAlt: {
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
    if (this.props.auth.isAuthenticated) {
      this.props.history.push("/dashboard");
    }
  }

  handleChange(event) {}
  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.auth.isAuthenticated) {
      this.props.history.push("/dashboard");
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
    document.title="Masuk ke Schooly"
    const { classes } = this.props;

    const { errors } = this.state;
    const { passwordIsMasked } = this.state;

    const { icon } = this.state

    return (
      <div className={classes.root}>
        <img src={schoolyLogoAlt} className={classes.schoolyLogoAlt} />
        <Paper>
          <Grid
            container
            direction="column"
            alignItems="center"
            justify="space-between"
            spacing={3}
            className={classes.mainGrid}
          >
            <Grid item>
              <Typography variant="h6">
                <b>Masuk ke Schooly</b>
              </Typography>
            </Grid>
            <Grid item style={{width:"300px"}} >
              <form noValidate onSubmit={this.onSubmit} style={{marginBottom: "20px"}}>
                <div style={{marginBottom: "15px"}}>
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
                    marginTop: "20px"
                  }}
                >
                  Masuk
                </Button>
              </form>
            </Grid>
            <Divider style={{width: "300px"}}
            />
            <Grid item>
              <Link href="/forgotpassword">
                Lupa Kata Sandi?
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
