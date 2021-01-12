import React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import moment from "moment";
import "moment/locale/id";
import { setUserDisabled, getStudents, getTeachers, deleteUser } from "../../../actions/UserActions";
import { setCurrentClass } from "../../../actions/ClassActions";
import { getStudentsByClass } from "../../../actions/UserActions";
import { getAllSubjects } from "../../../actions/SubjectActions";
import { getAllTask } from "../../../actions/TaskActions";
import LightTooltip from "../../misc/light-tooltip/LightTooltip";
import { Avatar, Button, IconButton, Dialog, Divider, Grid, Hidden, ListItemAvatar,
  Menu, MenuItem, TableSortLabel, Toolbar, Typography, Paper } from "@material-ui/core/";
import { makeStyles } from "@material-ui/core/styles";
import CancelIcon from "@material-ui/icons/Cancel";
import CloseIcon from "@material-ui/icons/Close";
import DeleteIcon from "@material-ui/icons/Delete";
import SortIcon from "@material-ui/icons/Sort";
import BlockIcon from "@material-ui/icons/Block";
import DeleteDialog from "../../misc/dialog/DeleteDialog";

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
  return order === "desc" ?
  (a, b) => descendingComparator(a, b, orderBy)
  :
  (a, b) => -descendingComparator(a, b, orderBy);
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

  return (
    <Toolbar className={classes.toolbar}>
      <Typography variant="h5">
        {heading}
      </Typography>
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
                :
                null
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
    maxWidth: "350px",
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
      backgroundColor: theme.palette.primary.fade,
      boxShadow: "0.2px 0.2px 0.6px 0.07px #d8d8d8"
    },
  },
  summary: {
    padding:"8px",
    paddingLeft:"20px",
    paddingRight:"20px"
  }
}));

function ManageUsers(props) {
  document.title = "Schooly | Daftar Pengguna"

  const classes = useStyles();

  const [order_student, setOrderStudent] = React.useState("asc");
  const [order_teacher, setOrderTeacher] = React.useState("asc");

  const [orderBy_student, setOrderByStudent] = React.useState("name");
  const [orderBy_teacher, setOrderByTeacher] = React.useState("name");

  const [openDeleteDialog, setOpenDeleteDialog] = React.useState(null);
  const [openDisableDialog, setOpenDisableDialog] = React.useState(null);
  const [selectedUserId, setSelectedUserId] = React.useState(null)
  const [selectedUserName, setSelectedUserName] = React.useState(null);

  const { setUserDisabled, deleteUser, getTeachers, getStudents } = props;
  const { all_students, all_teachers, pending_users } = props.auth;

  console.log(all_students)

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const retrieveUsers = () => {
    student_rows = []
    teacher_rows = []
    if(Array.isArray(all_students)){
      all_students.map((data) => userRowItem(data, "Student"))
    }
    if(Array.isArray(all_teachers)){
      all_teachers.map((data) => userRowItem(data, "Teacher"))
    }
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

  // Call the function to get the classes from DB
  // this function is defined above
  retrieveUsers()

  const onDeleteUser = (id) => {
    deleteUser(id)
  }
  const onDisableUser = (id) => {
    setUserDisabled(id)
  }
  // Delete Dialog box
  const handleOpenDeleteDialog = (e, id, name) => {
    e.preventDefault()
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

  function DisableDialog() {
    return (
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

  console.log(all_teachers[0])
  console.log(pending_users)

  return (
    <div className={classes.root}>
      {DisableDialog()}
      <DeleteDialog
        openDeleteDialog={openDeleteDialog}
        handleCloseDeleteDialog={handleCloseDeleteDialog}
        itemType="Pengguna"
        itemName={selectedUserName}
        deleteItem={() => { onDeleteUser(selectedUserId) }}
      />
      <Typography variant="h4" align="center" gutterBottom>
        Daftar Pengguna Aktif
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
      />
      <Divider variant="inset" />
      <Grid container direction="column" spacing={2} style={{marginTop: "10px", marginBottom: "75px"}}>
        {(student_rows.length === 0) ? <Typography variant="subtitle1" align="center" color="textSecondary">Kosong</Typography> :
          stableSort(student_rows, getComparator(order_student, orderBy_student))
            .map((row, index) => {
              const labelId = `enhanced-table-checkbox-${index}`;
              return (
                <Grid item>
                  <Link to={{
                      pathname:"/lihat-profil",
                      state: {
                        avatar: row.avatar,
                        nama: row.name,
                        kelas: all_students[index].kelas,
                        viewable_section: "with_karir",
                        tanggal_lahir: moment(row.tanggal_lahir).locale("id").format("DD MMMM YYYY"),
                        jenis_kelamin: all_students[index].jenis_kelamin,
                        role: "Student",
                        sekolah: row.sekolah,
                        email: row.email,
                        phone: row.phone,
                        emergency_phone : row.emergency_phone,
                        alamat: row.address,
                        hobi: all_students[index].hobi_minat,
                        ket: all_students[index].ket_non_teknis,
                        cita: all_students[index].cita_cita,
                        uni: all_students[index].uni_impian,
                        admin: true
                      }
                    }}>
                    <Paper variant="outlined" className={classes.profilePanelSummary}>
                      <Grid container spacing={0} justify="space-between" alignItems="center" className={classes.summary}>
                        <Grid item>
                          {
                            !row.avatar ?
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
                    </Paper>
                  </Link>
                </Grid>
            )
          })
        }
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
      <Divider variant="inset" />
      <Grid container direction="column" spacing={1} style={{marginTop: "10px"}}>
        {(teacher_rows.length === 0) ? <Typography variant="subtitle1" align="center" color="textSecondary">Kosong</Typography> :
          stableSort(teacher_rows, getComparator(order_teacher, orderBy_teacher))
            .map((row, index) => {
              const labelId = `enhanced-table-checkbox-${index}`;
              console.log(all_teachers[index])
              return (
                <Grid item>
                  <Link to={{
                      pathname:"/lihat-profil",
                      state: {
                        avatar: row.avatar,
                        nama: row.name,
                        subject_teached: all_teachers[index].subject_teached,
                        viewable_section: "with_karir",
                        tanggal_lahir: moment(row.tanggal_lahir).locale("id").format("DD MMMM YYYY"),
                        jenis_kelamin: all_teachers[index].jenis_kelamin,
                        role: "Teacher",
                        sekolah: row.sekolah,
                        email: row.email,
                        phone: row.phone,
                        emergency_phone : row.emergency_phone,
                        alamat: row.address,
                        hobi: all_teachers[index].hobi_minat,
                        ket: all_teachers[index].ket_non_teknis,
                        cita: all_teachers[index].cita_cita,
                        uni: all_teachers[index].uni_impian,
                        admin: true
                      }
                    }}>
                    <Paper variant="outlined" className={classes.profilePanelSummary}>
                      <Grid container spacing={0} justify="space-between" alignItems="center" className={classes.summary}>
                        <Grid item>
                          {
                            !row.avatar ?
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
                          <LightTooltip title="Lihat Profil">

                              <Link to={{
                                pathname:'/lihat-profil',
                                state: {
                                  avatar: row.avatar,
                                  nama: row.name,
                                  subject_teached: all_teachers[index].subject_teached,
                                  viewable_section: 'with_karir',
                                  tanggal_lahir: moment(row.tanggal_lahir).locale("id").format("DD MMMM YYYY"),
                                  jenis_kelamin: all_teachers[index].jenis_kelamin,
                                  role: 'Teacher',
                                  sekolah: row.sekolah,
                                  email: row.email,
                                  phone: row.phone,
                                  emergency_phone : row.emergency_phone,
                                  alamat: row.address,
                                  hobi: all_teachers[index].hobi_minat,
                                  ket: all_teachers[index].ket_non_teknis,
                                  cita: all_teachers[index].cita_cita,
                                  uni: all_teachers[index].uni_impian,
                                  admin: true
                                }
                              }}>
                                {/* <IconButton
                                    size="small"
                                    className={classes.viewMaterialButton}
                                >
                                  <PageviewIcon fontSize="small" />
                                </IconButton> */}
                              </Link>
                            </LightTooltip>
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
                    </Paper>
                  </Link>
                </Grid>
              )
            })
        }
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
  mapStateToProps, { setCurrentClass, getStudentsByClass,
    getAllSubjects, getAllTask, setUserDisabled, getStudents, getTeachers, deleteUser }
) (ManageUsers);
