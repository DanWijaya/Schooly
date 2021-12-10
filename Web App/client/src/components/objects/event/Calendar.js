import React from "react";
import { Link } from "react-router-dom";
import { Calendar as ReactCalendar } from "react-calendar";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import moment from "moment";
import { getSelectedClasses, getAllClass } from "../../../actions/ClassActions";
import { getAllEvents, getOneEvent } from "../../../actions/EventActions";
import {
  downloadFileEvent,
  viewFileEvent,
} from "../../../actions/files/FileEventActions";
import { getAllSubjects } from "../../../actions/SubjectActions";
import { getStudents, getTeachers } from "../../../actions/UserActions";
import {
  getTasksBySubjectClass,
  getAllTask,
} from "../../../actions/TaskActions";
import {
  getAssessments,
  getAllAssessments,
} from "../../../actions/AssessmentActions";
import { getSetting } from "../../../actions/SettingActions";
import "./Calendar.css";
import Event from "./Event";
import {
  Avatar,
  Checkbox,
  Dialog,
  Fab,
  FormControlLabel,
  FormGroup,
  Grid,
  Hidden,
  IconButton,
  MenuItem,
  Select,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Tooltip,
  Typography,
  useMediaQuery,
} from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";
import {
  Add as AddIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  EventNote as EventNoteIcon,
  Today as TodayIcon,
} from "@material-ui/icons";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import { BsClipboardData } from "react-icons/bs";
import { FaClipboardList } from "react-icons/fa";

const useStyles = makeStyles((theme) => ({
  root: {
    margin: "auto",
    padding: "20px",
    paddingTop: "25px",
    maxWidth: "80%",
    [theme.breakpoints.down("md")]: {
      maxWidth: "100%",
    },
  },
  header: {
    marginBottom: "25px",
  },
  headerIcon: {
    backgroundColor: theme.palette.primary.main,
    color: "white",
    fontSize: "20px",
  },
  toolbar: {
    padding: "10px 0px",
  },
  createEventButton: {
    boxShadow:
      "0px 1px 2px 0px rgba(194,100,1,0.3), 0px 2px 6px 2px rgba(194,100,1,0.15)",
    backgroundColor: theme.palette.success.main,
    color: "white",
    "&:focus, &:hover": {
      backgroundColor: theme.palette.success.main,
      color: "white",
    },
  },
  dateCircleHighlight: {
    width: "3rem",
    height: "3rem",
    backgroundColor: theme.palette.primary.main,
    color: "white",
  },
  calendarModeSelect: {
    width: "40px",
  },
  shadow: {
    boxShadow:
      "0 14px 18px -28px rgba(0,0,0,0.8), 0 10px 10px -10px rgba(0,0,0,0.15)",
  },

  calendar: {
    border: "none",
  },
  dayAgendaContainer: {
    display: "flex",
    flexDirection: "column",
    height: "600px",
    overflow: "auto",
    flex: 1,
  },
  dayTableCell: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    borderBottom: "none",
    overflow: "none",
  },
  todayTile: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    borderRadius: "50%",
    width: "1.9rem",
    height: "1.9rem",
    backgroundColor: "#195DE5",
    color: "white",
    [theme.breakpoints.down("sm")]: {
      width: "1.6rem",
      height: "1.6rem",
    },
  },
  selectedTile: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    width: "1.9rem",
    height: "1.9rem",
    backgroundColor: "#C9DCFD",
    [theme.breakpoints.down("sm")]: {
      width: "1.6rem",
      height: "1.6rem",
    },
  },
  notSelectedTile: {
    "&:hover": {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      position: "absolute",
      width: "1.9rem",
      height: "1.9rem",
      backgroundColor: "#EFEFEF",
      [theme.breakpoints.down("sm")]: {
        width: "1.6rem",
        height: "1.6rem",
      },
    },
  },
  holidayTile: {
    color: "#D10000",
    "&:hover": {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      position: "absolute",
      width: "1.9rem",
      height: "1.9rem",
      backgroundColor: "#EFEFEF",
      [theme.breakpoints.down("sm")]: {
        width: "1.6rem",
        height: "1.6rem",
      },
    },
  },
  calendarTile: {
    borderRadius: "100%",
    backgroundColor: theme.palette.primary.light,
  },
  monthDateTile: {
    padding: "2px 5px",
    "&:focus, &:hover, &:active": {
      background: "#E6E6E6",
      cursor: "pointer",
    },
  },
  selectedMonthDateTile: {
    padding: "2px 5px",
    background: "#C9DCFD",
    "&:focus, &:hover, &:active": {
      background: "#E6E6E6",
      cursor: "pointer",
    },
  },
  todayMonthDateTile: {
    borderRadius: "100%",
    background: "#195DE5",
    color: "white",
    "&:focus, &:hover, &:active": {
      background: "#E6E6E6",
      cursor: "pointer",
    },
    marginBlockStart: 0,
    marginBlockEnd: 0,
    padding: "2px 4px",
  },
  holidayMonthDateTile: {
    color: "#D10000",
    padding: "2px 5px",
    "&:focus, &:hover, &:active": {
      background: "#E6E6E6",
      cursor: "pointer",
    },
  },
  monthAgendaCell: {
    width: "14.2875%",
    maxWidth: "14.2875%",
    minWidth: "14.2875%",
    border: "1px solid rgba(224, 224, 224, 1)",
    verticalAlign: "top",
    padding: "10px 3px",
  },
  monthAgendaChip: {
    background: theme.palette.primary.main,
    color: "white",
    padding: "2px 3px",
    borderRadius: "4px",
    margin: "2px 0",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    maxWidth: "100%",
    "&:focus, &:hover, &:active": {
      cursor: "pointer",
    },
  },
  monthAgendaChipAdmin: {
    background: theme.palette.primary.main,
    color: "white",
    padding: "2px 3px",
    borderRadius: "4px",
    margin: "2px 0",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    maxWidth: "100%",
  },
  moreMonthAgendaChip: {
    background: "#E6E6E6",
    padding: "2px 3px",
    borderRadius: "4px",
    margin: "2px 0",
    "&:focus, &:hover, &:active": {
      cursor: "pointer",
    },
  },
  listItem: {
    padding: "6px 16px",
  },
  listIcon: {
    backgroundColor: theme.palette.primary.main,
  },
  holidayContainer: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "nowrap",
  },
  staticBlueChip: {
    backgroundColor: theme.palette.primary.main,
    borderRadius: "3px",
    overflow: "hidden",
    marginBottom: "2px",
    padding: "2px",
  },
  blueChip: {
    backgroundColor: theme.palette.primary.main,
    borderRadius: "3px",
    position: "absolute",
    overflow: "hidden",
    color: "white",
    zIndex: 2,
  },
  hoverPointerCursor: {
    "&:focus, &:hover": {
      cursor: "pointer",
    },
  },
  horizontalLine: {
    position: "relative",
    "&:after": {
      content: "",
      position: "absolute",
      borderRight: "2px green solid",
      transform: "translateX(-50%)",
    },
    "&:before": {
      content: "",
      position: "absolute",
      borderRight: "2px green solid",
      transform: "translateY(-50%)",
    },
    flexGrow: 1,
    marginLeft: "10px",
    overflow: "none",
  },
  table: {
    tableLayout: "fixed",
    overflow: "hidden",
  },
}));

function getMillisecondDiff(past, future) {
  return future.getTime() - past.getTime();
}

function getDayStart(date) {
  let temp = new Date(date.getTime());
  temp.setHours(0, 0, 0, 0);
  return temp;
}

function getDayEnd(date) {
  let temp = new Date(date.getTime());
  temp.setHours(23, 59, 59, 999);
  return temp;
}

function addTime(date, millisecond) {
  return new Date(date.getTime() + millisecond);
}

function substractTime(date, millisecond) {
  return new Date(date.getTime() - millisecond);
}

function ListAssessments(props) {
  const {
    category,
    subject,
    type,
    all_assessments,
    classId,
    classes,
    all_subjects_map,
    all_teachers,
    date,
    mainCounter,
    handleChangeCounter,
    mode,
    handleChangeList,
  } = props;

  let localCounter = mainCounter;

  function AssessmentListItem(props) {
    const [openDialog, setOpenDialog] = React.useState(false);
    const [currentDialogInfo, setCurrentDialogInfo] = React.useState({});

    const handleOpenDialog = (
      title,
      subject,
      teacher_name,
      start_date,
      end_date
    ) => {
      setCurrentDialogInfo({
        title,
        subject,
        teacher_name,
        start_date,
        end_date,
      });
      setOpenDialog(true);
    };

    const handleCloseDialog = () => {
      setOpenDialog(false);
    };

    return (
      <>
        <Typography
          variant="body2"
          className={classes.monthAgendaChip}
          align="left"
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
          {props.work_title}
        </Typography>
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
            <Typography variant="subtitle1" align="center">
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
      </>
    );
  }

  let AssessmentsList = [];
  let TeacherList = [];
  let result = [];

  let tempSelectedDate = new Date(date);

  if (Boolean(all_assessments.length)) {
    var i;
    for (i = all_assessments.length - 1; i >= 0; i--) {
      let assessment = all_assessments[i];
      let tempDeadlineDate = new Date(
        moment(assessment.start_date).locale("id")
      );
      let class_assigned = assessment.class_assigned;

      if (
        tempSelectedDate.getDate() === tempDeadlineDate.getDate() &&
        tempSelectedDate.getMonth() === tempDeadlineDate.getMonth() &&
        tempSelectedDate.getYear() === tempDeadlineDate.getYear() &&
        class_assigned.indexOf(classId) !== -1
      ) {
        for (let j = 0; j < all_teachers.length; j++) {
          if (all_teachers[j]._id === assessment.author_id) {
            TeacherList.push(all_teachers[j].name);
            break;
          }
        }
        AssessmentsList.push(assessment);
      }
    }
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
      if (type === "Kuis") {
        if (
          (!category ||
            (category === "subject" && assessment.subject === subject._id)) &&
          assessment.type === "Kuis" &&
          assessment.posted
        ) {
          if (mode === "Month") {
            if (localCounter < 3) {
              result.push({
                name: assessment.name,
                workCategoryAvatar: workCategoryAvatar,
                subject: assessment.subject,
                teacher_name: teacher_name,
                start_date: assessment.start_date,
                end_date: assessment.end_date,
                createdAt: assessment.createdAt,
                finished: assessment.submissions,
              });
            }
            localCounter++;
          } else {
            result.push({
              start_date: assessment.start_date,
              end_date: assessment.end_date,
              type: type,
              data: assessment,
            });
          }
        }
      }
      if (type === "Ujian") {
        if (
          (!category ||
            (category === "subject" && assessment.subject === subject._id)) &&
          assessment.type === "Ujian" &&
          assessment.posted
        ) {
          if (mode === "Month") {
            if (localCounter < 3) {
              result.push({
                name: assessment.name,
                workCategoryAvatar: workCategoryAvatar,
                subject: assessment.subject,
                teacher_name: teacher_name,
                start_date: assessment.start_date,
                end_date: assessment.end_date,
                createdAt: assessment.createdAt,
                finished: assessment.submissions,
              });
            }
            localCounter++;
          } else {
            result.push({
              start_date: assessment.start_date,
              end_date: assessment.end_date,
              type: type,
              data: assessment,
            });
          }
        }
      }
    }
  }
  if (mode === "Month") {
    handleChangeCounter(localCounter);
    return result.map((row) => (
      <AssessmentListItem
        work_title={row.name}
        work_category_avatar={row.workCategoryAvatar}
        work_subject={
          category === "subject" ? null : all_subjects_map.get(row.subject)
        }
        work_teacher_name={row.teacher_name}
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
  } else {
    console.log(result);
    handleChangeList(result);
    return;
  }
}

const MINIMUM_DURATION_MILLISECOND = 30 * 60 * 1000;
const TASK_DURATION_MILLISECOND = 30 * 60 * 1000;
const ROW_HEIGHT = 90;
const BOTTOM_PADDING = 2;
const TILE_HORIZONTAL_MARGIN = 10;

function CalendarToolbar(props) {
  const {
    classes,
    mode,
    handleChangeMode,
    handleOpenCreateDialog,
    currentDate,
    setCurrentDate,
    role,
    setSelectedDateReactCalendar,
    activeStartDate,
    setActiveStartDate,
  } = props;

  const handleChangeMonth = (direction) => {
    if (direction === "now") {
      setCurrentDate(new Date());
    } else if (direction === "next") {
      let nextMonthDate;
      if (currentDate.getMonth() === 11) {
        nextMonthDate = new Date(
          currentDate.getFullYear() + 1,
          0,
          currentDate.getDate()
        );
      } else {
        nextMonthDate = new Date(
          currentDate.getFullYear(),
          currentDate.getMonth() + 1,
          currentDate.getDate()
        );
      }
      setCurrentDate(nextMonthDate);
    } else {
      let prevMonthDate;
      if (currentDate.getMonth() === 0) {
        prevMonthDate = new Date(
          currentDate.getFullYear() - 1,
          11,
          currentDate.getDate()
        );
      } else {
        prevMonthDate = new Date(
          currentDate.getFullYear(),
          currentDate.getMonth() - 1,
          currentDate.getDate()
        );
      }
      setCurrentDate(prevMonthDate);
    }
  };

  const handleChangeDay = (direction) => {
    let time;
    if (direction === "now") {
      time = new Date();
    } else if (direction === "next") {
      time = new Date(currentDate.getTime() + 1000 * 60 * 60 * 24);
    } else {
      time = new Date(currentDate.getTime() - 1000 * 60 * 60 * 24);
    }
    setCurrentDate(time);
    setSelectedDateReactCalendar(time);
    if (
      time.getMonth() !== activeStartDate.getMonth() ||
      time.getFullYear() !== activeStartDate.getFullYear()
    ) {
      setActiveStartDate(
        new Date(time.getFullYear(), time.getMonth(), 1, 0, 0, 0, 0)
      );
    }
  };

  return (
    <div className={classes.toolbar}>
      <Grid container justify="space-between" alignItems="center">
        {mode === "Day" ? (
          <Grid item>
            <Tooltip title="Hari Sebelumnya">
              <IconButton size="small" onClick={() => handleChangeDay("prev")}>
                <ChevronLeftIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Hari ini">
              <IconButton onClick={() => handleChangeDay("now")}>
                <TodayIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Hari Selanjutnya">
              <IconButton size="small" onClick={() => handleChangeDay("next")}>
                <ChevronRightIcon />
              </IconButton>
            </Tooltip>
          </Grid>
        ) : (
          <Grid item>
            <Tooltip title="Hari Sebelumnya">
              <IconButton
                size="small"
                onClick={() => handleChangeMonth("prev")}
              >
                <ChevronLeftIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Hari ini">
              <IconButton onClick={() => handleChangeMonth("now")}>
                <TodayIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Hari Selanjutnya">
              <IconButton
                size="small"
                onClick={() => handleChangeMonth("next")}
              >
                <ChevronRightIcon />
              </IconButton>
            </Tooltip>
          </Grid>
        )}
        <Grid item>
          <Grid container alignItems="center" spacing={2}>
            <Grid item>
              {role === "Admin" ? (
                <Tooltip title="Buat Kegiatan">
                  <Fab
                    size="small"
                    className={classes.createEventButton}
                    onClick={() => handleOpenCreateDialog()}
                  >
                    <AddIcon fontSize="small" />
                  </Fab>
                </Tooltip>
              ) : null}
            </Grid>
            <Grid item>
              <Select
                variant="outlined"
                defaultValue="Day"
                value={mode}
                onChange={handleChangeMode}
                classes={{ root: classes.calendarModeSelect }}
              >
                <MenuItem value="Day">Hari</MenuItem>
                <MenuItem value="Month">Bulan</MenuItem>
              </Select>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
}

function Calendar(props) {
  const classes = useStyles();
  const theme = useTheme();

  const mdDown = useMediaQuery(theme.breakpoints.down("md"));

  const {
    getSelectedClasses,
    getAllClass,
    getAllEvents,
    getAllTask,
    getAllSubjects,
    getAllAssessments,
    getStudents,
    getTeachers,
    getSetting,
  } = props;

  const { all_tasks } = props.tasksCollection;
  const { user, all_students, all_teachers } = props.auth;
  const role = props.auth.user.role;
  const classId = user.kelas;

  const { all_user_files } = props.filesCollection;
  const { all_subjects_map } = props.subjectsCollection;
  const { all_assessments } = props.assessmentsCollection;
  const { selectedClasses, all_classes } = props.classesCollection;
  const { allEvents } = props.eventsCollection;
  const uploadLimit = props.settingsCollection.upload_limit;

  const [activeStartDate, setActiveStartDate] = React.useState(
    new Date(new Date().getFullYear(), new Date().getMonth())
  ); // set ke awal bulan sekarang

  // Event Dialog
  const [selectedEventInfo, setSelectedEventInfo] = React.useState({});
  const [openEventDialog, setOpenEventDialog] = React.useState(false);
  const [eventDialogMode, setEventDialogMode] = React.useState("");
  const [unmountEventDialog, setUnmountEventDialog] = React.useState(false);

  // Snackbar
  const [snackbarContent, setSnackbarContent] = React.useState("");
  const [severity, setSeverity] = React.useState("info");
  const [openSnackbar, setOpenSnackbar] = React.useState(false);

  // Calendar
  const today = new Date();
  const [mode, setMode] = React.useState("Day");
  const [currentDate, setCurrentDate] = React.useState(today);
  const [selectedDateMonthMode, setSelectedDateMonthMode] = React.useState(
    today
  );
  const [
    selectedDateReactCalendar,
    setSelectedDateReactCalendar,
  ] = React.useState(today);
  const [itemCount, setItemCount] = React.useState({
    event: 0,
    ujian: 0,
    kuis: 0,
    task: 0,
  });

  const [classCheckboxState, setClassCheckboxState] = React.useState({});

  const [scrollbarNode, setScrollbarNode] = React.useState(null);
  const [scrollbarWidth, setScrollbarWidth] = React.useState(0);

  const holiday = {
    [new Date(2021, 0, 1)]: ["Tahun Baru 2021 Masehi"],
    [new Date(2021, 1, 12)]: ["Tahun Baru Imlek 2572 Kongzili"],
    [new Date(2021, 2, 11)]: ["Isra Mikraj Nabi Muhammad SAW"],
    [new Date(2021, 2, 14)]: ["Hari Suci Nyepi Tahun Baru Saka 1943"],
    [new Date(2021, 3, 2)]: ["Wafat Isa Al Masih"],
    [new Date(2021, 4, 1)]: ["Hari Buruh Internasional"],
    [new Date(2021, 4, 13)]: [
      "Kenaikan Isa Al Masih",
      "Hari Raya Idul Fitri 1442 Hijriah",
    ],
    [new Date(2021, 4, 14)]: ["Hari Raya Idul Fitri 1442 Hijriah"],
    [new Date(2021, 4, 26)]: ["Hari Raya Waisak 2565"],
    [new Date(2021, 5, 1)]: ["Hari Lahir Pancasila"],
    [new Date(2021, 6, 20)]: ["Hari Raya Idul Adha 1442 Hijriah"],
    [new Date(2021, 7, 10)]: ["Tahun Baru Islam 1443 Hijriah"],
    [new Date(2021, 7, 17)]: ["Hari Kemerdekaan Republik Indonesia"],
    [new Date(2021, 9, 19)]: ["Maulid Nabi Muhammad SAW"],
    [new Date(2021, 11, 25)]: ["Hari Raya Natal"],
  };

  const [tileRows, setTileRows] = React.useState([]);
  const [maxTreeHeight, setMaxTreeHeight] = React.useState(0);
  const [highestTreeWidth, setHighestTreeWidth] = React.useState(0);
  const [allDayItems, setAllDayItems] = React.useState([]);

  React.useEffect(() => {
    getSelectedClasses(user.class_teached);
    getAllClass(user.unit);
    getAllEvents(user.unit);
    getAllTask(user.unit);
    getAllAssessments(user.unit);
    getStudents(user.unit);
    getTeachers(user.unit);
    getAllSubjects(user.unit, "map");
    getSetting();

    if (role === "Teacher") {
      setClassCheckboxState(
        Object.assign(
          {},
          ...user.class_teached.map((class_id) => ({ [class_id]: true }))
        )
      );
    }
  }, []);

  React.useEffect(() => {
    if (mode === "Day") {
      generateTiles(currentDate);

      let start = getDayStart(currentDate);
      let end = getDayEnd(currentDate);
      setItemCount({
        event: countEvent(start, end),
        kuis: countAssessment(start, end, "Kuis"),
        ujian: countAssessment(start, end, "Ujian"),
        task: countTask(start, end),
      });
    } else if (mode === "Month") {
      let start = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        1
      );
      let dayCount = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() + 1,
        0
      ).getDate();
      let end = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        dayCount,
        23,
        59,
        59,
        999
      );
      setItemCount({
        event: countEvent(start, end),
        kuis: countAssessment(start, end, "Kuis"),
        ujian: countAssessment(start, end, "Ujian"),
        task: countTask(start, end),
      });
    }
  }, [currentDate, mode]);

  React.useEffect(() => {
    if (all_tasks && Array.isArray(all_tasks) && all_assessments && allEvents) {
      generateTiles(currentDate);

      if (mode === "Day") {
        generateTiles(currentDate);

        let start = getDayStart(currentDate);
        let end = getDayEnd(currentDate);
        setItemCount({
          event: countEvent(start, end),
          kuis: countAssessment(start, end, "Kuis"),
          ujian: countAssessment(start, end, "Ujian"),
          task: countTask(start, end),
        });
      } else if (mode === "Month") {
        let start = new Date(
          currentDate.getFullYear(),
          currentDate.getMonth(),
          1
        );
        let dayCount = new Date(
          currentDate.getFullYear(),
          currentDate.getMonth() + 1,
          0
        ).getDate();
        let end = new Date(
          currentDate.getFullYear(),
          currentDate.getMonth(),
          dayCount,
          23,
          59,
          59,
          999
        );
        setItemCount({
          event: countEvent(start, end),
          kuis: countAssessment(start, end, "Kuis"),
          ujian: countAssessment(start, end, "Ujian"),
          task: countTask(start, end),
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [all_tasks, all_assessments, allEvents]);

  React.useEffect(() => {
    if (scrollbarNode !== null && !mdDown && scrollbarWidth === 0) {
      setScrollbarWidth(scrollbarNode.offsetWidth - scrollbarNode.clientWidth);
    }
  }, [mdDown]);

  function generateTiles(currentDate) {
    let start = getDayStart(currentDate).getTime();
    let end = getDayEnd(currentDate).getTime();

    // memisahkan tile yang sepanjang hari dengan yang tidak sepanjang hari
    let allDayItems = [];
    let filteredData = generateDayModeList(currentDate).filter((item) => {
      let show = true;
      if (item.type !== "Tugas") {
        let startDateEpoch = new Date(item.start_date).getTime();
        let endDateEpoch = new Date(item.end_date).getTime();
        if (startDateEpoch <= start && endDateEpoch >= end) {
          allDayItems.push(item);
          show = false;
        }
      }
      return show;
    });
    setAllDayItems(allDayItems);
    setTileRows(placeDayModeTiles(filteredData, currentDate));
  }

  function placeDayModeTiles(arrayOfObject, currentDate) {
    /*
      bentuk arrayOfObject:
      {
        _id: <Assessment/Task/Event>._id,
        type: "Event"/"Tugas"/"Ujian"/"Kuis",
        data: dokumen suatu <Assessment/Task/Event> dari db,

        // jika type === bukan "Tugas"
        start_date: <Assessment/Event>.start_date, // masih dalam bentuk string
        end_date: <Assessment/Event>.end_date, // masih dalam bentuk string
        // kedua nilai untuk atribut ini akan diubah dan nilainya bisa berbeda dengan nilai "end_date" dan "start_date" pada atribut "data".
        // kedua nilai atribut ini akan digunakan untuk menghitung tinggi tile untuk object ini.

        // jika type === "Tugas"
        deadline: <Task>.deadline, // masih dalam bentuk string
        // object tugas akan ditambahkan atribut "start_date" dan "end_date" yang dihitung berdasarkan atribut ini
      }
    */
    let data = arrayOfObject.map((elm) => {
      let start_date;
      let end_date;

      if (elm.type === "Tugas") {
        // karena tugas tidak memiliki durasi,
        let offset = TASK_DURATION_MILLISECOND / 2;
        start_date = substractTime(new Date(elm.deadline), offset);
        end_date = addTime(new Date(elm.deadline), offset);
      } else {
        start_date = new Date(elm.start_date);
        end_date = new Date(elm.end_date);
      }

      // hide overflow durasi dari assessment atau event yang berada pada > 1 hari
      let start_at_current = isSameDate(start_date, currentDate);
      let end_at_current = isSameDate(end_date, currentDate);
      let currentDayStart = getDayStart(currentDate);
      let currentDayEnd = getDayEnd(currentDate);
      if (elm.type !== "Tugas") {
        if (!end_at_current && !start_at_current) {
          start_date = currentDayStart;
          end_date = currentDayEnd;
        } else if (!end_at_current && start_at_current) {
          end_date = currentDayEnd;

          if (
            getMillisecondDiff(start_date, currentDayEnd) <
            MINIMUM_DURATION_MILLISECOND
          ) {
            end_date = addTime(start_date, MINIMUM_DURATION_MILLISECOND);
            // titik paling bawah tile ini akan ada di bawah 23:59
          }
        } else if (end_at_current && !start_at_current) {
          start_date = currentDayStart;

          if (
            getMillisecondDiff(currentDayStart, end_date) <
            MINIMUM_DURATION_MILLISECOND
          ) {
            start_date = substractTime(end_date, MINIMUM_DURATION_MILLISECOND);
            // titik paling atas tile ini akan ada di atas 00:00
          }
        } else {
          if (
            getMillisecondDiff(start_date, end_date) <
            MINIMUM_DURATION_MILLISECOND
          ) {
            end_date = addTime(start_date, MINIMUM_DURATION_MILLISECOND);
          }
        }
      } // tugas akan dibiarkan overflow ke atas 00:00 atau ke bawah 23:59

      return {
        ...elm,
        start_date,
        end_date,
        start_date_epoch: start_date.getTime(),
        end_date_epoch: end_date.getTime(),
      };
    });

    // sort data. data yang start date-nya lebih dulu akan ditempatkan di awal array (epoch asc)
    data.sort((a, b) => {
      return a.start_date_epoch - b.start_date_epoch;
    });

    // menempatkan setiap tile di posisi paling kiri yang masih bisa ditempati.
    // pada proses ini, lebar setiap tile diasumsikan 1/4 (lebar tile ketika 4 tile intersect). penentuan lebar akan dilakukan setelah bagian ini.
    let lastColElement = []; // menyimpan salinan data terbawah yang ditempatkan di tiap kolom.
    // traverse semua data/tile
    for (let i = 0; i <= data.length - 1; i++) {
      let currentData = data[i];
      let foundSpace = false;
      let col = 0;

      // loop hingga tile sudah ditempatkan / startColumn sudah diset
      while (!foundSpace) {
        if (col > lastColElement.length - 1) {
          // jika kolom ini tidak ada

          // tambah kolom baru
          lastColElement.push(currentData);
          // menempatkan data di kolom ini
          data[i].startColumn = col;
          // untuk mengakhiri while loop
          foundSpace = true;
        } else {
          // jika sudah ada minimal 1 tile yang menempati kolom ini

          if (
            !isIntersectExclusive(
              lastColElement[col].start_date_epoch,
              lastColElement[col].end_date_epoch,
              currentData.start_date_epoch,
              currentData.end_date_epoch
            )
          ) {
            // jika tile ini tidak intersect dengan tile terakhir pada kolom ini
            // letakan tile di kolom ini
            lastColElement[col] = currentData;
            data[i].startColumn = col;
            foundSpace = true;
          } else {
            // jika intersect, cek kolom selanjutnya (kolom di kanan kolom ini)
            col++;
          }
        }
      }
    }

    let columns = [];
    /*
    akan berisi:
      [
        [{ tile pertama pada kolom 1 }, { tile kedua dari atas pada kolom 1 }],
        [{ tile pertama pada kolom 2 }],
        [{ tile pertama pada kolom 3 }, { tile kedua dari atas pada kolom 3 }, { tile ketiga dari atas pada kolom 3 }],
        [{ tile pertama pada kolom 4 }, { tile kedua dari atas  pada kolom 4 }]
      ]
    */
    for (let d of data) {
      if (columns[d.startColumn]) {
        columns[d.startColumn].push(d);
      } else {
        columns[d.startColumn] = [d];
      }
    }

    /*
      menentukan lebar setiap tile. ide:
      - tile = node pada tree
      - setiap tile paling kiri = root sebuah tree
      - definisi height yang digunakan: tinggi tree yang hanya ada root = 0, tinggi tree yang ada 1 parent node dan 1 child node = 1
      - lebar tile = lebar layar / (height + 1)
    */
    let firstRoot = true;
    let maxTreeHeight = 0;
    let highestTreeWidth = 0;
    // traverse semua data/tile
    for (let i = 0; i <= data.length - 1; i++) {
      if (data[i].startColumn === 0) {
        // jika tile ini adalah root

        // cek apakah root ini intersect dengan salah satu node dari tree sebelumnya,
        let width = null;
        if (firstRoot === false) {
          for (let column of columns.slice(1)) {
            for (let tile of column) {
              // jika tile yang sedang dicek sudah sepenuhnya berada di bawah titik terbawah dari tile root,
              // akhiri loop karena tile-tile ini dan seterusnya pasti tidak intersect dengan tile root
              if (tile.start_date_epoch >= data[i].end_date_epoch) {
                break;
              }

              if (
                isIntersectExclusive(
                  tile.start_date_epoch,
                  tile.end_date_epoch,
                  data[i].start_date_epoch,
                  data[i].end_date_epoch
                ) &&
                tile.width
              ) {
                // jika root ini intersect dengan salah satu node dari tree sebelumnya, gunakan lebar tile pada tree tersebut
                width = tile.width;
                break;
              }
            }
          }
        }

        let treeHeight = getTreeHeight(data, columns, 0, data[i]);
        if (treeHeight > maxTreeHeight) {
          maxTreeHeight = treeHeight;

          // treeHeight ini akan dipakai untuk menghitung width jika root ini
          // tidak intersect dengan salah satu node dari tree sebelumnya
          highestTreeWidth =
            width ?? 100 / ((treeHeight > 3 ? 3 : treeHeight) + 1);
        }

        // set lebar semua tile di tree ini
        let subtree = new Set(getTree(data, columns, 0, data[i]));
        subtree.forEach((value) => {
          for (let j = 0; j <= data.length - 1; j++) {
            if (data[j]._id === value) {
              data[j].width =
                width ?? 100 / ((treeHeight > 3 ? 3 : treeHeight) + 1);
              break;
            }
          }
        });

        firstRoot = false;
      }
    }

    setHighestTreeWidth(highestTreeWidth);
    setMaxTreeHeight(maxTreeHeight);

    let tileRows = [];
    for (let d of data) {
      if (isSameDate(d.start_date, currentDate)) {
        if (tileRows[d.start_date.getHours()]) {
          tileRows[d.start_date.getHours()].push(d);
        } else {
          tileRows[d.start_date.getHours()] = [d];
        }
      } else {
        if (tileRows[0]) {
          tileRows[0].push(d);
        } else {
          tileRows[0] = [d];
        }
      }
    }
    return tileRows;
  }

  function getTreeHeight(data, columns, currentCol, currentNode) {
    if (currentCol === columns.length - 1) {
      return currentCol;
    }

    let rightTiles = columns[currentCol + 1];
    let intersectNodes = [];
    for (let i = 0; i <= rightTiles.length - 1; i++) {
      if (rightTiles[i].start_date_epoch >= currentNode.end_date_epoch) {
        break;
      }

      if (
        isIntersectExclusive(
          rightTiles[i].start_date_epoch,
          rightTiles[i].end_date_epoch,
          currentNode.start_date_epoch,
          currentNode.end_date_epoch
        )
      ) {
        intersectNodes.push(rightTiles[i]);
      }
    }
    if (intersectNodes.length === 0) {
      return currentCol;
    }
    let findMax = intersectNodes.map((node) =>
      getTreeHeight(data, columns, currentCol + 1, node)
    );
    return Math.max(...findMax);
  }

  function getTree(data, columns, currentCol, currentNode) {
    if (currentCol === columns.length - 1) {
      return [currentNode._id];
    }

    let rightTiles = columns[currentCol + 1];
    let intersectNodes = [];
    for (let i = 0; i <= rightTiles.length - 1; i++) {
      if (rightTiles[i].start_date_epoch >= currentNode.end_date_epoch) {
        break;
      }

      if (
        isIntersectExclusive(
          rightTiles[i].start_date_epoch,
          rightTiles[i].end_date_epoch,
          currentNode.start_date_epoch,
          currentNode.end_date_epoch
        )
      ) {
        intersectNodes.push(rightTiles[i]);
      }
    }
    if (intersectNodes.length === 0) {
      return [currentNode._id];
    }
    let arrayOfIdsArray = intersectNodes.map((node) =>
      getTree(data, columns, currentCol + 1, node)
    );
    let res = [currentNode._id];
    for (let arrayOfId of arrayOfIdsArray) {
      res = res.concat(arrayOfId);
    }
    return res;
  }

  function isIntersectExclusive(start1, end1, start2, end2) {
    return end2 > start1 && start2 < end1;
  }
  function isIntersectInclusive(start1, end1, start2, end2) {
    return end2 >= start1 && start2 <= end1;
  }

  const handleNextMonth = () => {
    setActiveStartDate(
      new Date(activeStartDate.setMonth(activeStartDate.getMonth() + 1))
    );
  };

  const handlePreviousMonth = () => {
    setActiveStartDate(
      new Date(activeStartDate.setMonth(activeStartDate.getMonth() - 1))
    );
  };

  const handleTileContent = (selectedDate) => {
    // untuk mengurangi jumlah pengecekan now === selectedDate,
    // pengecekan ini hanya dilakukan ketika selectedDate ada
    if (selectedDate) {
      return function ({ activeStartDate, date, view }) {
        if (view === "month") {
          // jika tanggal yang sedang dicek adalah tanggal hari ini
          if (isSameDate(new Date(), date)) {
            return (
              <div className={classes.todayTile}>
                <abbr>{date.getDate()}</abbr>
              </div>
            );
          }

          // jika tanggal yang sedang dicek adalah tanggal yang pernah terakhir diklik oleh pengguna
          if (isSameDate(selectedDate, date)) {
            return (
              <div className={classes.selectedTile}>
                <abbr>{date.getDate()}</abbr>
              </div>
            );
          }

          // jika tanggal yang sedang dicek adalah tanggal merah
          for (let holidayKey of Object.keys(holiday)) {
            if (isSameDate(new Date(holidayKey), date)) {
              return (
                <div className={classes.holidayTile}>
                  <abbr>{date.getDate()}</abbr>
                </div>
              );
            }
          }

          if (
            date.getDay() === 6 &&
            date.getMonth() == activeStartDate.getMonth()
          ) {
            return (
              <div
                style={{ color: "black" }}
                className={classes.notSelectedTile}
              >
                <abbr>{date.getDate()}</abbr>
              </div>
            );
          }
        }
        return (
          <div className={classes.notSelectedTile}>
            <abbr>{date.getDate()}</abbr>
          </div>
        );
      };
    } else {
      return function ({ activeStartDate, date, view }) {
        if (view === "month") {
          // jika tanggal yang sedang dicek adalah tanggal hari ini
          if (isSameDate(new Date(), date)) {
            return (
              <div className={classes.todayTile}>
                <abbr>{date.getDate()}</abbr>
              </div>
            );
          }

          // tidak mengecek now === selectedDate
        }
        return (
          <div className={classes.notSelectedTile}>
            <abbr>{date.getDate()}</abbr>
          </div>
        );
      };
    }
  };

  const scrollRef = React.useCallback((node) => {
    if (node !== null) {
      setScrollbarNode(node);
      setScrollbarWidth(node.offsetWidth - node.clientWidth);
    }
  }, []);

  // SNACKBAR
  const showSnackbar = (severity, snackbarContent) => {
    setOpenSnackbar(true);
    setSeverity(severity);
    setSnackbarContent(snackbarContent);
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  // EVENT DIALOG
  const handleOpenCreateDialog = () => {
    setEventDialogMode("create");
    handleUnsetUnmountEventDialog();
    setOpenEventDialog(true);
  };
  const handleOpenEditDialog = () => {
    setEventDialogMode("edit");
    setOpenEventDialog(true);
  };

  const handleOpenViewDialog = (eventInfo) => {
    setEventDialogMode("view");
    handleUnsetUnmountEventDialog();
    setOpenEventDialog(true);
    setSelectedEventInfo(eventInfo);
  };

  const handleCloseEventDialog = () => {
    setOpenEventDialog(false);
  };

  const handleSetUnmountEventDialog = () => {
    setUnmountEventDialog(true);
  };

  const handleUnsetUnmountEventDialog = () => {
    setUnmountEventDialog(false);
  };

  function listTasks(date, mainCounter = null, handleChangeCounter = null) {
    let result = [];
    let localCounter = mainCounter;
    let tasksByClass = [];
    if (Boolean(all_tasks.length)) {
      if (user.role === "Student") {
        all_tasks.map((task) => {
          if (localCounter < 3) {
            let class_assigned = task.class_assigned;
            for (var i = 0; i < class_assigned.length; i++) {
              if (class_assigned[i] === user.kelas) {
                tasksByClass.push(task);
              }
            }
          }
          return tasksByClass;
        });
      } else if (user.role === "Teacher") {
      }
    }

    tasksByClass.forEach((task) => {
      let tempSelectedDate = new Date(moment(date).locale("id"));
      let tempDeadlineDate = new Date(moment(task.deadline).locale("id"));

      let flag = true;
      let teacher_name;

      // Untuk sekarang yang ditampilkan adalah tugas dengan deadline pada tanggal yang sama
      // dengan selectedDate (tidak memperhitungkan jam, menit, detik)
      if (
        tempSelectedDate.getDate() === tempDeadlineDate.getDate() &&
        tempSelectedDate.getMonth() === tempDeadlineDate.getMonth() &&
        tempSelectedDate.getYear() === tempDeadlineDate.getYear()
      ) {
        if (mode === "Month") {
          if (localCounter < 3) {
            for (let i = 0; i < all_user_files.length; i++) {
              if (all_user_files[i].for_task_object === task._id) {
                flag = false;
                break;
              }
            }
            for (let i = 0; i < all_teachers.length; i++) {
              if (all_teachers[i]._id === task.person_in_charge_id) {
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
          localCounter++;
        } else {
          for (let i = 0; i < all_user_files.length; i++) {
            if (all_user_files[i].for_task_object === task._id) {
              flag = false;
              break;
            }
          }
          for (let i = 0; i < all_teachers.length; i++) {
            if (all_teachers[i]._id === task.person_in_charge_id) {
              teacher_name = all_teachers[i].name;
            }
          }
          if (!all_subjects_map.get(task.subject)) {
            flag = false;
          }
          if (flag) {
            result.push({
              _id: task._id,
              deadline: task.deadline,
              type: "Tugas",
              data: task,
            });
          }
        }
      }
    });

    if (mode === "Month") {
      handleChangeCounter(localCounter);
    }
    return result;
  }

  function listTasksTeacher(
    date,
    mainCounter = null,
    handleChangeCounter = null
  ) {
    if (classCheckboxState) {
      let tempSelectedDate = date;
      let localCounter = mainCounter;
      let result = [];
      let classCheckList = Object.entries(classCheckboxState);
      let selectedClassCheckList = [];
      for (let classItem of classCheckList) {
        if (classItem[1]) {
          selectedClassCheckList.push(classItem[0]);
        }
      }
      for (let i = 0; i < all_tasks.length; i++) {
        let tempDeadlineDate = new Date(
          moment(all_tasks[i].deadline).locale("id")
        );
        let classFound = false;
        for (let classId of all_tasks[i].class_assigned) {
          if (selectedClassCheckList.includes(classId)) {
            classFound = true;
            break;
          }
        }
        if (
          all_tasks[i].person_in_charge_id === user._id &&
          tempSelectedDate.getDate() === tempDeadlineDate.getDate() &&
          tempSelectedDate.getMonth() === tempDeadlineDate.getMonth() &&
          tempSelectedDate.getYear() === tempDeadlineDate.getYear() &&
          classFound
        ) {
          let number_students_assigned = 0;
          for (let j = 0; j < all_students.length; j++) {
            if (all_tasks[i].class_assigned.includes(all_students[j].kelas)) {
              number_students_assigned = number_students_assigned + 1;
            }
          }
          if (
            Object.values(all_tasks[i].grades).length !==
            number_students_assigned
          ) {
            if (mode === "Month") {
              if (localCounter < 3) {
                let task = all_tasks[i];
                result.push({
                  _id: task._id,
                  name: task.name,
                  subject: task.subject,
                  deadline: task.deadline,
                  createdAt: task.createdAt,
                });
              }
              localCounter++;
            } else {
              let task = all_tasks[i];
              result.push({
                _id: task._id,
                deadline: task.deadline,
                type: "Tugas",
                data: task,
              });
            }
          }
        }
      }
      if (mode === "Month") {
        handleChangeCounter(localCounter);
      }
      return result;
    }
  }

  function listTasksAdmin(
    date,
    mainCounter = null,
    handleChangeCounter = null
  ) {
    if (classCheckboxState) {
      let tempSelectedDate = date;
      let localCounter = mainCounter;
      let result = [];
      let classCheckList = Object.entries(classCheckboxState);
      let selectedClassCheckList = [];
      for (let classItem of classCheckList) {
        if (classItem[1]) {
          selectedClassCheckList.push(classItem[0]);
        }
      }
      for (let i = 0; i < all_tasks.length; i++) {
        let tempDeadlineDate = new Date(
          moment(all_tasks[i].deadline).locale("id")
        );
        let classFound = false;
        for (let classId of all_tasks[i].class_assigned) {
          if (selectedClassCheckList.includes(classId)) {
            classFound = true;
            break;
          }
        }
        if (
          tempSelectedDate.getDate() === tempDeadlineDate.getDate() &&
          tempSelectedDate.getMonth() === tempDeadlineDate.getMonth() &&
          tempSelectedDate.getYear() === tempDeadlineDate.getYear() &&
          classFound
        ) {
          let number_students_assigned = 0;
          for (let j = 0; j < all_students.length; j++) {
            if (all_tasks[i].class_assigned.includes(all_students[j].kelas)) {
              number_students_assigned = number_students_assigned + 1;
            }
          }
          if (
            Object.values(all_tasks[i].grades).length !==
            number_students_assigned
          ) {
            if (mode === "Month") {
              if (localCounter < 3) {
                let task = all_tasks[i];
                result.push({
                  _id: task._id,
                  name: task.name,
                  subject: task.subject,
                  deadline: task.deadline,
                  createdAt: task.createdAt,
                });
              }
              localCounter++;
            } else {
              let task = all_tasks[i];
              result.push({
                _id: task._id,
                deadline: task.deadline,
                type: "Tugas",
                data: task,
              });
            }
          }
        }
      }
      if (mode === "Month") {
        handleChangeCounter(localCounter);
      }
      return result;
    }
  }

  function listAssessmentsStudentMonth(tempSelectedDate, type) {
    // menampilkan assessment jika ada submission yang belum selesai dinilai
    let category = null;
    let subject = {};
    let AssessmentsList = [];
    let TeacherList = [];
    let result = [];

    if (Boolean(all_assessments.length)) {
      var i;
      for (i = all_assessments.length - 1; i >= 0; i--) {
        let assessment = all_assessments[i];
        let class_assigned = assessment.class_assigned;

        if (
          isIntersectInclusive(
            new Date(assessment.start_date).getTime(),
            new Date(assessment.end_date).getTime(),
            getDayStart(tempSelectedDate).getTime(),
            getDayEnd(tempSelectedDate).getTime()
          ) &&
          class_assigned.indexOf(classId) !== -1
        ) {
          for (let j = 0; j < all_teachers.length; j++) {
            if (all_teachers[j]._id === assessment.author_id) {
              TeacherList.push(all_teachers[j].name);
              break;
            }
          }
          AssessmentsList.push(assessment);
        }
      }
      for (i = 0; i < AssessmentsList.length; i++) {
        let assessment = AssessmentsList[i];
        if (type === "Kuis") {
          if (
            (!category ||
              (category === "subject" && assessment.subject === subject._id)) &&
            assessment.type === "Kuis" &&
            assessment.posted
          ) {
            result.push({
              _id: assessment._id,
              start_date: assessment.start_date,
              end_date: assessment.end_date,
              type: type,
              data: assessment,
            });
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
              _id: assessment._id,
              start_date: assessment.start_date,
              end_date: assessment.end_date,
              type: type,
              data: assessment,
            });
          }
        }
      }
    }
    return result;
  }

  function listAssessmentsTeacher(
    tempSelectedDate,
    assessmentType,
    mainCounter = null,
    handleChangeCounter = null
  ) {
    // menampilkan assessment jika ada submission yang belum selesai dinilai
    if (classCheckboxState) {
      let result = [];
      let lowerCaseType = assessmentType === "Kuis" ? "kuis" : "ujian";
      let localCounter = mainCounter;
      let classCheckList = Object.entries(classCheckboxState);
      let selectedClassCheckList = [];
      for (let classItem of classCheckList) {
        if (classItem[1]) {
          selectedClassCheckList.push(classItem[0]);
        }
      }

      for (let i = 0; i < all_assessments.length; i++) {
        let assessment = all_assessments[i];
        console.log(assessment);
        // let tempDeadlineDate = new Date(moment(assessment.start_date).locale("id"));
        let classFound = false;
        if (
          assessment.type === assessmentType &&
          assessment.author_id === user._id
        ) {
          for (let classId of all_assessments[i].class_assigned) {
            if (selectedClassCheckList.includes(classId)) {
              classFound = true;
              break;
            }
          }
          if (
            isIntersectInclusive(
              new Date(assessment.start_date).getTime(),
              new Date(assessment.end_date).getTime(),
              getDayStart(tempSelectedDate).getTime(),
              getDayEnd(tempSelectedDate).getTime()
            ) &&
            classFound
          ) {
            if (mode === "Month") {
              if (localCounter < 3) {
                result.push({
                  _id: assessment._id,
                  title: assessment.name,
                  subject: assessment.subject,
                  createdAt: assessment.createdAt,
                  type: assessment.type,
                  start_date: assessment.start_date,
                  end_date: assessment.end_date,
                });
              }
              localCounter++;
            } else {
              result.push({
                _id: assessment._id,
                start_date: assessment.start_date,
                end_date: assessment.end_date,
                type: assessmentType,
                data: assessment,
              });
            }
          }
        }
      }
      if (mode === "Month") {
        handleChangeCounter(localCounter);
        return result.map((row) => {
          return (
            <Link to={`/daftar-${lowerCaseType}-terkumpul/${row._id}`}>
              <Typography
                variant="body2"
                className={classes.monthAgendaChip}
                align="left"
              >
                {row.title}
              </Typography>
            </Link>
          );
        });
      } else return result;
    }
  }

  function listAssessmentsAdmin(
    tempSelectedDate,
    assessmentType,
    mainCounter,
    handleChangeCounter
  ) {
    // menampilkan assessment jika ada submission yang belum selesai dinilai
    if (classCheckboxState) {
      let result = [];
      let lowerCaseType = assessmentType === "Kuis" ? "kuis" : "ujian";
      let localCounter = mainCounter;
      let classCheckList = Object.entries(classCheckboxState);
      let selectedClassCheckList = [];
      for (let classItem of classCheckList) {
        if (classItem[1]) {
          selectedClassCheckList.push(classItem[0]);
        }
      }

      for (let i = 0; i < all_assessments.length; i++) {
        let assessment = all_assessments[i];
        let classFound = false;
        if (assessment.type === assessmentType) {
          for (let classId of all_assessments[i].class_assigned) {
            if (selectedClassCheckList.includes(classId)) {
              classFound = true;
              break;
            }
          }
          if (
            isIntersectInclusive(
              new Date(assessment.start_date).getTime(),
              new Date(assessment.end_date).getTime(),
              getDayStart(tempSelectedDate).getTime(),
              getDayEnd(tempSelectedDate).getTime()
            ) &&
            classFound
          ) {
            if (mode === "Month") {
              if (localCounter < 3) {
                result.push({
                  _id: assessment._id,
                  title: assessment.name,
                  subject: assessment.subject,
                  createdAt: assessment.createdAt,
                  type: assessment.type,
                  start_date: assessment.start_date,
                  end_date: assessment.end_date,
                });
              }
              localCounter++;
            } else {
              result.push({
                _id: assessment._id,
                start_date: assessment.start_date,
                end_date: assessment.end_date,
                type: assessmentType,
                data: assessment,
              });
            }
          }
        }
      }
      if (mode === "Month") {
        handleChangeCounter(localCounter);
        return result.map((row) => {
          return (
            <Link to={`/daftar-${lowerCaseType}-terkumpul/${row._id}`}>
              <Typography
                variant="body2"
                className={classes.monthAgendaChip}
                align="left"
              >
                {row.title}
              </Typography>
            </Link>
          );
        });
      } else return result;
    }
  }

  const listEvent = (date, mainCounter, handleChangeCounter) => {
    let result = [];
    let filteredEvents = allEvents.filter((eventInfo) => {
      let start_date = new Date(eventInfo.start_date);
      let end_date = new Date(eventInfo.end_date);
      return (
        isIntersectInclusive(
          start_date.getTime(),
          end_date.getTime(),
          getDayStart(date).getTime(),
          getDayEnd(date).getTime()
        ) && eventInfo.to.includes(role)
      );
    });
    let localCounter = mainCounter;
    filteredEvents.forEach((eventInfo) => {
      if (mode === "Month") {
        if (localCounter < 3) {
          result.push(
            <Typography
              variant="body2"
              className={classes.monthAgendaChip}
              align="left"
              onClick={() => {
                handleOpenViewDialog(eventInfo);
              }}
            >
              {eventInfo.name}
            </Typography>
          );
        }
        localCounter++;
      } else {
        result.push({
          _id: eventInfo._id,
          start_date: eventInfo.start_date,
          end_date: eventInfo.end_date,
          type: "Event",
          data: eventInfo,
        });
      }
    });
    if (mode === "Month") {
      handleChangeCounter(localCounter);
      return { result, count: result.length };
    } else return result;
  };

  const listEventAdmin = (date, mainCounter, handleChangeCounter) => {
    let result = [];
    let filteredEvents = allEvents.filter((eventInfo) => {
      let start_date = new Date(eventInfo.start_date);
      let end_date = new Date(eventInfo.end_date);
      return (
        isIntersectInclusive(
          start_date.getTime(),
          end_date.getTime(),
          getDayStart(date).getTime(),
          getDayEnd(date).getTime()
        ) &&
        (eventInfo.author_id === user._id || eventInfo.to.includes("Admin"))
      );
    });
    let localCounter = mainCounter;
    filteredEvents.forEach((eventInfo) => {
      if (mode === "Month") {
        if (localCounter < 3) {
          result.push(
            <Typography
              variant="body2"
              className={classes.monthAgendaChip}
              align="left"
              onClick={() => {
                handleOpenViewDialog(eventInfo);
              }}
            >
              {eventInfo.name}
            </Typography>
          );
        }
        localCounter++;
      } else {
        result.push({
          _id: eventInfo._id,
          start_date: eventInfo.start_date,
          end_date: eventInfo.end_date,
          type: "Event",
          data: eventInfo,
        });
      }
    });
    if (mode === "Month") {
      handleChangeCounter(localCounter);
      return { result, count: result.length };
    } else return result;
  };

  const handleChangeDay = (direction) => {
    if (direction === "now") {
      setCurrentDate(new Date());
    } else if (direction === "next") {
      setCurrentDate(new Date(currentDate.getTime() + 1000 * 60 * 60 * 24));
    } else {
      setCurrentDate(new Date(currentDate.getTime() - 1000 * 60 * 60 * 24));
    }
  };

  const handleChangeMode = (event) => {
    if (event.target.value === "Day") {
      setSelectedDateReactCalendar(currentDate);
      if (
        currentDate.getMonth() !== activeStartDate.getMonth() ||
        currentDate.getFullYear() !== activeStartDate.getFullYear()
      ) {
        setActiveStartDate(
          new Date(
            currentDate.getFullYear(),
            currentDate.getMonth(),
            1,
            0,
            0,
            0,
            0
          )
        );
      }
    }
    setMode(event.target.value);
  };

  const handleOpenDayMode = (date) => {
    setSelectedDateMonthMode(date);
    setCurrentDate(date);
    setMode("Day");
  };

  const handleClickReactCalendar = (date) => {
    setSelectedDateReactCalendar(date);
    if (
      date.getFullYear() !== activeStartDate.getFullYear() ||
      date.getMonth() !== activeStartDate.getMonth()
    ) {
      setActiveStartDate(
        new Date(date.getFullYear(), date.getMonth(), 1, 0, 0, 0, 0)
      );
    }
    setCurrentDate(date);
    setMode("Day");
  };

  const isSameDate = (date_1, date_2) => {
    return (
      date_1.getDate() === date_2.getDate() &&
      date_1.getMonth() === date_2.getMonth() &&
      date_1.getYear() === date_2.getYear()
    );
  };

  const timeRows = [
    "00:00",
    "01:00",
    "02:00",
    "03:00",
    "04:00",
    "05:00",
    "06:00",
    "07:00",
    "08:00",
    "09:00",
    "10:00",
    "11:00",
    "12:00",
    "13:00",
    "14:00",
    "15:00",
    "16:00",
    "17:00",
    "18:00",
    "19:00",
    "20:00",
    "21:00",
    "22:00",
    "23:00",
  ];

  const dayNames = ["SEN", "SEL", "RAB", "KAM", "JUM", "SAB", "MIN"];

  function getMaxDate(month, year) {
    // Index dimulai dari 1
    // 1: Januari
    let months_31 = [1, 3, 5, 7, 8, 10, 12];
    let months_30 = [4, 6, 9, 11];
    if (months_31.includes(month)) {
      return 31;
    } else if (months_30.includes(month)) {
      return 30;
    } else {
      if ((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0) {
        return 29;
      } else {
        return 28;
      }
    }
  }

  const countEvent = (start, end) => {
    let count = 0;
    if (allEvents) {
      count = allEvents.filter(
        (eventInfo) =>
          isIntersectInclusive(
            new Date(eventInfo.start_date).getTime(),
            new Date(eventInfo.end_date).getTime(),
            start.getTime(),
            end.getTime()
          ) && eventInfo.to.includes(role)
      ).length;
    }
    return count;
  };

  const countTask = (start, end) => {
    let count = 0;
    if (all_tasks && Array.isArray(all_tasks)) {
      let startEpoch = start.getTime();
      let endEpoch = end.getTime();

      if (role === "Student") {
        count = all_tasks.filter(
          (taskInfo) =>
            taskInfo.class_assigned.includes(user.kelas) &&
            new Date(taskInfo.deadline).getTime() >= startEpoch &&
            new Date(taskInfo.deadline).getTime() <= endEpoch
        ).length;
      } else if (role === "Teacher") {
        count = all_tasks.filter(
          (taskInfo) =>
            taskInfo.person_in_charge_id === user._id &&
            Object.keys(taskInfo.grades).length !==
              all_students.reduce(
                (studentCount, studentInfo) =>
                  studentCount +
                  (taskInfo.class_assigned.includes(studentInfo.kelas) ? 1 : 0),
                0
              ) &&
            new Date(taskInfo.deadline).getTime() >= startEpoch &&
            new Date(taskInfo.deadline).getTime() <= endEpoch
        ).length;
      } else {
        // admin
        count = all_tasks.filter(
          (taskInfo) =>
            Object.keys(taskInfo.grades).length !==
              all_students.reduce(
                (studentCount, studentInfo) =>
                  studentCount +
                  (taskInfo.class_assigned.includes(studentInfo.kelas) ? 1 : 0),
                0
              ) &&
            new Date(taskInfo.deadline).getTime() >= startEpoch &&
            new Date(taskInfo.deadline).getTime() <= endEpoch
        ).length;
      }
    }
    return count;
  };

  const countAssessment = (start, end, type) => {
    let count = 0;
    if (all_assessments) {
      if (role === "Student") {
        count = all_assessments.filter(
          (assessmentInfo) =>
            assessmentInfo.type === type &&
            assessmentInfo.posted &&
            assessmentInfo.class_assigned.includes(user.kelas) &&
            isIntersectInclusive(
              new Date(assessmentInfo.start_date).getTime(),
              new Date(assessmentInfo.end_date).getTime(),
              start.getTime(),
              end.getTime()
            )
        ).length;
      } else if (role === "Teacher") {
        count = all_assessments.filter(
          (assessmentInfo) =>
            assessmentInfo.type === type &&
            assessmentInfo.author_id === user._id &&
            isIntersectInclusive(
              new Date(assessmentInfo.start_date).getTime(),
              new Date(assessmentInfo.end_date).getTime(),
              start.getTime(),
              end.getTime()
            )
        ).length;
      } else {
        // admin
        count = all_assessments.filter(
          (assessmentInfo) =>
            assessmentInfo.type === type &&
            isIntersectInclusive(
              new Date(assessmentInfo.start_date).getTime(),
              new Date(assessmentInfo.end_date).getTime(),
              start.getTime(),
              end.getTime()
            )
        ).length;
      }
    }
    return count;
  };

  const generateMonthDates = () => {
    let result = [];
    let firstDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      1,
      0,
      0,
      0,
      0
    );
    let count = 1;
    let i = 1;
    if (count > firstDate.getDay()) {
      count = count - 7;
      i = i - 7;
    }
    while (count <= firstDate.getDay()) {
      let tempDate = new Date(firstDate.getFullYear(), firstDate.getMonth(), 0);
      tempDate.setDate(tempDate.getDate() - (firstDate.getDay() - i) + 1);
      result.push(tempDate);
      count++;
      i++;
    }

    count = 1;
    i = 1;
    let isMaxDateFound = false;
    while (count <= 35 - firstDate.getDay()) {
      let tempDate = new Date(firstDate.getFullYear(), firstDate.getMonth(), 1);
      tempDate.setDate(tempDate.getDate() + i);
      result.push(tempDate);
      count++;
      i++;
      if (
        !isMaxDateFound &&
        tempDate.getDate() ===
          getMaxDate(tempDate.getMonth() + 1, tempDate.getYear())
      ) {
        isMaxDateFound = true;
      }
      if (count === 35 - firstDate.getDay() && !isMaxDateFound) {
        count = count - 7;
      }
      if (isMaxDateFound && 35 - firstDate.getDay() - count === 6) {
        break;
      }
    }
    return result;
  };

  const generateDates = () => {
    let currentMonthDates = generateMonthDates();
    if (currentMonthDates.length !== 0) {
      let result = [];
      let temp_row = [];
      for (let date of currentMonthDates) {
        temp_row.push(date);
        if (temp_row.length === 7) {
          result.push(temp_row);
          temp_row = [];
        }
      }
      return result;
    } else {
      return [[]];
    }
  };

  let agendaStates = {};
  if (role !== "Admin") {
    agendaStates = {
      checkedTask: true,
      checkedQuiz: true,
      checkedExam: true,
      checkedEvent: true,
    };
  } else {
    agendaStates = {
      checkedTask: false,
      checkedQuiz: false,
      checkedExam: false,
      checkedEvent: true,
    };
  }

  const [agendaCheckboxState, setAgendaCheckboxState] = React.useState(
    agendaStates
  );

  const handleChange = (event) => {
    const tempAgendaCheckboxState = { ...agendaCheckboxState };
    tempAgendaCheckboxState[event.target.name] = event.target.checked;
    setAgendaCheckboxState({ ...tempAgendaCheckboxState });
    console.log(agendaCheckboxState);
  };

  React.useEffect(() => {
    if (role === "Admin" && all_classes.length !== 0) {
      setClassCheckboxState(
        Object.assign(
          {},
          ...all_classes.map((kelas) => ({ [kelas._id]: true }))
        )
      );
    }
  }, [all_classes]);

  const handleChangeClassStates = (event) => {
    setClassCheckboxState({
      ...classCheckboxState,
      [event.target.name]: event.target.checked,
    });
  };

  React.useEffect(() => {
    if (all_tasks && Array.isArray(all_tasks) && all_assessments && allEvents) {
      generateTiles(currentDate);
    }
  }, [agendaCheckboxState, classCheckboxState]);

  const generateDayModeList = (date) => {
    let result = [];
    if (mode === "Day") {
      if (all_tasks && all_assessments && allEvents) {
        let taskList = [];
        let quizList = [];
        let examList = [];
        let eventList = [];
        if (role === "Student") {
          if (agendaCheckboxState.checkedTask) {
            taskList = listTasks(new Date(date));
          }
          if (agendaCheckboxState.checkedQuiz) {
            quizList = listAssessmentsStudentMonth(new Date(date), "Kuis");
          }
          if (agendaCheckboxState.checkedExam) {
            examList = listAssessmentsStudentMonth(new Date(date), "Ujian");
          }
          if (agendaCheckboxState.checkedEvent) {
            eventList = listEvent(new Date(date));
          }
        } else if (role === "Teacher" && classCheckboxState) {
          if (agendaCheckboxState.checkedTask) {
            taskList = listTasksTeacher(new Date(date));
          }
          if (agendaCheckboxState.checkedQuiz) {
            quizList = listAssessmentsTeacher(new Date(date), "Kuis");
          }
          if (agendaCheckboxState.checkedExam) {
            examList = listAssessmentsTeacher(new Date(date), "Ujian");
          }
          if (agendaCheckboxState.checkedEvent) {
            eventList = listEvent(new Date(date));
          }
        } else {
          if (classCheckboxState) {
            if (agendaCheckboxState.checkedTask) {
              taskList = listTasksAdmin(new Date(date));
            }
            if (agendaCheckboxState.checkedQuiz) {
              quizList = listAssessmentsAdmin(new Date(date), "Kuis");
            }
            if (agendaCheckboxState.checkedExam) {
              examList = listAssessmentsAdmin(new Date(date), "Ujian");
            }
            if (agendaCheckboxState.checkedEvent) {
              eventList = listEventAdmin(new Date(date));
            }
          }
        }
        result = [...taskList, ...quizList, ...examList, ...eventList];
      }
    }
    return result;
  };

  const hasHoliday = (currentDate) => {
    return (
      new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        currentDate.getDate()
      ) in holiday
    );
  };

  const showShadow = (currentDate, allDayItems) => {
    return hasHoliday(currentDate) || allDayItems.length !== 0;
  };

  let monthNames = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
  ];

  let stringDateDay =
    currentDate.getDate() +
    " " +
    monthNames[currentDate.getMonth()] +
    " " +
    currentDate.getFullYear();
  let stringDateMonth =
    monthNames[currentDate.getMonth()] + " " + currentDate.getFullYear();
  let stringDateMobile =
    monthNames[currentDate.getMonth()].slice(0, 3) +
    " " +
    currentDate.getFullYear();

  const generateDayModeCalendar = () => {
    return (
      <div className={classes.dayAgendaContainer}>
        <div
          className={
            showShadow(currentDate, allDayItems)
              ? `${classes.shadow} ${classes.holidayContainer}`
              : classes.holidayContainer
          }
          style={
            showShadow(currentDate, allDayItems)
              ? mdDown
                ? { padding: `0 16px 10px 26px` }
                : { padding: `0 ${16 + scrollbarWidth ?? 0}px 10px 26px` }
              : undefined
          }
        >
          <Typography variant="body2" style={{ visibility: "hidden" }}>
            00:00
          </Typography>
          <div
            style={{ display: "flex", flexDirection: "column", flexGrow: "1" }}
          >
            {hasHoliday(currentDate)
              ? holiday[
                  new Date(
                    currentDate.getFullYear(),
                    currentDate.getMonth(),
                    currentDate.getDate()
                  )
                ].map((holiday) => (
                  <div key={holiday} className={classes.staticBlueChip}>
                    <Typography style={{ color: "white" }} variant="body2">
                      {holiday}
                    </Typography>
                  </div>
                ))
              : null}
            {allDayItems.map((item) => (
              <div
                key={item._id}
                className={
                  item.type === "Event"
                    ? `${classes.hoverPointerCursor} ${classes.staticBlueChip}`
                    : classes.staticBlueChip
                }
                onClick={
                  item.type === "Event"
                    ? () => {
                        handleOpenViewDialog(item.data);
                      }
                    : undefined
                }
              >
                <Typography style={{ color: "white" }} variant="body2">
                  {item.data.name}
                </Typography>
              </div>
            ))}
          </div>
        </div>
        <TableContainer ref={scrollRef}>
          <Table>
            <TableBody>
              {timeRows.map((row, index) => {
                return (
                  <TableRow
                    key={row.name}
                    style={{ height: `${ROW_HEIGHT}px`, border: "none" }}
                  >
                    <TableCell
                      component="th"
                      scope="row"
                      className={classes.dayTableCell}
                    >
                      <Typography
                        color="textSecondary"
                        variant="body2"
                        style={{ width: "32px" }}
                      >
                        {row}
                      </Typography>
                      <div className={classes.horizontalLine}>
                        <div
                          style={{
                            paddingRight:
                              maxTreeHeight <= 3 ? undefined : "16px",
                            width:
                              maxTreeHeight <= 3
                                ? "100%"
                                : `calc(16px + ${
                                    maxTreeHeight * TILE_HORIZONTAL_MARGIN
                                  }px + ${
                                    maxTreeHeight + 1
                                  } * (${highestTreeWidth}% - ${
                                    (TILE_HORIZONTAL_MARGIN *
                                      (Math.floor(100 / highestTreeWidth) -
                                        1)) /
                                    Math.floor(100 / highestTreeWidth)
                                  }px))`,
                          }}
                        >
                          {/* tujuan dibuat seperti ini: menambahkan margin di ujung kanan garis horizontal */}
                          <div
                            style={{
                              border: "rgba(224, 224, 224, 1) .25px solid",
                              width: "100%",
                            }}
                          />
                        </div>

                        {tileRows[index]
                          ? tileRows[index].map((obj) => {
                              let verticalPadding = 8;
                              let widthPadding = 0;
                              let i = Math.floor(100 / obj.width);
                              if (i > 1) {
                                widthPadding =
                                  (TILE_HORIZONTAL_MARGIN * (i - 1)) / i;
                              }

                              let height =
                                ((obj.end_date_epoch - obj.start_date_epoch) /
                                  (1000 * 60) /
                                  60) *
                                  ROW_HEIGHT -
                                BOTTOM_PADDING;
                              let minHeight =
                                (MINIMUM_DURATION_MILLISECOND /
                                  (1000 * 60) /
                                  60) *
                                ROW_HEIGHT;
                              if (height < minHeight + verticalPadding) {
                                verticalPadding = 2;
                              }

                              return (
                                <div
                                  onClick={
                                    obj.type === "Event"
                                      ? () => {
                                          handleOpenViewDialog(obj.data);
                                        }
                                      : undefined
                                  }
                                  className={
                                    obj.type === "Event"
                                      ? `${classes.hoverPointerCursor} ${classes.blueChip}`
                                      : classes.blueChip
                                  }
                                  style={{
                                    transform: `translate(calc(100% * ${
                                      obj.startColumn
                                    } + ${
                                      obj.startColumn * TILE_HORIZONTAL_MARGIN
                                    }px), ${
                                      !isSameDate(
                                        obj.start_date,
                                        currentDate
                                      ) && isSameDate(obj.end_date, currentDate)
                                        ? ((-1 *
                                            getMillisecondDiff(
                                              obj.start_date,
                                              getDayStart(obj.end_date)
                                            )) /
                                            (1000 * 60) /
                                            60) *
                                          ROW_HEIGHT
                                        : (obj.start_date.getMinutes() / 60) *
                                          ROW_HEIGHT
                                    }px)`,
                                    height: `${height}px`,
                                    width: `calc(${obj.width}% - ${widthPadding}px)`,
                                    padding: `${verticalPadding}px 12px`,
                                  }}
                                >
                                  <Typography noWrap variant="body2">
                                    {obj.data.name}
                                  </Typography>
                                  <Typography variant="body2">
                                    {obj.type === "Tugas"
                                      ? moment(obj.data.deadline)
                                          .locale("id")
                                          .format("HH:mm")
                                      : `${moment(
                                          isSameDate(
                                            new Date(obj.data.start_date),
                                            currentDate
                                          )
                                            ? obj.data.start_date
                                            : obj.start_date.toUTCString()
                                        )
                                          .locale("id")
                                          .format("HH:mm")} – ${moment(
                                          isSameDate(
                                            new Date(obj.data.end_date),
                                            currentDate
                                          )
                                            ? obj.data.end_date
                                            : obj.end_date.toUTCString()
                                        )
                                          .locale("id")
                                          .format("HH:mm")}`}
                                  </Typography>
                                </div>
                              );
                            })
                          : null}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    );
  };

  const generateMonthModeCalendar = () => {
    let monthDates = generateDates();
    return (
      <div style={{ display: "flex", flexDirection: "row", marginTop: "10px" }}>
        <TableContainer component={Grid}>
          <Table className={classes.table}>
            <TableBody>
              <Hidden smUp>
                <TableRow style={{ verticalAlign: "bottom" }}>
                  {dayNames.map((day) => {
                    return (
                      <TableCell style={{ paddingBottom: "5px" }}>
                        <Typography align="center" variant="body2">
                          {day[0]}
                        </Typography>
                      </TableCell>
                    );
                  })}
                </TableRow>
              </Hidden>
              {monthDates.map((row, index) => generateDateAgenda(row, index))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    );
  };

  const generateDateAgenda = (date, index) => {
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "Mei",
      "Jun",
      "Jul",
      "Agu",
      "Sep",
      "Okt",
      "Nov",
      "Des",
    ];
    if (all_assessments && all_tasks && allEvents) {
      return (
        <TableRow style={{ height: "150px" }}>
          {date.map((column, columnIndex) => {
            let temp_date = new Date(column).getDate();
            let temp_date_withoutMonthNames = temp_date;
            if (temp_date === 1) {
              temp_date =
                temp_date + " " + monthNames[new Date(column).getMonth()];
            }
            let mainCounter = 0;
            const handleChangeCounter = (count) => {
              mainCounter = count;
            };

            let today = new Date();

            let taskList = null;
            if (agendaCheckboxState.checkedTask) {
              if (role === "Student") {
                taskList = listTasks(
                  new Date(column),
                  mainCounter,
                  handleChangeCounter
                );
              }
              if (role === "Teacher") {
                taskList = listTasksTeacher(
                  new Date(column),
                  mainCounter,
                  handleChangeCounter
                );
              }
              if (role === "Admin") {
                taskList = listTasksAdmin(
                  new Date(column),
                  mainCounter,
                  handleChangeCounter
                );
              }
            }

            let quizList = null;
            if (agendaCheckboxState.checkedQuiz) {
              if (role === "Student") {
                quizList = (
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
                    date={new Date(column)}
                    mainCounter={mainCounter}
                    handleChangeCounter={handleChangeCounter}
                    mode={mode}
                  />
                );
              }
              if (role === "Teacher") {
                quizList = listAssessmentsTeacher(
                  new Date(column),
                  "Kuis",
                  mainCounter,
                  handleChangeCounter
                );
              }
              if (role === "Admin") {
                quizList = listAssessmentsAdmin(
                  new Date(column),
                  "Kuis",
                  mainCounter,
                  handleChangeCounter
                );
              }
            }

            let examList = null;
            if (agendaCheckboxState.checkedExam) {
              if (role === "Student") {
                examList = (
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
                    date={new Date(column)}
                    mainCounter={mainCounter}
                    handleChangeCounter={handleChangeCounter}
                    mode={mode}
                  />
                );
              }
              if (role === "Teacher") {
                examList = listAssessmentsTeacher(
                  new Date(column),
                  "Ujian",
                  mainCounter,
                  handleChangeCounter
                );
              }
              if (role === "Admin") {
                examList = listAssessmentsAdmin(
                  new Date(column),
                  "Ujian",
                  mainCounter,
                  handleChangeCounter
                );
              }
            }

            let eventList = { result: null };
            if (agendaCheckboxState.checkedEvent) {
              if (role === "Admin") {
                eventList = listEventAdmin(
                  new Date(column),
                  mainCounter,
                  handleChangeCounter
                );
              } else {
                eventList = listEvent(
                  new Date(column),
                  mainCounter,
                  handleChangeCounter
                );
              }
            }

            return (
              <TableCell className={classes.monthAgendaCell}>
                {index === 0 ? (
                  columnIndex === 6 ? (
                    <Hidden xsDown>
                      <Typography
                        color="textSecondary"
                        variant="body2"
                        align="center"
                        style={{ color: "#D10000" }}
                      >
                        {dayNames[columnIndex]}
                      </Typography>
                    </Hidden>
                  ) : (
                    <Hidden xsDown>
                      <Typography
                        color="textSecondary"
                        variant="body2"
                        align="center"
                      >
                        {dayNames[columnIndex]}
                      </Typography>
                    </Hidden>
                  )
                ) : null}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    marginBottom: "5px",
                  }}
                >
                  {isSameDate(today, column) ? (
                    <>
                      <Hidden xsDown>
                        <Typography
                          color="textSecondary"
                          variant="body2"
                          className={classes.todayMonthDateTile}
                          align="center"
                          onClick={() => {
                            handleOpenDayMode(new Date(column));
                          }}
                        >
                          {temp_date}
                        </Typography>
                      </Hidden>
                      <Hidden smUp>
                        <Typography
                          color="textSecondary"
                          variant="body2"
                          className={classes.todayMonthDateTile}
                          align="center"
                          onClick={() => {
                            handleOpenDayMode(new Date(column));
                          }}
                        >
                          {temp_date_withoutMonthNames}
                        </Typography>
                      </Hidden>
                    </>
                  ) : isSameDate(selectedDateMonthMode, column) ? (
                    <>
                      <Hidden xsDown>
                        <Typography
                          color="textSecondary"
                          variant="body2"
                          className={classes.selectedMonthDateTile}
                          align="center"
                          onClick={() => {
                            handleOpenDayMode(new Date(column));
                          }}
                        >
                          {temp_date}
                        </Typography>
                      </Hidden>
                      <Hidden smUp>
                        <Typography
                          color="textSecondary"
                          variant="body2"
                          className={classes.selectedMonthDateTile}
                          align="center"
                          onClick={() => {
                            handleOpenDayMode(new Date(column));
                          }}
                        >
                          {temp_date_withoutMonthNames}
                        </Typography>
                      </Hidden>
                    </>
                  ) : new Date(
                      column.getFullYear(),
                      column.getMonth(),
                      column.getDate()
                    ) in holiday || column.getDay() == 0 ? (
                    <>
                      <Hidden xsDown>
                        <Typography
                          color="textSecondary"
                          variant="body2"
                          className={classes.holidayMonthDateTile}
                          align="center"
                          onClick={() => {
                            handleOpenDayMode(new Date(column));
                          }}
                        >
                          {temp_date}
                        </Typography>
                      </Hidden>
                      <Hidden smUp>
                        <Typography
                          color="textSecondary"
                          variant="body2"
                          className={classes.holidayMonthDateTile}
                          align="center"
                          onClick={() => {
                            handleOpenDayMode(new Date(column));
                          }}
                        >
                          {temp_date_withoutMonthNames}
                        </Typography>
                      </Hidden>
                    </>
                  ) : (
                    <>
                      <Hidden xsDown>
                        <Typography
                          color="textSecondary"
                          variant="body2"
                          className={classes.monthDateTile}
                          align="center"
                          onClick={() => {
                            handleOpenDayMode(new Date(column));
                          }}
                        >
                          {temp_date}
                        </Typography>
                      </Hidden>
                      <Hidden smUp>
                        <Typography
                          color="textSecondary"
                          variant="body2"
                          className={classes.monthDateTile}
                          align="center"
                          onClick={() => {
                            handleOpenDayMode(new Date(column));
                          }}
                        >
                          {temp_date_withoutMonthNames}
                        </Typography>
                      </Hidden>
                    </>
                  )}
                </div>
                {agendaCheckboxState.checkedTask && taskList !== null
                  ? taskList.map((row) => {
                      if (role !== "Admin") {
                        return (
                          <Link
                            to={
                              role === "Student"
                                ? `/tugas-murid/${row._id}`
                                : `/tugas-guru/${row._id}`
                            }
                          >
                            <Typography
                              variant="body2"
                              className={classes.monthAgendaChip}
                              align="left"
                            >
                              {row.name}
                            </Typography>
                          </Link>
                        );
                      } else {
                        return (
                          <Typography
                            variant="body2"
                            className={classes.monthAgendaChipAdmin}
                            align="left"
                          >
                            {row.name}
                          </Typography>
                        );
                      }
                    })
                  : null}
                {agendaCheckboxState.checkedQuiz ? quizList : null}
                {agendaCheckboxState.checkedExam ? examList : null}
                {agendaCheckboxState.checkedEvent ? eventList.result : null}
                {mainCounter > 3 ? (
                  <Typography
                    variant="body2"
                    className={classes.moreMonthAgendaChip}
                    align="left"
                    onClick={() => {
                      handleOpenDayMode(new Date(column));
                    }}
                  >
                    {mainCounter - 3} lagi
                  </Typography>
                ) : null}
              </TableCell>
            );
          })}
        </TableRow>
      );
    }
  };

  document.title = "Schooly | Kalender";

  return (
    <div className={classes.root}>
      <Grid
        container
        alignItems="center"
        spacing={2}
        className={classes.header}
      >
        <Grid item>
          <Avatar variant="rounded" className={classes.headerIcon}>
            <EventNoteIcon />
          </Avatar>
        </Grid>
        <Grid item>
          <Typography variant="h5" align="left">
            Kalender
          </Typography>
        </Grid>
      </Grid>
      <Grid container spacing={5}>
        <Grid item xs>
          <CalendarToolbar
            role={role}
            classes={classes}
            mode={mode}
            handleChangeMode={handleChangeMode}
            handleOpenCreateDialog={handleOpenCreateDialog}
            currentDate={currentDate}
            setCurrentDate={setCurrentDate}
            setSelectedDateReactCalendar={setSelectedDateReactCalendar}
            activeStartDate={activeStartDate}
            setActiveStartDate={setActiveStartDate}
          />
          <Grid
            container
            justify="space-between"
            alignItems="center"
            className={classes.shadow}
          >
            <Grid item>
              <Grid container alignItems="center" spacing={2}>
                <Grid item>
                  <Grid container direction="column" alignItems="center">
                    <Grid item>
                      <Typography variant="body2" color="primary">
                        {moment(currentDate)
                          .locale("id")
                          .format("dddd")
                          .slice(0, 3)
                          .toUpperCase()}
                      </Typography>
                    </Grid>
                    <Grid>
                      <Avatar className={classes.dateCircleHighlight}>
                        <Typography variant="h5">
                          {moment(currentDate).locale("id").format("DD")}
                        </Typography>
                      </Avatar>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item>
                  <Typography variant="h6">
                    <Hidden xsDown>
                      {mode === "Day" ? stringDateDay : stringDateMonth}
                    </Hidden>
                    <Hidden smUp>{stringDateMobile}</Hidden>
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          {mode === "Day"
            ? generateDayModeCalendar()
            : generateMonthModeCalendar()}
        </Grid>
        <Hidden smDown>
          <Grid item style={{ maxWidth: "300px" }}>
            <Grid container alignItems="center" justify="space-between">
              <Grid item style={{ paddingLeft: "0.6em" }}>
                <Typography>
                  {moment(activeStartDate).locale("id").format("MMMM YYYY")}
                </Typography>
              </Grid>
              <Grid item>
                <IconButton
                  size="small"
                  onClick={() => {
                    handlePreviousMonth();
                  }}
                >
                  <ChevronLeftIcon />
                </IconButton>
                <IconButton
                  size="small"
                  onClick={() => {
                    handleNextMonth();
                  }}
                >
                  <ChevronRightIcon />
                </IconButton>
              </Grid>
            </Grid>
            <ReactCalendar
              locale="id-ID"
              showFixedNumberOfWeeks
              onChange={(value) => {
                handleClickReactCalendar(value);
              }}
              value={selectedDateReactCalendar}
              className={classes.calendar}
              showNavigation={false}
              activeStartDate={activeStartDate}
              tileContent={handleTileContent(selectedDateReactCalendar)}
              formatShortWeekday={(locale, date) => {
                // mengubah nama hari dalam satu minggu jadi satu huruf
                return new Date(date).toLocaleDateString(locale, {
                  weekday: "long",
                })[0];
              }}
              view="month"
            />
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
              }}
            >
              <Typography style={{ marginTop: "15px" }}>Agenda</Typography>
              <FormGroup>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={agendaCheckboxState.checkedTask}
                      onChange={handleChange}
                      name="checkedTask"
                      color="primary"
                    />
                  }
                  label={`Tugas (${itemCount.task})`}
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={agendaCheckboxState.checkedQuiz}
                      onChange={handleChange}
                      name="checkedQuiz"
                      color="primary"
                    />
                  }
                  label={`Kuis (${itemCount.kuis})`}
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={agendaCheckboxState.checkedExam}
                      onChange={handleChange}
                      name="checkedExam"
                      color="primary"
                    />
                  }
                  label={`Ujian (${itemCount.ujian})`}
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={agendaCheckboxState.checkedEvent}
                      onChange={handleChange}
                      name="checkedEvent"
                      color="primary"
                    />
                  }
                  label={`Kegiatan (${itemCount.event})`}
                />
              </FormGroup>
            </div>
            {role === "Teacher" && selectedClasses !== null ? (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                }}
              >
                <Typography style={{ marginTop: "15px" }}>Kelas</Typography>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    height: "190px",
                    overflow: "auto",
                  }}
                >
                  {user.class_teached.map((class_id) => {
                    let temp = new Map(selectedClasses);
                    let kelas = temp.get(class_id);
                    let class_name = "";
                    if (kelas) {
                      class_name = kelas.name;
                    }
                    return (
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={classCheckboxState[class_id]}
                            onChange={handleChangeClassStates}
                            name={class_id}
                            color="primary"
                          />
                        }
                        label={class_name}
                      />
                    );
                  })}
                </div>
              </div>
            ) : null}
            {role === "Admin" && all_classes !== null ? (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                }}
              >
                <Typography style={{ marginTop: "15px" }}>Kelas</Typography>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    height: "190px",
                    overflow: "auto",
                  }}
                >
                  {all_classes.map((kelas) => {
                    let class_id = kelas._id;
                    let class_name = kelas.name;
                    if (Object.keys(classCheckboxState).length !== 0) {
                      return (
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={classCheckboxState[class_id]}
                              onChange={handleChangeClassStates}
                              name={class_id}
                              color="primary"
                            />
                          }
                          label={class_name}
                        />
                      );
                    }
                    return null;
                  })}
                </div>
              </div>
            ) : null}
          </Grid>
        </Hidden>
      </Grid>
      {unmountEventDialog ? null : (
        <Event
          downloadFileEvent={downloadFileEvent}
          selectedEventInfo={selectedEventInfo}
          getAllEvents={getAllEvents}
          uploadLimit={uploadLimit}
          eventDialogMode={eventDialogMode}
          openEventDialog={openEventDialog}
          handleCloseEventDialog={handleCloseEventDialog}
          handleOpenEditDialog={handleOpenEditDialog}
          handleSetUnmountEventDialog={handleSetUnmountEventDialog}
          viewFileEvent={viewFileEvent}
          showSnackbar={showSnackbar}
          user={user}
          getDayStart={getDayStart}
          getDayEnd={getDayEnd}
        />
      )}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={4000}
        onClose={() => handleCloseSnackbar()}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      >
        <Alert
          elevation={6}
          variant="filled"
          severity={severity}
          onClose={() => handleCloseSnackbar()}
        >
          {snackbarContent}
        </Alert>
      </Snackbar>
    </div>
  );
}

Calendar.propTypes = {
  auth: PropTypes.object.isRequired,
  eventsCollection: PropTypes.object.isRequired,
  filesCollection: PropTypes.object.isRequired,
  classesCollection: PropTypes.object.isRequired,
  subjectsCollection: PropTypes.object.isRequired,
  tasksCollection: PropTypes.object.isRequired,
  assessmentsCollection: PropTypes.object.isRequired,
  settingsCollection: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  eventsCollection: state.eventsCollection,
  filesCollection: state.filesCollection,
  classesCollection: state.classesCollection,
  subjectsCollection: state.subjectsCollection,
  tasksCollection: state.tasksCollection,
  assessmentsCollection: state.assessmentsCollection,
  settingsCollection: state.settingsCollection,
});

export default connect(mapStateToProps, {
  getAllClass,
  getAllEvents,
  getOneEvent,
  viewFileEvent,
  getSelectedClasses,
  getAllSubjects,
  getAllTask,
  getTasksBySubjectClass,
  getAllAssessments,
  getAssessments,
  getStudents,
  getTeachers,
  getSetting,
})(Calendar);
