import React from "react";
import { Link, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import moment from "moment";
import "moment/locale/id";
import {
  setUserDisabled,
  deleteUser,
  getAdmins,
} from "../../../actions/UserActions";
import Empty from "../../misc/empty/Empty";
import LightTooltip from "../../misc/light-tooltip/LightTooltip";
import UserMenu from "../../misc/menu-user/UserMenu";
import {
  Avatar,
  Button,
  IconButton,
  Dialog,
  Divider,
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
  ExpansionPanel,
  ExpansionPanelSummary,
  Tab,
  Tabs,
  AppBar,
  List,
  ListItem,
  ListItemIcon,
  ListItemSecondaryAction,
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
import DeactivateDialog from "../../misc/dialog/DeactivateDialog";
import RecentActorsIcon from "@material-ui/icons/RecentActors";
import { BiSitemap } from "react-icons/bi";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import { GoSearch } from "react-icons/go";
import ClearIcon from "@material-ui/icons/Clear";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import { FaUserCheck } from "react-icons/fa";

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

  return (
    <div>
      <div
        style={{
          display: "flex",
          flexDirection: "rows",
          alignItems: "center",
          gap: "10px",
        }}
      >
        <FaUserCheck fontSize="30px" />
        <Typography variant="h4">Pengelola Aktif</Typography>
      </div>
      <div className={classes.toolbar}>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
          }}
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

          {rowCount == 0 ? (
            <IconButton
              size="small"
              onClick={() => selectAllData(role)}
              disabled={rowCount == 0}
              className={classes.checkboxIconPrimary}
            >
              <CheckBoxOutlineBlankIcon />
            </IconButton>
          ) : listCheckbox.length === 0 ? (
            <IconButton
              style={{ marginLeft: "20%" }}
              size="small"
              onClick={() => selectAllData(role)}
            >
              <Checkbox
                icon={<CheckBoxOutlineBlankIcon htmlColor="grey" />}
                className={classes.checkboxIconPrimary}
              />
            </IconButton>
          ) : listCheckbox.length === rowCount ? (
            <IconButton
              style={{ marginLeft: "35%" }}
              size="small"
              onClick={() => deSelectAllData(role)}
            >
              <CheckBoxIcon className={classes.checkboxIconPrimary} />
            </IconButton>
          ) : (
            <IconButton
              style={{ marginLeft: "35%" }}
              size="small"
              onClick={() => deSelectAllData(role)}
            >
              <IndeterminateCheckBoxIcon
                className={classes.checkboxIconPrimary}
              />
            </IconButton>
          )}
          <>
            {CheckboxDialog("Delete", "Student")}
            <UserMenu
              actions={["Hapus"]}
              row={null}
              handleActionOnClick={[OpenDialogCheckboxDelete]}
              rowCount={listCheckbox.length === 0}
            />
          </>
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
                  fullWidth
                  variant="outlined"
                  id="searchFilterMobile"
                  value={searchFilter}
                  onChange={onChange}
                  autoFocus
                  onClick={(e) => {
                    setSearchBarFocus(true);
                  }}
                  placeholder={searchFilterHint}
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
        </div>
        <div style={{ display: "flex", alignItems: "center" }}>
          <Hidden smDown implementation="css">
            <TextField
              variant="outlined"
              id="searchFilterDesktop"
              value={searchFilter}
              onChange={onChange}
              autoFocus={searchFilter.length > 0}
              placeholder={searchFilterHint}
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
                },
              }}
            />
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
              }
            </>
          ) : (
            <>
              {lengthListCheckbox === 0 ? (
                <>
                  <LightTooltip title="Sunting Unit Pengelola">
                    <Link to="/sunting-pengelola">
                      <IconButton
                        disabled
                        className={classes.checkboxModeButton}
                      >
                        <BiSitemap />
                      </IconButton>
                    </Link>
                  </LightTooltip>
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
                  {/* {CheckboxDialog("Delete", "Teacher")}
                <LightTooltip title="Hapus Pengguna Tercentang">
                  <IconButton
                    className={classes.profileDeleteButton}
                    onClick={(e) => OpenDialogCheckboxDelete(e, "Teacher")}
                  >
                    <DeleteIcon />
                  </IconButton>
                </LightTooltip> */}
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
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
    minHeight: "unset",
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
    alignItems: "center",
  },
  dialogApproveButton: {
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
    width: "100%",
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
  titleTab: {
    fontSize: "16px",
    minWidth: "10%",
  },
}));

function ManageAdmins(props) {
  document.title = "Schooly | Daftar Pengelola";

  const classes = useStyles();

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

  const { setUserDisabled, deleteUser } = props;
  const { all_teachers, all_admins, user } = props.auth;

  let rows = [];
  console.log(all_admins);
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
    const { getAdmins } = props;
    getAdmins();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    console.log(listCheckboxStudent.length);
    console.log(listCheckboxTeacher.length);
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

  const handleCloseDisableDialog = () => {
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

  return (
    <div className={classes.root}>
      <DeactivateDialog
        open={openDisableDialog}
        onClose={handleCloseDisableDialog}
        itemName={selectedUserName}
        itemId={selectedUserId}
        onAction={onDisableUser}
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
      {/* <Divider className={classes.titleDivider} /> */}
      <ManageUsersToolbar
        heading=""
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
        //Two props added for search filter.
        searchFilter={searchFilterS}
        updateSearchFilter={updateSearchFilterS}
      />
      <Divider className={classes.subTitleDivider} />
      <Grid
        container
        direction="column"
        // spacing={2}
        // style={{ marginBottom: "100px" }}
      >
        {rows.length === 0 ? (
          <Empty />
        ) : (
          stableSort(rows, getComparator(order_student, orderBy_student)).map(
            (row, index) => {
              const labelId = `enhanced-table-checkbox-${index}`;
              let content = (
                <Link
                  style={{ color: "black" }}
                  to={{
                    pathname: `/lihat-profil/${row._id}`,
                  }}
                >
                  <div>
                    <ListItem key={row} button>
                      <ExpansionPanelSummary
                        className={classes.profilePanelSummary}
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
                                      <Checkbox
                                        onClick={(e) => {
                                          e.stopPropagation();
                                        }}
                                        onChange={(e) => {
                                          handleChangeListStudent(
                                            e,
                                            index,
                                            row
                                          );
                                          autoReloader();
                                        }}
                                        color="primary"
                                        checked={Boolean(
                                          booleanCheckboxStudent[index]
                                        )}
                                      />
                                    }
                                  />
                                </FormGroup>
                              </LightTooltip>
                            </Grid>
                          </Grid>

                          <Grid item>
                            {!row.avatar ? (
                              <ListItemAvatar>
                                <Avatar />
                              </ListItemAvatar>
                            ) : (
                              <ListItemAvatar>
                                <Avatar
                                  src={`/api/upload/avatar/${row.avatar}`}
                                />
                              </ListItemAvatar>
                            )}
                          </Grid>

                          <Grid item>
                            <Hidden smUp implementation="css">
                              <Typography variant="subtitle1" id={labelId}>
                                {row.name}
                              </Typography>
                              <Typography
                                variant="caption"
                                color="textSecondary"
                              >
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

                          <Grid
                            item
                            xs
                            container
                            spacing={1}
                            justify="flex-end"
                          >
                            <ListItemSecondaryAction
                              button
                              onClick={(e) => {
                                e.stopPropagation();
                              }}
                              onChange={(e) => {
                                e.stopPropagation();
                              }}
                            >
                              <UserMenu
                                actions={["Nonaktifkan", "Hapus"]}
                                row={row}
                                handleActionOnClick={[
                                  handleOpenDisableDialog,
                                  handleOpenDeleteDialog,
                                ]}
                              />
                            </ListItemSecondaryAction>
                          </Grid>
                        </Grid>
                      </ExpansionPanelSummary>
                    </ListItem>
                    <Divider />
                  </div>
                </Link>
              );

              return <Grid item>{content}</Grid>;
            }
          )
        )}
      </Grid>
    </div>
  );
}

ManageAdmins.propTypes = {
  classesCollection: PropTypes.object.isRequired,
  setUserDisabled: PropTypes.func.isRequired,
  getAdmins: PropTypes.func.isRequired,
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
  setUserDisabled,
  deleteUser,
  getAdmins,
})(ManageAdmins);
