import React from "react";
import { connect } from "react-redux";
import { useLocation , Redirect } from "react-router-dom";
import PropTypes from "prop-types";
import "moment/locale/id";
import { Divider, Grid, Paper, Typography } from "@material-ui/core";
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
import { getTaskGrade, getAllTask } from "../../../actions/TaskActions";
import { getAllClass } from "../../../actions/ClassActions";
import { getAllSubjects } from "../../../actions/SubjectActions";

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
    margin: "15px 40px 12px 0px"
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
    minWidth:"230px",
    maxWidth:"230px"
  }
}));

function Profile(props) {
  const classes = useStyles();
  const location = useLocation();

  const { role, nama, kelas, id  } = location.state;
  // role = "Teacher" / "Student" / "Other" ("Other" kalau guru mengklik icon lihat rapor di side drawer)
  // nama                                   (ini tidak ada kalau rolenya "Other")
  // kelas = classesCollection.kelas        (ini tidak ada kalau rolenya "Other". ini akan berisi document Kelas yang ditempati murid)
  // id                                     (ini tidak ada kalau rolenya "Other")

  const [rows, setRows] = React.useState([]); // elemen array ini adalah Object atau Map yang masing-masing key-value nya menyatakan nilai satu sel  
  const [headers, setHeaders] = React.useState([]); // elemennya berupa string

  const { getTaskGrade, getAllClass, getAllSubjects, getStudentsByClass, getAllTask } = props;
  const { all_classes, all_classes_map } = props.classesCollection;

  const { user, students_by_class } = props.auth;
  const { all_subjects_map } = props.subjectsCollection;
  const allTaskArray = props.tasksCollection; // mengambil data dari DB 

  const countAllClassUpdate = React.useRef(0);
  const countMIDependencyUpdate = React.useRef(0);
  const countStdByClassUpdate = React.useRef(0);
  const countIRDependencyUpdate = React.useRef(0);

  const [valueKelas, setValueKelas] = React.useState("");
  const [valueMatpel, setValueMatpel] = React.useState("");
  
  const [semuaMatpel, setSemuaMatpel] = React.useState(new Map());
  const [semuaKelas, setSemuaKelas] = React.useState(new Map());
  const [kontenKelas, setKontenKelas] = React.useState(new Map());
  const [kontenMatpel, setKontenMatpel] = React.useState(new Map());

  // alasan dipisahkan dengan semuaKelas: untuk menghindari pencarian info wali kelas dari banyak kelas.
  // isi kelasWali = Map {"id": <id kelas yang diwalikannya>, "name": <nama kelas yang diwalikannya>} 
  const [kelasWali, setKelasWali] = React.useState(new Map());

  const [isClassSelected, setIsClassSelected] = React.useState(false);
  const [isSubjectSelected, setIsSubjectSelected] = React.useState(false);

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
  // fungsi ini harus hanya menerima argumen yang tipenya Map
  // alasan pake Map:
  // (1) penggunaan  pasangan key - value supaya lebih sederhana daripada Array
  // (3) urutan kolom TableCell harus sesuai dengan urutan header -> jadi tidak bisa pakai Object
  function generateRowCellMap(row) { 
    let cells = [];
    row.forEach((value, key) => {
      if(key !== "idMurid"){
        if (key === "namaMurid") {
          cells.push(<TableCell align="left" style={{border: "1px solid rgba(224, 224, 224, 1)"}}>{value}</TableCell>);
        } else {
          cells.push(<TableCell align="center" style={{border: "1px solid rgba(224, 224, 224, 1)"}}>{value}</TableCell>);
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
  // fungsi ini harus hanya menerima argumen yang tipenya Object
  function generateRowCellObj(row) {  
    return (
      <TableRow key={row.subject}> {/* nama subjek sudah dipastikan unik*/}
        <TableCell style={{border: "1px solid rgba(224, 224, 224, 1)"}}>{row.subject}</TableCell>
        <TableCell align="center" style={{border: "1px solid rgba(224, 224, 224, 1)"}}>{row.taskScore}</TableCell>
        <TableCell align="center" style={{border: "1px solid rgba(224, 224, 224, 1)"}}>{row.quizScore}</TableCell>
        <TableCell align="center" style={{border: "1px solid rgba(224, 224, 224, 1)"}}>{row.assessmentScore}</TableCell>
      </TableRow>
    );
  }
  
  function resetKonten() {
    setKontenKelas(semuaKelas);
    setKontenMatpel(semuaMatpel);
    setValueKelas("");
    setValueMatpel("");
    setIsClassSelected(false);
    setIsSubjectSelected(false);
  }

  function handleKelasChange(event) {
    // reminder: event.target.value berisi value Select yang sedang dipilih
    
    if (event.target.value === "") { // kasus: guru sudah pernah memilih kelas, lalu memilih pilihan yg valuenya kosong
      setKontenMatpel(semuaMatpel);
      setValueKelas(event.target.value);
      setIsClassSelected(false);
    } else { // kasus: (1) guru memilih kelas pertama kali atau (2) sudah memilih kelas, lalu memilih kelas lain 
      // jika guru adalah wali kelas dan kelas yang dipilih adalah kelas wali, tampilkan semua matpel
      if ((kelasWali.size !== 0) && (event.target.value === kelasWali.get("id"))) {
        // jika subject sudah dipilih
        if (isSubjectSelected) { 
          setValueKelas(event.target.value);
          getStudentsByClass(event.target.value); // ini akan membuat useEffect yg depend terhadap students_by_class menjadi dipanggil
        } else {
          setKontenMatpel(semuaMatpel);
          setValueKelas(event.target.value);
          setIsClassSelected(true);
        }
      } else {
        // jika guru bukan wali kelas atau kelas yang dipilih bukan kelas wali,
        // tampilkan hanya semua matpel yang diajarkan ke kelas yang dipilih

        // jika subject sudah dipilih
        if (isSubjectSelected) {
          setValueKelas(event.target.value);
          getStudentsByClass(event.target.value); // ini akan membuat useEffect yg depend terhadap students_by_class menjadi dipanggil
        } else {
          let matpel = new Map();
          user.subject_teached.forEach((subjectId) => {
            matpel.set(subjectId, semuaMatpel.get(subjectId));
          });
          setKontenMatpel(matpel);
          setValueKelas(event.target.value);
          setIsClassSelected(true);
        }
      }
    }
  };

  function handleMatPelChange(event) {
    if (event.target.value === "") { // kasus: guru sudah pernah memilih subject, lalu memilih pilihan yg valuenya kosong
      setKontenKelas(semuaKelas);
      setValueMatpel(event.target.value);
      setIsSubjectSelected(false);
    } else { // kasus: (1) guru memilih subject pertama kali atau (2) sudah memilih subject, lalu memilih subject lain 
      if (isClassSelected) {
        getStudentsByClass(valueKelas); // ini akan membuat useEffect yg depend terhadap students_by_class menjadi dipanggil
        setValueMatpel(event.target.value);
      } else {            
        // jika guru memilih subject yg bukan diajarnya, isi kelas hanyalah kelas yang diwalikannya (jika ada)
        if (!user.subject_teached.includes(event.target.value)) {
          setKontenKelas(new Map());
        } else {
          setKontenKelas(semuaKelas);
        }

        setValueMatpel(event.target.value);
        setIsSubjectSelected(true);
      }
    }
  };
  
  function handleIndividualReport() {
    let subjectArray = [];
    // fungsi handleIndividualReport hanya dipanggil ketika role === "Student" atau role === "Teacher"
    if (role === "Student") {
      // subjectArray isinya [{subject_id, subject_name},...]
      subjectArray = Array.from(all_subjects_map, ([subjectId, subjectName]) => ({ subjectId, subjectName }));
    } else {
      // jika guru adalah wali kelas dan guru membuka rapor murid yang diwalikannya
      if ((kelasWali.size !== 0) && (kelas._id === kelasWali.get("id"))) {
        subjectArray = Array.from(all_subjects_map, ([subjectId, subjectName]) => ({ subjectId, subjectName }));
      } else {
        subjectArray = user.subject_teached.map((subjectTeachedId) => {return {subjectId: subjectTeachedId, subjectName: all_subjects_map.get(subjectTeachedId)}});
      }
    }
    
    // Memastikan subjectArray sudah ada isinya sebelum diproses
    if (subjectArray.length !== 0) {
      let taskArray = [];
      let subjectnamechecker = []; // cek apabila subject pada input subject baru sebenarnya sudah ada atau belum, agar tidak ada subject yang tampil 2 kali
      subjectArray.forEach((bySubject) => {
        for (let task of allTaskArray) {
          // bySubject.subjectId adalah id Subject, sementara id adalah id mahasiswa
          if (bySubject.subjectId === task.subject && task.grades !== null && 
            Object.keys(task.grades).length !== 0 && task.grades.constructor === Object) {
            if (task.grades[id]) {
              // Cek biar misalnya ada dua task bahasa Inggris, menampilkannya hanya sekali saja dengan total yang dijumlah
              if (!subjectnamechecker.includes(bySubject.subjectName)) {
                taskArray.push({subject: bySubject.subjectName, taskScore: task.grades[id], quizScore: null, assessmentScore: null});
                subjectnamechecker.push(bySubject.subjectName);
              } else {
                for (let singleTask of taskArray) {
                  if (singleTask.subject === bySubject.subjectName) {
                    singleTask.taskScore = singleTask.taskScore + task.grades[id];
                  }
                }
              }
            }
          }
        }
      
        // Menambah mata pelajaran yang belum ada nilainya sama sekali di database
        if(!subjectnamechecker.includes(bySubject.subjectName)){
          taskArray.push({subject: bySubject.subjectName, taskScore: null, quizScore: null, assessmentScore: null});
          subjectnamechecker.push(bySubject.subjectName);
        }
      });
      return (taskArray);
    } else {
      return [];
    }
  };

  // ditambahkan dependency "role" untuk mengurus kasus ketika guru yang sedang berada di halaman lihat-rapor untuk suatu murid 
  // mengklik tombol rapor di side drawer
  React.useEffect(() => {
    if (role) {
      if (role === "Teacher") {
        getAllClass();
        getAllTask();
      } else if (role === "Student") {
        getAllTask();
        setKelasWali(new Map()); // agar setRows(handleIndividualReport()) dijalankan, tapi tidak perlu panggil getAllClass()
      } else {
        getAllClass();
        getAllClass("map");
      }
      getAllSubjects("map");
    }
  }, [role]); 

  // menentukan status guru: wali atau nonwali
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
  }, [all_classes]);

  React.useEffect(() => {
    // reminder:
    // -inisialisasi semua variabel di dalam array dependency dilakukan secara bersamaan sehingga useEffect hanya akan terpanggil 1 kali untuk ini
    // -pada kasus ini, masing-masing variabel di dalam array dependency diubah oleh 1 fungsi tersendiri
    // dengan demikian, semua variabel di dependency array sudah siap dipakai ketika 
    // sudah terjadi perubahan sebanyak 1 + jumlah elemen dependency array
    countIRDependencyUpdate.current++;
    if (countIRDependencyUpdate.current === 4) {
      setHeaders(["Mata Pelajaran", "Total Nilai Tugas", "Total Nilai Kuis", "Total Nilai Ujian"]);
      setRows(handleIndividualReport());
    }
  }, [allTaskArray, all_subjects_map, kelasWali]); // -> ini dependency array
  
  // ini berfungsi agar getTaskGrade dipanggil setelah getStudentsByClass selesai (agar alur eksekusinya sekuensial)
  // getStudentsByClass dipanggil saat guru sudah memilih kelas dan subjek pada Select (saat valueMatpel dan valueKelas sudah ada)
  React.useEffect(() => {
    countStdByClassUpdate.current++;
    if (countStdByClassUpdate.current === 2) {
      getTaskGrade(valueMatpel, valueKelas).then((taskArray) => {
        let headerNames = ["Nama Murid"];
        taskArray.forEach((task) => {
          headerNames.push(task.name);
        });
        setHeaders(headerNames);

        let newRows = [];
        students_by_class.forEach((stdInfo) => {
          let rowData = new Map();
          rowData.set("idMurid", stdInfo._id);
          rowData.set("namaMurid", stdInfo.name);
          taskArray.forEach((task) => {
            rowData.set(task._id, task.grades[stdInfo._id]);
          });
          newRows.push(rowData);
        });
        setRows(newRows);
        return;
      }).then(() => {
        resetKonten();
      }).catch((err) => {console.log(err)});
      
      countStdByClassUpdate.current = 1; // karena requestnya perlu bisa dilakukan berkali-kali
    }
  }, [students_by_class]);

  // ini digunakan untuk menginisialisasi isi menu item komponen Select setelah
  // setKelasWali, getAllClass("map"), dan getAllSubjects("map") sudah selesai dijalankan semuanya
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
  }, [kelasWali, all_classes_map, all_subjects_map]);

  if (!location.state) {
    return(<Redirect to="/tidak-ditemukan"/>);
  }

  return (
    <div className={classes.root}>
      {(role === "Teacher") ?
        <Grid container direction="column" spacing={5}>
          <Grid item>
            <Typography variant="h4" align="center" color="textPrimary" style={{marginRight:"45px"}}>
              Rapot Semester X (Tahun {(new Date()).getFullYear()})
            </Typography>
            <Divider className={classes.profileDivider}/>
          </Grid>
          <Grid container item direction="row" spacing={1}>
            <Grid item xs={7} sm={4}> 
                <Typography style={{padding:"20px 20px 10px 20px"}}>Nama : {nama}</Typography>
                <Typography style={{padding:"10px 20px 20px 20px"}}>Kelas : {kelas.name}</Typography>
            </Grid> 
          </Grid>
          <Grid container direction="column" spacing={5} style={{margin:"auto"}}>
            <Grid item xs={12} style={{marginRight:"40px"}}> 
              <TableContainer component={Paper}>
                <Table aria-label="simple table" size="medium" style={{overflow:"hidden"}}>
                  <TableHead className={classes.tableHeader}> 
                    <TableRow>
                      {headers.map((nama) => {
                        if (nama === "Mata Pelajaran") {
                          return (<TableCell style={{color:"white"}}>{nama}</TableCell>);
                        } else { 
                          return (<TableCell style={{color:"white"}} align="center">{nama}</TableCell>);
                        }
                      })}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                      {rows.map((row) => {
                        return generateRowCellObj(row);
                      })}      
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
          </Grid>
        </Grid>
      : 
      (role === "Student") ?
        <Grid container direction="column" spacing={5}>
          <Grid item>
            <Typography variant="h4" align="center" color="textPrimary" style={{marginRight:"45px"}}>
              Rapot Semester X (Tahun {(new Date()).getFullYear()})
            </Typography>
            <Divider className={classes.profileDivider}/>
          </Grid>
          <Grid container direction="column" spacing={5} style={{margin:"auto"}}>
            <Grid item xs={12} style={{marginRight:"40px"}}> 
              <TableContainer component={Paper}>
                <Table aria-label="simple table" size="medium" style={{overflow:"hidden"}}>
                  <TableHead className={classes.tableHeader}>
                    <TableRow>
                      {headers.map((nama) => {
                        if (nama === "Mata Pelajaran") {
                          return (<TableCell style={{color:"white"}}>{nama}</TableCell>);
                        } else { 
                          return (<TableCell style={{color:"white"}} align="center">{nama}</TableCell>);
                        }
                      })}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {rows.map((row) => {
                      return generateRowCellObj(row);
                    })}      
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
          </Grid>
        </Grid>
      :
        <Grid container direction="column" spacing={5}>
          <Grid item>
            <Typography variant="h4" align="center" color="textPrimary" style={{marginRight:"45px"}}>
              Daftar Nilai Tahun {(new Date()).getFullYear()}
            </Typography>
            <Divider className={classes.profileDivider}/>
          </Grid>
          <Grid container item direction="row" spacing={1}>
            <Grid item xs={12} sm={6}> 
              <Typography style={{padding:"25px"}}>Berikut Ini adalah Rapor Seluruh Siswa Sesuai Kelas dan Mata Pelajaran yang Dipilih</Typography>
            </Grid> 
            <Grid item xs={12} sm={3} spacing={0} direction="row-reverse" justify="flex-end">
              <FormControl style={{marginLeft: "10px"}}>
                <InputLabel id="kelas-label">Kelas</InputLabel>
                <Select
                  labelId="kelas-label"
                  id="kelas"
                  value={valueKelas}
                  displayEmpty="true"
                  onChange={(event) => {handleKelasChange(event)}}
                  className={classes.select}
                >
                  {((kontenKelas.size !== 0) || (kelasWali.size !== 0)) ? (generateKelasMenuItem()) : (null)}
                </Select>  
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={3}>
              <FormControl style={{marginLeft: "10px"}}>
                <InputLabel id="matpel-label">Mata Pelajaran</InputLabel>
                <Select 
                  labelId="matpel-label"
                  id="matpel"
                  value={valueMatpel}
                  displayEmpty="true"
                  onChange={(event) => {handleMatPelChange(event)}}
                  className={classes.select}
                >
                  {(kontenMatpel.size !== 0) ? (generateMatPelMenuItem()) : (null)}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
          <Grid container direction="column" spacing={5} style={{margin:"auto"}}>
            <Grid item xs={12} style={{marginRight:"40px"}}> 
              <TableContainer component={Paper}>
                <Table aria-label="simple table" size="medium" style={{overflow:"hidden"}}>
                  <TableHead className={classes.tableHeader}>
                    <TableRow>
                      {
                        (headers[0] === "Nama Murid") ? ( // untuk memastikan isi state "header" sudah berubah ke format baru 
                          headers.map((nama) => {
                            if (nama === "Nama Murid"){
                              return (<TableCell style={{color:"white"}}>{nama}</TableCell>);
                            } else{ 
                              return (<TableCell style={{color:"white"}} align="center">{nama}</TableCell>);
                            }
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
                          return generateRowCellMap(row);
                        })
                      ) : (
                        null
                      )
                    }
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
          </Grid>
        </Grid>
      }
    </div>
  )
}

Profile.propTypes = {
  auth: PropTypes.object.isRequired,
  classesCollection: PropTypes.object.isRequired,
  subjectsCollection: PropTypes.object.isRequired,
  tasksCollection: PropTypes.array.isRequired
}

const mapStateToProps = (state) => ({
  auth: state.auth,
  classesCollection: state.classesCollection,
  subjectsCollection: state.subjectsCollection,
  tasksCollection: state.tasksCollection
});

export default connect(
  mapStateToProps, { getStudentsByClass, getTaskGrade, getAllClass, getAllSubjects, getAllTask }
) (Profile);
