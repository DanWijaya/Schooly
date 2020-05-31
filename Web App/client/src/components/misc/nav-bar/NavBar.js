import React from "react"
import { connect } from "react-redux";
import { useHistory } from "react-router-dom";
import PropTypes from "prop-types";
import clsx from "clsx";
import { logoutUser } from "../../../actions/AuthActions";
import schoolyLogo from "../../../images/SchoolyLogo.png";
import NavBarDrawerContent from "./NavBarDrawerContent";
import NavBarDrawerMenuButton from "./NavBarDrawerMenuButton";
import NavBarLoggedInContents from "./NavBarLoggedInContents";
import { AppBar, Button, CssBaseline, Grid, Link, Toolbar, useMediaQuery } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

export const drawerWidth = 220;

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: "1",
  },
  appBar: {
    backgroundColor: "#2196f3",
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100%)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  iconButton: {
    "&:focus": {
      backgroundColor: "transparent",
    },
    "&:hover": {
      backgroundColor: "transparent",
    },
  },
  profileMenuItem: {
    "&:hover": {
      backgroundColor: "#2196f3",
      "& .MuiListItemIcon-root, & .MuiListItemText-primary": {
        color: "white",
      },
    },
  },
  navbarContainer: {
    display: "flex",
    justifyContent: "space-between",
  },
  navbarContainedLeftItems: {
    flex: "1",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  navbarContainedRightItems: {
    flex: "1",
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

function NavBar(props){
  const classes = useStyles();
  const { user } = props.auth;
  const isMobileView = useMediaQuery("(max-width:600px)");

  //Drawer at Mobile View Hooks
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const handleDrawerMobile = () => {
    setMobileOpen(!mobileOpen);
  };

  //Drawer at Desktop View Hooks
  const [desktopOpen, setOpen] = React.useState(false);
  const handleDrawerDesktop = () => {
    props.callbackFromParent(!desktopOpen)
    if(!desktopOpen)
      setOpen(true);
    else
      setOpen(false)
  };

  //NavBar Contents
  let leftSideNavBarContents;
  let middleNavBarContents;
  let rightSideNavBarContents;

  if(user.name !== undefined) {
    leftSideNavBarContents = (
      <Grid className={classes.navbarContainedLeftItems}>
        <NavBarDrawerMenuButton
          mobileView={isMobileView}
          handleDrawerDesktop={handleDrawerDesktop}
          handleDrawerMobile={handleDrawerMobile}
          iconButtonClass = {classes.iconButton}
        />
      </Grid>
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
    rightSideNavBarContents = (
      <NavBarLoggedInContents isMobileView={isMobileView}/>
    )
  }

  else {
    leftSideNavBarContents = (
      <Grid className={classes.navbarContainedLeftItems}>
        <a href="/dashboard">
          <img
            alt="SchoolyLogoNavBar"
            src={schoolyLogo}
            className={classes.schoolyLogo}
          />
        </a>
      </Grid>
    )
    middleNavBarContents = null
    rightSideNavBarContents = (
      <Grid container className={classes.navbarContainedRightItems}>
          <Button
            variant="contained"
            size="medium"
            href="/daftar"
            style={{
              backgroundColor: "#61bd4f",
              color: "white",
              fontSize: "6",
              width: "75px",
              marginRight: "15px"
            }}
          >
            Daftar
          </Button>
          <Button
            variant="contained"
            size="medium"
            href="/masuk"
            style={{
              backgroundColor: "white",
              color: "#2196f3",
              width: "75px",
              fontSize: "6",
            }}
          >
            Masuk
          </Button>
      </Grid>
    )
  }

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar
        position="fixed"
        className={clsx(classes.appBar, {
          [classes.appBarShift]: desktopOpen,
        })}
      >
        <Toolbar className={classes.navbarContainer}>
          {leftSideNavBarContents}
          {middleNavBarContents}
          {rightSideNavBarContents}
        </Toolbar>
      </AppBar>
      <Toolbar />
      <NavBarDrawerContent
        userLoggedIn={user.name}
        mobileOpen={mobileOpen}
        handleDrawerMobile={handleDrawerMobile}
        desktopOpen={desktopOpen}
      />
    </div>
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
