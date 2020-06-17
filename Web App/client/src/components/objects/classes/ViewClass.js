import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
//All redux actions
import { viewOneClass } from "../../../actions/ClassActions"
import { getStudentsByClass, getTeachers } from "../../../actions/AuthActions"
import { getAllSubjects } from "../../../actions/SubjectActions"
import { viewTask } from "../../../actions/TaskActions"
import { getAllTaskFilesByUser } from "../../../actions/UploadActions"
///
import { Avatar, Box, Button, Divider, ExpansionPanel, ExpansionPanelSummary, Paper,
   List, ListItem, ListItemAvatar, ListItemSecondaryAction, ListItemText,
   Tabs, Tab, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import BallotIcon from "@material-ui/icons/Ballot";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import DesktopWindowsIcon from "@material-ui/icons/DesktopWindows";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import SupervisorAccountIcon from "@material-ui/icons/SupervisorAccount";
import AssignmentLateIcon from '@material-ui/icons/AssignmentLate';
import AssignmentTurnedInIcon from '@material-ui/icons/AssignmentTurnedIn';
import moment from 'moment';
import 'moment/locale/id'
import { Link } from "react-router-dom";
const useStyles = makeStyles((theme) => ({
  root: {
    margin: "auto",
    maxWidth: "1000px",
  },
  categoryTitle: {
    color: "#2196f3"
  },
  expansionPanelList: {
    marginLeft: "20px",
    marginRight: "15px",
    marginBottom: "10px",
  },
  paperBox: {
    padding: "20px",
  },
  lookAllButtonContainer: {
    display: "flex",
    justifyContent: "flex-end",
    padding: "5px",
  },
  assignmentLate: {
    backgroundColor: theme.palette.error.main
  },
  assignmentTurnedIn: {
    backgroundColor: theme.palette.success.main
  },
  warningText: {
    color: theme.palette.warning.main
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
function WorkListItem(props) {
  const classes = useStyles()

  return (
    // <Link to={props.work_link}>
    <ListItem button component="a" href={props.work_link}>
      <ListItemAvatar>
        {props.work_category_avatar}
      </ListItemAvatar>
      <ListItemText
        primary={
          <Typography variant="h6">
            {props.work_title}
          </Typography>
        }
        secondary={props.work_sender}
      />
      <ListItemText style={{textAlign: 'right'}}
        primary={
          <Typography varian  t="h6" className={classes.warningText} 
          // style={{color: "#B22222"}}
          >
            Batas waktu: {props.work_deadline}
          </Typography>
        }
        secondary={props.work_status}
      />
    </ListItem>
    // </Link>
  )
}

function PersonListItem(props) {
  return (
    <ListItem button component="a" href={props.person_profile_link}>
      <ListItemAvatar>
        <Avatar src={props.person_avatar}/>
          {/* {props.person_avatar} */}
        {/* </Avatar> */}
      </ListItemAvatar>
      <ListItemText
        primary={
          <Typography variant="h6">
            {props.person_name}
          </Typography>
        }
      />
      <ListItemSecondaryAction>
        <Typography>
          {props.person_role}
        </Typography>
      </ListItemSecondaryAction>
    </ListItem>
  )
}

function ViewClass(props) {
  const classes = useStyles();
  const { viewOneClass, getStudentsByClass, getAllSubjects,
     tasksCollection, getTeachers, getAllTaskFilesByUser, viewTask} = props;
  const { all_user_files} = props.filesCollection
  const {all_subjects} = props.subjectsCollection
  const { selectedClasses} = props.classesCollection
  const {all_students, all_teachers, user} = props.auth;
  const classId = props.match.params.id;

  let tasksByClass = []

  // All actions to retrive datas from Database... 
  if(tasksCollection.length == undefined){
    viewTask()
  }else{
    tasksCollection.map((task) => {
      let class_assigned = task.class_assigned
      for (var i = 0; i < class_assigned.length; i++){
        if(class_assigned[i]._id == classId)
          tasksByClass.push(task)
      }
    })
  }
  if(selectedClasses.length == 0)
    viewOneClass(classId)
  if(all_subjects.length == 0)
    getAllSubjects()
  if(all_students.length == 0)
    getStudentsByClass(props.match.params.id)
  if(all_teachers.length == 0)
    getTeachers()

if(all_user_files.length == 0){
  getAllTaskFilesByUser(user.id)
}
////
  
  const [value, setValue] = React.useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  console.log(selectedClasses)
  return (
    <div className={classes.root}>
      <Paper>
        <Typography variant="h3" style={{textAlign: "center"}} gutterBottom>
          Kelas {selectedClasses.name}
        </Typography>
        <Tabs
          value={value}
          onChange={handleChange}
          indicatorColor="primary"
          textColor="primary"
          centered
        >
          <Tab icon={<DesktopWindowsIcon />} label="Pekerjaan Kelas" {...TabIndex(0)} />
          <Tab icon={<BallotIcon />} label="Mata Pelajaran" {...TabIndex(1)} />
          <Tab icon={<SupervisorAccountIcon />} label="Peserta" {...TabIndex(2)} />
        </Tabs>
      </Paper>

      <TabPanel value={value} index={0}>
        <Paper className={classes.paperBox} style={{marginBottom: "40px"}}>
          <List>
            {tasksByClass.map((task) => {
              let workCategoryAvatar = (
              <Avatar className={classes.assignmentLate}>
              <AssignmentLateIcon/>
            </Avatar>)

              let workStatus = "Belum Dikumpulkan"
              for(var i =0; i < all_user_files.length; i++){
                console.log(all_user_files[i].for_task_object, task._id, all_user_files[i].for_task_object == task._id)
                if(all_user_files[i].for_task_object == task._id){
                  workStatus = "Telah Dikumpulkan"
                  workCategoryAvatar = (
                  <Avatar className={classes.assignmentTurnedIn}>
                    <AssignmentTurnedInIcon/>
                    </Avatar>)
                  break;
                }
              }
            return (
            <WorkListItem
              work_title={task.name}
              work_category_avatar={workCategoryAvatar}
              work_sender={`Mata Pelajaran: ${task.subject}`}
              work_status={workStatus}
              work_deadline={moment(task.deadline).locale("id").format('DD-MM-YYYY')}
              work_link={`/new-task/${task._id}`}
            />
            )})
          }
          </List>
        </Paper>
      </TabPanel>

      <TabPanel value={value} index={1}>
      {all_subjects.length == 0 ? null : 
            all_subjects.map((subject) => {
              let isEmpty = true
              return(
              <ExpansionPanel>
                <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="h5" className={classes.categoryTitle}>
                  {subject.name}
                </Typography>
                </ExpansionPanelSummary>

                <Divider />
          <List className={classes.expansionPanelList}>
          {tasksByClass.map((task) => {
            let workCategoryAvatar = (
              <Avatar className={classes.assignmentLate}>
                <AssignmentLateIcon/>
              </Avatar>)
              let workStatus = "Belum Dikumpulkan"
              for(var i =0; i < all_user_files.length; i++){
                if(all_user_files[i].for_task_object == task._id){
                  workStatus = "Telah Dikumpulkan"
                  workCategoryAvatar = (
                    <Avatar className={classes.assignmentTurnedIn}>
                      <AssignmentTurnedInIcon/>
                    </Avatar>)
                  break;
                }

              }
              if(task.subject == subject.name){
                isEmpty = false
                return (
                <WorkListItem
                  work_title={task.name}
                  work_category_avatar={workCategoryAvatar}
                  work_sender={`Mata Pelajaran: ${task.subject}`}
                  work_status={workStatus}
                  work_deadline={moment(task.deadline).locale("id").format('DD-MM-YYYY')}
                  work_link={`/new-task/${task._id}`}
                />
                )}
              }
              )
          }
          {isEmpty ? <Typography style={{textAlign: 'center'}} variant="h5" gutterBottom>
            Belum ada tugas yang tersedia
            </Typography> : null}
          </List>
          <div className={classes.lookAllButtonContainer}>
            <Button endIcon={<ChevronRightIcon />} href={`/viewsubject/${subject.name}`}>
              Lihat mata pelajaran
            </Button>
          </div>
        </ExpansionPanel>
        )}
        )}
      </TabPanel>

      <TabPanel value={value} index={2}>
      <Paper className={classes.paperBox} style={{marginBottom: "40px"}}>
          <Typography variant="h4" gutterBottom>
            Walikelas
          </Typography>
          <Divider style={{backgroundColor: "#2196f3"}} />
          <List className={classes.listContainer}>
            <PersonListItem
              person_avatar={selectedClasses.walikelas ? 
                `/api/uploads/image/${selectedClasses.walikelas.avatar}` : null}
              person_profile_link="/test"
              person_name={selectedClasses.walikelas ? selectedClasses.walikelas.name : null}
              person_role={selectedClasses.walikelas ? selectedClasses.walikelas.subject_teached : null}
            />
          </List>
        </Paper>

        <Paper className={classes.paperBox}>
          <Typography variant="h4" gutterBottom>
            Murid
          </Typography>
          <Divider style={{backgroundColor: "#2196f3"}} />
          <List className={classes.listContainer}>
            {all_students.map((student) => (
              <PersonListItem
              person_avatar={`/api/uploads/image/${student.avatar}`}
              person_profile_link="/viewprofile"
              person_name={student.name}
              person_role={student.role}
              />
            ))}
          </List>
        </Paper>
      </TabPanel>
    </div>
  )
};

ViewClass.propTypes = {
  classesCollection: PropTypes.object.isRequired,
  getStudentsByClass: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  subjectsCollection: PropTypes.object.isRequired,
  tasksCollection: PropTypes.object.isRequired,
  filesCollection: PropTypes.object.isRequired,

  viewOneClass: PropTypes.func.isRequired,
  getAllSubjects: PropTypes.func.isRequired,
  viewTask: PropTypes.func.isRequired,
  getTeachers: PropTypes.func.isRequired,
  getAllTaskFilesByUser: PropTypes.func.isRequired
}

const mapStateToProps = (state) => ({
  auth: state.auth,
  classesCollection: state.classesCollection, 
  subjectsCollection: state.subjectsCollection,
  tasksCollection: state.tasksCollection,
  filesCollection: state.filesCollection
});

export default connect(
  mapStateToProps, {viewOneClass, getStudentsByClass, 
    getAllSubjects, viewTask, getTeachers, getAllTaskFilesByUser} 
) (ViewClass);
