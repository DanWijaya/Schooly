import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import moment from "moment";
import "moment/locale/id";
import { getAllTaskFilesByUser } from "../../../actions/UploadActions";
import { getAllTask } from "../../../actions/TaskActions";
import { getAllSubjects } from "../../../actions/SubjectActions";
import { getAllAssessments } from "../../../actions/AssessmentActions";
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
    backgroundColor: theme.palette.create.main,
    color: "white",
    "&:focus, &:hover": {
      backgroundColor: "white",
      color: theme.palette.create.main,
    },
  },
  menuItem: {
    "&:hover": {
      backgroundColor: theme.palette.create.main,
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
  marginButtomItem: {
    marginTop: "20px"
  }
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
    const { getAllTask, getAllTaskFilesByUser, getAllSubjects, getAllAssessments } = this.props;
    const { user } = this.props.auth;

    getAllTask() // actions yang membuat GET request ke Database.
    getAllSubjects("map") // untuk dapatin subject"nya gitu
    if (user.role === "Student")
      getAllAssessments()
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
    const { all_assessments } = this.props.assessmentsCollection

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
                  Sekarang tanggal {this.state.time.toLocaleDateString("id-ID")}, pukul {this.state.time.toLocaleTimeString("id-ID")}.
                </Typography>
                <Typography variant="h6">
                  Apa yang ingin Anda kerjakan hari ini?
                </Typography>
              </Paper>
            : user.role === "Teacher" ?
              <Paper elevation={0} className={classes.timePaperTeacher}>
                <Typography variant="h4">
                  <b>Selamat Datang, {user.name}</b>
                </Typography>
                <Typography variant="h5" style={{marginBottom: "20px"}}>
                Sekarang tanggal {this.state.time.toLocaleDateString("id-ID")}, pukul {this.state.time.toLocaleTimeString("id-ID")}.
                </Typography>
                <Typography variant="h6">
                  Apa yang ingin Anda kerjakan hari ini?
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
                  Apa yang ingin Anda kerjakan hari ini?
                </Typography>
              </Paper>
            }
          </Grid>
          <Grid item container xs={12}>
            {user.role === "Student" ?
              <Grid item container spacing={3}>
                <Grid item md={6} container>
                  <Grid item xs={12}>
                    <Paper style={{padding: "20px"}}>
                      <Grid container justify="space-between" alignItems="center" style={{marginBottom: "15px"}}>
                        <Grid item>
                          <Grid container alignItems="center">
                            <AssignmentIndIcon
                              color="action"
                              style={{marginRight: "10px"}}
                            />
                            <Typography variant="h5" color="primary">
                              Tugas Anda
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
                          for (var i = 0; i < all_user_files.length; i++) {
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
                              work_deadline_mobile={moment(task.deadline).locale("id").format("DD MMM YYYY, HH:mm")}
                              work_deadline_desktop={moment(task.deadline).locale("id").format("DD MMM YYYY, HH:mm")}
                              work_link={`/tugas-murid/${task._id}`}
                            />
                          )
                        })}
                      </Grid>
                    </Paper>
                  </Grid>
                  <Grid item xs={12} className={classes.marginButtomItem}>
                    <Paper style={{padding: "20px"}}>
                      <Grid container justify="space-between" alignItems="center" style={{marginBottom: "15px"}}>
                        <Grid item>
                          <Grid container alignItems="center">
                            <AssignmentIndIcon
                              color="action"
                              style={{marginRight: "10px"}}
                            />
                            <Typography variant="h5" color="primary">
                              Kuis Yang Akan Datang
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
                        {all_assessments.map((assessment) => {
                          for (var i = 0; i < all_user_files.length; i++) {
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
                              work_deadline_mobile={moment(task.deadline).locale("id").format("DD MMM YYYY, HH:mm")}
                              work_deadline_desktop={moment(task.deadline).locale("id").format("DD MMM YYYY, HH:mm")}
                              work_link={`/tugas-murid/${task._id}`}
                            />
                          )
                        })}
                      </Grid>
                    </Paper>
                  </Grid>
                  <Grid item xs={12} className={classes.marginButtomItem}>
                    <Paper style={{padding: "20px"}}>
                      <Grid container justify="space-between" alignItems="center" style={{marginBottom: "15px"}}>
                        <Grid item>
                          <Grid container alignItems="center">
                            <AssignmentIndIcon
                              color="action"
                              style={{marginRight: "10px"}}
                            />
                            <Typography variant="h5" color="primary">
                              Ujian Yang Akan Datang
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
                          for (var i = 0; i < all_user_files.length; i++) {
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
                              work_deadline_mobile={moment(task.deadline).locale("id").format("DD MMM YYYY, HH:mm")}
                              work_deadline_desktop={moment(task.deadline).locale("id").format("DD MMM YYYY, HH:mm")}
                              work_link={`/tugas-murid/${task._id}`}
                            />
                          )
                        })}
                      </Grid>
                    </Paper>
                  </Grid>
                </Grid>
                <Grid item md={6} container >
                  <Grid item xs={12}>
                    <Paper style={{padding: "20px"}}>
                      <Grid container justify="space-between" alignItems="center" style={{marginBottom: "15px"}}>
                        <Grid item>
                          <Grid container alignItems="center">
                            <AssignmentIndIcon
                              color="action"
                              style={{marginRight: "10px"}}
                            />
                            <Typography variant="h5" color="primary">
                              Bar Chart Tugas
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
                          for (var i = 0; i < all_user_files.length; i++) {
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
                              work_deadline_mobile={moment(task.deadline).locale("id").format("DD MMM YYYY, HH:mm")}
                              work_deadline_desktop={moment(task.deadline).locale("id").format("DD MMM YYYY, HH:mm")}
                              work_link={`/tugas-murid/${task._id}`}
                            />
                          )
                        })}
                      </Grid>
                    </Paper>
                  </Grid>
                  <Grid item xs={12} className={classes.marginButtomItem}>
                    <Paper style={{padding: "20px"}}>
                      <Grid container justify="space-between" alignItems="center" style={{marginBottom: "15px"}}>
                        <Grid item>
                          <Grid container alignItems="center">
                            <AssignmentIndIcon
                              color="action"
                              style={{marginRight: "10px"}}
                            />
                            <Typography variant="h5" color="primary">
                              Bar Chart Kuis
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
                          for (var i = 0; i < all_user_files.length; i++) {
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
                              work_deadline_mobile={moment(task.deadline).locale("id").format("DD MMM YYYY, HH:mm")}
                              work_deadline_desktop={moment(task.deadline).locale("id").format("DD MMM YYYY, HH:mm")}
                              work_link={`/tugas-murid/${task._id}`}
                            />
                          )
                        })}
                      </Grid>
                    </Paper>
                  </Grid>
                  <Grid item xs={12} className={classes.marginButtomItem}>
                    <Paper style={{padding: "20px"}}>
                      <Grid container justify="space-between" alignItems="center" style={{marginBottom: "15px"}}>
                        <Grid item>
                          <Grid container alignItems="center">
                            <AssignmentIndIcon
                              color="action"
                              style={{marginRight: "10px"}}
                            />
                            <Typography variant="h5" color="primary">
                              Bar Chart Ujian
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
                          for (var i = 0; i < all_user_files.length; i++) {
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
                              work_deadline_mobile={moment(task.deadline).locale("id").format("DD MMM YYYY, HH:mm")}
                              work_deadline_desktop={moment(task.deadline).locale("id").format("DD MMM YYYY, HH:mm")}
                              work_link={`/tugas-murid/${task._id}`}
                            />
                          )
                        })}
                      </Grid>
                    </Paper>
                  </Grid>
                </Grid>
              </Grid>
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
  assessmentsCollection: PropTypes.object.isRequired,
  getAllSubjects: PropTypes.func.isRequired,
  getAllTask: PropTypes.func.isRequired,
  getAllTaskFilesByUser: PropTypes.func.isRequired,
  getAllAssessments: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  auth: state.auth,
  tasksCollection: state.tasksCollection,
  subjectsCollection: state.subjectsCollection,
  classesCollection: state.classesCollection,
  filesCollection: state.filesCollection,
  assessmentsCollection: state.assessmentsCollection
});

export default withRouter(
  connect(mapStateToProps, { getAllTask, getAllTaskFilesByUser, getAllSubjects, getAllAssessments })
  (withStyles(styles)(Dashboard))
)
