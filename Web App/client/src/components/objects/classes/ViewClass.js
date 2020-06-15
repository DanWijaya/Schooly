import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { viewOneClass } from "../../../actions/ClassActions"
import { getStudentsByClass, getTeachers } from "../../../actions/AuthActions"
import { getAllSubjects } from "../../../actions/SubjectActions"
import { viewTask } from "../../../actions/TaskActions"
import { getTaskFilesByUser } from "../../../actions/UploadActions"
import { Avatar, Box, Button, Divider, ExpansionPanel, ExpansionPanelSummary, Paper,
   List, ListItem, ListItemAvatar, ListItemSecondaryAction, ListItemText,
   Tabs, Tab, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import BallotIcon from "@material-ui/icons/Ballot";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import DesktopWindowsIcon from "@material-ui/icons/DesktopWindows";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import SupervisorAccountIcon from "@material-ui/icons/SupervisorAccount";
import moment from 'moment';
import 'moment/locale/id'
import { Link } from "react-router-dom";
const useStyles = makeStyles({
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
});

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
  return (
    // <Link to={props.work_link}>
    <ListItem button component="a" href={props.work_link}>
      <ListItemAvatar>
        <Avatar>
          {props.work_category_avatar}
        </Avatar>
      </ListItemAvatar>
      <ListItemText
        primary={
          <Typography variant="h6">
            {props.work_title}
          </Typography>
        }
        secondary={props.work_sender}
      />
      <ListItemSecondaryAction style={{textAlign: 'right'}}>
      <ListItemText
        primary={
          <Typography variant="h6" style={{color: "#B22222"}}>
            Batas waktu: {props.work_deadline}
          </Typography>
        }
        secondary={props.work_status}
      />
      </ListItemSecondaryAction>
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
     tasksCollection, getTeachers, getTaskFilesByUser} = props;
  const {all_subjects} = props.subjectsCollection
  const { selectedClasses} = props.classesCollection
  const {all_students, all_teachers, user} = props.auth;
  const classId = props.match.params.id;

  let tasksByClass = []

  // All actions to retrive datas from Database... 
  if(tasksCollection.length == undefined){
    props.viewTask()
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
////

  console.log(tasksByClass)
  
  const [value, setValue] = React.useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

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
              let workStatus = "Belum Dikumpulkan"
              for(var i =0; i < user.tugas.length; i++){
                console.log(user.tugas[i].for_task_object, task._id, user.tugas[i].for_task_object == task._id)
                if(user.tugas[i].for_task_object == task._id){
                  workStatus = "Telah Dikumpulkan"
                  break;
                }
              }
            return (
            <WorkListItem
              work_title={task.name}
              work_category_avatar=""
              work_sender={`Mata Pelajaran : ${task.subject}`}
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
            all_subjects.map((subject) => (
              <ExpansionPanel>
                <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="h5" className={classes.categoryTitle}>
                  {subject.name}
                </Typography>
                </ExpansionPanelSummary>

                <Divider />
          <List className={classes.expansionPanelList}>
          <Typography style={{textAlign: 'center'}} variant="h4" gutterBottom>
            Belum ada tugas yang tersedia
          </Typography>
            {/* <WorkListItem
              work_title="Tugas Fisika"
              work_category_avatar=""
              work_sender="Mr Jenggot"
              work_status="Telah Dikumpulkan"
              work_link="/test"
            /> */}
          </List>
          <div className={classes.lookAllButtonContainer}>
            <Button endIcon={<ChevronRightIcon />} href="/viewsubject">
              Lihat Semua
            </Button>
          </div>
        </ExpansionPanel>
        ))}
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
  getTaskFilesByUser: PropTypes.func.isRequired
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
    getAllSubjects, viewTask, getTeachers, getTaskFilesByUser} 
) (ViewClass);
