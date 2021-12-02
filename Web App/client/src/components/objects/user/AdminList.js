import React from "react";
import { connect } from "react-redux";
import { getAllUnits } from "../../../actions/UnitActions";
import { getAllAdmins, updateUnitAdmins, updateTeacher } from "../../../actions/UserActions";
import { clearSuccess } from "../../../actions/SuccessActions";
import { clearErrors } from "../../../actions/ErrorActions";
import DeleteDialog from "../../misc/dialog/DeleteDialog";
import UploadDialog from "../../misc/dialog/UploadDialog";
import Empty from "../../misc/empty/Empty";
import {
  Avatar,
  Button,
  Divider,
  FormControl,
  Grid,
  Hidden,
  IconButton,
  InputAdornment,
  InputLabel,
  Menu,
  MenuItem,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Select,
  TableSortLabel,
  TextField,
  Tooltip,
  Typography,
} from "@material-ui/core/";
import {
  ArrowBack as ArrowBackIcon,
  Clear as ClearIcon,
  ExpandMore as ExpandMoreIcon,
  Search as SearchIcon,
  Sort as SortIcon,
} from "@material-ui/icons";
import { makeStyles } from "@material-ui/core/styles";
import { BiSitemap } from "react-icons/bi";

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
    setSearchFilter(e.target.value);
  };

  const onClear = (e, id) => {
    setSearchFilter("");
  };

  return (
    <div className={classes.toolbar}>
    <Grid container justify="flex-end" alignItems="center" spacing={1}>
      <Grid item>
        <TextField
          variant="outlined"
          id="searchFilterDesktop"
          placeholder="Cari Pengelola"
          value={searchFilter}
          onChange={onChange}
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
              <InputAdornment position="end" style={{ marginLeft: "-10px" }}>
                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    onClear(e, "searchFilterDesktop");
                  }}
                  style={{ visibility: !searchFilter ? "hidden" : "visible" }}
                >
                  <ClearIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Grid>
      <Grid item>
        <Tooltip title="Urutkan Pengelola">
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
  userList: {
    padding: "0px",
  },
  toolbar: {
    padding: "16px 0px",
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
  unitSelect: {
    width: "150px",
    [theme.breakpoints.down("xs")]: {
      width: "100px",
    },
  },
  cancelButton: {
    width: "90px",
    backgroundColor: theme.palette.error.main,
    color: "white",
    "&:focus, &:hover": {
      backgroundColor: theme.palette.error.main,
      color: "white",
    },
  },
  saveButton: {
    width: "90px",
    backgroundColor: theme.palette.primary.main,
    color: "white",
    "&:focus, &:hover": {
      backgroundColor: theme.palette.primary.main,
      color: "white",
    },
  },
}));

function AdminList(props) {
  const classes = useStyles();

  const { getAllAdmins, updateTeacher, getAllUnits, updateUnitAdmins } = props;
  const { user, all_admins } = props.auth;
  const { all_units } = props.unitsCollection;
  const errors = props.errors;

  const all_admin_obj = React.useRef({});
  const [rows, setRows] = React.useState([]);
  const [selectedValues, setSelectedValues] = React.useState({});

  // Search Filter
  const [searchFilter, setSearchFilter] = React.useState("");
  const [searchBarFocus, setSearchBarFocus] = React.useState(false);

  // Sorting
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("name");

  // Upload Dialog
  const [openUploadDialog, setOpenUploadDialog] = React.useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = React.useState(false);
  const [success, setSuccess] = React.useState(false);

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
    if (rows) {
      setRows(
        rows
          .filter((item) =>
            item.name.toLowerCase().includes(searchFilter.toLowerCase())
          )
          .map((data) => createData(data))
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchFilter]);

  function handleRequestSort(event, property) {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  }

  function onUnitChange(e, adminId) {
    setSelectedValues({
      ...selectedValues,
      [adminId]: e.target.value,
    });
  }

  const handleOpenDeleteDialog = () => {
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
  };

  const onSubmit = () => {
    setOpenUploadDialog(true);
    updateUnitAdmins(selectedValues).then((res) => {
      setSuccess(true);
    });
  };

  document.title = "Schooly | Data Unit Pengelola";

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
            <BiSitemap />
          </Avatar>
        </Grid>
        <Grid item>
          <Typography variant="h5" align="left">
            Data Unit Pengelola
          </Typography>
        </Grid>
      </Grid>
      <Divider />
      <AdminListToolbar
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
      <Divider />
      {rows.length === 0 ? (
        <Empty />
      ) : (
        <List className={classes.userList}>
          {stableSort(rows, getComparator(order, orderBy)).map((row, index) => {
            const labelId = index;
            return (
              <div>
                <ListItem>
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
                      <Typography variant="h6" color="textPrimary" noWrap>
                        {row.name}
                      </Typography>
                    }
                    secondary={
                      <Typography variant="body2" color="textSecondary" noWrap>
                        {row.email}
                      </Typography>
                    }
                  />
                  <div>
                    <FormControl
                      fullWidth
                      variant="outlined"
                      color="primary"
                      error={Boolean(errors.to)}
                    >
                      <InputLabel>Unit</InputLabel>
                      <Select
                        label="Unit"
                        value={selectedValues[row._id]}
                        onChange={(event) => onUnitChange(event, row._id)}
                        className={classes.unitSelect}
                      >
                        {all_units.map((u) => (
                          <MenuItem key={u._id} value={u._id}>
                            {u.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </div>
                </ListItem>
                <Divider />
              </div>
            );
          })}
        </List>
      )}
      <Grid container justify="flex-end" spacing={2} style={{ marginTop: "10px" }}>
        <Grid item>
          <Button
            variant="contained"
            onClick={handleOpenDeleteDialog}
            className={classes.cancelButton}
          >
            Batal
          </Button>
        </Grid>
        <Grid item>
          <Button
            variant="contained"
            onClick={onSubmit}
            className={classes.saveButton}
          >
            Simpan
          </Button>
        </Grid>
      </Grid>
      <UploadDialog
        openUploadDialog={openUploadDialog}
        success={success}
        messageUploading={`Unit pengelola sedang disimpan`}
        messageSuccess={`Unit pengelola berhasil disimpan`}
        redirectLink="/pengelola-aktif"
      />
      <DeleteDialog
        openDeleteDialog={openDeleteDialog}
        handleCloseDeleteDialog={handleCloseDeleteDialog}
        itemType="perubahan Pengaturan Unit Pengelola"
        redirectLink="/pengelola-aktif"
      />
    </div>
  );
}

const mapStateToProps = (state) => ({
  auth: state.auth,
  unitsCollection: state.unitsCollection,
  classesCollection: state.classesCollection,
  subjectsCollection: state.subjectsCollection,
  success: state.success,
  errors: state.errors,
});

export default connect(mapStateToProps, {
  getAllUnits,
  getAllAdmins,
  updateUnitAdmins,
  updateTeacher,
  clearSuccess,
  clearErrors,
})(AdminList);
