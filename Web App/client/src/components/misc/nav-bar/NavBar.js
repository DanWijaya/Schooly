import React, { Component } from "react"
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import clsx from "clsx";
import schoolyLogo from "../../../logos/SchoolyLogo.png";
import PropTypes from "prop-types";
import {AppBar, Avatar, Badge, CssBaseline, Divider, Drawer, Hidden, IconButton, List, ListItem,
        ListItemIcon, ListItemText, Toolbar, Tooltip, Typography} from "@material-ui/core";
import {makeStyles, useTheme} from "@material-ui/core/styles";
import AboutIcon from "@material-ui/icons/Info";
import AssignmentIcon from "@material-ui/icons/AssignmentOutlined";
import AnnouncementIcon from "@material-ui/icons/Announcement";
import AssessmentIcon from "@material-ui/icons/AssessmentOutlined";
import ClassIcon from "@material-ui/icons/Class";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import DashboardIcon from "@material-ui/icons/DashboardOutlined";
import HelpIcon from '@material-ui/icons/Help';
import MenuIcon from "@material-ui/icons/Menu"
import NotificationsIcon from "@material-ui/icons/Notifications";
import SettingIcon from "@material-ui/icons/SettingsOutlined"

const drawerWidth = 240;

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
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: 36,
  },
  hide: {
    display: "none",
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
  navbarNavigationItems: {
    display: 'flex',
    color: "white",
    alignItems: "center",
    justifyContent: "space-between",
  },
  toolbar: {
    display: "flex",
    alignItems: "center",
    justify: "flex-end",
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
}));

function DrawerItemList(props) {
  return <ListItem button component="a" {...props} />;
}

function NavBar(props){
  const classes = useStyles();
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);

  const { user } = props.auth;

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar
        position="fixed"
        className={clsx(classes.appBar, {
          [classes.appBarShift]: open,
        })}
      >
        <Toolbar style={{ display: 'flex', justifyContent: 'space-between'}}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            className={clsx(classes.menuButton, {
              [classes.hide]: open,
            })}
          >
            <MenuIcon />
          </IconButton>
          <div className={classes.navbarLogo}>
            <a href="/dashboard"><img src={schoolyLogo} className={classes.schoolyLogo}/></a>
          </div>
          <div className={classes.navbarNavigationItems}>
            <a href="/profile">
              <Tooltip title={user.name}>
                <Avatar className={classes.navbarProfilePicture} />
              </Tooltip>
            </a>
            <Tooltip title="Notifications">
              <IconButton href="/notifications">
                <Badge badgeContent={11} color="secondary">
                  <NotificationsIcon />
                </Badge>
              </IconButton>
            </Tooltip>
            <Tooltip title="Help and Support">
              <IconButton href="/support">
                <HelpIcon />
              </IconButton>
            </Tooltip>
          </div>
        </Toolbar>
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
        <div className={classes.toolbar}>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === "rtl" ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          </IconButton>
        </div>
        <Divider />
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
