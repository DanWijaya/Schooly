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

function AnnouncementListToolbar(props) {
  const {
    user,
    classes,
    order,
    orderBy,
    onRequestSort,
    searchFilter,
    updateSearchFilter,
    setSearchBarFocus,
    searchBarFocus,
  } = props;

  const isAdmin = (user.role === "Admin");
  const title = "Daftar Pengumuman";

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

  return (
    <div className={classes.toolbar}>
      <div style={{ display: "flex", alignItems: "center" }}>
        {/* mobile view */}
        <Hidden mdUp implementation="css">
          {(isAdmin && searchBarFocus) ?
            null
            :
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <AnnouncementIcon className={classes.titleIcon} fontSize="large" />
              <Typography variant="h4">{title}</Typography>
            </div>
          }
        </Hidden>
        {/* desktop view */}
        <Hidden smDown implementation="css">
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <AnnouncementIcon className={classes.titleIcon} fontSize="large" />
            <Typography variant="h4">{title}</Typography>
          </div>
        </Hidden>
        {isAdmin ? (
          // mobile view
          <Hidden mdUp implementation="css">
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
                            // id="searchFilterMobile"
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
        ) : null}
      </div>
      <div style={{ display: "flex", visibility: isAdmin ? null : "hidden" }}>
        <>
          <Hidden smDown implementation="css">
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
          <div style={{ display: "flex", alignItems: "center" }}>
            {/* mobile view */}
            <Hidden mdUp implementation="css">
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
            <Hidden smDown implementation="css">
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
                onClick={createSortHandler(headCell.id)}
              >
                <TableSortLabel
                  active={orderBy === headCell.id}
                  direction={orderBy === headCell.id ? order : "asc"}
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
      </div>
    </div>
  );
}

AnnouncementListToolbar.propTypes = {
  classes: PropTypes.object.isRequired,
  order: PropTypes.oneOf(["asc", "desc"]).isRequired,
  orderBy: PropTypes.string.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  searchFilter: PropTypes.string,
  updateSearchFilter: PropTypes.func,
  setSearchBarFocus: PropTypes.func,
  searchBarFocus: PropTypes.bool
};

function AnnouncementListSubToolbar(props) {
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
    mine,
    author_role
  } = props;

  let title;
  if (mine) {
    title = "Pengumuman dari Saya";
  } else {
    if (author_role === "Admin") {
      title = "Pengumuman dari Pengelola";
    } else if (author_role === "Teacher") {
      title = "Pengumuman dari Guru";
    } else if (author_role === "Student") {
      if ((Object.keys(kelas).length > 0) || (user.kelas === undefined)) {
        title = "Pengumuman dari Ketua Kelas";
      }
      // Object.keys(kelas).length === 0 berarti kelas belum selesai dimuat.
      // agar judul tidak berganti dari "ketua kelas" (saat kelas belum dimuat) menjadi "saya" (setelah kelas dimuat),
      // judul saat kelas belum dimuat dibuat kosong.
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
        <Hidden mdUp implementation="css">
          {!searchBarFocus ? (
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Typography variant="h5">{title}</Typography>
            </div>
          ) : null}
        </Hidden>
        {/* desktop view */}
        <Hidden smDown implementation="css">
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Typography variant="h5">{title}</Typography>
          </div>
        </Hidden>
        <Hidden mdUp implementation="css">
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
                  id={author_role}
                  value={searchFilter}
                  onChange={onChange}
                  autoFocus
                  onClick={(e) => setSearchBarFocus(true)}
                  placeholder="Cari Pengumuman"
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
                          onClick={(e) => {
                            e.stopPropagation();
                            onClear(e, author_role);
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
                <LightTooltip title="Search" style={{ marginLeft: "10px" }}>
                  <IconButton
                    className={classes.goSearchButton}
                    onClick={() => setSearchBarFocus(true)}
                  >
                    <GoSearch className={classes.goSearchIconMobile} />
                  </IconButton>
                </LightTooltip>
              )
          }
        </Hidden>
      </div>
      <div style={{ display: "flex" }}>
        <Hidden smDown implementation="css">
          <TextField
            variant="outlined"
            id={author_role}
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
                      onClear(e, author_role);
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
        {mine ? (
          <div style={{ display: "flex", alignItems: "center" }}>
            {/* mobile view */}
            <Hidden mdUp implementation="css">
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
            <Hidden smDown implementation="css">
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
              onClick={createSortHandler(headCell.id)}
            >
              <TableSortLabel
                active={orderBy === headCell.id}
                direction={orderBy === headCell.id ? order : "asc"}
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
      </div>
    </div>
  );
}

AnnouncementListSubToolbar.propTypes = {
  classes: PropTypes.object.isRequired,
  kelas: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  order: PropTypes.oneOf(["asc", "desc"]).isRequired,
  orderBy: PropTypes.string.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  searchFilter: PropTypes.string.isRequired,
  updateSearchFilter: PropTypes.func.isRequired,
  setSearchBarFocus: PropTypes.func.isRequired,
  searchBarFocus: PropTypes.bool.isRequired,
  mine: PropTypes.bool.isRequired,
  author_role: PropTypes.string.isRequired
};

function AnnouncementListItems(props) {
  const {
    rows,
    classes,
    order,
    orderBy,
    mine,
    handleOpenDeleteDialog,
    addBottomMargin
  } = props;

  return (
    <Grid container direction="column" spacing={2} style={{ marginBottom: addBottomMargin ? "32px" : "0" }}>
      {rows.length === 0 ? (
        <Typography variant="subtitle1" align="center" color="textSecondary">
          Kosong
        </Typography>
      ) : (
          stableSort(rows, getComparator(order, orderBy)).map((row, index) => {
            //agar bisa menambahkan elemen <Link> berdasarkan kondisi
            let content = (
              <ListItem
                className={classes.listItem}
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
                <ListItemText
                  align="right"
                  primary={
                    mine ?
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
                    mine ?
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
                  {mine ? content
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
  classes: PropTypes.object.isRequired,
  order: PropTypes.oneOf(["asc", "desc"]).isRequired,
  orderBy: PropTypes.string.isRequired,
  rows: PropTypes.object.isRequired,
  mine: PropTypes.bool.isRequired,
  handleOpenDeleteDialog: PropTypes.func,
  addBottomMargin: PropTypes.bool.isRequired
};

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
    layout isi halaman announcementlist untuk akun:
      admin:
      1. pengumuman yg saya buat
      guru:
      1. pengumuman yg saya buat
      2. pengumuman yg diberi oleh admin
      murid:
      1. pengumuman yg ketua kelas buat
      2. pengumuman yg diberi oleh guru
      3. pengumuman yg diberi oleh admin
    */

    // If all_assessments is not undefined or an empty array
    if (selectedAnnouncements.length && retrieved_users.size) {
      let newRows = [];

      if (mine) {
        if (author_role === "Student") {
          // untuk pengumuman yg dibuat oleh saya sebagai ketua kelas 
          selectedAnnouncements
            .filter((item) =>
              (item.author_id === kelas.ketua_kelas) && item.title.toLowerCase().includes(searchFilter.toLowerCase())
            )
            .forEach((data) => {
              announcementRowItem(newRows, data);
            });
        } else if (author_role === "Teacher") {
          // untuk pengumuman yg dibuat oleh saya sebagai guru 
          selectedAnnouncements
            .filter((item) =>
              (item.author_id !== kelas.ketua_kelas) && item.title.toLowerCase().includes(searchFilter.toLowerCase())
            )
            .forEach((data) => {
              announcementRowItem(newRows, data);
            });
        } else if (author_role === "Admin") {
          // untuk pengumuman yg dibuat oleh saya sebagai admin 
          selectedAnnouncements
            .filter((item) =>
              item.title.toLowerCase().includes(searchFilter.toLowerCase())
            )
            .forEach((data) => {
              announcementRowItem(newRows, data);
            });
        }
      } else {
        if (author_role === "Student") {
          // untuk pengumuman yg diberikan oleh ketua kelas kepada saya sebagai murid (saya bukan ketua kelas)
          selectedAnnouncements
            .filter((item) =>
              (item.author_id === kelas.ketua_kelas) && item.title.toLowerCase().includes(searchFilter.toLowerCase())
            )
            .forEach((data) => {
              announcementRowItem(newRows, data);
            });
        } else if (author_role === "Teacher") {
          // untuk pengumuman yg diberikan oleh guru kepada saya sebagai murid
          selectedAnnouncements
            .filter((item) =>
              (item.author_id !== kelas.ketua_kelas) && item.title.toLowerCase().includes(searchFilter.toLowerCase())
            )
            .forEach((data) => {
              announcementRowItem(newRows, data);
            });
        } else if (author_role === "Admin") {
         let isTargeted;
         if (user.role === "Student") {
          // untuk pengumuman yg diberikan oleh admin kepada saya sebagai murid
          isTargeted = (target) => (target !== "Teacher");
         } else if (user.role === "Teacher") {
          // untuk pengumuman yg diberikan oleh admin kepada saya sebagai guru
          isTargeted = (target) => (target !== "Student");
         }
          // atribut "to" pada model "Announcement" memiliki 3 range value: "Student", "Teacher", atau "Teacher_Student"
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
      <AnnouncementListSubToolbar
        kelas={kelas}
        user={user}
        classes={classes}
        order={order}
        orderBy={orderBy}
        onRequestSort={handleRequestSort}
        searchFilter={searchFilter}
        updateSearchFilter={updateSearchFilter}
        setSearchBarFocus={setSearchBarFocus}
        searchBarFocus={searchBarFocus}
        mine={mine}
        author_role={author_role}
      />
      <Divider variant="inset" className={classes.subTitleDivider} />
      <AnnouncementListItems
        order={order}
        orderBy={orderBy}
        rows={rows}
        classes={classes}
        mine={mine}
        handleOpenDeleteDialog={handleOpenDeleteDialog}
        addBottomMargin={addBottomMargin}
      />
    </>
  );
}

AnnouncementSubList.propTypes = {
  classes: PropTypes.object.isRequired,
  kelas: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  mine: PropTypes.bool.isRequired,
  author_role: PropTypes.string.isRequired,
  handleOpenDeleteDialog: PropTypes.func,
  addBottomMargin: PropTypes.bool.isRequired
};

const useStyles = makeStyles((theme) => ({
  root: {
    margin: "auto",
    maxWidth: "80%",
    [theme.breakpoints.down("md")]: {
        maxWidth: "100%",
    },
    padding: "10px",
  },
  toolbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  subTitleDivider: {
    marginTop: "15px",
    marginBottom: "15px",
  },
  titleDivider: {
    backgroundColor: theme.palette.primary.main,
    marginTop: "15px",
    marginBottom: "32px",
  },
  adminTitleDivider: {
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
  listItem: {
    padding: "6px 16px"
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

  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [])
  
  React.useEffect(() => {
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
        user={user}
        classes={classes}
        order={order}
        orderBy={orderBy}
        onRequestSort={handleRequestSort}
        searchFilter={searchFilter}
        updateSearchFilter={updateSearchFilter}
        setSearchBarFocus={setSearchBarFocus}
        searchBarFocus={searchBarFocus}
      />
      <Divider variant="inset" className={(user.role === "Admin") ? classes.adminTitleDivider: classes.titleDivider} />
      {
        (user.role === "Admin") ?
          <AnnouncementListItems
            order={order}
            orderBy={orderBy}
            rows={rows}
            classes={classes}
            mine={true}
            handleOpenDeleteDialog={handleOpenDeleteDialog}
            addBottomMargin={true}
          />
          : (user.role === "Teacher") ?
            <>
              <AnnouncementSubList
                {...propsToPass}
                mine={true}
                author_role={"Teacher"}
                addBottomMargin={true}
                handleOpenDeleteDialog={handleOpenDeleteDialog}
                />
              <AnnouncementSubList
                {...propsToPass}
                mine={false}
                author_role="Admin"
                addBottomMargin={false}
              />
            </>
            : (user.role === "Student") ?
              <>
                <AnnouncementSubList
                  {...propsToPass}
                  mine={(user._id === kelas.ketua_kelas)}
                  author_role="Student"
                  addBottomMargin={true}
                  handleOpenDeleteDialog={handleOpenDeleteDialog}
                />
                <AnnouncementSubList
                  {...propsToPass}
                  mine={false}
                  author_role="Teacher"
                  addBottomMargin={true}
                  />
                <AnnouncementSubList
                  {...propsToPass}
                  mine={false}
                  author_role="Admin"
                  addBottomMargin={false}
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
