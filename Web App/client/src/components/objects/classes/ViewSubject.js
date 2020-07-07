import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import moment from "moment";
import "moment/locale/id";
import { setCurrentClass } from "../../../actions/ClassActions";
import { getAllSubjects } from "../../../actions/SubjectActions";
import { viewTask } from "../../../actions/TaskActions";
import { getAllTaskFilesByUser } from "../../../actions/UploadActions";
import { Avatar, Badge, Divider, ExpansionPanel, ExpansionPanelSummary, Grid,
   IconButton, List, ListItem, ListItemAvatar, ListItemText, Paper, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import AssignmentIcon from "@material-ui/icons/AssignmentOutlined";
import AssignmentLateIcon from "@material-ui/icons/AssignmentLate";
import AssignmentTurnedInIcon from "@material-ui/icons/AssignmentTurnedIn";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

const useStyles = makeStyles((theme) => ({
  root: {
    margin: "auto",
    maxWidth: "1000px",
    padding: "20px",
  },
  workIconButton: {
    cursor: "default",
  },
  workIcon: {
    width: theme.spacing(2.5),
    height: theme.spacing(2.5),
    color: theme.palette.primary.main,
  },
  subjectCardPaper: {
    padding: "15px",
    paddingBottom: "40px",
  },
  expansionPanelList: {
    marginLeft: "20px",
    marginRight: "15px",
    marginBottom: "10px",
  },
  assignmentLate: {
    backgroundColor: theme.palette.error.main,
  },
  assignmentTurnedIn: {
    backgroundColor: theme.palette.success.main,
  },
  warningText: {
    color: theme.palette.warning.main,
  }
}));

function WorkListItem(props) {
const classes = useStyles()
  return(
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
      <ListItemText
        align="right"
        primary={
          <Typography variant="h6" className={classes.warningText}>
            Batas Waktu: {props.work_deadline}
          </Typography>
        }
        secondary={props.work_status}
      />
    </ListItem>
  )
}

function ViewSubject(props) {
  const classes = useStyles();

  const { user } = props.auth;
  const { subject_name } = props.match.params
  const{ setCurrentClass, viewTask, tasksCollection, getAllTaskFilesByUser} = props;
  const { selectedClasses, kelas } = props.classesCollection
  const {all_user_files} = props.filesCollection

  console.log(props.classesCollection)
  React.useEffect(() => {
    setCurrentClass(user.kelas)
    viewTask()
    getAllTaskFilesByUser(user.id)
  }, [all_user_files.length])

  let tasksByClass = [] // Tasks on specific class.

  // All actions to retrive datas from Database...
  if(tasksCollection.length !== undefined){
    tasksCollection.map((task) => {
      let class_assigned = task.class_assigned
      for (var i = 0; i < class_assigned.length; i++) {
        if(class_assigned[i]._id === user.kelas)
          tasksByClass.push(task)
      }
    })
  }

  let tasksBySubjectClass = [];
  const generateTaskBySubject = (target=null) => {
    tasksByClass.map((task) => {
      let workCategoryAvatar = (
        <Avatar className={classes.assignmentLate}>
          <AssignmentLateIcon/>
        </Avatar>
      )

      let workStatus = "Belum Dikumpulkan"
      for(var i = 0; i < all_user_files.length; i++) {
        if(all_user_files[i].for_task_object === task._id){
          workStatus = "Telah Dikumpulkan"
          workCategoryAvatar = (
            <Avatar className={classes.assignmentTurnedIn}>
              <AssignmentTurnedInIcon/>
            </Avatar>
          )
          break;
        }
      }

      if(task.subject === subject_name) {
      tasksBySubjectClass.push(
        <WorkListItem
          work_title={task.name}
          work_category_avatar={workCategoryAvatar}
          work_sender={`Mata Pelajaran: ${task.subject}`}
          work_status={workStatus}
          work_deadline={moment(task.deadline).format("DD-MM-YYYY")}
          work_link={`/tugas-murid/${task._id}`}
        />
      )
    }

  })
  if(target == "length")
    return tasksBySubjectClass.length;

  else{
      return tasksBySubjectClass.length === 0 ?
      (<Typography variant="h5" align="center" gutterBottom>
        Kosong
      </Typography>)
      : tasksBySubjectClass
    }
  }


  document.title = `Schooly | ${subject_name}`

  return(
    <div className={classes.root}>
      <Paper className={classes.subjectCardPaper}>
        <Typography variant="subtitle1" color="primary">
          <h3><b>{subject_name}</b></h3>
        </Typography>
        <Typography variant="body2">
          <h5>Kelas: {kelas.name}</h5>
        </Typography>
      </Paper>
      <Grid container direction="column" style={{marginTop: "20px"}}>
        <Grid item>
          <ExpansionPanel>
            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6">
                Tugas
              </Typography>
            </ExpansionPanelSummary>
            <Divider />
            <List className={classes.expansionPanelList}>
            {tasksBySubjectClass}
            </List>
          </ExpansionPanel>
        </Grid>
        <Grid item>
          <ExpansionPanel disabled>
            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6">
                Kuis (Coming Soon)
              </Typography>
            </ExpansionPanelSummary>
            <Divider />
            <List className={classes.expansionPanelList}>
              <WorkListItem
                work_title=""
                work_category_avatar=""
                work_sender=""
                work_status=""
                work_link=""
              />
              <WorkListItem
                work_title=""
                work_category_avatar=""
                work_sender=""
                work_status=""
                work_link=""
              />
            </List>
          </ExpansionPanel>
        </Grid>
        <Grid item>
          <ExpansionPanel disabled>
            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6">
                Ujian (Coming Soon)
              </Typography>
            </ExpansionPanelSummary>
            <Divider />
            <List className={classes.expansionPanelList}>
              <WorkListItem
                work_title=""
                work_category_avatar=""
                work_sender=""
                work_status=""
                work_link=""
              />
              <WorkListItem
                work_title=""
                work_category_avatar=""
                work_sender=""
                work_status=""
                work_link=""
              />
            </List>
          </ExpansionPanel>
        </Grid>
      </Grid>
    </div>
  )
}

ViewSubject.propTypes = {
  classesCollection: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  subjectsCollection: PropTypes.object.isRequired,
  tasksCollection: PropTypes.object.isRequired,
  filesCollection: PropTypes.object.isRequired,
  setCurrentClass: PropTypes.func.isRequired,
  getAllSubjects: PropTypes.func.isRequired,
  viewTask: PropTypes.func.isRequired,
  getAllTaskFilesByUser: PropTypes.func.isRequired,
}

const mapStateToProps = (state) => ({
  auth: state.auth,
  classesCollection: state.classesCollection,
  subjectsCollection: state.subjectsCollection,
  tasksCollection: state.tasksCollection,
  filesCollection: state.filesCollection,
})

export default connect(
  mapStateToProps, {setCurrentClass,
    getAllSubjects, viewTask, getAllTaskFilesByUser}
) (ViewSubject)
