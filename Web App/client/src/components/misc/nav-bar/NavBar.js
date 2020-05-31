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
import { makeStyles, withStyles } from "@material-ui/core/styles";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import HelpIcon from "@material-ui/icons/Help";
import NotificationsIcon from "@material-ui/icons/Notifications";
import MoreIcon from '@material-ui/icons/MoreVert';

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
  const { window } = props;
  const isMobileView = useMediaQuery("(max-width:600px)");

  const { user } = props.auth;
  const history = useHistory()

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

  // Menu items in Mobile
  const [mobileAnchorEl, setMobileAnchorEl] = React.useState(null);
  const handleMobileMenuClose = () => {
    setMobileAnchorEl(null);
  };
  const handleMobileMenuOpen = (event) => {
    setMobileAnchorEl(event.currentTarget);
  }

  const handleMenuClose = () => {
    setProfileAnchorEl(null);
    handleMobileMenuClose();
  };
  const mobileMenuId = 'primary-search-account-menu-mobile';

  //Profile Menu
  const [profileAnchorEl, setProfileAnchorEl] = React.useState(null);
  const handleProfileMenu = (event) => {
    setProfileAnchorEl(event.currentTarget);
  };
  const handleProfileMenuClose = () => {
    setProfileAnchorEl(null);
  };
  const onLogoutClick = (e) => {
    e.preventDefault();
    handleProfileMenuClose()
    props.logoutUser(history);
  }

  const renderProfileMenu = (
    <Menu
      anchorEl={profileAnchorEl}
      keepMounted
      open={Boolean(profileAnchorEl)}
      onClose={handleProfileMenuClose}
      getContentAnchorEl={null}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "center",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "center",
      }}
    >
      <MenuItem className={classes.profileMenuItem} button component="a" href="/profil">
        <ListItemIcon >
          <AccountCircleIcon fontSize="medium"/>
        </ListItemIcon>
        <ListItemText primary="Profil Saya" />
      </MenuItem>
      <MenuItem className={classes.profileMenuItem} onClick={onLogoutClick}>
        <ListItemIcon>
          <ExitToAppIcon fontSize="medium" />
        </ListItemIcon>
        <ListItemText primary="Keluar" />
      </MenuItem>
    </Menu>
  )

  // Desktop Menu (will rendered when in desktop mode / width >= 600px)
  const renderDesktopMenu = (
    <Grid container className={classes.navbarContainedRightItems}>
    <LightTooltip title={user.name}>
      <IconButton onClick={handleProfileMenu} className={classes.iconButton}>
        <Avatar src={`/api/uploads/image/${user.avatar}`} className={classes.navbarProfilePicture} />
      </IconButton>
    </LightTooltip>
   {renderProfileMenu}
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

  // Mobile menu (will rendered when in mobile mode / width < 600px)

  const renderMobileMenu = (
    <Grid container className={classes.navbarContainedRightItems}>
      <IconButton
        aria-label="show more"
        aria-controls={mobileMenuId}
        aria-haspopup="true"
        onClick={handleMobileMenuOpen}
        color="inherit"
      >
        <MoreIcon />
      </IconButton>
    <Menu
      anchorEl={mobileAnchorEl}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={Boolean(mobileAnchorEl)}
      onClose={handleMobileMenuClose}
    >
      <MenuItem button  component="a" href="/notifikasi">
        <IconButton color="inherit">
          <Badge badgeContent={11} color="secondary">
            <NotificationsIcon />
          </Badge>
        </IconButton>
        <p>Notifikasi</p>
      </MenuItem>

      <MenuItem button  component="a" href="/support">
        <IconButton color="inherit">
          <HelpIcon />
        </IconButton>
        <p>Bantuan</p>
      </MenuItem>

      <MenuItem onClick={handleProfileMenu}>
        <IconButton className={classes.iconButton}>
          <Avatar src={`/api/uploads/image/${user.avatar}`} className={classes.navbarProfilePicture} />
        </IconButton>
        <p>Akun saya</p>
      </MenuItem>
    </Menu>
    {renderProfileMenu}
    </Grid>
  )

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

    if(isMobileView)
      rightSideNavBarContents = (
        renderMobileMenu
      )
    else 
      rightSideNavBarContents = (
        renderDesktopMenu
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
