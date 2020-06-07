import React from "react"
import clsx from "clsx";
import { drawerWidth } from "./NavBar.js";
import { Avatar, Divider, Drawer, Hidden, List, ListItem, ListItemIcon, ListItemText, Toolbar } from "@material-ui/core";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import AboutIcon from "@material-ui/icons/Info";
import AssignmentIcon from "@material-ui/icons/AssignmentOutlined";
import AnnouncementIcon from "@material-ui/icons/Announcement";
import AssessmentIcon from "@material-ui/icons/AssessmentOutlined";
import ClassIcon from "@material-ui/icons/Class";
import DashboardIcon from "@material-ui/icons/DashboardOutlined";
import { FaChalkboardTeacher } from "react-icons/fa";
import { GrNotes, GrDocumentPerformance } from "react-icons/gr";

const useStyles = makeStyles((theme) => ({
  drawerMobile: {
    [theme.breakpoints.up("sm")]: {
      width: drawerWidth,
      flexShrink: 0,
    },
  },
  drawerPaper: {
    width: drawerWidth,
  },
  drawerDesktop: {
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: "nowrap",
  },
  drawerDesktopOpen: {
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerDesktopClose: {
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
  drawerIcons: {
    width: theme.spacing(2.5),
    height: theme.spacing(2.5),
  }
}));

function DrawerContent(props) {
  const classes = useStyles();

  return (
    <div>
      <List>
        <ListItem button component="a" href="/dashboard">
            <ListItemIcon>
              <DashboardIcon />
            </ListItemIcon>
            <ListItemText primary="Beranda" />
        </ListItem>
        <ListItem button component="a" href="/viewclass">
            <ListItemIcon>
              <FaChalkboardTeacher className={classes.drawerIcons} />
            </ListItemIcon>
            <ListItemText primary="Kelas" />
        </ListItem>
        <ListItem button component="a" href="/announcements" disabled>
            <ListItemIcon>
              <AnnouncementIcon />
            </ListItemIcon>
            <ListItemText primary="Pengumuman" />
        </ListItem>
        <ListItem button component="a" href="/viewtask">
            <ListItemIcon>
              <AssignmentIcon />
            </ListItemIcon>
            <ListItemText primary="Tugas" />
        </ListItem>
        <ListItem button component="a" href="/quiz" disabled>
            <ListItemIcon>
              <GrNotes className={classes.drawerIcons} />
            </ListItemIcon>
            <ListItemText primary="Kuis" />
        </ListItem>
        <ListItem button component="a" href="/exams" disabled>
            <ListItemIcon>
              <GrDocumentPerformance className={classes.drawerIcons} />
            </ListItemIcon>
            <ListItemText primary="Ujian" />
        </ListItem>

      </List>
      <Divider />
      <List>
        <ListItem button component="a" href="/tentang-schooly">
            <ListItemIcon>
              <AboutIcon />
            </ListItemIcon>
            <ListItemText primary="Tentang Schooly" />
        </ListItem>
      </List>
    </div>
  )
};

function NavBarDrawerContent(props) {
  const classes = useStyles();
  const theme = useTheme();

  const { desktopOpen, mobileOpen, handleDrawerMobile, userLoggedIn, window } = props
  const container = window !== undefined ? () => window().document.body : undefined;

  if(userLoggedIn !== undefined) {
    return (
      <div className={classes.drawerMobile}>
        <Hidden smUp implementation="css">
          <Drawer
            container={container}
            variant="temporary"
            anchor={theme.direction === "rtl" ? "right" : "left"}
            open={mobileOpen}
            onClose={handleDrawerMobile}
            classes={{
              paper: classes.drawerPaper,
            }}
            ModalProps={{
              keepMounted: true,
            }}
          >
            {/* <Toolbar /> */}
            <DrawerContent />
          </Drawer>
        </Hidden>
        <Hidden xsDown implementation="css">
          <Drawer
            variant="permanent"
            className={clsx(classes.drawerDesktop, {
              [classes.drawerDesktopOpen]: desktopOpen,
              [classes.drawerDesktopClose]: !desktopOpen,
            })}
            classes={{
              paper: clsx({
                [classes.drawerDesktopOpen]: desktopOpen,
                [classes.drawerDesktopClose]: !desktopOpen,
              }),
            }}
          >
            <Toolbar />
            <DrawerContent />
          </Drawer>
        </Hidden>
      </div>
    )
  }
  else {
    return (
      <div style={{display: "none"}} />
    )
  }
}

export default NavBarDrawerContent;
