import React, { Component } from "react";
import { withRouter, Link } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import classnames from "classnames";
import { loginUser } from "../../../actions/UserActions";
import { clearErrors } from "../../../actions/ErrorActions";
import authBackground from "../AuthBackground.png";
import schoolyLogo from "../../../images/SchoolyLogo.png";
import { Button, Divider, Grid, IconButton, InputAdornment, Paper, TextField, Typography } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import VisibilityIcon from "@material-ui/icons/Visibility";
import VisibilityOffIcon from "@material-ui/icons/VisibilityOff";

const styles = (theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
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
  schoolyLogo: {
    width: "250px",
    height: "125px",
    marginBottom: "25px",
  },
  loginPaper: {
    margin: "auto",
    maxWidth: "350px",
    padding: "40px",
  },
  loginButton: {
    width: "100%",
    backgroundColor: theme.palette.success.main,
    color: "white",
    "&:focus, &:hover": {
      backgroundColor: theme.palette.success.main,
      color: "white",
    },
  },
});

class Login extends Component {
  constructor() {
    super();
    this.state = {
      email: "",
      password: "",
      errors: {},
      isAuthenticated: false,
      passwordIsMasked: true, // True = masked
      icon: true // True = shown
    };
  }

  componentDidMount() {
    // untuk handle kalau misalnya usernya udah logged in lalu buka login pagenya. Langusng ke beranda
    // If logged in and user navigates to Login page, should redirect them to dashboard
    // this.props.auth.isAuthenticated = true, berarti udah logged in dan masuk ke beranda langsung
    if (this.props.auth.isAuthenticated) {
      this.props.history.push("/beranda");
    }
    this.props.handleNavbar(false)
  }

  componentWillUnmount(){
    this.props.clearErrors()
    const { handleNavbar } = this.props;
    handleNavbar(true)
  }

  static getDerivedStateFromProps(nextProps, prevState){
    // Function static ini belongs to the class secara keseluruhan, bukan instance of the class.
    //  Makanya gak ada this keyword.
    if(nextProps.auth.isAuthenticated) // nextProps.auth.isAuthenticated = kalau true,
      return { isAuthenticated: nextProps.auth.isAuthenticated }
      // ini sama dengan this.setState({ isAuthenticated : nextProps.auth.isAuthenticated })
    else if(nextProps.errors) // kalau errorsnya ngak false.
      return { errors: nextProps.errors }
    else
      return null // gak ngapa ngapain
  }

  componentDidUpdate(prevProps, prevState) {
    if(this.state.isAuthenticated){

      // jika murid yang belum login membuka link assessment (/kuis-murid/:id),
      // setelah login, murid akan diarahkan ke halaman assessment tersebut
      if (this.props.location.state) {
        window.location.href = `.${this.props.location.state.url}`
      } else {
        // untuk redirect ke page lain.
        window.location.href = "./beranda"
      }
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

    return (
      <div className={classes.root}>
        <Link to="/">
          <img
            alt="Schooly Introduction"
            src={schoolyLogo}
            className={classes.schoolyLogo}
          />
        </Link>
        <Paper elevation={11} className={classes.loginPaper}>
          <Grid container direction="column" spacing={5}>
            <Grid item>
              <Typography variant="h6" align="center">
                <b>Masuk ke Schooly</b>
              </Typography>
            </Grid>
            <Grid item>
              <form noValidate onSubmit={this.onSubmit}>
                <Grid container direction="column" spacing={4}>
                  <Grid item>
                    <TextField
                      fullWidth
                      variant="outlined"
                      id="email"
                      label="Email"
                      onChange={this.onChange}
                      value={this.state.email}
                      error={Boolean(errors.email || errors.emailnotfound || errors.notactive)}
                      type="email"
                      helperText={errors.email || errors.emailnotfound || errors.notactive}
                      className={classnames("", {
                        invalid: errors.email || errors.emailnotfound
                      })}
                    />
                  </Grid>
                  <Grid item>
                    <TextField
                      fullWidth
                      variant="outlined"
                      id="password"
                      label="Kata Sandi"
                      onChange={this.onChange}
                      value={this.state.password}
                      error={Boolean(errors.password || errors.passwordincorrect)}
                      type={passwordIsMasked ? "password" : "text"}
                      helperText={errors.password || errors.passwordincorrect}
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
                          </InputAdornment>
                      }}
                    />
                  </Grid>
                  <Grid item>
                    <Button
                      type="submit"
                      variant="contained"
                      className={classes.loginButton}
                    >
                      Masuk
                    </Button>
                  </Grid>
                </Grid>
              </form>
            </Grid>
            <Divider />
            <Grid item container justify="space-around">
              <Link to="/akun/lupa-katasandi">
                Lupa Kata Sandi?
              </Link>
              |
              <Link to="/daftar">
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
  connect(mapStateToProps, { loginUser, clearErrors })
  (withStyles(styles)(Login))
);
