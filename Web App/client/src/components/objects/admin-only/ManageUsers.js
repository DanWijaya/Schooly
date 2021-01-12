import React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import moment from "moment";
import "moment/locale/id";
import { setUserDisabled, getStudents, getTeachers, deleteUser } from "../../../actions/UserActions";
import { setCurrentClass, getAllClass } from "../../../actions/ClassActions";
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
import { AiOutlineUserSwitch } from 'react-icons/ai';

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
  const { classes, order, orderBy, onRequestSort, role, heading, all_students, all_teachers, all_classes_map } = props;
  // ketika fungsi ini dipanggil, all_students, all_teachers, all_classes_map sudah dipastikan tidak undefined
  const all_classes = Array.from(all_classes_map.values());

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

  // Export Import CSV Menu 
  const [csvAnchor, setCSVAnchor] = React.useState(null);
  const handleOpenCSVMenu = (event) => {
    setCSVAnchor(event.currentTarget);
  };
  const handleCloseCSVMenu = () => {
    setCSVAnchor(null);
  };

  // FIXME handleClickExport
  const handleClickExport = () => {
    let classData = {
      /* contoh isi:
        classId_1: {
          studentsEmail: [ studentEmail_1, studentEmail_2, studentEmail_3, ... ],
          classNames: className_1
        }, 
        classId_2: {
          studentsEmail: [ studentEmail_1, studentEmail_2, studentEmail_3, ... ],
          classNames: className_2
        }, 
        ...
        */
    };

    let blobData = "";
    // matrix ini digunakan untuk menghasilkan string isi file csv yang akan didownload.
    let tempMatrix = [];
    if (role === "Student") {
      for (let classInfo of all_classes) {
        classData[classInfo._id] = {
          studentsEmail: [], // *
          classNames: classInfo.name
        };
      }

      // menyimpan email-email murid suatu kelas
      for (let student of all_students) {
        classData[student.kelas].studentsEmail.push(student.email);
      }

      let classDataEntries = Object.entries(classData);
      let classCount = classDataEntries.length;

      // mencari jumlah murid untuk kelas dengan jumlah murid terbanyak 
      let maxStudentCount = classDataEntries[0][1].studentsEmail.length;
      for (let i = 1; i <= classCount - 1; i++) {
        let currentClassStdCount = classDataEntries[i][1].studentsEmail.length
        if (currentClassStdCount > maxStudentCount) {
          maxStudentCount = currentClassStdCount;
        }
      }

      // inisialisasi matrix dengan jumlah baris = jumlah murid untuk kelas dengan jumlah murid terbanyak + 1 (untuk header). 
      for (let i = 1; i <= maxStudentCount + 1; i++) {
        tempMatrix.push([]);
      }

      // mengisi matrix
      for (let entry of classDataEntries) {
        tempMatrix[0].push(entry[1].classNames);

        for (let i = 0; i <= entry[1].studentsEmail.length - 1; i++) {
          tempMatrix[i + 1].push(entry[1].studentsEmail[i]);
        }

        for (let i = entry[1].studentsEmail.length; i <= maxStudentCount - 1; i++) {
          tempMatrix[i + 1].push(undefined);
        }
      }
    } else if (role === "Teacher") {
      for (let classInfo of all_classes) {
        tempMatrix[0].push(classInfo.name);

        // semua kelas pasti punya walikelas 
        let teacherEmail;
        for (let teacher of all_teachers) {
          if (teacher._id === classInfo.walikelas) {
            teacherEmail = teacher.email;
            break;
          }
        }
        tempMatrix[1].push(teacherEmail);
      }
    }

    for (let rowArray of tempMatrix) {
      blobData += rowArray.join(",") + "\r\n";
    }
    blobData.trimEnd();

    const blob = new Blob([blobData], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '')
    a.setAttribute('href', url)
    a.setAttribute('download', 'file.csv')
    a.click();
  };

  // const [kontenCSV, setKontenCSV] = React.useState(""); // isi file csv disimpan di sini sebagai satu string panjang
  const fileInput = React.useRef(null);

  const handleClickImport = () => {
    fileInput.current.click();
  }

  const handleImportCSV = (event) => {
    event.preventDefault();

    fileInput.current.files[0].text().then((fileContent) => {
      // console.log(fileContent);

      if (role === "Student") {
        let temp = fileContent.split("\r\n");

        // membuat array yang berisi array email murid (array of csv rows)
        let dataMatrix = temp.map((rowString) => {
          return rowString.split(",");
        });

        let classNames = dataMatrix[0];
        let classId = [];

        // mengubah array header nama kelas menjadi array id kelas
        for (let className of classNames) {
          for (let storedClass of all_classes) {
            if (className === storedClass.name) {
              classId.push(storedClass._id);
              break;
            }
          }
        }

        // traverse dari kiri ke kanan, atas ke bawah
        for (let row of dataMatrix) {
          for (let i = 0; i <= classNames.length - 1; i++) {

            if (row[i] !== "") {
              
              // menginisialisasi id kelas lama dan id kelas baru 
              let newClassId = classId[i];
              let oldClassId;
              for (let storedStudent of all_students) {
                if (row[i].email === storedStudent.email) {
                  oldClassId = storedStudent.kelas;
                  break;
                }
              }

              // jika kelasnya tidak berubah, tidak lakukan apa-apa.
              // jika berubah, 
              if (newClassId !== oldClassId) {

                // if (all_classes[oldClassId]) {

                // }

              }
            }
          }
        }
      } else if (role === "Teacher") {
        
      }
      

      fileInput.current.value = "";
      // setKontenCSV(fileContent);
    }).catch((err) => {
      console.log(err);
    });
  };

  return (
    <Toolbar className={classes.toolbar}>
      <form onChange={(event) => { handleImportCSV(event) }} style={{ display: 'none' }}>
        <input type="file" ref={fileInput} accept=".csv" />
      </form>
      <Typography variant="h5">
        {heading}
      </Typography>
      <div>
        {/* ANCHOR elemen tombol export import */}
        <LightTooltip title="Ubah Kelas Sekaligus">
          <IconButton onClick={handleOpenCSVMenu} className={classes.sortButton} style={{ marginRight: "3px" }}>
            <AiOutlineUserSwitch />
          </IconButton>
        </LightTooltip>
        <Menu
          keepMounted
          anchorEl={csvAnchor}
          open={Boolean(csvAnchor)}
          onClose={handleCloseCSVMenu}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "left",
          }}
        >
          <MenuItem
            onClick={handleClickExport}
          >
            Export Data Kelas
          </MenuItem>
          <MenuItem
            onClick={handleClickImport}
          >
            Import Data Kelas
          </MenuItem>
        </Menu>
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
      </div>
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
  // ANCHOR class sortButton
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

  const { setUserDisabled, deleteUser, getTeachers, getStudents, getAllClass } = props;
  const { all_students, all_teachers, pending_users } = props.auth;
  const { all_classes_map } = props.classesCollection; 

  // console.log(all_students)

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
    getAllClass("map")
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

  // console.log(all_teachers[0])
  // console.log(pending_users)

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
      {/* ANCHOR class elemen std ManageUsersToolbar */}
      <ManageUsersToolbar
        heading="Daftar Murid"
        role="Student"
        deleteUser={deleteUser}
        classes={classes}
        order={order_student}
        orderBy={orderBy_student}
        onRequestSort={handleRequestSort}
        rowCount={student_rows ? student_rows.length : 0}
        all_classes_map={all_classes_map ? all_classes_map : null}
        all_students={all_students ? all_students : null}
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
      {/* ANCHOR class elemen tch ManageUsersToolbar */}
      <ManageUsersToolbar
        heading="Daftar Guru"
        role="Teacher"
        deleteUser={deleteUser}
        classes={classes}
        order={order_teacher}
        orderBy={orderBy_teacher}
        onRequestSort={handleRequestSort}
        rowCount={student_rows ? student_rows.length : 0}
        all_classes_map={all_classes_map ? all_classes_map : null}
        all_teachers={all_teachers ? all_teachers : null}
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
  getAllClass: PropTypes.func.isRequired,
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
    getAllSubjects, getAllTask, setUserDisabled, getStudents, getTeachers, deleteUser, getAllClass }
) (ManageUsers);
