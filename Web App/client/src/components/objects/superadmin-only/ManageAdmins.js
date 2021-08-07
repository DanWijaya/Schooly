//FIX ME belum digantii.
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
  Snackbar,
  TableSortLabel,
  TextField,
  Typography,
  ListItem,
  ListItemText,
  ListItemAvatar,
  InputAdornment,
  Avatar,
} from "@material-ui/core/";
import { makeStyles } from "@material-ui/core/styles";
import MuiAlert from "@material-ui/lab/Alert";
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

var rows = [];

function UnitListToolbar(props) {
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
                <LibraryBooksIcon
                  className={classes.titleIcon}
                  fontSize="large"
                />
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
                className={classes.newMaterialButton}
              >
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
    },
  }));
  
function UnitList(props){
    const classes = useStyles();

    const [order,setOrder] = React.useState("asc");
    const [orderBy, setOrderBy] = React.useState("unit");

    return(
        <div>Hello</div>
    )
}

export default UnitList;