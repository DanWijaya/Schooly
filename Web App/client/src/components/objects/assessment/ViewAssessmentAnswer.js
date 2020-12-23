import React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import moment from "moment";
import { getOneAssessment, deleteAssessment, updateAssessmentGrades } from "../../../actions/AssessmentActions"
import { getAllClass } from "../../../actions/ClassActions";
import { getStudents } from "../../../actions/UserActions";
import { getAllSubjects } from "../../../actions/SubjectActions";
import LightTooltip from "../../misc/light-tooltip/LightTooltip";
import { Fab, Grid, GridListTile, GridListTileBar, GridList, Hidden, Paper, Typography, Input, Snackbar, Divider, 
    IconButton, Tabs, Tab, Menu, MenuItem, Badge, Box, FormControl, Select, InputLabel, TextField, Button, Avatar} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import AssignmentIcon from "@material-ui/icons/Assignment";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import DeleteDialog from "../../misc/dialog/DeleteDialog";
import LinkIcon from '@material-ui/icons/Link';
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';
import SortIcon from '@material-ui/icons/Sort';
import BallotIcon from "@material-ui/icons/Ballot";
import SupervisorAccountIcon from "@material-ui/icons/SupervisorAccount";
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import ErrorIcon from '@material-ui/icons/Error';
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import ExploreIcon from '@material-ui/icons/Explore';
import MuiAlert from "@material-ui/lab/Alert";
// ANCHOR import

const useStyles = makeStyles((theme) => ({
  root: {
    margin: "auto",
    maxWidth: "1000px",
    padding: "10px",
  },
  content: {
    padding: "20px",
  },
  seeAllAssessmentButton: {
    backgroundColor: theme.palette.create.main,
    color: "white",
    "&:focus, &:hover": {
      backgroundColor: "white",
      color: theme.palette.create.main,
    },
  },
  editAssessmentButton: {
    backgroundColor: theme.palette.primary.main,
    color: "white",
    "&:focus, &:hover": {
      backgroundColor: "white",
      color: theme.palette.primary.main,
    },
  },
  deleteAssessmentButton: {
    backgroundColor: theme.palette.error.dark,
    color: "white",
    "&:focus, &:hover": {
      backgroundColor: "white",
      color: theme.palette.error.dark,
    },
  },
  copyToClipboardButton: {
    backgroundColor: "#974994",
    color: "white",
    "&:focus, &:hover": {
      backgroundColor: "#974994",
      color: "#white"
    },
  },
  dialogBox: {
    maxWidth: "350px",
    padding: "15px",
  },
  dialogDeleteButton: {
    width: "150px",
    backgroundColor: theme.palette.error.dark,
    color: "white",
    "&:focus, &:hover": {
      backgroundColor: theme.palette.error.dark,
      color: "white",
    },
  },
  dialogCancelButton: {
    width: "150px",
    backgroundColor: theme.palette.primary.main,
    color: "white",
    "&:focus, &:hover": {
      backgroundColor: theme.palette.primary.main,
      color: "white",
    },
  },
  startDateText: {
    color: theme.palette.primary.main
  },
  endDateText: {
    color: theme.palette.warning.main
  },
  answerText: {
    color: theme.palette.success.dark
  },
  optionText: {
    color: "black"
  },
  sortButton: {
    backgroundColor: theme.palette.action.selected,
    marginTop: "auto",
    marginBottom: "auto",
    color: "black",
    "&:focus, &:hover": {
      backgroundColor: theme.palette.divider,
      color: "black",
    },
  },
  perStudentSelect: {
      paddingTop: "10px",
      paddingBottom: "10px",
      marginBottom: "30px"
  },
  navigationHelpIcon: {
      fontSize: "10px",
      color: theme.palette.text.secondary,
      marginLeft: "5px"
  },
  selectDiv: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center"
  },
  select: {
      marginLeft: "10px",
      minWidth:"180px",
      maxWidth:"180px"
  },
  selectDescription: {
      display: "flex",
      justifyContent: "flex-end",
      alignItems: "center"
  },
  contentItem: {
      padding: "20px",
      marginBottom: "30px"
  },
  checkBadge: {
      color: theme.palette.success.dark
  },    
  warningBadge: {
      color: theme.palette.error.dark
  },
  saveButton: {
      backgroundColor: theme.palette.primary.main,
      color: "white",
      marginLeft: "10px",
      height: "80%",
      "&:focus, &:hover": {
        backgroundColor: theme.palette.primary.dark,
      },
  },
  mobileNav: {
      display: "flex", 
      flexDirection: "column", 
      alignItems: "center"
  },
  mobileNavButton: {
      color: theme.palette.text.secondary
  },
  questionPage: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "35px",
    height: "35px",
    "&:focus, &:hover": {
      backgroundColor: theme.palette.primary.main,
      color: "white",
      cursor: "pointer",
    },
  },
}));
// ANCHOR class

function ViewAssessmentTeacher(props) {
  const classes = useStyles();

  document.title = "Schooly | Buat Kuis";
  const assessment_id = props.match.params.id;

  const { getOneAssessment, getAllClass, getAllSubjects, deleteAssessment, getStudents } = props;
  const { all_classes_map } = props.classesCollection;
  const { all_subjects_map } = props.subjectsCollection;
  const { selectedAssessments } = props.assessmentsCollection;
  const { questions, type } = selectedAssessments;
  const { all_students } = props.auth;

  const [openDeleteDialog, setOpenDeleteDialog] = React.useState(null);
  const [selectedAssessmentId, setSelectedAssessmentId] = React.useState(null);
  const [selectedAssessmentName, setSelectedAssessmentName] = React.useState(null);
  const [all_student_object, setAllStudentObj] = React.useState(null);

  const [qnsIndex, setQnsIndex] = React.useState(0);
  const [longtextGrades, setLongtextGrades] = React.useState(null);
  // ANCHOR states

  // Tabs
  const [value, setValue] = React.useState(0);

  React.useEffect(() => {
    getOneAssessment(assessment_id)
    getAllClass("map")
    getAllSubjects("map")
    getStudents()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // ANCHOR useEffect
  React.useEffect(() => {    
    if (isAssessmentLoaded() && isAllStudentsLoaded()) {
      let students = {};

      for (var j = 0; j < all_students.length; j++) {
        if (selectedAssessments.class_assigned.includes(all_students[j].kelas)) {
          students[all_students[j]._id] = all_students[j];
        }
      }
      setAllStudentObj(students);
    }
  }, [all_students, selectedAssessments])
  
  React.useEffect(() => {
    if (isAssessmentLoaded() && all_student_object) {
      
      console.log(all_student_object);
      let ltGrade = {};
      Object.keys(all_student_object).forEach((studentId) => {
        if (selectedAssessments.grades[studentId]) {
          ltGrade[studentId] = selectedAssessments.grades[studentId].longtext_grades;
        } else {
          // jika semua jawaban uraian murid ini belum dinilai
          ltGrade[studentId] = {};
        }
      })
      setLongtextGrades(ltGrade);
    }
  }, [selectedAssessments, all_student_object])

  const onDeleteAssessment = (id) => {
    deleteAssessment(id)
  }

  // Delete Dialog
  const handleOpenDeleteDialog = (e, id, name) => {
    e.stopPropagation();
    setOpenDeleteDialog(true);
    setSelectedAssessmentId(id)
    setSelectedAssessmentName(name)
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
  };

  // Sort Menu
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleOpenSortMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseSortMenu = () => {
    setAnchorEl(null);
  };

  // Tabs
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
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

  const generateSoalShortTextTeacher = (qst, qstIndex) => {
    let splitResult = qst.name.split("`");
    let iterator = 0;

    for (let i = 1; i <= splitResult.length - 2; i += 2) {
      splitResult[i] = (
        <Input
          type="text"
          key={`${qstIndex}-${iterator}`}
          disabled={true}
          value={qst.answer[iterator]}
        />);
      iterator++;
    }
    
    return (
      <Typography variant="body1" gutterButtom>
        <form>
          {splitResult}
        </form>
      </Typography>
    ); 
  }

  const [snackbarContent, setSnackbarContent] = React.useState('');
  const [severity, setSeverity] = React.useState('info');
  const [openSnackbar, setOpenSnackbar] = React.useState(false);

  function handleOpenSnackbar(severity, content) {
    setOpenSnackbar(true);
    setSeverity(severity);
    setSnackbarContent(content);
  }

  function handleCloseSnackbar(event, reason) {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnackbar(false);
  }

  // ANCHOR fungsi generate Soal
  const generateQuestion = (number, question, weight) => {
    return (
        <Paper className={classes.contentItem}>
            <Typography align="center" variant="h6" style={{marginBottom: "10px"}}><b>{`Soal ${number}`}</b></Typography>
            <Typography align="justify">{`${question}`}</Typography>
            <Typography align="center" style={{marginTop: "15px"}} color="primary">{`Bobot : ${weight}`}</Typography>
        </Paper>
    )
  }

  // ANCHOR func handleGradeChange
  const handleGradeChange = (e, studentId) => {
    let temp = { ...longtextGrades};
    let grade = e.target.value; // masih dalam bentuk string, akan dikonversi menjadi angka pada saat klik tombol simpan
    temp[studentId] = { ...temp[studentId], [qnsIndex]: grade };
    console.log(temp);
    setLongtextGrades(temp);
  }

  // ANCHOR 
  const handleSaveGrade = (studentId) => {
    let temp = { ...longtextGrades };
    let grade = temp[studentId][qnsIndex];

    let numberGrade = Number(grade);

    if (isNaN(numberGrade) || numberGrade <= 0) {
      handleOpenSnackbar("error", "Nilai harus berupa angka dan tidak boleh kurang dari sama dengan 0")
    } else {
      temp[studentId] = { ...temp[studentId], [qnsIndex]: numberGrade };
      setLongtextGrades(temp);
      updateAssessmentGrades(assessment_id, studentId, qnsIndex, numberGrade).then(() => {
        handleOpenSnackbar("success", "Nilai berhasil diperbarui")
      }).catch((err) => {
        console.log(err);
        handleOpenSnackbar("error", "Nilai gagal diperbarui")
      });
    }
  }

  // ANCHOR fungsi jawaban murid
  const generateAllStudentAnswer = () => {
    let submissions = selectedAssessments.submissions;
    let question = selectedAssessments.questions[qnsIndex];
    let weights = selectedAssessments.question_weight;

    // traverse submission semua murid, (murid yang belum mengerjakan assessment ini tidak akan ditampilkan)
    return Object.entries(submissions).map((student) => {
    //  Object.entries(submissions).map((student) => {
      let studentId = student[0];
      let studentAnswer = student[1][qnsIndex];
      let studentInfo = all_student_object[studentId]; 
      // console.log(all_student_object);

      let studentClassName = all_classes_map.get(studentInfo.kelas).name;
      let questionWeight;

      let mark = 0;
      if (question.type === "longtext") {
        questionWeight = weights[question.type][qnsIndex];
      
        let longtextGrade = longtextGrades[studentId][qnsIndex]; // object
        if (longtextGrade) {
          // jika sudah pernah dinilai
          mark = longtextGrade;
        } else {
          // jika belum pernah dinilai
          mark = null;
        }

      } else {
        questionWeight = weights[question.type];

        if (studentAnswer.length !== 0) {
          // jika murid menjawab soal ini

          let questionAnswer = question.answer;

          if (question.type === "radio") {
            if (question[0] === studentAnswer[0]) {
              mark = 1 * weights.radio;
            }
          } else if (question.type === "checkbox") {
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
              mark = weights.checkbox * temp_correct / questionAnswer.length;
            }
          } else { // type === "shorttext"
            let temp_correct = 0;
            for (let answerIdx = 0; answerIdx < questionAnswer.length; answerIdx++) {
              if (questionAnswer[answerIdx] === studentAnswer[answerIdx]) {
                temp_correct++;
              }
            }

            mark = weights.shorttext * temp_correct / questionAnswer.length;
          }

        } // jika murid tidak menjawab soal ini, mark tetap 0
      
      }
      
      return (
        <GenerateQuestionPerQuestion
          questionNumber={qnsIndex}
          classes={classes}
          studentId={studentId}
          studentName={studentInfo.name}
          studentClass={studentClassName}
          studentAnswer={studentAnswer}
          studentMark={mark}
          questionType={question.type}
          questionWeight={questionWeight}
          handleGradeChange={handleGradeChange}
          handleSaveGrade={handleSaveGrade}
        />                    
      )
      // return generateQuestionPerQuestion(studentId, studentInfo.name, studentClassName, studentAnswer, mark, question.type, questionWeight);
    });
  }

  const generateQuestionandAnswerPerStudent = (number, question, weight, studentName, studentClass, studentAnswer, studentMark, answerChecked) => {
      return (
        <Badge 
            badgeContent={(answerChecked) ? <CheckCircleIcon className={classes.checkBadge} fontSize="large"/> :
                <ErrorIcon className={classes.warningBadge} fontSize="large"/>} variant="standard" style={{marginLeft: "4px"}}>
            <Paper className={classes.contentItem}>
                <Typography align="center" variant="h6" style={{marginBottom: "10px"}}><b>{`Soal ${number}`}</b></Typography>
                <Typography align="justify">{`${question}`}</Typography>
                <Typography align="center" style={{marginTop: "15px"}} color="primary">{`Bobot : ${weight}`}</Typography>
                <Divider style={{marginBottom: "15px", marginTop: "15px"}}/>
                <Typography variant="h6" style={{textDecoration: "underline", marginBottom: "10px"}}><b>Jawaban</b></Typography>
                <Typography align="justify">{`${studentAnswer}`}</Typography>
                <div style={{display: "flex", flexDirection: "row", justifyContent: "flex-end", alignItems: "center", marginTop: "25px"}}>
                    <Typography style={{marginTop: "5px", marginRight: "10px"}} color="textSecondary">Poin :</Typography>
                    <TextField
                        defaultValue={studentMark}
                        inputProps={{
                        style: {
                            borderBottom: "none",
                            boxShadow: "none",
                            margin: "0px",
                            width: "30px"
                        }
                        }}
                        InputProps={{
                            endAdornment: "/ 100",
                        }}
                    />
                    <div>
                        <Button className={classes.saveButton} size="small">SIMPAN</Button>
                    </div>
                </div>
            </Paper>   
        </Badge>
      )
  }

  // Ganti halaman Soal
  function QuestionPage(props) {
    const { classes, handleChangeQuestion, question_number, answer } = props;
    console.log(answer)
    return (
      <Grid item>
        <Badge
          badgeContent={(answer[question_number - 1].length > 0 && answer[question_number - 1].some((elm) => {return elm !== ""})) ?
              <Avatar style={{backgroundColor: "green", color: "white", width: "20px", height: "20px"}}>
                <CheckCircleIcon style={{width: "15px", height: "15px"}} />
              </Avatar>
            :
              <Avatar style={{backgroundColor: "red", color: "white", width: "20px", height: "20px"}}>
                <ErrorIcon style={{width: "15px", height: "15px"}} />
              </Avatar>
          }
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
        >
          <Paper
            buttons
            variant="outlined"
            className={classes.questionPage}
            onClick={() => handleChangeQuestion(question_number-1)}
          >
            <Typography>
              {question_number}
            </Typography>
          </Paper>
        </Badge>
      </Grid>
    )
  }

  let linkToShare = `http://${window.location.host}/kuis-murid/${assessment_id}`;

  function isAssessmentLoaded() {
    return (Object.keys(selectedAssessments).length !== 0);
  }
  function isAllStudentsLoaded() {
    return (all_students.length !== 0);
  }

  const handleChangeQuestion = (i) => {
    setQnsIndex(i)
  }

  // ANCHOR fungsi question page
  function QuestionPage(props) {
    const { classes, handleChangeQuestion, question_number, answer } = props;

    return (
      <Grid item>
        {/* TODO badge */}
        <Badge
          badgeContent={
            // (answer[question_number - 1].length > 0 && answer[question_number - 1].some((elm) => { return elm !== "" })) ?
            <Avatar style={{ backgroundColor: "green", color: "white", width: "20px", height: "20px" }}>
              <CheckCircleIcon style={{ width: "15px", height: "15px" }} />
            </Avatar>
            // :
            // <Avatar style={{ backgroundColor: "red", color: "white", width: "20px", height: "20px" }}>
            //   <ErrorIcon style={{ width: "15px", height: "15px" }} />
            // </Avatar>
          }
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
        >
          <Paper
            buttons
            variant="outlined"
            className={classes.questionPage}
            onClick={() => handleChangeQuestion(question_number - 1)}
          >
            <Typography>
              {question_number}
            </Typography>
          </Paper>
        </Badge>
      </Grid>
    )
  }

  return (
    <div className={classes.root}>
      {/* Ini Delete Dialog yang untuk delete Item yang udah ada */}
      <DeleteDialog
        openDeleteDialog={openDeleteDialog}
        handleCloseDeleteDialog={handleCloseDeleteDialog}
        itemType="Kuis"
        // deleteItem=""
        itemName={selectedAssessments.name}
        deleteItem={() => { onDeleteAssessment(selectedAssessmentId) }}
        />
        <Grid container direction="column" spacing={3}>
          <Grid item>
            <Paper className={classes.content}>
              <Grid container spacing={2}>
                <Grid item xs={12} md={7}>
                  <Typography variant="h5" gutterBottom>
                    <b>{selectedAssessments.name}</b>
                  </Typography>
                  <Typography variant="caption" color="textSecondary">
                    <h6>Mata Pelajaran: {all_subjects_map.get(selectedAssessments.subject)}</h6>
                  </Typography>
                  <Typography color="primary" gutterBottom style={{marginTop: "20px"}}>
                    Deskripsi Ujian/Kuis:
                  </Typography>
                  <Typography>
                    {selectedAssessments.description}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={5} spacing={2}>
                  <Hidden mdUp implementation="css">
                    <Typography variant="body2" className={classes.startDateText}>
                      Waktu mulai kerja: {moment(selectedAssessments.start_date).locale("id").format("DD MMM YYYY, HH:mm")}
                    </Typography>
                    <Typography variant="body2" className={classes.endDateText}>
                      Batas waktu kerja: {moment(selectedAssessments.end_date).locale("id").format("DD MMM YYYY, HH:mm")}
                    </Typography>
                  </Hidden>
                  <Hidden smDown implementation="css">
                    <Typography align="right" variant="body2" className={classes.startDateText}>
                      Waktu mulai kerja: {moment(selectedAssessments.start_date).locale("id").format("DD MMM YYYY, HH:mm")}
                    </Typography>
                    <Typography align="right" variant="body2" className={classes.endDateText}>
                      Batas waktu kerja: {moment(selectedAssessments.end_date).locale("id").format("DD MMM YYYY, HH:mm")}
                    </Typography>
                  </Hidden>
                </Grid>
              </Grid>
              <Grid container spacing={2}>
                <Grid item xs={12} md={12}>
                    <Divider/>
                </Grid>
              </Grid>
              <Grid container spacing={2}>
                <Hidden xsDown>
                <Grid item xs={12} md={2} style={{display: "flex", flexDirection: "row", marginTop: "10px"}}>
                    <Typography>Navigasi Soal :</Typography>
                    <LightTooltip title="Soal yang sudah diberi bobot dan nilai untuk semua murid akan diberi badge hijau. Soal akan diberi badge merah jika bobot atau nilai belum lengkap.">
                        <Badge badgeContent={<HelpOutlineIcon className={classes.navigationHelpIcon}/>} variant="standard" style={{marginLeft: "4px"}}>
                            {/* Hanya Sebagai Anchor */}
                            <Typography style={{display: "none"}}>:</Typography>                      
                        </Badge>
                    </LightTooltip>
                </Grid>
                  {/* ANCHOR elemen navigasi soal */}
                  <Grid container item md={12} spacing={2} alignItems="center">
                  {
                    (isAssessmentLoaded()) ? (
                      selectedAssessments.questions.map((qns, i) => { 
                        return (<QuestionPage classes={classes} question_number={i + 1} handleChangeQuestion={handleChangeQuestion} />) 
                      })
                    ) : (
                      null
                    )
                  }
                </Grid>
                </Hidden>
                <Hidden smUp>
                    <Grid item xs={12} md={2} style={{display: "flex", flexDirection: "row", marginTop: "10px", justifyContent: "space-between"}}>
                        <Button>
                            <div className={classes.mobileNav}>
                                <NavigateBeforeIcon className={classes.mobileNavButton}/>
                                <Typography variant="subtitle-2">Sebelum</Typography>
                            </div>
                        </Button>
                        <Button>
                            <div className={classes.mobileNav}>
                                <ExploreIcon className={classes.mobileNavButton}/>
                                <Typography variant="subtitle-2">Navigasi Soal</Typography>
                            </div>
                        </Button>
                        <Button>
                            <div className={classes.mobileNav}>
                                <NavigateNextIcon className={classes.mobileNavButton}/>
                                <Typography variant="subtitle-2">Sesudah</Typography>
                            </div>
                        </Button>
                    </Grid>
                </Hidden>
              </Grid>
              <Grid container spacing={2}>
                <Grid item xs={12} md={12}>
                    <Divider/>
                </Grid>
              </Grid>
              <Grid container spacing={2}>
                <Grid item xs={1} md={2}>
                    {null}
                </Grid>
                <Grid item xs={9} md={8}>
                    <Tabs
                    variant="fullWidth"
                    indicatorColor="primary"
                    textColor="primary"
                    value={value}
                    onChange={handleChange}
                    >
                        <Tab icon={<BallotIcon />} label="Per Soal" {...TabIndex(0)}/>
                        <Tab icon={<SupervisorAccountIcon />} label="Per Murid" {...TabIndex(1)}/>
                    </Tabs>
                </Grid>
                <Grid item xs={2} md={2} style={{display: "flex", justifyContent: "flex-end", alignItems: "flex-end", position: "relative"}}>
                    <LightTooltip title="Urutkan Tugas">
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
                        <MenuItem>Nama Kelas</MenuItem>
                        <MenuItem>Nama Murid</MenuItem>
                    </Menu>
                </Grid>
              </Grid>
            </Paper>
          <div hidden={value === 1} style={{padding: "24px"}}>
            {/* ANCHOR elemen soal */}
            {
              (isAssessmentLoaded()) ? (
                (selectedAssessments.questions[qnsIndex].type === "longtext") ? (
                  generateQuestion(
                    qnsIndex + 1,
                    selectedAssessments.questions[qnsIndex].name,
                    selectedAssessments.question_weight.longtext[qnsIndex]
                  )
                ) : (
                  generateQuestion(
                    qnsIndex + 1,
                    selectedAssessments.questions[qnsIndex].name,
                    selectedAssessments.question_weight[selectedAssessments.questions[qnsIndex].type]
                  )
                )
              ) : (
                null
              )
            }

            {
              (longtextGrades) ? (
                generateAllStudentAnswer()
              ) : (
                null
              )
            }
            </div>
          <div hidden={value === 0} style={{ padding: "24px" }}>
                <Paper className={classes.perStudentSelect}>
                    <div className={classes.selectDiv}>
                        <Grid container>
                            <Grid item xs={1} sm={3}></Grid>
                            <Grid item xs={3} sm={2} className={classes.selectDescription}>
                                <Typography>Nama Murid :</Typography>
                            </Grid>
                            <Grid item xs={6} sm={2}>
                                {/*<InputLabel id="kelas-label">Kelas</InputLabel>*/}
                                <Select
                                    labelId="kelas-label"
                                    id="kelas"
                                    className={classes.select}
                                    variant="outlined"
                                >
                                    <option value={10}>Ten</option>
                                </Select>
                            </Grid>
                            <Grid item xs={2} sm={5}></Grid>
                        </Grid>
                    </div>
                    <div className={classes.selectDiv} style={{marginTop: "10px"}}>
                        <Grid container>
                            <Grid item xs={1} sm={3}></Grid>
                            <Grid item xs={3} sm={2} className={classes.selectDescription}>
                                <Typography>Kelas :</Typography>
                            </Grid>
                            <Grid item xs={6} sm={2}>
                                {/*<InputLabel id="kelas-label">Kelas</InputLabel>*/}
                                <Select
                                    labelId="kelas-label"
                                    id="kelas"
                                    className={classes.select}
                                    variant="outlined"
                                >
                                    <option value={10}>Ten</option>
                                </Select>
                            </Grid>
                            <Grid item xs={2} sm={5}></Grid>
                        </Grid>
                    </div>
                </Paper>
            </div>
          </Grid>
          {/* {!Array.isArray(questions) ? null :
          questions.map((question, i) => (
            <Grid item>
              <Paper>
                <Grid container direction="column" spacing={2} className={classes.content}>
                  <Grid item>
                    <Typography variant="h6" gutterBottom color="primary">
                      Soal {i+1}
                    </Typography>
                    <GridList cols={3} cellHeight={300} style={{margin: "10px 0px 10px 0px"}}>
                      {question.lampiran.map((image, i) =>
                        <GridListTile key={image} cols={1} >
                        <img alt="current img" src={`/api/upload/att_assessment/${image}`}/>
                        <GridListTileBar
                            title={`Gambar ${i+1}`}
                            titlePosition="top"
                            actionPosition="right"/>
                      </GridListTile>
                      )}
                    </GridList>
                    <Typography variant="h6">
                      {
                        (question.type === "shorttext") ? (
                          generateSoalShortTextTeacher(question, i)
                        ) : (question.type === "longtext") ? (
                          <Typography variant="body1" gutterButtom>
                            {question.name}
                          </Typography>
                        ) : (
                          <Typography variant="h5" gutterButtom>
                            <b>{question.name}</b>
                          </Typography>
                        )
                      }
                    </Typography>
                  </Grid>
                  <Grid item>
                    {(question.type === "radio") ? (
                      question.options.map((option, i) => (
                        <Typography className={question.answer[0] === String.fromCharCode(97 + i).toUpperCase() ? classes.answerText : classes.optionText}>
                          {option}
                        </Typography>
                      ))
                    ) : (question.type === "checkbox") ? (
                      question.options.map((option, i) => (
                        <Typography className={question.answer.includes(String.fromCharCode(97 + i).toUpperCase()) ? classes.answerText : classes.optionText}>
                          {option}
                        </Typography>
                      ))
                    ) : ( // question.type === "shorttext" || question.type === "shorttext" 
                      null
                    )
                    }
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
          ))} */}
        </Grid>
        <Snackbar open={openSnackbar} autoHideDuration={3000} onClose={(event, reason) => { handleCloseSnackbar(event, reason) }}>
          <MuiAlert severity={severity} onClose={(event, reason) => { handleCloseSnackbar(event, reason) }}>
          {snackbarContent}
          </MuiAlert>
        </Snackbar>
    </div>
  )
};

// ANCHOR
function GenerateQuestionPerQuestion(props) {
  const { classes, studentId, studentName, studentClass, studentAnswer, studentMark, questionType, questionWeight, questionNumber } = props;
  const { handleGradeChange, handleSaveGrade } = props;

    return (
      // <Paper className={classes.contentItem}>
      <Paper style={{ width: "100%", marginBottom: "30px" }}>
        <Badge
          variant="standard"
          style={{ marginLeft: "4px", width: "100%" }}
          badgeContent={
            (studentMark === null) ? (
              <ErrorIcon className={classes.warningBadge} fontSize="large" />
            ) : (
              <CheckCircleIcon className={classes.checkBadge} fontSize="large" />
            )
          }
        >
          <Grid container item xs={12} style={{ padding: "20px" }}>
            <Grid item xs={12}>
              <Typography variant="h6"><b>{`${studentName}`}</b></Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle-1" color="textSecondary">{`${studentClass}`}</Typography>
            </Grid>
            <Grid item xs={12}>
              <Divider style={{ marginBottom: "10px", marginTop: "10px" }} />
            </Grid>
            <Grid item xs={12}>
              <Typography align="justify">{(studentAnswer[0]) ? `${studentAnswer[0]}` : "Tidak menjawab"}</Typography>
            </Grid>

            <Grid container item justify="flex-end" alignItems="center" style={{ marginTop: "25px" }}>
              {/* <div style={{ display: "flex", flexDirection: "row", justifyContent: "flex-end", alignItems: "center", marginTop: "25px" }}> */}
              <Typography style={{ marginTop: "5px", marginRight: "10px" }} color="textSecondary">Poin :</Typography>
              <TextField
                defaultValue={studentMark}
                inputProps={{
                  style: {
                    borderBottom: "none",
                    boxShadow: "none",
                    margin: "0px",
                    width: "30px"
                  }
                }}
                InputProps={{
                  endAdornment: `/ ${questionWeight}`,
                }}
                onChange={(e) => { handleGradeChange(e, studentId) }}
              />
              <div>
                <Button
                  className={classes.saveButton}
                  size="small"
                  onClick={() => { handleSaveGrade(studentId) }}
                >
                  SIMPAN
                  </Button>
              </div>
              {/* </div> */}
            </Grid>
          </Grid>
        </Badge>
      </Paper>
      // </Badge>
    )

  // } else {
    // TODO tipe soal selain uraian
    return null;
  // }
}

ViewAssessmentTeacher.propTypes = {
  auth: PropTypes.object.isRequired,
  assessmentsCollection: PropTypes.object.isRequired,
  subjectsCollection: PropTypes.object.isRequired,
  getOneAssessment: PropTypes.func.isRequired,
  getAllClass: PropTypes.func.isRequired,
  getAllSubjects: PropTypes.func.isRequired,
  deleteAssessment: PropTypes.func.isRequired,
  getStudents: PropTypes.func.isRequired,
}

const mapStateToProps = (state) => ({
  auth: state.auth,
  assessmentsCollection: state.assessmentsCollection,
  subjectsCollection: state.subjectsCollection,
  classesCollection: state.classesCollection
})

export default connect(
  mapStateToProps, { getOneAssessment, deleteAssessment, getAllClass, getAllSubjects, getStudents }
)(ViewAssessmentTeacher);