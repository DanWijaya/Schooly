import React from "react";
import { connect } from "react-redux";
import { useLocation , Redirect } from "react-router-dom";
import PropTypes from "prop-types";
import "moment/locale/id";
import { Avatar, Badge, Divider, Grid, Hidden, List, ListItem, ListItemAvatar, ListItemText, 
  Paper, Typography, IconButton } from "@material-ui/core";
import { fade } from "@material-ui/core/styles/colorManipulator";
import { makeStyles, withStyles } from "@material-ui/core/styles";
// import LightTooltip from "../../misc/light-tooltip/LightTooltip";
// import AccountBalanceIcon from "@material-ui/icons/AccountBalance";
// import CakeIcon from "@material-ui/icons/Cake";
// import ColorLensIcon from "@material-ui/icons/ColorLens";
// import ContactPhoneIcon from "@material-ui/icons/ContactPhone";
// import EmailIcon from "@material-ui/icons/Email";
// import HomeIcon from "@material-ui/icons/Home";
// import PersonIcon from "@material-ui/icons/Person";
// import PhoneIcon from "@material-ui/icons/Phone";
// import WcIcon from "@material-ui/icons/Wc";
// import SportsEsportsIcon from "@material-ui/icons/SportsEsports";
// import WorkIcon from "@material-ui/icons/Work";
// import BlockIcon from "@material-ui/icons/Block";
// import AssessmentOutlinedIcon from '@material-ui/icons/AssessmentOutlined';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
  
import { getStudentsByClass } from "../../../actions/UserActions";
import { getTaskGrade } from "../../../actions/TaskActions";
import { getAllClass } from "../../../actions/ClassActions";
import { getAllSubjects } from "../../../actions/SubjectActions";
import { getAllTask } from "../../../actions/TaskActions";

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
    margin: "15px 0px 15px 0px"
  },
  informationPaper: {
    backgroundColor: fade(theme.palette.primary.main,0.2),
    padding: "25px"
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
  }
}));

const StyledBadge = withStyles((theme) => ({
  badge: {
    right: theme.spacing(2),
    top: theme.spacing(16),
  }
}))(Badge);


function Profile(props) {
  const classes = useStyles();
  const location = useLocation();
  const { role, nama, kelas, id  } = location.state;
  // halaman lihat-rapor hanya dapat dibuka melalui link:
  // <Link to={{
  //   pathname: "/lihat-rapor",
  //   state: {
  //     role: "Teacher" / "Student" / "Other"  ("Other" kalau guru mengklik icon lihat rapor di side drawer)
  //     nama: nama,                            (ini tidak ada kalau rolenya "Other")
  //     kelas : classesCollection.kelas,       (ini tidak ada kalau rolenya "Other". ini akan berisi document Kelas yang ditempati murid)
  //     id: id                                 (ini tidak ada kalau rolenya "Other")
  //   }
  // }}> 


  const [rows, setRows] = React.useState([]); // elemen array ini adalah Object atau Map yang masing-masing key-value nya menyatakan nilai satu sel  
  const [headers, setHeaders] = React.useState([]); // elemennya berupa string

  const { getTaskGrade, getAllClass, getAllSubjects, getStudentsByClass, getAllTask } = props;
  const { all_classes, all_classes_map } = props.classesCollection;

  const { user, students_by_class } = props.auth;
  const { all_subjects_map } = props.subjectsCollection;
  const allTaskArray = props.tasksCollection; // Mengambil Data dari DB 

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
      if (key !== "idMurid") {
        cells.push(<TableCell>{value}</TableCell>);
      }
    })
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
        <TableCell>{row.subject}</TableCell>
        <TableCell>{row.taskScore}</TableCell>
        <TableCell>{row.quizScore}</TableCell>
        <TableCell>{row.assessmentScore}</TableCell>
      </TableRow>
    );
  }
  
  function resetKonten() {
    setKontenKelas(semuaKelas);
    setKontenMatpel(semuaMatpel);

    // ? restrict guru supaya ga bisa milih selagi data tabel direquest

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
    if(subjectArray.length!==0){
      let taskArray = [];
      let subjectnamechecker = []; // cek apabila subject pada input subject baru sebenarnya sudah ada atau belum, agar tidak ada subject yang tampil 2 kali
      subjectArray.forEach((bySubject) => {
        for(let task of allTaskArray){
          // bySubject.subjectId adalah id Subject, sementara id adalah id mahasiswa
          if(bySubject.subjectId===task.subject && task.grades!==null && 
            Object.keys(task.grades).length !== 0 && task.grades.constructor === Object){
            if (task.grades[id]) {
              // Cek biar misalnya ada dua task bahasa Inggris, menampilkannya hanya sekali saja dengan total yang dijumlah
              if(!subjectnamechecker.includes(bySubject.subjectName)){
                taskArray.push({subject: bySubject.subjectName, taskScore: task.grades[id], quizScore: null, assessmentScore: null});
                subjectnamechecker.push(bySubject.subjectName);
              }
              else{
                for(let singleTask of taskArray){
                  if(singleTask.subject===bySubject.subjectName){
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
      })
      return (taskArray);
    }
    else{
      return [];
    }
  };

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
          daftarKelas.delete(kelasWali.get("id")); // agar kelas wali tidak muncul 2 kali di menu item Select

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
        {(role==='Teacher') ?
          <Grid container direction="column" spacing={5}>
            <Grid item>
              <Typography variant="h4" align="center" color="textPrimary">
                  HALAMAN RAPOR SISWA
              </Typography>
              <Divider className={classes.profileDivider}/>
            </Grid>
            <Grid container item direction="row" spacing={1} alignContent="space-around" justify="space-around">
                <Grid item xs={0} sm={4} md={4} lg={4} className={classes.informationPaper}> 
                    <Typography style={{padding:'20px 20px 10px 20px'}}>Nama  : {nama}</Typography>
                    <Typography style={{padding:'10px 20px 20px 20px'}}>Kelas : {kelas.name}</Typography>
                </Grid>
                <Grid item xs={0} sm={2} md={2} lg={4}> 
                </Grid>
                <Grid item xs={12} sm={6} md={6} lg={4} className={classes.select}>
                    
            </Grid>
          </Grid>
          <Grid container direction="column" spacing={5} style={{margin:'auto'}}>
              <Grid item xs={12} sm={12} md={12} lg={12} style={{marginRight:'40px'}}> 
                  <TableContainer component={Paper}>
                      <Table aria-label="simple table" size="medium">
                          <TableHead>
                          <TableRow style={{backgroundImage:"linear-gradient(to bottom right, #0063b2ff, #263571)"}}>
                              {headers.map((nama) => {
                                return (<TableCell style={{color:'white'}}>{nama}</TableCell>);
                              })}
                              {/* <TableCell style={{color:'white'}}>Mata Pelajaran</TableCell>
                              <TableCell style={{color:'white'}}>Total Nilai Tugas</TableCell>
                              <TableCell style={{color:'white'}}>Total Nilai Kuis</TableCell>
                              <TableCell style={{color:'white'}}>Total Nilai Ujian</TableCell> */}
                          </TableRow>
                          </TableHead>
                          <TableBody>
                            {
                              rows.map((row) => {
                                return generateRowCellObj(row);
                              })
                              
                            // handleIndividualReport().map((row) =>
                            //   <TableRow>
                            //     <TableCell component="th" scope="row">
                            //         {row.subject}
                            //     </TableCell>
                            //     <TableCell align="right">{row.taskScore}</TableCell>
                            //     <TableCell align="right">{row.quizScore}</TableCell>
                            //     <TableCell align="right">{row.assessmentScore}</TableCell>
                            //   </TableRow>
                            // )
                            }      
                          </TableBody>
                      </Table>
                  </TableContainer>
              </Grid>
          </Grid>
          </Grid>
        : (role==='Student') ?
        <Grid container direction="column" spacing={5}>
            <Grid item>
              <Typography variant="h4" align="center" color="textPrimary">
                  Rapot Semester X (Tahun 2XXX)
              </Typography>
              <Divider className={classes.profileDivider}/>
            </Grid>
            
          <Grid container direction="column" spacing={5} style={{margin:'auto'}}>
              <Grid item xs={12} sm={12} md={12} lg={12} style={{marginRight:'40px'}}> 
                  <TableContainer component={Paper}>
                      <Table aria-label="simple table" size="medium">
                          <TableHead>
                          <TableRow style={{backgroundImage:"linear-gradient(to bottom right, #0063b2ff, #263571)"}}>
                              {headers.map((nama) => {
                                return (<TableCell style={{color:'white'}}>{nama}</TableCell>);
                              })}
                              {/* <TableCell style={{color:'white'}}>Mata Pelajaran</TableCell>
                              <TableCell style={{color:'white'}}>Total Nilai Tugas</TableCell>
                              <TableCell style={{color:'white'}}>Total Nilai Kuis</TableCell>
                              <TableCell style={{color:'white'}}>Total Nilai Ujian</TableCell> */}
                          </TableRow>
                          </TableHead>
                          <TableBody>
                            {
                              rows.map((row) => {
                                return generateRowCellObj(row);
                              })
                            // handleIndividualReport().map((row) =>
                            //   <TableRow>
                            //     <TableCell component="th" scope="row">
                            //         {row.subject}
                            //     </TableCell>
                            //     <TableCell align="right">{row.taskScore}</TableCell>
                            //     <TableCell align="right">{row.quizScore}</TableCell>
                            //     <TableCell align="right">{row.assessmentScore}</TableCell>
                            //   </TableRow>
                            // )
                            }      
                          </TableBody>
                      </Table>
                  </TableContainer>
              </Grid>
          </Grid>
          </Grid>
        :
        <Grid container direction="column" spacing={5}>
            <Grid item>
            <Typography variant="h4" align="center" color="textPrimary">
                HALAMAN RAPOR
            </Typography>
            <Divider className={classes.profileDivider}/>
            </Grid>
            <Grid container item direction="row" spacing={1} alignContent="space-between">
                <Grid item xs={0} sm={4} md={4} lg={4}> 
                    <Paper className={classes.informationPaper}>Pilih Kelas dan Mata Pelajaran</Paper>
                </Grid>
                <Grid item xs={0} sm={2} md={2} lg={4}> 
                </Grid>
                <Grid item xs={12} sm={6} md={6} lg={4} className={classes.select}>
                    <div style={{display:'flex', flexDirection:'column', padding:'10px', justifyContent:'space-between'}}>
                        <div style={{marginLeft:'10px'}}>
                          <FormControl>
                            <InputLabel id="kelas-label">Kelas</InputLabel>
                            <Select labelId="kelas-label" id="kelas" value={valueKelas} displayEmpty="true" onChange={(event) => {handleKelasChange(event)}} style={{maxWidth:'270px'}}>

                              {
                                ((kontenKelas.size !== 0) || (kelasWali.size !== 0)) ? (generateKelasMenuItem()) : (null)
                              }

                            </Select>
                            {(valueKelas==="") ? 
                              <FormHelperText style={{fontStyle:'italic'}}>Harap Pilih Kelas yang Ingin Ditampilkan</FormHelperText>
                            :
                              <FormHelperText style={{fontStyle:'italic'}}>Silahkan Pilih Kembali Apabila Ingin Menampilkan Kelas Lainnya</FormHelperText>
                            }
                            
                          </FormControl>
                        </div>
                        <div style={{marginLeft:'10px', marginTop:'10px'}}>
                          <FormControl >
                            <InputLabel id="matpel-label">Mata Pelajaran</InputLabel>
                            <Select labelId="matpel-label" id="matpel" value={valueMatpel} displayEmpty="true" onChange={(event) => {handleMatPelChange(event)}} style={{maxWidth:'270px'}}>

                              
                              {
                                (kontenMatpel.size !== 0) ? (generateMatPelMenuItem()) : (null)
                              }

                            </Select>
                            {(valueMatpel==="") ? 
                              <FormHelperText style={{fontStyle:'italic'}}>Harap Pilih Mata Pel yang Ingin Ditampilkan</FormHelperText>
                            :
                              <FormHelperText style={{fontStyle:'italic'}}>Silahkan Pilih Kembali Apabila Ingin Menampilkan Mata Pel Lainnya</FormHelperText>
                            }
                          </FormControl>
                        </div>
                    </div> 
                </Grid>
            </Grid>
            <Grid container direction="column" spacing={5} style={{margin:'auto'}}>
                <Grid item xs={12} sm={12} md={12} lg={12} style={{marginRight:'40px'}}> 
                    <TableContainer component={Paper}>
                        <Table aria-label="simple table" size="medium">
                            <TableHead>
                            <TableRow style={{backgroundImage:"linear-gradient(to bottom right, #0063b2ff, #263571)"}}>
                                {
                                  // jika guru klik icon rapor side drawer ketika sedang melihat halaman lihat-rapor murid, 
                                  // isi elemen array.
                                  (headers[0] === "Nama Murid") ? ( 
                                    headers.map((nama) => {
                                      return (<TableCell style={{color:'white'}}>{nama}</TableCell>);
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
                                // isi elemen array "rows" ("rows" merupakan state) akan berubah dari Object menjadi Map.
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
  tasksCollection: PropTypes.array.isRequired,
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
