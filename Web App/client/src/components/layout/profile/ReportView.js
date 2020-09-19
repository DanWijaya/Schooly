import React from "react";
import { connect } from "react-redux";
import { useLocation , Redirect } from "react-router-dom";
import PropTypes from "prop-types";
import "moment/locale/id";
// import { setCurrentClass } from "../../../actions/ClassActions";
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
    padding: '25px'
  },
  name: {
    backgroundColor: fade(theme.palette.primary.main,0.2),
    padding:'5px',
    margin: '5px'
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

  const { role, nama, kelas, id  } = location.state
  
  const [rows, setRows] = React.useState([]);
  const [headers, setHeaders] = React.useState([]);

  const { getTaskGrade, getAllClass, getAllSubjects, getStudentsByClass, getAllTask } = props;
  const { all_classes, all_classes_map } = props.classesCollection;

  const { user, students_by_class } = props.auth;
  const { all_subjects, all_subjects_map } = props.subjectsCollection;
  const allTaskArray = props.tasksCollection; // Mengambil Data dari DB 
  console.log(allTaskArray)
  
  const countMIDependencyUpdate = React.useRef(0);
  const countStdByClassUpdate = React.useRef(0);

  const [valueKelas, setValueKelas] = React.useState("");
  const [valueMatpel, setValueMatpel] = React.useState("");
  
  const [semuaMatpel, setSemuaMatpel] = React.useState(new Map());
  const [semuaKelas, setSemuaKelas] = React.useState(new Map());
  const [kontenKelas, setKontenKelas] = React.useState(new Map());
  const [kontenMatpel, setKontenMatpel] = React.useState(new Map());
  const [kelasWali, setKelasWali] = React.useState(new Map()); // alasan dipisahkan dengan semuaKelas: untuk menghindari pencarian info wali kelas dari banyak kelas

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

  function generateRowCell(row) {
    let cells = [];
    row.forEach((value) => {
      cells.push(<TableCell>{value}</TableCell>);
    })
    return (
      <TableRow key={row.get("namaMurid")}>
          {cells}
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
    // event.target.value berisi value Select yang sedang dipilih
    
    if (event.target.value === "") { // kasus: guru sudah pernah memilih kelas, lalu memilih pilihan yg valuenya kosong
      setKontenMatpel(semuaMatpel);
      setValueKelas(event.target.value);
      setIsClassSelected(false);
    } else { // kasus: (1) guru memilih kelas pertama kali atau (2) sudah memilih kelas, lalu memilih kelas lain 

      // jika guru adalah wali kelas dan kelas yang dipilih adalah kelas wali, tampilkan semua matpel
      if ((kelasWali.size !== 0) && (event.target.value === kelasWali.get("id"))) {
        if (isSubjectSelected) {
          setValueKelas(event.target.value);
          getStudentsByClass(event.target.value);
        } else {
          setKontenMatpel(semuaMatpel);
          setValueKelas(event.target.value);
          setIsClassSelected(true);
        }
      } else {
        // jika guru bukan wali kelas atau kelas yang dipilih bukan kelas wali,
        // tampilkan hanya semua matpel yang diajarkan ke kelas yang dipilih
        if (isSubjectSelected) {
          setValueKelas(event.target.value);
          getStudentsByClass(event.target.value);
        } else {
          // let matpel = new Map();
          // Object.keys(user.subject_teached).forEach((key) => { 
          //   if (user.subject_teached[key].includes(event.target.value)) {
          //     matpel.set(key, semuaMatpel.get(key));
          //   }
          // });
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
        getStudentsByClass(valueKelas);
        setValueMatpel(event.target.value);
      } else {
        // // jika guru memilih subject yang diajarnya
        // if (Object.keys(user.subject_teached).includes(event.target.value)) {
        //   user.subject_teached[event.target.value].forEach((idKelas) => {
        //     kelas.set(idKelas, semuaKelas.get(idKelas));
        //   })
        // }
            
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

  React.useEffect(() => {
    if (nama!==null) {
      getAllTask()
    }
    if(role !== 'Teacher' && role !== 'Student')  {
      getAllClass();
      getAllClass("map");
    }
    // getAllSubjects();
    getAllSubjects("map");
  }, []);

  function handleIndividualReport() {
    // array isinya [{subject_id, subject_name},...]
    let array = Array.from(all_subjects_map, ([name, value]) => ({ name, value }))
    // Memastikan array sudah ada isinya sebelum diproses
    if(array.length!==0){
      let taskArray = [];
      let subjectnamechecker = [] // cek apabila subject pada input subject baru sebenarnya sudah ada atau belum, agar tidak ada subject yang tampil 2 kali
      array.map((bySubject) => {
        console.log(allTaskArray)
        for(let task of allTaskArray){
          if(task.grades!==null && Object.keys(task.grades).length !== 0 && task.grades.constructor === Object){
            for(let i=0;i<Object.keys(task.grades).length;i++){
              // bySubject.name adalah id Subject, sementara id adalah id mahasiswa
              if(bySubject.name===task.subject && id===Object.keys(task.grades)[i] ){
                console.log(Object.keys(task.grades)[i])
                // Cek biar misalnya ada dua task bahasa Inggris, menampilkannya hanya sekali saja dengan total yang dijumlah
                if(!subjectnamechecker.includes(bySubject.value)){
                  taskArray.push({subject: bySubject.value, taskScore: task.grades[id], quizScore: null, assessmentScore: null})
                  subjectnamechecker.push(bySubject.value)
                }
                else{
                  for(let singleTask of taskArray){
                    if(singleTask.subject===bySubject.value){
                      singleTask.taskScore = singleTask.taskScore + task.grades[id]
                    }
                  }
                }
                
              }
            }
          }
        }
        // Menambah mata pelajaran yang belum ada nilainya sama sekali di database
        if(!subjectnamechecker.includes(bySubject.value)){
          taskArray.push({subject: bySubject.value, taskScore: null, quizScore: null, assessmentScore: null})
          subjectnamechecker.push(bySubject.value)
        }
      })
      console.log(array)
      return (taskArray);
    }
    else{
      return []
    }
  };
  // ini berfungsi agar getGrade dipanggil setelah getStudentsByClass selesai (agar alur eksekusinya sekuensial)
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
      
      countStdByClassUpdate.current = 1;
    }
  }, [students_by_class]);

  let menuItemDependency = [all_classes, all_classes_map, all_subjects_map];   
  React.useEffect(() => {
    countMIDependencyUpdate.current++;

    // reminder:
    // -inisialisasi semua variabel di dalam array dependency dilakukan secara bersamaan sehingga useEffect hanya akan terpanggil 1 kali untuk ini
    // -pada kasus ini, masing-masing variabel di dalam array dependency diubah oleh 1 fungsi tersendiri
    if (countMIDependencyUpdate.current === (1 + menuItemDependency.length)) {
      let daftarMatpel = new Map();
      let daftarKelas = new Map();
      let infoKelasWali = new Map();

      new Promise((resolve) => { // menentukan status guru: wali atau nonwali
        resolve(all_classes.find((kelas) => {return (kelas.walikelas === user.id)}));
      }).then((kelasWali) => {
        // mengisi daftar kelas dengan semua kelas yang ada
        // (karena guru pasti mengajar minimal satu subject dan setiap subject diajar ke semua kelas)
        all_classes_map.forEach((classInfo, classId) => {
          daftarKelas.set(classId, classInfo.name);
        });

        if (kelasWali) { // jika user adalah guru wali
          // mengisi infoKelasWali dengan kelas wali 
          infoKelasWali.set("id", kelasWali._id);
          infoKelasWali.set("name", kelasWali.name);
          
          daftarKelas.delete(kelasWali._id);

          // mengisi daftar matpel dengan semua mata pelajaran yang ada
          all_subjects_map.forEach((subjectName, subjectId) => {daftarMatpel.set(subjectId, subjectName)});

        } else {// jika user adalah guru yang tidak mewalikan kelas manapun
          // mengisi daftar matpel dengan matpel yang diajar
          user.subject_teached.forEach((subjectId) => { daftarMatpel.set(subjectId, all_subjects_map.get(subjectId))});
        }
        
        return;
      }).then(() => {
        setSemuaKelas(daftarKelas);
        setKontenKelas(daftarKelas);
        setSemuaMatpel(daftarMatpel);
        setKontenMatpel(daftarMatpel);
        setKelasWali(infoKelasWali);
      }).catch((err) => {console.log(err)})
    }
  }, menuItemDependency);

  return (
    <div className={classes.root}>
        {(role=='Teacher') ?
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
                              <TableCell style={{color:'white'}}>Mata Pelajaran</TableCell>
                              <TableCell style={{color:'white'}}>Total Nilai Tugas</TableCell>
                              <TableCell style={{color:'white'}}>Total Nilai Kuis</TableCell>
                              <TableCell style={{color:'white'}}>Total Nilai Ujian</TableCell>
                          </TableRow>
                          </TableHead>
                          <TableBody>
                            {
                            handleIndividualReport().map((row) =>
                              <TableRow>
                                <TableCell component="th" scope="row">
                                    {row.subject}
                                </TableCell>
                                <TableCell align="right">{row.taskScore}</TableCell>
                                <TableCell align="right">{row.quizScore}</TableCell>
                                <TableCell align="right">{row.assessmentScore}</TableCell>
                              </TableRow>
                            )}      
                          </TableBody>
                      </Table>
                  </TableContainer>
              </Grid>
          </Grid>
          </Grid>
        : (role=='Student') ?
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
                              <TableCell style={{color:'white'}}>Mata Pelajaran</TableCell>
                              <TableCell style={{color:'white'}}>Total Nilai Tugas</TableCell>
                              <TableCell style={{color:'white'}}>Total Nilai Kuis</TableCell>
                              <TableCell style={{color:'white'}}>Total Nilai Ujian</TableCell>
                          </TableRow>
                          </TableHead>
                          <TableBody>
                            {
                            handleIndividualReport().map((row) =>
                              <TableRow>
                                <TableCell component="th" scope="row">
                                    {row.subject}
                                </TableCell>
                                <TableCell align="right">{row.taskScore}</TableCell>
                                <TableCell align="right">{row.quizScore}</TableCell>
                                <TableCell align="right">{row.assessmentScore}</TableCell>
                              </TableRow>
                            )}      
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
                            {(valueKelas=="") ? 
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
                            {(valueMatpel=="") ? 
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
                                {headers.map((nama) => {
                                  return (<TableCell style={{color:'white'}}>{nama}</TableCell>);
                                })}
                            </TableRow>
                            </TableHead>
                            <TableBody>
                              {rows.map((row) => {
                                return generateRowCell(row);
                              })}
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
  // updateAvatar: PropTypes.func.isRequired,
  // setCurrentClass: PropTypes.func.isRequired,
  // match: PropTypes.object.isRequired,
  // location: PropTypes.object.isRequired,
  // history: PropTypes.object.isRequired
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
