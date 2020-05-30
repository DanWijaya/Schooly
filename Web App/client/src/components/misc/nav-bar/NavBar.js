import React from "react"
import { connect } from "react-redux";
import { useHistory } from "react-router-dom";
import PropTypes from "prop-types";
import clsx from "clsx";
import { logoutUser } from "../../../actions/AuthActions";
import schoolyLogo from "../../../images/SchoolyLogo.png";
import LightTooltip from "../light-tooltip/LightTooltip";
import NavBarDrawerMenuButton from "./NavBarDrawerMenuButton";
import NavBarDrawerContent from "./NavBarDrawerContent";
import { AppBar, Avatar, Badge, Button, CssBaseline, Grid, IconButton, Link,
   ListItemIcon, ListItemText, Menu, MenuItem, Toolbar, useMediaQuery } from "@material-ui/core";
import {makeStyles, withStyles } from "@material-ui/core/styles";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import HelpIcon from "@material-ui/icons/Help";
import NotificationsIcon from "@material-ui/icons/Notifications";

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

const StyledMenu = withStyles({
  paper: {
    border: "1px solid #d3d4d5",
  },
})((props) => (
  <Menu
    elevation={0}
    getContentAnchorEl={null}
    anchorOrigin={{
      vertical: "bottom",
      horizontal: "center",
    }}
    transformOrigin={{
      vertical: "top",
      horizontal: "center",
    }}
    {...props}
  />
));

const StyledMenuItem = withStyles({
  root: {
    "&:hover": {
      backgroundColor: "#2196f3",
      "& .MuiListItemIcon-root, & .MuiListItemText-primary": {
        color: "white",
    },
  },
},
})((props) => (
  <MenuItem button component="a" {...props}/>
));

function NavBar(props){
  const classes = useStyles();
  const { window } = props;

  const { user } = props.auth;
  const history = useHistory()

  //Drawer at Mobile View Hooks
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };
  const mobileView = useMediaQuery("(max-width:600px)");

  //Drawer at Desktop View Hooks
  const [desktopOpen, setOpen] = React.useState(false);
  const handleDrawerOpen = () => {
    props.callbackFromParent(!desktopOpen)
    if(!desktopOpen)
      setOpen(true);
    else
      setOpen(false)
  };

  //Profile Menu
  const [anchorEl, setAnchorEl] = React.useState(null);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const onLogoutClick = (e) => {
    e.preventDefault();
    handleClose()
    props.logoutUser(history);
  }

  //NavBar Contents
  let leftSideNavBarContents;
  let middleNavBarContents;
  let rightSideNavBarContents;

  if(user.name !== undefined) {
    leftSideNavBarContents = (
      <Grid className={classes.navbarContainedLeftItems}>
        <NavBarDrawerMenuButton
          mobileView={mobileView}
          handleDrawerOpen={handleDrawerOpen}
          handleDrawerToggle={handleDrawerToggle}
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
      <Grid container className={classes.navbarContainedRightItems}>
          <LightTooltip title={user.name}>
            <IconButton onClick={handleClick} className={classes.iconButton}>
              <Avatar src={`/api/uploads/image/${user.avatar}`} className={classes.navbarProfilePicture} />
            </IconButton>
          </LightTooltip>
          <StyledMenu
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <StyledMenuItem href="/profil">
              <ListItemIcon >
                <AccountCircleIcon fontSize="medium"/>
              </ListItemIcon>
              <ListItemText primary="Profil Saya" />
            </StyledMenuItem>
            <StyledMenuItem onClick={onLogoutClick}>
              <ListItemIcon>
                <ExitToAppIcon fontSize="medium" />
              </ListItemIcon>
              <ListItemText primary="Keluar" />
            </StyledMenuItem>
          </StyledMenu>
          <LightTooltip title="Notifikasi">
            <IconButton color="inherit" href="/notifikasi">
              <Badge badgeContent={11} color="secondary">
                <NotificationsIcon />
              </Badge>
            </IconButton>
          </LightTooltip>
          <LightTooltip title="Bantuan">
            <IconButton color="inherit" href="/support">
              <HelpIcon />
            </IconButton>
          </LightTooltip>
      </Grid>
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
              width: "90px",
              height: "30px",
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
              fontSize: "6",
              width: "90px",
              height: "30px",
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
        handleDrawerToggle={handleDrawerToggle}
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
