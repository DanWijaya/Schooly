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
  Fab,
  Grid,
  IconButton,
  Hidden,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Paper,
  Typography,
  ListItem,
  ListItemAvatar,
  Dialog,
  Avatar,
  Badge,
} from "@material-ui/core";
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
  Web as UnitIcon,
} from "@material-ui/icons";
import { withStyles } from "@material-ui/core/styles";
import { AiOutlineUserSwitch } from "react-icons/ai";
import { BsClipboardData } from "react-icons/bs";
import { FaChalkboard } from "react-icons/fa";
import { FaClipboardList } from "react-icons/fa";
import { FaChalkboardTeacher } from "react-icons/fa";

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
      getAllTask(user.unit); // actions yang membuat GET request ke Database.
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
      getAllTaskFilesByUser(user._id); // yang dapatin takfiles cuma berlaku untuk student soalnya
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
            <Grid item container spacing={3}>
              <Grid item xs={12} md={7} lg={8}>
                <Grid container direction="column" spacing={2}>
                  <Grid item>
                    <Paper style={{ padding: "20px" }}>
                      <Grid
                        container
                        justify="space-between"
                        alignItems="center"
                        style={{ marginBottom: "15px" }}
                      >
                        <Grid item>
                          <Grid container alignItems="center">
                            <AssignmentIcon
                              style={{
                                marginRight: "10px",
                                fontSize: "22px",
                                color: "grey",
                              }}
                            />
                            <Typography variant="h5" color="primary">
                              Tugas Anda
                            </Typography>
                          </Grid>
                        </Grid>
                        <Grid item>
                          <Link to="/daftar-tugas">
                            <LightTooltip title="Lihat Semua" placement="top">
                              <IconButton>
                                <PageviewIcon />
                              </IconButton>
                            </LightTooltip>
                          </Link>
                        </Grid>
                      </Grid>
                      <Grid container direction="column" spacing={1}>
                        {listTasks()}
                      </Grid>
                    </Paper>
                  </Grid>
                  <Grid item>
                    <Paper style={{ padding: "20px" }}>
                      <Grid
                        container
                        justify="space-between"
                        alignItems="center"
                        style={{ marginBottom: "15px" }}
                      >
                        <Grid item>
                          <Grid container alignItems="center">
                            <FaClipboardList
                              style={{
                                marginRight: "10px",
                                fontSize: "22px",
                                color: "grey",
                              }}
                            />
                            <Typography variant="h5" color="primary">
                              Kuis Yang Akan Datang
                            </Typography>
                          </Grid>
                        </Grid>
                        <Grid item>
                          <Link to="/daftar-kuis">
                            <LightTooltip title="Lihat Semua" placement="top">
                              <IconButton>
                                <PageviewIcon />
                              </IconButton>
                            </LightTooltip>
                          </Link>
                        </Grid>
                      </Grid>
                      <Grid container direction="column" spacing={1}>
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
                      </Grid>
                    </Paper>
                  </Grid>
                  <Grid item>
                    <Paper style={{ padding: "20px" }}>
                      <Grid
                        container
                        justify="space-between"
                        alignItems="center"
                        style={{ marginBottom: "15px" }}
                      >
                        <Grid item>
                          <Grid container alignItems="center">
                            <BsClipboardData
                              style={{
                                marginRight: "10px",
                                fontSize: "22px",
                                color: "grey",
                              }}
                            />
                            <Typography variant="h5" color="primary">
                              Ujian Yang Akan Datang
                            </Typography>
                          </Grid>
                        </Grid>
                        <Grid item>
                          <Link to="/daftar-ujian">
                            <LightTooltip title="Lihat Semua" placement="top">
                              <IconButton>
                                <PageviewIcon />
                              </IconButton>
                            </LightTooltip>
                          </Link>
                        </Grid>
                      </Grid>
                      <Grid container direction="column" spacing={1}>
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
                      </Grid>
                    </Paper>
                  </Grid>
                </Grid>
              </Grid>
              <Hidden smDown>
                <Grid item sm={12} md={5} lg={4}>
                  <Grid container direction="column" spacing={2}>
                    <Grid item>
                      <Paper style={{ padding: "20px" }}>
                        <Grid
                          container
                          justify="space-between"
                          alignItems="center"
                          style={{ marginBottom: "15px" }}
                        >
                          <Grid item>
                            <Grid container alignItems="center">
                              <Typography variant="h5" color="primary">
                                Nilai Tugas Anda
                              </Typography>
                            </Grid>
                          </Grid>
                        </Grid>
                        <Grid container direction="column" spacing={1}>
                          <Grid item className={classes.graph}>
                            {graphTask(this.state.taskGraphCurrentSubject)}
                          </Grid>
                          <Grid item className={classes.graphButtons}>
                            <IconButton
                              onClick={() =>
                                this.changeGraphSubject(
                                  "Tugas",
                                  "Left",
                                  all_subjects.length
                                )
                              }
                            >
                              <ArrowBackIosIcon />
                            </IconButton>
                            {showSubject(this.state.taskGraphCurrentSubject)}
                            <IconButton
                              onClick={() =>
                                this.changeGraphSubject(
                                  "Tugas",
                                  "Right",
                                  all_subjects.length
                                )
                              }
                            >
                              <ArrowForwardIosIcon />
                            </IconButton>
                          </Grid>
                        </Grid>
                      </Paper>
                    </Grid>
                    <Grid item>
                      <Paper style={{ padding: "20px" }}>
                        <Grid
                          container
                          justify="space-between"
                          alignItems="center"
                          style={{ marginBottom: "15px" }}
                        >
                          <Grid item>
                            <Grid container alignItems="center">
                              <Typography variant="h5" color="primary">
                                Nilai Kuis Anda
                              </Typography>
                            </Grid>
                          </Grid>
                        </Grid>
                        <Grid container direction="column" spacing={1}>
                          <Grid item className={classes.graph}>
                            {graphAssessment(
                              this.state.quizGraphCurrentSubject,
                              "Kuis"
                            )}
                          </Grid>
                          <Grid item className={classes.graphButtons}>
                            <IconButton
                              onClick={() =>
                                this.changeGraphSubject(
                                  "Kuis",
                                  "Left",
                                  all_subjects.length
                                )
                              }
                            >
                              <ArrowBackIosIcon
                                onClick={() =>
                                  this.changeGraphSubject(
                                    "Kuis",
                                    "Left",
                                    all_subjects.length
                                  )
                                }
                              />
                            </IconButton>
                            {showSubject(this.state.quizGraphCurrentSubject)}
                            <IconButton
                              onClick={() =>
                                this.changeGraphSubject(
                                  "Kuis",
                                  "Right",
                                  all_subjects.length
                                )
                              }
                            >
                              <ArrowForwardIosIcon />
                            </IconButton>
                          </Grid>
                        </Grid>
                      </Paper>
                    </Grid>
                    <Grid item>
                      <Paper style={{ padding: "20px" }}>
                        <Grid
                          container
                          justify="space-between"
                          alignItems="center"
                          style={{ marginBottom: "15px" }}
                        >
                          <Grid item>
                            <Grid container alignItems="center">
                              <Typography variant="h5" color="primary">
                                Nilai Ujian Anda
                              </Typography>
                            </Grid>
                          </Grid>
                        </Grid>
                        <Grid container direction="column" spacing={1}>
                          <Grid item className={classes.graph}>
                            {graphAssessment(
                              this.state.examGraphCurrentSubject,
                              "Ujian"
                            )}
                          </Grid>
                          <Grid item className={classes.graphButtons}>
                            <IconButton
                              onClick={() =>
                                this.changeGraphSubject(
                                  "Ujian",
                                  "Left",
                                  all_subjects.length
                                )
                              }
                            >
                              <ArrowBackIosIcon />
                            </IconButton>
                            {showSubject(this.state.examGraphCurrentSubject)}
                            <IconButton
                              onClick={() =>
                                this.changeGraphSubject(
                                  "Ujian",
                                  "Right",
                                  all_subjects.length
                                )
                              }
                            >
                              <ArrowForwardIosIcon />
                            </IconButton>
                          </Grid>
                        </Grid>
                      </Paper>
                    </Grid>
                  </Grid>
                </Grid>
              </Hidden>
            </Grid>
          ) : user.role === "Teacher" ? (
            <>
              <Grid
                item
                container
                spacing={2}
                justify="flex-end"
                alignItems="center"
              >
                <Grid item>
                  <Fab
                    className={classes.createButton}
                    onClick={(event) => this.handleMenuOpen(event)}
                  >
                    <AddIcon />
                  </Fab>
                  <Menu
                    keepMounted
                    anchorEl={this.state.anchorEl}
                    open={Boolean(this.state.anchorEl)}
                    onClose={this.handleMenuClose}
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
              <Grid item xs={12} style={{ marginTop: "20px" }}>
                <Grid container direction="column" spacing={2}>
                  <Grid item>
                    <Paper style={{ padding: "20px" }}>
                      <Grid
                        container
                        justify="space-between"
                        alignItems="center"
                        style={{ marginBottom: "15px" }}
                      >
                        <Grid item>
                          <Grid container alignItems="center">
                            <AssignmentIcon
                              color="action"
                              style={{ marginRight: "10px", fontSize: "20px" }}
                            />
                            <Typography variant="h5" color="primary">
                              Tugas yang Belum Diperiksa
                            </Typography>
                          </Grid>
                        </Grid>
                        <Grid item>
                          <Link to="/daftar-tugas">
                            <LightTooltip title="Lihat Semua" placement="top">
                              <IconButton>
                                <PageviewIcon />
                              </IconButton>
                            </LightTooltip>
                          </Link>
                        </Grid>
                      </Grid>
                      <Grid container direction="column" spacing={1}>
                        {listTasksTeacher()}
                      </Grid>
                    </Paper>
                  </Grid>
                  <Grid item>
                    <Paper style={{ padding: "20px" }}>
                      <Grid
                        container
                        justify="space-between"
                        alignItems="center"
                        style={{ marginBottom: "15px" }}
                      >
                        <Grid item>
                          <Grid container alignItems="center">
                            <FaClipboardList
                              style={{
                                marginRight: "10px",
                                fontSize: "20px",
                                color: "grey",
                              }}
                            />
                            <Typography variant="h5" color="primary">
                              Kuis yang Belum Diperiksa
                            </Typography>
                          </Grid>
                        </Grid>
                        <Grid item>
                          <Link to="/daftar-kuis">
                            <LightTooltip title="Lihat Semua" placement="top">
                              <IconButton>
                                <PageviewIcon />
                              </IconButton>
                            </LightTooltip>
                          </Link>
                        </Grid>
                      </Grid>
                      <Grid container direction="column" spacing={1}>
                        {listAssessmentsTeacher("Kuis")}
                      </Grid>
                    </Paper>
                  </Grid>
                  <Grid item>
                    <Paper style={{ padding: "20px" }}>
                      <Grid
                        container
                        justify="space-between"
                        alignItems="center"
                        style={{ marginBottom: "15px" }}
                      >
                        <Grid item>
                          <Grid container alignItems="center">
                            <BsClipboardData
                              color="action"
                              style={{
                                marginRight: "10px",
                                fontSize: "20px",
                                color: "grey",
                              }}
                            />
                            <Typography variant="h5" color="primary">
                              Ujian yang Belum Diperiksa
                            </Typography>
                          </Grid>
                        </Grid>
                        <Grid item>
                          <Link to="/daftar-ujian">
                            <LightTooltip title="Lihat Semua" placement="top">
                              <IconButton>
                                <PageviewIcon />
                              </IconButton>
                            </LightTooltip>
                          </Link>
                        </Grid>
                      </Grid>
                      <Grid container direction="column" spacing={1}>
                        {listAssessmentsTeacher("Ujian")}
                      </Grid>
                    </Paper>
                  </Grid>
                </Grid>
              </Grid>
            </>
          ) : user.role === "Admin" ? (
            <Grid
              item
              container
              direction="row"
              justify="flex-end"
              alignItems="center"
              spacing={1}
            >
              <Grid item>
                <Link to="/atur-walikelas">
                  <Fab
                    variant="extended"
                    className={classes.manageHomeroomTeacherButton}
                  >
                    <AiOutlineUserSwitch
                      className={classes.manageHomeroomTeacherIcon}
                    />
                    Atur Wali Kelas
                  </Fab>
                </Link>
              </Grid>
              <Grid item>
                <Link to="/daftar-kelas">
                  <Fab variant="extended" className={classes.manageClassButton}>
                    <FaChalkboard className={classes.manageClassIcon} />
                    Atur Kelas
                  </Fab>
                </Link>
              </Grid>
              <Grid item>
                <Fab
                  className={classes.createButton}
                  onClick={(event) => this.handleMenuOpen(event)}
                >
                  <AddIcon />
                </Fab>
                <Menu
                  keepMounted
                  anchorEl={this.state.anchorEl}
                  open={Boolean(this.state.anchorEl)}
                  onClose={this.handleMenuClose}
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
                  <MenuItem
                    button
                    component="a"
                    href="/buat-kelas"
                    className={classes.menuItem}
                  >
                    <ListItemIcon>
                      <FaChalkboard className={classes.manageClassIcon} />
                    </ListItemIcon>
                    <ListItemText primary="Buat Kelas" />
                  </MenuItem>
                  <MenuItem
                    button
                    component="a"
                    href="/buat-pengumuman"
                    className={classes.menuItem}
                  >
                    <ListItemIcon>
                      <AnnouncementIcon />
                    </ListItemIcon>
                    <ListItemText primary="Buat Pengumuman" />
                  </MenuItem>
                </Menu>
              </Grid>
            </Grid>
          ) : user.role === "SuperAdmin" ? (
            <Grid
              item
              container
              direction="row"
              justify="flex-end"
              alignItems="center"
              spacing={1}
            >
              <Grid item>
                <Link to="/pengelola-aktif">
                  <Fab
                    variant="extended"
                    className={classes.manageHomeroomTeacherButton}
                  >
                    <AiOutlineUserSwitch
                      className={classes.manageHomeroomTeacherIcon}
                    />
                    Atur Pengelola
                  </Fab>
                </Link>
              </Grid>
              <Grid item>
                <Link to="/daftar-unit">
                  <Fab variant="extended" className={classes.manageClassButton}>
                    <UnitIcon className={classes.manageClassIcon} />
                    Atur Unit sekolah
                  </Fab>
                </Link>
              </Grid>
              <Grid item>
                <Fab
                  className={classes.createButton}
                  onClick={(event) => this.handleMenuOpen(event)}
                >
                  <AddIcon />
                </Fab>
                <Menu
                  keepMounted
                  anchorEl={this.state.anchorEl}
                  open={Boolean(this.state.anchorEl)}
                  onClose={this.handleMenuClose}
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
                  <MenuItem
                    button
                    component="a"
                    href="/buat-kelas"
                    className={classes.menuItem}
                  >
                    <ListItemIcon>
                      <FaChalkboardTeacher
                        className={classes.manageClassIcon}
                      />
                    </ListItemIcon>
                    <ListItemText primary="Buat Kelas" />
                  </MenuItem>
                  <MenuItem
                    button
                    component="a"
                    href="/buat-pengumuman"
                    className={classes.menuItem}
                  >
                    <ListItemIcon>
                      <AnnouncementIcon />
                    </ListItemIcon>
                    <ListItemText primary="Buat Pengumuman" />
                  </MenuItem>
                </Menu>
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
