import React, { createContext, useContext } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import {
  deleteUser,
  bulkDeleteUser,
  setUserActive,
  bulkSetUserActive,
  getAllPendingAdmins,
} from "../../../actions/UserActions";
import { getMultipleFileAvatar } from "../../../actions/files/FileAvatarActions";
import ActivateDialog from "../../misc/dialog/ActivateDialog";
import DeleteDialog from "../../misc/dialog/DeleteDialog";
import OptionMenu from "../../utils/option-menu/OptionMenu";
import Empty from "../../misc/empty/Empty";
import {
  Avatar,
  Checkbox,
  Divider,
  Grid,
  Hidden,
  IconButton,
  InputAdornment,
  List,
  ListItem,
  ListItemIcon,
  ListItemAvatar,
  ListItemSecondaryAction,
  ListItemText,
  Menu,
  MenuItem,
  Snackbar,
  TableSortLabel,
  TextField,
  Tooltip,
  Typography,
} from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";
import {
  CheckBox as CheckBoxIcon,
  CheckBoxOutlineBlank as CheckBoxOutlineBlankIcon,
  Clear as ClearIcon,
  IndeterminateCheckBox as IndeterminateCheckBoxIcon,
  Search as SearchIcon,
  Sort as SortIcon,
} from "@material-ui/icons";
import { makeStyles } from "@material-ui/core/styles";
import { FaUserLock } from "react-icons/fa";

function createData(
  _id,
  avatar,
  name,
  email,
  phone,
  emergency_phone,
  tanggal_lahir,
  address,
  action
) {
  return {
    _id,
    avatar,
    name,
    email,
    phone,
    emergency_phone,
    tanggal_lahir,
    address,
    action,
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

const ManageAdminsContext = createContext(null);

function ManagePendingAdminsToolbar(props) {
  const { searchFilterHint } = props;
  const {
    classes,
    order,
    orderBy,
    onRequestSort,
    role,
    rowCount,
    listCheckbox,
    selectAllData,
    deSelectAllData,
    handleOpenActivateDialog,
    handleOpenDeleteDialog,
    setSearchBarFocus,
    searchBarFocus,
    searchFilter,
    setSearchFilter,
  } = useContext(ManageAdminsContext);

  const disabledCheckbox = rowCount === 0;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property, role);
  };

  const headCells = [
    {
      id: "name",
      numeric: false,
      disablePadding: true,
      label: "Nama",
    },
    {
      id: "email",
      numeric: false,
      disablePadding: false,
      label: "Email",
    },
    {
      id: "phone",
      numeric: true,
      disablePadding: false,
      label: "Nomor Telepon",
    },
    {
      id: "tanggal_lahir",
      numeric: false,
      disablePadding: false,
      label: "Tanggal Lahir",
    },
    {
      id: "address",
      numeric: false,
      disablePadding: false,
      label: "Alamat",
    },
    {
      id: "emergency_phone",
      numeric: false,
      disablePadding: false,
      label: "Nomor Telepon Darurat",
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

  const onChange = (e) => {
    setSearchFilter(e.target.value);
  };

  const onClear = (e) => {
    setSearchFilter("");
  };

  return (
    <div className={classes.toolbar}>
      <Grid container>
        <Grid item xs container alignItems="center" spacing={1}>
          <Grid item>
            {listCheckbox.length === 0 ? (
              <IconButton
                onClick={() => selectAllData(role)}
                disabled={disabledCheckbox}
              >
                <CheckBoxOutlineBlankIcon style={{ color: "grey" }} />
              </IconButton>
            ) : listCheckbox.length === rowCount ? (
              <IconButton onClick={deSelectAllData} disabled={disabledCheckbox}>
                <CheckBoxIcon className={classes.checkboxIcon} />
              </IconButton>
            ) : (
              <IconButton onClick={deSelectAllData} disabled={disabledCheckbox}>
                <IndeterminateCheckBoxIcon className={classes.checkboxIcon} />
              </IconButton>
            )}
          </Grid>
          <Grid item>
            <OptionMenu
              actions={["Aktifkan", "Hapus"]}
              handleActionOnClick={[
                handleOpenActivateDialog,
                handleOpenDeleteDialog,
              ]}
              disabled={listCheckbox.length === 0}
            />
          </Grid>
        </Grid>
        <Grid
          item
          xs
          container
          justify="flex-end"
          alignItems="center"
          spacing={1}
        >
          <Grid item>
            <Hidden smDown>
              <TextField
                variant="outlined"
                size="small"
                id="searchFilterDesktop"
                placeholder={searchFilterHint}
                value={searchFilter}
                onChange={onChange}
                autoFocus={searchFilter.length > 0}
                InputProps={{
                  style: {
                    borderRadius: "22.5px",
                    maxWidth: "450px",
                    paddingTop: "3px",
                    paddingBottom: "3px"
                  },
                  startAdornment: (
                    <InputAdornment
                      position="start"
                      style={{ color: "grey" }}
                    >
                      <SearchIcon />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          onClear(e);
                          setSearchBarFocus(false);
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
              {searchBarFocus || searchFilter ? (
                <TextField
                  autoFocus
                  variant="outlined"
                  size="small"
                  id="searchFilterMobile"
                  placeholder={searchFilterHint}
                  value={searchFilter}
                  onChange={onChange}
                  onClick={(e) => {
                    setSearchBarFocus(true);
                  }}
                  InputProps={{
                    style: {
                      borderRadius: "22.5px",
                      maxWidth: "450px",
                      paddingTop: "3px",
                      paddingBottom: "3px"
                    },
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          size="small"
                          id="searchFilterMobile"
                          onClick={(e) => {
                            e.stopPropagation();
                            onClear(e);
                            setSearchBarFocus(false);
                          }}
                        >
                          <ClearIcon />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              ) : (
                <Tooltip title="Cari Akun">
                  <IconButton onClick={() => setSearchBarFocus(true)}>
                    <SearchIcon />
                  </IconButton>
                </Tooltip>
              )}
            </Hidden>
          </Grid>
          <Hidden smDown>
            <Grid item>
              <Tooltip title="Urutkan Akun">
                <IconButton onClick={handleOpenSortMenu}>
                  <SortIcon />
                </IconButton>
              </Tooltip>
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
          </Hidden>
          <Hidden mdUp>
            {searchBarFocus || searchFilter ? null : (
              // When search bar is not on focus and searchFilter is empty.
              <Grid item>
                <Tooltip title="Urutkan Akun">
                  <IconButton onClick={handleOpenSortMenu}>
                    <SortIcon />
                  </IconButton>
                </Tooltip>
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
            )}
          </Hidden>
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
  userList: {
    padding: "0px",
  },
  toolbar: {
    padding: "16px",
  },
  accountItem: {
    color: "black",
    "&:focus, &:hover": {
      boxShadow:
        "0px 2px 3px 0px rgba(60,64,67,0.30), 0px 2px 8px 2px rgba(60,64,67,0.15)",
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
  checkboxIcon: {
    color: theme.palette.primary.main,
  },
}));

function ManagePendingAdmins(props) {
  const classes = useStyles();
  const {
    setUserActive,
    bulkSetUserActive,
    deleteUser,
    bulkDeleteUser,
    getMultipleFileAvatar,
    getAllPendingAdmins,
  } = props;
  const { pending_admins, user, all_roles } = props.auth;

  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("name");
  const [openDeleteDialog, setOpenDeleteDialog] = React.useState(null);
  const [openActivateDialog, setOpenActivateDialog] = React.useState(null);
  const [selectedUserId, setSelectedUserId] = React.useState(null);
  const [selectedUserName, setSelectedUserName] = React.useState(null);
  const [searchFilter, setSearchFilter] = React.useState("");
  const [searchBarFocus, setSearchBarFocus] = React.useState(false);

  // List Checkbox
  const [listCheckbox, setListCheckbox] = React.useState([]);
  const [booleanCheckbox, setBooleanCheckbox] = React.useState([]);

  // Snackbar
  const [openSnackbar, setOpenSnackbar] = React.useState(false);
  const [snackbarMessage, setSnackbarMessage] = React.useState("");

  // Avatars
  const [avatarJSON, setAvatarJSON] = React.useState({});
  let rows = [];
  let currentListBoolean;

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnackbar(false);
  };

  const handleOpenSnackbar = (message) => {
    setOpenSnackbar(true);
    setSnackbarMessage(message);
  };

  const handleChangeListStudent = (e, index, row) => {
    // Handle the check of Checkboxes.
    e.stopPropagation();
    e.preventDefault();
    let currentBooleanList = booleanCheckbox;
    currentBooleanList[index] = !currentBooleanList[index];
    setBooleanCheckbox([...currentBooleanList]);

    // Handle the list of chosen accounts.
    let currentCheckboxList = listCheckbox;
    let data = row._id;

    const idxToFound = listCheckbox.indexOf(data);
    if (idxToFound !== -1) {
      currentCheckboxList.splice(idxToFound, 1);
    } else {
      currentCheckboxList.push(data);
    }
    setListCheckbox([...currentCheckboxList]);
  };

  const selectAllData = () => {
    let allData = [];
    let booleanAllData = [];
    rows.forEach((admin) => {
      allData.push(admin._id);
      booleanAllData.push(true);
    });
    setListCheckbox(allData);
    setBooleanCheckbox(booleanAllData);
  };

  const deSelectAllData = (type) => {
    let booleanAllData = [];
    rows.forEach(() => {
      booleanAllData.push(false);
    });
    setListCheckbox([]);
    setBooleanCheckbox(booleanAllData);
  };

  const userRowItem = (data) => {
    let temp = createData(
      data._id,
      data.avatar,
      data.name,
      data.email,
      data.phone,
      data.emergency_phone,
      data.tanggal_lahir,
      data.address
    );
    rows.push(temp);
  };

  React.useEffect(() => {
    const fetchAllData = async () => {
      if (user.role === all_roles.SUPERADMIN) {
        const admins = await getAllPendingAdmins();

        setBooleanCheckbox(admins.map(() => false));

        let allUsersId = admins.map((user) => user._id);
        getMultipleFileAvatar(allUsersId).then((result) => {
          setAvatarJSON(result);
        });
      }
    };

    fetchAllData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const retrieveUsers = () => {
    rows = [];
    currentListBoolean = [];

    if (Array.isArray(pending_admins)) {
      pending_admins
        .filter(
          (item) =>
            item.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
            item.email.toLowerCase().includes(searchFilter.toLowerCase())
        )
        .forEach((data) => {
          userRowItem(data);
          currentListBoolean.push(false);
        });
    }
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  // Call the function to get the classes from DB.
  // this function is defined above.
  retrieveUsers();

  const onDeleteUser = async (id) => {
    if (Array.isArray(id)) {
      await bulkDeleteUser(id);
    } else {
      await deleteUser(id);
    }
    const admins = await getAllPendingAdmins();
    setListCheckbox([]);
    setBooleanCheckbox(admins.map(() => false));
    handleOpenSnackbar("Pengelola berhasil dihapus");
    handleCloseDeleteDialog();
  };

  const onActivateUser = async (id) => {
    if (Array.isArray(id)) {
      // If it is a lists, deactivate in bulk.
      await bulkSetUserActive(id);
    } else {
      await setUserActive(id);
    }
    const admins = await getAllPendingAdmins();
    setListCheckbox([]);
    setBooleanCheckbox(admins.map(() => false));
    handleOpenSnackbar("Pengelola berhasil diaktifkan");
    handleCloseActivateDialog();
  };

  // Delete Dialog
  const handleOpenDeleteDialog = (e, row) => {
    e.stopPropagation();
    setOpenDeleteDialog(true);
    if (row) {
      setSelectedUserId(row._id);
      setSelectedUserName(row.name);
    } else {
      setSelectedUserId(listCheckbox);
    }
  };

  const handleOpenActivateDialog = (e, row) => {
    e.stopPropagation();
    setOpenActivateDialog(true);
    if (row) {
      setSelectedUserId(row._id);
      setSelectedUserName(row.name);
    } else {
      setSelectedUserId(listCheckbox);
    }
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
  };

  const handleCloseActivateDialog = () => {
    setOpenActivateDialog(false);
  };

  document.title = "Schooly | Pengelola Tidak Aktif";

  return (
    <ManageAdminsContext.Provider
      value={{
        deleteUser,
        classes,
        order,
        orderBy,
        handleRequestSort,
        rowCount: rows ? rows.length : 0,
        handleOpenDeleteDialog,
        handleCloseDeleteDialog,
        handleOpenActivateDialog,
        handleCloseActivateDialog,
        listCheckbox,
        selectAllData,
        deSelectAllData,
        setSearchBarFocus,
        searchBarFocus,
        searchFilter,
        setSearchFilter,
      }}
    >
      <div className={classes.root}>
        <Grid
          container
          alignItems="center"
          spacing={2}
          className={classes.header}
        >
          <Grid item>
            <Avatar variant="rounded" className={classes.headerIcon}>
              <FaUserLock />
            </Avatar>
          </Grid>
          <Grid item>
            <Typography variant="h5" align="left">
              Pengelola Tidak Aktif
            </Typography>
          </Grid>
        </Grid>
        <Divider />
        <ManagePendingAdminsToolbar searchFilterHint="Cari Pengelola" />
        <Divider />
        {rows.length === 0 ? (
          <Empty />
        ) : (
          <List className={classes.userList}>
            {stableSort(rows, getComparator(order, orderBy)).map(
              (row, index) => {
                const labelId = index;
                return (
                  <div>
                    <Link to={`/lihat-profil/${row._id}`}>
                      <ListItem className={classes.accountItem}>
                        <ListItemIcon>
                          <Checkbox
                            color="primary"
                            onClick={(e) => {
                              handleChangeListStudent(e, index, row);
                            }}
                            checked={Boolean(booleanCheckbox[index])}
                          />
                        </ListItemIcon>
                        <Hidden xsDown>
                          <ListItemAvatar>
                            <Avatar src={avatarJSON[row._id]} />
                          </ListItemAvatar>
                        </Hidden>
                        <ListItemText
                          primary={
                            <Typography id={labelId} noWrap>
                              {row.name}
                            </Typography>
                          }
                          secondary={
                            <Typography
                              variant="body2"
                              color="textSecondary"
                              noWrap
                            >
                              {row.email}
                            </Typography>
                          }
                        />
                        <ListItemSecondaryAction
                          onClick={(e) => {
                            e.stopPropagation();
                          }}
                        >
                          <OptionMenu
                            actions={["Aktifkan", "Hapus"]}
                            row={row}
                            handleActionOnClick={[
                              handleOpenActivateDialog,
                              handleOpenDeleteDialog,
                            ]}
                          />
                        </ListItemSecondaryAction>
                      </ListItem>
                    </Link>
                    <Divider />
                  </div>
                );
              }
            )}
          </List>
        )}
        <ActivateDialog
          open={openActivateDialog}
          onClose={handleCloseActivateDialog}
          itemType="Pengelola"
          itemName={selectedUserName}
          onAction={() => onActivateUser(selectedUserId)}
        />
        <DeleteDialog
          openDeleteDialog={openDeleteDialog}
          handleCloseDeleteDialog={handleCloseDeleteDialog}
          itemType="Pengelola"
          itemName={selectedUserName}
          warningText="Informasi pribadi yang tersimpan juga akan dihapus."
          deleteItem={() => onDeleteUser(selectedUserId)}
        />
        <Snackbar
          open={openSnackbar}
          autoHideDuration={4000}
          onClose={(event, reason) => handleCloseSnackbar(event, reason)}
          anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        >
          <Alert
            elevation={6}
            variant="filled"
            severity="success"
            onClose={(event, reason) => handleCloseSnackbar(event, reason)}
          >
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </div>
    </ManageAdminsContext.Provider>
  );
}

ManagePendingAdmins.propTypes = {
  auth: PropTypes.object.isRequired,
  classesCollection: PropTypes.object.isRequired,
  deleteUser: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  classesCollection: state.classesCollection,
  errors: state.errors,
});

export default connect(mapStateToProps, {
  setUserActive,
  bulkSetUserActive,
  deleteUser,
  bulkDeleteUser,
  getMultipleFileAvatar,
  getAllPendingAdmins,
})(ManagePendingAdmins);
