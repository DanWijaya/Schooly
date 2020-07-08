import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import moment from "moment";
import "moment/locale/id";
import { setCurrentClass } from "../../../actions/ClassActions";
import { getStudentsByClass, getTeachers } from "../../../actions/UserActions";
import { getAllSubjects } from "../../../actions/SubjectActions";
import { viewTask } from "../../../actions/TaskActions";
import { getAllTaskFilesByUser } from "../../../actions/UploadActions";
import { getMaterial } from "../../../actions/MaterialActions";
import LightTooltip from "../../misc/light-tooltip/LightTooltip";
import { Avatar, Box, Button, Divider, ExpansionPanel, ExpansionPanelSummary, Grid, Hidden, IconButton, Paper,
   List, ListItem, ListItemAvatar, ListItemText, Tabs, Tab, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import AssignmentLateIcon from "@material-ui/icons/AssignmentLate";
import AssignmentTurnedInIcon from "@material-ui/icons/AssignmentTurnedIn";
import BallotIcon from "@material-ui/icons/Ballot";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import DesktopWindowsIcon from "@material-ui/icons/DesktopWindows";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import PageviewIcon from "@material-ui/icons/Pageview";
import SupervisorAccountIcon from "@material-ui/icons/SupervisorAccount";
import MenuBookIcon from "@material-ui/icons/MenuBook";

const useStyles = makeStyles((theme) => ({
  root: {
    margin: "auto",
    maxWidth: "1000px",
    padding: "10px",
  },
  subjectDivider: {
    backgroundColor: theme.palette.primary.main,
  },
  expansionPanelList: {
    margin: "20px",
  },
  listItemPaper: {
    marginBottom: "20px",
  },
  listItem: {
    minHeight: "70px",
    "&:focus, &:hover": {
      backgroundColor: theme.palette.button.main,
    },
  },
  lookSubjectButton: {
    "&:focus, &:hover": {
      color: theme.palette.primary.main,
    },
  },
  material: {
    backgroundColor: theme.palette.primary.main,
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
  personListDivider: {
    backgroundColor: theme.palette.primary.main,
  },
}));

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return(
    <div
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          {children}
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
};

function AssignmentListItem(props) {
  const classes = useStyles()

  return(
    <div>
      <Hidden smUp implementation="css">
        <Paper variant="outlined" className={classes.listItemPaper}>
          <ListItem button component="a" href={props.work_link} className={classes.listItem}>
            <Grid container alignItems="center">
              <Grid item xs={7}>
                <ListItemText
                  primary={
                    <Typography variant="h6">
                      {props.work_title}
                    </Typography>
                  }
                  secondary={props.work_subject}
                />
              </Grid>
              <Grid item xs={5}>
                <ListItemText
                  align="right"
                  primary={
                    <Typography variant="body2" className={classes.warningText}>
                      Batas Waktu: <br /> {props.work_deadline}
                    </Typography>
                  }
                  secondary={
                    <Typography variant="caption">
                      {props.work_status}
                    </Typography>
                  }
                />
              </Grid>
            </Grid>
          </ListItem>
        </Paper>
      </Hidden>
      <Hidden xsDown implementation="css">
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
              secondary={props.work_subject}
            />
            <ListItemText
              align="right"
              primary={
                <Typography className={classes.warningText}>
                  Batas Waktu: {props.work_deadline}
                </Typography>
              }
              secondary={props.work_status}
            />
          </ListItem>
        </Paper>
      </Hidden>
    </div>
  )
}

function MaterialListitem(props){
  const classes = useStyles()

  return(
    <div>
    <Hidden smUp implementation="css">
      <Paper variant="outlined" className={classes.listItemPaper} style={{display: "flex", alignItems: "center"}}>
        <ListItem button component="a" href={props.work_link} className={classes.listItem}>
          <ListItemText
            primary={
              <Typography variant="h6">
                {props.work_title}
              </Typography>
            }
            secondary={!props.work_subject ? " " : props.work_subject}
          />
        </ListItem>
      </Paper>
    </Hidden>
    <Hidden xsDown implementation="css">
      <Paper variant="outlined" className={classes.listItemPaper} style={{display: "flex", alignItems: "center"}}>
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
            secondary={!props.work_subject ? " " : props.work_subject}
          />
        </ListItem>
      </Paper>
    </Hidden>
    </div>
  )
}

function PersonListItem(props) {
  return(
    <div>
      <Hidden smUp implementation="css">
        <ListItem>
          <ListItemAvatar>
            <Avatar src={props.person_avatar}/>
          </ListItemAvatar>
          <ListItemText
            primary={
              <Typography variant="h6">
                {props.person_name}
              </Typography>
            }
            secondary={
              <Typography variant="caption">
                {props.person_role}
              </Typography>
            }
          />
        </ListItem>
      </Hidden>
      <Hidden xsDown implementation="css">
        <ListItem>
          <ListItemAvatar>
            <Avatar src={props.person_avatar}/>
          </ListItemAvatar>
          <ListItemText
            primary={
              <Typography variant="h6">
                {props.person_name}
              </Typography>
            }
          />
          <ListItemText
            primary={
              <Typography align="right">
                {props.person_role}
              </Typography>
            }
          />
        </ListItem>
      </Hidden>
    </div>
  )
}

function ViewClass(props) {
  const classes = useStyles();

  const { setCurrentClass, getStudentsByClass, getAllSubjects,
     tasksCollection, getTeachers, getMaterial, getAllTaskFilesByUser, viewTask } = props;
  const { all_user_files } = props.filesCollection;
  const { all_subjects } = props.subjectsCollection;
  const { selectedMaterials} = props.materialsCollection
  const { selectedClasses, kelas } = props.classesCollection
  const { all_students, all_teachers, user } = props.auth;
  const classId = props.match.params.id;

  let tasksByClass = []
  console.log(props.classesCollection)
  // All actions to retrive datas from Database
  if(Boolean(tasksCollection.length)){
    tasksCollection.map((task) => {
      let class_assigned = task.class_assigned
      for (var i = 0; i < class_assigned.length; i++){
        if(class_assigned[i]._id === classId)
          tasksByClass.push(task)
      }
    })
  }

  React.useEffect(() => {
    if(Object.keys(kelas).length === 0){
      setCurrentClass(classId) // get the kelas object
    }
    if(user.role === "Student"){
      getMaterial(user.kelas, "by_class")
    }
    viewTask() // get the tasksCollection
    getAllSubjects() // get the all_subjects
    getStudentsByClass(props.match.params.id) // get the all_students
    getTeachers() // get the all_teachers
    getAllTaskFilesByUser(user.id) // get the all_user_files
  }, [all_teachers.length ])

  const [value, setValue] = React.useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  console.log(selectedMaterials)
  document.title = !kelas.name ? "Schooly | Lihat Kelas" : `Schooly | ${kelas.name}`

  return(
    <div className={classes.root}>
      <Paper square>
        <Typography variant="h3" align="center" style={{paddingTop: "10px"}} gutterBottom>
          {kelas.name}
        </Typography>
        <Tabs
          variant="fullWidth"
          indicatorColor="primary"
          textColor="primary"
          value={value}
          onChange={handleChange}
        >
          <Tab icon={<DesktopWindowsIcon />} label="Pekerjaan Kelas" {...TabIndex(0)} />
          <Tab icon={<BallotIcon />} label="Mata Pelajaran" {...TabIndex(1)} />
          <Tab icon={<SupervisorAccountIcon />} label="Peserta" {...TabIndex(2)} />
        </Tabs>
      </Paper>
      <TabPanel value={value} index={0} >
          <Grid item>
            <ExpansionPanel defaultExpanded>
              <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="h6">
                  Materi
                </Typography>
              </ExpansionPanelSummary>
              <Divider />
              <List className={classes.expansionPanelList}>
            {!selectedMaterials.length ? null :
            selectedMaterials.map((material) => {
              let workCategoryAvatar = (
                <Avatar className={classes.material}>
                  <MenuBookIcon/>
                </Avatar>
              )
              let workStatus = "Belum Dikumpulkan"
              return(
                <MaterialListitem
                  work_title={material.name}
                  work_category_avatar={workCategoryAvatar}
                  work_subject={material.subject}
                  work_status={workStatus}
                  work_link={`/materi/${material._id}`}
                />
              )
            })}
            </List>
          </ExpansionPanel>
          <ExpansionPanel defaultExpanded>
              <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="h6">
                  Tugas
                </Typography>
              </ExpansionPanelSummary>
              <Divider />
              <List className={classes.expansionPanelList}>
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
                  workCategoryAvatar = (
                    <Avatar className={classes.assignmentTurnedIn}>
                      <AssignmentTurnedInIcon/>
                    </Avatar>
                  )
                  break;
                }
              }
              return(
                <AssignmentListItem
                  work_title={task.name}
                  work_category_avatar={workCategoryAvatar}
                  work_subject={task.subject}
                  work_status={workStatus}
                  work_deadline={moment(task.deadline).locale("id").format("DD-MM-YYYY")}
                  work_link={`/tugas-murid/${task._id}`}
                />
              )
            })}
            </List>
          </ExpansionPanel>
          <ExpansionPanel disabled>
              <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="h6">
                  Kuis (Coming Soon)
                </Typography>
              </ExpansionPanelSummary>
              <Divider />
          </ExpansionPanel>
          <ExpansionPanel disabled>
              <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="h6">
                  Ujian (Coming Soon)
                </Typography>
              </ExpansionPanelSummary>
          </ExpansionPanel>
          </Grid>
      </TabPanel>
      <TabPanel value={value} index={1}>
        <div className={classes.tabPanel}>
          {all_subjects.length === 0 ? null :
          all_subjects.map((subject) => {
            let isEmpty = true
            return(
              <ExpansionPanel>
                <ExpansionPanelSummary>
                  <Grid container justify="space-between" alignItems="center">
                    <Typography variant="h5">
                      {subject.name}
                    </Typography>
                    <LightTooltip title="Lihat Lebih Lanjut" placement="right">
                      <IconButton
                        className={classes.lookSubjectButton}
                        href={`/mata-pelajaran/${subject.name}`}
                        onClick={(event) => event.stopPropagation()}
                      >
                        <PageviewIcon />
                      </IconButton>
                    </LightTooltip>
                  </Grid>
                </ExpansionPanelSummary>
                <Divider className={classes.subjectDivider} />
                <List className={classes.expansionPanelList}>
                {!selectedMaterials.length ? null :
                  selectedMaterials.map((material) => {
                    if(material.subject !== subject.name){
                      return null
                    }
                    let workCategoryAvatar = (
                      <Avatar className={classes.material}>
                        <MenuBookIcon/>
                      </Avatar>
                    )
                    let workStatus = "Belum Dikumpulkan"
                    isEmpty = false
                    return(
                      <MaterialListitem
                        work_title={material.name}
                        work_category_avatar={workCategoryAvatar}
                        work_status={workStatus}
                        work_link={`/materi/${material._id}`}
                      />
                    )
                  })
                  }
                  {tasksByClass.map((task) => {
                    let workCategoryAvatar = (
                      <Avatar className={classes.assignmentLate}>
                        <AssignmentLateIcon/>
                      </Avatar>
                    )
                    let workStatus = "Belum Dikumpulkan"
                    for(var i =0; i < all_user_files.length; i++) {
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
                    if(task.subject === subject.name){
                      isEmpty = false
                      return(
                        <AssignmentListItem
                          work_title={task.name}
                          work_category_avatar={workCategoryAvatar}
                          work_status={workStatus}
                          work_deadline={moment(task.deadline).locale("id").format("DD-MM-YYYY")}
                          work_link={`/tugas-murid/${task._id}`}
                        />
                      )
                    }
                  })}
                  {isEmpty ?
                    <Typography variant="h5" color="primary" align="center" gutterBottom>
                      Kosong
                    </Typography>
                  : null}
                </List>
              </ExpansionPanel>
            )
          })
        }
        </div>
      </TabPanel>
      <TabPanel value={value} index={2}>
        <div className={classes.tabPanel}>
          <Paper style={{padding: "20px", marginBottom: "40px"}}>
            <Typography variant="h4" gutterBottom>
              Wali Kelas
            </Typography>
            <Divider className={classes.personListDivider} />
            <List className={classes.listContainer}>
              <PersonListItem
                person_avatar={kelas.walikelas ?
                  `/api/uploads/image/${kelas.walikelas.avatar}` : null}
                person_name={kelas.walikelas ? kelas.walikelas.name : null}
                person_role={kelas.walikelas ? kelas.walikelas.subject_teached : null}
              />
            </List>
          </Paper>
          <Paper style={{padding: "20px"}}>
            <Typography variant="h4" gutterBottom>
              Murid
            </Typography>
            <Divider className={classes.personListDivider} />
            <List className={classes.listContainer}>
              {all_students.map((student) => (
                <PersonListItem
                  person_avatar={`/api/uploads/image/${student.avatar}`}
                  person_name={student.name}
                  person_role={student.role}
                />
              ))}
            </List>
          </Paper>
        </div>
      </TabPanel>
    </div>
  )
};

ViewClass.propTypes = {
  classesCollection: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  subjectsCollection: PropTypes.object.isRequired,
  materialsCollection: PropTypes.object.isRequired,
  tasksCollection: PropTypes.object.isRequired,
  filesCollection: PropTypes.object.isRequired,
  setCurrentClass: PropTypes.func.isRequired,
  getAllSubjects: PropTypes.func.isRequired,
  viewTask: PropTypes.func.isRequired,
  getTeachers: PropTypes.func.isRequired,
  getMaterial: PropTypes.func.isRequired,
  getAllTaskFilesByUser: PropTypes.func.isRequired,
}

const mapStateToProps = (state) => ({
  auth: state.auth,
  classesCollection: state.classesCollection,
  subjectsCollection: state.subjectsCollection,
  tasksCollection: state.tasksCollection,
  materialsCollection: state.materialsCollection,
  filesCollection: state.filesCollection,
});

export default connect(
  mapStateToProps, { setCurrentClass, getStudentsByClass,
    getAllSubjects, viewTask, getTeachers, getMaterial, getAllTaskFilesByUser }
) (ViewClass);
