import React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { logoutUser } from "../../../actions/UserActions";
import schoolyLogo from "../../../images/SchoolyLogo.png";
import NavBarLoggedInContents from "./NavBarLoggedInContents";
import AppBar from "@material-ui/core/AppBar";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import Toolbar from "@material-ui/core/Toolbar";
import { useMediaQuery } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import MenuIcon from "@material-ui/icons/Menu";

const useStyles = makeStyles((theme) => ({
  root: {
    zIndex: theme.zIndex.drawer + 1,
  },
  startButtonContainer: {
    flex: "1",
  },
  navbarProfilePicture: {
    width: "25px",
    height: "25px",
  },
  schoolyLogo: {
    width: "100px",
    height: "50px",
  },
  signupButton: {
    width: "75px",
    height: "30px",
    marginRight: "15px",
    backgroundColor: theme.palette.success.main,
    color: "white",
    "&:focus, &:hover": {
      backgroundColor: theme.palette.success.main,
      color: "white",
    },
  },
  loginButton: {
    width: "75px",
    height: "30px",
    backgroundColor: "white",
    color: theme.palette.primary.main,
    "&:focus, &:hover": {
      backgroundColor: "white",
      color: theme.palette.primary.main,
    },
  },
}));

function NavBar(props) {
  const classes = useStyles();
  const { handleDrawerDesktop, handleDrawerMobile, sideDrawerExist } = props;
  const { user } = props.auth;

  const isMobileView = useMediaQuery("(max-width:960px)");

  return (
    <AppBar position="fixed" className={classes.root}>
      {props.assessmentState !== "ujian" ? (
          user.name ? (
            <Toolbar>
              <div
                className={classes.startButtonContainer}
                style={{ display: !sideDrawerExist ? "none" : "block" }}
              >
                {isMobileView ? (
                  <IconButton edge="start" color="inherit" onClick={handleDrawerMobile}>
                    <MenuIcon />
                  </IconButton>
                ) : (
                  <IconButton
                    edge="start"
                    color="inherit"
                    onClick={handleDrawerDesktop}
                  >
                    <MenuIcon />
                  </IconButton>
                )}
              </div>
              <Link to="/beranda">
                <img
                  alt="Schooly Logo"
                  src={schoolyLogo}
                  className={classes.schoolyLogo}
                />
              </Link>
              <NavBarLoggedInContents isMobileView={isMobileView} />
            </Toolbar>
          ) : (
            <Toolbar>
              <div className={classes.startButtonContainer}>
                <Link to="/">
                  <img
                    alt="Schooly Logo"
                    src={schoolyLogo}
                    className={classes.schoolyLogo}
                  />
                </Link>
              </div>
              <div>
                <Link to="/daftar">
                  <Button
                    variant="contained"
                    size="small"
                    className={classes.signupButton}
                  >
                    Daftar
                  </Button>
                </Link>
                <Link to="/masuk">
                  <Button
                    variant="contained"
                    size="small"
                    className={classes.loginButton}
                  >
                    Masuk
                  </Button>
                </Link>
              </div>
            </Toolbar>
          )
      ) : (
        <Toolbar>
          <img
            alt="SchoolyLogoNavBar"
            src={schoolyLogo}
            className={classes.schoolyLogo}
          />
        </Toolbar>
      )}
    </AppBar>
  );
}

NavBar.propTypes = {
  auth: PropTypes.object.isRequired,
  logoutUser: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, { logoutUser })(React.memo(NavBar));
