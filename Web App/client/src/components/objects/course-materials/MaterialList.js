import React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { getAllMaterials, getMaterial, deleteMaterial } from "../../../actions/MaterialActions";
import { getSelectedClasses, getAllClass } from "../../../actions/ClassActions";
import { getAllSubjects } from "../../../actions/SubjectActions";
import { getTeachers } from "../../../actions/UserActions";
import DeleteDialog from "../../misc/dialog/DeleteDialog";
import LightTooltip from "../../misc/light-tooltip/LightTooltip";
import { Divider, ExpansionPanel, ExpansionPanelDetails, ExpansionPanelSummary,
   Fab, Grid, InputAdornment, IconButton, Hidden, Menu, MenuItem, Paper, TableSortLabel, TextField, Typography } from "@material-ui/core/";
import { makeStyles } from "@material-ui/core/styles";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import MenuBookIcon from "@material-ui/icons/MenuBook";
import PageviewIcon from "@material-ui/icons/Pageview";
import SortIcon from "@material-ui/icons/Sort";
import { GoSearch } from "react-icons/go";
import ClearIcon from '@material-ui/icons/Clear';

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

function MaterialListToolbar(props) {
  const { classes, order, orderBy, onRequestSort, role, searchFilter, updateSearchFilter } = props;

  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  const headCells = [
    { id: "materialtitle", numeric: false, disablePadding: true, label: "Nama Materi" },
    { id: "subject", numeric: false, disablePadding: false, label: "Mata Pelajaran" },
    { id: "author", numeric: false, disablePadding: false, label: "Pemberi Materi" },
    { id: "class_assigned", numeric: false, disablePadding: false, label: "Kelas yang diberikan" },
  ];

  if (role === "Student") {
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

  const onChange = (e) => {
    switch(e.target.id){
      case "searchFilter":
        updateSearchFilter(e.target.value)
        break;

      default:
        break;
    }
  }

  const onClear = (e) => {
    updateSearchFilter("");
  }

  return (
    <div className={classes.toolbar}>
      <div style={{display: "flex", flexDirection: "row", alignItems: "center"}}>
        <MenuBookIcon className={classes.titleIcon} fontSize="large"/>
        <Typography variant="h4">
          Daftar Materi
        </Typography>
      </div>
      <div style={{display: "flex"}}>
      <Hidden xsDown implementation="css">
        <TextField
          variant="outlined"
          id="searchFilter"
          value={searchFilter}
          onChange={onChange}
          placeholder="Search Materi"
          style={{
            maxWidth: "250px",
            marginRight: "10px"
          }}
          InputProps={{
            startAdornment:(
              <InputAdornment position="start" style={{marginLeft: "-5px", marginRight: "-5px"}}>
                <IconButton size="small">
                  <GoSearch/>
                </IconButton>
              </InputAdornment>
            ),
            endAdornment:(
              <InputAdornment position="end" style={{marginLeft: "-10px", marginRight: "-10px"}}>
                <IconButton
                  size="small"
                  onClick={onClear}
                  style={{
                    opacity: 0.5,
                    visibility: !searchFilter ? "hidden" : "visible"
                  }}>
                  <ClearIcon/>
                </IconButton>
              </InputAdornment>
            ),
            style:{
              borderRadius: "20px"
            }
          }}
        />
        </Hidden>
      <div style={{display: "flex", alignItems: "center"}}>
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
  </div>
  );
};

MaterialListToolbar.propTypes = {
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
  newMaterialButton: {
    marginRight: "10px",
    backgroundColor: theme.palette.create.main,
    color: "white",
    "&:focus, &:hover": {
      backgroundColor: theme.palette.create.main,
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
  titleIcon: {
    backgroundColor: "white",
    color: theme.palette.primary.main,
    boxShadow: theme.shadows[0],
    "&:focus, &:hover": {
      backgroundColor: "white",
      color: theme.palette.primary.main,
      cursor: "default"
    },
    marginRight: "10px"
  }
}));

function MaterialList(props) {
  const classes = useStyles();

  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("subject");

  const [openDeleteDialog, setOpenDeleteDialog] = React.useState(null);
  const [selectedTaskId, setSelectedTaskId] = React.useState(null)
  const [selectedMaterialName, setSelectedMaterialName] = React.useState(null);
  const [searchFilter, updateSearchFilter] = React.useState("");

  const { getAllSubjects, getMaterial, deleteMaterial, getAllClass, getTeachers } = props;
  const { all_materials, selectedMaterials } = props.materialsCollection;
  const { all_classes_map } = props.classesCollection;
  const { user, all_teachers } = props.auth;

  const { all_subjects_map} = props.subjectsCollection;

  const materialRowItem = (data) => {
    rows.push(
      createData(
        data._id,
        data.name,
        data.subject,
        !(all_teachers).size || !all_teachers.get(data.author_id) ? {}: all_teachers.get(data.author_id),
        data.class_assigned,
      )
    )
  }

  React.useEffect(() => {
    getAllSubjects("map")
    getAllClass("map")
    getTeachers("map")
    if (user.role === "Teacher") {
      getMaterial(user.id, "by_author")
    }
    else { // for student
      getMaterial(user.kelas, "by_class")
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  console.log(all_teachers)
  const retrieveMaterials = () => {
    // If all_materials is not undefined or an empty array
    rows = []

    if (user.role === "Admin") {
      all_materials.filter(item => item.name.toLowerCase()
                  .includes(searchFilter.toLowerCase()))
                  .map(data =>  materialRowItem(data))
      // all_materials.map(data =>  materialRowItem(data))
    }
    else {
      if (selectedMaterials.length) {
        selectedMaterials.filter(item => item.name.toLowerCase()
                        .includes(searchFilter.toLowerCase()))
                        .map(data =>  materialRowItem(data))
        // selectedMaterials.map(data => materialRowItem(data))
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

  const onDeleteMaterial = (id) => {
    deleteMaterial(id)
  }

  // Delete Dialog
  const handleOpenDeleteDialog = (e, id, name) => {
    e.stopPropagation();
    setOpenDeleteDialog(true);
    setSelectedTaskId(id)
    setSelectedMaterialName(name)
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
  };

  document.title = "Schooly | Daftar Materi";

  return (
    <div className={classes.root}>
      <DeleteDialog
        openDeleteDialog={openDeleteDialog}
        handleCloseDeleteDialog={handleCloseDeleteDialog}
        itemType="Materi"
        itemName={selectedMaterialName}
        deleteItem={() => { onDeleteMaterial(selectedTaskId) }}
      />
      <MaterialListToolbar
        role={user.role}
        deleteMaterial={deleteMaterial}
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
            let viewpage = `/materi/${row._id}`
            return (
              <Grid item>
                {user.role === "Teacher" ?
                  <ExpansionPanel
                    button
                    variant="outlined"
                  >
                    <ExpansionPanelSummary className={classes.materialPanelSummary}>
                      <Grid container spacing={1} justify="space-between" alignItems="center">
                        <Grid item>
                          <Hidden smUp implementation="css">
                            <Typography variant="subtitle1" id={labelId}>
                              {row.materialtitle}
                            </Typography>
                            <Typography variant="caption" color="textSecondary">
                              {all_subjects_map.get(row.subject)}
                            </Typography>
                          </Hidden>
                          <Hidden xsDown implementation="css">
                            <Typography variant="h6" id={labelId}>
                              {row.materialtitle}
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
                                  className={classes.viewMaterialButton}
                                  >
                                  <PageviewIcon fontSize="small" />
                                </IconButton>
                              </Link>
                            </LightTooltip>
                          </Grid>
                          <Grid item>
                            <LightTooltip title="Sunting">
                              <Link to={`/sunting-materi/${row._id}`}>
                                <IconButton
                                  size="small"
                                  className={classes.editMaterialButton}
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
                      <Grid container>
                        <Grid item xs={12}>
                          <Typography variant="body1" gutterBottom>
                            <b>Kelas yang Diberikan:</b> {!all_classes_map.size ? null :
                              row.class_assigned.map((kelas,i) => {
                                if (all_classes_map.get(kelas)) {
                                  if (i === row.class_assigned.length - 1)
                                    return (`${all_classes_map.get(kelas).name}`)
                                  return (`${all_classes_map.get(kelas).name}, `)
                                  }
                                  return null
                                })
                              }
                          </Typography>
                        </Grid>
                        <Grid item xs={12}>
                          <Typography variant="body1" color="textSecondary">
                             Pemberi Materi: {!row.author ? null : row.author.name}
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
                    className={classes.materialPaper}
                  >
                    <div>
                      <Typography variant="h6" id={labelId}>
                        {row.materialtitle}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        {all_subjects_map.get(row.subject)}
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
                  </Link>
                }
              </Grid>
            );
          })}
      </Grid>
    </div>
  );
}

MaterialList.propTypes = {
  deleteMaterial: PropTypes.func.isRequired,
  getAllMaterials: PropTypes.func.isRequired,
  getMaterial: PropTypes.func.isRequired,
  getTeachers: PropTypes.func.isRequired,
  getAllSubjects: PropTypes.func.isRequired,
  getSelectedClasses: PropTypes.func.isRequired,
  getAllClass: PropTypes.func.isRequired,

  classesCollection: PropTypes.object.isRequired,
  materialsCollection: PropTypes.object.isRequired,
  subjectsCollection: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
}

const mapStateToProps = (state) => ({
  errors: state.errors,
  auth: state.auth,
  classesCollection: state.classesCollection,
  materialsCollection: state.materialsCollection,
  subjectsCollection: state.subjectsCollection,
})

// parameter 1 : reducer , parameter 2 : actions
export default connect(
  mapStateToProps,
  { deleteMaterial, getAllMaterials, getAllSubjects, getMaterial, getTeachers, getAllClass, getSelectedClasses }
)(MaterialList);
