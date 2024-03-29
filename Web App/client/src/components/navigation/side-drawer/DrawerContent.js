import React from "react";
import { Link } from "react-router-dom";
import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Tooltip,
  Typography,
} from "@material-ui/core";
import {
  Announcement as AnnouncementIcon,
  Assessment as AssessmentIcon,
  AssignmentOutlined as AssignmentIcon,
  DashboardOutlined as DashboardIcon,
  EventNote as EventNoteIcon,
  LibraryBooks as LibraryBooksIcon,
  MenuBook as MenuBookIcon,
  Settings as SettingsIcon,
  Web as UnitIcon,
} from "@material-ui/icons";
import { makeStyles } from "@material-ui/core/styles";
import { BsClipboardData } from "react-icons/bs";
import { BiSitemap } from "react-icons/bi";
import {
  FaChalkboard,
  FaClipboardList,
  FaUserFriends,
  FaUserLock,
  FaUsersCog,
} from "react-icons/fa";

const useStyles = makeStyles((theme) => ({
  drawerListItem: {
    borderLeft: "4px solid white",
    "&:active, &:hover": {
      backgroundColor: theme.palette.primary.fade,
      borderLeft: `4px solid ${theme.palette.primary.main}`,
    },
  },
  drawerListItemIcon: {
    fontSize: "22.5px",
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
  if (user.role === "SuperAdmin") {
    ListItemContents = [
      [
        "/beranda",
        <DashboardIcon className={classes.drawerListItemIcon} />,
        "Beranda",
      ],
      [
        "/daftar-unit",
        <UnitIcon className={classes.drawerListItemIcon} />,
        "Unit Sekolah",
      ],
      [
        "/pengelola-aktif",
        <FaUsersCog className={classes.drawerListItemIcon} />,
        "Pengelola Aktif",
      ],
      [
        "/pengelola-tertunda",
        <FaUserLock className={classes.drawerListItemIcon} />,
        "Pengelola Tertunda",
      ],
      [
        "/data-unit-pengelola",
        <BiSitemap className={classes.drawerListItemIcon} />,
        "Data Unit Pengelola",
      ],
      [
        "/pengaturan",
        <SettingsIcon className={classes.drawerListItemIcon} />,
        "Pengaturan",
      ],
    ];
  } else if (user.role === "Admin")
    ListItemContents = [
      [
        "/beranda",
        <DashboardIcon className={classes.drawerListItemIcon} />,
        "Beranda",
      ],
      [
        "/pengguna-aktif",
        <FaUserFriends className={classes.drawerListItemIcon} />,
        "Pengguna Aktif",
      ],
      [
        "/pengguna-tidakaktif",
        <FaUserLock className={classes.drawerListItemIcon} />,
        "Pengguna Tidak Aktif",
      ],
      [
        "/data-ajar-guru",
        <BiSitemap className={classes.drawerListItemIcon} />,
        "Data Ajar Guru",
      ],
      [
        "/kalender",
        <EventNoteIcon className={classes.drawerListItemIcon} />,
        "Kalender",
      ],
      [
        classLink,
        <FaChalkboard className={classes.drawerListItemIcon} />,
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
        <FaChalkboard className={classes.drawerListItemIcon} />,
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
        <FaChalkboard className={classes.drawerListItemIcon} />,
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
