import React from "react";
import { Link, useLocation } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import moment from "moment";
import { getOneAssessment, deleteAssessment, updateAssessmentGrades } from "../../../actions/AssessmentActions"
import { getAllClass } from "../../../actions/ClassActions";
import { getStudents } from "../../../actions/UserActions";
import { getAllSubjects } from "../../../actions/SubjectActions";
import LightTooltip from "../../misc/light-tooltip/LightTooltip";
import { Fab, Grid, GridListTile, GridListTileBar, GridList, Hidden, Paper, Typography, Input, Snackbar, Divider, 
  IconButton, Tabs, Tab, Menu, MenuItem, Badge, Box, FormControl, Select, InputLabel, TextField, Button, Avatar, 
  RadioGroup, Radio, Checkbox, FormGroup, FormControlLabel, InputAdornment, TableSortLabel} from "@material-ui/core";
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

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
      maxWidth:"180px",
      [theme.breakpoints.down("xs")]: {
        minWidth: "100px",
        maxWidth: "100px",
      }
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
}));
// ANCHOR class

function ViewAssessmentTeacher(props) {
  const classes = useStyles();
  const location = useLocation();

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

  // object yang berisi semua murid yang menerima assessment ini, baik yang sudah mengerjakan maupun belum.
  // (pengaruhnya ke bagian mana?) karena assessment pasti diberikan ke minimal 1 kelas, isi all_student_object tidak mungkin kosong.
  const [all_student_object, setAllStudentObj] = React.useState(null);

  const [qnsIndex, setQnsIndex] = React.useState(0);

  // object yang berisi pasangan: id murid - object grade
  // object grade berisi pasangan: index soal uraian - nilai , soal uraian yang belum dinilai tidak disimpan di object ini
  // kalau assessment ini tidak punya soal uraian, state ini akan diset menjadi null
  const [longtextGrades, setLongtextGrades] = React.useState(undefined);

  // berisi object yang memiliki 2 pasangan: 
  // 1. "studentOptions" dengan value object. 
  // Ada 1 pasangan pada object ini dengan key "combined" dan value berupa array yang berisi 
  // semua murid dari semua kelas yang menerima assessment ini. 
  // Object value ini juga berisi pasangan: id kelas (kelas-kelas yang menerima assessment ini) - array.
  // Array ini berisi semua murid yang berada pada kelas tersebut.
  // Bentuk elemen array ini adalah object yang memiliki atribut id dan nama.
  // 2. "classOptions" dengan value berupa array yang berisi semua kelas yang menerima assessment ini.
  // Bentuk elemen array ini adalah object yang memiliki atribut id dan nama.
  const [menuOption, setMenuOption ] = React.useState(null);
  
  // berisi id kelas yang sedang dipilih pada menu kelas 
  const [selectedClass, setSelectedClass] = React.useState(null);
  // const [selectedClass, setSelectedClass] = React.useState("5f4760f98dccb3468ccc0ffc"); //dev

  // berisi id murid yang sedang dipilih pada menu murid
  const [selectedStudent, setSelectedStudent] = React.useState(null);
  // const [selectedStudent, setSelectedStudent] = React.useState("5f44d55155cedc284824f5c1"); //dev

  // jika belum diload, bernilai null. jika sudah diproses, nilainya pasti false atau true
  const hasLongtextQst = React.useRef(null);

  const questionCount = React.useRef(null);

  // Tabs
  const [value, setValue] = React.useState(0);
  // const [value, setValue] = React.useState(1); //dev

  // ANCHOR useffect
  React.useEffect(() => {
    getOneAssessment(assessment_id)
    getAllClass("map")
    getAllSubjects("map")
    getStudents() 

    if (location.state) {
      setSelectedStudent(location.state.studentId);
      setSelectedClass(location.state.classId);

      //set ke tab "per murid"
      setValue(1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  React.useEffect(() => {
    if (isAssessmentLoaded()) {
      hasLongtextQst.current = false;
      questionCount.current = 0;
      for (let question of selectedAssessments.questions) {
        if (question.type === "longtext") {
          hasLongtextQst.current = true;
        }
        questionCount.current++;
      }
    }
  }, [selectedAssessments])

  React.useEffect(() => {    
    if (isAssessmentLoaded() && isAllStudentsLoaded() && isAllClassMapEmpty()) {
      let students = {};
      let classOptions = [];
      let studentOptions = {combined : []};
      
      for (let classId of selectedAssessments.class_assigned) {
        classOptions.push({ id: classId, name: all_classes_map.get(classId).name});
        studentOptions[classId] = [];
      }
      
      if (selectedAssessments.submissions) {
        let submittedStudentList = Object.keys(selectedAssessments.submissions);
        for (var j = 0; j < all_students.length; j++) {
          // jika kelas murid diberikan assessment ini 
          let std = all_students[j];
          if (selectedAssessments.class_assigned.includes(std.kelas)) {
            students[std._id] = std;

            // jika murid sudah mengerjakan assessment ini, masukan ke pilihan menu
            if (submittedStudentList.includes(std._id)) {
              studentOptions[std.kelas].push({ id: std._id, name: std.name });
              studentOptions.combined.push({ id: std._id, name: std.name });
            }
          }
        }
      }

      let options = { classOptions, studentOptions };
      setMenuOption(options);
      setAllStudentObj(students);
    }
  }, [all_students, selectedAssessments, all_classes_map])
  
  React.useEffect(() => {
    if (isAssessmentLoaded() && all_student_object) {
      if (hasLongtextQst.current === true) {

        let ltGrade = {};
        
        // jika minimal ada 1 murid yang jawaban uraiannya sudah dinilai,
        if (selectedAssessments.grades) {

          Object.keys(all_student_object).forEach((studentId) => {

            // jika jawaban uraian murid ini sudah pernah dinilai
            if (selectedAssessments.grades[studentId]) {
              ltGrade[studentId] = selectedAssessments.grades[studentId].longtext_grades;
            } else {
              // jika semua jawaban uraian murid ini belum dinilai atau murid belum mengerjakan assessment ini,
              ltGrade[studentId] = {};
            }
          });
        } // jika belum ada satupun murid yang jawaban uraiannya sudah dinilai, longtextGrades akan diisi object kosong {}
        
        setLongtextGrades(ltGrade);
      } else {
        // jika tidak ada soal uraian, set null
        setLongtextGrades(null);
      }
    } 
  }, [selectedAssessments, all_student_object, hasLongtextQst.current])

  // ANCHOR Sort Menu
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [order, setOrder] = React.useState("desc");
  const [orderBy, setOrderBy] = React.useState("name");
  const rows = React.useRef([]);

  React.useEffect(() => {
    if (isAssessmentLoaded() && all_student_object) {
      if (selectedAssessments.submissions) {
        rows.current = Object.keys(selectedAssessments.submissions).map((studentId) => {
          return { id: studentId, name: all_student_object[studentId].name, classname: all_student_object[studentId].kelas }
        });
      } else {
        rows.current = [];
      }
    }
  }, [selectedAssessments, all_student_object])

  // function createData(_id, name) {
  //   return { _id, name };
  // }
  // const assessmentRowItem = (data) => {
  //   let newRows = rows.current;
  //   newRows.push(
  //     createData(
  //       data._id,
  //       data.name,
  //     )
  //   )

  //   rows.current = newRows;
  // }
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
    { id: "name", numeric: false, disablePadding: true, label: "Nama Murid" },
    { id: "classname", numeric: false, disablePadding: true, label: "Nama Kelas" }
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
  const generateQuestion = (questionNumber, questionWeight, questionInfo) => {
    let questionType = questionInfo.type;
    let questionName = questionInfo.name;
    let questionAnswer = questionInfo.answer;
    let questionOptions = questionInfo.options;

    let content;
    if (questionType === "longtext") {
      content = (
        <div>
          <Typography align="center" variant="h6" style={{ marginBottom: "10px" }}><b>{`Soal ${questionNumber}`}</b></Typography>
          <Typography align="justify">{`${questionName}`}</Typography>
          <Typography align="center" style={{ marginTop: "15px" }} color="primary">{`Bobot : ${questionWeight}`}</Typography>
        </div>
      );
    } else if (questionType === "shorttext") {
      let splitResult = questionName.split("`");
      let iterator = 0;

      for (let i = 1; i <= splitResult.length - 2; i += 2) {
        splitResult[i] = (
          <Input
            type="text"
            key={`${questionNumber}-${iterator}`}
            disabled={true}
            value={questionAnswer[iterator]}
          />);
        iterator++;
      }

      content = (
        <Grid item>
          <Typography align="center" variant="h6" style={{ marginBottom: "10px" }}><b>{`Soal ${questionNumber}`}</b></Typography>
          <Typography align="justify">
            <form>
              {splitResult}
            </form>
          </Typography>
          <Typography align="center" style={{ marginTop: "15px" }} color="primary">{`Bobot : ${questionWeight}`}</Typography>
        </Grid>
      );
    } else {
      let answer;
      if (questionType === "radio") {
        answer = (
          <Grid item>
            <Typography align="justify">{`${questionName}`}</Typography>
            <RadioGroup value={questionAnswer[0]}>
              {questionOptions.map((option, i) =>
                <div style={{ display: "flex" }}>
                  <FormControlLabel
                    disabled
                    style={{ width: "100%" }}
                    value={String.fromCharCode(97 + i).toUpperCase()}
                    control={<Radio color="primary" />}
                    label={option}
                  />
                </div>
              )}
            </RadioGroup>
          </Grid>
        );
      } else { // type = checkbox
        answer = (
          <Grid item>
            {/* <Typography align="left" variant="h6" style={{ marginBottom: "10px" }}><b>{`Soal ${questionNumber}`}</b></Typography> */}
            <Typography align="justify">{`${questionName}`}</Typography>
            <FormGroup>
              {questionOptions.map((option, i) =>
                <div style={{ display: "flex" }}>
                  <FormControlLabel
                    disabled
                    style={{ width: "100%" }}
                    value={String.fromCharCode(97 + i).toUpperCase()}
                    label={option}
                    control={
                      <Checkbox
                        checked={questionAnswer.includes(String.fromCharCode(97 + i).toUpperCase())}
                        color="primary"
                      />
                    }
                  />
                </div>
              )}
            </FormGroup>
          </Grid>
        );
      }

      content = [
        <Hidden smDown>
          <Grid container>
            <Grid item xs={12}>
              <Typography align="center" variant="h6" style={{ marginBottom: "10px" }}><b>{`Soal ${questionNumber}`}</b></Typography>
            </Grid>
            <Grid item xs={9}>
              {answer}
            </Grid>

            <Grid item>
              <Divider orientation="vertical" style={{ marginLeft: "10px", marginRight: "10px" }} />
            </Grid>

            <Grid item wrap="nowrap" direction="column" justify="center" alignItems="center" style={{ display: "flex", flexGrow: "1" }}>
              <Grid item>
                <Typography align="center" color="primary">Kunci Jawaban : {questionAnswer.join(", ")}</Typography>
              </Grid>
              <Grid container item justify="center" alignItems="center">
                <Typography style={{ marginTop: "5px", marginRight: "10px" }} color="primary">{`Bobot : ${questionWeight}`}</Typography>
              </Grid>
            </Grid>
          </Grid>
        </Hidden>,
        <Hidden mdUp>
          <Grid container>
            <Grid item xs={12}>
              <Typography align="center" variant="h6" style={{ marginBottom: "10px" }}><b>{`Soal ${questionNumber}`}</b></Typography>
            </Grid>
            <Grid item xs={12}>
              {answer}
            </Grid>

            <Grid item xs={12} wrap="nowrap" direction="column" justify="center" alignItems="center">
              <Grid item>
                <Typography align="center" color="primary">Kunci Jawaban : {questionAnswer.join(", ")}</Typography>
              </Grid>
              <Grid container item justify="center" alignItems="center">
                <Typography style={{ marginTop: "5px", marginRight: "10px" }} color="primary">{`Bobot : ${questionWeight}`}</Typography>
              </Grid>
            </Grid>
          </Grid>
        </Hidden>
      ];
    }

    return (
      <Paper className={classes.contentItem}>
        {/* <Hidden xsDown> */}
        {/* {content1} */}
        {/* </Hidden> */}
        {/* <Hidden smUp> */}
          {content}
        {/* </Hidden> */}
      </Paper>
    )
  }

  // ANCHOR fungsi ubah nilai
  const handleGradeChange = (e, studentId, questionIndex) => {
    let temp = { ...longtextGrades};
    let grade = e.target.value; // masih dalam bentuk string, akan dikonversi menjadi angka pada saat klik tombol simpan
    // temp[studentId] = { ...temp[studentId], [qnsIndex]: grade };
    temp[studentId] = { ...temp[studentId], [questionIndex]: grade };
    // console.log(temp);
    setLongtextGrades(temp);
  }

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
  // ANCHOR fungsi per soal
  const generateAllStudentAnswer = () => {
    let submissions = selectedAssessments.submissions;
    let question = selectedAssessments.questions[qnsIndex];
    let weights = selectedAssessments.question_weight;

    let sortedRows = stableSort(rows.current, getComparator(order, orderBy));
    // traverse semua murid yang sudah mengerjakan assessment ini
    // return Object.entries(submissions).map((student) => {
    return sortedRows.map((student) => {
      // let studentId = student[0];
      // let studentAnswer = student[1][qnsIndex];
      let studentId = student.id;
      let studentAnswer = submissions[studentId][qnsIndex];

      let studentInfo = all_student_object[studentId]; 

      let studentClassName = all_classes_map.get(studentInfo.kelas).name;
      let questionWeight;

      let mark = 0;
      if (question.type === "longtext") {
        questionWeight = weights[question.type][qnsIndex];
      
        // let longtextGrade = longtextGrades[studentId][qnsIndex]; // object
        if (longtextGrades[studentId] && longtextGrades[studentId][qnsIndex]) {
          // jika sudah pernah dinilai
          mark = longtextGrades[studentId][qnsIndex];
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
            if (questionAnswer[0] === studentAnswer[0]) {
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
        <QuestionPerQuestion
          classes={classes}
          studentId={studentId}
          studentName={studentInfo.name}
          studentClass={studentClassName}
          studentAnswer={studentAnswer}
          studentMark={mark}
          questionNumber={qnsIndex + 1}
          questionWeight={questionWeight}
          questionInfo={question}
          handleGradeChange={handleGradeChange}
          handleSaveGrade={handleSaveGrade}
        />
      );
    });
  }

  // ANCHOR fungsi per murid
  const generateQstStdAnswer = () => {
    let studentId = selectedStudent;
    let studentAnswers;

    if (selectedAssessments.submissions) {
      studentAnswers = selectedAssessments.submissions[studentId];
    } else {
      return null;
    }

    let questions = selectedAssessments.questions;
    let weights = selectedAssessments.question_weight;

    // traverse submission semua murid, (murid yang belum mengerjakan assessment ini tidak akan ditampilkan)
    return questions.map((question, questionIndex ) => {
      let studentAnswer = studentAnswers[questionIndex];
      let questionWeight;

      let mark = 0;
      if (question.type === "longtext") {
        questionWeight = weights[question.type][questionIndex];

        // let longtextGrade = longtextGrades[studentId][questionIndex];
        if (longtextGrades[studentId] && longtextGrades[studentId][questionIndex]) {
          // jika sudah pernah dinilai
          console.log("here: " + longtextGrades[studentId][questionIndex])
          mark = longtextGrades[studentId][questionIndex];
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
            if (questionAnswer[0] === studentAnswer[0]) {
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
        <QuestionAnswerPerStudent
          classes={classes}
          studentId={studentId}
          studentAnswer={studentAnswer}
          studentMark={mark}
          questionWeight={questionWeight}
          questionNumber={questionIndex + 1}
          questionInfo={question}
          handleGradeChange={handleGradeChange}
          handleSaveGrade={handleSaveGrade}
        />
      );
    });
  }

  // // Ganti halaman Soal
  // function QuestionPage(props) {
  //   const { classes, handleChangeQuestion, question_number, answer } = props;
  //   console.log(answer)
  //   return (
  //     <Grid item>
  //       <Badge
  //         badgeContent={(answer[question_number - 1].length > 0 && answer[question_number - 1].some((elm) => {return elm !== ""})) ?
  //             <Avatar style={{backgroundColor: "green", color: "white", width: "20px", height: "20px"}}>
  //               <CheckCircleIcon style={{width: "15px", height: "15px"}} />
  //             </Avatar>
  //           :
  //             <Avatar style={{backgroundColor: "red", color: "white", width: "20px", height: "20px"}}>
  //               <ErrorIcon style={{width: "15px", height: "15px"}} />
  //             </Avatar>
  //         }
  //         anchorOrigin={{
  //           vertical: "bottom",
  //           horizontal: "right",
  //         }}
  //       >
  //         <Paper
  //           buttons
  //           variant="outlined"
  //           className={classes.questionPage}
  //           onClick={() => handleChangeQuestion(question_number-1)}
  //         >
  //           <Typography>
  //             {question_number}
  //           </Typography>
  //         </Paper>
  //       </Badge>
  //     </Grid>
  //   )
  // }

  // const GenerateQuestionandAnswerPerStudent = (number, question, weight, studentName, studentClass, studentAnswer, studentMark, answerChecked) => {
  //   return (
  //     <Badge
  //       badgeContent={(answerChecked) ? <CheckCircleIcon className={classes.checkBadge} fontSize="large" /> :
  //         <ErrorIcon className={classes.warningBadge} fontSize="large" />} variant="standard" style={{ marginLeft: "4px" }}>
  //       <Paper className={classes.contentItem}>
  //         <Typography align="center" variant="h6" style={{ marginBottom: "10px" }}><b>{`Soal ${number}`}</b></Typography>
  //         <Typography align="justify">{`${question}`}</Typography>
  //         <Typography align="center" style={{ marginTop: "15px" }} color="primary">{`Bobot : ${weight}`}</Typography>
  //         <Divider style={{ marginBottom: "15px", marginTop: "15px" }} />
  //         <Typography variant="h6" style={{ textDecoration: "underline", marginBottom: "10px" }}><b>Jawaban</b></Typography>
  //         <Typography align="justify">{`${studentAnswer}`}</Typography>
  //         <div style={{ display: "flex", flexDirection: "row", justifyContent: "flex-end", alignItems: "center", marginTop: "25px" }}>
  //           <Typography style={{ marginTop: "5px", marginRight: "10px" }} color="textSecondary">Poin :</Typography>
  //           <TextField
  //             defaultValue={studentMark}
  //             inputProps={{
  //               style: {
  //                 borderBottom: "none",
  //                 boxShadow: "none",
  //                 margin: "0px",
  //                 width: "30px"
  //               }
  //             }}
  //             InputProps={{
  //               endAdornment: "/ 100",
  //             }}
  //           />
  //           <div>
  //             <Button className={classes.saveButton} size="small">SIMPAN</Button>
  //           </div>
  //         </div>
  //       </Paper>
  //     </Badge>
  //   )
  // }

  let linkToShare = `http://${window.location.host}/kuis-murid/${assessment_id}`;

  //ANCHOR cek kosong
  function isAssessmentLoaded() {
    return (Object.keys(selectedAssessments).length !== 0);
  }
  function isAllStudentsLoaded() {
    return (all_students.length !== 0);
  }
  function isAllClassMapEmpty() {
    return (all_classes_map.size !== 0);
  }

  function handleChangeQuestion(i) {
    if (i >= 0 && i <= questionCount.current - 1) {
      setQnsIndex(i)
    }
  }

  // ANCHOR fungsi dialog navigasi
  const [openDialog, setOpenDialog] = React.useState(false);
  function handleOpenNavDialog() {
    setOpenDialog(true);
  }
  function handleCloseNavDialog() {
    setOpenDialog(false);
  }
  function handleChangeQstNavDialog(i) {
    setQnsIndex(i);
    setOpenDialog(false);
  }

  // ANCHOR fungsi navigasi soal
  function QuestionPage(props) {
    const { classes, handleChangeQuestion, question_number, answer, question_type } = props;

    let fullyGraded = true;
    if (selectedAssessments.submissions) {
      if (question_type === "longtext") {
        for (let studentId of Object.keys(selectedAssessments.submissions)) {
          if (!longtextGrades[studentId] || !longtextGrades[studentId][question_number - 1]) {
            fullyGraded = false;
            break;
          }
        }
      }
    } else {
      fullyGraded = false;
    }

    return (
      <Grid item>
        <Badge
          badgeContent={
            (fullyGraded) ? (
              <Avatar style={{ backgroundColor: "green", color: "white", width: "20px", height: "20px" }}>
                <CheckCircleIcon style={{ width: "15px", height: "15px" }} />
              </Avatar>
            ) : (
              <Avatar style={{ backgroundColor: "red", color: "white", width: "20px", height: "20px" }}>
                <ErrorIcon style={{ width: "15px", height: "15px" }} />
              </Avatar>
            )
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
                  <Typography variant="h4" gutterBottom>
                    {selectedAssessments.name}
                  </Typography>
                  <Typography variant="caption" color="textSecondary">
                    <h6>Mata Pelajaran: {all_subjects_map.get(selectedAssessments.subject)}</h6>
                  </Typography>
                  <Hidden smDown implementation="css">
                    <Typography color="primary" gutterBottom style={{ marginTop: "30px" }}>
                      Deskripsi Kuis/Ujian:
                    </Typography>
                  </Hidden>
                </Grid>
                <Grid item xs={12} md={5} spacing={2}>
                  <Hidden mdUp implementation="css">
                    <Typography variant="body2" className={classes.startDateText}>
                      Waktu mulai kerja: {moment(selectedAssessments.start_date).locale("id").format("DD MMM YYYY, HH:mm")}
                    </Typography>
                    <Typography variant="body2" className={classes.endDateText}>
                      Batas waktu kerja: {moment(selectedAssessments.end_date).locale("id").format("DD MMM YYYY, HH:mm")}
                    </Typography>
                    <Typography color="primary" gutterBottom style={{ marginTop: "30px" }}>
                      Deskripsi Kuis/Ujian:
                    </Typography>
                    <Typography align="justify">
                      {selectedAssessments.description}
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
            <Hidden smDown>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography align="justify">
                    {selectedAssessments.description}
                  </Typography>
                </Grid>
              </Grid>
            </Hidden>

              <Grid container spacing={2}>
                <Grid item xs={12}>
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
                {/* ANCHOR navigasi soal */}
                  <Grid container item spacing={2} alignItems="center">
                  {
                    (hasLongtextQst.current === true) ? (
                      (isAssessmentLoaded() && longtextGrades) ? (
                        selectedAssessments.questions.map((qns, i) => {
                          return (
                            // <a href={`#${i}`} >
                            <QuestionPage
                              classes={classes}
                              question_number={i + 1}
                              handleChangeQuestion={handleChangeQuestion}
                              question_type={qns.type}
                            />
                            // </a>
                          )
                        })
                      ) : (
                        null
                      )
                    ) : (
                      (hasLongtextQst.current === false) ? (
                        (isAssessmentLoaded()) ? (
                          selectedAssessments.questions.map((qns, i) => {
                            return (
                              // <a href={`#${i}`} >
                              <QuestionPage
                                classes={classes}
                                question_number={i + 1}
                                handleChangeQuestion={handleChangeQuestion}
                                question_type={qns.type}
                              />
                              // </a>
                            )
                          })
                        ) : (
                          null
                        )
                    ) : (
                      null
                    )
                    )
                  }
                </Grid>
                </Hidden>
                <Hidden smUp>
                    <Grid item xs={12} md={2} style={{display: "flex", flexDirection: "row", marginTop: "10px", justifyContent: "space-between"}}>
                        <Button onClick={() => { handleChangeQuestion(qnsIndex-1)}}>
                            <div className={classes.mobileNav}>
                                <NavigateBeforeIcon className={classes.mobileNavButton}/>
                                <Typography variant="subtitle-2">Sebelum</Typography>
                            </div>
                        </Button>
                        {/* ANCHOR elemen dialog navigasi */}
                        <Button onClick={handleOpenNavDialog}>
                            <div className={classes.mobileNav}>
                                <ExploreIcon className={classes.mobileNavButton}/>
                                <Typography variant="subtitle-2">Navigasi Soal</Typography>
                            </div>
                        </Button>
                        <Button onClick={() => { handleChangeQuestion(qnsIndex + 1) }}>
                            <div className={classes.mobileNav}>
                                <NavigateNextIcon className={classes.mobileNavButton}/>
                                <Typography variant="subtitle-2">Sesudah</Typography>
                            </div>
                        </Button>
                    </Grid>
                </Hidden>
              </Grid>

              <Grid container spacing={2}>
                <Grid item xs={12} style={{ marginTop: "18px" }}>
                  <Divider />
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
              </Grid>
            </Paper>

            {/* Tab Panel Per Soal */}
          <div hidden={value === 1} style={{padding: "24px"}}>
            {/* ANCHOR elemen soal */}
            {
              (isAssessmentLoaded()) ? (
                (selectedAssessments.questions[qnsIndex].type === "longtext") ? (
                  generateQuestion(
                    qnsIndex + 1,
                    selectedAssessments.question_weight.longtext[qnsIndex],
                    selectedAssessments.questions[qnsIndex]
                  )
                ) : (
                  generateQuestion(
                    qnsIndex + 1,
                    selectedAssessments.question_weight[selectedAssessments.questions[qnsIndex].type],
                    selectedAssessments.questions[qnsIndex]
                  )
                )
              ) : (
                null
              )
            }

            {/* ANCHOR jawaban semua murid*/}
            {
              (isAssessmentLoaded() && selectedAssessments.submissions) ? (
                (hasLongtextQst.current === true) ? (
                  (longtextGrades && isAllClassMapEmpty()) ? (
                    generateAllStudentAnswer()
                  ) : (
                    null
                  )
                ) : (
                  (hasLongtextQst.current === false) ? (
                    (isAssessmentLoaded() && isAllStudentsLoaded() && isAllClassMapEmpty()) ? (
                      generateAllStudentAnswer()
                    ) : (
                      null
                    )
                  ) : (
                      // hasLongtextQst.current === null
                    null
                  )
                )
              ) : (
                null
              )
            }
            </div>
          
          {/* Tab Panel Per Murid */}
          <div hidden={value === 0} style={{ padding: "24px" }}>
            <Paper className={classes.perStudentSelect}>
              <div className={classes.selectDiv}>
                <Grid container>
                  <Grid item xs={1} sm={3}></Grid>
                  <Grid item xs={5} sm={2} className={classes.selectDescription}>
                    <Typography>Nama Murid :</Typography>
                  </Grid>
                  <Grid item xs={5} sm={2}>
                    <Select
                      disabled={!menuOption || menuOption.studentOptions.combined.length === 0}
                      labelId="kelas-label"
                      id="kelas"
                      className={classes.select}
                      variant="outlined"
                      value={selectedStudent}
                      onChange={(e) => { setSelectedStudent(e.target.value) }}
                    >
                      {/* ANCHOR elemen opsi murid*/}
                      {
                        (menuOption && menuOption.studentOptions.combined.length !== 0) ? (
                          (selectedClass) ? (
                            menuOption.studentOptions[selectedClass].map((student) => {
                              return <MenuItem key={student.id} value={student.id}>{student.name}</MenuItem>
                            })
                          ) : (
                              menuOption.studentOptions.combined.map((student) => {
                                return <MenuItem key={student.id} value={student.id}>{student.name}</MenuItem>
                              })
                            )
                        ) : (
                          null
                        )
                      }
                    </Select>
                  </Grid>
                  <Grid item xs={1} sm={5}></Grid>
                </Grid>
              </div>
              <div className={classes.selectDiv} style={{ marginTop: "10px" }}>
                <Grid container>
                  <Grid item xs={1} sm={3}></Grid>
                  <Grid item xs={5} sm={2} className={classes.selectDescription}>
                    <Typography>Kelas :</Typography>
                  </Grid>
                  <Grid item xs={5} sm={2}>
                    <Select
                      disabled={!menuOption || menuOption.studentOptions.combined.length === 0}
                      labelId="kelas-label"
                      id="kelas"
                      className={classes.select}
                      variant="outlined"
                      value={
                        (selectedStudent) ? (
                          (all_student_object && Object.keys(all_student_object).length !== 0) ? (all_student_object[selectedStudent].kelas) : (selectedClass)
                        ) : (selectedClass)
                      }
                      onChange={(e) => { setSelectedClass(e.target.value); setSelectedStudent(null); }}
                    >
                      {
                        (menuOption && menuOption.studentOptions.combined.length !== 0) ? (
                          menuOption.classOptions.map((kelas) => {
                            return <MenuItem key={kelas.id} value={kelas.id}>{kelas.name}</MenuItem>
                          })
                        ) : (
                          null
                        )
                      }
                    </Select>
                  </Grid>
                  <Grid item xs={1} sm={5}></Grid>
                </Grid>
              </div>
            </Paper>

            {/* ANCHOR soal-jawaban 1 murid */}
            {
              (isAssessmentLoaded() && selectedAssessments.submissions) ? (
                (hasLongtextQst.current === true) ? (
                  ((longtextGrades !== undefined) && isAllClassMapEmpty() && selectedStudent) ? (
                    generateQstStdAnswer()
                  ) : (
                      null
                    )
                ) : (
                  (hasLongtextQst.current === false) ? (
                    (isAllClassMapEmpty() && selectedStudent) ? (
                      generateQstStdAnswer()
                    ) : (
                        null
                      )
                  ) : (
                      // hasLongtextQst.current === null
                      null
                    )
                )
              ) : (
                null
              )
            }
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
      {/* ANCHOR elemen dialog  */}
        <Dialog
          open={openDialog}
          onClose={handleCloseNavDialog}
        >
        <DialogTitle style={{textAlign: "center"}}>Navigasi Soal</DialogTitle>
          <DialogContent>
          <Grid container spacing={2} style={{ margin: "20px", width: "unset" }}>
            {
              (hasLongtextQst.current === true) ? (
                (isAssessmentLoaded() && longtextGrades) ? (
                  selectedAssessments.questions.map((qns, i) => {
                    return (
                      // <a href={`#${i}`} >
                      <QuestionPage
                        classes={classes}
                        question_number={i + 1}
                        handleChangeQuestion={() => { handleChangeQstNavDialog(i) }}
                        question_type={qns.type}
                      />
                      // </a>
                    )
                  })
                ) : (
                  null
                )
              ) : (
                (hasLongtextQst.current === false) ? (
                  (isAssessmentLoaded()) ? (
                    selectedAssessments.questions.map((qns, i) => {
                      return (
                        // <a href={`#${i}`} >
                        <QuestionPage
                          classes={classes}
                          question_number={i + 1}
                          handleChangeQuestion={() => { handleChangeQstNavDialog(i) }}
                          question_type={qns.type}
                        />
                        // </a>
                      )
                    })
                  ) : (
                    null
                  )
                ) : (
                  null
                )
              )
            }
          </Grid>         
          </DialogContent>
        </Dialog>
    </div>
  )
};

// ANCHOR paper jawaban murid untuk mode per soal
function QuestionPerQuestion(props) {
  const { 
    classes, 
    studentId, 
    studentName,
    studentClass,
    studentAnswer, 
    studentMark, 
    questionNumber,
    questionWeight,
    questionInfo
  } = props;
  const { handleGradeChange, handleSaveGrade } = props;
  let questionType = questionInfo.type;
  let questionName = questionInfo.name;
  let questionOptions = questionInfo.options;
  console.log(`from left -> number ${questionNumber}: ${studentMark}`)

  if (questionType === "longtext") {
    // yang ngebuat semuanya harus dicopy adalah badgenya
    return (
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
                key={`${studentId}-${questionNumber}`}
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
                onChange={(e) => { handleGradeChange(e, studentId, questionNumber - 1) }}
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
    );
  } else {
    let answer;
    if (questionType === "radio") {
      answer = (
        <Grid item>
          <RadioGroup value={studentAnswer[0]}>
            {questionOptions.map((option, i) =>
              <div style={{ display: "flex" }}>
                <FormControlLabel
                  disabled
                  style={{ width: "100%" }}
                  value={String.fromCharCode(97 + i).toUpperCase()}
                  control={<Radio color="primary" />}
                  label={option}
                />
              </div>
            )}
          </RadioGroup>
        </Grid>
      );
    } else if (questionType === "checkbox") {
      answer = (
        <Grid item>
          <FormGroup>
            {questionOptions.map((option, i) =>
              <div style={{ display: "flex" }}>
                <FormControlLabel
                  disabled
                  style={{ width: "100%" }}
                  value={String.fromCharCode(97 + i).toUpperCase()}
                  label={option}
                  control={
                    <Checkbox
                      checked={studentAnswer.includes(String.fromCharCode(97 + i).toUpperCase())}
                      color="primary"
                    />
                  }
                />
              </div>
            )}
          </FormGroup>
        </Grid>
      );
    } else {
      let splitResult = questionName.split("`");
      let iterator = 0;

      for (let i = 1; i <= splitResult.length - 2; i += 2) {
        splitResult[i] = (
          <Input
            type="text"
            key={`${studentId}-${iterator}`}
            disabled={true}
            value={studentAnswer[iterator]}
          />);
        iterator++;
      }

      answer = (
        <Grid item>
          <Typography align="justify">
            <form>
              {splitResult}
            </form>
          </Typography>
        </Grid>
      );
    }

    return (
      <Paper style={{ width: "100%", marginBottom: "30px" }}>
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

          <Hidden xsDown>
            <Grid container>
              <Grid item xs={9}>
                {answer}
              </Grid>

              <Grid item>
                <Divider orientation="vertical" style={{ marginLeft: "10px", marginRight: "10px" }} />
              </Grid>

              <Grid item wrap="nowrap" direction="column" justify="center" alignItems="center" style={{ display: "flex", flexGrow: "1" }}>
                <Grid container item justify="center" alignItems="center">
                  <Typography style={{ marginTop: "5px", marginRight: "10px" }} color="textSecondary">Poin :</Typography>
                  <TextField
                    disabled
                    key={`${studentId}-${questionNumber}`}
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
                  />
                </Grid>
              </Grid>
            </Grid>
          </Hidden>

          <Hidden smUp>
            <Grid container>
              <Grid item xs={12}>
                {answer}
              </Grid>
              <Grid item xs={12} wrap="nowrap" direction="column" justify="center" alignItems="center">
                <Grid container item justify="center" alignItems="center">
                  <Typography style={{ marginTop: "5px", marginRight: "10px" }} color="textSecondary">Poin :</Typography>
                  <TextField
                    disabled
                    key={`${studentId}-${questionNumber}`}
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
                  />
                </Grid>
              </Grid>
            </Grid>
          </Hidden>

        </Grid>
      </Paper>
    );
  }
}

// ANCHOR paper soal-jawaban untuk mode per murid
function QuestionAnswerPerStudent(props) {
  const {
    classes,
    studentId,
    studentAnswer,
    studentMark,
    questionWeight,
    questionNumber,
    questionInfo
  } = props;
  let questionType = questionInfo.type;
  let questionName = questionInfo.name;
  let questionAnswer = questionInfo.answer;
  let questionOptions = questionInfo.options;

  const { handleGradeChange, handleSaveGrade } = props;
  console.log(`from right -> number ${questionNumber}: ${studentMark}`)
  let content;
  if (questionType === "longtext") {
    content = (
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
            <Typography align="center" variant="h6" style={{ marginBottom: "10px" }}><b>{`Soal ${questionNumber}`}</b></Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography align="justify">{`${questionName}`}</Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography align="center" style={{ marginTop: "15px" }} color="primary">{`Bobot : ${questionWeight}`}</Typography>
          </Grid>

          <Grid item xs={12}>
            <Divider style={{ marginBottom: "15px", marginTop: "15px" }} />
          </Grid>

          <Grid item xs={12}>
            <Typography variant="h6" style={{ textDecoration: "underline", marginBottom: "10px" }}><b>Jawaban</b></Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography align="justify">{(studentAnswer[0]) ? `${studentAnswer[0]}` : "Tidak menjawab"}</Typography>
          </Grid>

          <Grid container item justify="flex-end" alignItems="center" style={{ marginTop: "25px" }}>
            <Typography style={{ marginTop: "5px", marginRight: "10px" }} color="textSecondary">Poin :</Typography>
            <TextField
              defaultValue={studentMark}
              // TODO kalau ga dibuat random, studentmark tidak akan ditampilkan
              key={`${Math.random()}`}
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
              onChange={(e) => { handleGradeChange(e, studentId, questionNumber - 1) }}
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
          </Grid>
        </Grid>
      </Badge>
    );
  } else {
    let answer;

    if (questionType === "radio") {
      answer = (
        <Grid item>
          <Typography align="left" variant="h6" style={{ marginBottom: "10px" }}><b>{`Soal ${questionNumber}`}</b></Typography>
          <Typography align="justify">{`${questionName}`}</Typography>

          <Hidden mdUp>
            <Typography align="center" color="primary" style={{ marginTop: "15px" }}>Kunci Jawaban : {questionAnswer[0]}</Typography>
            <Divider style={{ marginBottom: "15px", marginTop: "15px" }} />
          </Hidden>

          <RadioGroup value={studentAnswer[0]}>
            {questionOptions.map((option, i) =>
              <div style={{ display: "flex" }}>
                <FormControlLabel
                  disabled
                  style={{ width: "100%" }}
                  value={String.fromCharCode(97 + i).toUpperCase()}
                  control={<Radio color="primary" />}
                  label={option}
                />
              </div>
            )}
          </RadioGroup>
        </Grid>
      );
    } else if (questionType === "checkbox") {
      answer = (
        <Grid item>
          <Typography align="left" variant="h6" style={{ marginBottom: "10px" }}><b>{`Soal ${questionNumber}`}</b></Typography>
          <Typography align="justify">{`${questionName}`}</Typography>
          <Typography align="center" color="primary" style={{ marginTop: "15px" }}>Kunci Jawaban : {questionAnswer.join(", ")}</Typography>

          <Hidden mdUp>
            <Divider style={{ marginBottom: "15px", marginTop: "15px" }} />
          </Hidden>

          <FormGroup>
            {questionOptions.map((option, i) =>
              <div style={{ display: "flex" }}>
                <FormControlLabel
                  disabled
                  style={{ width: "100%" }}
                  value={String.fromCharCode(97 + i).toUpperCase()}
                  label={option}
                  control={
                    <Checkbox
                      checked={studentAnswer.includes(String.fromCharCode(97 + i).toUpperCase())}
                      color="primary"
                    />
                  }
                />
              </div>
            )}
          </FormGroup>
        </Grid>
      );
    } else { //type = shorttext
      let splitResult = questionName.split("`");
      let iterator = 0;

      for (let i = 1; i <= splitResult.length - 2; i += 2) {
        splitResult[i] = (
          <Input
            type="text"
            key={`${questionNumber}-${iterator}`}
            disabled={true}
            value={studentAnswer[iterator]}
          />);
        iterator++;
      }

      answer = (
        <Grid item>
          <Typography align="left" variant="h6" style={{ marginBottom: "10px" }}><b>{`Soal ${questionNumber}`}</b></Typography>
          <Typography align="justify">
            <form>
              {splitResult}
            </form>
          </Typography>
        </Grid>
      );
    }

    content = [
      <Hidden smDown>
        <Grid container style={{ padding: "20px" }}>
          <Grid item xs={9}>
            {answer}
          </Grid>

          <Grid item>
            <Divider orientation="vertical" style={{ marginLeft: "10px", marginRight: "10px" }} />
          </Grid>

          <Grid item wrap="nowrap" direction="column" justify="center" alignItems="center" style={{ display: "flex", flexGrow: "1" }}>
            <Grid item>
              <Typography align="center" color="primary">Kunci Jawaban : {questionAnswer.join(", ")}</Typography>
            </Grid>
            <Grid container item justify="center" alignItems="center">
              <Typography style={{ marginTop: "5px", marginRight: "10px" }} color="textSecondary">Poin :</Typography>
              <TextField
                disabled
                defaultValue={studentMark}
                key={questionNumber}
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
              />
            </Grid>
          </Grid>
        </Grid>
      </Hidden>,
      <Hidden mdUp>
        <Grid container style={{ padding: "20px" }}>
          <Grid item xs={12}>
            {answer}
          </Grid>

          <Grid item xs={12} wrap="nowrap" direction="column" justify="center" alignItems="center">
            {(questionType === "shorttext") ? (
              <Grid item>
                <Typography align="center" color="primary" style={{ marginTop: "15px" }}>Kunci Jawaban : {questionAnswer.join(", ")}</Typography>
              </Grid>
            ) : (
              null
            )}
            
            <Grid container item justify="center" alignItems="center">
              <Typography style={{ marginTop: "5px", marginRight: "10px" }} color="textSecondary">Poin :</Typography>
              <TextField
                disabled
                defaultValue={studentMark}
                key={questionNumber}
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
              />
            </Grid>
          </Grid>
        </Grid>
      </Hidden>
    ];
  }

  return (
    // <a id={questionNumber-1}>
    <Paper style={{ width: "100%", marginBottom: "30px" }}>
      {content}
    </Paper>
    // </a>
  )
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