import React from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import { lighten, makeStyles } from "@material-ui/core/styles";
import { Button, Checkbox, IconButton, Dialog, Grid, Paper, ListItemSecondaryAction, Table, TableBody, TableCell, TableContainer,
   TableHead, TableRow, TableSortLabel, Toolbar, Tooltip, Typography } from "@material-ui/core/";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import moment from 'moment';
import CloseIcon from "@material-ui/icons/Close";
import { viewTask, deleteTask } from '../../../actions/TaskActions';
import { viewOneClass } from "../../../actions/ClassActions"
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import DeleteOutlineIcon from "@material-ui/icons/DeleteOutline";
import CancelIcon from "@material-ui/icons/Cancel";
import 'moment/locale/id'
import PostAddIcon from '@material-ui/icons/PostAdd';
import LightToolTip from "../../misc/light-tooltip/LightTooltip";

function createData(_id, tasktitle, subject, class_assigned, deadline, action) {
  return (action == null ? { _id, tasktitle, subject, class_assigned, deadline }
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

// const headCells = [
//   { id: "tasktitle", numeric: false, disablePadding: true, label: "Nama Tugas" },
//   { id: "subject", numeric: false, disablePadding: false, label: "Mata Pelajaran" },
//   { id: "class_assigned", numeric: false, disablePadding: false, label: "Ditugaskan pada" },
//   { id: "deadline", numeric: false, disablePadding: false, label: "Batas waktu" },
//   { id: "action", numeric: false, disablePadding: false, label: "Tindakan" },
// ];

function TaskListHead(props) {
  const { classes, onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort, role } = props;

  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  const headCells = [
    { id: "tasktitle", numeric: false, disablePadding: true, label: "Nama Tugas" },
    { id: "subject", numeric: false, disablePadding: false, label: "Mata Pelajaran" },
    { id: "class_assigned", numeric: false, disablePadding: false, label: "Ditugaskan pada" },
    { id: "deadline", numeric: false, disablePadding: false, label: "Batas waktu" },
    { id: "action", numeric: false, disablePadding: false, label: "Tindakan" },
  ];

  if(role == "Student"){
    console.log("Run ")
    headCells.pop()
  }
  console.log(headCells)
  return (
    <TableHead style={{backgroundColor: "rgba(0,0,0,0.05)"}}>
      <TableRow>
        {/* <TableCell padding="checkbox">
          <Checkbox
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            color="secondary"
          />
        </TableCell> */}
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
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(["asc", "desc"]).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

const useToolbarStyles = makeStyles((theme) => ({
  root: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(1),
  },
  highlight:
    theme.palette.type === "light"
      ? {
          color: theme.palette.secondary.main,
          backgroundColor: lighten(theme.palette.secondary.light, 0.85),
        }
      : {
          color: theme.palette.text.secondary,
          backgroundColor: theme.palette.secondary.dark,
        },
  title: {
    flex: "1 1 100%",
  },
  addIcon: {

  }
}));

const TaskListToolbar = (props) => {
  const classes = useToolbarStyles();
  const { numSelected, deleteTask, item , role} = props;
  // the item stores the id directly
  return (
    <Toolbar
      className={clsx(classes.root, {
        [classes.highlight]: numSelected > 0,
      })}
    >
      {numSelected > 0 ? (
        <Typography className={classes.title} color="inherit" variant="subtitle1" component="div">
          {numSelected} Kelas Dipilih
        </Typography>
      ) : (
        <Typography className={classes.title} variant="h5" id="tableTitle" component="div" style={{textAlign: "center"}}>
          {role == "Teacher" ? <b>Daftar tugas yang anda berikan</b> : 
          <b>Daftar tugas yang diberikan</b>}
          {/* Nanti buat untuk yang admin juga */}
        </Typography>
      )}

      {numSelected > 0 ? (
        <Tooltip title="Delete">
          <IconButton onClick={() => props.handleOpenDeleteDialog(item[0])}>
            <DeleteIcon/>
          </IconButton>
        </Tooltip>
      ) : (
        null
      )}
      {role == "Student" ? <div style={{display: 'none'}}></div> : 
      <Link to="/createtask">
        <LightToolTip title="Buat tugas">
        <IconButton>
          <PostAddIcon/>
        </IconButton>
        </LightToolTip>
      </Link>
      }
    </Toolbar>
  );
};

TaskListToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
};

const useStyles = makeStyles((theme) => ({
  root: {
    margin: "auto",
    maxWidth: "1000px",
  },
  dialogBox: {
    maxWidth: "450px",
    margin: "auto"
  },
  paper: {
    width: "100%",
    marginBottom: theme.spacing(2),
  },
  table: {
    minWidth: 750,
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

function NewTaskList(props) {
  const classes = useStyles();
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("homeroomTeacher");
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
        user.role == "Student" ? null :
        [
          <Link to={`/task/${data._id}`}>
        <IconButton onClick={(e)=> e.stopPropagation()}>
        <EditIcon/>
      </IconButton>
      </Link>,
      <Tooltip title="Delete">
      <IconButton 
      onClick={(e) =>{
          handleOpenDeleteDialog(e, data._id, data.name)}}  >
        <DeleteIcon style={{color: "#B22222"}} />
      </IconButton>
      
    </Tooltip>
        ]
      )
    )
  }
  const retrieveTasks = () => {
    if(tasksCollection.length == undefined){
      viewTask();
    } else {
      rows = []
      console.log(tasksCollection)
      console.log(user)

      if(user.role == "Teacher"){
      tasksCollection.map((data) => {
        console.log(data.person_in_charge_id, user.id)
        if(data.person_in_charge_id == user.id){
          taskRowItem(data)
          }
        })
      }

      else if (user.role == "Student"){
          tasksCollection.map((data) => {
          let class_assigned = data.class_assigned;
          for (var i = 0; i < class_assigned.length; i++){
            if(class_assigned[i]._id == user.kelas){
              taskRowItem(data)
              break;
            } 
        }
      })
      }

      else { // Untuk Admin 
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

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = rows.map((n) => n.tasktitle);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, item) => {
    const selectedIndex = selected.indexOf(item._id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, item._id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }
    setSelected(newSelected);
  };

  const isSelected = (name) => selected.indexOf(name) !== -1;

  // call the function to get the tasks lists from DB
  if(rows.length == 0)
    retrieveTasks()

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
          className={classes.dialogBox}
        >
          <Grid container justify="center" className={classes.dialogRoot}>
            <Grid item
              container
              justify="flex-end"
              alignItems="flex-start"
              style={{marginBottom: "10px"}}
            >
              <IconButton
                size="small"
                disableRipple
                onClick={handleCloseDeleteDialog}
                className={classes.iconButtonClose}
              >
                <CloseIcon />
              </IconButton>
            </Grid>
            <Grid item container justify="center" style={{marginBottom: "20px"}}>
              <Typography variant="h5" gutterBottom>
                Hapus Tugas berikut?
              </Typography>
            </Grid>
            <Grid item container justify="center" style={{marginBottom: "20px", textAlign:'center'}}>
              <Typography variant="h6" gutterBottom>
                <b>{selectedTaskName}</b>
              </Typography>
            </Grid>
            <Grid
                  container
                  direction="row"
                  justify="center"
                  alignItems="center"
                  spacing={2}
                  style={{marginBottom: "20px"}}
                >
              <Grid item>
              <Button
                onClick={() => { onDeleteTask(selectedTaskId)}}
                startIcon={<DeleteOutlineIcon />}
                style={{
                  backgroundColor: "#B22222",
                  color: "white",
                  width: "150px",
                }}
              >
                Hapus
              </Button>
              </Grid>
  
              <Grid item>
                    <Button
                    onClick={handleCloseDeleteDialog}
                      startIcon={< CancelIcon/>}
                      style={{
                        backgroundColor: "#2196f3",
                        color: "white",
                        width: "150px",
                      }}
                    >
                      Batalkan
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
        <TaskListToolbar role={user.role} numSelected={selected.length} item={selected} deleteTask={deleteTask} handleOpenDeleteDialog={handleOpenDeleteDialog}/>
        <TableContainer>
          <Table
            className={classes.table}
            aria-labelledby="tableTitle"
            aria-label="enhanced table"
          >
            <TaskListHead
            role={user.role}
              classes={classes}
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={rows != undefined ?
              rows.length: 0}
            />
            <TableBody>
              {stableSort(rows, getComparator(order, orderBy))
                .map((row, index) => {
                  const isItemSelected = isSelected(row._id);
                  const labelId = `enhanced-table-checkbox-${index}`;
                  let viewpage = `/new-task/${row._id}`
                  return (
                    <TableRow
                      hover
                      // onClick={(event) => handleClick(event, row)}
                      onClick={() =>window.location.href = viewpage}
                      // component="a"
                      // href={viewpage}
                      role="checkbox"
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
                      {user.role == "Student" ? null : <TableCell align="center">{row.action}</TableCell>}
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

NewTaskList.propTypes = {
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
  {viewTask, deleteTask, viewOneClass}
)(NewTaskList);
