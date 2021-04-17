import React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import moment from "moment";
import "moment/locale/id";
import {
  setUserDisabled,
  getStudents,
  getTeachers,
  deleteUser,
} from "../../../actions/UserActions";
import { setCurrentClass } from "../../../actions/ClassActions";
import { getStudentsByClass } from "../../../actions/UserActions";
import { getAllSubjects } from "../../../actions/SubjectActions";
import { getAllTask } from "../../../actions/TaskActions";
import LightTooltip from "../../misc/light-tooltip/LightTooltip";
import {
  Avatar,
  Button,
  IconButton,
  Dialog,
  Divider,
  Grid,
  Hidden,
  ListItemAvatar,
  Menu,
  MenuItem,
  TableSortLabel,
  Toolbar,
  Typography,
  FormGroup,
  FormControlLabel,
  Checkbox,
  ExpansionPanel,
  ExpansionPanelSummary,
} from "@material-ui/core/";
import { makeStyles } from "@material-ui/core/styles";
import CancelIcon from "@material-ui/icons/Cancel";
import CloseIcon from "@material-ui/icons/Close";
import DeleteIcon from "@material-ui/icons/Delete";
import SortIcon from "@material-ui/icons/Sort";
import BlockIcon from "@material-ui/icons/Block";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import CheckBoxIcon from "@material-ui/icons/CheckBox";
import CheckBoxOutlineBlankIcon from "@material-ui/icons/CheckBoxOutlineBlank";
import IndeterminateCheckBoxIcon from "@material-ui/icons/IndeterminateCheckBox";
import PageviewIcon from "@material-ui/icons/Pageview";
import DeleteDialog from "../../misc/dialog/DeleteDialog";
import RecentActorsIcon from '@material-ui/icons/RecentActors';
import { BiSitemap } from "react-icons/bi";

// Source of the tables codes are from here : https://material-ui.com/components/tables/
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
  const { classes, order, orderBy, onRequestSort, role, heading } = props;
  const {
    currentCheckboxMode,
    rowCount,
    listCheckbox,
    selectAllData,
    deSelectAllData,
    lengthListCheckbox,
    activateCheckboxMode,
    deactivateCheckboxMode,
    OpenDialogCheckboxDelete,
    CheckboxDialog,
  } = props;
  // OpenDialogCheckboxApprove

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

  return (
    <Toolbar className={classes.toolbar}>
      <div
        style={{ display: "flex", flexDirection: "row", alignItems: "center" }}
      >
        <Typography variant="h5" style={{marginRight: "8px"}}>{heading}</Typography>
        {currentCheckboxMode && rowCount !== 0 ? (
          listCheckbox.length === 0 ? (
            <IconButton size="small" onClick={() => selectAllData(role)}>
              <CheckBoxOutlineBlankIcon
                className={classes.checkboxIconPrimary}
              />
            </IconButton>
          ) : listCheckbox.length === rowCount ? (
            <IconButton size="small" onClick={() => deSelectAllData(role)}>
              <CheckBoxIcon className={classes.checkboxIconPrimary} />
            </IconButton>
          ) : (
            <IconButton size="small" onClick={() => deSelectAllData(role)}>
              <IndeterminateCheckBoxIcon
                className={classes.checkboxIconPrimary}
              />
            </IconButton>
          )
        ) : null}
      </div>
      <div>
        {role === "Student" ? (
          <>
            {lengthListCheckbox === 0 ? (
              <>
                <LightTooltip
                  title={
                    !currentCheckboxMode
                      ? "Mode Kotak Centang"
                      : "Mode Individu"
                  }
                >
                  <IconButton
                    className={classes.checkboxModeButton}
                    onClick={
                      !currentCheckboxMode
                        ? () => activateCheckboxMode("Student")
                        : () => deactivateCheckboxMode("Student")
                    }
                  >
                    {!currentCheckboxMode 
                      ? <CheckBoxIcon />
                      : <RecentActorsIcon />
                    }
                  </IconButton>
                </LightTooltip>
                <LightTooltip title="Urutkan Akun">
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
            ) : (
              <>
                {CheckboxDialog("Delete", "Student")}
                <LightTooltip title="Hapus Pengguna Tercentang">
                  <IconButton
                    className={classes.profileDeleteButton}
                    onClick={(e) => OpenDialogCheckboxDelete(e, "Student")}
                  >
                    <DeleteIcon fontSize="default" />
                  </IconButton>
                </LightTooltip>
              </>
            )}
          </>
        ) : (
          <>
            {lengthListCheckbox === 0 ? (
              <>
                <LightTooltip title="Sunting Guru (Mata Pelajaran yang Diajar)">
                  <Link to="/daftar-guru">
                    <IconButton
                      className={classes.checkboxModeButton}
                    >
                      < BiSitemap />
                    </IconButton>
                  </Link>
                </LightTooltip>
                <LightTooltip
                  title={
                    !currentCheckboxMode
                    ? "Mode Kotak Centang"
                    : "Mode Individu"
                }
                >
                  <IconButton
                    className={classes.checkboxModeButton}
                    onClick={
                      !currentCheckboxMode
                        ? () => activateCheckboxMode("Teacher")
                        : () => deactivateCheckboxMode("Teacher")
                    }
                  >
                    {!currentCheckboxMode 
                      ? <CheckBoxIcon />
                      : <RecentActorsIcon />
                    }
                  </IconButton>
                </LightTooltip>
                <LightTooltip title="Urutkan Akun">
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
            ) : (
              <>
                {/* {CheckboxDialog("Approve", "Teacher")}
                <LightTooltip title="Aktifkan Pengguna Tercentang">
                  <IconButton
                    className={classes.profileApproveButton}
                    onClick={(e) => OpenDialogCheckboxApprove(e, "Teacher")}
                    style={{ marginRight: "3px" }}
                  >
                    <CheckCircleIcon />
                  </IconButton>
                </LightTooltip> */}
                {CheckboxDialog("Delete", "Teacher")}
                <LightTooltip title="Hapus Pengguna Tercentang">
                  <IconButton
                    className={classes.profileDeleteButton}
                    onClick={(e) => OpenDialogCheckboxDelete(e, "Teacher")}
                  >
                    <DeleteIcon />
                  </IconButton>
                </LightTooltip>
              </>
            )}
          </>
        )}
      </div>
    </Toolbar>

    // <Toolbar className={classes.toolbar}>
    //   <Typography variant="h5">
    //     {heading}
    //   </Typography>
    //   <LightTooltip title="Urutkan Akun">
    //     <IconButton onClick={handleOpenSortMenu} className={classes.sortButton}>
    //       <SortIcon />
    //     </IconButton>
    //   </LightTooltip>
    //   <Menu
    //     keepMounted
    //     anchorEl={anchorEl}
    //     open={Boolean(anchorEl)}
    //     onClose={handleCloseSortMenu}
    //     anchorOrigin={{
    //       vertical: "bottom",
    //       horizontal: "right",
    //     }}
    //     transformOrigin={{
    //       vertical: "top",
    //       horizontal: "left",
    //     }}
    //   >
    //     {headCells.map((headCell, i) => (
    //       <MenuItem
    //         key={headCell.id}
    //         sortDirection={orderBy === headCell.id ? order : false}
    //         onClick={props.handleClosePanel}
    //       >
    //         <TableSortLabel
    //           active={orderBy === headCell.id}
    //           direction={orderBy === headCell.id ? order : "asc"}
    //           onClick={createSortHandler(headCell.id)}
    //         >
    //           {headCell.label}
    //           {orderBy === headCell.id ?
    //             <span className={classes.visuallyHidden}>
    //               {order === "desc" ? "sorted descending" : "sorted ascending"}
    //             </span>
    //             :
    //             null
    //           }
    //         </TableSortLabel>
    //       </MenuItem>
    //     ))}
    //   </Menu>
    // </Toolbar>
  );
}

const useStyles = makeStyles((theme) => ({
  root: {
    margin: "auto",
    maxWidth: "80%",
    [theme.breakpoints.down("md")]: {
        maxWidth: "100%",
    },
    padding: "10px",
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
  toolbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0px",
    minHeight: "unset"
  },
  viewMaterialButton: {
    backgroundColor: theme.palette.warning.main,
    color: "white",
    "&:focus, &:hover": {
      backgroundColor: "white",
      color: theme.palette.warning.main,
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
  profileDisableButton: {
    backgroundColor: theme.palette.warning.dark,
    color: "white",
    "&:focus, &:hover": {
      backgroundColor: "white",
      color: theme.palette.warning.dark,
    },
  },
  dialogBox: {
    width: "300px",
    maxWidth: "100%",
    minHeight: "175px",
    padding: "15px",
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center"
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
  profilePanelDivider: {
    backgroundColor: theme.palette.primary.main,
  },
  profilePanelSummary: {
    "&:hover:not(.Mui-disabled)": {
      cursor: "default",
    },
  },
  checkboxModeButton: {
    backgroundColor: theme.palette.action.selected,
    color: "black",
    "&:focus, &:hover": {
      backgroundColor: theme.palette.divider,
      color: "black",
    },
    marginRight: "3px",
  },
  checkboxIconPrimary: {
    color: theme.palette.primary.main,
  },
}));

function ManageUsers(props) {
  document.title = "Schooly | Daftar Pengguna";

  const classes = useStyles();

  const [order_student, setOrderStudent] = React.useState("asc");
  const [order_teacher, setOrderTeacher] = React.useState("asc");

  const [orderBy_student, setOrderByStudent] = React.useState("name");
  const [orderBy_teacher, setOrderByTeacher] = React.useState("name");

  const [openDeleteDialog, setOpenDeleteDialog] = React.useState(null);
  const [openDisableDialog, setOpenDisableDialog] = React.useState(null);
  const [selectedUserId, setSelectedUserId] = React.useState(null);
  const [selectedUserName, setSelectedUserName] = React.useState(null);

  const { setUserDisabled, deleteUser, getTeachers, getStudents } = props;
  const { all_students, all_teachers, pending_users } = props.auth;

  console.log(all_students);

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
    console.log(listCheckboxTeacher.length);
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
        // result.splice(i, i + 1)
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
        // result.splice(i, i + 1)
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

  // const handleApproveListStudent = () => {
  //   for (let i = 0; i < listCheckboxStudent.length; i++) {
  //     onApproveUser(listCheckboxStudent[i].row._id)
  //   }
  //   setListCheckboxStudent([])
  // }

  // const handleApproveListTeacher = () => {
  //   for (let i = 0; i < listCheckboxTeacher.length; i++) {
  //     onApproveUser(listCheckboxTeacher[i].row._id)
  //   }
  //   setListCheckboxTeacher([])
  // }

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
    window.scrollTo(0, 0);
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
      all_students.forEach((data) => {
        userRowItem(data, "Student");
        currentListBooleanStudent.push(false);
      });
    }
    if (Array.isArray(all_teachers)) {
      all_teachers.forEach((data) => {
        userRowItem(data, "Teacher");
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
  // Delete Dialog box
  const handleOpenDeleteDialog = (e, id, name) => {
    e.preventDefault();
    e.stopPropagation();
    setOpenDeleteDialog(true);
    setSelectedUserId(id);
    setSelectedUserName(name);
  };

  const handleOpenDisableDialog = (e, id, name) => {
    e.stopPropagation();
    setOpenDisableDialog(true);
    setSelectedUserId(id);
    setSelectedUserName(name);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
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
        )}
      </>
    );
  }

  console.log(all_teachers[0]);
  console.log(pending_users);

  return (
    <div className={classes.root}>
      {DisableDialog()}
      <DeleteDialog
        openDeleteDialog={openDeleteDialog}
        handleCloseDeleteDialog={handleCloseDeleteDialog}
        itemType="Pengguna"
        itemName={selectedUserName}
        deleteItem={() => {
          onDeleteUser(selectedUserId);
        }}
      />
      <div style={{display: "flex", alignItems: "center", justifyContent: "center", minHeight: "46.5px"}}>
        <Typography variant="h4" align="center">
          Daftar Pengguna Aktif
        </Typography>
      </div>
      <Divider className={classes.titleDivider} />
      <ManageUsersToolbar
        heading="Daftar Murid"
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
        // OpenDialogCheckboxApprove={handleOpenCheckboxApproveDialog}
        CloseDialogCheckboxDelete={handleCloseCheckboxDeleteDialog}
        // CloseDialogCheckboxApprove={handleCloseCheckboxApproveDialog}
        CheckboxDialog={CheckboxDialog}
        lengthListCheckbox={listCheckboxStudent.length}
        listCheckbox={listCheckboxStudent}
        reloader={() => autoReloader}
        listBooleanCheckbox={currentListBooleanStudent}
        listBooleanCheckboxState={booleanCheckboxStudent}
        setListBooleanCheckboxState={setBooleanCheckboxStudent}
        selectAllData={selectAllData}
        deSelectAllData={deSelectAllData}
      />
      <Divider variant="inset" className={classes.subTitleDivider}/>
      <Grid
        container
        direction="column"
        spacing={2}
        style={{ marginBottom: "32px" }}
      >
        {student_rows.length === 0 ? (
          <Typography variant="subtitle1" align="center" color="textSecondary">
            Kosong
          </Typography>
        ) : (
          stableSort(
            student_rows,
            getComparator(order_student, orderBy_student)
          ).map((row, index) => {
            const labelId = `enhanced-table-checkbox-${index}`;

            let content = (
              <ExpansionPanel
                button
                variant="outlined"
                expanded={false}
              >
                <ExpansionPanelSummary
                  className={classes.profilePanelSummary}
                >
                <Grid
                  container
                  spacing={1}
                  justify="space-between"
                  alignItems="center"
                >
                  <Grid item>
                    {!row.avatar ? (
                      <ListItemAvatar>
                        <Avatar />
                      </ListItemAvatar>
                    ) : (
                      <ListItemAvatar>
                        <Avatar src={`/api/upload/avatar/${row.avatar}`} />
                      </ListItemAvatar>
                    )}
                  </Grid>
                  <Grid item>
                    <Hidden smUp implementation="css">
                      <Typography variant="subtitle1" id={labelId}>
                        {row.name}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        {row.email}
                      </Typography>
                    </Hidden>
                    <Hidden xsDown implementation="css">
                      <Typography variant="h6" id={labelId}>
                        {row.name}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        {row.email}
                      </Typography>
                    </Hidden>
                  </Grid>
                  {!checkboxModeStudent ? (
                    <Grid item xs container spacing={1} justify="flex-end">
                      <Grid item>
                        <LightTooltip title="Nonaktifkan">
                          <IconButton
                            size="small"
                            style={{ display: "none" }}
                            className={classes.profileDisableButton}
                            onClick={(e) => {
                              handleOpenDisableDialog(e, row._id, row.name);
                            }}
                          >
                            <BlockIcon fontSize="small" />
                          </IconButton>
                        </LightTooltip>
                      </Grid>
                      <Grid item>
                        <LightTooltip title="Lihat Lebih Lanjut">
                          <Link
                              to={{
                                pathname: "/lihat-profil",
                                state: {
                                  avatar: row.avatar,
                                  nama: row.name,
                                  kelas: all_students[index].kelas,
                                  viewable_section: "with_karir",
                                  tanggal_lahir: moment(row.tanggal_lahir)
                                    .locale("id")
                                    .format("DD MMMM YYYY"),
                                  jenis_kelamin: all_students[index].jenis_kelamin,
                                  role: "Student",
                                  sekolah: row.sekolah,
                                  email: row.email,
                                  phone: row.phone,
                                  emergency_phone: row.emergency_phone,
                                  alamat: row.address,
                                  hobi: all_students[index].hobi_minat,
                                  ket: all_students[index].ket_non_teknis,
                                  cita: all_students[index].cita_cita,
                                  uni: all_students[index].uni_impian,
                                  admin: true,
                                },
                              }}
                          >
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
                        <LightTooltip title="Hapus">
                          <IconButton
                            size="small"
                            className={classes.profileDeleteButton}
                            onClick={(e) => {
                              handleOpenDeleteDialog(e, row._id, row.name);
                            }}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </LightTooltip>
                      </Grid>
                    </Grid>
                  ) : (
                    <Grid item xs container spacing={1} justify="flex-end">
                      <Grid item>
                        <LightTooltip title="Aktifkan">
                          <FormGroup>
                            <FormControlLabel
                              control={
                                <Checkbox
                                  onChange={(e) => {
                                    handleChangeListStudent(e, index, row);
                                    autoReloader();
                                  }}
                                  color="primary"
                                  checked={booleanCheckboxStudent[index]}
                                />
                              }
                            />
                          </FormGroup>
                        </LightTooltip>
                      </Grid>
                    </Grid>
                  )}
                </Grid>
                </ExpansionPanelSummary>
              </ExpansionPanel>
            );

            return (
              <Grid item>
                {content}
              </Grid>
            );
          })
        )}
      </Grid>
      <ManageUsersToolbar
        heading="Daftar Guru"
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
        CheckboxDialog={CheckboxDialog}
        lengthListCheckbox={listCheckboxTeacher.length}
        listCheckbox={listCheckboxTeacher}
        reloader={() => autoReloader}
        listBooleanCheckbox={currentListBooleanTeacher}
        listBooleanCheckboxState={booleanCheckboxTeacher}
        setListBooleanCheckboxState={setBooleanCheckboxTeacher}
        selectAllData={selectAllData}
        deSelectAllData={deSelectAllData}
      />
      <Divider variant="inset" className={classes.subTitleDivider}/>
      <Grid
        container
        direction="column"
        spacing={2}
      >
        {teacher_rows.length === 0 ? (
          <Typography variant="subtitle1" align="center" color="textSecondary">
            Kosong
          </Typography>
        ) : (
          stableSort(
            teacher_rows,
            getComparator(order_teacher, orderBy_teacher)
          ).map((row, index) => {
            const labelId = `enhanced-table-checkbox-${index}`;
            console.log(all_teachers[index]);

            let content = (
              <ExpansionPanel
                button
                variant="outlined"
                expanded={false}
              >
                <ExpansionPanelSummary
                  className={classes.profilePanelSummary}
                >
                <Grid
                  container
                  spacing={1}
                  justify="space-between"
                  alignItems="center"
                >
                  <Grid item>
                    {!row.avatar ? (
                      <ListItemAvatar>
                        <Avatar />
                      </ListItemAvatar>
                    ) : (
                      <ListItemAvatar>
                        <Avatar src={`/api/upload/avatar/${row.avatar}`} />
                      </ListItemAvatar>
                    )}
                  </Grid>
                  <Grid item>
                    <Hidden smUp implementation="css">
                      <Typography variant="subtitle1" id={labelId}>
                        {row.name}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        {row.email}
                      </Typography>
                    </Hidden>
                    <Hidden xsDown implementation="css">
                      <Typography variant="h6" id={labelId}>
                        {row.name}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        {row.email}
                      </Typography>
                    </Hidden>
                  </Grid>
                  {!checkboxModeTeacher ? (
                    <Grid item xs container spacing={1} justify="flex-end">
                      <Grid item>
                        <LightTooltip title="Lihat Lebih Lanjut">
                          <Link
                            to={{
                              pathname: "/lihat-profil",
                              state: {
                                avatar: row.avatar,
                                nama: row.name,
                                subject_teached:
                                  all_teachers[index].subject_teached,
                                viewable_section: "with_karir",
                                tanggal_lahir: moment(row.tanggal_lahir)
                                  .locale("id")
                                  .format("DD MMMM YYYY"),
                                jenis_kelamin:
                                  all_teachers[index].jenis_kelamin,
                                role: "Teacher",
                                sekolah: row.sekolah,
                                email: row.email,
                                phone: row.phone,
                                emergency_phone: row.emergency_phone,
                                alamat: row.address,
                                hobi: all_teachers[index].hobi_minat,
                                ket: all_teachers[index].ket_non_teknis,
                                cita: all_teachers[index].cita_cita,
                                uni: all_teachers[index].uni_impian,
                                admin: true,
                              },
                            }}
                          >
                            <IconButton
                              size="small"
                              className={classes.viewMaterialButton}
                            >
                              <PageviewIcon fontSize="small" />
                            </IconButton>
                          </Link>
                        </LightTooltip>
                        <LightTooltip title="Nonaktifkan">
                          <IconButton
                            size="small"
                            style={{ display: "none" }}
                            className={classes.profileDisableButton}
                            onClick={(e) => {
                              handleOpenDisableDialog(e, row._id, row.name);
                            }}
                          >
                            <BlockIcon fontSize="small" />
                          </IconButton>
                        </LightTooltip>
                      </Grid>
                      <Grid item>
                        <LightTooltip title="Hapus">
                          <IconButton
                            size="small"
                            className={classes.profileDeleteButton}
                            onClick={(e) => {
                              handleOpenDeleteDialog(e, row._id, row.name);
                            }}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </LightTooltip>
                      </Grid>
                    </Grid>
                  ) : (
                    <Grid item xs container spacing={1} justify="flex-end">
                      <Grid item>
                        <LightTooltip title="Aktifkan">
                          <FormGroup>
                            <FormControlLabel
                              control={
                                <Checkbox
                                  onChange={(e) => {
                                    handleChangeListTeacher(e, index, row);
                                    autoReloader();
                                  }}
                                  color="primary"
                                  checked={booleanCheckboxTeacher[index]}
                                />
                              }
                            />
                          </FormGroup>
                        </LightTooltip>
                      </Grid>
                    </Grid>
                  )}
                </Grid>
                </ExpansionPanelSummary>
              </ExpansionPanel>
            );

            return (
              <Grid item>
                {content}
              </Grid>
            );
          })
        )}
      </Grid>
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
