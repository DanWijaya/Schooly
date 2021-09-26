import React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import moment from "moment";
import "moment/locale/id";
import { getTeachers } from "../../../actions/UserActions";
import { setCurrentClass } from "../../../actions/ClassActions";
import { getAllSubjects } from "../../../actions/SubjectActions";
import { getAllTask } from "../../../actions/TaskActions";
import { getMaterial } from "../../../actions/MaterialActions";
import { getAllTaskFilesByUser } from "../../../actions/UploadActions";
import { getFileSubmitTasksByAuthor } from "../../../actions/files/FileSubmitTaskActions";
import { getAllAssessments } from "../../../actions/AssessmentActions";
import subjectBackground from "./subject-background/SubjectBackground";
import Empty from "../../misc/empty/Empty";
import AssessmentItem from "../item/AssessmentItem";
import AssignmentItem from "../item/AssignmentItem";
import MaterialItem from "../item/MaterialItem";
import {
  Divider,
  ExpansionPanel,
  ExpansionPanelSummary,
  ExpansionPanelDetails,
  Grid,
  Hidden,
  List,
  Paper,
  Typography
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
  itemIcon: {
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
    getAllTaskFilesByUser,
    getMaterial,
    getAllAssessments,
    getTeachers,
    assessmentsCollection
  } = props;
  const { user, all_teachers } = props.auth;

  const id = props.match.params.id;
  const classId = user.kelas;
  const { kelas } = props.classesCollection;
  const { all_subjects_map } = props.subjectsCollection;
  const { selectedMaterials } = props.materialsCollection;

  const [submittedTaskIds, setSubmittedTaskIds] = React.useState(new Set());
  const all_assessments = assessmentsCollection.all_assessments;
  // const {all_user_files} = props.filesCollection;

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
      getMaterial(user.kelas, "by_class");
    }
    setCurrentClass(user.kelas);
    getAllTask();
    getAllTaskFilesByUser(user._id);
    getAllSubjects("map");
    getAllAssessments();
    getTeachers("map");
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

  // All actions to retrieve datas from database.
  if (tasksCollection.length !== undefined) {
    tasksCollection.map((task) => {
      let class_assigned = task.class_assigned;
      for (var i = 0; i < class_assigned.length; i++) {
        if (class_assigned[i] === user.kelas) tasksByClass.push(task);
      }
      return tasksByClass;
    });
  }

  // let tasksBySubjectClass = [];
  // const generateTaskBySubject = (target=null) => {
  //   tasksByClass.map((task) => {
  //     let workCategoryAvatar = (
  //       <Avatar className={classes.assignmentLate}>
  //         <AssignmentLateIcon/>
  //       </Avatar>
  //     )

  //     let workStatus = "Belum Dikumpulkan"
  //     // for (var i = 0; i < all_user_files.length; i++) {
  //     //   if (all_user_files[i].for_task_object === task._id) {
  //     //     workStatus = "Telah Dikumpulkan"
  //     //     workCategoryAvatar = (
  //     //       <Avatar className={classes.assignmentTurnedIn}>
  //     //         <AssignmentTurnedInIcon/>
  //     //       </Avatar>
  //     //     )
  //     //     break;
  //     //   }
  //     // }

  //     if (task.subject === id) {
  //     tasksBySubjectClass.push(
  //       <AssignmentListItem
  //         work_title={task.name}
  //         work_category_avatar={workCategoryAvatar}
  //         work_sender={`Mata Pelajaran: ${all_subjects_map.get(task.subject)}`}
  //         work_status={workStatus}
  //         work_deadline={moment(task.deadline).format("DD MMM YYYY")}
  //         work_link={`/tugas-murid/${task._id}`}
  //       />
  //     )
  //   }
  //   return tasksBySubjectClass
  // })

  // if (target === "length")
  //   return tasksBySubjectClass.length;

  // return tasksBySubjectClass.length === 0 ?
  // (<Typography variant="h5" align="center" gutterBottom>
  //   Kosong
  // </Typography>)
  // : tasksBySubjectClass

  // }

  function listMaterials(
    category = null,
    subject = {},
    tab = "pekerjaan_kelas"
  ) {
    let materialList = [];

    if (Boolean(selectedMaterials.length)) {
      for (var i = selectedMaterials.length - 1; i >= 0; i--) {
        let material = selectedMaterials[i];
        if (
          !category ||
          (category === "subject" && material.subject === subject)
        ) {
          materialList.push(
            <Grid item>
              <MaterialItem
                link={`/materi/${material._id}`}
                primaryText={material.name}
                secondaryText={
                  moment(material.createdAt)
                    .locale("id")
                    .format("DD MMM YYYY")
                }
                subSecondaryText={
                  moment(material.createdAt)
                    .locale("id")
                    .format("HH.mm")
                }
              />
            </Grid>
          );
        }
        if (tab === "pekerjaan_kelas") {
          if (!category && materialList.length === 5)
            // Number of item to the index, so that it has to be index = selectedMaterials.length - 5.
            break;
          if (category === "subject" && materialList.length === 3)
            // Number of item to the index, so that it has to be index = selectedMaterials.length - 5.
            break;
        }
      }
    }
    return materialList;
  }

  function listTasks(category = null, subject = null, tab = "pekerjaan_kelas") {
    let tasksList = [];
    let result = [];
    if (Boolean(tasksCollection.length)) {
      var i;
      for (i = tasksCollection.length - 1; i >= 0; i--) {
        let task = tasksCollection[i];
        let class_assigned = task.class_assigned;
        if (class_assigned.indexOf(classId) !== -1) {
          tasksList.push(task);
        }
      }

      for (i = 0; i < tasksList.length; i++) {
        let task = tasksList[i];

        let assignmentStatus;
        if (submittedTaskIds.has(task._id)) {
          assignmentStatus = TASK_STATUS.SUBMITTED;
        } else {
          assignmentStatus = TASK_STATUS.NOT_SUBMITTED;
        }

        // console.log(all_user_files)
        // for (var j = 0; j < all_user_files.length; j++){
        //     if(all_user_files[j].for_task_object === task._id){
        //     assignmentStatus = "Telah Dikumpulkan"
        //     workCategoryAvatar = (
        //       <Avatar className={classes.assignmentTurnedIn}>
        //         <AssignmentTurnedInIcon/>
        //       </Avatar>
        //     )
        //     break;
        //   }
        // }
        if (tab === "pekerjaan_kelas") {
          if (
            (!category ||
              (category === "subject" && task.subject === subject)) &&
            assignmentStatus === TASK_STATUS.SUBMITTED
          ) {
            result.push(
              <Grid item>
                <AssignmentItem
                  link={`/tugas-murid/${task._id}`}
                  primaryText={task.name}
                  status={assignmentStatus}
                  missing={TASK_STATUS.NOT_SUBMITTED}
                  secondaryText={
                    moment(task.createdAt)
                      .locale("id")
                      .format("DD MMM YYYY")
                  }
                  subSecondaryText={
                    moment(task.createdAt)
                      .locale("id")
                      .format("HH.mm")
                  }
                />
              </Grid>
            );
            if (!category && result.length === 5) break;
            if (category === "subject" && result.length === 3) break;
          }
        } else if (tab === "mata_pelajaran") {
          if (
            !category ||
            (category === "subject" && task.subject === subject)
          ) {
            result.push(
              <Grid item>
                <AssignmentItem
                  link={`/tugas-murid/${task._id}`}
                  primaryText={task.name}
                  status={assignmentStatus}
                  missing={TASK_STATUS.NOT_SUBMITTED}
                  secondaryText={
                    moment(task.createdAt)
                      .locale("id")
                      .format("DD MMM YYYY")
                  }
                  subSecondaryText={
                    moment(task.createdAt)
                      .locale("id")
                      .format("HH.mm")
                  }
                />
              </Grid>
            );
          }
        }
      }
    }
    return result;
  }

  function listAssessments(
    category = null,
    subject = null,
    type,
    tab = "pekerjaan_kelas"
  ) {
    let AssessmentsList = [];
    let result = [];
    if (Boolean(all_assessments.length) && all_teachers instanceof Map) {
      var i;
      for (i = all_assessments.length - 1; i >= 0; i--) {
        let assessment = all_assessments[i];
        let class_assigned = assessment.class_assigned;
        if (class_assigned.indexOf(classId) !== -1) {
          AssessmentsList.push(assessment);
        }
      }

      for (i = 0; i < AssessmentsList.length; i++) {
        let assessment = AssessmentsList[i];
        // console.log(all_user_files)
        // for (var j = 0; j < all_user_files.length; j++){
        //     if(all_user_files[j].for_task_object === task._id){
        //     workStatus = "Telah Dikumpulkan"
        //     workCategoryAvatar = (
        //       <Avatar className={classes.assignmentTurnedIn}>
        //         <AssignmentTurnedInIcon/>
        //       </Avatar>
        //     )
        //     break;
        //   }
        // }

        if (tab === "pekerjaan_kelas") {
          let assessmentStatus = ASSESSMENT_STATUS.NOT_SUBMITTED;
          if (type === "Kuis") {
            if (
              (!category ||
                (category === "subject" && assessment.subject === subject)) &&
              !assessment.submissions &&
              assessment.type === "Kuis" &&
              assessment.posted
            ) {
              result.push(
                <Grid item>
                  <AssessmentItem
                  type="Kuis"
                  primaryText={assessment.name}
                  status={assessmentStatus}
                  missing={ASSESSMENT_STATUS.NOT_SUBMITTED}
                  secondaryText={
                    moment(assessment.createdAt)
                      .locale("id")
                      .format("DD MMM YYYY")
                  }
                  subSecondaryText={
                    moment(assessment.createdAt)
                      .locale("id")
                      .format("HH.mm")
                  }
                  title={assessment.name}
                  subject={
                    category === "subject"
                      ? null
                      : all_subjects_map.get(assessment.subject)
                  }
                  teacher={all_teachers.get(assessment.author_id).name}
                  startTime={moment(assessment.start_date)
                    .locale("id")
                    .format("DD MMM YYYY, HH:mm")}
                  endTime={moment(assessment.end_date)
                    .locale("id")
                    .format("DD MMM YYYY, HH:mm")}
                />
                </Grid>
              );
            }
          }
          if (type === "Ujian") {
            if (
              (!category ||
                (category === "subject" && assessment.subject === subject)) &&
              !assessment.submissions &&
              assessment.type === "Ujian" &&
              assessment.posted
            ) {
              result.push(
                <Grid item>
                  <AssessmentItem
                  type="Ujian"
                  primaryText={assessment.name}
                  status={assessmentStatus}
                  missing={ASSESSMENT_STATUS.NOT_SUBMITTED}
                  secondaryText={
                    moment(assessment.createdAt)
                      .locale("id")
                      .format("DD MMM YYYY")
                  }
                  subSecondaryText={
                    moment(assessment.createdAt)
                      .locale("id")
                      .format("HH.mm")
                  }
                  title={assessment.name}
                  subject={
                    category === "subject"
                      ? null
                      : all_subjects_map.get(assessment.subject)
                  }
                  teacher={all_teachers.get(assessment.author_id).name}
                  startTime={moment(assessment.start_date)
                    .locale("id")
                    .format("DD MMM YYYY, HH:mm")}
                  endTime={moment(assessment.end_date)
                    .locale("id")
                    .format("DD MMM YYYY, HH:mm")}
                />
                </Grid>
              );
            }
          }
          if (!category && result.length === 5) break;
          if (category === "subject" && result.length === 3) break;
        } else if (tab === "mata_pelajaran") {
          let assessmentStatus = !assessment.submissions
            ? ASSESSMENT_STATUS.NOT_SUBMITTED
            : ASSESSMENT_STATUS.SUBMITTED;

          if (type === "Kuis") {
            if (
              (!category ||
                (category === "subject" && assessment.subject === subject)) &&
              assessment.type === "Kuis" &&
              assessment.posted
            ) {
              result.push(
                <Grid item>
                  <AssessmentItem
                  type="Kuis"
                  primaryText={assessment.name}
                  status={assessmentStatus}
                  missing={ASSESSMENT_STATUS.NOT_SUBMITTED}
                  secondaryText={
                    moment(assessment.createdAt)
                      .locale("id")
                      .format("DD MMM YYYY")
                  }
                  subSecondaryText={
                    moment(assessment.createdAt)
                      .locale("id")
                      .format("HH.mm")
                  }
                  title={assessment.name}
                  subject={
                    category === "subject"
                      ? null
                      : all_subjects_map.get(assessment.subject)
                  }
                  teacher={all_teachers.get(assessment.author_id).name}
                  startTime={moment(assessment.start_date)
                    .locale("id")
                    .format("DD MMM YYYY, HH:mm")}
                  endTime={moment(assessment.end_date)
                    .locale("id")
                    .format("DD MMM YYYY, HH:mm")}
                />
                </Grid>
              );
            }
          }
          if (type === "Ujian") {
            if (
              (!category ||
                (category === "subject" && assessment.subject === subject)) &&
              assessment.type === "Ujian" &&
              assessment.posted
            ) {
              result.push(
                <Grid item>
                  <AssessmentItem
                  type="Ujian"
                  primaryText={assessment.name}
                  status={assessmentStatus}
                  missing={ASSESSMENT_STATUS.NOT_SUBMITTED}
                  secondaryText={
                    moment(assessment.createdAt)
                      .locale("id")
                      .format("DD MMM YYYY")
                  }
                  subSecondaryText={
                    moment(assessment.createdAt)
                      .locale("id")
                      .format("HH.mm")
                  }
                  title={assessment.name}
                  subject={
                    category === "subject"
                      ? null
                      : all_subjects_map.get(assessment.subject)
                  }
                  teacher={all_teachers.get(assessment.author_id).name}
                  startTime={moment(assessment.start_date)
                    .locale("id")
                    .format("DD MMM YYYY, HH:mm")}
                  endTime={moment(assessment.end_date)
                    .locale("id")
                    .format("DD MMM YYYY, HH:mm")}
                />
                </Grid>
              );
            }
          }
        }
      }
    }
    return result;
  }

  document.title = all_subjects_map.get(id)
    ? `Schooly | ${all_subjects_map.get(id)}`
    : "Schooly";

  return (
    <div className={classes.root}>
      <Paper className={classes.subjectPaper}>
        <Typography variant="h4" gutterBottom noWrap style={{ color: "white" }}>
          <b>{all_subjects_map.get(id)}</b>
        </Typography>
        <Typography variant="h5" noWrap style={{ color: "rgba(255, 255, 255, 0.7)" }}>
          Kelas: {kelas.name}
        </Typography>
      </Paper>
      <div style={{ marginTop: "30px" }}>
        <ExpansionPanel defaultExpanded>
          <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
            <div className={classes.objectPanel}>
              <MenuBookIcon className={classes.itemIcon} />
              <Typography variant="h6">Materi</Typography>
            </div>
          </ExpansionPanelSummary>
          <Divider />
          <ExpansionPanelDetails className={classes.objectDetails}>
            {listMaterials("subject", id, "mata_pelajaran").length === 0 ? (
              <Empty />
            ) : (
              <div style={{ width: "100%" }}>
                <Grid container direction="column" spacing={2}>
                  {listMaterials("subject", id, "mata_pelajaran")}
                </Grid>
              </div>
            )}
          </ExpansionPanelDetails>
        </ExpansionPanel>
        <ExpansionPanel defaultExpanded>
          <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
            <div className={classes.objectPanel}>
              <AssignmentIcon className={classes.itemIcon} />
              <Typography variant="h6">Tugas</Typography>
            </div>
          </ExpansionPanelSummary>
          <Divider />
          <ExpansionPanelDetails className={classes.objectDetails}>
            {listTasks("subject", id, "mata_pelajaran").length === 0 ? (
              <Empty />
            ) : (
              <div style={{ width: "100%" }}>
                <Grid container direction="column" spacing={2}>
                  {listTasks("subject", id, "mata_pelajaran")}
                </Grid>
              </div>
            )}
          </ExpansionPanelDetails>
        </ExpansionPanel>
        <ExpansionPanel defaultExpanded>
          <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
            <div className={classes.objectPanel}>
              <FaClipboardList className={classes.itemIcon} />
              <Typography variant="h6">Kuis</Typography>
            </div>
          </ExpansionPanelSummary>
          <Divider />
          <ExpansionPanelDetails className={classes.objectDetails}>
            {listAssessments("subject", id, "Kuis", "mata_pelajaran").length === 0 ? (
              <Empty />
            ) : (
              <div style={{ width: "100%" }}>
                <Grid container direction="column" spacing={2}>
                  {listAssessments("subject", id, "Kuis", "mata_pelajaran")}
                </Grid>
              </div>
            )}
          </ExpansionPanelDetails>
        </ExpansionPanel>
        <ExpansionPanel defaultExpanded>
          <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
            <div className={classes.objectPanel}>
              <BsClipboardData className={classes.itemIcon} />
              <Typography variant="h6">Ujian</Typography>
            </div>
          </ExpansionPanelSummary>
          <Divider />
          <ExpansionPanelDetails className={classes.objectDetails}>
            {listAssessments("subject", id, "Ujian", "mata_pelajaran").length === 0 ? (
              <Empty />
            ) : (
              <div style={{ width: "100%" }}>
                <Grid container direction="column" spacing={2}>
                  {listAssessments("subject", id, "Ujian", "mata_pelajaran")}
                </Grid>
              </div>
            )}
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
  getAllTaskFilesByUser: PropTypes.func.isRequired,
  getMaterial: PropTypes.func.isRequired,
  getAllAssessments: PropTypes.func.isRequired,
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
  getAllTaskFilesByUser,
  getMaterial,
  getAllAssessments,
  getTeachers
})(ViewSubject);
