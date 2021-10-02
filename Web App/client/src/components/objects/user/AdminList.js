import React from "react";
import { connect } from "react-redux";
import { getAllAdmins, updateTeacher } from "../../../actions/UserActions";
import { getAllUnits } from "../../../actions/UnitActions";
import { clearErrors } from "../../../actions/ErrorActions";
import { clearSuccess } from "../../../actions/SuccessActions";
import LightTooltip from "../../misc/light-tooltip/LightTooltip";
import {
  Divider,
  FormControl,
  ExpansionPanel,
  ExpansionPanelDetails,
  ExpansionPanelSummary,
  Grid,
  InputAdornment,
  InputLabel,
  IconButton,
  Hidden,
  Menu,
  MenuItem,
  ListItem,
  ListItemText,
  TableSortLabel,
  TextField,
  Typography,
  FormHelperText,
  ListItemAvatar,
  Dialog,
  Avatar,
  Button,
  Chip,
  Select,
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
import MuiAlert from "@material-ui/lab/Alert";

function createData(data) {
  const { _id, name, email, unit } = data;
  return { _id, name, email, unit };
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
              <Typography variant="h4">Sunting Unit Pengelola</Typography>
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
            <Typography variant="h4">Sunting Unit Pengelola</Typography>
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

// TeacherListToolbar.propTypes = {
//   classes: PropTypes.object.isRequired,
//   onRequestSort: PropTypes.func.isRequired,
//   onSelectAllClick: PropTypes.func.isRequired,
//   order: PropTypes.oneOf(["asc", "desc"]).isRequired,
//   orderBy: PropTypes.string.isRequired,
//   rowCount: PropTypes.number.isRequired,
// };

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
  select: {
    minWidth: "150px",
    maxWidth: "150px",
    [theme.breakpoints.down("xs")]: {
      minWidth: "100px",
      maxWidth: "100px",
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

function TeacherList(props) {
  const classes = useStyles();

  const {
    getAllAdmins,
    updateTeacher,
    clearErrors,
    clearSuccess,
    getAllUnits,
  } = props;
  const { user, all_admins } = props.auth;
  const { all_units } = props.unitsCollection;
  const errors = props.errors;
  const success = props.success;

  const all_admin_obj = React.useRef({});
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
    getAllAdmins();
    getAllUnits();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    if (all_admins) {
      let tempRows = [];
      let tempSelectedValues = {};
      tempRows = all_admins
        .filter((item) =>
          item.name.toLowerCase().includes(searchFilter.toLowerCase())
        )
        .map((data) => {
          //   tempRows.push(createData(data._id, data.name, data.email));
          all_admin_obj.current[data._id] = data;
          tempSelectedValues[data._id] = data.unit;
          return createData(data);
        });
      setRows(tempRows);
      setSelectedValues(tempSelectedValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [all_admins]);

  React.useEffect(() => {
    if (all_admins) {
      setRows(
        all_admins
          .filter((item) =>
            item.name.toLowerCase().includes(searchFilter.toLowerCase())
          )
          .map((data) => createData(data))
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchFilter]);

  React.useEffect(() => {
    if (
      errors &&
      errors.constructor === Object &&
      Object.keys(errors).length !== 0
    ) {
      handleOpenSnackbar("error", "Data Pengelola gagal disimpan");
      clearErrors();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [errors]);

  React.useEffect(() => {
    if (success) {
      handleOpenSnackbar("success", "Data Pengelola berhasil disimpan");
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

  function onUnitChange(e, adminId) {
    setSelectedValues({
      ...selectedValues,
      [adminId]: e.target.value,
    });
  }

  function handleSave(adminId) {
    let teacher = selectedValues[adminId];
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
      ...all_admin_obj.current[adminId],
      subject_teached: newSubjectTeached,
      class_teached: newClassTeached,
      class_to_subject: tempClassToSubject,
    };

    updateTeacher(newTeacherData, adminId);
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

  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250,
      },
    },
  };

  document.title = "Schooly | Sunting Unit Pengelola";

  return (
    <div className={classes.root}>
      <AdminListToolbar
        classes={classes}
        order={order}
        orderBy={orderBy}
        onRequestSort={handleRequestSort}
        rowCount={rows ? rows.length : 0}
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
            console.log(row.unit);
            return (
              <Grid item>
                <ListItem className={classes.listItem}>
                  <Hidden xsDown>
                    <ListItemAvatar>
                      {!row.avatar ? (
                        <Avatar />
                      ) : (
                        <Avatar src={`/api/upload/avatar/${row.avatar}`} />
                      )}
                    </ListItemAvatar>
                  </Hidden>
                  <ListItemText
                    primary={
                      <Typography variant="h6" color="textPrimary">
                        {row.name}
                      </Typography>
                    }
                    secondary={
                      <Typography variant="body2" color="textSecondary">
                        {row.email}
                      </Typography>
                    }
                  />
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "flex-end",
                    }}
                  >
                    <ListItemText
                      align="left"
                      primary={
                        <FormControl
                          variant="outlined"
                          error={Boolean(errors.to)}
                          color="primary"
                          fullWidth
                        >
                          <InputLabel id="unit-label">Unit</InputLabel>
                          <Select
                            labelId="unit-label"
                            label="Unit"
                            value={selectedValues[row._id]}
                            onChange={(event) => {
                              onUnitChange(event, row._id);
                            }}
                            className={classes.select}
                          >
                            {all_units.map((u) => (
                              <MenuItem key={u._id} value={u._id}>
                                {u.name}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      }
                    />
                  </div>
                </ListItem>
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
  classesCollection: state.classesCollection,
  subjectsCollection: state.subjectsCollection,
  unitsCollection: state.unitsCollection,
});

// parameter 1 : reducer , parameter 2 : actions
export default connect(mapStateToProps, {
  getAllAdmins,
  getAllUnits,
  updateTeacher,
  clearErrors,
  clearSuccess,
})(TeacherList);
