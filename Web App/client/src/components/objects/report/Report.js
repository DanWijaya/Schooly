import React from "react";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";
import { Bar, Radar } from "react-chartjs-2";
import PropTypes from "prop-types";
import "moment/locale/id";
import { getAllClass, setCurrentClass } from "../../../actions/ClassActions";
import { getAllSubjects } from "../../../actions/SubjectActions";
import {
  getStudentsByClass,
  getOneUser,
  refreshTeacher,
} from "../../../actions/UserActions";
import {
  getTasksBySubjectClass,
  getAllTask,
} from "../../../actions/TaskActions";
import {
  getAssessments,
  getAllAssessments,
} from "../../../actions/AssessmentActions";
import {
  Avatar,
  Divider,
  FormControl,
  Grid,
  Hidden,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableContainer,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@material-ui/core";
import {
  ArrowBackIos as ArrowBackIosIcon,
  ArrowForwardIos as ArrowForwardIosIcon,
  Assignment as AssignmentIcon,
  Assessment as AssessmentIcon,
} from "@material-ui/icons";
import { makeStyles } from "@material-ui/core/styles";
import { BsClipboardData } from "react-icons/bs";
import { FaClipboardList } from "react-icons/fa";

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
  header: {
    marginBottom: "25px",
  },
  headerIcon: {
    backgroundColor: theme.palette.primary.main,
    color: "white",
    fontSize: "20px",
  },
  content: {
    marginTop: "15px",
  },
  tableHeader: {
    backgroundColor: theme.palette.primary.main,
  },
  greyBackground: {
    display: "flex",
    alignItems: "center",
    textAlign: "center",
    justifyContent: "center",
    padding: "15px",
    backgroundColor: "#E3E5E5",
    width: "100%",
    height: "200px",
  },
  headerTableCell: {
    color: "white",
    borderRadius: "0",
    textAlign: "center",
  },
  personalReportBackground: {
    height: "225px",
    padding: "20px 50px",
    background: `linear-gradient(${theme.palette.primary.main} 70%, transparent 30%)`,
    backgroundRepeat: "no-repeat",
    [theme.breakpoints.down("sm")]: {
      padding: "15px",
    },
  },
  personalReportPaper: {
    padding: "15px",
  },
  personalReportAvatar: {
    width: "80px",
    height: "80px",
  },
}));

function ScoreGraph(props) {
  const { scores, workType, names, classes } = props;

  let label = [];
  for (let i = 0; i < scores.length; i++) {
    label.push(i + 1);
  }

  const state = {
    labels: label,
    datasets: [
      {
        label: [1, 2],
        backgroundColor: "#1976D2",
        borderColor: "rgba(0,0,0,0)",
        borderWidth: 2,
        data: scores,
        maxBarThickness: 60,
      },
    ],
  };

  return (
    <Bar
      data={state}
      options={{
        responsive: true,
        legend: {
          display: false,
          position: "right",
        },
        scales: {
          yAxes: [
            {
              id: "first-y-axis",
              type: "linear",
              ticks: {
                min: 0,
                max: 100,
              },
            },
          ],
        },
        tooltips: {
          callbacks: {
            label: function (tooltipItem, data) {
              var label = names[tooltipItem.index] || "";

              if (label) {
                label += ": ";
              }
              label += Math.round(tooltipItem.yLabel * 100) / 100;
              return label;
            },
          },
        },
      }}
    />
  );
}

function Report(props) {
  const classes = useStyles();
  const {
    getAllAssessments,
    getAllClass,
    getAllSubjects,
    getStudentsByClass,
    getAllTask,
    getOneUser,
    setCurrentClass,
    refreshTeacher,
  } = props;
  const { user, students_by_class, selectedUser, all_roles } = props.auth;
  const { all_classes, all_classes_map } = props.classesCollection;
  const { all_subjects_map, all_subjects } = props.subjectsCollection;
  const { all_tasks } = props.tasksCollection;
  const { all_assessments } = props.assessmentsCollection;

  const [rows, setRows] = React.useState([]); // This array element is an Object or Map which each contains the cell's value.
  const [headers, setHeaders] = React.useState([]); // The element is the name strings of column from table.

  const { name, _id } = selectedUser;
  const id = _id;

  const [kelas, setKelas] = React.useState("");

  React.useEffect(() => {
    const { id } = props.match.params;
    if (user.role === "Teacher") {
      if (id !== "semua") getOneUser(id);
      refreshTeacher(user._id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    if (selectedUser.kelas) {
      setCurrentClass(selectedUser.kelas);
    }
  }, [selectedUser]);

  React.useEffect(() => {
    if (props.classesCollection.kelas) {
      setKelas(props.classesCollection.kelas);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.classesCollection.kelas]);

  const countAllClassUpdate = React.useRef(0);
  const countMIDependencyUpdate = React.useRef(0);
  const countStdByClassUpdate = React.useRef(0);
  const countIRDependencyUpdate = React.useRef(0);

  const [valueKelas, setValueKelas] = React.useState(""); // Selected class.
  const [valueMatpel, setValueMatpel] = React.useState(""); // Selected subject.

  const [semuaMatpel, setSemuaMatpel] = React.useState(new Map());
  const [semuaKelas, setSemuaKelas] = React.useState(new Map());
  const [kontenKelas, setKontenKelas] = React.useState(new Map());
  const [kelasWali, setKelasWali] = React.useState(new Map());
  const [kontenMatpel, setKontenMatpel] = React.useState(new Map());

  const [isClassSelected, setIsClassSelected] = React.useState(false);
  const [isSubjectSelected, setIsSubjectSelected] = React.useState(false);

  const [emptyCondition, setEmptyCondition] = React.useState([]);

  // Graph
  const [graphType, setGraphType] = React.useState(0);
  const [graphSubject, setGraphSubject] = React.useState(null);

  const [allowedSubjectIndex, setAllowedSubjectIndex] = React.useState(null);

  React.useEffect(() => {
    if (
      allowedSubjectIndex === null &&
      all_subjects.length !== 0 &&
      Object.keys(kelas).length !== 0
    ) {
      let allowedIndexes = [];
      for (let i = 0; i < all_subjects.length; i++) {
        if (kelas.subject_assigned.includes(all_subjects[i]._id)) {
          allowedIndexes.push(i);
        }
      }
      setAllowedSubjectIndex(allowedIndexes);
      let randomNumber =
        allowedIndexes[Math.floor(Math.random() * allowedIndexes.length)];
      setGraphSubject(randomNumber);
    }
  }, [all_subjects]);

  function graphTask(subjectIndex) {
    if (all_subjects[subjectIndex]) {
      let subject = all_subjects[subjectIndex]._id;
      let subjectScores = [];
      let subjectNames = [];
      for (let i = 0; i < all_tasks.length; i++) {
        if (all_tasks[i].grades && all_tasks[i].subject === subject) {
          let keysArray = Object.keys(all_tasks[i].grades);
          let valuesArray = Object.values(all_tasks[i].grades);
          for (let j = 0; j < keysArray.length; j++) {
            if (keysArray[j] === user._id) {
              subjectScores.push(valuesArray[j]);
              subjectNames.push(all_tasks[i].name);
              break;
            }
          }
        }
      }
      if (subjectScores.length !== 0) {
        return (
          <ScoreGraph
            classes={classes}
            scores={subjectScores}
            names={subjectNames}
            workType="Tugas"
          />
        );
      } else return null;
    } else return null;
  }

  function graphAssessment(subjectIndex, type) {
    if (all_subjects[subjectIndex]) {
      let subject = all_subjects[subjectIndex]._id;
      let subjectScores = [];
      let subjectNames = [];
      if (type === "Kuis") {
        for (let i = 0; i < all_assessments.length; i++) {
          if (
            all_assessments[i].grades &&
            all_assessments[i].subject === subject &&
            all_assessments[i].type === "Kuis"
          ) {
            let keysArray = Object.keys(all_assessments[i].grades);
            let valuesArray = Object.values(all_assessments[i].grades);
            for (let j = 0; j < keysArray.length; j++) {
              if (keysArray[j] === user._id) {
                subjectScores.push(valuesArray[j].total_grade);
                subjectNames.push(all_assessments[i].name);
                break;
              }
            }
          }
        }
      } else if (type === "Ujian") {
        for (let i = 0; i < all_assessments.length; i++) {
          if (
            all_assessments[i].grades &&
            all_assessments[i].subject === subject &&
            all_assessments[i].type === "Ujian"
          ) {
            let keysArray = Object.keys(all_assessments[i].grades);
            let valuesArray = Object.values(all_assessments[i].grades);
            for (let j = 0; j < keysArray.length; j++) {
              if (keysArray[j] === user._id) {
                subjectScores.push(valuesArray[j].total_grade);
                subjectNames.push(all_assessments[i].name);
                break;
              }
            }
          }
        }
      }
      if (subjectScores.length !== 0) {
        return (
          <ScoreGraph
            classes={classes}
            scores={subjectScores}
            names={subjectNames}
            workType={type}
          />
        );
      } else return null;
    } else return null;
  }

  const changeGraphSubject = (workType, direction, subjectsLength) => {
    let currentIndex = allowedSubjectIndex.indexOf(graphSubject);
    let newIndex;

    if (direction === "Left") {
      if (currentIndex + 1 >= allowedSubjectIndex.length) {
        newIndex = 0;
      } else {
        newIndex = currentIndex + 1;
      }
    } else if (direction === "Right") {
      if (currentIndex - 1 < 0) {
        newIndex = allowedSubjectIndex.length - 1;
      } else {
        newIndex = currentIndex - 1;
      }
    }
    setGraphSubject(allowedSubjectIndex[newIndex]);
  };

  function createGraph() {
    let graph;
    let subject;
    const types = ["Tugas", "Kuis", "Ujian"];

    subject = showSubject(graphSubject);
    if (types[graphType] === "Tugas") {
      graph = graphTask(graphSubject);
    } else if (types[graphType] === "Kuis") {
      graph = graphAssessment(graphSubject, "Kuis");
    } else {
      graph = graphAssessment(graphSubject, "Ujian");
    }

    return (
      <div>
        <Grid item container justify="space-between" alignItems="center">
          <Grid item>
            <IconButton
              onClick={() => {
                if (graphType - 1 < 0) {
                  setGraphType(types.length - 1);
                } else {
                  setGraphType(graphType - 1);
                }
              }}
            >
              <ArrowBackIosIcon />
            </IconButton>
          </Grid>
          <Grid item>
            <Typography align="center">Nilai {types[graphType]} Anda</Typography>
          </Grid>
          <Grid item>
            <IconButton
              onClick={() => {
                setGraphType((graphType + 1) % types.length);
              }}
            >
              <ArrowForwardIosIcon />
            </IconButton>
          </Grid>
        </Grid>
        {graph === null ? (
          <div className={classes.greyBackground}>
            <Typography
              align="center"
              color="textSecondary"
            >
              Belum ada {types[graphType]} yang telah dinilai untuk mata
              pelajaran terkait
            </Typography>
          </div>
        ) : (
          graph
        )}
        <Grid item container justify="space-between" alignItems="center">
          <Grid item>
            <IconButton
              onClick={() => {
                if (graphSubject - 1 < 0) {
                  setGraphSubject(all_subjects.length - 1);
                } else {
                  setGraphSubject(graphSubject - 1);
                }
              }}
            >
              <ArrowBackIosIcon />
            </IconButton>
          </Grid>
          <Grid item>
            {subject}
          </Grid>
          <Grid item>
            <IconButton
              onClick={() => {
                setGraphSubject((graphSubject + 1) % all_subjects.length);
              }}
            >
              <ArrowForwardIosIcon />
            </IconButton>
          </Grid>
        </Grid>
      </div>
    );
  }

  function showSubject(subjectIndex) {
    if (all_subjects[subjectIndex]) {
      return (
        <Typography align="center">
          {all_subjects[subjectIndex].name}
        </Typography>
      );
    } else return null;
  }

  function generateKelasMenuItem() {
    let menuItems = [];
    if (kelasWali.size !== 0) {
      menuItems.push(
        <MenuItem key={kelasWali.get("id")} value={kelasWali.get("id")}>
          {kelasWali.get("name")} (Kelas Wali)
        </MenuItem>
      );
    }
    kontenKelas.forEach((namaKelas, idKelas) => {
      menuItems.push(
        <MenuItem key={idKelas} value={idKelas}>
          {namaKelas}
        </MenuItem>
      );
    });
    return menuItems;
  }

  function generateMatPelMenuItem() {
    let menuItems = [];
    kontenMatpel.forEach((namaMatPel, idMatPel) => {
      if (user.subject_teached.includes(idMatPel)) {
        menuItems.push(
          <MenuItem key={idMatPel} value={idMatPel}>
            {namaMatPel} (Subjek Ajar)
          </MenuItem>
        );
      } else {
        menuItems.push(
          <MenuItem key={idMatPel} value={idMatPel}>
            {namaMatPel}
          </MenuItem>
        );
      }
    });
    return menuItems;
  }

  // This is only used to make report table page when it is opened from sidedrawer.
  // argument type = Map (Map is used so the value cell order is mantained by the name order of the column).
  function generateRowCellFormat1(row) {
    let emptyCellSymbol = "-"; // if the cell is empty, returns "-".
    let cells = [];
    row.forEach((value, key) => {
      if (key !== "idMurid") {
        if (key === "namaMurid") {
          // Need "value !== undefined" because 0 equal to false.
          cells.push(
            <TableCell
              align="left"
              style={{ border: "1px solid rgba(224, 224, 224, 1)" }}
            >
              {value !== undefined ? value : emptyCellSymbol}
            </TableCell>
          );
        } else {
          cells.push(
            <TableCell
              align="center"
              style={{ border: "1px solid rgba(224, 224, 224, 1)" }}
            >
              {value !== undefined ? value : emptyCellSymbol}
            </TableCell>
          );
        }
      }
    });
    return <TableRow key={row.get("idMurid")}>{cells}</TableRow>;
  }

  // This is used to make report table page when it is opened from profile or profile view.
  // argument type = Object (Can use object because the order of column name and the number of column is fixed).
  function generateRowCellFormat2(row) {
    let trueSubject = false;
    let nonWaliView = false;
    if (kelasWali.get("id") === selectedUser.kelas) {
      if (kelas.subject_assigned) {
        for (let i = 0; i < all_subjects.length; i++) {
          if (
            kelas.subject_assigned.includes(all_subjects[i]._id) &&
            row.subject === all_subjects[i].name
          ) {
            trueSubject = true;
            break;
          }
        }
      }
    } else if (
      user.role === "Teacher" &&
      kelasWali.get("id") !== selectedUser.kelas
    ) {
      if (user.class_to_subject && user.class_to_subject[kelas._id]) {
        for (let i = 0; i < all_subjects.length; i++) {
          if (kelas.subject_assigned) {
            if (
              user.class_to_subject[kelas._id].includes(all_subjects[i]._id) &&
              row.subject === all_subjects[i].name
            ) {
              nonWaliView = true;
              break;
            }
          }
        }
      }
    } else if (user.role === "Student") {
      if (kelas.subject_assigned) {
        for (let i = 0; i < all_subjects.length; i++) {
          if (
            kelas.subject_assigned.includes(all_subjects[i]._id) &&
            row.subject === all_subjects[i].name
          ) {
            trueSubject = true;
            break;
          }
        }
      }
    }
    let emptyCellSymbol = "-"; // If cell is empty, returns "-".
    if (trueSubject || nonWaliView) {
      return (
        <TableRow key={row.subject}>
          <TableCell style={{ border: "1px solid rgba(224, 224, 224, 1)" }}>
            {row.subject}
          </TableCell>
          <TableCell
            align="center"
            style={{ border: "1px solid rgba(224, 224, 224, 1)" }}
          >
            {row.taskAvg !== null ? row.taskAvg : emptyCellSymbol}
          </TableCell>
          <TableCell
            align="center"
            style={{ border: "1px solid rgba(224, 224, 224, 1)" }}
          >
            {row.quizAvg !== null ? row.quizAvg : emptyCellSymbol}
          </TableCell>
          <TableCell
            align="center"
            style={{ border: "1px solid rgba(224, 224, 224, 1)" }}
          >
            {row.assessmentAvg !== null ? row.assessmentAvg : emptyCellSymbol}
          </TableCell>
        </TableRow>
      );
    }
  }

  function generateHeaderCellMatpel(nama) {
    if (nama === "Mata Pelajaran") {
      return (
        <TableCell style={{ color: "white", borderRadius: "0" }}>
          {nama}
        </TableCell>
      );
    } else {
      return (
        <TableCell style={{ color: "white", borderRadius: "0" }} align="center">
          {nama}
        </TableCell>
      );
    }
  }

  function generateHeaderMurid(headers, classes) {
    let gradeHeader = headers.slice(1);
    let row1 = (
      <TableRow style={{ border: "0" }}>
        <TableCell rowSpan={2} className={classes.headerTableCell}>
          {headers[0]}
        </TableCell>
        {gradeHeader.map((header) => {
          let icon;
          if (header.type === "tugas") {
            icon = <AssignmentIcon style={{ fontSize: "1rem" }} />;
          } else if (header.type === "ujian") {
            icon = <BsClipboardData style={{ fontSize: "1rem" }} />;
          } else if (header.type === "kuis") {
            icon = <FaClipboardList style={{ fontSize: "1rem" }} />;
          }
          return (
            <TableCell
              style={{ border: "0", padding: "16px 0 0 0" }}
              className={classes.headerTableCell}
            >
              {icon}
            </TableCell>
          );
        })}
      </TableRow>
    );
    let row2 = (
      <TableRow>
        {gradeHeader.map((header) => {
          return (
            <TableCell
              style={{ paddingTop: "0" }}
              className={classes.headerTableCell}
            >
              {header.name}
            </TableCell>
          );
        })}
      </TableRow>
    );
    return (
      <TableHead className={classes.tableHeader}>
        {row1}
        {row2}
      </TableHead>
    );
  }

  function generateEmptyMessage() {
    let message = [];
    if (emptyCondition.includes("noStudent")) {
      message.push(
        <Grid
          container
          alignItems="center"
          justify="center"
          style={{ height: "20vh" }}
        >
          <Typography variant="h5" color="textSecondary" align="center">
            Kelas ini tidak memiliki murid
          </Typography>
        </Grid>
      );
    }
    if (emptyCondition.includes("noGrade")) {
      message.push(
        <Grid
          container
          alignItems="center"
          justify="center"
          style={{ height: "20vh" }}
        >
          <Typography variant="h5" color="textSecondary" align="center">
            Belum ada tugas, kuis, atau ujian
          </Typography>
        </Grid>
      );
    }
    return message;
  }

  function resetContent() {
    setKontenKelas(semuaKelas);
    setKontenMatpel(semuaMatpel);
    setIsClassSelected(false);
    setIsSubjectSelected(false);
  }

  function handleKelasChange(event) {
    let selectedClassId = event.target.value;

    if (isSubjectSelected) {
      setValueKelas(selectedClassId);
      getStudentsByClass(selectedClassId); // This will makeuseEffect that depends on students_by_class called.
    } else {
      setValueKelas(selectedClassId);
      setIsClassSelected(true);
      setValueMatpel("");

      // If the teacher is a homeroom teacher and the class that is selected is the homeroom class of that teacher,
      if (kelasWali.size !== 0 && selectedClassId === kelasWali.get("id")) {
        setKontenMatpel(semuaMatpel);
      } else {
        // If the teacher is not a homeroom teacher or the class that is selected is not the homeroom class of that teacher,
        // Shows only the subjects that is teached to selected class.
        let matpel = new Map();
        if (user.class_to_subject && user.class_to_subject[selectedClassId]) {
          user.class_to_subject[selectedClassId].forEach((subjectId) => {
            matpel.set(subjectId, semuaMatpel.get(subjectId));
          });
        }
        setKontenMatpel(matpel);
      }
    }
  }

  function handleMatPelChange(event) {
    let selectedSubjectId = event.target.value;

    if (isClassSelected) {
      setValueMatpel(selectedSubjectId);
      getStudentsByClass(valueKelas); // This will makeuseEffect that depends on students_by_class called.
    } else {
      // If this teacher is a homeroom teacher
      let kelas = new Map();
      if (user.class_to_subject) {
        if (kelasWali.size !== 0) {
          if (user.subject_teached.includes(selectedSubjectId)) {
            for (let [classId, subjectIdArray] of Object.entries(
              user.class_to_subject
            )) {
              if (subjectIdArray.includes(selectedSubjectId)) {
                kelas.set(classId, semuaKelas.get(classId));
              }
            }
            kelas.delete(kelasWali.get("id")); // Need to be deleted because when generating class options, the homeroom class of this teacher is already added.
          } // If this teacher choose subject that is themself not teaching, they can only choose their homeroom class.
        } else {
          for (let [classId, subjectIdArray] of Object.entries(
            user.class_to_subject
          )) {
            if (subjectIdArray.includes(selectedSubjectId)) {
              kelas.set(classId, semuaKelas.get(classId));
            }
          }
        }
      }

      setKontenKelas(kelas);
      setValueMatpel(selectedSubjectId);
      setIsSubjectSelected(true);
      setValueKelas("");
    }
  }

  function handleIndividualReport() {
    let subjectArray = [];
    // handleIndividualReport is only called when role === "Student" atau role === "Teacher".
    if (role === "Student") {
      // subjectArray contains [{subject_id, subject_name},...]
      subjectArray = Array.from(
        all_subjects_map,
        ([subjectId, subjectName]) => ({ subjectId, subjectName })
      );
    } else {
      if (kelas) {
        // If the teacher is a homeroom teacher and the teacher opens a student's report from their homeroom class.
        if (kelasWali.size !== 0 && kelas._id === kelasWali.get("id")) {
          subjectArray = Array.from(
            all_subjects_map,
            ([subjectId, subjectName]) => ({ subjectId, subjectName })
          );
        } else {
          subjectArray = user.subject_teached.map((subjectTeachedId) => {
            return {
              subjectId: subjectTeachedId,
              subjectName: all_subjects_map.get(subjectTeachedId),
            };
          });
        }
      }
    }

    // Ensuring subjectArray is filled before it is processed.
    if (subjectArray.length !== 0) {
      let scores = {};
      // scores akan berisi {
      //   id_subject_1: {
      //     subject: nama_subject, totalTaskScore: , countTask: , totalKuisScore: , countKuis: , totalUjianScore: , countUjian:
      //   }, id_subject_2: {
      //     subject: nama_subject, totalTaskScore: , countTask: , totalKuisScore: , countKuis: , totalUjianScore: , countUjian:
      //   } ...
      // }
      subjectArray.forEach((bySubject) => {
        // bySubject.subjectId is subject's id.
        scores[bySubject.subjectId] = {
          subject: bySubject.subjectName,
          // totalTaskScore: undefined,
          countTask: 0,
          // totalKuisScore: undefined,
          countKuis: 0,
          // totalUjianScore: undefined,
          countUjian: 0,
        };
      });

      for (let task of all_tasks) {
        // id is the student's id.
        // task.grades is ensured not empty when there a new task is made so no need to check null or not anymore.
        if (
          Object.keys(scores).includes(task.subject) &&
          task.grades.constructor === Object &&
          Object.keys(task.grades).length !== 0 &&
          task.grades[id] !== undefined
        ) {
          if (!scores[task.subject].totalTaskScore) {
            scores[task.subject].totalTaskScore = task.grades[id];
          } else {
            scores[task.subject].totalTaskScore += task.grades[id];
          }
          scores[task.subject].countTask++;
        }
      }

      for (let assessment of all_assessments) {
        // id is the student's id.
        // (assessment.grades.constructor === Object) && (Object.keys(assessment.grades).length !== 0) actually is not needed,
        // because grades are ensured not empty. Check notes at assessment model for more information.
        if (
          Object.keys(scores).includes(assessment.subject) &&
          assessment.grades &&
          assessment.grades.constructor === Object &&
          Object.keys(assessment.grades).length !== 0 &&
          assessment.grades[id] !== undefined &&
          assessment.grades[id].total_grade !== null
        ) {
          if (assessment.type === "Kuis") {
            if (!scores[assessment.subject].totalKuisScore) {
              scores[assessment.subject].totalKuisScore =
                assessment.grades[id].total_grade;
            } else {
              scores[assessment.subject].totalKuisScore +=
                assessment.grades[id].total_grade;
            }
            scores[assessment.subject].countKuis++;
          } else {
            if (!scores[assessment.subject].totalUjianScore) {
              scores[assessment.subject].totalUjianScore =
                assessment.grades[id].total_grade;
            } else {
              scores[assessment.subject].totalUjianScore +=
                assessment.grades[id].total_grade;
            }
            scores[assessment.subject].countUjian++;
          }
        }
      }

      // Convert scores into only saves subject name and average grades, and save it to subjectScoreArray.
      let subjectScoreArray = [];
      subjectArray.forEach((bySubject) => {
        let sbjScore = scores[bySubject.subjectId];
        subjectScoreArray.push({
          subject: sbjScore.subject,
          taskAvg: sbjScore.totalTaskScore
            ? Math.round((sbjScore.totalTaskScore / sbjScore.countTask) * 10) /
              10
            : null,
          quizAvg: sbjScore.totalKuisScore
            ? Math.round((sbjScore.totalKuisScore / sbjScore.countKuis) * 10) /
              10
            : null,
          assessmentAvg: sbjScore.totalUjianScore
            ? Math.round(
                (sbjScore.totalUjianScore / sbjScore.countUjian) * 10
              ) / 10
            : null,
        });
      });
      return subjectScoreArray;
    } else {
      return [];
    }
  }

  // This is called after mounting is finished.
  // Add dependency "role" to take care of case where teacher who view a student's indivual report.
  // Click report button from sidedrawer.
  React.useEffect(() => {
    if (role !== all_roles.SUPER_ADMIN) {
      getAllClass(user.unit);
      getAllClass(user.unit, "map");
      getAllTask(user.unit);
      getAllAssessments(user.unit);
      getAllSubjects(user.unit);
      getAllSubjects(user.unit, "map");
      if (role === all_roles.STUDENT) {
        setKelasWali(new Map()); // so that setRows(handleIndividualReport()) is run, but no need to call getAllClass(user.unit).
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // To determine teacher's status (homeroom teacher or not) after all_classes is already obtained.
  React.useEffect(() => {
    countAllClassUpdate.current++;
    if (countAllClassUpdate.current === 2) {
      new Promise((resolve) => {
        resolve(
          all_classes.find((kelas) => {
            return kelas.walikelas === user._id;
          })
        );
      })
        .then((kelasWali) => {
          let infoKelasWali = new Map();
          // If the teacher is in their homeroom class, insert infoKelasWali with id dan class name of that class.
          if (kelasWali) {
            infoKelasWali.set("id", kelasWali._id);
            infoKelasWali.set("name", kelasWali.name);
          }
          return infoKelasWali;
        })
        .then((info) => {
          setKelasWali(info);
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [all_classes]);

  // Generate table content for individual student's report after the datas needed is already obtained.
  React.useEffect(() => {
    countIRDependencyUpdate.current++;
    if (countIRDependencyUpdate.current === 5) {
      setHeaders([
        "Mata Pelajaran",
        "Rata-Rata Nilai Tugas",
        "Rata-Rata Nilai Kuis",
        "Rata-Rata Nilai Ujian",
      ]);
      setRows(handleIndividualReport());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [all_tasks, all_subjects_map, kelasWali, all_assessments]);

  // Generate table content for report page that is opened from sidedrawer, after all the datas needed is already obtained.
  // getStudentsByClass is in Select handler function and will be called when the teacher already selected class and subject.
  // valueMatpel dan valueKelas is ensured not empty.
  React.useEffect(() => {
    countStdByClassUpdate.current++;
    if (countStdByClassUpdate.current === 2) {
      let headerNames = ["Nama Murid"];
      let condition = [];
      let hasGrade = false;

      // Contains: [ map_row_1, map_row_2, ... ]
      let newRows = [];
      // Contains: { id_student_1: map_row_1, id_student_2: map_row_2, ... }
      let newRowsObj = {};
      // content of map_row_n: Map { idMurid: id_student_1, namaMurid: nama_student, id_task_1: nilai, ... , id_kuis_1: nilai, ..., id_assessment_1: nilai, ... }

      students_by_class.forEach((stdInfo) => {
        let temp = new Map();

        temp.set("idMurid", stdInfo._id);
        temp.set("namaMurid", stdInfo.name);
        newRowsObj[stdInfo._id] = temp;
      });

      if (students_by_class.length === 0) {
        condition.push("noStudent");
      }

      const addScore = (items, type) => {
        if (items.length !== 0) {
          items.forEach((item) => {
            headerNames.push({
              name: item.name,
              type: type,
            });
          });
          hasGrade = true;

          if (type === "kuis" || type === "ujian") {
            students_by_class.forEach((stdInfo) => {
              items.forEach((item) => {
                if (
                  item.grades &&
                  item.grades[stdInfo._id] !== undefined &&
                  item.grades[stdInfo._id].total_grade !== null
                ) {
                  let grade =
                    Math.round(item.grades[stdInfo._id].total_grade * 10) / 10;
                  newRowsObj[stdInfo._id].set(item._id, grade);
                } else {
                  newRowsObj[stdInfo._id].set(item._id, undefined);
                }
              });
            });
          } else {
            students_by_class.forEach((stdInfo) => {
              items.forEach((item) => {
                if (item.grades && item.grades[stdInfo._id] !== undefined) {
                  let grade = Math.round(item.grades[stdInfo._id] * 10) / 10;
                  newRowsObj[stdInfo._id].set(item._id, grade);
                } else {
                  newRowsObj[stdInfo._id].set(item._id, undefined);
                }
              });
            });
          }
        } // If items are empty, hasGrade will remain have a false value.
      };

      getTasksBySubjectClass(valueMatpel, valueKelas)
        .then((taskArray) => {
          addScore(taskArray, "tugas");
        })
        .then(() => {
          return getAssessments("Kuis", valueMatpel, valueKelas)
            .then((kuisArray) => {
              addScore(kuisArray, "kuis");
            })
            .catch((err) => {
              console.log(err);
            });
        })
        .then(() => {
          return getAssessments("Ujian", valueMatpel, valueKelas)
            .then((ujianArray) => {
              addScore(ujianArray, "ujian");
            })
            .catch((err) => {
              console.log(err);
            });
        })
        .then(() => {
          students_by_class.forEach((stdInfo) => {
            newRows.push(newRowsObj[stdInfo._id]);
          });
          setRows(newRows);

          if (!hasGrade) {
            condition.push("noGrade");
          }
          setEmptyCondition(condition);

          setHeaders(headerNames);
          resetContent();
        })
        .catch((err) => {
          console.log(err);
        });

      countStdByClassUpdate.current = 1; // Because the request need to be done over and over again.
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [students_by_class]);

  // Initialize select's menu item content, after setKelasWali, getAllClass(user.unit ,"map"), and getAllSubjects(user.unit, "map") is already runned.
  React.useEffect(() => {
    countMIDependencyUpdate.current++;
    if (countMIDependencyUpdate.current === 4) {
      new Promise((resolve) => {
        // To determine teacher's status: homeroom or not.
        let daftarMatpel = new Map();
        let daftarKelas = new Map();

        // To fill class list with every class this teacher is teaching.
        user.class_teached.forEach((classId) => {
          daftarKelas.set(classId, all_classes_map.get(classId).name);
        });

        if (kelasWali.size !== 0) {
          // If user is a homeroom teacher.
          // so that homeroon class won't whoe twice at the select's options.
          daftarKelas.delete(kelasWali.get("id"));

          // Fills subject list with every subject.
          all_subjects_map.forEach((subjectName, subjectId) => {
            daftarMatpel.set(subjectId, subjectName);
          });
        } else {
          // If user is not a homeroom teacher of any class, fills subject list with subject teached only.
          user.subject_teached.forEach((subjectId) => {
            daftarMatpel.set(subjectId, all_subjects_map.get(subjectId));
          });
        }
        resolve({ daftarKelas, daftarMatpel });
      })
        .then((hasil) => {
          setSemuaKelas(hasil.daftarKelas);
          setKontenKelas(hasil.daftarKelas);
          setSemuaMatpel(hasil.daftarMatpel);
          setKontenMatpel(hasil.daftarMatpel);
        })
        .catch((err) => {
          console.error(err);
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [kelasWali, all_classes_map, all_subjects_map]);

  // To view from sidedrawer teacher, reserve special code "semua".
  let role;
  if (props.match.params.id === "semua" && user.role === "Teacher") {
    role = "Other";
  } else if (props.match.params.id === "semua" && user.role !== "Teacher") {
    return <Redirect to="/tidak-ditemukan" />;
  } else {
    role = user.role;
  }

  document.title = "Schooly | Rapor";

  return (
    <div className={classes.root}>
      {role === "Student" ? (
        // Student report view from sidedrawer.
        <>
          <Grid
            container
            alignItems="center"
            spacing={2}
            className={classes.header}
          >
            <Grid item>
              <Avatar variant="rounded" className={classes.headerIcon}>
                <AssessmentIcon />
              </Avatar>
            </Grid>
            <Grid item>
              <Typography variant="h5" align="left">
                Rapor
              </Typography>
            </Grid>
          </Grid>
          <Divider />
          <Grid container spacing={4} className={classes.content}>
            <Grid item xs={12} md={8}>
              {createGraph()}
            </Grid>
            <Grid item xs={12} md={4}>
              Graph radar literally dari tabel bawah buat semua matpel juga
              dirata2in tapi tugas, kuis, ujiannya.
            </Grid>
            <Grid item xs={12}>
              <TableContainer component={Paper}>
                <Table size="medium" style={{ overflow: "hidden" }}>
                  <TableHead className={classes.tableHeader}>
                    <TableRow>
                      {headers.map((nama) => {
                        return generateHeaderCellMatpel(nama);
                      })}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {rows.map((row) => {
                      return generateRowCellFormat2(row);
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
          </Grid>
        </>
      ) : role === "Teacher" ? (
        // Teacher view a student's report.
        <Grid container direction="column" spacing={2}>
          <Grid item>
            <div className={classes.personalReportBackground}>
              <Grid container alignItems="center" spacing={3}>
                <Grid item>
                  <Avatar className={classes.personalReportAvatar} />
                </Grid>
                <Grid item xs container direction="column">
                  <Grid item>
                    <Typography variant="h6" style={{ color: "white" }}>
                      {name}
                    </Typography>
                  </Grid>
                  <Grid item>
                    <Typography style={{ color: "white" }}>
                      Rapor Tahun {new Date().getFullYear()}
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
              <Grid container spacing={2} style={{ marginTop: "20px" }}>
                <Grid item xs={6}>
                  <Paper className={classes.personalReportPaper}>
                    <Typography align="center">{kelas.name}</Typography>
                  </Paper>
                </Grid>
                <Grid item xs={6}>
                  <Paper className={classes.personalReportPaper}>
                    <Typography align="center">Wali Kelas</Typography>
                  </Paper>
                </Grid>
              </Grid>
            </div>
          </Grid>
          <Grid item container direction="column">
            <Grid item>
              <TableContainer component={Paper}>
                <Table
                  aria-label="simple table"
                  size="medium"
                  style={{ overflow: "hidden", paddingLeft: "5px" }}
                >
                  <TableHead className={classes.tableHeader}>
                    <TableRow>
                      {headers.map((nama) => {
                        return generateHeaderCellMatpel(nama);
                      })}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {rows.map((row) => {
                      return generateRowCellFormat2(row);
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
          </Grid>
        </Grid>
      ) : (
        // Teacher report view from sidedrawer.
        <>
          <Grid
            container
            alignItems="center"
            spacing={2}
            className={classes.header}
          >
            <Grid item>
              <Avatar variant="rounded" className={classes.headerIcon}>
                <AssessmentIcon />
              </Avatar>
            </Grid>
            <Grid item>
              <Typography variant="h5" align="left">
                Rapor
              </Typography>
            </Grid>
          </Grid>
          <Divider />
          <Grid container spacing={4} className={classes.content}>
            <Grid item xs={12}>
              <Typography gutterBottom>
                Pilih kelas dan mata pelajaran untuk menampilkan nilai
              </Typography>
              <Typography
                color="textSecondary"
                style={{ marginBottom: "30px" }}
              >
                Nilai yang dapat dilihat adalah hasil pekerjaan dari semua mata
                pelajaran dari kelas wali dan hasil pekerjaan dari mata
                pelajaran serta kelas yang diajar.
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth variant="outlined">
                    <InputLabel id="kelas-label">Kelas</InputLabel>
                    <Select
                      labelId="kelas-label"
                      id="kelas"
                      value={valueKelas}
                      onChange={(event) => {
                        handleKelasChange(event);
                      }}
                      label="Kelas"
                    >
                      {kontenKelas.size !== 0 || kelasWali.size !== 0
                        ? generateKelasMenuItem()
                        : null}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth variant="outlined">
                    <InputLabel id="matpel-label">Mata Pelajaran</InputLabel>
                    <Select
                      labelId="matpel-label"
                      id="matpel"
                      value={valueMatpel}
                      onChange={(event) => {
                        handleMatPelChange(event);
                      }}
                      label="Mata Pelajaran"
                    >
                      {kontenMatpel.size !== 0
                        ? generateMatPelMenuItem()
                        : null}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12}>
              {emptyCondition.length === 0 ? (
                <TableContainer component={Paper}>
                  {/* *** yang membedakan isi Hidden ini dengan yang bawah adalah
                      hanyalah batas jumlah kolom perubahan ukuran di props style komponen Table *** */}
                  <Hidden smDown>
                    <Table
                      aria-label="simple table"
                      style={
                        headers.length > 6
                          ? // jika jumlah kolom (termasuk kolom nama) sudah lebih dari batas ini, setiap kolom
                            // akan diberi ukuran fix yang sama
                            { tableLayout: "fixed" }
                          : { overflow: "hidden" }
                      }
                    >
                      <colgroup>
                        {headers[0] === "Nama Murid" ? ( // untuk memastikan isi state "header" sudah berubah ke format baru
                          headers.length > 6 ? (
                            // jika jumlah kolom (termasuk kolom nama) sudah lebih dari batas ini, setiap kolom
                            // akan diberi ukuran fix yang sama
                            headers.map((val, idx) => {
                              return (
                                <col
                                  style={{
                                    width: idx === 0 ? "200px" : "150px",
                                  }}
                                />
                              );
                            })
                          ) : (
                            // jika masih di bawah batas kolom, setiap kolom kecuali kolom pertama akan
                            // diberi lebar kolom sesuai isinya dan lebar tabel yang tersedia
                            <col style={{ width: "200px" }} />
                          )
                        ) : null}
                      </colgroup>

                      {headers[0] === "Nama Murid" // untuk memastikan isi state "header" sudah berubah ke format baru
                        ? generateHeaderMurid(headers, classes)
                        : null}
                      <TableBody>
                        {
                          // jika guru klik icon rapor side drawer ketika sedang melihat halaman rapor murid,
                          // isi elemen array "rows" ("rows" merupakan state) berubah dari Object menjadi Map.
                          rows.length !== 0 && rows[0].constructor === Map
                            ? rows.map((row) => {
                                return generateRowCellFormat1(row);
                              })
                            : null
                        }
                      </TableBody>
                    </Table>
                  </Hidden>
                  <Hidden mdUp>
                    <Table
                      aria-label="simple table"
                      style={
                        headers.length > 4
                          ? // jika jumlah kolom (termasuk kolom nama) sudah lebih dari batas ini, setiap kolom
                            // akan diberi ukuran fix yang sama
                            { tableLayout: "fixed" }
                          : { overflow: "hidden" }
                      }
                    >
                      <colgroup>
                        {headers[0] === "Nama Murid" ? ( // untuk memastikan isi state "header" sudah berubah ke format baru
                          headers.length > 4 ? (
                            // jika jumlah kolom (termasuk kolom nama) sudah lebih dari batas ini, setiap kolom
                            // akan diberi ukuran fix yang sama
                            headers.map((val, idx) => {
                              return (
                                <col
                                  style={{
                                    width: idx === 0 ? "200px" : "150px",
                                  }}
                                />
                              );
                            })
                          ) : (
                            // jika masih di bawah batas kolom, setiap kolom kecuali kolom pertama akan
                            // diberi lebar kolom sesuai isinya dan lebar tabel yang tersedia
                            <col style={{ width: "200px" }} />
                          )
                        ) : null}
                      </colgroup>

                      {headers[0] === "Nama Murid" // untuk memastikan isi state "header" sudah berubah ke format baru
                        ? generateHeaderMurid(headers, classes)
                        : null}
                      <TableBody>
                        {
                          // jika guru klik icon rapor side drawer ketika sedang melihat halaman rapor murid,
                          // isi elemen array "rows" ("rows" merupakan state) berubah dari Object menjadi Map.
                          rows.length !== 0 && rows[0].constructor === Map
                            ? rows.map((row) => {
                                return generateRowCellFormat1(row);
                              })
                            : null
                        }
                      </TableBody>
                    </Table>
                  </Hidden>
                </TableContainer>
              ) : (
                generateEmptyMessage()
              )}
            </Grid>
          </Grid>
        </>
      )}
    </div>
  );
}

Report.propTypes = {
  auth: PropTypes.object.isRequired,
  getOneUser: PropTypes.func.isRequired,
  match: PropTypes.object.isRequired,
  classesCollection: PropTypes.object.isRequired,
  setCurrentClass: PropTypes.func.isRequired,
  subjectsCollection: PropTypes.object.isRequired,
  tasksCollection: PropTypes.array.isRequired,
  assessmentsCollection: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  classesCollection: state.classesCollection,
  subjectsCollection: state.subjectsCollection,
  tasksCollection: state.tasksCollection,
  assessmentsCollection: state.assessmentsCollection,
});

export default connect(mapStateToProps, {
  getAllClass,
  getStudentsByClass,
  setCurrentClass,
  getOneUser,
  getAllSubjects,
  getAllTask,
  getAllAssessments,
  refreshTeacher,
})(Report);
