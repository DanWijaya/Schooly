import React from 'react'

import './SideDrawer.css'
import { Link } from '@material-ui/core';
import PropTypes from 'prop-types';
import AppBar from '@material-ui/core/AppBar';
import CssBaseline from '@material-ui/core/CssBaseline';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import Hidden from '@material-ui/core/Hidden';
import IconButton from '@material-ui/core/IconButton';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import MailIcon from '@material-ui/icons/Mail';
import MenuIcon from '@material-ui/icons/Menu';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import logo from '../../../logos/Schooly Logo.png';
const drawerWidth = 240;

// const useStyles = makeStyles(theme => ({
//   root: {
//     display: 'flex',
//   },
//   drawer: {
//     [theme.breakpoints.up('sm')]: {
//       width: drawerWidth,
//       flexShrink: 0,
//     },
//   },
//   appBar: {
//     [theme.breakpoints.up('sm')]: {
//       width: `calc(100% - ${drawerWidth}px)`,
//       marginLeft: drawerWidth,
//     },
//   },
//   menuButton: {
//     marginRight: theme.spacing(2),
//     [theme.breakpoints.up('sm')]: {
//       display: 'none',
//     },
//   },
//   // necessary for content to be below app bar
//   toolbar: theme.mixins.toolbar,
//   drawerPaper: {
//     width: drawerWidth,
//   },
//   content: {
//     flexGrow: 1,
//     padding: theme.spacing(3),
//   },
// }));

// // use the responsiveDrawer
// function SideDrawer(props){ 
//   const { container } = props;
//   const classes = useStyles();
//   const theme = useTheme();
//   const [mobileOpen, setMobileOpen] = React.useState(false);

//   const handleDrawerToggle = () => {
//     setMobileOpen(!mobileOpen);
//   };

//   const drawer = (
//     <div>
//       <div className={classes.toolbar} />
//       <Divider />
//       <List>
//         {['Inbox', 'Starred', 'Send email', 'Drafts'].map((text, index) => (
//           <ListItem button key={text}>
//             <ListItemIcon>{index % 2 === 0 ? <InboxIcon /> : <MailIcon />}</ListItemIcon>
//             <ListItemText primary={text} />
//           </ListItem>
//         ))}
//       </List>
//       <Divider />
//       <List>
//         {['All mail', 'Trash', 'Spam'].map((text, index) => (
//           <ListItem button key={text}>
//             <ListItemIcon>{index % 2 === 0 ? <InboxIcon /> : <MailIcon />}</ListItemIcon>
//             <ListItemText primary={text} />
//           </ListItem>
//         ))}
//       </List>
//     </div>
//   );

//   return (
//     <div className={classes.root}>
//       <CssBaseline />
//       <AppBar position="fixed" className={classes.appBar}>
//         <Toolbar>
//           <IconButton
//             color="inherit"
//             aria-label="open drawer"
//             edge="start"
//             onClick={handleDrawerToggle}
//             className={classes.menuButton}
//           >
//             <MenuIcon />
//           </IconButton>
//           <Typography variant="h6" noWrap>
//             Responsive drawer
//           </Typography>
//         </Toolbar>
//       </AppBar>
//       <nav className={classes.drawer} aria-label="mailbox folders">
//         {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
//         <Hidden smUp implementation="css">
//           <Drawer
//             container={container}
//             variant="temporary"
//             anchor={theme.direction === 'rtl' ? 'right' : 'left'}
//             open={mobileOpen}
//             onClose={handleDrawerToggle}
//             classes={{
//               paper: classes.drawerPaper,
//             }}
//             ModalProps={{
//               keepMounted: true, // Better open performance on mobile.
//             }}
//           >
//             {drawer}
//           </Drawer>
//         </Hidden>
//         <Hidden xsDown implementation="css">
//           <Drawer
//             classes={{
//               paper: classes.drawerPaper,
//             }}
//             variant="permanent"
//             open
//           >
//             {drawer}
//           </Drawer>
//         </Hidden>
//       </nav>
//       </div>
//   )
//  } 

const SideDrawer = props => {
  // let drawerClasses = ['side-drawer'];
  let drawerClasses = "w3-sidebar w3-light-grey w3-bar-block side-drawer";
  if(props.show){
    // drawerClasses = ['side-drawer','open'];
    drawerClasses = "w3-sidebar w3-light-grey w3-bar-block side-drawer open";
  }


  function actionDropdowns(id) {
    var x = document.getElementById(id);
    if (x.className.indexOf("w3-show") == -1) {
      x.className += " w3-show";
      // x.previousElementSibling.className += " w3-blue";
    } else { 
      x.className = x.className.replace(" w3-show", "");
      x.previousElementSibling.className = x.previousElementSibling.className.replace(" w3-blue", "");
    }
  }

  // function addEntry(id) {
  //   var ul = document.getElementById(id)
  //   var newLink = document.createElement('a')
  //   newLink.setAttribute('class', "w3-bar-item w3-button");
  //   newLink.appendChild(document.createTextNode("Class 3"));
  //   ul.appendChild(newLink);
  // }
  
  
  return (
    <div>
      <link rel="stylesheet" href="https://www.w3schools.com/w3css/4/w3.css"/>

        {/* Sidebar */}
        <div className={drawerClasses} style={{marginTop:"45.5px", width:"25%", color: "black"}}>
          <h3 class="w3-bar-item">Menu</h3>

          <button class="w3-button w3-block w3-left-align">About</button>
          <button class="w3-button w3-block w3-left-align">Account</button>

            <button class="w3-button w3-block w3-left-align" onClick={() => actionDropdowns("task")}>Tasks <i class="fa fa-caret-down"></i></button>
              <div name="dropdowns" id="task" class="w3-container w3-hide">
                <a class="w3-bar-item w3-button">Task 1</a>
                <a class="w3-bar-item w3-button">Task 2</a>
              </div>

            <button class="w3-button w3-block w3-left-align" onClick={() => actionDropdowns("classes")}>Classes <i class="fa fa-caret-down"></i></button>
              <div name="dropdowns" id="classes" class="w3-container w3-hide">
                <a class="w3-bar-item w3-button">Class 1</a>
                <a class="w3-bar-item w3-button">Class 2</a>
              </div>
{/* 
              <button class="add" onClick={() => addEntry("classes")} > Add classes</button>
              <button class="add" onClick={() => addEntry("task")} > Add Tasks</button> */}
        </div>

          
      </div>
    );
  }

  export default SideDrawer;