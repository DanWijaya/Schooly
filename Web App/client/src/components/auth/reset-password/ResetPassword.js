import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import classnames from "classnames";
import { savePassword } from "../../../actions/AuthActions";
import { clearErrors } from "../../../actions/ErrorActions"
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
    width: "100%",
    marginTop: "30px",
    backgroundColor: theme.palette.primary.main,
    color: "white",
    "&:focus, &:hover": {
      backgroundColor: theme.palette.primary.main,
      color: "white",
    },
  },
});

class ResetPassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      errors: {},
      password: "",
      password2: ""
    };
  }
  onChange = (e) => {
    this.setState({ [e.target.id]: e.target.value})
  }

  componentDidMount(){
    const { clearErrors } = this.props
    clearErrors()
  }

//Dispatch is used as a callback which gets invoked once some async action is complete.
//In redux-thunk dispatch is simply a function which dispatches an action to the Redux store after, let's say, you fetch data from an api (which is asynchronous).

  render() {
    document.title = "Schooly | Lupa Akun"
    document.body.style = "background: linear-gradient(#6A8CF6, #FFFFFF); background-repeat: no-repeat";

    const { password, password2 } = this.state;
    const { errors } = this.props;
    const { classes, savePassword} = this.props;
    const { hash } = this.props.match.params;

    const onSubmit = (e) => {
      e.preventDefault();
      console.log("Submitted")

      let passwordReset = {
          password : password,
          password2: password2,
          hash: hash
      }
      savePassword(passwordReset)
    }

    return (
      <div className={classes.root}>
        <Paper className={classes.mainPaper}>
          <Grid container direction="column" spacing={5}>
            <Grid item>
              <Typography variant="h6" align="center" gutterBottom>
                <b>Ubah Kata Sandi</b>
              </Typography>
              <Typography variant="body1" align="center" color="textSecondary">
                Masukkan Kata Sandi baru Anda
              </Typography>
            </Grid>
            <Grid item>
              <form noValidate onSubmit={onSubmit}>
                <Grid container direction="column" spacing={4}>
                  <Grid item>
                    <label for="password">Kata Sandi</label>
                    <TextField
                      fullWidth
                      variant="outlined"
                      id="password"
                      onChange={this.onChange}
                      value={password}
                      error={Boolean(errors.password_entry)}
                      type="password"
                      helperText={errors.password_entry}
                      classname={classnames("", {
                        invalid: errors.email || errors.emailnotfound
                      })}
                    />
                  </Grid>
                  <Grid item>
                    <label for="password2">Konfirmasi Kata Sandi</label>
                    <TextField
                      fullWidth
                      variant="outlined"
                      id="password2"
                      onChange={this.onChange}
                      value={password2}
                      error={Boolean(errors.password_match)}
                      type="password"
                      helperText={errors.password_match}
                      classname={classnames("", {
                        invalid: errors.email || errors.emailnotfound
                      })}
                    />
                  </Grid>
                  <Grid item>
                    <Button
                      variant="contained"
                      type="submit"
                      className={classes.changePasswordButton}
                    >
                      Ubah Kata Sandi
                    </Button>
                  </Grid>
                </Grid>
              </form>
            </Grid>
          </Grid>
        </Paper>
      </div>
    )
  }
}

ResetPassword.propTypes = {
  savePassword: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  passwordMatters: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
  auth: state.auth, // Get Redux State and map it to props so it can be used inside the component.
  errors: state.errors,
  passwordMatters: state.passwordMatters
});

export default withRouter(
  connect(mapStateToProps, { savePassword, clearErrors })
  (withStyles(styles)(ResetPassword)));
