import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { getOneAssessment, gradeAssessment } from "../../../actions/AssessmentActions";
import { getStudents } from "../../../actions/UserActions";
import { getAllClass } from "../../../actions/ClassActions";
import { Avatar, Box, Button, Divider, ExpansionPanel, ExpansionPanelSummary, IconButton,
   List, ListItem, ListItemAvatar, ListItemIcon, ListItemText, Paper, Snackbar, Tabs, Tab, TextField, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import CloudDownloadIcon from "@material-ui/icons/CloudDownload";
import GetAppIcon from "@material-ui/icons/GetApp";
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import MuiAlert from "@material-ui/lab/Alert";

const path = require("path");

const useStyles = makeStyles((theme) => ({
  root: {
    margin: "auto",
    maxWidth: "1000px",
    padding: "10px",
  },
  studentFileListContainer: {
    margin: "20px",
  },
  personListContainer: {
    display: "flex",
    alignItems: "center",
    padding: "5px",
  },
  listItemPaper: {
    marginBottom: "10px"
  },
  listItem: {
    "&:focus, &:hover": {
      backgroundColor: theme.palette.button.main,
    },
  },
  checkCircleIcon: {
    marginRight: "10px",
    backgroundColor: theme.palette.create.main,
    color: "white",
    "&:focus, &:hover": {
      backgroundColor: "white",
      color: theme.palette.create.main
    },
  },
  downloadAllButton: {
    backgroundColor: theme.palette.primary.main,
    color: "white",
    "&:focus, &:hover": {
      backgroundColor: "white",
      color: theme.palette.primary.main
    }
  },
  downloadIconButton: {
    marginLeft: "5px",
    backgroundColor: theme.palette.primary.main,
    color: "white",
    "&:focus, &:hover": {
      backgroundColor: "white",
      color: theme.palette.primary.main,
    },
  },
  wordFileTypeIcon: {
    backgroundColor: "#16B0DD",
  },
  excelFileTypeIcon: {
    backgroundColor: "#68C74F",
  },
  imageFileTypeIcon: {
    backgroundColor: "#974994",
  },
  pdfFileTypeIcon: {
    backgroundColor: "#E43B37",
  },
  textFileTypeIcon: {
    backgroundColor: "#F7BC24",
  },
  presentationFileTypeIcon: {
    backgroundColor: "#FD931D",
  },
  otherFileTypeIcon: {
    backgroundColor: "#808080",
  },
}));

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

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

function GradeButton(props) {
  const classes = useStyles()
  const {onGradeAssessment, assessment_id, student_id, grade, student_name} = props

  return (
    <Button
      variant="contained"
      startIcon={<CheckCircleIcon/>}
      className={classes.checkCircleIcon}
      onClick={() => onGradeAssessment(student_id, student_name, grade)}
    >
      Simpan
    </Button>
  )
}

function SubmittedAssessmentList(props) {
  const classes = useStyles();

  const { getOneAssessment, getAllClass, assessmentsCollection, getStudents, gradeAssessment } = props;
  const { selectedAssessments } = props.assessmentsCollection;
  const { all_classes } = props.classesCollection;
  const { all_students } = props.auth;
  const assessment_id = props.match.params.id;

  const [grade, setGrade] = React.useState(new Map());
  const [gradeStatus, setGradeStatus] = React.useState(new Map());
  const [openAlert, setOpenAlert] = React.useState(null);
  const [gradedStudentId, setGradedStudentId] = React.useState(null);
  const [gradedStudentName, setGradedStudentName] = React.useState("");
  const [value, setValue] = React.useState(0);

  React.useEffect(() => {
    getOneAssessment(assessment_id)
    getStudents()
    getAllClass()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleOpenAlert = (id, name) => {
    setOpenAlert(true);
    setGradedStudentId(id) 
    setGradedStudentName(name)
  }

  const handleCloseAlert = (e, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenAlert(false);
  }

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleChangeGrade = (e, id) => {
    let gradeMap = grade
    gradeMap.set(id, e.target.value);
    setGrade(gradeMap)
  };

  let temp = new Map()
  if (all_classes.length) {
    all_classes.map((kelas) => temp.set(kelas._id, kelas))
  }

  const onGradeAssessment = (studentId, studentName, grade) => {
    let gradingData = {
      grade: parseFloat(grade.get(studentId)),
      studentId: studentId
    }
    let gradeStatusMap = gradeStatus

    if (grade.has(studentId)) {
      gradeStatusMap.set(studentId, "Graded")
      setGradeStatus(gradeStatusMap)
      return( new Promise((resolve, reject) => {
        gradeAssessment(assessment_id, gradingData, resolve);
      })
      ).then(() => handleOpenAlert(studentId, studentName))
      
    }
  }

  const listClassTab = () => {
    let class_assigned = []
    if (!selectedAssessments.class_assigned) {
      return null;
    }
    else {
      if (temp.size) {
        for (var i = 0; i < selectedAssessments.class_assigned.length; i++) {
          class_assigned.push(<Tab label={!temp.get(selectedAssessments.class_assigned[i]) ? null : temp.get(selectedAssessments.class_assigned[i]).name} {...TabIndex(i)}/>)
        }
        return (
          <Tabs
            value={value}
            variant="scrollable"
            onChange={handleChange}
            indicatorColor="primary"
            textColor="primary">
            {class_assigned}
          </Tabs>
        )
      }
    }
  }

  const listClassTabPanel = () => {
    let TabPanelList = []
    if (!selectedAssessments.class_assigned || !all_students) {
      return null
    }
    else {
      for (var i = 0; i < selectedAssessments.class_assigned.length; i++) {
        let students_in_class = [];
        for (var j = 0; j < all_students.length; j++) {
          // check if the id of the class is the same or not (means student is inside)
          if (all_students[j].kelas === selectedAssessments.class_assigned[i]) {
            let student = all_students[j]
            let student_task = all_students[j].tugas
            console.log(student_task)
            let task_list_on_panel = []
            students_in_class.push(
              <ExpansionPanel>
              <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
              <ListItem className={classes.personListContainer}>
                <ListItemAvatar>
                  {!student.avatar ? <Avatar style={{marginRight: "10px"}}/> :
                  <Avatar src={`/api/upload/avatar/${student.avatar}`} style={{marginRight: "10px"}}/>}
                </ListItemAvatar>
                <ListItemText primary={<Typography variant="h6">{student.name}</Typography>}
                 secondary={!selectedAssessments.grades ? "Belum Dinilai" : !gradeStatus.has(student._id) && selectedAssessments.grades[student._id] === undefined ? "Belum Dinilai" : "Telah Dinilai"}/>
            </ListItem>
            </ExpansionPanelSummary>
             <Divider />
             <div className={classes.studentFileListContainer}>
              <List>
                {task_list_on_panel}
              </List>
              {selectedAssessments ? 
                selectedAssessments.grades[student._id] !== undefined ?
                  <div style={{display: "flex", justifyContent: "flex-end", alignItems: "center"}}>
                    <div style={{marginRight: "20px", display: "flex", alignItems: "center"}}>
                      <TextField
                        defaultValue={grade.has(student._id) || selectedAssessments.grades === null ? grade.get(student._id) : selectedAssessments.grades[student._id]}
                        onChange={(e) => {handleChangeGrade(e, student._id)}}
                        inputProps={{
                          style: {
                            borderBottom: "none",
                            boxShadow: "none",
                            margin: "0px",
                            width: "35px"
                          }
                        }}
                        InputProps={{
                          endAdornment: "/ 100"
                        }}
                      />
                    </div>
                    <GradeButton onGradeAssessment={onGradeAssessment} assessment_id={assessment_id} student_id={student._id} student_name ={student.name} grade={grade}/>
                  <div>
                  </div>
                </div> 
                : 
                null
                :
                null
              }
            </div>
             </ExpansionPanel>
            )
          }
        }
        TabPanelList.push(
        <TabPanel value={value} index={i}>
          {students_in_class}
        </TabPanel>
      )
    }
  }
    return selectedAssessments.class_assigned.length > 0 ? TabPanelList : null;
  }

  document.title = "Schooly | Daftar Tugas Terkumpul"
  return (
    <div className={classes.root}>
      <Snackbar
        open={openAlert}
        autoHideDuration={4000}
        onClose={handleCloseAlert}
        anchorOrigin={{vertical : "center", horizontal: "center"}}
      >
        <Alert onClose={handleCloseAlert} severity="success" >
          Nilai {gradedStudentName.length <= 15 ? gradedStudentName : `${gradedStudentName.slice(0,15)}...`} berhasil diganti menjadi {grade.get(gradedStudentId)}
        </Alert>
      </Snackbar>
      <Paper>
        <Typography variant="h4" style={{textAlign: "center"}} gutterBottom>
          <b>{selectedAssessments.name}</b>
        </Typography>
          {listClassTab()}
      </Paper>
      {listClassTabPanel()}
    </div>
  )
};

SubmittedAssessmentList.propTypes = {
  auth: PropTypes.object.isRequired,
  assessmentsCollection: PropTypes.object.isRequired,
  subjectsCollection: PropTypes.object.isRequired,
  getOneAssessment: PropTypes.func.isRequired,
  gradeAssessment: PropTypes.func.isRequired,
  getAllClass: PropTypes.func.isRequired,
  getStudents: PropTypes.func.isRequired,
  deleteAssessment: PropTypes.func.isRequired
}

const mapStateToProps = (state) => ({
  auth: state.auth,
  assessmentsCollection: state.assessmentsCollection,
  subjectsCollection: state.subjectsCollection,
  classesCollection: state.classesCollection
})

export default connect(
  mapStateToProps, { getOneAssessment, getAllClass, getStudents, gradeAssessment}
)(SubmittedAssessmentList);