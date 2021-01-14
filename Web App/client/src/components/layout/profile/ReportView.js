import React from "react";
import { connect } from "react-redux";
import { useLocation , Redirect } from "react-router-dom";
import PropTypes from "prop-types";
import "moment/locale/id";
import { Divider, Grid, Paper, Typography, IconButton } from "@material-ui/core";
import { fade } from "@material-ui/core/styles/colorManipulator";
import { makeStyles } from "@material-ui/core/styles";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import FormControl from "@material-ui/core/FormControl";

import { getStudentsByClass } from "../../../actions/UserActions";
import { getTasksBySC, getAllTask } from "../../../actions/TaskActions";
import { getKuisBySC, getUjianBySC, getAllAssessments} from "../../../actions/AssessmentActions"
import { getAllClass } from "../../../actions/ClassActions";
import { getAllSubjects } from "../../../actions/SubjectActions";
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import { Bar } from 'react-chartjs-2';

const useStyles = makeStyles((theme) => ({
  root: {
    margin: "auto",
    maxWidth: "1000px",
    padding: "10px"
  },
  avatar: {
    margin: "auto",
    width: theme.spacing(20),
    height: theme.spacing(20)
  },
  profileDivider: {
    backgroundColor: theme.palette.primary.main,
    margin: "15px 15px 5px 0px"
  },
  informationPaper: {
    backgroundColor: fade(theme.palette.primary.main,0.2),
    padding: "25px",
  },
  name: {
    backgroundColor: fade(theme.palette.primary.main,0.2),
    padding:"5px",
    margin: "5px"
  },
  kelas: {
    backgroundColor: fade(theme.palette.primary.main,0.2)
  },
  informationPictureContainer: {
    display: "flex",
    justifyContent: "center",
    [theme.breakpoints.up("sm")]: {
      justifyContent: "flex-end"
    },
  },
  informationPicture: {
    height: "100px",
    [theme.breakpoints.up("sm")]: {
      height: "125px"
    },
  },
  profileDataItemAvatar: {
    backgroundColor: "#00b7ff"
  },
  emptyProfileData: {
    display: "flex",
    justifyContent: "center",
    maxWidth: "150px",
    padding: "5px",
    paddingLeft: "10px",
    paddingRight: "10px",
    backgroundColor: theme.palette.error.main,
    color: "white"
  },
  descriptionText: {
    color: "white",
    marginTop: "10px",
    marginLeft: "20px",
    fontWeight: "300",
    fontStyle: "italic"
  },
  background_gradient: {
    padding:"20px",
    background: "linear-gradient(to bottom right, #00b7ff, #2196F3, #00b7ff)"
  },
  tableHeader: {
    backgroundColor: theme.palette.primary.main,
  },
  select: {
    minWidth:"150px",
    maxWidth:"150px"
  },
  selectposition: {
    justifyContent: "flex-end",
    [theme.breakpoints.down("sm")] : {
      justifyContent: "flex-start"
    }
  },
  graph: {
    display: "flex", 
    flexDirection: "row", 
    justifyContent: "center", 
    marginRight: "10px"
  },
  graphButtons: {
    display: "flex", 
    flexDirection: "row", 
    justifyContent: "space-between", 
    marginTop: "10px",
    alignItems: "center"
  },
  greyBackground: {
    backgroundColor: "#e3e5e5",
    padding: "130px 10px",
  }
}));

function DashboardGraph(props){
  const { scores, workType, names } = props
  
  let label = []
  for(let i=0;i<scores.length;i++){
    label.push(i+1)
  }
  const state = {
    labels: label,
    datasets: [
      {
        label: [1,2],
        backgroundColor: '#1976d2',
        borderColor: 'rgba(0,0,0,0)',
        borderWidth: 2,
        data: scores,
        maxBarThickness: 60
      }
    ]
  }

  return (
    // A react-chart hyper-responsively and continuously fills the available
    // space of its parent element automatically
    <div>
      <Bar
        data={state}
        options={{
          title:{
            display:false,
            text:`Nilai ${workType} Anda`,
            fontSize:20
          },
          legend:{
            display:false,
            position:'right'
          },
          scales: {
            yAxes: [{
                id: 'first-y-axis',
                type: 'linear',
                ticks: {
                  min: 0,
                  max: 100
                }
            }]
          },
          tooltips: {
            callbacks: {
              label: function(tooltipItem, data) {
                var label = names[tooltipItem.index] || '';

                if (label) {
                    label += ': ';
                }
                label += Math.round(tooltipItem.yLabel * 100) / 100;
                return label;
              }
            }
          },
          layout: {
            padding: {
                left: 0,
                right: 0,
                top: 0,
                bottom: 0
            }
        }
        }}
        width="200px"
        height="270px"
      />
    </div>
  )
  
}

function ReportView(props) {
  const classes = useStyles();
  const location = useLocation();

  const { role, nama, kelas, id  } = location.state;
  // role = "Teacher" / "Student" / "Other" ("Other" kalau guru mengklik icon lihat rapor di side drawer)
  // nama                                   (ini tidak ada kalau rolenya "Other". akan berisi nama murid)
  // kelas = classesCollection.kelas        (ini tidak ada kalau rolenya "Other". ini akan berisi document Kelas yang ditempati murid)
  // id                                     (ini tidak ada kalau rolenya "Other". akan berisi id murid)

  const [rows, setRows] = React.useState([]); // elemen array ini adalah Object atau Map yang masing-masing key-value nya menyatakan nilai satu sel
  const [headers, setHeaders] = React.useState([]); // elemennya berupa string nama-nama kolom pada tabel

  const { getTasksBySC, getKuisBySC, getUjianBySC, getAllAssessments, getAllClass, getAllSubjects, getStudentsByClass, getAllTask, tasksCollection } = props;
  const { all_classes, all_classes_map } = props.classesCollection;

  const { user, students_by_class } = props.auth;
  const { all_subjects_map, all_subjects } = props.subjectsCollection;
  const allTaskArray = props.tasksCollection; // mengambil data dari DB
  const { all_assessments } = props.assessmentsCollection;

  const countAllClassUpdate = React.useRef(0);
  const countMIDependencyUpdate = React.useRef(0);
  const countStdByClassUpdate = React.useRef(0);
  const countIRDependencyUpdate = React.useRef(0);

  const [valueKelas, setValueKelas] = React.useState(""); // nama kelas yang sedang terpilih di Select
  const [valueMatpel, setValueMatpel] = React.useState(""); // nama matpel yang sedang terpilih di Select

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
  const [taskGraphCurrentSubject, setTaskGraphCurrentSubject] = React.useState(null)
  const [quizGraphCurrentSubject, setQuizGraphCurrentSubject] = React.useState(null)
  const [examGraphCurrentSubject, setExamGraphCurrentSubject] = React.useState(null)

  if(taskGraphCurrentSubject === null && all_subjects.length !== 0){
    let randomNumber = Math.floor(Math.random() * all_subjects.length)
    setTaskGraphCurrentSubject(randomNumber)
  }
  if(quizGraphCurrentSubject === null && all_subjects.length !== 0){
    let randomNumber = Math.floor(Math.random() * all_subjects.length)
    setQuizGraphCurrentSubject(randomNumber)
  }
  if(examGraphCurrentSubject === null && all_subjects.length !== 0){
    let randomNumber = Math.floor(Math.random() * all_subjects.length)
    setExamGraphCurrentSubject(randomNumber)
  }

  function graphTask(subjectIndex){
    if(all_subjects[subjectIndex]){
      let subject = all_subjects[subjectIndex]._id
      let subjectScores = []
      let subjectNames = []
      for(let i=0;i<tasksCollection.length;i++){
        if(tasksCollection[i].grades && tasksCollection[i].subject === subject){
          let keysArray = Object.keys(tasksCollection[i].grades)
          let valuesArray = Object.values(tasksCollection[i].grades)
          for(let j=0;j<keysArray.length;j++){
            if(keysArray[j] === user.id){
              subjectScores.push(valuesArray[j])
              subjectNames.push(tasksCollection[i].name)
              break;
            }
          }
        }
      }
      if(subjectScores.length !== 0){
        return <DashboardGraph scores={subjectScores} names={subjectNames} workType="Tugas"/>
      }
      else return null
    }
    else return null
  }

  function graphAssessment(subjectIndex, type){
    if(all_subjects[subjectIndex]){
      let subject = all_subjects[subjectIndex]._id
      let subjectScores = []
      let subjectNames = []
      if(type === "Kuis"){
        for(let i=0;i<all_assessments.length;i++){
          if(all_assessments[i].grades && all_assessments[i].subject === subject && all_assessments[i].type === "Kuis"){
            let keysArray = Object.keys(all_assessments[i].grades)
            let valuesArray = Object.values(all_assessments[i].grades)
            for(let j=0;j<keysArray.length;j++){
              if(keysArray[j] === user.id){
                subjectScores.push(valuesArray[j].total_grade)
                subjectNames.push(all_assessments[i].name)
                break;
              }
            }
          }
        }
      }
      else if(type === "Ujian"){
        for(let i=0;i<all_assessments.length;i++){
          if(all_assessments[i].grades && all_assessments[i].subject === subject && all_assessments[i].type === "Ujian"){
            let keysArray = Object.keys(all_assessments[i].grades)
            let valuesArray = Object.values(all_assessments[i].grades)
            for(let j=0;j<keysArray.length;j++){
              if(keysArray[j] === user.id){
                subjectScores.push(valuesArray[j].total_grade)
                subjectNames.push(all_assessments[i].name)
                break;
              }
            }
          }
        }
      }
      if(subjectScores.length !== 0){
        return <DashboardGraph scores={subjectScores} names={subjectNames} workType={type}/>
      }
      else return null
    }
    else return null
  }

  const changeGraphSubject = (workType, direction, subjectsLength) => {
    if(workType === "Tugas"){
      if(direction === "Left" && taskGraphCurrentSubject > 0){
        setTaskGraphCurrentSubject(taskGraphCurrentSubject - 1)
      }
      else if(direction === "Right" && taskGraphCurrentSubject < subjectsLength - 1){
        setTaskGraphCurrentSubject(taskGraphCurrentSubject + 1)
      }
    }
    else if(workType === "Kuis"){
      if(direction === "Left" && quizGraphCurrentSubject > 0){
        setQuizGraphCurrentSubject(quizGraphCurrentSubject - 1)
      }
      else if(direction === "Right" && quizGraphCurrentSubject < subjectsLength - 1){
        setQuizGraphCurrentSubject(quizGraphCurrentSubject + 1)
      }
    }
    else if(workType === "Ujian"){
      if(direction === "Left" && examGraphCurrentSubject > 0){
        setExamGraphCurrentSubject(examGraphCurrentSubject - 1)
      }
      else if(direction === "Right" && examGraphCurrentSubject < subjectsLength - 1){
        setExamGraphCurrentSubject(examGraphCurrentSubject + 1)
      }
    }
  }

  function showSubject(subjectIndex){
    if(all_subjects[subjectIndex]){
      return <Typography align="center">{all_subjects[subjectIndex].name}</Typography>
    }
    else return null
  }

  function generateKelasMenuItem() {
    let menuItems = [];
    if (kelasWali.size !== 0) {
        menuItems.push(
          <MenuItem key={kelasWali.get("id")} value={kelasWali.get("id")}>{kelasWali.get("name")} (Kelas Wali)</MenuItem>
        );
    }
    kontenKelas.forEach((namaKelas, idKelas) => {
      menuItems.push(
        <MenuItem key={idKelas} value={idKelas}>{namaKelas}</MenuItem>
      );
    });
    return menuItems;
  }

  function generateMatPelMenuItem() {
    let menuItems = [];
    kontenMatpel.forEach((namaMatPel, idMatPel) => {
      if (user.subject_teached.includes(idMatPel)) {
        menuItems.push(
          <MenuItem key={idMatPel} value={idMatPel}>{namaMatPel} (Subjek Ajar)</MenuItem>
        );
      } else {
        menuItems.push(
          <MenuItem key={idMatPel} value={idMatPel}>{namaMatPel}</MenuItem>
        );
      }
    });
    return menuItems;
  }

  // ini hanya digunakan untuk membuat tabel halaman lihat-rapor yang dibuka dari side drawer
  // tipe argumen = Map (pakai Map biar urutan value sel tetap terjaga sesuai dengan urutan nama kolom)
  function generateRowCellFormat1(row) {
    let emptyCellSymbol = "-"; // jika sel kosong, masukkan "-"
    let cells = [];
    row.forEach((value, key) => {
      if (key !== "idMurid") {
        if (key === "namaMurid") {
          // perlu "value !== undefined" karena 0 itu bernilai false
          cells.push(<TableCell align="left" style={{border: "1px solid rgba(224, 224, 224, 1)"}}>{(value !== undefined) ? value : emptyCellSymbol}</TableCell>);
        } else {
          cells.push(<TableCell align="center" style={{border: "1px solid rgba(224, 224, 224, 1)"}}>{(value !== undefined) ? value : emptyCellSymbol}</TableCell>);
        }
      }
    });
    return (
      <TableRow key={row.get("idMurid")}>
        {cells}
      </TableRow>
    );
  }

  // ini digunakan untuk membuat tabel halaman lihat-rapor yang dibuka dari profile view murid atau profile
  // tipe argumen = Object (bisa pakai Object karena urutan nama kolom dan jumlah kolomnya fix)
  function generateRowCellFormat2(row) {
    let emptyCellSymbol = "-"; // jika sel isi kosong, masukkan "-"
    return (
      <TableRow key={row.subject}> {/* nama subjek sudah dipastikan unik*/}
        <TableCell style={{border: "1px solid rgba(224, 224, 224, 1)"}}>{row.subject}</TableCell>
        <TableCell align="center" style={{border: "1px solid rgba(224, 224, 224, 1)"}}>{(row.taskAvg !== null) ? row.taskAvg : emptyCellSymbol}</TableCell>
        <TableCell align="center" style={{border: "1px solid rgba(224, 224, 224, 1)"}}>{(row.quizAvg  !== null) ? row.quizAvg : emptyCellSymbol}</TableCell>
        <TableCell align="center" style={{border: "1px solid rgba(224, 224, 224, 1)"}}>{(row.assessmentAvg  !== null) ? row.assessmentAvg : emptyCellSymbol}</TableCell>
      </TableRow>
    );
  }

  function generateHeaderCell(nama) {
    if ((nama === "Nama Murid") || (nama === "Mata Pelajaran")){
      return (<TableCell style={{color:"white"}}>{nama}</TableCell>);
    } else{
      return (<TableCell style={{color:"white"}} align="center">{nama}</TableCell>);
    }
  }

  function generateEmptyMessage() {
    let message = [];
    if (emptyCondition.includes("noStudent")) {
      message.push(
        <Typography variant="h5" color="textSecondary" align="center">
          Kelas ini tidak memiliki murid
        </Typography>
      );
    }
    if (emptyCondition.includes("noGrade")) {
      message.push(
        <Typography variant="h5" color="textSecondary" align="center">
          Belum ada tugas, kuis, atau ujian
        </Typography>
      );
    }
    return (message);
  }

  function resetKonten() {
    setKontenKelas(semuaKelas);
    setKontenMatpel(semuaMatpel);
    setIsClassSelected(false);
    setIsSubjectSelected(false);
  }

  function handleKelasChange(event) {
    // reminder: event.target.value berisi value Select yang sedang dipilih
    if (isSubjectSelected) {
      setValueKelas(event.target.value);
      getStudentsByClass(event.target.value); // ini akan membuat useEffect yg depend terhadap students_by_class menjadi dipanggil
    } else {
      setValueKelas(event.target.value);
      setIsClassSelected(true);
      setValueMatpel("");

      // jika guru adalah wali kelas dan kelas yang dipilih adalah kelas wali,
      if ((kelasWali.size !== 0) && (event.target.value === kelasWali.get("id"))) {
        setKontenMatpel(semuaMatpel);
      } else {
        // jika guru bukan wali kelas atau kelas yang dipilih bukan kelas wali,
        // tampilkan hanya semua matpel yang diajarkan ke kelas yang dipilih
        let matpel = new Map();
        user.subject_teached.forEach((subjectId) => {
          matpel.set(subjectId, semuaMatpel.get(subjectId));
        });
        setKontenMatpel(matpel);
      }
    }
  };

  function handleMatPelChange(event) {
    if (isClassSelected) {
      setValueMatpel(event.target.value);
      getStudentsByClass(valueKelas); // ini akan membuat useEffect yg depend terhadap students_by_class menjadi dipanggil
    } else {
      // jika guru memilih subject yg diajarnya, isi Select kelas dengan semua kelas
      if (user.subject_teached.includes(event.target.value)) {
        setKontenKelas(semuaKelas);
      } else { // jika guru memilih subject yg bukan diajarnya, isi kelas hanyalah kelas yang diwalikannya (jika ada)
        setKontenKelas(new Map());
      }

      setValueMatpel(event.target.value);
      setIsSubjectSelected(true);
      setValueKelas("");
    }
  };

  function handleIndividualReport() {
    let subjectArray = [];
    // fungsi handleIndividualReport hanya dipanggil ketika role === "Student" atau role === "Teacher"
    if (role === "Student") {
      // subjectArray isinya [{subject_id, subject_name},...]
      subjectArray = Array.from(all_subjects_map, ([subjectId, subjectName]) => ({ subjectId, subjectName }));
    } else {
      if (kelas) {
        // jika guru adalah wali kelas dan guru membuka rapor murid yang diwalikannya
        if ((kelasWali.size !== 0) && (kelas._id === kelasWali.get("id"))) {
          subjectArray = Array.from(all_subjects_map, ([subjectId, subjectName]) => ({ subjectId, subjectName }));
        } else {
          subjectArray = user.subject_teached.map((subjectTeachedId) => { return { subjectId: subjectTeachedId, subjectName: all_subjects_map.get(subjectTeachedId) } });
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
          countUjian: 0
        };
      });

      for (let task of allTaskArray) {
        // id adalah id murid
        // task.grades sudah dipastikan ada saat pembuatan task baru sehingga tidak perlu dicek null atau tidaknya lagi
        if ((Object.keys(scores).includes(task.subject)) && (task.grades.constructor === Object) &&
        (Object.keys(task.grades).length !== 0) && (task.grades[id] !== undefined)) {
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
        if ((Object.keys(scores).includes(assessment.subject)) && (assessment.grades) && (assessment.grades.constructor === Object) &&
          (Object.keys(assessment.grades).length !== 0) && (assessment.grades[id] !== undefined) && assessment.grades[id].total_grade !== null) {
          if (assessment.type === "Kuis") {
            if (!scores[assessment.subject].totalKuisScore) {
              console.log(assessment.grades[id].total_grade)
              scores[assessment.subject].totalKuisScore = assessment.grades[id].total_grade;
            } else {
              console.log(assessment.grades[id].total_grade)
              scores[assessment.subject].totalKuisScore += assessment.grades[id].total_grade;
            }
            scores[assessment.subject].countKuis++;
          } else {
            if (!scores[assessment.subject].totalUjianScore) {
              console.log(assessment.grades[id].total_grade)
              scores[assessment.subject].totalUjianScore = assessment.grades[id].total_grade;
            } else {
              console.log(assessment.grades[id].total_grade)
              scores[assessment.subject].totalUjianScore += assessment.grades[id].total_grade;
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
          taskAvg: (sbjScore.totalTaskScore) ? (Math.round((sbjScore.totalTaskScore / sbjScore.countTask) * 10) / 10) : null,
          quizAvg: (sbjScore.totalKuisScore) ? (Math.round((sbjScore.totalKuisScore / sbjScore.countKuis) * 10) / 10) : null,
          assessmentAvg: (sbjScore.totalUjianScore) ? (Math.round((sbjScore.totalUjianScore / sbjScore.countUjian) * 10) / 10) : null
        });
      });
      return (subjectScoreArray);
    } else {
      return [];
    }
  };

  // ini dipanggil setelah selesai mount.
  // ditambahkan dependency "role" untuk mengurus kasus ketika guru yang sedang berada di halaman lihat-rapor untuk suatu murid
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
  }, [role]);

  // menentukan status guru (wali atau nonwali) setelah all_classes sudah ada
  React.useEffect(() => {
    countAllClassUpdate.current++;
    if (countAllClassUpdate.current === 2) {
      new Promise((resolve) => {
        resolve(all_classes.find((kelas) => {return (kelas.walikelas === user.id)}));
      }).then((kelasWali) => {
        let infoKelasWali = new Map();
        // jika guru adalah kelas wali, mengisi infoKelasWali dengan id dan nama kelas yang diwalikannya
        if (kelasWali) {
          infoKelasWali.set("id", kelasWali._id);
          infoKelasWali.set("name", kelasWali.name);
        }
        return (infoKelasWali);
      }).then((info) => {
        setKelasWali(info);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [all_classes]);

  // menggenerate konten tabel untuk halaman rapor murid perorangan setelah data-data yang diperlukan sudah ada
  React.useEffect(() => {
    countIRDependencyUpdate.current++;
    if (countIRDependencyUpdate.current === 5) {
      setHeaders(["Mata Pelajaran", "Rata-Rata Nilai Tugas", "Rata-Rata Nilai Kuis", "Rata-Rata Nilai Ujian"]);
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

      const addScore = (items, isAssessment) => {
        if (items.length !== 0) {
          items.forEach((item) => {
            headerNames.push(item.name);
          });
          hasGrade = true;

          if (isAssessment) {
            students_by_class.forEach((stdInfo) => {
              items.forEach((item) => {
                if ((item.grades) && (item.grades[stdInfo._id] !== undefined) && (item.grades[stdInfo._id].total_grade !== null)) {
                  let grade = Math.round(item.grades[stdInfo._id].total_grade * 10) / 10;
                  newRowsObj[stdInfo._id].set(item._id, grade);
                } else {
                  newRowsObj[stdInfo._id].set(item._id, undefined);
                }
              });
            });
          } else {
            students_by_class.forEach((stdInfo) => {
              items.forEach((item) => {
                if ((item.grades) && (item.grades[stdInfo._id] !== undefined)) {
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

      getTasksBySC(valueMatpel, valueKelas).then((taskArray) => {
        addScore(taskArray, false);
      }).then(() => {
        return getKuisBySC(valueMatpel, valueKelas).then((kuisArray) => {
          addScore(kuisArray, true);
        });
      }).then(() => {
        return getUjianBySC(valueMatpel, valueKelas).then((ujianArray) => {
          addScore(ujianArray, true);
        });
      }).then(() => {
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
      }).catch((err) => {console.log(err)});

      countStdByClassUpdate.current = 1; // karena requestnya perlu bisa dilakukan berkali-kali
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [students_by_class]);

  // menginisialisasi isi menu item komponen Select setelah
  // setKelasWali, getAllClass("map"), dan getAllSubjects("map") sudah selesai dijalankan semuanya.
  React.useEffect(() => {
    countMIDependencyUpdate.current++;
    if (countMIDependencyUpdate.current === (4)) {
      new Promise((resolve) => { // menentukan status guru: wali atau nonwali
        let daftarMatpel = new Map();
        let daftarKelas = new Map();

        // mengisi daftar kelas dengan semua kelas yang ada
        // (karena guru pasti mengajar minimal satu subject dan setiap subject diajar ke semua kelas)
        all_classes_map.forEach((classInfo, classId) => {
          daftarKelas.set(classId, classInfo.name);
        });

        if (kelasWali.size !== 0) { // jika user adalah guru wali
          // agar kelas wali tidak muncul 2 kali di menu item Select
          daftarKelas.delete(kelasWali.get("id"));

          // mengisi daftar matpel dengan semua mata pelajaran yang ada
          all_subjects_map.forEach((subjectName, subjectId) => {daftarMatpel.set(subjectId, subjectName)});

        } else {// jika user adalah guru yang tidak mewalikan kelas manapun
          // mengisi daftar matpel dengan matpel yang diajar
          user.subject_teached.forEach((subjectId) => { daftarMatpel.set(subjectId, all_subjects_map.get(subjectId))});
        }
        resolve({daftarKelas, daftarMatpel});
      }).then((hasil) => {
        setSemuaKelas(hasil.daftarKelas);
        setKontenKelas(hasil.daftarKelas);
        setSemuaMatpel(hasil.daftarMatpel);
        setKontenMatpel(hasil.daftarMatpel);
      }).catch((err) => {console.log(err)})
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [kelasWali, all_classes_map, all_subjects_map]);

  if (!location.state) {
    return(<Redirect to="/tidak-ditemukan"/>);
  }

  return (
    <div className={classes.root}>
      {(role === "Teacher") ?
        <Grid container direction="column" spacing={3}>
          <Grid item>
            <Typography variant="h4" align="center" color="textPrimary" style={{marginRight:"15px"}}>
              Rapor Semester X (Tahun {(new Date()).getFullYear()})
            </Typography>
            <Divider className={classes.profileDivider}/>
          </Grid>
          <Grid container item direction="row" spacing={5}>
            <Grid item xs={7} sm={4}>
                <Typography style={{padding:"10px 20px 10px 5px"}}>Nama : {nama}</Typography>
                <Typography style={{padding:"5px 20px 10px 5px"}}>Kelas : {kelas.name}</Typography>
            </Grid>
          </Grid>
          <Grid container direction="column" spacing={3} style={{margin:"auto"}}>
            <Grid item style={{marginRight:"20px"}}>
              <TableContainer component={Paper}>
                <Table aria-label="simple table" size="medium" style={{overflow:"hidden", paddingLeft:"5px"}}>
                  <TableHead className={classes.tableHeader}>
                    <TableRow>
                      {headers.map((nama) => {
                        return generateHeaderCell(nama);
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
      :
      (role === "Student") ?
        <Grid container direction="column" spacing={6}>
          <Grid item>
            <Typography variant="h4" align="center" color="textPrimary" style={{marginRight:"15px"}}>
              Rapor Semester X (Tahun {(new Date()).getFullYear()})
            </Typography>
            <Divider className={classes.profileDivider}/>
          </Grid>
          <Grid item container direction="row" justify="center" spacing={4} alignItems="center">
            <Grid item container alignItems="center" spacing={4}>
              <Grid item xs={4}>
                <Typography variant="h6" align="center">Nilai Tugas Anda</Typography>
              </Grid>
              <Grid item xs={4}>
                <Typography variant="h6" align="center">Nilai Kuis Anda</Typography>
              </Grid>
              <Grid item xs={4}>
                <Typography variant="h6" align="center">Nilai Ujian Anda</Typography>
              </Grid>
            </Grid>
            <Grid container item alignItems="center" spacing={4}>
              <Grid item xs={4}>
                {graphTask(taskGraphCurrentSubject) === null ?
                  <div className={classes.greyBackground} style={{padding: "58% 10px"}}>
                    <Typography align="center" color="textSecondary" variant="subtitle2" >Belum ada Tugas yang telah dinilai untuk mata pelajaran terkait</Typography>
                  </div>
                : 
                  <div>
                    {graphTask(taskGraphCurrentSubject)}
                  </div>
                }
              </Grid>
              <Grid item xs={4}>
                {graphAssessment(quizGraphCurrentSubject, "Kuis") === null ?
                  <div className={classes.greyBackground} style={{padding: "58% 10px"}}>
                    <Typography align="center" color="textSecondary" variant="subtitle2" >Belum ada Kuis yang telah dinilai untuk mata pelajaran terkait</Typography>
                  </div>
                : 
                  <div>
                    {graphAssessment(quizGraphCurrentSubject, "Kuis")}
                  </div>
                }
              </Grid>
              <Grid item xs={4}>
                {graphAssessment(examGraphCurrentSubject, "Ujian") === null ?
                  <div className={classes.greyBackground} style={{padding: "58% 10px"}}>
                    <Typography align="center" color="textSecondary" variant="subtitle2" >Belum ada Ujian yang telah dinilai untuk mata pelajaran terkait</Typography>
                  </div>
                : 
                  <div>
                    {graphAssessment(examGraphCurrentSubject, "Ujian")}
                  </div>
                }
              </Grid>
            </Grid>
            <Grid item container direction="row" justify="center" alignItems="center" spacing={4} style={{paddingTop: "0px"}}>
              <Grid item xs={4}>
                <div className={classes.graphButtons}>
                  <IconButton onClick={() => changeGraphSubject("Tugas", "Left", all_subjects.length)}>
                    <ArrowBackIosIcon/>
                  </IconButton>
                  {showSubject(taskGraphCurrentSubject)}
                  <IconButton onClick={() => changeGraphSubject("Tugas", "Right", all_subjects.length)}>
                    <ArrowForwardIosIcon/>
                  </IconButton>
                </div>
              </Grid>
              <Grid item xs={4}>
                <div className={classes.graphButtons}>
                  <IconButton onClick={() => changeGraphSubject("Kuis", "Left", all_subjects.length)}>
                    <ArrowBackIosIcon/>
                  </IconButton>
                  {showSubject(quizGraphCurrentSubject)}
                  <IconButton onClick={() => changeGraphSubject("Kuis", "Right", all_subjects.length)}>
                    <ArrowForwardIosIcon/>
                  </IconButton>
                </div>
              </Grid>
              <Grid item xs={4}>
                <div className={classes.graphButtons}>
                  <IconButton onClick={() => changeGraphSubject("Ujian", "Left", all_subjects.length)}>
                    <ArrowBackIosIcon/>
                  </IconButton>
                  {showSubject(examGraphCurrentSubject)}
                  <IconButton onClick={() => changeGraphSubject("Ujian", "Right", all_subjects.length)}>
                    <ArrowForwardIosIcon/>
                  </IconButton>
                </div>
              </Grid>
            </Grid>
          </Grid>
          <Grid container direction="column" spacing={2} style={{margin:"auto"}}>
            <Grid item style={{marginRight:"20px"}}>
              <TableContainer component={Paper}>
                <Table aria-label="simple table" size="medium" style={{overflow:"hidden", paddingLeft:"5px"}}>
                  <TableHead className={classes.tableHeader}>
                    <TableRow>
                      {headers.map((nama) => {
                        return generateHeaderCell(nama);
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
      :
        <Grid container direction="column" spacing={3}>
          <Grid item>
            <Typography variant="h4" align="center" color="textPrimary" style={{marginRight:"15px"}}>
              Daftar Nilai Tahun {(new Date()).getFullYear()}
            </Typography>
            <Divider className={classes.profileDivider}/>
          </Grid>
          <Grid item container justify="space-between" alignItems="center" spacing={3}>
            <Grid item md={6}>
              <Typography>
                Berikut Ini adalah Rapor Seluruh Siswa Sesuai Kelas dan Mata Pelajaran yang Dipilih
              </Typography>
            </Grid>
            <Grid item container md={5} spacing={3}>
              <Grid item md={6} container className={classes.selectposition}>
                <Grid item>
                  <FormControl variant="outlined">
                    <InputLabel id="kelas-label">Kelas</InputLabel>
                    <Select
                      labelId="kelas-label"
                      id="kelas"
                      value={valueKelas}
                      onChange={(event) => {handleKelasChange(event)}}
                      className={classes.select}
                      label="Kelas"
                    >
                      {((kontenKelas.size !== 0) || (kelasWali.size !== 0)) ? (generateKelasMenuItem()) : (null)}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
                <Grid item md={6} container className={classes.selectposition}>
                <Grid item>
                  <FormControl variant="outlined">
                    <InputLabel id="matpel-label">Mata Pelajaran</InputLabel>
                    <Select
                      labelId="matpel-label"
                      id="matpel"
                      value={valueMatpel}
                      onChange={(event) => {handleMatPelChange(event)}}
                      className={classes.select}
                      label="Mata Pelajaran"
                    >
                      {(kontenMatpel.size !== 0) ? (generateMatPelMenuItem()) : (null)}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <Grid container direction="column" spacing={2} style={{margin:"auto"}}>
            <Grid item style={{marginRight:"20px"}}>
              {
                (emptyCondition.length === 0) ? (
                  <TableContainer component={Paper}>
                    <Table aria-label="simple table" size="medium" style={{overflow:"hidden"}}>
                      <TableHead className={classes.tableHeader}>
                        <TableRow>
                          {
                            (headers[0] === "Nama Murid") ? ( // untuk memastikan isi state "header" sudah berubah ke format baru
                              headers.map((nama) => {
                                return generateHeaderCell(nama);
                              })
                            ) : (
                              null
                            )
                          }
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {
                          // jika guru klik icon rapor side drawer ketika sedang melihat halaman lihat-rapor murid,
                          // isi elemen array "rows" ("rows" merupakan state) berubah dari Object menjadi Map.
                          ((rows.length !== 0) && (rows[0].constructor === Map)) ? (
                            rows.map((row) => {
                              return generateRowCellFormat1(row);
                            })
                          ) : (
                            null
                          )
                        }
                      </TableBody>
                    </Table>
                  </TableContainer>
                ) : (
                  generateEmptyMessage()
                )
              }
            </Grid>
          </Grid>
        </Grid>
      }
    </div>
  )
}

ReportView.propTypes = {
  auth: PropTypes.object.isRequired,
  classesCollection: PropTypes.object.isRequired,
  subjectsCollection: PropTypes.object.isRequired,
  tasksCollection: PropTypes.array.isRequired,
  assessmentsCollection: PropTypes.object.isRequired
}

const mapStateToProps = (state) => ({
  auth: state.auth,
  classesCollection: state.classesCollection,
  subjectsCollection: state.subjectsCollection,
  tasksCollection: state.tasksCollection,
  assessmentsCollection: state.assessmentsCollection
});

export default connect(
  mapStateToProps, { getStudentsByClass, getTasksBySC, getKuisBySC, getUjianBySC, getAllAssessments, getAllClass, getAllSubjects, getAllTask }
) (ReportView);
