import React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import moment from "moment";
import "moment/locale/id";
import { setCurrentClass } from "../../../actions/ClassActions";
import {
  getAllAnnouncements,
  getAnnouncement,
  getAdminAnnouncements,
  deleteAnnouncement
} from "../../../actions/AnnouncementActions";
import { getUsers } from "../../../actions/UserActions";
import LightTooltip from "../../misc/light-tooltip/LightTooltip";
import {
  Divider,
  Fab,
  Grid,
  Hidden,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Paper,
  Typography,
  TextField,
  InputAdornment,
  IconButton,
  Menu,
  MenuItem,
  TableSortLabel,
  Avatar
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import AnnouncementIcon from "@material-ui/icons/Announcement";
import SortIcon from "@material-ui/icons/Sort";
import { GoSearch } from "react-icons/go";
import ClearIcon from "@material-ui/icons/Clear";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import PageviewIcon from "@material-ui/icons/Pageview";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import DeleteDialog from "../../misc/dialog/DeleteDialog";

// function createData(sender_icon, author_name, notification_title, notification_link, date, time, complete_date, name_lowcased) {
//   return { sender_icon, author_name, notification_title, notification_link, date, time, complete_date, name_lowcased };
// }
function createData(
  sender_icon,
  author_name,
  notification_title,
  // notification_link,
  notification_id,
  createdAt,
  name_lowcased
) {
  return {
    sender_icon,
    author_name,
    notification_title,
    // notification_link,
    notification_id,
    createdAt,
    name_lowcased,
  };
}
function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

// ANCHOR f ListToolbar
function AnnouncementListToolbar(props) {
  const {
    kelas,
    user,
    classes,
    order,
    orderBy,
    onRequestSort,
    searchFilter,
    updateSearchFilter,
    setSearchBarFocus,
    searchBarFocus,
    showCreateButton,
    showSortAndSearchButton,
    mine,
    author_role
  } = props;

  const isAdmin = (user.role === "Admin");

  let title;
  if (isAdmin) {
    title = "Daftar Pengumuman";
  } else {
    if (!showSortAndSearchButton) {
      title = "Daftar Pengumuman";
    } else {
      if (mine) {
        title = "Pengumuman dari Saya";
      } else {
        if (author_role === "Admin") {
          title = "Pengumuman dari Pengelola";
        } else if (author_role === "Teacher") {
          title = "Pengumuman dari Guru";
        } else if ((author_role === "Student")) {
          if ((Object.keys(kelas).length > 0) || (user.kelas === undefined)) {
            title = "Pengumuman dari Ketua Kelas";
          }
          // Object.keys(kelas).length === 0 berarti kelas belum selesai dimuat. jika kelas belum ada, mine akan bernilai false.
          // agar judul tidak berganti dari "ketua kelas" (saat kelas belum dimuat) menjadi "saya" (setelah kelas dimuat),
          // judul saat kelas belum dimuat dibuat kosong.
        }
      }
    }
  }


  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  const headCells = [
    {
      id: "author_name",
      numeric: false,
      disablePadding: true,
      label: "Nama Pembuat",
    },
    {
      id: "notification_title",
      numeric: false,
      disablePadding: false,
      label: "Judul Pengumuman",
    },
    {
      id: "createdAt",
      numeric: false,
      disablePadding: false,
      label: "Waktu Dibuat",
    },
    // { id: "name_lowcased", numeric: false, disablePadding: false, label: "Waktu Ditugaskan" },
  ];

  // if (role === "Student") {
  // Don't include the class_assigned basically.
  // headCells.pop()
  // }

  // Sort Menu
  const [anchorEl, setAnchorEl] = React.useState(null);
  const handleOpenSortMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleCloseSortMenu = () => {
    setAnchorEl(null);
  };

  // FOR SEARCH FILTER.
  const onChange = (e) => {
    updateSearchFilter(e.target.value);
  };

  const onClear = (e, id) => {
    updateSearchFilter("");
    document.getElementById(id).focus();
  };

  // const canAnnounce = () => {
  //   console.log(user.role);
  //   if (Object.keys(kelas).length > 0) {
  //     return user._id === kelas.ketua_kelas;
  //   }
  //   return user.role === "Teacher" || isAdmin;
  // };

  return (
    <div className={classes.toolbar}>
      <div style={{ display: "flex", alignItems: "center" }}>
        {/* mobile view */}
        <Hidden smUp implementation="css">
          {(isAdmin && !searchBarFocus) || (!isAdmin && !showSortAndSearchButton) || (!isAdmin && showSortAndSearchButton && !searchBarFocus) ? (
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Typography variant="h4">{title}</Typography>
            </div>
          ) : null}
        </Hidden>
        {/* desktop view */}
        <Hidden xsDown implementation="css">
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            {showSortAndSearchButton && !isAdmin ?
              <Typography variant="h5">{title}</Typography>
              :
              <>
                <AnnouncementIcon className={classes.titleIcon} fontSize="large" />
                <Typography variant="h4">{title}</Typography>
              </>
            }
          </div>
        </Hidden>
        {!showSortAndSearchButton && !isAdmin ? null : (
        // mobile view
        <Hidden smUp implementation="css">
          {
            searchBarFocus ? (
              <div style={{ display: "flex" }}>
                <IconButton
                  onClick={() => {
                    setSearchBarFocus(false);
                    updateSearchFilter("");
                  }}
                >
                  <ArrowBackIcon />
                </IconButton>
                <TextField
                  fullWidth
                  variant="outlined"
                  id="searchFilterMobile"
                  value={searchFilter}
                  onChange={onChange}
                  autoFocus
                  onClick={(e) => setSearchBarFocus(true)}
                  placeholder="Cari Pengumuman"
                  // onBlur={() => setSearchBarFocus(false)}
                  style={{
                    maxWidth: "200px",
                    marginLeft: "10px",
                  }}
                  InputProps={{
                    startAdornment: searchBarFocus ? null : (
                      <InputAdornment
                        position="start"
                        style={{ marginLeft: "-5px", marginRight: "-5px" }}
                      >
                        <IconButton size="small">
                          <GoSearch />
                        </IconButton>
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment
                        position="end"
                        style={{ marginLeft: "-10px", marginRight: "-10px" }}
                      >
                        <IconButton
                          size="small"
                          id="searchFilterMobile"
                          onClick={(e) => {
                            e.stopPropagation();
                            onClear(e, "searchFilterMobile");
                          }}
                          style={{
                            opacity: 0.5,
                            visibility: !searchFilter ? "hidden" : "visible",
                          }}
                        >
                          <ClearIcon />
                        </IconButton>
                      </InputAdornment>
                    ),
                    style: {
                      borderRadius: "22.5px",
                    },
                  }}
                />
              </div>
            ) : (
              // <div style={{display: "flex"}}>
              <LightTooltip title="Search" style={{ marginLeft: "10px" }}>
                <IconButton
                  className={classes.goSearchButton}
                  onClick={() => setSearchBarFocus(true)}
                >
                  <GoSearch className={classes.goSearchIconMobile} />
                </IconButton>
              </LightTooltip>
            )
            // </div>
          }
        </Hidden>
        )}
      </div>
      <div style={{ display: "flex" }}>
        {!showSortAndSearchButton && !isAdmin ? null : (
        // desktop view
        <Hidden xsDown implementation="css">
          <TextField
            // fullWidth
            variant="outlined"
            id="searchFilterDesktop"
            value={searchFilter}
            onChange={onChange}
            onClick={() => setSearchBarFocus(true)}
            onBlur={() => setSearchBarFocus(false)}
            placeholder="Cari Pengumuman"
            // onBlur={() => setSearchBarFocus(false)}
            style={{
              maxWidth: "250px",
              marginRight: "10px",
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment
                  position="start"
                  style={{ marginLeft: "-5px", marginRight: "-5px" }}
                >
                  <IconButton size="small">
                    <GoSearch />
                  </IconButton>
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment
                  position="end"
                  style={{ marginLeft: "-10px", marginRight: "-10px" }}
                >
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      onClear(e, "searchFilterDesktop");
                    }}
                    style={{
                      opacity: 0.5,
                      visibility: !searchFilter ? "hidden" : "visible",
                    }}
                  >
                    <ClearIcon />
                  </IconButton>
                </InputAdornment>
              ),
              style: {
                borderRadius: "22.5px",
              },
            }}
          />
        </Hidden>
        )}
        {showSortAndSearchButton && showCreateButton ? (
          <div style={{ display: "flex", alignItems: "center" }}>
            {/* mobile view */}
            <Hidden smUp implementation="css">
              <LightTooltip title="Buat Pengumuman">
                <Link to="/buat-pengumuman">
                  <Fab
                    size="small"
                    className={classes.newAnnouncementButton}
                  >
                    <AnnouncementIcon
                      className={classes.newAnnouncementIconMobile}
                    />
                  </Fab>
                </Link>
              </LightTooltip>
            </Hidden>
            {/* desktop view */}
            <Hidden xsDown implementation="css">
              <Link to="/buat-pengumuman">
                <Fab
                  variant="extended"
                  size="medium"
                  className={classes.newAnnouncementButton}
                >
                  <AnnouncementIcon
                    className={classes.newAnnouncementIconDesktop}
                  />
                  Buat Pengumuman
                </Fab>
              </Link>
            </Hidden>
          </div>
        ) : null}
        {!showSortAndSearchButton && !isAdmin ? null :
          <>
            <LightTooltip title="Urutkan Pengumuman">
              <IconButton
                onClick={handleOpenSortMenu}
                className={classes.sortButton}
              >
                <SortIcon />
              </IconButton>
            </LightTooltip>
            <Menu
              keepMounted
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleCloseSortMenu}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "right",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
            >
              {headCells.map((headCell, i) => (
                <MenuItem
                  key={headCell.id}
                  sortDirection={orderBy === headCell.id ? order : false}
                >
                  <TableSortLabel
                    active={orderBy === headCell.id}
                    direction={orderBy === headCell.id ? order : "asc"}
                    onClick={createSortHandler(headCell.id)}
                  >
                    {headCell.label}
                    {orderBy === headCell.id ? (
                      <span className={classes.visuallyHidden}>
                        {order === "desc"
                          ? "sorted descending"
                          : "sorted ascending"}
                      </span>
                    ) : null}
                  </TableSortLabel>
                </MenuItem>
              ))}
            </Menu>
          </>
        }
      </div>
    </div>
  );
}

AnnouncementListToolbar.propTypes = {
  classes: PropTypes.object.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(["asc", "desc"]).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
  showCreateButton: PropTypes.bool.isRequired,
  showSortAndSearchButton: PropTypes.bool.isRequired,
  mine: PropTypes.bool,
  author_role: PropTypes.string
};

// ANCHOR f ListItems
function AnnouncementListItems(props) {
  const {
    rows,
    classes,
    order,
    orderBy,
    showButtons,
    handleOpenDeleteDialog,
    addBottomMargin
  } = props;

  return (
    <Grid container direction="column" spacing={2} style={{ marginBottom: addBottomMargin ? "75px" : "0" }}>
      {rows.length === 0 ? (
        <Typography variant="subtitle1" align="center" color="textSecondary">
          Kosong
        </Typography>
      ) : (
          stableSort(rows, getComparator(order, orderBy)).map((row, index) => {
            //agar bisa menambahkan elemen <Link> berdasarkan kondisi
            let content = (
              <ListItem
                button={!showButtons}
                // component="a"
                className={classes.announcementListItem}
              >
                <Hidden smUp implementation="css">
                  <ListItemText
                    primary={
                      <Typography variant="subtitle1" color="textPrimary">
                        {row.notification_title}
                      </Typography>
                    }
                    secondary={
                      <Typography variant="caption" color="textSecondary">
                        {row.author_name}
                      </Typography>
                    }
                  />
                </Hidden>
                <Hidden xsDown implementation="css">
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <ListItemAvatar>
                      <Avatar className={classes.assignmentLate}>
                        <AnnouncementIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Typography variant="h6" color="textPrimary">
                          {row.notification_title}
                        </Typography>
                      }
                      secondary={
                        <Typography variant="body2" color="textSecondary">
                          {row.author_name}
                        </Typography>
                      }
                    />
                  </div>
                </Hidden>
                {/* ANCHOR elemen button */}
                <ListItemText
                  align="right"
                  primary={
                    showButtons?
                      <Grid container spacing={1} justify="flex-end">
                        <Grid item>
                          <LightTooltip title="Lihat Lebih Lanjut">
                            <Link to={`/pengumuman/${row.notification_id}`}>
                              <IconButton
                                size="small"
                                className={classes.viewMaterialButton}
                              >
                                <PageviewIcon fontSize="small" />
                              </IconButton>
                            </Link>
                          </LightTooltip>
                        </Grid>
                        <Grid item>
                          <LightTooltip title="Sunting">
                            <Link to={`/sunting-pengumuman/${row.notification_id}`}>
                              <IconButton
                                size="small"
                                className={classes.editMaterialButton}
                              >
                                <EditIcon fontSize="small" />
                              </IconButton>
                            </Link>
                          </LightTooltip>
                        </Grid>
                        <Grid item>
                          <LightTooltip title="Hapus">
                            <IconButton
                              size="small"
                              className={classes.deleteMaterialButton}
                              onClick={(e) => {
                                handleOpenDeleteDialog(
                                  e,
                                  row.notification_id,
                                  row.notification_title
                                );
                                console.log(row.notification_id)
                              }}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </LightTooltip>
                        </Grid>
                      </Grid>
                      :
                    <Typography variant="body2" color="textSecondary">
                      {moment(row.createdAt)
                        .locale("id")
                        .format("DD MMM YYYY")}
                    </Typography>
                  }
                  secondary={
                    showButtons ?
                      null
                      :
                      moment(row.createdAt)
                        .locale("id")
                        .format("HH.mm")
                  }
                />
              </ListItem>
            );
            return (
              <Grid key={row.createdAt} item>
                <Paper variant="outlined">
                  {showButtons ? content
                    :
                    <Link to={`/pengumuman/${row.notification_id}`}>
                      {content}
                    </Link>
                  }
                </Paper>
              </Grid>
            )
          })
        )}
    </Grid>
  );
}

AnnouncementListItems.propTypes = {
  order: PropTypes.oneOf(["asc", "desc"]).isRequired,
  orderBy: PropTypes.string.isRequired,
  rows: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired,
  showButtons: PropTypes.bool.isRequired,
  handleOpenDeleteDialog: PropTypes.func.isRequired,
  addBottomMargin: PropTypes.bool.isRequired
};

// FIXME f SubList
function AnnouncementSubList(props) {
  const {
    retrieved_users,
    selectedAnnouncements,
    adminAnnouncements,
    kelas,
    classes,
    user,
    mine,
    author_role,
    showButtons,
    handleOpenDeleteDialog,
    addBottomMargin
  } = props;
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("subject");
  const [searchFilter, updateSearchFilter] = React.useState("");
  const [searchBarFocus, setSearchBarFocus] = React.useState(false);

  const [rows, setRows] = React.useState([]);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const announcementRowItem = (rows, data) => {
    rows.push(
      createData(
        <AccountCircleIcon />,
        !retrieved_users.get(data.author_id)
          ? null
          : retrieved_users.get(data.author_id).name,
        data.title,
        // `/pengumuman/${data._id}`,
        data._id,
        data.createdAt,
        !retrieved_users.get(data.author_id)
          ? null
          : retrieved_users.get(data.author_id).name.toLowerCase()
      )
    );
  };

  React.useEffect(() => {
    /*
      admin:
      - pengumuman yg saya buat
      guru:
      - pengumuman yg saya buat
      - pengumuman yg diberi oleh admin
      murid:
      - pengumuman yg ketua kelas buat
      - pengumuman yg diberi oleh guru
      - pengumuman yg diberi oleh admin
    */

    // If all_assessments is not undefined or an empty array
    if (selectedAnnouncements.length && retrieved_users.size) {
      let newRows = [];

      if (mine) {
        /*
        untuk pengumuman yg dibuat oleh:
        - saya sebagai admin
        - saya sebagai guru
        - saya sebagai ketua kelas
        */
        selectedAnnouncements
          .filter((item) =>
            item.title.toLowerCase().includes(searchFilter.toLowerCase())
          )
          .forEach((data) => {
            announcementRowItem(newRows, data);
          });
      } else {
        if (author_role === "Student") {
          /*
          untuk pengumuman yg dibuat oleh ketua kelas
          */
          selectedAnnouncements
            .filter((item) =>
              (item.author_id === kelas.ketua_kelas) && item.title.toLowerCase().includes(searchFilter.toLowerCase())
            )
            .forEach((data) => {
              announcementRowItem(newRows, data);
            });
        } else if (author_role === "Teacher") {
          /*
          untuk pengumuman yg diberikan oleh guru kepada saya sebagai murid
          */
          selectedAnnouncements
            .filter((item) =>
              (item.author_id !== kelas.ketua_kelas) && item.title.toLowerCase().includes(searchFilter.toLowerCase())
            )
            .forEach((data) => {
              announcementRowItem(newRows, data);
            });
        } else if (author_role === "Admin") {
          /*
          untuk pengumuman yg:
          - diberikan oleh admin kepada saya sebagai guru
          - diberikan oleh admin kepada saya sebagai murid
          */
         let isTargeted;
         if (user.role === "Student") {
          isTargeted = (target) => (target !== "Teacher");
         } else if (user.role === "Teacher") {
          isTargeted = (target) => (target !== "Student");
         }
          // atribut to announcement memiliki 3 range value: Student, Teacher, atau Teacher_Student
          adminAnnouncements
            .filter((item) =>
              isTargeted(item.to) && item.title.toLowerCase().includes(searchFilter.toLowerCase())
            )
            .forEach((data) => {
              announcementRowItem(newRows, data);
            });
        }
      }
      setRows(newRows);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [adminAnnouncements, retrieved_users, selectedAnnouncements, searchFilter]);

  return (
    <>
      <AnnouncementListToolbar
        kelas={kelas}
        user={user}
        classes={classes}
        order={order}
        orderBy={orderBy}
        onRequestSort={handleRequestSort}
        rowCount={rows ? rows.length : 0}
        searchFilter={searchFilter}
        updateSearchFilter={updateSearchFilter}
        setSearchBarFocus={setSearchBarFocus}
        searchBarFocus={searchBarFocus}
        showCreateButton={mine}
        showSortAndSearchButton={true}
        mine={mine}
        author_role={author_role}
      />
      <Divider variant="inset" style={{marginTop: "15px", marginBottom: "15px"}} />
      <AnnouncementListItems
        order={order}
        orderBy={orderBy}
        rows={rows}
        classes={classes}
        showButtons={showButtons}
        handleOpenDeleteDialog={handleOpenDeleteDialog}
        addBottomMargin={addBottomMargin}
      />
    </>
  );
}


const useStyles = makeStyles((theme) => ({
  root: {
    margin: "auto",
    maxWidth: "1000px",
    padding: "10px",
  },
  toolbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  titleDivider: {
    backgroundColor: theme.palette.primary.main,
    marginTop: "15px",
    marginBottom: "15px",
  },
  newAnnouncementButton: {
    marginRight: "10px",
    backgroundColor: theme.palette.success.main,
    color: "white",
    "&:focus, &:hover": {
      backgroundColor: theme.palette.success.main,
      color: "white",
    },
  },
  newAnnouncementIconDesktop: {
    width: theme.spacing(3),
    height: theme.spacing(3),
    marginRight: "7.5px",
  },
  newAnnouncementIconMobile: {
    width: theme.spacing(3),
    height: theme.spacing(3),
  },
  sortButton: {
    backgroundColor: theme.palette.action.selected,
    color: "black",
    "&:focus, &:hover": {
      backgroundColor: theme.palette.divider,
      color: "black",
    },
  },
  visuallyHidden: {
    border: 0,
    clip: "rect(0 0 0 0)",
    height: 1,
    margin: -1,
    overflow: "hidden",
    padding: 0,
    position: "absolute",
    top: 20,
    width: 1,
  },
  announcementListItem: {
    "&:focus, &:hover": {
      backgroundColor: theme.palette.primary.fade,
    },
    padding: "6px 24px"
  },
  titleIcon: {
    fontSize: "28px",
    backgroundColor: "white",
    color: theme.palette.primary.main,
    marginRight: "10px",
  },
  assignmentLate: {
    backgroundColor: theme.palette.primary.main,
  },
  panelSummary: {
    "&:hover": {
      backgroundColor: theme.palette.primary.fade,
    },
  },
  viewMaterialButton: {
    backgroundColor: theme.palette.warning.main,
    color: "white",
    "&:focus, &:hover": {
      backgroundColor: "white",
      color: theme.palette.warning.main,
    },
  },
  editMaterialButton: {
    backgroundColor: theme.palette.primary.main,
    color: "white",
    "&:focus, &:hover": {
      backgroundColor: "white",
      color: theme.palette.primary.main,
    },
  },
  deleteMaterialButton: {
    backgroundColor: theme.palette.error.dark,
    color: "white",
    "&:focus, &:hover": {
      backgroundColor: "white",
      color: theme.palette.error.dark,
    },
  },
}));
// ANCHOR theme

// ANCHOR f AnnouncementList
function AnnouncementList(props) {
  const classes = useStyles();
  const { selectedAnnouncements, adminAnnouncements } = props.announcements;
  const { getAnnouncement, getUsers, setCurrentClass, getAdminAnnouncements, deleteAnnouncement } = props;
  const { kelas } = props.classesCollection;
  const { user, retrieved_users } = props.auth;
  const [annIsRetrieved, setAnnIsRetrieved] = React.useState(false);

  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("subject");

  const [openDeleteDialog, setOpenDeleteDialog] = React.useState(null);
  const [selectedAnnouncementId, setSelectedAnnouncementId] = React.useState(null);
  const [selectedAnnouncementName, setSelectedAnnouncementName] = React.useState(null);

  const [searchFilter, updateSearchFilter] = React.useState("");
  const [searchBarFocus, setSearchBarFocus] = React.useState(false);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  // Delete Dialog
  const handleOpenDeleteDialog = (e, id, name) => {
    e.stopPropagation();
    setOpenDeleteDialog(true);
    setSelectedAnnouncementId(id);
    setSelectedAnnouncementName(name);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
  };

  const onDeleteAnnouncement = (id) => {
    deleteAnnouncement(id);
    console.log(id);
  };

  const [rows, setRows] = React.useState([]);
  // var rows = [];
  const announcementRowItem = (rows, data) => {
    rows.push(
      createData(
        <AccountCircleIcon />,
        !retrieved_users.get(data.author_id)
          ? null
          : retrieved_users.get(data.author_id).name,
        data.title,
        // `/pengumuman/${data._id}`,
        data._id,
        // (moment(data.date_announced).locale("id").format("DD MMM YYYY")),
        // (moment(data.date_announced).locale("id").format("HH.mm")),
        // (moment(data.date_announced).locale("id")),
        data.createdAt,
        !retrieved_users.get(data.author_id)
          ? null
          : retrieved_users.get(data.author_id).name.toLowerCase()
      )
    );
  };

  // const retrieveAnnouncements = () => {
  //   // If all_assessments is not undefined or an empty array
  //   if (selectedAnnouncements.length) {
  //     rows = [];
  //     selectedAnnouncements
  //       .filter((item) =>
  //         item.title.toLowerCase().includes(searchFilter.toLowerCase())
  //       )
  //       .forEach((data) => {
  //         if (data) {
  //           console.log(data);
  //         }
  //         announcementRowItem(data);
  //       });
  //   }
  // };

  // ANCHOR retrieveAnnouncements
  React.useEffect(() => {
    // retrieveAnnouncements();
    if (selectedAnnouncements.length && retrieved_users.size) {
      let newRows = [];
      selectedAnnouncements
        .filter((item) =>
          item.title.toLowerCase().includes(searchFilter.toLowerCase())
        )
        .forEach((data) => {
          announcementRowItem(newRows, data);
        });
      setRows(newRows);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [retrieved_users, selectedAnnouncements, searchFilter]);

  // ANCHOR getAnnouncement
  // retrieved users ini bulk request, dapat data user"nya satu"
  React.useEffect(() => {
    if (user.role === "Teacher" && !annIsRetrieved) {
      getAnnouncement(user._id, "by_author");
      getAdminAnnouncements();
      setAnnIsRetrieved(true);
    } else if (user.role === "Student" && !annIsRetrieved) {
      getAnnouncement(user.kelas, "by_class");
      getAdminAnnouncements();
      setCurrentClass(user.kelas);
      setAnnIsRetrieved(true);
    } else if (user.role === "Admin" && !annIsRetrieved) {
      getAnnouncement(user._id, "by_author");
      setAnnIsRetrieved(true);
    }

    let author_id_set = new Set();
    if (user.role === "Admin") {
      if (selectedAnnouncements.length) {
        selectedAnnouncements.forEach((ann) => { author_id_set.add(ann.author_id) });
        getUsers(Array.from(author_id_set));
      }
    } else {
      if (selectedAnnouncements.length && adminAnnouncements.length) {
        adminAnnouncements.forEach((ann) => { author_id_set.add(ann.author_id) });
        selectedAnnouncements.forEach((ann) => { author_id_set.add(ann.author_id) });
        getUsers(Array.from(author_id_set));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedAnnouncements.length, adminAnnouncements.length]);

  // ini ntah kenapa kalo masukkin selectedAnnouncements di parameter kedua ada error..

  // console.log(selectedAnnouncements);

  document.title = "Schooly | Daftar Pengumuman";
  let propsToPass = {
    retrieved_users,
    selectedAnnouncements,
    adminAnnouncements,
    kelas,
    classes,
    user
  }
  // ANCHOR elemen AnnouncementList
  return (
    <div className={classes.root}>
      <DeleteDialog
        openDeleteDialog={openDeleteDialog}
        handleCloseDeleteDialog={handleCloseDeleteDialog}
        itemType="Pengumuman"
        itemName={selectedAnnouncementName}
        deleteItem={() => {
          onDeleteAnnouncement(selectedAnnouncementId);
        }}
      />
      <AnnouncementListToolbar
        kelas={kelas}
        user={user}
        classes={classes}
        order={order}
        orderBy={orderBy}
        onRequestSort={handleRequestSort}
        rowCount={rows ? rows.length : 0}
        searchFilter={searchFilter}
        updateSearchFilter={updateSearchFilter}
        setSearchBarFocus={setSearchBarFocus}
        searchBarFocus={searchBarFocus}
        showCreateButton={user.role === "Admin"}
        showSortAndSearchButton={user.role === "Admin"}
      />
      <Divider variant="inset"className={classes.titleDivider} />
      {
        (user.role === "Admin") ?
          <AnnouncementListItems
            order={order}
            orderBy={orderBy}
            rows={rows}
            classes={classes}
            showButtons={true}
            handleOpenDeleteDialog={handleOpenDeleteDialog}
            addBottomMargin={true}
          />
          : (user.role === "Teacher") ?
            <>
              <AnnouncementSubList
                {...propsToPass}
                mine={true}
                author_role={null}
                showButtons={true}
                handleOpenDeleteDialog={handleOpenDeleteDialog}
                addBottomMargin={true}
                />
              <AnnouncementSubList
                {...propsToPass}
                mine={false}
                author_role="Admin"
                showButtons={false}
              />
            </>
            : (user.role === "Student") ?
              <>
                <AnnouncementSubList
                  {...propsToPass}
                  // mine={null}
                  mine={(user._id === kelas.ketua_kelas)}
                  author_role="Student"
                  showButtons={(user._id === kelas.ketua_kelas)}
                  handleOpenDeleteDialog={handleOpenDeleteDialog}
                  addBottomMargin={true}
                />
                <AnnouncementSubList
                  {...propsToPass}
                  mine={false}
                  author_role="Teacher"
                  showButtons={false}
                  addBottomMargin={true}
                  />
                <AnnouncementSubList
                  {...propsToPass}
                  mine={false}
                  author_role="Admin"
                  showButtons={false}
                />
              </>
              : null
      }
    </div>
  );
}

AnnouncementList.propTypes = {
  auth: PropTypes.object.isRequired,
  announcements: PropTypes.object.isRequired,
  getAnnouncement: PropTypes.func.isRequired,
  getAllAnnouncements: PropTypes.func.isRequired,
  setCurrentClass: PropTypes.func.isRequired,
  getUsers: PropTypes.func.isRequired,
  getAdminAnnouncements: PropTypes.func.isRequired
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  announcements: state.announcementsCollection,
  classesCollection: state.classesCollection,
});

export default connect(mapStateToProps, {
  getAnnouncement,
  getAllAnnouncements,
  getAdminAnnouncements,
  getUsers,
  setCurrentClass,
  deleteAnnouncement
})(AnnouncementList);
