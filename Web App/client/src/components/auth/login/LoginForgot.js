import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import classnames from "classnames";
import { createHash } from "../../../actions/AuthActions";
import authBackground from "../AuthBackground.png";
import { Button, Grid, Paper, TextField, Typography } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";

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
  changePasswordButton: {
    marginTop: "30px",
    width: "100%",
    backgroundColor: theme.palette.primary.main,
    color: "white",
    "&:focus, &:hover": {
      backgroundColor: theme.palette.primary.main,
      color: "white",
    },
  },
  resendEmailButton: {
    marginTop: "30px",
    width: "100%",
    backgroundColor: "#61BD4F",
    color: "white",
    "&:focus, &:hover": {
      backgroundColor: "#61BD4F",
      color: "white",
    },
  },
});

class LoginForgot extends Component {
  constructor(props) {
    super(props);
    this.state = {
      errors: {},
      activeStep: 0,
      email: "",
    };
  }

  onChange = (e) => {
    this.setState({ [e.target.id]: e.target.value})
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.errors) {
      this.setState({
        errors: nextProps.errors
      });
    }
  }

// Dispatch is used as a callback which gets invoked once some async action is complete.
// In redux-thunk dispatch is simply a function which dispatches an action to the Redux store after, let's say, you fetch data from an api (which is asynchronous).
  onSubmit = (e) => {
    e.preventDefault();
    console.log("Submitted")
    this.props.createHash(this.state.email)
  }

  render() {
    const { classes } = this.props;

    const { errors, email } = this.state;
    const { isPasswordReset } = this.props.passwordMatters;

    document.title = "Schooly | Lupa Akun";
    document.body.style = "background: linear-gradient(#6A8CF6, #FFFFFF); background-repeat: no-repeat";

    return(
      <div className={classes.root}>
        <Paper className={classes.mainPaper}>
          <Grid container direction="column" spacing={5}>
            {!isPasswordReset ?
              <Grid item>
                <Typography variant="h6" align="center" gutterBottom>
                  <b>Lupa Kata Sandi?</b>
                </Typography>
                <Typography variant="body1" align="center" color="textSecondary">
                  Masukkan email anda untuk melanjutkan.
                </Typography>
              </Grid>
              :
              <Grid item>
                <Typography variant="h6" align="center" gutterBottom>
                  <b>Email telah dikirim</b>
                </Typography>
                <Typography variant="body1" align="center" color="textSecondary">
                  Silahkan buka email tersebut untuk melanjutkan.
                </Typography>
              </Grid>
            }
            <Grid item>
              {!isPasswordReset ?
                <form noValidate onSubmit={this.onSubmit}>
                  <label for="email">Email</label>
                  <TextField
                    fullWidth
                    variant="outlined"
                    id="email"
                    onChange={this.onChange}
                    value={email}
                    error={Boolean(errors.problem)}
                    type="email"
                    helperText={errors.problem}
                    className={classnames("", {
                      invalid: errors.email || errors.emailnotfound
                    })}
                  />
                  <Button
                    variant="contained"
                    type="submit"
                    className={classes.changePasswordButton}
                  >
                    Ubah Kata Sandi
                  </Button>
                </form>
                :
                <Button
                  variant="contained"
                  onClick={() => window.location.reload()}
                  className={classes.resendEmailButton}
                >
                  Kirim Ulang Email
                </Button>
              }
            </Grid>
          </Grid>
        </Paper>
      </div>
    );
  };
};

LoginForgot.propTypes = {
  createHash: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  passwordMatters: PropTypes.object.isRequired,
}

const mapStateToProps = state => ({
  auth: state.auth, // Get Redux State and map it to props so it can be used inside the component.
  errors: state.errors,
  passwordMatters: state.passwordMatters,
});

export default withRouter(
  connect(mapStateToProps, { createHash })
  (withStyles(styles)(LoginForgot))
);
