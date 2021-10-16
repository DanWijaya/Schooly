import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { Bar, Pie } from "react-chartjs-2";
import PropTypes from "prop-types";
import moment from "moment";
import "moment/locale/id";
import { getAllTaskFilesByUser } from "../../../actions/UploadActions";
import { getAllTask } from "../../../actions/TaskActions";
import { getAllSubjects } from "../../../actions/SubjectActions";
import { setCurrentClass } from "../../../actions/ClassActions";
import { getAllAssessments } from "../../../actions/AssessmentActions";
import {
  getStudents,
  getStudentsByClass,
  getTeachers,
} from "../../../actions/UserActions";
import dashboardStudentBackground from "./DashboardStudentBackground.png";
import dashboardTeacherBackground from "./DashboardTeacherBackground.png";
import dashboardAdminBackground from "./DashboardAdminBackground.png";
import Empty from "../../misc/empty/Empty";
import LightTooltip from "../../misc/light-tooltip/LightTooltip";
import {
  Avatar,
  Badge,
  Button,
  Card,
  CardContent,
  Dialog,
  Divider,
  Fab,
  Grid,
  Hidden,
  IconButton,
  LinearProgress,
  List,
  ListItem,
  ListItemAvatar,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Paper,
  Tooltip,
  Typography,
} from "@material-ui/core";
import AvatarGroup from "@material-ui/lab/AvatarGroup";
import {
  Add as AddIcon,
  Announcement as AnnouncementIcon,
  ArrowBackIos as ArrowBackIosIcon,
  ArrowForwardIos as ArrowForwardIosIcon,
  AssignmentOutlined as AssignmentIcon,
  Pageview as PageviewIcon,
  Error as ErrorIcon,
  MenuBook as MenuBookIcon,
  Warning as WarningIcon,
  Web as WebIcon,
} from "@material-ui/icons";
import { withStyles } from "@material-ui/core/styles";
import { AiOutlineUserSwitch } from "react-icons/ai";
import { BsClipboardData } from "react-icons/bs";
import {
  FaClipboardList,
  FaChalkboard,
  FaChalkboardTeacher,
} from "react-icons/fa";

const styles = (theme) => ({
  root: {
    margin: "auto",
    padding: "20px",
    paddingTop: "25px",
    maxWidth: "80%",
    [theme.breakpoints.down("md")]: {
      maxWidth: "100%",
    },
  },
  welcomePaperStudent: {
    height: "250px",
    padding: "20px",
    color: "white",
    backgroundColor: theme.palette.primary.light,
    backgroundImage: `url(${dashboardStudentBackground})`,
    backgroundPosition: "right bottom",
    backgroundRepeat: "no-repeat",
    backgroundSize: "contain",
  },
  welcomePaperTeacher: {
    height: "250px",
    padding: "20px",
    color: "white",
    backgroundColor: theme.palette.primary.light,
    backgroundImage: `url(${dashboardTeacherBackground})`,
    backgroundPosition: "right bottom",
    backgroundRepeat: "no-repeat",
    backgroundSize: "contain",
  },
  welcomePaperAdmin: {
    height: "250px",
    padding: "20px",
    color: "white",
    backgroundColor: theme.palette.primary.light,
    backgroundImage: `url(${dashboardAdminBackground})`,
    backgroundPosition: "right bottom",
    backgroundRepeat: "no-repeat",
    backgroundSize: "contain",
  },
  createButton: {
    backgroundColor: theme.palette.success.main,
    color: "white",
    "&:focus, &:hover": {
      backgroundColor: "white",
      color: theme.palette.success.main,
    },
  },
  menuItem: {
    color: "black",
    "&:hover": {
      backgroundColor: theme.palette.success.main,
      "& .MuiListItemIcon-root, & .MuiListItemText-primary": {
        color: "white",
      },
    },
  },
  menuItemText: {
    color: "black",
    "&:hover": {
      color: "white",
    },
  },
  manageTaskButton: {
    backgroundColor: theme.palette.primary.main,
    color: "white",
    "&:focus, &:hover": {
      backgroundColor: "white",
      color: theme.palette.primary.main,
    },
  },
  manageTaskIcon: {
    width: theme.spacing(2.5),
    height: theme.spacing(2.5),
    marginRight: "7.5px",
  },
  manageHomeroomTeacherButton: {
    backgroundColor: theme.palette.primary.dark,
    color: "white",
    "&:focus, &:hover": {
      backgroundColor: "white",
      color: theme.palette.primary.dark,
    },
  },
  manageHomeroomTeacherIcon: {
    width: theme.spacing(2.5),
    height: theme.spacing(2.5),
    marginRight: "7.5px",
  },
  manageClassButton: {
    backgroundColor: theme.palette.primary.main,
    color: "white",
    "&:focus, &:hover": {
      backgroundColor: "white",
      color: theme.palette.primary.main,
    },
  },
  manageClassIcon: {
    width: theme.spacing(2.5),
    height: theme.spacing(2.5),
    marginRight: "7.5px",
  },
  paperGrid: {
    marginTop: "20px",
  },
  listItemPaper: {
    marginBottom: "10px",
  },
  listItem: {
    "&:focus, &:hover": {
      backgroundColor: theme.palette.primary.fade,
    },
  },
  assignmentLate: {
    backgroundColor: theme.palette.primary.main,
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
  graph: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    marginRight: "10px",
  },
  graphButtons: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: "10px",
    alignItems: "center",
  },
  greyBackground: {
    display: "flex",
    alignItems: "center",
    textAlign: "center",
    height: "100%",
    padding: "15px",
    backgroundColor: "#E3E5E5",
  },
});

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
                  <Avatar className={classes.assignmentLate}>
                    <AssignmentIcon />
                  </Avatar>
                </ListItemAvatar>
              </Hidden>
              <ListItemText
                primary={props.work_title}
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
  } = props;

  function AssessmentListItem(props) {
    // Dialog Kuis dan Ujian
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
            badgeContent={<WarningIcon className={classes.warningIcon} />}
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
                  <Typography variant="body1">{props.work_title}</Typography>
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
      </Grid>
    );
  }

  let AssessmentsList = [];
  let TeacherList = [];
  let result = [];
  if (Boolean(all_assessments.length)) {
    var i;
    for (i = all_assessments.length - 1; i >= 0; i--) {
      let assessment = all_assessments[i];
      let class_assigned = assessment.class_assigned;
      if (class_assigned.indexOf(classId) !== -1) {
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

    for (i = 0; i < AssessmentsList.length; i++) {
      let assessment = AssessmentsList[i];
      let teacher_name = TeacherList[i];
      let workCategoryAvatar =
        type === "Kuis" ? (
          <Avatar className={classes.assignmentLate}>
            <FaClipboardList />
          </Avatar>
        ) : (
          <Avatar className={classes.assignmentLate}>
            <BsClipboardData />
          </Avatar>
        );
      // let workStatus = "Belum Ditempuh"
      if (type === "Kuis") {
        if (
          (!category ||
            (category === "subject" && assessment.subject === subject._id)) &&
          !assessment.submissions &&
          assessment.type === "Kuis" &&
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
          !assessment.submissions &&
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
    return <Empty />;
  } else {
    return sortAscByCreatedAt(result).map((row) => (
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
      />
    ));
  }
}

function sortAscByCreatedAt(rows) {
  const stabilizedThis = rows.map((el, index) => [el, index]);
  const descendingComparator = (a, b, orderBy) => {
    if (b[orderBy] < a[orderBy]) {
      return -1;
    }
    if (b[orderBy] > a[orderBy]) {
      return 1;
    }
    return 0;
  };
  const comparator = (a, b) => descendingComparator(a, b, "createdAt");
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

function DashboardGraph(props) {
  const { scores, workType, names } = props;

  let label = [];
  for (let i = 0; i < scores.length; i++) {
    label.push(i + 1);
  }
  const state = {
    labels: label,
    datasets: [
      {
        label: [1, 2],
        backgroundColor: "#1976D2",
        borderColor: "rgba(0,0,0,0)",
        borderWidth: 2,
        data: scores,
        maxBarThickness: 60,
      },
    ],
  };

  return (
    // A react-chart hyper-responsively and continuously fills the available
    // space of its parent element automatically
    <div>
      <Bar
        data={state}
        options={{
          // title: {
          //   display: true,
          //   text: `Nilai ${workType} Anda`,
          //   fontSize: 16,
          //   fontStyle: "normal"
          // },
          legend: {
            display: false,
            position: "right",
          },
          scales: {
            yAxes: [
              {
                id: "first-y-axis",
                type: "linear",
                ticks: {
                  min: 0,
                  max: 100,
                },
              },
            ],
          },
          tooltips: {
            callbacks: {
              label: function (tooltipItem, data) {
                var label = names[tooltipItem.index] || "";

                if (label) {
                  label += ": ";
                }
                label += Math.round(tooltipItem.yLabel * 100) / 100;
                return label;
              },
            },
          },
        }}
        width="250px"
        height="270px"
      />
    </div>
  );
}

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      anchorEl: null,
      taskGraphCurrentSubject: null,
      quizGraphCurrentSubject: null,
      examGraphCurrentSubject: null,
      allowedSubjectIndex: null,
    };
  }

  componentDidMount() {
    const {
      getAllTask,
      getAllTaskFilesByUser,
      getAllSubjects,
      getAllAssessments,
      getStudentsByClass,
      getStudents,
      setCurrentClass,
      getTeachers,
    } = this.props;
    // const { all_subjects_map, all_subjects } = this.props.subjectsCollection;
    const { user, all_roles } = this.props.auth;
    if (user.role != all_roles.SUPERADMIN) {
      getAllTask(user.unit); // actions that make GET request to database.
      getAllSubjects(user.unit);
      getTeachers(user.unit);
      getAllSubjects(user.unit, "map");
      if (user.role === all_roles.STUDENT) {
        setCurrentClass(user.kelas);
      }
      if (user.role === "Student") {
        getStudentsByClass(user.kelas);
      }
      getAllAssessments(user.unit);
      getAllTaskFilesByUser(user._id); // The one that gets takfiles which is only for students.
      getStudents(user.unit);
    }

    // const { all_subjects_map } = this.props.subjectsCollection
    // let subjectArray = Object.keys(all_subjects_map)
  }

  componentWillUnmount() {
    clearInterval(this.intervalID);
  }

  // Create Button Menu
  handleMenuOpen = (event) => {
    this.setState({ anchorEl: event.currentTarget });
  };
  handleMenuClose = () => {
    this.setState({ anchorEl: null });
  };

  changeGraphSubject = (workType, direction, subjectsLength) => {
    if (workType === "Tugas") {
      let currentIndex = this.state.allowedSubjectIndex.indexOf(
        this.state.taskGraphCurrentSubject
      );
      if (direction === "Left") {
        let newIndex;
        if (currentIndex + 1 >= this.state.allowedSubjectIndex.length) {
          newIndex = 0;
        } else {
          newIndex = currentIndex + 1;
        }
        this.setState({
          taskGraphCurrentSubject: this.state.allowedSubjectIndex[newIndex],
        });
      } else if (direction === "Right") {
        let newIndex;
        if (currentIndex - 1 < 0) {
          newIndex = this.state.allowedSubjectIndex.length - 1;
        } else {
          newIndex = currentIndex - 1;
        }
        this.setState({
          taskGraphCurrentSubject: this.state.allowedSubjectIndex[newIndex],
        });
      }
    } else if (workType === "Kuis") {
      let currentIndex = this.state.allowedSubjectIndex.indexOf(
        this.state.quizGraphCurrentSubject
      );
      if (direction === "Left") {
        let newIndex;
        if (currentIndex + 1 >= this.state.allowedSubjectIndex.length) {
          newIndex = 0;
        } else {
          newIndex = currentIndex + 1;
        }
        this.setState({
          taskGraphCurrentSubject: this.state.allowedSubjectIndex[newIndex],
        });
      } else if (direction === "Right") {
        let newIndex;
        if (currentIndex - 1 < 0) {
          newIndex = this.state.allowedSubjectIndex.length - 1;
        } else {
          newIndex = currentIndex - 1;
        }
        this.setState({
          quizGraphCurrentSubject: this.state.allowedSubjectIndex[newIndex],
        });
      }
    } else if (workType === "Ujian") {
      let currentIndex = this.state.allowedSubjectIndex.indexOf(
        this.state.examGraphCurrentSubject
      );
      if (direction === "Left") {
        let newIndex;
        if (currentIndex + 1 >= this.state.allowedSubjectIndex.length) {
          newIndex = 0;
        } else {
          newIndex = currentIndex + 1;
        }
        this.setState({
          examGraphCurrentSubject: this.state.allowedSubjectIndex[newIndex],
        });
      } else if (direction === "Right") {
        let newIndex;
        if (currentIndex - 1 < 0) {
          newIndex = this.state.allowedSubjectIndex.length - 1;
        } else {
          newIndex = currentIndex - 1;
        }
        this.setState({
          examGraphCurrentSubject: this.state.allowedSubjectIndex[newIndex],
        });
      }
    }
  };

  render() {
    const { classes, tasksCollection } = this.props;
    const { user, all_students, all_teachers } = this.props.auth;
    const { kelas } = this.props.classesCollection;
    const { all_subjects_map, all_subjects } = this.props.subjectsCollection;
    const { all_assessments } = this.props.assessmentsCollection;
    const { all_user_files } = this.props.filesCollection;

    const classId = user.kelas;

    if (
      this.state.allowedSubjectIndex === null &&
      all_subjects.length !== 0 &&
      Object.keys(kelas).length !== 0
    ) {
      let allowedIndexes = [];
      for (let i = 0; i < all_subjects.length; i++) {
        if (kelas.subject_assigned.includes(all_subjects[i]._id)) {
          allowedIndexes.push(i);
        }
      }
      this.setState({ allowedSubjectIndex: allowedIndexes });
      if (
        this.state.taskGraphCurrentSubject === null &&
        all_subjects.length !== 0
      ) {
        let randomNumber =
          allowedIndexes[Math.floor(Math.random() * allowedIndexes.length)];
        this.setState({ taskGraphCurrentSubject: randomNumber });
      }
      if (
        this.state.quizGraphCurrentSubject === null &&
        all_subjects.length !== 0
      ) {
        let randomNumber =
          allowedIndexes[Math.floor(Math.random() * allowedIndexes.length)];
        this.setState({ quizGraphCurrentSubject: randomNumber });
      }
      if (
        this.state.examGraphCurrentSubject === null &&
        all_subjects.length !== 0
      ) {
        let randomNumber =
          allowedIndexes[Math.floor(Math.random() * allowedIndexes.length)];
        this.setState({ examGraphCurrentSubject: randomNumber });
      }
    }

    function graphTask(subjectIndex) {
      if (all_subjects[subjectIndex]) {
        let subject = all_subjects[subjectIndex]._id;
        let subjectScores = [];
        let subjectNames = [];
        for (let i = 0; i < tasksCollection.length; i++) {
          if (
            tasksCollection[i].grades &&
            tasksCollection[i].subject === subject
          ) {
            let keysArray = Object.keys(tasksCollection[i].grades);
            let valuesArray = Object.values(tasksCollection[i].grades);
            for (let j = 0; j < keysArray.length; j++) {
              if (keysArray[j] === user._id) {
                subjectScores.push(valuesArray[j]);
                subjectNames.push(tasksCollection[i].name);
                break;
              }
            }
          }
        }
        if (subjectScores.length !== 0) {
          return (
            <DashboardGraph
              scores={subjectScores}
              names={subjectNames}
              workType="Tugas"
            />
          );
        } else {
          return (
            <Grid item style={{ height: "270px", width: "250px" }}>
              <div className={classes.greyBackground}>
                <Typography
                  align="center"
                  color="textSecondary"
                  variant="subtitle1"
                >
                  Belum ada Tugas yang telah dinilai untuk mata pelajaran
                  terkait
                </Typography>
              </div>
            </Grid>
          );
        }
      } else {
        return (
          <Grid item style={{ height: "270px", width: "250px" }}>
            <div className={classes.greyBackground}>
              <Typography
                align="center"
                color="textSecondary"
                variant="subtitle1"
              >
                Belum ada Tugas yang telah dinilai untuk mata pelajaran terkait
              </Typography>
            </div>
          </Grid>
        );
      }
    }

    function graphAssessment(subjectIndex, type) {
      if (all_subjects[subjectIndex]) {
        let subject = all_subjects[subjectIndex]._id;
        let subjectScores = [];
        let subjectNames = [];
        if (type === "Kuis") {
          for (let i = 0; i < all_assessments.length; i++) {
            if (
              all_assessments[i].grades &&
              all_assessments[i].subject === subject &&
              all_assessments[i].type === "Kuis"
            ) {
              let keysArray = Object.keys(all_assessments[i].grades);
              let valuesArray = Object.values(all_assessments[i].grades);
              for (let j = 0; j < keysArray.length; j++) {
                if (keysArray[j] === user._id) {
                  subjectScores.push(valuesArray[j].total_grade);
                  subjectNames.push(all_assessments[i].name);
                  break;
                }
              }
            }
          }
        } else if (type === "Ujian") {
          for (let i = 0; i < all_assessments.length; i++) {
            if (
              all_assessments[i].grades &&
              all_assessments[i].subject === subject &&
              all_assessments[i].type === "Ujian"
            ) {
              let keysArray = Object.keys(all_assessments[i].grades);
              let valuesArray = Object.values(all_assessments[i].grades);
              for (let j = 0; j < keysArray.length; j++) {
                if (keysArray[j] === user._id) {
                  subjectScores.push(valuesArray[j].total_grade);
                  subjectNames.push(all_assessments[i].name);
                  break;
                }
              }
            }
          }
        }
        if (subjectScores.length !== 0) {
          return (
            <DashboardGraph
              scores={subjectScores}
              names={subjectNames}
              workType={type}
            />
          );
        } else {
          return (
            <Grid item style={{ height: "270px", width: "250px" }}>
              <div className={classes.greyBackground}>
                <Typography
                  align="center"
                  color="textSecondary"
                  variant="subtitle1"
                >
                  Belum ada {type} yang telah dinilai untuk mata pelajaran
                  terkait
                </Typography>
              </div>
            </Grid>
          );
        }
      } else {
        return (
          <Grid item style={{ height: "270px", width: "250px" }}>
            <div className={classes.greyBackground}>
              <Typography
                align="center"
                color="textSecondary"
                variant="subtitle1"
              >
                Belum ada {type} yang telah dinilai untuk mata pelajaran terkait
              </Typography>
            </div>
          </Grid>
        );
      }
    }

    function listTasks() {
      let result = [];
      tasksByClass.forEach((task) => {
        let flag = true;
        let teacher_name;
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
      });
      if (result.length === 0) {
        return <Empty />;
      } else {
        return sortAscByCreatedAt(result).map((row) => (
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
      let result = [];
      for (let i = 0; i < tasksCollection.length; i++) {
        if (tasksCollection[i].person_in_charge_id === user._id) {
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
        return <Empty />;
      } else {
        return sortAscByCreatedAt(result).map((row) => {
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
        return <Empty />;
      } else {
        return sortAscByCreatedAt(result).map((row) => {
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

    function showSubject(subjectIndex) {
      if (all_subjects[subjectIndex]) {
        return (
          <Typography align="center">
            {all_subjects[subjectIndex].name}
          </Typography>
        );
      } else return null;
    }

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
        console.log("Ini untuk guru");
      }
    }

    document.title = "Schooly | Beranda";

    return (
      <div className={classes.root}>
        {/*Nanti diimport semua isinya sisakan root doang */}
        <Paper
          elevation={0}
          className={
            user.role === "Student"
              ? classes.welcomePaperStudent
              : user.role === "Teacher"
              ? classes.welcomePaperTeacher
              : classes.welcomePaperAdmin
          }
        >
          <Typography variant="h4" gutterBottom>
            Selamat Datang, {user.name}
          </Typography>
          <Typography variant="h6">
            Apa yang ingin Anda kerjakan hari ini?
          </Typography>
        </Paper>
        <div style={{ marginTop: "20px" }}>
          {user.role === "Student" ? (
            <Grid container spacing={2}>
              <Grid
                item
                xs={12}
                md={7}
                container
                direction="column"
                spacing={2}
              >
                <Grid item>
                  <Card style={{ borderTop: "8px solid red" }}>
                    <CardContent>
                      <Typography variant="h6">Belum Dikerjakan</Typography>
                    </CardContent>
                    <Divider />
                    <CardContent>
                      <Typography gutterBottom>Tugas</Typography>
                      {listTasks()}
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item>
                  <Card style={{ borderTop: "8px solid yellow" }}>
                    <CardContent>
                      <Typography variant="h6">Akan Datang</Typography>
                    </CardContent>
                    <Divider />
                    <CardContent>
                      <Typography gutterBottom>Kuis</Typography>
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
                      />
                    </CardContent>
                    <CardContent>
                      <Typography gutterBottom>Ujian</Typography>
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
                      />
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item>
                  <Card style={{ borderTop: "8px solid green" }}>
                    <CardContent>
                      <Typography variant="h6">Baru Diperiksa</Typography>
                    </CardContent>
                    <Divider />
                    <CardContent>
                      Isi tugas, kuis, ujian yang baru diperiksa maks 5 paling
                      recent dari atas ke bawah.
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
              <Grid item xs={12} md={5}>
                <Card>
                  <CardContent>
                    <Typography variant="h6">Kegiatan Minggu Ini</Typography>
                  </CardContent>
                  <CardContent>
                    Vertical stepper isi yang kayak punya admin.
                  </CardContent>
                  <Divider />
                  <CardContent>
                    <div style={{ display: "flex", justifyContent: "center" }}>
                      <Button color="primary">Lihat Semua</Button>
                    </div>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          ) : user.role === "Teacher" ? (
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Card>
                  <CardContent>
                    <Typography variant="h6">Akses dengan Cepat</Typography>
                    <Typography color="textSecondary" paragraph>
                      Berikut adalah jumlah pemberitahuan dan pekerjaan yang
                      telah anda berikan.
                    </Typography>
                    <Grid container direction="column" spacing={2}>
                      <Grid item container spacing={4}>
                        <Grid
                          item
                          style={{ display: "flex", alignItems: "center" }}
                        >
                          <AnnouncementIcon
                            style={{
                              color: "grey",
                              marginRight: "10px",
                              fontSize: "25px",
                            }}
                          />
                          <Typography color="primary" display="inline">
                            1 <Hidden smUp>Pengumuman</Hidden>
                          </Typography>
                        </Grid>
                        <Grid
                          item
                          style={{ display: "flex", alignItems: "center" }}
                        >
                          <MenuBookIcon
                            style={{
                              color: "grey",
                              marginRight: "10px",
                              fontSize: "25px",
                            }}
                          />
                          <Typography color="primary" display="inline">
                            1 <Hidden smUp>Materi</Hidden>
                          </Typography>
                        </Grid>
                        <Grid
                          item
                          style={{ display: "flex", alignItems: "center" }}
                        >
                          <AssignmentIcon
                            style={{
                              color: "grey",
                              marginRight: "10px",
                              fontSize: "25px",
                            }}
                          />
                          <Typography color="primary" display="inline">
                            1 <Hidden smUp>Tugas</Hidden>
                          </Typography>
                        </Grid>
                        <Grid
                          item
                          style={{ display: "flex", alignItems: "center" }}
                        >
                          <FaClipboardList
                            style={{
                              color: "grey",
                              marginRight: "10px",
                              fontSize: "25px",
                            }}
                          />
                          <Typography color="primary" display="inline">
                            1 <Hidden smUp>Kuis</Hidden>
                          </Typography>
                        </Grid>
                        <Grid
                          item
                          style={{ display: "flex", alignItems: "center" }}
                        >
                          <BsClipboardData
                            style={{
                              color: "grey",
                              marginRight: "10px",
                              fontSize: "25px",
                            }}
                          />
                          <Typography color="primary" display="inline">
                            1 <Hidden smUp>Ujian</Hidden>
                          </Typography>
                        </Grid>
                      </Grid>
                      <Grid item container justify="flex-end">
                        <Fab
                          size="medium"
                          className={classes.createButton}
                          onClick={(event) => this.handleMenuOpen(event)}
                        >
                          <AddIcon />
                        </Fab>
                        <Menu
                          keepMounted
                          open={Boolean(this.state.anchorEl)}
                          onClose={this.handleMenuClose}
                          anchorEl={this.state.anchorEl}
                          getContentAnchorEl={null}
                          style={{ marginTop: "10px" }}
                          anchorOrigin={{
                            vertical: "bottom",
                            horizontal: "center",
                          }}
                          transformOrigin={{
                            vertical: "top",
                            horizontal: "center",
                          }}
                        >
                          <Link to="/buat-pengumuman">
                            <MenuItem className={classes.menuItem}>
                              <ListItemIcon>
                                <AnnouncementIcon />
                              </ListItemIcon>
                              <ListItemText
                                primary={
                                  <Typography className={classes.menuItemText}>
                                    Buat Pengumuman
                                  </Typography>
                                }
                              />
                            </MenuItem>
                          </Link>
                          <Link to="/buat-materi">
                            <MenuItem className={classes.menuItem}>
                              <ListItemIcon>
                                <MenuBookIcon />
                              </ListItemIcon>
                              <ListItemText
                                primary={
                                  <Typography className={classes.menuItemText}>
                                    Buat Materi
                                  </Typography>
                                }
                              />
                            </MenuItem>
                          </Link>
                          <Link to="/buat-tugas">
                            <MenuItem className={classes.menuItem}>
                              <ListItemIcon>
                                <AssignmentIcon />
                              </ListItemIcon>
                              <ListItemText
                                primary={
                                  <Typography className={classes.menuItemText}>
                                    Buat Tugas
                                  </Typography>
                                }
                              />
                            </MenuItem>
                          </Link>
                          <Link to="/buat-kuis">
                            <MenuItem className={classes.menuItem}>
                              <ListItemIcon>
                                <FaClipboardList />
                              </ListItemIcon>
                              <ListItemText
                                primary={
                                  <Typography className={classes.menuItemText}>
                                    Buat Kuis
                                  </Typography>
                                }
                              />
                            </MenuItem>
                          </Link>
                          <Link to="/buat-ujian">
                            <MenuItem className={classes.menuItem}>
                              <ListItemIcon>
                                <BsClipboardData />
                              </ListItemIcon>
                              <ListItemText
                                primary={
                                  <Typography className={classes.menuItemText}>
                                    Buat Ujian
                                  </Typography>
                                }
                              />
                            </MenuItem>
                          </Link>
                        </Menu>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={7}>
                <Card style={{ borderTop: "8px solid red" }}>
                  <CardContent>
                    <Typography variant="h6">Belum Diperiksa</Typography>
                  </CardContent>
                  <Divider />
                  <CardContent>
                    <Typography gutterBottom>Tugas</Typography>
                    {listTasksTeacher()}
                  </CardContent>
                  <CardContent>
                    <Typography gutterBottom>Kuis</Typography>
                    {listAssessmentsTeacher("Kuis")}
                  </CardContent>
                  <CardContent>
                    <Typography gutterBottom>Ujian</Typography>
                    {listAssessmentsTeacher("Ujian")}
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={5}>
                <Card>
                  <CardContent>
                    <Typography variant="h6">Kegiatan Minggu Ini</Typography>
                  </CardContent>
                  <CardContent>
                    Vertical stepper isi yang kayak punya admin.
                  </CardContent>
                  <Divider />
                  <CardContent>
                    <div style={{ display: "flex", justifyContent: "center" }}>
                      <Button color="primary">Lihat Semua</Button>
                    </div>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          ) : user.role === "Admin" ? (
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" paragraph>
                      Akses dengan Cepat
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6}>
                        <Card variant="outlined">
                          <CardContent>
                            <Grid container direction="column" spacing={3}>
                              <Grid item>
                                <Typography>
                                  Kelas dan Mata Pelajaran
                                </Typography>
                                <Grid
                                  container
                                  justify="space-between"
                                  alignItems="center"
                                  spacing={1}
                                >
                                  <Grid item>
                                    <Typography color="textSecondary">
                                      Terdapat {5} kelas di unit Anda.
                                    </Typography>
                                  </Grid>
                                  <Grid item>
                                    <Button
                                      variant="contained"
                                      color="secondary"
                                    >
                                      <AddIcon />
                                    </Button>
                                  </Grid>
                                </Grid>
                              </Grid>
                              <Grid item>
                                {/* Dua item dibawah di hide kalau emang tak ada apa2*/}
                                <Typography color="textSecondary" gutterBottom>
                                  Beberapa Murid berikut belum ditempatkan di
                                  kelas manapun.
                                </Typography>
                                <Grid
                                  container
                                  justify="space-between"
                                  alignItems="center"
                                  spacing={1}
                                >
                                  <Grid item>
                                    <AvatarGroup max={3}>
                                      <Avatar />
                                      <Avatar />
                                      <Avatar />
                                      <Avatar />
                                    </AvatarGroup>
                                  </Grid>
                                  <Grid item>
                                    <Button variant="outlined" color="primary">
                                      Atur
                                    </Button>
                                  </Grid>
                                </Grid>
                              </Grid>
                              <Grid item>
                                <Typography color="textSecondary" gutterBottom>
                                  Beberapa Guru berikut belum ditetapkan kelas
                                  atau mata pelajaran yang diajarnya.
                                </Typography>
                                <Grid
                                  container
                                  justify="space-between"
                                  alignItems="center"
                                  spacing={1}
                                >
                                  <Grid item>
                                    <AvatarGroup max={3}>
                                      <Avatar />
                                      <Avatar />
                                      <Avatar />
                                      <Avatar />
                                      <Avatar />
                                    </AvatarGroup>
                                  </Grid>
                                  <Grid item>
                                    <Button variant="outlined" color="primary">
                                      Atur
                                    </Button>
                                  </Grid>
                                </Grid>
                              </Grid>
                            </Grid>
                          </CardContent>
                        </Card>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Card variant="outlined">
                          <CardContent>
                            <Grid container direction="column" spacing={3}>
                              <Grid item>
                                <Typography>Pengumuman</Typography>
                                <Grid
                                  container
                                  justify="space-between"
                                  alignItems="center"
                                  spacing={1}
                                >
                                  <Grid item>
                                    <Typography color="textSecondary">
                                      Terdapat {5} kelas di unit Anda.
                                    </Typography>
                                  </Grid>
                                  <Grid item>
                                    <Button
                                      variant="contained"
                                      color="secondary"
                                    >
                                      <AddIcon />
                                    </Button>
                                  </Grid>
                                </Grid>
                              </Grid>
                              <Grid item>
                                //List pengumuman maks 5 buah recently
                              </Grid>
                            </Grid>
                          </CardContent>
                          <Divider />
                          <CardContent style={{ padding: "16px" }}>
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "center",
                              }}
                            >
                              <Button color="primary">Lihat Semua</Button>
                            </div>
                          </CardContent>
                        </Card>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={7}>
                <Paper>
                  Doughnut Chart isi jumlah murid guru, dan pengguna tidak aktif
                </Paper>
              </Grid>
              <Grid item xs={12} md={5}>
                <Card>
                  <CardContent>
                    <Typography variant="h6">Kegiatan Minggu Ini</Typography>
                  </CardContent>
                  <CardContent>
                    Vertical stepper isi timeline kegiatan minggu ini. Hijau
                    ceklis udah lewat, belum lewat warna biru.
                  </CardContent>
                  <Divider />
                  <CardContent>
                    <div style={{ display: "flex", justifyContent: "center" }}>
                      <Button color="primary">Lihat Semua</Button>
                    </div>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          ) : user.role === "SuperAdmin" ? (
            <Grid container spacing={2}>
              <Grid item xs={12} md={7}>
                <Card>
                  <CardContent>
                    <Grid container justify="space-between" alignItems="center">
                      <Grid item>
                        <Typography>Jumlah Pengguna</Typography>
                      </Grid>
                      <Grid item>
                        <Button variant="outlined" color="primary">
                          Lihat Semua
                        </Button>
                      </Grid>
                    </Grid>
                  </CardContent>
                  <Divider />
                  <List>
                    <ListItem>
                      <ListItemAvatar>
                        <Avatar variant="rounded">
                          <WebIcon />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={<Typography noWrap>Nama Unit</Typography>}
                        secondary={
                          <Grid
                            container
                            justify="flex-end"
                            alignItems="center"
                            spacing={1}
                          >
                            <Grid item xs>
                              <LinearProgress
                                //Ini bakal relatif valuenya dengan unit dengan jumlah terbanyak, yang terbanyak barnya full
                                variant="determinate"
                                value={70}
                              />
                            </Grid>
                            <Grid item>
                              <Typography variant="body2">100 orang</Typography>
                            </Grid>
                          </Grid>
                        }
                      />
                    </ListItem>
                  </List>
                </Card>
              </Grid>
              <Grid item xs={12} md={5}>
                <Card>
                  <CardContent>
                    <Typography>Pengelola Tidak Aktif</Typography>
                  </CardContent>
                  <Divider />
                  <List>
                    <ListItem>
                      <ListItemAvatar>
                        <Avatar />
                      </ListItemAvatar>
                      <ListItemText
                        primary={<Typography noWrap>Nama</Typography>}
                        secondary={<Typography noWrap>Nama Unit</Typography>}
                      />
                      <Button variant="outlined" color="primary">
                        Profil
                      </Button>
                    </ListItem>
                  </List>
                  <Divider />
                  <CardContent style={{ padding: "16px" }}>
                    <div style={{ display: "flex", justifyContent: "center" }}>
                      <Button color="primary">Lihat Semua Pengelola</Button>
                    </div>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          ) : null}
        </div>
      </div>
    );
  }
}

Dashboard.propTypes = {
  auth: PropTypes.object.isRequired,
  classesCollection: PropTypes.object.isRequired,
  subjectsCollection: PropTypes.object.isRequired,
  tasksCollection: PropTypes.object.isRequired,
  assessmentsCollection: PropTypes.object.isRequired,
  getAllSubjects: PropTypes.func.isRequired,
  getAllTask: PropTypes.func.isRequired,
  getAllTaskFilesByUser: PropTypes.func.isRequired,
  getAllAssessments: PropTypes.func.isRequired,
  getStudentsByClass: PropTypes.func.isRequired,
  getStudents: PropTypes.func.isRequired,
  getTeachers: PropTypes.func.isRequired,
  setCurrentClass: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  classesCollection: state.classesCollection,
  subjectsCollection: state.subjectsCollection,
  tasksCollection: state.tasksCollection,
  assessmentsCollection: state.assessmentsCollection,
  filesCollection: state.filesCollection,
});

export default withRouter(
  connect(mapStateToProps, {
    setCurrentClass,
    getAllSubjects,
    getTeachers,
    getStudents,
    getStudentsByClass,
    getAllTask,
    getAllAssessments,
    getAllTaskFilesByUser,
  })(withStyles(styles)(Dashboard))
);
