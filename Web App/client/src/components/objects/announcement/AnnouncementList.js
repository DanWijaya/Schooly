import React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { setCurrentClass } from "../../../actions/ClassActions";
import {
  getAllAnnouncements,
  getAnnouncementByAuthor,
  getAnnouncementByClass,
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
  Fab,
  Grid,
  Hidden,
  InputAdornment,
  IconButton,
  Menu,
  MenuItem,
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
  Search as SearchIcon,
  Sort as SortIcon,
} from "@material-ui/icons";
import { makeStyles } from "@material-ui/core/styles";

function createData(sender_icon, author_id, name, _id, createdAt, author_name) {
  return {
    sender_icon,
    author_id,
    name,
    _id,
    createdAt,
    author_name,
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
      id: "name",
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
}));

function AnnouncementList(props) {
  const classes = useStyles();
  const {
    getAnnouncementByClass,
    getAnnouncementByAuthor,
    getUsers,
    setCurrentClass,
    getAdminAnnouncements,
    deleteAnnouncement,
  } = props;
  const { user, retrieved_users, all_roles } = props.auth;
  const { kelas } = props.classesCollection;
  const {
    announcementsByAuthor,
    announcementsByClass,
    adminAnnouncements,
  } = props.announcements;

  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("subject");

  const [panel, setPanel] = React.useState(0);
  const handleChangeTab = (event, newValue) => {
    setPanel(newValue);
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

  var rows = [];
  const announcementRowItem = (data) => {
    rows.push(
      createData(
        <AccountCircleIcon />,
        data.author_id,
        data.title,
        data._id,
        data.createdAt,
        !retrieved_users.get(data.author_id)
          ? null
          : retrieved_users.get(data.author_id).name
      )
    );
  };

  const retrieveAnnouncements = () => {
    rows = [];
    if (
      Array.isArray(announcementsByAuthor) &&
      Array.isArray(announcementsByClass) &&
      Array.isArray(adminAnnouncements)
    ) {
      let received = [];
      let mine = [];
      if (user.role === "Admin") {
        mine = announcementsByAuthor;
      } else if (user.role === "Student") {
        received = [...announcementsByClass, ...adminAnnouncements];
        mine = announcementsByAuthor;
      } else if (user.role === "Teacher") {
        received = adminAnnouncements;
        mine = announcementsByAuthor;
      }

      if (panel == 0) {
        received
          .filter((item) =>
            item.title.toLowerCase().includes(searchFilter.toLowerCase())
          )
          .map((data) => announcementRowItem(data));
      } else if (panel == 1) {
        mine
          .filter((item) =>
            item.title.toLowerCase().includes(searchFilter.toLowerCase())
          )
          .map((data) => announcementRowItem(data));
      }
    }
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  retrieveAnnouncements();
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
        getAnnouncementByAuthor(user._id);
        getAdminAnnouncements(user.unit);
      } else if (user.role === "Student") {
        getAnnouncementByClass(user.kelas, user._id);
        getAdminAnnouncements(user.unit);
        setCurrentClass(user.kelas);
      } else if (user.role === "Admin") {
        getAnnouncementByAuthor(user._id);
      }
      handleCloseDeleteDialog();
      handleOpenDeleteSnackbar();
    });
    console.log(id);
  };

  const getMyAnnouncement = () => {
    getAnnouncementByAuthor(user._id);
  };

  const getReceivedAnnouncement = () => {
    getAdminAnnouncements(user.unit);
    if (user.role === "Student") {
      getAnnouncementByClass(user.kelas, user._id);
    }
  };
  // retrieved users ini bulk request, dapat data user"nya satu"
  React.useEffect(() => {
    getMyAnnouncement();
    getReceivedAnnouncement();
    if (user.role === all_roles.STUDENT) {
      setCurrentClass(user.kelas);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    let author_id_set = new Set();
    let received = [];
    let mine = [];
    if (user.role === "Admin") {
      mine = announcementsByAuthor;
    } else if (user.role === "Student") {
      received = [...announcementsByClass, ...adminAnnouncements];
      mine = announcementsByAuthor;
    } else if (user.role === "Teacher") {
      received = adminAnnouncements;
    }

    [...mine, ...received].forEach((ann) => {
      author_id_set.add(ann.author_id);
    });
    console.log(author_id_set);
    getUsers(Array.from(author_id_set));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [announcementsByAuthor, announcementsByClass, adminAnnouncements]);

  document.name = "Schooly | Daftar Pengumuman";

  const hasCreatePermission =
    [all_roles.TEACHER, all_roles.ADMIN].includes(user.role) ||
    user._id == kelas.ketua_kelas;

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
        value={panel}
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
        {hasCreatePermission ? (
          <Tab
            label={
              <Typography className={classes.announcementTabTitle}>
                Dari Saya
              </Typography>
            }
          />
        ) : null}
      </Tabs>
      <TabPanel value={panel} index={0}>
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
          <Grid container direction="column" spacing={2}>
            <AnnouncementItem
              data={stableSort(rows, getComparator(order, orderBy))}
              handleOpenDeleteDialog={handleOpenDeleteDialog}
            />
          </Grid>
        )}
      </TabPanel>
      {hasCreatePermission ? (
        <TabPanel value={panel} index={1}>
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
              <AnnouncementItem
                data={stableSort(rows, getComparator(order, orderBy))}
                handleOpenDeleteDialog={handleOpenDeleteDialog}
              />
            </Grid>
          )}
        </TabPanel>
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
  getAnnouncementByClass: PropTypes.func.isRequired,
  getAnnouncementByAuthor: PropTypes.func.isRequired,
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
  getAnnouncementByClass,
  getAnnouncementByAuthor,
  getAllAnnouncements,
  getAdminAnnouncements,
  deleteAnnouncement,
})(AnnouncementList);
