import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import classnames from "classnames";
import "moment/locale/id";
import {
  createSubject,
  getAllSubjects,
  getSubject,
  editSubject,
  deleteSubject,
} from "../../../actions/SubjectActions";
import { clearErrors } from "../../../actions/ErrorActions";
import { clearSuccess } from "../../../actions/SuccessActions";
import DeleteDialog from "../../misc/dialog/DeleteDialog";
import UploadDialog from "../../misc/dialog/UploadDialog";
import Empty from "../../misc/empty/Empty";
import LightTooltip from "../../misc/light-tooltip/LightTooltip";
import {
  Avatar,
  Button,
  Dialog,
  Divider,
  Fab,
  Grid,
  Hidden,
  IconButton,
  InputAdornment,
  Menu,
  MenuItem,
  Paper,
  Snackbar,
  TableSortLabel,
  TextField,
  Typography,
} from "@material-ui/core";
import MuiAlert from "@material-ui/lab/Alert";
import {
  ArrowBack as ArrowBackIcon,
  Cancel as CancelIcon,
  Clear as ClearIcon,
  Close as CloseIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  MoreVert as MoreVertIcon,
  LibraryAdd as LibraryAddIcon,
  LibraryBooks as LibraryBooksIcon,
  Search as SearchIcon,
  SortByAlpha as SortByAlphaIcon
} from "@material-ui/icons";
import { makeStyles } from "@material-ui/core/styles";

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
  const {
    classes,
    order,
    orderBy,
    onRequestSort,
    handleOpenFormDialog,
    searchFilter,
    updateSearchFilter,
    setSearchBarFocus,
    searchBarFocus,
  } = props;

  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  const headCells = [
    {
      id: "name",
      numeric: false,
      disablePadding: false,
      label: "Mata Pelajaran",
    },
  ];

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
    document.getElementById(id).focus();
  };

  return (
    <div className={classes.toolbar}>
      <Grid container justify="space-between" alignItems="center">
        <Grid item>
          <Hidden mdUp>
            <LightTooltip title="Buat Mata Pelajaran">
              <Fab
                size="medium"
                onClick={handleOpenFormDialog}
                className={classes.createSubjectButton}
              >
                <LibraryAddIcon className={classes.createSubjectIconMobile} />
              </Fab>
            </LightTooltip>
          </Hidden>
          <Hidden smDown>
            <Fab
              size="large"
              variant="extended"
              onClick={handleOpenFormDialog}
              className={classes.createSubjectButton}
            >
              <LibraryAddIcon className={classes.createSubjectIconDesktop} />
              Buat Mata Pelajaran
            </Fab>
          </Hidden>
        </Grid>
        <Grid item>
          <Grid container alignItems="center" spacing={1}>
            <Grid item>
              <TextField
                variant="outlined"
                id="searchFilterDesktop"
                value={searchFilter}
                onChange={onChange}
                onClick={() => setSearchBarFocus(true)}
                onBlur={() => setSearchBarFocus(false)}
                placeholder="Cari Mata Pelajaran"
                InputProps={{
                  style: {
                    borderRadius: "22.5px",
                    maxWidth: "450px",
                    width: "100%"
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
                          onClear(e, "searchFilterDesktop");
                        }}
                        style={{
                          opacity: 0.5,
                          visibility: !searchFilter ? "hidden" : "visible",
                        }}
                      >
                        <ClearIcon />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item>
              <LightTooltip title="Urutkan Mata Pelajaran">
                <IconButton onClick={handleOpenSortMenu}>
                  <SortByAlphaIcon />
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

SubjectListToolbar.propTypes = {
  classes: PropTypes.object.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(["asc", "desc"]).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
  searchFilter: PropTypes.string,
  updateSearchFilter: PropTypes.func,
  setSearchBarFocus: PropTypes.func,
  searchBarFocus: PropTypes.bool,
};

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
    display: "flex",
    backgroundColor: theme.palette.primary.main,
    color: "white",
    fontSize: "25px",
    padding: "7.5px",
    borderRadius: "5px",
  },
  toolbar: {
    padding: "16px 0px",
    marginBottom: "15px",
  },
  createSubjectButton: {
    boxShadow: "0px 1px 2px 0px rgba(194,100,1,0.3), 0px 2px 6px 2px rgba(194,100,1,0.15)",
    backgroundColor: theme.palette.success.main,
    color: "white",
    "&:focus, &:hover": {
      backgroundColor: theme.palette.success.main,
      color: "white",
    },
  },
  createSubjectIconDesktop: {
    width: "25px",
    height: "25px",
    marginRight: "8px",
  },
  createSubjectIconMobile: {
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
  subjectItem: {
    borderRadius: "4px",
    boxShadow: "0px 2px 3px 0px rgba(60,64,67,0.12), 0px 2px 8px 2px rgba(60,64,67,0.10)",
    "&:focus, &:hover": {
      boxShadow: "0px 2px 3px 0px rgba(60,64,67,0.30), 0px 2px 8px 2px rgba(60,64,67,0.15)",
    }
  },
  subjectIcon: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "100px",
    borderRadius: "3px 0px 0px 3px",
    backgroundColor: theme.palette.primary.main,
    color: "white",
    [theme.breakpoints.down("md")]: {
      width: "60px",
    },
  },
  subjectItemContent: {
    padding: "10px 10px 10px 20px",
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
    width: "300px",
    maxWidth: "100%",
    minHeight: "175px",
    padding: "15px",
  },
  dialogCreateButton: {
    width: "125px",
    backgroundColor: theme.palette.success.main,
    color: "white",
    border: `1px solid ${theme.palette.success.main}`,
    "&:focus, &:hover": {
      backgroundColor: theme.palette.success.dark,
      color: "white",
      border: `1px solid ${theme.palette.success.dark}`,
    },
  },
  dialogEditButton: {
    width: "125px",
    backgroundColor: theme.palette.primary.main,
    color: "white",
    border: `1px solid ${theme.palette.primary.main}`,
    "&:focus, &:hover": {
      backgroundColor: theme.palette.primary.dark,
      color: "white",
      border: `1px solid ${theme.palette.primary.dark}`,
    },
  },
  dialogCancelButton: {
    width: "125px",
    backgroundColor: "white",
    color: theme.palette.error.main,
    border: `1px solid ${theme.palette.error.main}`,
    "&:focus, &:hover": {
      backgroundColor: "white",
      color: theme.palette.error.dark,
      border: `1px solid ${theme.palette.error.dark}`,
    },
  },
}));

function SubjectList(props) {
  const classes = useStyles();

  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("subject");

  const [openDeleteDialog, setOpenDeleteDialog] = React.useState(null);

  const [openFormDialog, setOpenFormDialog] = React.useState(null);
  const [selectedSubjectId, setSelectedSubjectId] = React.useState(null);
  const [selectedSubjectName, setSelectedSubjectName] = React.useState(null);
  const [action, setAction] = React.useState("");
  const [errors, setErrors] = React.useState({});

  const [subject, setSubject] = React.useState({});
  const [searchFilter, updateSearchFilter] = React.useState("");
  const [searchBarFocus, setSearchBarFocus] = React.useState(false);
  const [openSnackbar, setOpenSnackbar] = React.useState(false);
  const [snackbarContent, setSnackbarContent] = React.useState(null);

  const {
    subjectsCollection,
    getAllSubjects,
    editSubject,
    clearErrors,
    createSubject,
    deleteSubject,
  } = props;
  const { all_subjects } = props.subjectsCollection;
  const { user, retrieved_users } = props.auth;

  console.log(action);
  const subjectRowItem = (data) => {
    rows.push(createData(data._id, data.name, data.all_class));
  };

  React.useEffect(() => {
    getAllSubjects();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const retrieveSubjects = () => {
    console.log(retrieved_users);
    // If all_subjects is not undefined or an empty array
    rows = [];
    all_subjects
      .filter((item) => {
        return item.name.toLowerCase().includes(searchFilter.toLowerCase());
      })
      .map((data) => subjectRowItem(data));
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  // Call the function to view the subjects on tablerows.
  // This function is defined above.
  retrieveSubjects();

  const onDeleteSubject = (id) => {
    deleteSubject(id).then((res) => {
      getAllSubjects();
      handleOpenSnackbar("Delete")
      handleCloseDeleteDialog()
    });
  };

  // Delete Dialog
  const handleOpenDeleteDialog = (e, id, name) => {
    e.stopPropagation();
    setOpenDeleteDialog(true);
    setSelectedSubjectId(id);
    setSelectedSubjectName(name);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
  };

  const handleOpenSnackbar = (action) => {
    let content = "Mata Pelajaran berhasil "
    if(action == "Create"){
      content += "dibuat"
      setSnackbarContent(content);
    } else if(action == "Edit"){
      content += "disunting"
      setSnackbarContent(content);
    } else if(action == "Delete"){
      content += "dihapus"
      setSnackbarContent(content)
    } else{
      return;
    }

    setOpenSnackbar(true);
  }

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnackbar(false);
  };

  // Delete Dialog
  const handleOpenFormDialog = (e, id, name, isEdit = false) => {
    e.stopPropagation();
    if (isEdit) {
      setSubject((prev) => ({
        ...prev,
        name: name,
        id: id,
      }));
      setAction("Edit");
    } else {
      setAction("Create");
    }
    setOpenFormDialog(true);
  };

  const handleCloseFormDialog = () => {
    setOpenFormDialog(false);
    setSubject({});
  };

  const onChange = (e) => {
    const { id, value } = e.target;
    console.log(value);
    setSubject((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (action === "Edit") {
      editSubject(subject)
        .then(() => {
          handleOpenSnackbar(action);
          getAllSubjects();
          handleCloseFormDialog();
        })
        .catch((err) => setErrors(err));
    } else if (action === "Create") {
      createSubject(subject)
        .then(() => {
          handleOpenSnackbar(action);
          getAllSubjects();
          handleCloseFormDialog();
        })
        .catch((err) => setErrors(err));
    }
  };

  function FormDialog() {
    return (
      <Dialog open={openFormDialog} onClose={handleCloseFormDialog}>
        <Grid
          container
          direction="column"
          justify="space-between"
          alignItems="center"
          className={classes.dialogBox}
        >
          {action === "Edit" ? (
            <Typography variant="h6" align="center" gutterBottom>
              Sunting Mata Pelajaran
            </Typography>
          ) : action === "Create" ? (
            <Typography variant="h6" align="center" gutterBottom>
              Isi Nama Mata Pelajaran
            </Typography>
          ) : null}
          <TextField
            style={{ margin: "10px 0px" }}
            fullWidth
            variant="outlined"
            id="name"
            onChange={onChange}
            value={subject.name}
            error={errors.name}
            type="text"
            helperText={errors.name}
            className={classnames("", {
              invalid: errors.name,
            })}
          />
          <Grid item container justify="center" spacing={2}>
            <Grid item>
              {action === "Edit" ? (
                <Button
                  // type="submit"
                  onClick={onSubmit}
                  startIcon={<EditIcon />}
                  className={classes.dialogEditButton}
                >
                  Sunting
                </Button>
              ) : (
                <Button
                  // type="submit"
                  onClick={onSubmit}
                  startIcon={<LibraryBooksIcon />}
                  className={classes.dialogCreateButton}
                >
                  Buat
                </Button>
              )}
            </Grid>
            <Grid item>
              <Button
                onClick={handleCloseFormDialog}
                startIcon={<CancelIcon />}
                className={classes.dialogCancelButton}
              >
                Batal
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Dialog>
    );
  }

  document.title = "Schooly | Mata Pelajaran";

  return (
    <div className={classes.root}>
      <Grid container alignItems="center" spacing={2} className={classes.header}>
        <Grid item>
          <div className={classes.headerIcon}>
            <LibraryBooksIcon />
          </div>
        </Grid>
        <Grid item>
          <Typography variant="h5" align="left">
            Mata Pelajaran
          </Typography>
        </Grid>
      </Grid>
      <Divider />
      <SubjectListToolbar
        handleOpenFormDialog={handleOpenFormDialog}
        role={user.role}
        deleteSubject={deleteSubject}
        classes={classes}
        order={order}
        orderBy={orderBy}
        onRequestSort={handleRequestSort}
        rowCount={rows ? rows.length : 0}
        searchFilter={searchFilter}
        updateSearchFilter={updateSearchFilter}
        setSearchBarFocus={setSearchBarFocus}
        searchBarFocus={searchBarFocus}
      />
      <Grid container direction="column" spacing={2}>
        {rows.length === 0 ? (
          <Empty />
        ) : (
          stableSort(rows, getComparator(order, orderBy)).map((row, index) => {
            const labelId = `enhanced-table-checkbox-${index}`;
            return (
              <Grid item>
                <Grid container alignItems="stretch" className={classes.subjectItem}>
                  <Grid item className={classes.subjectIcon}>
                    <LibraryBooksIcon />
                  </Grid>
                  <Grid item xs container justify="space-between" alignItems="center" className={classes.subjectItemContent}>
                    <Grid item>
                      <Typography noWrap>
                        {row.name}
                      </Typography>
                    </Grid>
                    <Grid item>
                      <IconButton>
                        <MoreVertIcon />
                      </IconButton>
                    </Grid>
                  </Grid>
                </Grid>
                {/*<ListItem
                  className={classes.listItem}
                >
                  <Hidden smUp implementation="css">
                    <ListItemText
                      style={{ margin: "6px 0" }}
                      primary={
                        <Grid container alignItems="center">
                          <Typography variant="subtitle1" color="textPrimary">
                            {row.name}
                          </Typography>

                          <Grid item style={{ visibility: "hidden" }}>
                            <Typography variant="subtitle1">
                              {"\u200B"}
                            </Typography>
                            <Typography variant="caption">
                              {"\u200B"}
                            </Typography>
                          </Grid>
                        </Grid>
                      }
                    />
                  </Hidden>
                  <Hidden xsDown implementation="css">
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <ListItemAvatar>
                        <Avatar className={classes.listAvatar}>
                          <LibraryBooksIcon />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        style={{ margin: "6px 0" }}
                        primary={
                          <Grid container alignItems="center">
                            <Typography variant="h6" color="textPrimary">
                              {row.name}
                            </Typography>

                            <Grid item style={{ visibility: "hidden" }}>
                              <Grid container direction="column">
                                <Typography variant="h6">
                                  {"\u200B"}
                                </Typography>
                                <Typography variant="body2">
                                  {"\u200B"}
                                </Typography>
                              </Grid>
                            </Grid>
                          </Grid>
                        }
                      />
                    </div>
                  </Hidden>
                  <ListItemText
                    align="right"
                    primary={
                      <Grid container spacing={1} justify="flex-end">
                        <Grid item>
                          <LightTooltip title="Sunting">
                            <IconButton
                              size="small"
                              className={classes.editSubjectButton}
                              onClick={(e) =>
                                handleOpenFormDialog(
                                  e,
                                  row._id,
                                  row.name,
                                  true
                                )
                              }
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                          </LightTooltip>
                        </Grid>
                        <Grid item>
                          <LightTooltip title="Hapus">
                            <IconButton
                              size="small"
                              className={classes.deleteSubjectlButton}
                              onClick={(e) => {
                                handleOpenDeleteDialog(e, row._id, row.name);
                              }}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </LightTooltip>
                        </Grid>
                      </Grid>
                    }
                  />
                </ListItem>*/}
              </Grid>
            );
          })
        )}
      </Grid>
      {FormDialog()}
      <DeleteDialog
        openDeleteDialog={openDeleteDialog}
        handleCloseDeleteDialog={handleCloseDeleteDialog}
        itemType="Mata Pelajaran"
        itemName={selectedSubjectName}
        deleteItem={() => {
          onDeleteSubject(selectedSubjectId);
        }}
      />
      <Snackbar
        open={openSnackbar}
        autoHideDuration={4000}
        onClose={(event, reason) => {
          handleCloseSnackbar(event, reason);
        }}
      >
        <MuiAlert
          variant="filled"
          severity="success"
          onClose={(event, reason) => {
            handleCloseSnackbar(event, reason);
          }}
        >
          {snackbarContent}
        </MuiAlert>
      </Snackbar>
    </div>
  );
}

SubjectList.propTypes = {
  subjectsCollection: PropTypes.object.isRequired,
  deleteSubject: PropTypes.func.isRequired,
  getAllSubjects: PropTypes.func.isRequired,
  createSubject: PropTypes.func.isRequired,
  clearErrors: PropTypes.func.isRequired,
  editSubject: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired,
  success: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  errors: state.errors,
  success: state.success,
  auth: state.auth,
  classesCollection: state.classesCollection,
  subjectsCollection: state.subjectsCollection,
});

export default connect(mapStateToProps, {
  deleteSubject,
  getAllSubjects,
  editSubject,
  getSubject,
  createSubject,
  clearErrors,
  clearSuccess,
})(SubjectList);
