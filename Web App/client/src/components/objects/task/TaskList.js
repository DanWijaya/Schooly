import React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { getAllTask, deleteTask } from "../../../actions/TaskActions";
import { getFileSubmitTasksByAuthor } from "../../../actions/files/FileSubmitTaskActions";
import { getAllClass } from "../../../actions/ClassActions";
import { getAllSubjects } from "../../../actions/SubjectActions";
import TaskItem from "../item/TaskItem";
import Empty from "../../misc/empty/Empty";
import DeleteDialog from "../../misc/dialog/DeleteDialog";
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
  Tooltip,
  Typography,
} from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";
import {
  ArrowBack as ArrowBackIcon,
  Assignment as AssignmentIcon,
  Clear as ClearIcon,
  Search as SearchIcon,
  Sort as SortIcon,
} from "@material-ui/icons";
import { makeStyles } from "@material-ui/core/styles";

function createData(
  _id,
  name,
  subject,
  deadline,
  class_assigned,
  createdAt,
  submissionStatus
) {
  return {
    _id,
    name,
    subject,
    deadline,
    class_assigned,
    createdAt,
    submissionStatus,
  };
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

function TaskListToolbar(props) {
  const {
    classes,
    order,
    orderBy,
    onRequestSort,
    role,
    searchFilter,
    setSearchFilter,
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
      label: "Nama Tugas",
    },
    {
      id: "subject",
      numeric: false,
      disablePadding: false,
      label: "Mata Pelajaran",
    },
    {
      id: "createdAt",
      numeric: false,
      disablePadding: false,
      label: "Waktu Dibuat",
    },
    {
      id: "class_assigned",
      numeric: false,
      disablePadding: false,
      label: "Ditugaskan Pada",
    },
  ];

  if (role === "Student") {
    headCells.pop();
  }

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
              <Link to="/buat-tugas">
                <Fab
                  size="large"
                  variant="extended"
                  className={classes.createTaskButton}
                >
                  <AssignmentIcon className={classes.createTaskIconDesktop} />
                  Buat Tugas
                </Fab>
              </Link>
            </Hidden>
            <Hidden mdUp>
              <Tooltip title="Buat Tugas">
                <Link to="/buat-tugas">
                  <Fab size="medium" className={classes.createTaskButton}>
                    <AssignmentIcon className={classes.createTaskIconMobile} />
                  </Fab>
                </Link>
              </Tooltip>
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
                  placeholder="Cari Tugas"
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
                        setSearchFilter("");
                      }}
                    >
                      <ArrowBackIcon />
                    </IconButton>
                    <TextField
                      autoFocus
                      variant="outlined"
                      id="searchFilterMobile"
                      placeholder="Cari Tugas"
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
                            style={{ marginLeft: "-10px" }}
                          >
                            <IconButton
                              size="small"
                              id="searchFilterMobile"
                              onClick={(e) => {
                                e.stopPropagation();
                                onClear(e);
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
                  <Tooltip title="Cari Tugas">
                    <IconButton onClick={() => setSearchBarFocus(true)}>
                      <SearchIcon />
                    </IconButton>
                  </Tooltip>
                )}
              </Hidden>
            </Grid>
            <Grid item>
              <Tooltip title="Urutkan Tugas">
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
  createTaskButton: {
    boxShadow:
      "0px 1px 2px 0px rgba(194,100,1,0.3), 0px 2px 6px 2px rgba(194,100,1,0.15)",
    backgroundColor: theme.palette.success.main,
    color: "white",
    "&:focus, &:hover": {
      backgroundColor: theme.palette.success.main,
      color: "white",
    },
  },
  createTaskIconDesktop: {
    width: "25px",
    height: "25px",
    marginRight: "8px",
  },
  createTaskIconMobile: {
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

function TaskList(props) {
  const classes = useStyles();
  const {
    tasksCollection,
    getAllTask,
    deleteTask,
    getAllClass,
    getAllSubjects,
  } = props;
  const { user } = props.auth;
  const { all_classes_map } = props.classesCollection;
  const { all_subjects_map } = props.subjectsCollection;

  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("subject");
  const [openDeleteDialog, setOpenDeleteDialog] = React.useState(null);
  const [selectedTaskId, setSelectedTaskId] = React.useState(null);
  const [selectedTaskName, setSelectedTaskName] = React.useState(null);
  const [searchFilter, setSearchFilter] = React.useState("");
  const [searchBarFocus, setSearchBarFocus] = React.useState(false);
  const [submittedTaskIds, setSubmittedTaskIds] = React.useState(new Set());
  const [openDeleteSnackbar, setOpenDeleteSnackbar] = React.useState(false);

  const taskRowItem = (data) => {
    rows.push(
      createData(
        data._id,
        data.name,
        data.subject,
        data.deadline,
        data.class_assigned,
        data.createdAt,
        data.submissionStatus
      )
    );
  };

  React.useEffect(() => {
    getAllTask(user.unit);
    getAllClass(user.unit, "map");
    getAllSubjects(user.unit, "map");

    if (user.role === "Student") {
      let submittedTaskIdSet = new Set();
      getFileSubmitTasksByAuthor(user._id)
        .then((response) => {
          for (let file of response.data) {
            submittedTaskIdSet.add(file.task_id);
          }
        })
        .finally(() => {
          // If there is error 404 (files.length === 0), submittedTaskIds will be filled with an empty set.
          setSubmittedTaskIds(submittedTaskIdSet);
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    // To show delete snackbar when a task is deleted.
    if (props.location.openDeleteSnackbar) {
      handleOpenDeleteSnackbar();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const retrieveTasks = () => {
    rows = [];
    // If tasksCollection is not undefined or an empty array
    if (tasksCollection.length > 0) {
      if (user.role === "Teacher") {
        tasksCollection
          .filter((item) =>
            item.name.toLowerCase().includes(searchFilter.toLowerCase())
          )
          .forEach((data) => {
            if (data.person_in_charge_id === user._id) {
              taskRowItem(data);
            }
          });
      } else if (user.role === "Student") {
        if (submittedTaskIds) {
          tasksCollection
            .filter((item) =>
              item.name.toLowerCase().includes(searchFilter.toLowerCase())
            )
            .forEach((data) => {
              let class_assigned = data.class_assigned;
              if (class_assigned.indexOf(user.kelas) !== -1) {
                taskRowItem({
                  ...data,
                  submissionStatus: submittedTaskIds.has(data._id),
                });
              }
            });
        }
      } else {
        // For administrator?
        tasksCollection
          .filter((item) =>
            item.name.toLowerCase().includes(searchFilter.toLowerCase())
          )
          .forEach((data) => taskRowItem(data));
      }
    }
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
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

  // Call the function to view the tasks on tablerows.
  // This function is defined above.
  retrieveTasks();

  const onDeleteTask = (id) => {
    deleteTask(id).then((res) => {
      handleOpenDeleteSnackbar();
      handleCloseDeleteDialog();
      getAllTask(user.unit);
    });
  };

  // Delete Dialog
  const handleOpenDeleteDialog = (e, id, name) => {
    e.stopPropagation();
    setOpenDeleteDialog(true);
    setSelectedTaskId(id);
    setSelectedTaskName(name);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
  };

  document.title = "Schooly | Tugas";

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
            <AssignmentIcon />
          </Avatar>
        </Grid>
        <Grid item>
          <Typography variant="h5" align="left">
            Tugas
          </Typography>
        </Grid>
      </Grid>
      <Divider />
      <TaskListToolbar
        role={user.role}
        deleteTask={deleteTask}
        classes={classes}
        order={order}
        orderBy={orderBy}
        onRequestSort={handleRequestSort}
        rowCount={rows ? rows.length : 0}
        setSearchBarFocus={setSearchBarFocus}
        searchBarFocus={searchBarFocus}
        searchFilter={searchFilter}
        setSearchFilter={setSearchFilter}
      />
      {rows.length === 0 ? (
        <Empty />
      ) : (
        <Grid container direction="column" spacing={2}>
          <TaskItem
            data={stableSort(rows, getComparator(order, orderBy))}
            handleOpenDeleteDialog={handleOpenDeleteDialog}
            submittedIds={submittedTaskIds}
          />
        </Grid>
      )}
      <DeleteDialog
        openDeleteDialog={openDeleteDialog}
        handleCloseDeleteDialog={handleCloseDeleteDialog}
        itemType="Tugas"
        itemName={selectedTaskName}
        warningText="Lampiran, komentar, dan nilai yang ada juga akan dihapus."
        deleteItem={() => onDeleteTask(selectedTaskId)}
      />
      {/* Delete Snackbar */}
      <Snackbar
        open={openDeleteSnackbar}
        autoHideDuration={4000}
        onClose={(event, reason) => handleCloseDeleteSnackbar(event, reason)}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      >
        <Alert
          elevation={6}
          variant="filled"
          severity="success"
          onClose={(event, reason) => handleCloseDeleteSnackbar(event, reason)}
        >
          Tugas berhasil dihapus
        </Alert>
      </Snackbar>
    </div>
  );
}

TaskList.propTypes = {
  getAllTask: PropTypes.func.isRequired,
  getAllClass: PropTypes.func.isRequired,
  deleteTask: PropTypes.func.isRequired,
  tasksCollection: PropTypes.object.isRequired,
  subjectsCollection: PropTypes.object.isRequired,
  classesCollection: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  errors: state.errors,
  auth: state.auth,
  tasksCollection: state.tasksCollection,
  subjectsCollection: state.subjectsCollection,
  classesCollection: state.classesCollection,
});

export default connect(mapStateToProps, {
  getAllTask,
  deleteTask,
  getAllClass,
  getAllSubjects,
})(TaskList);
