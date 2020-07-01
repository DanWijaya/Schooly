import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { logoutUser } from "../../../actions/UserActions";
import schoolyLogo from "../../../images/SchoolyLogo.png";
import NavBarLoggedInContents from "./NavBarLoggedInContents";
import { AppBar, Button, Grid, IconButton, Link, Toolbar, useMediaQuery } from "@material-ui/core";
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
    flex: "auto",
    justifyContent: "space-between",
  },
  navbarContainedLeftItems: {
    flex: "auto",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  navbarContainedRightItems: {
    display: "flex",
    justifyContent: "flex-end",
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
    backgroundColor: "#61BD4F",
    color: "white",
    "&:focus, &:hover": {
      backgroundColor: "#61BD4F",
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

  const isMobileView = useMediaQuery("(max-width:600px)");
  const { handleDrawerDesktop, handleDrawerMobile } = props;

  // NavBar Contents
  let leftNavBarContents;
  let middleNavBarContents;
  let rightNavBarContents;

  if(user.name) {
    leftNavBarContents = (
      <div className={classes.navbarContainedLeftItems}>
        {isMobileView ?
          <IconButton
            edge="start"
            color="inherit"
            onClick={handleDrawerMobile}
          >
            <MenuIcon />
          </IconButton>
          :
          <IconButton
            edge="start"
            color="inherit"
            onClick={handleDrawerDesktop}
          >
            <MenuIcon />
          </IconButton>
        }
      </div>
    )
    middleNavBarContents = (
      <Link href="/beranda">
        <img
          alt="SchoolyLogoNavBar"
          src={schoolyLogo}
          className={classes.schoolyLogo}
        />
      </Link>
    )
    rightNavBarContents = (
      <NavBarLoggedInContents isMobileView={isMobileView} className={classes.navbarContainedRightItems} />
    )
  }

  else {
    leftNavBarContents = (
      <Grid className={classes.navbarContainedLeftItems}>
        <a href="/">
          <img
            alt="SchoolyLogoNavBar"
            src={schoolyLogo}
            className={classes.schoolyLogo}
          />
        </a>
      </Grid>
    )
    middleNavBarContents = null
    rightNavBarContents = (
      <div className={classes.navbarContainedRightItems}>
        <Button
          variant="contained"
          size="small"
          href="/daftar"
          className={classes.signupButton}
        >
          Daftar
        </Button>
        <Button
          variant="contained"
          size="small"
          href="/masuk"
          className={classes.loginButton}
        >
          Masuk
        </Button>
      </div>
    )
  }

  return(
    <AppBar
      position="fixed"
      className={classes.appBar}
    >
      <Toolbar className={classes.navbarContainer}>
        {leftNavBarContents}
        {middleNavBarContents}
        {rightNavBarContents}
      </Toolbar>
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
 ) (NavBar);
