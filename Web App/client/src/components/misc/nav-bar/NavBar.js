import React from "react"
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import clsx from "clsx";
import schoolyLogo from "../../../images/SchoolyLogo.png";
import LightTooltip from "../light-tooltip/LightTooltip";
import PropTypes from "prop-types";
import { AppBar, Avatar, Badge, Button, CssBaseline, Divider, Drawer, Grid, IconButton, List, ListItem,
  ListItemIcon, ListItemText, Toolbar } from "@material-ui/core";
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
  iconButton: {
    "&:focus": {
      outline: "transparent",
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
  },
  navbarContainedRightItems: {
    flex: "1",
    justifyContent: "flex-end",
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

function DrawerItemList(props) {
  return <ListItem button component="a" {...props} />;
}

function NavBar(props){
  var classes = useStyles();
  const { user } = props.auth;

  const [open, setOpen] = React.useState(false);

  const handleDrawerOpen = () => {
    props.callbackFromParent(!open)
    if(!open)
      setOpen(true);
    else
      setOpen(false)
  };

  let leftSideNavBarContents;
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
    rightSideNavBarContents = (
      <Grid container className={classes.navbarContainedRightItems}>
          <LightTooltip title={user.name}>
            <IconButton href="/profile">
              <Avatar src={`/api/uploads/image/${user.avatar}`} className={classes.navbarProfilePicture} />
            </IconButton>
          </LightTooltip>
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
      <Grid spacing={2}>
        <Grid>
      <Link to="/register">
        <Button
          variant="contained"
          size="small"
          style={{
            backgroundColor: "white",
            fontSize: "6",
            color: "#2196f3",
            width: "90px",
            height: "25px",
          }}
        >
          Register
        </Button>
      </Link>
      </Grid>
      
      <Grid>
      <Link to="/login">
        <Button
          variant="contained"
          size="small"
          style={{
            backgroundColor: "white",
            color: "#2196f3",
            fontSize: "6",
            width: "90px",
            height: "25px",
          }}
        >
          Log In
        </Button>
      </Link>
      </Grid>
    </Grid>
    )
    loggedInSideDrawerContents = null
  }

  var navBarContents = (
    <Toolbar className={classes.navbarContainer}>
      {leftSideNavBarContents}
        <a href="/dashboard">
          <img
            alt="SchoolyLogoNavBar"
            src={schoolyLogo}
            className={classes.schoolyLogo}
          />
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
