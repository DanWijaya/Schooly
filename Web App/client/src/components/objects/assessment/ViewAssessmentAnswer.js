import React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import moment from "moment";
import { getOneAssessment, deleteAssessment } from "../../../actions/AssessmentActions"
import { getAllClass } from "../../../actions/ClassActions";
import { getAllSubjects } from "../../../actions/SubjectActions";
import LightTooltip from "../../misc/light-tooltip/LightTooltip";
import { Fab, Grid, GridListTile, GridListTileBar, GridList, Hidden, Paper, Typography, Input, Snackbar, Divider, 
    IconButton, Tabs, Tab, Menu, MenuItem, Badge, Box, FormControl, Select, InputLabel, TextField, Button, Avatar} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import AssignmentIcon from "@material-ui/icons/Assignment";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import DeleteDialog from "../../misc/dialog/DeleteDialog";
import LinkIcon from '@material-ui/icons/Link';
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';
import SortIcon from '@material-ui/icons/Sort';
import BallotIcon from "@material-ui/icons/Ballot";
import SupervisorAccountIcon from "@material-ui/icons/SupervisorAccount";
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import ErrorIcon from '@material-ui/icons/Error';
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import ExploreIcon from '@material-ui/icons/Explore';
import MuiAlert from "@material-ui/lab/Alert";

const useStyles = makeStyles((theme) => ({
  root: {
    margin: "auto",
    maxWidth: "1000px",
    padding: "10px",
  },
  content: {
    padding: "20px",
  },
  seeAllAssessmentButton: {
    backgroundColor: theme.palette.create.main,
    color: "white",
    "&:focus, &:hover": {
      backgroundColor: "white",
      color: theme.palette.create.main,
    },
  },
  editAssessmentButton: {
    backgroundColor: theme.palette.primary.main,
    color: "white",
    "&:focus, &:hover": {
      backgroundColor: "white",
      color: theme.palette.primary.main,
    },
  },
  deleteAssessmentButton: {
    backgroundColor: theme.palette.error.dark,
    color: "white",
    "&:focus, &:hover": {
      backgroundColor: "white",
      color: theme.palette.error.dark,
    },
  },
  copyToClipboardButton: {
    backgroundColor: "#974994",
    color: "white",
    "&:focus, &:hover": {
      backgroundColor: "#974994",
      color: "#white"
    },
  },
  dialogBox: {
    maxWidth: "350px",
    padding: "15px",
  },
  dialogDeleteButton: {
    width: "150px",
    backgroundColor: theme.palette.error.dark,
    color: "white",
    "&:focus, &:hover": {
      backgroundColor: theme.palette.error.dark,
      color: "white",
    },
  },
  dialogCancelButton: {
    width: "150px",
    backgroundColor: theme.palette.primary.main,
    color: "white",
    "&:focus, &:hover": {
      backgroundColor: theme.palette.primary.main,
      color: "white",
    },
  },
  startDateText: {
    color: theme.palette.primary.main
  },
  endDateText: {
    color: theme.palette.warning.main
  },
  answerText: {
    color: theme.palette.success.dark
  },
  optionText: {
    color: "black"
  },
  sortButton: {
    backgroundColor: theme.palette.action.selected,
    marginTop: "auto",
    marginBottom: "auto",
    color: "black",
    "&:focus, &:hover": {
      backgroundColor: theme.palette.divider,
      color: "black",
    },
  },
  perStudentSelect: {
      paddingTop: "10px",
      paddingBottom: "10px",
      marginBottom: "30px"
  },
  navigationHelpIcon: {
      fontSize: "10px",
      color: theme.palette.text.secondary,
      marginLeft: "5px"
  },
  selectDiv: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center"
  },
  select: {
      marginLeft: "10px",
      minWidth:"180px",
      maxWidth:"180px"
  },
  selectDescription: {
      display: "flex",
      justifyContent: "flex-end",
      alignItems: "center"
  },
  contentItem: {
      padding: "20px",
      marginBottom: "30px"
  },
  checkBadge: {
      color: theme.palette.success.dark
  },    
  warningBadge: {
      color: theme.palette.error.dark
  },
  saveButton: {
      backgroundColor: theme.palette.primary.main,
      color: "white",
      marginLeft: "10px",
      height: "80%",
      "&:focus, &:hover": {
        backgroundColor: theme.palette.primary.dark,
      },
  },
  mobileNav: {
      display: "flex", 
      flexDirection: "column", 
      alignItems: "center"
  },
  mobileNavButton: {
      color: theme.palette.text.secondary
  }
}));

function ViewAssessmentTeacher(props) {
  const classes = useStyles();

  document.title = "Schooly | Buat Kuis";
  const assessment_id = props.match.params.id;

  const { getOneAssessment, getAllClass, getAllSubjects, deleteAssessment } = props;
  // const { all_classes_map } = props.classesCollection;
  const { all_subjects_map } = props.subjectsCollection;
  const { selectedAssessments } = props.assessmentsCollection;
  const { questions, type } = selectedAssessments;
  const [copySnackbarOpen, setOpenCopySnackBar] = React.useState(null);

  const [openDeleteDialog, setOpenDeleteDialog] = React.useState(null);
  const [selectedAssessmentId, setSelectedAssessmentId] = React.useState(null);
  const [selectedAssessmentName, setSelectedAssessmentName] = React.useState(null);

  // Tabs
  const [value, setValue] = React.useState(0);

  console.log(selectedAssessmentName)
  React.useEffect(() => {
    getOneAssessment(assessment_id)
    getAllClass("map")
    getAllSubjects("map")
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const onDeleteAssessment = (id) => {
    deleteAssessment(id)
  }

  // Delete Dialog
  const handleOpenDeleteDialog = (e, id, name) => {
    e.stopPropagation();
    setOpenDeleteDialog(true);
    setSelectedAssessmentId(id)
    setSelectedAssessmentName(name)
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
  };

  // Sort Menu
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleOpenSortMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseSortMenu = () => {
    setAnchorEl(null);
  };

  // Tabs
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
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
            {children}
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
  };

  const generateSoalShortTextTeacher = (qst, qstIndex) => {
    let splitResult = qst.name.split("`");
    let iterator = 0;

    for (let i = 1; i <= splitResult.length - 2; i += 2) {
      splitResult[i] = (
        <Input
          type="text"
          key={`${qstIndex}-${iterator}`}
          disabled={true}
          value={qst.answer[iterator]}
        />);
      iterator++;
    }
    
    return (
      <Typography variant="body1" gutterButtom>
        <form>
          {splitResult}
        </form>
      </Typography>
    ); 
  }

  const handleOpenCopySnackBar = (type) => {
    setOpenCopySnackBar(true);
  }

  const handleCloseCopySnackBar = () => {
    setOpenCopySnackBar(false);
  }

  // Generate Soal
  const generateQuestion = (number, question, weight) => {
    return (
        <Paper className={classes.contentItem}>
            <Typography align="center" variant="h6" style={{marginBottom: "10px"}}><b>{`Soal ${number}`}</b></Typography>
            <Typography align="justify">{`${question}`}</Typography>
            <Typography align="center" style={{marginTop: "15px"}} color="primary">{`Bobot : ${weight}`}</Typography>
        </Paper>
    )
  }

  const generateQuestionPerQuestion = (studentName, studentClass, studentAnswer, studentMark, answerChecked) => {
    return (
      <Badge 
        badgeContent={(answerChecked) ? <CheckCircleIcon className={classes.checkBadge} fontSize="large"/> :
            <ErrorIcon className={classes.warningBadge} fontSize="large"/>} variant="standard" style={{marginLeft: "4px"}}>
          <Paper className={classes.contentItem}>
              <Typography variant="h6"><b>{`${studentName}`}</b></Typography>
              <Typography variant="subtitle-1" color="textSecondary">{`${studentClass}`}</Typography>
              <Divider style={{marginBottom: "10px", marginTop: "10px"}}/>
              <Typography align="justify">{`${studentAnswer}`}</Typography>
              <div style={{display: "flex", flexDirection: "row", justifyContent: "flex-end", alignItems: "center", marginTop: "25px"}}>
                <Typography style={{marginTop: "5px", marginRight: "10px"}} color="textSecondary">Poin :</Typography>
                <TextField
                    defaultValue={studentMark}
                    inputProps={{
                    style: {
                        borderBottom: "none",
                        boxShadow: "none",
                        margin: "0px",
                        width: "30px"
                    }
                    }}
                    InputProps={{
                        endAdornment: "/ 100",
                    }}
                />
                <div>
                    <Button className={classes.saveButton} size="small">SIMPAN</Button>
                </div>
              </div>
          </Paper>
      </Badge>
    )
  }

  const generateQuestionandAnswerPerStudent = (number, question, weight, studentName, studentClass, studentAnswer, studentMark, answerChecked) => {
      return (
        <Badge 
            badgeContent={(answerChecked) ? <CheckCircleIcon className={classes.checkBadge} fontSize="large"/> :
                <ErrorIcon className={classes.warningBadge} fontSize="large"/>} variant="standard" style={{marginLeft: "4px"}}>
            <Paper className={classes.contentItem}>
                <Typography align="center" variant="h6" style={{marginBottom: "10px"}}><b>{`Soal ${number}`}</b></Typography>
                <Typography align="justify">{`${question}`}</Typography>
                <Typography align="center" style={{marginTop: "15px"}} color="primary">{`Bobot : ${weight}`}</Typography>
                <Divider style={{marginBottom: "15px", marginTop: "15px"}}/>
                <Typography variant="h6" style={{textDecoration: "underline", marginBottom: "10px"}}><b>Jawaban</b></Typography>
                <Typography align="justify">{`${studentAnswer}`}</Typography>
                <div style={{display: "flex", flexDirection: "row", justifyContent: "flex-end", alignItems: "center", marginTop: "25px"}}>
                    <Typography style={{marginTop: "5px", marginRight: "10px"}} color="textSecondary">Poin :</Typography>
                    <TextField
                        defaultValue={studentMark}
                        inputProps={{
                        style: {
                            borderBottom: "none",
                            boxShadow: "none",
                            margin: "0px",
                            width: "30px"
                        }
                        }}
                        InputProps={{
                            endAdornment: "/ 100",
                        }}
                    />
                    <div>
                        <Button className={classes.saveButton} size="small">SIMPAN</Button>
                    </div>
                </div>
            </Paper>   
        </Badge>
      )
  }

  // Ganti halaman Soal
  function QuestionPage(props) {
    const { classes, handleChangeQuestion, question_number, answer } = props;
    console.log(answer)
    return (
      <Grid item>
        <Badge
          badgeContent={(answer[question_number - 1].length > 0 && answer[question_number - 1].some((elm) => {return elm !== ""})) ?
              <Avatar style={{backgroundColor: "green", color: "white", width: "20px", height: "20px"}}>
                <CheckCircleIcon style={{width: "15px", height: "15px"}} />
              </Avatar>
            :
              <Avatar style={{backgroundColor: "red", color: "white", width: "20px", height: "20px"}}>
                <ErrorIcon style={{width: "15px", height: "15px"}} />
              </Avatar>
          }
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
        >
          <Paper
            buttons
            variant="outlined"
            className={classes.questionPage}
            onClick={() => handleChangeQuestion(question_number-1)}
          >
            <Typography>
              {question_number}
            </Typography>
          </Paper>
        </Badge>
      </Grid>
    )
  }

  let linkToShare = `http://${window.location.host}/kuis-murid/${assessment_id}`;

  return (
    <div className={classes.root}>
      {/* Ini Delete Dialog yang untuk delete Item yang udah ada */}
      <DeleteDialog
        openDeleteDialog={openDeleteDialog}
        handleCloseDeleteDialog={handleCloseDeleteDialog}
        itemType="Kuis"
        // deleteItem=""
        itemName={selectedAssessments.name}
        deleteItem={() => { onDeleteAssessment(selectedAssessmentId) }}
        />
        <Grid container direction="column" spacing={3}>
          <Grid item>
            <Paper className={classes.content}>
              <Grid container spacing={2}>
                <Grid item xs={12} md={7}>
                  <Typography variant="h5" gutterBottom>
                    <b>{selectedAssessments.name}</b>
                  </Typography>
                  <Typography variant="caption" color="textSecondary">
                    <h6>Mata Pelajaran: {all_subjects_map.get(selectedAssessments.subject)}</h6>
                  </Typography>
                  <Typography color="primary" gutterBottom style={{marginTop: "20px"}}>
                    Deskripsi Ujian/Kuis:
                  </Typography>
                  <Typography>
                    {selectedAssessments.description}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={5} spacing={2}>
                  <Hidden mdUp implementation="css">
                    <Typography variant="body2" className={classes.startDateText}>
                      Waktu mulai kerja: {moment(selectedAssessments.start_date).locale("id").format("DD MMM YYYY, HH:mm")}
                    </Typography>
                    <Typography variant="body2" className={classes.endDateText}>
                      Batas waktu kerja: {moment(selectedAssessments.end_date).locale("id").format("DD MMM YYYY, HH:mm")}
                    </Typography>
                  </Hidden>
                  <Hidden smDown implementation="css">
                    <Typography align="right" variant="body2" className={classes.startDateText}>
                      Waktu mulai kerja: {moment(selectedAssessments.start_date).locale("id").format("DD MMM YYYY, HH:mm")}
                    </Typography>
                    <Typography align="right" variant="body2" className={classes.endDateText}>
                      Batas waktu kerja: {moment(selectedAssessments.end_date).locale("id").format("DD MMM YYYY, HH:mm")}
                    </Typography>
                  </Hidden>
                </Grid>
              </Grid>
              <Grid container spacing={2}>
                <Grid item xs={12} md={12}>
                    <Divider/>
                </Grid>
              </Grid>
              <Grid container spacing={2}>
                <Hidden xsDown>
                <Grid item xs={12} md={2} style={{display: "flex", flexDirection: "row", marginTop: "10px"}}>
                    <Typography>Navigasi Soal :</Typography>
                    <LightTooltip title="Soal yang sudah diberi bobot dan nilai untuk semua murid akan diberi badge hijau. Soal akan diberi badge merah jika bobot atau nilai belum lengkap.">
                        <Badge badgeContent={<HelpOutlineIcon className={classes.navigationHelpIcon}/>} variant="standard" style={{marginLeft: "4px"}}>
                            {/* Hanya Sebagai Anchor */}
                            <Typography style={{display: "none"}}>:</Typography>                      
                        </Badge>
                    </LightTooltip>
                </Grid>
                </Hidden>
                <Hidden smUp>
                    <Grid item xs={12} md={2} style={{display: "flex", flexDirection: "row", marginTop: "10px", justifyContent: "space-between"}}>
                        <Button>
                            <div className={classes.mobileNav}>
                                <NavigateBeforeIcon className={classes.mobileNavButton}/>
                                <Typography variant="subtitle-2">Sebelum</Typography>
                            </div>
                        </Button>
                        <Button>
                            <div className={classes.mobileNav}>
                                <ExploreIcon className={classes.mobileNavButton}/>
                                <Typography variant="subtitle-2">Navigasi Soal</Typography>
                            </div>
                        </Button>
                        <Button>
                            <div className={classes.mobileNav}>
                                <NavigateNextIcon className={classes.mobileNavButton}/>
                                <Typography variant="subtitle-2">Sesudah</Typography>
                            </div>
                        </Button>
                    </Grid>
                </Hidden>
              </Grid>
              <Grid container spacing={2}>
                <Grid item xs={12} md={12}>
                    <Divider/>
                </Grid>
              </Grid>
              <Grid container spacing={2}>
                <Grid item xs={1} md={2}>
                    {null}
                </Grid>
                <Grid item xs={9} md={8}>
                    <Tabs
                    variant="fullWidth"
                    indicatorColor="primary"
                    textColor="primary"
                    value={value}
                    onChange={handleChange}
                    >
                        <Tab icon={<BallotIcon />} label="Per Soal" {...TabIndex(0)}/>
                        <Tab icon={<SupervisorAccountIcon />} label="Per Murid" {...TabIndex(1)}/>
                    </Tabs>
                </Grid>
                <Grid item xs={2} md={2} style={{display: "flex", justifyContent: "flex-end", alignItems: "flex-end", position: "relative"}}>
                    <LightTooltip title="Urutkan Tugas">
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
                        <MenuItem>Nama Kelas</MenuItem>
                        <MenuItem>Nama Murid</MenuItem>
                    </Menu>
                </Grid>
              </Grid>
            </Paper>
            <TabPanel value={value} index={0}>
                {generateQuestion(1,"Jelaskan keuntungan dan kerugian dari keputusan membangun sistem dan membeli sistem! Sertakan 2 contoh yang relevan dengan kebutuhan organisasi yang Anda bahas pada dokumen tugas besar! Jelaskan keuntungan dan kerugian dari keputusan membangun sistem dan membeli sistem! Sertakan 2 contoh yang relevan dengan kebutuhan organisasi yang Anda bahas pada dokumen tugas besar!",10)}
                {generateQuestionPerQuestion("Elon Musk","Kelas VIII-B","Revolusi Amerika Terjadi Pada 1776, di mana Pasukan Kolonial Amerika berhasil menumpas penjajahan Bangsa Inggris melalui perjuangan selama bertahun-tahun.Revolusi Amerika Terjadi Pada 1776, di mana Pasukan Kolonial Amerika berhasil menumpas penjajahan Bangsa Inggris melalui perjuangan selama bertahun-tahun.Revolusi Amerika Terjadi Pada 1776, di mana Pasukan Kolonial Amerika berhasil menumpas penjajahan Bangsa Inggris melalui perjuangan selama bertahun-tahun.",10,true)}
            </TabPanel>
            <TabPanel value={value} index={1}>
                <Paper className={classes.perStudentSelect}>
                    <div className={classes.selectDiv}>
                        <Grid container>
                            <Grid item xs={1} sm={3}></Grid>
                            <Grid item xs={3} sm={2} className={classes.selectDescription}>
                                <Typography>Nama Murid :</Typography>
                            </Grid>
                            <Grid item xs={6} sm={2}>
                                {/*<InputLabel id="kelas-label">Kelas</InputLabel>*/}
                                <Select
                                    labelId="kelas-label"
                                    id="kelas"
                                    className={classes.select}
                                    variant="outlined"
                                >
                                    <option value={10}>Ten</option>
                                </Select>
                            </Grid>
                            <Grid item xs={2} sm={5}></Grid>
                        </Grid>
                    </div>
                    <div className={classes.selectDiv} style={{marginTop: "10px"}}>
                        <Grid container>
                            <Grid item xs={1} sm={3}></Grid>
                            <Grid item xs={3} sm={2} className={classes.selectDescription}>
                                <Typography>Kelas :</Typography>
                            </Grid>
                            <Grid item xs={6} sm={2}>
                                {/*<InputLabel id="kelas-label">Kelas</InputLabel>*/}
                                <Select
                                    labelId="kelas-label"
                                    id="kelas"
                                    className={classes.select}
                                    variant="outlined"
                                >
                                    <option value={10}>Ten</option>
                                </Select>
                            </Grid>
                            <Grid item xs={2} sm={5}></Grid>
                        </Grid>
                    </div>
                </Paper>
                {generateQuestionandAnswerPerStudent(1,"Jelaskan keuntungan dan kerugian dari keputusan membangun sistem dan membeli sistem! Sertakan 2 contoh yang relevan dengan kebutuhan organisasi yang Anda bahas pada dokumen tugas besar! Jelaskan keuntungan dan kerugian dari keputusan membangun sistem dan membeli sistem! Sertakan 2 contoh yang relevan dengan kebutuhan organisasi yang Anda bahas pada dokumen tugas besar!",10,"Elon Musk","Kelas VIII-B","Revolusi Amerika Terjadi Pada 1776, di mana Pasukan Kolonial Amerika berhasil menumpas penjajahan Bangsa Inggris melalui perjuangan selama bertahun-tahun.Revolusi Amerika Terjadi Pada 1776, di mana Pasukan Kolonial Amerika berhasil menumpas penjajahan Bangsa Inggris melalui perjuangan selama bertahun-tahun.Revolusi Amerika Terjadi Pada 1776, di mana Pasukan Kolonial Amerika berhasil menumpas penjajahan Bangsa Inggris melalui perjuangan selama bertahun-tahun.",10,true)}
            </TabPanel>
          </Grid>
          {!Array.isArray(questions) ? null :
          questions.map((question, i) => (
            <Grid item>
              <Paper>
                <Grid container direction="column" spacing={2} className={classes.content}>
                  <Grid item>
                    <Typography variant="h6" gutterBottom color="primary">
                      Soal {i+1}
                    </Typography>
                    <GridList cols={3} cellHeight={300} style={{margin: "10px 0px 10px 0px"}}>
                      {question.lampiran.map((image, i) =>
                        <GridListTile key={image} cols={1} >
                        <img alt="current img" src={`/api/upload/att_assessment/${image}`}/>
                        <GridListTileBar
                            title={`Gambar ${i+1}`}
                            titlePosition="top"
                            actionPosition="right"/>
                      </GridListTile>
                      )}
                    </GridList>
                    <Typography variant="h6">
                      {
                        (question.type === "shorttext") ? (
                          generateSoalShortTextTeacher(question, i)
                        ) : (question.type === "longtext") ? (
                          <Typography variant="body1" gutterButtom>
                            {question.name}
                          </Typography>
                        ) : (
                          <Typography variant="h5" gutterButtom>
                            <b>{question.name}</b>
                          </Typography>
                        )
                      }
                    </Typography>
                  </Grid>
                  <Grid item>
                    {(question.type === "radio") ? (
                      question.options.map((option, i) => (
                        <Typography className={question.answer[0] === String.fromCharCode(97 + i).toUpperCase() ? classes.answerText : classes.optionText}>
                          {option}
                        </Typography>
                      ))
                    ) : (question.type === "checkbox") ? (
                      question.options.map((option, i) => (
                        <Typography className={question.answer.includes(String.fromCharCode(97 + i).toUpperCase()) ? classes.answerText : classes.optionText}>
                          {option}
                        </Typography>
                      ))
                    ) : ( // question.type === "shorttext" || question.type === "shorttext" 
                      null
                    )
                    }
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
          ))}
        </Grid>
        <Snackbar open={copySnackbarOpen} autoHideDuration={3000} onClose={handleCloseCopySnackBar}>
          <MuiAlert onClose={handleCloseCopySnackBar} severity="success">
            Link {type} berhasil disalin ke Clipboard Anda!
          </MuiAlert>
        </Snackbar>
    </div>
  )
};

ViewAssessmentTeacher.propTypes = {
  auth: PropTypes.object.isRequired,
  assessmentsCollection: PropTypes.object.isRequired,
  subjectsCollection: PropTypes.object.isRequired,
  getOneAssessment: PropTypes.func.isRequired,
  getAllClass: PropTypes.func.isRequired,
  getAllSubjects: PropTypes.func.isRequired,
  deleteAssessment: PropTypes.func.isRequired
}

const mapStateToProps = (state) => ({
  auth: state.auth,
  assessmentsCollection: state.assessmentsCollection,
  subjectsCollection: state.subjectsCollection,
  classesCollection: state.classesCollection
})

export default connect(
  mapStateToProps, { getOneAssessment, deleteAssessment, getAllClass, getAllSubjects }
)(ViewAssessmentTeacher);