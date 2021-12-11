import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { Bar } from "react-chartjs-2";
import PropTypes from "prop-types";
import moment from "moment";
import "moment/locale/id";
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
import {
  Avatar,
  Button,
  Card,
  CardContent,
  Divider,
  Fab,
  Grid,
  Hidden,
  LinearProgress,
  List,
  ListItem,
  ListItemAvatar,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Paper,
  Typography,
} from "@material-ui/core";
import AvatarGroup from "@material-ui/lab/AvatarGroup";
import {
  Add as AddIcon,
  Announcement as AnnouncementIcon,
  AssignmentOutlined as AssignmentIcon,
  MenuBook as MenuBookIcon,
  Web as WebIcon,
} from "@material-ui/icons";
import { withStyles } from "@material-ui/core/styles";
import { BsClipboardData } from "react-icons/bs";
import { FaClipboardList } from "react-icons/fa";
import TaskItem from "../item/TaskItem";
import { getFileSubmitTasksByAuthor } from "../../../actions/files/FileSubmitTaskActions";
import AssessmentItem from "../item/AssessmentItem";

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
      "& .MuiListItemIcon-root, & .MuiListItemText-root": {
        color: "white",
      },
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
  listItem: {
    "&:focus, &:hover": {
      backgroundColor: theme.palette.primary.fade,
    },
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
      submittedTaskIds: new Set(),
    };
  }

  componentDidMount() {
    const {
      getAllTask,
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
      getStudents(user.unit);
    }
    if (user.role === all_roles.STUDENT) {
      let submittedTaskIdSet = new Set();
      getFileSubmitTasksByAuthor(user._id)
        .then((data) => {
          for (let file of data) {
            submittedTaskIdSet.add(file.task_id);
          }
        })
        .finally(() => {
          // kalau dapat error 404 (files.lethis.setState({ submitted})ngth === 0), submittedTaskIds akan diisi Set kosong
          this.setState({ submittedTaskIds: submittedTaskIdSet });
        });
    }
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
    const { classes } = this.props;
    const { user, all_roles } = this.props.auth;
    const { kelas } = this.props.classesCollection;
    const { all_subjects_map, all_subjects } = this.props.subjectsCollection;
    const { all_assessments } = this.props.assessmentsCollection;
    const { all_tasks } = this.props.tasksCollection;
    const classId = user.kelas;

    let tasksList = [];
    let quizList = [];
    let examList = [];

    const addAssessment = (data) => {
      if (data.type === "Kuis") {
        quizList.push(data);
      } else if (data.type === "Ujian") {
        examList.push(data);
      }
      return;
    };

    const retrieveData = () => {
      tasksList = [];
      quizList = [];
      examList = [];

      // If all_tasks is not undefined or an empty array
      if (user.role === all_roles.TEACHER) {
        all_tasks.forEach((data) => {
          if (data.person_in_charge_id === user._id) {
            tasksList.push(data);
          }
        });

        all_assessments.forEach((data) => {
          if (data.author_id === user._id) {
            addAssessment(data);
          }
        });
      } else if (user.role === all_roles.STUDENT) {
        if (this.state.submittedTaskIds) {
          all_tasks.forEach((data) => {
            let class_assigned = data.class_assigned;
            if (class_assigned.indexOf(user.kelas) !== -1) {
              tasksList.push({
                ...data,
                submissionStatus: this.state.submittedTaskIds.has(data._id),
              });
            }
          });
        }
        all_assessments.forEach((data) => {
          let class_assigned = data.class_assigned;
          if (class_assigned.indexOf(user.kelas) !== -1 && data.posted) {
            addAssessment(data);
          }
        });
      } else if (user.role === all_roles.ADMIN) {
        all_tasks.forEach((data) => tasksList.push(data));
        //No need to process assessment for administrator.
      }
      return;
    };

    // This is used for graph?
    // if (
    //   this.state.allowedSubjectIndex === null &&
    //   all_subjects.length !== 0 &&
    //   Object.keys(kelas).length !== 0
    // ) {
    //   let allowedIndexes = [];
    //   for (let i = 0; i < all_subjects.length; i++) {
    //     if (kelas.subject_assigned.includes(all_subjects[i]._id)) {
    //       allowedIndexes.push(i);
    //     }
    //   }
    //   this.setState({ allowedSubjectIndex: allowedIndexes });
    //   if (
    //     this.state.taskGraphCurrentSubject === null &&
    //     all_subjects.length !== 0
    //   ) {
    //     let randomNumber =
    //       allowedIndexes[Math.floor(Math.random() * allowedIndexes.length)];
    //     this.setState({ taskGraphCurrentSubject: randomNumber });
    //   }
    //   if (
    //     this.state.quizGraphCurrentSubject === null &&
    //     all_subjects.length !== 0
    //   ) {
    //     let randomNumber =
    //       allowedIndexes[Math.floor(Math.random() * allowedIndexes.length)];
    //     this.setState({ quizGraphCurrentSubject: randomNumber });
    //   }
    //   if (
    //     this.state.examGraphCurrentSubject === null &&
    //     all_subjects.length !== 0
    //   ) {
    //     let randomNumber =
    //       allowedIndexes[Math.floor(Math.random() * allowedIndexes.length)];
    //     this.setState({ examGraphCurrentSubject: randomNumber });
    //   }
    // }

    // function graphTask(subjectIndex) {
    //   if (all_subjects[subjectIndex]) {
    //     let subject = all_subjects[subjectIndex]._id;
    //     let subjectScores = [];
    //     let subjectNames = [];
    //     for (let i = 0; i < all_tasks.length; i++) {
    //       if (all_tasks[i].grades && all_tasks[i].subject === subject) {
    //         let keysArray = Object.keys(all_tasks[i].grades);
    //         let valuesArray = Object.values(all_tasks[i].grades);
    //         for (let j = 0; j < keysArray.length; j++) {
    //           if (keysArray[j] === user._id) {
    //             subjectScores.push(valuesArray[j]);
    //             subjectNames.push(all_tasks[i].name);
    //             break;
    //           }
    //         }
    //       }
    //     }
    //     if (subjectScores.length !== 0) {
    //       return (
    //         <DashboardGraph
    //           scores={subjectScores}
    //           names={subjectNames}
    //           workType="Tugas"
    //         />
    //       );
    //     } else {
    //       return (
    //         <Grid item style={{ height: "270px", width: "250px" }}>
    //           <div className={classes.greyBackground}>
    //             <Typography
    //               align="center"
    //               color="textSecondary"
    //               variant="subtitle1"
    //             >
    //               Belum ada Tugas yang telah dinilai untuk mata pelajaran
    //               terkait
    //             </Typography>
    //           </div>
    //         </Grid>
    //       );
    //     }
    //   } else {
    //     return (
    //       <Grid item style={{ height: "270px", width: "250px" }}>
    //         <div className={classes.greyBackground}>
    //           <Typography
    //             align="center"
    //             color="textSecondary"
    //             variant="subtitle1"
    //           >
    //             Belum ada Tugas yang telah dinilai untuk mata pelajaran terkait
    //           </Typography>
    //         </div>
    //       </Grid>
    //     );
    //   }
    // }

    // function graphAssessment(subjectIndex, type) {
    //   if (all_subjects[subjectIndex]) {
    //     let subject = all_subjects[subjectIndex]._id;
    //     let subjectScores = [];
    //     let subjectNames = [];
    //     if (type === "Kuis") {
    //       for (let i = 0; i < all_assessments.length; i++) {
    //         if (
    //           all_assessments[i].grades &&
    //           all_assessments[i].subject === subject &&
    //           all_assessments[i].type === "Kuis"
    //         ) {
    //           let keysArray = Object.keys(all_assessments[i].grades);
    //           let valuesArray = Object.values(all_assessments[i].grades);
    //           for (let j = 0; j < keysArray.length; j++) {
    //             if (keysArray[j] === user._id) {
    //               subjectScores.push(valuesArray[j].total_grade);
    //               subjectNames.push(all_assessments[i].name);
    //               break;
    //             }
    //           }
    //         }
    //       }
    //     } else if (type === "Ujian") {
    //       for (let i = 0; i < all_assessments.length; i++) {
    //         if (
    //           all_assessments[i].grades &&
    //           all_assessments[i].subject === subject &&
    //           all_assessments[i].type === "Ujian"
    //         ) {
    //           let keysArray = Object.keys(all_assessments[i].grades);
    //           let valuesArray = Object.values(all_assessments[i].grades);
    //           for (let j = 0; j < keysArray.length; j++) {
    //             if (keysArray[j] === user._id) {
    //               subjectScores.push(valuesArray[j].total_grade);
    //               subjectNames.push(all_assessments[i].name);
    //               break;
    //             }
    //           }
    //         }
    //       }
    //     }
    //     if (subjectScores.length !== 0) {
    //       return (
    //         <DashboardGraph
    //           scores={subjectScores}
    //           names={subjectNames}
    //           workType={type}
    //         />
    //       );
    //     } else {
    //       return (
    //         <Grid item style={{ height: "270px", width: "250px" }}>
    //           <div className={classes.greyBackground}>
    //             <Typography
    //               align="center"
    //               color="textSecondary"
    //               variant="subtitle1"
    //             >
    //               Belum ada {type} yang telah dinilai untuk mata pelajaran
    //               terkait
    //             </Typography>
    //           </div>
    //         </Grid>
    //       );
    //     }
    //   } else {
    //     return (
    //       <Grid item style={{ height: "270px", width: "250px" }}>
    //         <div className={classes.greyBackground}>
    //           <Typography
    //             align="center"
    //             color="textSecondary"
    //             variant="subtitle1"
    //           >
    //             Belum ada {type} yang telah dinilai untuk mata pelajaran terkait
    //           </Typography>
    //         </div>
    //       </Grid>
    //     );
    //   }
    // }

    let tasksByClass = [];
    if (Boolean(all_tasks.length)) {
      if (user.role === "Student") {
        all_tasks.map((task) => {
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
    retrieveData();
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
                      {tasksList.length === 0 ? (
                        <Empty />
                      ) : (
                        <Grid container direction="column" spacing={2}>
                          <TaskItem
                            data={sortAscByCreatedAt(tasksList)}
                            submittedIds={this.state.submittedTaskIds}
                            isHideOptionMenu={true}
                          />
                        </Grid>
                      )}
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
                      {quizList.length === 0 ? (
                        <Empty />
                      ) : (
                        <Grid container direction="column" spacing={2}>
                          <AssessmentItem
                            data={sortAscByCreatedAt(quizList)}
                            isHideOptionMenu={true}
                          />
                        </Grid>
                      )}
                    </CardContent>
                    <CardContent>
                      <Typography gutterBottom>Ujian</Typography>
                      {examList.length === 0 ? (
                        <Empty />
                      ) : (
                        <Grid container direction="column" spacing={2}>
                          <AssessmentItem
                            data={sortAscByCreatedAt(examList)}
                            isHideOptionMenu={true}
                          />
                        </Grid>
                      )}
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
                                  <Typography>Buat Pengumuman</Typography>
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
                                primary={<Typography>Buat Materi</Typography>}
                              />
                            </MenuItem>
                          </Link>
                          <Link to="/buat-tugas">
                            <MenuItem className={classes.menuItem}>
                              <ListItemIcon>
                                <AssignmentIcon />
                              </ListItemIcon>
                              <ListItemText
                                primary={<Typography>Buat Tugas</Typography>}
                              />
                            </MenuItem>
                          </Link>
                          <Link to="/buat-kuis">
                            <MenuItem className={classes.menuItem}>
                              <ListItemIcon>
                                <FaClipboardList />
                              </ListItemIcon>
                              <ListItemText
                                primary={<Typography>Buat Kuis</Typography>}
                              />
                            </MenuItem>
                          </Link>
                          <Link to="/buat-ujian">
                            <MenuItem className={classes.menuItem}>
                              <ListItemIcon>
                                <BsClipboardData />
                              </ListItemIcon>
                              <ListItemText
                                primary={<Typography>Buat Ujian</Typography>}
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
                    {tasksList.length === 0 ? (
                      <Empty />
                    ) : (
                      <Grid container direction="column" spacing={2}>
                        <TaskItem
                          data={sortAscByCreatedAt(tasksList)}
                          submittedIds={this.state.submittedTaskIds}
                          isHideOptionMenu={true}
                        />
                      </Grid>
                    )}
                  </CardContent>
                  <CardContent>
                    <Typography gutterBottom>Kuis</Typography>
                    {quizList.length === 0 ? (
                      <Empty />
                    ) : (
                      <Grid container direction="column" spacing={2}>
                        <AssessmentItem
                          data={sortAscByCreatedAt(quizList)}
                          isHideOptionMenu={true}
                        />
                      </Grid>
                    )}
                  </CardContent>
                  <CardContent>
                    <Typography gutterBottom>Ujian</Typography>
                    {examList.length === 0 ? (
                      <Empty />
                    ) : (
                      <Grid container direction="column" spacing={2}>
                        <AssessmentItem
                          data={sortAscByCreatedAt(examList)}
                          isHideOptionMenu={true}
                        />
                      </Grid>
                    )}
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
  })(withStyles(styles)(Dashboard))
);
