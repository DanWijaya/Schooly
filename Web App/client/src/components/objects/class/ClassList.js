import React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import {
  getTeachers,
  getStudents,
  moveStudents,
} from "../../../actions/UserActions";
import {
  getAllClass,
  deleteClass,
  removeMovedOfficers,
} from "../../../actions/ClassActions";
import { clearErrors } from "../../../actions/ErrorActions";
import ClassItem from "../item/ClassItem";
import Empty from "../../misc/empty/Empty";
import DeleteDialog from "../../misc/dialog/DeleteDialog";
import LightTooltip from "../../misc/light-tooltip/LightTooltip";
import {
  Divider,
  Fab,
  Grid,
  Hidden,
  IconButton,
  Menu,
  MenuItem,
  InputAdornment,
  TableSortLabel,
  Typography,
  Snackbar,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";
import {
  ArrowBack as ArrowBackIcon,
  AssignmentInd as AssignmentIndIcon,
  Clear as ClearIcon,
  Search as SearchIcon,
  Sort as SortIcon,
} from "@material-ui/icons";
import { makeStyles } from "@material-ui/core/styles";
import { FaChalkboard, FaChalkboardTeacher } from "react-icons/fa";

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
  const {
    classes,
    user,
    order,
    orderBy,
    onRequestSort,
    searchFilter,
    updateSearchFilter,
    searchBarFocus,
    setSearchBarFocus,
  } = props;
  const { all_students, all_teachers_map } = props;
  const { getStudents, handleOpenSnackbar } = props;
  const { all_classes, all_classes_map } = props.classesCollection;

  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  const headCells = [
    {
      id: "name",
      numeric: false,
      disablePadding: true,
      label: "Kelas",
    },
    {
      id: "homeroomTeacher",
      numeric: false,
      disablePadding: false,
      label: "Wali Kelas",
    },
    {
      id: "size",
      numeric: true,
      disablePadding: false,
      label: "Jumlah Murid",
    },
    {
      id: "absent",
      numeric: false,
      disablePadding: false,
      label: "Absen",
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

  // Import and export student class data
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

  const onClear = (e, id) => {
    updateSearchFilter("");
    // document.getElementById(id).focus();
  };

  const handleClickExport = () => {
    if (!all_students || !all_teachers_map || !all_classes_map) {
      return;
    }

    let classData = {
      [dummyClassId]: {
        studentsEmail: [], // Every student in the dummy class are the students who are not grouped in any class yet
        classNames: dummyClassName,
      },
    };
    /* Example:
      {
        classId_1: {
          studentsEmail: [ studentEmail_1, studentEmail_2, studentEmail_3, ... ],
          classNames: className_1
        },
        classId_2: {
          studentsEmail: [ studentEmail_1, studentEmail_2, studentEmail_3, ... ],
          classNames: className_2
        },
        ...
      } key = id off every class in database
    */

    let blobData = "";
    let tempMatrix = [];
    /* This matrix is used to generate string in CSV file that will be downloaded.
    Example:
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

    // To keep email of students in a class.
    for (let student of all_students) {
      if (student.kelas) {
        classData[student.kelas].studentsEmail.push(student.email);
      } else {
        classData[dummyClassId].studentsEmail.push(student.email);
      }
    }

    let classDataEntries = Object.entries(classData);
    let classCount = classDataEntries.length;

    // To search the class which has the most students.
    let maxStudentCount = classDataEntries[0][1].studentsEmail.length;
    for (let i = 1; i <= classCount - 1; i++) {
      let currentClassStdCount = classDataEntries[i][1].studentsEmail.length;
      if (currentClassStdCount > maxStudentCount) {
        maxStudentCount = currentClassStdCount;
      }
    }

    // Initialization matrix with numbers of row = The number of students in a class which have the most students + 1 (for header).
    for (let i = 1; i <= maxStudentCount + 1; i++) {
      tempMatrix.push([]);
    }

    // Filling the matrix.
    for (let entry of classDataEntries) {
      // Fill the first row with class name.
      tempMatrix[0].push(entry[1].classNames);

      // From top to bottom of a column, email of students in class are inserted here.
      for (let i = 0; i <= entry[1].studentsEmail.length - 1; i++) {
        // i itu index baris. pengisian mulai dari i + 1 karena baris pertama sudah diisi nama kelas.
        tempMatrix[i + 1].push(entry[1].studentsEmail[i]);
      }

      // If all students' email in this class have been inserted to the column, the remaining empty cells are filled with "undefined".
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
    invalidEmails.current = []; // This is used to show every student's email that is not found in the database.
    // if (!all_students || !all_teachers_map || !all_classes_map || !tasksCollection || !all_assessments) {
    if (!all_students || !all_teachers_map || !all_classes_map) {
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

        // To create array that contains array of students' email (array of CSV rows)
        let dataMatrix = temp.map((rowString) => {
          return rowString.split(",");
        });

        let classNames = dataMatrix[0];
        if (classNames.includes("")) {
          throw new Error(
            "Masih ada nama kelas yang kosong pada kolom" +
              (classNames.findIndex((name) => name === "") + 1) +
              "mohon periksa kembali"
          );
        }
        let classId = [];

        // To change header array of classes' names to ids.
        for (let className of classNames) {
          let id;
          for (let storedClass of all_classes) {
            if (className === storedClass.name) {
              id = storedClass._id;
              break;
            }
          }
          // If this class have not been listed in database,
          if (id) {
            if (classId.includes(id)) {
              throw new Error(
                `Terdapat duplikasi nama kelas "${className}", mohon periksa kembali`
              );
            } else {
              classId.push(id);
            }
          } else {
            // If this class have not been listed in database.
            if (className === dummyClassName) {
              classId.push(dummyClassId);
            } else {
              throw new Error(
                `Kelas bernama "${className}" tidak terdaftar di basisdata, mohon periksa kembali`
              );
            }
          }
        }

        let classesToUpdate = {}; // This is used to delete class representative's id of a certain class.
        let newClassParticipant = {}; // This is used to change the class of students that is assigned to a new class.
        let allStudentEmail = new Set(); // This is used to check whether there are email duplicates or not.
        // Traverse from left to right and from top to bottom.
        for (let row = 1; row <= dataMatrix.length - 1; row++) {
          for (let column = 0; column <= classNames.length - 1; column++) {
            // If this cell is empty or is filled with an empty string, then do nothing.
            // If cell is filled with student's email
            let currentEmail = dataMatrix[row][column];
            if (currentEmail !== "" && currentEmail !== undefined) {
              // Check email duplicates
              if (allStudentEmail.has(currentEmail)) {
                throw new Error(
                  `Terdapat duplikasi email "${currentEmail}", mohon periksa kembali`
                );
              }
              allStudentEmail.add(currentEmail);

              // To find the old class id, new class id, dan student's id that use a searching criteria which is student's email.
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
                // If this student is not moved to another class, then do nothing.
                // If this student is moved to another class.
                if (newClassId !== oldClassId) {
                  //  If this student is a class representative from the previous class, change the information of the previous class.
                  let oldClassInfo;
                  let fieldToDelete = [];

                  // If this student is moved from a class.
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
                    // If this student is not placed in any class before.

                    // If this student is not placed into any class anymore.
                    if (newClassId === dummyClassId) {
                      // Then do nothing (skip the steps below)
                      continue;
                    }
                  }

                  // This is used to save the student's id that will be moved to this class.
                  if (newClassParticipant[newClassId]) {
                    newClassParticipant[newClassId].push(studentId);
                  } else {
                    newClassParticipant[newClassId] = [studentId];
                  }
                }
              } else {
                // If this student have not been listed in the database yet.
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
          removeMovedOfficers(classesToUpdate)
            .then(() => {
              console.log("Penghapusan pengurus kelas berhasil dilakukan");
            })
            .catch((err) => {
              console.log(err);
            });
        }

        if (Object.keys(newClassParticipant).length !== 0) {
          moveStudents(newClassParticipant, dummyClassId)
            .then(() => {
              // agar text jumlah murid di halaman ini diperbarui, panggil ulang getStudents
              getStudents(user.unit);
              if (invalidEmails.current.length !== 0) {
                handleOpenEmailDialog();
              }
              handleOpenSnackbar(
                "success",
                "Pemindahan murid berhasil dilakukan"
              );
            })
            .catch((err) => {
              handleOpenSnackbar("error", "Pemindahan murid gagal dilakukan");
            });
        } else {
          handleOpenSnackbar("info", "Tidak ada murid yang dipindahkan");
        }
      })
      .catch((err) => {
        handleOpenSnackbar("error", err.message);
      });

    // So that the same file can be reupload.
    fileInput.current.value = "";
  };

  // Email Dialog
  const [openDialog, setOpenDialog] = React.useState(false);
  const handleOpenEmailDialog = () => {
    setOpenDialog(true);
  };
  const handleCloseEmailDialog = () => {
    setOpenDialog(false);
  };

  return (
    <div className={classes.toolbar}>
      <Grid container justify="space-between" alignItems="center">
        {user.role === "Admin" ? (
          <Grid item>
            <Hidden smDown>
              <Link to="/buat-kelas">
                <Fab
                  size="large"
                  variant="extended"
                  className={classes.createClassButton}
                >
                  <FaChalkboard className={classes.createClassIconDesktop} />
                  Buat Kelas
                </Fab>
              </Link>
            </Hidden>
            <Hidden mdUp>
              <LightTooltip title="Buat Kelas">
                <Link to="/buat-kelas">
                  <Fab size="medium" className={classes.createClassButton}>
                    <FaChalkboard className={classes.createClassIconMobile} />
                  </Fab>
                </Link>
              </LightTooltip>
            </Hidden>
          </Grid>
        ) : null}
        <Grid
          item
          xs
          container
          justify="flex-end"
          alignItems="center"
          spacing={1}
        >
          <Grid item>
            <Hidden smDown>
              <TextField
                variant="outlined"
                id="searchFilterDesktop"
                placeholder="Cari Kelas"
                value={searchFilter}
                onChange={onChange}
                onClick={() => setSearchBarFocus(true)}
                onBlur={() => setSearchBarFocus(false)}
                InputProps={{
                  style: {
                    borderRadius: "22.5px",
                    maxWidth: "450px",
                    width: "100%",
                  },
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
                    autoFocus
                    variant="outlined"
                    id="searchFilterMobile"
                    placeholder="Cari Kelas"
                    value={searchFilter}
                    onChange={onChange}
                    onClick={(e) => setSearchBarFocus(true)}
                    InputProps={{
                      style: {
                        borderRadius: "22.5px",
                        maxWidth: "450px",
                        width: "100%",
                      },
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
                              visibility: !searchFilter ? "hidden" : "visible",
                            }}
                          >
                            <ClearIcon />
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </div>
              ) : (
                <LightTooltip title="Cari Kelas">
                  <IconButton onClick={() => setSearchBarFocus(true)}>
                    <SearchIcon />
                  </IconButton>
                </LightTooltip>
              )}
            </Hidden>
          </Grid>
          {user.role === "Admin" ? (
            <Grid item>
              <form
                onChange={(event) => {
                  handleImportCSV(event);
                }}
              >
                <input
                  type="file"
                  accept=".csv"
                  ref={fileInput}
                  style={{ display: "none" }}
                />
                <LightTooltip title="Atur Kelas Murid">
                  <IconButton onClick={handleOpenCSVMenu}>
                    <FaChalkboardTeacher />
                  </IconButton>
                </LightTooltip>
                <Menu
                  keepMounted
                  open={Boolean(csvAnchor)}
                  onClose={handleCloseCSVMenu}
                  anchorEl={csvAnchor}
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "right",
                  }}
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "left",
                  }}
                >
                  <MenuItem onClick={handleClickExport}>
                    Unduh Data Kelas
                  </MenuItem>
                  <MenuItem onClick={handleClickImport}>
                    Unggah Data Kelas
                  </MenuItem>
                </Menu>
              </form>
            </Grid>
          ) : null}
          {user.role === "Admin" ? (
            <Grid item>
              <Link to="/atur-walikelas">
                <LightTooltip title="Atur Wali Kelas">
                  <IconButton>
                    <AssignmentIndIcon />
                  </IconButton>
                </LightTooltip>
              </Link>
            </Grid>
          ) : null}
          <Grid item>
            <LightTooltip title="Urutkan Kelas">
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
      <Dialog fullWidth maxWidth="xs" open={openDialog}>
        <DialogTitle>Email berikut tidak ditemukan di basis data</DialogTitle>
        <DialogContent dividers>
          {invalidEmails.current.map((email, idx) => (
            <Typography
              variant="body1"
              style={{
                marginBottom:
                  idx === invalidEmails.current.length - 1 ? "0" : "16px",
              }}
            >
              {email}
            </Typography>
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
    padding: "16px 0px",
    marginBottom: "15px",
  },
  createClassButton: {
    boxShadow:
      "0px 1px 2px 0px rgba(194,100,1,0.3), 0px 2px 6px 2px rgba(194,100,1,0.15)",
    backgroundColor: theme.palette.success.main,
    color: "white",
    "&:focus, &:hover": {
      backgroundColor: theme.palette.success.main,
      color: "white",
    },
  },
  createClassIconDesktop: {
    width: "25px",
    height: "25px",
    marginRight: "8px",
  },
  createClassIconMobile: {
    width: "25px",
    height: "25px",
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
}));

function ClassList(props) {
  const classes = useStyles();
  const {
    clearErrors,
    getStudents,
    getTeachers,
    deleteClass,
    getAllClass,
  } = props;
  const { user, all_teachers_map, all_students } = props.auth;

  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("homeroomTeacher");
  const [openDeleteDialog, setOpenDeleteDialog] = React.useState(null);
  const [selectedClassId, setSelectedClassId] = React.useState(null);
  const [selectedClassName, setSelectedClassName] = React.useState(null);
  const [searchFilter, updateSearchFilter] = React.useState("");
  const [searchBarFocus, setSearchBarFocus] = React.useState(false);
  const [openDeleteSnackbar, setOpenDeleteSnackbar] = React.useState(false);
  const { classesCollection, tasksCollection } = props;

  // const colorList = ["#12c2e9", "#c471ed", "#f64f59", "#f5af19", "#6be585"];
  // const colorMap = new Map();

  const classItem = (data, i) => {
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
        !all_teachers_map.size || !all_teachers_map.get(data.walikelas)
          ? null
          : all_teachers_map.get(data.walikelas).name,
        temp_ukuran,
        !data.nihil ? "Nihil" : "Tidak Nihil"
      )
    );
  };
  React.useEffect(() => {
    getAllClass(user.unit);
    getAllClass(user.unit, "map");
    getTeachers(user.unit, "map");
    getStudents(user.unit);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    return () => {
      clearErrors();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const retrieveClasses = () => {
    if (classesCollection.all_classes.length > 0) {
      rows = [];
      classesCollection.all_classes
        .filter((item) =>
          item.name.toLowerCase().includes(searchFilter.toLowerCase())
        )
        .map((data, i) => classItem(data, i));
    }
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  // Call the function to get the classes from database.
  // This function is defined above
  retrieveClasses();

  const onDeleteClass = (id) => {
    deleteClass(id).then((res) => {
      console.log(res);

      getAllClass(user.unit);
      getAllClass(user.unit, "map");
      getTeachers(user.unit, "map");
      handleOpenDeleteSnackbar();
      handleCloseDeleteDialog();
    });
  };

  // Delete Dialog
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

  const handleOpenDeleteSnackbar = () => {
    setOpenDeleteSnackbar(true);
  };

  const handleCloseDeleteSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenDeleteSnackbar(false);
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

  document.title = "Schooly | Daftar Kelas";

  return (
    <div className={classes.root}>
      <Grid
        container
        alignItems="center"
        spacing={2}
        className={classes.header}
      >
        <Grid item>
          <div className={classes.headerIcon}>
            <FaChalkboard />
          </div>
        </Grid>
        <Grid item>
          <Typography variant="h5" align="left">
            Kelas
          </Typography>
        </Grid>
      </Grid>
      <Divider />
      <ClassListToolbar
        classes={classes}
        deleteClass={deleteClass}
        order={order}
        orderBy={orderBy}
        user={user}
        onRequestSort={handleRequestSort}
        rowCount={rows ? rows.length : 0}
        classesCollection={classesCollection}
        all_teachers_map={all_teachers_map}
        all_students={all_students}
        getStudents={getStudents}
        handleOpenSnackbar={handleOpenSnackbar}
        tasksCollection={tasksCollection}
        setSearchBarFocus={setSearchBarFocus}
        searchBarFocus={searchBarFocus}
        searchFilter={searchFilter}
        updateSearchFilter={updateSearchFilter}
      />
      {rows.length === 0 ? (
        <Empty />
      ) : (
        <Grid container spacing={2}>
          <ClassItem
            data={stableSort(rows, getComparator(order, orderBy))}
            user={user}
          />
        </Grid>
      )}
      <DeleteDialog
        openDeleteDialog={openDeleteDialog}
        handleCloseDeleteDialog={handleCloseDeleteDialog}
        itemType="Kelas"
        itemName={selectedClassName}
        deleteItem={() => {
          onDeleteClass(selectedClassId);
        }}
      />
      <Snackbar
        open={openSnackbar}
        autoHideDuration={4000}
        onClose={(event, reason) => {
          handleCloseSnackbar(event, reason);
        }}
      >
        <Alert
          variant="filled"
          severity={severity}
          onClose={(event, reason) => {
            handleCloseSnackbar(event, reason);
          }}
        >
          {snackbarContent}
        </Alert>
      </Snackbar>
      <Snackbar
        open={openDeleteSnackbar}
        autoHideDuration={4000}
        onClose={(event, reason) => {
          handleCloseDeleteSnackbar(event, reason);
        }}
      >
        <Alert
          variant="filled"
          severity="success"
          onClose={(event, reason) => {
            handleCloseDeleteSnackbar(event, reason);
          }}
        >
          Kelas berhasil dihapus
        </Alert>
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
  getStudents: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  errors: state.errors,
  auth: state.auth,
  classesCollection: state.classesCollection,
});

export default connect(mapStateToProps, {
  clearErrors,
  getTeachers,
  getStudents,
  getAllClass,
  deleteClass,
})(ClassList);
