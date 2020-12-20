import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import moment from "moment";
import { Link } from "react-router-dom";
import { getOneAssessment, gradeAssessment } from "../../../actions/AssessmentActions";
import { getStudents } from "../../../actions/UserActions";
import { getAllClass } from "../../../actions/ClassActions";
import { getAllSubjects } from "../../../actions/SubjectActions";
import LightTooltip from "../../misc/light-tooltip/LightTooltip";
import { Avatar, Box, Button, Divider, ExpansionPanel, ExpansionPanelSummary, 
  List, ListItem, ListItemAvatar, ListItemText, Paper, Snackbar, Tabs, Tab, TextField, Typography, Grid, Hidden, Menu, 
  MenuItem, TableSortLabel, IconButton, ListItemSecondaryAction, Fab } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import { RadioButtonChecked, CheckBox, TextFormat, Subject } from '@material-ui/icons';
import SortIcon from "@material-ui/icons/Sort";
import EditIcon from "@material-ui/icons/Edit";
import MuiAlert from "@material-ui/lab/Alert";

import { BsFlag } from 'react-icons/bs';
// ANCHOR import
// const path = require("path");



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
  // checkCircleIcon: {
  //   marginRight: "10px",
  //   backgroundColor: theme.palette.primary.main,
  //   color: "white",
  //   "&:focus, &:hover": {
  //     backgroundColor: "white",
  //     color: theme.palette.primary.main
  //   },
  // },
  editIcon: {
    marginRight: "10px",
    backgroundColor: theme.palette.primary.main,
    color: "white",
    "&:focus, &:hover": {
      backgroundColor: "white",
      color: theme.palette.primary.main
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
  startDateText: {
    color: theme.palette.primary.main
  },
  endDateText: {
    color: theme.palette.warning.main
  },
  content: {
    padding: "20px",
  },
  visuallyHidden: {
    border: 0,
    clip: "rect(0 0 0 0)",
    height: 1,
    margin: -1,
    overflow: "hidden",
    padding: 0,
    position: "absolute",
    top: 20,
    width: 1,
  },
  sortButton: {
    backgroundColor: theme.palette.action.selected,
    color: "black",
    "&:focus, &:hover": {
      backgroundColor: theme.palette.divider,
      color: "black",
    },
  },
  RadioQst: {
    '&$disabled': {
      boxShadow: theme.shadows[2],
      color: "white",
      backgroundColor: '#02AFF8'
    }
  },
  CheckboxQst: {
    '&$disabled': {
      boxShadow: theme.shadows[2],
      color: "white",
      backgroundColor: '#049F90'
    }
  },
  ShorttextQst: {
    '&$disabled': {
      boxShadow: theme.shadows[2],
      color: "white",
      backgroundColor: '#FD7D2E'
    }
  },
  LongtextQst: {
    '&$disabled': {
      boxShadow: theme.shadows[2],
      color: "white",
      backgroundColor: '#B2417C'
    }
  },
  disabled: {
    //(meskipun kosong, ini harus ditambahkan)
  },
  editFab: {
    marginRight: "10px",
    backgroundColor: theme.palette.primary.main,
    color: "white",
    "&:focus, &:hover": {
      backgroundColor: "white",
      color: theme.palette.primary.main,
    },
  },
  editIconDesktop: {
    width: theme.spacing(3),
    height: theme.spacing(3),
    marginRight: "7.5px",
  },
}));

// ANCHOR classes


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
  const {onGradeAssessment, student_id, grade, student_name} = props

  return (
    // <Button
    //   variant="contained"
    //   startIcon={<CheckCircleIcon/>}
    //   className={classes.checkCircleIcon}
    //   onClick={() => onGradeAssessment(student_id, student_name, grade)}
    // >
    //   Simpan
    // </Button>
    <Button
      variant="contained"
      startIcon={
          <EditIcon />
      }
      className={classes.editIcon}
      onClick={() => onGradeAssessment(student_id, student_name, grade)} // TODO ganti jadi link ke halaman viewanswer + state id murid
    >
      Periksa
    </Button>
  )
}

function SubmittedAssessmentList(props) {
  const classes = useStyles();

  const { getOneAssessment, getAllClass, getStudents, gradeAssessment, getAllSubjects } = props;
  const { all_subjects_map } = props.subjectsCollection;
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
    getAllSubjects("map")
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

  // Sort Menu
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("subject");
  const handleOpenSortMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleCloseSortMenu = () => {
    setAnchorEl(null);
  };
  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };
  const headCells = [
    { id: "studentName", numeric: false, disablePadding: true, label: "Nama Murid" }
    // { id: "assessmenttitle", numeric: false, disablePadding: true, label: "Nama Ujian/Kuis" },
    // { id: "subject", numeric: false, disablePadding: false, label: "Mata Pelajaran" },
    // { id: "start_date", numeric: false, disablePadding: false, label: "Mulai Waktu" },
    // { id: "end_date", numeric: false, disablePadding: false, label: "Batas Waktu" },
    // { id: "class_assigned", numeric: false, disablePadding: false, label: "Ditugaskan Pada" },
  ];
  function stableSort(array, comparator) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
      const order = comparator(a[0], b[0]);
      if (order !== 0) return order;
      return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
  }
  function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
      return -1;
    }
    if (b[orderBy] > a[orderBy]) {
      return 1;
    }
    return 0;
  }

  function getComparator(order, orderBy) {
    return order === "desc"
      ? (a, b) => descendingComparator(a, b, orderBy)
      : (a, b) => -descendingComparator(a, b, orderBy);
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
      // asumsi: jika selectedAssessments.class_assigned sudah ada, 
      // selectedAssessments pasti sudah ada sehingga selectedAssessments.question_weight juga pasti ada
      let weights = selectedAssessments.question_weight;
      let longtextWeights = weights.longtext;
      let longtextPtTotal = Object.values(longtextWeights).reduce((sum, currentVal) => { return (sum + currentVal) }); 

      for (var i = 0; i < selectedAssessments.class_assigned.length; i++) {
        let students_in_class = [];
        for (var j = 0; j < all_students.length; j++) {
          // check if the id of the class is the same or not (means student is inside)
          if (all_students[j].kelas === selectedAssessments.class_assigned[i]) {
            let student = all_students[j]
            // let student_task = all_students[j].tugas
            
            // REVIEW hitung nilai per murid
            if (selectedAssessments.submissions && selectedAssessments.submissions[student._id]) {
              let scores = {
                radioPt: null,
                radioPtTotal: null,
                checkboxPt: null,
                checkboxPtTotal: null,
                shorttextPt: null,
                shorttextPtTotal: null,
                longtextPt: null,
                longtextPtTotal: longtextPtTotal
              };              
              let longtextGrades = selectedAssessments.grades[student._id].longtext;
              


              // jika semua jawaban soal uraian sudah dinilai, tampilkan nilainya.
              // ini cukup karena asumsi: bobot setiap soal uraian sudah dipastikan ada.
              if (Object.keys(longtextGrades).length === Object.keys(longtextWeights).length) {
                scores.longtextPt = Object.values(longtextGrades).reduce((sum, currentVal) => { return (sum + currentVal) }); 
              } // jika tidak, tampilkan pesan belum dinilai

              for (let questionIdx = 0; questionIdx < selectedAssessments.questions.length; questionIdx++) {
                let types = new Set();
                
              }

              for (let questionIdx = 0; questionIdx < selectedAssessments.questions.length; questionIdx++) {
                let questionType = selectedAssessments.questions[questionIdx].type;
                let questionAnswer = selectedAssessments.questions[questionIdx].answer;
                let studentAnswer = selectedAssessments.submissions[student._id][questionIdx];

                if (studentAnswer) {
                  if (questionType === "radio") {
                    if (questionAnswer[0] === studentAnswer[0]) {
                      if (scores.radioPt === null) {
                        scores.radioPt = 1 * weights.radio;
                      } else {
                        scores.radioPt += 1 * weights.radio;
                      }
                    } else {
                      if (scores.radioPt === null) {
                        scores.radioPt = 0;
                      }
                    }

                    if (scores.radioPtTotal === null) {
                      scores.radioPtTotal = 1 * weights.radio;
                    } else {
                      scores.radioPtTotal += 1 * weights.radio;
                    }
                  } else if (questionType === "checkbox") {
                    let temp_correct = 0;

                    studentAnswer.forEach((answer) => {
                      if (questionAnswer.includes(answer)) {
                        temp_correct += 1;
                      }
                      else {
                        temp_correct -= 2;
                      }
                    });

                    if (temp_correct > 0) {
                      if (scores.checkboxPt === null) {
                        scores.checkboxPt = temp_correct / questionAnswer.length
                      } else {
                        scores.checkboxPt += temp_correct / questionAnswer.length
                      }
                    } else {
                      if (scores.checkboxPt === null) {
                        scores.checkboxPt = 0;
                      } // jika checkboxPt sudah ada, tidak ditambahkan apa-apa
                    }

                    if (scores.checkboxPtTotal === null) {
                      scores.checkboxPtTotal = 1 * weights.checkbox;
                    } else {
                      scores.checkboxPtTotal += 1 * weights.checkbox;
                    }
                  } else if (questionType === "shorttext") {
                    let temp_correct = 0;
                    for (let answerIdx = 0; answerIdx < questionAnswer.length; answerIdx++) {
                      if (questionAnswer[answerIdx] === studentAnswer[answerIdx]) {
                        temp_correct++;
                      }
                    }

                    if (scores.shorttextPt === null) {
                      scores.shorttextPt = temp_correct / questionAnswer.length
                    } else {
                      scores.shorttextPt += temp_correct / questionAnswer.length
                    }

                    if (scores.shorttextPtTotal === null) {
                      scores.shorttextPtTotal = 1 * weights.shorttext;
                    } else {
                      scores.shorttextPtTotal += 1 * weights.shorttext;
                    }
                  }
                } else {
                  if (questionType === "radio") {
                    if (scores.radioPt === null) {
                      scores.radioPt = 0;
                    }

                    if (scores.radioPtTotal === null) {
                      scores.radioPtTotal = 1 * weights.radio;
                    } else {
                      scores.radioPtTotal += 1 * weights.radio;
                    }
                  } else if (questionType === "checkbox") {
                    if (scores.checkboxPt === null) {
                      scores.checkboxPt = 0;
                    }

                    if (scores.checkboxPtTotal === null) {
                      scores.checkboxPtTotal = 1 * weights.radio;
                    } else {
                      scores.checkboxPtTotal += 1 * weights.radio;
                    }
                  } else if (questionType === "shorttext") {
                    if (scores.shorttextPt === null) {
                      scores.shorttextPt = 0;
                    }

                    if (scores.shorttextPtTotal === null) {
                      scores.shorttextPtTotal = 1 * weights.radio;
                    } else {
                      scores.shorttextPtTotal += 1 * weights.radio;
                    }
                  }
                }
               
              }
            }


            // console.log(student_task)
            // let task_list_on_panel = []
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
                  {/* <ListItemSecondaryAction>
                    <IconButton edge="end" aria-label="delete">
                        <EditIcon />
                    </IconButton>
                  </ListItemSecondaryAction> */}
                    <Typography>Total Nilai {selectedAssessments.grades[student._id]} <BsFlag /></Typography>
            </ListItem>
            </ExpansionPanelSummary>
            <Divider />
            {/* <List>*/}
            {/* ANCHOR ikon soal */}
                  <Grid container style={{padding: "20px"}} >

                  <Grid container xs={3} spacing='1' wrap="nowrap" direction='column' justify='space-between' alignItems='center' >
                    <Grid item>
                      <IconButton disabled classes={{ root: classes.RadioQst, disabled: classes.disabled }}>
                        <RadioButtonChecked />
                      </IconButton>
                    </Grid>
                    <Grid item>
                      <Typography align='center'>
                        <b>
                          Pilihan Ganda <br />(Satu Jawaban)
                        </b>
                      </Typography>
                    </Grid>
                    <Grid item>
                      <Typography>{4}/{10}</Typography>
                    </Grid>
                  </Grid>

                  <Divider orientation="vertical" flexItem />

                  <Grid container xs={3} spacing='1' wrap="nowrap" direction='column' justify='space-between' alignItems='center' >
                    <IconButton disabled classes={{ root: classes.CheckboxQst, disabled: classes.disabled }}>
                      <CheckBox />
                    </IconButton>
                    <Typography align='center' >
                      <b>
                        Pilihan Ganda <br />(Banyak Jawaban)
                        </b>
                    </Typography>
                    <Typography>{4}/{10}</Typography>
                  </Grid>

                  <Divider orientation="vertical" flexItem />

                  <Grid container xs={3} spacing='1' wrap="nowrap" direction='column' justify='space-between' alignItems='center' >
                    <IconButton disabled classes={{ root: classes.ShorttextQst, disabled: classes.disabled }}>
                      <TextFormat />
                    </IconButton>
                    <Typography align='center'>
                        <b>
                        Isian Pendek
                        </b>
                    </Typography>
                    <Typography>{4}/{10}</Typography>
                  </Grid>

                  <Divider orientation="vertical" flexItem />

                  <Grid container xs={3} spacing='1' wrap="nowrap" direction='column' justify='space-between' alignItems='center' >
                    <IconButton disabled classes={{ root: classes.LongtextQst, disabled: classes.disabled }}>
                      <Subject />
                    </IconButton>
                    <Typography align='center'>
                          <b>
                        Uraian
                        </b>
                    </Typography>
                    <Typography>{4}/{10}</Typography>
                  </Grid>

                  </Grid>
              {/* {task_list_on_panel} */}
            {/* </List> */}
            <Divider />
            <div className={classes.studentFileListContainer}>
                {(selectedAssessments && selectedAssessments.grades) ?
                selectedAssessments.grades[student._id] !== undefined ?
                  <div style={{display: "flex", justifyContent: "flex-end", alignItems: "center"}}>
                    {/* <div style={{marginRight: "20px", display: "flex", alignItems: "center"}}>
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
                    </div> */}
                    <GradeButton onGradeAssessment={onGradeAssessment} student_id={student._id} student_name ={student.name} grade={grade}/>
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
      <Paper >
        {/* <Typography variant="h4" style={{textAlign: "center"}} gutterBottom>
          <b>{selectedAssessments.name}</b>
        </Typography> */}
        
        {/* ------------------------------------------------------------------------------------------------ */}
        <Grid container spacing={2} className={classes.content}>
          <Grid item xs={12} md={7}>
            <Typography variant="h5" gutterBottom>
              <b>{selectedAssessments.name}</b>
            </Typography>
            <Typography variant="caption" color="textSecondary">
              <h6>Mata Pelajaran: {all_subjects_map.get(selectedAssessments.subject)}</h6>
            </Typography>
            <Typography color="primary" gutterBottom style={{marginTop: "20px"}}>
              Deskripsi Tugas:
            </Typography>
            <Typography>
              {selectedAssessments.description}
            </Typography>
          </Grid>
          <Grid item xs={12} md={5} spacing={2}>
            <Hidden mdUp implementation="css">
              <Typography variant="body2" className={classes.startDateText}>
                Waktu mulai kerja: {moment(selectedAssessments.start_date).locale("id").format("DD/MMMM/YYYY - HH.mm")}
              </Typography>
              <Typography variant="body2" className={classes.endDateText}>
                Batas waktu kerja: {moment(selectedAssessments.end_date).locale("id").format("DD/MMMM/YYYY - HH.mm")}
              </Typography>
              
              {/* <Typography variant="body2" color="textSecondary" style={{marginTop: "20px"}}>
                Nilai Maksimum: 100
              </Typography> */}
            </Hidden>
            <Hidden smDown implementation="css">
              {/* <Grid item> */}
                <Typography align="right" variant="body2" className={classes.startDateText}>
                  Waktu mulai kerja: {moment(selectedAssessments.start_date).locale("id").format("DD/MMMM/YYYY - HH.mm")}
                </Typography>
              {/* </Grid> */}
              {/* <Grid item> */}
                <Typography align="right" variant="body2" className={classes.endDateText}>
                  Batas waktu kerja: {moment(selectedAssessments.end_date).locale("id").format("DD/MMMM/YYYY - HH.mm")}
                </Typography>
              {/* </Grid> */}
              <Grid container item justify='flex-end' style={{ marginTop: "20px" }}>
                {/* <Typography align="right" variant="body2" color="textSecondary" style={{marginTop: "20px"}}>
                Nilai Maksimum: 100
              </Typography> */}

                {/* TODO ganti link jadi ke halaman viewanswer */}
                <Link to="/">
                  <Fab size="medium" variant="extended" className={classes.editFab}>
                    <EditIcon className={classes.editIconDesktop} />
                    Periksa
                  </Fab>
                </Link>

                <LightTooltip title="Urutkan Kuis">
                  <IconButton onClick={handleOpenSortMenu} className={classes.sortButton}>
                    <SortIcon />
                  </IconButton>
                </LightTooltip>
                <Menu
                  keepMounted
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleCloseSortMenu}
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "right",
                  }}
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "left",
                  }}
                >
                  {headCells.map((headCell, i) => (
                    <MenuItem
                      key={headCell.id}
                      sortDirection={orderBy === headCell.id ? order : false}
                    >
                      <TableSortLabel
                        active={orderBy === headCell.id}
                        direction={orderBy === headCell.id ? order : "asc"}
                        onClick={() => { handleRequestSort(headCell.id) }}
                      >
                        {headCell.label}
                        {orderBy === headCell.id ?
                          <span className={classes.visuallyHidden}>
                            {order === "desc" ? "sorted descending" : "sorted ascending"}
                          </span>
                          : null
                        }
                      </TableSortLabel>
                    </MenuItem>
                  ))}
                </Menu>
              </Grid>

              
             

            </Hidden>
          </Grid>
        </Grid>
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
  getAllSubjects: PropTypes.func.isRequired,
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
  mapStateToProps, { getOneAssessment, getAllClass, getStudents, gradeAssessment, getAllSubjects }
)(SubmittedAssessmentList);