import React from "react";
import { connect } from "react-redux";
import { useLocation , Redirect } from "react-router-dom";
import PropTypes from "prop-types";
import "moment/locale/id";
import { Avatar, Badge, Divider, Grid, Hidden, List, ListItem, ListItemAvatar, ListItemText, 
  Paper, Typography, IconButton } from "@material-ui/core";
  import { fade } from "@material-ui/core/styles/colorManipulator";
  import { makeStyles, withStyles } from "@material-ui/core/styles";
  import InputLabel from "@material-ui/core/InputLabel";
  import Select from "@material-ui/core/Select";
  import MenuItem from "@material-ui/core/MenuItem";
  import Table from "@material-ui/core/Table";
  import TableBody from "@material-ui/core/TableBody";
  import TableCell from "@material-ui/core/TableCell";
  import TableContainer from "@material-ui/core/TableContainer";
  import TableHead from "@material-ui/core/TableHead";
  import TableRow from "@material-ui/core/TableRow";
  
import { getStudentsByClass } from "../../../actions/UserActions";
import { getTaskGrade } from "../../../actions/TaskActions";
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

  const { role } = location.state
  
  const [rows, setRows] = React.useState([]);
  const [headers, setHeaders] = React.useState([]);

  const { getTaskGrade, getAllClass, getAllSubjects, getStudentsByClass } = props;
  const { all_classes, all_classes_map } = props.classesCollection;

  const { user, students_by_class } = props.auth;
  const { all_subjects, all_subjects_map } = props.subjectsCollection;

  
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
    getAllClass();
    getAllClass("map");
    // getAllSubjects();
    getAllSubjects("map");
  }, []);

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
        {(role==="Teacher") ?
        <Grid container direction="column" spacing={5}>
            <Grid item>
            <Typography variant="h4" align="center" color="textPrimary">
                MATA PELAJARAN FISIKA
            </Typography>
            <Divider className={classes.profileDivider}/>
            </Grid>
            <Grid container item direction="row" spacing={3} alignContent="space-between">
                <Grid item xs={4} sm={4} md={4} lg={4}> 
                    <Paper className={classes.informationPaper}>NAMA :  Donald John Trump</Paper>
                </Grid>
                <Grid item xs={3} sm={4} md={5} lg={5}> 
                </Grid>
            </Grid>
            <Grid container direction="column" spacing={5} style={{margin:"auto"}}>
                <Grid item xs={12} sm={12} md={12} lg={12}> 
                    <TableContainer component={Paper}>
                        <Table aria-label="simple table" size="medium">
                            <TableHead>
                            <TableRow>
                                <TableCell>Nama</TableCell>
                                <TableCell align="right">Tugas 1</TableCell>
                                <TableCell align="right">Tugas 2</TableCell>
                                <TableCell align="right">Kuis</TableCell>
                                <TableCell align="right">Ujian</TableCell>
                            </TableRow>
                            </TableHead>
                            <TableBody>
                            {rows.map((row) => (
                                <TableRow key={row.name}>
                                <TableCell component="th" scope="row">
                                    {row.name}
                                </TableCell>
                                <TableCell align="right">{row.calories}</TableCell>
                                <TableCell align="right">{row.fat}</TableCell>
                                <TableCell align="right">{row.carbs}</TableCell>
                                <TableCell align="right">{row.protein}</TableCell>
                                </TableRow>
                            ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Grid>
            </Grid>
        </Grid>
        : (role==="Student") ?
        <Grid container direction="column" spacing={5}>
            <Grid item>
            <Typography variant="h4" align="center" color="textPrimary">
                RAPOR SEMESTER X TAHUN XXXX
            </Typography>
            <Divider className={classes.profileDivider}/>
            </Grid>
            <Grid container item direction="row" spacing={3} alignContent="space-between">
                <Grid item xs={4} sm={4} md={4} lg={4}> 
                    <Paper className={classes.informationPaper}>NAMA :  Donald John Trump</Paper>
                </Grid>
                <Grid item xs={3} sm={4} md={5} lg={5}> 
                </Grid>
            </Grid>
            <Grid container direction="column" spacing={5} style={{margin:"auto"}}>
                <Grid item xs={12} sm={12} md={12} lg={12}> 
                    <TableContainer component={Paper}>
                        <Table aria-label="simple table" size="medium">
                            <TableHead>
                            <TableRow>
                                <TableCell>Mata Pelajaran</TableCell>
                                <TableCell align="right">Total Nilai Tugas</TableCell>
                                <TableCell align="right">Total Nilai Kuis</TableCell>
                                <TableCell align="right">Total Nilai Ujian</TableCell>
                                <TableCell align="right">Protein&nbsp;(g)</TableCell>
                            </TableRow>
                            </TableHead>
                            <TableBody>
                            {rows.map((row) => (
                                <TableRow key={row.name}>
                                <TableCell component="th" scope="row">
                                    {row.name}
                                </TableCell>
                                <TableCell align="right">{row.calories}</TableCell>
                                <TableCell align="right">{row.fat}</TableCell>
                                <TableCell align="right">{row.carbs}</TableCell>
                                <TableCell align="right">{row.protein}</TableCell>
                                </TableRow>
                            ))}
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
            <Grid container item direction="row" spacing={3} alignContent="space-between">
                <Grid item xs={4} sm={4} md={4} lg={4}> 
                    <Paper className={classes.informationPaper}>Pilih Kelas dan Mata Pelajaran</Paper>
                </Grid>
                <Grid item xs={3} sm={4} md={5} lg={5}> 
                </Grid>
                <Grid item xs={5} sm={4} md={3} lg={3}>
                    <Paper style={{display:"flex", flexDirection:"row", padding:"10px", justifyContent:"space-between"}}>
                        <div>
                            <InputLabel id="kelas-label">Kelas</InputLabel>
                            <Select labelId="kelas-label" id="kelas" value={valueKelas} displayEmpty="true" onChange={(event) => {handleKelasChange(event)}}>
                              <MenuItem value="">
                                  Pilih Kelas
                              </MenuItem>
                              {((kontenKelas.size !== 0) || (kelasWali.size !== 0)) ? (generateKelasMenuItem()) : (null)}
                            </Select>
                        </div>
                        <div>
                            <InputLabel id="matpel-label">Mata Pelajaran</InputLabel>
                            <Select labelId="matpel-label" id="matpel" value={valueMatpel} displayEmpty="true" onChange={(event) => {handleMatPelChange(event)}}>
                                <MenuItem value="">
                                    Pilih Mata Pelajaran
                                </MenuItem>
                                {(kontenMatpel.size !== 0) ? (generateMatPelMenuItem()) : (null)}
                            </Select>
                        </div>
                    </Paper> 
                </Grid>
            </Grid>
            <Grid container direction="column" spacing={5} style={{margin:"auto"}}>
                <Grid item xs={12} sm={12} md={12} lg={12}> 
                    <TableContainer component={Paper}>
                        <Table aria-label="simple table" size="medium">
                            <TableHead>
                            <TableRow>
                                {headers.map((nama) => {
                                  return (<TableCell>{nama}</TableCell>);
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
  subjectsCollection: PropTypes.object.isRequired
  // updateAvatar: PropTypes.func.isRequired,
  // setCurrentClass: PropTypes.func.isRequired,
  // match: PropTypes.object.isRequired,
  // location: PropTypes.object.isRequired,
  // history: PropTypes.object.isRequired
}

const mapStateToProps = (state) => ({
  auth: state.auth,
  classesCollection: state.classesCollection,
  subjectsCollection: state.subjectsCollection
});

export default connect(
  mapStateToProps, { getStudentsByClass, getTaskGrade, getAllClass, getAllSubjects }
) (Profile);
