import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { viewOneTask, gradeTask } from "../../../actions/TaskActions";
import { getTaskFilesByUser, downloadTugas, previewTugas } from "../../../actions/UploadActions";
import { getStudents } from "../../../actions/UserActions";
import StandardTextField from "../../misc/text-field/StandardTextField";
import { Avatar, Box, Button, Divider, ExpansionPanel, ExpansionPanelSummary, IconButton,
   List, ListItem, ListItemAvatar, ListItemIcon, ListItemText, Paper, Tabs, Tab, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import CloudDownloadIcon from "@material-ui/icons/CloudDownload";
import GetAppIcon from "@material-ui/icons/GetApp";
import DescriptionIcon from "@material-ui/icons/Description";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";

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
  downloadAllButton: {
    backgroundColor: theme.palette.primary.main,
    color: "white",
    "&:focus, &:hover": {
      backgroundColor: "white",
      color: theme.palette.primary.main
    }
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
  otherFileTypeIcon: {
    backgroundColor: theme.palette.primary.dark
  },
}));

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return(
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

  const {file_type_icon, file_id, file_name, file_type, onDownloadFile, onPreviewFile} = props;

  return(
    <Paper variant="outlined" className={classes.listItemPaper}>
      <ListItem button disableRipple className={classes.listItem}
      onClick={() => {onPreviewFile(file_id, "lampiran")}}>
        <ListItemAvatar>
          {file_type === "File lainnya" ?
          <Avatar className={classes.otherFileTypeIcon}>
            <DescriptionIcon/>
          </Avatar>
          :
          <Avatar/>
          }
        </ListItemAvatar>
        <ListItemText
          primary={
            <Typography>
              {file_name}
            </Typography>
          }
          secondary={
            <Typography variant="caption" color="textSecondary">
              {file_type}
            </Typography>
          }
        />
        <ListItemIcon>
          <IconButton onClick={(e) => { e.stopPropagation()
            onDownloadFile(file_id, "lampiran")}}>
            <CloudDownloadIcon />
          </IconButton>
        </ListItemIcon>
      </ListItem>
    </Paper>
  )
}
function GradeButton(props) {
  const classes = useStyles()
  const {onGradeTugas, task_id, student_id, grade, student_name} = props

  return(
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
    return(
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

  const { viewOneTask, tasksCollection, classesCollection, getStudents, downloadTugas, previewTugas, gradeTask } = props;
  const { all_students } = props.auth;
  const task_id = props.match.params.id;

  const [grade, setGrade] = React.useState(new Map());
  const [gradeStatus, setGradeStatus] = React.useState(new Map());

  console.log()
  console.log(grade)
  console.log(all_students)
  React.useEffect(() => {
    viewOneTask(task_id)
    getStudents()
    console.log(all_students)
    console.log(tasksCollection)
  }, [tasksCollection._id])

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
    if(fileCategory === "lampiran")
      downloadTugas(id)
    else if(fileCategory === "lampiran/bulk"){
      console.log(id)
      for (var i = 0; i < id.length; i++){
        downloadTugas(id[i])
      }
    }
      console.log("File Category is not specified")
  }

  const onPreviewFile = (id, fileCategory = "none") => {
    if(fileCategory === "lampiran")
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

    if(grade.has(studentId)){
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

      default: return "File lainnya"
    }
  }

  const listClassTab = () => {
    let class_assigned = []
    if(!tasksCollection.class_assigned){
      return null;
    }else {
      for (var i = 0; i < tasksCollection.class_assigned.length; i++){
        class_assigned.push(<Tab label={tasksCollection.class_assigned[i].name} {...TabIndex(i)}/>)
      }
      return(
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

  const listClassTabPanel = () => {
    let TabPanelList = []
    if( !tasksCollection.class_assigned || !all_students){
      return null
    } else{
      let student_task_files_id; // to handle the download all, this is needed.
      for(var i = 0; i < tasksCollection.class_assigned.length; i++){
        let students_in_class = [];
        for(var j = 0; j < all_students.length; j++){
          // check if the id of the class is the same or not (means student is inside)
          student_task_files_id = []
          if(all_students[j].kelas === tasksCollection.class_assigned[i]._id){
            let student = all_students[j]
            let student_task = all_students[j].tugas
            let task_list_on_panel = []
            for( var k = 0; k < student_task.length; k++){
              let task = student_task[k]
              if(student_task[k].for_task_object === task_id){
                student_task_files_id.push(task.id)
                task_list_on_panel.push(
                <WorkFile
                  file_id={task.id}
                  file_name={task.filename}
                  file_type={fileType(task.filename)}
                  onPreviewFile={onPreviewFile}
                  onDownloadFile={onDownloadFile}/>)
              }
            }
            students_in_class.push(
              <ExpansionPanel>
              <ExpansionPanelSummary>
              <ListItem className={classes.personListContainer}>
                <ListItemAvatar>
                  {!student.avatar ? <Avatar style={{marginRight: "10px"}}/> :
                  <Avatar src={`/api/uploads/image/${student.avatar}`} style={{marginRight: "10px"}}/>}
                </ListItemAvatar>
                <ListItemText primary={<Typography variant="h6">{student.name}</Typography>}
                //  secondary={task_list_on_panel.length === 0 || !tasksCollection.grades ? "Belum dikumpul" : Boolean(tasksCollection.grades[student._id]) ? "Graded" : "Not Graded" }/>
                 secondary={!tasksCollection.grades ? "Not graded" : !gradeStatus.has(student._id) && !tasksCollection.grades[student._id] ? "Not Graded" : "Graded"}/>
            </ListItem>
            </ExpansionPanelSummary>
             <Divider />
             <div className={classes.studentFileListContainer}>
              <List>
                {task_list_on_panel}
              </List>
              {student_task_files_id.length > 0 ?
                <div style={{display: "flex", justifyContent: "flex-end", alignItems: "center"}}>
                  <div style={{marginRight: "20px", display: "flex", alignItems: "center"}}>
                    <StandardTextField
                    defaultValue={grade.has(student._id) || tasksCollection.grades === null ? grade.get(student._id) : tasksCollection.grades[student._id]}
                    on_change={(e) => {handleChangeGrade(e, student._id)}}
                    width="35px" borderBottom="1px solid #CCC"/>
                    <StandardTextField disabled={true} value="/ 100" width="40px" />
                  </div>
                  <div>
                    <GradeButton onGradeTugas={onGradeTugas} task_id={task_id} student_id={student._id} student_name ={student.name} grade={grade}/>
                    <UnduhSemuaButton onDownloadFile={onDownloadFile} student_task_files_id={student_task_files_id}/>
                  </div>
                </div>
                : null
              }
            </div>
             </ExpansionPanel>
            )
          }
        }
        TabPanelList.push(
        <TabPanel value={value} index={i}>
          {students_in_class}
        </TabPanel>
      )
    }
  }
    return tasksCollection.class_assigned.length > 0 ? TabPanelList : null;
  }

  document.title = "Schooly | Daftar Tugas Terkumpul"

  // Before that, run this :
  return(
    <div className={classes.root}>
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
  getTaskFilesByUser:PropTypes.func.isRequired,
  viewOneTask: PropTypes.func.isRequired,
  getStudents: PropTypes.func.isRequired,
  downloadTugas: PropTypes.func.isRequired,
  previewTugas: PropTypes.func.isRequired,
  gradeTask: PropTypes.func.isRequired,
}

const mapStateToProps = (state) => ({
  auth: state.auth,
  tasksCollection: state.tasksCollection,
  classesCollection: state.classesCollection,
});

export default connect(
  mapStateToProps, { getStudents,
    getTaskFilesByUser, viewOneTask, downloadTugas,
    previewTugas, gradeTask }
) (SubmittedTaskList);
