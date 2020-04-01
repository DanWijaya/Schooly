import React, { Component } from 'react'
import DrawerToggleButton from '../side-drawer/DrawerToggleButton.js';
import '../side-drawer/DrawerToggleButton';
import './NavBar.css'
import logo from '../../../logos/Schooly Logo.png';
import PropTypes from "prop-types";
import {AppBar, CssBaseline, Divider, Drawer, Hidden, IconButton, List, ListItem, ListItemIcon,
        ListItemText, Toolbar, Typography} from "@material-ui/core";
import { Link } from 'react-router-dom';

// Import all Icon needed 
import InboxIcon from '@material-ui/icons/MoveToInbox';
import MailIcon from '@material-ui/icons/Mail';
import MenuIcon from '@material-ui/icons/Menu';
import AssignmentIcon from '@material-ui/icons/AssignmentOutlined';
import DashboardIcon from '@material-ui/icons/DashboardOutlined';
import AnnouncementIcon from '@material-ui/icons/Announcement';
import ClassIcon from '@material-ui/icons/Class';
import SettingIcon from '@material-ui/icons/SettingsOutlined'
import AccountIcon from '@material-ui/icons/AccountBox';
import AboutIcon from '@material-ui/icons/Info';
import AssessmentIcon from '@material-ui/icons/AssessmentOutlined';

import {makeStyles, useTheme} from '@material-ui/core/styles';
// import useScrollTrigger from "@material-ui/core/useScrollTrigger";

const drawerWidth = 200;
const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex'
  },
  drawer: {
    [theme.breakpoints.up('sm')]: {
      flexShrink: 0
    },
  },
  appBar: {
    [theme.breakpoints.up('sm')]: {
      // width: `calc(100% - ${drawerWidth}px)`,
    },
  },
  menuButton: {
    marginRight: theme.spacing(2),
    [theme.breakpoints.up('sm')]: {
      display: 'none'
    },
  },
  // necessary for content to be below app bar

  drawerPaper: {
    width: drawerWidth,
    marginTop: '64px' // Ikuti heightnya si Navbar pokoknya.
  },
  toolbar: {
    backgroundColor: "#2196f3", 
    display: 'flex', 
    justifyContent: 'space-between'
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3)
  }
  }))

// use the responsiveDrawer
function NavBar(props){
  const { container } = props;
  const classes = useStyles();
  const theme = useTheme();
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const generateIcon = (item) => {
    switch(item) {
      case 'Tasks':
        return <AssignmentIcon/>
      case 'Class':
        return <ClassIcon/>
      case 'Dashboard':
        return <DashboardIcon/>
      case 'Announcements' : 
        return <AnnouncementIcon/>
      case 'Assessments' : 
        return <AssessmentIcon/>
      case 'Settings' : 
        return <SettingIcon/>
      case 'Profile' : 
        return <AccountIcon/>
      case 'About Schooly' : 
        return <AboutIcon/>
      
      default: return ""
    }
  }

  const generateLink = (item) => {
    switch(item) {
      case 'Tasks':
        return "/viewtask"
      case 'Class':
        return "/viewclass"
      case 'Dashboard':
        return "/dashboard"
      case 'Announcements' : 
        return "/announcments"
      case "Assessments": 
        return "/assessments"
      case 'Settings' : 
        return "/settings"
      case 'Profile' : 
        return "/profile"
      case 'About Schooly' : 
        return "/about-schooly"
    }
  }

  const drawer = (
    <div>
      <div className={classes.toolbar} />
      <List>
        {['Dashboard', 'Class', 'Tasks', 'Announcements', 'Assessments'].map((text, index) => (
          <ListItem button component={Link} to={generateLink(text)}>
            <ListItemIcon>{ generateIcon(text) }</ListItemIcon>
            <ListItemText primary={text} />
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
        {['Profile', 'Settings', 'About Schooly'].map((text, index) => (
          <ListItem button component={Link} to={generateLink(text)} key={text}>
            <ListItemIcon>{ generateIcon(text)}</ListItemIcon>
            <ListItemText primary={text} />
          </ListItem>
        ))}
      </List>
    </div>
  );

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar position="flex" className={classes.appBar}>
        <Toolbar className={classes.toolbar}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            className={classes.menuButton}
          >
            <MenuIcon />
          </IconButton>
          <div className="NavBar__logo">
              <a href="/dashboard"><img src={logo} className="logo"/></a>
          </div>
          <div className="NavBar_navigation-items">
            <a href="/profile">Profile</a>
            <a href="/about-schooly">About</a>
          </div>
        </Toolbar>
      </AppBar>
      <nav className={classes.drawer} id="drawer" aria-label="mailbox folders">
        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
        <Hidden smUp implementation="css">
          <Drawer
            container={container}
            variant="temporary"
            anchor={theme.direction === 'rtl' ? 'right' : 'left'}
            open={mobileOpen}
            onClose={handleDrawerToggle}
            classes={{
              paper: classes.drawerPaper,
            }}
            id="DrawerBar"
            style={{
              marginTop: '64px'
            }}
            ModalProps={{
              keepMounted: true, // Better open performance on mobile.
            }}
          >
            {drawer}
          </Drawer>
        </Hidden>
        <Hidden xsDown implementation="css">
          <Drawer
            classes={{
              paper: classes.drawerPaper,
            }}
            variant="permanent"
            open
          >
            {drawer}
          </Drawer>
        </Hidden>
      </nav>
      </div>
  )
 }

// function ElevationScroll(props) {
//       const { children } = props;
//       const trigger = useScrollTrigger({
//         disableHysteresis: true,
//         threshold: 0,
//       });

//       return React.cloneElement(children, {
//         elevation: trigger ? 4 : 0,
//       });
// }

// ElevationScroll.propTypes = {
//       children: PropTypes.element.isRequired,
// };


// function NavBar(props){

//   return(
//       <React.Fragment>
//         <CssBaseline />
//           <ElevationScroll {...props}>
//             <AppBar >
//               <Toolbar style={{ backgroundColor: "#2196f3"}}>
//                 {/* <nav className="navbar-light NavBar__navigation">
//                 <div>
//                     <DrawerToggleButton click={props.drawerClickHandler} />
//                 </div> */}
//                 <div className="NavBar__logo">
//                   <a href="/"><img src={logo} className="logo"/></a>
//                 </div>
//                 <div className="spacer" />
//                 <div className="NavBar_navigation-items">
//                      <ul>
//                       <li>
//                         <a href="/profile"> Profile </a>
//                        </li>
//                       <li>
//                       <a href="/about-schooly">About </a>
//                       </li>
//                     </ul>
//                 </div>
//                 {/* </nav> */}
//               </Toolbar>
//             </AppBar>
//           </ElevationScroll>
//           <Toolbar />
//       </React.Fragment>
//   );
// }

export default NavBar;
