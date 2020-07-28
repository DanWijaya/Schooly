import React from "react"
import { Link } from "react-router-dom"
import { connect } from "react-redux";
import clsx from "clsx";
import PropTypes from "prop-types";
import { Divider, Drawer, Hidden, List, ListItem, ListItemIcon, ListItemText, Toolbar, Typography } from "@material-ui/core";
import { makeStyles, withStyles, useTheme } from "@material-ui/core/styles";
import AboutIcon from "@material-ui/icons/Info";
import AssignmentIcon from "@material-ui/icons/AssignmentOutlined";
import AnnouncementIcon from "@material-ui/icons/Announcement";
import DashboardIcon from "@material-ui/icons/DashboardOutlined";
import HelpIcon from "@material-ui/icons/Help";
import MenuBookIcon from "@material-ui/icons/MenuBook";
import { FaChalkboardTeacher, FaUserCheck, FaUserClock, FaDropbox  } from "react-icons/fa";
import { GrNotes, GrDocumentPerformance } from "react-icons/gr";
import LibraryBooksIcon from '@material-ui/icons/LibraryBooks';

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
  drawerListItemMuiIcons: {
    width: theme.spacing(2.70),
    height: theme.spacing(2.70),
  },
  drawerListItemReactIconsFa: {
    width: theme.spacing(2.5),
    height: theme.spacing(2.5),
  },
  nested: {
    paddingLeft: theme.spacing(4),
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

  const generateList = (linkto, icon, itemText1, itemText2, isDisabled, subheader=false) => {
    if (!isDisabled && linkto) {
      return(
          <Link to={linkto} onClick={handleDrawerMobile}>
            <StyledListItem button disabled={isDisabled}>
              <ListItemIcon>
                {icon}
              </ListItemIcon>
              <ListItemText
                primary={<Typography color="textPrimary">{itemText1}</Typography>}
                secondary={itemText2}
              />
            </StyledListItem>
          </Link>
      )
    }
    else {
      return(
          <StyledListItem button disabled={isDisabled}>
            <ListItemIcon>
              {icon}
            </ListItemIcon>
            <ListItemText
              primary={<Typography color="textPrimary">{itemText1}</Typography>}
              secondary={itemText2}
            />
          </StyledListItem>
      )
    }
  }

  /* directedTo is for the page that is directed when clicking the classIcon in NavBarContents*/
  let directedTo;
  if (user !== undefined) {
    if (user.role === "Student")
      directedTo = `/kelas/${user.kelas}`
    else
      directedTo = "/daftar-kelas"
  }

  let ListItemContents ;
  if (user.role === "Admin")
    ListItemContents = [
      ["/beranda", <DashboardIcon className={classes.drawerListItemMuiIcons} />, "Beranda", null, false],
      ["/atur-pengguna", <FaUserCheck className={classes.drawerListItemReactIconsFa}/>, "Pengguna Aktif", null, false],
      ["/pending-users", <FaUserClock className={classes.drawerListItemReactIconsFa}/>, "Pengguna Pending", null, false],
      [directedTo, <FaChalkboardTeacher className={classes.drawerListItemReactIconsFa} />, "Kelas", null, false],
      ["/daftar-mata-pelajaran", <LibraryBooksIcon className={classes.drawerListItemMuiIcons}/>, "Mata Pelajaran", null, false],
      ["/dropbox-connect", <FaDropbox className={classes.drawerListItemReactIconsFa}/>, "Dropbox Anda", null, false]
    ]
  else {
    ListItemContents = [
      ["/beranda", <DashboardIcon className={classes.drawerListItemMuiIcons} />, "Beranda", null, false],
      [directedTo, <FaChalkboardTeacher className={classes.drawerListItemReactIconsFa} />, "Kelas", null, false],
      ["/daftar-pengumuman", <AnnouncementIcon className={classes.drawerListItemMuiIcons} />,"Pengumuman", null, false],
      ["/daftar-materi", <MenuBookIcon className={classes.drawerListItemMuiIcons}/>, "Materi", null, false],
      ["/daftar-tugas", <AssignmentIcon className={classes.drawerListItemMuiIcons} />, "Tugas", null, false],
      ["/dropbox-connect", <FaDropbox className={classes.drawerListItemReactIconsFa}/>, "Dropbox Anda", null, false],
      [null, <GrNotes className={classes.drawerListItemReactIconsFa} />, "Kuis", "Coming Soon", true],
      [null, <GrDocumentPerformance className={classes.drawerListItemReactIconsFa} />, "Ujian", "Coming Soon", true],
    ]
  }

  return(
    <div>
      <List>
        {ListItemContents.map((item) => (
          generateList(item[0],item[1],item[2],item[3],item[4]))
        )}
      </List>
      <Divider />
      <List>
        {generateList("/bantuan", <HelpIcon className={classes.drawerListItemMuiIcons} />,  "Bantuan", null, false)}
        {generateList("/tentang-schooly", <AboutIcon className={classes.drawerListItemMuiIcons} />,  "Tentang Schooly", null, false)}
      </List>
    </div>
  )
};

function SideDrawer(props) {
  const classes = useStyles();
  const theme = useTheme();

  const { desktopOpen, mobileOpen, handleDrawerMobile } = props
  const { user } = props.auth;

  if (user.name !== undefined) {
    return(
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
    return(
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