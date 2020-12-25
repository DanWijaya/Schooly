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
import { Divider, ExpansionPanel, ExpansionPanelDetails, ExpansionPanelSummary,
   Fab, Grid, Hidden, IconButton, InputAdornment, Paper, Menu, MenuItem, Snackbar, TextField, TableSortLabel, Typography, Dialog} from "@material-ui/core/";
import { makeStyles } from "@material-ui/core/styles";
import AssignmentIcon from "@material-ui/icons/Assignment";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import PageviewIcon from "@material-ui/icons/Pageview";
import SortIcon from "@material-ui/icons/Sort";
import LinkIcon from '@material-ui/icons/Link';
import MuiAlert from "@material-ui/lab/Alert";
import { GoSearch } from "react-icons/go";
import ClearIcon from '@material-ui/icons/Clear';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { BsClipboardData } from "react-icons/bs";

// import { Dropbox } from 'dropbox';
  // Parses the url and gets the access token if it is in the urls hash

function createData(_id, assessmenttitle, subject, start_date, end_date, class_assigned, type) {
  return { _id, assessmenttitle, subject, start_date, end_date, class_assigned, type };
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

// ANCHOR stablesort function
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
  const { classes, order, orderBy, onRequestSort,
    role, searchFilter, updateSearchFilter,
    setSearchBarFocus, searchBarFocus} = props;

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

  // FOR SEARCH FILTER.
  const onChange = (e) => {
    updateSearchFilter(e.target.value)
  }

  const onClear = (e, id) => {
    updateSearchFilter("");
    document.getElementById(id).focus();
  }

  return (
    // <div className={classes.toolbar}>
    <div className={classes.toolbar}>
      <div style={{display: "flex", alignItems: "center"}}>
        <Hidden smUp implementation="css">
          {searchBarFocus ?
            null
            :
            <div style={{display: "flex", flexDirection: "row", alignItems: "center"}}>
              <BsClipboardData className={classes.titleIcon} fontSize="large"/>
              <Typography variant="h4">
                Daftar Ujian
              </Typography>
            </div>
          }
        </Hidden>
        <Hidden xsDown implementation="css">
          <div style={{display: "flex", flexDirection: "row", alignItems: "center"}}>
            <BsClipboardData className={classes.titleIcon} fontSize="large"/>
            <Typography variant="h4">
              Daftar Ujian
            </Typography>
          </div>
        </Hidden>
        <Hidden smUp implementation="css">
          {searchBarFocus ?
          <div style={{display: "flex"}}>
            <IconButton
            onClick={() => {
            setSearchBarFocus(false)
            updateSearchFilter("")}}>
              <ArrowBackIcon/>
            </IconButton>
            <TextField
                  fullWidth
                  variant="outlined"
                  id="searchFilterMobile"
                  value={searchFilter}
                  onChange={onChange}
                  autoFocus
                  onClick={(e) =>setSearchBarFocus(true)}
                  placeholder="Search Ujian"
                  // onBlur={() => setSearchBarFocus(false)}
                  style={{
                    maxWidth: "200px",
                    marginLeft: "10px"
                  }}
                  InputProps={{
                    startAdornment:(
                      searchBarFocus ? null :
                        <InputAdornment position="start" style={{marginLeft: "-5px", marginRight: "-5px"}}>
                          <IconButton size="small">
                            <GoSearch/>
                          </IconButton>
                        </InputAdornment>)
                      ,
                      endAdornment:(
                      <InputAdornment position="end" style={{marginLeft: "-10px", marginRight: "-10px"}}>
                        <IconButton
                          size="small"
                          id="searchFilterMobile"
                          onClick={(e) => {
                            e.stopPropagation()
                            onClear(e, "searchFilterMobile")}
                          }
                          style={{
                            opacity: 0.5,
                            visibility: !searchFilter ? "hidden" : "visible"
                          }}>
                          <ClearIcon/>
                        </IconButton>
                      </InputAdornment>
                    ),
                    style:{
                      borderRadius: "20px"
                    }
                  }}
                />
              </div>
              :
            // <div style={{display: "flex"}}>
            <LightTooltip title="Search" style={{marginLeft: "10px"}}>
              <IconButton  className={classes.goSearchButton} onClick={() => setSearchBarFocus(true)}>
                <GoSearch className={classes.goSearchIconMobile} />
              </IconButton>
            </LightTooltip>
          // </div>
          }
        </Hidden>
      </div>
      <div style={{display: "flex"}}>
      <Hidden xsDown implementation="css">
            <TextField
              // fullWidth
              variant="outlined"
              id="searchFilterDesktop"
              value={searchFilter}
              onChange={onChange}
              onClick={() => setSearchBarFocus(true)}
              onBlur={() => setSearchBarFocus(false)}
              placeholder="Search Ujian"
              // onBlur={() => setSearchBarFocus(false)}
              style={{
                maxWidth: "250px",
                marginRight: "10px"
              }}
              InputProps={{
                startAdornment:(
                    <InputAdornment position="start" style={{marginLeft: "-5px", marginRight: "-5px"}}>
                      <IconButton size="small">
                        <GoSearch/>
                      </IconButton>
                    </InputAdornment>)
                  ,
                  endAdornment:(
                  <InputAdornment position="end" style={{marginLeft: "-10px", marginRight: "-10px"}}>
                    <IconButton
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation()
                        onClear(e, "searchFilterDesktop")}
                      }
                      style={{
                        opacity: 0.5,
                        visibility: !searchFilter ? "hidden" : "visible"
                      }}>
                      <ClearIcon/>
                    </IconButton>
                  </InputAdornment>
                ),
                style:{
                  borderRadius: "20px"
                }
              }}
            />
        </Hidden>
        <Hidden smUp implementation="css">
          {role === "Student"?
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
          {role === "Student"?
            null
          :
          // ANCHOR contoh tombol round edge
            <Link to="/kuis">
              <Fab size="medium" variant="extended" className={classes.newAssessmentButton}>
                <AssignmentIcon className={classes.newAssessmentIconDesktop} />
                Buat Ujian
              </Fab>
            </Link>
          }
        </Hidden>
          <LightTooltip title="Urutkan Ujian">
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
  toolbarDesktopFocused: {
    // display: "flex",
    // justifyContent: "flex-end",

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
  goSearchButton: {
    marginRight: "10px",
    backgroundColor: theme.palette.action.selected,
    color: "black",
    "&:focus, &:hover": {
      backgroundColor: theme.palette.divider,
      color: "black",
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
  goSearchIconMobile: {
    width: theme.spacing(2.5),
    height: theme.spacing(2.5),
  }
  ,
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
  copyToClipboardButton: {
    backgroundColor: "#974994",
    color: "white",
    "&:focus, &:hover": {
      backgroundColor: "white",
      color: "#974994"
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
      cursor: "pointer",
      backgroundColor: theme.palette.button.main,
    },
  },
  titleIcon: {
    fontSize: "28px",
    backgroundColor: "white",
    color: theme.palette.primary.main,
    marginRight: "10px"
  }
}));


function AssessmentList(props) {
  const classes = useStyles();
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("subject");
  const [openDeleteDialog, setOpenDeleteDialog] = React.useState(null);
  const [selectedAssessmentId, setSelectedAssessmentId] = React.useState(null);
  const [selectedAssessmentName, setSelectedAssessmentName] = React.useState(null);
  const [copySnackbarOpen, setOpenCopySnackBar] = React.useState(null);
  const [searchFilter, updateSearchFilter] = React.useState("");
  const [searchBarFocus, setSearchBarFocus] = React.useState(false);

  const [type, setAssessmentType] = React.useState(null)
  const { getAllAssessments, deleteAssessment, getAllClass, getAllSubjects } = props;
  const { all_assessments } = props.assessmentsCollection
  const { all_classes_map } = props.classesCollection;
  const { all_subjects_map} = props.subjectsCollection;
  const { user } = props.auth;
  // Fitur 2 -- Dialog
  const [openDialog, setOpenDialog] = React.useState(false);
  const [currentDialogInfo, setCurrentDialogInfo] = React.useState({})

  const handleOpenDialog = (title, subject, start_date, end_date) => {
    setCurrentDialogInfo({title, subject, start_date, end_date})
    setOpenDialog(true)
    console.log(title)
  }

  const handleCloseDialog = () => {
    setOpenDialog(false)
  }

  // ANCHOR rows
  var rows = [];
  const assessmentRowItem = (data) => {
    if(data.type === "Ujian"){
        rows.push(
            createData(
                data._id,
                data.name,
                data.subject,
                data.start_date,
                data.end_date,
                data.class_assigned,
                data.type
            )
        )
    }
  }

  React.useEffect(() => {
    getAllAssessments()
    getAllClass("map")
    getAllSubjects("map")
  },
  // eslint-disable-next-line react-hooks/exhaustive-deps
  [])

  const retrieveAssessments = () => {
    // If all_assessments is not undefined or an empty array
    if (all_assessments.length) {
      rows = []
      if (user.role === "Teacher") {
      all_assessments.filter(item => item.name.toLowerCase().includes(searchFilter.toLowerCase()))
      .forEach((data) => {
        if (data.author_id === user.id) {
          assessmentRowItem(data)
          }
        return null;
        })
      }
      else if (user.role === "Student") {
        all_assessments.filter(item => item.name.toLowerCase().includes(searchFilter.toLowerCase()))
        .forEach((data) => {
          let class_assigned = data.class_assigned;
          if (class_assigned.indexOf(user.kelas) !== -1 && data.posted){
            assessmentRowItem(data)
          }
          return null
        })
      }
      else { //Admin
        all_assessments.filter(item => item.name.toLowerCase().includes(searchFilter.toLowerCase()))
        .forEach(data =>  assessmentRowItem(data))
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

  const handleOpenCopySnackBar = (type) => {
    console.log("Open di RUN")
    setOpenCopySnackBar(true);
    setAssessmentType(type)
  }

  const handleCloseCopySnackBar = () => {
    console.log("Close di RUN")
    setOpenCopySnackBar(false);
  }

  const copyToClipboardButton = (e, linkToShare, type) => {
    e.stopPropagation()
    let textArea = document.createElement("textarea");
    textArea.value = linkToShare;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    e.target.focus();
    document.body.removeChild(textArea);
    handleOpenCopySnackBar(type)
  }

  document.title = "Schooly | Daftar Kuis";
  return (
    <div className={classes.root}>
      {/* Ini Delete Dialog yang untuk delete Item yang udah ada */}
      <DeleteDialog
        openDeleteDialog={openDeleteDialog}
        handleCloseDeleteDialog={handleCloseDeleteDialog}
        itemType="Kuis"
        itemName={selectedAssessmentName}
        deleteItem={() => { onDeleteAssessment(selectedAssessmentId) }}
      />
      <Dialog
        fullScreen={false}
        open={openDialog}
        onClose={handleCloseDialog}
        fullWidth={true}
        maxWidth="sm"
       >
         <div style={{padding: "20px"}}>
            <Typography variant="h4" align="center">{currentDialogInfo.title}</Typography>
            <Typography variant="h5" align="center" color="primary">
              {currentDialogInfo.subject}
            </Typography>
            <Typography variant="subtitle1" align="center" style={{marginTop: "25px"}}>Mulai : {currentDialogInfo.start_date}</Typography>
            <Typography variant="subtitle1" align="center">Selesai : {currentDialogInfo.end_date}</Typography>
            <Typography variant="subtitle2" align="center" color="textSecondary" style={{marginTop: "10px", textAlign: "center"}}>
              Link Untuk Kuis atau Ulangan Anda akan Diberikan Oleh Guru Mata Pelajaran Terkait
            </Typography>
        </div>
      </Dialog>
      <AssessmentListToolbar
        role={user.role}
        deleteAssessment={deleteAssessment}
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
      {/* REVIEW stablesort element*/}
      {stableSort(rows, getComparator(order, orderBy))
        .map((row, index) => {
          const labelId = `enhanced-table-checkbox-${index}`;
          let viewpage = user.role === "Student" ? `/kuis-murid/${row._id}` : `/kuis-guru/${row._id}`
          let linkToShare = `http://localhost:3000/kuis-murid/${row._id}`;
          return (
            <Grid item>
              {user.role === "Teacher" ?
                <ExpansionPanel
                  button
                  variant="outlined">
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
                          <LightTooltip title="Copy Link">
                            <IconButton
                              size="small"
                              className={classes.copyToClipboardButton}
                              onClick={(e) => {copyToClipboardButton(e, linkToShare, row.type)}}>
                              <LinkIcon fontSize="small"/>
                            </IconButton>
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
                           Waktu Mulai: {moment(row.start_date).locale("id").format("DD MMM YYYY, HH.mm")}
                        </Typography>
                      </Grid>
                      <Grid item>
                        <Typography variant="body2" className={classes.endDateWarningText}>
                           Batas Waktu: {moment(row.end_date).locale("id").format("DD MMM YYYY, HH.mm")}
                        </Typography>
                      </Grid>
                    </Grid>
                  </ExpansionPanelDetails>
                </ExpansionPanel>
              :
                <Paper
                  button component="a"
                  variant="outlined"
                  className={classes.assessmentPaper}
                  onClick={() => handleOpenDialog(row.assessmenttitle, all_subjects_map.get(row.subject), moment(row.start_date).locale("id").format("DD MMM YYYY, HH.mm"), moment(row.end_date).locale("id").format("DD MMM YYYY, HH.mm"))}
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
                        {moment(row.end_date).locale("id").format("DD MMM YYYY, HH.mm")}
                      </Typography>
                    </Hidden>
                    <Hidden xsDown implementation="css">
                      <Typography variant="body2" align="right" className={classes.endDateWarningText}>
                        Batas Waktu: {moment(row.end_date).locale("id").format("DD MMM YYYY, HH.mm")}
                      </Typography>
                    </Hidden>
                  </div>
                </Paper>
              }
            </Grid>
          );
        })}
      </Grid>
      {/* </div> */}
      <Snackbar open={copySnackbarOpen} autoHideDuration={3000} onClose={handleCloseCopySnackBar}>
        <MuiAlert onClose={handleCloseCopySnackBar} severity="success">
          Link {type} berhasil disalin ke Clipboard Anda!
        </MuiAlert>
      </Snackbar>
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