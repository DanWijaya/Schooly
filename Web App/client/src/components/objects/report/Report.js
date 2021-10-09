import React from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import { Bar } from "react-chartjs-2";
import PropTypes from "prop-types";
import "moment/locale/id";
import { getAllClass, setCurrentClass } from "../../../actions/ClassActions";
import { getAllSubjects } from "../../../actions/SubjectActions";
import { getStudentsByClass, getOneUser, refreshTeacher } from "../../../actions/UserActions";
import { getTasksBySubjectClass, getAllTask } from "../../../actions/TaskActions";
import { getAssessments, getAllAssessments } from "../../../actions/AssessmentActions";
import {
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
  Typography
} from "@material-ui/core";
import {
  ArrowBackIos as ArrowBackIosIcon,
  ArrowForwardIos as ArrowForwardIosIcon,
  Assignment as AssignmentIcon
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
  avatar: {
    margin: "auto",
    width: theme.spacing(20),
    height: theme.spacing(20),
  },
  profileDivider: {
    backgroundColor: theme.palette.primary.main,
    // margin: "15px 15px 5px 0px",
    marginTop: "15px",
  },
  informationPaper: {
    backgroundColor: theme.palette.primary.fade,
    padding: "25px",
  },
  name: {
    backgroundColor: theme.palette.primary.fade,
    padding: "5px",
    margin: "5px",
  },
  kelas: {
    backgroundColor: theme.palette.primary.fade,
  },
  informationPictureContainer: {
    display: "flex",
    justifyContent: "center",
    [theme.breakpoints.up("sm")]: {
      justifyContent: "flex-end",
    },
  },
  informationPicture: {
    height: "100px",
    [theme.breakpoints.up("sm")]: {
      height: "125px",
    },
  },
  profileDataItemAvatar: {
    backgroundColor: "#00B7FF",
  },
  emptyProfileData: {
    display: "flex",
    justifyContent: "center",
    maxWidth: "150px",
    padding: "5px",
    paddingLeft: "10px",
    paddingRight: "10px",
    backgroundColor: theme.palette.error.main,
    color: "white",
  },
  descriptionText: {
    color: "white",
    marginTop: "10px",
    marginLeft: "20px",
    fontWeight: "300",
    fontStyle: "italic",
  },
  background_gradient: {
    padding: "20px",
    background: "linear-gradient(to bottom right, #00b7ff, #2196F3, #00b7ff)",
  },
  tableHeader: {
    backgroundColor: theme.palette.primary.main,
  },
  graph: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    marginRight: "10px",
  },
  graphButtons: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: "10px",
    alignItems: "center",
    width: "20vw",
    [theme.breakpoints.down("sm")]: {
      width: "200px"
    }
  },
  greyBackground: {
    display: "flex",
    alignItems: "center",
    textAlign: "center",
    justifyContent: "center",
    padding: "15px",
    backgroundColor: "#E3E5E5",
    height: "21vw",
    width: "60vw",
    [theme.breakpoints.down("sm")]: {
      height:"200px",
    }
  },
  customMargin: {
    [theme.breakpoints.down("sm")]: {
      marginBottom: theme.spacing(3),
    },
  },
  headerTableCell: {
    color: "white",
    borderRadius: "0",
    textAlign: "center",
  },
  graphParentContainer: {
    position: "relative",
    height: "21vw",
    width: "60vw",
    [theme.breakpoints.down("sm")]: {
      height: "200px",
    },
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
    // A react-chart hyper-responsively and continuously fills the available
    // space of its parent element automatically
    <div className={classes.graphParentContainer}>
      <Bar
        responsive
        data={state}
        options={{
          maintainAspectRatio: false,
          title: {
            display: false,
            text: `Nilai ${workType} Anda`,
            fontSize: 20,
          },
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
          layout: {
            padding: {
              left: 0,
              right: 0,
              top: 0,
              bottom: 0,
            },
          },
        }}
      />
    </div>
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
    tasksCollection,
    getOneUser,
    setCurrentClass,
    refreshTeacher
  } = props;
  const { user, students_by_class, selectedUser } = props.auth;
  const { all_classes, all_classes_map } = props.classesCollection;
  const { all_subjects_map, all_subjects } = props.subjectsCollection;
  const allTaskArray = props.tasksCollection;
  const { all_assessments } = props.assessmentsCollection;

  const [rows, setRows] = React.useState([]); // elemen array ini adalah Object atau Map yang masing-masing key-value nya menyatakan nilai satu sel
  const [headers, setHeaders] = React.useState([]); // elemennya berupa string nama-nama kolom pada tabel

  const { name, _id } = selectedUser;
  const id = _id;

  const [kelas, setKelas] = React.useState("");

  React.useEffect(() => {
    getOneUser(props.match.params.id);
    if (user.role === "Teacher") {
      refreshTeacher(user._id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    setCurrentClass(selectedUser.kelas);
  }, [selectedUser]);

  React.useEffect(() => {
    setKelas(props.classesCollection.kelas);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.classesCollection.kelas]);

  const countAllClassUpdate = React.useRef(0);
  const countMIDependencyUpdate = React.useRef(0);
  const countStdByClassUpdate = React.useRef(0);
  const countIRDependencyUpdate = React.useRef(0);

  const [valueKelas, setValueKelas] = React.useState(""); // nama kelas yang sedang terpilih di Select
  const [valueMatpel, setValueMatpel] = React.useState(""); // nama matpel yang sedang terpilih di Select

  // const [valueKelas, setValueKelas] = React.useState("5f4760f98dccb3468ccc0ffc"); // dev
  // const [valueMatpel, setValueMatpel] = React.useState("5ee3443c10dea50651f0433e"); // dev

  // berisi semua matpel yang boleh diakses saat pertama kali memilih di Select matpel
  const [semuaMatpel, setSemuaMatpel] = React.useState(new Map());

  // berisi semua kelas yang ada di database (karena guru minimal mengajar 1 matpel dan setiap matpel diajar ke semua kelas)
  const [semuaKelas, setSemuaKelas] = React.useState(new Map());

  // berisi current menu item di Select.  key = idKelas, value = namaKelas
  // info kelas wali tidak akan pernah dimasukkan ke sini, kelas wali disimpan di state kelasWali
  const [kontenKelas, setKontenKelas] = React.useState(new Map());

  // alasan dipisahkan dengan semuaKelas: untuk menghindari pencarian info wali kelas dari banyak kelas.
  // isi kelasWali = Map {"id": <id kelas yang diwalikannya>, "name": <nama kelas yang diwalikannya>}
  const [kelasWali, setKelasWali] = React.useState(new Map());

  // berisi current menu item di Select. key = idMatpel, value = namaMatpel
  const [kontenMatpel, setKontenMatpel] = React.useState(new Map());

  const [isClassSelected, setIsClassSelected] = React.useState(false);
  const [isSubjectSelected, setIsSubjectSelected] = React.useState(false);

  // elemen array: (1) kode bahwa tidak ada murid dan (2) kode bahwa tidak ada task, kuis, dan assessment
  const [emptyCondition, setEmptyCondition] = React.useState([]);

  // Graph
  const [graphType, setGraphType] = React.useState(0);
  const [graphSubject, setGraphSubject] = React.useState(
    null
  );
  // const [taskGraphCurrentSubject, setTaskGraphCurrentSubject] = React.useState(
  //   null
  // );
  // const [quizGraphCurrentSubject, setQuizGraphCurrentSubject] = React.useState(
  //   null
  // );
  // const [examGraphCurrentSubject, setExamGraphCurrentSubject] = React.useState(
  //   null
  // );
  const [allowedSubjectIndex, setAllowedSubjectIndex] = React.useState(
    null
  );

  React.useEffect(() => {
    if (
      allowedSubjectIndex === null &&
      all_subjects.length !== 0 &&
      Object.keys(kelas).length !== 0
    ) {
      let allowedIndexes = [];
      for(let i=0;i<all_subjects.length;i++) {
        if(kelas.subject_assigned.includes(all_subjects[i]._id)) {
          allowedIndexes.push(i);
        }
      }
      setAllowedSubjectIndex(allowedIndexes)
      let randomNumber = allowedIndexes[Math.floor(Math.random() * allowedIndexes.length)];
      setGraphSubject(randomNumber);

      // if (
      //   taskGraphCurrentSubject === null &&
      //   all_subjects.length !== 0
      // ) {
      //   let randomNumber = allowedIndexes[Math.floor(Math.random() * allowedIndexes.length)];
      //   setTaskGraphCurrentSubject(randomNumber)
      // }
      // if (
      //   quizGraphCurrentSubject === null &&
      //   all_subjects.length !== 0
      // ) {
      //   let randomNumber = allowedIndexes[Math.floor(Math.random() * allowedIndexes.length)];
      //   setQuizGraphCurrentSubject(randomNumber)
      // }
      // if (
      //   examGraphCurrentSubject === null &&
      //   all_subjects.length !== 0
      // ) {
      //   let randomNumber = allowedIndexes[Math.floor(Math.random() * allowedIndexes.length)];
      //   setExamGraphCurrentSubject(randomNumber)
      // }
    }
  }, [all_subjects]);


  function graphTask(subjectIndex) {
    if (all_subjects[subjectIndex]) {
      let subject = all_subjects[subjectIndex]._id;
      let subjectScores = [];
      let subjectNames = [];
      for (let i = 0; i < tasksCollection.length; i++) {
        if (
          tasksCollection[i].grades &&
          tasksCollection[i].subject === subject
        ) {
          let keysArray = Object.keys(tasksCollection[i].grades);
          let valuesArray = Object.values(tasksCollection[i].grades);
          for (let j = 0; j < keysArray.length; j++) {
            if (keysArray[j] === user._id) {
              subjectScores.push(valuesArray[j]);
              subjectNames.push(tasksCollection[i].name);
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
      if(currentIndex + 1 >= allowedSubjectIndex.length) {
        newIndex = 0;
      } else {
        newIndex = currentIndex + 1;
      }
    } else if (direction === "Right") {
      if(currentIndex - 1 < 0) {
        newIndex = allowedSubjectIndex.length - 1;
      } else {
        newIndex = currentIndex - 1;
      }
    }
    setGraphSubject(allowedSubjectIndex[newIndex]);

    // if (workType === "Tugas") {
    //   let currentIndex = allowedSubjectIndex.indexOf(taskGraphCurrentSubject);
    //   if (direction === "Left") {
    //     let newIndex;
    //     if(currentIndex + 1 >= allowedSubjectIndex.length) {
    //       newIndex = 0;
    //     }
    //     else {
    //       newIndex = currentIndex + 1;
    //     }
    //     setTaskGraphCurrentSubject(allowedSubjectIndex[newIndex])
    //   } else if (direction === "Right") {
    //     let newIndex;
    //     if(currentIndex - 1 < 0) {
    //       newIndex = allowedSubjectIndex.length - 1;
    //     }
    //     else {
    //       newIndex = currentIndex - 1;
    //     }
    //     setTaskGraphCurrentSubject(allowedSubjectIndex[newIndex])
    //   }
    // } else if (workType === "Kuis") {
    //   let currentIndex = allowedSubjectIndex.indexOf(quizGraphCurrentSubject);
    //   if (direction === "Left") {
    //     let newIndex;
    //     if(currentIndex + 1 >= allowedSubjectIndex.length) {
    //       newIndex = 0;
    //     }
    //     else {
    //       newIndex = currentIndex + 1;
    //     }
    //     setQuizGraphCurrentSubject(allowedSubjectIndex[newIndex])
    //   } else if (direction === "Right") {
    //     let newIndex;
    //     if(currentIndex - 1 < 0) {
    //       newIndex = allowedSubjectIndex.length - 1;
    //     }
    //     else {
    //       newIndex = currentIndex - 1;
    //     }
    //     setQuizGraphCurrentSubject(allowedSubjectIndex[newIndex])
    //   }
    // } else if (workType === "Ujian") {
    //   let currentIndex = allowedSubjectIndex.indexOf(examGraphCurrentSubject);
    //   if (direction === "Left") {
    //     let newIndex;
    //     if(currentIndex + 1 >= allowedSubjectIndex.length) {
    //       newIndex = 0;
    //     }
    //     else {
    //       newIndex = currentIndex + 1;
    //     }
    //     setExamGraphCurrentSubject(allowedSubjectIndex[newIndex])
    //   } else if (direction === "Right") {
    //     let newIndex;
    //     if(currentIndex - 1 < 0) {
    //       newIndex = allowedSubjectIndex.length - 1;
    //     }
    //     else {
    //       newIndex = currentIndex - 1;
    //     }
    //     setExamGraphCurrentSubject(allowedSubjectIndex[newIndex])
    //   }
    // }
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

    // if (types[graphType] === "Tugas") {
    //   graph = graphTask(taskGraphCurrentSubject);
    //   subject = showSubject(taskGraphCurrentSubject)
    // } else if (types[graphType] === "Kuis") {
    //   graph = graphAssessment(quizGraphCurrentSubject, "Kuis");
    //   subject = showSubject(quizGraphCurrentSubject)

    // } else {
    //   graph = graphAssessment(examGraphCurrentSubject, "Ujian");
    //   subject = showSubject(examGraphCurrentSubject)
    // }

    return (
      // <Grid item xs={12} sm={4} container direction="column" spacing={1} alignItems="center">
      //   <Grid item>
      //     <div className={classes.graphButtons}>
      //       <IconButton
      //         onClick={() => {
      //           if (graphType - 1 < 0) {
      //             setGraphType(types.length - 1);
      //           } else {
      //             setGraphType((graphType - 1) % 3);
      //           }
      //         }}
      //       >
      //         <ArrowBackIosIcon />
      //       </IconButton>
      //       <Typography align="center">
      //         Nilai {types[graphType]} Anda
      //       </Typography>
      //       <IconButton
      //         onClick={() => {setGraphType((graphType + 1) % 3)}}
      //         >
      //         <ArrowForwardIosIcon />
      //       </IconButton>
      //     </div>
      <Grid item container direction="column" spacing={1} alignItems="center">
        <Grid item className={classes.graphButtons} style={{ margin: "0 0 10px" }}>
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
          <Typography align="center">
            Nilai {types[graphType]} Anda
        </Typography>
          <IconButton
            onClick={() => { setGraphType((graphType + 1) % types.length) }}
          >
            <ArrowForwardIosIcon />
          </IconButton>
        </Grid>
        <Grid item>
          {graph === null ? (
            <div className={classes.greyBackground}>
              <Typography
                align="center"
                color="textSecondary"
                variant="subtitle2"
              >
                Belum ada {types[graphType]} yang telah dinilai untuk mata pelajaran terkait
              </Typography>
            </div>
          ) : (
            graph
          )}
        </Grid>
        {/* <Grid item>
          <div className={classes.graphButtons}>
            <IconButton
              onClick={() =>
                changeGraphSubject(types[graphType], "Left", all_subjects.length)
              }
            >
              <ArrowBackIosIcon />
            </IconButton>
            {subject}
            <IconButton
              onClick={() =>
                changeGraphSubject(
                  types[graphType],
                  "Right",
                  all_subjects.length
                ) */}
        <Grid item className={classes.graphButtons}>
          <IconButton
            onClick={() => {
              if (graphSubject - 1 < 0) {
                setGraphSubject(all_subjects.length - 1);
              } else {
                setGraphSubject(graphSubject - 1);
              }
              // >
              //     <ArrowForwardIosIcon />
              //   </IconButton>
              // </div>
            }}
          >
            <ArrowBackIosIcon />
          </IconButton>
          {subject}
          <IconButton
            onClick={() => {
              setGraphSubject((graphSubject + 1) % all_subjects.length);
              // changeGraphSubject(
              //   types[graphType],
              //   "Right",
              //   all_subjects.length
            }
            }
          >
            <ArrowForwardIosIcon />
          </IconButton>
        </Grid>
      </Grid>
    )
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

  // ini hanya digunakan untuk membuat tabel halaman rapor yang dibuka dari side drawer
  // tipe argumen = Map (pakai Map biar urutan value sel tetap terjaga sesuai dengan urutan nama kolom)
  function generateRowCellFormat1(row) {
    let emptyCellSymbol = "-"; // jika sel kosong, masukkan "-"
    let cells = [];
    row.forEach((value, key) => {
      if (key !== "idMurid") {
        if (key === "namaMurid") {
          // perlu "value !== undefined" karena 0 itu bernilai false
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

  // ini digunakan untuk membuat tabel halaman rapor yang dibuka dari profile view murid atau profile
  // tipe argumen = Object (bisa pakai Object karena urutan nama kolom dan jumlah kolomnya fix)
  function generateRowCellFormat2(row) {
    let trueSubject = false;
    let nonWaliView = false;
    if(kelasWali.get("id") === selectedUser.kelas) {
      if(kelas.subject_assigned) {
        for(let i=0;i<all_subjects.length;i++) {
          if(kelas.subject_assigned.includes(all_subjects[i]._id) && row.subject === all_subjects[i].name) {
            trueSubject = true;
            break;
          }
        }
      }
    }
    else if (user.role === "Teacher" && kelasWali.get("id") !== selectedUser.kelas) {
      if (user.class_to_subject && user.class_to_subject[kelas._id]) {
        for(let i=0;i<all_subjects.length;i++) {
          if(kelas.subject_assigned) {
            if(user.class_to_subject[kelas._id].includes(all_subjects[i]._id) && row.subject === all_subjects[i].name) {
              nonWaliView = true;
              break;
            }
          }
        }
      }
    }
    else if (user.role === "Student") {
      if(kelas.subject_assigned) {
        for(let i=0;i<all_subjects.length;i++) {
          if(kelas.subject_assigned.includes(all_subjects[i]._id) && row.subject === all_subjects[i].name) {
            trueSubject = true;
            break;
          }
        }
      }
    }
    let emptyCellSymbol = "-"; // jika sel isi kosong, masukkan "-"
    if(trueSubject || nonWaliView) {
      return (
        <TableRow key={row.subject}>
          {" "}
          {/* nama subjek sudah dipastikan unik*/}
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

  function resetKonten() {
    setKontenKelas(semuaKelas);
    setKontenMatpel(semuaMatpel);
    setIsClassSelected(false);
    setIsSubjectSelected(false);
  }

  function handleKelasChange(event) {
    // reminder: event.target.value berisi value Select yang sedang dipilih
    let selectedClassId = event.target.value;

    if (isSubjectSelected) {
      setValueKelas(selectedClassId);
      getStudentsByClass(selectedClassId); // ini akan membuat useEffect yg depend terhadap students_by_class menjadi dipanggil
    } else {
      setValueKelas(selectedClassId);
      setIsClassSelected(true);
      setValueMatpel("");

      // jika guru adalah wali kelas dan kelas yang dipilih adalah kelas wali,
      if (kelasWali.size !== 0 && selectedClassId === kelasWali.get("id")) {
        setKontenMatpel(semuaMatpel);
      } else {
        // jika guru bukan wali kelas atau kelas yang dipilih bukan kelas wali,
        // tampilkan hanya semua matpel yang diajarkan ke kelas yang dipilih
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
      getStudentsByClass(valueKelas); // ini akan membuat useEffect yg depend terhadap students_by_class menjadi dipanggil
    } else {
      // jika guru ini adalah guru wali
      let kelas = new Map();
      if (user.class_to_subject) {
        if (kelasWali.size !== 0) {
          if (user.subject_teached.includes(selectedSubjectId)) {
            for (let [classId, subjectIdArray] of Object.entries(user.class_to_subject)) {
              if (subjectIdArray.includes(selectedSubjectId)) {
                kelas.set(classId, semuaKelas.get(classId));
              }
            }
            kelas.delete(kelasWali.get("id")); // perlu didelete karena pada saat meng-generate opsi kelas, kelas yang diwalikan guru ini sudah ditambahkan
          } // jika guru ini memilih mata pelajaran yang tidak diajarkannya, dia hanya dapat memilih kelas yg diwalikannya
        } else {
          for (let [classId, subjectIdArray] of Object.entries(user.class_to_subject)) {
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
    // fungsi handleIndividualReport hanya dipanggil ketika role === "Student" atau role === "Teacher"
    if (role === "Student") {
      // subjectArray isinya [{subject_id, subject_name},...]
      subjectArray = Array.from(
        all_subjects_map,
        ([subjectId, subjectName]) => ({ subjectId, subjectName })
      );
    } else {
      if (kelas) {
        // jika guru adalah wali kelas dan guru membuka rapor murid yang diwalikannya
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

    // Memastikan subjectArray sudah ada isinya sebelum diproses
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
        // bySubject.subjectId adalah id Subject
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

      for (let task of allTaskArray) {
        // id adalah id murid
        // task.grades sudah dipastikan ada saat pembuatan task baru sehingga tidak perlu dicek null atau tidaknya lagi
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
        // id adalah id murid
        // (assessment.grades.constructor === Object) && (Object.keys(assessment.grades).length !== 0) sebenarnya tidak diperlukan karena
        // grades sudah dipastikan tidak kosong. cek notes di model assessment buat info lebih lanjut
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

      // mengonversi scores menjadi hanya menyimpan nama subject dan nilai rata-rata, lalu menyimpannya di subjectScoreArray
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

  // ini dipanggil setelah selesai mount.
  // ditambahkan dependency "role" untuk mengurus kasus ketika guru yang sedang berada di halaman rapor untuk suatu murid
  // mengklik tombol rapor di side drawer.
  React.useEffect(() => {
    if (role === "Teacher") {
      getAllClass();
      getAllTask();
      getAllAssessments();
    } else if (role === "Student") {
      setKelasWali(new Map()); // agar setRows(handleIndividualReport()) dijalankan, tapi tidak perlu panggil getAllClass()
      getAllTask();
      getAllAssessments();
    } else {
      getAllClass();
      getAllClass("map");
    }
    getAllSubjects();
    getAllSubjects("map");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // menentukan status guru (wali atau nonwali) setelah all_classes sudah ada
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
          // jika guru adalah kelas wali, mengisi infoKelasWali dengan id dan nama kelas yang diwalikannya
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

  // menggenerate konten tabel untuk halaman rapor murid perorangan setelah data-data yang diperlukan sudah ada
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
  }, [allTaskArray, all_subjects_map, kelasWali, all_assessments]);

  // menggenerate konten tabel untuk halaman rapor yg dibuka dengan mengklik icon lihat rapor sidebar
  // setelah data-data yang diperlukan sudah ada.
  // getStudentsByClass ada di fungsi handler Select dan dipanggil saat guru sudah memilih kelas dan subjek.
  // valueMatpel dan valueKelas sudah dipastikan ada.
  React.useEffect(() => {
    countStdByClassUpdate.current++;
    if (countStdByClassUpdate.current === 2) {
      let headerNames = ["Nama Murid"];
      let condition = [];
      let hasGrade = false;

      // akan berisi: [ map_row_1, map_row_2, ... ]
      let newRows = [];
      // akan berisi: { id_student_1: map_row_1, id_student_2: map_row_2, ... }
      let newRowsObj = {};
      // isi map_row_n: Map { idMurid: id_student_1, namaMurid: nama_student, id_task_1: nilai, ... , id_kuis_1: nilai, ..., id_assessment_1: nilai, ... }

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
        } // jika items kosong, hasGrade akan tetap bernilai false
      };

      getTasksBySubjectClass(valueMatpel, valueKelas)
        .then((taskArray) => {
          addScore(taskArray, "tugas");
        })
        .then(() => {
          return getAssessments("Kuis", valueMatpel, valueKelas).then((kuisArray) => {
            addScore(kuisArray, "kuis");
          }).catch((err) => {
            console.log(err);
          });
        })
        .then(() => {
          return getAssessments("Ujian", valueMatpel, valueKelas).then((ujianArray) => {
            addScore(ujianArray, "ujian");
          }).catch((err) => {
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
          resetKonten();
        })
        .catch((err) => {
          console.log(err);
        });

      countStdByClassUpdate.current = 1; // karena requestnya perlu bisa dilakukan berkali-kali
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [students_by_class]);

  // menginisialisasi isi menu item komponen Select setelah
  // setKelasWali, getAllClass("map"), dan getAllSubjects("map") sudah selesai dijalankan semuanya.
  React.useEffect(() => {
    countMIDependencyUpdate.current++;
    if (countMIDependencyUpdate.current === 4) {
      new Promise((resolve) => {
        // menentukan status guru: wali atau nonwali
        let daftarMatpel = new Map();
        let daftarKelas = new Map();

        // mengisi daftar kelas dengan semua kelas yang diajar oleh guru ini
        user.class_teached.forEach((classId) => {
          daftarKelas.set(classId, all_classes_map.get(classId).name);
        });

        if (kelasWali.size !== 0) {
          // jika user adalah guru wali
          // agar kelas wali tidak muncul 2 kali di menu item Select
          daftarKelas.delete(kelasWali.get("id"));

          // mengisi daftar matpel dengan semua mata pelajaran yang ada
          all_subjects_map.forEach((subjectName, subjectId) => {
            daftarMatpel.set(subjectId, subjectName);
          });
        } else {
          // jika user adalah guru yang tidak mewalikan kelas manapun
          // mengisi daftar matpel dengan matpel yang diajar
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
          console.log(err);
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [kelasWali, all_classes_map, all_subjects_map]);

  // Untuk view dari sidebar teacher, untuk sekarang reserve special code "semua"
  let role;
  if (props.match.params.id === "semua" && user.role === "Teacher") {
    role = "Other";
  } else if (props.match.params.id === "semua" && user.role !== "Teacher") {
    return <Redirect to="/tidak-ditemukan" />;
  } else {
    role = user.role;
  }

  return (
    <div className={classes.root}>
      {role === "Teacher" ? (
        <Grid container direction="column" spacing={3}>
          <Grid item>
            <Typography variant="h4" align="center" color="textPrimary">
              Rapor Tahun {new Date().getFullYear()}
            </Typography>
            <Divider className={classes.profileDivider} />
          </Grid>
          <Grid container item direction="column" spacing={1}>
            <Grid item>
              <Typography>
                <b>Nama: </b>
                {name}
              </Typography>
            </Grid>
            <Grid item>
              <Typography>
                <b>Kelas: </b>
                {kelas.name}
              </Typography>
            </Grid>
          </Grid>
          <Grid item container direction="column" style={{ margin: "auto" }}>
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
      ) : role === "Student" ? (
        <Grid container direction="column" spacing={4}>
          <Grid item>
            <Typography variant="h4" align="center" color="textPrimary">
              Rapor Tahun {new Date().getFullYear()}
            </Typography>
            <Divider className={classes.profileDivider} />
          </Grid>
          <Grid
            item
            container
            justify="center"
            // spacing={4}
            alignItems="center"
          >
            {/* {createGraph()} */}
            <Paper style={{ padding: "20px", width: "100%"}}>
              {createGraph()}
            </Paper>
          </Grid>
          <Grid item container direction="column" style={{ margin: "auto" }}>
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
        <Grid container direction="column" spacing={3}>
          <Grid item>
            <Typography variant="h4" align="center" color="textPrimary">
              Daftar Nilai Tahun {new Date().getFullYear()}
            </Typography>
            <Divider className={classes.profileDivider} />
          </Grid>
          <Grid item container justify="space-between" alignItems="center">
            <Grid item md={7} className={classes.customMargin}>
              <Typography>
                Berikut adalah rapor seluruh murid sesuai kelas dan mata
                pelajaran yang dipilih
              </Typography>
            </Grid>
            <Grid item container md={5} spacing={3}>
              <Grid item container md={6}>
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
              <Grid item container md={6}>
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
                    {kontenMatpel.size !== 0 ? generateMatPelMenuItem() : null}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Grid>
          <Grid item container direction="column" style={{ margin: "auto" }}>
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
        </Grid>
      )}
    </div>
  );
}

Report.propTypes = {
  auth: PropTypes.object.isRequired,
  setCurrentClass: PropTypes.func.isRequired,
  classesCollection: PropTypes.object.isRequired,
  getOneUser: PropTypes.func.isRequired,
  subjectsCollection: PropTypes.object.isRequired,
  tasksCollection: PropTypes.array.isRequired,
  assessmentsCollection: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
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
  refreshTeacher
})(Report);
