import React from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import { lighten, makeStyles } from "@material-ui/core/styles";
import { Button, Checkbox, Dialog, Grid, IconButton, Paper, Table, TableBody, TableCell, TableContainer,
   TableHead, TableRow, TableSortLabel, Toolbar, Tooltip, Typography } from "@material-ui/core/";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import CloseIcon from "@material-ui/icons/Close";
import DeleteOutlineIcon from "@material-ui/icons/DeleteOutline";
import CancelIcon from "@material-ui/icons/Cancel";

import { viewClass, deleteClass } from '../../../actions/ClassActions';
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import LightToolTip from "../../misc/light-tooltip/LightTooltip";
import PostAddIcon from '@material-ui/icons/PostAdd';

// Source of the tables codes are from here : https://material-ui.com/components/tables/

function createData(_id, classroom, homeroomTeacher, size, absent, action) {
  return { _id, classroom, homeroomTeacher, size, absent, action };
}

var rows=[];

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
  { id: "classroom", numeric: false, disablePadding: true, label: "Kelas" },
  { id: "homeroomTeacher", numeric: false, disablePadding: false, label: "Wali Kelas" },
  { id: "size", numeric: true, disablePadding: false, label: "Jumlah Murid" },
  { id: "absent", numeric: false, disablePadding: false, label: "Absen" },
  { id: "action", numeric: false, disablePadding: false, label: "Sunting/Buang" },
];

function ClassListHead(props) {
  const { classes, onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

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

ClassListHead.propTypes = {
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

const ClassListToolbar = (props) => {
  const classes = useToolbarStyles();
  const { numSelected, item , deleteClass} = props;

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
          <b>Daftar Kelas</b>
        </Typography>
      )}

      {numSelected > 0 ? (
        <LightToolTip title="Buat Kelas">
          <IconButton onClick={() =>{
            deleteClass(item[0])}}>
            <DeleteIcon />
          </IconButton>

        </LightToolTip>
      ) : (
        null
      )}
      <Link to="/createclass">
      <LightToolTip title="Buat Kelas">
        <IconButton>
          <PostAddIcon/>
        </IconButton>
      </LightToolTip>
      </Link>
    </Toolbar>
  );
};

ClassListToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
};

const useStyles = makeStyles((theme) => ({
  root: {
    margin: "auto",
    maxWidth: "750px",
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

function NewClassList(props) {
  const classes = useStyles();
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("homeroomTeacher");
  const [selected, setSelected] = React.useState([]);
  // const [classesList, setClassesList] = React.useState([]);

  const [openDeleteDialog, setOpenDeleteDialog] = React.useState(null);
  const [selectedClassId, setSelectedClassId] = React.useState(null)
  const [selectedClassName, setSelectedClassName] = React.useState(null);

  const { viewClass, deleteClass, classesCollection} = props;
  const { user } = props.auth;

  const retrieveClasses = () => {
    if(classesCollection.all_classes.length == 0){
      viewClass();
    } else {
      rows = []
      classesCollection.all_classes.map((data) => {
        rows.push(
          createData(data._id, data.name,
            data.walikelas.name,
            data.ukuran,
            data.nihil ? "Nihil" : "Tidak Nihil",
            [<IconButton onClick={(e) => { e.stopPropagation()
                window.location.href = `/editclass/${data._id}`}
            }>
              <EditIcon />
            </IconButton> , 
            <IconButton>
              <Tooltip title="Delete">
              <IconButton 
                onClick={(e) =>{
                  handleOpenDeleteDialog(e, data._id, data.name)}}>
                <DeleteIcon style={{color: "#B22222"}}/>
              </IconButton>
              </Tooltip>
            </IconButton>
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

  const handleSelectAllClick = (event, checked) => {
    // console.log(event.target.checked)
    if (checked) {
      const newSelected = rows.map((n) => n._id);
      console.log(newSelected)
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, item) => { // get the id by item._id
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

  // call the function to get the classes from DB
  if(rows.length == 0)
    retrieveClasses()

    const onDeleteClass = (id) => {
      deleteClass(id)
    }

    //Delete Dialog box
  const handleOpenDeleteDialog = (e, id, name) => {
    e.stopPropagation();
    setOpenDeleteDialog(true);
    setSelectedClassId(id)
    setSelectedClassName(name)
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
                <b>{selectedClassName}</b>
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
                onClick={() => { onDeleteClass(selectedClassId)}}
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
                        backgroundColor: "#2196F3",
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
  if(user.role == "Student"){
    return (
      <div className={classes.root}>
        <Typography className={classes.title} variant="h5" id="tableTitle" component="div" style={{textAlign: "center"}}>
          <b>Anda tidak punya izin untuk akses halaman ini</b>
        </Typography>
      </div>
    )
  }
  return (
    <div className={classes.root}>
      {DeleteDialog()}
      <Paper className={classes.paper}>
        <ClassListToolbar numSelected={selected.length} item={selected} deleteClass={deleteClass}/>
        <TableContainer>
          <Table
            className={classes.table}
            aria-labelledby="tableTitle"
            aria-label="enhanced table"
          >
            <ClassListHead
              classes={classes}
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={(event, target) => {handleSelectAllClick(event,target)}}
              onRequestSort={handleRequestSort}
              rowCount={rows != undefined ?
              rows.length : 0}
            />
            <TableBody>
              {stableSort(rows, getComparator(order, orderBy))
                .map((row, index) => {
                  const isItemSelected = isSelected(row._id);
                  const labelId = `enhanced-table-checkbox-${index}`;
                  let viewpage = `/viewclass/${row._id}`
                  return (
                    <TableRow
                      hover
                      // onClick={(event) => handleClick(event, row)}
                      onClick={() => window.location.href = viewpage}
                      role="checkbox"
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={row.classroom}
                      selected={isItemSelected}
                    >
                      <TableCell component="th" id={labelId} scope="row" padding="none" align="center">
                        {row.classroom}
                      </TableCell>
                      <TableCell align="center">{row.homeroomTeacher}</TableCell>
                      <TableCell align="center">{row.size}</TableCell>
                      <TableCell align="center">{row.absent}</TableCell>
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

NewClassList.propTypes = {
  viewClass: PropTypes.func.isRequired,
  classesCollection: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  deleteClass: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired
}

const mapStateToProps = (state) => ({
  errors: state.errors,
  auth: state.auth,
  classesCollection: state.classesCollection,
})

export default connect(
  mapStateToProps,
  {viewClass, deleteClass }
)(NewClassList);
