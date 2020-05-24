import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import classnames from "classnames";
import { connect } from "react-redux";
import { loginUser } from "../../actions/AuthActions";
import schoolyLogoAlt from "../../images/SchoolyLogoAlt.png";
import OutlinedTextField from "../misc/text-field/OutlinedTextField";
import { Button, Divider, Grid, Link, Paper, Typography } from "@material-ui/core";
import { withStyles, useTheme } from "@material-ui/core/styles";
import RemoveRedEyeIcon from "@material-ui/icons/RemoveRedEye";

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
  spanClass: {
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
      passwordIsMasked: true,
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

  togglePasswordMask = () => {
    this.setState(prevState =>
    ({passwordIsMasked: !(prevState.passwordIsMasked)
  }));
};

  render() {
    document.title="Masuk ke Schooly"
    const { classes } = this.props;

    const { errors } = this.state;
    const { passwordIsMasked } = this.state;

    return (
      <div className={classes.root}>
        <img src={schoolyLogoAlt} className={classes.schoolyLogoAlt} />
        <Paper>
          <Grid
            container
            direction="column"
            alignItems="center"
            justify="center"
            spacing={5}
            className={classes.mainGrid}
          >
            <Grid item>
              <Typography variant="h6">
                <b>Masuk ke Schooly</b>
              </Typography>
            </Grid>
            <Grid item style={{ width:"300px"}} >
              <form noValidate onSubmit={this.onSubmit}>
                <OutlinedTextField
                // width="300px"
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
                  span_classname={classes.spanClass}
                  error1={errors.email}
                  error2={errors.emailnotfound}
                />
                <OutlinedTextField
                // width="300px"
                  on_change={this.onChange}
                  value={this.state.password}
                  error={errors.password}
                  id="password"
                  type={passwordIsMasked ? "password" : "text"}
                  classname={classnames("", {
                    invalid: errors.password || errors.passwordincorrect
                  })}
                  html_for="password"
                  labelname="Password"
                  span_classname={classes.spanClass}
                  error1={errors.password}
                  error2={errors.passwordincorrect}
                />
                  <RemoveRedEyeIcon className="mask-btn" onClick={this.togglePasswordMask} value="
                  Toggle" type="button"/>
                  {this.state.passwordIsMasked ? "Show Password" : "Hide Password"}
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
            <Divider style={{width: '300px'}}
            />
            <Grid item>
              <Link href="/forgotpassword">
                Forgot Password?
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
