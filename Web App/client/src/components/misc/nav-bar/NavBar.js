import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import clsx from "clsx";
import { logoutUser } from "../../../actions/UserActions";
import schoolyLogo from "../../../images/SchoolyLogo.png";
import LightTooltip from "../light-tooltip/LightTooltip";
import NavBarLoggedInContents from "./NavBarLoggedInContents";
import { AppBar, Button, CssBaseline, Grid, IconButton, Link, Toolbar, useMediaQuery } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import HelpIcon from "@material-ui/icons/Help";
import MenuIcon from "@material-ui/icons/Menu";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1
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
}));

function NavBar(props) {
  const { user } = props.auth;

  const classes = useStyles();
  const isMobileView = useMediaQuery("(max-width:600px)");

  const { handleDrawerDesktop, handleDrawerMobile } = props;

  //NavBar Contents
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
      <Link href="/dashboard">
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
          style={{
            backgroundColor: "#61BD4F",
            color: "white",
            width: "75px",
            height: "30px",
            marginRight: "15px"
          }}
        >
          Daftar
        </Button>
        <Button
          variant="contained"
          size="small"
          href="/masuk"
          style={{
            backgroundColor: "white",
            color: "#2196F3",
            width: "75px",
            height: "30px",
          }}
        >
          Masuk
        </Button>
      </div>
    )
  }

  return (
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
