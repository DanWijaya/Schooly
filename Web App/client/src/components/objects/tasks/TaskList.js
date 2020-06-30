import React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import moment from "moment";
import "moment/locale/id";
import { viewTask, deleteTask } from "../../../actions/TaskActions";
import { viewOneClass } from "../../../actions/ClassActions"
import LightToolTip from "../../misc/light-tooltip/LightTooltip";
import { Button, IconButton, Dialog, Fab, Grid, Paper, Table, TableBody, TableCell, TableContainer,
   TableHead, TableRow, TableSortLabel, Toolbar, Typography } from "@material-ui/core/";
import { makeStyles } from "@material-ui/core/styles";
import AssignmentIcon from "@material-ui/icons/Assignment";
import CancelIcon from "@material-ui/icons/Cancel";
import CloseIcon from "@material-ui/icons/Close";
import DeleteIcon from "@material-ui/icons/Delete";
import DeleteOutlineIcon from "@material-ui/icons/DeleteOutline";
import EditIcon from "@material-ui/icons/Edit";

function createData(_id, tasktitle, subject, class_assigned, deadline, action) {
  return (action === null ? { _id, tasktitle, subject, class_assigned, deadline }
    : { _id, tasktitle, subject, class_assigned, deadline, action});
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

function TaskListHead(props) {
  const { classes, order, orderBy, onRequestSort, role } = props;

  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  const headCells = [
    { id: "tasktitle", numeric: false, disablePadding: true, label: "Nama Tugas" },
    { id: "subject", numeric: false, disablePadding: false, label: "Mata Pelajaran" },
    { id: "class_assigned", numeric: false, disablePadding: false, label: "Ditugaskan Pada" },
    { id: "deadline", numeric: false, disablePadding: false, label: "Batas Waktu" },
    { id: "action", numeric: false, disablePadding: false, label: "Atur Tugas" },
  ];

  if(role === "Student") {
    headCells.pop()
  }

  return (
    <TableHead style={{backgroundColor: "rgba(0,0,0,0.05)"}}>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align="center"
            padding={headCell.disablePadding ? "none" : "default"}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : "asc"}
              onClick={createSortHandler(headCell.id)}
            >
              <b>{headCell.label}</b>
              {orderBy === headCell.id ? (
                <span className={classes.visuallyHidden}>
                  {order === "desc" ? "sorted descending" : "sorted ascending"}
                </span>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

TaskListHead.propTypes = {
  classes: PropTypes.object.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(["asc", "desc"]).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

const useToolbarStyles = makeStyles((theme) => ({
  toolbar: {
    display: "auto",
    justifyContent: "space-between",
    padding: "15px",
  },
  newTaskButton: {
    backgroundColor: "#61BD4F",
    color: "white",
    "&:focus, &:hover": {
      backgroundColor: "#61BD4F",
      color: "white",
    },
  },
  newTaskIcon: {
    width: theme.spacing(3),
    height: theme.spacing(3),
    marginRight: "7.5px"
  }
}));

const TaskListToolbar = (props) => {
  const classes = useToolbarStyles();
  const {role } = props;
  // the item stores the id directly
  return (
    <Toolbar className={classes.toolbar}>
      <Typography variant="h4" align="left">
        {role === "Teacher" ? <b>Daftar Tugas</b> :
          <b>Daftar Tugas</b>}
        {/* Nanti buat untuk yang admin juga */}
      </Typography>
      {role === "Student" ? <div style={{display: "none"}} /> :
        <Link to="/buat-tugas">
          <Fab variant="extended" className={classes.newTaskButton}>
            <AssignmentIcon className={classes.newTaskIcon} />
              Buat Tugas
          </Fab>
        </Link>
      }
    </Toolbar>
  );
};

const useStyles = makeStyles((theme) => ({
  root: {
    margin: "auto",
    maxWidth: "1000px",
    padding: "10px",
  },
  tableEditIcon: {
    color: theme.palette.primary.main,
  },
  tableDeleteIcon: {
    color: theme.palette.error.dark,
  },
  dialogBox: {
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
  paper: {
    width: "100%",
    marginBottom: theme.spacing(2),
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
  tableRow: {
    "&:focus, &:hover": {
      backgroundColor: theme.palette.button.main,
      cursor: "pointer",
    },
  },
}));

function TaskList(props) {
  document.title = "Schooly | Daftar Tugas"
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
      createData(data._id, data.name,
        data.subject,
        data.class_assigned,
        data.deadline,
        user.role === "Student" ? null :
        [
          <LightToolTip title="Sunting">
            <Link to={`/sunting-tugas/${data._id}`}>
              <IconButton
                size="small"
                style={{marginRight: "5px"}}
                onClick={(e)=> e.stopPropagation()}>
                <EditIcon className={classes.tableEditIcon} />
              </IconButton>
            </Link>
          </LightToolTip>,
          <LightToolTip title="Hapus">
            <IconButton
              size="small"
              onClick={(e) =>{handleOpenDeleteDialog(e, data._id, data.name)}}>
              <DeleteIcon className={classes.tableDeleteIcon} />
            </IconButton>
          </LightToolTip>
        ]
      )
    )
  }

  React.useEffect(() => {viewTask()}, [tasksCollection.length])

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

  //Delete Dialog box
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
    return (
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

  return (
    <div className={classes.root}>
      {DeleteDialog()}
      <Paper className={classes.paper}>
        <TaskListToolbar role={user.role} deleteTask={deleteTask} handleOpenDeleteDialog={handleOpenDeleteDialog} />
        <TableContainer>
          <Table>
            <TaskListHead
              role={user.role}
              classes={classes}
              order={order}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
              rowCount={rows ?
              rows.length: 0}
            />
            <TableBody>
              {stableSort(rows, getComparator(order, orderBy))
                .map((row, index) => {
                  const isItemSelected = isSelected(row._id);
                  const labelId = `enhanced-table-checkbox-${index}`;
                  let viewpage = user.role === "Student" ? `/tugas-murid/${row._id}` : `/tugas-guru/${row._id}`
                  return (
                    <TableRow
                      className={classes.tableRow}
                      onClick={() => window.location.href = viewpage}
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={row.classroom}
                      selected={isItemSelected}
                    >
                      <TableCell component="th" id={labelId} scope="row" padding="none" align="center">
                        {row.tasktitle}
                      </TableCell>
                      <TableCell align="center">{row.subject}</TableCell>
                      <TableCell align="center">{row.class_assigned.map((kelas) => `${kelas.name}, `)}</TableCell>
                      <TableCell align="center">{moment(row.deadline).locale("id").format("DD-MMM-YYYY")}</TableCell>
                      {user.role === "Student" ? null : <TableCell align="center">{row.action}</TableCell>}
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </div>
  );
}

TaskList.propTypes = {
  viewTask: PropTypes.func.isRequired,
  deleteTask: PropTypes.func.isRequired,
  tasksCollection: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  viewOneClass: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired
}

const mapStateToProps = (state) => ({
  errors: state.errors,
  auth: state.auth,
  tasksCollection: state.tasksCollection,
})

export default connect(
  mapStateToProps,
  { viewTask, deleteTask, viewOneClass }
)(TaskList);
