import React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { getAllUnits, deleteUnit } from "../../../actions/UnitActions";
import Empty from "../../misc/empty/Empty";
import DeleteDialog from "../../misc/dialog/DeleteDialog";
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
  Tooltip,
  Typography,
} from "@material-ui/core/";
import Alert from "@material-ui/lab/Alert";
import {
  Add as AddIcon,
  ArrowBack as ArrowBackIcon,
  Clear as ClearIcon,
  Search as SearchIcon,
  Sort as SortIcon,
  Web as WebIcon,
} from "@material-ui/icons";
import { makeStyles } from "@material-ui/core/styles";
import UnitItem from "../item/UnitItem";

function createData(_id, name, description, author, class_assigned, createdAt) {
  return { _id, name, description, author, class_assigned, createdAt };
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

function UnitListToolbar(props) {
  const {
    classes,
    order,
    orderBy,
    onRequestSort,
    role,
    searchFilter,
    setSearchFilter,
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
      id: "description",
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
    setSearchFilter(e.target.value);
  };

  const onClear = (e, id) => {
    setSearchFilter("");
  };

  return (
    <div className={classes.toolbar}>
      <Grid container justify="space-between" alignItems="center">
        <Grid item>
          <Hidden smDown>
            <Link to="/buat-unit">
              <Fab
                size="large"
                variant="extended"
                className={classes.createUnitButton}
              >
                <AddIcon className={classes.addIconDesktop} />
                Buat Unit
              </Fab>
            </Link>
          </Hidden>
          <Hidden mdUp>
            <Tooltip title="Buat Unit">
              <Link to="/buat-unit">
                <Fab size="medium" className={classes.createUnitButton}>
                  <AddIcon className={classes.addIconMobile} />
                </Fab>
              </Link>
            </Tooltip>
          </Hidden>
        </Grid>
        <Grid item xs>
          <Grid container justify="flex-end" alignItems="center" spacing={1}>
            <Grid item>
              <Hidden smDown>
                <TextField
                  variant="outlined"
                  id="searchFilterDesktop"
                  placeholder="Cari Unit"
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
                        setSearchFilter("");
                      }}
                    >
                      <ArrowBackIcon />
                    </IconButton>
                    <TextField
                      autoFocus
                      variant="outlined"
                      id="searchFilterMobile"
                      placeholder="Cari Unit"
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
                            style={{
                              marginLeft: "-10px",
                              marginRight: "-10px",
                            }}
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
                  <Tooltip title="Cari Unit">
                    <IconButton onClick={() => setSearchBarFocus(true)}>
                      <SearchIcon />
                    </IconButton>
                  </Tooltip>
                )}
              </Hidden>
            </Grid>
            <Grid item>
              <Tooltip title="Urutkan Unit">
                <IconButton onClick={handleOpenSortMenu}>
                  <SortIcon />
                </IconButton>
              </Tooltip>
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
  createUnitButton: {
    boxShadow:
      "0px 1px 2px 0px rgba(194,100,1,0.3), 0px 2px 6px 2px rgba(194,100,1,0.15)",
    backgroundColor: theme.palette.success.main,
    color: "white",
    "&:focus, &:hover": {
      backgroundColor: theme.palette.success.main,
      color: "white",
    },
    [theme.breakpoints.up("md")]: {
      paddingRight: "24px",
    },
  },
  addIconDesktop: {
    width: "25px",
    height: "25px",
    marginRight: "8px",
  },
  addIconMobile: {
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
  unitBackground: {
    width: "100%",
    height: "250px",
    borderRadius: "3px 3px 0px 0px",
    backgroundColor: theme.palette.primary.main,
  },
  unitIcon: {
    width: "75px",
    height: "75px",
  },
  unitButtons: {
    "&:focus, &:hover": {
      backgroundColor: "#F1F1F1",
    },
  },
}));

function UnitList(props) {
  const classes = useStyles();
  const { getAllUnits, deleteUnit } = props;
  const { user, all_teachers_map } = props.auth;
  const { all_units, selectedUnits } = props.unitsCollection;

  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("name");
  const [openDeleteDialog, setOpenDeleteDialog] = React.useState(null);
  const [selectedUnitId, setSelectedUnitId] = React.useState(null);
  const [selectedMaterialName, setSelectedMaterialName] = React.useState(null);
  const [searchFilter, setSearchFilter] = React.useState("");
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
        data.description,
        !all_teachers_map.size || !all_teachers_map.get(data.author_id)
          ? {}
          : all_teachers_map.get(data.author_id),
        data.class_assigned,
        data.createdAt
      )
    );
  };

  React.useEffect(() => {
    getAllUnits();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    // To show delete snackbar when the item is deleted from its view pgae.
    if (props.location.openDeleteSnackbar) {
      handleOpenDeleteSnackbar();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const retrieveUnits = () => {
    // If all_units is not undefined or an empty array.
    rows = [];
    if (user.role === "SuperAdmin") {
      all_units
        .filter((item) =>
          item.name.toLowerCase().includes(searchFilter.toLowerCase())
        )
        .map((data) => materialRowItem(data));
      // all_units.map(data =>  materialRowItem(data))
    } else {
      if (selectedUnits.length) {
        selectedUnits
          .filter((item) =>
            item.name.toLowerCase().includes(searchFilter.toLowerCase())
          )
          .map((data) => materialRowItem(data));
        // selectedUnits.map(data => materialRowItem(data))
      }
    }
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  // Call the function to view the Units on tablerows.
  // This function is defined above.
  retrieveUnits();

  const onDeleteUnit = (id) => {
    deleteUnit(id).then((res) => {
      getAllUnits();
      handleOpenDeleteSnackbar();
      handleCloseDeleteDialog();
    });
  };

  // Delete Dialog
  const handleOpenDeleteDialog = (e, id, name) => {
    e.stopPropagation();
    setOpenDeleteDialog(true);
    setSelectedUnitId(id);
    setSelectedMaterialName(name);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
  };

  document.title = "Schooly | Unit";

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
            <WebIcon />
          </Avatar>
        </Grid>
        <Grid item>
          <Typography variant="h5" align="left">
            Unit
          </Typography>
        </Grid>
      </Grid>
      <Divider />
      <UnitListToolbar
        role={user.role}
        deleteUnit={deleteUnit}
        classes={classes}
        order={order}
        orderBy={orderBy}
        onRequestSort={handleRequestSort}
        rowCount={rows ? rows.length : 0}
        setSearchBarFocus={setSearchBarFocus}
        searchBarFocus={searchBarFocus}
        searchFilter={searchFilter}
        setSearchFilter={setSearchFilter}
      />
      {rows.length === 0 ? (
        <Empty />
      ) : (
        <Grid container spacing={2}>
          <UnitItem
            data={stableSort(rows, getComparator(order, orderBy))}
            handleOpenDeleteDialog={handleOpenDeleteDialog}
          />
        </Grid>
      )}
      <DeleteDialog
        openDeleteDialog={openDeleteDialog}
        handleCloseDeleteDialog={handleCloseDeleteDialog}
        itemType="Unit"
        itemName={selectedMaterialName}
        warningText="Pastikan Unit sudah kosong sebelum dihapus."
        deleteItem={() => onDeleteUnit(selectedUnitId)}
      />
      {/* Delete Snackbar */}
      <Snackbar
        open={openDeleteSnackbar}
        autoHideDuration={4000}
        onClose={(event, reason) => handleCloseDeleteSnackbar(event, reason)}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      >
        <Alert
          elevation={6}
          variant="filled"
          severity="success"
          onClose={(event, reason) => handleCloseDeleteSnackbar(event, reason)}
        >
          Unit berhasil dihapus
        </Alert>
      </Snackbar>
    </div>
  );
}

UnitList.propTypes = {
  auth: PropTypes.object.isRequired,
  unitsCollection: PropTypes.object.isRequired,
  getAllUnits: PropTypes.func.isRequired,
  deleteUnit: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  unitsCollection: state.unitsCollection,
  classesCollection: state.classesCollection,
  subjectsCollection: state.subjectsCollection,
});

export default connect(mapStateToProps, {
  getAllUnits,
  deleteUnit,
})(UnitList);
