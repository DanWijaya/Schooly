import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { getOneTask, gradeTask } from "../../../actions/TaskActions";
import moment from "moment";
import {
  getTaskFilesByUser,
  moveToDropbox,
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
  Hidden
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
    marginTop: "15px",
    backgroundColor: theme.palette.action.selected,
    color: "black",
    "&:focus, &:hover": {
      backgroundColor: theme.palette.divider,
      color: "black",
    },
  },
  paperBox: {
    padding: "20px",
    marginBottom: "10px",
  },
  dividerColor: {
    backgroundColor: theme.palette.primary.main,
    marginBottom: "5px"
  },
}));

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div hidden={value !== index} id={`simple-tabpanel-${index}`} {...other}>
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
    id: `simple-tab-${index}`,
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
          onPreviewFile(file_id, "lampiran");
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
          primary={file_name}
          secondary={
            <Typography variant="caption" color="textSecondary">
              {file_type}
            </Typography>
          }
        />
        <ListItemIcon>
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
        </ListItemIcon>
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
    student_task_files_id,
  } = props;

  return (
    <Button
      variant="contained"
      startIcon={<CheckCircleIcon />}
      className={classes.checkCircleIcon}
      onClick={() =>
        onGradeTugas(
          task_id,
          student_task_files_id,
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
    moveToDropbox,
    gradeTask,
    success,
  } = props;
  const { all_classes } = props.classesCollection;
  const { all_students, dropbox_token, user } = props.auth;
  const { all_subjects_map } = props.subjectsCollection;
  const task_id = props.match.params.id;

  const [grade, setGrade] = React.useState(new Map());
  const [gradeStatus, setGradeStatus] = React.useState(new Map());
  const [openAlert, setOpenAlert] = React.useState(false);

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
    window.scrollTo(0, 0);
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
    if (fileCategory === "lampiran") previewTugas(id);
    else console.log("File Category is not specified");
  };

  const onGradeTugas = (
    taskId,
    student_task_files_id,
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
    let gradeStatusMap = gradeStatus;

    if (grade.has(studentId)) {
      gradeStatusMap.set(studentId, "Graded");
      setGradeStatus(gradeStatusMap);
      getOneTask(task_id);
      gradeTask(taskId, gradingData, student_name);
      moveToDropbox(dropbox_token, student_task_files_id);
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

  const handleExportTask = () => {
    console.log(tasksCollection)
    let result = ""
    let classArray = []
    tasksCollection.class_assigned.forEach((kelas, i) => {
      let className = all_classes.find((cls) => cls._id === kelas).name;
      if(i !== 0){
        result = result + ','
      }
      result = result + className;
      if(i !== tasksCollection.class_assigned.length - 1){
        result = result + ','
      }
      classArray.push([kelas])
    })
    console.log(Object.keys(tasksCollection.grades))

    let gradeKeys = Object.keys(tasksCollection.grades)
    let gradeValues = Object.values(tasksCollection.grades)
    console.log(gradeValues)
    gradeKeys.forEach((student_id, i) => {
      let studentData = all_students.find((std) => std._id === student_id)
      let studentName = studentData.name
      let studentClass = studentData.kelas
      for(let j=0;j<classArray.length;j++){
        if(classArray[j][0] === studentClass){
          classArray[j].push({studentName: studentName, studentScore: gradeValues[i]})
          break;
        }
      }
    })

    let classLength = []
    for(let i=0;i<classArray.length;i++){
      classLength.push(classArray[i].length)
    }
    let maxClassLength = Math.max(...classLength)-1

    for(let i=0;i<maxClassLength;i++){
      result = result + '\n'
      for(let j=0;j<classArray.length;j++){
        if(j !== 0){
          result = result + ',';
        }
        if(i+1 < classArray[j].length){
          result = result + classArray[j][i+1].studentName
          result = result + ',';
          result = result + classArray[j][i+1].studentScore
        }
        if(i+1 >= classArray[j].length){
          result = result + ',';
        }
      }
    }
    console.log(result)
    const blob = new Blob([result], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.setAttribute("hidden", "");
    a.setAttribute("href", url);
    a.setAttribute("download", `Hasil ${tasksCollection.name}.csv`);
    a.click();
  }

  const listClassTab = () => {
    let class_assigned = [];
    if (!tasksCollection.class_assigned) {
      return null;
    } else {
      if (temp.size) {
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

  // const listClassTabPanel = () => {
  //   return null;
  // }

  const listClassTabPanel = () => {
    let TabPanelList = [];
    if (!tasksCollection.class_assigned || !all_students) {
      return null;
    } else {
      let student_task_files_id; // to handle the download all, this is needed.
      for (var i = 0; i < tasksCollection.class_assigned.length; i++) {
        let students_in_class = [];
        for (var j = 0; j < all_students.length; j++) {
          // check if the id of the class is the same or not (means student is inside)
          student_task_files_id = [];
          if (all_students[j].kelas === tasksCollection.class_assigned[i]) {
            let student = all_students[j];
            let student_task = all_students[j].tugas;
            console.log(student_task);
            let task_list_on_panel = [];
            for (var k = 0; k < student_task.length; k++) {
              let task = student_task[k];
              if (student_task[k].for_task_object === task_id) {
                student_task_files_id.push(task.id);
                task_list_on_panel.push(
                  <WorkFile
                    file_id={task.id}
                    file_name={
                      !task.ontime ? (
                        <div>
                          {" "}
                          {task.filename}{" "}
                          <Typography display="inline" color="error">
                            (TELAT)
                          </Typography>
                        </div>
                      ) : (
                        task.filename
                      )
                    }
                    on_time={task.ontime}
                    file_type={fileType(task.filename)}
                    onPreviewFile={onPreviewFile}
                    onDownloadFile={onDownloadFile}
                  />
                );
              }
            }
            if (task_list_on_panel.length === 0) {
              task_list_on_panel.push(
                <Typography
                  align="center"
                  color="textSecondary"
                  variant="subtitle1"
                >
                  Kosong
                </Typography>
              );
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
                  {student_task_files_id.length > 0 ? (
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
                          student_task_files_id={student_task_files_id}
                          task_id={task_id}
                          student_id={student._id}
                          student_name={student.name}
                          grade={grade}
                        />
                        <UnduhSemuaButton
                          onDownloadFile={onDownloadFile}
                          student_task_files_id={student_task_files_id}
                        />
                      </div>
                    </div>
                  ) : null}
                </div>
              </ExpansionPanel>
            );
          }
        }
        TabPanelList.push(
          <TabPanel value={value} index={i}>
            {students_in_class}
          </TabPanel>
        );
      }
    }
    return tasksCollection.class_assigned.length > 0 ? TabPanelList : null;
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
          <Grid item xs={12} style={{paddingBottom: "0"}}>
            <Typography variant="h4">{tasksCollection.name}</Typography>
            <Typography variant="caption" color="textSecondary" gutterBottom>
              <h6>{all_subjects_map.get(tasksCollection.subject)}</h6>
            </Typography>
          </Grid>

          <Grid item xs={12} md={7} style={{paddingTop: "0"}}>
            <Typography variant="body2" color="textSecondary">
              Penanggung Jawab: <b>{user.name}</b>
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

          {/* <Grid item xs={12} md={5} style={{ display: "flex", justifyContent: "flex-end", alignItems: "flex-end"}} > */}
          {/* <Hidden mdUp>
              <Typography variant="body2" color="textSecondary">
                Tenggat: {moment(tasksCollection.deadline).locale("id").format("DD MMM YYYY, HH.mm")}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Nilai Maksimum: 100
              </Typography>
            </Hidden> */}
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
              {/* <Typography variant="body2" align="right" color="textSecondary">
                Nilai Maksimum: 100
              </Typography> */}
            </Grid>
          </Hidden>
          {/* </Grid> */}

          <Grid item xs={12}>
            <Divider className={classes.dividerColor} />
          </Grid>
        </Grid>
        <div style={{display: "flex", justifyContent: "flex-end", flexDirection: "row"}}>
          <LightTooltip title="Export Hasil Tugas">
            <IconButton
              onClick={handleExportTask}
              className={classes.exportButton}
            >
              <GetAppIcon />
            </IconButton>
          </LightTooltip>
        </div>
        {listClassTab()}
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
  subjectsCollection: state.subjectsCollection
});

export default connect(mapStateToProps, {
  getStudents,
  getTaskFilesByUser,
  getOneTask,
  downloadTugas,
  previewTugas,
  gradeTask,
  getAllClass,
  moveToDropbox,
  getAllSubjects,
})(SubmittedTaskList);
