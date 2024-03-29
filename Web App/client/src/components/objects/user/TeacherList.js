import React from "react";
import { connect } from "react-redux";
import { getTeachers, updateTeacher } from "../../../actions/UserActions";
import { getAllSubjects } from "../../../actions/SubjectActions";
import { getAllClass } from "../../../actions/ClassActions";
import { clearErrors } from "../../../actions/ErrorActions";
import { clearSuccess } from "../../../actions/SuccessActions";
import Empty from "../../misc/empty/Empty";
import {
  Avatar,
  Button,
  Divider,
  ExpansionPanel,
  ExpansionPanelDetails,
  ExpansionPanelSummary,
  Grid,
  Hidden,
  IconButton,
  InputAdornment,
  Menu,
  MenuItem,
  Snackbar,
  TableSortLabel,
  TextField,
  Tooltip,
  Typography,
} from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";
import Alert from "@material-ui/lab/Alert";
import {
  Clear as ClearIcon,
  ExpandMore as ExpandMoreIcon,
  Search as SearchIcon,
  Sort as SortIcon,
} from "@material-ui/icons";
import { makeStyles } from "@material-ui/core/styles";
import { BiSitemap } from "react-icons/bi";

function createData(_id, name, email) {
  return { _id, name, email };
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

function TeacherListToolbar(props) {
  const {
    classes,
    order,
    orderBy,
    onRequestSort,
    searchFilter,
    setSearchFilter,
  } = props;

  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  const headCells = [
    {
      id: "name",
      numeric: false,
      disablePadding: true,
      label: "Nama",
    },
    {
      id: "email",
      numeric: false,
      disablePadding: false,
      label: "Email",
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
    setSearchFilter(e.target.value);
  };

  const onClear = (e, id) => {
    setSearchFilter("");
  };

  return (
    <div className={classes.toolbar}>
      <Grid container justify="flex-end" alignItems="center" spacing={1}>
        <Grid item>
          <TextField
            variant="outlined"
            size="small"
            id="searchFilterDesktop"
            placeholder="Cari Guru"
            value={searchFilter}
            onChange={onChange}
            InputProps={{
              style: {
                borderRadius: "22.5px",
                maxWidth: "450px",
                paddingTop: "3px",
                paddingBottom: "3px"
              },
              startAdornment: (
                <InputAdornment
                  position="start"
                  style={{ color: "grey" }}
                >
                  <SearchIcon />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      onClear(e, "searchFilterDesktop");
                    }}
                    style={{ visibility: !searchFilter ? "hidden" : "visible" }}
                  >
                    <ClearIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        <Grid item>
          <Tooltip title="Urutkan Guru">
            <IconButton onClick={handleOpenSortMenu}>
              <SortIcon />
            </IconButton>
          </Tooltip>
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
    backgroundColor: theme.palette.primary.main,
    color: "white",
    fontSize: "20px",
  },
  toolbar: {
    padding: "16px 0px",
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
  teacherPanel: {
    "&:hover": {
      backgroundColor: theme.palette.primary.fade,
    },
  },
  teacherAvatar: {
    backgroundColor: theme.palette.primary.main,
    marginRight: "10px",
  },
  saveButton: {
    maxWidth: "100px",
    width: "100%",
    backgroundColor: theme.palette.primary.main,
    color: "white",
    "&:focus, &:hover": {
      backgroundColor: theme.palette.primary.main,
      color: "white",
    },
  },
}));

function TeacherList(props) {
  const classes = useStyles();
  const {
    getAllSubjects,
    getAllClass,
    getTeachers,
    updateTeacher,
    clearErrors,
    clearSuccess,
  } = props;
  const { user, all_teachers } = props.auth;
  const { all_classes } = props.classesCollection;
  const { all_subjects } = props.subjectsCollection;
  const success = props.success;
  const errors = props.errors;

  const all_teacher_obj = React.useRef({});
  const [rows, setRows] = React.useState([]);
  /* content:
    {
      <id guru>: {
        subject: [<info mata pelajaran 1>, <info mata pelajaran 2>, ...],
        class: [<info kelas 1>, <info kelas 2>, ...],
      },
      ...

    } key = id every teacher in database.
  */
  const [selectedValues, setSelectedValues] = React.useState({});

  // Search Filter
  const [searchFilter, setSearchFilter] = React.useState("");

  // Sort
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("name");

  // Snackbar
  const [snackbarContent, setSnackbarContent] = React.useState("");
  const [severity, setSeverity] = React.useState("info");
  const [openSnackbar, setOpenSnackbar] = React.useState(false);

  React.useEffect(() => {
    // getAllSubjects(user.unit, "map");
    getAllSubjects(user.unit);
    // getAllClass(user.unit ,"map");
    getAllClass(user.unit);
    // getTeachers(user.unit, "map");
    getTeachers(user.unit);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    if (all_teachers && all_subjects && all_classes) {
      let all_subjects_obj = {};
      all_subjects.forEach((subjectInfo) => {
        all_subjects_obj[subjectInfo._id] = subjectInfo;
      });
      let all_classes_obj = {};
      all_classes.forEach((classInfo) => {
        all_classes_obj[classInfo._id] = classInfo;
      });

      let tempRows = [];
      let tempSelectedValues = {};
      all_teachers
        .filter((item) =>
          item.name.toLowerCase().includes(searchFilter.toLowerCase())
        )
        .forEach((data) => {
          tempRows.push(createData(data._id, data.name, data.email));
          tempSelectedValues[data._id] = {
            subject: data.subject_teached.map((subjectId) => ({
              _id: subjectId,
              name: all_subjects_obj[subjectId]
                ? all_subjects_obj[subjectId].name
                : null,
            })),
            class: data.class_teached.map((classId) => ({
              _id: classId,
              name: all_classes_obj[classId]
                ? all_classes_obj[classId].name
                : null,
            })),
          };
          all_teacher_obj.current[data._id] = data;
        });
      setRows(tempRows);
      setSelectedValues(tempSelectedValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [all_teachers, all_subjects, all_classes]);

  React.useEffect(() => {
    if (all_teachers) {
      setRows(
        all_teachers
          .filter((item) =>
            item.name.toLowerCase().includes(searchFilter.toLowerCase())
          )
          .map((data) => createData(data._id, data.name, data.email))
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchFilter]);

  React.useEffect(() => {
    if (
      errors &&
      errors.constructor === Object &&
      Object.keys(errors).length !== 0
    ) {
      handleOpenSnackbar("error", "Data guru gagal disimpan");
      clearErrors();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [errors]);

  React.useEffect(() => {
    if (success) {
      handleOpenSnackbar("success", "Data guru berhasil disimpan");
      clearSuccess();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [success]);

  React.useEffect(() => {
    return () => {
      clearErrors();
      clearSuccess();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleRequestSort(event, property) {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  }

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

  function handleChangeSubject(selectedSubjectsInfo, teacherId) {
    setSelectedValues({
      ...selectedValues,
      [teacherId]: {
        ...selectedValues[teacherId],
        subject: selectedSubjectsInfo,
      },
    });
  }

  function handleChangeClass(selectedClassInfo, teacherId) {
    setSelectedValues({
      ...selectedValues,
      [teacherId]: {
        ...selectedValues[teacherId],
        class: selectedClassInfo,
      },
    });
  }

  function handleSave(teacherId) {
    let teacher = selectedValues[teacherId];
    let newSubjectTeached = teacher.subject.map(
      (subjectInfo) => subjectInfo._id
    );
    let newClassTeached = teacher.class.map((classInfo) => classInfo._id);
    let tempClassToSubject = {};

    for (let classId of newClassTeached) {
      // Will be changed in the future.
      tempClassToSubject[classId] = newSubjectTeached;
    }

    let newTeacherData = {
      ...all_teacher_obj.current[teacherId],
      subject_teached: newSubjectTeached,
      class_teached: newClassTeached,
      class_to_subject: tempClassToSubject,
    };

    updateTeacher(newTeacherData, teacherId);
  }

  document.title = "Schooly | Data Ajar Guru";

  return (
    <div className={classes.root}>
      <Grid
        container
        alignItems="center"
        spacing={2}
        className={classes.header}
      >
        <Grid item>
          <Avatar variant="rounded" className={classes.headerIcon}>
            <BiSitemap />
          </Avatar>
        </Grid>
        <Grid item>
          <Typography variant="h5" align="left">
            Data Ajar Guru
          </Typography>
        </Grid>
      </Grid>
      <Divider />
      <TeacherListToolbar
        classes={classes}
        order={order}
        orderBy={orderBy}
        onRequestSort={handleRequestSort}
        rowCount={rows ? rows.length : 0}
        searchFilter={searchFilter}
        setSearchFilter={setSearchFilter}
      />
      {rows.length === 0 ? (
        <Empty />
      ) : (
        <Grid container direction="column" spacing={2}>
          {stableSort(rows, getComparator(order, orderBy)).map((row, index) => {
            const labelId = index;
            return (
              <Grid item>
                <ExpansionPanel variant="outlined">
                  <ExpansionPanelSummary
                    expandIcon={<ExpandMoreIcon />}
                    className={classes.teacherPanel}
                  >
                    <Grid container alignItems="center" spacing={2}>
                      <Hidden xsDown>
                        <Grid item>
                          {!row.avatar ? (
                            <Avatar />
                          ) : (
                            <Avatar src={`/api/upload/avatar/${row.avatar}`} />
                          )}
                        </Grid>
                      </Hidden>
                      <Grid item>
                        <Typography id={labelId} noWrap>
                          {row.name}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="textSecondary"
                          noWrap
                        >
                          {row.email}
                        </Typography>
                      </Grid>
                    </Grid>
                  </ExpansionPanelSummary>
                  <Divider />
                  <ExpansionPanelDetails style={{ paddingTop: "20px" }}>
                    <Grid container direction="column" spacing={2}>
                      <Grid item>
                        <Typography color="primary">Mata Pelajaran</Typography>
                        <Autocomplete
                          multiple
                          filterSelectedOptions
                          options={all_subjects}
                          getOptionLabel={(option) => option.name}
                          getOptionSelected={(option, value) =>
                            option._id === value._id
                          }
                          onChange={(event, value) => {
                            handleChangeSubject(value, row._id);
                          }}
                          value={
                            selectedValues[row._id]
                              ? selectedValues[row._id].subject
                              : null
                          }
                          renderInput={(params) => (
                            <TextField variant="outlined" {...params} />
                          )}
                        />
                      </Grid>
                      <Grid item>
                        <Typography color="primary">Kelas</Typography>
                        <Autocomplete
                          multiple
                          options={all_classes ? all_classes : null}
                          getOptionLabel={(option) => option.name}
                          getOptionSelected={(option, value) =>
                            option._id === value._id
                          }
                          filterSelectedOptions
                          onChange={(event, value) => {
                            handleChangeClass(value, row._id);
                          }}
                          value={
                            selectedValues[row._id]
                              ? selectedValues[row._id].class
                              : null
                          }
                          renderInput={(params) => (
                            <TextField variant="outlined" {...params} />
                          )}
                        />
                      </Grid>
                      <Grid item container justify="flex-end">
                        <Button
                          className={classes.saveButton}
                          onClick={() => handleSave(row._id)}
                        >
                          Simpan
                        </Button>
                      </Grid>
                    </Grid>
                  </ExpansionPanelDetails>
                </ExpansionPanel>
              </Grid>
            );
          })}
        </Grid>
      )}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={4000}
        onClose={(event, reason) => handleCloseSnackbar(event, reason)}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      >
        <Alert
          elevation={6}
          variant="filled"
          severity={severity}
          onClose={(event, reason) => handleCloseSnackbar(event, reason)}
        >
          {snackbarContent}
        </Alert>
      </Snackbar>
    </div>
  );
}

const mapStateToProps = (state) => ({
  auth: state.auth,
  classesCollection: state.classesCollection,
  subjectsCollection: state.subjectsCollection,
  success: state.success,
  errors: state.errors,
});

export default connect(mapStateToProps, {
  getAllClass,
  getAllSubjects,
  getTeachers,
  updateTeacher,
  clearSuccess,
  clearErrors,
})(TeacherList);
