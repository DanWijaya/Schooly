import React from "react"
import { Link } from "react-router-dom"
import { connect } from "react-redux";
import clsx from "clsx";
import PropTypes from "prop-types";
import { Drawer, Hidden, List, ListItem, ListItemIcon, ListItemText, Toolbar, Typography } from "@material-ui/core";
import { makeStyles, withStyles, useTheme } from "@material-ui/core/styles";
import AssignmentIcon from "@material-ui/icons/AssignmentOutlined";
import AnnouncementIcon from "@material-ui/icons/Announcement";
import DashboardIcon from "@material-ui/icons/DashboardOutlined";
import LibraryBooksIcon from "@material-ui/icons/LibraryBooks";
import MenuBookIcon from "@material-ui/icons/MenuBook";
import { FaChalkboardTeacher, FaClipboardList, FaDropbox, FaFileSignature, FaUserCheck, FaUserClock } from "react-icons/fa";

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  drawerMobile: {
    [theme.breakpoints.up("sm")]: {
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
  drawerListItemIcon: {
    width: theme.spacing(2.7),
    height: theme.spacing(2.7),
  },
}));

const StyledListItem = withStyles((theme) => ({
  root: {
    "&:active, &:hover": {
      backgroundColor: theme.palette.button.main,
    },
  },
}))(ListItem);

function DrawerContent(props) {
  const classes = useStyles();

  const { user, handleDrawerMobile } = props;

  const generateList = (linkto, icon, itemText, subheader=false) => {
    return (
      <Link to={linkto} onClick={handleDrawerMobile}>
        <StyledListItem button>
          <ListItemIcon>
            {icon}
          </ListItemIcon>
          <ListItemText
            primary={<Typography color="textPrimary">{itemText}</Typography>}
          />
        </StyledListItem>
      </Link>
    )
  }

  /* directedTo is for the page that is directed when clicking the classIcon in NavBarContents*/
  let directedTo;
  if (user !== undefined) {
    if (user.role === "Student")
      directedTo = `/kelas/${user.kelas}`
    else
      directedTo = "/daftar-kelas"
  }

  let ListItemContents;
  if (user.role === "Admin")
    ListItemContents = [
      ["/beranda", <DashboardIcon className={classes.drawerListItemIcon} />, "Beranda"],
      ["/atur-pengguna", <FaUserCheck className={classes.drawerListItemIcon}/>, "Pengguna Aktif"],
      ["/pending-users", <FaUserClock className={classes.drawerListItemIcon}/>, "Pengguna Pending"],
      [directedTo, <FaChalkboardTeacher className={classes.drawerListItemIcon} />, "Kelas"],
      ["/daftar-mata-pelajaran", <LibraryBooksIcon className={classes.drawerListItemIcon}/>, "Mata Pelajaran"]
      ["/dropbox-connect", <FaDropbox className={classes.drawerListItemIcon}/>, "Dropbox Anda"]
    ]
  else {
    ListItemContents = [
      ["/beranda", <DashboardIcon className={classes.drawerListItemIcon} />, "Beranda"],
      [directedTo, <FaChalkboardTeacher className={classes.drawerListItemIcon} />, "Kelas"],
      ["/daftar-pengumuman", <AnnouncementIcon className={classes.drawerListItemIcon} />,"Pengumuman"],
      ["/daftar-materi", <MenuBookIcon className={classes.drawerListItemIcon}/>, "Materi"],
      ["/daftar-tugas", <AssignmentIcon className={classes.drawerListItemIcon} />, "Tugas"],
      ["/kuis", <FaClipboardList className={classes.drawerListItemIcon} />, "Kuis"],
      ["/kuis", <FaFileSignature className={classes.drawerListItemIcon} />, "Ujian"],
      ["/dropbox-connect", <FaDropbox className={classes.drawerListItemIcon}/>, "Dropbox Anda"]
    ]
  }

  return (
    <List>
      {ListItemContents.map((item) => (
        generateList(item[0],item[1],item[2],item[3]))
      )}
    </List>
  )
};

function SideDrawer(props) {
  const classes = useStyles();
  const theme = useTheme();

  const { desktopOpen, mobileOpen, handleDrawerMobile } = props
  const { user } = props.auth;

  if (user.name !== undefined) {
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
            <DrawerContent user={user} handleDrawerMobile={handleDrawerMobile}/>
          </Drawer>
        </Hidden>
        <Hidden xsDown implementation="css">
          {/* Desktop = Mini Variant Drawer */}
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
            <DrawerContent user={user} />
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

SideDrawer.propTypes = {
  auth: PropTypes.object.isRequired,
}

const mapStateToProps = (state) => ({
  auth: state.auth,
})

export default connect(
  mapStateToProps
) (SideDrawer);
