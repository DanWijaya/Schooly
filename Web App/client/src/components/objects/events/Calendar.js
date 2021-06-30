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
  DialogTitle,
  DialogContent,
  DialogActions,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Chip,
  Input,
  Snackbar,
  useMediaQuery
} from "@material-ui/core/";
import {
  MuiPickersUtilsProvider,
  KeyboardDateTimePicker,
  KeyboardDatePicker
} from "@material-ui/pickers";
import MuiAlert from "@material-ui/lab/Alert";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import LightTooltip from "../../misc/light-tooltip/LightTooltip";
// REVIEW ICONS 
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
import DragHandleIcon from '@material-ui/icons/DragHandle';
import CloseIcon from '@material-ui/icons/Close';
import AttachFileIcon from "@material-ui/icons/AttachFile";
import { FaClipboardList } from "react-icons/fa";
import { BsClipboardData } from "react-icons/bs";
import {
  FaFile,
  FaFileAlt,
  FaFileExcel,
  FaFileImage,
  FaFilePdf,
  FaFilePowerpoint,
  FaFileWord,
} from "react-icons/fa";
import {
  createEvent,
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
import Path from "path";

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
  },
  createEventButton: {
    backgroundColor: theme.palette.success.main,
    color: "white",
    "&:focus, &:hover": {
      backgroundColor: theme.palette.success.main,
      color: "white"
    }
  }
}));
// REVIEW STYLE

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
                <Fab size="small" className={classes.newEventButton}>
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

function CreateEventDialog(props) {
  const useStyles = makeStyles((theme) => ({
    formIcons: {
      width: "1rem",
      height: "1rem",
      marginRight: "7.5px",
      color: theme.palette.text.secondary
    },
    formLabels: {
      display: "flex",
      alignItems: "center"
    },
    zeroHeightHelperText: {
      height: "0",
      display: "flex" // untuk men-disable "collapsing margin"
    },
    chips: {
      display: 'flex',
      flexWrap: 'wrap'
    },
    chip: {
      marginRight: 2,
    },
    dummyInput: {
      height: "fit-content!important"
    },
    dialogTopDiv: {
      backgroundColor: theme.palette.action.selected,
      display: "flex",
      justifyContent: "space-between",
      padding: "0 24px",
      [theme.breakpoints.up("md")]: {
        "&:hover": {
          cursor: "move"
        }
      },
      [theme.breakpoints.down("sm")]: {
        justifyContent: "flex-end"
      }
    },
    dialogTopIcons: {
      width: "20px",
      height: "20px",
      color: theme.palette.text.secondary
    },
    addFileButton: {
      backgroundColor: theme.palette.primary.main,
      color: "white",
      "&:focus, &:hover": {
        backgroundColor: theme.palette.primary.main,
        color: "white",
      },
    },
    wordFileTypeIcon: {
      backgroundColor: "#16B0DD",
    },
    excelFileTypeIcon: {
      backgroundColor: "#68C74F",
    },
    imageFileTypeIcon: {
      backgroundColor: "#974994",
    },
    pdfFileTypeIcon: {
      backgroundColor: "#E43B37",
    },
    textFileTypeIcon: {
      backgroundColor: "#F7BC24",
    },
    presentationFileTypeIcon: {
      backgroundColor: "#FD931D",
    },
    otherFileTypeIcon: {
      backgroundColor: "#808080",
    },
    deleteIconButton: {
      marginLeft: "7.5px",
      backgroundColor: theme.palette.error.dark,
      color: "white",
      "&:focus, &:hover": {
        backgroundColor: "white",
        color: theme.palette.error.dark,
      },
    },
    mdUpZeroTopPadding: {
      [theme.breakpoints.up("md")]: {
        paddingTop: "0!important"
      }
    },
    mdUpZeroBottomPadding: {
      [theme.breakpoints.up("md")]: {
        paddingBottom: "0!important"
      }
    },
    smDownZeroTopPadding: {
      [theme.breakpoints.down("sm")]: {
        paddingTop: "0!important"
      }
    },
    smDownZeroBottomPadding: {
      [theme.breakpoints.down("sm")]: {
        paddingBottom: "0!important"
      }
    },
    dialogTopIconButtons: {
      padding: "8px",
      "&focus, &:hover": {
        backgroundColor: theme.palette.action.hover
      }
    },
    dialogPaper: {
      minHeight: "calc(100% - 64px)"
    }
  }));
  const classes = useStyles();
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const {
    openCreateDialog,
    handleCloseCreateDialog,
    setSnackbarContent,
    setSeverity,
    setOpenSnackbar
  } = props;

  // REVIEW CreateEventDialog - STATES
  const [errors, setErrors] = React.useState({});

  // FORM
  const [name, setName] = React.useState("");
  const [location, setLocation] = React.useState("");
  const [start_date, setStartDate] = React.useState(null);
  const [end_date, setEndDate] = React.useState(null);
  const [target_role, setTargetRole] = React.useState([]);
  const [description, setDescription] = React.useState("");
  const [isAllDay, setAllDay] = React.useState(false);

  // LAMPIRAN
  const [fileLampiran, setFileLampiran] = React.useState([]);
  // const [overLimit, setOverLimit] = React.useState([]);
  // const [fileLimitSnackbar, setFileLimitSnackbar] = React.useState(false);

  const lampiranUploader = React.useRef(null);

  // DATETIME PICKER
  const [openStartDatePicker, setOpenStartDatePicker] = React.useState(false);
  const [openStartDateTimePicker, setOpenStartDateTimePicker] = React.useState(false);
  const [openEndDatePicker, setOpenEndDatePicker] = React.useState(false);
  const [openEndDateTimePicker, setOpenEndDateTimePicker] = React.useState(false);
  const startDatePicker = React.useRef(null);
  const endDatePicker = React.useRef(null);

  // ref ini berfungsi untuk menyimpan waktu agar ketika pengguna mencentang kembali checkbox (mengubah jadi tidak sepanjang hari),
  // waktu yang pernah dimasukkan sebelumnya bisa ditampilkan kembali
  const lastSelectedTime = React.useRef(null);

  // FORM
  // REVIEW dialog onsubmit
  const onSubmit = () => {
    let formData = new FormData();
    if (fileLampiran) {
      for (let i = 0; i < fileLampiran.length; i++) {
        formData.append("lampiran_event", fileLampiran[i]);
      }
    }

    // replace "pengelola" dengan "admin"
    let to = [...target_role];
    let adminIdx = to.indexOf("pengelola");
    if (adminIdx !== -1) {
      to.splice(adminIdx, 1, "Admin");
    }

    // REVIEW handleOpenUploadDialog
    createEvent(formData, {
      name,
      location,
      start_date,
      end_date,
      to,
      description
    }).then(() => {
      handleCloseCreateDialog();
    }).catch((err) => {
      setErrors(err);
    });
  }

  // DATETIME PICKER
  const isValidDateTime = (d) => {
    return d instanceof Date && !isNaN(d);
  };

  const handleCheckAllDay = () => {
    let newStatus = !isAllDay;
    if (newStatus) {
      // jika diset ke sepanjang hari, ...
      
      // di mode sepanjang hari, hanya tanggal yang ditampilkan di datetime picker. 
      // waktu tidak ditampilkan dan akan diset menjadi 00:00 (untuk start date) - 23:59 (untuk end date)

      lastSelectedTime.current = {};
      if (isValidDateTime(start_date)) {
        // jika tanggal dan waktu valid

        // set waktu mulai ke 00:00:00. tanggal tidak diubah 
        let start = new Date(start_date.getTime()); // membuat salinan
        start.setHours(0, 0, 0);
        setStartDate(start);

        // simpan waktu
        lastSelectedTime.current.start_date = {
          hour: start_date.getHours(),
          minute: start_date.getMinutes()
        };
      } else {
        // jika tanggal atau waktu tidak valid,

        if (startDatePicker.current.getAttribute("value")) {
          // jika isi textfield picker ada,

          // dapatkan string yang ditampilkan di textfield datetime picker.
          // string ini akan memiliki format yang sama seperti format yang sedang digunakan pada datetime picker: "dd/MM/yyyy - HH:mm"
          let [dateStr, separator, timeStr] = startDatePicker.current.getAttribute("value").split(" ");
  
          // mencoba mem-parse tanggal
          let [day, month, year] = dateStr.split("/");
  
          // menyusun ulang tanggal karena parser js akan memparse tanggal dalam format "dd/MM/yyyy" menjadi "MM/dd/yyyy".
          // ga pakai new Date(int year, int month, int day) karena nilai month > 11, month < 0, day < 1, dan day > 31 atau 30 masih
          // diterima dan menghasilkan Date yang valid
          let parsedDate = new Date(`${year}-${month}-${day}`);
          // let parsedDate = new Date(Number(year), Number(month) - 1, Number(day));

          // jika tanggal tidak valid, set tanggal mulai menjadi tanggal sekarang 
          setStartDate(isValidDateTime(parsedDate) ? parsedDate : new Date());

          // mencoba mem-parse waktu
          let [hour, minute] = timeStr.split(":");
          let parsedTime = new Date(0, 0, 0, Number(hour), Number(minute), 0);

          if (isValidDateTime(parsedTime)) {
            // simpan waktu
            lastSelectedTime.current.start_date = {
              hour: parsedTime.getHours(),
              minute: parsedTime.getMinutes()
            };
          } else {
            // simpan nilai null (saat waktu simpanan ini digunakan, nilai null ini akan dikonversi menjadi 00:00)
            lastSelectedTime.current.start_date = null;
          }

        } else {
          // jika isi textfield picker kosong,
          let start = new Date();
          start.setHours(0, 0, 0);
          setStartDate(start);

          lastSelectedTime.current.start_date = null;
        }
      }

      if (isValidDateTime(end_date)) {
        // jika tanggal dan waktu valid

        // set waktu selesai ke 23:59:59. tanggal tidak diubah 
        let end = new Date(end_date.getTime()); // membuat salinan
        end.setHours(23, 59, 59);
        setEndDate(end);

        // simpan waktu
        lastSelectedTime.current.end_date = {
          hour: end_date.getHours(),
          minute: end_date.getMinutes()
        };
      } else {
        // jika tanggal atau waktu tidak valid,

        if (endDatePicker.current.getAttribute("value")) {
          // jika isi textfield picker ada,

          // dapatkan string yang ditampilkan di textfield datetime picker.
          // string ini akan memiliki format yang sama seperti format yang sedang digunakan pada datetime picker: "dd/MM/yyyy - HH:mm"
          let [dateStr, separator, timeStr] = endDatePicker.current.getAttribute("value").split(" ");

          // mencoba mem-parse tanggal
          let [day, month, year] = dateStr.split("/");

          // menyusun ulang tanggal karena parser js akan memparse tanggal dalam format "dd/MM/yyyy" menjadi "MM/dd/yyyy".
          // ga pakai new Date(int year, int month, int day) karena nilai month > 11, month < 0, day < 1, dan day > 31 atau 30 masih
          // diterima dan menghasilkan Date yang valid
          let parsedDate = new Date(`${year}-${month}-${day}`);
          // let parsedDate = new Date(Number(year), Number(month) - 1, Number(day));

          // jika tanggal tidak valid, set tanggal mulai menjadi tanggal sekarang 
          setEndDate(isValidDateTime(parsedDate) ? parsedDate : new Date());

          // mencoba mem-parse waktu
          let [hour, minute] = timeStr.split(":");
          let parsedTime = new Date(0, 0, 0, Number(hour), Number(minute), 0);
  
          if (isValidDateTime(parsedTime)) {
            // simpan waktu
            lastSelectedTime.current.end_date = {
              hour: parsedTime.getHours(),
              minute: parsedTime.getMinutes()
            };
          } else {
            // simpan nilai null (saat waktu simpanan ini digunakan, nilai null ini akan dikonversi menjadi 00:00)
            lastSelectedTime.current.end_date = null;
          }
        } else {
          // jika isi textfield picker kosong,

          let end = new Date();
          end.setHours(23, 59, 59);
          setEndDate(end);

          lastSelectedTime.current.end_date = null;
        }
      }
    } else {
      // jika diset ke tidak sepanjang hari

      if (isValidDateTime(start_date)) {
        // pada mode sepanjang hari, waktu mulai sudah dibuat agar tetap berisi 00:00:00 sehingga nilai waktu mulai pasti valid.
        // jika tanggal mulai juga valid, 

        let start = new Date(start_date.getTime()); // membuat salinan
        let startDate = lastSelectedTime.current.start_date;
        if (startDate === null) {
          // jika waktu simpanan null, berarti waktu yang sebelumnya akan disimpan itu tidak valid.
          // reset waktu jadi 00:00:00
          start.setHours(0, 0, 0);
        } else {
          // jika waktu simpanan ada, set waktu mulai jadi sesuai dengan waktu yang disimpan tersebut
          start.setHours(
            startDate.hour,
            startDate.minute
          );
        }
        setStartDate(start);
      } else {
        // jika tanggal mulai tidak valid, set tanggal dan waktu mulai jadi tanggal dan waktu sekarang 
        // (belum ada alasan khusus kenapa waktunya tidak diset menjadi 00:00:00)
        setStartDate(new Date());
      }

      if (isValidDateTime(end_date)) {
        // pada mode sepanjang hari, waktu selesai sudah dibuat agar tetap berisi 23:59:59 sehingga nilai waktu selesai pasti valid. 
        // jika tanggal selesai juga valid,

        let end = new Date(end_date.getTime()); // membuat salinan
        let endDate = lastSelectedTime.current.end_date;
        if (endDate === null) {
          // jika waktu simpanan null, berarti waktu yang sebelumnya akan disimpan itu tidak valid.
          // reset waktu jadi 23:59:59
          end.setHours(23, 59, 59);
        } else {
          // jika waktu simpanan ada, set waktu selesai jadi sesuai dengan waktu yang disimpan tersebut
          end.setHours(
            endDate.hour,
            endDate.minute
          );
        }
        setEndDate(end);
      } else {
        // jika tanggal selesai tidak valid, set tanggal dan waktu selesai jadi tanggal dan waktu sekarang
        // (belum ada alasan khusus kenapa waktunya tidak diset menjadi 23:59:59)
        setEndDate(new Date());
      }
    }

    setAllDay(newStatus);
  };

  const handleStartDateChange = (date) => {
    setErrors({ ...errors, start_date_submission: undefined });
    
    let startDate = date;
    if (isAllDay) {
      // ini perlu ditambahkan karena onchange pada date picker dapat mengubah nilai waktu (ga ngerti kenapa)
      startDate.setHours(0, 0, 0);
    }
    setStartDate(startDate);
  };

  const handleEndDateChange = (date) => {
    setErrors({ ...errors, end_date_submission: undefined });

    let endDate = date;
    if (isAllDay) {
      // ini perlu ditambahkan karena onchange pada date picker dapat mengubah nilai waktu (ga ngerti kenapa)
      endDate.setHours(23, 59, 59);
    }
    setEndDate(endDate);
  };

  const handleOpenStartPicker = (isAllDay) => {
    if (isAllDay) {
      setOpenStartDatePicker(true);
    } else {
      setOpenStartDateTimePicker(true);
    }
  };

  const handleCloseStartPicker = (isAllDay) => {
    if (isAllDay) {
      setOpenStartDatePicker(false);
    } else {
      setOpenStartDateTimePicker(false);
    }
  };

  const handleOpenEndPicker = (isAllDay) => {
    if (isAllDay) {
      setOpenEndDatePicker(true);
    } else {
      setOpenEndDateTimePicker(true);
    }
  };

  const handleCloseEndPicker = (isAllDay) => {
    if (isAllDay) {
      setOpenEndDatePicker(false);
    } else {
      setOpenEndDateTimePicker(false);
    }
  };

  const handleChangeName = (e) => {
    setErrors({ ...errors, name: undefined });
    setName(e.target.value);
  };

  const handleChangeTargetRole = (e) => {
    setErrors({ ...errors, to: undefined });
    setTargetRole(e.target.value);
  };

  const handleChangeDescription = (e) => {
    setErrors({ ...errors, description: undefined });
    setDescription(e.target.value)
  };

  const fileType = (filename) => {
    let ext_file = Path.extname(filename);
    switch (ext_file) {
      case ".docx":
        return "Word";
      case ".xlsx":
      case ".csv":
        return "Excel";

      case ".png":
      case ".jpg":
      case ".jpeg":
        return "Gambar";

      case ".pdf":
        return "PDF";

      case ".txt":
      case ".rtf":
        return "Teks";

      case ".ppt":
      case ".pptx":
        return "Presentasi";

      default:
        return "File Lainnya";
    }
  };

  // LAMPIRAN
  const handleLampiranUpload = (e) => {
    const files = e.target.files;
    let temp = [...Array.from(fileLampiran), ...Array.from(files)];
    let over_limit = temp.filter((file) => file.size / Math.pow(10, 6) > 10);
    let file_to_upload = temp.filter(
      (file) => file.size / Math.pow(10, 6) <= 10
    );

    if (errors.lampiran_materi) {
      // karena errornya ini berupa lampiran_materi
      setErrors({ ...errors, lampiran_materi: null });
    }
    setFileLampiran(file_to_upload);
    // setOverLimit(over_limit);
    // setFileLimitSnackbar(over_limit.length > 0);

    setSnackbarContent(over_limit.length + " file melebihi batas 10MB!");
    setSeverity("error");
    setOpenSnackbar(over_limit.length > 0);

    document.getElementById("file_control").value = null;
  };

  const listFileChosen = () => {
    let temp = [];
    if (fileLampiran.length > 0) {
      for (let i = 0; i < fileLampiran.length; i++) {
        temp.push(
          <LampiranFile
            classes={classes}
            name={fileLampiran[i].name}
            filetype={fileType(fileLampiran[i].name)}
            handleLampiranDelete={handleLampiranDelete}
            i={i}
          />
        );
      }
    }
    return temp;
  };

  const handleLampiranDelete = (e, i) => {
    e.preventDefault();
    let temp = Array.from(fileLampiran);
    temp.splice(i, 1);
    setFileLampiran(temp);
  };

  return (
    <Dialog
      open={openCreateDialog}
      onClose={handleCloseCreateDialog}
      PaperComponent={fullScreen ? undefined : PaperComponent}
      maxWidth="sm"
      fullScreen={fullScreen}
      fullWidth
      BackdropProps={{
        style: { backgroundColor: "transparent" }
      }}
    >
      <div className={classes.dialogTopDiv} id="drag-handle">
        <Hidden smDown>
          <IconButton className={classes.dialogTopIconButtons} edge="start">
            <DragHandleIcon className={classes.dialogTopIcons} />
          </IconButton>
        </Hidden>
        <IconButton className={classes.dialogTopIconButtons} edge="end" onClick={handleCloseCreateDialog}>
          <CloseIcon className={classes.dialogTopIcons} />
        </IconButton>
      </div>
      <DialogTitle disableTypography>
        <Typography variant="h5" gutterBottom>
          <b>Buat Kegiatan</b>
        </Typography>
        <Typography color="textSecondary">
          Tambahkan keterangan untuk membuat kegiatan.
        </Typography>
      </DialogTitle>
      <DialogContent dividers>
        {
          
        }
        
        <Grid container direction="column" spacing={4}>
          {/* <Grid item>
            <Button
              color="primary"
              onClick={() => {
                if (errors.name) {
                  setErrors({ ...errors, name: undefined, description: undefined, target_role: undefined })
                } else {
                  setErrors({ ...errors, name: "error error error error error error error error error error error error error error error ", description: "error", target_role: "error" })
                }
              }}>SHOW ERROR</Button>
          </Grid> */}

          {/* REVIEW dialog - 1. judul*/}
          <Grid item>
            <Typography component="label" for="name" color="primary" className={classes.formLabels}>
              <EventNoteIcon className={classes.formIcons} />
              Judul
            </Typography>
            <TextField
              id="name"
              fullWidth
              variant="outlined"
              type="text"
              placeholder="Isi Judul"
              value={name}
              error={errors.name}
              onChange={(e) => { handleChangeName(e) }}
            />
            {errors.name
              ?
              <div className={classes.zeroHeightHelperText}>
                <FormHelperText variant="outlined" error>{errors.name}</FormHelperText>
              </div>
              : null}
          </Grid>

          {/* REVIEW dialog - 2. lokasi*/}
          <Grid item>
            <Typography component="label" for="location" color="primary" className={classes.formLabels}>
              <LocationOnIcon className={classes.formIcons} />
              Lokasi
            </Typography>
            <TextField
              id="location"
              fullWidth
              variant="outlined"
              type="text"
              placeholder="Isi Lokasi"
              value={location}
              onChange={(e) => { setLocation(e.target.value) }}
            />
          </Grid>

          <Grid item container spacing={2} className={classes.mdUpZeroBottomPadding}>
            {/* REVIEW dialog - 3. waktu mulai*/}
            <Grid item xs={12} md={6} className={classes.smDownZeroBottomPadding}>
              <Typography
                component="label"
                for="eventStart"
                color="primary"
                className={classes.formLabels}
              >
                <TimerIcon className={classes.formIcons} />
                Waktu Mulai
              </Typography>
              {/* {start_date && isValidDateTime(start_date) ? start_date.toLocaleString() : null} */}
              <MuiPickersUtilsProvider
                locale={lokal}
                utils={DateFnsUtils}
              >
                <KeyboardDatePicker
                  okLabel="Simpan"
                  cancelLabel="Batal"
                  disablePast
                  onChange={(date) => { handleStartDateChange(date) }}
                  open={openStartDatePicker}
                  onClose={() => { setOpenStartDatePicker(false) }}
                  style={{ display: "none" }}
                />
                <KeyboardDateTimePicker
                  id="eventStart"
                  inputRef={startDatePicker}
                  fullWidth
                  disablePast
                  inputVariant="outlined"
                  format={isAllDay ? "dd/MM/yyyy" : "dd/MM/yyyy - HH:mm"}
                  ampm={false}
                  okLabel="Simpan"
                  cancelLabel="Batal"
                  minDateMessage="Batas waktu harus waktu yang akan datang"
                  invalidDateMessage="Format tanggal tidak benar"
                  value={start_date}
                  placeholder="Isi Waktu Mulai"
                  onChange={(date) => { handleStartDateChange(date) }}
                  helperText={null}
                  onError={(err) => {
                    if (errors.start_date_picker !== err) {
                      setErrors({ ...errors, start_date_picker: err });
                    }
                  }}
                  open={openStartDateTimePicker}
                  onOpen={() => { handleOpenStartPicker(isAllDay) }}
                  onClose={() => { handleCloseStartPicker(isAllDay) }}
                />
                <div className={classes.zeroHeightHelperText} style={{ flexDirection: "column" }}>
                  {errors.start_date_submission
                    ? <FormHelperText variant="outlined" error>{errors.start_date_submission}</FormHelperText>
                    : errors.start_date_picker
                      ? <FormHelperText variant="outlined" error>{errors.start_date_picker}</FormHelperText>
                      : null}
                  {/* checkbox ini dimasukkan ke div zero height ini agar dapat berpindah ke bawah (untuk memberikan ruang 
                    untuk menampilkan helper text error) tanpa memindahkan dua item-item di bawahnya*/}
                  <FormGroup style={{ width: "fit-content" }}>
                    <FormControlLabel
                      label={
                        <Typography color="textSecondary">
                          Sepanjang Hari
                        </Typography>
                      }
                      control={
                        <Checkbox
                          onChange={() => { handleCheckAllDay() }}
                          color="primary"
                          size="small"
                          checked={isAllDay}
                        />
                      }
                    />
                  </FormGroup>
                </div>
                <Grid item style={{ padding: "0", width: "0", visibility: "hidden" }}>
                  <FormHelperText variant="outlined">{"\u200B"}</FormHelperText>
                  <Checkbox size="small" disabled />
                </Grid>
              </MuiPickersUtilsProvider>
            </Grid>
            {/* REVIEW dialog - 4. waktu selesai*/}
            <Grid item xs={12} md={6} className={classes.smDownZeroTopPadding}>
              <Typography
                component="label"
                for="eventEnd"
                color="primary"
                className={classes.formLabels}
              >
                <TimerOffIcon className={classes.formIcons} />
                Waktu Selesai
              </Typography>
              {/* {end_date && isValidDateTime(end_date) ? end_date.toLocaleString() : null} */}
              <MuiPickersUtilsProvider
                locale={lokal}
                utils={DateFnsUtils}
              >
                <KeyboardDatePicker
                  okLabel="Simpan"
                  cancelLabel="Batal"
                  disablePast
                  minDate={start_date}
                  onChange={(date) => { handleEndDateChange(date) }}
                  open={openEndDatePicker}
                  onClose={() => setOpenEndDatePicker(false)}
                  style={{ display: "none" }}
                />
                <KeyboardDateTimePicker
                  id="eventEnd"
                  inputRef={endDatePicker}
                  fullWidth
                  disablePast
                  inputVariant="outlined"
                  format={isAllDay ? "dd/MM/yyyy" : "dd/MM/yyyy - HH:mm"}
                  ampm={false}
                  okLabel="Simpan"
                  cancelLabel="Batal"
                  minDate={start_date}
                  minDateMessage="Batas waktu harus setelah Waktu Mulai"
                  invalidDateMessage="Format tanggal tidak benar"
                  value={end_date}
                  placeholder="Isi Waktu Selesai"
                  onChange={(date) => { handleEndDateChange(date) }}
                  helperText={null}
                  onError={(err) => {
                    if (errors.end_date_picker !== err) {
                      setErrors({ ...errors, end_date_picker: err });
                    }
                  }}
                  open={openEndDateTimePicker}
                  onOpen={() => { handleOpenEndPicker(isAllDay) }}
                  onClose={() => { handleCloseEndPicker(isAllDay) }}
                />
                <div className={classes.zeroHeightHelperText} style={{ flexDirection: "column" }}>
                  {errors.end_date_submission
                    ? <FormHelperText variant="outlined" error>{errors.end_date_submission}</FormHelperText>
                    : errors.end_date_picker
                      ? <FormHelperText variant="outlined" error>{errors.end_date_picker}</FormHelperText>
                      : null}
                </div>
              </MuiPickersUtilsProvider>
            </Grid>
          </Grid>

          {/* REVIEW dialog - 6. pihak penerima*/}
          <Grid item className={classes.mdUpZeroTopPadding} >
            <Typography
              component="label"
              for="target_role"
              color="primary"
              className={classes.formLabels}
            >
              <SupervisorAccountIcon className={classes.formIcons} />
              Pihak Penerima
            </Typography>
            <FormControl
              variant="outlined"
              fullWidth
              error={errors.to}
            >
              <Select
                id="target_role"
                multiple
                displayEmpty
                value={target_role}
                onChange={(e) => { handleChangeTargetRole(e) }}
                renderValue={(selected) => (
                  <div className={classes.chips}>
                    {selected.length === 0
                      ? 
                      // input ini hanya digunakan sebagai placeholder
                      <Input
                        disableUnderline
                        placeholder="Pilih Pihak Penerima"
                        readOnly
                        classes={{ input: classes.dummyInput }}
                      />
                      : 
                      selected.map((value) => (
                        <Chip key={value} label={value} className={classes.chip} />
                      ))}
                  </div>
                )}
              >
                {["Murid", "Guru", "Pengelola"].map((role) => (
                  <MenuItem key={role} value={role}>
                    <Checkbox checked={target_role.includes(role)} />
                    <ListItemText primary={role} />
                  </MenuItem>
                ))}
              </Select>
              {errors.to
                ?
                <div className={classes.zeroHeightHelperText}>
                  <FormHelperText variant="outlined" error>{errors.to}</FormHelperText>
                </div>
                : null}
            </FormControl>
          </Grid>

          {/* REVIEW dialog - 7. deskripsi*/}
          <Grid item>
            <Typography component="label" for="description" color="primary" className={classes.formLabels}>
              <SubjectIcon className={classes.formIcons} />
              Deskripsi
            </Typography>
            <TextField
              id="description"
              fullWidth
              variant="outlined"
              type="text"
              placeholder="Isi Deskripsi"
              multiline
              value={description}
              error={errors.description}
              onChange={(e) => { handleChangeDescription(e) }}
            />
            {errors.description
              ?
              <div className={classes.zeroHeightHelperText}>
                <FormHelperText variant="outlined" error>{errors.description}</FormHelperText>
              </div>
              : null}
          </Grid>

          {/* REVIEW dialog - 8. tambah lampiran */}
          <Grid item>
            <input
              id="file_control"
              name="lampiran"
              type="file"
              accept="file/*"
              multiple={true}
              ref={lampiranUploader}
              onChange={handleLampiranUpload}
              style={{ display: "none" }}
            />
            <Button
              variant="contained"
              startIcon={<AttachFileIcon />}
              onClick={() => lampiranUploader.current.click()}
              className={classes.addFileButton}
            >
              Tambah Lampiran Berkas
            </Button>
            <Grid container spacing={1} style={{ marginTop: "10px" }}>
              {listFileChosen()}
            </Grid>
          </Grid>

        </Grid>

      </DialogContent>
      <DialogActions style={{ padding: "16px 24px" }}>
        <Button
          variant="contained"
          className={classes.createEventButton}
          onClick={onSubmit}
        >
          Buat
        </Button>
      </DialogActions>
    </Dialog>
  );
}

// REVIEW PaperComponent
function PaperComponent(props) {
  return (
    <Draggable handle="#drag-handle" cancel={'[class*="MuiDialogContent-root"]'}>
      <Paper {...props} />
    </Draggable>
  );
}

// REVIEW LampiranFile
function LampiranFile(props) {
  const { classes, name, filetype, i, handleLampiranDelete } = props;

  return (
    <Grid item xs={12}>
      <Paper variant="outlined">
        <ListItem disableRipple>
          <ListItemAvatar>
            {filetype === "Word" ? (
              <Avatar className={classes.wordFileTypeIcon}>
                <FaFileWord />
              </Avatar>
            ) : filetype === "Excel" ? (
              <Avatar className={classes.excelFileTypeIcon}>
                <FaFileExcel />
              </Avatar>
            ) : filetype === "Gambar" ? (
              <Avatar className={classes.imageFileTypeIcon}>
                <FaFileImage />
              </Avatar>
            ) : filetype === "PDF" ? (
              <Avatar className={classes.pdfFileTypeIcon}>
                <FaFilePdf />
              </Avatar>
            ) : filetype === "Teks" ? (
              <Avatar className={classes.textFileTypeIcon}>
                <FaFileAlt />
              </Avatar>
            ) : filetype === "Presentasi" ? (
              <Avatar className={classes.presentationFileTypeIcon}>
                <FaFilePowerpoint />
              </Avatar>
            ) : filetype === "File Lainnya" ? (
              <Avatar className={classes.otherFileTypeIcon}>
                <FaFile />
              </Avatar>
            ) : null}
          </ListItemAvatar>
          <ListItemText
            primary={
              <LightTooltip title={name} placement="top">
                <Typography>
                  {name.length < 21
                    ? name
                    : `${name.slice(0, 15)}..${Path.extname(name)}`}
                </Typography>
              </LightTooltip>
            }
            secondary={filetype}
          />
          <LightTooltip title="Hapus Lampiran">
            <IconButton
              size="small"
              className={classes.deleteIconButton}
              onClick={(e) => {
                handleLampiranDelete(e, i);
              }}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </LightTooltip>
        </ListItem>
      </Paper>
    </Grid>
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

  // REVIEW Calendar - STATES
  const [openCreateDialog, setOpenCreateDialog] = React.useState(true);

  // state ini akan bernilai null jika dan hanya jika pengguna belum mengklik tile kalender (belum memilih tanggal)
  const [selectedDate, setSelectedDate] = React.useState(null);
  const [rows, setRows] = React.useState([]);

  // SNACKBAR
  const [snackbarContent, setSnackbarContent] = React.useState("");
  const [severity, setSeverity] = React.useState("info");
  const [openSnackbar, setOpenSnackbar] = React.useState(false);
  
  const handleOpenSnackbar = () => {
    setOpenSnackbar(true);
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  React.useEffect(() => {
    getAllEvents();
    getAllTask();
    getAllAssessments();
    getStudents();
    getTeachers();
    getAllTaskFilesByUser(user._id);
    getAllSubjects("map");
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
      {/* REVIEW createeventdialog */}
      <CreateEventDialog
        openCreateDialog={openCreateDialog}
        handleCloseCreateDialog={handleCloseCreateDialog}
        setSnackbarContent={setSnackbarContent}
        setSeverity={setSeverity}
        setOpenSnackbar={setOpenSnackbar}
      />
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
      <Snackbar
        open={openSnackbar}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
      >
        <MuiAlert
          elevation={6}
          variant="filled"
          severity={severity}
          onClose={handleCloseSnackbar}
        >
          {snackbarContent}
        </MuiAlert>
      </Snackbar>
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