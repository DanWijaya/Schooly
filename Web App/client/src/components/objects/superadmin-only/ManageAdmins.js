import React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import moment from "moment";
import "moment/locale/id";
import {
  getAllAdmins,
  setUserDeactivated,
  deleteUser,
} from "../../../actions/UserActions";
import Empty from "../../misc/empty/Empty";
import DeleteDialog from "../../misc/dialog/DeleteDialog";
import DeactivateDialog from "../../misc/dialog/DeactivateDialog";
import OptionMenu from "../../misc/menu/OptionMenu";
import LightTooltip from "../../misc/light-tooltip/LightTooltip";
import {
  Avatar,
  Button,
  Checkbox,
  Dialog,
  Divider,
  Grid,
  Hidden,
  IconButton,
  InputAdornment,
  List,
  ListItem,
  ListItemAvatar,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
  Menu,
  MenuItem,
  Snackbar,
  TableSortLabel,
  TextField,
  Toolbar,
  Typography,
} from "@material-ui/core/";
import Alert from "@material-ui/lab/Alert";
import {
  ArrowBack as ArrowBackIcon,
  Block as BlockIcon,
  Cancel as CancelIcon,
  CheckBox as CheckBoxIcon,
  CheckBoxOutlineBlank as CheckBoxOutlineBlankIcon,
  CheckCircle as CheckCircleIcon,
  Clear as ClearIcon,
  IndeterminateCheckBox as IndeterminateCheckBoxIcon,
  Search as SearchIcon,
  Sort as SortIcon,
} from "@material-ui/icons";
import { makeStyles } from "@material-ui/core/styles";
import { BiSitemap } from "react-icons/bi";
import { FaUsersCog } from "react-icons/fa";

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

function ManageUsersToolbar(props) {
  const {
    classes,
    order,
    orderBy,
    onRequestSort,
    role,
    heading,
    currentCheckboxMode,
    rowCount,
    user,
    listCheckbox,
    selectAllData,
    deSelectAllData,
    lengthListCheckbox,
    activateCheckboxMode,
    deactivateCheckboxMode,
    OpenDialogCheckboxDelete,
    CheckboxDialog,
    setSearchBarFocus,
    searchBarFocus,
    searchFilter,
    searchFilterHint,
    updateSearchFilter,
    tabValueCheck,
  } = props;

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
    updateSearchFilter(e.target.value);
  };

  const onClear = (e) => {
    updateSearchFilter("");
  };

  return (
    <div className={classes.toolbar}>
      <Grid container>
        <Grid item xs container alignItems="center" spacing={1}>
          <Grid item>
            {/*
            Perlu diubah jadi komponen checkbox biar posisinya nda aneh
            <Checkbox color="primary" />
            */}
            {listCheckbox.length === 0 ? (
              <IconButton onClick={() => selectAllData(role)}>
                <CheckBoxOutlineBlankIcon style={{ color: "grey" }} />
              </IconButton>
            ) : listCheckbox.length === rowCount ? (
              <IconButton onClick={() => deSelectAllData(role)}>
                <CheckBoxIcon className={classes.checkboxIcon} />
              </IconButton>
            ) : (
              <IconButton onClick={() => deSelectAllData(role)}>
                <IndeterminateCheckBoxIcon className={classes.checkboxIcon} />
              </IconButton>
            )}
          </Grid>
          <Grid item>
            <OptionMenu
              actions={["Hapus"]}
              row={null}
              handleActionOnClick={[OpenDialogCheckboxDelete]}
              rowCount={listCheckbox.length === 0}
            />
            {CheckboxDialog("Delete", "Student")}
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
                id="searchFilterDesktop"
                value={searchFilter}
                onChange={onChange}
                autoFocus={searchFilter.length > 0}
                placeholder={searchFilterHint}
                InputProps={{
                  style: { borderRadius: "22.5px" },
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
                          onClear(e);
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
                    variant="outlined"
                    id="searchFilterMobile"
                    value={searchFilter}
                    placeholder={searchFilterHint}
                    onChange={onChange}
                    autoFocus
                    onClick={(e) => {
                      setSearchBarFocus(true);
                    }}
                    InputProps={{
                      style: { borderRadius: "22.5px" },
                      endAdornment: (
                        <InputAdornment
                          position="end"
                          style={{ marginLeft: "-10px" }}
                        >
                          <IconButton
                            size="small"
                            id="searchFilterMobile"
                            onClick={(e) => {
                              e.stopPropagation();
                              onClear(e);
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
                </div>
              ) : (
                <LightTooltip title="Cari Akun">
                  <IconButton onClick={() => setSearchBarFocus(true)}>
                    <SearchIcon />
                  </IconButton>
                </LightTooltip>
              )}
            </Hidden>
          </Grid>
          {role === "Teacher" ? (
            <Grid item style={{ display: searchBarFocus ? "none" : "block" }}>
              <Link to="/sunting-pengelola">
                <LightTooltip title="Sunting Unit Pengelola">
                  <IconButton>
                    <BiSitemap />
                  </IconButton>
                </LightTooltip>
              </Link>
            </Grid>
          ) : null}
          <Grid item style={{ display: searchBarFocus ? "none" : "block" }}>
            <LightTooltip title="Urutkan Akun">
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
    display: "flex",
    backgroundColor: theme.palette.primary.main,
    color: "white",
    fontSize: "25px",
    padding: "7.5px",
    borderRadius: "5px",
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
  dialogBox: {
    width: "300px",
    maxWidth: "100%",
    minHeight: "175px",
    padding: "15px",
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dialogDisableButton: {
    width: "150px",
    backgroundColor: theme.palette.warning.dark,
    color: "white",
    "&:focus, &:hover": {
      backgroundColor: theme.palette.warning.dark,
      color: "white",
    },
  },
  dialogApproveButton: {
    width: "125px",
    backgroundColor: theme.palette.success.main,
    color: "white",
    border: `1px solid ${theme.palette.success.main}`,
    "&:focus, &:hover": {
      backgroundColor: theme.palette.success.dark,
      color: "white",
      border: `1px solid ${theme.palette.success.dark}`,
    },
  },
  dialogDeleteButton: {
    width: "125px",
    backgroundColor: theme.palette.error.main,
    color: "white",
    border: `1px solid ${theme.palette.error.main}`,
    "&:focus, &:hover": {
      backgroundColor: theme.palette.error.dark,
      color: "white",
      border: `1px solid ${theme.palette.error.dark}`,
    },
  },
  dialogCancelButton: {
    width: "125px",
    backgroundColor: "white",
    color: theme.palette.error.main,
    border: `1px solid ${theme.palette.error.main}`,
    "&:focus, &:hover": {
      backgroundColor: "white",
      color: theme.palette.error.dark,
      border: `1px solid ${theme.palette.error.dark}`,
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

function ManageAdmins(props) {
  const classes = useStyles();
  const { setUserDeactivated, deleteUser, getAllAdmins } = props;
  const { all_admins, user } = props.auth;

  const [order_student, setOrderStudent] = React.useState("asc");
  const [order_teacher, setOrderTeacher] = React.useState("asc");
  const [orderBy_student, setOrderByStudent] = React.useState("name");
  const [orderBy_teacher, setOrderByTeacher] = React.useState("name");
  const [openDeleteDialog, setOpenDeleteDialog] = React.useState(null);
  const [openDeactivateDialog, setOpenDisableDialog] = React.useState(null);
  const [selectedUserId, setSelectedUserId] = React.useState(null);
  const [selectedUserName, setSelectedUserName] = React.useState(null);
  const [searchFilterS, updateSearchFilterS] = React.useState("");
  const [searchBarFocusS, setSearchBarFocusS] = React.useState(false);
  const [searchFilterT, updateSearchFilterT] = React.useState("");
  const [searchBarFocusT, setSearchBarFocusT] = React.useState(false);

  let rows = [];

  // Checkbox Dialog
  // const [openApproveCheckboxDialogStudent, setOpenApproveCheckboxDialogStudent] = React.useState(null);
  // const [openApproveCheckboxDialogTeacher, setOpenApproveCheckboxDialogTeacher] = React.useState(null);
  const [
    openDeleteCheckboxDialogStudent,
    setOpenDeleteCheckboxDialogStudent,
  ] = React.useState(null);
  const [
    openDeleteCheckboxDialogTeacher,
    setOpenDeleteCheckboxDialogTeacher,
  ] = React.useState(null);

  // Checkbox Approve or Delete
  const [checkboxModeStudent, setCheckboxModeStudent] = React.useState(false);
  const [checkboxModeTeacher, setCheckboxModeTeacher] = React.useState(false);

  // List Checkbox
  const [listCheckboxStudent, setListCheckboxStudent] = React.useState([]);
  const [listCheckboxTeacher, setListCheckboxTeacher] = React.useState([]);

  const [booleanCheckboxStudent, setBooleanCheckboxStudent] = React.useState(
    []
  );
  const [booleanCheckboxTeacher, setBooleanCheckboxTeacher] = React.useState(
    []
  );
  const [openSnackbar, setOpenSnackbar] = React.useState(false);
  const [snackbarMessage, setSnackbarMessage] = React.useState("");
  const [test, setTest] = React.useState(false);

  let currentListBooleanStudent;
  let currentListBooleanTeacher;

  React.useEffect(() => {
    getAllAdmins();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    autoReloader();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listCheckboxTeacher, listCheckboxStudent]);

  const handleActivateCheckboxMode = (type) => {
    if (type === "Student") {
      setCheckboxModeStudent(true);
    } else if (type === "Teacher") {
      setCheckboxModeTeacher(true);
      if (currentListBooleanTeacher.length === rows.length) {
        setBooleanCheckboxTeacher(currentListBooleanTeacher);
      }
    }
  };

  const handleDeactivateCheckboxMode = (type) => {
    if (type === "Student") {
      setCheckboxModeStudent(false);
    } else if (type === "Teacher") {
      setCheckboxModeTeacher(false);
    }
  };

  const handleChangeListStudent = (e, index, row) => {
    //Handle the check of Checkboxes.
    e.stopPropagation();
    e.preventDefault();
    let currentBooleanList = booleanCheckboxStudent;
    currentBooleanList[index] = !currentBooleanList[index];
    setBooleanCheckboxStudent([...currentBooleanList]);

    //Handle the list of chosen .
    let status = true;
    let result = [];
    let temp = { checkboxEvent: e, index: index, row: row };
    for (let i = 0; i < listCheckboxStudent.length; i++) {
      if (listCheckboxStudent[i].row._id === row._id) {
        result = listCheckboxStudent;
        result.splice(i, 1);
        status = false;
        break;
      }
    }
    if (status) {
      result = listCheckboxStudent;
      result.push(temp);
    }
    setListCheckboxStudent([...result]);
  };

  const handleChangeListTeacher = (e, index, row) => {
    let currentBooleanList = booleanCheckboxTeacher;
    currentBooleanList[index] = !currentBooleanList[index];
    setBooleanCheckboxTeacher(currentBooleanList);
    let status = true;
    let result = [];
    let temp = { checkboxEvent: e, index: index, row: row };
    for (let i = 0; i < listCheckboxTeacher.length; i++) {
      if (listCheckboxTeacher[i].row._id === row._id) {
        result = listCheckboxTeacher;
        result.splice(i, 1);
        status = false;
        break;
      }
    }
    if (status) {
      result = listCheckboxTeacher;
      result.push(temp);
    }
    setListCheckboxTeacher(result);
  };

  const handleDeleteListStudent = () => {
    // for (let i = 0; i < listCheckboxStudent.length; i++) {
    //   onDeleteUser(listCheckboxStudent[i].row._id);
    // }
    setListCheckboxStudent([]);
  };

  const handleDeleteListTeacher = () => {
    // for (let i = 0; i < listCheckboxTeacher.length; i++) {
    //   onDeleteUser(listCheckboxTeacher[i].row._id);
    // }
    setListCheckboxTeacher([]);
  };

  const selectAllData = () => {
    let allDataStudent = [];
    let booleanAllDataStudent = [];
    for (let i = 0; i < rows.length; i++) {
      let temp = { e: null, index: i, row: rows[i] };
      allDataStudent.push(temp);
      booleanAllDataStudent.push(true);
    }
    setListCheckboxStudent(allDataStudent);
    setBooleanCheckboxStudent(booleanAllDataStudent);
  };

  const deSelectAllData = () => {
    let booleanAllDataStudent = [];
    for (let i = 0; i < rows.length; i++) {
      booleanAllDataStudent.push(false);
    }
    setListCheckboxStudent([]);
    setBooleanCheckboxStudent(booleanAllDataStudent);
  };

  // Checkbox Dialog Box
  const handleOpenCheckboxDeleteDialog = (e, user) => {
    e.stopPropagation();
    if (user === "Student") {
      setOpenDeleteCheckboxDialogStudent(true);
    } else {
      setOpenDeleteCheckboxDialogTeacher(true);
    }
  };

  const handleCloseCheckboxDeleteDialog = (user) => {
    if (user === "Student") {
      setOpenDeleteCheckboxDialogStudent(false);
    } else {
      setOpenDeleteCheckboxDialogTeacher(false);
    }
  };

  const autoReloader = () => {
    setTest(!test);
    // console.log("Disable auto reloader")
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
  const retrieveUsers = () => {
    rows = [];
    currentListBooleanStudent = [];
    currentListBooleanTeacher = [];

    if (Array.isArray(all_admins)) {
      all_admins
        .filter(
          (item) =>
            item.name.toLowerCase().includes(searchFilterS.toLowerCase()) ||
            item.email.toLowerCase().includes(searchFilterS.toLowerCase())
        )
        .forEach((data) => {
          userRowItem(data);
          currentListBooleanStudent.push(false);
        });
    }
  };

  const handleRequestSort = (event, property, role) => {
    if (role === "Student") {
      const isAsc = orderBy_student === property && order_student === "asc";
      setOrderStudent(isAsc ? "desc" : "asc");
      setOrderByStudent(property);
    } else if (role === "Teacher") {
      const isAsc = orderBy_teacher === property && order_teacher === "asc";
      setOrderTeacher(isAsc ? "desc" : "asc");
      setOrderByTeacher(property);
    }
  };

  // Call the function to get the classes from DB
  // this function is defined above
  retrieveUsers();

  const onDeleteUser = (id) => {
    deleteUser(id).then((res) => {
      getAllAdmins();
      handleOpenSnackbar("Pengelola berhasil dihapus");
      handleCloseDeleteDialog();
    });
  };
  const onDeactivateUser = (id) => {
    setUserDeactivated(id).then((res) => {
      getAllAdmins();
      handleOpenSnackbar("Pengelola berhasil dinonaktifkan");
      handleCloseDeactivateDialog();
    });
  };
  // Delete Dialog box
  const handleOpenDeleteDialog = (e, id, name) => {
    e.preventDefault();
    e.stopPropagation();
    setOpenDeleteDialog(true);
    setSelectedUserId(id);
    setSelectedUserName(name);
  };

  const handleOpenDisableDialog = (e, id, name) => {
    console.log("Di panggill");
    e.stopPropagation();
    setOpenDisableDialog(true);
    setSelectedUserId(id);
    setSelectedUserName(name);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
  };

  const handleCloseDeactivateDialog = () => {
    setOpenDisableDialog(false);
  };

  function CheckboxDialog(type, user) {
    return (
      <>
        {user === "Student" ? (
          <Dialog
            open={openDeleteCheckboxDialogStudent}
            onClose={() => handleCloseCheckboxDeleteDialog("Student")}
          >
            <Grid
              container
              direction="column"
              alignItems="center"
              className={classes.dialogBox}
            >
              <Grid
                item
                container
                justify="center"
                style={{ marginBottom: "20px" }}
              >
                <Typography variant="h6" gutterBottom align="center">
                  Hapus semua Pengelola berikut?
                </Typography>
              </Grid>
              <Grid
                container
                direction="row"
                justify="center"
                alignItems="center"
                spacing={2}
                style={{ marginTop: "10px" }}
              >
                <Grid item>
                  <Button
                    onClick={() => {
                      handleDeleteListStudent();
                    }}
                    startIcon={<CheckCircleIcon />}
                    className={classes.dialogDeleteButton}
                  >
                    iya
                  </Button>
                </Grid>
                <Grid item>
                  <Button
                    onClick={() => handleCloseCheckboxDeleteDialog("Student")}
                    startIcon={<CancelIcon />}
                    className={classes.dialogCancelButton}
                  >
                    Tidak
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </Dialog>
        ) : (
          <Dialog
            open={openDeleteCheckboxDialogTeacher}
            onClose={() => handleCloseCheckboxDeleteDialog("Teacher")}
          >
            <Grid
              container
              direction="column"
              alignItems="center"
              className={classes.dialogBox}
            >
              <Grid
                item
                container
                justify="center"
                style={{ marginBottom: "20px" }}
              >
                <Typography variant="h6" gutterBottom align="center">
                  Hapus semua Pengelola berikut?
                </Typography>
              </Grid>
              <Grid
                container
                direction="row"
                justify="center"
                alignItems="center"
              >
                <Grid item>
                  <Button
                    onClick={() => {
                      handleDeleteListTeacher();
                    }}
                    startIcon={<CheckCircleIcon />}
                    className={classes.dialogDeleteButton}
                  >
                    Iya
                  </Button>
                </Grid>
                <Grid item>
                  <Button
                    onClick={() => handleCloseCheckboxDeleteDialog("Teacher")}
                    startIcon={<CancelIcon />}
                    className={classes.dialogCancelButton}
                  >
                    Tidak
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </Dialog>
        )}
      </>
    );
  }

  const handleOpenSnackbar = (message) => {
    setOpenSnackbar(true);
    setSnackbarMessage(message);
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnackbar(false);
  };

  document.title = "Schooly | Daftar Pengelola";

  return (
    <div className={classes.root}>
      <Grid
        container
        alignItems="center"
        spacing={2}
        className={classes.header}
      >
        <Grid item>
          <div className={classes.headerIcon}>
            <FaUsersCog />
          </div>
        </Grid>
        <Grid item>
          <Typography variant="h5" align="left">
            Pengelola Aktif
          </Typography>
        </Grid>
      </Grid>
      <Divider />
      <ManageUsersToolbar
        searchFilterHint="Cari Pengelola"
        role="Admin"
        deleteUser={deleteUser}
        classes={classes}
        order={order_student}
        orderBy={orderBy_student}
        onRequestSort={handleRequestSort}
        rowCount={rows ? rows.length : 0}
        activateCheckboxMode={handleActivateCheckboxMode}
        deactivateCheckboxMode={handleDeactivateCheckboxMode}
        currentCheckboxMode={checkboxModeStudent}
        OpenDialogCheckboxDelete={handleOpenCheckboxDeleteDialog}
        CloseDialogCheckboxDelete={handleCloseCheckboxDeleteDialog}
        CheckboxDialog={CheckboxDialog}
        lengthListCheckbox={listCheckboxStudent.length}
        listCheckbox={listCheckboxStudent}
        selectAllData={selectAllData}
        deSelectAllData={deSelectAllData}
        user={user}
        setSearchBarFocus={setSearchBarFocusS}
        searchBarFocus={searchBarFocusS}
        searchFilter={searchFilterS}
        updateSearchFilter={updateSearchFilterS}
      />
      <Divider />
      {rows.length === 0 ? (
        <Empty />
      ) : (
        <List className={classes.userList}>
          {stableSort(rows, getComparator(order_student, orderBy_student)).map(
            (row, index) => {
              const labelId = index;
              return (
                <div>
                  <Link to={`/lihat-profil/${row._id}`}>
                    <ListItem key={row} className={classes.accountItem}>
                      <ListItemIcon>
                        <Checkbox
                          color="primary"
                          onClick={(e) => {
                            handleChangeListStudent(e, index, row);
                          }}
                          checked={Boolean(booleanCheckboxStudent[index])}
                        />
                        {/*Ini yang propagationnya berhasil ke handle
                        <FormControlLabel
                          control={
                            <Checkbox
                              color="primary"
                              onClick={(e) => {
                                e.stopPropagation();
                              }}
                              onChange={(e) => {
                                handleChangeListStudent(e, index, row);
                                autoReloader();
                              }}
                              checked={Boolean(booleanCheckboxStudent[index])}
                            />
                          }
                        />*/}
                      </ListItemIcon>
                      <Hidden xsDown>
                        <ListItemAvatar>
                          {!row.avatar ? (
                            <Avatar />
                          ) : (
                            <Avatar src={`/api/upload/avatar/${row.avatar}`} />
                          )}
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
                        onChange={(e) => {
                          e.stopPropagation();
                        }}
                      >
                        <OptionMenu
                          actions={["Nonaktifkan", "Hapus"]}
                          row={row}
                          handleActionOnClick={[
                            handleOpenDisableDialog,
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
      <DeactivateDialog
        open={openDeactivateDialog}
        onClose={handleCloseDeactivateDialog}
        itemName={selectedUserName}
        onAction={() => {
          onDeactivateUser(selectedUserId);
        }}
      />
      <DeleteDialog
        openDeleteDialog={openDeleteDialog}
        handleCloseDeleteDialog={handleCloseDeleteDialog}
        itemType="Pengelola"
        itemName={selectedUserName}
        deleteItem={() => {
          onDeleteUser(selectedUserId);
        }}
      />
      <Snackbar
        open={openSnackbar}
        autoHideDuration={4000}
        onClose={(event, reason) => {
          handleCloseSnackbar(event, reason);
        }}
      >
        <Alert
          variant="filled"
          severity="success"
          onClose={(event, reason) => {
            handleCloseSnackbar(event, reason);
          }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
}

ManageAdmins.propTypes = {
  auth: PropTypes.object.isRequired,
  classesCollection: PropTypes.object.isRequired,
  getAllAdmins: PropTypes.func.isRequired,
  setUserDeactivated: PropTypes.func.isRequired,
  deleteUser: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  classesCollection: state.classesCollection,
  errors: state.errors,
});

export default connect(mapStateToProps, {
  getAllAdmins,
  setUserDeactivated,
  deleteUser,
})(ManageAdmins);
