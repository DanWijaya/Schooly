import React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import {
  getPendingStudents,
  getPendingTeachers,
  deleteUser,
  bulkDeleteUser,
  setUserActive,
  bulkSetUserActive,
} from "../../../actions/UserActions";
import { getMultipleFileAvatar } from "../../../actions/files/FileAvatarActions";
import Empty from "../../misc/empty/Empty";
import DeleteDialog from "../../misc/dialog/DeleteDialog";
import ActivateDialog from "../../misc/dialog/ActivateDialog";
import { TabPanel } from "../../misc/tab-panel/TabPanel";
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
  ListItemIcon,
  ListItemAvatar,
  ListItemSecondaryAction,
  ListItemText,
  Menu,
  MenuItem,
  Snackbar,
  Tab,
  Tabs,
  TableSortLabel,
  TextField,
  Tooltip,
  Typography,
} from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";
import {
  Block as BlockIcon,
  Cancel as CancelIcon,
  CheckBox as CheckBoxIcon,
  CheckBoxOutlineBlank as CheckBoxOutlineBlankIcon,
  CheckCircle as CheckCircleIcon,
  Clear as ClearIcon,
  DataUsageRounded,
  IndeterminateCheckBox as IndeterminateCheckBoxIcon,
  Search as SearchIcon,
  Sort as SortIcon,
} from "@material-ui/icons";
import { makeStyles } from "@material-ui/core/styles";
import { BiSitemap } from "react-icons/bi";
import { FaUserLock } from "react-icons/fa";
import OptionMenu from "../../misc/menu/OptionMenu";
import {
  removeDisabledDeletedOfficers,
  removeHomeroomTeachers,
} from "../../../actions/ClassActions";

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
  const { classes, order, orderBy, onRequestSort, role } = props;
  const {
    rowCount,
    user,
    listCheckbox,
    selectAllData,
    deSelectAllData,
    lengthListCheckbox,
    handleOpenDisableDialog,
    handleOpenDeleteDialog,
    setSearchBarFocus,
    searchBarFocus,
    searchFilter,
    searchFilterHint,
    setSearchFilter,
  } = props;
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
            {/*
            Perlu diubah jadi komponen checkbox biar posisinya nda aneh
            <Checkbox color="primary" />
            */}
            {listCheckbox.length === 0 ? (
              <IconButton
                onClick={() => selectAllData(role)}
                disabled={disabledCheckbox}
              >
                <CheckBoxOutlineBlankIcon style={{ color: "grey" }} />
              </IconButton>
            ) : listCheckbox.length === rowCount ? (
              <IconButton
                onClick={() => deSelectAllData(role)}
                disabled={disabledCheckbox}
              >
                <CheckBoxIcon className={classes.checkboxIcon} />
              </IconButton>
            ) : (
              <IconButton
                onClick={() => deSelectAllData(role)}
                disabled={disabledCheckbox}
              >
                <IndeterminateCheckBoxIcon className={classes.checkboxIcon} />
              </IconButton>
            )}
          </Grid>
          <Grid item>
            <OptionMenu
              actions={["Aktifkan", "Hapus"]}
              handleActionOnClick={[
                handleOpenDisableDialog,
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
                id="searchFilterDesktop"
                placeholder={searchFilterHint}
                value={searchFilter}
                onChange={onChange}
                autoFocus={searchFilter.length > 0}
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
                //Show textfield when searchBar is onfocus or searchFilter is not empty
                <TextField
                  autoFocus
                  variant="outlined"
                  id="searchFilterMobile"
                  placeholder={searchFilterHint}
                  value={searchFilter}
                  onChange={onChange}
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
              // When search bar is not on focus and searchFilter is empty
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
  userTabs: {
    borderBottom: "1px solid rgba(0, 0, 0, 0.12)",
  },
  userTabTitle: {
    alignSelf: "flex-start",
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

function ManagePendingUsers(props) {
  const classes = useStyles();
  const {
    setUserActive,
    bulkSetUserActive,
    deleteUser,
    bulkDeleteUser,
    getPendingTeachers,
    getPendingStudents,
    getMultipleFileAvatar,
  } = props;
  const { pending_students, pending_teachers, user, all_roles } = props.auth;

  const [order_student, setOrderStudent] = React.useState("asc");
  const [order_teacher, setOrderTeacher] = React.useState("asc");
  const [orderBy_student, setOrderByStudent] = React.useState("name");
  const [orderBy_teacher, setOrderByTeacher] = React.useState("name");
  const [openDeleteDialog, setOpenDeleteDialog] = React.useState(null);
  const [openActivateDialog, setOpenActivateDialog] = React.useState(null);
  const [selectedUserId, setSelectedUserId] = React.useState(null);
  const [selectedUserName, setSelectedUserName] = React.useState(null);
  const [searchFilterS, setSearchFilterS] = React.useState("");
  const [searchBarFocusS, setSearchBarFocusS] = React.useState(false);
  const [searchFilterT, setSearchFilterT] = React.useState("");
  const [searchBarFocusT, setSearchBarFocusT] = React.useState(false);

  // List Checkbox
  const [listCheckboxStudent, setListCheckboxStudent] = React.useState([]);
  const [listCheckboxTeacher, setListCheckboxTeacher] = React.useState([]);
  const [booleanCheckboxStudent, setBooleanCheckboxStudent] = React.useState(
    []
  );
  const [booleanCheckboxTeacher, setBooleanCheckboxTeacher] = React.useState(
    []
  );

  //Snackbar
  const [openSnackbar, setOpenSnackbar] = React.useState(false);
  const [snackbarMessage, setSnackbarMessage] = React.useState("");

  // Tabs
  const [panel, setPanel] = React.useState(0);

  //Avatars
  const [avatarJSON, setAvatarJSON] = React.useState({});
  let student_rows = [];
  let teacher_rows = [];

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
    //Handle the check of Checkboxes.
    e.stopPropagation();
    e.preventDefault();
    let currentBooleanList = booleanCheckboxStudent;
    currentBooleanList[index] = !currentBooleanList[index];
    setBooleanCheckboxStudent([...currentBooleanList]);

    //Handle the list of chosen .
    let currentCheckboxList = listCheckboxStudent;
    let data = row._id;

    const idxToFound = listCheckboxStudent.indexOf(data);
    if (idxToFound !== -1) {
      currentCheckboxList.splice(idxToFound, 1);
    } else {
      currentCheckboxList.push(data);
    }
    setListCheckboxStudent([...currentCheckboxList]);
  };

  const handleChangeListTeacher = (e, index, row) => {
    //Handle the check of checkboxes
    e.stopPropagation();
    e.preventDefault();
    let currentBooleanList = booleanCheckboxTeacher;
    currentBooleanList[index] = !currentBooleanList[index];
    setBooleanCheckboxTeacher([...currentBooleanList]);

    //Handle the list of chosen .
    let currentCheckboxList = listCheckboxTeacher;
    let data = row._id;

    const idxToFound = currentCheckboxList.indexOf(data);
    if (idxToFound !== -1) {
      currentCheckboxList.splice(idxToFound, 1);
    } else {
      currentCheckboxList.push(data);
    }
    setListCheckboxStudent([...currentCheckboxList]);
  };

  const selectAllData = (type) => {
    console.log(type);
    if (type === "Student") {
      let allDataStudent = [];
      let booleanAllDataStudent = [];
      student_rows.forEach((student) => {
        allDataStudent.push(student._id);
        booleanAllDataStudent.push(true);
      });
      setListCheckboxStudent(allDataStudent);
      setBooleanCheckboxStudent(booleanAllDataStudent);
    } else if (type === "Teacher") {
      let allDataTeacher = [];
      let booleanAllDataTeacher = [];
      teacher_rows.forEach((teacher) => {
        allDataTeacher.push(teacher._id);
        booleanAllDataTeacher.push(true);
      });
      setListCheckboxTeacher(allDataTeacher);
      setBooleanCheckboxTeacher(booleanAllDataTeacher);
    }
  };

  const deSelectAllData = (type) => {
    if (type === "Student") {
      let booleanAllDataStudent = [];
      student_rows.forEach(() => {
        booleanAllDataStudent.push(false);
      });
      setListCheckboxStudent([]);
      setBooleanCheckboxStudent(booleanAllDataStudent);
    } else if (type === "Teacher") {
      let booleanAllDataTeacher = [];
      teacher_rows.forEach(() => {
        booleanAllDataTeacher.push(false);
      });
      setListCheckboxTeacher([]);
      setBooleanCheckboxTeacher(booleanAllDataTeacher);
    }
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
    if (data.role === "Student") {
      student_rows.push(temp);
    } else if (data.role === "Teacher") {
      teacher_rows.push(temp);
    }
  };

  React.useEffect(() => {
    const fetchAllData = async () => {
      if (user.role !== all_roles.SUPERADMIN) {
        const students = await getPendingStudents(user.unit);
        const teachers = await getPendingTeachers(user.unit);

        setBooleanCheckboxStudent(students.map(() => false));
        setBooleanCheckboxTeacher(teachers.map(() => false));

        let allUsersId = [...students, ...teachers].map((user) => user._id);
        getMultipleFileAvatar(allUsersId).then((result) => {
          console.log("Retireved avatars");
          setAvatarJSON(result);
        });
      }
    };

    fetchAllData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const retrieveUsers = () => {
    student_rows = [];
    teacher_rows = [];

    if (Array.isArray(pending_students)) {
      pending_students
        .filter(
          (item) =>
            item.name.toLowerCase().includes(searchFilterS.toLowerCase()) ||
            item.email.toLowerCase().includes(searchFilterS.toLowerCase())
        )
        .forEach((data) => {
          userRowItem(data);
        });
    }
    if (Array.isArray(pending_teachers)) {
      pending_teachers
        .filter(
          (item) =>
            item.name.toLowerCase().includes(searchFilterT.toLowerCase()) ||
            item.email.toLowerCase().includes(searchFilterT.toLowerCase())
        )
        .forEach((data) => {
          userRowItem(data);
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

  // Call the function to get the classes from DB.
  // this function is defined above.
  retrieveUsers();

  const onDeleteUser = async (id) => {
    if (Array.isArray(id)) {
      await bulkDeleteUser(id);
    } else {
      await deleteUser(id);
    }

    if (panel == 0) {
      await removeDisabledDeletedOfficers(id);
      const students = await getPendingStudents(user.unit);
      setListCheckboxStudent([]);
      setBooleanCheckboxStudent(students.map(() => false));
    } else if (panel == 1) {
      await removeHomeroomTeachers(id);
      const teachers = await getPendingTeachers(user.unit);
      setListCheckboxTeacher([]);
      setBooleanCheckboxTeacher(teachers.map(() => false));
    }

    handleOpenSnackbar("Pengguna berhasil dihapus");
    handleCloseDeleteDialog();
  };

  const onActivateUser = async (id) => {
    if (Array.isArray(id)) {
      // If it is a lists, deactivate in bulk
      await bulkSetUserActive(id);
    } else {
      await setUserActive(id);
    }
    if (panel == 0) {
      const students = await getPendingStudents(user.unit);
      setListCheckboxStudent([]);
      setBooleanCheckboxStudent(students.map(() => false));
    } else if (panel == 1) {
      const teachers = await getPendingTeachers(user.unit);
      setListCheckboxTeacher([]);
      setBooleanCheckboxTeacher(teachers.map(() => false));
    }
    handleOpenSnackbar("Pengguna berhasil diaktifkan");
    handleCloseActivateDialog();
  };

  // Delete Dialog box
  const handleOpenDeleteDialog = (e, row) => {
    e.stopPropagation();
    setOpenDeleteDialog(true);
    if (row) {
      setSelectedUserId(row._id);
      setSelectedUserName(row.name);
    } else {
      if (panel == 0) {
        setSelectedUserId(listCheckboxStudent);
      } else if (panel == 1) {
        setSelectedUserId(listCheckboxTeacher);
      }
    }
  };

  const handleOpenDisableDialog = (e, row) => {
    e.stopPropagation();
    setOpenActivateDialog(true);
    if (row) {
      setSelectedUserId(row._id);
      setSelectedUserName(row.name);
    } else {
      if (panel == 0) {
        setSelectedUserId(listCheckboxStudent);
      } else if (panel == 1) {
        setSelectedUserId(listCheckboxTeacher);
      }
    }
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
  };

  const handleCloseActivateDialog = () => {
    setOpenActivateDialog(false);
  };

  const handleTabs = (e, val) => {
    // panel : 0 -> Student list panel
    // panel : 1 -> Teacher list panel
    setPanel(val);
  };

  document.title = "Schooly | Pengguna Tidak Aktif";

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
            <FaUserLock />
          </Avatar>
        </Grid>
        <Grid item>
          <Typography variant="h5" align="left">
            Pengguna Tidak Aktif
          </Typography>
        </Grid>
      </Grid>
      <Tabs
        indicatorColor="primary"
        textColor="primary"
        value={panel}
        onChange={handleTabs}
        className={classes.userTabs}
      >
        <Tab
          label={
            <Typography className={classes.userTabTitle}>Murid</Typography>
          }
        />
        <Tab
          label={<Typography className={classes.userTabTitle}>Guru</Typography>}
        />
      </Tabs>
      <TabPanel value={panel} index={0}>
        <ManageUsersToolbar
          searchFilterHint="Cari Murid"
          role="Student"
          deleteUser={deleteUser}
          classes={classes}
          order={order_student}
          orderBy={orderBy_student}
          onRequestSort={handleRequestSort}
          rowCount={student_rows ? student_rows.length : 0}
          handleOpenDeleteDialog={handleOpenDeleteDialog}
          handleCloseDeleteDialog={handleCloseDeleteDialog}
          handleOpenDisableDialog={handleOpenDisableDialog}
          handleCloseDisableDialog={handleCloseActivateDialog}
          lengthListCheckbox={listCheckboxStudent.length}
          listCheckbox={listCheckboxStudent}
          selectAllData={selectAllData}
          deSelectAllData={deSelectAllData}
          user={user}
          setSearchBarFocus={setSearchBarFocusS}
          searchBarFocus={searchBarFocusS}
          searchFilter={searchFilterS}
          setSearchFilter={setSearchFilterS}
        />
        <Divider />
        {student_rows.length === 0 ? (
          <Empty />
        ) : (
          <List className={classes.userList}>
            {stableSort(
              student_rows,
              getComparator(order_student, orderBy_student)
            ).map((row, index) => {
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
                          checked={Boolean(booleanCheckboxStudent[index])}
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
            })}
          </List>
        )}
      </TabPanel>
      <TabPanel value={panel} index={1}>
        <ManageUsersToolbar
          searchFilterHint="Cari Guru"
          role="Teacher"
          deleteUser={deleteUser}
          classes={classes}
          order={order_teacher}
          orderBy={orderBy_teacher}
          onRequestSort={handleRequestSort}
          rowCount={teacher_rows ? teacher_rows.length : 0}
          handleOpenDeleteDialog={handleOpenDeleteDialog}
          handleCloseDeleteDialog={handleCloseDeleteDialog}
          handleOpenDisableDialog={handleOpenDisableDialog}
          handleCloseDisableDialog={handleCloseActivateDialog}
          lengthListCheckbox={listCheckboxTeacher.length}
          listCheckbox={listCheckboxTeacher}
          selectAllData={selectAllData}
          deSelectAllData={deSelectAllData}
          setSearchBarFocus={setSearchBarFocusT}
          searchBarFocus={searchBarFocusT}
          //Two props added for search filter.
          searchFilter={searchFilterT}
          setSearchFilter={setSearchFilterT}
        />
        <Divider />
        {teacher_rows.length === 0 ? (
          <Empty />
        ) : (
          <List className={classes.userList}>
            {stableSort(
              teacher_rows,
              getComparator(order_teacher, orderBy_teacher)
            ).map((row, index) => {
              const labelId = index;
              return (
                <div>
                  <Link to={`/lihat-profil/${row._id}`}>
                    <ListItem className={classes.accountItem}>
                      <ListItemIcon onClick={(e) => e.preventDefault()}>
                        <Checkbox
                          color="primary"
                          onClick={(e) => {
                            handleChangeListTeacher(e, index, row);
                          }}
                          checked={Boolean(booleanCheckboxTeacher[index])}
                        />
                      </ListItemIcon>
                      <Hidden xsDown>
                        <ListItemAvatar>
                          <Avatar src={avatarJSON[row._id]} />{" "}
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
                      <ListItemSecondaryAction>
                        <OptionMenu
                          actions={["Aktifkan", "Hapus"]}
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
            })}
          </List>
        )}
      </TabPanel>
      <ActivateDialog
        open={openActivateDialog}
        onClose={handleCloseActivateDialog}
        itemType="Pengguna"
        itemName={selectedUserName}
        onAction={() => onActivateUser(selectedUserId)}
      />
      <DeleteDialog
        openDeleteDialog={openDeleteDialog}
        handleCloseDeleteDialog={handleCloseDeleteDialog}
        itemType="Pengguna"
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
  );
}

ManagePendingUsers.propTypes = {
  auth: PropTypes.object.isRequired,
  getPendingStudents: PropTypes.func.isRequired,
  getPendingTeachers: PropTypes.func.isRequired,
  setUserDeactivated: PropTypes.func.isRequired,
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
  getPendingStudents,
  getPendingTeachers,
  setUserActive,
  bulkSetUserActive,
  deleteUser,
  bulkDeleteUser,
  getMultipleFileAvatar,
})(ManagePendingUsers);
