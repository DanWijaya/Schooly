import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { viewOneClass } from "../../../actions/ClassActions"
import { viewOneTask, gradeTask } from "../../../actions/TaskActions"
import { getTaskFilesByUser, downloadTugas, previewTugas } from "../../../actions/UploadActions"
import { getStudents } from "../../../actions/UserActions"
import { Avatar, Box, Button, Divider, ExpansionPanel, ExpansionPanelSummary, IconButton,
   List, ListItem, ListItemAvatar, ListItemIcon, ListItemText, Paper, Popover, Tabs, Tab,TextField, Typography } from "@material-ui/core";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import CloudDownloadIcon from "@material-ui/icons/CloudDownload";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import GetAppIcon from "@material-ui/icons/GetApp";
import DescriptionIcon from '@material-ui/icons/Description';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import StandardTextField from "../../misc/text-field/StandardTextField"
import FormControl from '@material-ui/core/FormControl';
import clsx from 'clsx';
import Input from '@material-ui/core/Input';
import InputAdornment from '@material-ui/core/InputAdornment';
import FormHelperText from '@material-ui/core/FormHelperText';

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
  
  gradeTextField: {
    color: "blue",
    "&.Mui-focused .MuiInputBase-input .MuiInput-input": {
      boxShadow: "none",
      borderBottom: "10px solid #2196f3",
    },
   }
}));

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

  const {file_type_icon, file_id, file_name, file_type, onDownloadFile, onPreviewFile} = props;

  return (
    <Paper variant="outlined" className={classes.listItemPaper}>
      <ListItem button disableRipple className={classes.listItem}
      onClick={() => {onPreviewFile(file_id, "lampiran")}}>
        <ListItemAvatar>
          {file_type == "File lainnya" ? 
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
    variant="outlined"
    startIcon={<CheckCircleIcon/>}
    className={classes.checkCircleIcon}
    onClick={() => onGradeTugas(task_id, student_id, student_name, grade)}>
      Simpan
    </Button>
  )
}

function UnduhSemuaButton(props) {
  const classes = useStyles()
  const {onDownloadFile, student_task_files_id} = props;
    return( 
      <Button
      variant="outlined"
      startIcon={<GetAppIcon />}
      className={classes.downloadAllButton}
      onClick={() => onDownloadFile(student_task_files_id, "lampiran/bulk")}
        >
      Unduh Semua
    </Button>
    )
}

function SubmittedTaskList(props) {
  document.title = "Schooly | Daftar Tugas Terkumpul"
  const classes = useStyles();
  const { viewOneClass, viewOneTask, tasksCollection, classesCollection, getStudents, downloadTugas, previewTugas, gradeTask} = props;
  const {all_students} = props.auth;
  const task_id = props.match.params.id;

  const [grade, setGrade] = React.useState(new Map());

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
    console.log(id, e.target.value)
    gradeMap.set(id, e.target.value)
    console.log(gradeMap, grade)
    setGrade(gradeMap)
  }
  
  const onDownloadFile = (id, fileCategory="none") => {
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

  const onPreviewFile = (id, fileCategory="none") => {
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
    gradeTask(taskId, gradingData, student_name)  

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
      return (
        <Tabs
          value={value}
          onChange={handleChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth">
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
      let student_task_files_id; // to handle the download semua, this is needed.
      for(var i = 0; i < tasksCollection.class_assigned.length; i++){
        let students_in_class = [];
        for(var j = 0; j < all_students.length; j++){
          // check if the id of the class is the same or not (means student is inside)
          student_task_files_id = []
          if(all_students[j].kelas == tasksCollection.class_assigned[i]._id){
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
                //  secondary={task_list_on_panel.length == 0 || !tasksCollection.grades ? "Belum dikumpul" : Boolean(tasksCollection.grades[student._id]) ? "Graded" : "Not Graded" }/>
                 secondary={Boolean(tasksCollection.grades[student._id]) ? "Graded" : "Not Graded" }/>
            </ListItem>
            </ExpansionPanelSummary>
             <Divider />
             <div className={classes.studentFileListContainer}>
              <List>
                {task_list_on_panel}
                {/* {student_task.map((task) => { 
                  let tasks_list = []
                  if(task.for_task_object == task_id){
                    student_task_files_id.push(task.id)
                    tasks_list.push(
                    <WorkFile 
                      file_id={task.id}
                      file_name={task.filename}
                      file_type={fileType(task.filename)}
                      onPreviewFile={onPreviewFile}
                      onDownloadFile={onDownloadFile}/>)
                  }
                  return tasks_list
                })} */}
                
              </List>
              {student_task_files_id.length > 0 ? 
                <div style={{display: "flex", justifyContent: "flex-end", alignItems: "center"}}> 
                  <div style={{marginRight: "20px", display: "flex", alignItems: "center"}}>
                    <StandardTextField 
                    defaultValue={grade.has(student._id) || tasksCollection.grades == null ? grade.get(student._id) : tasksCollection.grades[student._id]}
                    on_change={(e) => {handleChangeGrade(e, student._id)}}
                    width="35px" borderBottom="1px solid #CCC"/>
                    <StandardTextField disabled={true} value="/ 100" width="40px" />

                  {/* <FormControl> */}
                  {/* <Input
                      id="standard-adornment-weight"
                      defaultValue={grade.has(student._id) ? grade.get(student._id) : tasksCollection.grades[student._id]}
                      onChange={(e) => {handleChangeGrade(e, student._id)}}
                      aria-describedby="standard-weight-helper-text"
                      style={{width: "65px"}}
                      endAdornment={<InputAdornment position="end">/100</InputAdornment>}
                      inputProps={{
                        style: { borderBottom: 'none', boxShadow: 'none'}
                      }}
                    /> */}
                    {/* {tasksCollection.grades.has(student._id) ? 
                      <Input
                      id="standard-adornment-weight"
                      value={tasksCollection.grades.get(student._id)}
                      onChange={handleChangeGrade}
                      aria-describedby="standard-weight-helper-text"
                      style={{width: "65px"}}
                      endAdornment={<InputAdornment position="end">/100</InputAdornment>}
                      inputProps={{
                        style: { borderBottom: 'none', boxShadow: 'none'}
                      }}
                    />
                        :
                      <Input
                        id="standard-adornment-weight"
                        onChange={handleChangeGrade}
                        aria-describedby="standard-weight-helper-text"
                        style={{width: "65px"}}
                        endAdornment={<InputAdornment position="end">/100</InputAdornment>}
                        inputProps={{
                          style: { borderBottom: 'none', boxShadow: 'none'}
                        }}
                      />
                    } */}
                {/* </FormControl> */}
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

  return (
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

  viewOneClass: PropTypes.func.isRequired,
  getTaskFilesByUser:PropTypes.func.isRequired,
  viewOneTask: PropTypes.func.isRequired,
  getStudents: PropTypes.func.isRequired,
  downloadTugas: PropTypes.func.isRequired,
  previewTugas: PropTypes.func.isRequired,
  gradeTask: PropTypes.func.isRequired
}

const mapStateToProps = (state) => ({
  auth: state.auth,
  tasksCollection: state.tasksCollection,
  classesCollection: state.classesCollection
});

export default connect(
  mapStateToProps, {viewOneClass, getStudents,
    getTaskFilesByUser, viewOneTask, downloadTugas,
    previewTugas, gradeTask }
) (SubmittedTaskList);
