import React from "react"
import clsx from "clsx";
import PropTypes from "prop-types";
import { drawerWidth } from "./NavBar.js";
import { Avatar, Divider, Drawer, Hidden, List, ListItem, ListItemIcon, ListItemText, Toolbar, Typography } from "@material-ui/core";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import AboutIcon from "@material-ui/icons/Info";
import AssignmentIcon from "@material-ui/icons/AssignmentOutlined";
import AnnouncementIcon from "@material-ui/icons/Announcement";
import AssessmentIcon from "@material-ui/icons/AssessmentOutlined";
import ClassIcon from "@material-ui/icons/Class";
import DashboardIcon from "@material-ui/icons/DashboardOutlined";
import HelpIcon from "@material-ui/icons/Help";
import { FaChalkboardTeacher } from "react-icons/fa";
import { GrNotes, GrDocumentPerformance } from "react-icons/gr";
import { Link } from "react-router-dom"
import { connect } from "react-redux";

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
  drawerListItem: {
    "&:hover": {
      backgroundColor: "rgba(33, 150, 243, 0.2)",
    },
  },
  drawerListItemIcons: {
    width: theme.spacing(2.5),
    height: theme.spacing(2.5),
  },
}));

const generateList = (linkto, icon, itemText, isDisabled) => {
  return (
    <Link to={linkto}>
      <ListItem disabled={isDisabled}>
        <ListItemIcon>
          {icon}
        </ListItemIcon>
        <ListItemText
          primary={<Typography color="textPrimary">{itemText}</Typography>}
        />
      </ListItem>
    </Link>
  )
}

function DrawerContent(props) {
  const classes = useStyles();
  const { user } = props;

  let directedTo; // this is for the page that is directed when clicking the classIcon in NavBarContents

  if(user != undefined){
    if(user.role == "Student")
      directedTo = `/viewclass/${user.kelas}`
    else
      directedTo = "/newtasklist"
  }

  let ListItemContents = [
    ["/dashboard", <DashboardIcon className={classes.drawerListItemIcons} />, "Beranda", false],
    [directedTo, <FaChalkboardTeacher className={classes.drawerListItemIcons} />, "Kelas", false],
    // ["/announcements",<AnnouncementIcon className={classes.drawerListItemIcons} />,"Pengumuman", true],
    ["/newtasklist", <AssignmentIcon className={classes.drawerListItemIcons} />, "Tugas", false],
    // ["/quiz", <GrNotes className={classes.drawerListItemIcons} />, "Kuis", true],
    // ["/exams", <GrDocumentPerformance className={classes.drawerListItemIcons} />, "Ujian", true],
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
        {generateList("/bantuan", <HelpIcon className={classes.drawerListItemIcons} />,  "Bantuan", false)}
        {generateList("/tentang-schooly", <AboutIcon className={classes.drawerListItemIcons} />,  "Tentang Schooly", false)}
      </List>
    </div>
  )
};

function NavBarDrawerContent(props) {
  const classes = useStyles();
  const theme = useTheme();

  const { desktopOpen, mobileOpen, handleDrawerMobile, userLoggedIn } = props
  const {user} = props.auth;
  if(userLoggedIn !== undefined) {
    return (
      <div className={classes.drawerMobile}>
        <Hidden smUp implementation="css">
          {/* Mobile = Backdrop Drawer */}
          <Drawer
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
            <DrawerContent role="AA"/>
          </Drawer>
        </Hidden>
        <Hidden xsDown implementation="css">
        {/* Desktop = Mini Variant */}
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
            <DrawerContent user={user}/>
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

NavBarDrawerContent.propTypes = {
  auth: PropTypes.object.isRequired,
}

const mapStateToProps = (state) => ({
  auth: state.auth
})

export default connect(
  mapStateToProps) ( NavBarDrawerContent);
