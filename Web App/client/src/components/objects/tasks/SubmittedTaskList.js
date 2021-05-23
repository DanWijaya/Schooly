import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { getOneTask, gradeTask } from "../../../actions/TaskActions";
import moment from "moment";
import {
  getTaskFilesByUser,
  // moveToDropbox,
  downloadTugas,
  previewTugas,
} from "../../../actions/UploadActions";
import { getStudents } from "../../../actions/UserActions";
import { getAllClass } from "../../../actions/ClassActions";
import { getAllSubjects } from "../../../actions/SubjectActions";
import {
  Avatar,
  Box,
  Button,
  Divider,
  ExpansionPanel,
  ExpansionPanelSummary,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemIcon,
  ListItemText,
  Paper,
  Snackbar,
  Tabs,
  Tab,
  TextField,
  Typography,
  Grid,
  Hidden,
} from "@material-ui/core";
import LightTooltip from "../../misc/light-tooltip/LightTooltip";
import { makeStyles } from "@material-ui/core/styles";
import CloudDownloadIcon from "@material-ui/icons/CloudDownload";
import GetAppIcon from "@material-ui/icons/GetApp";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import {
  FaFile,
  FaFileAlt,
  FaFileExcel,
  FaFileImage,
  FaFilePdf,
  FaFilePowerpoint,
  FaFileWord,
} from "react-icons/fa";
import MuiAlert from "@material-ui/lab/Alert";
import { getFileSubmitTasks_T, viewFileSubmitTasks } from "../../../actions/files/FileSubmitTaskActions";

const path = require("path");

const useStyles = makeStyles((theme) => ({
  root: {
    margin: "auto",
    maxWidth: "80%",
    [theme.breakpoints.down("md")]: {
      maxWidth: "100%",
    },
    padding: "10px",
  },
  studentFileListContainer: {
    margin: "20px",
  },
  personListContainer: {
    display: "flex",
    alignItems: "center",
    padding: "5px",
  },
  listItemPaper: {
    marginBottom: "10px",
  },
  listItem: {
    padding: "6px 16px",
    "&:focus, &:hover": {
      backgroundColor: theme.palette.primary.fade,
    },
  },
  checkCircleIcon: {
    marginRight: "10px",
    backgroundColor: theme.palette.success.main,
    color: "white",
    "&:focus, &:hover": {
      backgroundColor: "white",
      color: theme.palette.success.main,
    },
  },
  downloadAllButton: {
    backgroundColor: theme.palette.primary.main,
    color: "white",
    "&:focus, &:hover": {
      backgroundColor: "white",
      color: theme.palette.primary.main,
    },
  },
  downloadIconButton: {
    marginLeft: "5px",
    backgroundColor: theme.palette.primary.main,
    color: "white",
    "&:focus, &:hover": {
      backgroundColor: "white",
      color: theme.palette.primary.main,
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
  exportButton: {
    // marginTop: "15px",
    backgroundColor: theme.palette.action.selected,
    color: "black",
    "&:focus, &:hover": {
      backgroundColor: theme.palette.divider,
      color: "black",
    },
  },
  paperBox: {
    padding: "20px 20px 0 20px",
    // marginBottom: "10px",
  },
  dividerColor: {
    backgroundColor: theme.palette.primary.main,
    // marginBottom: "5px"
  },
}));

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div hidden={value !== index} id={`scrollable-force-tabpanel-${index}`} {...other}>
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function TabIndex(index) {
  return {
    id: `scrollable-force-tab-${index}`,
  };
}

function WorkFile(props) {
  const classes = useStyles();

  const {
    file_id,
    file_name,
    file_type,
    onDownloadFile,
    onPreviewFile,
  } = props;

  return (
    <Paper variant="outlined" className={classes.listItemPaper}>
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
          primary={
            <Typography variant="h6" color="textPrimary">
              {file_name}
            </Typography>
          }
          secondary={
            <Typography variant="body2" color="textSecondary">
              {file_type}
            </Typography>
          }
        />
        {/* <ListItemText
          align="right"
          primary={
            <IconButton
              size="small"
              className={classes.downloadIconButton}
              onClick={(e) => {
                e.stopPropagation();
                onDownloadFile(file_id, "lampiran");
              }}
            >
              <CloudDownloadIcon fontSize="small" />
            </IconButton>
          }
        /> */}
      </ListItem>
    </Paper>
  );
}
function GradeButton(props) {
  const classes = useStyles();
  const {
    onGradeTugas,
    task_id,
    student_id,
    grade,
    student_name,
    // student_task_files_id,
  } = props;

  return (
    <Button
      variant="contained"
      startIcon={<CheckCircleIcon />}
      className={classes.checkCircleIcon}
      onClick={() =>
        onGradeTugas(
          task_id,
          // student_task_files_id,
          student_id,
          student_name,
          grade
        )
      }
    >
      Simpan
    </Button>
  );
}

function UnduhSemuaButton(props) {
  const classes = useStyles();
  const { onDownloadFile, student_task_files_id } = props;
  return (
    <Button
      variant="contained"
      startIcon={<GetAppIcon />}
      className={classes.downloadAllButton}
      onClick={() => onDownloadFile(student_task_files_id, "lampiran/bulk")}
    >
      Unduh Semua
    </Button>
  );
}

function SubmittedTaskList(props) {
  const classes = useStyles();
  const {
    getOneTask,
    getAllClass,
    tasksCollection,
    getStudents,
    downloadTugas,
    previewTugas,
    // moveToDropbox,
    gradeTask,
    success,
    getFileSubmitTasks_T,
    viewFileSubmitTasks
  } = props;
  const { all_classes } = props.classesCollection;
  const {
    all_students,
    // dropbox_token,
    user,
  } = props.auth;
  const { all_subjects_map } = props.subjectsCollection;
  const task_id = props.match.params.id;

  const [grade, setGrade] = React.useState(new Map());
  const [gradeStatus, setGradeStatus] = React.useState(new Map());
  const [openAlert, setOpenAlert] = React.useState(false);
  const [submittedFiles, setSubmittedFiles] = React.useState([]);

  console.log(grade);
  console.log(all_students);

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
    getFileSubmitTasks_T(task_id)
      .then((res) => {
        setSubmittedFiles(res);
      })
      .catch((err) =>
        console.log("Terjadi error di fetching submitted task files")
      );
  }, []);

  React.useEffect(() => {
    getOneTask(task_id);
    getStudents();
    getAllClass();
    // ini successnya bakal return 3 barang di list.
    if (success instanceof Array) {
      if (success.length === 3) handleOpenAlert();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tasksCollection._id, success]);

  console.log(success);
  const [value, setValue] = React.useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleChangeGrade = (e, id) => {
    let gradeMap = grade;
    gradeMap.set(id, e.target.value);
    setGrade(gradeMap);
  };

  const onDownloadFile = (id, fileCategory = "none") => {
    if (fileCategory === "lampiran") downloadTugas(id);
    else if (fileCategory === "lampiran/bulk") {
      console.log(id);
      for (var i = 0; i < id.length; i++) {
        downloadTugas(id[i]);
      }
    }
    console.log("File Category is not specified");
  };

  const onPreviewFile = (id, fileCategory = "none") => {
    if (fileCategory === "lampiran") viewFileSubmitTasks(id);
    else console.log("File Category is not specified");
  };

  const onGradeTugas = (
    taskId,
    // student_task_files_id,
    studentId,
    student_name,
    grade
  ) => {
    console.log(studentId, grade);
    console.log(grade.get(studentId));
    let gradingData = {
      grade: parseInt(grade.get(studentId)),
      studentId: studentId,
    };
    console.log(gradingData);
    let gradeStatusMap = gradeStatus;

    if (grade.has(studentId)) {
      gradeStatusMap.set(studentId, "Graded");
      setGradeStatus(gradeStatusMap);
      // getOneTask(task_id);
      gradeTask(taskId, gradingData, student_name);
      // moveToDropbox(dropbox_token, student_task_files_id);
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
    console.log(tasksCollection);
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
    console.log(Object.keys(tasksCollection.grades));

    let gradeKeys = Object.keys(tasksCollection.grades);
    let gradeValues = Object.values(tasksCollection.grades);
    console.log(gradeValues);
    gradeKeys.forEach((student_id, i) => {
      let studentData = all_students.find((std) => std._id === student_id);
      if(studentData){
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
    console.log(result);
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
        // temp ini adalah semua kelas
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
            value={value}
            variant="scrollable"
            scrollButtons="on"
            onChange={handleChange}
            indicatorColor="primary"
            textColor="primary"
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
      return
    } else {
      let { class_assigned } = tasksCollection;
      // let student_task_files_id; // to handle the download all, this is needed.
      let students_in_class = [];
      let isClassSubmissionEmpty = true;
      // untuk setiap kelas yang diberikan task ini,
      all_students
        .filter((s) => tasksCollection.class_assigned[value] === s.kelas)
        .map((student, idx) => {
          // untuk setiap file yang pernah dikumpulkan murid ini.
          console.log(submittedFiles)
          let students_files = submittedFiles.filter(
            (f) => {return f.author_id == student._id}
          );
          console.log(student._id)
          console.log(students_files)
          let task_list_on_panel;

          if (students_files.length > 0) {
            isClassSubmissionEmpty = false;
            task_list_on_panel = students_files.map((file) => (
              <WorkFile
                file_id={file._id}
                file_name={file.filename}
                file_type={fileType(file.filename)}
                onPreviewFile={viewFileSubmitTasks}
                // onDownloadFile={onDownloadFile}
              />
            ));
          } else {
            task_list_on_panel = [
              <Typography
                align="center"
                color="textSecondary"
                variant="subtitle1"
              >
                Kosong
              </Typography>,
            ];
          }

          students_in_class.push(
            <ExpansionPanel>
              <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                <ListItem className={classes.personListContainer}>
                  <ListItemAvatar>
                    {!student.avatar ? (
                      <Avatar style={{ marginRight: "10px" }} />
                    ) : (
                      <Avatar
                        src={`/api/upload/avatar/${student.avatar}`}
                        style={{ marginRight: "10px" }}
                      />
                    )}
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Typography variant="h6">{student.name}</Typography>
                    }
                    //  secondary={task_list_on_panel.length === 0 || !tasksCollection.grades ? "Belum dikumpul" : Boolean(tasksCollection.grades[student._id]) ? "Graded" : "Not Graded" }/>
                    secondary={
                      !tasksCollection.grades
                        ? "Not graded"
                        : !gradeStatus.has(student._id) &&
                          !tasksCollection.grades[student._id]
                        ? "Belum Dinilai"
                        : "Telah Dinilai"
                    }
                  />
                </ListItem>
              </ExpansionPanelSummary>
              <Divider />
              <div className={classes.studentFileListContainer}>
                <List>{task_list_on_panel}</List>
                {students_files.length > 0 ? (
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "flex-end",
                        alignItems: "center",
                      }}
                    >
                      <div
                        style={{
                          marginRight: "20px",
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
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
                      </div>
                      <div>
                        <GradeButton
                          onGradeTugas={onGradeTugas}
                          // student_task_files_id={student_task_files_id}
                          task_id={task_id}
                          student_id={student._id}
                          student_name={student.name}
                          grade={grade}
                        />
                        {/* <UnduhSemuaButton
                          onDownloadFile={onDownloadFile}
                          // student_task_files_id={student_task_files_id}
                        /> */}
                      </div>
                    </div>
                  ) : null}
              </div>
            </ExpansionPanel>
          );
        });
        TabPanelList.push(
          <TabPanel value={value} index={value}>
            {isClassSubmissionEmpty ? (
              <Grid
                container
                alignItems="center"
                justify="center"
                style={{ height: "20vh" }}
              >
                <Typography variant="h5" color="textSecondary" align="center">
                  Belum ada murid yang mengumpulkan tugas
                </Typography>
              </Grid>
            ) : (
              students_in_class
            )}
          </TabPanel>
        );
        return TabPanelList;
      }

    // return tasksCollection.class_assigned.length > 0 ? TabPanelList : null;
  };

  document.title = "Schooly | Daftar Tugas Terkumpul";
  console.log(success);
  // Before that, run this :
  return (
    <div className={classes.root}>
      <Snackbar
        open={openAlert}
        autoHideDuration={4000}
        onClose={handleCloseAlert}
        anchorOrigin={{ vertical: "center", horizontal: "center" }}
      >
        <Alert onClose={handleCloseAlert} severity="success">
          Nilai {!success ? null : success[2]} berhasil diganti menjadi{" "}
          {!success ? null : success[1]}
        </Alert>
      </Snackbar>
      <Paper className={classes.paperBox}>
        <Grid container spacing={2}>
          <Grid item xs={12} style={{ paddingBottom: "0" }}>
            <Typography variant="h4">{tasksCollection.name}</Typography>
            <Typography variant="caption" color="textSecondary" gutterBottom>
              <h6>{all_subjects_map.get(tasksCollection.subject)}</h6>
            </Typography>
          </Grid>

          <Grid item xs={12} md={7} style={{ paddingTop: "0" }}>
            <Typography variant="body2" color="textSecondary">
              Oleh: <b>{user.name}</b>
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Waktu Dibuat:{" "}
              {moment(tasksCollection.createdAt)
                .locale("id")
                .format("DD MMM YYYY, HH.mm")}
            </Typography>
            <Hidden mdUp>
              <Typography variant="body2" color="textSecondary">
                Tenggat:{" "}
                {moment(tasksCollection.deadline)
                  .locale("id")
                  .format("DD MMM YYYY, HH.mm")}
              </Typography>
            </Hidden>
          </Grid>

          <Hidden smDown style={{ display: "flex" }}>
            <Grid
              item
              xs={12}
              md={5}
              style={{
                display: "flex",
                justifyContent: "flex-end",
                alignItems: "flex-end",
              }}
            >
              <Typography variant="body2" align="right" color="textSecondary">
                Tenggat:{" "}
                {moment(tasksCollection.deadline)
                  .locale("id")
                  .format("DD MMM YYYY, HH.mm")}
              </Typography>
            </Grid>
          </Hidden>

          <Grid item xs={12}>
            <Divider className={classes.dividerColor} />
          </Grid>

          <Grid item container justify="flex-end">
            <LightTooltip title="Export Hasil Tugas">
              <IconButton
                onClick={handleExportTask}
                className={classes.exportButton}
              >
                <GetAppIcon />
              </IconButton>
            </LightTooltip>
          </Grid>

          <Grid item style={{ paddingBottom: "0", width: "100%" }}>
            {listClassTab()}
          </Grid>
        </Grid>
      </Paper>
      {listClassTabPanel()}
    </div>
  );
}

SubmittedTaskList.propTypes = {
  classesCollection: PropTypes.object.isRequired,
  tasksCollection: PropTypes.object.isRequired,
  subjectsCollection: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  success: PropTypes.object.isRequired,
  getTaskFilesByUser: PropTypes.func.isRequired,
  getOneTask: PropTypes.func.isRequired,
  getStudents: PropTypes.func.isRequired,
  downloadTugas: PropTypes.func.isRequired,
  previewTugas: PropTypes.func.isRequired,
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
  getTaskFilesByUser,
  getOneTask,
  downloadTugas,
  previewTugas,
  gradeTask,
  getAllClass,
  // moveToDropbox,
  getAllSubjects,
  getFileSubmitTasks_T,
  viewFileSubmitTasks
})(SubmittedTaskList);
