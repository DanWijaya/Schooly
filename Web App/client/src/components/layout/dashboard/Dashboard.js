import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { Chart } from 'react-charts'
import PropTypes from "prop-types";
import moment from "moment";
import "moment/locale/id";
import { getAllTaskFilesByUser } from "../../../actions/UploadActions";
import { getTasksBySC, getAllTask } from "../../../actions/TaskActions";
import { getAllSubjects } from "../../../actions/SubjectActions";
import { getKuisBySC, getUjianBySC, getAllAssessments } from "../../../actions/AssessmentActions";
import { getStudents, getStudentsByClass } from "../../../actions/UserActions";
import dashboardStudentBackground from "./DashboardStudentBackground.png";
import dashboardTeacherBackground from "./DashboardTeacherBackground.png";
import dashboardAdminBackground from "./DashboardAdminBackground.png";
import LightTooltip from "../../misc/light-tooltip/LightTooltip";
import { Fab, Grid, IconButton, Hidden, ListItemIcon, ListItemText, Menu, MenuItem,
  Paper, Typography, ListItem, ListItemAvatar, Dialog, Avatar, Badge } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import AddIcon from "@material-ui/icons/Add";
import AnnouncementIcon from "@material-ui/icons/Announcement";
import AssignmentIcon from "@material-ui/icons/Assignment";
import AssignmentIndIcon from "@material-ui/icons/AssignmentInd";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import MenuBookIcon from "@material-ui/icons/MenuBook";
import { FaChalkboardTeacher } from "react-icons/fa";
import AssignmentLateIcon from "@material-ui/icons/AssignmentLate";
import { FaClipboardList } from "react-icons/fa";
import { BsClipboardData } from "react-icons/bs";
import ErrorIcon from '@material-ui/icons/Error';
import WarningIcon from '@material-ui/icons/Warning';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';

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
  warningText: {
    color: theme.palette.warning.main,
  },
  createButton: {
    backgroundColor: theme.palette.success.main,
    color: "white",
    "&:focus, &:hover": {
      backgroundColor: "white",
      color: theme.palette.success.main,
    },
  },
  menuItem: {
    "&:hover": {
      backgroundColor: theme.palette.success.main,
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
  paperGrid: {
    marginTop: "20px"
  },
  listItemPaper: {
    marginBottom: "10px"
  },
  listItem: {
    "&:focus, &:hover": {
      backgroundColor: theme.palette.primary.fade,
    },
  },
  assignmentLate: {
    backgroundColor: theme.palette.primary.main,
  },
  errorIcon: {
    color: theme.palette.error.main,
  },
  warningIcon: {
    color: theme.palette.warning.main
  },
  checkIcon: {
    color: theme.palette.success.main
  },
  graph: {
    display: "flex", 
    flexDirection: "row", 
    justifyContent: "center", 
    marginRight: "10px"
  },
  graphButtons: {
    display: "flex", 
    flexDirection: "row", 
    justifyContent: "space-between", 
    marginTop: "10px",
    alignItems: "center"
  }
});

function TaskListItem(props) {
  const { classes } = props;

  return (
    <Grid item>
      <Link to={props.work_link}>
        <Paper variant="outlined" button className={classes.listItemPaper}>
          <Badge
            style={{display: "flex", flexDirection: "row"}}
            badgeContent={
              <ErrorIcon className={classes.errorIcon}/>
            }
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
          >
            <ListItem button className={classes.listItem}>
              <Hidden xsDown>
                <ListItemAvatar>
                  <Avatar className={classes.assignmentLate}>
                    <AssignmentIcon/>
                  </Avatar>
                </ListItemAvatar>
              </Hidden>
              <ListItemText
                primary={props.work_title}
                secondary={props.work_sender}
              />
              <ListItemText
                align="right"
                primary={
                  <Typography variant="body2" color="textSecondary">
                    {moment(props.work_dateposted).locale("id").format("DD MMM YYYY")}
                  </Typography>
                }
                secondary={
                  <Typography variant="body2" color="textSecondary">
                    {moment(props.work_dateposted).locale("id").format("HH.mm")}
                  </Typography>
                }
              />
            </ListItem>
          </Badge>
        </Paper>
      </Link>
    </Grid>
  )
}

function DashboardGraph(props){
    const { scores, workType } = props
    console.log(scores)
    // let graphData = []
    // if(scores){
    //   for(let i=0;i<scores.length;i++){
    //     let individualData = []
    //     individualData.push(i+1)
    //     individualData.push(scores[i])
    //     graphData.push(individualData)
    //   }
    // }
    const data = React.useMemo(
      () => [
        {
          label: `Hasil ${workType}`,
          data: scores
        },
      ],
      []
    )
    // console.log(graphData)
    console.log(data)
    const series = React.useMemo(
      () => ({
        type: 'bar'
      }),
      []
    )

    const axes = React.useMemo(
      () => [
        { primary: true, type: 'linear', position: 'bottom', label: "Coba" },
        { type: 'linear', position: 'left' }
      ],
      []
    )

    const tooltip = React.useMemo(
      () => ({
        anchor: 'bottom'
      }),[]
    )

    if(scores){
      console.log(data)
      return (
        // A react-chart hyper-responsively and continuously fills the available
        // space of its parent element automatically
        <div
          style={{
            width: '260px',
            height: '300px'
          }}
        >
          <Chart data={data} series={series} axes={axes} tooltip={tooltip}/>
        </div>
      )
    }
    else return <Typography>hehe</Typography>
}

function ListAssessments(props){
  const { category, subject, type, tab, all_assessments, classId, classes, all_subjects_map } = props;

  function AssessmentListItem(props) {

    // Dialog Kuis dan Ujian
    const [openDialog, setOpenDialog] = React.useState(false);
    const [currentDialogInfo, setCurrentDialogInfo] = React.useState({})

    const handleOpenDialog = (title, subject, start_date, end_date) => {
      setCurrentDialogInfo({title, subject, start_date, end_date})
      setOpenDialog(true)
      console.log(title)
    }

    const handleCloseDialog = () => {
      setOpenDialog(false)
    }

    return (
      <Grid item>
        <Paper variant="outlined" className={classes.listItemPaper} onClick={() => handleOpenDialog(props.work_title, props.work_subject, props.work_starttime, props.work_endtime)}>
          <Badge
            style={{display: "flex", flexDirection: "row"}}
            badgeContent={
              <WarningIcon className={classes.warningIcon}/>
            }
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
          >
            <ListItem button className={classes.listItem}>
              <Hidden xsDown>
              <ListItemAvatar>
                {props.work_category_avatar}
              </ListItemAvatar>
              </Hidden>
              <ListItemText
                primary={
                  <Typography variant="body1">
                    {props.work_title}
                  </Typography>
                }
                secondary={props.work_subject}
              />
              <ListItemText
                align="right"
                primary={
                  <Typography variant="body2" color="textSecondary">
                    {moment(props.work_dateposted).locale("id").format("DD MMM YYYY")}
                  </Typography>
                }
                secondary={
                  <Typography variant="body2" color="textSecondary">
                    {moment(props.work_dateposted).locale("id").format("HH.mm")}
                  </Typography>
                }
              />
            </ListItem>
          </Badge>
        </Paper>
        <Dialog
          fullScreen={false}
          open={openDialog}
          onClose={handleCloseDialog}
          fullWidth={true}
          maxWidth="sm"
        >
          <div style={{padding: "20px"}}>
            <Typography variant="h4" align="center">{currentDialogInfo.title}</Typography>
            <Typography variant="h5" align="center" color="primary">
              {currentDialogInfo.subject}
            </Typography>
            <Typography variant="subtitle1" align="center" style={{marginTop: "25px"}}>Mulai : {currentDialogInfo.start_date}</Typography>
            <Typography variant="subtitle1" align="center">Selesai : {currentDialogInfo.end_date}</Typography>
            <Typography variant="subtitle2" align="center" color="textSecondary" style={{marginTop: "10px", textAlign: "center"}}>
              Link Untuk Kuis atau Ulangan Anda akan Diberikan Oleh Guru Mata Pelajaran Terkait
            </Typography>
          </div>
        </Dialog>
      </Grid>
    )
  }

  let AssessmentsList = []
  let result = [];
  if (Boolean(all_assessments.length)) {
    var i;
    for (i = all_assessments.length-1; i >= 0; i--){
      let assessment = all_assessments[i];
      let class_assigned = assessment.class_assigned
      if(class_assigned.indexOf(classId) !== -1){
        AssessmentsList.push(assessment)
      }
      // if(i === all_assessments.length - 5){ // item terakhir harus pas index ke 4.
      //   break;
      // }
    }

    for (i = 0; i < AssessmentsList.length; i++){
      let assessment = AssessmentsList[i]
      console.log(assessment)
      let workCategoryAvatar = ( type === "Kuis" ?
          <Avatar className={classes.assignmentLate}>
            <FaClipboardList/>
          </Avatar>
        :
          <Avatar className={classes.assignmentLate}>
            <BsClipboardData/>
          </Avatar>
      )
      // let workStatus = "Belum Ditempuh"
      if(type === "Kuis"){
        if((!category || (category === "subject" && assessment.subject === subject._id)) && !assessment.submissions && assessment.type === "Kuis" && assessment.posted){
          result.push(
            <AssessmentListItem
              work_title={assessment.name}
              work_category_avatar={workCategoryAvatar}
              work_subject={category === "subject" ? null : all_subjects_map.get(assessment.subject)}
              // work_status={workStatus}
              work_starttime={moment(assessment.start_date).locale("id").format("DD MMM YYYY, HH:mm")}
              work_endtime={moment(assessment.end_date).locale("id").format("DD MMM YYYY, HH:mm")}
              work_dateposted={assessment.createdAt}
            />
          )
        }
      }
      if(type === "Ujian"){
        if((!category || (category === "subject" && assessment.subject === subject._id)) && !assessment.submissions && assessment.type === "Ujian" && assessment.posted){
          result.push(
            <AssessmentListItem
              work_title={assessment.name}
              work_category_avatar={workCategoryAvatar}
              work_subject={category === "subject" ? null : all_subjects_map.get(assessment.subject)}
              // work_status={workStatus}
              work_starttime={moment(assessment.start_date).locale("id").format("DD MMM YYYY, HH:mm")}
              work_endtime={moment(assessment.end_date).locale("id").format("DD MMM YYYY, HH:mm")}
              work_dateposted={assessment.createdAt}
            />
          )
        }
      }
      if(!category && result.length === 5)
        break;
      if(category==="subject" && result.length === 3)
        break;
    }
  }
  if(result.length === 0){
    result.push(<Typography variant="subtitle1" align="center" color="textSecondary">Kosong</Typography>)
  }
  return result;
}

function WelcomePanel(props){
  const { user, classes } = props;

  return (
  <Grid item>
    {user.role === "Student" ?
      <Paper elevation={0} className={classes.timePaperStudent}>
        <Typography variant="h4" gutterBottom>
          <b>Selamat Datang, {user.name}</b>
        </Typography>
        <Typography variant="h6">
          Apa yang ingin Anda kerjakan hari ini?
        </Typography>
      </Paper>
    : user.role === "Teacher" ?
      <Paper elevation={0} className={classes.timePaperTeacher}>
        <Typography variant="h4" gutterBottom>
          <b>Selamat Datang, {user.name}</b>
        </Typography>
        <Typography variant="h6">
          Apa yang ingin Anda kerjakan hari ini?
        </Typography>
      </Paper>
    :
      <Paper elevation={0} className={classes.timePaperAdmin}>
        <Typography variant="h4" gutterBottom>
          <b>Selamat Datang, {user.name}</b>
        </Typography>
        <Typography variant="h6">
          Apa yang ingin Anda kerjakan hari ini?
        </Typography>
      </Paper>
    }
  </Grid>
  )
}

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      anchorEl: null,
      taskGraphCurrentSubject: 0,
      quizGraphCurrentSubject: 0,
      examGraphCurrentSubject: 0,
    };
  }

  componentDidMount() {
    const { getAllTask, getAllTaskFilesByUser, getAllSubjects, getAllAssessments, getStudentsByClass, getStudents } = this.props;
    const { user } = this.props.auth;

    getAllTask() // actions yang membuat GET request ke Database.
    getAllSubjects()
    getAllSubjects("map") // untuk dapatin subject"nya gitu

    // const { all_subjects_map } = this.props.subjectsCollection
    // let subjectArray = Object.keys(all_subjects_map)
    
    if (user.role === "Student"){
      getStudentsByClass(user.kelas)
      // getTasksBySC
      // getKuisBySC
      // getUjianBySC
    }
    getAllAssessments()
    getAllTaskFilesByUser(user.id) // yang dapatin takfiles cuma berlaku untuk student soalnya
    getStudents()
  }

  componentWillUnmount() {
    clearInterval(this.intervalID);
  }

  // Create Button Menu
  handleMenuOpen = (event) => {
    this.setState({ anchorEl: event.currentTarget });
  };
  handleMenuClose = () => {
    this.setState({ anchorEl: null });
  };

  changeGraphSubject = (workType, direction, subjectsLength) => {
    if(workType === "Tugas"){
      if(direction === "Left" && this.state.taskGraphCurrentSubject > 0){
        this.setState({ taskGraphCurrentSubject: this.state.taskGraphCurrentSubject - 1});
      }
      else if(direction === "Right" && this.state.taskGraphCurrentSubject < subjectsLength - 1){
        this.setState({ taskGraphCurrentSubject: this.state.taskGraphCurrentSubject + 1});
      }
    }
    else if(workType === "Kuis"){
      if(direction === "Left" && this.state.quizGraphCurrentSubject > 0){
        this.setState({ quizGraphCurrentSubject: this.state.quizGraphCurrentSubject - 1});
      }
      else if(direction === "Right" && this.state.quizGraphCurrentSubject < subjectsLength - 1){
        this.setState({ quizGraphCurrentSubject: this.state.quizGraphCurrentSubject + 1});
      }
    }
    else if(workType === "Ujian"){
      if(direction === "Left" && this.state.examGraphCurrentSubject > 0){
        this.setState({ examGraphCurrentSubject: this.state.examGraphCurrentSubject - 1});
      }
      else if(direction === "Right" && this.state.examGraphCurrentSubject < subjectsLength - 1){
        this.setState({ examGraphCurrentSubject: this.state.examGraphCurrentSubject + 1});
      }
    }
  }

  render() {

    const { classes, tasksCollection } = this.props;

    const { user, all_students } = this.props.auth;
    const { all_user_files } = this.props.filesCollection
    const { all_subjects_map, all_subjects } = this.props.subjectsCollection
    const { all_assessments } = this.props.assessmentsCollection

    const classId = user.kelas

    console.log(all_assessments)
    console.log(user)
    console.log(tasksCollection)

    function graphTask(subjectIndex){
      if(all_subjects[subjectIndex]){
        let subject = all_subjects[subjectIndex]._id
        let subjectScores = []
        for(let i=0;i<tasksCollection.length;i++){
          if(tasksCollection[i].grades && tasksCollection[i].subject === subject){
            let keysArray = Object.keys(tasksCollection[i].grades)
            let valuesArray = Object.values(tasksCollection[i].grades)
            for(let j=0;j<keysArray.length;j++){
              if(keysArray[j] === user.id){
                subjectScores.push(valuesArray[j])
                break;
              }
            }
          }
        }
        let graphData = [[0,0]]
        for(let i=0;i<subjectScores.length;i++){
          let individualData = []
          individualData.push(i+1)
          individualData.push(subjectScores[i])
          graphData.push(individualData)
        }
        if(graphData.length !== 1){
          return <DashboardGraph scores={graphData} workType="Tugas"/>
        }
        else return <Typography align="center" color="textSecondary" variant="subtitle-1">Belum ada Tugas yang telah dinilai untuk mata pelajaran terkait</Typography>
      }
      else return <Typography align="center" color="textSecondary" variant="subtitle-1">Belum ada Tugas yang telah dinilai untuk mata pelajaran terkait</Typography>
    }

    function graphAssessment(subjectIndex, type){
      if(all_subjects[subjectIndex]){
        console.log(all_subjects[subjectIndex])
        let subject = all_subjects[subjectIndex]._id
        let subjectScores = []
        if(type === "Kuis"){
          for(let i=0;i<all_assessments.length;i++){
            if(all_assessments[i].grades && all_assessments[i].subject === subject && all_assessments[i].type === "Kuis"){
              let keysArray = Object.keys(all_assessments[i].grades)
              let valuesArray = Object.values(all_assessments[i].grades)
              for(let j=0;j<keysArray.length;j++){
                if(keysArray[j] === user.id){
                  subjectScores.push(valuesArray[j].total_grade)
                  break;
                }
              }
            }
          }
          console.log(subjectScores)
        }
        else if(type === "Ujian"){
          for(let i=0;i<all_assessments.length;i++){
            if(all_assessments[i].grades && all_assessments[i].subject === subject && all_assessments[i].type === "Ujian"){
              let keysArray = Object.keys(all_assessments[i].grades)
              let valuesArray = Object.values(all_assessments[i].grades)
              for(let j=0;j<keysArray.length;j++){
                if(keysArray[j] === user.id){
                  subjectScores.push(valuesArray[j].total_grade)
                  break;
                }
              }
            }
          }
        }
        let graphData = [[0,0]]
        for(let i=0;i<subjectScores.length;i++){
          let individualData = []
          individualData.push(i+1)
          individualData.push(subjectScores[i])
          graphData.push(individualData)
        }
        if(graphData.length !== 1){
          return <DashboardGraph scores={graphData} workType={type}/>
        }
        else return <Typography align="center" color="textSecondary" variant="subtitle-1">Belum ada {type} yang telah dinilai untuk mata pelajaran terkait</Typography>
      }
      else return <Typography align="center" color="textSecondary" variant="subtitle-1">Belum ada {type} yang telah dinilai untuk mata pelajaran terkait</Typography>
    }

    function listTasks(){
      let result = []
      tasksByClass.map((task) => {
        let flag = true
        for (var i = 0; i < all_user_files.length; i++) {
          if (all_user_files[i].for_task_object === task._id) {
            flag = false
            break;
          }
        }
        console.log(task)
        if(!all_subjects_map.get(task.subject)){
          flag = false
        }
        if(flag){
          result.push(
            <TaskListItem
              classes={classes}
              work_title={task.name}
              work_sender={all_subjects_map.get(task.subject)}
              work_deadline_mobile={moment(task.deadline).locale("id").format("DD MMM YYYY, HH:mm")}
              work_deadline_desktop={moment(task.deadline).locale("id").format("DD MMM YYYY, HH:mm")}
              work_link={`/tugas-murid/${task._id}`}
              work_dateposted={task.createdAt}
            />
          )
        }
      })
      if(result.length === 0){
        result.push(<Typography variant="subtitle1" align="center" color="textSecondary">Kosong</Typography>)
      }
      return result
    }

    function listTasksTeacher(){
      let result = []
      for(let i=0;i<tasksCollection.length;i++){
        if(tasksCollection[i].person_in_charge_id === user.id){
          let number_students_assigned = 0
          for(let j=0;j<all_students.length;j++){
            if(tasksCollection[i].class_assigned.includes(all_students[j].kelas)){
              number_students_assigned = number_students_assigned + 1
            }
          }
          if(Object.values(tasksCollection[i].grades).length !== number_students_assigned){
            let task = tasksCollection[i]
            result.push(
              <TaskListItem
                classes={classes}
                work_title={task.name}
                work_sender={all_subjects_map.get(task.subject)}
                work_deadline_mobile={moment(task.deadline).locale("id").format("DD MMM YYYY, HH:mm")}
                work_deadline_desktop={moment(task.deadline).locale("id").format("DD MMM YYYY, HH:mm")}
                work_link={`/tugas-guru/${task._id}`}
                work_dateposted={task.createdAt}
              />
            )
          }
        }
      }
      if(result.length === 0){
        result.push(<Typography variant="subtitle1" align="center" color="textSecondary">Kosong</Typography>)
      }
      return result
    }

    function showSubject(subjectIndex){
      console.log(subjectIndex)
      if(all_subjects[subjectIndex]){
        return <Typography align="center">{all_subjects[subjectIndex].name}</Typography>
      }
      else return null
    }

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
        <WelcomePanel user={user} classes={classes}/>
        <div style={{marginTop: "20px"}}>
          {user.role === "Student" ?
            <Grid item container spacing={3}>
              <Grid item xs={12} md={7} lg={8}>
                <Grid container direction="column" spacing={2}>
                  <Grid item>
                    <Paper style={{padding: "20px"}}>
                      <Grid container justify="space-between" alignItems="center" style={{marginBottom: "15px"}}>
                        <Grid item>
                          <Grid container alignItems="center">
                            <AssignmentIcon
                              style={{marginRight: "10px", fontSize: "22px", color: "grey"}}
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
                        {listTasks()}
                      </Grid>
                    </Paper>
                  </Grid>
                  <Grid item>
                    <Paper style={{padding: "20px"}}>
                      <Grid container justify="space-between" alignItems="center" style={{marginBottom: "15px"}}>
                        <Grid item>
                          <Grid container alignItems="center">
                            <FaClipboardList
                              style={{marginRight: "10px", fontSize: "22px", color: "grey"}}
                            />
                            <Typography variant="h5" color="primary">
                              Kuis Yang Akan Datang
                            </Typography>
                          </Grid>
                        </Grid>
                        <Grid item>
                          <Link to="/daftar-kuis">
                            <LightTooltip title="Lihat Semua" placement="top">
                              <IconButton>
                                <ChevronRightIcon />
                              </IconButton>
                            </LightTooltip>
                          </Link>
                        </Grid>
                      </Grid>
                      <Grid container direction="column" spacing={1}>
                        <ListAssessments category={null}
                          subject={{}}
                          type="Kuis"
                          tab="pekerjaan-kelas"
                          all_assessments={all_assessments}
                          classId={classId}
                          classes={classes}
                          all_subjects_map={all_subjects_map}
                        />
                      </Grid>
                    </Paper>
                  </Grid>
                  <Grid item>
                    <Paper style={{padding: "20px"}}>
                      <Grid container justify="space-between" alignItems="center" style={{marginBottom: "15px"}}>
                        <Grid item>
                          <Grid container alignItems="center">
                            <BsClipboardData
                              style={{marginRight: "10px", fontSize: "22px", color: "grey"}}
                            />
                            <Typography variant="h5" color="primary">
                              Ujian Yang Akan Datang
                            </Typography>
                          </Grid>
                        </Grid>
                        <Grid item>
                          <Link to="/daftar-ujian">
                            <LightTooltip title="Lihat Semua" placement="top">
                              <IconButton>
                                <ChevronRightIcon />
                              </IconButton>
                            </LightTooltip>
                          </Link>
                        </Grid>
                      </Grid>
                      <Grid container direction="column" spacing={1}>
                        <ListAssessments category={null}
                          subject={{}}
                          type="Ujian"
                          tab="pekerjaan-kelas"
                          all_assessments={all_assessments}
                          classId={classId}
                          classes={classes}
                          all_subjects_map={all_subjects_map}
                        />
                      </Grid>
                    </Paper>
                  </Grid>
                </Grid>
              </Grid>
              <Hidden smDown>
                <Grid item xs={12} md={5} lg={4}>
                  <Grid container direction="column" spacing={2}>
                    <Grid item>
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
                          <Grid item className={classes.graph}>
                            {graphTask(this.state.taskGraphCurrentSubject)}
                          </Grid>
                          <Grid item className={classes.graphButtons}>
                            <IconButton onClick={() => this.changeGraphSubject("Tugas", "Left", all_subjects.length)}>
                              <ArrowBackIosIcon/>
                            </IconButton>
                            {showSubject(this.state.taskGraphCurrentSubject)}
                            <IconButton onClick={() => this.changeGraphSubject("Tugas", "Right", all_subjects.length)}>
                              <ArrowForwardIosIcon/>
                            </IconButton>
                          </Grid>
                        </Grid>
                      </Paper>
                    </Grid>
                    <Grid item>
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
                            <Link to="/daftar-kuis">
                              <LightTooltip title="Lihat Semua" placement="top">
                                <IconButton>
                                  <ChevronRightIcon />
                                </IconButton>
                              </LightTooltip>
                            </Link>
                          </Grid>
                        </Grid>
                        <Grid container direction="column" spacing={1}>
                          <Grid item className={classes.graph}>
                            {graphAssessment(this.state.quizGraphCurrentSubject, "Kuis")}
                          </Grid>
                          <Grid item className={classes.graphButtons}>
                            <IconButton onClick={() => this.changeGraphSubject("Kuis", "Left", all_subjects.length)}>
                              <ArrowBackIosIcon onClick={() => this.changeGraphSubject("Kuis", "Left", all_subjects.length)}/>
                            </IconButton>
                            {showSubject(this.state.quizGraphCurrentSubject)}
                            <IconButton onClick={() => this.changeGraphSubject("Kuis", "Right", all_subjects.length)}>
                              <ArrowForwardIosIcon/>
                            </IconButton>
                          </Grid>
                        </Grid>
                      </Paper>
                    </Grid>
                    <Grid item>
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
                            <Link to="/daftar-ujian">
                              <LightTooltip title="Lihat Semua" placement="top">
                                <IconButton>
                                  <ChevronRightIcon />
                                </IconButton>
                              </LightTooltip>
                            </Link>
                          </Grid>
                        </Grid>
                        <Grid container direction="column" spacing={1}>
                          <Grid item className={classes.graph}>
                            {graphAssessment(this.state.examGraphCurrentSubject, "Ujian")}
                          </Grid>
                          <Grid item className={classes.graphButtons}>
                            <IconButton onClick={() => this.changeGraphSubject("Ujian", "Left", all_subjects.length)}>
                              <ArrowBackIosIcon/>
                            </IconButton>
                            {showSubject(this.state.examGraphCurrentSubject)}
                            <IconButton onClick={() => this.changeGraphSubject("Ujian", "Right", all_subjects.length)}>
                              <ArrowForwardIosIcon/>
                            </IconButton>
                          </Grid>
                        </Grid>
                      </Paper>
                    </Grid>
                  </Grid>
                </Grid>
              </Hidden>
            </Grid>
          : user.role === "Teacher" ?
            <>
            <Grid item container spacing={2} justify="flex-end" alignItems="center">
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
            <Grid item direction="row" spacing={2} xs={12} style={{marginTop: "10px"}}>
              <Paper style={{padding: "20px"}}>
                <Grid container justify="space-between" alignItems="center" style={{marginBottom: "15px"}}>
                  <Grid item>
                    <Grid container alignItems="center">
                      <AssignmentIcon
                        color="action"
                        style={{marginRight: "10px", fontSize: "20px"}}
                      />
                      <Typography variant="h5" color="primary">
                        Tugas Yang Belum Diperiksa
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
                  {listTasksTeacher()}
                </Grid>
              </Paper>
            </Grid>
            </>
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
        </div>
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
  getStudentsByClass: PropTypes.func.isRequired,
  getStudents: PropTypes.func.isRequired,
  getTasksBySC: PropTypes.func.isRequired,
  getKuisBySC: PropTypes.func.isRequired,
  getUjianBySC: PropTypes.func.isRequired
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
  connect(mapStateToProps, { getAllTask, getAllTaskFilesByUser, getAllSubjects, getAllAssessments, getStudentsByClass, getStudents, getTasksBySC, getKuisBySC, getUjianBySC })
  (withStyles(styles)(Dashboard))
)
