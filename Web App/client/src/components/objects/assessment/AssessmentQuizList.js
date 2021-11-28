import React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import {
  getAllAssessments,
  deleteAssessment,
} from "../../../actions/AssessmentActions";
import { getAllClass } from "../../../actions/ClassActions";
import { getAllSubjects } from "../../../actions/SubjectActions";
import { getTeachers } from "../../../actions/UserActions";
import AssessmentItem from "../item/AssessmentItem";
import Empty from "../../misc/empty/Empty";
import DeleteDialog from "../../misc/dialog/DeleteDialog";
import LightTooltip from "../../misc/light-tooltip/LightTooltip";
import {
  Avatar,
  Divider,
  Fab,
  Grid,
  Hidden,
  IconButton,
  InputAdornment,
  Menu,
  MenuItem,
  Snackbar,
  TableSortLabel,
  TextField,
  Typography,
} from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";
import {
  ArrowBack as ArrowBackIcon,
  Clear as ClearIcon,
  Search as SearchIcon,
  Sort as SortIcon,
} from "@material-ui/icons";
import { makeStyles } from "@material-ui/core/styles";
import { FaClipboardList } from "react-icons/fa";

function createData(
  _id,
  name,
  subject,
  start_date,
  end_date,
  class_assigned,
  type,
  createdAt,
  submissions,
  teacher_name,
  grades
) {
  return {
    _id,
    name,
    subject,
    start_date,
    end_date,
    class_assigned,
    type,
    createdAt,
    submissions,
    teacher_name,
    grades,
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

function AssessmentListToolbar(props) {
  const {
    classes,
    order,
    orderBy,
    onRequestSort,
    role,
    searchFilter,
    setSearchFilter,
    setSearchBarFocus,
    searchBarFocus,
  } = props;

  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  const headCells = [
    {
      id: "name",
      numeric: false,
      disablePadding: true,
      label: "Nama Ujian/Kuis",
    },
    {
      id: "subject",
      numeric: false,
      disablePadding: false,
      label: "Mata Pelajaran",
    },
    {
      id: "start_date",
      numeric: false,
      disablePadding: false,
      label: "Mulai",
    },
    {
      id: "end_date",
      numeric: false,
      disablePadding: false,
      label: "Selesai",
    },
    {
      id: "createdAt",
      numeric: false,
      disablePadding: false,
      label: "Waktu Dibuat",
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

  // Search Filter
  const onChange = (e) => {
    setSearchFilter(e.target.value);
  };
  const onClear = (e, id) => {
    setSearchFilter("");
    // document.getElementById(id).focus();
  };

  return (
    <div className={classes.toolbar}>
      <Grid container justify="space-between" alignItems="center">
        {role === "Teacher" ? (
          <Grid item>
            <Hidden smDown>
              <Link to="/buat-kuis">
                <Fab
                  size="Large"
                  variant="extended"
                  className={classes.createQuizButton}
                >
                  <FaClipboardList
                    className={classes.newAssessmentIconDesktop}
                  />
                  Buat Kuis
                </Fab>
              </Link>
            </Hidden>
            <Hidden mdUp>
              <LightTooltip title="Buat Kuis">
                <Link to="/buat-kuis">
                  <Fab size="medium" className={classes.createQuizButton}>
                    <FaClipboardList className={classes.createQuizIconMobile} />
                  </Fab>
                </Link>
              </LightTooltip>
            </Hidden>
          </Grid>
        ) : null}
        <Grid item xs>
          <Grid container justify="flex-end" alignItems="center" spacing={1}>
            <Grid item>
              <Hidden smDown>
                <TextField
                  variant="outlined"
                  id="searchFilterDesktop"
                  placeholder="Cari Kuis"
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
                            onClear(e, "searchFilterDesktop");
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
                        setSearchFilter("");
                      }}
                    >
                      <ArrowBackIcon />
                    </IconButton>
                    <TextField
                      autoFocus
                      variant="outlined"
                      id="searchFilterMobile"
                      placeholder="Cari Kuis"
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
                            style={{
                              marginLeft: "-10px",
                              marginRight: "-10px",
                            }}
                          >
                            <IconButton
                              size="small"
                              id="searchFilterMobile"
                              onClick={(e) => {
                                e.stopPropagation();
                                onClear(e, "searchFilterMobile");
                              }}
                              style={{
                                visibility: !searchFilter
                                  ? "hidden"
                                  : "visible",
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
                  <LightTooltip title="Cari Kuis">
                    <IconButton onClick={() => setSearchBarFocus(true)}>
                      <SearchIcon />
                    </IconButton>
                  </LightTooltip>
                )}
              </Hidden>
            </Grid>
            <Grid item>
              <LightTooltip title="Urutkan Kuis">
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
    marginBottom: "15px",
  },
  createQuizButton: {
    boxShadow:
      "0px 1px 2px 0px rgba(194,100,1,0.3), 0px 2px 6px 2px rgba(194,100,1,0.15)",
    backgroundColor: theme.palette.success.main,
    color: "white",
    "&:focus, &:hover": {
      backgroundColor: theme.palette.success.main,
      color: "white",
    },
  },
  newAssessmentIconDesktop: {
    width: "25px",
    height: "25px",
    marginRight: "8px",
  },
  createQuizIconMobile: {
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
  viewAssessmentButton: {
    backgroundColor: theme.palette.warning.main,
    color: "white",
    "&:focus, &:hover": {
      backgroundColor: "white",
      color: theme.palette.warning.main,
    },
  },
  editAssessmentButton: {
    backgroundColor: theme.palette.primary.main,
    color: "white",
    "&:focus, &:hover": {
      backgroundColor: "white",
      color: theme.palette.primary.main,
    },
  },
  deleteAssessmentButton: {
    backgroundColor: theme.palette.error.dark,
    color: "white",
    "&:focus, &:hover": {
      backgroundColor: "white",
      color: theme.palette.error.dark,
    },
  },
  copyToClipboardButton: {
    backgroundColor: "purple",
    color: "white",
    "&:focus, &:hover": {
      backgroundColor: "white",
      color: "purple",
    },
  },
  assessmentPanelSummary: {
    "&:hover": {
      backgroundColor: theme.palette.primary.fade,
    },
  },
  assessmentPaper: {
    display: "flex",
    flexDirection: "column",
    alignItems: "stretch",
  },
  warningIcon: {
    color: theme.palette.warning.main,
  },
  checkIcon: {
    color: theme.palette.success.main,
  },
  assignmentLate: {
    backgroundColor: theme.palette.primary.main,
  },
  assignmentLateTeacher: {
    backgroundColor: theme.palette.primary.main,
    marginRight: "10px",
  },
  listItem: {
    padding: "6px 16px",
  },
}));

function AssessmentList(props) {
  const classes = useStyles();
  const {
    getAllAssessments,
    deleteAssessment,
    getAllClass,
    getAllSubjects,
    getTeachers,
  } = props;
  const { user, all_teachers_map } = props.auth;
  const { all_assessments } = props.assessmentsCollection;

  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("subject");
  const [openDeleteDialog, setOpenDeleteDialog] = React.useState(null);
  const [selectedAssessmentId, setSelectedAssessmentId] = React.useState(null);
  const [selectedAssessmentName, setSelectedAssessmentName] = React.useState(
    null
  );
  const [copySnackbarOpen, setOpenCopySnackBar] = React.useState(null);
  const [searchFilter, setSearchFilter] = React.useState("");
  const [searchBarFocus, setSearchBarFocus] = React.useState(false);
  const [type, setAssessmentType] = React.useState(null);
  const [openDeleteSnackbar, setOpenDeleteSnackbar] = React.useState(false);

  var rows = [];
  const assessmentRowItem = (data) => {
    if (
      data.type === "Kuis" &&
      all_teachers_map instanceof Map &&
      all_teachers_map.get(data.author_id)
    ) {
      rows.push(
        createData(
          data._id,
          data.name,
          data.subject,
          data.start_date,
          data.end_date,
          data.class_assigned,
          data.type,
          data.createdAt,
          data.submissions,
          all_teachers_map.get(data.author_id).name,
          data.grades
        )
      );
    }
  };

  React.useEffect(
    () => {
      getAllAssessments(user.unit);
      getAllClass(user.unit, "map");
      getAllSubjects(user.unit, "map");
      getTeachers(user.unit, "map");
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  React.useEffect(() => {
    // To show delete snackbar when a quiz is deleted.
    if (props.location.openDeleteSnackbar) {
      handleOpenDeleteSnackbar();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const retrieveAssessments = () => {
    // If all_assessments is not undefined or an empty array.
    if (all_assessments.length) {
      rows = [];
      if (user.role === "Teacher") {
        all_assessments
          .filter((item) =>
            item.name.toLowerCase().includes(searchFilter.toLowerCase())
          )
          .forEach((data) => {
            if (data.author_id === user._id) {
              assessmentRowItem(data);
            }
            return null;
          });
      } else if (user.role === "Student") {
        all_assessments
          .filter((item) =>
            item.name.toLowerCase().includes(searchFilter.toLowerCase())
          )
          .forEach((data) => {
            let class_assigned = data.class_assigned;
            if (class_assigned.indexOf(user.kelas) !== -1 && data.posted) {
              assessmentRowItem(data);
            }
            return null;
          });
      }
      return;
    }
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  // Call the function to view the Assessments on tablerows.
  // This function is defined above.
  retrieveAssessments();

  const onDeleteAssessment = (id, type) => {
    deleteAssessment(id, type).then((res) => {
      console.log(res);
      getAllAssessments(user.unit);
      handleOpenDeleteSnackbar();
      handleCloseDeleteDialog();
    });
  };

  // Delete Dialog
  const handleOpenDeleteDialog = (e, id, name) => {
    e.stopPropagation();
    setOpenDeleteDialog(true);
    setSelectedAssessmentId(id);
    setSelectedAssessmentName(name);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
  };

  const handleOpenCopySnackBar = (type) => {
    setOpenCopySnackBar(true);
    setAssessmentType(type);
  };

  const handleCloseCopySnackBar = () => {
    setOpenCopySnackBar(false);
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

  const workStatus = (assessment) => {
    let workStatus = !assessment.submissions
      ? "Belum Ditempuh"
      : "Sudah Ditempuh";
    return workStatus;
  };

  document.title = "Schooly | Daftar Kuis";

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
            <FaClipboardList />
          </Avatar>
        </Grid>
        <Grid item>
          <Typography variant="h5" align="left">
            Kuis
          </Typography>
        </Grid>
      </Grid>
      <Divider />
      <AssessmentListToolbar
        role={user.role}
        deleteAssessment={deleteAssessment}
        classes={classes}
        order={order}
        orderBy={orderBy}
        onRequestSort={handleRequestSort}
        rowCount={rows ? rows.length : 0}
        searchFilter={searchFilter}
        setSearchFilter={setSearchFilter}
        setSearchBarFocus={setSearchBarFocus}
        searchBarFocus={searchBarFocus}
      />
      {rows.length === 0 ? (
        <Empty />
      ) : (
        <Grid container direction="column" spacing={2}>
          <AssessmentItem
            data={stableSort(rows, getComparator(order, orderBy))}
            handleOpenDeleteDialog={handleOpenDeleteDialog}
            handleOpenCopySnackBar={handleOpenCopySnackBar}
          />
        </Grid>
      )}
      <DeleteDialog
        openDeleteDialog={openDeleteDialog}
        handleCloseDeleteDialog={handleCloseDeleteDialog}
        itemType="Kuis"
        itemName={selectedAssessmentName}
        warningText="Nilai Kuis yang ada juga akan dihapus."
        deleteItem={() => onDeleteAssessment(selectedAssessmentId, "Kuis")}
      />
      <Snackbar
        open={copySnackbarOpen}
        autoHideDuration={3000}
        onClose={handleCloseCopySnackBar}
      >
        <Alert onClose={handleCloseCopySnackBar} severity="success">
          Tautan {type} berhasil disalin ke Clipboard Anda!
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
          Kuis berhasil dihapus
        </Alert>
      </Snackbar>
    </div>
  );
}

AssessmentList.propTypes = {
  auth: PropTypes.object.isRequired,
  classesCollection: PropTypes.object.isRequired,
  getAllClass: PropTypes.func.isRequired,
  subjectsCollection: PropTypes.object.isRequired,
  getTeachers: PropTypes.func.isRequired,
  assessmentsCollection: PropTypes.object.isRequired,
  getAllAssessments: PropTypes.func.isRequired,
  deleteAssessment: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  classesCollection: state.classesCollection,
  subjectsCollection: state.subjectsCollection,
  assessmentsCollection: state.assessmentsCollection,
  errors: state.errors,
});

export default connect(mapStateToProps, {
  getAllClass,
  getAllSubjects,
  getTeachers,
  getAllAssessments,
  deleteAssessment,
})(AssessmentList);
