import React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { setUserDisabled, getStudents, getTeachers, deleteUser } from "../../../actions/UserActions";
import { setCurrentClass } from "../../../actions/ClassActions";
import { getStudentsByClass } from "../../../actions/UserActions";
import { getAllSubjects } from "../../../actions/SubjectActions";
import { getAllTask } from "../../../actions/TaskActions";
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
  Tab,
  Tabs,
  TableSortLabel,
  TextField,
  Typography
} from "@material-ui/core";
import {
  Block as BlockIcon,
  Cancel as CancelIcon,
  CheckBox as CheckBoxIcon,
  CheckBoxOutlineBlank as CheckBoxOutlineBlankIcon,
  CheckCircle as CheckCircleIcon,
  Clear as ClearIcon,
  IndeterminateCheckBox as IndeterminateCheckBoxIcon,
  Search as SearchIcon,
  Sort as SortIcon
} from "@material-ui/icons";
import { makeStyles } from "@material-ui/core/styles";
import { BiSitemap } from "react-icons/bi";
import { FaUserFriends } from "react-icons/fa";

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
    OpenDialogCheckboxDisable,
    CheckboxDialog,
    setSearchBarFocus,
    searchBarFocus,
    searchFilter,
    searchFilterHint,
    updateSearchFilter,
    tabValueCheck
  } = props;

  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property, role);
  };

  const headCells = [
    {
      id: "name",
      numeric: false,
      disablePadding: true,
      label: "Nama"
    },
    {
      id: "email",
      numeric: false,
      disablePadding: false,
      label: "Email"
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
      label: "Alamat"
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

  React.useEffect(() => {
    console.log(lengthListCheckbox);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  });

  // if(searchBarFocus){
  //   document.getElementById("root").addEventListener("click", function(event) {
  //     setSearchBarFocus(false);
  //   });

  // }

  // let searchRef = useRef();

  // useEffect(() => {
  //   let handler = (event) => {
  //     if (!searchRef.current.contains(event.target)) {
  //       setSearchBarFocus(false);
  //     }
  //   }
  //   document.addEventListener("mousedown", handler)
  //   return () => {
  //     document.removeEventListener("mousedown", handler);
  //   }
  // },[]);

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
              options={["Nonaktifkan", "Hapus"]}
              role={role}
              row={null}
              CheckboxDialog={CheckboxDialog}
              handleOpenDeleteDialog={OpenDialogCheckboxDelete}
              handleOpenDisableApproveDialog={OpenDialogCheckboxDisable}
              rowCount={listCheckbox.length === 0}
            />
            {CheckboxDialog("Disable", role)}
            {CheckboxDialog("Delete", role)}
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
                        style={{ visibility: !searchFilter ? "hidden" : "visible" }}
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
                <TextField
                  variant="outlined"
                  id="searchFilterMobile"
                  value={searchFilter}
                  placeholder={searchFilterHint}
                  onChange={onChange}
                  autoFocus
                  onClick={(e) => {
                    setSearchBarFocus(true)
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
                          style={{ visibility: !searchFilter ? "hidden" : "visible" }}
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
          {role === "Teacher" ? (
            <Grid item style={{ display: searchBarFocus ? "none" : "block" }}>
              <Link to="/data-ajar-guru">
                <LightTooltip title="Sunting Data Ajar Guru">
                  <IconButton>
                    <BiSitemap />
                  </IconButton>
                </LightTooltip>
              </Link>
            </Grid>
          ) : (
            null
          )}
          <Grid item style={{ display: searchBarFocus ? "none" : "block"}}>
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
      boxShadow: "0px 2px 3px 0px rgba(60,64,67,0.30), 0px 2px 8px 2px rgba(60,64,67,0.15)",
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

function ManageUsers(props) {
  const classes = useStyles();
  const { setUserDisabled, deleteUser, getTeachers, getStudents } = props;
  const { all_students, all_teachers, pending_users, user } = props.auth;

  const [order_student, setOrderStudent] = React.useState("asc");
  const [order_teacher, setOrderTeacher] = React.useState("asc");
  const [orderBy_student, setOrderByStudent] = React.useState("name");
  const [orderBy_teacher, setOrderByTeacher] = React.useState("name");
  const [openDeleteDialog, setOpenDeleteDialog] = React.useState(null);
  const [openDisableDialog, setOpenDisableDialog] = React.useState(null);
  const [selectedUserId, setSelectedUserId] = React.useState(null);
  const [selectedUserName, setSelectedUserName] = React.useState(null);
  const [searchFilterS, updateSearchFilterS] = React.useState("");
  const [searchBarFocusS, setSearchBarFocusS] = React.useState(false);
  const [searchFilterT, updateSearchFilterT] = React.useState("");
  const [searchBarFocusT, setSearchBarFocusT] = React.useState(false);

  let student_rows = [];
  let teacher_rows = [];

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

  const [
    openDisableCheckboxDialogStudent,
    setOpenDisableCheckboxDialogStudent,
  ] = React.useState(null);
  const [
    openDisableCheckboxDialogTeacher,
    setOpenDisableCheckboxDialogTeacher,
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
    console.log(listCheckboxStudent.length);
    console.log(listCheckboxTeacher.length)
    autoReloader();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listCheckboxTeacher, listCheckboxStudent]);

  const handleActivateCheckboxMode = (type) => {
    if (type === "Student") {
      setCheckboxModeStudent(true);
      // if (currentListBooleanStudent.length === student_rows.length) {
      //   setBooleanCheckboxStudent(currentListBooleanStudent);
      // }
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

  const handleDisableListStudent = () => {
    for (let i = 0; i < listCheckboxStudent.length; i++) {
      onDisableUser(listCheckboxStudent[i].row._id);
    }
    setListCheckboxStudent([]);
  };

  const handleDisableListTeacher = () => {
    for (let i = 0; i < listCheckboxTeacher.length; i++) {
      onDisableUser(listCheckboxTeacher[i].row._id);
    }
    setListCheckboxTeacher([]);
    // handleCloseCheckboxDisableDialog("Teacher");
  };

  const selectAllData = (type) => {
    console.log("Select all data is runned", type);
    if (type === "Student") {
      let allDataStudent = [];
      let booleanAllDataStudent = [];
      for (let i = 0; i < student_rows.length; i++) {
        let temp = { e: null, index: i, row: student_rows[i] };
        allDataStudent.push(temp);
        booleanAllDataStudent.push(true);
      }
      console.log(booleanAllDataStudent);
      console.log(allDataStudent);
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

  const handleOpenCheckboxDisableDialog = (e, user) => {
    e.stopPropagation();
    if (user === "Student") {
      setOpenDisableCheckboxDialogStudent(true);
    } else {
      setOpenDisableCheckboxDialogTeacher(true);
    }
  }

  // const handleOpenCheckboxApproveDialog = (e, user) => {
  //   e.stopPropagation();
  //   if (user === "Student") {
  //     setOpenApproveCheckboxDialogStudent(true)
  //   }
  //   else {
  //     setOpenApproveCheckboxDialogTeacher(true)
  //   }
  // };

  const handleCloseCheckboxDeleteDialog = (user) => {
    if (user === "Student") {
      setOpenDeleteCheckboxDialogStudent(false);
    } else {
      setOpenDeleteCheckboxDialogTeacher(false);
    }
  };

  const handleCloseCheckboxDisableDialog = (user) => {
    if (user === "Student") {
      setOpenDisableCheckboxDialogStudent(false);
    } else {
      setOpenDisableCheckboxDialogTeacher(false);
    }
  }

  // const handleCloseCheckboxApproveDialog = (user) => {
  //   if (user === "Student") {
  //     setOpenApproveCheckboxDialogStudent(false)
  //   }
  //   else {
  //     setOpenApproveCheckboxDialogTeacher(false)
  //   }
  // };

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
    if (data.role === "Student") {
      student_rows.push(temp);
    } else if (data.role === "Teacher") {
      teacher_rows.push(temp);
    }
  };

  React.useEffect(() => {
    getStudents();
    getTeachers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const retrieveUsers = () => {
    student_rows = [];
    teacher_rows = [];
    currentListBooleanStudent = [];
    currentListBooleanTeacher = [];

    if (Array.isArray(all_students)) {
      all_students
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
    if (Array.isArray(all_teachers)) {
      all_teachers
        .filter(
          (item) =>
            item.name.toLowerCase().includes(searchFilterT.toLowerCase()) ||
            item.email.toLowerCase().includes(searchFilterT.toLowerCase())
        )
        .forEach((data) => {
          userRowItem(data);
          currentListBooleanTeacher.push(false);
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
    deleteUser(id);
  };
  const onDisableUser = (id) => {
    setUserDisabled(id);
  };

  // Delete Dialog
  const handleOpenDeleteDialog = (e, id, name) => {
    e.preventDefault();
    e.stopPropagation();
    setOpenDeleteDialog(true);
    setSelectedUserId(id);
    setSelectedUserName(name);
  };
  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
  };

  // Disable Dialog
  const handleOpenDisableDialog = (e, id, name) => {
    e.stopPropagation();
    setOpenDisableDialog(true);
    setSelectedUserId(id);
    setSelectedUserName(name);
  };
  const handleCloseDisableDialog = () => {
    setOpenDisableDialog(false);
  };

  function DisableDialog() {
    return (
      <Dialog open={openDisableDialog} onClose={handleCloseDisableDialog}>
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
            <Typography variant="h6" gutterBottom>
              Nonaktifkan pengguna berikut?
            </Typography>
          </Grid>
          <Grid
            item
            container
            justify="center"
            style={{ marginBottom: "20px" }}
          >
            <Typography variant="h6" align="center" gutterBottom>
              <b>{selectedUserName}</b>
            </Typography>
          </Grid>
          <Grid
            container
            direction="row"
            justify="center"
            alignItems="center"
            spacing={2}
            style={{ marginBottom: "10px" }}
          >
            <Grid item>
              <Button
                onClick={() => {
                  onDisableUser(selectedUserId);
                }}
                startIcon={<BlockIcon />}
                className={classes.dialogDisableButton}
              >
                Nonaktifkan
              </Button>
            </Grid>
            <Grid item>
              <Button
                onClick={handleCloseDisableDialog}
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
        {user === "Student" ?
          type === "Delete" ? (
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
                    Hapus semua pengguna berikut?
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
              open={openDisableCheckboxDialogStudent}
              onClose={() => handleCloseCheckboxDisableDialog("Student")}
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
                    Nonaktifkan semua pengguna berikut?
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
                        handleDisableListStudent();
                      }}
                      startIcon={<CheckCircleIcon />}
                      className={classes.dialogDeleteButton}
                    >
                      iya
                    </Button>
                  </Grid>
                  <Grid item>
                    <Button
                      onClick={() => handleCloseCheckboxDisableDialog("Student")}
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
          : type === "Delete" ? (
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
                    Hapus semua pengguna berikut?
                  </Typography>
                </Grid>
                {/* <Grid item container justify="center" style={{marginBottom: "20px"}}>
                  <Typography variant="h6" align="center" gutterBottom>
                    <b>{selectedUserName}</b>
                  </Typography>
                </Grid> */}
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
          ) : (
            <Dialog
              open={openDisableCheckboxDialogTeacher}
              onClose={() => handleCloseCheckboxDisableDialog("Teacher")}
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
                    Nonaktifkan semua pengguna berikut?
                  </Typography>
                </Grid>
                {/* <Grid item container justify="center" style={{marginBottom: "20px"}}>
                  <Typography variant="h6" align="center" gutterBottom>
                    <b>{selectedUserName}</b>
                  </Typography>
                </Grid> */}
                <Grid
                  container
                  direction="row"
                  justify="center"
                  alignItems="center"
                >
                  <Grid item>
                    <Button
                      onClick={() => {
                        handleDisableListTeacher();
                      }}
                      startIcon={<CheckCircleIcon />}
                      className={classes.dialogDeleteButton}
                    >
                      Iya
                    </Button>
                  </Grid>
                  <Grid item>
                    <Button
                      onClick={() => handleCloseCheckboxDisableDialog("Teacher")}
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
        }
      </>
    );
  }

  // Tabs
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

  document.title = "Schooly | Pengguna Aktif";

  return (
    <div className={classes.root}>
      <Grid container alignItems="center" spacing={2} className={classes.header}>
        <Grid item>
          <div className={classes.headerIcon}>
            <FaUserFriends />
          </div>
        </Grid>
        <Grid item>
          <Typography variant="h5" align="left">
            Pengguna Aktif
          </Typography>
        </Grid>
      </Grid>
      <Tabs
        indicatorColor="primary"
        textColor="primary"
        value={value}
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
          CloseDialogCheckboxDelete={handleCloseCheckboxDeleteDialog}
          OpenDialogCheckboxDisable={handleOpenCheckboxDisableDialog}
          CloseDialogCheckboxDisable={handleCloseCheckboxDisableDialog}
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
          tabValueCheck={value === 0}
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
                            e.stopPropagation();
                          }}
                          onChange={(e) => {
                            handleChangeListStudent(e, index, row);
                            autoReloader();
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
                          <Typography variant="body2" color="textSecondary" noWrap>
                            {row.email}
                          </Typography>
                        }
                      />
                      <ListItemSecondaryAction
                        onClick={(e) => {
                          e.stopPropagation()
                        }}
                      >
                        <UserMenu
                          options={["Nonaktifkan", "Hapus"]}
                          role={null}
                          row={row}
                          handleOpenDeleteDialog={handleOpenDeleteDialog}
                          handleOpenDisableApproveDialog={handleOpenDisableDialog}
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
      <TabPanel value={value} index={1}>
        <ManageUsersToolbar
          searchFilterHint="Cari Guru"
          role="Teacher"
          deleteUser={deleteUser}
          classes={classes}
          order={order_teacher}
          orderBy={orderBy_teacher}
          onRequestSort={handleRequestSort}
          // rowCount={student_rows ? student_rows.length : 0}
          rowCount={teacher_rows ? teacher_rows.length : 0}
          activateCheckboxMode={handleActivateCheckboxMode}
          deactivateCheckboxMode={handleDeactivateCheckboxMode}
          currentCheckboxMode={checkboxModeTeacher}
          OpenDialogCheckboxDelete={handleOpenCheckboxDeleteDialog}
          // OpenDialogCheckboxApprove={handleOpenCheckboxApproveDialog}
          CloseDialogCheckboxDelete={handleCloseCheckboxDeleteDialog}
          // CloseDialogCheckboxApprove={handleCloseCheckboxApproveDialog}
          OpenDialogCheckboxDisable={handleOpenCheckboxDisableDialog}
          CloseDialogCheckboxDisable={handleCloseCheckboxDisableDialog}
          CheckboxDialog={CheckboxDialog}
          lengthListCheckbox={listCheckboxTeacher.length}
          listCheckbox={listCheckboxTeacher}
          reloader={() => autoReloader}
          listBooleanCheckbox={currentListBooleanTeacher}
          listBooleanCheckboxState={booleanCheckboxTeacher}
          setListBooleanCheckboxState={setBooleanCheckboxTeacher}
          selectAllData={selectAllData}
          deSelectAllData={deSelectAllData}
          setSearchBarFocus={setSearchBarFocusT}
          searchBarFocus={searchBarFocusT}
          //Two props added for search filter.
          searchFilter={searchFilterT}
          updateSearchFilter={updateSearchFilterT}
          tabValueCheck={value === 1}
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
                    <ListItemIcon>
                      <Checkbox
                        color="primary"
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                        onChange={(e) => {
                          handleChangeListTeacher(e, index, row);
                          autoReloader();
                        }}
                        checked={Boolean(booleanCheckboxTeacher[index])}
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
                              handleChangeListTeacher(e, index, row);
                              autoReloader();
                            }}
                            checked={Boolean(booleanCheckboxTeacher[index])}
                          />
                        }
                      />*/}
                    </ListItemIcon>
                    <Hidden xsDown>
                      {!row.avatar ? (
                        <ListItemAvatar>
                          <Avatar />
                        </ListItemAvatar>
                      ) : (
                        <ListItemAvatar>
                          <Avatar src={`/api/upload/avatar/${row.avatar}`} />
                        </ListItemAvatar>
                      )}
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
                        options={["Nonaktifkan", "Hapus"]}
                        role={null}
                        row={row}
                        handleOpenDeleteDialog={handleOpenDeleteDialog}
                        handleOpenDisableApproveDialog={handleOpenDisableDialog}
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
      {DisableDialog()}
      <DeleteDialog
        openDeleteDialog={openDeleteDialog}
        handleCloseDeleteDialog={handleCloseDeleteDialog}
        itemType="Pengguna"
        itemName={selectedUserName}
        deleteItem={() => {onDeleteUser(selectedUserId)}}
      />
    </div>
  );
}

ManageUsers.propTypes = {
  classesCollection: PropTypes.object.isRequired,
  getStudents: PropTypes.func.isRequired,
  getTeachers: PropTypes.func.isRequired,
  setUserDisabled: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired,
  deleteUser: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  errors: state.errors,
  auth: state.auth,
  classesCollection: state.classesCollection,
});

export default connect(mapStateToProps, {
  setCurrentClass,
  getStudentsByClass,
  getAllSubjects,
  getAllTask,
  setUserDisabled,
  getStudents,
  getTeachers,
  deleteUser,
})(ManageUsers);