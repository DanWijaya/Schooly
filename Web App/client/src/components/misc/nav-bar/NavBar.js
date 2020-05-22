import React from "react"
import { connect } from "react-redux";
import clsx from "clsx";
import schoolyLogo from "../../../images/SchoolyLogo.png";
import LightTooltip from "../light-tooltip/LightTooltip";
import PropTypes from "prop-types";
import { AppBar, Avatar, Badge, Button, CssBaseline, Divider, Drawer, Grid, IconButton, Link,
   List, ListItem, ListItemIcon, ListItemText, Menu, MenuItem, Toolbar } from "@material-ui/core";
import {makeStyles, withStyles, useTheme} from "@material-ui/core/styles";
import AboutIcon from "@material-ui/icons/Info";
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import AssignmentIcon from "@material-ui/icons/AssignmentOutlined";
import AnnouncementIcon from "@material-ui/icons/Announcement";
import AssessmentIcon from "@material-ui/icons/AssessmentOutlined";
import ClassIcon from "@material-ui/icons/Class";
import CloseIcon from '@material-ui/icons/Close';
import DashboardIcon from "@material-ui/icons/DashboardOutlined";
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import HelpIcon from '@material-ui/icons/Help';
import MenuIcon from "@material-ui/icons/Menu"
import NotificationsIcon from "@material-ui/icons/Notifications";
import SettingIcon from "@material-ui/icons/SettingsOutlined"

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
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: "nowrap",
  },
  drawerOpen: {
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerClose: {
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: "hidden",
    width: theme.spacing(7) + 1,
    [theme.breakpoints.up("sm")]: {
      width: theme.spacing(9) + 1,
    },
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
    border: '1px solid #d3d4d5',
  },
})((props) => (
  <Menu
    elevation={0}
    getContentAnchorEl={null}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'center',
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'center',
    }}
    {...props}
  />
));

const StyledMenuItem = withStyles({
  root: {
    "&:hover": {
      backgroundColor: "#2196f3",
    },
  },
})((props) => (
  <MenuItem button component="a" {...props} />
));

function DrawerItemList(props) {
  return <ListItem button component="a" {...props} />;
}

function NavBar(props){
  var classes = useStyles();
  const { user } = props.auth;

  //Profile Menu
  const [anchorEl, setAnchorEl] = React.useState(null);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  //Drawer
  const [open, setOpen] = React.useState(false);
  const handleDrawerOpen = () => {
    props.callbackFromParent(!open)
    if(!open)
      setOpen(true);
    else
      setOpen(false)
  };

  //NavBar Contents
  let leftSideNavBarContents;
  let middleNavBarContents;
  let rightSideNavBarContents;
  let loggedInSideDrawerContents;

  if(user.name !== undefined) {
    leftSideNavBarContents = (
      <Grid className={classes.navbarContainedLeftItems}>
        <IconButton
          color="inherit"
          edge="start"
          className={classes.iconButton}
          onClick={handleDrawerOpen}
        >
          <MenuIcon />
        </IconButton>
      </Grid>
    )
    middleNavBarContents = (
      <Link to="/dashboard">
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
            <IconButton disableRipple onClick={handleClick} className={classes.iconButton}>
              <Avatar src={`/api/uploads/image/${user.avatar}`} className={classes.navbarProfilePicture} />
            </IconButton>
          </LightTooltip>
          <StyledMenu
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <StyledMenuItem href="/profile">
              <ListItemIcon>
                <AccountCircleIcon fontSize="medium" />
              </ListItemIcon>
              <ListItemText primary="Profil Saya" />
            </StyledMenuItem>
            <StyledMenuItem>
              <ListItemIcon>
                <ExitToAppIcon fontSize="medium" />
              </ListItemIcon>
              <ListItemText primary="Keluar" />
            </StyledMenuItem>
          </StyledMenu>
          <LightTooltip title="Notifications">
            <IconButton color="inherit" href="/notifications">
              <Badge badgeContent={11} color="secondary">
                <NotificationsIcon />
              </Badge>
            </IconButton>
          </LightTooltip>
          <LightTooltip title="Help and Support">
            <IconButton color="inherit" href="/support">
              <HelpIcon />
            </IconButton>
          </LightTooltip>
        </Grid>
    )
    loggedInSideDrawerContents = (
      <Drawer
        variant="permanent"
        className={clsx(classes.drawer, {
          [classes.drawerOpen]: open,
          [classes.drawerClose]: !open,
        })}
        classes={{
          paper: clsx({
            [classes.drawerOpen]: open,
            [classes.drawerClose]: !open,
          }),
        }}
      >
        <Toolbar />
        <List>
          <DrawerItemList href="/dashboard">
              <ListItemIcon>
                <DashboardIcon />
              </ListItemIcon>
              <ListItemText primary="Dashboard" />
          </DrawerItemList>
          <DrawerItemList href="/viewclass">
              <ListItemIcon>
                <ClassIcon />
              </ListItemIcon>
              <ListItemText primary="Classes" />
          </DrawerItemList>
          <DrawerItemList href="/announcements">
              <ListItemIcon>
                <AnnouncementIcon />
              </ListItemIcon>
              <ListItemText primary="Announcements" />
          </DrawerItemList>
          <DrawerItemList href="/viewtask">
              <ListItemIcon>
                <AssignmentIcon />
              </ListItemIcon>
              <ListItemText primary="Tasks" />
          </DrawerItemList>
          <DrawerItemList href="/assessments" disabled>
              <ListItemIcon>
                <AssessmentIcon />
              </ListItemIcon>
              <ListItemText primary="Assessments" />
          </DrawerItemList>
        </List>
        <Divider />
        <List>
          <DrawerItemList href="/about-schooly">
              <ListItemIcon>
                <AboutIcon />
              </ListItemIcon>
              <ListItemText primary="About Schooly" />
          </DrawerItemList>
          <DrawerItemList href="/settings">
              <ListItemIcon>
                <SettingIcon />
              </ListItemIcon>
              <ListItemText primary="Settings" />
          </DrawerItemList>
        </List>
      </Drawer>
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
            href="/register"
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
            href="/login"
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
    loggedInSideDrawerContents = <div style={{display: 'none'}}></div>
  }

  var navBarContents = (
    <Toolbar className={classes.navbarContainer}>
      {leftSideNavBarContents}
      {middleNavBarContents}
      {rightSideNavBarContents}
    </Toolbar>
  )

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar
        position="fixed"
        className={clsx(classes.appBar, {
          [classes.appBarShift]: open,
        })}
      >
         {navBarContents}
      </AppBar>
      <Toolbar />
      {loggedInSideDrawerContents}
    </div>
  )
}

NavBar.propTypes = {
   auth: PropTypes.object.isRequired,
 }

const mapStateToProps = (state) => ({
   auth: state.auth
 });

export default connect(
   mapStateToProps
 ) (NavBar);
