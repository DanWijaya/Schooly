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
import { clearSuccess } from "../../../actions/SuccessActions"
import DeleteDialog from "../../misc/dialog/DeleteDialog";
import UploadDialog from "../../misc/dialog/UploadDialog";
import LightTooltip from "../../misc/light-tooltip/LightTooltip";
import {
  Button,
  IconButton,
  Dialog,
  Divider,
  Fab,
  Grid,
  Hidden,
  Menu,
  MenuItem,
  Paper,
  TableSortLabel,
  TextField,
  Typography,
  ListItem,
  ListItemText,
  ListItemAvatar,
  InputAdornment,
  Avatar
} from "@material-ui/core/";
import { makeStyles } from "@material-ui/core/styles";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import CancelIcon from "@material-ui/icons/Cancel";
import CloseIcon from "@material-ui/icons/Close";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import LibraryBooksIcon from "@material-ui/icons/LibraryBooks";
import MenuBookIcon from "@material-ui/icons/MenuBook";
import SortIcon from "@material-ui/icons/Sort";
import ClearIcon from "@material-ui/icons/Clear";
import { GoSearch } from "react-icons/go";

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
      <div style={{ display: "flex", alignItems: "center" }}>
        <Hidden mdUp implementation="css">
          {searchBarFocus ? null : (
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <LibraryBooksIcon className={classes.titleIcon} fontSize="large" />
              <Typography variant="h4">Daftar Mata Pelajaran</Typography>
            </div>
          )}
        </Hidden>
        <Hidden smDown implementation="css">
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <LibraryBooksIcon className={classes.titleIcon} fontSize="large" />
            <Typography variant="h4">Daftar Mata Pelajaran</Typography>
          </div>
        </Hidden>
        <Hidden mdUp implementation="css">
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
                fullWidth
                variant="outlined"
                id="searchFilterMobile"
                value={searchFilter}
                onChange={onChange}
                autoFocus
                onClick={(e) => setSearchBarFocus(true)}
                placeholder="Cari Mata Pelajaran"
                style={{
                  maxWidth: "200px",
                  marginLeft: "10px",
                }}
                InputProps={{
                  startAdornment: searchBarFocus ? null : (
                    <InputAdornment
                      position="start"
                      style={{ marginLeft: "-5px", marginRight: "-5px" }}
                    >
                      <IconButton size="small">
                        <GoSearch />
                      </IconButton>
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment
                      position="end"
                      style={{ marginLeft: "-10px", marginRight: "-10px" }}
                    >
                      <IconButton
                        size="small"
                        id="searchFilterMobile"
                        onClick={(e) => {
                          e.stopPropagation();
                          onClear(e, "searchFilterMobile");
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
                  style: {
                    borderRadius: "22.5px",
                  },
                }}
              />
            </div>
          ) : (
            <LightTooltip title="Search" style={{ marginLeft: "10px" }}>
              <IconButton
                className={classes.goSearchButton}
                onClick={() => setSearchBarFocus(true)}
              >
                <GoSearch className={classes.goSearchIconMobile} />
              </IconButton>
            </LightTooltip>
          )}
        </Hidden>
      </div>
      <div style={{ display: "flex", alignItems: "center" }}>
        <Hidden smDown implementation="css">
          <TextField
            variant="outlined"
            id="searchFilterDesktop"
            value={searchFilter}
            onChange={onChange}
            onClick={() => setSearchBarFocus(true)}
            onBlur={() => setSearchBarFocus(false)}
            placeholder="Cari Mata Pelajaran"
            style={{
              maxWidth: "250px",
              marginRight: "10px",
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment
                  position="start"
                  style={{ marginLeft: "-5px", marginRight: "-5px" }}
                >
                  <IconButton size="small">
                    <GoSearch />
                  </IconButton>
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment
                  position="end"
                  style={{ marginLeft: "-10px", marginRight: "-10px" }}
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
              style: {
                borderRadius: "22.5px",
              },
            }}
          />
        </Hidden>
        <Hidden mdUp implementation="css">
          <LightTooltip title="Buat Mata Pelajaran">
            <Fab 
              size="small" 
              onClick={handleOpenFormDialog} 
              className={classes.newMaterialButton}>
              <LibraryBooksIcon className={classes.newMaterialIconMobile} /> 
            </Fab>
          </LightTooltip>
        </Hidden>
        <Hidden smDown implementation="css">
          <Fab
            size="medium"
            variant="extended"
            onClick={handleOpenFormDialog}
            className={classes.newMaterialButton}
          >
            <LibraryBooksIcon className={classes.newMaterialIconDesktop} />
            Buat Mata Pelajaran
          </Fab>
        </Hidden>
        <LightTooltip title="Urutkan Mata Pelajaran">
          <IconButton
            onClick={handleOpenSortMenu}
            className={classes.sortButton}
          >
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
      </div>
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
  searchBarFocus: PropTypes.bool
};

const useStyles = makeStyles((theme) => ({
  root: {
    margin: "auto",
    maxWidth: "80%",
    [theme.breakpoints.down("md")]: {
        maxWidth: "100%",
    },
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
    backgroundColor: theme.palette.success.main,
    color: "white",
    "&:focus, &:hover": {
      backgroundColor: theme.palette.success.main,
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

    // maxWidth: "350px",
    // padding: "15px",
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
  subjectPanelDivider: {
    backgroundColor: theme.palette.primary.main,
  },
  subjectPanelSummary: {
    "&:hover": {
      backgroundColor: theme.palette.primary.fade,
    },
  },
  listItem: {
    padding: "6px 16px"
  },
  listAvatar: {
    backgroundColor: theme.palette.primary.main,
  },
  titleIcon: {
    fontSize: "28px",
    backgroundColor: "white",
    color: theme.palette.primary.main,
    marginRight: "10px",
  }
}));

function SubjectList(props) {
  const classes = useStyles();

  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("subject");

  const [openDeleteDialog, setOpenDeleteDialog] = React.useState(null);
  const [openCreateDialog, setOpenCreateDialog] = React.useState(null);
  const [openEditDialog, setOpenEditDialog] = React.useState(null);

  const [openFormDialog, setOpenFormDialog] = React.useState(null);
  const [selectedSubjectId, setSelectedSubjectId] = React.useState(null);
  const [selectedSubjectName, setSelectedSubjectName] = React.useState(null);
  const [action, setAction] = React.useState("");
  const [forceSuccess, setForceSuccess] = React.useState(false);
  const [subject, setSubject] = React.useState({});
  const [searchFilter, updateSearchFilter] = React.useState("");
  const [searchBarFocus, setSearchBarFocus] = React.useState(false);
  const {
    subjectsCollection,
    getAllSubjects,
    editSubject,
    clearErrors,
    createSubject,
    deleteSubject,
    errors,
    success
  } = props;
  const { all_subjects } = props.subjectsCollection;
  const { user, retrieved_users } = props.auth;

  console.log(action);
  const subjectRowItem = (data) => {
    rows.push(createData(data._id, data.name, data.all_class));
  };

  React.useEffect(() => {
    window.scrollTo(0, 0);
    getAllSubjects();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    console.log(success)
    if (success && forceSuccess) {
      if (action === "Edit") {
        handleOpenEditDialog();
      } else if (action === "Create") {
        handleOpenCreateDialog();
      }
      clearSuccess();
      setAction("")
      setForceSuccess(false)
    } 
    // jika clearSuccess sudah dijalankan, success akan bernilai null

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [forceSuccess, success]);

  React.useEffect(() => {
    if (openCreateDialog === false) {
      getAllSubjects();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openCreateDialog]);

  React.useEffect(() => {
    if (openEditDialog === false) {
      getAllSubjects();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openEditDialog]);

  const retrieveSubjects = () => {
    console.log(retrieved_users);
    // If all_subjects is not undefined or an empty array
    rows = [];
    all_subjects.filter((item) => {
      return item.name.toLowerCase().includes(searchFilter.toLowerCase()
    )}).map((data) => subjectRowItem(data));
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
    deleteSubject(id);
  };

  // Upload Dialogs
  const handleOpenCreateDialog = () => {
    setOpenCreateDialog(true);
  };

  const handleCloseCreateDialog = () => {
    setOpenCreateDialog(false);
  };

  const handleOpenEditDialog = () => {
    setOpenEditDialog(true);
  };

  const handleCloseEditDialog = () => {
    setOpenEditDialog(false);
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
    clearErrors();
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
      editSubject(subject);
    } else if (action === "Create") {
      createSubject(subject);
    }
    handleCloseFormDialog();
    setForceSuccess(true);
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
                className={ classes.dialogCancelButton}
              >
                Batal
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Dialog>
    );
  }

  document.title = "Schooly | Daftar Mata Pelajaran";

  return (
    <div className={classes.root}>
       <UploadDialog
        openUploadDialog={openCreateDialog}
        handleCloseUploadDialog={handleCloseCreateDialog}
        success={success}
        messageUploading="Mata pelajaran sedang dibuat"
        messageSuccess="Mata pelajaran telah dibuat"
      />
      <UploadDialog
        openUploadDialog={openEditDialog}
        handleCloseUploadDialog={handleCloseEditDialog}
        success={success}
        messageUploading="Mata pelajaran sedang disunting"
        messageSuccess="Mata pelajaran telah disunting"
      />
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
      <Divider variant="inset" className={classes.titleDivider} />
      <Grid container direction="column" spacing={2}>
        {rows.length === 0 ? (
          <Typography variant="subtitle1" align="center" color="textSecondary">
            Kosong
          </Typography>
        ) : (
          stableSort(rows, getComparator(order, orderBy)).map((row, index) => {
            const labelId = `enhanced-table-checkbox-${index}`;
            return (
              <Grid item>
                <Paper variant="outlined">
                  <ListItem
                    // button
                    // component="a"
                    className={classes.listItem}
                  >
                    <Hidden smUp implementation="css">
                      <ListItemText
                        style={{margin: "6px 0"}}
                        primary={
                          <Grid container alignItems="center">
                            <Typography variant="subtitle1" color="textPrimary">
                              {row.name}
                            </Typography>
                            <Grid item style={{visibility: "hidden"}}>
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
                          style={{margin: "6px 0"}}
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
                                  handleOpenFormDialog(e, row._id, row.name, true)
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
                  </ListItem>
                </Paper>
              </Grid>
            );
          })
        )}
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
  clearSuccess
})(SubjectList);
