import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import moment from "moment";
import { Link } from "react-router-dom";
import { getOneAssessment, updateAssessmentSuspects } from "../../../actions/AssessmentActions";
import { getStudents } from "../../../actions/UserActions";
import { getAllClass } from "../../../actions/ClassActions";
import { getAllSubjects } from "../../../actions/SubjectActions";
import LightTooltip from "../../misc/light-tooltip/LightTooltip";
import {
  Avatar,
  Box,
  Button,
  Divider,
  ExpansionPanel,
  ExpansionPanelSummary,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Paper,
  Tabs,
  Tab,
  Typography,
  Grid,
  Hidden,
  Menu,
  MenuItem,
  TableSortLabel,
  IconButton,
  Fab
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { RadioButtonChecked, CheckBox, TextFormat, Subject } from "@material-ui/icons";
import SortIcon from "@material-ui/icons/Sort";
import EditIcon from "@material-ui/icons/Edit";
import { BsFlagFill, BsFlag } from "react-icons/bs";
// const path = require("path");

const useStyles = makeStyles((theme) => ({
  root: {
    margin: "auto",
    maxWidth: "1000px",
    padding: "10px",
  },
  // studentFileListContainer: {
  //   margin: "20px",
  // },
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
      backgroundColor: theme.palette.primary.fade,
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
  // downloadAllButton: {
  //   backgroundColor: theme.palette.primary.main,
  //   color: "white",
  //   "&:focus, &:hover": {
  //     backgroundColor: "white",
  //     color: theme.palette.primary.main
  //   }
  // },
  // downloadIconButton: {
  //   marginLeft: "5px",
  //   backgroundColor: theme.palette.primary.main,
  //   color: "white",
  //   "&:focus, &:hover": {
  //     backgroundColor: "white",
  //     color: theme.palette.primary.main,
  //   },
  // },
  // wordFileTypeIcon: {
  //   backgroundColor: "#16B0DD",
  // },
  // excelFileTypeIcon: {
  //   backgroundColor: "#68C74F",
  // },
  // imageFileTypeIcon: {
  //   backgroundColor: "#974994",
  // },
  // pdfFileTypeIcon: {
  //   backgroundColor: "#E43B37",
  // },
  // textFileTypeIcon: {
  //   backgroundColor: "#F7BC24",
  // },
  // presentationFileTypeIcon: {
  //   backgroundColor: "#FD931D",
  // },
  // otherFileTypeIcon: {
  //   backgroundColor: "#808080",
  // },
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
    "&$disabled": {
      boxShadow: theme.shadows[2],
      color: "white",
      backgroundColor: "#02AFF8"
    }
  },
  CheckboxQst: {
    "&$disabled": {
      boxShadow: theme.shadows[2],
      color: "white",
      backgroundColor: "#049F90"
    }
  },
  ShorttextQst: {
    "&$disabled": {
      boxShadow: theme.shadows[2],
      color: "white",
      backgroundColor: "#FD7D2E"
    }
  },
  LongtextQst: {
    "&$disabled": {
      boxShadow: theme.shadows[2],
      color: "white",
      backgroundColor: "#B2417C"
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
  editIconFab: {
    width: theme.spacing(3),
    height: theme.spacing(3),
    marginRight: "7.5px",
  },
  editIconButton: {
    // marginRight: "10px",
    backgroundColor: theme.palette.primary.main,
    color: "white",
    "&:focus, &:hover": {
      backgroundColor: "white",
      color: theme.palette.primary.main
    },
  },
  redFlagIcon: {
    color: theme.palette.error.main,
    fontSize: "1.6em",
    [theme.breakpoints.down("xs")]: {
      fontSize: "1em",
    },
    stroke: theme.palette.text.secondary,
    strokeWidth: "0.6px",
    strokeLinejoin: "round"
  },
  flagIcon: {
    color: theme.palette.text.secondary,
    fontSize: "1.6em",
    [theme.breakpoints.down("xs")]: {
      fontSize: "1em",
    },
  },
  hide400Down: {
    [theme.breakpoints.down(400)]: {
      display: "none!important",
    }
  },
  hide401Up: {
    [theme.breakpoints.up(401)]: {
      display: "none!important",
    }
  },
  mobileCustomFontSize400Down: {
    [theme.breakpoints.down(400)]: {
      fontSize: "0.8rem"
    }
  },
  questionIconMargin: {
    margin: "8px 20px 8px 0",
    [theme.breakpoints.down(400)]: {
      margin: "8px 8px 8px 0",
    }
  }
}));


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
  const { studentId, classId, assessmentId, assessmentType } = props;

  return (
    <Link to={{
      pathname: (assessmentType === "Kuis") ? `/lihat-jawaban-kuis/${assessmentId}` : `/lihat-jawaban-ujian/${assessmentId}`,
      state: {
        classId,
        studentId
      }
    }}>
      <Hidden xsDown>
        <Button
          variant="contained"
          startIcon={
            <EditIcon />
          }
          className={classes.editIconButton}
        >
          Periksa
        </Button>
      </Hidden>
      <Hidden smUp>
        <Button
          size="small"
          variant="contained"
          startIcon={
            <EditIcon />
          }
          className={classes.editIconButton}
        >
          Periksa
        </Button>
      </Hidden>
    </Link>
  )
}

function SubmittedAssessmentList(props) {
  const classes = useStyles();

  const { getOneAssessment, getAllClass, getStudents, getAllSubjects } = props;
  const { all_subjects_map } = props.subjectsCollection;
  const { selectedAssessments } = props.assessmentsCollection;
  const { all_classes } = props.classesCollection;
  const { all_students } = props.auth;
  const assessment_id = props.match.params.id;

  const [value, setValue] = React.useState(0);

  // jika tidak ada suspects, state ini akan bernilai array kosong
  const [suspects, setSuspects] = React.useState(null);
 
  React.useEffect(() => {
    getOneAssessment(assessment_id)
    getStudents()
    getAllClass()
    getAllSubjects("map")
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  React.useEffect(() => {
    if (Object.keys(selectedAssessments).length !== 0) {
      setSuspects(selectedAssessments.suspects);
    }
  }, [selectedAssessments])

  const [anchorEl, setAnchorEl] = React.useState(null);
  const [order, setOrder] = React.useState("desc");
  const [orderBy, setOrderBy] = React.useState("name");

  const rows = React.useRef([]);
  function createData(_id, name) {
    return { _id, name };
  }
  const assessmentRowItem = (data) => {
    let newRows = rows.current;
    newRows.push(
      createData(
        data._id,
        data.name,
      )
    )
    
    rows.current = newRows;
  }
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
    { id: "name", numeric: false, disablePadding: true, label: "Nama Murid" }
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

  let temp = new Map()
  if (all_classes.length) {
    all_classes.map((kelas) => temp.set(kelas._id, kelas))
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
  }

  const listClassTabPanel = () => {
    let TabPanelList = []
    if (!selectedAssessments.class_assigned || !all_students) {
      return null
    }
    else {
      // asumsi: jika selectedAssessments.class_assigned sudah ada, 
      // selectedAssessments pasti sudah ada sehingga selectedAssessments.questions dan selectedAssessments.question_weight juga pasti ada
      let types = new Set();
      for (let questionIdx = 0; questionIdx < selectedAssessments.questions.length; questionIdx++) {
        // tipe soal yg ada: ["radio", "checkbox", "shorttext", "longtext"];
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
          totalweight:
            (hasLongtextQuestion) ? (
              Object.values(selectedAssessments.question_weight.longtext).reduce((sum, currentVal) => { return (sum + currentVal) })
            ) : (
              null
            )
        }
      };

      const columnTemplate = {
        radio: {
          root: classes.RadioQst,
          text1: (<b>Pilihan Ganda</b>),
          // text2: (<b>Pilihan Ganda</b>),
          icon: (<RadioButtonChecked />)
        },
        checkbox: {
          root: classes.CheckboxQst,
          text1: (<b>Kotak Centang</b>),
          // text2: (<b>Kotak Centang</b>),
          icon: (<CheckBox />)
        },
        shorttext: {
          root: classes.ShorttextQst,
          text1: (<b>Isian Pendek</b>),
          // text2: (<b>Isian Pendek</b>),
          icon: (<TextFormat />)
        },
        longtext: {
          root: classes.LongtextQst,
          text1: (<b>Uraian</b>),
          // text2: (<b>Uraian</b>),
          icon: (<Subject />)
        }
      }

      for (var i = 0; i < selectedAssessments.class_assigned.length; i++) {
        let students_in_class = [];

        let all_student_object = {};
        rows.current = []
        for (var j = 0; j < all_students.length; j++) {
          if (all_students[j].kelas === selectedAssessments.class_assigned[i]) {
            let student = all_students[j];
            assessmentRowItem(student);
            all_student_object[student._id] = student;
          }
        }

        let sortedRows = stableSort(rows.current, getComparator(order, orderBy));
        for (let row of sortedRows) {
          // check if the id of the class is the same or not (means student is inside)
          let student = all_student_object[row._id];
          let scores = null;
          let isAllEssayGraded = false;
          // jika murid mengerjakan assessment ini
          if (selectedAssessments.submissions && selectedAssessments.submissions[student._id]) {
            // harus deep cloning
            scores = JSON.parse(JSON.stringify(scoresTemplate));

            if (hasLongtextQuestion) {
              if (selectedAssessments.grades && selectedAssessments.grades[student._id]) {

                // jika semua jawaban soal uraian sudah dinilai, tampilkan nilainya.
                // ini cukup karena asumsi: bobot setiap soal uraian sudah dipastikan ada.
                if (Object.keys(selectedAssessments.grades[student._id].longtext_grades).length === Object.keys(selectedAssessments.question_weight.longtext).length) {
                  isAllEssayGraded = true;
                  scores.longtext.totalpoint = Object.values(selectedAssessments.grades[student._id].longtext_grades).reduce((sum, currentVal) => (sum + currentVal));
                } // jika tidak, scores.longtext.totalpoint tetap bernilai null (tampilkan pesan belum dinilai)
              }
            }

            let weights = selectedAssessments.question_weight;
            for (let questionIdx = 0; questionIdx < selectedAssessments.questions.length; questionIdx++) {
              let questionType = selectedAssessments.questions[questionIdx].type;
              let questionAnswer = selectedAssessments.questions[questionIdx].answer;
              let studentAnswer = selectedAssessments.submissions[student._id][questionIdx];

              if (studentAnswer.length !== 0) {
                // jika murid menjawab soal ini

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
                    }
                    else {
                      temp_correct -= 2;
                    }
                  });

                  if (temp_correct > 0) {
                    scores.checkbox.totalpoint += weights.checkbox * temp_correct / questionAnswer.length;
                  }

                  scores.checkbox.totalweight += 1 * weights.checkbox;
                } else if (questionType === "shorttext") {
                  let temp_correct = 0;
                  for (let answerIdx = 0; answerIdx < questionAnswer.length; answerIdx++) {
                    if (questionAnswer[answerIdx] === studentAnswer[answerIdx]) {
                      temp_correct++;
                    }
                  }

                  scores.shorttext.totalpoint += weights.shorttext * temp_correct / questionAnswer.length;
                  scores.shorttext.totalweight += 1 * weights.shorttext;
                }
              } else {
                // jika murid ga menjawab soal ini

                if (questionType === "radio") {
                  scores.radio.totalweight += 1 * weights.radio;
                } else if (questionType === "checkbox") {
                  scores.checkbox.totalweight += 1 * weights.checkbox;
                } else if (questionType === "shorttext") {
                  scores.shorttext.totalweight += 1 * weights.shorttext;
                }
              }
            }
          } // jika murid tidak mengerjakan assessment ini, scores tetap = null

          // layar desktop
          let columns1 = [];
          // layar mobile
          let columns2 = [];
          if (scores) {
            let c = 0;
            for (let typeArray of types.entries()) {
              let type = typeArray[0]; //isi array ini ada 2, dua-duanya nilainya sama
              // layar desktop
              columns1.push(
                <Grid container item xs={3} spacing="1" wrap="nowrap" direction="column" justify="space-between" alignItems="center" >
                  <Grid item>
                    <IconButton disabled classes={{ root: columnTemplate[type].root, disabled: classes.disabled }}>
                      {columnTemplate[type].icon}
                    </IconButton>
                  </Grid>
                  <Grid item>
                    <Typography align="center">
                      {columnTemplate[type].text1}
                    </Typography>
                  </Grid>
                  <Grid item>
                    <Typography>
                      {(type === "longtext") ? (
                        (isAllEssayGraded) ? (
                          `${scores[type].totalpoint}/${scores[type].totalweight}`
                        ) : (
                            "Belum dinilai"
                          )
                      ) : (
                          `${Number(scores[type].totalpoint.toFixed(1))}/${scores[type].totalweight}`
                        )}
                    </Typography>
                  </Grid>
                </Grid>
              );

              // layar mobile
              columns2.push(
                <Grid container style={{ padding: "0 20px" }}>
                  <Grid item className={classes.questionIconMargin}>
                    <IconButton size="small" disabled classes={{ root: columnTemplate[type].root, disabled: classes.disabled }}>
                      {columnTemplate[type].icon}
                    </IconButton>
                  </Grid>
                  <Grid item style={{ display: "flex", flexDirection: "column", flexGrow: "1" }} justify="center">
                    <Typography align="left" className={classes.mobileCustomFontSize400Down}>
                      {/* {columnTemplate[type].text2} */}
                      {columnTemplate[type].text1}
                    </Typography>
                  </Grid>
                  <Grid item style={{ display: "flex", flexDirection: "column" }} justify="center">
                    <Typography className={classes.mobileCustomFontSize400Down}>
                      {(type === "longtext") ? (
                        (isAllEssayGraded) ? (
                          `${scores[type].totalpoint}/${scores[type].totalweight}`
                        ) : (
                            "Belum dinilai"
                          )
                      ) : (
                          `${Number(scores[type].totalpoint.toFixed(1))}/${scores[type].totalweight}`
                        )}
                    </Typography>
                  </Grid>
                </Grid>
              );
              // jika elemen ini bukan elemen terakhir pada set type, tambahkan divider
              if (c + 1 < types.size) {
                columns1.push(
                  <Divider orientation="vertical" flexItem />
                );
                columns2.push(
                  <Divider />
                )
              }
              c++;
            }
          } else {
            columns1.push(<Typography variant="h5" color="textSecondary">Belum mengerjakan</Typography>)
          }

          students_in_class.push(
            <ExpansionPanel>
              <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                <ListItem className={classes.personListContainer}>
                  <ListItemAvatar>
                    {!student.avatar ? <Avatar style={{ marginRight: "10px" }} /> :
                      <Avatar src={`/api/upload/avatar/${student.avatar}`} style={{ marginRight: "10px" }} />}
                  </ListItemAvatar>
                  <ListItemText primary={<Typography variant="h6">{student.name}</Typography>}
                    secondary={
                      (selectedAssessments.grades && (selectedAssessments.grades[student._id]) && (selectedAssessments.grades[student._id].total_grade)) ? (
                        "Telah Dinilai"
                      ) : (
                        "Belum Dinilai"
                      )} />
                  {(selectedAssessments.grades && selectedAssessments.grades[student._id]) ? (
                    <div style={{ display: "flex" }}>
                      {(hasLongtextQuestion) ? (
                        (isAllEssayGraded) ? (
                          <div style={{ display: "flex", flexDirection: "column", justifyContent: "center" }} class={classes.hide400Down}>
                            <Grid item>
                              <Typography noWrap style={{ fontSize: "0.8em" }}><b>Total Nilai</b></Typography>
                            </Grid>
                            <Grid item>
                              <Typography variant="h5" align="right">{selectedAssessments.grades[student._id].total_grade}</Typography>
                            </Grid>
                          </div>
                        ) : (
                          null
                        )
                      ) : ( // jika tidak ada soal uraian, total nilai pasti sudah ada
                          <div style={{ display: "flex", flexDirection: "column", justifyContent: "center" }} class={classes.hide400Down}>
                            <Grid item>
                              <Typography noWrap style={{ fontSize: "0.8em" }}><b>Total Nilai</b></Typography>
                            </Grid>
                            <Grid item>
                              <Typography variant="h5" align="right">{selectedAssessments.grades[student._id].total_grade}</Typography>
                            </Grid>
                          </div>
                        )}
                      <Grid item alignItem="center">
                        <Grid item>
                          <IconButton
                            onClick={(e) => { handleFlag(e, student._id) }}
                          >
                            {(suspects.includes(student._id)) ? (
                              <BsFlagFill className={classes.redFlagIcon} />
                            ) : (
                              <BsFlag className={classes.flagIcon} />
                            )}
                          </IconButton>
                        </Grid>
                      </Grid>
                    </div>
                  ) : (
                      // jika murid belum dinilai tapi sudah mengumpulkan jawaban assessment, tampilkan flag  
                    (selectedAssessments.submissions && selectedAssessments.submissions[student._id]) ? (
                      <div style={{ display: "flex" }}>
                        <Grid item alignItem="center">
                          <Grid item>
                            <IconButton
                              onClick={(e) => { handleFlag(e, student._id) }}
                            >
                              {(suspects.includes(student._id)) ? (
                                <BsFlagFill className={classes.redFlagIcon} />
                              ) : (
                                <BsFlag className={classes.flagIcon} />
                              )}
                            </IconButton>
                          </Grid>
                        </Grid>
                      </div>
                    ) : (
                      null
                    )
                    )}
                </ListItem>
              </ExpansionPanelSummary>
              <Divider />

              <Hidden xsDown>
                <Grid container style={{ padding: "20px" }} justify="center">
                  {columns1}
                </Grid>
              </Hidden>
              <Hidden smUp>
                {columns2}
              </Hidden>

              <Divider />
                {
                  (selectedAssessments.submissions && selectedAssessments.submissions[student._id]) ? (
                    <div>
                      <Grid container style={{ padding: "20px" }} justify="flex-end" alignItems="center" >
                        {
                        (hasLongtextQuestion) ? (
                          (isAllEssayGraded) ? (
                            <div style={{ display: "flex" }} class={classes.hide401Up}>
                              <Grid item style={{ display: "flex" }} alignItems="center">
                                <Typography noWrap style={{ marginRight: "8px" }} ><b>Total Nilai</b></Typography>
                              </Grid>
                              <Grid item style={{ display: "flex" }} alignItems="center">
                                <Typography align="right" style={{ marginRight: "16px" }}>{selectedAssessments.grades[student._id].total_grade}</Typography>
                              </Grid>
                            </div>
                          ) : (
                              null
                            )
                        ) : (
                            <div style={{ display: "flex" }} class={classes.hide401Up}>
                              <Grid item style={{ display: "flex" }} alignItems="center">
                                <Typography noWrap style={{ marginRight: "8px" }} ><b>Total Nilai</b></Typography>
                              </Grid>
                              <Grid item style={{ display: "flex" }} alignItems="center">
                                <Typography align="right" style={{ marginRight: "16px" }}>{selectedAssessments.grades[student._id].total_grade}</Typography>
                              </Grid>
                            </div>
                        )                          
                        }
                      <GradeButton 
                        assessmentId={selectedAssessments._id} 
                        assessmentType={selectedAssessments.type}
                        studentId={student._id} 
                        classId={selectedAssessments.class_assigned[i]} />
                    </Grid>
                  </div>
                  ) : (
                  null
                  )
                }
            </ExpansionPanel>
          )
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
      <Paper>        
        <Grid container spacing={2} className={classes.content}>
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
              <Typography variant="body2" color="textSecondary">
                Mulai: {moment(selectedAssessments.start_date).locale("id").format("DD MMM YYYY, HH:mm")}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Selesai: {moment(selectedAssessments.end_date).locale("id").format("DD MMM YYYY, HH:mm")}
              </Typography>
              <Typography color="primary" gutterBottom style={{ marginTop: "30px" }}>
                Deskripsi Kuis/Ujian:
              </Typography>
              <Typography align="justify">
                {selectedAssessments.description}
              </Typography>

              <Grid container item justify="flex-end" style={{ marginTop: "20px" }}>
                <Link to={(selectedAssessments.type === "Kuis") ? `/lihat-jawaban-kuis/${selectedAssessments._id}` : `/lihat-jawaban-ujian/${selectedAssessments._id}`}>
                  <Fab size="medium" variant="extended" className={classes.editFab}>
                    <EditIcon className={classes.editIconFab} />
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
            <Hidden smDown implementation="css">
              <Typography align="right" variant="body2" color="textSecondary">
                Mulai: {moment(selectedAssessments.start_date).locale("id").format("DD MMM YYYY, HH:mm")}
              </Typography>
              <Typography align="right" variant="body2" color="textSecondary">
                Selesai: {moment(selectedAssessments.end_date).locale("id").format("DD MMM YYYY, HH:mm")}
              </Typography>

              <Grid container item justify="flex-end" style={{ marginTop: "20px" }}>
                <Link to={(selectedAssessments.type === "Kuis") ? `/lihat-jawaban-kuis/${selectedAssessments._id}` : `/lihat-jawaban-ujian/${selectedAssessments._id}`}>
                  <Fab size="medium" variant="extended" className={classes.editFab}>
                    <EditIcon className={classes.editIconFab} />
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
          <Hidden smDown>
            <Grid item xs={12}>
              <Typography align="justify">
                {selectedAssessments.description}
              </Typography>
            </Grid>
          </Hidden>

        </Grid>
        {listClassTab()}
      </Paper>
      {/* jika selectedAssessment belum selesai diload, suspects akan bernilai null. Array kosong bernilai true*/}
      {(suspects) ? listClassTabPanel() : null}
    </div>
  )
};

SubmittedAssessmentList.propTypes = {
  auth: PropTypes.object.isRequired,
  assessmentsCollection: PropTypes.object.isRequired,
  subjectsCollection: PropTypes.object.isRequired,
  getOneAssessment: PropTypes.func.isRequired,
  getAllSubjects: PropTypes.func.isRequired,
  getAllClass: PropTypes.func.isRequired,
  getStudents: PropTypes.func.isRequired,
}

const mapStateToProps = (state) => ({
  auth: state.auth,
  assessmentsCollection: state.assessmentsCollection,
  subjectsCollection: state.subjectsCollection,
  classesCollection: state.classesCollection
})

export default connect(
  mapStateToProps, { getOneAssessment, getAllClass, getStudents, getAllSubjects }
)(SubmittedAssessmentList);