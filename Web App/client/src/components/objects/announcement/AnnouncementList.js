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
  deleteAnnouncement,
} from "../../../actions/AnnouncementActions";
import { getUsers } from "../../../actions/UserActions";
import Empty from "../../misc/empty/Empty";
import DeleteDialog from "../../misc/dialog/DeleteDialog";
import LightTooltip from "../../misc/light-tooltip/LightTooltip";
import { TabPanel } from "../../misc/tab-panel/TabPanel";
import AnnouncementItem from "../item/AnnouncementItem";
import {
  Avatar,
  Divider,
  Fab,
  Grid,
  Hidden,
  InputAdornment,
  IconButton,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Menu,
  MenuItem,
  Paper,
  Snackbar,
  Tab,
  Tabs,
  TableSortLabel,
  TextField,
  Typography,
} from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";
import {
  AccountCircle as AccountCircleIcon,
  Announcement as AnnouncementIcon,
  ArrowBack as ArrowBackIcon,
  Clear as ClearIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Pageview as PageviewIcon,
  Search as SearchIcon,
  Sort as SortIcon,
} from "@material-ui/icons";
import { makeStyles } from "@material-ui/core/styles";

function createData(
  sender_icon,
  author_name,
  announcementtitle,
  _id,
  createdAt,
  name_lowcased
) {
  return {
    sender_icon,
    author_name,
    announcementtitle,
    _id,
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
    classes,
    role,
    mine,
    order,
    orderBy,
    onRequestSort,
    searchFilter,
    updateSearchFilter,
    setSearchBarFocus,
    searchBarFocus,
  } = props;

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
      id: "announcementtitle",
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
  ];

  // Sort Menu
  const [anchorEl, setAnchorEl] = React.useState(null);
  const handleOpenSortMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleCloseSortMenu = () => {
    setAnchorEl(null);
  };

  // Search Filter
  const onChange = (e) => {
    updateSearchFilter(e.target.value);
  };
  const onClear = (e, id) => {
    updateSearchFilter("");
    // document.getElementById(id).focus();
  };

  return (
    <div className={classes.toolbar}>
      <Grid container justify="space-between" alignItems="center">
        {(role === "Teacher" || "Admin") && mine ? (
          <Grid item>
            <Hidden smDown>
              <Link to="/buat-pengumuman">
                <Fab
                  variant="extended"
                  size="large"
                  className={classes.createAnnouncementButton}
                >
                  <AnnouncementIcon
                    className={classes.createAnnouncementIconDesktop}
                  />
                  Buat Pengumuman
                </Fab>
              </Link>
            </Hidden>
            <Hidden mdUp>
              <LightTooltip title="Buat Pengumuman">
                <Link to="/buat-pengumuman">
                  <Fab
                    size="medium"
                    className={classes.createAnnouncementButton}
                  >
                    <AnnouncementIcon
                      className={classes.createAnnouncementIconMobile}
                    />
                  </Fab>
                </Link>
              </LightTooltip>
            </Hidden>
          </Grid>
        ) : null}
        <Grid item xs>
          <Grid container justify="flex-end" alignItems="center" spacing={1}>
            <Grid item>
              <Hidden smDown>
                <TextField
                  variant="outlined"
                  id="searchFilterDesktop"
                  placeholder="Cari Pengumuman"
                  value={searchFilter}
                  onChange={onChange}
                  onClick={() => setSearchBarFocus(true)}
                  onBlur={() => setSearchBarFocus(false)}
                  InputProps={{
                    style: {
                      borderRadius: "22.5px",
                      maxWidth: "450px",
                      width: "100%",
                    },
                    startAdornment: (
                      <InputAdornment
                        position="start"
                        style={{ marginRight: "-5px", color: "grey" }}
                      >
                        <SearchIcon />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment
                        position="end"
                        style={{ marginLeft: "-10px" }}
                      >
                        <IconButton
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            onClear(e, "searchFilterDesktop");
                          }}
                          style={{
                            visibility: !searchFilter ? "hidden" : "visible",
                          }}
                        >
                          <ClearIcon />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Hidden>
              <Hidden mdUp>
                {searchBarFocus ? (
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
                      autoFocus
                      variant="outlined"
                      id="searchFilterMobile"
                      placeholder="Cari Pengumuman"
                      value={searchFilter}
                      onChange={onChange}
                      onClick={(e) => setSearchBarFocus(true)}
                      InputProps={{
                        style: {
                          borderRadius: "22.5px",
                          maxWidth: "450px",
                          width: "100%",
                        },
                        endAdornment: (
                          <InputAdornment
                            position="end"
                            style={{ marginLeft: "-10px" }}
                          >
                            <IconButton
                              size="small"
                              onClick={(e) => {
                                e.stopPropagation();
                                onClear(e, "searchFilterMobile");
                              }}
                              style={{
                                visibility: !searchFilter
                                  ? "hidden"
                                  : "visible",
                              }}
                            >
                              <ClearIcon />
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </div>
                ) : (
                  <LightTooltip title="Cari Pengumuman">
                    <IconButton onClick={() => setSearchBarFocus(true)}>
                      <SearchIcon />
                    </IconButton>
                  </LightTooltip>
                )}
              </Hidden>
            </Grid>
            <Grid item>
              <LightTooltip title="Urutkan Pengumuman">
                <IconButton onClick={handleOpenSortMenu}>
                  <SortIcon />
                </IconButton>
              </LightTooltip>
              <Menu
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleCloseSortMenu}
                anchorEl={anchorEl}
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
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
}

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
    author_role,
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
      if (Object.keys(kelas).length > 0 || user.kelas === undefined) {
        title = "Pengumuman dari Ketua Kelas";
      }
      // Object.keys(kelas).length === 0 means that class is not finished loading.
      // It is done like this so that the title doesn't change from "class president" (when it is loaded) into "mine" (after it has finished loading),
      // The title will be empty when the class is not yet loaded.
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
      id: "announcementtitle",
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
  ];

  // Sort Menu
  const [anchorEl, setAnchorEl] = React.useState(null);
  const handleOpenSortMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleCloseSortMenu = () => {
    setAnchorEl(null);
  };

  // Search Filter
  const onChange = (e) => {
    updateSearchFilter(e.target.value);
  };

  const onClear = (e, id) => {
    updateSearchFilter("");
    // document.getElementById(id).focus();
  };

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
          {searchBarFocus ? (
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
                autoFocus
                fullWidth
                variant="outlined"
                id={author_role}
                placeholder="Cari Pengumuman"
                value={searchFilter}
                onChange={onChange}
                onClick={(e) => setSearchBarFocus(true)}
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
                        <SearchIcon />
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
                <SearchIcon className={classes.goSearchIconMobile} />
              </IconButton>
            </LightTooltip>
          )}
        </Hidden>
      </div>
      <div style={{ display: "flex" }}>
        <Hidden smDown implementation="css">
          <TextField
            variant="outlined"
            id={author_role}
            placeholder="Cari Pengumuman"
            value={searchFilter}
            onChange={onChange}
            onClick={() => setSearchBarFocus(true)}
            onBlur={() => setSearchBarFocus(false)}
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
                    <SearchIcon />
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
                    className={classes.createAnnouncementButton}
                  >
                    <AnnouncementIcon
                      className={classes.createAnnouncementIconMobile}
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
                  className={classes.createAnnouncementButton}
                >
                  <AnnouncementIcon
                    className={classes.createAnnouncementIconDesktop}
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

function AnnouncementListItems(props) {
  const { rows, classes, order, orderBy, mine, handleOpenDeleteDialog } = props;

  return (
    <Grid container direction="column" spacing={2}>
      {rows.length === 0 ? (
        <Empty />
      ) : (
        stableSort(rows, getComparator(order, orderBy)).map((row, index) => {
          //agar bisa menambahkan elemen <Link> berdasarkan kondisi
          let content = (
            <ListItem className={classes.listItem}>
              <Hidden smUp implementation="css">
                <ListItemText
                  primary={
                    <Typography variant="subtitle1" color="textPrimary">
                      {row.announcementtitle}
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
                        {row.announcementtitle}
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
                  mine ? (
                    <Grid container spacing={1} justify="flex-end">
                      <Grid item>
                        <LightTooltip title="Lihat Lebih Lanjut">
                          <Link to={`/pengumuman/${row._id}`}>
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
                          <Link to={`/sunting-pengumuman/${row._id}`}>
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
                                row._id,
                                row.announcementtitle
                              );
                              console.log(row._id);
                            }}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </LightTooltip>
                      </Grid>
                    </Grid>
                  ) : (
                    <Typography variant="body2" color="textSecondary">
                      {moment(row.createdAt).locale("id").format("DD MMM YYYY")}
                    </Typography>
                  )
                }
                secondary={
                  mine
                    ? null
                    : moment(row.createdAt).locale("id").format("HH.mm")
                }
              />
            </ListItem>
          );
          return (
            <Grid key={row.createdAt} item>
              <Paper variant="outlined">
                {mine ? (
                  content
                ) : (
                  <Link to={`/pengumuman/${row._id}`}>{content}</Link>
                )}
              </Paper>
            </Grid>
          );
        })
      )}
    </Grid>
  );
}

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
    // If all_assessments is not undefined or an empty array
    if (
      Array.isArray(selectedAnnouncements) &&
      retrieved_users &&
      adminAnnouncements
    ) {
      let newRows = [];
      if (mine) {
        if (author_role === "Student") {
          // untuk pengumuman yg dibuat oleh saya sebagai ketua kelas
          selectedAnnouncements
            .filter(
              (item) =>
                item.author_id === kelas.ketua_kelas &&
                item.title.toLowerCase().includes(searchFilter.toLowerCase())
            )
            .forEach((data) => {
              announcementRowItem(newRows, data);
            });
        } else if (author_role === "Teacher") {
          // untuk pengumuman yg dibuat oleh saya sebagai guru
          selectedAnnouncements
            .filter(
              (item) =>
                item.author_id !== kelas.ketua_kelas &&
                item.title.toLowerCase().includes(searchFilter.toLowerCase())
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
            .filter(
              (item) =>
                item.author_id === kelas.ketua_kelas &&
                item.title.toLowerCase().includes(searchFilter.toLowerCase())
            )
            .forEach((data) => {
              announcementRowItem(newRows, data);
            });
        } else if (author_role === "Teacher") {
          // untuk pengumuman yg diberikan oleh guru kepada saya sebagai murid
          selectedAnnouncements
            .filter(
              (item) =>
                item.author_id !== kelas.ketua_kelas &&
                item.title.toLowerCase().includes(searchFilter.toLowerCase())
            )
            .forEach((data) => {
              announcementRowItem(newRows, data);
            });
        } else if (author_role === "Admin") {
          adminAnnouncements
            .filter(
              (item) =>
                item.to.includes(user.role) &&
                item.title.toLowerCase().includes(searchFilter.toLowerCase())
            )
            .forEach((data) => {
              announcementRowItem(newRows, data);
            });
        }
      }
      setRows(newRows);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    adminAnnouncements,
    retrieved_users,
    selectedAnnouncements,
    searchFilter,
  ]);

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
};

const useStyles = makeStyles((theme) => ({
  root: {
    margin: "auto",
    padding: "20px",
    paddingTop: "25px",
    maxWidth: "80%",
    [theme.breakpoints.down("md")]: {
      maxWidth: "100%",
    },
  },
  header: {
    marginBottom: "25px",
  },
  headerIcon: {
    backgroundColor: theme.palette.primary.main,
    color: "white",
    fontSize: "20px",
  },
  announcementTabs: {
    borderBottom: "1px solid rgba(0, 0, 0, 0.12)",
  },
  announcementTabTitle: {
    alignSelf: "flex-start",
  },
  toolbar: {
    padding: "16px 0px",
    marginBottom: "15px",
  },
  createAnnouncementButton: {
    boxShadow:
      "0px 1px 2px 0px rgba(194,100,1,0.3), 0px 2px 6px 2px rgba(194,100,1,0.15)",
    backgroundColor: theme.palette.success.main,
    color: "white",
    "&:focus, &:hover": {
      backgroundColor: theme.palette.success.main,
      color: "white",
    },
  },
  createAnnouncementIconDesktop: {
    width: "25px",
    height: "25px",
    marginRight: "8px",
  },
  createAnnouncementIconMobile: {
    width: "25px",
    height: "25px",
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
    padding: "6px 16px",
  },
  assignmentLate: {
    backgroundColor: theme.palette.primary.main,
  },
  announcementPanelSummary: {
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
  const {
    getAnnouncement,
    getUsers,
    setCurrentClass,
    getAdminAnnouncements,
    deleteAnnouncement,
  } = props;
  const { user, retrieved_users } = props.auth;
  const { kelas } = props.classesCollection;
  const { selectedAnnouncements, adminAnnouncements } = props.announcements;

  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("subject");

  const [tabValue, setTabValue] = React.useState(0);
  const handleChangeTab = (event, newValue) => {
    setTabValue(newValue);
  };

  const [openDeleteDialog, setOpenDeleteDialog] = React.useState(null);
  const [selectedAnnouncementId, setSelectedAnnouncementId] = React.useState(
    null
  );
  const [
    selectedAnnouncementName,
    setSelectedAnnouncementName,
  ] = React.useState(null);

  const [searchFilter, updateSearchFilter] = React.useState("");
  const [searchBarFocus, setSearchBarFocus] = React.useState(false);
  const [openDeleteSnackbar, setOpenDeleteSnackbar] = React.useState(false);

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

  const handleOpenDeleteSnackbar = () => {
    setOpenDeleteSnackbar(true);
  };

  const handleCloseDeleteSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenDeleteSnackbar(false);
  };

  const onDeleteAnnouncement = (id) => {
    deleteAnnouncement(id).then((res) => {
      if (user.role === "Teacher") {
        getAnnouncement(user._id, "by_author");
        getAdminAnnouncements(user.unit);
      } else if (user.role === "Student") {
        getAnnouncement(user.kelas, "by_class");
        getAdminAnnouncements(user.unit);
        setCurrentClass(user.kelas);
      } else if (user.role === "Admin") {
        console.log("RUN II");
        getAnnouncement(user._id, "by_author");
      }
      handleCloseDeleteDialog();
      handleOpenDeleteSnackbar();
    });
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
    // ini diperlukan untuk user role admin karena pada user role admin,
    // AnnouncementListItems akan langsung ditampilkan tanpa AnnouncementSubList,
    // sedangkan AnnouncementListItems tidak memfilter announcement dengan searchFilter.
    if (
      user.role === "Admin" &&
      Array.isArray(selectedAnnouncements) &&
      retrieved_users
    ) {
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
    if (user.role === "Teacher") {
      getAnnouncement(user._id, "by_author");
      getAdminAnnouncements(user.unit);
      // setAnnIsRetrieved(true);
    } else if (user.role === "Student") {
      getAnnouncement(user.kelas, "by_class");
      getAdminAnnouncements(user.unit);
      setCurrentClass(user.kelas);
      // setAnnIsRetrieved(true);
    } else if (user.role === "Admin") {
      getAnnouncement(user._id, "by_author");
      // setAnnIsRetrieved(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    let author_id_set = new Set();
    if (user.role === "Admin") {
      if (Array.isArray(selectedAnnouncements)) {
        selectedAnnouncements.forEach((ann) => {
          author_id_set.add(ann.author_id);
        });
        getUsers(Array.from(author_id_set));
      }
    } else {
      if (Array.isArray(selectedAnnouncements)) {
        selectedAnnouncements.forEach((ann) => {
          author_id_set.add(ann.author_id);
        });
      }
      if (Array.isArray(adminAnnouncements)) {
        adminAnnouncements.forEach((ann) => {
          author_id_set.add(ann.author_id);
        });
      }
      getUsers(Array.from(author_id_set));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedAnnouncements, adminAnnouncements]);

  let propsToPass = {
    retrieved_users,
    selectedAnnouncements,
    adminAnnouncements,
    kelas,
    classes,
    user,
  };

  document.title = "Schooly | Daftar Pengumuman";

  return (
    <div className={classes.root}>
      <Grid
        container
        alignItems="center"
        spacing={2}
        className={classes.header}
      >
        <Grid item>
          <Avatar variant="rounded" className={classes.headerIcon}>
            <AnnouncementIcon />
          </Avatar>
        </Grid>
        <Grid item>
          <Typography variant="h5" align="left">
            Pengumuman
          </Typography>
        </Grid>
      </Grid>
      <Tabs
        indicatorColor="primary"
        textColor="primary"
        value={tabValue}
        onChange={handleChangeTab}
        className={classes.announcementTabs}
      >
        <Tab
          label={
            <Typography className={classes.announcementTabTitle}>
              Masuk
            </Typography>
          }
        />
        <Tab
          label={
            <Typography className={classes.announcementTabTitle}>
              Dari Saya
            </Typography>
          }
        />
      </Tabs>
      <TabPanel value={tabValue} index={0}>
        <AnnouncementListToolbar
          classes={classes}
          user={user}
          order={order}
          orderBy={orderBy}
          onRequestSort={handleRequestSort}
          searchFilter={searchFilter}
          updateSearchFilter={updateSearchFilter}
          setSearchBarFocus={setSearchBarFocus}
          searchBarFocus={searchBarFocus}
        />
        {rows.length === 0 ? (
          <Empty />
        ) : (
          /* - Masih belum oke, belum disesuain itemnya untuk guru bisa edit dll (konek dengan option menu),
          belum kepisah yang mana masuk dengan yang mana dari dia (tabpanel selanjutnya)
          - Isi subprimary textnya bakal author name buat tab yang ini, tab yang dari dia ga usah isi.
          - Belum apply yang ketua kelas buat di toolbarnya juga
          - Kalau murid biasa (full penerima doang) mau bikin ga pake tab
           */
          <Grid container direction="column" spacing={2}>
            {stableSort(rows, getComparator(order, orderBy)).map(
              (row, index) => {
                return (
                  <AnnouncementItem
                    link={`/materi/${row._id}`}
                    primaryText={row.announcementtitle}
                    subPrimaryText={row.author_name}
                    secondaryText={moment(row.createdAt)
                      .locale("id")
                      .format("DD MMM YYYY")}
                    subSecondaryText={moment(row.createdAt)
                      .locale("id")
                      .format("HH.mm")}
                  />
                );
              }
            )}
          </Grid>
        )}
      </TabPanel>
      <TabPanel value={tabValue} index={1}>
        <AnnouncementListToolbar
          classes={classes}
          user={user}
          mine={true}
          order={order}
          orderBy={orderBy}
          onRequestSort={handleRequestSort}
          searchFilter={searchFilter}
          updateSearchFilter={updateSearchFilter}
          setSearchBarFocus={setSearchBarFocus}
          searchBarFocus={searchBarFocus}
        />
        {rows.length === 0 ? (
          <Empty />
        ) : (
          /* Masih belum oke, belum disesuain itemnya untuk guru bisa edit dll */
          <Grid container direction="column" spacing={2}>
            {stableSort(rows, getComparator(order, orderBy)).map(
              (row, index) => {
                return (
                  <AnnouncementItem
                    link={`/materi/${row._id}`}
                    primaryText={row.announcementtitle}
                    subPrimaryText={row.author_name}
                    secondaryText={moment(row.createdAt)
                      .locale("id")
                      .format("DD MMM YYYY")}
                    subSecondaryText={moment(row.createdAt)
                      .locale("id")
                      .format("HH.mm")}
                  />
                );
              }
            )}
          </Grid>
        )}
      </TabPanel>

      {/* Mau dihapus */}
      {user.role === "Admin" ? (
        <AnnouncementListItems
          order={order}
          orderBy={orderBy}
          rows={rows}
          classes={classes}
          mine={true}
          handleOpenDeleteDialog={handleOpenDeleteDialog}
        />
      ) : user.role === "Teacher" ? (
        <>
          <AnnouncementSubList
            {...propsToPass}
            mine={true}
            author_role="Teacher"
            handleOpenDeleteDialog={handleOpenDeleteDialog}
          />
          <AnnouncementSubList
            {...propsToPass}
            mine={false}
            author_role="Admin"
          />
        </>
      ) : user.role === "Student" ? (
        <>
          <AnnouncementSubList
            {...propsToPass}
            mine={user._id === kelas.ketua_kelas}
            author_role="Student"
            handleOpenDeleteDialog={handleOpenDeleteDialog}
          />
          <AnnouncementSubList
            {...propsToPass}
            mine={false}
            author_role="Teacher"
          />
          <AnnouncementSubList
            {...propsToPass}
            mine={false}
            author_role="Admin"
          />
        </>
      ) : null}

      <DeleteDialog
        openDeleteDialog={openDeleteDialog}
        handleCloseDeleteDialog={handleCloseDeleteDialog}
        itemType="Pengumuman"
        itemName={selectedAnnouncementName}
        deleteItem={() => {
          onDeleteAnnouncement(selectedAnnouncementId);
        }}
      />
      <Snackbar
        open={openDeleteSnackbar}
        autoHideDuration={4000}
        onClose={(event, reason) => {
          handleCloseDeleteSnackbar(event, reason);
        }}
      >
        <Alert
          variant="filled"
          severity="success"
          onClose={(event, reason) => {
            handleCloseDeleteSnackbar(event, reason);
          }}
        >
          Pengumuman berhasil dihapus
        </Alert>
      </Snackbar>
    </div>
  );
}

AnnouncementList.propTypes = {
  auth: PropTypes.object.isRequired,
  setCurrentClass: PropTypes.func.isRequired,
  getUsers: PropTypes.func.isRequired,
  announcements: PropTypes.object.isRequired,
  getAnnouncement: PropTypes.func.isRequired,
  getAllAnnouncements: PropTypes.func.isRequired,
  getAdminAnnouncements: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  classesCollection: state.classesCollection,
  announcements: state.announcementsCollection,
});

export default connect(mapStateToProps, {
  setCurrentClass,
  getUsers,
  getAnnouncement,
  getAllAnnouncements,
  getAdminAnnouncements,
  deleteAnnouncement,
})(AnnouncementList);
