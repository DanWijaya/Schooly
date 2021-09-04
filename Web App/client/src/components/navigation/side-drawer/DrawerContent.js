import React from "react";
import { Link } from "react-router-dom";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Tooltip from "@material-ui/core/Tooltip";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import AnnouncementIcon from "@material-ui/icons/Announcement";
import AssessmentIcon from "@material-ui/icons/Assessment";
import AssignmentIcon from "@material-ui/icons/AssignmentOutlined";
import DashboardIcon from "@material-ui/icons/DashboardOutlined";
import EventNoteIcon from "@material-ui/icons/EventNote";
import LibraryBooksIcon from "@material-ui/icons/LibraryBooks";
import MenuBookIcon from "@material-ui/icons/MenuBook";
import { BsClipboardData } from "react-icons/bs";
import { FaChalkboardTeacher, FaClipboardList, FaUserCheck, FaUserClock } from "react-icons/fa";

const useStyles = makeStyles((theme) => ({
  drawerListItem: {
    "&:active, &:hover": {
      backgroundColor: theme.palette.primary.fade,
    },
  },
  drawerListItemIcon: {
    width: "22.5px",
    height: "22.5px",
  },
}));

function DrawerContent(props) {
  const classes = useStyles();
  const { user, handleDrawerMobile } = props;

  const generateList = (linkto, icon, itemText) => {
    return (
      <Link to={linkto} onClick={handleDrawerMobile}>
        <Tooltip title={itemText} placement="right" enterDelay={300}>
          <ListItem button className={classes.drawerListItem}>
            <ListItemIcon>{icon}</ListItemIcon>
            <ListItemText
              primary={<Typography color="textPrimary">{itemText}</Typography>}
            />
          </ListItem>
        </Tooltip>
      </Link>
    );
  };

  let classLink;
  if (user !== undefined) {
    if (user.role === "Student") {
      classLink = `/kelas/${user.kelas}`;
    } else {
      classLink = "/daftar-kelas";
    }
  }

  let ListItemContents;
  if (user.role === "Admin")
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
        "/kalender",
        <EventNoteIcon className={classes.drawerListItemIcon} />,
        "Kalender",
      ],
      [
        classLink,
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
    ];
  else if (user.role === "Teacher") {
    ListItemContents = [
      [
        "/beranda",
        <DashboardIcon className={classes.drawerListItemIcon} />,
        "Beranda",
      ],
      [
        "/kalender",
        <EventNoteIcon className={classes.drawerListItemIcon} />,
        "Kalender",
      ],
      [
        classLink,
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
    ];
  } else if (user.role === "Student") {
    ListItemContents = [
      [
        "/beranda",
        <DashboardIcon className={classes.drawerListItemIcon} />,
        "Beranda",
      ],
      [
        "/kalender",
        <EventNoteIcon className={classes.drawerListItemIcon} />,
        "Kalender",
      ],
      [
        classLink,
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
    ];
  }

  return (
    <div>
      <List>
        {ListItemContents.map((item) =>
          generateList(item[0], item[1], item[2])
        )}
      </List>
    </div>
  );
}

export default DrawerContent;
