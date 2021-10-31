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
import { TabPanel, TabIndex } from "../../misc/tab-panel/TabPanel";
import Empty from "../../misc/empty/Empty";
import CustomLinkify from "../../misc/linkify/Linkify";
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
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
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
import {
  FaFile,
  FaFileAlt,
  FaFileExcel,
  FaFileImage,
  FaFilePdf,
  FaFilePowerpoint,
  FaFileWord,
} from "react-icons/fa";

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
  wordFileTypeIcon: {
    backgroundColor: "#16B0DD",
  },
  excelFileTypeIcon: {
    backgroundColor: "#68C74F",
  },
  imageFileTypeIcon: {
    backgroundColor: "#974994",
  },
  pdfFileTypeIcon: {
    backgroundColor: "#E43B37",
  },
  textFileTypeIcon: {
    backgroundColor: "#F7BC24",
  },
  presentationFileTypeIcon: {
    backgroundColor: "#FD931D",
  },
  otherFileTypeIcon: {
    backgroundColor: "#808080",
  },
}));

const path = require("path");

function WorkFile(props) {
  const classes = useStyles();
  const {
    file_id,
    file_name,
    file_type,
    onDownloadFile,
    onPreviewFile,
    isLate,
  } = props;

  let name_to_show;
  if (isLate) {
    name_to_show = (
      <Typography color="error"> {`${file_name} (Telat)`}</Typography>
    );
  } else {
    name_to_show = <Typography color="textPrimary">{file_name}</Typography>;
  }

  return (
    <Paper variant="outlined">
      <ListItem
        button
        disableRipple
        className={classes.listItem}
        onClick={() => {
          onPreviewFile(file_id);
        }}
      >
        <ListItemAvatar>
          {file_type === "Word" ? (
            <Avatar className={classes.wordFileTypeIcon}>
              <FaFileWord />
            </Avatar>
          ) : file_type === "Excel" ? (
            <Avatar className={classes.excelFileTypeIcon}>
              <FaFileExcel />
            </Avatar>
          ) : file_type === "Gambar" ? (
            <Avatar className={classes.imageFileTypeIcon}>
              <FaFileImage />
            </Avatar>
          ) : file_type === "PDF" ? (
            <Avatar className={classes.pdfFileTypeIcon}>
              <FaFilePdf />
            </Avatar>
          ) : file_type === "Teks" ? (
            <Avatar className={classes.textFileTypeIcon}>
              <FaFileAlt />
            </Avatar>
          ) : file_type === "Presentasi" ? (
            <Avatar className={classes.presentationFileTypeIcon}>
              <FaFilePowerpoint />
            </Avatar>
          ) : file_type === "File Lainnya" ? (
            <Avatar className={classes.otherFileTypeIcon}>
              <FaFile />
            </Avatar>
          ) : null}
        </ListItemAvatar>
        <ListItemText
          primary={name_to_show}
          secondary={
            <Typography variant="body2" color="textSecondary">
              {file_type}
            </Typography>
          }
        />
      </ListItem>
    </Paper>
  );
}

function SubmittedTaskList(props) {
  const classes = useStyles();
  const {
    getOneTask,
    getAllClass,
    tasksCollection,
    getStudents,
    gradeTask,
    success,
    getFileSubmitTasks_T,
    viewFileSubmitTasks,
  } = props;
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
    // getOneTask(task_id).then((res1) => {
    // })
    getFileSubmitTasks_T(task_id).then((res) => {
      setSubmittedFiles(res);
    });
  }, []);

  React.useEffect(() => {
    getOneTask(task_id);
    getStudents(user.unit);
    getAllClass(user.unit);
    // ini successnya bakal return 3 barang di list.
    if (success instanceof Array) {
      if (success.length === 3) handleOpenAlert();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tasksCollection._id, success]);

  const [value, setValue] = React.useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleChangeGrade = (e, id) => {
    let gradeMap = grade;
    gradeMap.set(id, e.target.value);
    setGrade(gradeMap);
  };

  const onPreviewFile = (id, fileCategory = "none") => {
    if (fileCategory === "lampiran") viewFileSubmitTasks(id);
  };

  const onGradeTugas = (
    taskId,
    // student_task_files_id,
    studentId,
    student_name,
    grade
  ) => {
    let gradingData = {
      grade: parseInt(grade.get(studentId)),
      studentId: studentId,
    };
    let gradeStatusMap = gradeStatus;

    if (grade.has(studentId)) {
      gradeStatusMap.set(studentId, "Graded");
      setGradeStatus(gradeStatusMap);
      // getOneTask(task_id);
      gradeTask(taskId, gradingData, student_name);
    }
  };

  const fileType = (filename) => {
    let ext_file = path.extname(filename);
    switch (ext_file) {
      case ".docx":
        return "Word";
      case ".xlsx":
      case ".csv":
        return "Excel";

      case ".png":
      case ".jpg":
      case ".jpeg":
        return "Gambar";

      case ".pdf":
        return "PDF";

      case ".txt":
      case ".rtf":
        return "Teks";

      case ".ppt":
      case ".pptx":
        return "Presentasi";

      default:
        return "File Lainnya";
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
    tasksCollection.class_assigned.forEach((kelas, i) => {
      let className = all_classes.find((cls) => cls._id === kelas).name;
      if (i !== 0) {
        result = result + ",";
      }
      result = result + className;
      if (i !== tasksCollection.class_assigned.length - 1) {
        result = result + ",";
      }
      classArray.push([kelas]);
    });

    let gradeKeys = Object.keys(tasksCollection.grades);
    let gradeValues = Object.values(tasksCollection.grades);
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
    a.setAttribute("download", `Hasil ${tasksCollection.name}.csv`);
    a.click();
  };

  const listClassTab = () => {
    let class_assigned = [];
    if (!tasksCollection.class_assigned) {
      return null;
    } else {
      if (temp.size) {
        // Temp = all class
        for (var i = 0; i < tasksCollection.class_assigned.length; i++) {
          class_assigned.push(
            <Tab
              label={
                !temp.get(tasksCollection.class_assigned[i])
                  ? null
                  : temp.get(tasksCollection.class_assigned[i]).name
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
    if (!tasksCollection.class_assigned || !all_students) {
      return;
    } else {
      let { class_assigned } = tasksCollection;
      // let student_task_files_id; // To handle the download all, this is needed.
      let students_in_class = [];
      let isClassSubmissionEmpty = true;
      // For every class that was given this task.
      all_students
        .filter((s) => tasksCollection.class_assigned[value] === s.kelas)
        .map((student, idx) => {
          // For every file that the student has submitted.
          let students_files = submittedFiles.filter((f) => {
            return f.author_id == student._id;
          });
          let task_list_on_panel;

          if (students_files.length > 0) {
            isClassSubmissionEmpty = false;
            let isLate = false;
            task_list_on_panel = students_files.map((file) => {
              if (file.createdAt > tasksCollection.deadline) {
                isLate = true;
              }
              return (
                <WorkFile
                  isLate={isLate}
                  file_id={file._id}
                  file_name={file.filename}
                  file_type={fileType(file.filename)}
                  onPreviewFile={viewFileSubmitTasks}
                  // onDownloadFile={onDownloadFile}
                />
              );
            });
          } else {
            task_list_on_panel = [
              <Typography align="center" color="textSecondary">
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
                      {!tasksCollection.grades
                        ? "Not graded"
                        : !gradeStatus.has(student._id) &&
                          !tasksCollection.grades[student._id]
                        ? "Belum Dinilai"
                        : "Telah Dinilai"}
                    </Typography>
                  </Grid>
                </Grid>
              </ExpansionPanelSummary>
              <Divider />
              <ExpansionPanelDetails className={classes.studentResultDetails}>
                <Grid container direction="column" spacing={2}>
                  <Grid item>
                    <List>{task_list_on_panel}</List>
                  </Grid>
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
                            tasksCollection.grades === null
                              ? grade.get(student._id)
                              : tasksCollection.grades[student._id]
                          }
                          onChange={(e) => {
                            handleChangeGrade(e, student._id);
                          }}
                          inputProps={{
                            style: {
                              borderBottom: "none",
                              boxShadow: "none",
                              margin: "0px",
                              width: "35px",
                            },
                          }}
                          InputProps={{
                            endAdornment: "/ 100",
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
                              // student_task_files_id,
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

  document.title = "Schooly | Daftar Tugas Terkumpul";

  return (
    <div className={classes.root}>
      <Grid container direction="column" spacing={2}>
        <Grid item>
          <Paper className={classes.submittedTaskPaper}>
            <Typography variant="h4" style={{ marginBottom: "5px" }}>
              {tasksCollection.name}
            </Typography>
            <Typography color="primary" paragraph>
              Tugas {all_subjects_map.get(tasksCollection.subject)}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Oleh: {user.name}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Waktu Dibuat:{" "}
              {moment(tasksCollection.createdAt)
                .locale("id")
                .format("DD MMM YYYY, HH.mm")}
            </Typography>
            <Divider className={classes.submittedTaskDivider} />
            {!tasksCollection.description ? null : (
              <div>
                <Typography color="textSecondary" gutterBottom>
                  Deskripsi Tugas:
                </Typography>
                <Typography
                  align="justify"
                  style={{ wordBreak: "break-word", whiteSpace: "pre-wrap" }}
                >
                  <CustomLinkify text={tasksCollection.description} />
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
                {moment(tasksCollection.deadline)
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
