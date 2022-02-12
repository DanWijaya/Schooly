import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
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
import { withStyles } from "@material-ui/core/styles";
import { getFileSubmitTasksByAuthor } from "../../../actions/files/FileSubmitTaskActions";

// Dashboard Component according to role.
import DashboardStudent from "./DashboardStudent";
import DashboardTeacher from "./DashboardTeacher";
import DashboardAdmin from "./DashboardAdmin";
import DashboardSuperAdmin from "./DashboardSuperAdmin";

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
    const { user, all_roles } = this.props.auth;
    if (user.role !== all_roles.SUPERADMIN) {
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
          this.setState({ submittedTaskIds: submittedTaskIdSet });
        });
    }
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

  render() {
    const { classes } = this.props;
    const { user, all_roles } = this.props.auth;
    const { all_assessments } = this.props.assessmentsCollection;
    const { all_tasks } = this.props.tasksCollection;

    let taskList = [];
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
      taskList = [];
      quizList = [];
      examList = [];

      // If all_tasks is not undefined or an empty array
      if (user.role === all_roles.TEACHER) {
        all_tasks.forEach((data) => {
          if (data.person_in_charge_id === user._id) {
            taskList.push(data);
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
              taskList.push({
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
        all_tasks.forEach((data) => taskList.push(data));
        //No need to process assessment for administrator.
      }
      return;
    };

    document.title = "Schooly | Beranda";
    retrieveData();

    const commonData = {
      taskList: sortAscByCreatedAt(taskList),
      examList: sortAscByCreatedAt(examList),
      quizList: sortAscByCreatedAt(quizList),
    };

    return (
      <div className={classes.root}>
        {user.role === all_roles.STUDENT ? (
          <DashboardStudent
            data={commonData}
            submittedTaskIds={this.state.submittedTaskIds}
          />
        ) : user.role === all_roles.TEACHER ? (
          <DashboardTeacher data={commonData} />
        ) : user.role === all_roles.ADMIN ? (
          <DashboardAdmin data={commonData} />
        ) : user.role === all_roles.SUPERADMIN ? (
          <DashboardSuperAdmin />
        ) : null}
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

//Below Graph codes are used before, but currently graph is not implemented yet.
// Can consider to put it in Prototypes(?)
/*
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

// This is used for graph?
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
    for (let i = 0; i < all_tasks.length; i++) {
      if (all_tasks[i].grades && all_tasks[i].subject === subject) {
        let keysArray = Object.keys(all_tasks[i].grades);
        let valuesArray = Object.values(all_tasks[i].grades);
        for (let j = 0; j < keysArray.length; j++) {
          if (keysArray[j] === user._id) {
            subjectScores.push(valuesArray[j]);
            subjectNames.push(all_tasks[i].name);
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

*/
