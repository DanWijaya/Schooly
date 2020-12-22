import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import moment from "moment";
import "moment/locale/id";
import { setCurrentClass } from "../../../actions/ClassActions";
import { getAllSubjects } from "../../../actions/SubjectActions";
import { getAllTask } from "../../../actions/TaskActions";
import { getMaterial } from "../../../actions/MaterialActions";
import { getAllTaskFilesByUser } from "../../../actions/UploadActions";
import { Avatar, Divider, ExpansionPanel, ExpansionPanelSummary, Grid, List, ListItem, ListItemAvatar, ListItemText, Paper, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import AssignmentLateIcon from "@material-ui/icons/AssignmentLate";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import MenuBookIcon from "@material-ui/icons/MenuBook";

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
    paddingBottom: "40px",
    padding:"20px",
    background: "linear-gradient(to bottom right, #00b7ff, #2196F3, #00b7ff)",
    paddingLeft: "30px"
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
  },
  material: {
    backgroundColor: theme.palette.primary.main,
  },
  listItem: {
    minHeight: "70px"
  },
  subtitleColor: {
    color: "rgba(255, 255, 255, 0.7)"
  }
}));

function SubjectListitem(props){
  const classes = useStyles()

  return (
    <Link to={props.work_link}>
      <ListItem button className={classes.listItem}>
        <ListItemAvatar>
          {props.work_category_avatar}
        </ListItemAvatar>
        <ListItemText
          primary={
            <Typography variant="h6">
              {props.work_title}
            </Typography>
          }
          secondary={!props.work_subject ? " " : props.work_subject}
        />
      </ListItem>
    </Link>
  )
}

function AssignmentListItem(props) {
const classes = useStyles()
  return (
    <Link to={props.work_link}>
    <ListItem button>
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
          <Typography variant="body2" className={classes.warningText}>
            Batas Waktu: {props.work_deadline}
          </Typography>
        }
        secondary={
          <Typography variant="body2" className={classes.warningText}>
            {props.work_status}
          </Typography>
        }
      />
    </ListItem>
    </Link>
  )
}

function ViewSubject(props) {
  const classes = useStyles();

  const { user } = props.auth;
  const id = props.match.params.id;
  const{ setCurrentClass, getAllTask, getAllSubjects, tasksCollection, getAllTaskFilesByUser, getMaterial} = props;
  const { kelas } = props.classesCollection
  // const {all_user_files} = props.filesCollection;
  const { all_subjects_map} = props.subjectsCollection;
  const { selectedMaterials } = props.materialsCollection

  console.log(props.classesCollection)
  React.useEffect(() => {
    if (user.role === "Student") {
      getMaterial(user.kelas, "by_class")
    }
    setCurrentClass(user.kelas)
    getAllTask()
    getAllTaskFilesByUser(user.id)
    getAllSubjects("map");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  console.log(all_subjects_map)
  let tasksByClass = [] // Tasks on specific class.

  console.log(selectedMaterials)
  // All actions to retrive datas from Database...
  if (tasksCollection.length !== undefined) {
    tasksCollection.map((task) => {
      let class_assigned = task.class_assigned
      for (var i = 0; i < class_assigned.length; i++) {
        if(class_assigned[i] === user.kelas)
          tasksByClass.push(task)
      }
      return tasksByClass;
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
      // for (var i = 0; i < all_user_files.length; i++) {
      //   if (all_user_files[i].for_task_object === task._id) {
      //     workStatus = "Telah Dikumpulkan"
      //     workCategoryAvatar = (
      //       <Avatar className={classes.assignmentTurnedIn}>
      //         <AssignmentTurnedInIcon/>
      //       </Avatar>
      //     )
      //     break;
      //   }
      // }

      if (task.subject === id) {
      tasksBySubjectClass.push(
        <AssignmentListItem
          work_title={task.name}
          work_category_avatar={workCategoryAvatar}
          work_sender={`Mata Pelajaran: ${all_subjects_map.get(task.subject)}`}
          work_status={workStatus}
          work_deadline={moment(task.deadline).format("DD-MM-YYYY")}
          work_link={`/tugas-murid/${task._id}`}
        />
      )
    }
    return tasksBySubjectClass
  })

  if (target === "length")
    return tasksBySubjectClass.length;

  return tasksBySubjectClass.length === 0 ?
  (<Typography variant="h5" align="center" gutterBottom>
    Kosong
  </Typography>)
  : tasksBySubjectClass

  }

  generateTaskBySubject()
  document.title = `Schooly | ${id}`

  return (
    <div className={classes.root}>
      <Paper className={classes.subjectCardPaper}>
        <Typography variant="subtitle1" style={{color: "white"}}>
          <h3><b>{all_subjects_map.get(id)}</b></h3>
        </Typography>
        <Typography>
          <h5 className={classes.subtitleColor}>Kelas: {kelas.name}</h5>
        </Typography>
      </Paper>
      <Grid container direction="column" style={{marginTop: "20px"}}>
      <Grid item>
          <ExpansionPanel>
            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6">
                Materi
              </Typography>
            </ExpansionPanelSummary>
            <Divider />
            <List className={classes.expansionPanelList}>

            {!selectedMaterials.length ? null :
            selectedMaterials.map((material) => {
              if (material.subject === id) {

                return ( <SubjectListitem
                  work_title={material.name}
                  work_category_avatar={
                  <Avatar className={classes.material}>
                    <MenuBookIcon/>
                  </Avatar>}
                  work_sender={all_subjects_map.get(material.subject)}
                  work_link={`/materi/${material._id}`}
                />)
              }
              return null
            })}
            </List>
          </ExpansionPanel>
        </Grid>
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
              <AssignmentListItem
                work_title=""
                work_category_avatar=""
                work_sender=""
                work_status=""
                work_link=""
              />
              <AssignmentListItem
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
              <AssignmentListItem
                work_title=""
                work_category_avatar=""
                work_sender=""
                work_status=""
                work_link=""
              />
              <AssignmentListItem
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
  materialsCollection: PropTypes.object.isRequired,
  filesCollection: PropTypes.object.isRequired,
  setCurrentClass: PropTypes.func.isRequired,
  getAllSubjects: PropTypes.func.isRequired,
  getAllTask: PropTypes.func.isRequired,
  getAllTaskFilesByUser: PropTypes.func.isRequired,
  getMaterial: PropTypes.func.isRequired
}

const mapStateToProps = (state) => ({
  auth: state.auth,
  classesCollection: state.classesCollection,
  subjectsCollection: state.subjectsCollection,
  tasksCollection: state.tasksCollection,
  materialsCollection: state.materialsCollection,
  filesCollection: state.filesCollection,
})

export default connect(
  mapStateToProps, {setCurrentClass,
    getAllSubjects, getAllTask, getAllTaskFilesByUser, getMaterial}
) (ViewSubject)
