import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { viewOneTask, gradeTask } from "../../../actions/TaskActions";
import { getTaskFilesByUser, downloadTugas, previewTugas } from "../../../actions/UploadActions";
import { getStudents } from "../../../actions/UserActions";
import { viewClass } from "../../../actions/ClassActions";
import { Avatar, Box, Button, Divider, ExpansionPanel, ExpansionPanelSummary, IconButton,
   List, ListItem, ListItemAvatar, ListItemIcon, ListItemText, Paper, Snackbar, Tabs, Tab, TextField, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import CloudDownloadIcon from "@material-ui/icons/CloudDownload";
import GetAppIcon from "@material-ui/icons/GetApp";
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import { FaFile, FaFileAlt, FaFileExcel, FaFileImage, FaFilePdf, FaFilePowerpoint, FaFileWord } from "react-icons/fa";
import MuiAlert from "@material-ui/lab/Alert";

const path = require("path");

const useStyles = makeStyles((theme) => ({
  root: {
    margin: "auto",
    maxWidth: "1000px",
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
    marginBottom: "10px"
  },
  listItem: {
    "&:focus, &:hover": {
      backgroundColor: theme.palette.button.main,
    },
  },
  checkCircleIcon: {
    marginRight: "10px",
    backgroundColor: "#61BD4F",
    color: "white",
    "&:focus, &:hover": {
      backgroundColor: "white",
      color: "#61BD4F"
    },
  },
  downloadAllButton: {
    backgroundColor: theme.palette.primary.main,
    color: "white",
    "&:focus, &:hover": {
      backgroundColor: "white",
      color: theme.palette.primary.main
    }
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
}));

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      {...other}
    >
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

  const { file_id, file_name, file_type, onDownloadFile, onPreviewFile} = props;

  return (
    <Paper variant="outlined" className={classes.listItemPaper}>
      <ListItem button disableRipple className={classes.listItem}
      onClick={() => {onPreviewFile(file_id, "lampiran")}}>
        <ListItemAvatar>
          {file_type === "Word" ?
              <Avatar className={classes.wordFileTypeIcon}>
                <FaFileWord />
              </Avatar>
            :
            file_type === "Excel" ?
              <Avatar className={classes.excelFileTypeIcon}>
                <FaFileExcel />
              </Avatar>
            :
            file_type === "Gambar" ?
              <Avatar className={classes.imageFileTypeIcon}>
                <FaFileImage />
              </Avatar>
            :
            file_type === "PDF" ?
              <Avatar className={classes.pdfFileTypeIcon}>
                <FaFilePdf />
              </Avatar>
            :
            file_type === "Teks" ?
              <Avatar className={classes.textFileTypeIcon}>
                <FaFileAlt />
              </Avatar>
            :
            file_type === "Presentasi" ?
              <Avatar className={classes.presentationFileTypeIcon}>
                <FaFilePowerpoint />
              </Avatar>
            :
            file_type === "File Lainnya" ?
              <Avatar className={classes.otherFileTypeIcon}>
                <FaFile />
              </Avatar>
            : null
          }
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
          <IconButton size="small" className={classes.downloadIconButton} onClick={(e) => { e.stopPropagation()
            onDownloadFile(file_id, "lampiran")}}>
            <CloudDownloadIcon fontSize="small"/>
          </IconButton>
        </ListItemIcon>
      </ListItem>
    </Paper>
  )
}
function GradeButton(props) {
  const classes = useStyles()
  const {onGradeTugas, task_id, student_id, grade, student_name} = props

  return (
    <Button
      variant="contained"
      startIcon={<CheckCircleIcon/>}
      className={classes.checkCircleIcon}
      onClick={() => onGradeTugas(task_id, student_id, student_name, grade)}
    >
      Simpan
    </Button>
  )
}

function UnduhSemuaButton(props) {
  const classes = useStyles()
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
    )
}

function SubmittedTaskList(props) {
  const classes = useStyles();

  const { viewOneTask, viewClass, tasksCollection, getStudents, downloadTugas, previewTugas, gradeTask, success } = props;
  const { all_classes } = props.classesCollection;
  const { all_students } = props.auth;
  const task_id = props.match.params.id;

  const [grade, setGrade] = React.useState(new Map());
  const [gradeStatus, setGradeStatus] = React.useState(new Map());
  const [openAlert, setOpenAlert] = React.useState(false);

  console.log(grade)
  console.log(all_students)

  const handleOpenAlert = () => {
    setOpenAlert(true);
  }
  const handleCloseAlert = (e, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenAlert(false);
  }

  React.useEffect(() => {
    viewOneTask(task_id)
    getStudents()
    viewClass()
    // ini successnya bakal return 3 barang di list.
    if(success instanceof Array){
      if(success.length === 3)
        handleOpenAlert()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tasksCollection._id, success])

  console.log(success)
  const [value, setValue] = React.useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleChangeGrade = (e, id) => {
    let gradeMap = grade
    gradeMap.set(id, e.target.value)
    setGrade(gradeMap)
  };

  const onDownloadFile = (id, fileCategory = "none") => {
    if (fileCategory === "lampiran")
      downloadTugas(id)
    else if (fileCategory === "lampiran/bulk") {
      console.log(id)
      for (var i = 0; i < id.length; i++) {
        downloadTugas(id[i])
      }
    }
      console.log("File Category is not specified")
  }

  const onPreviewFile = (id, fileCategory = "none") => {
    if (fileCategory === "lampiran")
      previewTugas(id)
    else
      console.log("File Category is not specified")
  }

  const onGradeTugas = (taskId, studentId, student_name, grade) => {
    console.log(studentId, grade)
    console.log(grade.get(studentId))
    let gradingData = {
      grade: parseInt(grade.get(studentId)),
      studentId: studentId
    }
    console.log(taskId, gradingData)
    let gradeStatusMap = gradeStatus

    if (grade.has(studentId)) {
      gradeStatusMap.set(studentId, "Graded")
      setGradeStatus(gradeStatusMap)
      viewOneTask(task_id)
      gradeTask(taskId, gradingData, student_name)
    }
  }

  const fileType = (filename) => {
    let ext_file = path.extname(filename)
    switch(ext_file) {
      case ".docx" : return "Word"
      case ".xlsx" :
      case ".csv"  : return "Excel"

      case ".png":
      case ".jpg":
      case ".jpeg" : return "Gambar"

      case ".pdf" : return "PDF"

      case ".txt" :
      case ".rtf" : return "Teks"

      case ".ppt" :
      case ".pptx": return "Presentasi"

      default: return "File Lainnya"
    }
  }

  let temp = new Map()
  if (all_classes.length) {
    all_classes.map((kelas) => temp.set(kelas._id, kelas))
  }

  const listClassTab = () => {
    let class_assigned = []
    if (!tasksCollection.class_assigned) {
      return null;
    }
    else {
      if (temp.size) {
        for (var i = 0; i < tasksCollection.class_assigned.length; i++) {
          class_assigned.push(<Tab label={!temp.get(tasksCollection.class_assigned[i]) ? null : temp.get(tasksCollection.class_assigned[i]).name} {...TabIndex(i)}/>)
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
        )
      }
    }
  }

  const listClassTabPanel = () => {
    return null;
  }
  
  // const listClassTabPanel = () => {
  //   let TabPanelList = []
  //   if (!tasksCollection.class_assigned || !all_students) {
  //     return null
  //   }
  //   else {
  //     let student_task_files_id; // to handle the download all, this is needed.
  //     for(var i = 0; i < tasksCollection.class_assigned.length; i++) {
  //       let students_in_class = [];
  //       for(var j = 0; j < all_students.length; j++) {
  //         // check if the id of the class is the same or not (means student is inside)
  //         student_task_files_id = []
  //         if (all_students[j].kelas === tasksCollection.class_assigned[i]) {
  //           let student = all_students[j]
  //           let student_task = all_students[j].tugas
  //           let task_list_on_panel = []
  //           for( var k = 0; k < student_task.length; k++) {
  //             let task = student_task[k]
  //             if (student_task[k].for_task_object === task_id) {
  //               student_task_files_id.push(task.id)
  //               task_list_on_panel.push(
  //               <WorkFile
  //                 file_id={task.id}
  //                 file_name={!task.ontime ? <div> {task.filename}  <Typography display="inline" color="error">(TELAT)</Typography></div> : task.filename}
  //                 on_time = {task.ontime}
  //                 file_type={fileType(task.filename)}
  //                 onPreviewFile={onPreviewFile}
  //                 onDownloadFile={onDownloadFile}/>)
  //             }
  //           }
  //           students_in_class.push(
  //             <ExpansionPanel>
  //             <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
  //             <ListItem className={classes.personListContainer}>
  //               <ListItemAvatar>
  //                 {!student.avatar ? <Avatar style={{marginRight: "10px"}}/> :
  //                 <Avatar src={`/api/upload/avatar/${student.avatar}`} style={{marginRight: "10px"}}/>}
  //               </ListItemAvatar>
  //               <ListItemText primary={<Typography variant="h6">{student.name}</Typography>}
  //               //  secondary={task_list_on_panel.length === 0 || !tasksCollection.grades ? "Belum dikumpul" : Boolean(tasksCollection.grades[student._id]) ? "Graded" : "Not Graded" }/>
  //                secondary={!tasksCollection.grades ? "Not graded" : !gradeStatus.has(student._id) && !tasksCollection.grades[student._id] ? "Not Graded" : "Graded"}/>
  //           </ListItem>
  //           </ExpansionPanelSummary>
  //            <Divider />
  //            <div className={classes.studentFileListContainer}>
  //             <List>
  //               {task_list_on_panel}
  //             </List>
  //             {student_task_files_id.length > 0 ?
  //               <div style={{display: "flex", justifyContent: "flex-end", alignItems: "center"}}>
  //                 <div style={{marginRight: "20px", display: "flex", alignItems: "center"}}>
  //                   <TextField
  //                     defaultValue={grade.has(student._id) || tasksCollection.grades === null ? grade.get(student._id) : tasksCollection.grades[student._id]}
  //                     onChange={(e) => {handleChangeGrade(e, student._id)}}
  //                     inputProps={{
  //                       style: {
  //                         borderBottom: "none",
  //                         boxShadow: "none",
  //                         margin: "0px",
  //                         width: "35px"
  //                       }
  //                     }}
  //                     InputProps={{
  //                       endAdornment: "/ 100"
  //                     }}
  //                   />
  //                 </div>
  //                 <div>
  //                   <GradeButton onGradeTugas={onGradeTugas} task_id={task_id} student_id={student._id} student_name ={student.name} grade={grade}/>
  //                   <UnduhSemuaButton onDownloadFile={onDownloadFile} student_task_files_id={student_task_files_id}/>
  //                 </div>
  //               </div>
  //               : null
  //             }
  //           </div>
  //            </ExpansionPanel>
  //           )
  //         }
  //       }
  //       TabPanelList.push(
  //       <TabPanel value={value} index={i}>
  //         {students_in_class}
  //       </TabPanel>
  //     )
  //   }
  // }
  //   return tasksCollection.class_assigned.length > 0 ? TabPanelList : null;
  // }

  document.title = "Schooly | Daftar Tugas Terkumpul"
  console.log(success)
  // Before that, run this :
  return (
    <div className={classes.root}>
      <Snackbar
        open={openAlert}
        autoHideDuration={4000}
        onClose={handleCloseAlert}
        anchorOrigin={{vertical : "center", horizontal: "center"}}
      >
        <Alert onClose={handleCloseAlert} severity="success" >
          Nilai  {!success ? null : success[2]} berhasil diganti menjadi {!success ? null : success[1]}
        </Alert>
      </Snackbar>
      <Paper>
        <Typography variant="h4" style={{textAlign: "center"}} gutterBottom>
          <b>{tasksCollection.name}</b>
        </Typography>
          {listClassTab()}
      </Paper>
      {listClassTabPanel()}
    </div>
  )
};

SubmittedTaskList.propTypes = {
  classesCollection: PropTypes.object.isRequired,
  tasksCollection: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  success: PropTypes.object.isRequired,
  getTaskFilesByUser:PropTypes.func.isRequired,
  viewOneTask: PropTypes.func.isRequired,
  getStudents: PropTypes.func.isRequired,
  downloadTugas: PropTypes.func.isRequired,
  previewTugas: PropTypes.func.isRequired,
  gradeTask: PropTypes.func.isRequired,
  viewClass: PropTypes.func.isRequired
}

const mapStateToProps = (state) => ({
  auth: state.auth,
  tasksCollection: state.tasksCollection,
  success: state.success,
  classesCollection: state.classesCollection,
});

export default connect(
  mapStateToProps, { getStudents,
    getTaskFilesByUser, viewOneTask, downloadTugas,
    previewTugas, gradeTask, viewClass }
) (SubmittedTaskList);
