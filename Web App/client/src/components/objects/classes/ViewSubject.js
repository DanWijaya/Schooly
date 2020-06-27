import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import moment from "moment";
import "moment/locale/id"
import { viewOneClass } from "../../../actions/ClassActions"
import { getAllSubjects } from "../../../actions/SubjectActions"
import { viewTask } from "../../../actions/TaskActions"
import { getAllTaskFilesByUser } from "../../../actions/UploadActions"
import LightTooltip from "../../misc/light-tooltip/LightTooltip";
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
    backgroundColor: theme.palette.error.main
  },
  assignmentTurnedIn: {
    backgroundColor: theme.palette.success.main
  },
  warningText: {
    color: theme.palette.warning.main
  }
}));

function WorkListItem(props) {
const classes = useStyles()
  return (
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
  const { subject_name } = props.match.params
  const { user } = props.auth;
  const{ viewOneClass, viewTask, tasksCollection, getAllTaskFilesByUser} = props;
  const { selectedClasses } = props.classesCollection
  const {all_user_files} = props.filesCollection
  const [anchorEl, setAnchorEl] = React.useState(null);
  const handleCreateMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleCreateMenuClose = () => {
    setAnchorEl(null);
  };

  if(selectedClasses.length === 0) {
    viewOneClass(user.kelas)
  }
  if(all_user_files.length === 0) {
    getAllTaskFilesByUser(user.id)
  }
  let tasksByClass = [] // tasks on specific class.

  // All actions to retrive datas from Database...
  if(tasksCollection.length === undefined) {
    viewTask()
  }
  else{
    tasksCollection.map((task) => {
      let class_assigned = task.class_assigned
      for (var i = 0; i < class_assigned.length; i++) {
        if(class_assigned[i]._id === user.kelas)
          tasksByClass.push(task)
      }
    })
  }

  const generateTaskBySubject = () => {
    let tasksBySubjectClass = [] // tasks on specific subjects and class

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
          work_link={`/new-task/${task._id}`}
        />
      )
    }
  })

  return tasksBySubjectClass.length === 0 ?
    (<Typography variant="h5" align="center" gutterBottom>
      Kosong
    </Typography>)
    : tasksBySubjectClass
  }

  return (
    <div className={classes.root}>
      <Paper className={classes.subjectCardPaper}>
      <Grid container>
        <Grid item xs={12} container direction="column" spacing={3}>
          <Grid item xs>
            <Typography variant="subtitle1" color="primary">
              <h3><b>{subject_name}</b></h3>
            </Typography>
            <Typography variant="body2">
              <h5>Kelas: {selectedClasses.name}</h5>
            </Typography>
          </Grid>
          <Grid item>
            <LightTooltip title="Tugas">
              <IconButton
                size="medium"
                disableRipple
                className={classes.workIconButton}
              >
                <Badge badgeContent={2} color="secondary">
                  <AssignmentIcon fontSize="large" className={classes.workIcon} />
                </Badge>
              </IconButton>
            </LightTooltip>
          </Grid>
        </Grid>
      </Grid>
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
            {generateTaskBySubject()}
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
  viewOneClass: PropTypes.func.isRequired,
  getAllSubjects: PropTypes.func.isRequired,
  viewTask: PropTypes.func.isRequired,
  getAllTaskFilesByUser: PropTypes.func.isRequired
}

const mapStateToProps = (state) => ({
  auth: state.auth,
  classesCollection: state.classesCollection,
  subjectsCollection: state.subjectsCollection,
  tasksCollection: state.tasksCollection,
  filesCollection: state.filesCollection,
})

export default connect(
  mapStateToProps, {viewOneClass,
    getAllSubjects, viewTask, getAllTaskFilesByUser}
) (ViewSubject)
