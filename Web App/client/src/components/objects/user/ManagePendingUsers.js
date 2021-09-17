import React, { useEffect, useRef } from "react";
import { Link, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import moment from "moment";
import "moment/locale/id";
import {
  getPendingStudents,
  getPendingTeachers,
  deleteUser,
  setUserActive,
} from "../../../actions/UserActions";
import DeleteDialog from "../../misc/dialog/DeleteDialog";
import Empty from "../../misc/empty/Empty";
import LightTooltip from "../../misc/light-tooltip/LightTooltip";
import UserMenu from "./UserMenu";
import {
  Avatar,
  Button,
  IconButton,
  Dialog,
  Divider,
  ExpansionPanel,
  ExpansionPanelDetails,
  ExpansionPanelSummary,
  Grid,
  Hidden,
  InputAdornment,
  ListItemAvatar,
  Menu,
  MenuItem,
  TableSortLabel,
  TextField,
  Toolbar,
  Typography,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Tab,
  Tabs,
  AppBar,
  List,
  ListItem,
  ListItemIcon,
  ListItemSecondaryAction,
} from "@material-ui/core/";
import { makeStyles } from "@material-ui/core/styles";
import CloseIcon from "@material-ui/icons/Close";
import CancelIcon from "@material-ui/icons/Cancel";
import DeleteIcon from "@material-ui/icons/Delete";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import SortIcon from "@material-ui/icons/Sort";
import CheckBoxIcon from "@material-ui/icons/CheckBox";
import CheckBoxOutlineBlankIcon from "@material-ui/icons/CheckBoxOutlineBlank";
import IndeterminateCheckBoxIcon from "@material-ui/icons/IndeterminateCheckBox";
import RecentActorsIcon from "@material-ui/icons/RecentActors";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import { GoSearch } from "react-icons/go";
import ClearIcon from "@material-ui/icons/Clear";
import { FaUserLock } from "react-icons/fa";


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

const ManageUsersToolbar = (props) => {
  const {
    classes,
    order,
    orderBy,
    onRequestSort,
    role,
    heading,
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

  console.log(rowCount);

  return (
    <Toolbar className={classes.toolbar}>
      <Grid container
        style={{ justifyContent: "space-between" }}
      >
        <Grid
          style={{ display: "flex", flexDirection: "row", alignItems: "center" }}
        >

          <Hidden mdUp implementation="css">
            {searchBarFocus ? null : (
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <Typography variant="h4">{heading}</Typography>
              </div>
            )}
          </Hidden>
          <Hidden smDown implementation="css">
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Typography variant="h4">{heading}</Typography>
            </div>
          </Hidden>

          {
            rowCount == 0 ?
              <IconButton size="small" onClick={() => selectAllData(role)} disabled={rowCount == 0} className={classes.checkboxIconPrimary}>
                <CheckBoxOutlineBlankIcon />
              </IconButton>
              :
              listCheckbox.length === 0 ? (
                <IconButton style={{ marginLeft: "20%" }} size="small" onClick={() => selectAllData(role)}>
                  <Checkbox
                    icon={<CheckBoxOutlineBlankIcon htmlColor="grey" />}
                    className={classes.checkboxIconPrimary}
                  />
                </IconButton>
              ) : listCheckbox.length === rowCount ? (
                <IconButton style={{ marginLeft: "35%" }} size="small" onClick={() => deSelectAllData(role)}>
                  <CheckBoxIcon className={classes.checkboxIconPrimary} />
                </IconButton>
              ) : (
                <IconButton style={{ marginLeft: "35%" }} size="small" onClick={() => deSelectAllData(role)}>
                  <IndeterminateCheckBoxIcon
                    className={classes.checkboxIconPrimary}
                  />
                </IconButton>
              )
          }
          <div
            style={listCheckbox.length !== 0 ? { marginLeft: "13%" } : {}}
          >
            {CheckboxDialog("Delete", role)}
            {/* {CheckboxDialog("Approve", role)} */}
            {/* More menu Toolbar */}
            <UserMenu
              options={["Aktifkan", "Hapus"]}
              role={role}
              row={null}
              handleOpenDeleteDialog={OpenDialogCheckboxDelete}
              handleOpenDisableApproveDialog={OpenDialogCheckboxApprove}
              rowCount={listCheckbox.length === 0}
            />
          </div>
        </Grid>
        <Grid style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", width: "70%" }}>
          <Hidden smDown implementation="css">
            <TextField
              variant="outlined"
              id="searchFilterDesktop"
              value={searchFilter}
              onChange={onChange}
              // onClick={() => setSearchBarFocus(true)}
              // onBlur={() => setSearchBarFocus(false)}
              placeholder={searchFilterHint}
              style={{
                maxWidth: "500px",
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
                        onClear(e);
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
                  background: "#F1F3F4",
                  boxShadow: "none",
                },
              }}
              // styling di dalam input searchnya
              inputProps={{
                style: { boxShadow: "none", margin: "0 15px", borderBottom: "none" },
              }}
            />
          </Hidden>
          <Hidden mdUp implementation="css">
            {searchBarFocus ? (
              <div style={{ display: "flex" }}>
                {/* <IconButton
                onClick={() => {
                  setSearchBarFocus(false);
                  updateSearchFilter("");
                }}
              >
                <ArrowBackIcon />
              </IconButton> */}
                <TextField
                  fullWidth
                  variant="outlined"
                  id="searchFilterMobile"
                  value={searchFilter}
                  onChange={onChange}
                  autoFocus
                  onClick={(e) => setSearchBarFocus(true)}
                  placeholder={searchFilterHint}
                  style={{
                    maxWidth: "200px",
                    marginLeft: "10px",
                  }}
                  ref={searchRef}
                  inputProps={{
                    style: { boxShadow: "none", margin: "0 15px", borderBottom: "none" },
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
                            onClear(e);
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
                      background: "#F1F3F4",
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
            )}
          </Hidden>
          {role === "Student" ? (
            <>
              {
                // lengthListCheckbox === 0 ? (
                <>

                  {/* =========== MODE KOTAK CENTANG ================ */}
                  {/* <LightTooltip
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
                    {!currentCheckboxMode ? (
                      <CheckBoxIcon />
                    ) : (
                      <RecentActorsIcon />
                    )}
                  </IconButton>
                </LightTooltip> */}
                  <LightTooltip title="Urutkan Akun">
                    <IconButton
                      onClick={handleOpenSortMenu}
                      className={classes.sortButton}
                      style={{
                        display: searchBarFocus ? "none" : "block"
                      }}
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
                // ) : (
                //   <>
                //     {CheckboxDialog("Approve", "Student")}
                //     <LightTooltip title="Aktifkan Pengguna Tercentang">
                //       <IconButton
                //         style={{ marginRight: "3px" }}
                //         className={classes.profileApproveButton}
                //         onClick={(e) => OpenDialogCheckboxApprove(e, "Student")}
                //       >
                //         <CheckCircleIcon fontSize="default" />
                //       </IconButton>
                //     </LightTooltip>
                //     {CheckboxDialog("Delete", "Student")}
                //     <LightTooltip title="Hapus Pengguna Tercentang">
                //       <IconButton
                //         className={classes.profileDeleteButton}
                //         onClick={(e) => OpenDialogCheckboxDelete(e, "Student")}
                //       >
                //         <DeleteIcon fontSize="default" />
                //       </IconButton>
                //     </LightTooltip>
                //   </>
                // )
              }
            </>
          ) : (
            <>
              {lengthListCheckbox === 0 ? (
                <>
                  {/* =========== MODE KOTAK CENTANG ================ */}
                  {/* <LightTooltip
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
                    {!currentCheckboxMode ? (
                      <CheckBoxIcon />
                    ) : (
                      <RecentActorsIcon />
                    )}
                  </IconButton>
                </LightTooltip> */}
                  <LightTooltip title="Urutkan Akun">
                    <IconButton
                      onClick={handleOpenSortMenu}
                      className={classes.sortButton}
                      style={{
                        display: searchBarFocus ? "none" : "block"
                      }}
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
                </>
              )}
            </>
          )}
        </Grid>
      </Grid>
    </Toolbar>
  );
};

ManageUsersToolbar.propTypes = {
  listCheckbox: PropTypes.object.isRequired,
  lengthListCheckbox: PropTypes.number.isRequired,
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
    minHeight: "unset",
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
  sortButton: {
    color: "#757575",
    backgroundColor: "rgb(241 243 244)",
    "&:focus, &:hover": {
      backgroundColor: theme.palette.action.disabledBackground,
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
  profilePanelSummary: {
    "&:hover:not(.Mui-disabled)": {
      cursor: "default",
    },
    width: "100%"
  },
  content: {
    "&:focus, &:hover": {
      boxShadow: "0 14px 28px rgba(0,0,0,0.15), 0 10px 10px rgba(0,0,0,0.15)",
      cursor: "pointer",
    }
  },
  checkboxModeButton: {
    color: "#757575",
    backgroundColor: "rgb(241 243 244)",
    "&:focus, &:hover": {
      backgroundColor: theme.palette.action.disabledBackground,
      color: "black",
    },
    marginRight: "3px",
  },
  checkboxIconPrimary: {
    color: theme.palette.primary.main,
  },
  titleName: {
    marginTop: "10px",
    textOverflow: "ellipsis",
    overflow: "hidden",
    whiteSpace: "nowrap",
  },
  titleTab: {
    fontSize: "16px",
    minWidth: "10%"
  },
  headerIcon: {
    color: theme.palette.primary.main,
  }
}));

function ManageUsers(props) {
  document.title = "Schooly | Daftar Pengguna";

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

  console.log(listCheckboxTeacher);
  console.log(booleanCheckboxTeacher);
  console.log(student_rows);
  console.log(teacher_rows);

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
  // ============ TAB ====================
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

  console.log(pending_users);
  return (
    <div className={classes.root}>
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
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "left",
          minHeight: "46.5px",
          margin: "2rem 0",
          columnGap: "20px",
        }}
      >
        <FaUserLock
          fontSize="30px"
          className={classes.headerIcon}
        />
        <Typography variant="h4" align="left">
          Pengguna Tertunda
        </Typography>
      </div>
      {/* <Divider className={classes.titleDivider} /> */}
      {/* <AppBar position="static"
        style={{
          margin: "0 0 2rem 0",
        }}
      > */}
      <Tabs
        value={value}
        indicatorColor="primary"
        textColor="primary"
        onChange={handleTabs}
        variant="fullWidth"
        style={{
          marginBottom: "1rem",
          borderBottom: "1px solid #E0E0E0",
        }}
      >
        <Tab className={classes.titleTab} label={<span style={{ alignSelf: "flex-start" }}>Murid</span>} />
        <Tab className={classes.titleTab} label={<span style={{ alignSelf: "flex-start" }}>Guru</span>} />
      </Tabs>
      {/* </AppBar> */}
      <TabPanel value={value} index={0}>

        <ManageUsersToolbar
          heading=""
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
          //Two props added for search filter.
          searchFilter={searchFilterS}
          updateSearchFilter={updateSearchFilterS}
        />
        <Divider className={classes.subTitleDivider} />
        <Grid
          container
          direction="column"
          spacing={2}
          style={{ marginBottom: "100px" }}
        >
          <List dense>
            {student_rows.length === 0 ? (
              <Empty />
            ) : (
              stableSort(
                student_rows,
                getComparator(order_student, orderBy_student)
              ).map((row, index) => {
                const labelId = `enhanced-table-checkbox-${index}`;
                let content = (
                  // <Link
                  //   style={{ color: 'black' }}
                  //   to={{
                  //     pathname: `/lihat-profil/${row._id}`,
                  //   }}
                  // >
                  <div>
                    <ListItem key={row} role={undefined} button>
                      <ExpansionPanelSummary
                        className={classes.profilePanelSummary} style={{ cursor: "pointer" }}
                      >
                        <Grid
                          container
                          spacing={1}
                          justify="space-between"
                          alignItems="center"
                        >
                          <Grid item justify="flex-start">
                            <Grid item>
                              <LightTooltip title="Aktifkan">
                                <FormGroup>
                                  <FormControlLabel
                                    control={
                                      booleanCheckboxStudent[index] ?
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
                                  />
                                </FormGroup>
                              </LightTooltip>
                            </Grid>
                          </Grid>
                          <Hidden xsDown>
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

                          </Hidden>
                          <Grid item>
                            <Hidden smUp implementation="css">
                              <div style={{ overflow: "hidden", textOverflow: "ellipsis", width: '11rem' }}>
                                <Typography variant="subtitle1" id={labelId} noWrap>
                                  {row.name}
                                </Typography>
                                <Typography variant="caption" color="textSecondary" noWrap>
                                  {row.email}
                                </Typography>
                              </div>
                            </Hidden>
                            <Hidden xsDown implementation="css">
                              <Typography variant="h6" id={labelId} noWrap>
                                {row.name}
                              </Typography>
                              <Typography variant="body2" color="textSecondary" noWrap>
                                {row.email}
                              </Typography>
                            </Hidden>
                          </Grid>
                          {/* {!checkboxModeStudent ? ( */}
                          <Grid item xs container spacing={1} justify="flex-end">
                            <ListItemSecondaryAction
                              button
                              onClick={(e) => {
                                e.stopPropagation()
                              }}
                              onChange={(e) => {
                                e.stopPropagation()
                              }}
                            >
                              <UserMenu
                                options={["Aktifkan", "Hapus"]}
                                role={null}
                                row={row}
                                handleOpenDeleteDialog={handleOpenDeleteDialog}
                                handleOpenDisableApproveDialog={handleOpenApproveDialog}
                              />
                            </ListItemSecondaryAction>

                            {/* ========== TOMBOL AKTIF SAMPING USER ============= */}
                            {/* <Grid item>
                            <LightTooltip title="Aktifkan">
                              <IconButton
                                size="small"
                                className={classes.profileApproveButton}
                                onClick={(e) => {
                                  handleOpenApproveDialog(e, row._id, row.name);
                                }}
                              >
                                <CheckCircleIcon fontSize="small" />
                              </IconButton>
                            </LightTooltip>
                          </Grid> */}

                            {/* ========== TOMBOL HAPUS SAMPING USER ============= */}

                            {/* <Grid item>
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
                          </Grid> */}
                          </Grid>
                          {/* ) : (
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
                        )} */}
                        </Grid>
                      </ExpansionPanelSummary>
                      <Divider />
                      {/* <ExpansionPanelDetails style={{ paddingTop: "20px" }}>
                      <Grid container direction="column">
                        <Grid item>
                          <Typography variant="body1">
                            Kontak: {row.phone}
                          </Typography>
                        </Grid>
                        <Grid item>
                          <Typography variant="body1">
                            Kontak Darurat: {row.emergency_phone}
                          </Typography>
                        </Grid>
                        <Grid item>
                          <Typography variant="body1" color="textSecondary">
                            Alamat: {row.address}
                          </Typography>
                        </Grid>
                        <Grid item>
                          <Typography variant="body1" color="textSecondary">
                            Tanggal lahir:{" "}
                            {moment(row.tanggal_lahir)
                              .locale("id")
                              .format("DD MMMM YYYY")}
                          </Typography>
                        </Grid>
                      </Grid>
                    </ExpansionPanelDetails> */}
                    </ListItem>
                    <Divider />
                  </div>
                  // </Link>
                );
                return (

                  <Grid item className={classes.content}>
                    {content}
                  </Grid>

                );
              })
            )}
          </List>
        </Grid>
      </TabPanel>
      <TabPanel value={value} index={1}>

        <ManageUsersToolbar
          heading=""
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
          //Two props added for search filter.
          searchFilter={searchFilterT}
          updateSearchFilter={updateSearchFilterT}
        />
        <Divider className={classes.subTitleDivider} />
        <Grid container direction="column" spacing={2}>
          <List>
            {teacher_rows.length === 0 ? (
              <Empty />
            ) : (
              stableSort(
                teacher_rows,
                getComparator(order_teacher, orderBy_teacher)
              ).map((row, index) => {
                const labelId = `enhanced-table-checkbox-${index}`;
                let content = (


                  <div>
                    <ListItem key={row} role={undefined} button>
                      <ExpansionPanelSummary
                        className={classes.profilePanelSummary} style={{ cursor: "pointer" }}
                      >
                        <Grid
                          container
                          spacing={1}
                          justify="space-between"
                          alignItems="center"
                        >
                          <Grid item justify="flex-start">
                            <Grid item>
                              <LightTooltip title="Aktifkan">
                                <FormGroup>
                                  <FormControlLabel
                                    control={
                                      booleanCheckboxTeacher[index] ?
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
                                  />
                                </FormGroup>
                              </LightTooltip>
                            </Grid>
                          </Grid>
                          <Grid item>
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
                          </Grid>

                          <Grid item>
                            <Hidden smUp implementation="css">
                              <div style={{ overflow: "hidden", textOverflow: "ellipsis", width: '11rem' }}>

                                <Typography variant="subtitle1" id={labelId} noWrap>
                                  {row.name}
                                </Typography>
                                <Typography variant="caption" color="textSecondary" noWrap>
                                  {row.email}
                                </Typography>
                              </div>
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
                          {/* {!checkboxModeTeacher ? (
                          <Grid item xs container spacing={1} justify="flex-end">
                            <UserMenu
                              options={["Aktifkan", "Hapus"]}
                              row={row}
                              handleOpenDeleteDialog={handleOpenDeleteDialog}
                              handleOpenApproveDialog={handleOpenApproveDialog}
                            /> */}
                          {/* =============  TOMBOL AKTIFKAN SAMPING USER ================= */}
                          {/* <Grid item>
                            <LightTooltip title="Aktifkan">
                              <IconButton
                                size="small"
                                className={classes.profileApproveButton}
                                onClick={(e) => {
                                  handleOpenApproveDialog(e, row._id, row.name);
                                }}
                              >
                                <CheckCircleIcon fontSize="small" />
                              </IconButton>
                            </LightTooltip>
                          </Grid> */}

                          {/* =============  TOMBOL AKTIFKAN SAMPING USER ================= */}
                          {/* <Grid item>
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
                          </Grid> */}
                          {/* </Grid>
                        ) : ( */}
                          <Grid item xs container spacing={1} justify="flex-end">
                            <Grid item>
                              {/* <LightTooltip title="Aktifkan">
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
                              </LightTooltip> */}
                              <ListItemSecondaryAction>
                                <UserMenu
                                  options={["Aktifkan", "Hapus"]}
                                  role={null}
                                  row={row}
                                  handleOpenDeleteDialog={handleOpenDeleteDialog}
                                  handleOpenDisableApproveDialog={handleOpenApproveDialog}
                                />
                              </ListItemSecondaryAction>
                            </Grid>
                          </Grid>
                        </Grid>
                      </ExpansionPanelSummary>
                      {/* <ExpansionPanelDetails style={{ paddingTop: "20px" }}>
                      <Grid container direction="column">
                        <Grid item>
                          <Typography variant="body1">
                            Kontak: {row.phone}
                          </Typography>
                        </Grid>
                        <Grid item>
                          <Typography variant="body1">
                            Kontak Darurat: {row.emergency_phone}
                          </Typography>
                        </Grid>
                        <Grid item>
                          <Typography variant="body1" color="textSecondary">
                            Alamat: {row.address}
                          </Typography>
                        </Grid>
                        <Grid item>
                          <Typography variant="body1" color="textSecondary">
                            Tanggal lahir:{" "}
                            {moment(row.tanggal_lahir)
                              .locale("id")
                              .format("DD MMMM YYYY")}
                          </Typography>
                        </Grid>
                      </Grid>
                    </ExpansionPanelDetails> */}
                    </ListItem>
                    <Divider />

                  </div>
                );
                return (
                  <Grid item className={classes.content}>
                    {content}
                  </Grid>
                )
              })
            )}
          </List>
        </Grid>
      </TabPanel>
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
