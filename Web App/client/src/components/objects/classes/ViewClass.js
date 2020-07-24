import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
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
import { Avatar, Box, Divider, ExpansionPanel, ExpansionPanelSummary, Grid, Hidden, IconButton, Paper,
   List, ListItem, ListItemAvatar, ListItemText, Tabs, Tab, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import AssignmentLateIcon from "@material-ui/icons/AssignmentLate";
import AssignmentTurnedInIcon from "@material-ui/icons/AssignmentTurnedIn";
import BallotIcon from "@material-ui/icons/Ballot";
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
  viewSubjectButton: {
    backgroundColor: theme.palette.warning.main,
    color: "white",
    "&:focus, &:hover": {
      backgroundColor: "white",
      color: theme.palette.warning.main,
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
        <Link to={props.work_link}>
          <Paper variant="outlined" className={classes.listItemPaper}>
            <ListItem button className={classes.listItem}>
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
        </Link>
      </Hidden>
      <Hidden xsDown implementation="css">
        <Link to={props.work_link}>
          <Paper variant="outlined" className={classes.listItemPaper}>
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
                secondary={props.work_subject}
              />
              <ListItemText
                align="right"
                primary={
                  <Typography variant="body2" className={classes.warningText}>
                    Batas Waktu: {props.work_deadline}
                  </Typography>
                }
                secondary={props.work_status}
              />
            </ListItem>
          </Paper>
        </Link>
      </Hidden>
    </div>
  )
}

function MaterialListitem(props) {
  const classes = useStyles()

  return(
    <div>
    <Hidden smUp implementation="css">
    <Link to={props.work_link}>
      <Paper variant="outlined" className={classes.listItemPaper} style={{display: "flex", alignItems: "center"}}>
        <ListItem button className={classes.listItem}>
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
      </Link>
    </Hidden>
    <Hidden xsDown implementation="css">
    <Link to={props.work_link}>
      <Paper variant="outlined" className={classes.listItemPaper} style={{display: "flex", alignItems: "center"}}>
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
        </Paper>
      </Link>
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
              !props.person_role ? null : 
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
  const { all_subjects, all_subjects_map } = props.subjectsCollection;
  const { selectedMaterials} = props.materialsCollection
  const { kelas } = props.classesCollection
  const { students_by_class, all_teachers, user } = props.auth;
  const classId = props.match.params.id;

  console.log(props.classesCollection)
  // All actions to retrive datas from Database
  
  function listTasks(category=null, subject={}){
    let tasksList = []
    if (Boolean(tasksCollection.length)) {
      var i;
      for(i = tasksCollection.length-1; i >= 0; i--){
        let task = tasksCollection[i];
        let class_assigned = task.class_assigned
        if(class_assigned.indexOf(classId) !== -1){
          tasksList.push(task)
        }
        if(i === tasksCollection.length - 5){ // item terakhir harus pas index ke 4.
          break;
        }
      }

      let result = [];
      for(i =0; i < tasksList.length; i++){
      let task = tasksList[i]
      let workCategoryAvatar = (
        <Avatar className={classes.assignmentLate}>
          <AssignmentLateIcon/>
        </Avatar>
      )
      let workStatus = "Belum Dikumpulkan"
      console.log(all_user_files)
      for(var j = 0; j < all_user_files.length; j++){
          if(all_user_files[j].for_task_object === task._id){
          workStatus = "Telah Dikumpulkan"
          workCategoryAvatar = (
            <Avatar className={classes.assignmentTurnedIn}>
              <AssignmentTurnedInIcon/>
            </Avatar>
          )
          break;
        }
      }

      if(!category || (category === "subject" && task.subject === subject._id))
        result.push(
          <AssignmentListItem
            work_title={task.name}
            work_category_avatar={workCategoryAvatar}
            work_subject={category === "subject" ? null : all_subjects_map.get(task.subject)}
            work_status={workStatus}
            work_deadline={moment(task.deadline).locale("id").format("DD-MM-YYYY")}
            work_link={`/tugas-murid/${task._id}`}
          />
        )

      if(!category && result.length === 5)
        break;
      
      if(category==="subject" && result.length === 3)
        break;
    }

    return result;
    }
  }

  function listMaterials(category=null, subject={}){
    let materialList = []

    if(Boolean(selectedMaterials.length)) {
      let workCategoryAvatar = (
        <Avatar className={classes.material}>
          <MenuBookIcon/>
        </Avatar>
      )
      for(var i = selectedMaterials.length-1; i >= 0; i--){
        let material = selectedMaterials[i]
        if(!category || (category === "subject" && material.subject === subject._id)){
          materialList.push(
            <MaterialListitem
              work_title={material.name}
              work_category_avatar={workCategoryAvatar}
              work_subject={all_subjects_map.get(material.subject)}
              work_link={`/materi/${material._id}`}
            />
          )
        }

        if(!category && materialList.length ===  5) // item ke index tsb, brarti harus harus pas index ke selectedMaterials.length - 5.
          break;
        
        if(category==="subject" && materialList.length ===  3)// item ke index tsb, brarti harus harus pas index ke selectedMaterials.length - 5.
          break;

      }
      return materialList;
    }
  }

  

  React.useEffect(() => {
    setCurrentClass(classId)

    if (user.role === "Student") {
      getMaterial(user.kelas, "by_class")
      viewTask() // get the tasksCollection
    }
    getAllSubjects("map") // get the all_subjects_map in map
    getAllSubjects() // get the all_subjects
    getStudentsByClass(props.match.params.id) // get the students_by_class
    getTeachers("map") // get the all_teachers

    getAllTaskFilesByUser(user.id) // get the all_user_files
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const [value, setValue] = React.useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  console.log(selectedMaterials)
  document.title = !kelas.name ? "Schooly | Lihat Kelas" : `Schooly | ${kelas.name}`

  function student_role(id){
    switch(id){
      case kelas.ketua_kelas:
        return "Ketua Kelas"

      case kelas.bendahara:
        return "Bendahara"

      case kelas.sekretaris:
        return "Sekretaris"
      
      default:
        return null
    }
  }

  console.log(kelas, all_teachers, kelas.walikelas)
  return(
    <div className={classes.root}>
      {user.role === "Admin" || user.role === "Teacher" ?
      <div>
        <Paper square>
          <Typography variant="h3" align="center" style={{padding: "10px"}} gutterBottom>
            {kelas.name}
          </Typography>
        </Paper>
        <Paper style={{padding: "20px", marginBottom: "40px"}}>
          <Typography variant="h4" gutterBottom>
            Wali Kelas
          </Typography>
          <Divider className={classes.personListDivider} />
          <List className={classes.listContainer}>
            {all_teachers.get(kelas.walikelas) ?
            <PersonListItem
            person_avatar={
              `/api/upload/avatar/${all_teachers.get(kelas.walikelas).avatar}`}
            person_name={all_teachers.get(kelas.walikelas).name }
            person_role={all_teachers.get(kelas.walikelas).subject_teached}/> : null
            }

          </List>
        </Paper>
        <Paper style={{padding: "20px"}}>
          <Typography variant="h4" gutterBottom>
            Murid
          </Typography>
          <Divider className={classes.personListDivider} />
          <List className={classes.listContainer}>
            {students_by_class.map((student) => (
              <PersonListItem
                person_avatar={`/api/upload/avatar/${student.avatar}`}
                person_name={student.name}
                person_id={student._id}
                person_role={student_role(student._id)}
              />
            ))}
          </List>
        </Paper>
      </div>
      :
      <div>
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
                <ExpansionPanelSummary>
                  <Grid container justify="space-between" alignItems="center">
                    <Typography variant="h5">
                      Materi
                    </Typography>
                    <LightTooltip title="Lihat Semua" placement="right">
                      <Link to="/daftar-materi">
                        <IconButton
                          size="small"
                          className={classes.viewSubjectButton}
                        >
                        <PageviewIcon fontSize="small" />
                      </IconButton>
                      </Link>
                    </LightTooltip>
                  </Grid>
                </ExpansionPanelSummary>
                <Divider />
                <List className={classes.expansionPanelList}>
                  {listMaterials()}
                </List>
              </ExpansionPanel>
              <ExpansionPanel defaultExpanded>
              <ExpansionPanelSummary>
                <Grid container justify="space-between" alignItems="center">
                  <Typography variant="h5">
                    Tugas
                  </Typography>
                  <LightTooltip title="Lihat Semua" placement="right">
                    <Link to="/daftar-tugas">
                      <IconButton
                        size="small"
                        className={classes.viewSubjectButton}
                      >
                      <PageviewIcon fontSize="small" />
                    </IconButton>
                    </Link>
                  </LightTooltip>
                </Grid>
              </ExpansionPanelSummary>
              <Divider />
              <List className={classes.expansionPanelList}>
                {listTasks()}
                {/* {tasksByClass.map((task) => {
                  let workCategoryAvatar = (
                    <Avatar className={classes.assignmentLate}>
                      <AssignmentLateIcon/>
                    </Avatar>
                  )
                  let workStatus = "Belum Dikumpulkan"
                  for(var i = 0; i < all_user_files.length; i++) {
                    if (all_user_files[i].for_task_object === task._id) {
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
                      work_subject={all_subjects_map.get(task.subject)}
                      work_status={workStatus}
                      work_deadline={moment(task.deadline).locale("id").format("DD-MM-YYYY")}
                      work_link={`/tugas-murid/${task._id}`}
                    />
                  )
                })} */}
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
          {all_subjects.length === 0 ? null :
            all_subjects.map((subject) => {
              // let isEmpty = true
              return(
                <ExpansionPanel>
                  <ExpansionPanelSummary>
                    <Grid container justify="space-between" alignItems="center">
                      <Typography variant="h5">
                        {subject.name}
                      </Typography>
                      <LightTooltip title="Lihat Lebih Lanjut" placement="right">
                          <Link to={`/mata-pelajaran/${subject._id}`}>
                            <IconButton
                              size="small"
                              className={classes.viewSubjectButton}
                            >
                          <PageviewIcon fontSize="small" />
                        </IconButton>
                        </Link>
                      </LightTooltip>
                    </Grid>
                  </ExpansionPanelSummary>
                  <Divider className={classes.subjectDivider} />
                  <List className={classes.expansionPanelList}>
                  {listMaterials("subject", subject)}
                  {listTasks("subject", subject)}
                  </List>
                  </ExpansionPanel>
                  )
            })}
        </TabPanel>
        <TabPanel value={value} index={2}>
          <Paper style={{padding: "20px", marginBottom: "40px"}}>
            <Typography variant="h4" gutterBottom>
              Wali Kelas
            </Typography>
            <Divider className={classes.personListDivider} />
            <List className={classes.listContainer}>
              {!all_teachers.size || !all_teachers.get(kelas.walikelas) ? null :
              <PersonListItem
                person_avatar={`/api/upload/avatar/${all_teachers.get(kelas.walikelas).avatar}`}
                person_name={all_teachers.get(kelas.walikelas).name}
                person_role={all_teachers.get(kelas.walikelas).subject_teached}/>
              }
            </List>
          </Paper>
          <Paper style={{padding: "20px"}}>
            <Typography variant="h4" gutterBottom>
              Murid
            </Typography>
            <Divider className={classes.personListDivider} />
            <List className={classes.listContainer}>
              {students_by_class.map((student) => (
                <PersonListItem
                  person_avatar={`/api/upload/avatar/${student.avatar}`}
                  person_name={student.name}
                  person_role={student.role}
                />
              ))}
            </List>
          </Paper>
        </TabPanel>
      </div>
      }
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