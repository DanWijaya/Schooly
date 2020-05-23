import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import classnames from "classnames";
import { connect } from "react-redux";
import { loginUser } from "../../actions/AuthActions";
import OutlinedTextField from "../misc/text-field/OutlinedTextField";
import { Button, InputLabel, MenuItem, Paper, Select, TextField, Typography } from "@material-ui/core";
import { withStyles, useTheme } from "@material-ui/core/styles";
import RemoveRedEyeIcon from "@material-ui/icons/RemoveRedEye";

const styles = (theme) => ({
  root: {
    display: "flex",
    justifyContent: "center",
    maxWidth: "750px",
    margin: "auto",
  },
});

class NewLogin extends Component {
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
        <Paper>
          <Typography variant="h4" gutterBottom>
            Masuk ke Schooly
          </Typography>
          <form noValidate onSubmit={this.onSubmit}>
            <OutlinedTextField />
            <OutlinedTextField />
          </form>
        </Paper>
      </div>
    );
  }
}

NewLogin.propTypes = {
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
  (withStyles(styles)(NewLogin))
  )
