import React from "react";
import { useLocation } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import moment from "moment";
import { getAllClass } from "../../../actions/ClassActions";
import { getStudents } from "../../../actions/UserActions";
import { getAllSubjects } from "../../../actions/SubjectActions";
import { getOneAssessment, updateAssessmentGrades, getQuestionAnalytics } from "../../../actions/AssessmentActions";
import Latex from "../../utils/latex/Latex";
import CustomLinkify from "../../utils/linkify/Linkify";
import {
  Badge,
  Button,
  Checkbox,
  Divider,
  FormGroup,
  FormControlLabel,
  Grid,
  IconButton,
  Menu,
  MenuItem,
  Paper,
  Radio,
  RadioGroup,
  Snackbar,
  Select,
  Tab,
  Tabs,
  TableSortLabel,
  TextField,
  Tooltip,
  Typography,
} from "@material-ui/core";
import { Alert, ToggleButton, ToggleButtonGroup } from "@material-ui/lab";
import {
  Ballot as BallotIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Sort as SortIcon,
  SupervisorAccount as SupervisorAccountIcon,
} from "@material-ui/icons";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    margin: "auto",
    padding: "20px",
    paddingTop: "25px",
    maxWidth: "80%",
    [theme.breakpoints.down("md")]: {
      maxWidth: "100%",
    },
  },
  assessmentPaper: {
    padding: "20px",
    [theme.breakpoints.down("xs")]: {
      padding: "15px",
    },
  },
  assessmentDivider: {
    margin: "22.5px 0px",
    backgroundColor: theme.palette.primary.light,
  },
  modePaper: {
    padding: "20px 20px 0px 20px",
    [theme.breakpoints.down("xs")]: {
      padding: "15px 15px 0px 15px",
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
  questionNumberGroup: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    "&:after": {
      content: "''",
      flexGrow: "1",
    },
  },
  questionNumberGroupChildren: {
    padding: "0px",
    width: "35px",
    height: "35px",
    "&:not(:first-child)": {
      margin: "8px",
      borderRadius: theme.shape.borderRadius,
      borderLeft: "1px solid rgba(0,0,0,0.12)",
    },
    "&:first-child": {
      margin: "8px",
      borderRadius: theme.shape.borderRadius,
    },
  },
  questionNumberRoot: {
    color: "unset",
    "&$questionNumberSelected": {
      backgroundColor: theme.palette.primary.main,
      color: "white",
      "&:focus, &:hover": {
        backgroundColor: theme.palette.primary.main,
        color: "white",
      },
    },
  },
  questionNumberSelected: {
    backgroundColor: theme.palette.primary.main,
    color: "white",
    "&:focus, &:hover": {
      backgroundColor: theme.palette.primary.main,
      color: "white",
    },
  },
  answeredquestionNumber: {
    width: "20px",
    height: "20px",
    borderRadius: "10px",
    fontSize: "15px",
    backgroundColor: "white",
    color: theme.palette.success.main,
  },
  unansweredquestionNumber: {
    width: "20px",
    height: "20px",
    borderRadius: "10px",
    fontSize: "15px",
    backgroundColor: "white",
    color: theme.palette.error.main,
  },
  shortAnswerText: {
    color: theme.palette.text.secondary,
  },
  shortTextKeyAnswer: {
    color: theme.palette.success.main,
  },
  checkIcon: {
    color: theme.palette.success.dark,
    fontSize: "1rem",
    verticalAlign: "middle",
  },
  saveButton: {
    backgroundColor: theme.palette.primary.main,
    color: "white",
    marginLeft: "15px",
    height: "80%",
    "&:focus, &:hover": {
      backgroundColor: theme.palette.primary.dark,
    },
  },
}));

function AnswerPerQuestion(props) {
  const {
    classes,
    studentId,
    studentName,
    studentClass,
    studentAnswer,
    studentMark,
    questionNumber,
    questionWeight,
    questionInfo,
  } = props;
  const { handleGradeChange, handleSaveGrade } = props;
  let questionType = questionInfo.type;
  let questionName = questionInfo.name;
  let questionOptions = questionInfo.options;

  if (questionType === "longtext") {
    return (
      <Grid item>
        <Paper className={classes.assessmentPaper}>
          <Grid container direction="column" spacing={2}>
            <Grid item>
              <Grid container direction="column">
                <Grid item>
                  <Typography variant="h6">
                    <b>{`${studentName}`}</b>
                  </Typography>
                </Grid>
                <Grid item>
                  <Typography variant="subtitle-1" color="textSecondary">
                    {`${studentClass}`}
                  </Typography>
                </Grid>
                <Grid item>
                  <Divider style={{ marginTop: "5px" }} />
                </Grid>
              </Grid>
            </Grid>
            <Grid item>
              <Typography
                color="textSecondary"
                align="justify"
                style={{ wordBreak: "break-word", whiteSpace: "pre-wrap" }}
              >
                {studentAnswer[0] ? `${studentAnswer[0]}` : "Tidak menjawab"}
              </Typography>
            </Grid>
            <Grid item container justify="flex-end" alignItems="center">
              <Typography
                color="textSecondary"
                style={{ marginTop: "5px", marginRight: "10px" }}
              >
                Poin:
              </Typography>
              <TextField
                value={studentMark}
                key={`${studentId}-${questionNumber}`}
                inputProps={{
                  style: {
                    borderBottom: "none",
                    boxShadow: "none",
                    margin: "0px",
                    width: "30px",
                  },
                }}
                InputProps={{
                  endAdornment: `/ ${questionWeight}`,
                }}
                onChange={(e) => {
                  handleGradeChange(e, studentId, questionNumber - 1);
                }}
              />
              <div>
                <Button
                  size="small"
                  variant="contained"
                  className={classes.saveButton}
                  onClick={() => {
                    handleSaveGrade(
                      studentId,
                      questionNumber - 1,
                      questionWeight
                    );
                  }}
                >
                  Simpan
                </Button>
              </div>
            </Grid>
          </Grid>
        </Paper>
      </Grid>
    );
  } else {
    let answer;

    if (questionType === "radio") {
      answer = (
        <RadioGroup value={studentAnswer[0]}>
          {questionOptions.map((option, i) => (
            <div style={{ display: "flex" }}>
              <FormControlLabel
                disabled
                style={{ width: "100%" }}
                value={String.fromCharCode(97 + i).toUpperCase()}
                control={<Radio color="primary" />}
                label={option}
              />
            </div>
          ))}
        </RadioGroup>
      );
    } else if (questionType === "checkbox") {
      answer = (
        <FormGroup>
          {questionOptions.map((option, i) => (
            <div style={{ display: "flex" }}>
              <FormControlLabel
                disabled
                style={{ width: "100%" }}
                value={String.fromCharCode(97 + i).toUpperCase()}
                label={option}
                control={
                  <Checkbox
                    checked={studentAnswer.includes(
                      String.fromCharCode(97 + i).toUpperCase()
                    )}
                    color="primary"
                  />
                }
              />
            </div>
          ))}
        </FormGroup>
      );
    } else {
      let splitQnsResult = questionName.split("`");
      let iterator = 0;

      for (let i = 1; i <= splitQnsResult.length - 2; i += 2) {
        splitQnsResult[i] = (
          <Typography
            key={`${questionNumber}-${iterator}`}
            display="inline"
            color="textSecondary"
          >
            <u>{studentAnswer[iterator]}</u>
          </Typography>
        );
        iterator++;
      }

      answer = <form>{splitQnsResult}</form>;
    }

    return (
      <Grid item>
        <Paper className={classes.assessmentPaper}>
          <Grid container direction="column" spacing={2}>
            <Grid item>
              <Grid container direction="column">
                <Grid item>
                  <Typography variant="h6">
                    <b>{`${studentName}`}</b>
                  </Typography>
                </Grid>
                <Grid item>
                  <Typography variant="subtitle-1" color="textSecondary">
                    {`${studentClass}`}
                  </Typography>
                </Grid>
                <Grid item>
                  <Divider style={{ marginTop: "5px" }} />
                </Grid>
              </Grid>
            </Grid>
            <Grid item>{answer}</Grid>
            <Grid item container justify="flex-end" alignItems="center">
              <Typography
                key={`${studentId}-${questionNumber}`}
                color="textSecondary"
              >
                Poin: {studentMark} / {questionWeight}
              </Typography>
            </Grid>
          </Grid>
        </Paper>
      </Grid>
    );
  }
}

function AnswerPerStudent(props) {
  const {
    classes,
    studentId,
    studentAnswer,
    studentMark,
    questionWeight,
    questionNumber,
    questionInfo,
  } = props;
  let questionType = questionInfo.type;
  let questionName = questionInfo.name;
  let questionAnswer = questionInfo.answer;
  let questionOptions = questionInfo.options;

  const { handleGradeChange, handleSaveGrade } = props;

  if (questionType === "longtext") {
    return (
      <Grid item>
        <Paper className={classes.assessmentPaper}>
          <Grid container direction="column" spacing={2}>
            <Grid item>
              <Typography variant="h6" color="primary" align="left">
                {`Soal ${questionNumber}`}
              </Typography>
            </Grid>
            <Grid item>
              <Typography align="justify">{`${questionName}`}</Typography>
            </Grid>
            <Grid item>
              <Typography
                color="textSecondary"
                align="justify"
                style={{ wordBreak: "break-word", whiteSpace: "pre-wrap" }}
              >
                {studentAnswer[0] ? `${studentAnswer[0]}` : "Tidak menjawab"}
              </Typography>
            </Grid>
            <Grid item>
              <Typography
                align="justify"
                style={{ wordBreak: "break-word", whiteSpace: "pre-wrap" }}
                className={classes.shortTextKeyAnswer}
              >
                {questionAnswer}
              </Typography>
            </Grid>
            <Grid item container justify="flex-end" alignItems="center">
              <Typography
                style={{ marginTop: "5px", marginRight: "10px" }}
                color="textSecondary"
              >
                Poin:
              </Typography>
              <TextField
                key={`${studentId}-${questionNumber}`}
                value={studentMark}
                inputProps={{
                  style: {
                    borderBottom: "none",
                    boxShadow: "none",
                    margin: "0px",
                    width: "30px",
                  },
                }}
                InputProps={{
                  endAdornment: `/ ${questionWeight}`,
                }}
                onChange={(e) => {
                  handleGradeChange(e, studentId, questionNumber - 1);
                }}
              />
              <div>
                <Button
                  size="small"
                  variant="contained"
                  className={classes.saveButton}
                  onClick={() => {
                    handleSaveGrade(
                      studentId,
                      questionNumber - 1,
                      questionWeight
                    );
                  }}
                >
                  Simpan
                </Button>
              </div>
            </Grid>
          </Grid>
        </Paper>
      </Grid>
    );
  } else {
    let answer;

    if (questionType === "radio") {
      answer = (
        <Grid container direction="column" spacing={2}>
          <Grid item>
            <Typography align="justify">
              <Latex content={questionName} />
            </Typography>
          </Grid>
          <Grid item>
            <RadioGroup value={studentAnswer[0]}>
              {questionOptions.map((option, i) => (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-start",
                    alignItems: "center",
                  }}
                >
                  <FormControlLabel
                    disabled
                    // style={{ width: "100%" }}
                    value={String.fromCharCode(97 + i).toUpperCase()}
                    control={<Radio color="primary" />}
                    label={option}
                  />
                  {questionAnswer.includes(
                    String.fromCharCode(97 + i).toUpperCase()
                  ) ? (
                    <CheckCircleIcon className={classes.checkIcon} />
                  ) : null}
                </div>
              ))}
            </RadioGroup>
          </Grid>
        </Grid>
      );
    } else if (questionType === "checkbox") {
      answer = (
        <Grid container direction="column" spacing={2}>
          <Grid item>
            <Typography align="justify">{`${questionName}`}</Typography>
          </Grid>
          <Grid item>
            <FormGroup>
              {questionOptions.map((option, i) => (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-start",
                    alignItems: "center",
                  }}
                >
                  <FormControlLabel
                    disabled
                    // style={{ width: "100%" }}
                    value={String.fromCharCode(97 + i).toUpperCase()}
                    label={option}
                    control={
                      <Checkbox
                        checked={studentAnswer.includes(
                          String.fromCharCode(97 + i).toUpperCase()
                        )}
                        color="primary"
                      />
                    }
                  />
                  {questionAnswer.includes(
                    String.fromCharCode(97 + i).toUpperCase()
                  ) ? (
                    <CheckCircleIcon className={classes.checkIcon} />
                  ) : null}
                </div>
              ))}
            </FormGroup>
          </Grid>
        </Grid>
      );
    } else {
      let splitQnsResult = questionName.split("`");
      let iterator = 0;

      for (let i = 1; i <= splitQnsResult.length - 2; i += 2) {
        splitQnsResult[i] = (
          <span key={`${questionNumber}-${iterator}`}>
            <Typography display="inline" color="textSecondary">
              <u>{studentAnswer[iterator]}</u>
            </Typography>
            <Typography display="inline" className={classes.shortTextKeyAnswer}>
              {" "}
              ({questionAnswer[iterator]})
            </Typography>
          </span>
        );
        iterator++;
      }

      answer = (
        <Typography align="justify">
          <form>{splitQnsResult}</form>
        </Typography>
      );
    }

    return (
      <Grid item>
        <Paper className={classes.assessmentPaper}>
          <Grid container direction="column" spacing={2}>
            <Grid item>
              <Typography variant="h6" color="primary" align="left">
                {`Soal ${questionNumber}`}
              </Typography>
            </Grid>
            <Grid item>{answer}</Grid>
            <Grid item container justify="flex-end">
              <Typography key={questionNumber} color="textSecondary">
                Poin: {studentMark} / {questionWeight}
              </Typography>
            </Grid>
          </Grid>
        </Paper>
      </Grid>
    );
  }
}

function ViewAssessmentTeacher(props) {
  const classes = useStyles();
  const location = useLocation();
  const { getOneAssessment, getAllClass, getAllSubjects, getStudents } = props;

  const { all_students, user } = props.auth;
  const { all_classes_map } = props.classesCollection;
  const { all_subjects_map } = props.subjectsCollection;
  const { selectedAssessments } = props.assessmentsCollection;
  const { type } = selectedAssessments;
  const assessment_id = props.match.params.id;

  const [all_student_object, setAllStudentObj] = React.useState(null);
  /*
  If there is still no submitted assessment, this state will be filled with an empty object {}.
  isi:
  {
    <1st Student id>: {
      ...document for student's model
    },
    <2nd Student id>: {
      ...document
    },
    ...
  } key = id every student who has submitted/completed this asssessment.
  */

  const [qnsIndex, setQnsIndex] = React.useState(0);

  /*
  If there is still no scored assessment, this state will be filled with an empty object {}.
  If this assessment doesn't have any long text question type, this state will be set to null.
  example:
  {
    <1st Student id>: {
      <1st long text question index>: <0 till maximum score for this question>
      <2nd long text question index>: <0 till maximum score for this question>
      ...
    }, key = index of every long text question that has been scored (long text question that has not been scored will not be saved in this object)

    <2nd Student id>: {
      <1st long text question index>: <0 till maximum score for this question>
      <2nd long text question index>: <0 till maximum score for this question>
      ...
    },

    <3rd Student id>: {},will be filled with empty object if every long text question answer has not been scored yet.

    ...
  } key = id of every student who has submitted this assessment.

  If this textfield is filled with something, the question score (<0 till maximum score for this question>) will be filled with score in string.
  This score will be turned into an integer, if submit button is clicked.
  */
  const [longtextGrades, setLongtextGrades] = React.useState(undefined);

  /*
  Example:
    {
      studentOptions: {
        combined: [<student id 1>, <student id 2>, ...] = Every student from the same class who gets this assessment.
        <1st Class id>: [<student id 1>, <student id 2>, ...] -> Every student from this class.
        <2nd Class id>: [<student id 1>, <student id 2>, ...]
        ...
      } key = id of every class who get this assessment.
      ,
      classOptions: [
        {id: <1st Class id>, name: <1st Class name>},
        {id: <2nd Class id>, name: <2nd Class name>},
        ...
      ] = Every class that gets this assessment.
    }
  */
  const [menuOption, setMenuOption] = React.useState(null);

  // Filled with class' id that is selected from class menu.
  const [selectedClass, setSelectedClass] = React.useState(null);

  // Fileld with student's id that is selected from student menu.
  const [selectedStudent, setSelectedStudent] = React.useState(null);

  // If it has not been uploaded yet, contain null. If it has been processed, the value will be either true or false.
  const hasLongtextQst = React.useRef(null);
  const questionCount = React.useRef(null);

  // Tabs
  const [value, setValue] = React.useState(0);

  React.useEffect(() => {
    console.log(assessment_id);
    getOneAssessment(assessment_id);
    getAllClass(user.unit, "map");
    getAllSubjects(user.unit, "map");
    getStudents(user.unit);

    if (location.state) {
      setSelectedStudent(location.state.studentId);
      setSelectedClass(location.state.classId);
      setValue(1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedAssessments]);

  const rows = React.useRef([]); // akan digunakan untuk sorting
  React.useEffect(() => {
    if (isAssessmentLoaded() && isAllStudentsLoaded() && isAllClassMapEmpty()) {
      let students = {};
      let classOptions = [];
      let studentOptions = { combined: [] };

      for (let classId of selectedAssessments.class_assigned) {
        classOptions.push({
          id: classId,
          name: all_classes_map.get(classId).name,
        });
        studentOptions[classId] = [];
      }

      rows.current = [];
      // If there are submissions attributes, that means there will be at least 1 student that has submitted the assessment.
      if (selectedAssessments.submissions) {
        let submittedStudentList = Object.keys(selectedAssessments.submissions);
        for (var j = 0; j < all_students.length; j++) {
          let std = all_students[j];
          if (
            submittedStudentList.includes(std._id) &&
            selectedAssessments.class_assigned.includes(std.kelas)
          ) {
            rows.current.push({
              id: std._id,
              name: std.name,
              classname: all_classes_map.get(std.kelas).name,
            });
            students[std._id] = std;
            studentOptions[std.kelas].push({ id: std._id, name: std.name });
            studentOptions.combined.push({ id: std._id, name: std.name });
          }
          // After answering assessment, this student will be moved to class that didn't get this assessment.
          // Therefore the student is not showed.
        }
      }

      let options = { classOptions, studentOptions };
      setMenuOption(options);
      setAllStudentObj(students);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [all_students, selectedAssessments, all_classes_map]);

  React.useEffect(() => {
    if (isAssessmentLoaded() && all_student_object) {
      if (hasLongtextQst.current === true) {
        let ltGrade = {};
        // If at least 1 student's long text question that has already been graded,
        if (selectedAssessments.grades) {
          // Traverse all students that has submitted the assessment's answer.
          Object.keys(all_student_object).forEach((studentId) => {
            // If this student's long text question answers have ever been graded.
            if (selectedAssessments.grades[studentId]) {
              ltGrade[studentId] =
                selectedAssessments.grades[studentId].longtext_grades;
            } else {
              // If all long text question has not yet graded.
              ltGrade[studentId] = {};
            }
          });
        } // If there is not even one student's long text question have ever been graded, longtextGrades will be filled with an empty object {}.

        setLongtextGrades(ltGrade);
      } else {
        // If there is no long text question, then set null
        setLongtextGrades(null);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedAssessments, all_student_object, hasLongtextQst.current]);

  const [anchorEl, setAnchorEl] = React.useState(null);
  const [order, setOrder] = React.useState("desc");
  const [orderBy, setOrderBy] = React.useState("name");

  function handleOpenSortMenu(event) {
    setAnchorEl(event.currentTarget);
  }
  function handleCloseSortMenu() {
    setAnchorEl(null);
  }
  const createSortHandler = (property) => (event) => {
    handleRequestSort(event, property);
  };
  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const headCells = [
    {
      id: "name",
      numeric: false,
      disablePadding: true,
      label: "Nama Murid",
    },
    {
      id: "classname",
      numeric: false,
      disablePadding: true,
      label: "Nama Kelas",
    },
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

  // Tabs
  function handleChange(event, newValue) {
    setValue(newValue);
  }

  function TabIndex(index) {
    return {
      id: `simple-tab-${index}`,
    };
  }

  const [snackbarContent, setSnackbarContent] = React.useState("");
  const [severity, setSeverity] = React.useState("info");
  const [openSnackbar, setOpenSnackbar] = React.useState(false);

  function handleOpenSnackbar(severity, content) {
    setOpenSnackbar(true);
    setSeverity(severity);
    setSnackbarContent(content);
  }

  function handleCloseSnackbar(event, reason) {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnackbar(false);
  }

  function generateQuestion(questionNumber, questionWeight, questionInfo) {
    let questionType = questionInfo.type;
    let questionName = questionInfo.name;
    let questionAnswer = questionInfo.answer;
    let questionOptions = questionInfo.options;

    let content;
    if (questionType === "longtext") {
      content = (
        <Grid container direction="column" spacing={2}>
          <Grid item>
            <Typography align="justify">
              <Latex content={questionName} />
            </Typography>
          </Grid>
          <Grid item>
            <Typography color="textSecondary" align="justify">
              {questionAnswer}
            </Typography>
          </Grid>
        </Grid>
      );
    } else if (questionType === "shorttext") {
      let splitQnsResult = questionName.split("`");
      let iterator = 0;
      for (let i = 0; i <= splitQnsResult.length - 2; i += 1) {
        if (i % 2 === 1) {
          splitQnsResult[i] = (
            <Typography display="inline" color="textSecondary" align="justify">
              <span
                className={classes.shortAnswerText}
                key={`${questionNumber}-${iterator}`}
              >
                <u>{questionAnswer[iterator]}</u>
              </span>
            </Typography>
          );
          iterator++;
        }
      }

      content = <div>{splitQnsResult}</div>;
    } else if (questionType === "radio") {
      content = (
        <Grid container direction="column" spacing={2}>
          <Grid item>
            <Typography align="justify">
              <Latex content={questionName} />
            </Typography>
          </Grid>
          <Grid item>
            <RadioGroup value={questionAnswer[0]}>
              {questionOptions.map((option, i) => (
                <div style={{ display: "flex" }}>
                  <FormControlLabel
                    disabled
                    style={{ width: "100%" }}
                    value={String.fromCharCode(97 + i).toUpperCase()}
                    control={<Radio color="primary" />}
                    label={option}
                  />
                </div>
              ))}
            </RadioGroup>
          </Grid>
        </Grid>
      );
    } else {
      content = (
        <Grid container direction="column" spacing={2}>
          <Grid item>
            <Typography align="justify">{`${questionName}`}</Typography>
          </Grid>
          <Grid item>
            <FormGroup>
              {questionOptions.map((option, i) => (
                <div style={{ display: "flex" }}>
                  <FormControlLabel
                    disabled
                    style={{ width: "100%" }}
                    value={String.fromCharCode(97 + i).toUpperCase()}
                    label={option}
                    control={
                      <Checkbox
                        color="primary"
                        checked={questionAnswer.includes(
                          String.fromCharCode(97 + i).toUpperCase()
                        )}
                      />
                    }
                  />
                </div>
              ))}
            </FormGroup>
          </Grid>
        </Grid>
      );
    }

    return (
      <Grid item>
        <Paper className={classes.assessmentPaper}>
          <Grid container direction="column" spacing={2}>
            <Grid item>
              <Typography variant="h6" color="primary" align="left">
                {`Soal ${questionNumber}`}
              </Typography>
            </Grid>
            <Grid item>{content}</Grid>
            <Grid item container justify="flex-end">
              <Typography color="textSecondary">
                {`Bobot: ${questionWeight}`}
              </Typography>
            </Grid>
          </Grid>
        </Paper>
      </Grid>
    );
  }

  function handleGradeChange(e, studentId, questionIndex) {
    let temp = { ...longtextGrades };
    let grade = e.target.value; // masih dalam bentuk string, akan dikonversi menjadi angka pada saat klik tombol simpan
    temp[studentId] = { ...temp[studentId], [questionIndex]: grade };
    setLongtextGrades(temp);
  }

  function handleSaveGrade(studentId, questionIndex, questionWeight) {
    let temp = { ...longtextGrades };
    let grade = temp[studentId][questionIndex];

    let numberGrade = Number(grade);

    if (grade === "" || isNaN(numberGrade) || numberGrade < 0) {
      handleOpenSnackbar(
        "error",
        "Nilai harus berupa angka dan tidak boleh kurang dari 0"
      );
    } else if (grade > questionWeight) {
      handleOpenSnackbar("error", "Nilai tidak boleh melebihi bobot");
    } else {
      temp[studentId] = { ...temp[studentId], [questionIndex]: numberGrade };
      setLongtextGrades(temp);
      updateAssessmentGrades(
        assessment_id,
        studentId,
        questionIndex,
        numberGrade
      )
        .then(() => {
          handleOpenSnackbar("success", "Nilai berhasil diperbarui");
        })
        .catch((err) => {
          console.log(err);
          handleOpenSnackbar("error", "Nilai gagal diperbarui");
        });
    }
  }
  function generateAllStudentAnswer() {
    let submissions = selectedAssessments.submissions;
    let question = selectedAssessments.questions[qnsIndex];
    let weights = selectedAssessments.question_weight;

    let sortedRows = stableSort(rows.current, getComparator(order, orderBy));
    // Traverse all students that have already done this assessment.
    return sortedRows.map((student) => {
      let studentId = student.id;
      let studentAnswer = submissions[studentId][qnsIndex];

      let studentInfo = all_student_object[studentId];

      let studentClassName = all_classes_map.get(studentInfo.kelas).name;
      let questionWeight;

      let mark = 0;
      if (question.type === "longtext") {
        questionWeight = weights[question.type][qnsIndex];
        if (longtextGrades[studentId] && longtextGrades[studentId][qnsIndex]) {
          // If it has ever been graded.
          mark = longtextGrades[studentId][qnsIndex];
        } else {
          // If it has not yet graded before.
          mark = null;
        }
      } else {
        questionWeight = weights[question.type];

        if (studentAnswer.length !== 0) {
          // If student answer this question.
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
              } else {
                temp_correct -= 2;
              }
            });

            if (temp_correct > 0) {
              mark = (weights.checkbox * temp_correct) / questionAnswer.length;
            }
          } else {
            let temp_correct = 0;
            for (
              let answerIdx = 0;
              answerIdx < questionAnswer.length;
              answerIdx++
            ) {
              if (questionAnswer[answerIdx] === studentAnswer[answerIdx]) {
                temp_correct++;
              }
            }
            mark = (weights.shorttext * temp_correct) / questionAnswer.length;
          }
        } // If student didn't answer this question, mark equals to 0.
      }

      return (
        <AnswerPerQuestion
          questionAnswer={question.answer}
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

  function generateQstStdAnswer() {
    let studentId = selectedStudent;
    let studentAnswers;

    if (selectedAssessments.submissions) {
      studentAnswers = selectedAssessments.submissions[studentId];
    } else {
      return null;
    }

    let questions = selectedAssessments.questions;
    let weights = selectedAssessments.question_weight;

    // Traverse all students' submission, student that has not yet done this assesment will not be shown.
    return questions.map((question, questionIndex) => {
      let studentAnswer = studentAnswers[questionIndex];
      let questionWeight;

      let mark = 0;
      if (question.type === "longtext") {
        questionWeight = weights[question.type][questionIndex];

        // let longtextGrade = longtextGrades[studentId][questionIndex];
        if (
          longtextGrades[studentId] &&
          longtextGrades[studentId][questionIndex] !== undefined
        ) {
          // If it has ever been graded.
          mark = longtextGrades[studentId][questionIndex];
        } else {
          // If it has not yet graded before.
          mark = null;
        }
      } else {
        questionWeight = weights[question.type];

        if (studentAnswer.length !== 0) {
          // If student answer this question.
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
              } else {
                temp_correct -= 2;
              }
            });

            if (temp_correct > 0) {
              mark = (weights.checkbox * temp_correct) / questionAnswer.length;
            }
          } else {
            // type === "shorttext"
            let temp_correct = 0;
            for (
              let answerIdx = 0;
              answerIdx < questionAnswer.length;
              answerIdx++
            ) {
              if (questionAnswer[answerIdx] === studentAnswer[answerIdx]) {
                temp_correct++;
              }
            }

            mark = (weights.shorttext * temp_correct) / questionAnswer.length;
          }
        } // If student didn't answer this question, mark equals to 0.
      }

      return (
        <AnswerPerStudent
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

  function isAssessmentLoaded() {
    return Object.keys(selectedAssessments).length !== 0;
  }
  function isAllStudentsLoaded() {
    return all_students.length !== 0;
  }
  function isAllClassMapEmpty() {
    return all_classes_map.size !== 0;
  }

  function handleChangeQuestion(i) {
    if (i >= 0 && i <= questionCount.current - 1) {
      setQnsIndex(i);
    }
  }

  function handleChangeToggleButton(event, newIndex) {
    if (newIndex !== null) {
      handleChangeQuestion(newIndex);
    }
  }
  function questionPage(classes, question_number, question_type) {
    let fullyGraded = true;
    if (selectedAssessments.submissions) {
      if (question_type === "longtext") {
        for (let studentId of Object.keys(selectedAssessments.submissions)) {
          // If this long answer qyestion is not yet graded, grade is set to undefined because long text question grade can be equal to 0.
          if (
            !longtextGrades[studentId] ||
            longtextGrades[studentId][question_number - 1] === undefined
          ) {
            fullyGraded = false;
            break;
          }
        }
      }
    } else {
      fullyGraded = false;
    }
    return (
      <ToggleButton
        value={question_number - 1}
        selected={qnsIndex === question_number - 1}
        classes={{
          root: classes.questionNumberRoot,
          selected: classes.questionNumberSelected,
        }}
      >
        <Badge
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "35px",
            height: "35px",
          }}
          badgeContent={
            fullyGraded ? (
              <Tooltip title="Sudah diperiksa">
                <CheckCircleIcon className={classes.answeredquestionNumber} />
              </Tooltip>
            ) : (
              <Tooltip title="Belum diperiksa">
                <ErrorIcon className={classes.unansweredquestionNumber} />
              </Tooltip>
            )
          }
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
        >
          <Typography>{question_number}</Typography>
        </Badge>
      </ToggleButton>
    );
  }

  document.title = `Schooly | Hasil ${selectedAssessments.type} - ${selectedAssessments.name}`;

  return (
    <div className={classes.root}>
      <Grid container direction="column" spacing={2}>
        <Grid item>
          <Paper className={classes.assessmentPaper}>
            <Typography variant="h4" style={{ marginBottom: "5px" }}>
              {selectedAssessments.name}
            </Typography>
            <Typography color="primary" paragraph>
              {type} {all_subjects_map.get(selectedAssessments.subject)}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Oleh: {user.name}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Waktu Dibuat:{" "}
              {moment(selectedAssessments.createdAt)
                .locale("id")
                .format("DD MMM YYYY, HH.mm")}
            </Typography>
            <Divider className={classes.assessmentDivider} />
            <Grid container spacing={4}>
              <Grid item xs={12}>
                <Typography color="textSecondary" gutterBottom>
                  Kelas yang Diberikan:
                </Typography>
                <Typography>
                  {!selectedAssessments.class_assigned || !all_classes_map.size
                    ? null
                    : selectedAssessments.class_assigned.map((kelas, i) => {
                      if (all_classes_map.get(kelas)) {
                        if (
                          i ===
                          selectedAssessments.class_assigned.length - 1
                        )
                          return `${all_classes_map.get(kelas).name}`;
                        return `${all_classes_map.get(kelas).name}, `;
                      }
                      return null;
                    })}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography color="textSecondary" gutterBottom>
                  Deskripsi {type}:
                </Typography>
                <Typography
                  align="justify"
                  style={{ wordBreak: "break-word", whiteSpace: "pre-wrap" }}
                >
                  <CustomLinkify text={selectedAssessments.description} />
                </Typography>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
        <Grid item>
          <Paper className={classes.modePaper}>
            <Grid container justify="space-between" alignItems="center">
              <Grid item>
                <Typography variant="h6">
                  Hasil Pekerjaan
                </Typography>
              </Grid>
              <Grid item>
                <Tooltip title={`Urutkan ${type}`}>
                  <IconButton onClick={handleOpenSortMenu}>
                    <SortIcon />
                  </IconButton>
                </Tooltip>
                <Menu
                  keepMounted
                  open={Boolean(anchorEl)}
                  onClose={handleCloseSortMenu}
                  anchorEl={anchorEl}
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
                      onClick={createSortHandler(headCell.id)}
                    >
                      <TableSortLabel
                        active={orderBy === headCell.id}
                        direction={orderBy === headCell.id ? order : "asc"}
                      >
                        {headCell.label}
                        {orderBy === headCell.id ? (
                          <span className={classes.visuallyHidden}>
                            {order === "desc"
                              ? "sorted descending"
                              : "sorted ascending"}
                          </span>
                        ) : null}
                      </TableSortLabel>
                    </MenuItem>
                  ))}
                </Menu>
              </Grid>
            </Grid>
            <Divider style={{ marginTop: "5px" }} />
            <div style={{ padding: "16px 0px 25px 0px" }}>
              <Typography gutterBottom>
                Mulai:{" "}
                {moment(selectedAssessments.start_date)
                  .locale("id")
                  .format("DD MMM YYYY, HH:mm")}
              </Typography>
              <Typography gutterBottom>
                Selesai:{" "}
                {moment(selectedAssessments.end_date)
                  .locale("id")
                  .format("DD MMM YYYY, HH:mm")}
              </Typography>
            </div>
            <Tabs
              variant="fullWidth"
              indicatorColor="primary"
              textColor="primary"
              value={value}
              onChange={handleChange}
            >
              <Tab
                icon={<BallotIcon />}
                label="Per Soal"
                {...TabIndex(0)}
              />
              <Tab
                icon={<SupervisorAccountIcon />}
                label="Per Murid"
                {...TabIndex(1)}
              />
            </Tabs>
          </Paper>
        </Grid>
        <Grid item>
          <div hidden={value === 1}>
            <Grid container direction="column" spacing={2}>
              <Grid item>
                <Paper className={classes.assessmentPaper}>
                  <Typography>Navigasi Soal:</Typography>
                  <ToggleButtonGroup
                    exclusive
                    value={qnsIndex}
                    onChange={(e, newIndex) => handleChangeToggleButton(e, newIndex)}
                    classes={{
                      root: classes.questionNumberGroup,
                      grouped: classes.questionNumberGroupChildren,
                    }}
                  >
                    {hasLongtextQst.current === true
                      ? isAssessmentLoaded() && longtextGrades
                        ? selectedAssessments.questions.map((qns, i) => {
                          return questionPage(classes, i + 1, qns.type);
                        })
                        : null
                      : hasLongtextQst.current === false
                        ? isAssessmentLoaded()
                          ? selectedAssessments.questions.map((qns, i) => {
                            return questionPage(classes, i + 1, qns.type);
                          })
                          : null
                        : null}
                  </ToggleButtonGroup>
                </Paper>
              </Grid>
              {isAssessmentLoaded()
                ? selectedAssessments.questions[qnsIndex].type === "longtext"
                  ? generateQuestion(
                    qnsIndex + 1,
                    selectedAssessments.question_weight.longtext[qnsIndex],
                    selectedAssessments.questions[qnsIndex]
                  )
                  : generateQuestion(
                    qnsIndex + 1,
                    selectedAssessments.question_weight[
                    selectedAssessments.questions[qnsIndex].type
                    ],
                    selectedAssessments.questions[qnsIndex]
                  )
                : null}
              {isAssessmentLoaded() && selectedAssessments.submissions
                ? hasLongtextQst.current === true
                  ? longtextGrades && isAllClassMapEmpty()
                    ? generateAllStudentAnswer()
                    : null
                  : hasLongtextQst.current === false
                    ? isAssessmentLoaded() &&
                      isAllStudentsLoaded() &&
                      isAllClassMapEmpty()
                      ? generateAllStudentAnswer()
                      : null
                    : // hasLongtextQst.current === null
                    null
                : null}
            </Grid>
          </div>
          <div hidden={value === 0}>
            <Grid container direction="column" spacing={2}>
              <Grid item>
                <Paper className={classes.assessmentPaper}>
                  <Grid container alignItems="center" spacing={2}>
                    <Grid item xs={3}>
                      <Typography>Nama Murid:</Typography>
                    </Grid>
                    <Grid item xs={9}>
                      <Select
                        fullWidth
                        variant="outlined"
                        id="murid"
                        value={selectedStudent}
                        onChange={(e) => setSelectedStudent(e.target.value)}
                        disabled={
                          !menuOption ||
                          menuOption.studentOptions.combined.length === 0
                        }
                      >
                        {menuOption &&
                          menuOption.studentOptions.combined.length !== 0
                          ? selectedClass
                            ? menuOption.studentOptions[selectedClass].map(
                              (student) => {
                                return (
                                  <MenuItem key={student.id} value={student.id}>
                                    {student.name}
                                  </MenuItem>
                                );
                              }
                            )
                            : menuOption.studentOptions.combined.map(
                              (student) => {
                                return (
                                  <MenuItem key={student.id} value={student.id}>
                                    {student.name}
                                  </MenuItem>
                                );
                              }
                            )
                          : null}
                      </Select>
                    </Grid>
                    <Grid item xs={3}>
                      <Typography>Kelas:</Typography>
                    </Grid>
                    <Grid item xs={9}>
                      <Select
                        fullWidth
                        variant="outlined"
                        id="kelas"
                        value={
                          selectedStudent
                            ? all_student_object &&
                              Object.keys(all_student_object).length !== 0
                              ? all_student_object[selectedStudent].kelas
                              : selectedClass
                            : selectedClass
                        }
                        onChange={(e) => {
                          setSelectedClass(e.target.value);
                          setSelectedStudent(null);
                        }}
                        disabled={
                          !menuOption ||
                          menuOption.studentOptions.combined.length === 0
                        }
                      >
                        {menuOption &&
                          menuOption.studentOptions.combined.length !== 0
                          ? menuOption.classOptions.map((kelas) => {
                            return (
                              <MenuItem key={kelas.id} value={kelas.id}>
                                {kelas.name}
                              </MenuItem>
                            );
                          })
                          : null}
                      </Select>
                    </Grid>
                    {isAssessmentLoaded() &&
                      selectedAssessments.submissions_timestamp &&
                      selectedStudent ? (
                      <>
                        <Grid item xs={3}>
                          <Typography>Waktu Pengumpulan:</Typography>
                        </Grid>
                        <Grid item xs={9}>
                          <Typography>
                            {moment(
                              selectedAssessments.submissions_timestamp[
                              selectedStudent
                              ]
                            )
                              .locale("id")
                              .format("DD MMM YYYY, HH:mm")}
                          </Typography>
                        </Grid>
                      </>
                    ) : null}
                  </Grid>
                </Paper>
              </Grid>
              {isAssessmentLoaded() && selectedAssessments.submissions
                ? hasLongtextQst.current === true
                  ? longtextGrades !== undefined &&
                    isAllClassMapEmpty() &&
                    selectedStudent
                    ? generateQstStdAnswer()
                    : null
                  : hasLongtextQst.current === false
                    ? isAllClassMapEmpty() && selectedStudent
                      ? generateQstStdAnswer()
                      : null
                    : null
                : null}
            </Grid>
          </div>
        </Grid>
      </Grid>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={4000}
        onClose={(event, reason) => handleCloseSnackbar(event, reason)}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      >
        <Alert
          elevation={6}
          variant="filled"
          severity={severity}
          onClose={(event, reason) => handleCloseSnackbar(event, reason)}
        >
          {snackbarContent}
        </Alert>
      </Snackbar>
    </div>
  );
}

ViewAssessmentTeacher.propTypes = {
  auth: PropTypes.object.isRequired,
  getAllClass: PropTypes.func.isRequired,
  getStudents: PropTypes.func.isRequired,
  getAllSubjects: PropTypes.func.isRequired,
  subjectsCollection: PropTypes.object.isRequired,
  getOneAssessment: PropTypes.func.isRequired,
  assessmentsCollection: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  classesCollection: state.classesCollection,
  subjectsCollection: state.subjectsCollection,
  assessmentsCollection: state.assessmentsCollection,
});

export default connect(mapStateToProps, {
  getAllClass,
  getStudents,
  getAllSubjects,
  getOneAssessment,
})(ViewAssessmentTeacher);
