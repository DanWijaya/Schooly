import React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import moment from "moment";
import { getOneAssessment, deleteAssessment } from "../../../actions/AssessmentActions"
import { getAllClass } from "../../../actions/ClassActions";
import { getAllSubjects } from "../../../actions/SubjectActions";
import LightTooltip from "../../misc/light-tooltip/LightTooltip";
import { Fab, Grid, GridListTile, GridListTileBar, GridList, Hidden, Paper, Typography, Input, Snackbar} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import AssignmentIcon from "@material-ui/icons/Assignment";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import DeleteDialog from "../../misc/dialog/DeleteDialog";
import LinkIcon from '@material-ui/icons/Link';
import MuiAlert from "@material-ui/lab/Alert";

const useStyles = makeStyles((theme) => ({
  root: {
    margin: "auto",
    maxWidth: "1000px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
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
      backgroundColor: "white",
      color: "#974994"
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

  const copyToClipboardButton = (e, linkToShare, type) => {
    e.stopPropagation()
    let textArea = document.createElement("textarea");
    textArea.value = linkToShare;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    e.target.focus();
    document.body.removeChild(textArea);
    handleOpenCopySnackBar(type)
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
          <Grid item style={{marginBottom: "20px"}}>
            <Paper className={classes.content}>
              <Grid container spacing={6}>
                <Grid item xs={12} md={7} spacing={8}>
                  <Typography variant="h4" gutterBottom>
                    {selectedAssessments.name}
                  </Typography>
                  <Typography variant="caption" color="textSecondary">
                    <h6>Mata Pelajaran: {all_subjects_map.get(selectedAssessments.subject)}</h6>
                  </Typography>
                  <Typography color="primary" gutterBottom style={{marginTop: "30px"}}>
                    Deskripsi Kuis/Ujian:
                  </Typography>
                  <Typography>
                    {selectedAssessments.description}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={5} spacing={2}>
                  <Hidden mdUp implementation="css">
                    <Typography variant="body2" className={classes.startDateText}>
                      Waktu mulai kerja: {moment(selectedAssessments.start_date).locale("id").format("DD MMM YYYY, HH.mm")}
                    </Typography>
                    <Typography variant="body2" className={classes.endDateText}>
                      Batas waktu kerja: {moment(selectedAssessments.end_date).locale("id").format("DD MMM YYYY, HH.mm")}
                    </Typography>
                    <Typography variant="body2" color="textSecondary" style={{marginTop: "20px"}}>
                      Nilai Maksimum: 100
                    </Typography>
                  </Hidden>
                  <Hidden smDown implementation="css">
                    <Typography align="right" variant="body2" className={classes.startDateText}>
                      Waktu mulai kerja: {moment(selectedAssessments.start_date).locale("id").format("DD MMM YYYY, HH:mm")}
                    </Typography>
                    <Typography align="right" variant="body2" className={classes.endDateText}>
                      Batas waktu kerja: {moment(selectedAssessments.end_date).locale("id").format("DD MMM YYYY, HH:mm")}
                    </Typography>
                    <Typography align="right" variant="body2" color="textSecondary" style={{marginTop: "20px"}}>
                      Nilai Maksimum: 100
                    </Typography>
                  </Hidden>
                </Grid>
              </Grid>
            </Paper>
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
          <Grid item container spacing={2} justify="flex-end" alignItems="center">
            <Grid item>
              <LightTooltip title="Copy Link">
                <Fab className={classes.copyToClipboardButton}
                  onClick={(e) => copyToClipboardButton(e, linkToShare, type)}>
                  <LinkIcon/>
                  </Fab>
              </LightTooltip>
            </Grid>
            <Grid item>
              <Link to={`/daftar-kuis-terkumpul/${assessment_id}`}>
                <Fab variant="extended" className={classes.seeAllAssessmentButton}>
                  <AssignmentIcon style={{marginRight: "10px"}} />
                  Lihat Hasil
                </Fab>
              </Link>
            </Grid>
            <Grid item>
            <Link to={`/sunting-kuis/${assessment_id}`}>
              <LightTooltip title="Sunting Kuis" placement="bottom">
                <Fab className={classes.editAssessmentButton}>
                  <EditIcon />
                </Fab>
              </LightTooltip>
            </Link>
            </Grid>
            <Grid item>
              <LightTooltip title="Buang Kuis" placement="bottom">
                <Fab className={classes.deleteAssessmentButton} onClick={(e) => {handleOpenDeleteDialog(e, assessment_id)}}>
                  <DeleteIcon />
                </Fab>
              </LightTooltip>
            </Grid>
          </Grid>
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
