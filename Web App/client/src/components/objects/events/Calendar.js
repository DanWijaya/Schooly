import React from "react";
import "./Calendar.css"
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import lokal from "date-fns/locale/id";
import DateFnsUtils from "@date-io/date-fns";
import { Calendar as ReactCalendar } from "react-calendar";
import {
  Button,
  IconButton,
  Fab,
  Grid,
  Hidden,
  Typography,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Paper,
  Divider,
  Badge,
  Dialog,
  TextField,
  Menu,
  Select,
  MenuItem,
  FormHelperText,
  FormControl,
  InputLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Checkbox,
  FormControlLabel,
  FormGroup
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Select,
  FormHelperText
} from "@material-ui/core/";
import {
  MuiPickersUtilsProvider,
  KeyboardDateTimePicker,
} from "@material-ui/pickers";
import { makeStyles } from "@material-ui/core/styles";
import LightTooltip from "../../misc/light-tooltip/LightTooltip";
import AddIcon from "@material-ui/icons/Add";
// FIXME ICONS 
import EventNoteIcon from '@material-ui/icons/EventNote';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import TimerIcon from '@material-ui/icons/Timer';
import TimerOffIcon from '@material-ui/icons/TimerOff';
import SupervisorAccountIcon from '@material-ui/icons/SupervisorAccount';
import SubjectIcon from '@material-ui/icons/Subject';
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import PageviewIcon from "@material-ui/icons/Pageview";
import LibraryBooksIcon from "@material-ui/icons/LibraryBooks";
import WarningIcon from "@material-ui/icons/Warning";
import AssignmentIcon from "@material-ui/icons/Assignment";
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import SearchIcon from '@material-ui/icons/Search';
import AddIcon from '@material-ui/icons/Add';
import { FaClipboardList } from "react-icons/fa";
import { BsClipboardData } from "react-icons/bs";
import {
  getAllEvents,
  deleteEvent
} from "../../../actions/EventActions";
import { getAllSubjects } from "../../../actions/SubjectActions";
import { getStudents, getStudentsByClass, getTeachers } from "../../../actions/UserActions";
import { getTasks, getAllTask } from "../../../actions/TaskActions";
import {
  getAssessments,
  getAllAssessments,
} from "../../../actions/AssessmentActions";
import { getAllTaskFilesByUser } from "../../../actions/UploadActions";
import moment from "moment";
import ErrorIcon from "@material-ui/icons/Error";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import Draggable from 'react-draggable';

const useStyles = makeStyles((theme) => ({
  root: {
    margin: "auto",
    maxWidth: "80%",
    [theme.breakpoints.down("md")]: {
      maxWidth: "100%"
    },
    padding: "10px",
    display: "flex",
    flexDirection: "row"
  },
  newEventButton: {
    marginRight: "10px",
    backgroundColor: theme.palette.success.main,
    color: "white",
    "&:focus, &:hover": {
      backgroundColor: theme.palette.success.main,
      color: "white"
    },
  },
  newEventIconDesktop: {
    width: theme.spacing(3),
    height: theme.spacing(3),
    marginRight: "7.5px",
  },
  newEventIconMobile: {
    width: theme.spacing(3),
    height: theme.spacing(3),
  },
  viewEventButton: {
    backgroundColor: theme.palette.warning.main,
    color: "white",
    "&:focus, &:hover": {
      backgroundColor: "white",
      color: theme.palette.warning.main,
    },
  },
  editEventButton: {
    backgroundColor: theme.palette.primary.main,
    color: "white",
    "&:focus, &:hover": {
      backgroundColor: "white",
      color: theme.palette.primary.main,
    },
  },
  deleteEventButton: {
    backgroundColor: theme.palette.error.dark,
    color: "white",
    "&:focus, &:hover": {
      backgroundColor: "white",
      color: theme.palette.error.dark,
    },
  },
  agendaContainer: {
    width: "80%",
    marginRight: "15px"
  },
  calendarContainer: {
    marginLeft: "15px",
    width: "20%"
  },
  calendar: {
    border: "none",
  },
  todayTile: {
    textAlign: "center!important",
    borderRadius: "100%",
    background: "#195DE5",
    color: "white",
    maxWidth: "12%!important",
    margin: ".5% 1.14285%!important",
    padding: "3% 0%",
    "&:focus, &:hover, &:active": {
      background: "#195DE5",
      backgroundColor: "#195DE5",
      color: "white",
      opacity: 0.8
    },
  },
  activeTile: {
    textAlign: "center!important",
    maxWidth: "12%!important",
    margin: ".5% 1.14285%!important",
    padding: "3% 0%",
    "&:active": {
      background: "#C9DCFD",
      opacity: 0.8
    },
  },
  calendarTile: {
    borderRadius: "100%",
    backgroundColor: theme.palette.primary.light
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
  titleIcon: {
    fontSize: "28px",
    backgroundColor: "white",
    color: theme.palette.primary.main,
    marginRight: "10px",
  },
  listItem: {
    padding: "6px 16px"
  },
  errorIcon: {
    color: theme.palette.error.main,
  },
  warningIcon: {
    color: theme.palette.warning.main,
  },
  checkIcon: {
    color: theme.palette.success.main,
  },
  listIcon: {
    backgroundColor: theme.palette.primary.main,
  },
  blueChip: {
    backgroundColor: theme.palette.primary.main,
    height: "15px",
    position: "absolute", 
    transform: "translateY(10.5px)",
    borderRadius: "3px",
    maxWidth: "44%"
  },
  greenFab: {
    backgroundColor: theme.palette.success.main,
    color: "white",
    "&:focus, &:hover": {
      backgroundColor: theme.palette.success.dark,
    },
  createEventButton: {
    backgroundColor: theme.palette.success.main,
    color: "white",
    "&:focus, &:hover": {
      backgroundColor: theme.palette.success.main,
      color: "white",
    }
  }, 
  formIcons: {
    width: "1rem",
    height: "1rem",
    marginRight: "7.5px",
    color: theme.palette.text.secondary
  },
  formLabels: {
    display: "flex",
    alignItems:"center"
  }
}));
// FIXME STYLE

function CalendarListToolbar(props) {
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
    role,
    type
  } = props;

  let toolbarTitle = "";
  let toolbarIcon = null;

  if(type === "Event") {
    toolbarTitle = "Daftar Kegiatan";
    toolbarIcon = <EventNoteIcon className={classes.titleIcon} fontSize="large" />;
  }
  else if(type === "Task") {
    toolbarTitle = "Daftar Tugas";
    toolbarIcon = <AssignmentIcon className={classes.titleIcon} fontSize="large" />;
  }
  else if(type === "Quiz") {
    toolbarTitle = "Daftar Kuis";
    toolbarIcon = <FaClipboardList className={classes.titleIcon} fontSize="large" />;
  }
  else {
    toolbarTitle = "Daftar Ujian";
    toolbarIcon = <BsClipboardData className={classes.titleIcon} fontSize="large" />;
  }

  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  // const headCells = [
  //   {
  //     id: "name",
  //     numeric: false,
  //     disablePadding: false,
  //     label: "Mata Pelajaran",
  //   },
  // ];

  // // Sort Menu
  // const [anchorEl, setAnchorEl] = React.useState(null);
  // const handleOpenSortMenu = (event) => {
  //   setAnchorEl(event.currentTarget);
  // };
  // const handleCloseSortMenu = () => {
  //   setAnchorEl(null);
  // };

  // const onChange = (e) => {
  //   updateSearchFilter(e.target.value);
  // };

  // const onClear = (e, id) => {
  //   updateSearchFilter("");
  //   document.getElementById(id).focus();
  // };

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
              {toolbarIcon}
              <Typography variant="h4">{toolbarTitle}</Typography>
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
            {toolbarIcon}
            <Typography variant="h4">{toolbarTitle}</Typography>
          </div>
        </Hidden>
        {/* <Hidden mdUp implementation="css">
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
        </Hidden> */}
      </div>
      <div style={{ display: "flex", alignItems: "center" }}>
        {/* <Hidden smDown implementation="css">
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
        </Hidden> */}
        <Hidden mdUp implementation="css">
          {role !== "Admin" ? null : (
            <LightTooltip title="Buat Kegiatan">
              <Link to="/buat-kegiatan">
                <Fab size="small" className={classes.newEventButton} onClick={handleOpenCreateDialog}>
                  <EventNoteIcon className={classes.newEventIconMobile} />
                </Fab>
              </Link>
            </LightTooltip>
          )}
        </Hidden>
        <Hidden smDown implementation="css">
          {role !== "Admin" ? null : (
            <Link to="/buat-kegiatan">
              <Fab
                size="medium"
                variant="extended"
                className={classes.newEventButton}
                onClick={handleOpenCreateDialog}
              >
                <EventNoteIcon className={classes.newEventIconDesktop} />
                Buat Kegiatan
            </Fab>
            </Link>
          )}
        </Hidden>
        {/* <LightTooltip title="Urutkan Mata Pelajaran">
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
        </Menu> */}
      </div>
    </div>
  );
}

function AgendaToolbar(props) {
  const {
    classes,
    mode,
    handleChangeMode,
    handleOpenCreateDialog
  } = props;

  return (
    <div className={classes.toolbar}>
      <div style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
        <Button variant="outlined">Hari ini</Button>
        <ChevronLeftIcon/>
        <ChevronRightIcon/>
        <Typography>Juni 4, 2021</Typography>
      </div>
      <div style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
        <Fab className={classes.greenFab} aria-label="add" size="small" onClick={handleOpenCreateDialog}>
          <AddIcon fontSize="small"/>
        </Fab>
        <IconButton>
          <SearchIcon/>
        </IconButton>
        <FormControl variant="outlined">
          <Select
            defaultValue="Day"
            value={mode}
            onChange={handleChangeMode}
          >
            <MenuItem value="Day">
              Hari
            </MenuItem>
            <MenuItem value="Week">Minggu</MenuItem>
            <MenuItem value="Month">Bulan</MenuItem>
            <MenuItem value="Year">Tahun</MenuItem>
          </Select>
        </FormControl>
      </div>
    </div>
  );
}

function TaskListItem(props) {
  const { classes } = props;

  return (
    <Grid item>
      <Link to={props.work_link}>
        <Paper variant="outlined" button className={classes.listItemPaper}>
          <Badge
            style={{ display: "flex", flexDirection: "row" }}
            badgeContent={<ErrorIcon className={classes.errorIcon} />}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
          >
            <ListItem button className={classes.listItem}>
              <Hidden xsDown>
                <ListItemAvatar>
                  <Avatar className={classes.listIcon}>
                    <AssignmentIcon />
                  </Avatar>
                </ListItemAvatar>
              </Hidden>
              <ListItemText
                primary={
                  <Typography variant="h6">
                    {props.work_title}
                  </Typography>
                }
                secondary={props.work_sender}
              />
              <ListItemText
                align="right"
                primary={
                  <Typography variant="body2" color="textSecondary">
                    {moment(props.work_dateposted)
                      .locale("id")
                      .format("DD MMM YYYY")}
                  </Typography>
                }
                secondary={
                  <Typography variant="body2" color="textSecondary">
                    {moment(props.work_dateposted).locale("id").format("HH.mm")}
                  </Typography>
                }
              />
            </ListItem>
          </Badge>
        </Paper>
      </Link>
    </Grid>
  );
}

function ListAssessments(props) {
  const {
    category,
    subject,
    type,
    // tab,
    all_assessments,
    classId,
    classes,
    all_subjects_map,
    all_teachers,
    getSelectedDate
  } = props;

  console.log(all_assessments)

  function AssessmentListItem(props) {
    // Dialog Kuis dan Ujian
    const [openDialog, setOpenDialog] = React.useState(false);
    const [currentDialogInfo, setCurrentDialogInfo] = React.useState({});

    const handleOpenDialog = (title, subject, teacher_name, start_date, end_date) => {
      setCurrentDialogInfo({ title, subject, teacher_name, start_date, end_date });
      setOpenDialog(true);
    };

    const handleCloseDialog = () => {
      setOpenDialog(false);
    };

    return (
      <Grid item>
        <Paper
          variant="outlined"
          className={classes.listItemPaper}
          onClick={() =>
            handleOpenDialog(
              props.work_title,
              props.work_subject,
              props.work_teacher_name,
              props.work_starttime,
              props.work_endtime
            )
          }
        >
          <Badge
            style={{ display: "flex", flexDirection: "row" }}
            badgeContent={(!props.work_finished) ? <WarningIcon className={classes.warningIcon} /> : <CheckCircleIcon className={classes.checkIcon} />}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
          >
            <ListItem button className={classes.listItem}>
              <Hidden xsDown>
                <ListItemAvatar>{props.work_category_avatar}</ListItemAvatar>
              </Hidden>
              <ListItemText
                primary={
                  <Typography variant="h6">{props.work_title}</Typography>
                }
                secondary={props.work_subject}
              />
              <ListItemText
                align="right"
                primary={
                  <Typography variant="body2" color="textSecondary">
                    {moment(props.work_dateposted)
                      .locale("id")
                      .format("DD MMM YYYY")}
                  </Typography>
                }
                secondary={
                  <Typography variant="body2" color="textSecondary">
                    {moment(props.work_dateposted).locale("id").format("HH.mm")}
                  </Typography>
                }
              />
            </ListItem>
          </Badge>
        </Paper>
        <Dialog
          fullScreen={false}
          open={openDialog}
          onClose={handleCloseDialog}
          fullWidth={true}
          maxWidth="sm"
        >
          <div style={{ padding: "20px" }}>
            <Typography variant="h4" align="center">
              {currentDialogInfo.title}
            </Typography>
            <Typography variant="h5" align="center" color="primary">
              {currentDialogInfo.subject}
            </Typography>
            <Typography
              variant="subtitle1"
              align="center"
              style={{ marginTop: "25px" }}
            >
              Guru: {currentDialogInfo.teacher_name}
            </Typography>
            <Typography
              variant="subtitle1"
              align="center"
            >
              Mulai: {currentDialogInfo.start_date}
            </Typography>
            <Typography variant="subtitle1" align="center">
              Selesai: {currentDialogInfo.end_date}
            </Typography>
            <Typography
              variant="subtitle2"
              align="center"
              color="textSecondary"
              style={{ marginTop: "10px", textAlign: "center" }}
            >
              Tautan untuk Kuis atau Ujian anda akan diberikan oleh guru mata
              pelajaran terkait.
            </Typography>
          </div>
        </Dialog>
      </Grid>
    );
  }

  let AssessmentsList = [];
  let TeacherList = []
  let result = [];

  let tempSelectedDate = new Date(getSelectedDate());
      
  if (Boolean(all_assessments.length)) {
    var i;
    for (i = all_assessments.length - 1; i >= 0; i--) {
      let assessment = all_assessments[i];
      let tempDeadlineDate = new Date(assessment.start_date.substring(0,10));
      let class_assigned = assessment.class_assigned;

      if (tempSelectedDate.getDate() === tempDeadlineDate.getDate() && 
      tempSelectedDate.getMonth() === tempDeadlineDate.getMonth() &&
      tempSelectedDate.getYear() === tempDeadlineDate.getYear() &&
      class_assigned.indexOf(classId) !== -1) {
        for (let j = 0; j < all_teachers.length; j++) {
          if (all_teachers[j]._id === assessment.author_id) {
            TeacherList.push(all_teachers[j].name);
            break;
          }
        }
        AssessmentsList.push(assessment);
      }
      // if(i === all_assessments.length - 5){ // item terakhir harus pas index ke 4.
      //   break;
      // }
    }
    console.log(AssessmentsList)
    for (i = 0; i < AssessmentsList.length; i++) {
      let assessment = AssessmentsList[i];
      let teacher_name = TeacherList[i];
      let workCategoryAvatar =
        type === "Kuis" ? (
          <Avatar className={classes.listIcon}>
            <FaClipboardList />
          </Avatar>
        ) : (
          <Avatar className={classes.listIcon}>
            <BsClipboardData />
          </Avatar>
        );
      // let workStatus = "Belum Ditempuh"
      if (type === "Kuis") {
        if (
          (!category ||
            (category === "subject" && assessment.subject === subject._id)) &&
          
          assessment.type === "Kuis" &&
          assessment.posted
        ) {
          console.log(assessment.start_date)
          result.push({
            name: assessment.name,
            workCategoryAvatar: workCategoryAvatar,
            subject: assessment.subject,
            teacher_name: teacher_name,
            start_date: assessment.start_date,
            end_date: assessment.end_date,
            createdAt: assessment.createdAt,
            finished: assessment.submissions
          });
          // result.push(
          //   <AssessmentListItem
          //     work_title={assessment.name}
          //     work_category_avatar={workCategoryAvatar}
          //     work_subject={
          //       category === "subject"
          //         ? null
          //         : all_subjects_map.get(assessment.subject)
          //     }
          //     // work_status={workStatus}
          //     work_starttime={moment(assessment.start_date)
          //       .locale("id")
          //       .format("DD MMM YYYY, HH:mm")}
          //     work_endtime={moment(assessment.end_date)
          //       .locale("id")
          //       .format("DD MMM YYYY, HH:mm")}
          //     work_dateposted={assessment.createdAt}
          //   />
          // );
        }
      }
      if (type === "Ujian") {
        if (
          (!category ||
            (category === "subject" && assessment.subject === subject._id)) &&
          
          assessment.type === "Ujian" &&
          assessment.posted
        ) {
          result.push({
            name: assessment.name,
            workCategoryAvatar: workCategoryAvatar,
            subject: assessment.subject,
            teacher_name: teacher_name,
            start_date: assessment.start_date,
            end_date: assessment.end_date,
            createdAt: assessment.createdAt,
            finished: assessment.submissions
          });
          // result.push(
          //   <AssessmentListItem
          //     work_title={assessment.name}
          //     work_category_avatar={workCategoryAvatar}
          //     work_subject={
          //       category === "subject"
          //         ? null
          //         : all_subjects_map.get(assessment.subject)
          //     }
          //     // work_status={workStatus}
          //     work_starttime={moment(assessment.start_date)
          //       .locale("id")
          //       .format("DD MMM YYYY, HH:mm")}
          //     work_endtime={moment(assessment.end_date)
          //       .locale("id")
          //       .format("DD MMM YYYY, HH:mm")}
          //     work_dateposted={assessment.createdAt}
          //   />
          // );
        }
      }
    }
  }
  if (result.length === 0) {
    return (
      <Typography variant="subtitle1" align="center" color="textSecondary">
        Kosong
      </Typography>
    );
  } else {
    return result.map((row) => (
      <AssessmentListItem
        work_title={row.name}
        work_category_avatar={row.workCategoryAvatar}
        work_subject={
          category === "subject" ? null : all_subjects_map.get(row.subject)
        }
        work_teacher_name={row.teacher_name}
        // work_status={workStatus}
        work_starttime={moment(row.start_date)
          .locale("id")
          .format("DD MMM YYYY, HH:mm")}
        work_endtime={moment(row.end_date)
          .locale("id")
          .format("DD MMM YYYY, HH:mm")}
        work_dateposted={row.createdAt}
        work_finished={row.finished}
      />
    ));
  }
}

function AssessmentListItemTeacher(props) {
  const { classes } = props;

  return (
    <Grid item>
      <Link to={props.link}>
        <Paper variant="outlined" button className={classes.listItemPaper}>
          <Badge
            style={{ display: "flex", flexDirection: "row" }}
            badgeContent={<WarningIcon className={classes.warningIcon} />}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
          >
            <ListItem button className={classes.listItem}>
              <Hidden xsDown>
                <ListItemAvatar>
                  <Avatar className={classes.assignmentLate}>
                    {props.type === "Kuis" ? (
                      <FaClipboardList />
                    ) : (
                      <BsClipboardData />
                    )}
                  </Avatar>
                </ListItemAvatar>
              </Hidden>
              <ListItemText primary={props.title} secondary={props.subject} />
              <ListItemText
                align="right"
                primary={
                  <Typography variant="body2" color="textSecondary">
                    {moment(props.createdAt).locale("id").format("DD MMM YYYY")}
                  </Typography>
                }
                secondary={
                  <Typography variant="body2" color="textSecondary">
                    {moment(props.createdAt).locale("id").format("HH.mm")}
                  </Typography>
                }
              />
            </ListItem>
          </Badge>
        </Paper>
      </Link>
    </Grid>
  );
}

// FIXME DUMMY
function DummyForm(props) {
  const [a, sa] = React.useState("");
  const [b, sb] = React.useState("");
  const [c, sc] = React.useState("");
  const [d, sd] = React.useState("");
  const [e, se] = React.useState("");

  return (
    <>
      <TextField
        id="name"
        fullWidth
        variant="outlined"
        type="text"
        placeholder="Isi A"
        value={a}
        onChange={(e) => { sa(e.target.value) }}
        style={{margin: "24px 0"}}
      />
      <TextField
        id="name"
        fullWidth
        variant="outlined"
        type="text"
        placeholder="Isi B"
        value={b}
        onChange={(e) => { sb(e.target.value) }}
        style={{margin: "24px 0"}}
      />
      <TextField
        id="name"
        fullWidth
        variant="outlined"
        type="text"
        placeholder="Isi C"
        value={c}
        onChange={(e) => { sc(e.target.value) }}
        style={{margin: "24px 0"}}
      />
      <TextField
        id="name"
        fullWidth
        variant="outlined"
        type="text"
        placeholder="Isi D"
        value={d}
        onChange={(e) => { sd(e.target.value) }}
        style={{margin: "24px 0"}}
      />
      <TextField
        id="name"
        fullWidth
        variant="outlined"
        type="text"
        placeholder="Isi E"
        value={e}
        onChange={(e) => { se(e.target.value) }}
        style={{margin: "24px 0"}}
      />
    </>
  );
}

function PaperComponent(props) {
  return (
    <Draggable handle="#draggable-dialog-title" cancel={'[class*="MuiDialogContent-root"]'}>
      <Paper {...props} />
    </Draggable>
  );
}

function Calendar(props) {
  document.title = "Schooly | Kalender";

  const classes = useStyles();

  const {
    getAllEvents,
    getAllTask,
    getAllTaskFilesByUser,
    getAllSubjects,
    getAllAssessments,
    getStudentsByClass,
    getStudents,
    setCurrentClass,
    getTeachers,
    tasksCollection,
  } = props;

  const { user, all_students, all_teachers } = props.auth;
  const role = props.auth.user.role;
  const classId = user.kelas;

  const { all_user_files } = props.filesCollection;
  const { all_subjects_map, all_subjects } = props.subjectsCollection;
  const { all_assessments } = props.assessmentsCollection;

  // FIXME STATES
  const [openCreateDialog, setOpenCreateDialog] = React.useState(true);

  // form data
  const [name, setName] = React.useState("");
  const [location, setLocation] = React.useState("");
  const [start_date, setStartDate] = React.useState(new Date());
  const [end_date, setEndDate] = React.useState(new Date());
  const [target_role, setTargetRole] = React.useState([]);
  const [description, setDescription] = React.useState("");
  const [isAllDay, setAllDay] = React.useState(false);
  const inputHeightRef = React.useRef(null);
  const [inputHeight, setInputHeight] = React.useState(null);

  const [errors, setErrors] = React.useState({});
  
  // state ini akan bernilai null jika dan hanya jika pengguna belum mengklik tile kalender (belum memilih tanggal)
  const [selectedDate, setSelectedDate] = React.useState(null);
  const [rows, setRows] = React.useState([]);

  React.useEffect(() => {
    getAllEvents();
    getAllTask();
    getAllAssessments();
    getStudents();
    getTeachers();
    getAllTaskFilesByUser(user._id);
    getAllSubjects("map");

    console.log(inputHeightRef.current)
    if (inputHeightRef.current) {
      setInputHeight(inputHeightRef.current.offsetHeight);
    }
  }, []);

  React.useEffect(() => {
    // mencari event yang berlangsung hari ini.
    // event yang sudah lewat jamnya, sedang berlangsung, atau belum berlangsung akan ditampilkan.
    let now = (selectedDate === null) ? (new Date()).getDate() : selectedDate.getDate();
    let filteredEvents = props.eventsCollection.allEvents.filter((eventInfo) => {
      let start_date = (new Date(eventInfo.start_date)).getDate();
      let end_date = (new Date(eventInfo.end_date)).getDate();
      return (start_date <= now && now <= end_date);
    });
    setRows(filteredEvents);
  }, [props.eventsCollection.allEvents, selectedDate]);

  function getSelectedDate() {
    return selectedDate;
  }

  function listTasks() {
    let result = [];
    // tasksByClass.map((task) => {
    let tasksByClass = [];
    if (Boolean(tasksCollection.length)) {
      if (user.role === "Student") {
        tasksCollection.map((task) => {
          let class_assigned = task.class_assigned;
          for (var i = 0; i < class_assigned.length; i++) {
            if (class_assigned[i] === user.kelas) tasksByClass.push(task);
          }
          return tasksByClass;
        });
      } else if (user.role === "Teacher") {
        // For Teacher
        console.log("Ini untuk guru");
      }
    }
    tasksByClass.forEach((task) => {
      let tempSelectedDate = new Date(selectedDate);
      let tempDeadlineDate = new Date(task.deadline.substring(0,10));

      let flag = true;
      let teacher_name;

      // Untuk sekarang yang ditampilkan adalah tugas dengan deadline pada tanggal yang sama
      // dengan selectedDate (tidak memperhitungkan jam, menit, detik)
      if(tempSelectedDate.getDate() === tempDeadlineDate.getDate() && 
      tempSelectedDate.getMonth() === tempDeadlineDate.getMonth() &&
      tempSelectedDate.getYear() === tempDeadlineDate.getYear()) {
        for (var i = 0; i < all_user_files.length; i++) {
          if (all_user_files[i].for_task_object === task._id) {
            flag = false;
            break;
          }
        }
        for (var i = 0; i < all_teachers.length; i++) {
          if (all_teachers[i]._id == task.person_in_charge_id) {
            teacher_name = all_teachers[i].name;
          }
        }
        if (!all_subjects_map.get(task.subject)) {
          flag = false;
        }
        if (flag) {
          result.push({
            _id: task._id,
            name: task.name,
            teacher_name: teacher_name,
            subject: task.subject,
            deadline: task.deadline,
            createdAt: task.createdAt,
          });
        }
      }
    });
  
    if (result.length === 0) {
      return (
        <Typography variant="subtitle1" align="center" color="textSecondary">
          Kosong
        </Typography>
      );
    } else {
      return result.map((row) => (
        <TaskListItem
          classes={classes}
          work_title={row.name}
          work_sender={all_subjects_map.get(row.subject)}
          work_deadline_mobile={moment(row.deadline)
            .locale("id")
            .format("DD MMM YYYY, HH:mm")}
          work_deadline_desktop={moment(row.deadline)
            .locale("id")
            .format("DD MMM YYYY, HH:mm")}
          work_link={`/tugas-murid/${row._id}`}
          work_dateposted={row.createdAt}
        />
      ));
    }
  }

  function listTasksTeacher() {
    let tempSelectedDate = new Date(selectedDate);
    let result = [];
    console.log(user);
    for (let i = 0; i < tasksCollection.length; i++) {
      let tempDeadlineDate = new Date(tasksCollection[i].deadline.substring(0,10));
      if (tasksCollection[i].person_in_charge_id === user._id &&
        tempSelectedDate.getDate() === tempDeadlineDate.getDate() && 
        tempSelectedDate.getMonth() === tempDeadlineDate.getMonth() &&
        tempSelectedDate.getYear() === tempDeadlineDate.getYear()) {
        let number_students_assigned = 0;
        for (let j = 0; j < all_students.length; j++) {
          if (
            tasksCollection[i].class_assigned.includes(all_students[j].kelas)
          ) {
            number_students_assigned = number_students_assigned + 1;
          }
        }
        if (
          Object.values(tasksCollection[i].grades).length !==
          number_students_assigned
        ) {
          let task = tasksCollection[i];
          console.log(task)
          result.push({
            _id: task._id,
            name: task.name,
            subject: task.subject,
            deadline: task.deadline,
            createdAt: task.createdAt,
          });
        }
      }
    }
    if (result.length === 0) {
      return (
        <Typography variant="subtitle1" align="center" color="textSecondary">
          Kosong
        </Typography>
      );
    } else {
      return result.map((row) => {
        return (
          <TaskListItem
            classes={classes}
            work_title={row.name}
            work_sender={all_subjects_map.get(row.subject)}
            work_deadline_mobile={moment(row.deadline)
              .locale("id")
              .format("DD MMM YYYY, HH:mm")}
            work_deadline_desktop={moment(row.deadline)
              .locale("id")
              .format("DD MMM YYYY, HH:mm")}
            work_link={`/tugas-guru/${row._id}`}
            work_dateposted={row.createdAt}
          />
        );
      });
    }
  }

  function listAssessmentsTeacher(assessmentType) {
    // menampilkan assessment jika ada submission yang belum selesai dinilai

    let result = [];
    let lowerCaseType = assessmentType === "Kuis" ? "kuis" : "ujian";

    for (let i = 0; i < all_assessments.length; i++) {
      let assessment = all_assessments[i];
      if (assessment.type === assessmentType) {
        // jika terdapat soal uraian pada kuis ini dan sudah ada 1 atau lebih murid yg mengumpulkan jawaban
        if (
          assessment.question_weight.longtext !== null &&
          assessment.submissions &&
          Object.keys(assessment.submissions).length > 0
        ) {
          // jika ada murid yang jawaban uraiannya sudah dinilai
          if (
            assessment.grades &&
            Object.keys(assessment.grades).length > 0
          ) {
            // untuk setiap murid yang sudah mengumpulkan jawaban
            for (const studentId of Object.keys(assessment.submissions)) {
              // jika ada jawaban uraian yang belum dinilai
              if (
                !(
                  Object.keys(assessment.grades).includes(studentId) &&
                  assessment.grades[studentId].total_grade !== null
                )
              ) {
                // tampilkan di list
                result.push({
                  _id: assessment._id,
                  title: assessment.name,
                  subject: assessment.subject,
                  createdAt: assessment.createdAt,
                  type: assessment.type,
                });
                break;
              }
            }
          } else {
            // jika belum ada satupun murid yang jawaban uraiannya sudah dinilai, tampilkan di list
            result.push({
              _id: assessment._id,
              title: assessment.name,
              subject: assessment.subject,
              createdAt: assessment.createdAt,
              type: assessment.type,
            });
          }
        }
      }
    }

    if (result.length === 0) {
      return (
        <Typography variant="subtitle1" align="center" color="textSecondary">
          Kosong
        </Typography>
      );
    } else {
      return result.map((row) => {
        return (
          <AssessmentListItemTeacher
            classes={classes}
            title={row.title}
            subject={all_subjects_map.get(row.subject)}
            link={`/daftar-${lowerCaseType}-terkumpul/${row._id}`}
            createdAt={row.createdAt}
            type={row.type}
          />
        );
      });
    }
  }

  // Calendar
  const [mode, setMode] = React.useState("Day");
  const [currentMonthDates, setCurrentMonthDates] = React.useState([]);
  console.log(currentMonthDates)

  const handleOpenCreateDialog = () => {
    setOpenCreateDialog(true);
  } 

  const handleCloseCreateDialog = () => {
    setOpenCreateDialog(false);
  } 

  const onSubmit = () => {
    // create event
    handleCloseCreateDialog();
  }

  const handleChangeMode = (event) => {
    setMode(event.target.value);
  }

  const isSameDate = (date_1, date_2) => {
    return date_1.getDate() === date_2.getDate() && date_1.getMonth() === date_2.getMonth() && date_1.getYear() === date_2.getYear()
  }

  const renderCalendarTile = ({ activeStartDate, date, view }) => {
    let temp
    var today = new Date()
    if(isSameDate(today, date)) {
      return classes.todayTile
    }
    return classes.activeTile
  }

  const timeRows = [
    '01:00', '02:00', '03:00', '04:00', '05:00', '06:00', '07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00'
  ]

  const tableRows = [
    '', '', '', '', '', '', '', '', '', '', '', '', '', '', '',
  ];

  const dayNames = [
    'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'
  ]

  const dateRows = [
    [
      '1', '2', '3', '4', '5', '6', '7'
    ],
    [
      '1', '2', '3', '4', '5', '6', '7'
    ],
    [
      '1', '2', '3', '4', '5', '6', '7'
    ],
    [
      '1', '2', '3', '4', '5', '6', '7'
    ],
    [
      '1', '2', '3', '4', '5', '6', '7'
    ],
  ]

  const [agendaCheckboxState, setAgendaCheckboxState] = React.useState({
    checkedTask: true,
    checkedQuiz: true,
    checkedExam: true,
    checkedEvent: true,
  });

  const handleChange = (event) => {
    setAgendaCheckboxState({ ...agendaCheckboxState, [event.target.name]: event.target.checked });
  };

  const generateDayModeCalendar = () => {
    return (
      <div style={{ display: "flex", flexDirection: "row", marginTop: "10px" }}>
        <div style={{marginTop: "16px"}}>
          <TableContainer component={Grid}>
            <Table className={classes.table} aria-label="simple table">
              <TableBody>
              {timeRows.map((row) => (
                <TableRow style={{borderBottom: "none"}}>
                  <TableCell style={{borderBottom: "none", padding: "7.3px"}}>
                    <Typography color="textSecondary" variant="body2">{row}</Typography>
                  </TableCell>
                </TableRow>
              ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
        <TableContainer component={Grid}>
          <Table className={classes.table} aria-label="simple table">
            <TableBody>
              {tableRows.map((row) => (
                <TableRow key={row.name}>
                  <TableCell component="th" scope="row">
                    <div className={classes.blueChip}></div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    )
  }

  const generateMonthModeCalendar = () => {
    return (
      <div style={{ display: "flex", flexDirection: "row", marginTop: "10px" }}>
        <TableContainer component={Grid}>
          <Table className={classes.table} aria-label="simple table">
            <TableBody>
            {dateRows.map((row, index) => (
              generateDateAgenda(row, index)
            ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    )
  }

  const generateDateAgenda = (date, index) => {
    if(index === 0) {
      return (
        <TableRow style={{height: "100px"}}>
          {date.map((column, columnIndex) => (
            <TableCell style={{width: "14.2875%", border: "1px solid rgba(224, 224, 224, 1)", verticalAlign: "top"}} align="center">
              <Typography color="textSecondary" variant="body2">{dayNames[columnIndex]}</Typography>
              <Typography color="textSecondary" variant="body2">{column}</Typography>
            </TableCell>
          ))}
        </TableRow>
      )
    }
    else {
      return (
        <TableRow style={{height: "100px"}}>
          {date.map((column) => (
            <TableCell style={{width: "14.2875%", border: "1px solid rgba(224, 224, 224, 1)", verticalAlign: "top"}} align="center">
              <Typography color="textSecondary" variant="body2">{column}</Typography>
            </TableCell>
          ))}
        </TableRow>
      )
    }
  }

  return (
    <div className={classes.root}>
      {/* create event dialog */}
      <Dialog
        open={openCreateDialog}
        onClose={handleCloseCreateDialog}
        PaperComponent={PaperComponent}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle disableTypography>
          <Typography variant="h5" gutterBottom>
            <b>Buat Kegiatan</b>
          </Typography>
          <Typography color="textSecondary">
            Tambahkan keterangan untuk membuat kegiatan.
          </Typography>
        </DialogTitle>
        <DialogContent dividers>

          <DummyForm />
        {/* FIXME START ---- */}
          <Grid container style={{ padding: "20px 20px 30px 20px", display: "none" }} spacing={4}>

            {/* FIXME dialog - 1. judul*/}
            <Grid item xs={12}>
              <Typography component="label" for="name" color="primary" className={classes.formLabels}>
                <EventNoteIcon className={classes.formIcons}/>
                Judul
              </Typography>
              <div>
                <TextField
                  id="name"
                  fullWidth
                  variant="outlined"
                  type="text"
                  placeholder="Isi Judul"
                  value={name}
                  error={errors.name}
                  onChange={(e) => { setName(e.target.value) }}
                />
                <div style={{ height: "0" }}>
                  <FormHelperText error={errors.name} >{errors.name}</FormHelperText>
                </div>
              </div>
            </Grid>

            <Grid item xs={12}>
              <Button onClick={() => {
                if (errors.name) {
                  setErrors({...errors, name: undefined})
                } else {
                  setErrors({ ...errors, name: "hello" })
                }
              }}>hello</Button>
            </Grid>

            {/* FIXME dialog - 2. lokasi*/}
            <Grid item xs={12}>
              <Typography component="label" for="location" color="primary" className={classes.formLabels}>
                <LocationOnIcon className={classes.formIcons}/>
                Lokasi
              </Typography>
              <TextField
                id="location"
                fullWidth
                variant="outlined"
                type="text"
                placeholder="Isi Lokasi"
                value={location}
                error={errors.location}
                helperText={errors.location}
                onChange={(e) => { setLocation(e.target.value) }}
              />
            </Grid>

            <Grid item xs={12} container spacing={2}>
            {/* FIXME dialog - 3. waktu mulai*/}
              <Grid item xs={12} md={6}>
                <Typography
                  component="label"
                  for="eventStart"
                  color="primary"
                  className={classes.formLabels}
                >
                  <TimerIcon className={classes.formIcons}/>
                  Waktu Mulai
                </Typography>
                <div>
                  <MuiPickersUtilsProvider
                    locale={lokal}
                    utils={DateFnsUtils}
                  >
                    <KeyboardDateTimePicker
                      id="eventStart"
                      fullWidth
                      disablePast
                      inputVariant="outlined"
                      format="dd/MM/yyyy - HH:mm"
                      ampm={false}
                      okLabel="Simpan"
                      cancelLabel="Batal"
                      minDateMessage="Batas waktu harus waktu yang akan datang"
                      invalidDateMessage="Format tanggal tidak benar"
                      // value={start_date}
                      // onChange={(date) => { setStartDate(date) }}
                      // onError={(err) => {
                      //   console.log(err);
                      //   if (errors.start_date !== err) {
                      //     setErrors({...errors, start_date: err});
                      //   }
                      // }}
                      FormHelperTextProps={{
                        style: {
                          display: "none"
                        }
                      }}
                    />
                    <div style={{ height: "0" }}>
                      <FormHelperText error={errors.start_date}>{errors.start_date}</FormHelperText>
                    </div>
                  </MuiPickersUtilsProvider>
                </div>
              </Grid>
              {/* FIXME dialog - 4. waktu selesai*/}
              <Grid item xs={12} md={6}>
                <Typography
                  component="label"
                  for="eventEnd"
                  color="primary"
                  className={classes.formLabels}
                >
                  <TimerOffIcon className={classes.formIcons}/>
                  Waktu Selesai
                </Typography>
                <MuiPickersUtilsProvider
                  locale={lokal}
                  utils={DateFnsUtils}
                >
                  <KeyboardDateTimePicker
                    id="eventEnd"
                    fullWidth
                    disablePast
                    inputVariant="outlined"
                    format="dd/MM/yyyy - HH:mm"
                    ampm={false}
                    okLabel="Simpan"
                    cancelLabel="Batal"
                    minDate={start_date}
                    minDateMessage="Batas waktu harus setelah Waktu Mulai Pengerjaan"
                    invalidDateMessage="Format tanggal tidak benar"
                    value={end_date}
                    onChange={(date) => { setEndDate(date) }}
                  />
                </MuiPickersUtilsProvider>
              </Grid>
            </Grid>

            {/* FIXME dialog - 5. checkbox*/}
            <Grid item xs={12} style={{ paddingTop: 0, paddingBottom: 0 }}>
              <FormGroup>
                <FormControlLabel
                  label={
                    <Typography color="textSecondary">
                      Sepanjang Hari
                    </Typography>
                  }
                  control={
                    <Checkbox
                      onChange={() => { setAllDay(!isAllDay) }}
                      color="primary"
                      size="small"
                      checked={isAllDay}
                    />
                  }
                />
              </FormGroup>
            </Grid>

            {/* FIXME dialog - 6. pihak penerima*/}
            <Grid item xs={12}>
              <Typography
                component="label"
                for="target_role"
                color="primary"
                className={classes.formLabels}
              >
                <SupervisorAccountIcon className={classes.formIcons}/>
                Pihak Penerima
              </Typography>
              <FormControl
                variant="outlined"
                fullWidth
                error={errors.target_role}
              >
                <Select
                  id="target_role"
                  // MenuProps={MenuProps}
                  value={target_role}
                  onChange={(event) => {
                    // this.onChange(event, "target_role");
                  }}
                >
                </Select>
                <FormHelperText>
                  {errors.target_role ?? null}
                </FormHelperText>
              </FormControl>
            </Grid>

            {/* FIXME dialog - 7. deskripsi*/}
            <Grid item xs={12}>
              <Typography component="label" for="description" color="primary" className={classes.formLabels}>
                <SubjectIcon className={classes.formIcons}/>
                Deskripsi
              </Typography>
              <TextField
                id="description"
                fullWidth
                variant="outlined"
                type="text"
                placeholder="Isi Deskripsi"
                value={description}
                error={errors.description}
                helperText={errors.description}
                onChange={(e) => { setDescription(e.target.value) }}
              />
            </Grid>

          </Grid>
        
        
        {/* FIXME END ---- */}
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            className={classes.createEventButton}
            onClick={onSubmit}
          >
            Buat
          </Button>
        </DialogActions>
      </Dialog>
      <div className={classes.agendaContainer}>
        <AgendaToolbar
          classes={classes}
          mode={mode}
          handleChangeMode={handleChangeMode}
          handleOpenCreateDialog={handleOpenCreateDialog}
        />
        <Divider style={{marginTop: "10px"}}/>
        {mode === "Day" ? generateDayModeCalendar() : generateMonthModeCalendar()}
      </div>
      <div className={classes.calendarContainer}>
        <ReactCalendar
          onChange={setSelectedDate}
          value={selectedDate}
          tileClassName={renderCalendarTile}
          className={classes.calendar}
        />
        <div style={{display: "flex", flexDirection: "column", alignItems: "flex-start"}}>
          <Typography style={{marginTop: "15px"}}>Agenda</Typography>
          <FormGroup>
            <FormControlLabel
              control={
                <Checkbox checked={agendaCheckboxState.checkedTask}
                  onChange={handleChange}
                  name="checkedTask"
                  color="primary"
                />
              }
              label="Tugas"
            />
            <FormControlLabel
              control={
                <Checkbox checked={agendaCheckboxState.checkedQuiz}
                  onChange={handleChange}
                  name="checkedQuiz"
                  color="primary"
                />
              }
              label="Kuis"
            />
            <FormControlLabel
              control={
                <Checkbox checked={agendaCheckboxState.checkedExam}
                  onChange={handleChange}
                  name="checkedExam"
                  color="primary"
                />
              }
              label="Ujian"
            />
            <FormControlLabel
              control={
                <Checkbox checked={agendaCheckboxState.checkedEvent}
                  onChange={handleChange}
                  name="checkedEvent"
                  color="primary"
                />
              }
              label="Kegiatan"
            />
          </FormGroup>
        </div>
        <div style={{display: "flex", flexDirection: "column", alignItems: "flex-start"}}>
          <Typography style={{marginTop: "15px"}}>Kelas</Typography>
          <FormGroup>
          <FormControlLabel
              control={
                <Checkbox checked={agendaCheckboxState.checkedTask}
                  onChange={handleChange}
                  name="checkedTask"
                  color="primary"
                />
              }
              label="Tugas"
            />
            <FormControlLabel
              control={
                <Checkbox checked={agendaCheckboxState.checkedQuiz}
                  onChange={handleChange}
                  name="checkedQuiz"
                  color="primary"
                />
              }
              label="Kuis"
            />
            <FormControlLabel
              control={
                <Checkbox checked={agendaCheckboxState.checkedExam}
                  onChange={handleChange}
                  name="checkedExam"
                  color="primary"
                />
              }
              label="Ujian"
            />
            <FormControlLabel
              control={
                <Checkbox checked={agendaCheckboxState.checkedEvent}
                  onChange={handleChange}
                  name="checkedEvent"
                  color="primary"
                />
              }
              label="Kegiatan"
            />
          </FormGroup>
        </div>
      </div>
    </div>
  );
}

const mapStateToProps = (state) => ({
  auth: state.auth,
  eventsCollection: state.eventsCollection,
  tasksCollection: state.tasksCollection,
  subjectsCollection: state.subjectsCollection,
  classesCollection: state.classesCollection,
  filesCollection: state.filesCollection,
  assessmentsCollection: state.assessmentsCollection,
});

export default connect(mapStateToProps, {
  getAllEvents,
  getAllTask,
  getAllSubjects,
  getAllTaskFilesByUser,
  getAllAssessments,
  getTasks,
  getAssessments,
  getStudents,
  getTeachers
})(Calendar)