import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import "moment/locale/id";
import { getTeachers } from "../../../actions/UserActions";
import { setCurrentClass } from "../../../actions/ClassActions";
import { getAllSubjects } from "../../../actions/SubjectActions";
import { getAllTask } from "../../../actions/TaskActions";
import { getMaterialByClass } from "../../../actions/MaterialActions";
import { getFileSubmitTasksByAuthor } from "../../../actions/files/FileSubmitTaskActions";
import {
  getAllAssessments,
  getAssessmentsByClass,
} from "../../../actions/AssessmentActions";
import _5dc692 from "./subject-backgrounds/_5dc692.png";
import _70d0db from "./subject-backgrounds/_70d0db.png";
import _151e34 from "./subject-backgrounds/_151e34.png";
import _868acd from "./subject-backgrounds/_868acd.png";
import _76294f from "./subject-backgrounds/_76294f.png";
import _ef2c5f from "./subject-backgrounds/_ef2c5f.png";
import _f7ca13 from "./subject-backgrounds/_f7ca13.png";
import _f9d291 from "./subject-backgrounds/_f9d291.png";
import _f25624 from "./subject-backgrounds/_f25624.png";
import _71d0e1 from "./subject-backgrounds/_71d0e1.png";
import _f6836b from "./subject-backgrounds/_f6836b.png";
import _53c9cc from "./subject-backgrounds/_53c9cc.png";
import _fab328 from "./subject-backgrounds/_fab328.png";
import AssessmentItem from "../item/AssessmentItem";
import TaskItem from "../item/TaskItem";
import MaterialItem from "../item/MaterialItem";
import Empty from "../../misc/empty/Empty";
import {
  Divider,
  ExpansionPanel,
  ExpansionPanelDetails,
  ExpansionPanelSummary,
  Grid,
  Paper,
  Typography,
} from "@material-ui/core";
import {
  AssignmentOutlined as AssignmentIcon,
  ExpandMore as ExpandMoreIcon,
  MenuBook as MenuBookIcon,
} from "@material-ui/icons";
import { makeStyles } from "@material-ui/core/styles";
import { FaClipboardList } from "react-icons/fa";
import { BsClipboardData } from "react-icons/bs";

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
  subjectPaper: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    padding: "35px",
    backgroundColor: (props) => props.backgroundColor,
    backgroundImage: (props) => `url(${props.backgroundImage})`,
    backgroundPosition: "right bottom",
    backgroundRepeat: "no-repeat",
    backgroundSize: "contain",
  },
  objectIcon: {
    color: "grey",
    fontSize: "22.5px",
    marginRight: "12.5px",
  },
  objectPanel: {
    display: "flex",
    alignItems: "center",
  },
  objectDetails: {
    padding: "30px",
    [theme.breakpoints.down("sm")]: {
      padding: "15px",
    },
  },
}));

function ViewSubject(props) {
  const {
    setCurrentClass,
    getAllTask,
    getAllSubjects,
    getMaterialByClass,
    getTeachers,
    getAssessmentsByClass,
  } = props;
  const { user } = props.auth;
  const id = props.match.params.id;
  const classId = user.kelas;

  const { kelas } = props.classesCollection;
  const { all_subjects_map } = props.subjectsCollection;
  const { selectedMaterials } = props.materialsCollection;
  const { all_tasks } = props.tasksCollection;
  const { selectedAssessments } = props.assessmentsCollection;

  const [submittedTaskIds, setSubmittedTaskIds] = React.useState(new Set());

  const subjectBackground = [
    { "#5dc692": _5dc692 },
    { "#70d0db": _70d0db },
    { "#151e34": _151e34 },
    { "#868acd": _868acd },
    { "#76294f": _76294f },
    { "#ef2c5f": _ef2c5f },
    { "#f7ca13": _f7ca13 },
    { "#f9d291": _f9d291 },
    { "#f25624": _f25624 },
    { "#71d0e1": _71d0e1 },
    { "#f6836b": _f6836b },
    { "#53c9cc": _53c9cc },
    { "#fab328": _fab328 },
  ];

  let subjects_list = Array.from(all_subjects_map.keys());
  let background_idx = subjects_list.indexOf(id) % subjectBackground.length;
  let background_image, background_color;

  if (background_idx !== -1) {
    background_image = Object.values(subjectBackground[background_idx])[0];
    background_color = Object.keys(subjectBackground[background_idx])[0];
  }
  const classes = useStyles({
    backgroundColor: background_color,
    backgroundImage: background_image,
  });

  React.useEffect(() => {
    if (user.role === "Student") {
      getMaterialByClass(user.kelas);
      setCurrentClass(user.kelas);
    }
    getAllTask(user.unit);
    getAllSubjects(user.unit, "map");
    getAssessmentsByClass(user.unit);
    getTeachers(user.unit, "map");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    if (user.role === "Student") {
      let submittedTaskIdSet = new Set();
      getFileSubmitTasksByAuthor(user._id)
        .then((data) => {
          for (let file of data) {
            submittedTaskIdSet.add(file.task_id);
          }
        })
        .finally(() => {
          // If error 404 is triggered (files.length === 0), submittedTaskIds will be filled with an empty Set.
          setSubmittedTaskIds(submittedTaskIdSet);
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  let tasksByClass = []; // Tasks on specific class.

  // All actions to retrive datas from Database...
  if (all_tasks.length !== undefined) {
    all_tasks.map((task) => {
      let class_assigned = task.class_assigned;
      for (var i = 0; i < class_assigned.length; i++) {
        if (class_assigned[i] === user.kelas) tasksByClass.push(task);
      }
      return tasksByClass;
    });
  }

  function listMaterials(subject) {
    let materialList = selectedMaterials
      .reverse()
      .filter((material) => material.subject === subject);

    if (!Boolean(materialList.length)) {
      return <Empty />;
    }

    return <MaterialItem data={materialList} />;
  }

  function listTasks(subject) {
    let taskList = [];
    if (Array.isArray(all_tasks)) {
      taskList = all_tasks.reverse().filter((task) => {
        let class_assigned = task.class_assigned;
        if (Array.isArray(class_assigned)) {
          return (
            class_assigned.indexOf(classId) !== -1 && task.subject === subject
          );
        }
        return false;
      });
    }
    if (!Boolean(taskList.length)) {
      return <Empty />;
    }
    return <TaskItem data={taskList} submittedIds={submittedTaskIds} />;
  }

  function listAssessments(type = "", subjectId = "") {
    let assessmentList = selectedAssessments.filter(
      (assessment) =>
        assessment.type === type && assessment.subject === subjectId
    );
    if (!Boolean(assessmentList.length)) {
      return <Empty />;
    }
    return <AssessmentItem data={assessmentList} />;
  }

  document.title = `Schooly | ${all_subjects_map.get(id)}`;

  return (
    <div className={classes.root}>
      <Paper className={classes.subjectPaper}>
        <Typography variant="h4" gutterBottom noWrap style={{ color: "white" }}>
          <b>{all_subjects_map.get(id)}</b>
        </Typography>
        <Typography
          variant="h5"
          noWrap
          style={{ color: "rgba(255, 255, 255, 0.7)" }}
        >
          {kelas.name}
        </Typography>
      </Paper>
      <div style={{ marginTop: "30px" }}>
        <ExpansionPanel defaultExpanded>
          <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
            <div className={classes.objectPanel}>
              <MenuBookIcon className={classes.objectIcon} />
              <Typography variant="h6">Materi</Typography>
            </div>
          </ExpansionPanelSummary>
          <Divider />
          <ExpansionPanelDetails className={classes.objectDetails}>
            <Grid container direction="column" spacing={2}>
              {listMaterials(id)}
            </Grid>
          </ExpansionPanelDetails>
        </ExpansionPanel>
        <ExpansionPanel defaultExpanded>
          <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
            <div className={classes.objectPanel}>
              <AssignmentIcon className={classes.objectIcon} />
              <Typography variant="h6">Tugas</Typography>
            </div>
          </ExpansionPanelSummary>
          <Divider />
          <ExpansionPanelDetails className={classes.objectDetails}>
            <Grid container direction="column" spacing={2}>
              {listTasks(id)}
            </Grid>
          </ExpansionPanelDetails>
        </ExpansionPanel>
        <ExpansionPanel defaultExpanded>
          <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
            <div className={classes.objectPanel}>
              <FaClipboardList className={classes.objectIcon} />
              <Typography variant="h6">Kuis</Typography>
            </div>
          </ExpansionPanelSummary>
          <Divider />
          <ExpansionPanelDetails className={classes.objectDetails}>
            <Grid container direction="column" spacing={2}>
              {listAssessments("Kuis", id)}
            </Grid>
          </ExpansionPanelDetails>
        </ExpansionPanel>
        <ExpansionPanel defaultExpanded>
          <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
            <div className={classes.objectPanel}>
              <BsClipboardData className={classes.objectIcon} />
              <Typography variant="h6">Ujian</Typography>
            </div>
          </ExpansionPanelSummary>
          <Divider />
          <ExpansionPanelDetails className={classes.objectDetails}>
            <Grid container direction="column" spacing={2}>
              {listAssessments("Ujian", id)}
            </Grid>
          </ExpansionPanelDetails>
        </ExpansionPanel>
      </div>
    </div>
  );
}

ViewSubject.propTypes = {
  classesCollection: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  subjectsCollection: PropTypes.object.isRequired,
  tasksCollection: PropTypes.object.isRequired,
  materialsCollection: PropTypes.object.isRequired,
  assessmentsCollection: PropTypes.object.isRequired,
  filesCollection: PropTypes.object.isRequired,
  setCurrentClass: PropTypes.func.isRequired,
  getAllSubjects: PropTypes.func.isRequired,
  getAllTask: PropTypes.func.isRequired,
  getTeachers: PropTypes.func.isRequired,
  getMaterialByClass: PropTypes.func.isRequired,
  getAllAssessments: PropTypes.func.isRequired,
  getAssessmentsByClass: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  classesCollection: state.classesCollection,
  subjectsCollection: state.subjectsCollection,
  tasksCollection: state.tasksCollection,
  materialsCollection: state.materialsCollection,
  filesCollection: state.filesCollection,
  assessmentsCollection: state.assessmentsCollection,
});

export default connect(mapStateToProps, {
  setCurrentClass,
  getAllSubjects,
  getAllTask,
  getMaterialByClass,
  getAllAssessments,
  getAssessmentsByClass,
  getTeachers,
})(ViewSubject);
