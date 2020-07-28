import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import moment from "moment";
import "moment/locale/id";
import { getAllTaskFilesByUser } from "../../../actions/UploadActions";
import { viewTask } from "../../../actions/TaskActions";
import dashboardStudentBackground from "./DashboardStudentBackground.png";
import dashboardTeacherBackground from "./DashboardTeacherBackground.png";
import dashboardAdminBackground from "./DashboardAdminBackground.png";
import LightTooltip from "../../misc/light-tooltip/LightTooltip";
import { Fab, Grid, IconButton, Hidden, ListItemIcon, ListItemText, Menu, MenuItem, Paper, Typography } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import AddIcon from "@material-ui/icons/Add";
import AnnouncementIcon from "@material-ui/icons/Announcement";
import AssignmentIcon from "@material-ui/icons/Assignment";
import AssignmentIndIcon from "@material-ui/icons/AssignmentInd";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import MenuBookIcon from "@material-ui/icons/MenuBook";
import { FaChalkboardTeacher } from "react-icons/fa";
import { getAllSubjects } from "../../../actions/SubjectActions";

const styles = (theme) => ({
  root: {
    margin: "auto",
    maxWidth: "1000px",
    padding: "10px",
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
  listItem: {
    padding: "10px 20px 10px 20px",
    "&:focus, &:hover": {
      backgroundColor: theme.palette.button.main,
    },
  },
  warningText: {
    color: theme.palette.warning.main,
  },
  createButton: {
    backgroundColor: "#61BD4F",
    color: "white",
    "&:focus, &:hover": {
      backgroundColor: "white",
      color: "#61BD4F",
    },
  },
  menuItem: {
    "&:hover": {
      backgroundColor: "#61BD4F",
      "& .MuiListItemIcon-root, & .MuiListItemText-primary": {
        color: "white",
      },
    },
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

function WorkListItem(props) {
  const { classes } = props;

  return (
    <Grid item>
      <Link to={props.work_link}>
        <Paper variant="outlined" button className={classes.listItem}>
          <Grid container alignItems="center">
            <Grid item xs={8}>
              <ListItemText
                primary={props.work_title}
                secondary={props.work_sender}
              />
            </Grid>
            <Grid item xs={4}>
              <Typography variant="body2" align="right" className={classes.warningText}>
                <Hidden smUp implementation="css">
                  {props.work_deadline_mobile}
                </Hidden>
                <Hidden xsDown implementation="css">
                  Tenggat: {props.work_deadline_desktop}
                </Hidden>
              </Typography>
            </Grid>
          </Grid>
        </Paper>
      </Link>
    </Grid>
  )
}

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      time: new Date(),
      anchorEl: null,
    };
  }

  componentDidMount() {
    const {viewTask, getAllTaskFilesByUser, getAllSubjects} = this.props;
    const { user} = this.props.auth;

    viewTask()
    getAllSubjects("map")
    if (user.role === "Student")
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

  // Create Button Menu
  handleMenuOpen = (event) => {
    this.setState({ anchorEl: event.currentTarget });
  };
  handleMenuClose = () => {
    this.setState({ anchorEl: null });
  };

  render() {
    const { classes, tasksCollection } = this.props;

    const { user } = this.props.auth;
    const { all_user_files } = this.props.filesCollection
    const { all_subjects_map } = this.props.subjectsCollection

    let tasksByClass = []
    if (Boolean(tasksCollection.length)) {
      if (user.role === "Student") {
        tasksCollection.map((task) => {
          let class_assigned = task.class_assigned
          for (var i = 0; i < class_assigned.length; i++) {
            if (class_assigned[i] === user.kelas)
              tasksByClass.push(task)
          }
          return tasksByClass;
        })
      }
      else if (user.role === "Teacher") {
        // For Teacher
        console.log("Ini untuk guru")
      }
    }

    document.title = "Schooly | Dashboard";
    document.body.style = "background: #FFFFFF";

    return (
      <div className={classes.root}>
        <Grid container direction="column" spacing={3}>
          <Grid item>
            {user.role === "Student" ?
              <Paper elevation={0} className={classes.timePaperStudent}>
                <Typography variant="h4">
                  <b>Selamat Datang, {user.name}</b>
                </Typography>
                <Typography variant="h5" style={{marginBottom: "20px"}}>
                  Sekarang pukul {this.state.time.toLocaleTimeString("id-ID")}, tanggal {this.state.time.toLocaleDateString("id-ID")}.
                </Typography>
                <Typography variant="h6">
                  Apa yang ingin anda kerjakan hari ini?
                </Typography>
              </Paper>
            : user.role === "Teacher" ?
              <Paper elevation={0} className={classes.timePaperTeacher}>
                <Typography variant="h4">
                  <b>Selamat Datang, {user.name}</b>
                </Typography>
                <Typography variant="h5" style={{marginBottom: "20px"}}>
                  Sekarang pukul {this.state.time.toLocaleTimeString("id-ID")}, tanggal {this.state.time.toLocaleDateString("id-ID")}.
                </Typography>
                <Typography variant="h6">
                  Apa yang ingin anda kerjakan hari ini?
                </Typography>
              </Paper>
            :
              <Paper elevation={0} className={classes.timePaperAdmin}>
                <Typography variant="h4">
                  <b>Selamat Datang, {user.name}</b>
                </Typography>
                <Typography variant="h5" style={{marginBottom: "20px"}}>
                  Sekarang pukul {this.state.time.toLocaleTimeString("id-ID")}, tanggal {this.state.time.toLocaleDateString("id-ID")}.
                </Typography>
                <Typography variant="h6">
                  Apa yang ingin anda kerjakan hari ini?
                </Typography>
              </Paper>
            }
          </Grid>
          <Grid item>
            {user.role === "Student" ?
              <Paper style={{padding: "20px"}}>
                <Grid container justify="space-between" alignItems="center" style={{marginBottom: "15px"}}>
                  <Grid item>
                    <Grid container alignItems="center">
                      <AssignmentIndIcon
                        color="action"
                        style={{marginRight: "10px"}}
                      />
                      <Typography variant="h5" color="primary">
                        Pekerjaan Anda
                      </Typography>
                    </Grid>
                  </Grid>
                  <Grid item>
                    <Link to="/daftar-tugas">
                      <LightTooltip title="Lihat Semua" placement="top">
                        <IconButton>
                          <ChevronRightIcon />
                        </IconButton>
                      </LightTooltip>
                    </Link>
                  </Grid>
                </Grid>
                <Grid container direction="column" spacing={1}>
                  {tasksByClass.map((task) => {
                    for(var i = 0; i < all_user_files.length; i++) {
                      if (all_user_files[i].for_task_object === task._id) {
                        return null;
                      }
                    }
                    if(!all_subjects_map.get(task.subject)){
                      return null;
                    }
                    return (
                      <WorkListItem
                        classes={classes}
                        work_title={task.name}
                        work_sender={all_subjects_map.get(task.subject)}
                        work_deadline_mobile={moment(task.deadline).locale("id").format("DD/MM/YYYY HH:mm")}
                        work_deadline_desktop={moment(task.deadline).locale("id").format("DD/MM/YYYY - HH:mm")}
                        work_link={`/tugas-murid/${task._id}`}
                      />
                    )
                  })}
                </Grid>
              </Paper>
            : user.role === "Teacher" ?
              <Grid item container direction="row" spacing={2} justify="flex-end" alignItems="center">
                <Grid item>
                  <Link to ="/daftar-tugas">
                    <Fab variant="extended" className={classes.manageTaskButton}>
                      <AssignmentIcon className={classes.manageTaskIcon} />
                      Lihat Tugas
                    </Fab>
                  </Link>
                </Grid>
                <Grid item>
                  <Fab className={classes.createButton} onClick={(event) => this.handleMenuOpen(event)}>
                    <AddIcon />
                  </Fab>
                  <Menu
                    keepMounted
                    anchorEl={this.state.anchorEl}
                    open={Boolean(this.state.anchorEl)}
                    onClose={this.handleMenuClose}
                    getContentAnchorEl={null}
                    style={{marginTop: "10px"}}
                    anchorOrigin={{
                      vertical: "bottom",
                      horizontal: "center",
                    }}
                    transformOrigin={{
                      vertical: "top",
                      horizontal: "center",
                    }}
                  >
                    <MenuItem button component="a" href="/buat-pengumuman" className={classes.menuItem}>
                      <ListItemIcon>
                        <AnnouncementIcon />
                      </ListItemIcon>
                      <ListItemText primary="Buat Pengumuman" />
                    </MenuItem>
                    <MenuItem button component="a" href="/buat-materi" className={classes.menuItem}>
                      <ListItemIcon>
                        <MenuBookIcon />
                      </ListItemIcon>
                      <ListItemText primary="Buat Materi" />
                    </MenuItem>
                    <MenuItem button component="a" href="/buat-tugas" className={classes.menuItem}>
                      <ListItemIcon>
                        <AssignmentIcon />
                      </ListItemIcon>
                      <ListItemText primary="Buat Tugas" />
                    </MenuItem>
                  </Menu>
                </Grid>
              </Grid>
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
  getAllTaskFilesByUser: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  auth: state.auth,
  tasksCollection: state.tasksCollection,
  subjectsCollection: state.subjectsCollection,
  classesCollection: state.classesCollection,
  filesCollection: state.filesCollection,
});

export default withRouter(
  connect(mapStateToProps, {viewTask, getAllTaskFilesByUser, getAllSubjects})
  (withStyles(styles)(Dashboard))
)
