import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { getAllTaskFilesByUser } from "../../../actions/UploadActions";
import { viewTask } from "../../../actions/TaskActions";
import dashboardStudentBackground from "./DashboardStudentBackground.png";
import dashboardTeacherBackground from "./DashboardTeacherBackground.png";
import dashboardAdminBackground from "./DashboardAdminBackground.png";
import LightTooltip from "../../misc/light-tooltip/LightTooltip";
import { Avatar, Fab, Grid, IconButton, List, ListItem, ListItemAvatar, ListItemText, Paper, Typography } from "@material-ui/core";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import { FaChalkboardTeacher } from "react-icons/fa";
import AssignmentLateIcon from "@material-ui/icons/AssignmentLate";
import AssignmentIcon from "@material-ui/icons/Assignment";
import moment from "moment";
import "moment/locale/id";

const useStyles = makeStyles((theme) => ({
  listItemPaper: {
    marginBottom: "10px"
  },
  listItem: {
    "&:focus, &:hover": {
      backgroundColor: theme.palette.button.main,
    },
  },
  warningText: {
    color: theme.palette.warning.main,
  },
}));

function NotificationItemList(props) {
  const classes = useStyles();

  return(
    <Paper variant="outlined" className={classes.listItemPaper}>
      <ListItem button component="a" href={props.notification_link} className={classes.listItem}>
        <ListItemAvatar>
          <Avatar>
            {props.sender_avatar}
          </Avatar>
        </ListItemAvatar>
        <ListItemText
          primary={props.notification_title}
          secondary={props.sender_name}
        />
        <ListItemText
          align="right"
          primary={
            <Typography variant="subtitle" color="textSecondary">
              {props.time}
            </Typography>}
        />
      </ListItem>
    </Paper>
  )
}


function WorkListItem(props) {
  const classes = useStyles()

  return(
    <Paper variant="outlined" className={classes.listItemPaper}>
      <ListItem button component="a" href={props.work_link} className={classes.listItem}>
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
        <ListItemText style={{textAlign: "right"}}
          primary={
            <Typography variant="h6" className={classes.warningText}>
              Batas Waktu: {props.work_deadline}
            </Typography>
          }
          secondary={props.work_status}
        />
      </ListItem>
    </Paper>
  )
}

const styles = (theme) => ({
  root: {
    margin: "auto",
    maxWidth: "1000px",
    padding: "10px"
  },
  paperTitle: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    height: "60px"
  },
  timePaperStudent: {
    height: "250px",
    padding: "20px",
    color: "white",
    backgroundColor: theme.palette.primary.light,
    backgroundImage: `url(${dashboardStudentBackground})`,
    backgroundPosition: "bottom",
    backgroundRepeat: "no-repeat",
    backgroundSize: "contain",
  },
  timePaperTeacher: {
    height: "250px",
    padding: "20px",
    color: "white",
    backgroundColor: theme.palette.primary.light,
    backgroundImage: `url(${dashboardTeacherBackground})`,
    backgroundPosition: "bottom",
    backgroundRepeat: "no-repeat",
    backgroundSize: "contain",
  },
  timePaperAdmin: {
    height: "250px",
    padding: "20px",
    color: "white",
    backgroundColor: theme.palette.primary.light,
    backgroundImage: `url(${dashboardAdminBackground})`,
    backgroundPosition: "bottom",
    backgroundRepeat: "no-repeat",
    backgroundSize: "contain",
  },
  notificationPaper: {
    padding: "20px",
  },
  workPaper: {
    padding: "20px",
  },
  assignmentLate: {
    backgroundColor: theme.palette.error.main,
  },
  buatTugasButton: {
    marginRight: "20px",
  },
  createTaskButton: {
    backgroundColor: "#61BD4F",
    color: "white",
  "&:focus, &:hover": {
      backgroundColor: "white",
      color: "#61BD4F",
    },
  },
  createTaskIcon: {
    width: theme.spacing(2.5),
    height: theme.spacing(2.5),
    marginRight: "7.5px",
  },
  manageTaskButton: {
    backgroundColor: theme.palette.primary.main,
    color: "white",
    "&:focus, &:hover": {
      backgroundColor: "white",
      color: theme.palette.primary.main,
    },
  },
  manageTaskIcon: {
    width: theme.spacing(2.5),
    height: theme.spacing(2.5),
    marginRight: "7.5px",
  },
  manageClassButton: {
    backgroundColor: theme.palette.primary.main,
    color: "white",
    "&:focus, &:hover": {
      backgroundColor: "white",
      color: theme.palette.primary.main,
    },
  },
  manageClassIcon: {
    width: theme.spacing(2.5),
    height: theme.spacing(2.5),
    marginRight: "7.5px",
  },
});

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      time: new Date()
    };
  }

  componentDidMount() {
    const {viewTask, getAllTaskFilesByUser} = this.props;
    const { user} = this.props.auth;

    viewTask()
    if(user.role == "Student")
      getAllTaskFilesByUser(user.id) // yang dapatin takfiles cuma berlaku untuk student soalnya
    this.intervalID = setInterval(
      () => this.tick(),
      1000
    );
  }

  componentWillUnmount() {
    clearInterval(this.intervalID);
  }

  tick() {
    this.setState({
      time: new Date()
    });
  }

  render() {
    const { classes, tasksCollection, classesCollection, viewTask, getAllTaskFilesByUser,  } = this.props;

    const { user } = this.props.auth;
    const { all_user_files } = this.props.filesCollection
    const { all_subjects } = this.props.subjectsCollection
    const { selectedClasses } = this.props.classesCollection

    let tasksByClass = []
    if(Boolean(tasksCollection.length)) {
      if(user.role == "Student"){
        tasksCollection.map((task) => {
          let class_assigned = task.class_assigned
          for (var i = 0; i < class_assigned.length; i++){
            if(class_assigned[i]._id === user.kelas)
              tasksByClass.push(task)
          }
        })
      } else if(user.role === "Teacher"){
        // in untuk si guru
        console.log("Ini untuk guru")
      }
    }

    document.title = "Schooly | Dashboard";
    document.body.style = "background: #FFFFFF";

    return(
      <div className={classes.root}>
        <Grid container direction="column" spacing={3}>
          <Grid item>
            { user.role === "Student" ?
                <Paper elevation={0} className={classes.timePaperStudent}>
                  <Typography variant="h3">
                    <b>Selamat Datang, {user.name}</b>
                  </Typography>
                  <Typography variant="h5" style={{marginBottom: "40px"}}>
                    Sekarang pukul {this.state.time.toLocaleTimeString("id-ID")}, tanggal {this.state.time.toLocaleDateString("id-ID")}.
                  </Typography>
                  <Typography variant="h6">
                    Apa yang ingin anda kerjakan hari ini?
                  </Typography>
                </Paper>
              : user.role === "Teacher" ?
                <Paper elevation={0} className={classes.timePaperTeacher}>
                  <Typography variant="h3">
                    <b>Selamat Datang, {user.name}</b>
                  </Typography>
                  <Typography variant="h5" style={{marginBottom: "40px"}}>
                    Sekarang pukul {this.state.time.toLocaleTimeString("id-ID")}, tanggal {this.state.time.toLocaleDateString("id-ID")}.
                  </Typography>
                  <Typography variant="h6">
                    Apa yang ingin anda kerjakan hari ini?
                  </Typography>
                </Paper>
              :
                <Paper elevation={0} className={classes.timePaperAdmin}>
                  <Typography variant="h3">
                    <b>Selamat Datang, {user.name}</b>
                  </Typography>
                  <Typography variant="h5" style={{marginBottom: "40px"}}>
                    Sekarang pukul {this.state.time.toLocaleTimeString("id-ID")}, tanggal {this.state.time.toLocaleDateString("id-ID")}.
                  </Typography>
                  <Typography variant="h6">
                    Apa yang ingin anda kerjakan hari ini?
                  </Typography>
                </Paper>
            }
          </Grid>
          <Grid item>
            {user.role === "Teacher" ?
            <Grid item container direction="row" justify="flex-end">
              <Grid item className={classes.buatTugasButton}>
                <Link to ="/buat-tugas">
                  <Fab variant="extended" className={classes.createTaskButton}>
                    <AssignmentIcon className={classes.createTaskIcon} />
                    Buat Tugas
                  </Fab>
                </Link>
              </Grid>
              <Grid item>
                <Link to ="/daftar-tugas">
                  <Fab variant="extended" className={classes.manageTaskButton}>
                    <AssignmentIcon className={classes.manageTaskIcon} />
                    Lihat Tugas
                  </Fab>
                </Link>
              </Grid>
            </Grid>
          : user.role === "Student" ?
            <Paper className={classes.workPaper}>
              <div className={classes.paperTitle}>
                <Typography variant="h5" color="primary">
                  Pekerjaan Anda
                </Typography>
                <div style={{display: "flex", justifyContent: "flex-end"}}>
                <LightTooltip title="Lihat Semua" placement="top">
                  <IconButton>
                    <ChevronRightIcon />
                  </IconButton>
                </LightTooltip>
                </div>
              </div>
              <List>
              {tasksByClass.map((task) => {
            let workCategoryAvatar = (
              <Avatar className={classes.assignmentLate}>
                <AssignmentLateIcon/>
              </Avatar>
            )
            let workStatus = "Belum Dikumpulkan"
            for(var i = 0; i < all_user_files.length; i++) {
              if(all_user_files[i].for_task_object === task._id){
                workStatus = "Telah Dikumpulkan"
                return null;
              }
            }
            return(
              <WorkListItem
                work_title={task.name}
                work_category_avatar={workCategoryAvatar}
                work_sender={`Mata Pelajaran: ${task.subject}`}
                work_status={workStatus}
                work_deadline={moment(task.deadline).locale("id").format("DD-MM-YYYY")}
                work_link={`/tugas-murid/${task._id}`}
              />
            )
          })}
              </List>
            </Paper>
          :
            <Grid item container direction="row" justify="flex-end">
              <Grid item>
                <Link to ="/daftar-kelas">
                  <Fab variant="extended" className={classes.manageClassButton}>
                    <FaChalkboardTeacher className={classes.manageClassIcon} />
                    Atur Kelas
                  </Fab>
                </Link>
              </Grid>
            </Grid>
          }
          </Grid>
        </Grid>
      </div>
    )
  };
}

Dashboard.propTypes = {
  auth: PropTypes.object.isRequired,
  subjectsCollection: PropTypes.object.isRequired,
  tasksCollection: PropTypes.object.isRequired,
  classesCollection: PropTypes.object.isRequired,
  getAllSubjects: PropTypes.func.isRequired,
  viewTask: PropTypes.func.isRequired,
  getAllTaskFilesByUser: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  tasksCollection: state.tasksCollection,
  subjectsCollection: state.subjectsCollection,
  classesCollection: state.classesCollection,
  filesCollection: state.filesCollection
});

export default withRouter(
  connect(mapStateToProps, {viewTask, getAllTaskFilesByUser})
  (withStyles(styles)(Dashboard))
)
