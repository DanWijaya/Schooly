//IMPORT COMPONENTS
  //Basic Components and Login Components
import React, { Component } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types"; //Helps in minimizing the problem in React by checking the types passed in the props object.
import classnames from "classnames";
import { connect } from "react-redux";
import { loginUser } from "../../actions/AuthActions";
import { makeStyles } from '@material-ui/core/styles';

//   //Login Functions
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
    document.title="Schooly - Login"
    const { errors } = this.state;
    const {passwordIsMasked} = this.state;
    return (
      <div className="container">
        {/* <div style={{ marginTop: "4rem" }} className="row"> */}
          <div className="col s8 offset-s2">
            <Link to="/" className="btn-flat waves-effect" style={{zIndex: 0}}>
              <i className="material-icons left">keyboard_backspace</i> Back to
              home
            </Link>
            <div className="col s12" style={{ paddingLeft: "11.250px" }}>
              <h4>
                <b>Login</b> below
              </h4>
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
                Toggle" type="button"/> Show password


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
                    marginTop: "1rem",
                    zIndex: 0
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

export default connect(
  mapStateToProps,
  { loginUser }
)(Login);
