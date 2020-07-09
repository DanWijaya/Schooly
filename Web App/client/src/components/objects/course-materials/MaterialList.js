import React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import moment from "moment";
import "moment/locale/id";
import { getAllMaterials, getMaterial, deleteMaterial } from "../../../actions/MaterialActions";
import { viewSelectedClasses } from "../../../actions/ClassActions";
import { getUsers } from "../../../actions/UserActions";
import LightTooltip from "../../misc/light-tooltip/LightTooltip";
import { Button, IconButton, Dialog, Fab, Grid, Paper, Table, TableBody, TableCell, TableContainer,
   TableHead, TableRow, TableSortLabel, Toolbar, Typography } from "@material-ui/core/";
import { makeStyles } from "@material-ui/core/styles";
import AssignmentIcon from "@material-ui/icons/Assignment";
import CancelIcon from "@material-ui/icons/Cancel";
import CloseIcon from "@material-ui/icons/Close";
import DeleteIcon from "@material-ui/icons/Delete";
import DeleteOutlineIcon from "@material-ui/icons/DeleteOutline";
import EditIcon from "@material-ui/icons/Edit";
import MenuBookIcon from '@material-ui/icons/MenuBook';


function createData(_id, tasktitle, subject, author, class_assigned, action) {
  console.log(author)
  return(action === null ? { _id, tasktitle, subject, author, class_assigned }
    : { _id, tasktitle, subject, author, class_assigned, action});
}

var rows = []; // initially will be empty

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

function MaterialListHead(props) {
  const { classes, order, orderBy, onRequestSort, role } = props;

  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  const headCells = [
    { id: "materialtitle", numeric: false, disablePadding: true, label: "Nama Materi" },
    { id: "material", numeric: false, disablePadding: false, label: "Mata Pelajaran" },
    { id: "author", numeric: false, disablePadding: false, label: "Pemberi Materi" },
    { id: "class_given", numeric: false, disablePadding: false, label: "Kelas yang diberikan" },
    { id: "action", numeric: false, disablePadding: false, label: "Atur Materi" },
  ];

  if(role === "Student") {
    headCells.pop()
  }

  return(
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

MaterialListHead.propTypes = {
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
    marginRight: "7.5px",
  }
}));

const MaterialListToolbar = (props) => {
  const classes = useToolbarStyles();
  const { role } = props;
  // The item stores the id directly
  return(
    <Toolbar className={classes.toolbar}>
      <Typography variant="h4" align="left">
        <b>Daftar Materi</b>
        {/* Nanti buat untuk yang admin juga */}
      </Typography>
      {role === "Student" ? <div style={{display: "none"}} /> :
        <Link to="/buat-materi">
          <Fab variant="extended" className={classes.newTaskButton}>
            <MenuBookIcon className={classes.newTaskIcon} />
              Buat Materi
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

function MaterialList(props) {
  const classes = useStyles();

  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("subject");
  const [selected, setSelected] = React.useState([]);

  const [openDeleteDialog, setOpenDeleteDialog] = React.useState(null);
  const [selectedTaskId, setSelectedTaskId] = React.useState(null)
  const [selectedTaskName, setSelectedTaskName] = React.useState(null);

  const {getAllMaterials, getMaterial, deleteMaterial, getUsers, viewSelectedClasses } = props;
  const {all_materials, selectedMaterials} = props.materialsCollection;
  const { selectedClasses, all_classes} = props.classesCollection;
  const { user, retrieved_users } = props.auth;

  React.useEffect(() => {
    let materialsRetrieved = []

    if(user.role === "Admin"){
      materialsRetrieved = all_materials
      getAllMaterials()
    } else {
      materialsRetrieved = selectedMaterials;
      if(user.role === "Teacher"){
        getMaterial(user.id, "by_author")
      } else { // for student
        getMaterial(user.kelas, "by_class")
      }
    }

    let userIds = []
    let classIds = new Set()
    for(var i = 0; i < materialsRetrieved.length; i++){
      let material = materialsRetrieved[i]
      userIds.push(material.author_id)

      for(var j = 0; j < material.class_assigned.length; j++){
        classIds.add(material.class_assigned[j])
      }
    }

    getUsers(userIds) // to get the authors objects.
    viewSelectedClasses(Array.from(classIds)) // to get the classes objects.
  }, [selectedMaterials.length, all_materials.length])

  const materialRowItem = (data) => {
    console.log(data)
    console.log(retrieved_users.get(user.id))
    rows.push(
      createData(data._id, data.name,
        data.subject,
        !(retrieved_users).size ? {}: retrieved_users.get(data.author_id),
        data.class_assigned,
        user.role === "Student" ? null :
        [
          <LightTooltip title="Sunting">
            <Link to={`/sunting-materi/${data._id}`}>
              <IconButton
                size="small"
                style={{marginRight: "5px"}}
                onClick={(e)=> e.stopPropagation()}>
                <EditIcon className={classes.tableEditIcon} />
              </IconButton>
            </Link>
          </LightTooltip>,
          <LightTooltip title="Hapus">
            <IconButton
              size="small"
              onClick={(e) =>{handleOpenDeleteDialog(e, data._id, data.name)}}>
              <DeleteIcon className={classes.tableDeleteIcon} />
            </IconButton>
          </LightTooltip>
        ]
      )
    )
  }

  const retrieveMaterials = () => {
    console.log(selectedMaterials)
    console.log(retrieved_users)
    // If all_materials is not undefined or an empty array
    rows = []
    if(user.role === "Admin"){
      all_materials.map((data) => { materialRowItem(data)})
    }else {
    if(selectedMaterials.length) {
      selectedMaterials.map((data) => materialRowItem(data))
    }
  }


    // if(selectedMaterials.length) {
    //     rows = []
    //     if(user.role === "Teacher") {
    //     selectedMaterials.map((data) => {
    //       if(data.author_id === user.id) {
    //         materialRowItem(data)
    //         }
    //       })
    //     }
    //     else if (user.role === "Student"){
    //       selectedMaterials.map((data) => {
    //         let class_assigned = data.class_assigned;
    //         for (var i = 0; i < class_assigned.length; i++) {
    //           if(class_assigned[i]._id === user.kelas) {
    //             materialRowItem(data)
    //             break;
    //           }
    //         }
    //       })
    //     }
    //     else { //Admin
    //       all_materials.map((data) => {
    //         materialRowItem(data)
    //       })
    //     }
    //   }
  }

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  // Call the function to view the tasks on tablerows.
  // This function is defined above.
  retrieveMaterials()

  const isSelected = (name) => selected.indexOf(name) !== -1;
  const onDeleteMaterial = (id) => {
    deleteMaterial(id)
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
              onClick={handleCloseDeleteDialog}>
              <CloseIcon />
            </IconButton>
          </Grid>
          <Grid item container justify="center" style={{marginBottom: "20px"}}>
            <Typography variant="h5" gutterBottom>
              Hapus Materi berikut?
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
                onClick={() => { onDeleteMaterial(selectedTaskId) }}
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

  document.title = "Schooly | Daftar Materi";

  return(
    <div className={classes.root}>
      {DeleteDialog()}
      <Paper className={classes.paper}>
        <MaterialListToolbar role={user.role} deleteMaterial={deleteMaterial} handleOpenDeleteDialog={handleOpenDeleteDialog} />
        <TableContainer>
          <Table>
            <MaterialListHead
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
                  let viewpage = user.role === "Student" ? `/materi/${row._id}` : `/materi/${row._id}`
                  return(
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
                      <TableCell align="center">{!row.author ? null : row.author.name}</TableCell>
                      <TableCell align="center">{!selectedClasses.size ? null :
                        row.class_assigned.map((kelas,i) => {
                          if(i === row.class_assigned.length - 1)
                            return (`${selectedClasses.get(kelas).name}`)
                          return (`${selectedClasses.get(kelas).name}, `)})}
                      </TableCell>
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

MaterialList.propTypes = {
  deleteMaterial: PropTypes.func.isRequired,
  getAllMaterials: PropTypes.func.isRequired,
  getMaterial: PropTypes.func.isRequired,
  getUsers: PropTypes.func.isRequired,
  viewSelectedClasses: PropTypes.func.isRequired,
  classesCollection: PropTypes.object.isRequired,
  materialsCollection: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
}

const mapStateToProps = (state) => ({
  errors: state.errors,
  auth: state.auth,
  classesCollection: state.classesCollection,
  materialsCollection: state.materialsCollection,
})

export default connect(
  mapStateToProps,
  { deleteMaterial, getAllMaterials, getMaterial, getUsers, viewSelectedClasses }
)(MaterialList);
