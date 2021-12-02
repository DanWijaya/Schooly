import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import moment from "moment";
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
import subjectBackground from "./subject-background/SubjectBackground";
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

const TASK_STATUS = {
  SUBMITTED: "Sudah Dikumpulkan",
  NOT_SUBMITTED: "Belum Dikumpulkan",
};

const ASSESSMENT_STATUS = {
  SUBMITTED: "Sudah Ditempuh",
  NOT_SUBMITTED: "Belum Ditempuh",
};

function ViewSubject(props) {
  const {
    setCurrentClass,
    getAllTask,
    getAllSubjects,
    tasksCollection,
    getMaterialByClass,
    getAllAssessments,
    getTeachers,
    getAssessmentsByClass,
  } = props;
  const { user, all_teachers } = props.auth;
  const id = props.match.params.id;
  const classId = user.kelas;
  const { kelas } = props.classesCollection;
  const { all_subjects_map } = props.subjectsCollection;
  const { selectedMaterials } = props.materialsCollection;
  const { all_assessments, selectedAssessments } = props.assessmentsCollection;
  // const {all_user_files} = props.filesCollection;

  const [submittedTaskIds, setSubmittedTaskIds] = React.useState(new Set());

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
        .then((response) => {
          for (let file of response.data) {
            submittedTaskIdSet.add(file.task_id);
          }
        })
        .finally(() => {
          // kalau dapat error 404 (files.length === 0), submittedTaskIds akan diisi Set kosong
          setSubmittedTaskIds(submittedTaskIdSet);
        });
    }
  }, []);

  let tasksByClass = []; // Tasks on specific class.

  // All actions to retrive datas from Database...
  if (tasksCollection.length !== undefined) {
    tasksCollection.map((task) => {
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
      .filter((material) => material.subject == subject);

    if (!Boolean(materialList.length)) {
      return <Empty />;
    }

    return <MaterialItem data={materialList} />;
  }

  function listTasks(subject) {
    let taskList = [];
    if (Array.isArray(tasksCollection)) {
      taskList = tasksCollection.reverse().filter((task) => {
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
        assessment.type == type && assessment.subject === subjectId
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
