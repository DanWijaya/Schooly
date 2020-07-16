import React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import classnames from "classnames";
import "moment/locale/id";
import { createSubject, getAllSubjects, getSubject, deleteSubject } from "../../../actions/SubjectActions";
import { getAllMaterials, getMaterial, deleteMaterial } from "../../../actions/MaterialActions";
import { clearErrors } from "../../../actions/ErrorActions";
import { viewSelectedClasses } from "../../../actions/ClassActions";
import { getUsers } from "../../../actions/UserActions";
import LightTooltip from "../../misc/light-tooltip/LightTooltip";
import { Button, IconButton, Dialog, Divider, ExpansionPanel, ExpansionPanelDetails, ExpansionPanelSummary,
   Fab, Grid, Hidden, Menu, MenuItem, Paper, TableSortLabel, TextField, Typography } from "@material-ui/core/";
import { makeStyles } from "@material-ui/core/styles";
import CancelIcon from "@material-ui/icons/Cancel";
import CloseIcon from "@material-ui/icons/Close";
import DeleteIcon from "@material-ui/icons/Delete";
import DeleteOutlineIcon from "@material-ui/icons/DeleteOutline";
import EditIcon from "@material-ui/icons/Edit";
import MenuBookIcon from "@material-ui/icons/MenuBook";
import SortIcon from "@material-ui/icons/Sort";
import LibraryBooksIcon from '@material-ui/icons/LibraryBooks';

function createData(_id, name, all_class) {
  return { _id, name, all_class };
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

function SubjectListToolbar(props) {
  const { classes, order, orderBy, onRequestSort, role, handleOpenFormDialog } = props;

  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  const headCells = [
    { id: "name", numeric: false, disablePadding: false, label: "Mata Pelajaran" },
    // { id: "all_class", numeric: false, disablePadding: false, label: "Semua Kelas" },
  ];

  // Sort Menu
  const [anchorEl, setAnchorEl] = React.useState(null);
  const handleOpenSortMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleCloseSortMenu = () => {
    setAnchorEl(null);
  };

  return(
    <div className={classes.toolbar}>
      <Typography variant="h4" color="primary">
        <b>Daftar Mata Pelajaran</b>
      </Typography>
      <div style={{display: "flex"}}>
        <Hidden smUp implementation="css">
            <LightTooltip title="Buat Mata Pelajaran">
                <Fab size="small" className={classes.newMaterialButton} onClick={handleOpenFormDialog}>
                    <MenuBookIcon className={classes.newMaterialIconMobile} />
                </Fab>
            </LightTooltip>
        </Hidden>
        <Hidden xsDown implementation="css">
            <Fab size="medium" variant="extended" className={classes.newMaterialButton} onClick={handleOpenFormDialog}>
            <LibraryBooksIcon className={classes.newMaterialIconDesktop} />
            Buat Mata Pelajaran
            </Fab>
        </Hidden>
        <LightTooltip title="Urutkan Materi">
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
    </div>
  );
};

SubjectListToolbar.propTypes = {
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
  newMaterialButton: {
    marginRight: "10px",
    backgroundColor: "#61BD4F",
    color: "white",
    "&:focus, &:hover": {
      backgroundColor: "#61BD4F",
      color: "white",
    },
  },
  newMaterialIconDesktop: {
    width: theme.spacing(3),
    height: theme.spacing(3),
    marginRight: "7.5px",
  },
  newMaterialIconMobile: {
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
  viewMaterialButton: {
    backgroundColor: theme.palette.warning.main,
    color: "white",
    "&:focus, &:hover": {
      backgroundColor: "white",
      color: theme.palette.warning.main,
    },
  },
  editSubjectButton: {
    backgroundColor: theme.palette.primary.main,
    color: "white",
    "&:focus, &:hover": {
      backgroundColor: "white",
      color: theme.palette.primary.main,
    },
  },
  deleteSubjectlButton: {
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
  dialogCreateButton: {
    width: "150px",
    backgroundColor: theme.palette.success.main,
    color: "white",
    "&:focus, &:hover": {
      backgroundColor: theme.palette.success.main,
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
  subjectPanelDivider: {
    backgroundColor: theme.palette.primary.main,
  },
  subjectPanelSummary: {
    "&:hover": {
      backgroundColor: theme.palette.button.main,
    },
  },
  subjectPaper: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "15px",
  },
}));

function SubjectList(props) {
  const classes = useStyles();

  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("subject");
  const [selected, setSelected] = React.useState([]);

  const [openDeleteDialog, setOpenDeleteDialog] = React.useState(null);
  const [openFormDialog, setOpenFormDialog] = React.useState(null);
  const [selectedTaskId, setSelectedTaskId] = React.useState(null)
  const [selectedSubjectName, setSelectedSubjectName] = React.useState(null);

  const [subject, setSubject ] = React.useState({});
  const { subjectsCollection, getAllSubjects, clearErrors, createSubject, getSubject, deleteSubject, errors } = props;
  const { all_subjects } = props.subjectsCollection;
  const { user, retrieved_users } = props.auth;

  console.log(subjectsCollection)
  const subjectRowItem = (data) => {
    rows.push(
      createData(
        data._id,
        data.name,
        data.all_class,
      )
    )
  }

  React.useEffect(() => {

    getAllSubjects()
  }, [ all_subjects.length])

  const retrieveSubjects = () => {
    console.log(retrieved_users)
    // If all_subjects is not undefined or an empty array
    rows = []
    all_subjects.map((data) => { subjectRowItem(data)})
  }

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  // Call the function to view the tasks on tablerows.
  // This function is defined above.
  retrieveSubjects()

  const isSelected = (name) => selected.indexOf(name) !== -1;
  const onDeleteSubject = (id) => {
    deleteSubject(id)
  }

  // Delete Dialog
  const handleOpenDeleteDialog = (e, id, name) => {
    e.stopPropagation();
    setOpenDeleteDialog(true);
    setSelectedTaskId(id)
    setSelectedSubjectName(name)
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
  };

  // Delete Dialog
  const handleOpenFormDialog = (e, id, name, action="create") => {
    e.stopPropagation();
    setOpenFormDialog(true);
    if (action === "edit") {
        setSelectedTaskId(id)
        setSelectedSubjectName(name)
    }
  };

  const handleCloseFormDialog = () => {
    setOpenFormDialog(false);
    clearErrors()
  };

  const onChange = (e) => {
    const { id, value} = e.target;
    setSubject((prev) => ({
        ...prev,
        [id] : value
    }))
  }

  const onSubmit = (e) => {
    e.preventDefault()

    createSubject(subject)
  }

  function FormDialog() {
    return(
      <Dialog
        open={openFormDialog}
        onClose={handleCloseFormDialog}>
        <Grid container direction="column" alignItems="center" className={classes.dialogBox}>
          <Grid item container justify="flex-end" alignItems="flex-start">
            <IconButton
              size="small"
              onClick={handleCloseFormDialog}
            >
              <CloseIcon />
            </IconButton>
          </Grid>
          <form onSubmit={onSubmit} style={{paddingTop: "20px"}}>
          <Grid item container justify="center" spacing={2}>
            <Typography variant="h6" gutterBottom>
              <b>Isi Nama Mata Pelajaran</b>
            </Typography>
            <TextField
            style={{margin: "20px 10px"}}
            fullWidth
            variant="outlined"
            id="name"
            onChange={onChange}
            value={subject.name}
            error={errors.name}
            type="text"
            helperText={errors.name}
            className={classnames("", {
                invalid: errors.name
            })}
            />
            <Grid item>
              <Button
                type="submit"
                startIcon={<LibraryBooksIcon />}
                className={classes.dialogCreateButton}
              >
                Buat
              </Button>
            </Grid>
            <Grid item>
              <Button
                
                onClick={handleCloseFormDialog}
                startIcon={< CancelIcon/>}
                className={classes.dialogCancelButton}
              >
                Batal
              </Button>
            </Grid>
          </Grid>
          </form>
          </Grid>
      </Dialog>)
  }

  function DeleteDialog() {
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
              Hapus Mata Pelajaran berikut?
            </Typography>
          </Grid>
          <Grid item container justify="center" style={{marginBottom: "20px"}}>
            <Typography variant="h6" align="center" gutterBottom>
              <b>{selectedSubjectName}</b>
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
                onClick={() => { onDeleteSubject(selectedTaskId) }}
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

  document.title = "Schooly | Daftar Mata Pelajaran";
  console.log(errors)
  return(
    <div className={classes.root}>
      {FormDialog()}
      {DeleteDialog()}
      <SubjectListToolbar
        handleOpenFormDialog={handleOpenFormDialog}
        role={user.role}
        deleteSubject={deleteSubject}
        classes={classes}
        order={order}
        orderBy={orderBy}
        onRequestSort={handleRequestSort}
        rowCount={rows ? rows.length : 0}
      />
      <Grid container direction="column" spacing={2}>
        {stableSort(rows, getComparator(order, orderBy))
          .map((row, index) => {
            const isItemSelected = isSelected(row._id);
            const labelId = `enhanced-table-checkbox-${index}`;
            return(
                <Grid item>
                <Paper variant="outlined" className={classes.subjectPaper}>
                    <Grid item>
                        <Typography variant="h6" id={labelId} >
                          {row.name}
                        </Typography>
                    </Grid>
                    <Grid item xs container spacing={1} justify="flex-end">
                      <Grid item>
                        <IconButton size="small" className={classes.editSubjectButton} onClick={(e)=> e.stopPropagation()}>
                            <EditIcon fontSize="small" />
                        </IconButton>
                      </Grid>
                      <Grid item>
                        <IconButton size="small" className={classes.deleteSubjectlButton} onClick={(e) =>{handleOpenDeleteDialog(e, row._id, row.name)}}>
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Grid>
                    </Grid>
                </Paper>
            </Grid>
            );
          })}
      </Grid>
    </div>
  );
}

SubjectList.propTypes = {
  subjectsCollection: PropTypes.object.isRequired,
  deleteSubject: PropTypes.func.isRequired,
  getAllSubjects: PropTypes.func.isRequired,
  createSubject: PropTypes.func.isRequired,
  clearErrors: PropTypes.func.isRequired,
  getUsers: PropTypes.func.isRequired,
  viewSelectedClasses: PropTypes.func.isRequired,
  classesCollection: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
}

const mapStateToProps = (state) => ({
  errors: state.errors,
  auth: state.auth,
  classesCollection: state.classesCollection,
  subjectsCollection: state.subjectsCollection,
})

export default connect(
  mapStateToProps,
  { deleteSubject, getAllSubjects, getSubject, createSubject, getUsers, viewSelectedClasses, clearErrors }
)(SubjectList);
