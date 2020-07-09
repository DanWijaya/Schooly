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
import { Button, IconButton, Dialog, Divider, ExpansionPanel, ExpansionPanelDetails, ExpansionPanelSummary, Fab, Grid, Hidden, Menu, MenuItem, Paper, Table, TableBody, TableCell, TableContainer,
   TableHead, TableRow, TableSortLabel, Toolbar, Typography } from "@material-ui/core/";
import { makeStyles } from "@material-ui/core/styles";
import CancelIcon from "@material-ui/icons/Cancel";
import CloseIcon from "@material-ui/icons/Close";
import DeleteIcon from "@material-ui/icons/Delete";
import DeleteOutlineIcon from "@material-ui/icons/DeleteOutline";
import EditIcon from "@material-ui/icons/Edit";
import MenuBookIcon from "@material-ui/icons/MenuBook";
import PageviewIcon from "@material-ui/icons/Pageview";
import SortIcon from "@material-ui/icons/Sort";

function createData(_id, materialtitle, subject, author, class_assigned) {
  return { _id, materialtitle, subject, author, class_assigned };
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

function MaterialListV2Toolbar(props) {
  const { classes, order, orderBy, onRequestSort, role } = props;

  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  const headCells = [
    { id: "materialtitle", numeric: false, disablePadding: true, label: "Nama Materi" },
    { id: "subject", numeric: false, disablePadding: false, label: "Mata Pelajaran" },
    { id: "author", numeric: false, disablePadding: false, label: "Pemberi Materi" },
    { id: "class_assigned", numeric: false, disablePadding: false, label: "Kelas yang diberikan" },
  ];

  if(role === "Student") {
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
      <Typography variant="h4">
        <b>Daftar Materi</b>
      </Typography>
      <div style={{display: "flex"}}>
        <Hidden smUp implementation="css">
          {role === "Student" ?
            null
          :
            <LightTooltip title="Buat Materi">
              <Link to="/buat-materi">
                <Fab size="small" className={classes.newMaterialButton}>
                  <MenuBookIcon className={classes.newMaterialIconMobile} />
                </Fab>
              </Link>
            </LightTooltip>
          }
        </Hidden>
        <Hidden xsDown implementation="css">
          {role === "Student" ?
            null
          :
            <Link to="/buat-materi">
              <Fab size="medium" variant="extended" className={classes.newMaterialButton}>
                <MenuBookIcon className={classes.newMaterialIconDesktop} />
                Buat Materi
              </Fab>
            </Link>
          }
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
    </Toolbar>
  );
};

MaterialListV2Toolbar.propTypes = {
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
  editMaterialButton: {
    backgroundColor: theme.palette.primary.main,
    color: "white",
    "&:focus, &:hover": {
      backgroundColor: "white",
      color: theme.palette.primary.main,
    },
  },
  deleteMaterialButton: {
    backgroundColor: theme.palette.error.dark,
    color: "white",
    "&:focus, &:hover": {
      backgroundColor: "white",
      color: theme.palette.error.dark,
    },
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
  materialPanelDivider: {
    backgroundColor: theme.palette.primary.main,
  },
  materialPanelSummary: {
    "&:hover": {
      backgroundColor: theme.palette.button.main,
    },
  },
  materialPaper: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "15px",
    "&:focus, &:hover": {
      backgroundColor: theme.palette.button.main,
    },
  },
}));

function MaterialListV2(props) {
  const classes = useStyles();

  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("subject");
  const [selected, setSelected] = React.useState([]);

  const [openDeleteDialog, setOpenDeleteDialog] = React.useState(null);
  const [selectedTaskId, setSelectedTaskId] = React.useState(null)
  const [selectedTaskName, setSelectedTaskName] = React.useState(null);

  const { getAllMaterials, getMaterial, deleteMaterial, getUsers, viewSelectedClasses } = props;
  const { all_materials, selectedMaterials } = props.materialsCollection;
  const { selectedClasses, all_classes } = props.classesCollection;
  const { user, retrieved_users } = props.auth;

  const materialRowItem = (data) => {
    rows.push(
      createData(
        data._id,
        data.name,
        data.subject,
        !(retrieved_users).size ? {}: retrieved_users.get(data.author_id),
        data.class_assigned,
      )
    )
  }

  React.useEffect(() => {
    let materialsRetrieved = []

    if(user.role === "Admin"){
      materialsRetrieved = all_materials
      getAllMaterials()
    }
    else {
      materialsRetrieved = selectedMaterials;
      if(user.role === "Teacher"){
        getMaterial(user.id, "by_author")
      }
      else { // for student
        getMaterial(user.kelas, "by_class")
      }
    }

    let userIds = []
    let classIds = new Set()
    for(var i = 0; i < materialsRetrieved.length; i++) {
      let material = materialsRetrieved[i]
      userIds.push(material.author_id)
      for(var j = 0; j < material.class_assigned.length; j++) {
        classIds.add(material.class_assigned[j])
      }
    }

    getUsers(userIds) // to get the authors objects.
    viewSelectedClasses(Array.from(classIds)) // to get the classes objects.
  }, [selectedMaterials.length, all_materials.length])

  const retrieveMaterials = () => {
    console.log(selectedMaterials)
    console.log(retrieved_users)
    // If all_materials is not undefined or an empty array
    rows = []
    if(user.role === "Admin") {
      all_materials.map((data) => { materialRowItem(data)})
    }
    else {
      if(selectedMaterials.length) {
        selectedMaterials.map((data) => materialRowItem(data))
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
      <MaterialListV2Toolbar
        role={user.role}
        deleteMaterial={deleteMaterial}
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
            let viewpage = user.role === "Student" ? `/materi/${row._id}` : `/materi/${row._id}`
            return(
              <Grid item>
                {user.role === "Teacher" ?
                  <ExpansionPanel
                    button
                    variant="outlined"
                    aria-checked={isItemSelected}
                    selected={isItemSelected}
                  >
                    <ExpansionPanelSummary className={classes.materialPanelSummary}>
                      <Grid container spacing={1} justify="space-between" alignItems="center">
                        <Grid item>
                          <Hidden smUp implementation="css">
                            <Typography variant="subtitle1" id={labelId}>
                              {row.materialtitle}
                            </Typography>
                            <Typography variant="caption" color="textSecondary">
                              {row.subject}
                            </Typography>
                          </Hidden>
                          <Hidden xsDown implementation="css">
                            <Typography variant="h6" id={labelId}>
                              {row.materialtitle}
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
                                className={classes.viewMaterialButton}
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
                                  className={classes.editMaterialButton}
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
                                className={classes.deleteMaterialButton}
                                onClick={(e) =>{handleOpenDeleteDialog(e, row._id, row.materialtitle)}}
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </LightTooltip>
                          </Grid>
                        </Grid>
                      </Grid>
                    </ExpansionPanelSummary>
                    <Divider className={classes.materialPanelDivider} />
                    <ExpansionPanelDetails>
                      <Grid conntainer direction="column">
                        <Grid item>
                          <Typography variant="body1" gutterBottom>
                            <b>Kelas yang Diberikan:</b> {!selectedClasses.size ? null :
                              row.class_assigned.map((kelas,i) => {
                                if(i === row.class_assigned.length - 1)
                                  return (`${selectedClasses.get(kelas).name}`)
                                return (`${selectedClasses.get(kelas).name}, `)})
                            }
                          </Typography>
                        </Grid>
                        <Grid item>
                          <Typography variant="body1" color="textSecondary">
                             Pemberi Materi: {!row.author ? null : row.author.name}
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
                    className={classes.materialPaper}
                  >
                    <div>
                      <Typography variant="h6" id={labelId}>
                        {row.materialtitle}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        {row.subject}
                      </Typography>
                    </div>
                    <div>
                      <Hidden smUp implementation="css">
                        <Typography variant="body2" color="textSecondary" align="right">
                          Pemberi Materi:
                        </Typography>
                        <Typography variant="caption" color="textSecondary" align="right">
                          {!row.author ? null : row.author.name}
                        </Typography>
                      </Hidden>
                      <Hidden xsDown implementation="css">
                        <Typography variant="overline" color="textSecondary" align="right">
                          Pemberi Materi: {!row.author ? null : row.author.name}
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

MaterialListV2.propTypes = {
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
)(MaterialListV2);
