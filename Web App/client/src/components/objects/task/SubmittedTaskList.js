import React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import moment from "moment";
import { getAllClass } from "../../../actions/ClassActions";
import { getAllSubjects } from "../../../actions/SubjectActions";
import { getStudents } from "../../../actions/UserActions";
import {
  getFileSubmitTasks_T,
  viewFileSubmitTasks,
} from "../../../actions/files/FileSubmitTaskActions";
import { getOneTask, gradeTask } from "../../../actions/TaskActions";
import { TabPanel, TabIndex } from "../../utils/tab-panel/TabPanel";
import Empty from "../../misc/empty/Empty";
import CustomLinkify from "../../utils/linkify/Linkify";
import {
  Avatar,
  Button,
  Divider,
  ExpansionPanel,
  ExpansionPanelDetails,
  ExpansionPanelSummary,
  Fab,
  Grid,
  Hidden,
  Paper,
  Snackbar,
  Tab,
  Tabs,
  TextField,
  Tooltip,
  Typography,
} from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";
import { makeStyles } from "@material-ui/core/styles";
import {
  BarChart as BarChartIcon,
  ExpandMore as ExpandMoreIcon,
  GetApp as GetAppIcon,
  QuestionAnswer as QuestionAnswerIcon,
} from "@material-ui/icons";
import FileSubmission from "../file/FileSubmission";

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
  submittedTaskPaper: {
    padding: "20px",
    [theme.breakpoints.down("xs")]: {
      padding: "15px",
    },
  },
  submittedTaskDivider: {
    margin: "22.5px 0px",
    backgroundColor: theme.palette.primary.light,
  },
  discussionButton: {
    boxShadow:
      "0px 1px 2px 0px rgba(194,100,1,0.3), 0px 2px 6px 2px rgba(194,100,1,0.15)",
    backgroundColor: theme.palette.success.main,
    color: "white",
    "&:focus, &:hover": {
      backgroundColor: theme.palette.success.main,
      color: "white",
    },
  },
  resultButtons: {
    textTransform: "none",
    color: theme.palette.primary.main,
    "&:hover": {
      backgroundColor: theme.palette.primary.fade,
    },
  },
  resultsPaper: {
    padding: "20px 20px 0px 20px",
    [theme.breakpoints.down("xs")]: {
      padding: "15px 15px 0px 15px",
    },
  },
  studentResultDetails: {
    padding: "15px 20px",
    [theme.breakpoints.down("sm")]: {
      padding: "10px 15px",
    },
  },
  saveScoreButton: {
    backgroundColor: theme.palette.success.main,
    color: "white",
    "&:focus, &:hover": {
      backgroundColor: theme.palette.success.main,
      color: "white",
    },
  },
  listItem: {
    padding: "6px 16px",
    "&:focus, &:hover": {
      backgroundColor: theme.palette.primary.fade,
    },
  },
}));

function SubmittedTaskList(props) {
  const classes = useStyles();
  const {
    getOneTask,
    getAllClass,
    getStudents,
    gradeTask,
    success,
    getFileSubmitTasks_T,
    viewFileSubmitTasks,
  } = props;
  const { selectedTasks } = props.tasksCollection;
  const { all_students, user } = props.auth;
  const { all_classes } = props.classesCollection;
  const { all_subjects_map } = props.subjectsCollection;
  const task_id = props.match.params.id;

  const [grade, setGrade] = React.useState(new Map());
  const [gradeStatus, setGradeStatus] = React.useState(new Map());
  const [openAlert, setOpenAlert] = React.useState(false);
  const [submittedFiles, setSubmittedFiles] = React.useState([]);

  const handleOpenAlert = () => {
    setOpenAlert(true);
  };
  const handleCloseAlert = (e, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenAlert(false);
  };

  React.useEffect(() => {
    getFileSubmitTasks_T(task_id).then((res) => {
      setSubmittedFiles(res);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [task_id]);

  React.useEffect(() => {
    getOneTask(task_id);
    getStudents(user.unit);
    getAllClass(user.unit);
    // ini successnya bakal return 3 barang di list.
    if (success instanceof Array) {
      if (success.length === 3) handleOpenAlert();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTasks._id, success]);

  const [value, setValue] = React.useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleChangeGrade = (e, id) => {
    let gradeMap = grade;
    gradeMap.set(id, e.target.value);
    setGrade(gradeMap);
  };

  const onGradeTugas = (taskId, studentId, student_name, grade) => {
    let gradingData = {
      grade: parseInt(grade.get(studentId)),
      studentId: studentId,
    };
    let gradeStatusMap = gradeStatus;

    if (grade.has(studentId)) {
      gradeStatusMap.set(studentId, "Graded");
      setGradeStatus(gradeStatusMap);
      gradeTask(taskId, gradingData, student_name);
    }
  };

  let temp = new Map();
  if (all_classes.length) {
    all_classes.map((kelas) => temp.set(kelas._id, kelas));
  }

  let student_ids = new Map();
  if (all_students.length) {
    all_students.map((student) => student_ids.set(student._id, student));
  }

  const handleExportTask = () => {
    let result = "";
    let classArray = [];
    selectedTasks.class_assigned.forEach((kelas, i) => {
      let className = all_classes.find((cls) => cls._id === kelas).name;
      if (i !== 0) {
        result = result + ",";
      }
      result = result + className;
      if (i !== selectedTasks.class_assigned.length - 1) {
        result = result + ",";
      }
      classArray.push([kelas]);
    });

    let gradeKeys = Object.keys(selectedTasks.grades);
    let gradeValues = Object.values(selectedTasks.grades);
    gradeKeys.forEach((student_id, i) => {
      let studentData = all_students.find((std) => std._id === student_id);
      if (studentData) {
        let studentName = studentData.name;
        let studentClass = studentData.kelas;
        for (let j = 0; j < classArray.length; j++) {
          if (classArray[j][0] === studentClass) {
            classArray[j].push({
              studentName: studentName,
              studentScore: gradeValues[i],
            });
            break;
          }
        }
      }
    });

    let classLength = [];
    for (let i = 0; i < classArray.length; i++) {
      classLength.push(classArray[i].length);
    }
    let maxClassLength = Math.max(...classLength) - 1;

    for (let i = 0; i < maxClassLength; i++) {
      result = result + "\n";
      for (let j = 0; j < classArray.length; j++) {
        if (j !== 0) {
          result = result + ",";
        }
        if (i + 1 < classArray[j].length) {
          result = result + classArray[j][i + 1].studentName;
          result = result + ",";
          result = result + classArray[j][i + 1].studentScore;
        }
        if (i + 1 >= classArray[j].length) {
          result = result + ",";
        }
      }
    }
    const blob = new Blob([result], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.setAttribute("hidden", "");
    a.setAttribute("href", url);
    a.setAttribute("download", `Hasil ${selectedTasks.name}.csv`);
    a.click();
  };

  const listClassTab = () => {
    let class_assigned = [];
    if (!selectedTasks.class_assigned) {
      return null;
    } else {
      if (temp.size) {
        // Temp = all class
        for (var i = 0; i < selectedTasks.class_assigned.length; i++) {
          class_assigned.push(
            <Tab
              label={
                !temp.get(selectedTasks.class_assigned[i])
                  ? null
                  : temp.get(selectedTasks.class_assigned[i]).name
              }
              {...TabIndex(i)}
            />
          );
        }
        return (
          <Tabs
            variant="scrollable"
            scrollButtons="on"
            indicatorColor="primary"
            textColor="primary"
            value={value}
            onChange={handleChange}
          >
            {class_assigned}
          </Tabs>
        );
      }
    }
  };

  const listClassTabPanel = () => {
    let TabPanelList = [];
    if (!selectedTasks.class_assigned || !all_students) {
      return;
    } else {
      let students_in_class = [];
      let isClassSubmissionEmpty = true;

      // For every class that was given this task.
      all_students
        .filter((s) => selectedTasks.class_assigned[value] === s.kelas)
        .map((student, idx) => {
          // For every file that the student has submitted.
          let students_files = submittedFiles.filter((f) => {
            return f.author_id === student._id;
          });
          let task_list_on_panel;

          if (students_files.length > 0) {
            isClassSubmissionEmpty = false;
            task_list_on_panel = (
              <FileSubmission
                data={students_files}
                onPreviewFile={viewFileSubmitTasks}
              />
            );
          } else {
            task_list_on_panel = [
              <Typography
                align="center"
                color="textSecondary"
                style={{ padding: "20px 0px" }}
              >
                Kosong
              </Typography>,
            ];
          }

          students_in_class.push(
            <ExpansionPanel defaultExpanded={true}>
              <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                <Grid container alignItems="center" spacing={2}>
                  <Hidden xsDown>
                    <Grid item>
                      {!student.avatar ? (
                        <Avatar />
                      ) : (
                        <Avatar src={`/api/upload/avatar/${student.avatar}`} />
                      )}
                    </Grid>
                  </Hidden>
                  <Grid item>
                    <Typography noWrap>{student.name}</Typography>
                    <Typography variant="body2" color="textSecondary" noWrap>
                      {!selectedTasks.grades
                        ? "Not graded"
                        : !gradeStatus.has(student._id) &&
                          !selectedTasks.grades[student._id]
                          ? "Belum Dinilai"
                          : "Telah Dinilai"}
                    </Typography>
                  </Grid>
                </Grid>
              </ExpansionPanelSummary>
              <Divider />
              <ExpansionPanelDetails className={classes.studentResultDetails}>
                <Grid container direction="column" spacing={2}>
                  {task_list_on_panel}
                  {students_files.length > 0 ? (
                    <Grid
                      item
                      container
                      justify="flex-end"
                      alignItems="center"
                      spacing={3}
                    >
                      <Grid item>
                        <TextField
                          defaultValue={
                            grade.has(student._id) ||
                              selectedTasks.grades === null
                              ? grade.get(student._id)
                              : selectedTasks.grades[student._id]
                          }
                          onChange={(e) => {
                            handleChangeGrade(e, student._id);
                          }}
                          InputProps={{
                            endAdornment: "/ 100",
                          }}
                          inputProps={{
                            style: {
                              borderBottom: "none",
                              boxShadow: "none",
                              margin: "0px",
                              width: "35px",
                            },
                          }}
                        />
                      </Grid>
                      <Grid item>
                        <Button
                          variant="contained"
                          className={classes.saveScoreButton}
                          onClick={() =>
                            onGradeTugas(
                              task_id,
                              student._id,
                              student.name,
                              grade
                            )
                          }
                        >
                          Simpan
                        </Button>
                      </Grid>
                    </Grid>
                  ) : null}
                </Grid>
              </ExpansionPanelDetails>
            </ExpansionPanel>
          );
        });
      TabPanelList.push(
        <TabPanel value={value} index={value}>
          {isClassSubmissionEmpty ? <Empty /> : students_in_class}
        </TabPanel>
      );
      return TabPanelList;
    }
  };

  document.title = `Schooly | Daftar Tugas Terkumpul - ${selectedTasks.name}`;

  return (
    <div className={classes.root}>
      <Grid container direction="column" spacing={2}>
        <Grid item>
          <Paper className={classes.submittedTaskPaper}>
            <Typography variant="h4" style={{ marginBottom: "5px" }}>
              {selectedTasks.name}
            </Typography>
            <Typography color="primary" paragraph>
              Tugas {all_subjects_map.get(selectedTasks.subject)}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Oleh: {user.name}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Waktu Dibuat:{" "}
              {moment(selectedTasks.createdAt)
                .locale("id")
                .format("DD MMM YYYY, HH.mm")}
            </Typography>
            <Divider className={classes.submittedTaskDivider} />
            {!selectedTasks.description ? null : (
              <div>
                <Typography color="textSecondary" gutterBottom>
                  Deskripsi Tugas:
                </Typography>
                <Typography
                  align="justify"
                  style={{ wordBreak: "break-word", whiteSpace: "pre-wrap" }}
                >
                  <CustomLinkify text={selectedTasks.description} />
                </Typography>
              </div>
            )}
          </Paper>
        </Grid>
        <Grid
          item
          container
          justify="space-between"
          alignItems="center"
          spacing={1}
        >
          <Grid item>
            <Link to={`/tugas-guru/${task_id}`}>
              <Hidden smDown>
                <Fab
                  size="large"
                  variant="extended"
                  className={classes.discussionButton}
                >
                  <QuestionAnswerIcon style={{ marginRight: "8px" }} />
                  Diskusi
                </Fab>
              </Hidden>
              <Hidden mdUp>
                <Tooltip title="Diskusi">
                  <Fab size="medium" className={classes.discussionButton}>
                    <QuestionAnswerIcon />
                  </Fab>
                </Tooltip>
              </Hidden>
            </Link>
          </Grid>
          <Grid
            item
            xs
            container
            justify="flex-end"
            alignItems="center"
            spacing={1}
          >
            <Grid item>
              <Tooltip title="Unduh Semua Hasil">
                <Button
                  disabled
                  variant="outlined"
                  className={classes.resultButtons}
                >
                  <GetAppIcon />
                </Button>
              </Tooltip>
            </Grid>
            <Grid item>
              <Tooltip title="Unduh Nilai">
                <Button
                  variant="outlined"
                  className={classes.resultButtons}
                  onClick={handleExportTask}
                >
                  <BarChartIcon />
                </Button>
              </Tooltip>
            </Grid>
          </Grid>
        </Grid>
        <Grid item>
          <Paper className={classes.resultsPaper}>
            <Typography variant="h6" gutterBottom>
              Hasil Pekerjaan
            </Typography>
            <Divider />
            <div style={{ padding: "16px 0px 25px 0px" }}>
              <Typography gutterBottom>
                Tenggat:{" "}
                {moment(selectedTasks.deadline)
                  .locale("id")
                  .format("DD MMM YYYY, HH.mm")}
              </Typography>
            </div>
            {listClassTab()}
          </Paper>
        </Grid>
        <Grid item>{listClassTabPanel()}</Grid>
      </Grid>
      <Snackbar
        open={openAlert}
        autoHideDuration={4000}
        onClose={handleCloseAlert}
        anchorOrigin={{ vertical: "center", horizontal: "center" }}
      >
        <Alert
          elevation={6}
          variant="filled"
          onClose={handleCloseAlert}
          severity="success"
        >
          Nilai {!success ? null : success[2]} berhasil diganti menjadi{" "}
          {!success ? null : success[1]}
        </Alert>
      </Snackbar>
    </div>
  );
}

SubmittedTaskList.propTypes = {
  classesCollection: PropTypes.object.isRequired,
  tasksCollection: PropTypes.object.isRequired,
  subjectsCollection: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  success: PropTypes.object.isRequired,
  getOneTask: PropTypes.func.isRequired,
  getStudents: PropTypes.func.isRequired,
  gradeTask: PropTypes.func.isRequired,
  getAllClass: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  tasksCollection: state.tasksCollection,
  success: state.success,
  classesCollection: state.classesCollection,
  subjectsCollection: state.subjectsCollection,
});

export default connect(mapStateToProps, {
  getStudents,
  getOneTask,
  gradeTask,
  getAllClass,
  getAllSubjects,
  getFileSubmitTasks_T,
  viewFileSubmitTasks,
})(SubmittedTaskList);
