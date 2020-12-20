import React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { getTeachers } from "../../../actions/UserActions";
import { getAllClass, deleteClass } from "../../../actions/ClassActions";
import { clearErrors } from "../../../actions/ErrorActions";
import DeleteDialog from "../../misc/dialog/DeleteDialog";
import LightTooltip from "../../misc/light-tooltip/LightTooltip";
import { Avatar, Badge, Divider, Fab, Grid, Hidden, IconButton, Menu, MenuItem, Paper, TableSortLabel, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import SortIcon from "@material-ui/icons/Sort";
import SupervisorAccountIcon from "@material-ui/icons/SupervisorAccount";
import { FaChalkboardTeacher } from "react-icons/fa";

function createData(_id, name, homeroomTeacher, size, absent) {
  return { _id, name, homeroomTeacher, size, absent };
}

var rows=[];

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

function ClassListToolbar(props) {
  const { classes, user, order, orderBy, onRequestSort } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  const headCells = [
    { id: "name", numeric: false, disablePadding: true, label: "Kelas" },
    { id: "homeroomTeacher", numeric: false, disablePadding: false, label: "Wali Kelas" },
    { id: "size", numeric: true, disablePadding: false, label: "Jumlah Murid" },
    { id: "absent", numeric: false, disablePadding: false, label: "Absen" },
  ];

  // Sort Menu
  const [anchorEl, setAnchorEl] = React.useState(null);
  const handleOpenSortMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleCloseSortMenu = () => {
    setAnchorEl(null);
  };

  return (
    <div className={classes.toolbar}>
      <Typography variant="h4">
        Daftar Kelas
      </Typography>
      <div style={{display: "flex", alignItems: "center"}}>
        {user.role === "Admin" ?
          <div>
            <Hidden smUp implementation="css">
              <LightTooltip title="Buat Kelas">
                <Link to="/buat-kelas">
                  <Fab size="small" className={classes.newClassButton}>
                    <FaChalkboardTeacher className={classes.newClassIconMobile} />
                  </Fab>
                </Link>
              </LightTooltip>
            </Hidden>
            <Hidden xsDown implementation="css">
              <Link to="/buat-kelas">
                <Fab size="medium" variant="extended" className={classes.newClassButton}>
                  <FaChalkboardTeacher className={classes.newClassIconDesktop} />
                  Buat Kelas
                </Fab>
              </Link>
            </Hidden>
          </div>
        :
          null
        }
        <LightTooltip title="Urutkan Kelas">
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
  );
};

ClassListToolbar.propTypes = {
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
  newClassButton: {
    marginRight: "10px",
    backgroundColor: theme.palette.create.main,
    color: "white",
    "&:focus, &:hover": {
      backgroundColor: theme.palette.create.main,
      color: "white",
    },
  },
  newClassIconDesktop: {
    width: theme.spacing(2.5),
    height: theme.spacing(2.5),
    marginRight: "7.5px",
  },
  newClassIconMobile: {
    width: theme.spacing(2.5),
    height: theme.spacing(2.5),
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
  classPaper: {
    "&:focus, &:hover": {
      border: "1px solid #2196F3",
      cursor: "pointer",
    },
  },
  classActionContainer: {
    padding: "20px 10px 20px 10px"
  },
  classPersonIcon: {
    color: theme.palette.text.disabled,
  },
  editClassButton: {
    backgroundColor: theme.palette.primary.main,
    color: "white",
    "&:focus, &:hover": {
      backgroundColor: "white",
      color: theme.palette.primary.main,
    },
  },
  deleteClassButton: {
    backgroundColor: theme.palette.error.dark,
    color: "white",
    "&:focus, &:hover": {
      backgroundColor: "white",
      color: theme.palette.error.dark,
    },
  },
}));

function ClassList(props) {
  const classes = useStyles();

  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("homeroomTeacher");
  const [openDeleteDialog, setOpenDeleteDialog] = React.useState(null);
  const [selectedClassId, setSelectedClassId] = React.useState(null)
  const [selectedClassName, setSelectedClassName] = React.useState(null);

  const { getAllClass, deleteClass, classesCollection, getTeachers, clearErrors } = props;

  const { user, all_teachers } = props.auth;

  const colorList = ["#12c2e9", "#c471ed", "#f64f59", "#f5af19", "#6be585"]
  const colorMap = new Map();

  const classItem = (data,i) => {
    colorMap.set(data._id, colorList[i%(colorList.length)])
    rows.push(
      createData(
        data._id,
        data.name,
        !all_teachers.size || !all_teachers.get(data.walikelas) ? null : all_teachers.get(data.walikelas).name,
        data.ukuran,
        !data.nihil ? "Nihil" : "Tidak Nihil",
      )
    )
  }
  React.useEffect(() => {
    getAllClass()
    getTeachers("map")
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])

  React.useEffect(() => {
    return () => {
      clearErrors()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  console.log(classesCollection)

  console.log(all_teachers)
  const retrieveClasses = () => {
    if (classesCollection.all_classes.length > 0) {
      rows = []
      classesCollection.all_classes.map((data,i) => classItem(data,i))
    }
  }

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  // Call the function to get the classes from DB
  // this function is defined above
  retrieveClasses()

  const onDeleteClass = (id) => {
    deleteClass(id)
  }

  // Delete Dialog box
  const handleOpenDeleteDialog = (e, id, name) => {
    e.preventDefault()
    setOpenDeleteDialog(true);
    setSelectedClassId(id)
    setSelectedClassName(name)
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    clearErrors()
  };

  if (user.role === "Student") {
    return (
      <div className={classes.root}>
        <Typography variant="h5" align="center" className={classes.title}>
          <b>Anda tidak mempunyai izin akses halaman ini.</b>
        </Typography>
      </div>
    )
  }

  document.title = "Schooly | Daftar Kelas"

  return (
    <div className={classes.root}>
      <DeleteDialog
        openDeleteDialog={openDeleteDialog}
        handleCloseDeleteDialog={handleCloseDeleteDialog}
        itemType="Kelas"
        itemName={selectedClassName}
        deleteItem={() => { onDeleteClass(selectedClassId) }}
      />
      <ClassListToolbar
        classes={classes}
        deleteClass={deleteClass}
        order={order}
        orderBy={orderBy}
        user={user}
        onRequestSort={handleRequestSort}
        rowCount={rows ? rows.length : 0}
      />
      <Divider variant="inset" className={classes.titleDivider} />
      <Grid container spacing={2}>
        {stableSort(rows, getComparator(order, orderBy))
          .map((row, index) => {
            const labelId = `enhanced-table-checkbox-${index}`;
            console.log(row)
            let viewpage = `/kelas/${row._id}`;
            return (
              <Grid item xs={12} sm={6} md={4}>
                <Link to={viewpage} onClick={(e) => e.stopPropagation()}>
                  <Paper button square
                    variant="outlined"
                    className={classes.classPaper}
                  >
                    <Avatar
                      variant="square"
                      style={{
                        backgroundColor: colorMap.get(row._id),
                        width: "100%",
                        height: "120px",
                      }}
                    >
                      <FaChalkboardTeacher
                        style={{
                          width: "50px",
                          height: "50px",
                        }}
                      />
                    </Avatar>
                    <Divider />
                    <div style={{padding: "10px 20px 20px 10px"}}>
                      <Typography id={labelId} variant="h5" align="center">
                        {row.name}
                      </Typography>
                      <Typography variant="body1" color="textSecondary" align="center">
                        Wali Kelas: <b>{row.homeroomTeacher}</b>
                      </Typography>
                    </div>
                    <Divider />
                    <Grid container direction="row" justify="space-between" alignItems="center" className={classes.classActionContainer}>
                      {user.role === "Admin" ?
                        <Grid item xs container spacing={1} justify="flex-end" alignItems="center">
                          <Grid item>
                            <LightTooltip title="Jumlah Peserta">
                              <Badge
                                badgeContent={row.size}
                                color="secondary"
                                anchorOrigin={{
                                  vertical: "bottom",
                                  horizontal: "left",
                                }}
                              >
                                <IconButton size="small" disabled>
                                  <SupervisorAccountIcon className={classes.classPersonIcon} />
                                </IconButton>
                              </Badge>
                            </LightTooltip>
                          </Grid>
                          <Grid item>
                            <LightTooltip title="Sunting">
                              <Link to={`/sunting-kelas/${row._id}`} onClick={(e) => e.stopPropagation()}>
                                <IconButton
                                  size="small"
                                  className={classes.editClassButton}>
                                  <EditIcon fontSize="small" />
                                </IconButton>
                              </Link>
                            </LightTooltip>
                          </Grid>
                          <Grid item>
                            <LightTooltip title="Hapus">
                              <IconButton
                                size="small"
                                className={classes.deleteClassButton}
                                onClick={(e) => handleOpenDeleteDialog(e, row._id, row.name)}
                              >
                                <DeleteIcon fontSize="small"/>
                              </IconButton>
                            </LightTooltip>
                          </Grid>
                        </Grid>
                      :
                        <Grid container direction="row" justify="flex-end" alignItems="center">
                          <Grid item>
                            <LightTooltip title="Jumlah Peserta">
                              <Badge
                                badgeContent={row.size}
                                color="secondary"
                                anchorOrigin={{
                                  vertical: "bottom",
                                  horizontal: "left",
                                }}
                              >
                                <IconButton size="small" disabled>
                                  <SupervisorAccountIcon className={classes.classPersonIcon} />
                                </IconButton>
                              </Badge>
                            </LightTooltip>
                          </Grid>
                        </Grid>
                      }
                    </Grid>
                  </Paper>
              </Link>
            </Grid>
            );
          })}
      </Grid>
    </div>
  )
};

ClassList.propTypes = {
  getAllClass: PropTypes.func.isRequired,
  getTeachers: PropTypes.func.isRequired,
  clearErrors: PropTypes.func.isRequired,
  classesCollection: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  deleteClass: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
}

const mapStateToProps = (state) => ({
  errors: state.errors,
  auth: state.auth,
  classesCollection: state.classesCollection,
})

export default connect(
  mapStateToProps, { getAllClass, deleteClass, getTeachers, clearErrors }
) (ClassList);
