import React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
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
  Dialog
} from "@material-ui/core/";
import { makeStyles } from "@material-ui/core/styles";
import LightTooltip from "../../misc/light-tooltip/LightTooltip";
import EventNoteIcon from '@material-ui/icons/EventNote';
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import PageviewIcon from "@material-ui/icons/Pageview";
import LibraryBooksIcon from "@material-ui/icons/LibraryBooks";
import WarningIcon from "@material-ui/icons/Warning";
import AssignmentIcon from "@material-ui/icons/Assignment";
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

const useStyles = makeStyles((theme) => ({
  root: {
    margin: "auto",
    maxWidth: "80%",
    [theme.breakpoints.down("md")]: {
      maxWidth: "100%"
    },
    padding: "10px",
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
  calendarContainer: {
    display: "flex",
    justifyContent: "center",
    marginBottom: "30px"
  },
  calendar: {
    width: "100%"
  },
  calendarTile: {
    // minWidth: "100px"
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
}));

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

  return (
    <div className={classes.root}>
      <div className={classes.calendarContainer}>
        <ReactCalendar
          onChange={setSelectedDate}
          value={selectedDate}
          tileClassName={classes.calendarTile}
          className={classes.calendar}
        />
      </div>
      <CalendarListToolbar
        classes={classes}
        role={role}
        type="Event"
      />
      <Divider variant="inset" className={classes.titleDivider} />
      {/* <Hidden mdUp implementation="css">
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
      </Hidden> */}

      <Grid container direction="column" spacing={2} style={{marginBottom: "32px"}}>
        {rows.length === 0 ? (
          <Typography variant="subtitle1" align="center" color="textSecondary">
            Kosong
          </Typography>
        ) : 
          rows.map((eventInfo) => {
            return (
              <Grid item>
                <Paper variant="outlined">
                  <ListItem className={classes.listItem}>
                    {/* Isi ListItem Mobile = nama event*/}
                    <Hidden smUp implementation="css">
                      <ListItemText
                        style={{ margin: "6px 0" }}
                        primary={
                          <Grid container alignItems="center">
                            <Typography variant="subtitle1" color="textPrimary">
                              {eventInfo.name}
                            </Typography>

                            {/* bagian ini ditambahkan agar tinggi listitemnya sama seperti listitem yang ada props secondarynya */}
                            <Grid item style={{ visibility: "hidden" }}>
                              <Typography variant="subtitle1">
                                {"\u200B"}
                              </Typography>
                              <Typography variant="caption">
                                {"\u200B"}
                              </Typography>
                            </Grid>
                          </Grid>
                        }
                      />
                    </Hidden>

                    {/* Isi ListItem Desktop = nama dan icon event*/}
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
                          <Avatar className={classes.listIcon}>
                            <EventNoteIcon />
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          style={{ margin: "6px 0" }}
                          primary={
                            <Grid container alignItems="center">
                              <Typography variant="h6" color="textPrimary">
                                {eventInfo.name}
                              </Typography>

                              {/* bagian ini ditambahkan agar tinggi listitemnya sama seperti listitem yang ada props secondarynya */}
                              <Grid item style={{ visibility: "hidden" }}>
                                <Grid container direction="column">
                                  <Typography variant="h6">
                                    {"\u200B"}
                                  </Typography>
                                  <Typography variant="body2">
                                    {"\u200B"}
                                  </Typography>
                                </Grid>
                              </Grid>
                            </Grid>
                          }
                        />
                      </div>
                    </Hidden>

                    {/* IconButton lihat, sunting, hapus */}
                    <ListItemText
                      align="right"
                      primary={
                        <Grid container spacing={1} justify="flex-end">
                          {/* IconButton - lihat */}
                          <Grid item>
                            <LightTooltip title="Lihat Lebih Lanjut">
                              <Link to={`/kegiatan/${eventInfo._id}`}>
                                <IconButton
                                  size="small"
                                  className={classes.viewEventButton}
                                >
                                  <PageviewIcon fontSize="small" />
                                </IconButton>
                              </Link>
                            </LightTooltip>
                          </Grid>

                          {/* IconButton - sunting */}
                          <Grid item>
                            <LightTooltip title="Sunting">
                              <Link to={`/sunting-kegiatan/${eventInfo._id}`}>
                                <IconButton
                                  size="small"
                                  className={classes.editEventButton}
                                >
                                  <EditIcon fontSize="small" />
                                </IconButton>
                              </Link>
                            </LightTooltip>
                          </Grid>

                          {/* IconButton - hapus */}
                          <Grid item>
                            <LightTooltip title="Hapus">
                              <IconButton
                                size="small"
                                className={classes.deleteEventButton}
                                onClick={() => {
                                  deleteEvent(eventInfo._id).then(() => {
                                    getAllEvents();
                                  })
                                }}
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </LightTooltip>
                          </Grid>

                        </Grid>
                      }
                    />
                  </ListItem>
                </Paper>
              </Grid>
            );
          })
        }
      </Grid>

      {(role != "Admin") ?
        <>
          <CalendarListToolbar
            classes={classes}
            role={role}
            type="Task"
          />
          <Divider variant="inset" className={classes.titleDivider} />
          <Grid container direction="column" spacing={2} style={{marginBottom: "32px"}}>
            {(role === "Student") ? listTasks() : listTasksTeacher()}
          </Grid>
          <CalendarListToolbar
            classes={classes}
            role={role}
            type="Quiz"
          />
          <Divider variant="inset" className={classes.titleDivider} />
          <Grid container direction="column" spacing={2} style={{marginBottom: "32px"}}>
            {(role === "Student") ?
              <ListAssessments
                category={null}
                subject={{}}
                type="Kuis"
                tab="pekerjaan-kelas"
                all_assessments={all_assessments}
                classId={classId}
                classes={classes}
                all_subjects_map={all_subjects_map}
                all_teachers={all_teachers}
                getSelectedDate={getSelectedDate}
              />
            : listAssessmentsTeacher("Kuis")}
          </Grid>
          <CalendarListToolbar
            classes={classes}
            role={role}
            type="Exam"
          />
          <Divider variant="inset" className={classes.titleDivider} />
          <Grid container direction="column" spacing={2} style={{marginBottom: "32px"}}>
            {(role === "Student") ?
              <ListAssessments
                category={null}
                subject={{}}
                type="Ujian"
                tab="pekerjaan-kelas"
                all_assessments={all_assessments}
                classId={classId}
                classes={classes}
                all_subjects_map={all_subjects_map}
                all_teachers={all_teachers}
                getSelectedDate={getSelectedDate}
              />
            : listAssessmentsTeacher("Ujian")}
          </Grid>
        </>
      : null}
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