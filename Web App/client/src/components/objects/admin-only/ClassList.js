import React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { viewClass, deleteClass } from "../../../actions/ClassActions";
import LightToolTip from "../../misc/light-tooltip/LightTooltip";
import { Avatar, Badge, Button, Dialog, Divider, Fab, Grid, Hidden, IconButton, Menu, MenuItem, Paper, Table, TableBody, TableCell, TableContainer,
   TableHead, TableRow, TableSortLabel, Toolbar, Typography } from "@material-ui/core/";
import { makeStyles } from "@material-ui/core/styles";
import CancelIcon from "@material-ui/icons/Cancel";
import CloseIcon from "@material-ui/icons/Close";
import DeleteIcon from "@material-ui/icons/Delete";
import DeleteOutlineIcon from "@material-ui/icons/DeleteOutline";
import EditIcon from "@material-ui/icons/Edit";
import SortIcon from "@material-ui/icons/Sort";
import SupervisorAccountIcon from "@material-ui/icons/SupervisorAccount";
import { FaChalkboardTeacher } from "react-icons/fa";

function createData(_id, classroom, homeroomTeacher, size, absent) {
  return { _id, classroom, homeroomTeacher, size, absent };
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
  const { classes, item, deleteClass, onSelectAllClick, order, orderBy, rowCount, onRequestSort } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  const headCells = [
    { id: "classroom", numeric: false, disablePadding: true, label: "Kelas" },
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

  return(
    <Toolbar className={classes.toolbar}>
      <Typography variant="h4" align="left">
        <b>Daftar Kelas</b>
      </Typography>
      <div style={{display: "flex"}}>
        <Hidden smUp implementation="css">
          <LightToolTip title="Buat Kelas">
            <Link to="/buat-kelas">
              <Fab size="small" className={classes.newClassButton}>
                <FaChalkboardTeacher className={classes.newClassIconMobile} />
              </Fab>
            </Link>
          </LightToolTip>
        </Hidden>
        <Hidden xsDown implementation="css">
          <Link to="/buat-kelas">
            <Fab size="medium" variant="extended" className={classes.newClassButton}>
              <FaChalkboardTeacher className={classes.newClassIconDesktop} />
              Buat Kelas
            </Fab>
          </Link>
        </Hidden>
        <LightToolTip title="Urutkan Kelas">
          <Fab size="small" onClick={handleOpenSortMenu} className={classes.sortButton}>
            <SortIcon />
          </Fab>
        </LightToolTip>
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
              padding={headCell.disablePadding ? "none" : "default"}
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
    </Toolbar>
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
    padding: "15px",
  },
  newClassButton: {
    marginRight: "10px",
    backgroundColor: "#61BD4F",
    color: "white",
    "&:focus, &:hover": {
      backgroundColor: "#61BD4F",
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
    backgroundColor: "white",
    "&:focus, &:hover": {
      backgroundColor: "white",
    },
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
  classEditIcon: {
    color: theme.palette.primary.main,
  },
  classDeleteIcon: {
    color: theme.palette.error.dark,
  },
  dialogBox: {
    padding: "15px",
  },
  dialogDeleteButton: {
    width: "150px",
    backgroundColor: theme.palette.error.dark,
    color: "white",
    "&:focus, &:hover": {
      backgroundColor: theme.palette.error.dark,
      color: "white",
    },
  },
  dialogCancelButton: {
    width: "150px",
    backgroundColor: theme.palette.primary.main,
    color: "white",
    "&:focus, &:hover": {
      backgroundColor: theme.palette.primary.main,
      color: "white",
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
}));

function ClassList(props) {
  document.title = "Schooly | Daftar Kelas"
  const classes = useStyles();
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("homeroomTeacher");
  const [selected, setSelected] = React.useState([]);

  const [openDeleteDialog, setOpenDeleteDialog] = React.useState(null);
  const [selectedClassId, setSelectedClassId] = React.useState(null)
  const [selectedClassName, setSelectedClassName] = React.useState(null);

  const { viewClass, deleteClass, classesCollection } = props;
  const { user } = props.auth;

  const colorList = ["#12c2e9", "#c471ed", "#f64f59", "#f5af19", "#6be585"]
  const colorMap = new Map();

  const taskRowItem = (data,i) => {
    colorMap.set(data._id, colorList[i%(colorList.length)])
    rows.push(
      createData(
        data._id,
        data.name,
        data.walikelas.name,
        data.ukuran,
        !data.nihil ? "Nihil" : "Tidak Nihil",
      )
    )
  }
  React.useEffect(() => {viewClass()}, [classesCollection.length])

  const retrieveClasses = () => {
    if(classesCollection.all_classes.length > 0) {
      rows = []
      classesCollection.all_classes.map((data,i) => {
        taskRowItem(data,i)
      })
    }
  }

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (event, checked) => {
    if (checked) {
      const newSelected = rows.map((n) => n._id);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, item) => { // get the id by item._id
    const selectedIndex = selected.indexOf(item._id);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, item._id);
    }
    else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    }
    else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    }
    else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }
    setSelected(newSelected);
  };

  const isSelected = (name) => selected.indexOf(name) !== -1;

  // Call the function to get the classes from DB
  // this function is defined above
  retrieveClasses()

  const onDeleteClass = (id) => {
    deleteClass(id)
  }

  // Delete Dialog box
  const handleOpenDeleteDialog = (e, id, name) => {
    e.stopPropagation();
    setOpenDeleteDialog(true);
    setSelectedClassId(id)
    setSelectedClassName(name)
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
  };

  function DeleteDialog(){
    return(
      <Dialog
        open={openDeleteDialog}
        onClose={handleCloseDeleteDialog}
      >
        <Grid container direction="column" alignItems="center" className={classes.dialogBox}>
          <Grid item container justify="flex-end" alignItems="flex-start">
            <IconButton
              size="small"
              onClick={handleCloseDeleteDialog}
            >
              <CloseIcon />
            </IconButton>
          </Grid>
          <Grid item container justify="center" style={{marginBottom: "20px"}}>
            <Typography variant="h5" gutterBottom>
              Hapus Kelas berikut?
            </Typography>
          </Grid>
          <Grid item container justify="center" style={{marginBottom: "20px"}}>
            <Typography variant="h6" align="center" gutterBottom>
              <b>{selectedClassName}</b>
            </Typography>
          </Grid>
          <Grid
            container
            direction="row"
            justify="center"
            alignItems="center"
            spacing={2}
            style={{marginBottom: "10px"}}
          >
            <Grid item>
              <Button
                onClick={() => { onDeleteClass(selectedClassId) }}
                startIcon={<DeleteOutlineIcon />}
                className={classes.dialogDeleteButton}
              >
                Hapus
              </Button>
            </Grid>
            <Grid item>
              <Button
                onClick={handleCloseDeleteDialog}
                startIcon={< CancelIcon/>}
                className={classes.dialogCancelButton}
              >
                Batal
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Dialog>
    )
  }

  if(user.role === "Student") {
    return(
      <div className={classes.root}>
        <Typography className={classes.title} variant="h5" id="tableTitle" align="center">
          <b>Anda tidak mempunyai izin akses halaman ini.</b>
        </Typography>
      </div>
    )
  }

  return(
    <div className={classes.root}>
      {DeleteDialog()}
      <ClassListToolbar
        classes={classes}
        deleteClass={deleteClass}
        order={order}
        orderBy={orderBy}
        onSelectAllClick={(event, target) => {handleSelectAllClick(event,target)}}
        onRequestSort={handleRequestSort}
        rowCount={rows ? rows.length : 0}
      />
      <Grid container spacing={2}>
        {stableSort(rows, getComparator(order, orderBy))
          .map((row, index) => {
            const isItemSelected = isSelected(row._id);
            const labelId = `enhanced-table-checkbox-${index}`;
            let viewpage = `/kelas/${row._id}`
            // var colorList = ["#12c2e9", "#c471ed", "#f64f59", "#f5af19", "#6be585"]
            return(
              <Grid item xs={12} sm={6} md={4}
                aria-checked={isItemSelected}
                key={row.classroom}
                selected={isItemSelected}
                onClick={() => window.location.href = viewpage}
              >
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
                      {row.classroom}
                    </Typography>
                    <Typography variant="body1" color="textSecondary" align="center">
                      Wali Kelas: <b>{row.homeroomTeacher}</b>
                    </Typography>
                  </div>
                  <Divider />
                  <Grid container direction="row" justify="space-between" alignItems="center" className={classes.classActionContainer}>
                    <Grid item xs>
                      <Typography variant="overline">
                        {row.absent}
                      </Typography>
                    </Grid>
                    <Grid item xs container spacing={1} justify="flex-end" alignItems="center">
                      <Grid item>
                        <LightToolTip title="Jumlah Peserta">
                          <Badge
                            badgeContent={row.size}
                            color="secondary"
                            anchorOrigin={{
                              vertical: "bottom",
                              horizontal: "left",
                            }}
                          >
                            <IconButton size="small">
                              <SupervisorAccountIcon className={classes.classPersonIcon} />
                            </IconButton>
                          </Badge>
                        </LightToolTip>
                      </Grid>
                      <Grid item>
                        <LightToolTip title="Sunting">
                          <Link to={`/sunting-kelas/${row._id}`}>
                            <IconButton
                              size="small"
                              onClick={(e) =>  e.stopPropagation()}
                            >
                              <EditIcon className={classes.classEditIcon} />
                            </IconButton>
                          </Link>
                        </LightToolTip>
                      </Grid>
                      <Grid item>
                        <LightToolTip title="Hapus">
                          <IconButton
                            size="small"
                            onClick={(e) =>{ handleOpenDeleteDialog(e, row._id, row.classroom) }}
                          >
                            <DeleteIcon className={classes.classDeleteIcon} />
                          </IconButton>
                        </LightToolTip>
                      </Grid>
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>
            );
          })}
      </Grid>
    </div>
  )
};

ClassList.propTypes = {
  viewClass: PropTypes.func.isRequired,
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
  mapStateToProps, { viewClass, deleteClass }
) (ClassList);
