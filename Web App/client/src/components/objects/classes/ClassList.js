import React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import {
  getTeachers,
  getStudents,
  updateStudentsClass,
} from "../../../actions/UserActions";
import {
  getAllClass,
  deleteClass,
  updateClassAdmin,
} from "../../../actions/ClassActions";
import { getAllAssessments } from "../../../actions/AssessmentActions";
import { getAllTask } from "../../../actions/TaskActions";
import { clearErrors } from "../../../actions/ErrorActions";
import DeleteDialog from "../../misc/dialog/DeleteDialog";
import LightTooltip from "../../misc/light-tooltip/LightTooltip";
import {
  Avatar,
  Badge,
  Divider,
  Fab,
  Grid,
  Hidden,
  IconButton,
  Menu,
  MenuItem,
  InputAdornment,
  Paper,
  TableSortLabel,
  Typography,
  Snackbar,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button
} from "@material-ui/core";
import MuiAlert from "@material-ui/lab/Alert";
import { makeStyles } from "@material-ui/core/styles";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import SortIcon from "@material-ui/icons/Sort";
import SupervisorAccountIcon from "@material-ui/icons/SupervisorAccount";
import AccountTreeIcon from "@material-ui/icons/AccountTree";
import { GoSearch } from "react-icons/go";
import { FaChalkboardTeacher } from "react-icons/fa";
import { AiOutlineUserSwitch } from "react-icons/ai";
import ClearIcon from "@material-ui/icons/Clear";
import MenuBookIcon from "@material-ui/icons/MenuBook";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";

function createData(_id, name, homeroomTeacher, size, absent) {
  return { _id, name, homeroomTeacher, size, absent };
}

var rows = [];

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

function ClassListToolbar(props) {
  const { classes, user, order, orderBy, onRequestSort, searchFilter, updateSearchFilter, searchBarFocus, setSearchBarFocus} = props;
  const { all_students, all_teachers } = props;
  const { getStudents, handleOpenSnackbar } = props;
  const { all_classes, all_classes_map } = props.classesCollection;
  // const all_classes = Array.from(all_classes_map.values());

  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  const headCells = [
    { id: "name", numeric: false, disablePadding: true, label: "Kelas" },
    {
      id: "homeroomTeacher",
      numeric: false,
      disablePadding: false,
      label: "Wali Kelas",
    },
    { id: "size", numeric: true, disablePadding: false, label: "Jumlah Murid" },
    { id: "absent", numeric: false, disablePadding: false, label: "Absen" },
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
  const dummyClassId = "no_class";
  const dummyClassName = "belum ditempatkan";
  const [csvAnchor, setCSVAnchor] = React.useState(null);
  const handleOpenCSVMenu = (event) => {
    setCSVAnchor(event.currentTarget);
  };
  const handleCloseCSVMenu = () => {
    setCSVAnchor(null);
  };

  const onChange = (e) => {
    updateSearchFilter(e.target.value);
  };

  const onClear = (e) => {
    updateSearchFilter("");
  };

  const handleClickExport = () => {
    if (!all_students || !all_teachers || !all_classes_map) {
      return;
    }

    let classData = {
      [dummyClassId]: {
        studentsEmail: [], // semua murid di kelas dummy ini merupakan murid yang belum ditempatkan ke kelas manapun
        classNames: dummyClassName,
      }
    };
    /* contoh isi:
      {
        classId_1: {
          studentsEmail: [ studentEmail_1, studentEmail_2, studentEmail_3, ... ], -> semua murid anggota kelas ini
          classNames: className_1
        },
        classId_2: {
          studentsEmail: [ studentEmail_1, studentEmail_2, studentEmail_3, ... ],
          classNames: className_2
        },
        ...
      } key -> id semua kelas yang ada di db
    */

    let blobData = "";
    // matrix ini digunakan untuk menghasilkan string isi file csv yang akan didownload.
    let tempMatrix = [];
    /* contoh isi:
      [
        [nama_kelas_1, nama_kelas_2, nama_kelas_3, ...]
        [email_murid_1_anggota_kelas_1, email_murid_1_anggota_kelas_2, email_murid_1_anggota_kelas_3, ...]
        [email_murid_2_anggota_kelas_1, undefined                    , email_murid_2_anggota_kelas_3, ...]
        [email_murid_3_anggota_kelas_1, undefined                    , undefined                    , ...]
      ]
    */
    for (let classInfo of all_classes) {
      classData[classInfo._id] = {
        studentsEmail: [],
        classNames: classInfo.name,
      };
    }

    // menyimpan email-email murid suatu kelas
    for (let student of all_students) {
      if (student.kelas) {
        classData[student.kelas].studentsEmail.push(student.email);
      } else {
        classData[dummyClassId].studentsEmail.push(student.email);
      }
    }

    let classDataEntries = Object.entries(classData);
    let classCount = classDataEntries.length;

    // mencari jumlah murid untuk kelas dengan jumlah murid terbanyak
    let maxStudentCount = classDataEntries[0][1].studentsEmail.length;
    for (let i = 1; i <= classCount - 1; i++) {
      let currentClassStdCount = classDataEntries[i][1].studentsEmail.length;
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
      // menyimpan nama kelas di baris pertama
      tempMatrix[0].push(entry[1].classNames);

      // dari "atas ke bawah" kolom, masukan email semua murid anggota kelas ini
      for (let i = 0; i <= entry[1].studentsEmail.length - 1; i++) {
        // i itu index baris. pengisian mulai dari i + 1 karena baris pertama sudah diisi nama kelas.
        tempMatrix[i + 1].push(entry[1].studentsEmail[i]);
      }

      // jika semua email murid untuk kelas ini sudah dimasukan ke kolom, isi sisa baris kolom ini dengan undefined
      for (
        let i = entry[1].studentsEmail.length + 1;
        i <= maxStudentCount;
        i++
      ) {
        tempMatrix[i].push(undefined);
      }
    }

    for (let rowArray of tempMatrix) {
      blobData += rowArray.join(",") + "\r\n";
    }
    blobData.trimEnd();

    const blob = new Blob([blobData], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.setAttribute("hidden", "");
    a.setAttribute("href", url);
    a.setAttribute("download", "data_kelas.csv");
    a.click();
  };

  const fileInput = React.useRef(null);

  const handleClickImport = () => {
    fileInput.current.click();
  };

  const invalidEmails = React.useRef([]);
  const handleImportCSV = (event) => {
    event.preventDefault();
    invalidEmails.current = []; // digunakan untuk menampilkan semua email murid yang tidak ditemukan di database
    // if (!all_students || !all_teachers || !all_classes_map || !tasksCollection || !all_assessments) {
    if (!all_students || !all_teachers || !all_classes_map) {
      return;
    }

    fileInput.current.files[0]
      .text()
      .then((fileContent) => {
        let temp = fileContent.split("\r\n");
        if (temp.length === 0) {
          console.log("Isi file CSV kosong");
          return;
        }

        // membuat array yang berisi array email murid (array of csv rows)
        let dataMatrix = temp.map((rowString) => {
          return rowString.split(",");
        });

        let classNames = dataMatrix[0];
        if (classNames.includes("")) {
          throw new Error(
            `Masih ada nama kelas yang kosong pada kolom ${
              classNames.findIndex((name) => name === "") + 1
            }, mohon periksa kembali`
          );
        }
        let classId = [];

        // mengubah array header nama kelas menjadi array id kelas
        for (let className of classNames) {
          let id;
          for (let storedClass of all_classes) {
            if (className === storedClass.name) {
              id = storedClass._id;
              break;
            }
          }
          // jika kelas ini ada di db,
          if (id) {
            if (classId.includes(id)) {
              throw new Error(
                `Terdapat duplikasi nama kelas "${className}", mohon periksa kembali`
              );
            } else {
              classId.push(id);
            }
          } else {
            // jika kelas ini tidak ada di db,

            if (className === dummyClassName) {
              classId.push(dummyClassId);
            } else {
              throw new Error(
                `Kelas bernama "${className}" tidak terdaftar di basisdata, mohon periksa kembali`
              );
            }
          }
        }

        let classesToUpdate = {}; // digunakan untuk menghapus id murid pengurus kelas pada kelas-kelas tertentu
        let newClassParticipant = {}; // digunakan untuk mengubah kelas murid-murid yang pindah kelas
        let allStudentEmail = new Set(); // digunakan untuk mengecek duplikasi email
        // traverse dari kiri ke kanan, atas ke bawah
        for (let row = 1; row <= dataMatrix.length - 1; row++) {
          for (let column = 0; column <= classNames.length - 1; column++) {
            // jika sel tidak ada atau berisi string kosong, tidak lakukan apa-apa
            // jika sel berisi email murid,
            let currentEmail = dataMatrix[row][column];
            if (
              currentEmail !== "" &&
              currentEmail !== undefined
            ) {
              // cek duplikasi email
              if (allStudentEmail.has(currentEmail)) {
                throw new Error(
                  `Terdapat duplikasi email "${currentEmail}", mohon periksa kembali`
                );
              }
              allStudentEmail.add(currentEmail);

              // mencari id kelas lama, id kelas baru, dan id murid dengan menggunakan kriteria pencarian berupa email murid
              let newClassId = classId[column];
              let oldClassId;
              let studentId;
              for (let storedStudent of all_students) {
                if (currentEmail === storedStudent.email) {
                  oldClassId = storedStudent.kelas;
                  studentId = storedStudent._id;
                  break;
                }
              }
              if (studentId) {
                // jika murid ini tidak dipindahkan ke kelas lain, tidak lakukan apa-apa
                // jika murid ini dipindahkan ke kelas lain,
                if (newClassId !== oldClassId) {
                  //  jika murid ini merupakan ketua kelas/bendahara/sekretaris pada kelas sebelumnya, ubah info kelas sebelumnya
                  let oldClassInfo;
                  let fieldToDelete = [];

                  // jika murid ini dipindahkan dari suatu kelas,
                  if (oldClassId) {
                    oldClassInfo = all_classes_map.get(oldClassId);

                    if (oldClassInfo.ketua_kelas === studentId) {
                      fieldToDelete.push("ketua_kelas");
                    }
                    if (oldClassInfo.bendahara === studentId) {
                      fieldToDelete.push("bendahara");
                    }
                    if (oldClassInfo.sekretaris === studentId) {
                      fieldToDelete.push("sekretaris");
                    }

                    if (fieldToDelete.length > 0) {
                      classesToUpdate[oldClassId] = fieldToDelete;
                    }
                  } else {
                    // jika sebelumnya, murid ini belum ditempatkan di kelas manapun,

                    // jika murid ini tidak ditempatkan di kelas manapun lagi
                    if (newClassId === dummyClassId) {
                      // do nothing (skip langkah di bawah)
                      continue;
                    }
                  }

                  // catat id murid yang akan dipindahkan ke kelas ini
                  if (newClassParticipant[newClassId]) {
                    newClassParticipant[newClassId].push(studentId);
                  } else {
                    newClassParticipant[newClassId] = [studentId];
                  }
                }
              } else {
                // jika murid ini tidak ada di database,
                invalidEmails.current.push(currentEmail);
                // throw new Error(`Murid yang memiliki email "${row[i].email}" tidak terdaftar di basisdata`);
                // console.log(
                //   `Murid yang memiliki email "${currentEmail}" tidak terdaftar di basisdata`
                // );
              }
            }
          }
        }

        if (Object.keys(classesToUpdate).length !== 0) {
          updateClassAdmin(classesToUpdate)
            .then(() => {
              console.log("Penghapusan pengurus kelas berhasil dilakukan");
            })
            .catch((err) => {
              console.log(err);
            });
        }

        if (Object.keys(newClassParticipant).length !== 0) {
          updateStudentsClass(newClassParticipant, dummyClassId)
            .then(() => {
              // agar text jumlah murid di halaman ini diperbarui, panggil ulang getStudents
              getStudents();
              if (invalidEmails.current.length !== 0) {
                handleOpenEmailDialog()
              }
              handleOpenSnackbar(
                "success",
                "Pemindahan murid berhasil dilakukan"
              );
            })
            .catch((err) => {
              handleOpenSnackbar("error", "Pemindahan murid gagal dilakukan");
              console.log(err);
            });
        } else {
          handleOpenSnackbar("info", "Tidak ada murid yang dipindahkan");
        }
      })
      .catch((err) => {
        handleOpenSnackbar("error", err.message);
        // console.error(err);
      });

    // agar file yang sama bisa diupload ulang
    fileInput.current.value = "";
  };

  // Dialog Email
  const [openDialog, setOpenDialog] = React.useState(false);

  const handleOpenEmailDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseEmailDialog = () => {
    setOpenDialog(false);
  };
  return (
    <div className={classes.toolbar}>
      {/* <Typography variant="h4">Daftar Kelas</Typography> */}
      <div style={{ display: "flex", alignItems: "center" }}>
        <Hidden mdUp implementation="css">
          {searchBarFocus ? null : (
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              {/* <MenuBookIcon className={classes.titleIcon} fontSize="large" /> */}
              <Typography variant="h4">Daftar Kelas</Typography>
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
            {/* <MenuBookIcon className={classes.titleIcon} fontSize="large" /> */}
            <Typography variant="h4">Daftar Kelas</Typography>
          </div>
        </Hidden>
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
                onClick={(e) => setSearchBarFocus(true)}
                placeholder="Kelas"
                style={{
                  maxWidth: (user.role === "Admin" ? "110px" : "200px"),
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
                          onClear(e, "searchFilterMobile");
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
            <LightTooltip title="Search" style={{ marginLeft: "5px" }}>
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
            onClick={() => setSearchBarFocus(true)}
            onBlur={() => setSearchBarFocus(false)}
            placeholder="Cari Kelas"
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
                      onClear(e, "searchFilterDesktop");
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
        {user.role === "Admin" ? (
          <div>
            <Hidden smUp implementation="css">
              <LightTooltip title="Buat Kelas">
                <Link to="/buat-kelas">
                  <Fab size="small" className={classes.newClassButton}>
                    <FaChalkboardTeacher
                      className={classes.newClassIconMobile}
                    />
                  </Fab>
                </Link>
              </LightTooltip>
            </Hidden>
            <Hidden xsDown implementation="css">
              <Link to="/buat-kelas">
                <Fab
                  size="medium"
                  variant="extended"
                  className={classes.newClassButton}
                >
                  <FaChalkboardTeacher
                    className={classes.newClassIconDesktop}
                  />
                  Buat Kelas
                </Fab>
              </Link>
            </Hidden>
          </div>
        ) : null}
        {user.role === "Admin" ? (
          <div>
            <form
              onChange={(event) => {
                handleImportCSV(event);
              }}
              style={{ display: "none" }}
            >
              <input type="file" ref={fileInput} accept=".csv" />
            </form>

            <LightTooltip title="Atur Kelas Murid">
              <IconButton
                onClick={handleOpenCSVMenu}
                className={classes.sortButton}
                style={{ marginRight: "3px" }}
              >
                <AccountTreeIcon />
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
              <MenuItem onClick={handleClickExport}>Export Data Kelas</MenuItem>
              <MenuItem onClick={handleClickImport}>Import Data Kelas</MenuItem>
            </Menu>

            <LightTooltip title="Atur Wali Kelas">
              <Link to="/atur-walikelas">
                <IconButton className={classes.sortButton}>
                  <AiOutlineUserSwitch />
                </IconButton>
              </Link>
            </LightTooltip>
          </div>
        ) : null}
        <LightTooltip title="Urutkan Kelas">
          <IconButton
            onClick={handleOpenSortMenu}
            className={classes.sortButton}
            style={{ marginRight: "3px", marginLeft: "3px" }}
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
      </div>

      <Dialog
        classes={{ paper: classes.dialogPaper }}
        maxWidth="xs"
        fullWidth
        open={openDialog}
      >
        <DialogTitle>Email berikut tidak ditemukan di basis data</DialogTitle>
        <DialogContent dividers>
          {invalidEmails.current.map((email, idx) => (
            <Typography variant="body1" style={{marginBottom: (idx === invalidEmails.current.length - 1 ? "0" : "16px")}}>{email}</Typography>
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEmailDialog} color="primary">
            Tutup
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

ClassListToolbar.propTypes = {
  classes: PropTypes.object.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(["asc", "desc"]).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
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
  toolbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  titleDivider: {
    backgroundColor: theme.palette.primary.main,
    marginTop: "15px",
    marginBottom: "15px",
  },
  newClassButton: {
    marginRight: "6px",
    backgroundColor: theme.palette.success.main,
    color: "white",
    "&:focus, &:hover": {
      backgroundColor: theme.palette.success.main,
      color: "white",
    },
  },
  newClassIconDesktop: {
    width: theme.spacing(2.5),
    height: theme.spacing(2.5),
    marginRight: "7.5px",
  },
  newClassIconMobile: {
    width: theme.spacing(2.5),
    height: theme.spacing(2.5),
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
  classPaper: {
    "&:focus, &:hover": {
      border: "1px solid #2196F3",
      cursor: "pointer",
    },
  },
  classActionContainer: {
    padding: "20px 10px 20px 10px",
  },
  classPersonIcon: {
    color: theme.palette.text.disabled,
  },
  editClassButton: {
    backgroundColor: theme.palette.primary.main,
    color: "white",
    "&:focus, &:hover": {
      backgroundColor: "white",
      color: theme.palette.primary.main,
    },
  },
  deleteClassButton: {
    backgroundColor: theme.palette.error.dark,
    color: "white",
    "&:focus, &:hover": {
      backgroundColor: "white",
      color: theme.palette.error.dark,
    },
  },
  emptyClass: {
    display: "flex",
    justifyContent: "center",
    maxWidth: "150px",
    padding: "2px",
    paddingLeft: "6px",
    paddingRight: "6px",
    backgroundColor: theme.palette.error.main,
    color: "white",
    marginLeft: "5px"
  },
  dialogPaper: {
    maxHeight: '70vh',
    // width: "300px",
    // maxWidth: "100%",
  }
}));

function ClassList(props) {
  const classes = useStyles();

  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("homeroomTeacher");
  const [openDeleteDialog, setOpenDeleteDialog] = React.useState(null);
  const [selectedClassId, setSelectedClassId] = React.useState(null);
  const [selectedClassName, setSelectedClassName] = React.useState(null);
  const [searchFilter, updateSearchFilter] = React.useState("");
  const [searchBarFocus, setSearchBarFocus] = React.useState(false);

  const { classesCollection, tasksCollection } = props;
  const {
    clearErrors,
    getStudents,
    getTeachers,
    deleteClass,
    getAllClass,
    getAllTask,
    getAllAssessments,
  } = props;
  // const {updateClassAdmin, updateStudentsClass} = props;

  const { user, all_teachers, all_students } = props.auth;
  // const { all_classes_map } = props.classesCollection;
  const { all_assessments } = props.assessmentsCollection;

  console.log(classesCollection);

  const colorList = ["#12c2e9", "#c471ed", "#f64f59", "#f5af19", "#6be585"];
  const colorMap = new Map();

  const classItem = (data, i) => {
    colorMap.set(data._id, colorList[i % colorList.length]);
    let temp_ukuran = 0;
    for (let i = 0; i < all_students.length; i++) {
      if (all_students[i].kelas === data._id) {
        temp_ukuran = temp_ukuran + 1;
      }
    }
    classesCollection.all_classes[i].ukuran = temp_ukuran; // Update property ukuran
    rows.push(
      createData(
        data._id,
        data.name,
        !all_teachers.size || !all_teachers.get(data.walikelas)
          ? null
          : all_teachers.get(data.walikelas).name,
        temp_ukuran,
        !data.nihil ? "Nihil" : "Tidak Nihil"
      )
    );
  };
  React.useEffect(() => {
    getAllClass();
    getAllClass("map");
    getTeachers();
    getTeachers("map");
    getStudents();
    getAllTask();
    getAllAssessments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    return () => {
      clearErrors();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  console.log(classesCollection);

  console.log(all_teachers);
  const retrieveClasses = () => {
    if (classesCollection.all_classes.length > 0) {
      rows = [];
      classesCollection.all_classes.filter((item) =>
        item.name.toLowerCase().includes(searchFilter.toLowerCase())
      ).map((data, i) => classItem(data, i));
    }
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  // Call the function to get the classes from DB
  // this function is defined above
  retrieveClasses();

  const onDeleteClass = (id) => {
    deleteClass(id);
  };

  // Delete Dialog box
  const handleOpenDeleteDialog = (e, id, name) => {
    e.preventDefault();
    setOpenDeleteDialog(true);
    setSelectedClassId(id);
    setSelectedClassName(name);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    clearErrors();
  };

  // Snackbar
  const [snackbarContent, setSnackbarContent] = React.useState("");
  const [severity, setSeverity] = React.useState("info");
  const [openSnackbar, setOpenSnackbar] = React.useState(false);

  function handleOpenSnackbar(severity, content) {
    setOpenSnackbar(true);
    setSeverity(severity);
    setSnackbarContent(content);
  }

  function handleCloseSnackbar(event, reason) {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnackbar(false);
  }

  if (user.role === "Student") {
    return (
      <div className={classes.root}>
        <Typography variant="h5" align="center" className={classes.title}>
          <b>Anda tidak mempunyai izin akses halaman ini.</b>
        </Typography>
      </div>
    );
  }

  document.title = "Schooly | Daftar Kelas";

  return (
    <div className={classes.root}>
      <DeleteDialog
        openDeleteDialog={openDeleteDialog}
        handleCloseDeleteDialog={handleCloseDeleteDialog}
        itemType="Kelas"
        itemName={selectedClassName}
        deleteItem={() => {
          onDeleteClass(selectedClassId);
        }}
      />
      <ClassListToolbar
        classes={classes}
        deleteClass={deleteClass}
        order={order}
        orderBy={orderBy}
        user={user}
        onRequestSort={handleRequestSort}
        rowCount={rows ? rows.length : 0}
        classesCollection={classesCollection}
        all_teachers={all_teachers}
        all_students={all_students}
        getStudents={getStudents}
        handleOpenSnackbar={handleOpenSnackbar}
        // updateClassAdmin={updateClassAdmin}
        // updateStudentsClass={updateStudentsClass}
        tasksCollection={tasksCollection}
        all_assessments={all_assessments}
        setSearchBarFocus={setSearchBarFocus}
        searchBarFocus={searchBarFocus}
        //Two props added for search filter.
        searchFilter={searchFilter}
        updateSearchFilter={updateSearchFilter}
      />
      <Divider variant="inset" className={classes.titleDivider} />
      <Grid container spacing={2}>
        {rows.length === 0
          ? null
          : stableSort(rows, getComparator(order, orderBy)).map(
              (row, index) => {
                const labelId = `enhanced-table-checkbox-${index}`;
                let viewpage = `/kelas/${row._id}`;
                return (
                  <Grid item xs={12} sm={6} md={4}>
                    <Link to={viewpage} onClick={(e) => e.stopPropagation()}>
                      <Paper
                        button
                        square
                        variant="outlined"
                        className={classes.classPaper}
                      >
                        <Avatar
                          variant="square"
                          style={{
                            backgroundColor: colorMap.get(row._id),
                            width: "100%",
                            height: "120px",
                          }}
                        >
                          <FaChalkboardTeacher
                            style={{
                              width: "50px",
                              height: "50px",
                            }}
                          />
                        </Avatar>
                        <Divider />
                        <div style={{ padding: "10px 20px 20px 10px" }}>
                          <Typography id={labelId} variant="h5" align="center">
                            {row.name}
                          </Typography>
                          {(row.homeroomTeacher && row.homeroomTeacher !== "") ?
                            <Typography
                              variant="body1"
                              color="textSecondary"
                              align="center"
                              style={{ marginTop: "5px" }}
                            >
                              Wali Kelas: {row.homeroomTeacher}
                            </Typography>
                          :
                            <div style={{display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", marginTop: "5px"}}>
                              <Typography
                                variant="body1"
                                color="textSecondary"
                                align="center"
                              >
                                Wali Kelas:
                              </Typography>
                              <Paper className={classes.emptyClass}>
                                  <Typography variant="body2">KOSONG</Typography>
                              </Paper>
                            </div>
                          }
                        </div>
                        <Divider />
                        <Grid
                          container
                          direction="row"
                          justify="space-between"
                          alignItems="center"
                          className={classes.classActionContainer}
                        >
                          {user.role === "Admin" ? (
                            <Grid
                              item
                              xs
                              container
                              spacing={1}
                              justify="flex-end"
                              alignItems="center"
                            >
                              <Grid item>
                                <LightTooltip title="Jumlah Murid">
                                  <Badge
                                    badgeContent={row.size}
                                    color="secondary"
                                    anchorOrigin={{
                                      vertical: "bottom",
                                      horizontal: "left",
                                    }}
                                    showZero
                                  >
                                    <IconButton size="small" disabled>
                                      <SupervisorAccountIcon
                                        className={classes.classPersonIcon}
                                      />
                                    </IconButton>
                                  </Badge>
                                </LightTooltip>
                                {/* <LightTooltip title="Jumlah Murid">
                                  <Badge
                                    badgeContent={row.size}
                                    color="secondary"
                                    anchorOrigin={{
                                      vertical: "bottom",
                                      horizontal: "left",
                                    }}
                                    showZero
                                  >
                                    <IconButton size="small" disabled>
                                      <SupervisorAccountIcon
                                        className={classes.classPersonIcon}
                                      />
                                    </IconButton>
                                  </Badge>
                                </LightTooltip> */}
                              </Grid>
                              <Grid item>
                                <LightTooltip title="Sunting">
                                  <Link
                                    to={`/sunting-kelas/${row._id}`}
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    <IconButton
                                      size="small"
                                      className={classes.editClassButton}
                                    >
                                      <EditIcon fontSize="small" />
                                    </IconButton>
                                  </Link>
                                </LightTooltip>
                              </Grid>
                              <Grid item>
                                <LightTooltip title="Hapus">
                                  <IconButton
                                    size="small"
                                    className={classes.deleteClassButton}
                                    onClick={(e) =>
                                      handleOpenDeleteDialog(
                                        e,
                                        row._id,
                                        row.name
                                      )
                                    }
                                  >
                                    <DeleteIcon fontSize="small" />
                                  </IconButton>
                                </LightTooltip>
                              </Grid>
                            </Grid>
                          ) : (
                            <Grid
                              container
                              direction="row"
                              justify="flex-end"
                              alignItems="center"
                            >
                              <Grid item>
                                <LightTooltip title="Jumlah Murid">
                                  <Badge
                                    badgeContent={row.size}
                                    color="secondary"
                                    anchorOrigin={{
                                      vertical: "bottom",
                                      horizontal: "left",
                                    }}
                                    showZero
                                  >
                                    <IconButton size="small" disabled>
                                      <SupervisorAccountIcon
                                        className={classes.classPersonIcon}
                                      />
                                    </IconButton>
                                  </Badge>
                                </LightTooltip>
                                {/* <LightTooltip title="Jumlah Murid">
                                  <Badge
                                    badgeContent={row.size}
                                    color="secondary"
                                    anchorOrigin={{
                                      vertical: "bottom",
                                      horizontal: "left",
                                    }}
                                    showZero
                                  >
                                    <IconButton size="small" disabled>
                                      <SupervisorAccountIcon
                                        className={classes.classPersonIcon}
                                      />
                                    </IconButton>
                                  </Badge>
                                </LightTooltip> */}
                              </Grid>
                            </Grid>
                          )}
                        </Grid>
                      </Paper>
                    </Link>
                  </Grid>
                );
              }
            )}
      </Grid>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={4000}
        onClose={(event, reason) => {
          handleCloseSnackbar(event, reason);
        }}
      >
        <MuiAlert
          variant="filled"
          severity={severity}
          onClose={(event, reason) => {
            handleCloseSnackbar(event, reason);
          }}
        >
          {snackbarContent}
        </MuiAlert>
      </Snackbar>
    </div>
  );
}

ClassList.propTypes = {
  getAllClass: PropTypes.func.isRequired,
  getTeachers: PropTypes.func.isRequired,
  clearErrors: PropTypes.func.isRequired,
  classesCollection: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  deleteClass: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,

  assessmentsCollection: PropTypes.object.isRequired,
  getStudents: PropTypes.func.isRequired,
  getAllTask: PropTypes.func.isRequired,
  // updateClassAdmin: PropTypes.func.isRequired,
  // updateStudentsClass: PropTypes.func.isRequired,
  getAllAssessments: PropTypes.func.isRequired,
  tasksCollection: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  errors: state.errors,
  auth: state.auth,
  classesCollection: state.classesCollection,
  assessmentsCollection: state.assessmentsCollection,
  tasksCollection: state.tasksCollection,
});

export default connect(
  // mapStateToProps, { clearErrors, getTeachers, getStudents, getAllClass, deleteClass, updateClassAdmin, updateStudentsClass, getAllTask, getAllAssessments}
  mapStateToProps,
  {
    clearErrors,
    getTeachers,
    getStudents,
    getAllClass,
    deleteClass,
    getAllTask,
    getAllAssessments,
  }
)(ClassList);
