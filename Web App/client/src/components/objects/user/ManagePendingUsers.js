import React, { useEffect, useRef } from "react";
import { Link, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import moment from "moment";
import "moment/locale/id";
import { getPendingStudents, getPendingTeachers, deleteUser, setUserActive } from "../../../actions/UserActions";
import Empty from "../../misc/empty/Empty";
import DeleteDialog from "../../misc/dialog/DeleteDialog";
import LightTooltip from "../../misc/light-tooltip/LightTooltip";
import UserMenu from "./UserMenu";
import {
  Avatar,
  Button,
  Checkbox,
  Dialog,
  Divider,
  FormControlLabel,
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
  Tab,
  Tabs,
  TableSortLabel,
  TextField,
  Typography
} from "@material-ui/core/";
import {
  ArrowBack as ArrowBackIcon,
  Block as BlockIcon,
  Cancel as CancelIcon,
  CheckBox as CheckBoxIcon,
  CheckBoxOutlineBlank as CheckBoxOutlineBlankIcon,
  CheckCircle as CheckCircleIcon,
  Clear as ClearIcon,
  Close as CloseIcon,
  Delete as DeleteIcon,
  IndeterminateCheckBox as IndeterminateCheckBoxIcon,
  Search as SearchIcon,
  Sort as SortIcon
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

const ManageUsersToolbar = (props) => {
  const {
    classes,
    order,
    orderBy,
    onRequestSort,
    role,
    activateCheckboxMode,
    deactivateCheckboxMode,
    currentCheckboxMode,
    OpenDialogCheckboxDelete,
    OpenDialogCheckboxApprove,
    CheckboxDialog,
    listCheckbox,
    lengthListCheckbox,
    rowCount,
    selectAllData,
    deSelectAllData,
    setSearchBarFocus,
    searchBarFocus,
    searchFilter,
    searchFilterHint,
    updateSearchFilter,
  } = props;

  console.log(listCheckbox);
  console.log(currentCheckboxMode);

  if (props.lengthListCheckbox !== lengthListCheckbox) {
    console.log("Berubah");
  }

  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property, role);
  };

  const headCells = [
    { id: "name", numeric: false, disablePadding: true, label: "Nama" },
    { id: "email", numeric: false, disablePadding: false, label: "Email" },
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
    { id: "address", numeric: false, disablePadding: false, label: "Alamat" },
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

  React.useEffect(() => {
    console.log(lengthListCheckbox);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  });


  let searchRef = useRef();

  useEffect(() => {
    let handler = (event) => {
      if (!searchRef.current.contains(event.target)) {
        setSearchBarFocus(false);
      }
    }
    document.addEventListener("mousedown", handler)
    return () => {
      document.removeEventListener("mousedown", handler);
    }
  });

  return (
    <div className={classes.toolbar}>
      <Grid container>
        <Grid item xs container alignItems="center" spacing={1}>
          <Grid item>
            {/*
            Perlu diubah jadi komponen checkbox biar posisinya nda aneh
            <Checkbox color="primary" />
            */}
            {
              listCheckbox.length === 0 ? (
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
              )
            }
          </Grid>
          <Grid item>
            <UserMenu
              options={["Aktifkan", "Hapus"]}
              role={role}
              row={null}
              handleOpenDeleteDialog={OpenDialogCheckboxDelete}
              handleOpenDisableApproveDialog={OpenDialogCheckboxApprove}
              rowCount={listCheckbox.length === 0}
            />
            {CheckboxDialog("Delete", role)}
            {/* {CheckboxDialog("Approve", role)}
            {CheckboxDialog("Approve", "Teacher")}
            <LightTooltip title="Aktifkan Pengguna Tercentang">
              <IconButton
                className={classes.profileApproveButton}
                onClick={(e) => OpenDialogCheckboxApprove(e, "Teacher")}
                style={{ marginRight: "3px" }}
              >
                <CheckCircleIcon />
              </IconButton>
            </LightTooltip>
            {CheckboxDialog("Delete", "Teacher")}
            <LightTooltip title="Hapus Pengguna Tercentang">
              <IconButton
                className={classes.profileDeleteButton}
                onClick={(e) => OpenDialogCheckboxDelete(e, "Teacher")}
              >
                <DeleteIcon />
              </IconButton>
            </LightTooltip>
            */}
          </Grid>
        </Grid>
        <Grid item xs container justify="flex-end" alignItems="center" spacing={1}>
          <Grid item>
            <Hidden smDown>
              <TextField
                variant="outlined"
                id="searchFilterDesktop"
                value={searchFilter}
                onChange={onChange}
                // onClick={() => setSearchBarFocus(true)}
                // onBlur={() => setSearchBarFocus(false)}
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
                  /* <IconButton
                  onClick={() => {
                    setSearchBarFocus(false);
                    updateSearchFilter("");
                  }}
                >
                  <ArrowBackIcon />
                </IconButton> */
                <TextField
                  fullWidth
                  autoFocus
                  variant="outlined"
                  id="searchFilterMobile"
                  value={searchFilter}
                  onChange={onChange}
                  onClick={(e) => setSearchBarFocus(true)}
                  placeholder={searchFilterHint}
                  ref={searchRef}
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
              ) : (
                <LightTooltip title="Cari Akun">
                  <IconButton onClick={() => setSearchBarFocus(true)}>
                    <SearchIcon />
                  </IconButton>
                </LightTooltip>
              )}
            </Hidden>
          </Grid>
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
    display: "flex",
    backgroundColor: theme.palette.primary.main,
    color: "white",
    fontSize: "25px",
    padding: "7.5px",
    borderRadius: "5px",
  },
  toolbar: {
    padding: "10px 16px",
  },
  profileApproveButton: {
    backgroundColor: theme.palette.success.main,
    color: "white",
    "&:focus, &:hover": {
      backgroundColor: "white",
      color: theme.palette.success.main,
    },
  },
  profileDeleteButton: {
    backgroundColor: theme.palette.error.dark,
    color: "white",
    "&:focus, &:hover": {
      backgroundColor: "white",
      color: theme.palette.error.dark,
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
  accountItem: {
    color: "black",
    "&:focus, &:hover": {
      boxShadow: "0px 2px 3px 0px rgba(60,64,67,0.30), 0px 2px 8px 2px rgba(60,64,67,0.15)",
    }
  },
  checkboxIcon: {
    color: theme.palette.primary.main,
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
}));

function ManageUsers(props) {
  const classes = useStyles();

  const [order_student, setOrderStudent] = React.useState("asc");
  const [order_teacher, setOrderTeacher] = React.useState("asc");

  const [orderBy_student, setOrderByStudent] = React.useState("name");
  const [orderBy_teacher, setOrderByTeacher] = React.useState("name");

  const [openApproveDialog, setOpenApproveDialog] = React.useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = React.useState(null);
  const [selectedUserId, setSelectedUserId] = React.useState(null);
  const [selectedUserName, setSelectedUserName] = React.useState(null);
  const [searchFilterS, updateSearchFilterS] = React.useState("");
  const [searchBarFocusS, setSearchBarFocusS] = React.useState(false);

  const [searchFilterT, updateSearchFilterT] = React.useState("");
  const [searchBarFocusT, setSearchBarFocusT] = React.useState(false);

  const {
    deleteUser,
    setUserActive,
    getPendingTeachers,
    getPendingStudents,
  } = props;
  const { pending_students, pending_teachers, pending_users } = props.auth;

  let student_rows = [];
  let teacher_rows = [];

  // Checkbox Dialog
  const [
    openApproveCheckboxDialogStudent,
    setOpenApproveCheckboxDialogStudent,
  ] = React.useState(null);
  const [
    openApproveCheckboxDialogTeacher,
    setOpenApproveCheckboxDialogTeacher,
  ] = React.useState(null);
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

  const [test, setTest] = React.useState(false);

  let currentListBooleanStudent;
  let currentListBooleanTeacher;

  React.useEffect(() => {
    autoReloader();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listCheckboxTeacher, listCheckboxStudent]);

  const handleActivateCheckboxMode = (type) => {
    if (type === "Student") {
      setCheckboxModeStudent(true);
      if (currentListBooleanStudent.length === student_rows.length) {
        setBooleanCheckboxStudent(currentListBooleanStudent);
      }
    } else if (type === "Teacher") {
      setCheckboxModeTeacher(true);
      if (currentListBooleanTeacher.length === teacher_rows.length) {
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
    let currentBooleanList = booleanCheckboxStudent;
    currentBooleanList[index] = !currentBooleanList[index];
    setBooleanCheckboxStudent(currentBooleanList);
    let status = true;
    let result = [];
    let temp = { checkboxEvent: e, index: index, row: row };
    for (let i = 0; i < listCheckboxStudent.length; i++) {
      if (listCheckboxStudent[i].row._id === row._id) {
        result = listCheckboxStudent;
        // result.splice(i,i+1)
        result.splice(i, 1);
        status = false;
        break;
      }
    }
    if (status) {
      result = listCheckboxStudent;
      result.push(temp);
    }
    setListCheckboxStudent(result);
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
        // result.splice(i,i+1)
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

  const handleApproveListStudent = () => {
    for (let i = 0; i < listCheckboxStudent.length; i++) {
      onApproveUser(listCheckboxStudent[i].row._id);
    }
    setListCheckboxStudent([]);
  };

  const handleApproveListTeacher = () => {
    for (let i = 0; i < listCheckboxTeacher.length; i++) {
      onApproveUser(listCheckboxTeacher[i].row._id);
    }
    setListCheckboxTeacher([]);
  };

  const handleDeleteListStudent = () => {
    for (let i = 0; i < listCheckboxStudent.length; i++) {
      onDeleteUser(listCheckboxStudent[i].row._id);
    }
    setListCheckboxStudent([]);
  };

  const handleDeleteListTeacher = () => {
    for (let i = 0; i < listCheckboxTeacher.length; i++) {
      onDeleteUser(listCheckboxTeacher[i].row._id);
    }
    setListCheckboxTeacher([]);
  };

  const selectAllData = (type) => {
    if (type === "Student") {
      let allDataStudent = [];
      let booleanAllDataStudent = [];
      for (let i = 0; i < student_rows.length; i++) {
        let temp = { e: null, index: i, row: student_rows[i] };
        allDataStudent.push(temp);
        booleanAllDataStudent.push(true);
      }
      setListCheckboxStudent(allDataStudent);
      setBooleanCheckboxStudent(booleanAllDataStudent);
    } else {
      let allDataTeacher = [];
      let booleanAllDataTeacher = [];
      for (let i = 0; i < teacher_rows.length; i++) {
        let temp = { e: null, index: i, row: teacher_rows[i] };
        allDataTeacher.push(temp);
        booleanAllDataTeacher.push(true);
      }
      setListCheckboxTeacher(allDataTeacher);
      setBooleanCheckboxTeacher(booleanAllDataTeacher);
    }
  };

  const deSelectAllData = (type) => {
    if (type === "Student") {
      let booleanAllDataStudent = [];
      for (let i = 0; i < student_rows.length; i++) {
        booleanAllDataStudent.push(false);
      }
      setListCheckboxStudent([]);
      setBooleanCheckboxStudent(booleanAllDataStudent);
    } else {
      let booleanAllDataTeacher = [];
      for (let i = 0; i < teacher_rows.length; i++) {
        booleanAllDataTeacher.push(false);
      }
      setListCheckboxTeacher([]);
      setBooleanCheckboxTeacher(booleanAllDataTeacher);
    }
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

  const handleOpenCheckboxApproveDialog = (e, user) => {
    e.stopPropagation();
    if (user === "Student") {
      setOpenApproveCheckboxDialogStudent(true);
    } else {
      setOpenApproveCheckboxDialogTeacher(true);
    }
  };

  const handleCloseCheckboxDeleteDialog = (user) => {
    if (user === "Student") {
      setOpenDeleteCheckboxDialogStudent(false);
    } else {
      setOpenDeleteCheckboxDialogTeacher(false);
    }
  };

  const handleCloseCheckboxApproveDialog = (user) => {
    if (user === "Student") {
      setOpenApproveCheckboxDialogStudent(false);
    } else {
      setOpenApproveCheckboxDialogTeacher(false);
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

  const retrieveUsers = () => {
    student_rows = [];
    teacher_rows = [];
    currentListBooleanStudent = [];
    currentListBooleanTeacher = [];
    console.log("retrieve users");
    if (Array.isArray(pending_students)) {
      // pending_students.map((data) => {
      pending_students
        .filter(
          (item) =>
            item.name.toLowerCase().includes(searchFilterS.toLowerCase()) ||
            item.email.toLowerCase().includes(searchFilterS.toLowerCase())
        )
        .forEach((data) => {
          userRowItem(data, "Student");
          currentListBooleanStudent.push(false);
        });
    }
    if (Array.isArray(pending_teachers)) {
      // pending_teachers.map((data) => {
      pending_teachers
        .filter(
          (item) =>
            item.name.toLowerCase().includes(searchFilterT.toLowerCase()) ||
            item.email.toLowerCase().includes(searchFilterT.toLowerCase())
        )
        .forEach((data) => {
          userRowItem(data, "Teacher");
          currentListBooleanTeacher.push(false);
        });
    }
  };

  React.useEffect(() => {
    getPendingStudents();
    getPendingTeachers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const autoReloader = () => {
    setTest(!test);
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
  // Belum dipakai sih.
  /*
  const handleSelectAllClick = (event, checked) => {
    if (checked) {
      const newSelected = student_rows.map((n) => n._id);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, item) => { // get the id by item._id
    const selectedIndex = selected.indexOf(item._id);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, item._id);
    }
    else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    }
    else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    }
    else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }
    setSelected(newSelected);
  };*/

  // Call the function to get the classes from DB
  // this function is defined above
  retrieveUsers();

  const onDeleteUser = (id) => {
    deleteUser(id);
  };
  const onApproveUser = (id) => {
    setUserActive(id);
  };

  // Delete Dialog box
  const handleOpenDeleteDialog = (e, id, name) => {
    e.stopPropagation();
    setOpenDeleteDialog(true);
    setSelectedUserId(id);
    setSelectedUserName(name);
  };

  const handleOpenApproveDialog = (e, id, name) => {
    e.stopPropagation();
    setOpenApproveDialog(true);
    setSelectedUserId(id);
    setSelectedUserName(name);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
  };

  const handleCloseApproveDialog = () => {
    setOpenApproveDialog(false);
  };

  function ApproveDialog() {
    return (
      <Dialog open={openApproveDialog} onClose={handleCloseApproveDialog}>
        <Grid container className={classes.dialogBox}>
          <Typography variant="h6" gutterBottom>
            Aktifkan pengguna berikut?
          </Typography>
          <Grid item xs={10}>
            <Typography
              align="center"
              gutterBottom
              className={classes.titleName}
            >
              <b>{selectedUserName}</b>
            </Typography>
          </Grid>
          <Grid container spacing={2} justify="center" alignItems="center">
            <Grid item>
              <Button
                onClick={() => {
                  onApproveUser(selectedUserId);
                }}
                startIcon={<CheckCircleIcon />}
                className={classes.dialogApproveButton}
              >
                Aktifkan
              </Button>
            </Grid>
            <Grid item>
              <Button
                onClick={handleCloseApproveDialog}
                startIcon={<CancelIcon />}
                className={classes.dialogCancelButton}
              >
                Batal
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Dialog>
    );
  }

  function CheckboxDialog(type, user) {
    return (
      <>
        {type === "Approve" ? (
          user === "Student" ? (
            <Dialog
              open={openApproveCheckboxDialogStudent}
              onClose={() => handleCloseCheckboxApproveDialog("Student")}
            >
              <Grid container className={classes.dialogBox}>
                <Typography variant="h6" gutterBottom align="center">
                  Aktifkan semua pengguna berikut?
                </Typography>
                {/* <Grid item container justify="center" style={{marginBottom: "20px"}}>
                  <Typography variant="h6" align="center" gutterBottom>
                    <b>{selectedUserName}</b>
                  </Typography>
                </Grid> */}
                <Grid
                  container
                  spacing={2}
                  justify="center"
                  alignItems="center"
                >
                  <Grid item>
                    <Button
                      onClick={() => {
                        handleApproveListStudent();
                      }}
                      startIcon={<CheckCircleIcon />}
                      className={classes.dialogApproveButton}
                    >
                      Aktifkan
                    </Button>
                  </Grid>
                  <Grid item>
                    <Button
                      onClick={() =>
                        handleCloseCheckboxApproveDialog("Student")
                      }
                      startIcon={<CancelIcon />}
                      className={classes.dialogCancelButton}
                    >
                      Batal
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
            </Dialog>
          ) : (
            <Dialog
              open={openApproveCheckboxDialogTeacher}
              onClose={() => handleCloseCheckboxApproveDialog("Teacher")}
            >
              <Grid container className={classes.dialogBox}>
                <Typography variant="h6" gutterBottom align="center">
                  Aktifkan semua pengguna berikut?
                </Typography>
                <Grid
                  container
                  spacing={2}
                  justify="center"
                  alignItems="center"
                >
                  <Grid item>
                    <Button
                      onClick={() => {
                        handleApproveListTeacher();
                      }}
                      startIcon={<CheckCircleIcon />}
                      className={classes.dialogApproveButton}
                    >
                      Iya
                    </Button>
                  </Grid>
                  <Grid item>
                    <Button
                      onClick={() =>
                        handleCloseCheckboxApproveDialog("Teacher")
                      }
                      startIcon={<CancelIcon />}
                      className={classes.dialogCancelButton}
                    >
                      Tidak
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
            </Dialog>
          )
        ) : user === "Student" ? (
          <Dialog
            open={openDeleteCheckboxDialogStudent}
            onClose={() => handleCloseCheckboxDeleteDialog("Student")}
          >
            <Grid container className={classes.dialogBox}>
              <Typography variant="h6" gutterBottom align="center">
                Hapus semua pengguna berikut?
              </Typography>
              <Grid container spacing={2} justify="center" alignItems="center">
                <Grid item>
                  <Button
                    onClick={() => {
                      handleDeleteListStudent();
                    }}
                    startIcon={<CheckCircleIcon />}
                    className={classes.dialogDeleteButton}
                  >
                    Iya
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
            <Grid container className={classes.dialogBox}>
              <Typography variant="h6" gutterBottom align="center">
                Hapus semua pengguna berikut?
              </Typography>
              <Grid container spacing={2} justify="center" alignItems="center">
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

  const [value, setValue] = React.useState(0)
  const handleTabs = (e, val) => {
    setValue(val)
  }
  function TabPanel(props) {
    const { children, value, index } = props;
    return (<div>
      {value === index && (
        <div>{children}</div>
      )}
    </div>)
  }

  document.title = "Schooly | Pengguna Tidak Aktif";

  return (
    <div className={classes.root}>
      <Grid container alignItems="center" spacing={2} className={classes.header}>
        <Grid item>
          <div className={classes.headerIcon}>
            <FaUserLock />
          </div>
        </Grid>
        <Grid item>
          <Typography variant="h5" align="left">
            Pengguna Tidak Aktif
          </Typography>
        </Grid>
      </Grid>
      <Tabs
        value={value}
        indicatorColor="primary"
        textColor="primary"
        onChange={handleTabs}
        className={classes.userTabs}
      >
        <Tab label={<Typography className={classes.userTabTitle}>Murid</Typography>} />
        <Tab label={<Typography className={classes.userTabTitle}>Guru</Typography>} />
      </Tabs>
      <TabPanel value={value} index={0}>
        <ManageUsersToolbar
          searchFilterHint="Cari Murid"
          role="Student"
          deleteUser={deleteUser}
          classes={classes}
          order={order_student}
          orderBy={orderBy_student}
          onRequestSort={handleRequestSort}
          rowCount={student_rows ? student_rows.length : 0}
          activateCheckboxMode={handleActivateCheckboxMode}
          deactivateCheckboxMode={handleDeactivateCheckboxMode}
          currentCheckboxMode={checkboxModeStudent}
          OpenDialogCheckboxDelete={handleOpenCheckboxDeleteDialog}
          OpenDialogCheckboxApprove={handleOpenCheckboxApproveDialog}
          // CloseDialogCheckboxDelete={handleCloseCheckboxDeleteDialog}
          // CloseDialogCheckboxApprove={handleCloseCheckboxApproveDialog}
          CheckboxDialog={CheckboxDialog}
          lengthListCheckbox={listCheckboxStudent.length}
          listCheckbox={listCheckboxStudent}
          // reloader={() => autoReloader}
          // listBooleanCheckbox={currentListBooleanStudent}
          // listBooleanCheckboxState={booleanCheckboxStudent}
          // setListBooleanCheckboxState={setBooleanCheckboxStudent}
          selectAllData={selectAllData}
          deSelectAllData={deSelectAllData}
          setSearchBarFocus={setSearchBarFocusS}
          searchBarFocus={searchBarFocusS}
          searchFilter={searchFilterS}
          updateSearchFilter={updateSearchFilterS}
        />
        <List className={classes.userList}>
          <Divider />
          {student_rows.length === 0 ? (
            <Empty />
          ) : (
            stableSort(
              student_rows,
              getComparator(order_student, orderBy_student)
            ).map((row, index) => {
              const labelId = `enhanced-table-checkbox-${index}`;
              return (
                <div>
                  <ListItem>
                    <ListItemIcon>
                    {booleanCheckboxStudent[index] ?
                      <Checkbox
                        onChange={(e) => {
                          handleChangeListStudent(e, index, row);
                          autoReloader();
                        }}
                        color="primary"
                        checked={booleanCheckboxStudent[index]}
                      />
                    :
                      <Checkbox
                        onChange={(e) => {
                          handleChangeListStudent(e, index, row);
                          autoReloader();
                        }}
                        color="primary"
                        checked={false}
                      />
                    }
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
                        <Typography variant="body2" color="textSecondary" noWrap>
                          {row.email}
                        </Typography>
                      }
                    />
                    <ListItemSecondaryAction>
                      <UserMenu
                        options={["Aktifkan", "Hapus"]}
                        role={null}
                        row={row}
                        handleOpenDeleteDialog={handleOpenDeleteDialog}
                        handleOpenDisableApproveDialog={handleOpenApproveDialog}
                      />
                    </ListItemSecondaryAction>
                  </ListItem>
                  <Divider />
                </div>
              );
            })
          )}
        </List>
      </TabPanel>
      <TabPanel value={value} index={1}>
        <ManageUsersToolbar
          searchFilterHint="Cari Guru"
          role="Teacher"
          deleteUser={deleteUser}
          classes={classes}
          order={order_teacher}
          orderBy={orderBy_teacher}
          onRequestSort={handleRequestSort}
          rowCount={teacher_rows ? teacher_rows.length : 0}
          activateCheckboxMode={handleActivateCheckboxMode}
          deactivateCheckboxMode={handleDeactivateCheckboxMode}
          currentCheckboxMode={checkboxModeTeacher}
          OpenDialogCheckboxDelete={handleOpenCheckboxDeleteDialog}
          OpenDialogCheckboxApprove={handleOpenCheckboxApproveDialog}
          // CloseDialogCheckboxDelete={handleCloseCheckboxDeleteDialog}
          // CloseDialogCheckboxApprove={handleCloseCheckboxApproveDialog}
          CheckboxDialog={CheckboxDialog}
          lengthListCheckbox={listCheckboxTeacher.length}
          listCheckbox={listCheckboxTeacher}
          // reloader={() => autoReloader}
          // listBooleanCheckbox={currentListBooleanTeacher}
          // listBooleanCheckboxState={booleanCheckboxTeacher}
          // setListBooleanCheckboxState={setBooleanCheckboxTeacher}
          selectAllData={selectAllData}
          deSelectAllData={deSelectAllData}
          setSearchBarFocus={setSearchBarFocusT}
          searchBarFocus={searchBarFocusT}
          searchFilter={searchFilterT}
          updateSearchFilter={updateSearchFilterT}
        />
        <List className={classes.userList}>
          <Divider />
          {teacher_rows.length === 0 ? (
            <Empty />
          ) : (
            stableSort(
              teacher_rows,
              getComparator(order_teacher, orderBy_teacher)
            ).map((row, index) => {
              const labelId = `enhanced-table-checkbox-${index}`;
              return (
                <div>
                  <ListItem className={classes.accountItem}>
                    <ListItemIcon>
                      {booleanCheckboxTeacher[index] ?
                        <Checkbox
                          onChange={(e) => {
                            handleChangeListTeacher(e, index, row);
                            autoReloader();
                          }}
                          color="primary"
                          checked={booleanCheckboxTeacher[index]}
                        />
                      :
                        <Checkbox
                          onChange={(e) => {
                            handleChangeListTeacher(e, index, row);
                            autoReloader();
                          }}
                          color="primary"
                          checked={false}
                        />
                      }
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
                        <Typography variant="body2" color="textSecondary" noWrap>
                          {row.email}
                        </Typography>
                      }
                    />
                    <ListItemSecondaryAction>
                      <UserMenu
                        options={["Aktifkan", "Hapus"]}
                        role={null}
                        row={row}
                        handleOpenDeleteDialog={handleOpenDeleteDialog}
                        handleOpenDisableApproveDialog={handleOpenApproveDialog}
                      />
                    </ListItemSecondaryAction>
                  </ListItem>
                  <Divider />
                </div>
              )
            })
          )}
        </List>
      </TabPanel>
      {ApproveDialog()}
      <DeleteDialog
        openDeleteDialog={openDeleteDialog}
        handleCloseDeleteDialog={handleCloseDeleteDialog}
        itemType="Pengguna"
        itemName={selectedUserName}
        deleteItem={() => {
          onDeleteUser(selectedUserId);
        }}
      />
    </div>
  );
}

ManageUsers.propTypes = {
  classesCollection: PropTypes.object.isRequired,
  getPendingStudents: PropTypes.func.isRequired,
  getPendingTeachers: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired,
  deleteUser: PropTypes.func.isRequired,
  setUserActive: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  errors: state.errors,
  auth: state.auth,
  classesCollection: state.classesCollection,
});

export default connect(mapStateToProps, {
  getPendingStudents,
  getPendingTeachers,
  deleteUser,
  setUserActive,
})(ManageUsers);
