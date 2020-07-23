import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import moment from "moment";
import "moment/locale/id";
import { setUserDisabled, getStudents, getTeachers, deleteUser } from "../../../actions/UserActions";
import LightTooltip  from "../../misc/light-tooltip/LightTooltip";
import {Avatar, Button, IconButton, Dialog, Divider, ExpansionPanel, ExpansionPanelDetails, ExpansionPanelSummary,
  Fab, Grid, Hidden, ListItemAvatar, Menu, MenuItem, TableSortLabel, Toolbar, Typography } from "@material-ui/core/";
import { makeStyles } from "@material-ui/core/styles";
import CancelIcon from "@material-ui/icons/Cancel";
import CloseIcon from "@material-ui/icons/Close";
import DeleteIcon from "@material-ui/icons/Delete";
import DeleteOutlineIcon from "@material-ui/icons/DeleteOutline";
import SortIcon from "@material-ui/icons/Sort";
import BlockIcon from '@material-ui/icons/Block';

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

function ManageUsersToolbar(props) {
  const { classes, order, orderBy, onRequestSort, role, heading } = props;

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

  return(
    <Toolbar className={classes.toolbar}>
      <Typography variant="h5" color="primary">
        <b>{heading}</b>
      </Typography>
        <LightTooltip title="Urutkan Akun">
          <Fab size="small" onClick={handleOpenSortMenu} className={classes.sortButton}>
            <SortIcon />
          </Fab>
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
    </Toolbar>
  );
};

const useStyles = makeStyles((theme) => ({
  root: {
    margin: "auto",
    maxWidth: "1000px",
    padding: "10px",
  },
  toolbar: {
    display: "flex",
    justifyContent: "space-between",
    padding: "15px",
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
    width: "350px",
    padding: "15px",
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
  dialogDeleteButton: {
    width: "150px",
    backgroundColor: theme.palette.error.dark,
    color: "white",
    "&:focus, &:hover": {
      backgroundColor: theme.palette.error.dark,
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
    backgroundColor: "white",
    "&:focus, &:hover": {
      backgroundColor: "white",
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
}));

function ManageUsers(props) {
  document.title = "Schooly | Daftar Pengguna"

  const classes = useStyles();

  const [order_student, setOrderStudent] = React.useState("asc");
  const [order_teacher, setOrderTeacher] = React.useState("asc");

  const [orderBy_student, setOrderByStudent] = React.useState("name");
  const [orderBy_teacher, setOrderByTeacher] = React.useState("name");

  const [selected, setSelected] = React.useState([]);
  const [openDeleteDialog, setOpenDeleteDialog] = React.useState(null);
  const [openDisableDialog, setOpenDisableDialog] = React.useState(null);
  const [selectedUserId, setSelectedUserId] = React.useState(null)
  const [selectedUserName, setSelectedUserName] = React.useState(null);

  const { setUserDisabled, deleteUser, getTeachers, getStudents } = props;
  const { user, all_students, all_teachers, pending_users } = props.auth;

  let student_rows = []
  let teacher_rows = []

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
  React.useEffect(() => {
    getStudents()
    getTeachers()
  }, [all_students.length, all_teachers.length])

  const retrieveUsers = () => {
    student_rows = []
    teacher_rows = []
    all_students.map((data) => userRowItem(data, "Student"))
    all_teachers.map((data) => userRowItem(data, "Teacher"))
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

  const isSelected = (name) => selected.indexOf(name) !== -1;
  const onDeleteUser = (id) => {
    deleteUser(id)
  }
  const onDisableUser = (id) => {
    setUserDisabled(id)
  }
  // Delete Dialog box
  const handleOpenDeleteDialog = (e, id, name) => {
    e.stopPropagation();
    setOpenDeleteDialog(true);
    setSelectedUserId(id)
    setSelectedUserName(name)
  };

  const handleOpenDisableDialog = (e, id, name) => {
    e.stopPropagation();
    setOpenDisableDialog(true);
    setSelectedUserId(id)
    setSelectedUserName(name)
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
  };

  const handleCloseDisableDialog = () => {
    setOpenDisableDialog(false);
  };

  function DeleteDialog() {
    return(
      <Dialog
        open={openDeleteDialog}
        onClose={handleCloseDeleteDialog}
      >
        <Grid container direction="column" alignItems="center" className={classes.dialogBox}>
          <Grid item container justify="flex-end" alignItems="flex-start">
            <IconButton
              size="small"
              onClick={handleCloseDeleteDialog}
            >
              <CloseIcon />
            </IconButton>
          </Grid>
          <Grid item container justify="center" style={{marginBottom: "20px"}}>
            <Typography variant="h5" gutterBottom>
              Hapus Pengguna berikut?
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
                onClick={() => { onDeleteUser(selectedUserId) }}
                startIcon={<DeleteOutlineIcon />}
                className={classes.dialogDeleteButton}
              >
                Hapus
              </Button>
            </Grid>
            <Grid item>
              <Button
                onClick={handleCloseDeleteDialog}
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

  function DisableDialog() {
    return(
      <Dialog
        open={openDisableDialog}
        onClose={handleCloseDisableDialog}
      >
        <Grid container direction="column" alignItems="center" className={classes.dialogBox}>
          <Grid item container justify="flex-end" alignItems="flex-start">
            <IconButton
              size="small"
              onClick={handleCloseDisableDialog}
            >
              <CloseIcon />
            </IconButton>
          </Grid>
          <Grid item container justify="center" style={{marginBottom: "20px"}}>
            <Typography variant="h5" gutterBottom>
              Nonaktifkan pengguna berikut?
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
                onClick={() => { onDisableUser(selectedUserId) }}
                startIcon={<BlockIcon />}
                className={classes.dialogDisableButton}
              >
                Nonaktifkan
              </Button>
            </Grid>
            <Grid item>
              <Button
                onClick={handleCloseDisableDialog}
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

  console.log(pending_users)
  return(
    <div className={classes.root}>
      {DisableDialog()}
      {DeleteDialog()}
      <Typography variant="h4" align="center" gutterBottom>
        Daftar Pengguna Aktif
      </Typography>
      <Divider style={{marginBottom: "20px", backgroundColor: "#2196f3"}}/>
      <ManageUsersToolbar
        heading="Daftar Murid"
        role="Student"
        deleteUser={deleteUser}
        classes={classes}
        order={order_student}
        orderBy={orderBy_student}
        onRequestSort={handleRequestSort}
        rowCount={student_rows ? student_rows.length : 0}
      />
      <Grid container direction="column" spacing={2} style={{marginBottom: "50px"}}>
        {stableSort(student_rows, getComparator(order_student, orderBy_student))
          .map((row, index) => {
            const isItemSelected = isSelected(row._id);
            const labelId = `enhanced-table-checkbox-${index}`;
            return(
              <Grid item>
                <ExpansionPanel
                  button
                  variant="outlined"
                  aria-checked={isItemSelected}
                  selected={isItemSelected}
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
                      <Grid item xs container spacing={1} justify="flex-end">
                        <Grid item>
                          <LightTooltip title="Nonaktifkan">
                            <IconButton
                              size="small"
                              style={{display: "none"}}
                              className={classes.profileDisableButton}
                              onClick={(e) =>{handleOpenDisableDialog(e, row._id, row.name)}}
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
                              onClick={(e) =>{handleOpenDeleteDialog(e, row._id, row.name)}}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </LightTooltip>
                        </Grid>
                      </Grid>
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
        rowCount={student_rows ? student_rows.length : 0}
      />
      <Grid container direction="column" spacing={2}>
        {stableSort(teacher_rows, getComparator(order_teacher, orderBy_teacher))
          .map((row, index) => {
            const isItemSelected = isSelected(row._id);
            const labelId = `enhanced-table-checkbox-${index}`;
            return(
              <Grid item>
                <ExpansionPanel
                  button
                  variant="outlined"
                  aria-checked={isItemSelected}
                  selected={isItemSelected}
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
                      <Grid item xs container spacing={1} justify="flex-end">
                        <Grid item>
                          <LightTooltip title="Nonaktifkan">
                            <IconButton
                              style={{display: "none"}}
                              size="small"
                              className={classes.profileDisableButton}
                              onClick={(e) =>{handleOpenDisableDialog(e, row._id, row.name)}}
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
                              onClick={(e) =>{handleOpenDeleteDialog(e, row._id, row.name)}}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </LightTooltip>
                        </Grid>
                      </Grid>
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
  getStudents: PropTypes.func.isRequired,
  getTeachers: PropTypes.func.isRequired,
  setUserDisabled: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired,
  deleteUser: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
}

const mapStateToProps = (state) => ({
  errors: state.errors,
  auth: state.auth,
  classesCollection: state.classesCollection,
})

export default connect(
  mapStateToProps, { setUserDisabled, getStudents, getTeachers, deleteUser }
) (ManageUsers);
