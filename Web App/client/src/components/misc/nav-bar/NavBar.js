import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { logoutUser } from "../../../actions/UserActions";
import schoolyLogo from "../../../images/SchoolyLogo.png";
import NavBarLoggedInContents from "./NavBarLoggedInContents";
import { AppBar, Button, Grid, IconButton, Toolbar, useMediaQuery } from "@material-ui/core";
import { Link } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import MenuIcon from "@material-ui/icons/Menu";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
  },
  navbarContainer: {
    flex: "1",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  navbarProfilePicture: {
    width: theme.spacing(3),
    height: theme.spacing(3),
  },
  schoolyLogo: {
    width: "100px",
    height: "50px",
  },
  signupButton: {
    width: "75px",
    height: "30px",
    marginRight: "15px",
    backgroundColor: theme.palette.create.main,
    color: "white",
    "&:focus, &:hover": {
      backgroundColor: theme.palette.create.main,
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
  }
}));

function NavBar(props) {
  const classes = useStyles();

  const { user } = props.auth;

  const isMobileView = useMediaQuery("(max-width:960px)");
  const { handleDrawerDesktop, handleDrawerMobile, sideDrawerExist } = props;

  // NavBar Contents
  let leftNavBarContents;
  let middleNavBarContents;
  let rightNavBarContents;

  if (user.name) {
    leftNavBarContents = (
      <div className={classes.navbarContainer} style={{display: !sideDrawerExist ? "none" : "block"}}>
        {isMobileView ?
          <IconButton edge="start" color="inherit" onClick={handleDrawerMobile}>
            <MenuIcon />
          </IconButton>
          :
          <IconButton edge="start" color="inherit" onClick={handleDrawerDesktop}>
            <MenuIcon />
          </IconButton>
        }
      </div>
    )
    middleNavBarContents = (
      <Link to="/beranda">
        {/* <img
          alt="SchoolyLogoNavBar"
          src={schoolyLogo}
          className={classes.schoolyLogo}
        /> */}
      </Link>
    )
    rightNavBarContents = (
      <NavBarLoggedInContents isMobileView={isMobileView}/>
    )
  }

  else {
    leftNavBarContents = (
      <Grid className={classes.navbarContainer}>
        <Link to="/">
          <img
            alt="SchoolyLogoNavBar"
            src={schoolyLogo}
            className={classes.schoolyLogo}
          />
        </Link>
      </Grid>
    )
    middleNavBarContents = null
    rightNavBarContents = (
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
          <Button variant="contained" size="small" className={classes.loginButton}>
            Masuk
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <AppBar position="fixed" className={classes.appBar}>
      {(props.assessmentState !== "ujian") ?
        <Toolbar>
          {leftNavBarContents}
          {middleNavBarContents}
          {rightNavBarContents}
        </Toolbar>
      :
        <Toolbar>
          <img
            alt="SchoolyLogoNavBar"
            src={schoolyLogo}
            className={classes.schoolyLogo}
          />
        </Toolbar>
      }
    </AppBar>
  )
}

NavBar.propTypes = {
   auth: PropTypes.object.isRequired,
   logoutUser: PropTypes.func.isRequired,
 }

const mapStateToProps = (state) => ({
   auth: state.auth,
 });

export default connect(
  mapStateToProps, { logoutUser }
 ) (React.memo(NavBar));
