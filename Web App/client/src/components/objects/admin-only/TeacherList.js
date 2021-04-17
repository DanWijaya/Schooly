import React from "react";
// import { Link } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { getTeachers, updateTeacher } from "../../../actions/UserActions";
import { getAllSubjects } from "../../../actions/SubjectActions";
import { getAllClass } from "../../../actions/ClassActions";
import { clearErrors } from "../../../actions/ErrorActions";
import { clearSuccess } from "../../../actions/SuccessActions";

import LightTooltip from "../../misc/light-tooltip/LightTooltip";
import {
  Divider,
  ExpansionPanel,
  ExpansionPanelDetails,
  ExpansionPanelSummary,
  Grid,
  InputAdornment,
  IconButton,
  Hidden,
  Menu,
  MenuItem,
  TableSortLabel,
  TextField,
  Typography,
  ListItemAvatar,
  Dialog,
  Avatar,
  Button,
  Snackbar,
} from "@material-ui/core/";
import { makeStyles } from "@material-ui/core/styles";
import EditIcon from "@material-ui/icons/Edit";
import SortIcon from "@material-ui/icons/Sort";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import { GoSearch } from "react-icons/go";
import { BiSitemap } from "react-icons/bi";
import CloseIcon from "@material-ui/icons/Close";
import ClearIcon from "@material-ui/icons/Clear";
import { Autocomplete }from '@material-ui/lab';
import MuiAlert from "@material-ui/lab/Alert";
// FIXME import

function createData(
  _id,
  name,
  email,
) {
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
    updateSearchFilter,
    searchBarFocus,
    setSearchBarFocus,
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
    updateSearchFilter(e.target.value);
  };

  const onClear = (e, id) => {
    updateSearchFilter("");
    document.getElementById(id).focus();
  };

  return (
    <div className={classes.toolbar}>
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
              <BiSitemap className={classes.titleIcon} fontSize="large" />
              <Typography variant="h4">Daftar Guru</Typography>
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
            <BiSitemap className={classes.titleIcon} fontSize="large" />
            <Typography variant="h4">Daftar Guru</Typography>
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
                placeholder="Cari Guru"
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
            onClick={() => setSearchBarFocus(true)}
            onBlur={() => setSearchBarFocus(false)}
            placeholder="Cari Guru"
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
        <LightTooltip title="Urutkan Guru">
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
      </div>
    </div>
  );
}

// TeacherListToolbar.propTypes = {
//   classes: PropTypes.object.isRequired,
//   onRequestSort: PropTypes.func.isRequired,
//   onSelectAllClick: PropTypes.func.isRequired,
//   order: PropTypes.oneOf(["asc", "desc"]).isRequired,
//   orderBy: PropTypes.string.isRequired,
//   rowCount: PropTypes.number.isRequired,
// };

// FIXME makeStyles
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
  // newMaterialButton: {
  //   marginRight: "10px",
  //   backgroundColor: theme.palette.success.main,
  //   color: "white",
  //   "&:focus, &:hover": {
  //     backgroundColor: theme.palette.success.main,
  //     color: "white",
  //   },
  // },
  // newMaterialIconDesktop: {
  //   width: theme.spacing(3),
  //   height: theme.spacing(3),
  //   marginRight: "7.5px",
  // },
  // newMaterialIconMobile: {
  //   width: theme.spacing(3),
  //   height: theme.spacing(3),
  // },
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
  // viewMaterialButton: {
  //   backgroundColor: theme.palette.warning.main,
  //   color: "white",
  //   "&:focus, &:hover": {
  //     backgroundColor: "white",
  //     color: theme.palette.warning.main,
  //   },
  // },
  // editMaterialButton: {
  //   backgroundColor: theme.palette.primary.main,
  //   color: "white",
  //   "&:focus, &:hover": {
  //     backgroundColor: "white",
  //     color: theme.palette.primary.main,
  //   },
  // },
  // deleteMaterialButton: {
  //   backgroundColor: theme.palette.error.dark,
  //   color: "white",
  //   "&:focus, &:hover": {
  //     backgroundColor: "white",
  //     color: theme.palette.error.dark,
  //   },
  // },
  editTeacherButton: {
    backgroundColor: theme.palette.primary.main,
    color: "white",
    "&:focus, &:hover": {
      backgroundColor: "white",
      color: theme.palette.primary.main,
    },
  },
  teacherPanelSummary: {
    "&:hover": {
      backgroundColor: theme.palette.primary.fade,
    },
  },
  // teacherPaper: {
  //   display: "flex",
  //   justifyContent: "space-between",
  //   alignItems: "center",
  //   padding: "15px",
  //   "&:focus, &:hover": {
  //     backgroundColor: theme.palette.primary.fade,
  //   },
  // },
  titleIcon: {
    fontSize: "28px",
    backgroundColor: "white",
    color: theme.palette.primary.main,
    marginRight: "10px",
  },
  // assignmentLate: {
  //   backgroundColor: theme.palette.primary.main,
  // },
  teacherAvatar: {
    backgroundColor: theme.palette.primary.main,
    marginRight: "10px",
  },
  listItem: {
    "&:focus, &:hover": {
      backgroundColor: theme.palette.primary.fade,
    },
    padding: "6px 16px"
  },
  saveButton: {
    backgroundColor: theme.palette.primary.main,
    color: "white",
    marginLeft: "10px",
    height: "80%",
    "&:focus, &:hover": {
      backgroundColor: theme.palette.primary.dark,
    }
  },
  editClassButton: {
    // width: "100%",
    // marginTop: "20px",
    backgroundColor: theme.palette.primary.main,
    color: "white",
    "&:focus, &:hover": {
      color: theme.palette.primary.main,
      backgroundColor: "white",
    },
  },
  cancelButton: {
    // width: "100%",
    // marginTop: "20px",
    backgroundColor: theme.palette.error.main,
    color: "white",
    "&:focus, &:hover": {
      backgroundColor: "white",
      color: theme.palette.error.main,
    },
  },
}));

// FIXME TeacherList
function TeacherList(props) {
  const classes = useStyles();

  const {
    getAllSubjects,
    getAllClass,
    getTeachers,
    updateTeacher,
    clearErrors,
    clearSuccess
  } = props;
  const { all_classes } = props.classesCollection;
  const { user, all_teachers } = props.auth;
  const { all_subjects } = props.subjectsCollection;
  const errors = props.errors;
  const success = props.success;

  const all_teacher_obj = React.useRef({});
  const [rows, setRows] = React.useState([]);

  React.useEffect(() => {
    window.scrollTo(0, 0);
    // getAllSubjects("map");
    getAllSubjects();
    // getAllClass("map");
    getAllClass();
    // getTeachers("map");
    getTeachers();
  }, []);

  React.useEffect(() => {
    if (all_teachers && all_subjects && all_classes) {
      let all_subjects_obj = {}
      all_subjects.forEach((subjectInfo) => {
        all_subjects_obj[subjectInfo._id] = subjectInfo;
      })
      let all_classes_obj = {}
      all_classes.forEach((classInfo) => {
        all_classes_obj[classInfo._id] = classInfo;
      })

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
              name: all_subjects_obj[subjectId] ? all_subjects_obj[subjectId].name : null
            })),
            class: data.class_teached.map((classId) => ({
              _id: classId,
              name: all_classes_obj[classId] ? all_classes_obj[classId].name : null
            }))
          };
          all_teacher_obj.current[data._id] = data;
        })
      setRows(tempRows);
      setSelectedValues(tempSelectedValues);
    }
  }, [all_teachers, all_subjects, all_classes]);

  React.useEffect(() => {
    if (all_teachers) {
      setRows(
        all_teachers
          .filter((item) =>
            item.name.toLowerCase().includes(searchFilter.toLowerCase())
          )
          .map((data) => createData(data._id, data.name, data.email))
      )
    }
  }, [searchFilter]);


  // SEARCH
  const [searchFilter, updateSearchFilter] = React.useState("");
  const [searchBarFocus, setSearchBarFocus] = React.useState(false);


  // SORT
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("name");

  function handleRequestSort(event, property) {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };


  // SNACKBAR
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

  React.useEffect(() => {
    if (errors && (errors.constructor === Object) && (Object.keys(errors).length !== 0)) {
      handleOpenSnackbar(
        "error",
        "Data guru gagal disimpan"
      );
      clearErrors();
    }
  }, [errors])

  React.useEffect(() => {
    if (success) {
      handleOpenSnackbar(
        "success",
        "Data guru berhasil disimpan"
      );
      clearSuccess();
    }
  }, [success])

  React.useEffect(() => {
    return () => {
      clearErrors();
      clearSuccess();
    }
  }, [])


  // AUTOCOMPLETE: untuk memilih subject yang diajar dan kelas yang diajar tiap guru

  /* 
    isi:
    {
      <id guru>: {
        subject: [<id mata pelajaran 1>, <id mata pelajaran 2>, ...],
        class: [<id kelas 1>, <id kelas 2>, ...],
      },
      ...

    } key -> id semua guru yang ada di db
  */
  const [selectedValues, setSelectedValues] = React.useState({});

  function handleChangeSubject(selectedSubjectsInfo, teacherId) {
    setSelectedValues({...selectedValues, [teacherId]: {
      ...selectedValues[teacherId],
      subject: selectedSubjectsInfo
    }})
  }

  function handleChangeClass(selectedClassInfo, teacherId) {
    setSelectedValues({...selectedValues, [teacherId]: {
      ...selectedValues[teacherId],
      class: selectedClassInfo
    }})
  }

  function handleSave(teacherId) {
    let teacher = selectedValues[teacherId];
    let newSubjectTeached = teacher.subject.map((subjectInfo) => (subjectInfo._id));
    let newClassTeached = teacher.class.map((classInfo) => (classInfo._id));
    let tempClassToSubject = {};

    for (let classId of newClassTeached) {
      // akan diubah di waktu mendatang
      tempClassToSubject[classId] = newSubjectTeached;
    }

    let newTeacherData = {
      ...all_teacher_obj.current[teacherId],
      subject_teached: newSubjectTeached,
      class_teached: newClassTeached,
      class_to_subject: tempClassToSubject
    }
    
    updateTeacher(newTeacherData, teacherId);
  }


  // DIALOG SUNTING
  const [openSuntingDialog, setOpenSuntingDialog] = React.useState(false);
  const [dialogData, setDialogData] = React.useState(null);

  const handleClickOpenSuntingDialog = (data) => {
    setDialogData(data)
    setOpenSuntingDialog(true);
  };

  const handleCloseSuntingDialog  = () => {
    setOpenSuntingDialog(false);
  };


  document.title = "Schooly | Daftar Guru";

  return (
    <div className={classes.root}>
      {(dialogData) ?
        <Hidden smUp>
          <Dialog
            onClose={handleCloseSuntingDialog}
            open={openSuntingDialog}
            // fullWidth
          >
            <div style={{ width: "450px", maxWidth: "100%", minHeight: "420px" }}>
              <div
                style={{ display: "flex", margin: "20px 23px 0 0px", justifyContent: "flex-end", alignItems: "flex-end" }}
              >
                <IconButton size="small" onClick={handleCloseSuntingDialog}>
                  <CloseIcon />
                </IconButton>
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  padding: "5px 30px 20px 30px",
                  alignItems: "center"
                }}
              >
                <ListItemAvatar>
                  {!dialogData.avatar ? (
                    <Avatar />
                  ) : (
                    <Avatar src={`/api/upload/avatar/${dialogData.avatar}`} />
                  )}
                </ListItemAvatar>
                <div>
                  <Typography variant="h6" color="textPrimary">
                    {dialogData.name}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {dialogData.email}
                  </Typography>
                </div>
              </div>
              <div style={{ padding: "12px 30px" }}>
                <Typography variant="body2" style={{ marginBottom: "3px" }}>Mata Pelajaran</Typography>
                <Autocomplete
                  multiple
                  value={selectedValues[dialogData._id] ? selectedValues[dialogData._id].subject : null}
                  options={all_subjects}
                  getOptionLabel={(option) => option.name}
                  getOptionSelected={(option, value) => (option._id === value._id)}
                  filterSelectedOptions
                  onChange={(event, value) => {
                    handleChangeSubject(value, dialogData._id);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant="outlined"
                      size="small"
                      style={{ border: "none" }}
                    // TODO error helpertext
                    // error={errors.mata_pelajaran}
                    // helperText={errors.mata_pelajaran}
                    />
                  )}
                />
              </div>
              <div style={{ padding: "12px 30px" }}>
                <Typography variant="body2" style={{ marginBottom: "3px" }}>Kelas</Typography>
                <Autocomplete
                  multiple
                  value={selectedValues[dialogData._id] ? selectedValues[dialogData._id].class : null}
                  options={all_classes}
                  getOptionLabel={(option) => option.name}
                  getOptionSelected={(option, value) => (option._id === value._id)}
                  filterSelectedOptions
                  onChange={(event, value) => {
                    handleChangeClass(value, dialogData._id);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant="outlined"
                      size="small"
                      style={{ border: "none" }}
                    // TODO error helpertext
                    // error={errors.mata_pelajaran}
                    // helperText={errors.mata_pelajaran}
                    />
                  )}
                />
              </div>
              <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "20px" }} className={classes.content}>
                {/* <div style={{ display: "flex", alignItems: "center", padding: "4px" }}>
                  <Button
                    variant="contained"
                    className={classes.cancelButton}
                    onClick={() => handleCloseSuntingDialog()}
                  >
                    Batal
                  </Button>
                </div> */}
                <div style={{ display: "flex", alignItems: "center", padding: "15px 30px 15px 5px" }}>
                  <Button
                    variant="contained"
                    className={classes.editClassButton}
                  >
                    Simpan
                  </Button>
                </div>
              </div>
            </div>
          </Dialog>
        </Hidden>
        : null
      }
      <TeacherListToolbar
        classes={classes}
        order={order}
        orderBy={orderBy}
        onRequestSort={handleRequestSort}
        rowCount={rows ? rows.length : 0}
        setSearchBarFocus={setSearchBarFocus}
        searchBarFocus={searchBarFocus}
        //Two props added for search filter.
        searchFilter={searchFilter}
        updateSearchFilter={updateSearchFilter}
      />
      <Divider variant="inset" className={classes.titleDivider} />
      <Grid container direction="column" spacing={2}>
        {rows.length === 0 ? (
          <Typography variant="subtitle1" align="center" color="textSecondary">
            Kosong
          </Typography>
        ) : (
          stableSort(rows, getComparator(order, orderBy)).map((row, index) => {
            const labelId = `enhanced-table-checkbox-${index}`;

            return (
              <Grid item>
                <Hidden xsDown>
                  <ExpansionPanel button variant="outlined" defaultExpanded>
                    <ExpansionPanelSummary
                      className={classes.teacherPanelSummary}
                    >
                      <Grid
                        container
                        spacing={1}
                        justify="space-between"
                        alignItems="center"
                      >
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
                            <div
                              style={{
                                display: "flex",
                                flexDirection: "row",
                                justifyContent: "center",
                                alignItems: "center",
                              }}
                            >
                              <ListItemAvatar>
                                {!row.avatar ? (
                                  <Avatar />
                                ) : (
                                  <Avatar src={`/api/upload/avatar/${row.avatar}`} />
                                )}
                              </ListItemAvatar>
                              <div>
                                <Typography variant="h6" color="textPrimary">
                                  {row.name}
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                  {row.email}
                                </Typography>
                              </div>
                            </div>
                          </Hidden>
                        </Grid>
                        <Hidden smUp implementation="css">
                          <Grid item xs container spacing={1} justify="flex-end">
                            <Grid item>
                              <LightTooltip title="Sunting">
                                <IconButton
                                  size="small"
                                  className={classes.editTeacherButton}
                                >
                                  <EditIcon fontSize="small" />
                                </IconButton>
                              </LightTooltip>
                            </Grid>
                          </Grid>
                        </Hidden>
                      </Grid>
                    </ExpansionPanelSummary>
                    <Divider />
                    <ExpansionPanelDetails style={{ paddingTop: "20px" }}>
                      <Grid container spacing={4}>
                        <Grid item xs={12}>
                          <Typography variant="body1">Mata Pelajaran</Typography>
                          <Autocomplete
                            multiple
                            value={selectedValues[row._id] ? selectedValues[row._id].subject : null}
                            options={all_subjects}
                            getOptionLabel={(option) => option.name}
                            getOptionSelected={(option, value) => (option._id === value._id)}
                            filterSelectedOptions
                            onChange={(event, value) => {
                              handleChangeSubject(value, row._id);
                            }}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                variant="outlined"
                                size="small"
                                style={{ border: "none" }}
                                // TODO error helpertext
                                // error={errors.mata_pelajaran}
                                // helperText={errors.mata_pelajaran}
                              />
                            )}
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <Typography variant="body1">Kelas</Typography>
                          <Autocomplete
                            multiple
                            value={selectedValues[row._id] ? selectedValues[row._id].class : null}
                            options={all_classes ? all_classes : null}
                            getOptionLabel={(option) => option.name}
                            getOptionSelected={(option, value) => (option._id === value._id)}
                            filterSelectedOptions
                            onChange={(event, value) => {
                              handleChangeClass(value, row._id);
                            }}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                variant="outlined"
                                size="small"
                                // fullWidth
                                style={{ border: "none" }}
                              // TODO error helpertext
                              // error={errors.mata_pelajaran}
                              // helperText={errors.mata_pelajaran}
                              />
                            )}
                          />
                        </Grid>

                        <Grid item xs={12}>
                          <Grid
                            container
                            justify="flex-end"
                            alignItems="center"
                          >
                            <Button
                              className={classes.saveButton}
                              size="small"
                              onClick={() => {
                                handleSave(row._id);
                                handleCloseSuntingDialog();
                              }}
                            >
                              SIMPAN
                            </Button>
                          </Grid>
                        </Grid>
                      </Grid>
                    </ExpansionPanelDetails>
                  </ExpansionPanel>
                </Hidden>
                <Hidden smUp>
                  <ExpansionPanel button variant="outlined" expanded={false}>
                    <ExpansionPanelSummary
                      className={classes.teacherPanelSummary}
                    >
                      <Grid
                        container
                        spacing={1}
                        justify="space-between"
                        alignItems="center"
                      >
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
                            <div
                              style={{
                                display: "flex",
                                flexDirection: "row",
                                justifyContent: "center",
                                alignItems: "center",
                              }}
                            >
                              <ListItemAvatar>
                                {!row.avatar ? (
                                  <Avatar />
                                ) : (
                                  <Avatar src={`/api/upload/avatar/${row.avatar}`} />
                                )}
                              </ListItemAvatar>
                              <div>
                                <Typography variant="h6" color="textPrimary">
                                  {row.name}
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                  {row.email}
                                </Typography>
                              </div>
                            </div>
                          </Hidden>
                        </Grid>
                        <Grid item xs container spacing={1} justify="flex-end">
                          <Grid item>
                            <LightTooltip title="Sunting">
                              <IconButton
                                size="small"
                                className={classes.editTeacherButton}
                                onClick={() => handleClickOpenSuntingDialog(row)}
                              >
                                <EditIcon fontSize="small" />
                              </IconButton>
                            </LightTooltip>
                          </Grid>
                        </Grid>
                      </Grid>
                    </ExpansionPanelSummary>
                    <Divider />
                  </ExpansionPanel>
                </Hidden>
              </Grid>
            );
          })
        )}
      </Grid>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
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

// TeacherList.propTypes = {
//   deleteMaterial: PropTypes.func.isRequired,
//   getAllMaterials: PropTypes.func.isRequired,
//   getMaterial: PropTypes.func.isRequired,
//   getTeachers: PropTypes.func.isRequired,
//   getAllSubjects: PropTypes.func.isRequired,
//   getSelectedClasses: PropTypes.func.isRequired,
//   getAllClass: PropTypes.func.isRequired,

//   classesCollection: PropTypes.object.isRequired,
//   materialsCollection: PropTypes.object.isRequired,
//   subjectsCollection: PropTypes.object.isRequired,
//   errors: PropTypes.object.isRequired,
//   auth: PropTypes.object.isRequired,
// };

const mapStateToProps = (state) => ({
  errors: state.errors,
  success: state.success,
  auth: state.auth,
  classesCollection: state.classesCollection,
  subjectsCollection: state.subjectsCollection,
});

// parameter 1 : reducer , parameter 2 : actions
export default connect(mapStateToProps, {
  getAllSubjects,
  getTeachers,
  getAllClass,
  updateTeacher,
  clearErrors,
  clearSuccess
})(TeacherList);
