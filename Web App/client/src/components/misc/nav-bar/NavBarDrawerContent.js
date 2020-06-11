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
  drawerListItemIcons: {
    width: theme.spacing(2.5),
    height: theme.spacing(2.5),
  },
  test: {
    "&:hover": {
      backgroundColor: "rgba(33, 150, 243, 0.2)",
    },
  }
}));

const generateList = (linkto, icon, itemText, isDisabled) => {
  return (
    <ListItem button component="a" href={linkto} disabled={isDisabled}>
      <ListItemIcon>
        {icon}
      </ListItemIcon>
      <ListItemText primary={itemText} />
    </ListItem>
  )
}

function DrawerContent(props) {
  const classes = useStyles();

  let ListItemContents = [
    ["/dashboard", <DashboardIcon className={classes.drawerListItemIcons} />, "Beranda", false],
    ["/newclasslist",<FaChalkboardTeacher className={classes.drawerListItemIcons} />, "Kelas", false],
    ["/announcements",<AnnouncementIcon className={classes.drawerListItemIcons} />,"Pengumuman", true],
    ["/newtasklist", <AssignmentIcon className={classes.drawerListItemIcons} />, "Tugas", false],
    ["/quiz", <GrNotes className={classes.drawerListItemIcons} />, "Kuis", true],
    ["/exams", <GrDocumentPerformance className={classes.drawerListItemIcons} />, "Ujian", true],
    // After divider (Kalo lebih dari satu, baru nnti loop array nya juga, satu aja ndak usah)
    // ["/tentang-schooly", <AboutIcon className={classes.drawerListItemIcons} />,  "Tentang Schooly", false]
  ]

  return (
    <div>
      <List>
        {ListItemContents.map((item) => (
          generateList(item[0],item[1],item[2],item[3]))
        )}
      </List>
      <Divider />
      <List>
        {generateList("/tentang-schooly", <AboutIcon className={classes.drawerListItemIcons} />,  "Tentang Schooly", false)}
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
