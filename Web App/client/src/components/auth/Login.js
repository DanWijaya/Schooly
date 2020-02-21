//IMPORT COMPONENETS
  //Basic Components and Login Component
import React, { Component } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import classnames from "classnames";
import { connect } from "react-redux";
import { loginUser } from "../../actions/authActions";

  //Grid System
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';

//CODE
  //Grid System
const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
}));

  //Login System
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

  componentWillReceiveProps(nextProps) {
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
    document.title="Schooly - Login"
    const { errors } = this.state;
    const {passwordIsMasked} = this.state;

    return (
      <div>
      <div>
<Grid container spacing={3}>
  <Grid item xs={12}>
    <Paper>xs=12</Paper>
  </Grid>
  <Grid item xs={6}>
    <Paper>xs=6</Paper>
  </Grid>
  <Grid item xs={6}>
    <Paper>xs=6</Paper>
  </Grid>
  <Grid item xs={3}>
    <Paper>xs=3</Paper>
  </Grid>
  <Grid item xs={3}>
    <Paper>xs=3</Paper>
  </Grid>
  <Grid item xs={3}>
    <Paper>xs=3</Paper>
  </Grid>
  <Grid item xs={3}>
    <Paper>xs=3</Paper>
  </Grid>
</Grid>
</div>
        <div style={{ marginTop: "4rem" }} className="row">
          <div className="col s8 offset-s2">
            <Link to="/" className="btn-flat waves-effect">
              <i className="material-icons left">keyboard_backspace</i> Back to
              home
            </Link>
            <div className="col s12" style={{ paddingLeft: "11.250px" }}>
              <h4>
                <b>Login</b> below
              </h4>
              {/* <p className="grey-text text-darken-1">
                Don't have an account? <Link to="/register">Register</Link>
              </p> */}
            </div>
            <form noValidate onSubmit={this.onSubmit}>
              <div className="input-field col s12">
                <input
                  onChange={this.onChange}
                  value={this.state.email}
                  error={errors.email}
                  id="email"
                  type="email"
                  className={classnames("", {
                    invalid: errors.email || errors.emailnotfound
                  })}
                />
                <label htmlFor="email">Email</label>
                <span className="red-text">
                  {errors.email}
                  {errors.emailnotfound}
                </span>
              </div>
              <div className="input-field col s12">
                <input
                  onChange={this.onChange}
                  value={this.state.password}
                  error={errors.password}
                  id="password"
                  type={passwordIsMasked ? 'password' : 'text'}
                  className={classnames("", {
                    invalid: errors.password || errors.passwordincorrect
                  })}



                /> <button className="mask-btn" onClick={this.togglePasswordMask} value="
                Toggle"/>

                <label htmlFor="password">Password</label>
                <span className="red-text">
                  {errors.password}
                  {errors.passwordincorrect}
                </span>
              </div>
              <div className="col s12" style={{ paddingLeft: "11.250px" }}>
                <button
                  style={{
                    width: "150px",
                    borderRadius: "3px",
                    letterSpacing: "1.5px",
                    marginTop: "1rem"
                  }}
                  type="submit"
                  className="btn btn-large waves-effect waves-light hoverable blue accent-3"
                >
                  Login
                </button>
              </div>
            </form>
          </div>
        </div>
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
  auth: state.auth,
  errors: state.errors
});

export default connect(
  mapStateToProps,
  { loginUser }
)(Login);
