import React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import moment from "moment";
import { getOneAssessment, deleteAssessment } from "../../../actions/AssessmentActions"
import { getAllClass } from "../../../actions/ClassActions";
import { getAllSubjects } from "../../../actions/SubjectActions";
import LightTooltip from "../../misc/light-tooltip/LightTooltip";
import { Button, Dialog, Fab, Grid, GridListTile, GridListTileBar, GridList, Hidden, IconButton, Paper, Typography, Input } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import AssignmentIcon from "@material-ui/icons/Assignment";
import CancelIcon from "@material-ui/icons/Cancel";
import CloseIcon from "@material-ui/icons/Close";
import DeleteIcon from "@material-ui/icons/Delete";
import DeleteOutlineIcon from "@material-ui/icons/DeleteOutline";
import EditIcon from "@material-ui/icons/Edit";

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
  const { questions } = selectedAssessments;

  const [openDeleteDialog, setOpenDeleteDialog] = React.useState(null);
  const [selectedAssessmentId, setSelectedAssessmentId] = React.useState(null);
  const [selectedAssessmentName, setSelectedAssessmentName] = React.useState(null);

  React.useEffect(() => {
    getOneAssessment(assessment_id)
    getAllClass("map")
    getAllSubjects("map")
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

  function DeleteDialog() {
    return (
      <Dialog
        open={openDeleteDialog}
        onClose={handleCloseDeleteDialog}
      >
        <Grid container direction="column" alignItems="center" className={classes.dialogBox}>
          <Grid item container justify="flex-end" alignItems="flex-start">
            <IconButton
              size="small"
              onClick={handleCloseDeleteDialog}
            >
              <CloseIcon />
            </IconButton>
          </Grid>
          <Grid item container justify="center" style={{marginBottom: "20px"}}>
            <Typography variant="h5" gutterBottom>
              Hapus Kuis berikut?
            </Typography>
          </Grid>
          <Grid item container justify="center" style={{marginBottom: "20px"}}>
            <Typography variant="h6" align="center" gutterBottom>
              <b>{selectedAssessments.name}</b>
            </Typography>
          </Grid>
          <Grid
            container
            direction="row"
            justify="center"
            alignItems="center"
            spacing={2}
            style={{marginBottom: "10px"}}
          >
            <Grid item>
              <Button
                onClick={() => { onDeleteAssessment(assessment_id) }}
                startIcon={<DeleteOutlineIcon />}
                className={classes.dialogDeleteButton}>
                Hapus
              </Button>
            </Grid>
            <Grid item>
              <Button
                onClick={handleCloseDeleteDialog}
                startIcon={< CancelIcon/>}
                className={classes.dialogCancelButton}
              >
                Batal
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Dialog>
    )
  }


  return (
    <div className={classes.root}>
      {DeleteDialog()}
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
                    Deskripsi Tugas:
                  </Typography>
                  <Typography>
                    {selectedAssessments.description}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={5} spacing={2}>
                  <Hidden mdUp implementation="css">
                    <Typography variant="body2" className={classes.startDateText}>
                      Waktu mulai kerja: {moment(selectedAssessments.start_date).locale("id").format("DD/MMMM/YYYY - HH.mm")}
                    </Typography>
                    <Typography variant="body2" className={classes.endDateText}>
                      Batas waktu kerja: {moment(selectedAssessments.end_date).locale("id").format("DD/MMMM/YYYY - HH.mm")}
                    </Typography>
                    <Typography variant="body2" color="textSecondary" style={{marginTop: "20px"}}>
                      Nilai Maksimum: 100
                    </Typography>
                  </Hidden>
                  <Hidden smDown implementation="css">
                    <Typography align="right" variant="body2" className={classes.startDateText}>
                      Waktu mulai kerja: {moment(selectedAssessments.start_date).locale("id").format("DD/MMMM/YYYY - HH.mm")}
                    </Typography>
                    <Typography align="right" variant="body2" className={classes.endDateText}>
                      Batas waktu kerja: {moment(selectedAssessments.end_date).locale("id").format("DD/MMMM/YYYY - HH.mm")}
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
                        <img alt="current image" src={`/api/upload/att_assessment/${image}`}/>
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
