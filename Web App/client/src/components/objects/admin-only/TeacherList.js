import React from "react";
// import { Link } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
// import moment from "moment";
import { getTeachers } from "../../../actions/UserActions";
import { getAllSubjects } from "../../../actions/SubjectActions";
import { getAllClass } from "../../../actions/ClassActions";

// import DeleteDialog from "../../misc/dialog/DeleteDialog";
import LightTooltip from "../../misc/light-tooltip/LightTooltip";
import {
  Divider,
  ExpansionPanel,
  ExpansionPanelDetails,
  ExpansionPanelSummary,
  Fab,
  Grid,
  InputAdornment,
  IconButton,
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
  Avatar,
} from "@material-ui/core/";
import { makeStyles } from "@material-ui/core/styles";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import MenuBookIcon from "@material-ui/icons/MenuBook";
import PageviewIcon from "@material-ui/icons/Pageview";
import SortIcon from "@material-ui/icons/Sort";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import { GoSearch } from "react-icons/go";
import { BiSitemap } from "react-icons/bi";
import ClearIcon from "@material-ui/icons/Clear";
import { Autocomplete }from '@material-ui/lab';

function createData(
  _id,
  name,
  email,
) {
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

function TeacherListToolbar(props) {
  const {
    classes,
    order,
    orderBy,
    onRequestSort,
    // role,
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
    // {
    //   id: "author",
    //   numeric: false,
    //   disablePadding: false,
    //   label: "Pemberi Materi",
    // },
    // {
    //   id: "createdAt",
    //   numeric: false,
    //   disablePadding: false,
    //   label: "Waktu Dibuat",
    // },
    // {
    //   id: "class_assigned",
    //   numeric: false,
    //   disablePadding: false,
    //   label: "Kelas yang diberikan",
    // },
  ];

  // if (role === "Student") {
  //   headCells.pop();
  // }

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
              <Typography variant="h4">Daftar Guru</Typography>
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
            <Typography variant="h4">Daftar Guru</Typography>
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
                placeholder="Cari Guru"
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
            placeholder="Cari Guru"
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
        {/* <Hidden mdUp implementation="css">
          {role === "Student" ? null : (
            <LightTooltip title="Buat Materi">
              <Link to="/buat-materi">
                <Fab size="small" className={classes.newMaterialButton}>
                  <MenuBookIcon className={classes.newMaterialIconMobile} />
                </Fab>
              </Link>
            </LightTooltip>
          )}
        </Hidden> */}
        {/* <Hidden smDown implementation="css">
          {role === "Student" ? null : (
            <Link to="/buat-materi">
              <Fab
                size="medium"
                variant="extended"
                className={classes.newMaterialButton}
              >
                <MenuBookIcon className={classes.newMaterialIconDesktop} />
                Buat Materi
              </Fab>
            </Link>
          )}
        </Hidden> */}
        <LightTooltip title="Urutkan Guru">
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

// FIXME makeStyles
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
  // newMaterialButton: {
  //   marginRight: "10px",
  //   backgroundColor: theme.palette.success.main,
  //   color: "white",
  //   "&:focus, &:hover": {
  //     backgroundColor: theme.palette.success.main,
  //     color: "white",
  //   },
  // },
  // newMaterialIconDesktop: {
  //   width: theme.spacing(3),
  //   height: theme.spacing(3),
  //   marginRight: "7.5px",
  // },
  // newMaterialIconMobile: {
  //   width: theme.spacing(3),
  //   height: theme.spacing(3),
  // },
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
  // viewMaterialButton: {
  //   backgroundColor: theme.palette.warning.main,
  //   color: "white",
  //   "&:focus, &:hover": {
  //     backgroundColor: "white",
  //     color: theme.palette.warning.main,
  //   },
  // },
  // editMaterialButton: {
  //   backgroundColor: theme.palette.primary.main,
  //   color: "white",
  //   "&:focus, &:hover": {
  //     backgroundColor: "white",
  //     color: theme.palette.primary.main,
  //   },
  // },
  // deleteMaterialButton: {
  //   backgroundColor: theme.palette.error.dark,
  //   color: "white",
  //   "&:focus, &:hover": {
  //     backgroundColor: "white",
  //     color: theme.palette.error.dark,
  //   },
  // },
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
  // teacherPaper: {
  //   display: "flex",
  //   justifyContent: "space-between",
  //   alignItems: "center",
  //   padding: "15px",
  //   "&:focus, &:hover": {
  //     backgroundColor: theme.palette.primary.fade,
  //   },
  // },
  titleIcon: {
    fontSize: "28px",
    backgroundColor: "white",
    color: theme.palette.primary.main,
    marginRight: "10px",
  },
  // assignmentLate: {
  //   backgroundColor: theme.palette.primary.main,
  // },
  teacherAvatar: {
    backgroundColor: theme.palette.primary.main,
    marginRight: "10px",
  },
  listItem: {
    "&:focus, &:hover": {
      backgroundColor: theme.palette.primary.fade,
    },
    padding: "6px 16px"
  }
}));

// FIXME TeacherList
function TeacherList(props) {
  const classes = useStyles();

  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("name");

  // const [openDeleteDialog, setOpenDeleteDialog] = React.useState(null);
  const [selectedMaterialId, setSelectedMaterialId] = React.useState(null);
  const [selectedMaterialName, setSelectedMaterialName] = React.useState(null);
  const [searchFilter, updateSearchFilter] = React.useState("");
  const [searchBarFocus, setSearchBarFocus] = React.useState(false);

  // FIXME selectedValues
  /* 
    isi:
    {
      <id guru>: {
        subject: [<id mata pelajaran 1>, <id mata pelajaran 2>, ...],
        class: [<id kelas 1>, <id kelas 2>, ...],
      },
      ...

    } key -> id semua guru yang ada di db
  */
  const [selectedValues, setSelectedValues] = React.useState({});

  const {
    getAllSubjects,
    // getMaterial,
    // deleteMaterial,
    getAllClass,
    getTeachers,
  } = props;
  // const { all_materials, selectedMaterials } = props.materialsCollection;
  // const { all_classes_map } = props.classesCollection;
  const { all_classes } = props.classesCollection;
  const { user, all_teachers } = props.auth;
  // const { all_subjects_map } = props.subjectsCollection;
  const { all_subjects } = props.subjectsCollection;

  // FIXME sumber bug potensial
  const rowsRef = React.useRef([]);
  const [rows, setRows] = React.useState([]);
  // const rows = rowsRef.current;

  const teacherRowItem = (data) => {
    rowsRef.current.push(
      createData(
        data._id,
        data.name,
        data.email
        // !all_teachers.size || !all_teachers.get(data.author_id)
        //   ? {}
        //   : all_teachers.get(data.author_id),
        // data.class_assigned,
        // data.createdAt
      )
    );
  };

  React.useEffect(() => {
    window.scrollTo(0, 0);
    // getAllSubjects("map");
    getAllSubjects();
    // getAllClass("map");
    getAllClass();
    // getTeachers("map");
    getTeachers();

    // if (user.role === "Teacher") {
    //   getMaterial(user._id, "by_author");
    // } else {
    //   // for student
    //   getMaterial(user.kelas, "by_class");
    // }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    console.log(all_teachers)
    if (
      all_teachers
    ) {
      all_teachers
        .filter((item) =>
          item.name.toLowerCase().includes(searchFilter.toLowerCase())
        )
        .forEach((data) => teacherRowItem(data));
      setRows(rowsRef.current);
    }
  }, [all_teachers]);

  React.useEffect(() => {
    if (
      all_teachers
    ) {
      rowsRef.current = [];
      all_teachers
        .filter((item) =>
          item.name.toLowerCase().includes(searchFilter.toLowerCase())
        )
        .forEach((data) => teacherRowItem(data));
      setRows(rowsRef.current);
    }
  }, [searchFilter]);

  // console.log(all_teachers);
  // const retrieveTeachers = () => {
  //   rows = [];

  //   if (user.role === "Admin") {
  //     all_materials
  //       .filter((item) =>
  //         item.name.toLowerCase().includes(searchFilter.toLowerCase())
  //       )
  //       .map((data) => teacherRowItem(data));
  //     // all_materials.map(data =>  teacherRowItem(data))
  //   } else {
  //     if (selectedMaterials.length) {
  //       selectedMaterials
  //         .filter((item) =>
  //           item.name.toLowerCase().includes(searchFilter.toLowerCase())
  //         )
  //         .map((data) => teacherRowItem(data));
  //       // selectedMaterials.map(data => teacherRowItem(data))
  //     }
  //   }
  // };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  // Call the function to view the Materials on tablerows.
  // This function is defined above.
  // retrieveMaterials();

  // const onDeleteMaterial = (id) => {
  //   deleteMaterial(id);
  // };

  // Delete Dialog
  // const handleOpenDeleteDialog = (e, id, name) => {
  //   e.stopPropagation();
  //   setOpenDeleteDialog(true);
  //   setSelectedMaterialId(id);
  //   setSelectedMaterialName(name);
  // };

  // const handleCloseDeleteDialog = () => {
  //   setOpenDeleteDialog(false);
  // };

  document.title = "Schooly | Daftar Guru";

  return (
    <div className={classes.root}>
      {/* <DeleteDialog
        openDeleteDialog={openDeleteDialog}
        handleCloseDeleteDialog={handleCloseDeleteDialog}
        itemType="Materi"
        itemName={selectedMaterialName}
        deleteItem={() => {
          onDeleteMaterial(selectedMaterialId);
        }}
      /> */}
      <TeacherListToolbar
        // role={user.role}
        // deleteMaterial={deleteMaterial}
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
            // let viewpage = `/materi/${row._id}`;
            return (
              <Grid item>
                {/* {user.role === "Teacher" ? ( */}
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
                                  <Avatar src={`/api/upload/avatar/${row.avatar}`} />
                                )}
                                {/* <Avatar className={classes.teacherAvatar}>
                                  <BiSitemap />
                                </Avatar> */}
                              </ListItemAvatar>
                              <div>
                                <Typography variant="h6" color="textPrimary">
                                  {row.name}
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                  {row.email}
                                </Typography>
                              </div>
                            </div>
                          </Hidden>
                        </Grid>
                        <Hidden smUp implementation="css">
                          <Grid item xs container spacing={1} justify="flex-end">
                            {/* <Grid item>
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
                            </Grid> */}
                            <Grid item>
                              <LightTooltip title="Sunting">
                                {/* <Link to={`/sunting-materi/${row._id}`}> */}
                                  <IconButton
                                    size="small"
                                    className={classes.editTeacherButton}
                                  >
                                    <EditIcon fontSize="small" />
                                  </IconButton>
                                {/* </Link> */}
                              </LightTooltip>
                            </Grid>
                            {/* <Grid item>
                              <LightTooltip title="Hapus">
                                <IconButton
                                  size="small"
                                  className={classes.deleteMaterialButton}
                                  onClick={(e) => {
                                    handleOpenDeleteDialog(
                                      e,
                                      row._id,
                                      row.materialtitle
                                    );
                                  }}
                                >
                                  <DeleteIcon fontSize="small" />
                                </IconButton>
                              </LightTooltip>
                            </Grid> */}
                          </Grid>
                        </Hidden>
                      </Grid>
                    </ExpansionPanelSummary>
                    <Divider />
                    <ExpansionPanelDetails style={{ paddingTop: "20px" }}>
                      <Grid container>
                        <Grid item xs={6}>
                          <Typography variant="body1">Mata Pelajaran</Typography>
                          <Autocomplete
                            multiple
                            id="mata-pelajaran"
                            options={all_subjects}
                            getOptionLabel={(option) => option.name}
                            filterSelectedOptions
                            // size="small"
                            onChange={(event, value) => {
                              this.handleChangeSubject(value);
                            }}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                variant="outlined"
                                size="small"
                                // fullWidth
                                style={{ border: "none" }}
                                // TODO
                                // error={errors.mata_pelajaran}
                                // helperText={errors.mata_pelajaran}
                              />
                            )}
                          />
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="body1">Kelas</Typography>
                        </Grid>

                        {/* <Grid item xs={12}>
                          <Typography variant="body1">
                            Kelas yang Diberikan:{" "}
                            {!all_classes_map.size
                              ? null
                              : row.class_assigned.map((kelas, i) => {
                                if (all_classes_map.get(kelas)) {
                                  if (i === row.class_assigned.length - 1)
                                    return `${all_classes_map.get(kelas).name}`;
                                  return `${all_classes_map.get(kelas).name}, `;
                                }
                                return null;
                              })}
                          </Typography>
                        </Grid>
                        <Grid item xs={12}>
                          <Typography variant="body1" color="textSecondary">
                            Waktu Dibuat:{" "}
                            {moment(row.createdAt)
                              .locale("id")
                              .format("DD MMM YYYY, HH.mm")}
                          </Typography>
                        </Grid> */}
                      </Grid>
                    </ExpansionPanelDetails>
                  </ExpansionPanel>
                {/* ) : (
                    <Link to={viewpage}>
                      <Paper variant="outlined">
                        <ListItem
                          // button
                          // component="a"
                          className={classes.listItem}
                        >
                          <Hidden smUp implementation="css">
                            <ListItemText
                              primary={
                                <Typography variant="subtitle1" color="textPrimary">
                                  {row.materialtitle}
                                </Typography>
                              }
                              secondary={
                                <Typography variant="caption" color="textSecondary">
                                  {all_subjects_map.get(row.subject)}
                                </Typography>
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
                                <Avatar className={classes.assignmentLate}>
                                  <MenuBookIcon />
                                </Avatar>
                              </ListItemAvatar>
                              <ListItemText
                                primary={
                                  <Typography variant="h6" color="textPrimary">
                                    {row.materialtitle}
                                  </Typography>
                                }
                                secondary={
                                  <Typography variant="body2" color="textSecondary">
                                    {all_subjects_map.get(row.subject)}
                                  </Typography>
                                }
                              />
                            </div>
                          </Hidden>
                          <ListItemText
                            align="right"
                            primary={
                              <Typography variant="body2" color="textSecondary">
                                {moment(row.createdAt)
                                  .locale("id")
                                  .format("DD MMM YYYY")}
                              </Typography>
                            }
                            secondary={moment(row.createdAt)
                              .locale("id")
                              .format("HH.mm")}
                          />
                        </ListItem>
                      </Paper>
                    </Link>
                  )} */}
              </Grid>
            );
          })
        )}
      </Grid>
    </div>
  );
}

// TeacherList.propTypes = {
//   deleteMaterial: PropTypes.func.isRequired,
//   getAllMaterials: PropTypes.func.isRequired,
//   getMaterial: PropTypes.func.isRequired,
//   getTeachers: PropTypes.func.isRequired,
//   getAllSubjects: PropTypes.func.isRequired,
//   getSelectedClasses: PropTypes.func.isRequired,
//   getAllClass: PropTypes.func.isRequired,

//   classesCollection: PropTypes.object.isRequired,
//   materialsCollection: PropTypes.object.isRequired,
//   subjectsCollection: PropTypes.object.isRequired,
//   errors: PropTypes.object.isRequired,
//   auth: PropTypes.object.isRequired,
// };

const mapStateToProps = (state) => ({
  errors: state.errors,
  auth: state.auth,
  classesCollection: state.classesCollection,
  // materialsCollection: state.materialsCollection,
  subjectsCollection: state.subjectsCollection,
});

// parameter 1 : reducer , parameter 2 : actions
export default connect(mapStateToProps, {
  // deleteMaterial,
  // getAllMaterials,
  getAllSubjects,
  // getMaterial,
  getTeachers,
  getAllClass,
  // getSelectedClasses,
})(TeacherList);
