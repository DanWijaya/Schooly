import React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import moment from "moment";
import "moment/locale/id";
import { getAllTask, deleteTask } from "../../../actions/TaskActions";
import { getAllClass } from "../../../actions/ClassActions";
import { getAllSubjects } from "../../../actions/SubjectActions";
import DeleteDialog from "../../misc/dialog/DeleteDialog";
import LightTooltip from "../../misc/light-tooltip/LightTooltip";
import { IconButton, Divider, ExpansionPanel, ExpansionPanelDetails, ExpansionPanelSummary,
   Fab, Grid, InputAdornment, Hidden, Paper, Menu, MenuItem, TableSortLabel, TextField, Typography } from "@material-ui/core/";
import { makeStyles } from "@material-ui/core/styles";
import AssignmentIcon from "@material-ui/icons/Assignment";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import PageviewIcon from "@material-ui/icons/Pageview";
import SortIcon from "@material-ui/icons/Sort";
import { GoSearch } from "react-icons/go";
import ClearIcon from '@material-ui/icons/Clear';

function createData(_id, tasktitle, subject, deadline, class_assigned) {
  return { _id, tasktitle, subject, deadline, class_assigned };
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
  const { classes, order, orderBy, onRequestSort, role, searchFilter, updateSearchFilter } = props;

  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  const headCells = [
    { id: "tasktitle", numeric: false, disablePadding: true, label: "Nama Tugas" },
    { id: "subject", numeric: false, disablePadding: false, label: "Mata Pelajaran" },
    { id: "deadline", numeric: false, disablePadding: false, label: "Batas Waktu" },
    { id: "class_assigned", numeric: false, disablePadding: false, label: "Ditugaskan Pada" },
  ];

  if (role === "Student") {
    // Don't include the class_assigned basically.
    headCells.pop()
  }

  // Sort Menu
  const [anchorEl, setAnchorEl] = React.useState(null);
  const handleOpenSortMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleCloseSortMenu = () => {
    setAnchorEl(null);
  };

  // FOR SEARCH FILTER. 
  const onChange = (e) => {
    switch(e.target.id){
      case "searchFilter":
        updateSearchFilter(e.target.value)
        break;

      default:
        break;
    }
  }

  return (
    <div className={classes.toolbar}>
      <Typography variant="h4">
        Daftar Tugas
      </Typography>
      {/* For search filter */}
      <TextField
        fullWidth
        variant="outlined"
        id="searchFilter"
        value={searchFilter}
        onChange={onChange}
        style={{
          maxWidth: "300px",
          padding: "0px 0px"
        }}
        InputProps={{
          startAdornment:(
            <InputAdornment position="start">
              <IconButton size="small" className={classes.searchButton}>
                <GoSearch/>
              </IconButton>
            </InputAdornment>)
            ,
          // endAdornment:( 
          //   <InputAdornment position="end">
          //     <IconButton size="small" className={classes.searchButton}>
          //       <ClearIcon/>
          //     </IconButton>
          //   </InputAdornment>)
        }}
        
      />
      <div style={{display: "flex", alignItems: "center"}}>
        <Hidden smUp implementation="css">
          {role === "Student" ?
            null
          :
            <LightTooltip title="Buat Tugas">
              <Link to="/buat-tugas">
                <Fab size="small" className={classes.newTaskButton}>
                  <AssignmentIcon className={classes.newTaskIconMobile} />
                </Fab>
              </Link>
            </LightTooltip>
          }
        </Hidden>
        <Hidden xsDown implementation="css">
          {role === "Student" ?
            null
          :
            <Link to="/buat-tugas">
              <Fab size="medium" variant="extended" className={classes.newTaskButton}>
                <AssignmentIcon className={classes.newTaskIconDesktop} />
                Buat Tugas
              </Fab>
            </Link>
          }
        </Hidden>
        <LightTooltip title="Urutkan Tugas">
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
      </div>
    </div>
  );
};

TaskListToolbar.propTypes = {
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
    maxWidth: "1000px",
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
  newTaskButton: {
    marginRight: "10px",
    backgroundColor: theme.palette.create.main,
    color: "white",
    "&:focus, &:hover": {
      backgroundColor: theme.palette.create.main,
      color: "white",
    },
  },
  newTaskIconDesktop: {
    width: theme.spacing(3),
    height: theme.spacing(3),
    marginRight: "7.5px",
  },
  newTaskIconMobile: {
    width: theme.spacing(3),
    height: theme.spacing(3),
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
  deadlineWarningText: {
    color: theme.palette.warning.main,
  },
  viewTaskButton: {
    backgroundColor: theme.palette.warning.main,
    color: "white",
    "&:focus, &:hover": {
      backgroundColor: "white",
      color: theme.palette.warning.main,
    },
  },
  editTaskButton: {
    backgroundColor: theme.palette.primary.main,
    color: "white",
    "&:focus, &:hover": {
      backgroundColor: "white",
      color: theme.palette.primary.main,
    },
  },
  deleteTaskButton: {
    backgroundColor: theme.palette.error.dark,
    color: "white",
    "&:focus, &:hover": {
      backgroundColor: "white",
      color: theme.palette.error.dark,
    },
  },
  taskPanelDivider: {
    backgroundColor: theme.palette.primary.main,
  },
  taskPanelSummary: {
    "&:hover": {
      backgroundColor: theme.palette.button.main,
    },
  },
  taskPaper: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "15px",
    "&:focus, &:hover": {
      backgroundColor: theme.palette.button.main,
    },
  },
}));

function TaskList(props) {
  const classes = useStyles();

  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("subject");
  const [openDeleteDialog, setOpenDeleteDialog] = React.useState(null);
  const [selectedTaskId, setSelectedTaskId] = React.useState(null)
  const [selectedTaskName, setSelectedTaskName] = React.useState(null);
  const [searchFilter, updateSearchFilter] = React.useState("");

  const { tasksCollection, getAllTask, deleteTask, getAllClass, getAllSubjects } = props;
  const { all_classes_map } = props.classesCollection;
  const { all_subjects_map} = props.subjectsCollection;
  const { user } = props.auth;

  const taskRowItem = (data) => {
    rows.push(
      createData(
        data._id,
        data.name,
        data.subject,
        data.deadline,
        data.class_assigned,
      )
    )
  }

  React.useEffect(() => {
    getAllTask()
    getAllClass("map")
    getAllSubjects("map")
  },
  // eslint-disable-next-line react-hooks/exhaustive-deps
  [])

  const retrieveTasks = () => {
    // If tasksCollection is not undefined or an empty array
    if (tasksCollection.length) {
      rows = []
      if (user.role === "Teacher") {
      tasksCollection.filter(item => item.name.toLowerCase().includes(searchFilter.toLowerCase()))
      .map((data) => {
        if (data.person_in_charge_id === user.id) {
          return taskRowItem(data)
          }
        return null;
        })
      }
      else if (user.role === "Student") {
        tasksCollection.filter(item => item.name.toLowerCase().includes(searchFilter.toLowerCase()))
          .map((data) => {
          let class_assigned = data.class_assigned;
          if (class_assigned.indexOf(user.kelas) !== -1) {
            return taskRowItem(data)
          }
          return null
        })
      }
      else { //Admin
        tasksCollection.filter(item => item.name.toLowerCase().includes(searchFilter.toLowerCase()))
        .map(data =>  taskRowItem(data))
      }
    }
  }

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  // Call the function to view the tasks on tablerows.
  // This function is defined above.
  retrieveTasks()

  const onDeleteTask = (id) => {
    deleteTask(id)
  }

  // Delete Dialog
  const handleOpenDeleteDialog = (e, id, name) => {
    e.stopPropagation();
    setOpenDeleteDialog(true);
    setSelectedTaskId(id)
    setSelectedTaskName(name)
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
  };

  document.title = "Schooly | Daftar Tugas";

  return (
    <div className={classes.root}>
      <DeleteDialog
        openDeleteDialog={openDeleteDialog}
        handleCloseDeleteDialog={handleCloseDeleteDialog}
        itemType="Tugas"
        itemName={selectedTaskName}
        deleteItem={() => { onDeleteTask(selectedTaskId) }}
      />
      <TaskListToolbar
        role={user.role}
        deleteTask={deleteTask}
        classes={classes}
        order={order}
        orderBy={orderBy}
        onRequestSort={handleRequestSort}
        rowCount={rows ? rows.length : 0}
        //Two props added for search filter. 
        searchFilter={searchFilter}
        updateSearchFilter={updateSearchFilter}
      />
      <Divider variant="inset" className={classes.titleDivider} />
      <Grid container direction="column" spacing={2}>
      {stableSort(rows, getComparator(order, orderBy))
        .map((row, index) => {
          const labelId = `enhanced-table-checkbox-${index}`;
          let viewpage = user.role === "Student" ? `/tugas-murid/${row._id}` : `/tugas-guru/${row._id}`
          return (
            <Grid item>
              {user.role === "Teacher" ?
                <ExpansionPanel
                  button
                  variant="outlined"
                >
                  <ExpansionPanelSummary className={classes.taskPanelSummary}>
                    <Grid container spacing={1} justify="space-between" alignItems="center">
                      <Grid item>
                        <Hidden smUp implementation="css">
                          <Typography variant="subtitle1" id={labelId}>
                            {row.tasktitle}
                          </Typography>
                          <Typography variant="caption" color="textSecondary">
                            {all_subjects_map.get(row.subject)}
                          </Typography>
                        </Hidden>
                        <Hidden xsDown implementation="css">
                          <Typography variant="h6" id={labelId}>
                            {row.tasktitle}
                          </Typography>
                          <Typography variant="body2" color="textSecondary">
                            {all_subjects_map.get(row.subject)}
                          </Typography>
                        </Hidden>
                      </Grid>
                      <Grid item xs container spacing={1} justify="flex-end">
                        <Grid item>
                          <LightTooltip title="Lihat Lebih Lanjut">
                            <Link to={viewpage}>
                              <IconButton
                                size="small"
                                className={classes.viewTaskButton}
                              >
                                <PageviewIcon fontSize="small" />
                              </IconButton>
                            </Link>
                          </LightTooltip>
                        </Grid>
                        <Grid item>
                          <LightTooltip title="Sunting">
                            <Link to={`/sunting-tugas/${row._id}`}>
                              <IconButton
                                size="small"
                                className={classes.editTaskButton}
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
                              className={classes.deleteTaskButton}
                              onClick={(e) =>{handleOpenDeleteDialog(e, row._id, row.tasktitle)}}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </LightTooltip>
                        </Grid>
                      </Grid>
                    </Grid>
                  </ExpansionPanelSummary>
                  <Divider className={classes.taskPanelDivider} />
                  <ExpansionPanelDetails>
                    <Grid container>
                      <Grid item xs={12}>
                        <Typography variant="body1" gutterBottom>
                          <b>Kelas yang Ditugaskan: </b>
                          {!all_classes_map.size  ? null :
                           row.class_assigned.map((id,i) => {

                            if(all_classes_map.get(id)){
                              if (i === row.class_assigned.length - 1)
                                return (`${all_classes_map.get(id).name}`)
                              return (`${all_classes_map.get(id).name}, `)
                            }
                            return null
                           })
                          }
                        </Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <Typography variant="body1" className={classes.deadlineWarningText}>
                           Batas Waktu: {moment(row.deadline).locale("id").format("DD/MMM/YYYY - HH:mm")}
                        </Typography>
                      </Grid>
                    </Grid>
                  </ExpansionPanelDetails>
                </ExpansionPanel>
              :
              <Link to={viewpage}>
                <Paper
                  button component="a"
                  variant="outlined"
                  className={classes.taskPaper}
                >
                  <div>
                    <Typography variant="h6" id={labelId}>
                      {row.tasktitle}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {all_subjects_map.get(row.subject)}
                    </Typography>
                  </div>
                  <div>
                    <Hidden smUp implementation="css">
                      <Typography variant="body2" align="right" className={classes.deadlineWarningText}>
                        Batas Waktu:
                      </Typography>
                      <Typography variant="caption" align="right" className={classes.deadlineWarningText}>
                        {moment(row.deadline).locale("id").format("DD/MMM/YYYY - HH:mm")}
                      </Typography>
                    </Hidden>
                    <Hidden xsDown implementation="css">
                      <Typography variant="body2" align="right" className={classes.deadlineWarningText}>
                        Batas Waktu: {moment(row.deadline).locale("id").format("DD/MMM/YYYY - HH:mm")}
                      </Typography>
                    </Hidden>
                  </div>
                </Paper>
                </Link>
              }
            </Grid>
          );
        })}
      </Grid>
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
}

const mapStateToProps = (state) => ({
  errors: state.errors,
  auth: state.auth,
  tasksCollection: state.tasksCollection,
  subjectsCollection: state.subjectsCollection,
  classesCollection: state.classesCollection
})

export default connect(
  mapStateToProps, { getAllTask, deleteTask, getAllClass, getAllSubjects}
)(TaskList);
