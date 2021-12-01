import React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import moment from "moment";
import { getAllClass } from "../../../actions/ClassActions";
import { getStudents } from "../../../actions/UserActions";
import { getAllSubjects } from "../../../actions/SubjectActions";
import {
  getOneAssessment,
  updateAssessmentSuspects,
} from "../../../actions/AssessmentActions";
import LightTooltip from "../../misc/light-tooltip/LightTooltip";
import { TabPanel, TabIndex } from "../../misc/tab-panel/TabPanel";
import {
  Avatar,
  Button,
  Divider,
  ExpansionPanel,
  ExpansionPanelSummary,
  Fab,
  Grid,
  Hidden,
  IconButton,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Menu,
  MenuItem,
  Paper,
  Tab,
  Tabs,
  TableSortLabel,
  Typography,
} from "@material-ui/core";
import {
  CheckBox as CheckBoxIcon,
  Edit as EditIcon,
  ExpandMore as ExpandMoreIcon,
  GetApp as GetAppIcon,
  RadioButtonChecked as RadioButtonCheckedIcon,
  Sort as SortIcon,
  Subject as SubjectIcon,
  TextFormat as TextFormatIcon,
} from "@material-ui/icons";
import { makeStyles } from "@material-ui/core/styles";
import { BsFlag, BsFlagFill } from "react-icons/bs";

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
  personListContainer: {
    display: "flex",
    alignItems: "center",
    padding: "5px",
  },
  listItemPaper: {
    marginBottom: "10px",
  },
  listItem: {
    "&:focus, &:hover": {
      backgroundColor: theme.palette.primary.fade,
    },
  },
  paperbox: {
    padding: "20px 20px 0 20px",
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
    "&$disabled": {
      boxShadow: theme.shadows[2],
      color: "white",
    },
  },
  CheckboxQst: {
    "&$disabled": {
      boxShadow: theme.shadows[2],
      color: "white",
    },
  },
  ShorttextQst: {
    "&$disabled": {
      boxShadow: theme.shadows[2],
      color: "white",
    },
  },
  LongtextQst: {
    "&$disabled": {
      boxShadow: theme.shadows[2],
      color: "white",
    },
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
  editIconFab: {
    width: theme.spacing(2.5),
    height: theme.spacing(2.5),
    marginRight: "7.5px",
  },
  editIconButton: {
    // marginRight: "10px",
    marginRight: "0px",
    backgroundColor: theme.palette.primary.main,
    color: "white",
    "&:focus, &:hover": {
      backgroundColor: "white",
      color: theme.palette.primary.main,
    },
  },
  redFlagIcon: {
    color: theme.palette.error.dark,
    fontSize: "1.2em",
    [theme.breakpoints.down("xs")]: {
      fontSize: "1em",
    },
    stroke: theme.palette.text.secondary,
    strokeWidth: "0.6px",
    strokeLinejoin: "round",
  },
  flagIcon: {
    color: theme.palette.text.secondary,
    fontSize: "1.2em",
    [theme.breakpoints.down("xs")]: {
      fontSize: "1em",
    },
  },
  hide400Down: {
    [theme.breakpoints.down(400)]: {
      display: "none!important",
    },
  },
  hide401Up: {
    [theme.breakpoints.up(401)]: {
      display: "none!important",
    },
  },
  mobileCustomFontSize400Down: {
    [theme.breakpoints.down(400)]: {
      fontSize: "0.8rem",
    },
  },
  questionIconMargin: {
    margin: "8px 20px 8px 0",
    [theme.breakpoints.down(400)]: {
      margin: "8px 8px 8px 0",
    },
  },
  dividerColor: {
    backgroundColor: theme.palette.primary.main,
  },
  emptyDescription: {
    padding: "8px 0",
    [theme.breakpoints.down("xs")]: {
      margin: "20px",
    },
  },
}));

function GradeButton(props) {
  const classes = useStyles();
  const { studentId, classId, assessmentId, assessmentType } = props;

  return (
    <Link
      to={{
        pathname:
          assessmentType === "Kuis"
            ? `/lihat-jawaban-kuis/${assessmentId}`
            : `/lihat-jawaban-ujian/${assessmentId}`,
        state: {
          classId,
          studentId,
        },
      }}
    >
      <Hidden xsDown>
        <Button
          variant="contained"
          startIcon={<EditIcon />}
          className={classes.editIconButton}
        >
          Periksa
        </Button>
      </Hidden>
      <Hidden smUp>
        <Button
          size="small"
          variant="contained"
          startIcon={<EditIcon />}
          className={classes.editIconButton}
        >
          Periksa
        </Button>
      </Hidden>
    </Link>
  );
}

function SubmittedAssessmentList(props) {
  const classes = useStyles();

  const { getOneAssessment, getAllClass, getStudents, getAllSubjects } = props;
  const { all_students, user } = props.auth;
  const { all_classes } = props.classesCollection;
  const { all_subjects_map } = props.subjectsCollection;
  const { selectedAssessments } = props.assessmentsCollection;
  const assessment_id = props.match.params.id;

  const [value, setValue] = React.useState(0);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("name");

  // If there is no suspects, this state will contain an empty array.
  const [suspects, setSuspects] = React.useState(null);

  React.useEffect(() => {
    getOneAssessment(assessment_id);
    getStudents(user.unit);
    getAllClass(user.unit);
    getAllSubjects(user.unit, "map");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    if (Object.keys(selectedAssessments).length !== 0) {
      setSuspects(selectedAssessments.suspects);
    }
  }, [selectedAssessments]);

  const rows = React.useRef([]);
  // Thi will save objects that has student's id and name (1 object = 1 student) for every student that get this assessment.

  function createData(_id, name) {
    return { _id, name };
  }

  const assessmentRowItem = (data) => {
    let newRows = rows.current;
    newRows.push(createData(data._id, data.name));

    rows.current = newRows;
  };

  const handleOpenSortMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseSortMenu = () => {
    setAnchorEl(null);
  };

  const createSortHandler = (property) => (event) => {
    handleRequestSort(event, property);
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const headCells = [
    { id: "name", numeric: false, disablePadding: true, label: "Nama Murid" },
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

  let temp = new Map();
  if (all_classes.length) {
    all_classes.map((kelas) => temp.set(kelas._id, kelas));
  }

  const listClassTab = () => {
    let class_assigned = [];
    if (!selectedAssessments.class_assigned) {
      return null;
    } else {
      if (temp.size) {
        for (var i = 0; i < selectedAssessments.class_assigned.length; i++) {
          class_assigned.push(
            <Tab
              label={
                !temp.get(selectedAssessments.class_assigned[i])
                  ? null
                  : temp.get(selectedAssessments.class_assigned[i]).name
              }
              {...TabIndex(i)}
            />
          );
        }
        return (
          <Tabs
            value={value}
            variant="scrollable"
            scrollButtons="on"
            onChange={handleChange}
            indicatorColor="primary"
            textColor="primary"
          >
            {class_assigned}
          </Tabs>
        );
      }
    }
  };

  const handleFlag = (e, studentId) => {
    e.stopPropagation();
    let newSuspects = [...suspects];
    let index = newSuspects.indexOf(studentId);
    if (index > -1) {
      newSuspects.splice(index, 1);
    } else {
      newSuspects.push(studentId);
    }
    updateAssessmentSuspects(assessment_id, newSuspects).then(() => {
      setSuspects(newSuspects);
    });
  };

  const handleExportAssessment = () => {
    let result = "";
    let classArray = [];
    selectedAssessments.class_assigned.forEach((kelas, i) => {
      let className = all_classes.find((cls) => cls._id === kelas).name;
      if (i !== 0) {
        result = result + ",";
      }
      result = result + className;
      if (i !== selectedAssessments.class_assigned.length - 1) {
        result = result + ",";
      }
      classArray.push([kelas]);
    });

    let gradeKeys = Object.keys(selectedAssessments.grades);
    let gradeValues = Object.values(selectedAssessments.grades);
    gradeKeys.forEach((student_id, i) => {
      let studentData = all_students.find((std) => std._id === student_id);
      let studentName = studentData.name;
      let studentClass = studentData.kelas;
      for (let j = 0; j < classArray.length; j++) {
        if (classArray[j][0] === studentClass) {
          classArray[j].push({
            studentName: studentName,
            studentScore: gradeValues[i].total_grade,
          });
          break;
        }
      }
    });

    let classLength = [];
    for (let i = 0; i < classArray.length; i++) {
      classLength.push(classArray[i].length);
    }
    let maxClassLength = Math.max(...classLength) - 1;

    for (let i = 0; i < maxClassLength; i++) {
      result = result + "\n";
      for (let j = 0; j < classArray.length; j++) {
        if (j !== 0) {
          result = result + ",";
        }
        if (i + 1 < classArray[j].length) {
          result = result + classArray[j][i + 1].studentName;
          result = result + ",";
          result = result + classArray[j][i + 1].studentScore;
        }
        if (i + 1 >= classArray[j].length) {
          result = result + ",";
        }
      }
    }

    const blob = new Blob([result], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.setAttribute("hidden", "");
    a.setAttribute("href", url);
    a.setAttribute("download", `Hasil ${selectedAssessments.name}.csv`);
    a.click();
  };

  const listClassTabPanel = () => {
    let TabPanelList = [];
    if (!selectedAssessments.class_assigned || !all_students) {
      return null;
    } else {
      // It is assumed that if selectedAssessments.class_assigned already exist,
      // selectedAssessments is already exist then selectedAssessments.questions and selectedAssessments.question_weight is also already exist.
      let types = new Set();
      for (
        let questionIdx = 0;
        questionIdx < selectedAssessments.questions.length;
        questionIdx++
      ) {
        types.add(selectedAssessments.questions[questionIdx].type);
        if (types.size === 4) {
          break;
        }
      }
      let hasLongtextQuestion = types.has("longtext");

      const scoresTemplate = {
        radio: {
          totalpoint: 0,
          totalweight: 0,
        },
        checkbox: {
          totalpoint: 0,
          totalweight: 0,
        },
        shorttext: {
          totalpoint: 0,
          totalweight: 0,
        },
        longtext: {
          totalpoint: null,
          totalweight: hasLongtextQuestion
            ? Object.values(
                selectedAssessments.question_weight.longtext
              ).reduce((sum, currentVal) => {
                return sum + currentVal;
              })
            : null,
        },
      };

      const columnTemplate = {
        radio: {
          root: classes.RadioQst,
          text: <b>Pilihan Ganda</b>,
          icon: <RadioButtonCheckedIcon />,
        },
        checkbox: {
          root: classes.CheckboxQst,
          text: <b>Kotak Centang</b>,
          icon: <CheckBoxIcon />,
        },
        shorttext: {
          root: classes.ShorttextQst,
          text: <b>Isian Pendek</b>,
          icon: <TextFormatIcon />,
        },
        longtext: {
          root: classes.LongtextQst,
          text: <b>Uraian</b>,
          icon: <SubjectIcon />,
        },
      };

      for (var i = 0; i < selectedAssessments.class_assigned.length; i++) {
        let students_in_class = [];
        let isClassSubmissionEmpty = true;

        let all_student_object = {}; // Will save every student that get this assessment.
        rows.current = []; // Will save object that has student's id and name  (1 object = 1 student) for all student that get this assessment.

        for (var j = 0; j < all_students.length; j++) {
          // If this student get this assessment,
          if (all_students[j].kelas === selectedAssessments.class_assigned[i]) {
            let student = all_students[j];

            assessmentRowItem(student);
            all_student_object[student._id] = student;
          }
        }

        let sortedRows = stableSort(
          rows.current,
          getComparator(order, orderBy)
        );

        // For every student,
        for (let row of sortedRows) {
          let student = all_student_object[row._id];
          let scores = null;
          let isAllEssayGraded = false;

          // If the student has done this assessment,
          if (
            selectedAssessments.submissions &&
            selectedAssessments.submissions[student._id]
          ) {
            // Needs to deep cloning. This object will be used to save score of every question.
            scores = JSON.parse(JSON.stringify(scoresTemplate));

            if (hasLongtextQuestion) {
              if (
                selectedAssessments.grades &&
                selectedAssessments.grades[student._id]
              ) {
                // If every answer has already been graded, then show the score.
                // This is enough because it is assumed that every long text question weight is ensured exist.
                if (
                  Object.keys(
                    selectedAssessments.grades[student._id].longtext_grades
                  ).length ===
                  Object.keys(selectedAssessments.question_weight.longtext)
                    .length
                ) {
                  isAllEssayGraded = true;

                  // Sums all longtext queestion for this student.
                  scores.longtext.totalpoint = Object.values(
                    selectedAssessments.grades[student._id].longtext_grades
                  ).reduce((sum, currentVal) => sum + currentVal);
                } // If not, scores.longtext.totalpoint will still has the value of null (shows not graded message).
              }
            }

            let weights = selectedAssessments.question_weight;
            // For every question in this assessment,
            for (
              let questionIdx = 0;
              questionIdx < selectedAssessments.questions.length;
              questionIdx++
            ) {
              let questionType =
                selectedAssessments.questions[questionIdx].type;
              let questionAnswer =
                selectedAssessments.questions[questionIdx].answer;
              let studentAnswer =
                selectedAssessments.submissions[student._id][questionIdx];

              if (studentAnswer.length !== 0) {
                // If student answer this question, then count the score for this question.
                if (questionType === "radio") {
                  if (questionAnswer[0] === studentAnswer[0]) {
                    scores.radio.totalpoint += 1 * weights.radio;
                  }

                  scores.radio.totalweight += 1 * weights.radio;
                } else if (questionType === "checkbox") {
                  let temp_correct = 0;

                  studentAnswer.forEach((answer) => {
                    if (questionAnswer.includes(answer)) {
                      temp_correct += 1;
                    } else {
                      temp_correct -= 2;
                    }
                  });

                  if (temp_correct > 0) {
                    scores.checkbox.totalpoint +=
                      (weights.checkbox * temp_correct) / questionAnswer.length;
                  }

                  scores.checkbox.totalweight += 1 * weights.checkbox;
                } else if (questionType === "shorttext") {
                  let temp_correct = 0;
                  for (
                    let answerIdx = 0;
                    answerIdx < questionAnswer.length;
                    answerIdx++
                  ) {
                    if (
                      questionAnswer[answerIdx] === studentAnswer[answerIdx]
                    ) {
                      temp_correct++;
                    }
                  }

                  scores.shorttext.totalpoint +=
                    (weights.shorttext * temp_correct) / questionAnswer.length;
                  scores.shorttext.totalweight += 1 * weights.shorttext;
                }
                // Long text question is not checked.
              } else {
                // If student didn't answer this question, then get a zero score.
                if (questionType === "radio") {
                  scores.radio.totalweight += 1 * weights.radio;
                } else if (questionType === "checkbox") {
                  scores.checkbox.totalweight += 1 * weights.checkbox;
                } else if (questionType === "shorttext") {
                  scores.shorttext.totalweight += 1 * weights.shorttext;
                }
              }
            }
          } // If student didn't do this assessment, his/her score will be null.

          // layar desktop
          let columns1 = [];
          // layar mobile
          let columns2 = [];

          if (scores) {
            // jika murid mengerjakan assessment ini, scores akan berisi nilai murid
            let c = 0; // digunakan untuk menambahkan divider di antara elemen tipe soal
            for (let typeArray of types.entries()) {
              let type = typeArray[0]; //isi array ini ada 2, dua-duanya nilainya sama, yaitu tipe soal
              // layar desktop
              columns1.push(
                <Grid
                  container
                  item
                  xs={3}
                  spacing="1"
                  wrap="nowrap"
                  direction="column"
                  justify="space-between"
                  alignItems="center"
                >
                  <Grid item>
                    <IconButton
                      disabled
                      classes={{
                        root: columnTemplate[type].root,
                        disabled: classes.disabled,
                      }}
                    >
                      {columnTemplate[type].icon}
                    </IconButton>
                  </Grid>
                  <Grid item>
                    <Typography align="center">
                      {columnTemplate[type].text}
                    </Typography>
                  </Grid>
                  <Grid item>
                    <Typography>
                      {type === "longtext"
                        ? isAllEssayGraded
                          ? `${scores[type].totalpoint}/${scores[type].totalweight}`
                          : "Belum dinilai"
                        : `${Number(scores[type].totalpoint.toFixed(1))}/${
                            scores[type].totalweight
                          }`}
                    </Typography>
                  </Grid>
                </Grid>
              );

              // layar mobile
              columns2.push(
                <Grid container style={{ padding: "0 20px" }}>
                  <Grid item className={classes.questionIconMargin}>
                    <IconButton
                      size="small"
                      disabled
                      classes={{
                        root: columnTemplate[type].root,
                        disabled: classes.disabled,
                      }}
                    >
                      {columnTemplate[type].icon}
                    </IconButton>
                  </Grid>
                  <Grid
                    item
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      flexGrow: "1",
                    }}
                    justify="center"
                  >
                    <Typography
                      align="left"
                      className={classes.mobileCustomFontSize400Down}
                    >
                      {/* {columnTemplate[type].text2} */}
                      {columnTemplate[type].text}
                    </Typography>
                  </Grid>
                  <Grid
                    item
                    style={{ display: "flex", flexDirection: "column" }}
                    justify="center"
                  >
                    <Typography className={classes.mobileCustomFontSize400Down}>
                      {type === "longtext"
                        ? isAllEssayGraded
                          ? `${scores[type].totalpoint}/${scores[type].totalweight}`
                          : "Belum dinilai"
                        : `${Number(scores[type].totalpoint.toFixed(1))}/${
                            scores[type].totalweight
                          }`}
                    </Typography>
                  </Grid>
                </Grid>
              );
              // jika elemen ini bukan elemen terakhir pada set type, tambahkan divider
              if (c + 1 < types.size) {
                columns1.push(<Divider orientation="vertical" flexItem />);
                columns2.push(<Divider />);
              }
              c++;
            }

            isClassSubmissionEmpty = false;
          } else {
            let content = (
              <Typography
                variant="subtitle1"
                color="textSecondary"
                align="center"
                className={classes.emptyDescription}
              >
                Belum mengerjakan
              </Typography>
            );
            columns1.push(content);
            columns2.push(content);
          }

          students_in_class.push(
            <ExpansionPanel>
              <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                <ListItem className={classes.personListContainer}>
                  <ListItemAvatar>
                    {!student.avatar ? (
                      <Avatar style={{ marginRight: "10px" }} />
                    ) : (
                      <Avatar
                        src={`/api/upload/avatar/${student.avatar}`}
                        style={{ marginRight: "10px" }}
                      />
                    )}
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Typography variant="h6">{student.name}</Typography>
                    }
                    secondary={
                      selectedAssessments.grades &&
                      selectedAssessments.grades[student._id] &&
                      selectedAssessments.grades[student._id].total_grade ? (
                        <>
                          Telah Dinilai
                          <br />
                          Waktu Pengumpulan:&nbsp;
                          <Hidden smUp>
                            <br />
                          </Hidden>
                          {moment(
                            selectedAssessments.submissions_timestamp[
                              student._id
                            ]
                          )
                            .locale("id")
                            .format("DD MMM YYYY, HH:mm")}
                        </>
                      ) : (
                        <>
                          Belum Dinilai
                          {scores ? (
                            <>
                              <br />
                              Waktu Pengumpulan:&nbsp;
                              <Hidden smUp>
                                <br />
                              </Hidden>
                              {moment(
                                selectedAssessments.submissions_timestamp[
                                  student._id
                                ]
                              )
                                .locale("id")
                                .format("DD MMM YYYY, HH:mm")}
                            </>
                          ) : null}
                        </>
                      )
                    }
                  />
                  {selectedAssessments.grades &&
                  selectedAssessments.grades[student._id] ? (
                    <div style={{ display: "flex" }}>
                      {hasLongtextQuestion ? (
                        isAllEssayGraded ? (
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              justifyContent: "center",
                            }}
                            class={classes.hide400Down}
                          >
                            <Grid item>
                              <Typography noWrap style={{ fontSize: "0.8em" }}>
                                <b>Total Nilai</b>
                              </Typography>
                            </Grid>
                            <Grid item>
                              <Typography variant="h5" align="right">
                                {
                                  selectedAssessments.grades[student._id]
                                    .total_grade
                                }
                              </Typography>
                            </Grid>
                          </div>
                        ) : null
                      ) : (
                        // jika tidak ada soal uraian, total nilai pasti sudah ada
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                          }}
                          class={classes.hide400Down}
                        >
                          <Grid item>
                            <Typography noWrap style={{ fontSize: "0.8em" }}>
                              <b>Total Nilai</b>
                            </Typography>
                          </Grid>
                          <Grid item>
                            <Typography variant="h5" align="right">
                              {
                                selectedAssessments.grades[student._id]
                                  .total_grade
                              }
                            </Typography>
                          </Grid>
                        </div>
                      )}
                      <Grid item alignItem="center">
                        <Grid item>
                          <IconButton
                            onClick={(e) => {
                              handleFlag(e, student._id);
                            }}
                          >
                            {suspects.includes(student._id) ? (
                              <BsFlagFill className={classes.redFlagIcon} />
                            ) : (
                              <BsFlag className={classes.flagIcon} />
                            )}
                          </IconButton>
                        </Grid>
                      </Grid>
                    </div>
                  ) : // jika murid belum dinilai tapi sudah mengumpulkan jawaban assessment, tampilkan flag
                  selectedAssessments.submissions &&
                    selectedAssessments.submissions[student._id] ? (
                    <div style={{ display: "flex" }}>
                      <Grid item alignItem="center">
                        <Grid item>
                          <IconButton
                            onClick={(e) => {
                              handleFlag(e, student._id);
                            }}
                          >
                            {suspects.includes(student._id) ? (
                              <BsFlagFill className={classes.redFlagIcon} />
                            ) : (
                              <BsFlag className={classes.flagIcon} />
                            )}
                          </IconButton>
                        </Grid>
                      </Grid>
                    </div>
                  ) : null}
                </ListItem>
              </ExpansionPanelSummary>
              <Divider />

              <Hidden xsDown>
                <Grid container style={{ padding: "20px" }} justify="center">
                  {columns1}
                </Grid>
              </Hidden>
              <Hidden smUp>{columns2}</Hidden>

              <Divider />
              {selectedAssessments.submissions &&
              selectedAssessments.submissions[student._id] ? (
                <div>
                  <Grid
                    container
                    style={{ padding: "20px" }}
                    justify="flex-end"
                    alignItems="center"
                  >
                    {hasLongtextQuestion ? (
                      isAllEssayGraded ? (
                        <div
                          style={{ display: "flex" }}
                          class={classes.hide401Up}
                        >
                          <Grid
                            item
                            style={{ display: "flex" }}
                            alignItems="center"
                          >
                            <Typography noWrap style={{ marginRight: "8px" }}>
                              <b>Total Nilai</b>
                            </Typography>
                          </Grid>
                          <Grid
                            item
                            style={{ display: "flex" }}
                            alignItems="center"
                          >
                            <Typography
                              align="right"
                              style={{ marginRight: "16px" }}
                            >
                              {
                                selectedAssessments.grades[student._id]
                                  .total_grade
                              }
                            </Typography>
                          </Grid>
                        </div>
                      ) : null
                    ) : (
                      <div
                        style={{ display: "flex" }}
                        class={classes.hide401Up}
                      >
                        <Grid
                          item
                          style={{ display: "flex" }}
                          alignItems="center"
                        >
                          <Typography noWrap style={{ marginRight: "8px" }}>
                            <b>Total Nilai</b>
                          </Typography>
                        </Grid>
                        <Grid
                          item
                          style={{ display: "flex" }}
                          alignItems="center"
                        >
                          <Typography
                            align="right"
                            style={{ marginRight: "16px" }}
                          >
                            {
                              selectedAssessments.grades[student._id]
                                .total_grade
                            }
                          </Typography>
                        </Grid>
                      </div>
                    )}
                    <GradeButton
                      assessmentId={selectedAssessments._id}
                      assessmentType={selectedAssessments.type}
                      studentId={student._id}
                      classId={selectedAssessments.class_assigned[i]}
                    />
                  </Grid>
                </div>
              ) : null}
            </ExpansionPanel>
          );
        }

        TabPanelList.push(
          <TabPanel value={value} index={i}>
            {isClassSubmissionEmpty ? (
              <Grid
                container
                alignItems="center"
                justify="center"
                style={{ height: "20vh" }}
              >
                <Typography variant="h5" color="textSecondary" align="center">
                  {`Belum ada murid yang mengerjakan ${selectedAssessments.type.toLowerCase()}`}
                </Typography>
              </Grid>
            ) : (
              students_in_class
            )}
          </TabPanel>
        );
      }
    }
    return selectedAssessments.class_assigned.length > 0 ? TabPanelList : null;
  };

  document.title = `Schooly | Daftar ${selectedAssessments.type === "Kuis" ? "Kuis" : "Ujian"} Terkumpul`;

  return (
    <div className={classes.root}>
      <Paper className={classes.paperbox}>
        <Grid container spacing={2}>
          <Hidden smDown>
            <Grid item xs={12} style={{ paddingBottom: "0" }}>
              <Typography variant="h4">{selectedAssessments.name}</Typography>
            </Grid>

            <Grid item xs={12} md={7} spacing={8} style={{ paddingTop: "0" }}>
              <Typography variant="caption" color="textSecondary">
                <h6>{all_subjects_map.get(selectedAssessments.subject)}</h6>
              </Typography>
            </Grid>

            <Grid item xs={12} md={5} spacing={8} style={{ paddingTop: "0" }}>
              {/* h6 ditambahkan agar teks ini rata atas dengan teks nama mata pelajaran*/}
              <h6 style={{ marginBottom: "0" }}>
                <Typography align="right" variant="body2" color="textSecondary">
                  Mulai:{" "}
                  {moment(selectedAssessments.start_date)
                    .locale("id")
                    .format("DD MMM YYYY, HH:mm")}
                </Typography>
              </h6>
              <Typography align="right" variant="body2" color="textSecondary">
                Selesai:{" "}
                {moment(selectedAssessments.end_date)
                  .locale("id")
                  .format("DD MMM YYYY, HH:mm")}
              </Typography>
            </Grid>
          </Hidden>

          <Hidden mdUp>
            <Grid item xs={12}>
              <Typography variant="h4">{selectedAssessments.name}</Typography>
              <Typography variant="caption" color="textSecondary">
                <h6>{all_subjects_map.get(selectedAssessments.subject)}</h6>
              </Typography>
            </Grid>

            <Grid item xs={12} md={7} spacing={8}>
              <Typography variant="body2" color="textSecondary">
                Mulai:{" "}
                {moment(selectedAssessments.start_date)
                  .locale("id")
                  .format("DD MMM YYYY, HH:mm")}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Selesai:{" "}
                {moment(selectedAssessments.end_date)
                  .locale("id")
                  .format("DD MMM YYYY, HH:mm")}
              </Typography>
            </Grid>
          </Hidden>

          <Grid item xs={12}>
            <Divider className={classes.dividerColor} />
          </Grid>

          <Grid container item justify="flex-end" alignItems="center">
            <Link
              to={
                selectedAssessments.type === "Kuis"
                  ? `/lihat-jawaban-kuis/${selectedAssessments._id}`
                  : `/lihat-jawaban-ujian/${selectedAssessments._id}`
              }
            >
              <Fab size="medium" variant="extended" className={classes.editFab}>
                <EditIcon className={classes.editIconFab} />
                Periksa
              </Fab>
            </Link>

            <LightTooltip title={`Urutkan ${selectedAssessments.type}`}>
              <IconButton
                onClick={handleOpenSortMenu}
                className={classes.sortButton}
                style={{ marginRight: "3px" }}
              >
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
            <LightTooltip title={`Export Hasil ${selectedAssessments.type}`}>
              <IconButton
                onClick={handleExportAssessment}
                className={classes.sortButton}
              >
                <GetAppIcon />
              </IconButton>
            </LightTooltip>
          </Grid>
          <Grid item style={{ width: "100%", paddingBottom: "0" }}>
            {listClassTab()}
          </Grid>
        </Grid>
      </Paper>
      {/* jika selectedAssessment belum selesai diload, suspects akan bernilai null. Array kosong bernilai true*/}
      {suspects ? listClassTabPanel() : null}
    </div>
  );
}

SubmittedAssessmentList.propTypes = {
  auth: PropTypes.object.isRequired,
  getAllClass: PropTypes.func.isRequired,
  getStudents: PropTypes.func.isRequired,
  subjectsCollection: PropTypes.object.isRequired,
  getAllSubjects: PropTypes.func.isRequired,
  assessmentsCollection: PropTypes.object.isRequired,
  getOneAssessment: PropTypes.func.isRequired,
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
})(SubmittedAssessmentList);
