import React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import moment from "moment";
import "moment/locale/id";
import { viewTask, deleteTask } from "../../../actions/TaskActions";
import LightTooltip from "../../misc/light-tooltip/LightTooltip";
import { Button, IconButton, Dialog, Divider, ExpansionPanel, ExpansionPanelDetails, ExpansionPanelSummary,
   Fab, Grid, Hidden, ListItem, ListItemText, Paper, Menu, MenuItem, TableSortLabel, Toolbar, Typography } from "@material-ui/core/";
import { makeStyles } from "@material-ui/core/styles";
import AssignmentIcon from "@material-ui/icons/Assignment";
import CancelIcon from "@material-ui/icons/Cancel";
import CloseIcon from "@material-ui/icons/Close";
import DeleteIcon from "@material-ui/icons/Delete";
import DeleteOutlineIcon from "@material-ui/icons/DeleteOutline";
import EditIcon from "@material-ui/icons/Edit";
import PageviewIcon from "@material-ui/icons/Pageview";
import SortIcon from "@material-ui/icons/Sort";

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
  const { classes, order, orderBy, onRequestSort, role } = props;

  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  const headCells = [
    { id: "tasktitle", numeric: false, disablePadding: true, label: "Nama Tugas" },
    { id: "subject", numeric: false, disablePadding: false, label: "Mata Pelajaran" },
    { id: "deadline", numeric: false, disablePadding: false, label: "Batas Waktu" },
    { id: "class_assigned", numeric: false, disablePadding: false, label: "Ditugaskan Pada" },
  ];

  if(role === "Student") {
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

  return(
    <Toolbar className={classes.toolbar}>
      <Typography variant="h4" color="primary">
        <b>Daftar Tugas</b>
      </Typography>
      <div style={{display: "flex"}}>
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
      </div>
    </Toolbar>
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
    padding: "15px",
  },
  newTaskButton: {
    marginRight: "10px",
    backgroundColor: "#61BD4F",
    color: "white",
    "&:focus, &:hover": {
      backgroundColor: "#61BD4F",
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
  dialogBox: {
    width: "350px",
    padding: "15px",
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
  const [selected, setSelected] = React.useState([]);

  const [openDeleteDialog, setOpenDeleteDialog] = React.useState(null);
  const [selectedTaskId, setSelectedTaskId] = React.useState(null)
  const [selectedTaskName, setSelectedTaskName] = React.useState(null);

  const { tasksCollection, viewTask, deleteTask } = props;
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

  React.useEffect(() => {viewTask()},
  [tasksCollection.length])

  const retrieveTasks = () => {
    // If tasksCollection is not undefined or an empty array
    if(tasksCollection.length) {
      rows = []
      if(user.role === "Teacher") {
      tasksCollection.map((data) => {
        if(data.person_in_charge_id === user.id) {
          taskRowItem(data)
          }
        })
      }
      else if (user.role === "Student"){
        tasksCollection.map((data) => {
          let class_assigned = data.class_assigned;
          for (var i = 0; i < class_assigned.length; i++) {
            if(class_assigned[i]._id === user.kelas) {
              taskRowItem(data)
              break;
            }
          }
        })
      }
      else { //Admin
        tasksCollection.map((data) => {
          taskRowItem(data)
        })
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

  const isSelected = (name) => selected.indexOf(name) !== -1;
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

  function DeleteDialog(){
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
              Hapus Tugas berikut?
            </Typography>
          </Grid>
          <Grid item container justify="center" style={{marginBottom: "20px"}}>
            <Typography variant="h6" align="center" gutterBottom>
              <b>{selectedTaskName}</b>
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
                onClick={() => { onDeleteTask(selectedTaskId) }}
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

  // Task Expansion Panel
  const [expanded, setExpanded] = React.useState(false);
  const handleTogglePanel = () => {
    setExpanded();
  };
  const handleClosePanel = () => {
    setExpanded(false);
  };

  document.title = "Schooly | Daftar Tugas";

  return(
    <div className={classes.root}>
      {DeleteDialog()}
      <TaskListToolbar
        role={user.role}
        deleteTask={deleteTask}
        classes={classes}
        order={order}
        orderBy={orderBy}
        onRequestSort={handleRequestSort}
        rowCount={rows ? rows.length : 0}
        handleClosePanel={handleClosePanel}
      />
        <Grid container direction="column" spacing={2}>
        {stableSort(rows, getComparator(order, orderBy))
          .map((row, index) => {
            const isItemSelected = isSelected(row._id);
            const labelId = `enhanced-table-checkbox-${index}`;
            let viewpage = user.role === "Student" ? `/tugas-murid/${row._id}` : `/tugas-guru/${row._id}`
            return(
              <Grid item>
                {user.role === "Teacher" ?
                  <ExpansionPanel
                    button
                    variant="outlined"
                    aria-checked={isItemSelected}
                    selected={isItemSelected}
                  >
                    <ExpansionPanelSummary className={classes.taskPanelSummary}>
                      <Grid container spacing={1} justify="space-between" alignItems="center">
                        <Grid item>
                          <Hidden smUp implementation="css">
                            <Typography variant="subtitle1" id={labelId}>
                              {row.tasktitle}
                            </Typography>
                            <Typography variant="caption" color="textSecondary">
                              {row.subject}
                            </Typography>
                          </Hidden>
                          <Hidden xsDown implementation="css">
                            <Typography variant="h6" id={labelId}>
                              {row.tasktitle}
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                              {row.subject}
                            </Typography>
                          </Hidden>
                        </Grid>
                        <Grid item xs container spacing={1} justify="flex-end">
                          <Grid item>
                            <LightTooltip title="Lihat Lebih Lanjut">
                              <IconButton
                                size="small"
                                href={viewpage}
                                className={classes.viewTaskButton}
                                onClick={(event) => event.stopPropagation()}
                              >
                                <PageviewIcon fontSize="small" />
                              </IconButton>
                            </LightTooltip>
                          </Grid>
                          <Grid item>
                            <LightTooltip title="Sunting">
                              <Link to={`/sunting-tugas/${row._id}`}>
                                <IconButton
                                  size="small"
                                  className={classes.editTaskButton}
                                  onClick={(e)=> e.stopPropagation()}
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
                      <Grid conntainer direction="column">
                        <Grid item>
                          <Typography variant="body1" gutterBottom>
                            <b>Kelas yang Ditugaskan:</b> {row.class_assigned.map((kelas,i) => {
                              if(i === row.class_assigned.length - 1)
                                return (`${kelas.name}`)
                              return (`${kelas.name}, `)})
                            }
                          </Typography>
                        </Grid>
                        <Grid item>
                          <Typography variant="body2" className={classes.deadlineWarningText}>
                             Batas Waktu: {moment(row.deadline).locale("id").format("DD/MMM/YYYY - HH:mm")}
                          </Typography>
                        </Grid>
                      </Grid>
                    </ExpansionPanelDetails>
                  </ExpansionPanel>
                :
                  <Paper
                    button component="a"
                    href={viewpage}
                    variant="outlined"
                    className={classes.taskPaper}
                  >
                    <div>
                      <Typography variant="h6" id={labelId}>
                        {row.tasktitle}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        {row.subject}
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
                }
              </Grid>
            );
          })}
        </Grid>
    </div>
  );
}

TaskList.propTypes = {
  viewTask: PropTypes.func.isRequired,
  deleteTask: PropTypes.func.isRequired,
  tasksCollection: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
}

const mapStateToProps = (state) => ({
  errors: state.errors,
  auth: state.auth,
  tasksCollection: state.tasksCollection,
})

export default connect(
  mapStateToProps, { viewTask, deleteTask }
)(TaskList);
