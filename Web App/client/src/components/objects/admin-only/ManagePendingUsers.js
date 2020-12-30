import React, { useCallback } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import moment from "moment";
import "moment/locale/id";
import { getPendingStudents, getPendingTeachers, deleteUser, setUserActive } from "../../../actions/UserActions";
import DeleteDialog from "../../misc/dialog/DeleteDialog";
import LightTooltip from "../../misc/light-tooltip/LightTooltip";
import {Avatar, Button, IconButton, Dialog, Divider, ExpansionPanel, ExpansionPanelDetails, ExpansionPanelSummary,
  Grid, Hidden, ListItemAvatar, Menu, MenuItem, TableSortLabel, Toolbar, Typography, 
  FormGroup, FormControlLabel, Checkbox } from "@material-ui/core/";
import { makeStyles } from "@material-ui/core/styles";
import CloseIcon from "@material-ui/icons/Close";
import CancelIcon from '@material-ui/icons/Cancel';
import DeleteIcon from "@material-ui/icons/Delete";
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import SortIcon from "@material-ui/icons/Sort";
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import IndeterminateCheckBoxIcon from '@material-ui/icons/IndeterminateCheckBox';
import { set } from "date-fns/esm";

// Source of the tables codes are from here : https://material-ui.com/components/tables/
function createData(_id, avatar, name, email, phone, emergency_phone, tanggal_lahir, address, action) {
  return { _id, avatar, name, email, phone, emergency_phone, tanggal_lahir, address, action };
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
  const { classes, order, orderBy, onRequestSort, role, heading, 
    activateCheckboxMode, deactivateCheckboxMode, currentCheckboxMode, OpenDialogCheckboxDelete, OpenDialogCheckboxApprove,
    CloseDialogCheckboxDelete, CloseDialogCheckboxApprove, CheckboxDialog, listCheckbox, 
    lengthListCheckbox, reloader, rowCount, listBooleanCheckbox, listBooleanCheckboxState, 
    setListBooleanCheckboxState, selectAllData, deSelectAllData} = props;

  console.log(listCheckbox)
  console.log(currentCheckboxMode)

  if(props.lengthListCheckbox !== lengthListCheckbox){
    console.log("Berubah")
  }

  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property, role);
  };

  const headCells = [
    { id: "name", numeric: false, disablePadding: true, label: "Nama" },
    { id: "email", numeric: false, disablePadding: false, label: "Email" },
    { id: "phone", numeric: true, disablePadding: false, label: "Nomor Telepon" },
    { id: "tanggal_lahir", numeric: false, disablePadding: false, label: "Tanggal Lahir" },
    { id: "address", numeric: false, disablePadding: false, label: "Alamat" },
    { id: "emergency_phone", numeric: false, disablePadding: false, label: "Nomor Telepon Darurat"}
  ];

  // Sort Menu
  const [anchorEl, setAnchorEl] = React.useState(null);
  const handleOpenSortMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleCloseSortMenu = () => {
    setAnchorEl(null);
  };

  React.useEffect(() => {
    console.log(lengthListCheckbox)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },)

  console.log(rowCount)

  const [coba, setCoba] = React.useState(null)

  return (
    <Toolbar className={classes.toolbar}>
      <div style={{display: "flex", flexDirection: "row", alignItems: "center"}}>
        <Typography variant="h5">
          {heading}
        </Typography>
        {(currentCheckboxMode && rowCount !== 0) ?
          (listCheckbox.length === 0) ?
            <IconButton onClick={() => selectAllData(role)}>
              <CheckBoxOutlineBlankIcon className={classes.checkboxIconPrimary}/>
            </IconButton>
          : (listCheckbox.length === rowCount) ?
            <IconButton onClick={() => deSelectAllData(role)}>
              <CheckBoxIcon className={classes.checkboxIconPrimary}/>
            </IconButton>
          :
            <IconButton onClick={() => deSelectAllData(role)}>
              <IndeterminateCheckBoxIcon className={classes.checkboxIconPrimary}/>
            </IconButton>
        : null}
      </div>
      <div>
        {(role === "Student") ?
          <>
            {(lengthListCheckbox === 0) ?
              <>  
                <LightTooltip title={(!currentCheckboxMode) ? "Aktifkan Mode Checkbox" : "Matikan Mode Checkbox"}>
                  <IconButton className={classes.checkboxModeButton}
                  onClick={(!currentCheckboxMode) ? () => activateCheckboxMode("Student") : () => deactivateCheckboxMode("Student")}>
                    <CheckBoxIcon />
                  </IconButton>
                </LightTooltip>
                <LightTooltip title="Urutkan Akun">
                  <IconButton onClick={handleOpenSortMenu} className={classes.sortButton}>
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
                      onClick={props.handleClosePanel}
                    >
                      <TableSortLabel
                        active={orderBy === headCell.id}
                        direction={orderBy === headCell.id ? order : "asc"}
                        onClick={createSortHandler(headCell.id)}
                      >
                        {headCell.label}
                        {orderBy === headCell.id ?
                          <span className={classes.visuallyHidden}>
                            {order === "desc" ? "sorted descending" : "sorted ascending"}
                          </span>
                          : null
                        }
                      </TableSortLabel>
                    </MenuItem>
                  ))}
                </Menu>
              </>
            :
              <>
                {CheckboxDialog("Approve", "Student")}
                <LightTooltip title="Aktifkan User Tercentang">
                  <IconButton
                    style={{marginRight: "3px"}}
                    className={classes.profileApproveButton}
                    onClick={(e) => OpenDialogCheckboxApprove(e, "Student")}
                  >
                    <CheckCircleIcon fontSize="default" />
                  </IconButton>
                </LightTooltip>
                {CheckboxDialog("Delete", "Student")}
                <LightTooltip title="Hapus User Tercentang">
                  <IconButton
                    className={classes.profileDeleteButton}
                    onClick={(e) => OpenDialogCheckboxDelete(e, "Student")}
                  >
                    <DeleteIcon fontSize="default" />
                  </IconButton>
                </LightTooltip>
              </>
            }
          </>    
        : 
          <>
            {(lengthListCheckbox === 0) ? 
              <>
                <LightTooltip title={(!currentCheckboxMode) ? "Aktifkan Mode Checkbox" : "Matikan Mode Checkbox"}>
                  <IconButton className={classes.checkboxModeButton} 
                  onClick={(!currentCheckboxMode) ? () => activateCheckboxMode("Teacher") : () => deactivateCheckboxMode("Teacher")}>
                    <CheckBoxIcon />
                  </IconButton>
                </LightTooltip>
                <LightTooltip title="Urutkan Akun">
                  <IconButton onClick={handleOpenSortMenu} className={classes.sortButton}>
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
                      onClick={props.handleClosePanel}
                    >
                      <TableSortLabel
                        active={orderBy === headCell.id}
                        direction={orderBy === headCell.id ? order : "asc"}
                        onClick={createSortHandler(headCell.id)}
                      >
                        {headCell.label}
                        {orderBy === headCell.id ?
                          <span className={classes.visuallyHidden}>
                            {order === "desc" ? "sorted descending" : "sorted ascending"}
                          </span>
                          : null
                        }
                      </TableSortLabel>
                    </MenuItem>
                  ))}
                </Menu>
              </>
            :
              <>
                {CheckboxDialog("Approve", "Teacher")}
                <LightTooltip title="Aktifkan User Tercentang">
                  <IconButton
                    className={classes.profileApproveButton}
                    onClick={(e) => OpenDialogCheckboxApprove(e, "Teacher")}
                    style={{marginRight: "3px"}}
                  >
                    <CheckCircleIcon/>
                  </IconButton>
                </LightTooltip>
                {CheckboxDialog("Delete", "Teacher")}
                <LightTooltip title="Hapus User Tercentang">
                  <IconButton
                    className={classes.profileDeleteButton}
                    onClick={(e) => OpenDialogCheckboxDelete(e, "Teacher")}
                  >
                    <DeleteIcon/>
                  </IconButton>
                </LightTooltip>
              </>
            }
          </>
        }
      </div>
    </Toolbar>
  );
};

ManageUsersToolbar.propTypes = {
  listCheckbox: PropTypes.object.isRequired,
  lengthListCheckbox: PropTypes.number.isRequired,
}

const useStyles = makeStyles((theme) => ({
  root: {
    margin: "auto",
    maxWidth: "1000px",
    padding: "10px",
  },
  titleDivider: {
    backgroundColor: theme.palette.primary.main,
    marginBottom: "20px",
  },
  toolbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0px",
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
    maxWidth: "350px",
    padding: "15px",
  },
  dialogApproveButton: {
    width: "150px",
    backgroundColor: theme.palette.success.main,
    color: "white",
    "&:focus, &:hover": {
      backgroundColor: theme.palette.success.main,
      color: "white",
    },
  },
  dialogCancelButton: {
    width: "150px",
    backgroundColor: theme.palette.primary.main,
    color: "white",
    "&:focus, &:hover": {
      backgroundColor: theme.palette.primary.main,
      color: "white",
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
    "&:hover": {
      backgroundColor: theme.palette.button.main,
    },
  },
  checkboxModeButton: {
    backgroundColor: theme.palette.action.selected,
    color: "black",
    "&:focus, &:hover": {
      backgroundColor: theme.palette.divider,
      color: "black",
    },
    marginRight: "3px"
  },
  checkboxIconPrimary: {
    color: theme.palette.primary.main
  }
}));

function ManageUsers(props) {
  document.title = "Schooly | Daftar Pengguna"

  const classes = useStyles();

  const [order_student, setOrderStudent] = React.useState("asc");
  const [order_teacher, setOrderTeacher] = React.useState("asc");

  const [orderBy_student, setOrderByStudent] = React.useState("name");
  const [orderBy_teacher, setOrderByTeacher] = React.useState("name");

  const [openApproveDialog, setOpenApproveDialog] = React.useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = React.useState(null);
  const [selectedUserId, setSelectedUserId] = React.useState(null)
  const [selectedUserName, setSelectedUserName] = React.useState(null);

  const { deleteUser, setUserActive, getPendingTeachers, getPendingStudents } = props;
  const { pending_students, pending_teachers, pending_users } = props.auth;

  let student_rows = []
  let teacher_rows = []

  // Checkbox Dialog
  const [openApproveCheckboxDialogStudent, setOpenApproveCheckboxDialogStudent] = React.useState(null);
  const [openApproveCheckboxDialogTeacher, setOpenApproveCheckboxDialogTeacher] = React.useState(null);
  const [openDeleteCheckboxDialogStudent, setOpenDeleteCheckboxDialogStudent] = React.useState(null);
  const [openDeleteCheckboxDialogTeacher, setOpenDeleteCheckboxDialogTeacher] = React.useState(null);

  // Checkbox Approve or Delete
  const [checkboxModeStudent, setCheckboxModeStudent] = React.useState(false)
  const [checkboxModeTeacher, setCheckboxModeTeacher] = React.useState(false)

  // List Checkbox
  const [listCheckboxStudent, setListCheckboxStudent] = React.useState([])
  const [listCheckboxTeacher, setListCheckboxTeacher] = React.useState([])

  const [booleanCheckboxStudent, setBooleanCheckboxStudent] = React.useState([])
  const [booleanCheckboxTeacher, setBooleanCheckboxTeacher] = React.useState([])

  const [test, setTest] = React.useState(false)

  let currentListBooleanStudent
  let currentListBooleanTeacher

  console.log(listCheckboxTeacher)
  console.log(booleanCheckboxTeacher)
  console.log(student_rows)
  console.log(teacher_rows)

  React.useEffect(() => {
    console.log(listCheckboxStudent.length)
    console.log(listCheckboxTeacher.length)
    autoReloader()
  },[listCheckboxTeacher,listCheckboxStudent])

  const handleActivateCheckboxMode = (type) => {
    if(type === "Student"){
      setCheckboxModeStudent(true)
      if(currentListBooleanStudent.length === student_rows.length){
        setBooleanCheckboxStudent(currentListBooleanStudent)
      }
    }
    else if(type === "Teacher"){
      setCheckboxModeTeacher(true)
      if(currentListBooleanTeacher.length === teacher_rows.length){
        setBooleanCheckboxTeacher(currentListBooleanTeacher)
      }
    }
  }

  const handleDeactivateCheckboxMode = (type) => {
    if(type === "Student"){
      setCheckboxModeStudent(false)
    }
    else if(type === "Teacher"){
      setCheckboxModeTeacher(false)
    }
  }

  const handleChangeListStudent = (e, index, row) => {
    let currentBooleanList = booleanCheckboxStudent
    currentBooleanList[index] = !currentBooleanList[index]
    setBooleanCheckboxStudent(currentBooleanList)
    let status = true
    let result = [];
    let temp = {checkboxEvent: e, index: index, row: row};
    for(let i=0;i<listCheckboxStudent.length;i++){
      if(listCheckboxStudent[i].row._id === row._id){
        result = listCheckboxStudent
        result.splice(i,i+1)
        status = false
        break;
      }
    }
    if(status){
      result = listCheckboxStudent
      result.push(temp)
    }
    setListCheckboxStudent(result)
  }

  const handleChangeListTeacher = (e, index, row) => {
    let currentBooleanList = booleanCheckboxTeacher
    currentBooleanList[index] = !currentBooleanList[index]
    setBooleanCheckboxTeacher(currentBooleanList)
    let status = true
    let result = [];
    let temp = {checkboxEvent: e, index: index, row: row};
    for(let i=0;i<listCheckboxTeacher.length;i++){
      if(listCheckboxTeacher[i].row._id === row._id){
        result = listCheckboxTeacher
        result.splice(i,i+1)
        status = false
        break;
      }
    }
    if(status){
      result = listCheckboxTeacher
      result.push(temp)
    }
    setListCheckboxTeacher(result)
  }

  const handleApproveListStudent = () => {
    for(let i=0;i<listCheckboxStudent.length;i++){
      onApproveUser(listCheckboxStudent[i].row._id)
    }
    setListCheckboxStudent([])
  }

  const handleApproveListTeacher = () => {
    for(let i=0;i<listCheckboxTeacher.length;i++){
      onApproveUser(listCheckboxTeacher[i].row._id)
    }
    setListCheckboxTeacher([])
  }

  const handleDeleteListStudent = () => {
    for(let i=0;i<listCheckboxStudent.length;i++){
      onDeleteUser(listCheckboxStudent[i].row._id)
    }
    setListCheckboxStudent([])
  }

  const handleDeleteListTeacher = () => {
    for(let i=0;i<listCheckboxTeacher.length;i++){
      onDeleteUser(listCheckboxTeacher[i].row._id)
    }
    setListCheckboxTeacher([])
  }

  const selectAllData = (type) => {
    if(type === "Student"){
      let allDataStudent = []
      let booleanAllDataStudent = []
      for(let i=0;i<student_rows.length;i++){
        let temp = {e: null, index: i, row: student_rows[i]}
        allDataStudent.push(temp)
        booleanAllDataStudent.push(true)
      }
      setListCheckboxStudent(allDataStudent)
      setBooleanCheckboxStudent(booleanAllDataStudent)
    }
    else{
      let allDataTeacher = []
      let booleanAllDataTeacher = []
      for(let i=0;i<teacher_rows.length;i++){
        let temp = {e: null, index: i, row: teacher_rows[i]}
        allDataTeacher.push(temp)
        booleanAllDataTeacher.push(true)
      }
      setListCheckboxTeacher(allDataTeacher)
      setBooleanCheckboxTeacher(booleanAllDataTeacher)
    }
  }

  const deSelectAllData = (type) => {
    if(type === "Student"){
      let booleanAllDataStudent = []
      for(let i=0;i<student_rows.length;i++){
        booleanAllDataStudent.push(false)
      }
      setListCheckboxStudent([])
      setBooleanCheckboxStudent(booleanAllDataStudent)
    }
    else{
      let booleanAllDataTeacher = []
      for(let i=0;i<teacher_rows.length;i++){
        booleanAllDataTeacher.push(false)
      }
      setListCheckboxTeacher([])
      setBooleanCheckboxTeacher(booleanAllDataTeacher)
    }
  }

  // Checkbox Dialog Box
  const handleOpenCheckboxDeleteDialog = (e, user) => {
    e.stopPropagation();
    if(user === "Student"){
      setOpenDeleteCheckboxDialogStudent(true)
    }
    else{
      setOpenDeleteCheckboxDialogTeacher(true)
    }
  };

  const handleOpenCheckboxApproveDialog = (e, user) => {
    e.stopPropagation();
    if(user === "Student"){
      setOpenApproveCheckboxDialogStudent(true)
    }
    else{
      setOpenApproveCheckboxDialogTeacher(true)
    }
  };

  const handleCloseCheckboxDeleteDialog = (user) => {
    if(user === "Student"){
      setOpenDeleteCheckboxDialogStudent(false)
    }
    else{
      setOpenDeleteCheckboxDialogTeacher(false)
    }
  };

  const handleCloseCheckboxApproveDialog = (user) => {
    if(user === "Student"){
      setOpenApproveCheckboxDialogStudent(false)
    }
    else{
      setOpenApproveCheckboxDialogTeacher(false)
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
    )
    if (data.role === "Student") {
      student_rows.push(temp)
    }
    else if (data.role === "Teacher") {
      teacher_rows.push(temp)
    }
  }

  const retrieveUsers = () => {
    student_rows = []
    teacher_rows = []
    currentListBooleanStudent = []
    currentListBooleanTeacher = []
    console.log("retrieve users")
    if(Array.isArray(pending_students)){
      pending_students.map((data) => {
        userRowItem(data, "Student")
        currentListBooleanStudent.push(false)
      })
    }
    if(Array.isArray(pending_teachers)){
      pending_teachers.map((data) => {
        userRowItem(data, "Teacher")
        currentListBooleanTeacher.push(false)
      })
    }
  }

  React.useEffect(() => {
    getPendingStudents()
    getPendingTeachers()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const autoReloader = () => {
    setTest(!test)
  }

  const handleRequestSort = (event, property, role) => {
    if (role === "Student") {
      const isAsc = orderBy_student === property && order_student === "asc";
      setOrderStudent(isAsc ? "desc" : "asc");
      setOrderByStudent(property);
    }
    else if (role === "Teacher") {
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
  retrieveUsers()

  const onDeleteUser = (id) => {
    deleteUser(id)
  }
  const onApproveUser = (id) => {
      setUserActive(id)
  }

  // Delete Dialog box
  const handleOpenDeleteDialog = (e, id, name) => {
    e.stopPropagation();
    setOpenDeleteDialog(true);
    setSelectedUserId(id)
    setSelectedUserName(name)
  };

  const handleOpenApproveDialog = (e, id, name) => {
    e.stopPropagation();
    setOpenApproveDialog(true);
    setSelectedUserId(id)
    setSelectedUserName(name)
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
  };

  const handleCloseApproveDialog = () => {
    setOpenApproveDialog(false);
  };

  function ApproveDialog() {
    return (
      <Dialog
        open={openApproveDialog}
        onClose={handleCloseApproveDialog}>
        <Grid container direction="column" alignItems="center" className={classes.dialogBox}>
          <Grid item container justify="flex-end" alignItems="flex-start">
            <IconButton
              size="small"
              onClick={handleCloseApproveDialog}>
              <CloseIcon />
            </IconButton>
          </Grid>
          <Grid item container justify="center" style={{marginBottom: "20px"}}>
            <Typography variant="h5" gutterBottom>
              Aktifkan pengguna berikut?
            </Typography>
          </Grid>
          <Grid item container justify="center" style={{marginBottom: "20px"}}>
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
            style={{marginBottom: "10px"}}
          >
            <Grid item>
              <Button
                onClick={() => { onApproveUser(selectedUserId) }}
                startIcon={<CheckCircleIcon />}
                className={classes.dialogApproveButton}
              >
                Aktifkan
              </Button>
            </Grid>
            <Grid item>
              <Button
                onClick={handleCloseApproveDialog}
                startIcon={< CancelIcon/>}
                className={classes.dialogCancelButton}
              >
                Batal
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Dialog>
    )
  }

  function CheckboxDialog(type, user) {
    return (
      <>
        {(type === "Approve") ?
          (user === "Student") ?
            <Dialog
              open={openApproveCheckboxDialogStudent}
              onClose={() => handleCloseCheckboxApproveDialog("Student")}>
              <Grid container direction="column" alignItems="center" className={classes.dialogBox}>
                <Grid item container justify="flex-end" alignItems="flex-start">
                  <IconButton
                    size="small"
                    onClick={() => handleCloseCheckboxApproveDialog("Student")}>
                    <CloseIcon />
                  </IconButton>
                </Grid>
                <Grid item container justify="center" style={{marginBottom: "20px"}}>
                  <Typography variant="h5" gutterBottom align="center">
                    Aktifkan semua pengguna Berikut?
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
                  style={{marginBottom: "10px"}}
                >
                  <Grid item>
                    <Button
                      onClick={() => { handleApproveListStudent() }}
                      startIcon={<CheckCircleIcon />}
                      className={classes.dialogApproveButton}
                    >
                      Aktifkan
                    </Button>
                  </Grid>
                  <Grid item>
                    <Button
                      onClick={() => handleCloseCheckboxApproveDialog("Student")}
                      startIcon={< CancelIcon/>}
                      className={classes.dialogCancelButton}
                    >
                      Batal
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
            </Dialog>
          :
            <Dialog
              open={openApproveCheckboxDialogTeacher}
              onClose={() => handleCloseCheckboxApproveDialog("Teacher")}>
              <Grid container direction="column" alignItems="center" className={classes.dialogBox}>
                <Grid item container justify="flex-end" alignItems="flex-start">
                  <IconButton
                    size="small"
                    onClick={() => handleCloseCheckboxApproveDialog("Teacher")}>
                    <CloseIcon />
                  </IconButton>
                </Grid>
                <Grid item container justify="center" style={{marginBottom: "20px"}}>
                  <Typography variant="h5" gutterBottom align="center">
                    Aktifkan semua pengguna Berikut?
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
                  style={{marginBottom: "10px"}}
                >
                  <Grid item>
                    <Button
                      onClick={() => { handleApproveListTeacher() }}
                      startIcon={<CheckCircleIcon />}
                      className={classes.dialogApproveButton}
                    >
                      Aktifkan
                    </Button>
                  </Grid>
                  <Grid item>
                    <Button
                      onClick={() => handleCloseCheckboxApproveDialog("Teacher")}
                      startIcon={< CancelIcon/>}
                      className={classes.dialogCancelButton}
                    >
                      Batal
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
            </Dialog>
        :
          (user === "Student") ?
            <Dialog
              open={openDeleteCheckboxDialogStudent}
              onClose={() => handleCloseCheckboxDeleteDialog("Student")}>
              <Grid container direction="column" alignItems="center" className={classes.dialogBox}>
                <Grid item container justify="flex-end" alignItems="flex-start">
                  <IconButton
                    size="small"
                    onClick={() => handleCloseCheckboxDeleteDialog("Student")}>
                    <CloseIcon />
                  </IconButton>
                </Grid>
                <Grid item container justify="center" style={{marginBottom: "20px"}}>
                  <Typography variant="h5" gutterBottom align="center">
                    Hapus semua pengguna Berikut?
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
                  style={{marginBottom: "10px"}}
                >
                  <Grid item>
                    <Button
                      onClick={() => { handleDeleteListStudent() }}
                      startIcon={<CheckCircleIcon />}
                      className={classes.dialogApproveButton}
                    >
                      Hapus
                    </Button>
                  </Grid>
                  <Grid item>
                    <Button
                      onClick={() => handleCloseCheckboxDeleteDialog("Student")}
                      startIcon={< CancelIcon/>}
                      className={classes.dialogCancelButton}
                    >
                      Batal
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
            </Dialog>
          :
            <Dialog
              open={openDeleteCheckboxDialogTeacher}
              onClose={() => handleCloseCheckboxDeleteDialog("Teacher")}>
              <Grid container direction="column" alignItems="center" className={classes.dialogBox}>
                <Grid item container justify="flex-end" alignItems="flex-start">
                  <IconButton
                    size="small"
                    onClick={() => handleCloseCheckboxDeleteDialog("Teacher")}>
                    <CloseIcon />
                  </IconButton>
                </Grid>
                <Grid item container justify="center" style={{marginBottom: "20px"}}>
                  <Typography variant="h5" gutterBottom align="center">
                    Hapus semua pengguna Berikut?
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
                  style={{marginBottom: "10px"}}
                >
                  <Grid item>
                    <Button
                      onClick={() => { handleDeleteListTeacher() }}
                      startIcon={<CheckCircleIcon />}
                      className={classes.dialogApproveButton}
                    >
                      Hapus
                    </Button>
                  </Grid>
                  <Grid item>
                    <Button
                      onClick={() => handleCloseCheckboxDeleteDialog("Teacher")}
                      startIcon={< CancelIcon/>}
                      className={classes.dialogCancelButton}
                    >
                      Batal
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
            </Dialog>
        }
      </>
    )
  }

  console.log(pending_users)
  return (
    <div className={classes.root}>
      {ApproveDialog()}
      <DeleteDialog
        openDeleteDialog={openDeleteDialog}
        handleCloseDeleteDialog={handleCloseDeleteDialog}
        itemType="Pengguna"
        itemName={selectedUserName}
        deleteItem={() => { onDeleteUser(selectedUserId) }}
      />
      <Typography variant="h4" align="center" gutterBottom>
        Daftar Pengguna Tertunda
      </Typography>
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
        OpenDialogCheckboxApprove={handleOpenCheckboxApproveDialog}
        CloseDialogCheckboxDelete={handleCloseCheckboxDeleteDialog}
        CloseDialogCheckboxApprove={handleCloseCheckboxApproveDialog}
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
      <Divider variant="inset" />
      <Grid container direction="column" spacing={2} style={{marginTop: "10px", marginBottom: "75px"}}>
        {stableSort(student_rows, getComparator(order_student, orderBy_student))
          .map((row, index) => {
            const labelId = `enhanced-table-checkbox-${index}`;
            return (
              <Grid item>
                <ExpansionPanel
                  button
                  variant="outlined"
                >
                  <ExpansionPanelSummary className={classes.profilePanelSummary}>
                    <Grid container spacing={1} justify="space-between" alignItems="center">
                      <Grid item>
                        {!row.avatar ?
                          <ListItemAvatar>
                            <Avatar />
                          </ListItemAvatar>
                        :
                          <ListItemAvatar>
                            <Avatar src={`/api/upload/avatar/${row.avatar}`}/>
                          </ListItemAvatar>
                        }
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
                      {(!checkboxModeStudent) ?
                        <Grid item xs container spacing={1} justify="flex-end">
                          <Grid item>
                            <LightTooltip title="Aktifkan">
                              <IconButton
                                size="small"
                                className={classes.profileApproveButton}
                                onClick={(e) =>{handleOpenApproveDialog(e, row._id, row.name)}}
                              >
                                <CheckCircleIcon fontSize="small" />
                              </IconButton>
                            </LightTooltip>
                          </Grid>
                          <Grid item>
                            <LightTooltip title="Hapus">
                              <IconButton
                                size="small"
                                className={classes.profileDeleteButton}
                                onClick={(e) =>{handleOpenDeleteDialog(e, row._id, row.name)}}
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </LightTooltip>
                          </Grid>
                        </Grid>
                      :
                        <Grid item xs container spacing={1} justify="flex-end">
                          <Grid item>
                            <LightTooltip title="Aktifkan">
                            <FormGroup>
                              <FormControlLabel
                                control={<Checkbox onChange={(e) => {
                                  handleChangeListStudent(e, index, row)
                                  autoReloader()}} color="primary" checked={booleanCheckboxStudent[index]}/>}
                              />
                            </FormGroup>
                            </LightTooltip>
                          </Grid>
                        </Grid>
                      }
                    </Grid>
                  </ExpansionPanelSummary>
                  <Divider className={classes.profilePanelDivider} />
                  <ExpansionPanelDetails>
                    <Grid conntainer direction="column">
                      <Grid item>
                        <Typography variant="body1" gutterBottom>
                          <b>Kontak:</b> {row.phone}
                        </Typography>
                      </Grid>
                      <Grid item>
                        <Typography variant="body1" gutterBottom>
                          <b>Kontak Darurat:</b> {row.emergency_phone}
                        </Typography>
                      </Grid>
                      <Grid item>
                        <Typography variant="body1" gutterBottom>
                          <b>Alamat:</b> {row.address}
                        </Typography>
                      </Grid>
                      <Grid item>
                        <Typography variant="body1" gutterBottom>
                          <b>Tanggal lahir:</b> {moment(row.tanggal_lahir).locale("id").format("DD MMMM YYYY")}
                        </Typography>
                      </Grid>
                    </Grid>
                  </ExpansionPanelDetails>
                </ExpansionPanel>
              </Grid>
            )
          })}
      </Grid>
      <ManageUsersToolbar
        heading="Daftar Guru"
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
        CloseDialogCheckboxDelete={handleCloseCheckboxDeleteDialog}
        CloseDialogCheckboxApprove={handleCloseCheckboxApproveDialog}
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
      <Divider variant="inset" />
      <Grid container direction="column" spacing={2} style={{marginTop: "10px"}}>
        {stableSort(teacher_rows, getComparator(order_teacher, orderBy_teacher))
          .map((row, index) => {
            const labelId = `enhanced-table-checkbox-${index}`;
            return (
              <Grid item>
                <ExpansionPanel
                  button
                  variant="outlined"
                >
                  <ExpansionPanelSummary className={classes.profilePanelSummary}>
                    <Grid container spacing={1} justify="space-between" alignItems="center">
                      <Grid item>
                        {!row.avatar ?
                          <ListItemAvatar>
                            <Avatar />
                          </ListItemAvatar>
                        :
                          <ListItemAvatar>
                            <Avatar src={`/api/upload/avatar/${row.avatar}`}/>
                          </ListItemAvatar>
                        }
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
                      {(!checkboxModeTeacher) ?
                        <Grid item xs container spacing={1} justify="flex-end">
                          <Grid item>
                            <LightTooltip title="Aktifkan">
                              <IconButton
                                size="small"
                                className={classes.profileApproveButton}
                                onClick={(e) =>{handleOpenApproveDialog(e, row._id, row.name)}}
                              >
                                <CheckCircleIcon fontSize="small" />
                              </IconButton>
                            </LightTooltip>
                          </Grid>
                          <Grid item>
                            <LightTooltip title="Hapus">
                              <IconButton
                                size="small"
                                className={classes.profileDeleteButton}
                                onClick={(e) =>{handleOpenDeleteDialog(e, row._id, row.name)}}
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </LightTooltip>
                          </Grid>
                        </Grid>
                      :
                        <Grid item xs container spacing={1} justify="flex-end">
                          <Grid item>
                            <LightTooltip title="Aktifkan">
                            <FormGroup>
                              <FormControlLabel
                                control={<Checkbox onChange={(e) => {
                                  handleChangeListTeacher(e, index, row)
                                  autoReloader()
                                }} color="primary" checked={booleanCheckboxTeacher[index]}/>}
                              />
                            </FormGroup>
                            </LightTooltip>
                          </Grid>
                        </Grid>
                      }
                    </Grid>
                  </ExpansionPanelSummary>
                  <Divider className={classes.profilePanelDivider} />
                  <ExpansionPanelDetails>
                    <Grid conntainer direction="column">
                      <Grid item>
                        <Typography variant="body1" gutterBottom>
                          <b>Kontak:</b> {row.phone}
                        </Typography>
                      </Grid>
                      <Grid item>
                        <Typography variant="body1" gutterBottom>
                          <b>Kontak Darurat:</b> {row.emergency_phone}
                        </Typography>
                      </Grid>
                      <Grid item>
                        <Typography variant="body1" gutterBottom>
                          <b>Alamat:</b> {row.address}
                        </Typography>
                      </Grid>
                      <Grid item>
                        <Typography variant="body1" gutterBottom>
                          <b>Tanggal lahir:</b> {moment(row.tanggal_lahir).locale("id").format("DD MMMM YYYY")}
                        </Typography>
                      </Grid>
                    </Grid>
                  </ExpansionPanelDetails>
                </ExpansionPanel>
              </Grid>
            )
          })}
      </Grid>
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
}

const mapStateToProps = (state) => ({
  errors: state.errors,
  auth: state.auth,
  classesCollection: state.classesCollection,
})

export default connect(
  mapStateToProps, { getPendingStudents, getPendingTeachers, deleteUser, setUserActive }
) (ManageUsers);
