import React, { Component } from "react"
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import clsx from "clsx";
import schoolyLogo from "../../../images/SchoolyLogo.png";
import PropTypes from "prop-types";
import {AppBar, Avatar, Badge, Button, CssBaseline, Divider, Drawer, Hidden, IconButton, List, ListItem,
  ListItemIcon, ListItemText, Toolbar, Tooltip, Typography} from "@material-ui/core";
import {makeStyles, useTheme} from "@material-ui/core/styles";
import AboutIcon from "@material-ui/icons/Info";
import AssignmentIcon from "@material-ui/icons/AssignmentOutlined";
import AnnouncementIcon from "@material-ui/icons/Announcement";
import AssessmentIcon from "@material-ui/icons/AssessmentOutlined";
import ClassIcon from "@material-ui/icons/Class";
import DashboardIcon from "@material-ui/icons/DashboardOutlined";
import HelpIcon from '@material-ui/icons/Help';
import MenuIcon from "@material-ui/icons/Menu"
import NotificationsIcon from "@material-ui/icons/Notifications";
import SettingIcon from "@material-ui/icons/SettingsOutlined"

export const drawerWidth = 220;

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
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
  schoolyLogo: {
    width: "100px",
    height: "50px",

  },
  navbarProfilePicture: {
    width: theme.spacing(3),
    height: theme.spacing(3),
  },
  navbarLoggedInItems: {
    display: "flex",
    justifyContent: "space-between",
  },
  navbarLoggedOutItems: {
    display: "flex",
    justifyContent: "center",
  },

  navbarNavigationItems: {
    display: 'flex',
    alignItems: "space-between",
  },
  iconButton: {
    "&:focus": {
      outline: "transparent",
      backgroundColor: "transparent",
    },
  },
}));

function DrawerItemList(props) {
  return <ListItem button component="a" {...props} />;
}

function NavBar(props){
  var classes = useStyles();
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);

  const { user } = props.auth;

  const handleDrawerOpen = () => {
    props.callbackFromParent(!open)
    if(!open)
      setOpen(true);
    else
      setOpen(false)
  };

  let leftSideNavBarContents; // konten Navbar di bagian kiri logo
  let rightSideNavBarContents; // konten Navbar di bagian kanan logo
  let navBarContentsStyle;
  let loggedInSideDrawerContents;

  if(user.name != undefined) {
    leftSideNavBarContents = (
      <IconButton
          color="inherit"
          edge="start"
          className={classes.iconButton}
          onClick={handleDrawerOpen}
        >
        <MenuIcon />
      </IconButton>
    )

    rightSideNavBarContents = (
      <div className={classes.navbarNavigationItems}>
          <Tooltip title={user.name}>
            <IconButton href="/profile">
              <Avatar src={`/api/uploads/image/${user.avatar}`}className={classes.navbarProfilePicture} />
            </IconButton>
          </Tooltip>

          <Tooltip title="Notifications">
            <IconButton color="inherit" href="/notifications">
              <Badge badgeContent={11} color="secondary">
                <NotificationsIcon />
              </Badge>
            </IconButton>
          </Tooltip>

          <Tooltip title="Help and Support">
            <IconButton color="inherit" href="/support">
              <HelpIcon />
            </IconButton>
          </Tooltip>
        </div>
    )

    navBarContentsStyle = classes.navbarLoggedInItems

    loggedInSideDrawerContents = (
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
      )
    }

  else {
    leftSideNavBarContents = (
      <IconButton
        edge="start"
        color="inherit"
        className={classes.iconButton}
        onClick={handleDrawerOpen}
      >
        <MenuIcon />
      </IconButton>
    )
    rightSideNavBarContents = (
      <div className={classes.navbarNavigationItems}>
      <Link to="/register">
        <Button
          variant="contained"
          size="medium"
          style={{
            backgroundColor: "white",
            fontSize: "6",
            color: "#2196f3",
            width: "90px",
            height: "30px",
          }}
        >
          Register
        </Button>
      </Link>
        <br/><br/>
      <Link to="/login">
        <Button
          variant="contained"
          size="small"
          style={{
            backgroundColor: "white",
            color: "#2196f3",
            fontSize: "6",
            width: "90px",
            height: "30px",
          }}
        >
          Log In
        </Button>
      </Link>
    </div>
    )
    navBarContentsStyle = classes.navbarLoggedInItems
    loggedInSideDrawerContents = null
  }

  var navBarContents = (
    <Toolbar className={navBarContentsStyle}>
      {leftSideNavBarContents}
        <a href="/dashboard">
          <img src={schoolyLogo} className={classes.schoolyLogo}/>
        </a>
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
         <Divider />
         {loggedInSideDrawerContents}
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
