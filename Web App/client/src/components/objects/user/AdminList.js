import React from "react";
// import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { getAdmins, getTeachers, updateTeacher } from "../../../actions/UserActions";
import { getAllSubjects } from "../../../actions/SubjectActions";
import { getAllClass } from "../../../actions/ClassActions";
import { clearErrors } from "../../../actions/ErrorActions";
import { clearSuccess } from "../../../actions/SuccessActions";
import LightTooltip from "../../misc/light-tooltip/LightTooltip";
import {
  Divider,
  ExpansionPanel,
  ExpansionPanelDetails,
  ExpansionPanelSummary,
  Grid,
  InputAdornment,
  IconButton,
  Hidden,
  Menu,
  MenuItem,
  TableSortLabel,
  TextField,
  Typography,
  ListItemAvatar,
  Dialog,
  Avatar,
  Button,
  Snackbar,
} from "@material-ui/core/";
import { makeStyles } from "@material-ui/core/styles";
import EditIcon from "@material-ui/icons/Edit";
import SortIcon from "@material-ui/icons/Sort";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import { GoSearch } from "react-icons/go";
import { BiSitemap } from "react-icons/bi";
import CloseIcon from "@material-ui/icons/Close";
import ClearIcon from "@material-ui/icons/Clear";
import { Autocomplete } from "@material-ui/lab";
import MuiAlert from "@material-ui/lab/Alert";
import { getAllUnits, getAllUnitsMap } from "../../../actions/UnitActions"

function createData(_id, name, email) {
  return { _id, name, email };
}

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

function AdminListToolbar(props) {
  const {
    classes,
    order,
    orderBy,
    onRequestSort,
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
      label: "Nama",
    },
    {
      id: "email",
      numeric: false,
      disablePadding: false,
      label: "Email",
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
              <BiSitemap className={classes.titleIcon} fontSize="large" />
              <Typography variant="h4">Sunting Data Ajar Pengelola</Typography>
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
            <BiSitemap className={classes.titleIcon} fontSize="large" />
            <Typography variant="h4">Sunting Data Ajar Pengelola</Typography>
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
                placeholder="Cari Pengelola"
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
            placeholder="Cari Pengelola"
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
        <LightTooltip title="Urutkan Pengelola">
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
  editTeacherButton: {
    backgroundColor: theme.palette.primary.main,
    color: "white",
    "&:focus, &:hover": {
      backgroundColor: "white",
      color: theme.palette.primary.main,
    },
  },
  teacherPanelSummary: {
    "&:hover": {
      backgroundColor: theme.palette.primary.fade,
    },
  },
  titleIcon: {
    fontSize: "28px",
    backgroundColor: "white",
    color: theme.palette.primary.main,
    marginRight: "10px",
  },
  teacherAvatar: {
    backgroundColor: theme.palette.primary.main,
    marginRight: "10px",
  },
  listItem: {
    "&:focus, &:hover": {
      backgroundColor: theme.palette.primary.fade,
    },
    padding: "6px 16px",
  },
  saveButton: {
    backgroundColor: theme.palette.primary.main,
    color: "white",
    "&:focus, &:hover": {
      color: theme.palette.primary.main,
      backgroundColor: "white",
    },
  },
  cancelButton: {
    backgroundColor: theme.palette.error.main,
    color: "white",
    "&:focus, &:hover": {
      backgroundColor: "white",
      color: theme.palette.error.main,
    },
  },
}));

function AdminList(props) {
  const classes = useStyles();

  const {
    getAllSubjects,
    getAllClass,
    getTeachers,
    updateTeacher,
    clearErrors,
    clearSuccess,
    getAdmins,
    getAllUnits
  } = props;
  const { user, all_admins } = props.auth;
  const { all_units } = props.unitsCollection;
  const errors = props.errors;
  const success = props.success;

  const all_teacher_obj = React.useRef({});
  const [rows, setRows] = React.useState([]);
  /*
    isi:
    {
      <id Pengelola>: {
        subject: [<info mata pelajaran 1>, <info mata pelajaran 2>, ...],
        class: [<info kelas 1>, <info kelas 2>, ...],
      },
      ...

    } key -> id semua Pengelola yang ada di db
  */
  const [selectedValues, setSelectedValues] = React.useState({});
  const [inputValues, setInputValues] = React.useState({});
  // SEARCH
  const [searchFilter, updateSearchFilter] = React.useState("");
  const [searchBarFocus, setSearchBarFocus] = React.useState(false);

  // SORT
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("name");

  // SNACKBAR
  const [snackbarContent, setSnackbarContent] = React.useState("");
  const [severity, setSeverity] = React.useState("info");
  const [openSnackbar, setOpenSnackbar] = React.useState(false);
  

  React.useEffect(() => {

    const request = async () => {
      //Dapatin data data admin dan semua units yang diperlukan.
      const admins = await getAdmins();
      const unitsMap = await getAllUnitsMap();
      setRows(admins);
      let tempSelectedValues = {};
      let tempInputValues = {};
      admins.forEach((a) => {
        tempSelectedValues[a._id] = a.unit;
        tempInputValues[a._id] = unitsMap[a.unit];
      });

      setSelectedValues(tempSelectedValues);
      setInputValues(tempInputValues);
    }
    request();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);



  React.useEffect(() => {
    if (success) {
      handleOpenSnackbar("success", "Data pengelola berhasil disimpan");
      clearSuccess();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [success]);

  React.useEffect(() => {
    return () => {
      clearErrors();
      clearSuccess();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // AUTOCOMPLETE: untuk memilih subject yang diajar dan kelas yang diajar tiap Pengelola

  function handleSelectedValues(data, adminId){
    setSelectedValues({
      ...selectedValues,
      [adminId] : data._id
    });
  }

  function handleInputValues(data, adminId){
    setInputValues({
      ...inputValues,
      [adminId] : data.name
    })
  }

  function handleRequestSort(event, property) {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  }

  function handleOpenSnackbar(severity, content) {
    setOpenSnackbar(true);
    setSeverity(severity);
    setSnackbarContent(content);
  }

  function handleCloseSnackbar(event, reason) {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnackbar(false);
  }

  function handleSave(teacherId) {
    let teacher = selectedValues[teacherId];
    let newSubjectTeached = teacher.subject.map(
      (subjectInfo) => subjectInfo._id
    );
    let newClassTeached = teacher.class.map((classInfo) => classInfo._id);
    let tempClassToSubject = {};

    for (let classId of newClassTeached) {
      // akan diubah di waktu mendatang
      tempClassToSubject[classId] = newSubjectTeached;
    }

    let newTeacherData = {
      ...all_teacher_obj.current[teacherId],
      subject_teached: newSubjectTeached,
      class_teached: newClassTeached,
      class_to_subject: tempClassToSubject,
    };

    updateTeacher(newTeacherData, teacherId);
  }

  // DIALOG SUNTING
  const [openSuntingDialog, setOpenSuntingDialog] = React.useState(false);
  const [dialogData, setDialogData] = React.useState(null);

  const handleClickOpenSuntingDialog = (data) => {
    setDialogData(data);
    setOpenSuntingDialog(true);
  };

  const handleCloseSuntingDialog = () => {
    setOpenSuntingDialog(false);
  };

  document.title = "Schooly | Sunting Data Ajar Pengelola";
  console.log(inputValues)
  return (
    <div className={classes.root}>
      <AdminListToolbar
        classes={classes}
        order={order}
        orderBy={orderBy}
        onRequestSort={handleRequestSort}
        rowCount={rows.length}
        setSearchBarFocus={setSearchBarFocus}
        searchBarFocus={searchBarFocus}
        //Two props added for search filter.
        searchFilter={searchFilter}
        updateSearchFilter={updateSearchFilter}
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
                <Hidden xsDown>
                  <ExpansionPanel button variant="outlined" defaultExpanded>
                    <ExpansionPanelSummary
                      className={classes.teacherPanelSummary}
                    >
                      <Grid
                        container
                        spacing={1}
                        justify="space-between"
                        alignItems="center"
                      >
                        <Grid item>
                          <Hidden smUp implementation="css">
                            <Typography variant="subtitle1" id={labelId}>
                              {row.name}
                            </Typography>
                            <Typography variant="caption" color="textSecondary">
                              {row.email}
                            </Typography>
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
                                {!row.avatar ? (
                                  <Avatar />
                                ) : (
                                  <Avatar
                                    src={`/api/upload/avatar/${row.avatar}`}
                                  />
                                )}
                              </ListItemAvatar>
                              <div>
                                <Typography variant="h6" color="textPrimary">
                                  {row.name}
                                </Typography>
                                <Typography
                                  variant="body2"
                                  color="textSecondary"
                                >
                                  {row.email}
                                </Typography>
                              </div>
                            </div>
                          </Hidden>
                        </Grid>
                        <Hidden smUp implementation="css">
                          <Grid
                            item
                            xs
                            container
                            spacing={1}
                            justify="flex-end"
                          >
                            <Grid item>
                              <LightTooltip title="Sunting">
                                <IconButton
                                  size="small"
                                  className={classes.editTeacherButton}
                                >
                                  <EditIcon fontSize="small" />
                                </IconButton>
                              </LightTooltip>
                            </Grid>
                          </Grid>
                        </Hidden>
                      </Grid>
                    </ExpansionPanelSummary>
                    <Divider />
                    <ExpansionPanelDetails style={{ paddingTop: "20px" }}>
                      <Grid container spacing={4}>
                        <Grid item xs={12}>
                          <Typography variant="body1" color="primary">
                            Unit
                          </Typography>
                          <Autocomplete
                            value={selectedValues[row._id]}
                            onChange={(event, value) => {
                              handleSelectedValues(value, row._id);
                            }}
                            inputValue={inputValues[row._id]}
                            onInputChange={(event, value) => {
                              handleInputValues(value, row._id);
                            }}
                            options={all_units}
                            renderInput={(params) => <TextField {...params} label="Controllable" />}
                          />
                          {/* <Autocomplete
                            multiple={false}
                            id="tags-outlined"
                            options={all_units}
                            getOptionLabel={(option) => option.name}
                            // defaultValue={[top100Films[13]]}
                            filterSelectedOptions
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                variant="outlined"
                                size="small"
                                style={{ border: "none" }}
                              />
                            )}
                          /> */}
                        </Grid>

                        <Grid item xs={12}>
                          <Grid
                            container
                            justify="flex-end"
                            alignItems="center"
                          >
                            <Button
                              className={classes.saveButton}
                              onClick={() => {
                                handleSave(row._id);
                                handleCloseSuntingDialog();
                              }}
                            >
                              Simpan
                            </Button>
                          </Grid>
                        </Grid>
                      </Grid>
                    </ExpansionPanelDetails>
                  </ExpansionPanel>
                </Hidden>
                <Hidden smUp>
                  <ExpansionPanel button variant="outlined" expanded={false}>
                    <ExpansionPanelSummary
                      className={classes.teacherPanelSummary}
                    >
                      <Grid
                        container
                        spacing={1}
                        justify="space-between"
                        alignItems="center"
                      >
                        <Grid item>
                          <Hidden smUp implementation="css">
                            <Typography variant="subtitle1" id={labelId}>
                              {row.name}
                            </Typography>
                            <Typography variant="caption" color="textSecondary">
                              {row.email}
                            </Typography>
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
                                {!row.avatar ? (
                                  <Avatar />
                                ) : (
                                  <Avatar
                                    src={`/api/upload/avatar/${row.avatar}`}
                                  />
                                )}
                              </ListItemAvatar>
                              <div>
                                <Typography variant="h6" color="textPrimary">
                                  {row.name}
                                </Typography>
                                <Typography
                                  variant="body2"
                                  color="textSecondary"
                                >
                                  {row.email}
                                </Typography>
                              </div>
                            </div>
                          </Hidden>
                        </Grid>
                        <Grid item xs container spacing={1} justify="flex-end">
                          <Grid item>
                            <LightTooltip title="Sunting">
                              <IconButton
                                size="small"
                                className={classes.editTeacherButton}
                                onClick={() =>
                                  handleClickOpenSuntingDialog(row)
                                }
                              >
                                <EditIcon fontSize="small" />
                              </IconButton>
                            </LightTooltip>
                          </Grid>
                        </Grid>
                      </Grid>
                    </ExpansionPanelSummary>
                    <Divider />
                  </ExpansionPanel>
                </Hidden>
              </Grid>
            );
          })
        )}
      </Grid>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={(event, reason) => {
          handleCloseSnackbar(event, reason);
        }}
      >
        <MuiAlert
          variant="filled"
          severity={severity}
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

const mapStateToProps = (state) => ({
  errors: state.errors,
  success: state.success,
  auth: state.auth,
  unitsCollection: state.unitsCollection
});

// parameter 1 : reducer , parameter 2 : actions
export default connect(mapStateToProps, {
  getAllSubjects,
  getTeachers,
  getAllClass,
  updateTeacher,
  clearErrors,
  clearSuccess,
  getAdmins,
  getAllUnits
})(AdminList);
