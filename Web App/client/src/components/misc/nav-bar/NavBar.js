import React from "react"
import { connect } from "react-redux";
import PropTypes from "prop-types";
import clsx from "clsx";
import { logoutUser } from "../../../actions/UserActions";
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
    backgroundColor: theme.palette.primary,
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
  profileMenuItem: {
    "&:hover": {
      backgroundColor: theme.palette.primary.main,
      "& .MuiListItemIcon-root, & .MuiListItemText-primary": {
        color: "white",
      },
    },
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
  registerButton: {
    backgroundColor: "#61bd4f",
    color: "white",
    width: "75px",
    height: "30px",
    marginRight: "15px",
    "&:focus": {
      backgroundColor: "#61bd4f",
      color: "white",
    },
    "&:hover": {
      backgroundColor: "#61bd4f",
      color: "white",
    },
  },
  loginButton: {
    backgroundColor: "white",
    color: theme.palette.primary.main,
    width: "75px",
    height: "30px",
    "&:focus": {
      backgroundColor: "white",
      color: theme.palette.primary.main,
    },
    "&:hover": {
      backgroundColor: "white",
      color: theme.palette.primary.main,
    },
  },
}));

function NavBar(props){
  const classes = useStyles();

  const { user } = props.auth;
  const isMobileView = useMediaQuery("(max-width:600px)");
  // const isMobileView = useMediaQuery(theme.breakpoints.up("sm"));

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
      <div className={classes.navbarContainedLeftItems}>
        <NavBarDrawerMenuButton
          mobileView={isMobileView}
          handleDrawerDesktop={handleDrawerDesktop}
          handleDrawerMobile={handleDrawerMobile}
        />
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
    rightSideNavBarContents = (
      <NavBarLoggedInContents isMobileView={isMobileView}/>
    )
  }

  else {
    leftSideNavBarContents = (
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
    rightSideNavBarContents = (
      <div className={classes.navbarContainedRightItems}>
        <Button
          variant="contained"
          size="small"
          href="/daftar"
          className={classes.registerButton}
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
        desktopOpen={desktopOpen}
        handleDrawerMobile={handleDrawerMobile}
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
