import React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import moment from "moment";
import "moment/locale/id";
import LightToolTip from "../../misc/light-tooltip/LightTooltip";
import { Button, Dialog, Fab, Grid, IconButton, Paper, Table, TableBody, TableCell, TableContainer,
   TableHead, TableRow, TableSortLabel, Toolbar, Typography } from "@material-ui/core/";
import { makeStyles } from "@material-ui/core/styles";
import CancelIcon from "@material-ui/icons/Cancel";
import CloseIcon from "@material-ui/icons/Close";
import DeleteIcon from "@material-ui/icons/Delete";
import DeleteOutlineIcon from "@material-ui/icons/DeleteOutline";
import EditIcon from "@material-ui/icons/Edit";
import { FaChalkboardTeacher } from "react-icons/fa";
import { getStudents, getTeachers } from "../../../actions/UserActions"

// Source of the tables codes are from here : https://material-ui.com/components/tables/
function createData(_id, name, email, phone, tanggal_lahir, action) {
  return { _id, name, email, phone, tanggal_lahir, action };
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

function ManageUsersHead(props) {
  const { classes, onSelectAllClick, order, orderBy, rowCount, onRequestSort } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  const headCells = [
    { id: "name", numeric: false, disablePadding: true, label: "Nama" },
    { id: "email", numeric: false, disablePadding: false, label: "Email" },
    { id: "phone", numeric: true, disablePadding: false, label: "Nomor Telepon" },
    { id: "tanggal_lahir", numeric: false, disablePadding: false, label: "Tanggal Lahir" },
    { id: "action", numeric: false, disablePadding: false, label: "Atur Pengguna" },
  ];

  return(
    <TableHead style={{backgroundColor: "rgba(0,0,0,0.05)"}}>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align="center"
            padding={headCell.disablePadding ? "none" : "default"}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : "asc"}
              onClick={createSortHandler(headCell.id)}
            >
              <b>{headCell.label}</b>
              {orderBy === headCell.id ?
                <span className={classes.visuallyHidden}>
                  {order === "desc" ? "sorted descending" : "sorted ascending"}
                </span>
                : null
              }
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

ManageUsersHead.propTypes = {
  classes: PropTypes.object.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(["asc", "desc"]).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

const useToolbarStyles = makeStyles((theme) => ({
  toolbar: {
    display: "auto",
    justifyContent: "flex-start",
    padding: "15px",
  },
}));

const ManageUsersToolbar = (props) => {
  const classes = useToolbarStyles();
  const { role, deleteClass } = props;

  if(role === "Student"){
    return(
      <Toolbar className={classes.toolbar}>
        <Typography variant="h4">
          <b>Daftar Siswa</b>
        </Typography>
      </Toolbar>
    );
  }
  else if(role === "Teacher"){
    return(
      <Toolbar className={classes.toolbar}>
        <Typography variant="h4">
          <b>Daftar Guru</b>
        </Typography>
      </Toolbar>
    );
  }
};

const useStyles = makeStyles((theme) => ({
  root: {
    margin: "auto",
    maxWidth: "1000px",
    padding: "10px",
  },
  tableDeleteIcon: {
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
  paper: {
    width: "100%",
    marginBottom: theme.spacing(2),
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
  tableRow: {
    "&:focus, &:hover": {
      backgroundColor: theme.palette.button.main,
      cursor: "pointer",
    },
  },
}));

function ManageUsers(props) {
  document.title = "Schooly | Daftar Kelas"
  const classes = useStyles();
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("homeroomTeacher");
  const [selected, setSelected] = React.useState([]);

  const [openDeleteDialog, setOpenDeleteDialog] = React.useState(null);
  const [selectedClassId, setSelectedClassId] = React.useState(null)
  const [selectedClassName, setSelectedClassName] = React.useState(null);

  const { deleteClass, getTeachers, getStudents, classesCollection } = props;
  const { user, all_students, all_teachers } = props.auth;

  const taskRowItem = (data) => {
    rows.push(
      createData(data._id, data.name,
        data.email,
        data.phone,
        data.tanggal_lahir,
        [
        <LightToolTip title="Hapus Akun">
          <IconButton
            size="small"
            onClick={(e) =>{
              handleOpenDeleteDialog(e, data._id, data.name)}}>
            <DeleteIcon className={classes.tableDeleteIcon} />
          </IconButton>
        </LightToolTip>
        ]
      )
    )
  }
  React.useEffect(() => {
    getStudents() 
    getTeachers()
  }, [all_students.length, all_teachers.length])

  const retrieveStudents = () => {
    if(all_students.length > 0) {
      rows = []
      all_students.map((data) => {
        taskRowItem(data)
      })
    }
  }

  // const retrieveTeachers = () => {
  //   if(all_teachers.length > 0) {
  //     rows
  //   }
  // }

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
  retrieveStudents()

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

  if(user.tanggal_lahir === "Student") {
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
      <Paper className={classes.paper}>
        <ManageUsersToolbar role="Student" deleteClass={deleteClass}/>
        <TableContainer>
          <Table>
            <ManageUsersHead
              classes={classes}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={(event, target) => {handleSelectAllClick(event,target)}}
              onRequestSort={handleRequestSort}
              rowCount={rows ?
              rows.length : 0}
            />
            <TableBody>
              {stableSort(rows, getComparator(order, orderBy))
                .map((row, index) => {
                  const isItemSelected = isSelected(row._id);
                  const labelId = `enhanced-table-checkbox-${index}`;
                  let viewpage = `/kelas/${row._id}`
                  return(
                    <TableRow
                      className={classes.tableRow}
                      onClick={() => window.location.href = viewpage}
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={row.name}
                      selected={isItemSelected}
                    >
                      <TableCell component="th" id={labelId} scope="row" padding="none" align="center">
                        {row.name}
                      </TableCell>
                      <TableCell align="center">{row.email}</TableCell>
                      <TableCell align="center">{row.phone}</TableCell>
                      <TableCell align="center">{moment(row.tanggal_lahir).locale("id").format("DD/MMM/YYYY")}</TableCell>
                      <TableCell align="center">{row.action}</TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </div>
  )
};

ManageUsers.propTypes = {
  classesCollection: PropTypes.object.isRequired,
  getStudents: PropTypes.func.isRequired,
  getTeachers: PropTypes.func.isRequired,
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
  mapStateToProps, {getStudents, getTeachers }
) (ManageUsers);
