import React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import clsx from "clsx";
import PropTypes from "prop-types";
import {
  Drawer,
  Divider,
  Hidden,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Tooltip,
} from "@material-ui/core";
import { makeStyles, withStyles, useTheme } from "@material-ui/core/styles";
import AssignmentIcon from "@material-ui/icons/AssignmentOutlined";
import AnnouncementIcon from "@material-ui/icons/Announcement";
import AssessmentIcon from "@material-ui/icons/Assessment";
import DashboardIcon from "@material-ui/icons/DashboardOutlined";
import LibraryBooksIcon from "@material-ui/icons/LibraryBooks";
import MenuBookIcon from "@material-ui/icons/MenuBook";
import EventNoteIcon from '@material-ui/icons/EventNote';
import { BsClipboardData } from "react-icons/bs";
// import UnitIcon from '@material-ui/icons/Storage';
import UnitIcon from '@material-ui/icons/Web';
import {
  FaChalkboardTeacher,
  FaClipboardList,
  FaSitemap,
  FaUserCheck,
  FaUserClock,
} from "react-icons/fa";

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
  // dropboxIcon: {
  //   width: theme.spacing(2.7),
  //   height: theme.spacing(2.7),
  //   color: theme.palette.dropbox.main,
  // },
}));

const StyledListItem = withStyles((theme) => ({
  root: {
    "&:active, &:hover": {
      backgroundColor: theme.palette.primary.fade,
    },
  },
}))(ListItem);

function DrawerContent(props) {
  const classes = useStyles();

  const { user, handleDrawerMobile } = props;

  const generateList = (linkto, icon, itemText, subheader = false) => {
    return (
        <Link to={linkto} onClick={handleDrawerMobile}>
          <Tooltip title={itemText} placement="right" enterDelay={300}>
            <StyledListItem button>
              <ListItemIcon>{icon}</ListItemIcon>
              <ListItemText
                primary={<Typography color="textPrimary">{itemText}</Typography>}
              />
            </StyledListItem>
          </Tooltip>
        </Link>
    );
  };

  /* directedTo is for the page that is directed when clicking the classIcon in NavBarContents*/
  let directedTo;
  if (user !== undefined) {
    if (user.role === "Student") {
      directedTo = `/kelas/${user.kelas}`;
    } else {
      directedTo = "/daftar-kelas";
    }
  }

  let ListItemContents;
  if(user.role === "SuperAdmin"){
    ListItemContents = [
      [
        "/beranda",
        <DashboardIcon className={classes.drawerListItemIcon} />,
        "Beranda",
      ],
      [
        "/daftar-unit",
        <UnitIcon className={classes.drawerListItemIcon} />,
        "Unit Sekolah"
      ],
      [
        "/pengelola-tertunda",
        <FaUserClock className={classes.drawerListItemIcon} />,
        "Pengelola Tertunda",
      ],
      [
        "/pengelola-aktif",
        <FaUserCheck className={classes.drawerListItemIcon} />,
        "Pengelola Aktif",
      ],
      [
        "/kalender",
        <EventNoteIcon className={classes.drawerListItemIcon} />,
        "Kalender",
      ]
    ];
  }
  else if (user.role === "Admin"){
    ListItemContents = [
      [
        "/beranda",
        <DashboardIcon className={classes.drawerListItemIcon} />,
        "Beranda",
      ],
      [
        "/pengguna-tidakaktif",
        <FaUserClock className={classes.drawerListItemIcon} />,
        "Pengguna Tertunda",
      ],
      [
        "/atur-pengguna",
        <FaUserCheck className={classes.drawerListItemIcon} />,
        "Pengguna Aktif",
      ],
      [
        directedTo,
        <FaChalkboardTeacher className={classes.drawerListItemIcon} />,
        "Kelas",
      ],
      [
        "/daftar-mata-pelajaran",
        <LibraryBooksIcon className={classes.drawerListItemIcon} />,
        "Mata Pelajaran",
      ],
      [
        "/daftar-pengumuman",
        <AnnouncementIcon className={classes.drawerListItemIcon} />,
        "Pengumuman",
      ],
      [
        "/kalender",
        <EventNoteIcon className={classes.drawerListItemIcon} />,
        "Kalender",
      ]
    ];
  }
  else if (user.role === "Student") {
    ListItemContents = [
      [
        "/beranda",
        <DashboardIcon className={classes.drawerListItemIcon} />,
        "Beranda",
      ],
      // ["/kalender", <EventIcon className={classes.drawerListItemIcon} />,"Kalender"],
      [
        directedTo,
        <FaChalkboardTeacher className={classes.drawerListItemIcon} />,
        "Kelas",
      ],
      [
        "/daftar-pengumuman",
        <AnnouncementIcon className={classes.drawerListItemIcon} />,
        "Pengumuman",
      ],
      [
        "/daftar-materi",
        <MenuBookIcon className={classes.drawerListItemIcon} />,
        "Materi",
      ],
      [
        "/daftar-tugas",
        <AssignmentIcon className={classes.drawerListItemIcon} />,
        "Tugas",
      ],
      [
        "/daftar-kuis",
        <FaClipboardList className={classes.drawerListItemIcon} />,
        "Kuis",
      ],
      [
        "/daftar-ujian",
        <BsClipboardData className={classes.drawerListItemIcon} />,
        "Ujian",
      ],
      [
        `/rapor/${user._id}`,
        <AssessmentIcon className={classes.drawerListItemIcon} />,
        "Rapor",
      ],
      [
        "/kalender",
        <EventNoteIcon className={classes.drawerListItemIcon} />,
        "Kalender",
      ]
    ];
  } else if(user.role === "Teacher"){
    ListItemContents = [
      [
        "/beranda",
        <DashboardIcon className={classes.drawerListItemIcon} />,
        "Beranda",
      ],
      // ["/kalender", <EventIcon className={classes.drawerListItemIcon} />,"Kalender"],
      [
        directedTo,
        <FaChalkboardTeacher className={classes.drawerListItemIcon} />,
        "Kelas",
      ],
      [
        "/daftar-pengumuman",
        <AnnouncementIcon className={classes.drawerListItemIcon} />,
        "Pengumuman",
      ],
      [
        "/daftar-materi",
        <MenuBookIcon className={classes.drawerListItemIcon} />,
        "Materi",
      ],
      [
        "/daftar-tugas",
        <AssignmentIcon className={classes.drawerListItemIcon} />,
        "Tugas",
      ],
      [
        "/daftar-kuis",
        <FaClipboardList className={classes.drawerListItemIcon} />,
        "Kuis",
      ],
      [
        "/daftar-ujian",
        <BsClipboardData className={classes.drawerListItemIcon} />,
        "Ujian",
      ],
      [
        "/rapor/semua",
        <AssessmentIcon className={classes.drawerListItemIcon} />,
        "Rapor",
      ],
      [
        "/kalender",
        <EventNoteIcon className={classes.drawerListItemIcon} />,
        "Kalender",
      ]
    ];
  }
  else{
    ListItemContents = []
  }

  return (
    <div>
      <List>
        {ListItemContents.map((item) =>
          generateList(item[0], item[1], item[2], item[3])
        )}
      </List>
    </div>
  );
}

function SideDrawer(props) {
  const classes = useStyles();
  const theme = useTheme();

  const { desktopOpen, mobileOpen, handleDrawerMobile } = props;
  const { user } = props.auth;

  if (user.name !== undefined) {
    return (
      <div className={classes.drawerMobile}>
        <Hidden mdUp implementation="css">
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
            <DrawerContent
              user={user}
              handleDrawerMobile={handleDrawerMobile}
            />
          </Drawer>
        </Hidden>
        <Hidden smDown implementation="css">
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
    );
  } else {
    return <div style={{ display: "none" }} />;
  }
}

SideDrawer.propTypes = {
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps)(React.memo(SideDrawer));
