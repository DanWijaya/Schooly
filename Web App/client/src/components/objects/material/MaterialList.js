import React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import {
  getAllMaterials,
  getMaterialByClass,
  getMaterialByAuthor,
  deleteMaterial,
} from "../../../actions/MaterialActions";
import { getSelectedClasses, getAllClass } from "../../../actions/ClassActions";
import { getAllSubjects } from "../../../actions/SubjectActions";
import { getTeachers } from "../../../actions/UserActions";
import MaterialItem from "../item/MaterialItem";
import Empty from "../../misc/empty/Empty";
import DeleteDialog from "../../misc/dialog/DeleteDialog";
import LightTooltip from "../../misc/light-tooltip/LightTooltip";
import {
  Avatar,
  Divider,
  Fab,
  Grid,
  Hidden,
  IconButton,
  InputAdornment,
  Menu,
  MenuItem,
  Snackbar,
  TableSortLabel,
  TextField,
  Typography,
} from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";
import {
  ArrowBack as ArrowBackIcon,
  Clear as ClearIcon,
  MenuBook as MenuBookIcon,
  Search as SearchIcon,
  Sort as SortIcon,
} from "@material-ui/icons";
import { makeStyles } from "@material-ui/core/styles";

function createData(_id, name, subject, author, class_assigned, createdAt) {
  return { _id, name, subject, author, class_assigned, createdAt };
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
  const {
    classes,
    order,
    orderBy,
    onRequestSort,
    role,
    searchFilter,
    updateSearchFilter,
    searchBarFocus,
    setSearchBarFocus,
  } = props;

  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  const headCells = [
    {
      id: "name",
      numeric: false,
      disablePadding: true,
      label: "Nama Materi",
    },
    {
      id: "subject",
      numeric: false,
      disablePadding: false,
      label: "Mata Pelajaran",
    },
    {
      id: "author",
      numeric: false,
      disablePadding: false,
      label: "Pemberi Materi",
    },
    {
      id: "createdAt",
      numeric: false,
      disablePadding: false,
      label: "Waktu Dibuat",
    },
    {
      id: "class_assigned",
      numeric: false,
      disablePadding: false,
      label: "Kelas yang diberikan",
    },
  ];

  if (role === "Student") {
    headCells.pop();
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
    updateSearchFilter(e.target.value);
  };

  const onClear = (e, id) => {
    updateSearchFilter("");
    // document.getElementById(id).focus();
  };

  return (
    <div className={classes.toolbar}>
      <Grid container justify="space-between" alignItems="center">
        {role === "Teacher" ? (
          <Grid item>
            <Hidden smDown>
              <Link to="/buat-materi">
                <Fab
                  size="large"
                  variant="extended"
                  className={classes.createMaterialButton}
                >
                  <MenuBookIcon className={classes.createMaterialIconDesktop} />
                  Buat Materi
                </Fab>
              </Link>
            </Hidden>
            <Hidden mdUp>
              <LightTooltip title="Buat Materi">
                <Link to="/buat-materi">
                  <Fab size="medium" className={classes.createMaterialButton}>
                    <MenuBookIcon
                      className={classes.createMaterialIconMobile}
                    />
                  </Fab>
                </Link>
              </LightTooltip>
            </Hidden>
          </Grid>
        ) : null}
        <Grid item xs>
          <Grid container justify="flex-end" alignItems="center" spacing={1}>
            <Grid item>
              <Hidden smDown>
                <TextField
                  variant="outlined"
                  id="searchFilterDesktop"
                  placeholder="Cari Materi"
                  value={searchFilter}
                  onChange={onChange}
                  onClick={() => setSearchBarFocus(true)}
                  onBlur={() => setSearchBarFocus(false)}
                  InputProps={{
                    style: {
                      borderRadius: "22.5px",
                      maxWidth: "450px",
                      width: "100%",
                    },
                    startAdornment: (
                      <InputAdornment
                        position="start"
                        style={{ marginRight: "-5px", color: "grey" }}
                      >
                        <SearchIcon />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment
                        position="end"
                        style={{ marginLeft: "-10px" }}
                      >
                        <IconButton
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            onClear(e);
                          }}
                          style={{
                            visibility: !searchFilter ? "hidden" : "visible",
                          }}
                        >
                          <ClearIcon />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Hidden>
              <Hidden mdUp>
                {searchBarFocus ? (
                  <div style={{ display: "flex" }}>
                    <IconButton
                      onClick={() => {
                        setSearchBarFocus(false);
                        updateSearchFilter("");
                      }}
                    >
                      <ArrowBackIcon />
                    </IconButton>
                    <TextField
                      autoFocus
                      variant="outlined"
                      id="searchFilterMobile"
                      placeholder="Cari Materi"
                      value={searchFilter}
                      onChange={onChange}
                      onClick={(e) => setSearchBarFocus(true)}
                      InputProps={{
                        style: {
                          borderRadius: "22.5px",
                          maxWidth: "450px",
                          width: "100%",
                        },
                        endAdornment: (
                          <InputAdornment
                            position="end"
                            style={{ marginLeft: "-10px" }}
                          >
                            <IconButton
                              size="small"
                              id="searchFilterMobile"
                              onClick={(e) => {
                                e.stopPropagation();
                                onClear(e);
                              }}
                              style={{
                                visibility: !searchFilter
                                  ? "hidden"
                                  : "visible",
                              }}
                            >
                              <ClearIcon />
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </div>
                ) : (
                  <LightTooltip title="Cari Materi">
                    <IconButton onClick={() => setSearchBarFocus(true)}>
                      <SearchIcon />
                    </IconButton>
                  </LightTooltip>
                )}
              </Hidden>
            </Grid>
            <Grid item>
              <LightTooltip title="Urutkan Materi">
                <IconButton onClick={handleOpenSortMenu}>
                  <SortIcon />
                </IconButton>
              </LightTooltip>
              <Menu
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleCloseSortMenu}
                anchorEl={anchorEl}
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
                    onClick={createSortHandler(headCell.id)}
                  >
                    <TableSortLabel
                      active={orderBy === headCell.id}
                      direction={orderBy === headCell.id ? order : "asc"}
                    >
                      {headCell.label}
                      {orderBy === headCell.id ? (
                        <span className={classes.visuallyHidden}>
                          {order === "desc"
                            ? "sorted descending"
                            : "sorted ascending"}
                        </span>
                      ) : null}
                    </TableSortLabel>
                  </MenuItem>
                ))}
              </Menu>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
}

const useStyles = makeStyles((theme) => ({
  root: {
    margin: "auto",
    padding: "20px",
    paddingTop: "25px",
    maxWidth: "80%",
    [theme.breakpoints.down("md")]: {
      maxWidth: "100%",
    },
  },
  header: {
    marginBottom: "25px",
  },
  headerIcon: {
    backgroundColor: theme.palette.primary.main,
    color: "white",
    fontSize: "20px",
  },
  toolbar: {
    padding: "16px 0px",
    marginBottom: "15px",
  },
  createMaterialButton: {
    boxShadow:
      "0px 1px 2px 0px rgba(194,100,1,0.3), 0px 2px 6px 2px rgba(194,100,1,0.15)",
    backgroundColor: theme.palette.success.main,
    color: "white",
    "&:focus, &:hover": {
      backgroundColor: theme.palette.success.main,
      color: "white",
    },
  },
  createMaterialIconDesktop: {
    width: "25px",
    height: "25px",
    marginRight: "8px",
  },
  createMaterialIconMobile: {
    width: "25px",
    height: "25px",
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

function MaterialList(props) {
  const classes = useStyles();
  const {
    getAllSubjects,
    getMaterialByClass,
    getMaterialByAuthor,
    deleteMaterial,
    getAllClass,
    getTeachers,
  } = props;
  const { user, all_teachers_map } = props.auth;
  // const { all_classes_map } = props.classesCollection;
  // const { all_subjects_map } = props.subjectsCollection;
  const { all_materials, selectedMaterials } = props.materialsCollection;

  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("subject");
  const [openDeleteDialog, setOpenDeleteDialog] = React.useState(null);
  const [selectedMaterialId, setSelectedMaterialId] = React.useState(null);
  const [selectedMaterialName, setSelectedMaterialName] = React.useState(null);
  const [searchFilter, updateSearchFilter] = React.useState("");
  const [searchBarFocus, setSearchBarFocus] = React.useState(false);
  const [openDeleteSnackbar, setOpenDeleteSnackbar] = React.useState(false);

  const handleOpenDeleteSnackbar = () => {
    setOpenDeleteSnackbar(true);
  };
  const handleCloseDeleteSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenDeleteSnackbar(false);
  };

  const materialRowItem = (data) => {
    rows.push(
      createData(
        data._id,
        data.name,
        data.subject,
        !all_teachers_map.size || !all_teachers_map.get(data.author_id)
          ? {}
          : all_teachers_map.get(data.author_id),
        data.class_assigned,
        data.createdAt
      )
    );
  };

  React.useEffect(() => {
    //
    getAllSubjects(user.unit, "map");
    getAllClass(user.unit, "map");
    getTeachers(user.unit, "map");
    if (user.role === "Teacher") {
      getMaterialByAuthor(user._id);
    } else {
      // For student.
      getMaterialByClass(user.kelas);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    // To show delete snackbar when a material is deleted.
    if (props.location.openDeleteSnackbar) {
      handleOpenDeleteSnackbar();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  console.log(all_teachers_map);
  const retrieveMaterials = () => {
    // If all_materials is not undefined or an empty array.
    rows = [];

    if (user.role === "Admin") {
      all_materials
        .filter((item) =>
          item.name.toLowerCase().includes(searchFilter.toLowerCase())
        )
        .map((data) => materialRowItem(data));
      // all_materials.map(data =>  materialRowItem(data))
    } else {
      if (selectedMaterials.length) {
        selectedMaterials
          .filter((item) =>
            item.name.toLowerCase().includes(searchFilter.toLowerCase())
          )
          .map((data) => materialRowItem(data));
        // selectedMaterials.map(data => materialRowItem(data))
      }
    }
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  // Call the function to view the Materials on tablerows.
  // This function is defined above.
  retrieveMaterials();

  const onDeleteMaterial = (id) => {
    console.log("DELETE", id);
    deleteMaterial(id).then((res) => {
      handleOpenDeleteSnackbar();
      handleCloseDeleteDialog();
      if (user.role === "Teacher") {
        getMaterialByAuthor(user._id);
      } else {
        // for student
        getMaterialByClass(user.kelas);
      }
    });
  };

  // Delete Dialog
  const handleOpenDeleteDialog = (e, row) => {
    e.stopPropagation();
    setOpenDeleteDialog(true);
    setSelectedMaterialId(row._id);
    setSelectedMaterialName(row.name);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
  };

  document.title = "Schooly | Daftar Materi";

  return (
    <div className={classes.root}>
      <Grid
        container
        alignItems="center"
        spacing={2}
        className={classes.header}
      >
        <Grid item>
          <Avatar variant="rounded" className={classes.headerIcon}>
            <MenuBookIcon />
          </Avatar>
        </Grid>
        <Grid item>
          <Typography variant="h5" align="left">
            Materi
          </Typography>
        </Grid>
      </Grid>
      <Divider />
      <MaterialListToolbar
        role={user.role}
        deleteMaterial={deleteMaterial}
        classes={classes}
        order={order}
        orderBy={orderBy}
        onRequestSort={handleRequestSort}
        rowCount={rows ? rows.length : 0}
        setSearchBarFocus={setSearchBarFocus}
        searchBarFocus={searchBarFocus}
        searchFilter={searchFilter}
        updateSearchFilter={updateSearchFilter}
      />
      {rows.length === 0 ? (
        <Empty />
      ) : (
        <MaterialItem
          data={stableSort(rows, getComparator(order, orderBy))}
          handleOpenDeleteDialog={handleOpenDeleteDialog}
        />
      )}
      <DeleteDialog
        openDeleteDialog={openDeleteDialog}
        handleCloseDeleteDialog={handleCloseDeleteDialog}
        itemType="Materi"
        itemName={selectedMaterialName}
        deleteItem={() => {
          console.log("idnya:", selectedMaterialId);
          onDeleteMaterial(selectedMaterialId);
        }}
      />
      <Snackbar
        open={openDeleteSnackbar}
        autoHideDuration={4000}
        onClose={(event, reason) => {
          handleCloseDeleteSnackbar(event, reason);
        }}
      >
        <Alert
          variant="filled"
          severity="success"
          onClose={(event, reason) => {
            handleCloseDeleteSnackbar(event, reason);
          }}
        >
          Materi berhasil dihapus
        </Alert>
      </Snackbar>
    </div>
  );
}

MaterialList.propTypes = {
  auth: PropTypes.object.isRequired,
  classesCollection: PropTypes.object.isRequired,
  getAllClass: PropTypes.func.isRequired,
  getSelectedClasses: PropTypes.func.isRequired,
  subjectsCollection: PropTypes.object.isRequired,
  getAllSubjects: PropTypes.func.isRequired,
  getTeachers: PropTypes.func.isRequired,
  materialsCollection: PropTypes.object.isRequired,
  getMaterial: PropTypes.func.isRequired,
  getAllMaterials: PropTypes.func.isRequired,
  deleteMaterial: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  classesCollection: state.classesCollection,
  subjectsCollection: state.subjectsCollection,
  materialsCollection: state.materialsCollection,
  errors: state.errors,
});

export default connect(mapStateToProps, {
  getAllClass,
  getSelectedClasses,
  getAllSubjects,
  getTeachers,
  getMaterialByClass,
  getMaterialByAuthor,
  getAllMaterials,
  deleteMaterial,
})(MaterialList);
