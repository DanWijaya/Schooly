import React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import moment from "moment";
import "moment/locale/id";
import { getAllAssessments, deleteAssessment  } from "../../../actions/AssessmentActions";
import { getAllClass } from "../../../actions/ClassActions";
import { getAllSubjects } from "../../../actions/SubjectActions";
import DeleteDialog from "../../misc/dialog/DeleteDialog";
import LightTooltip from "../../misc/light-tooltip/LightTooltip";
import { Button, IconButton, Dialog, Divider, ExpansionPanel, ExpansionPanelDetails, ExpansionPanelSummary,
   Fab, Grid, Hidden, Paper, Menu, MenuItem, TableSortLabel, Typography } from "@material-ui/core/";
import { makeStyles } from "@material-ui/core/styles";
import AssignmentIcon from "@material-ui/icons/Assignment";
import CancelIcon from "@material-ui/icons/Cancel";
import CloseIcon from "@material-ui/icons/Close";
import DeleteIcon from "@material-ui/icons/Delete";
import DeleteOutlineIcon from "@material-ui/icons/DeleteOutline";
import EditIcon from "@material-ui/icons/Edit";
import PageviewIcon from "@material-ui/icons/Pageview";
import SortIcon from "@material-ui/icons/Sort";

// import { Dropbox } from 'dropbox';
  // Parses the url and gets the access token if it is in the urls hash

function createData(_id, assessmenttitle, subject, start_date, end_date, class_assigned) {
  return { _id, assessmenttitle, subject, start_date, end_date, class_assigned };
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

function AssessmentListToolbar(props) {
  const { classes, order, orderBy, onRequestSort, role } = props;

  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  const headCells = [
    { id: "assessmenttitle", numeric: false, disablePadding: true, label: "Nama Ujian/Kuis" },
    { id: "subject", numeric: false, disablePadding: false, label: "Mata Pelajaran" },
    { id: "start_date", numeric: false, disablePadding: false, label: "Mulai Waktu" },
    { id: "end_date", numeric: false, disablePadding: false, label: "Batas Waktu" },
    { id: "class_assigned", numeric: false, disablePadding: false, label: "Ditugaskan Pada" },
  ];

  if (role === "Student") {
    // Don't include the class_assigned basically.
    headCells.pop()
  }

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
        Daftar Kuis
      </Typography>
      <div style={{display: "flex", alignItems: "center"}}>
        <Hidden smUp implementation="css">
          {role === "Student" ?
            null
          :
            <LightTooltip title="Buat Kuis">
              <Link to="/kuis">
                <Fab size="small" className={classes.newAssessmentButton}>
                  <AssignmentIcon className={classes.newAssessmentIconMobile} />
                </Fab>
              </Link>
            </LightTooltip>
          }
        </Hidden>
        <Hidden xsDown implementation="css">
          {role === "Student" ?
            null
          :
            <Link to="/kuis">
              <Fab size="medium" variant="extended" className={classes.newAssessmentButton}>
                <AssignmentIcon className={classes.newAssessmentIconDesktop} />
                Buat Kuis
              </Fab>
            </Link>
          }
        </Hidden>
        <LightTooltip title="Urutkan Kuis">
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

AssessmentListToolbar.propTypes = {
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
  newAssessmentButton: {
    marginRight: "10px",
    backgroundColor: theme.palette.create.main,
    color: "white",
    "&:focus, &:hover": {
      backgroundColor: theme.palette.create.main,
      color: "white",
    },
  },
  newAssessmentIconDesktop: {
    width: theme.spacing(3),
    height: theme.spacing(3),
    marginRight: "7.5px",
  },
  newAssessmentIconMobile: {
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
  endDateWarningText: {
    color: theme.palette.warning.main,
  },
  startDateText: {
    color: theme.palette.primary.main,
  },
  viewAssessmentButton: {
    backgroundColor: theme.palette.warning.main,
    color: "white",
    "&:focus, &:hover": {
      backgroundColor: "white",
      color: theme.palette.warning.main,
    },
  },
  editAssessmentButton: {
    backgroundColor: theme.palette.primary.main,
    color: "white",
    "&:focus, &:hover": {
      backgroundColor: "white",
      color: theme.palette.primary.main,
    },
  },
  deleteAssessmentButton: {
    backgroundColor: theme.palette.error.dark,
    color: "white",
    "&:focus, &:hover": {
      backgroundColor: "white",
      color: theme.palette.error.dark,
    },
  },
  dialogBox: {
    maxWidth: "350px",
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
  assessmentPanelDivider: {
    backgroundColor: theme.palette.primary.main,
  },
  assessmentPanelSummary: {
    "&:hover": {
      backgroundColor: theme.palette.button.main,
    },
  },
  assessmentPaper: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "15px",
    "&:focus, &:hover": {
      backgroundColor: theme.palette.button.main,
    },
  },
}));


function AssessmentList(props) {
  const classes = useStyles();
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("subject");
  const [openDeleteDialog, setOpenDeleteDialog] = React.useState(null);
  const [selectedAssessmentId, setSelectedAssessmentId] = React.useState(null);
  const [selectedAssessmentName, setSelectedAssessmentName] = React.useState(null);
  const { getAllAssessments, deleteAssessment, getAllClass, getAllSubjects } = props;
  const { all_assessments } = props.assessmentsCollection
  const { all_classes_map } = props.classesCollection;
  const { all_subjects_map} = props.subjectsCollection;
  const { user } = props.auth;

  var rows = [];
  const assessmentRowItem = (data) => {
    console.log("HDJSKDJSK")
    rows.push(
      createData(
        data._id,
        data.name,
        data.subject,
        data.start_date,
        data.end_date,
        data.class_assigned,
      )
    )
  }

  React.useEffect(() => {
    getAllAssessments()
    getAllClass("map")
    getAllSubjects("map")
  },
  // eslint-disable-next-line react-hooks/exhaustive-deps
  [])

  console.log(all_assessments)
  const retrieveAssessments = () => {
    // If all_assessments is not undefined or an empty array
    if (all_assessments.length) {
      rows = []
      if (user.role === "Teacher") {
      all_assessments.forEach((data) => {
        if (data.author_id === user.id) {
          return assessmentRowItem(data)
          }
        return null;
        })
      }
      else if (user.role === "Student") {
        let currentDate = new Date();
        all_assessments.forEach((data) => {
          console.log(data.name)
          let class_assigned = data.class_assigned;
          if (class_assigned.indexOf(user.kelas) !== -1){
            console.log(new Date(data.start_date))
            console.log(new Date(data.end_date))
            console.log(currentDate)
            if(new Date(data.start_date) <= currentDate && new Date(data.end_date) >= currentDate) {
              return assessmentRowItem(data)
            }
            return null
          }
          return null
        })
      }
      else { //Admin
        all_assessments.forEach(data =>  assessmentRowItem(data))
      }
    }
  }

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  // Call the function to view the Assessments on tablerows.
  // This function is defined above.
  retrieveAssessments()

  const onDeleteAssessment = (id) => {
    deleteAssessment(id)
  }

  // Delete Dialog
  const handleOpenDeleteDialog = (e, id, name) => {
    e.stopPropagation();
    setOpenDeleteDialog(true);
    setSelectedAssessmentId(id)
    setSelectedAssessmentName(name)
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
  };

  document.title = "Schooly | Daftar Kuis";
  return (
    <div className={classes.root}>
      <DeleteDialog
        openDeleteDialog={openDeleteDialog}
        handleCloseDeleteDialog={handleCloseDeleteDialog}
        itemType="Kuis"
        itemName={selectedAssessmentName}
        deleteItem={() => { onDeleteAssessment(selectedAssessmentId) }}
      />
      <AssessmentListToolbar
        role={user.role}
        deleteAssessment={deleteAssessment}
        classes={classes}
        order={order}
        orderBy={orderBy}
        onRequestSort={handleRequestSort}
        rowCount={rows ? rows.length : 0}
      />
      <Divider variant="inset" className={classes.titleDivider} />
      <Grid container direction="column" spacing={2}>
      {stableSort(rows, getComparator(order, orderBy))
        .map((row, index) => {
          const labelId = `enhanced-table-checkbox-${index}`;
          let viewpage = user.role === "Student" ? `/kuis-murid/${row._id}` : `/kuis-guru/${row._id}`
          console.log(row)
          return (
            <Grid item>
              {user.role === "Teacher" ?
                <ExpansionPanel
                  button
                  variant="outlined"
                >
                  <ExpansionPanelSummary className={classes.assessmentPanelSummary}>
                    <Grid container spacing={1} justify="space-between" alignItems="center">
                      <Grid item>
                        <Hidden smUp implementation="css">
                          <Typography variant="subtitle1" id={labelId}>
                            {row.assessmenttitle}
                          </Typography>
                          <Typography variant="caption" color="textSecondary">
                            {all_subjects_map.get(row.subject)}
                          </Typography>
                        </Hidden>
                        <Hidden xsDown implementation="css">
                          <Typography variant="h6" id={labelId}>
                            {row.assessmenttitle}
                          </Typography>
                          <Typography variant="body2" color="textSecondary">
                            {all_subjects_map.get(row.subject)}
                          </Typography>
                        </Hidden>
                      </Grid>
                      <Grid item xs container spacing={1} justify="flex-end">
                        <Grid item>
                          <LightTooltip title="Lihat Lebih Lanjut">
                            <Link to={viewpage}>
                              <IconButton
                                size="small"
                                className={classes.viewAssessmentButton}
                              >
                                <PageviewIcon fontSize="small" />
                              </IconButton>
                            </Link>
                          </LightTooltip>
                        </Grid>
                        <Grid item>
                          <LightTooltip title="Sunting">
                            <Link to={`/sunting-kuis/${row._id}`}>
                              <IconButton
                                size="small"
                                className={classes.editAssessmentButton}
                              >
                                <EditIcon fontSize="small" />
                              </IconButton>
                            </Link>
                          </LightTooltip>
                        </Grid>
                        <Grid item>
                          <LightTooltip title="Hapus">
                            <IconButton
                              size="small"
                              className={classes.deleteAssessmentButton}
                              onClick={(e) =>{handleOpenDeleteDialog(e, row._id, row.assessmenttitle)}}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </LightTooltip>
                        </Grid>
                      </Grid>
                    </Grid>
                  </ExpansionPanelSummary>
                  <Divider className={classes.assessmentPanelDivider} />
                  <ExpansionPanelDetails>
                    <Grid conntainer direction="column">
                      <Grid item>
                        <Typography variant="body1" gutterBottom>
                          <b>Kelas yang Ditugaskan:</b> {!all_classes_map.size  ? null :
                           row.class_assigned.map((id,i) => {

                            if(all_classes_map.get(id)){
                              if (i === row.class_assigned.length - 1)
                                return (`${all_classes_map.get(id).name}`)
                              return (`${all_classes_map.get(id).name}, `)
                            }
                            return null
                           })
                          }
                        </Typography>
                      </Grid>
                      <Grid item>
                        <Typography variant="body2" className={classes.startDateText}>
                           Waktu Mulai: {moment(row.start_date).locale("id").format("DD/MMM/YYYY - HH:mm")}
                        </Typography>
                      </Grid>
                      <Grid item>
                        <Typography variant="body2" className={classes.endDateWarningText}>
                           Batas Waktu: {moment(row.end_date).locale("id").format("DD/MMM/YYYY - HH:mm")}
                        </Typography>
                      </Grid>
                    </Grid>
                  </ExpansionPanelDetails>
                </ExpansionPanel>
              :
              <Link to={viewpage}>
                <Paper
                  button component="a"
                  variant="outlined"
                  className={classes.assessmentPaper}
                >
                  <div>
                    <Typography variant="h6" id={labelId}>
                      {row.assessmenttitle}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {all_subjects_map.get(row.subject)}
                    </Typography>
                  </div>
                  <div>
                    <Hidden smUp implementation="css">
                      <Typography variant="body2" align="right" className={classes.endDateWarningText}>
                        Batas Waktu:
                      </Typography>
                      <Typography variant="caption" align="right" className={classes.endDateWarningText}>
                        {moment(row.end_date).locale("id").format("DD/MMM/YYYY - HH:mm")}
                      </Typography>
                    </Hidden>
                    <Hidden xsDown implementation="css">
                      <Typography variant="body2" align="right" className={classes.endDateWarningText}>
                        Batas Waktu: {moment(row.end_date).locale("id").format("DD/MMM/YYYY - HH:mm")}
                      </Typography>
                    </Hidden>
                  </div>
                </Paper>
                </Link>
              }
            </Grid>
          );
        })}
      </Grid>
    </div>
  );
}

AssessmentList.propTypes = {
  getAllAssessments: PropTypes.func.isRequired,
  getAllClass: PropTypes.func.isRequired,
  deleteAssessment: PropTypes.func.isRequired,
  assessmentsCollection: PropTypes.object.isRequired,
  subjectsCollection: PropTypes.object.isRequired,
  classesCollection: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
}

const mapStateToProps = (state) => ({
  errors: state.errors,
  auth: state.auth,
  assessmentsCollection: state.assessmentsCollection,
  subjectsCollection: state.subjectsCollection,
  classesCollection: state.classesCollection
})

export default connect(
  mapStateToProps, { getAllAssessments, deleteAssessment, getAllClass, getAllSubjects}
)(AssessmentList);
