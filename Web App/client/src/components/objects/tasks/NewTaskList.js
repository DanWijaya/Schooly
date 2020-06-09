import React from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import { lighten, makeStyles } from "@material-ui/core/styles";
import { Checkbox, IconButton, Paper, Table, TableBody, TableCell, TableContainer,
   TableHead, TableRow, TableSortLabel, Toolbar, Tooltip, Typography } from "@material-ui/core/";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import moment from 'moment';
import { viewTask, deleteTask } from '../../../actions/TaskActions';
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import 'moment/locale/id'

function createData(_id, tasktitle, subject, class_assigned, deadline, action) {
  return { _id, tasktitle, subject, class_assigned, deadline, action };
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

const headCells = [
  { id: "tasktitle", numeric: false, disablePadding: true, label: "Nama Tugas" },
  { id: "subject", numeric: false, disablePadding: false, label: "Mata Pelajaran" },
  { id: "class_assigned", numeric: false, disablePadding: false, label: "Ditugaskan pada" },
  { id: "deadline", numeric: false, disablePadding: false, label: "Batas waktu" },
  { id: "action", numeric: false, disablePadding: false, label: "Tindakan" },
];

function TaskListHead(props) {
  const { classes, onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

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
}));

const TaskListToolbar = (props) => {
  const classes = useToolbarStyles();
  const { numSelected, deleteTask, item } = props;
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
          <b>Daftar Tugas</b>
        </Typography>
      )}

      {numSelected > 0 ? (
        <Tooltip title="Delete">
          <IconButton onClick={() => deleteTask(item[0])}>
            <DeleteIcon/>
          </IconButton>
        </Tooltip>
      ) : (
        null
      )}
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

  const { tasksCollection, viewTask, deleteTask } = props;
  const retrieveTasks = () => {
    if(tasksCollection.length == undefined){
      viewTask();
    } else {
      rows = []
      tasksCollection.map((data) => {
        console.log(data.deadline)
        rows.push(
          createData(data._id, data.name,
            data.subject,
            data.class_assigned,
            data.deadline,
            [
            <IconButton>
            <Link
        to={{
          pathname: `/task/${data._id}`,
          state:{ taskId : data._id}
        }}
        // style = {{ color: 'grey'}}
      >
            <EditIcon />
            </Link>
          </IconButton>,
          <Tooltip title="Delete">
          <IconButton onClick={() =>{
            deleteTask(data._id)}}>
            <DeleteIcon style={{color: "#B22222"}} />
          </IconButton>

        </Tooltip>
            ]
            )
        )
      })
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

  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <TaskListToolbar numSelected={selected.length} item={selected} deleteTask={deleteTask}/>
        <TableContainer>
          <Table
            className={classes.table}
            aria-labelledby="tableTitle"
            aria-label="enhanced table"
          >
            <TaskListHead
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
                      component="a"
                      href={viewpage}
                      role="checkbox"
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={row.classroom}
                      selected={isItemSelected}
                    >
                      {/* <TableCell padding="checkbox">
                        <Checkbox
                          checked={isItemSelected}
                          inputProps={{ "aria-labelledby": labelId }}
                          color="secondary"
                          style={{display: "flex", justifyContent: "center"}}
                        />
                      </TableCell> */}
                      <TableCell component="th" id={labelId} scope="row" padding="none" align="center">
                        {row.tasktitle}
                      </TableCell>
                      <TableCell align="center">{row.subject}</TableCell>
                      <TableCell align="center">{row.class_assigned.map((kelas) => `${kelas.name}, `)}</TableCell>
                      <TableCell align="center">{moment(row.deadline).locale("id").format('DD-MMM-YYYY')}</TableCell>
                      <TableCell align="center">{row.action}</TableCell>
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
}

const mapStateToProps = (state) => ({
  errors: state.errors,
  tasksCollection: state.tasksCollection,
})

export default connect(
  mapStateToProps, 
  {viewTask, deleteTask}
)(NewTaskList);