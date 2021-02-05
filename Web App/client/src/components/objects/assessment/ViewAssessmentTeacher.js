import React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import moment from "moment";
import {
  getOneAssessment,
  deleteAssessment,
} from "../../../actions/AssessmentActions";
import { getAllClass } from "../../../actions/ClassActions";
import { getAllSubjects } from "../../../actions/SubjectActions";
import { getFileAssessment } from "../../../actions/files/FileAssessmentActions";
import LightTooltip from "../../misc/light-tooltip/LightTooltip";
import {
  Fab,
  Grid,
  GridListTile,
  GridListTileBar,
  GridList,
  Hidden,
  Paper,
  Typography,
  Input,
  Snackbar,
  Divider,
  useMediaQuery
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import AssignmentIcon from "@material-ui/icons/Assignment";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import DeleteDialog from "../../misc/dialog/DeleteDialog";
import LinkIcon from "@material-ui/icons/Link";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import MuiAlert from "@material-ui/lab/Alert";
import SwitchBase from "@material-ui/core/internal/SwitchBase";

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
    backgroundColor: theme.palette.success.main,
    color: "white",
    "&:focus, &:hover": {
      backgroundColor: "white",
      color: theme.palette.success.main,
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
    backgroundColor: theme.palette.copylink.main,
    color: "white",
    "&:focus, &:hover": {
      backgroundColor: "white",
      color: theme.palette.copylink.main,
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
  answerText: {
    color: theme.palette.success.dark,
  },
  optionText: {
    color: "black",
  },
  paperBox: {
    padding: "20px",
    marginBottom: "10px",
  },
  dividerColor: {
    backgroundColor: theme.palette.primary.main,
  },
}));

function ViewAssessmentTeacher(props) {
  const classes = useStyles();

  document.title = "Schooly | Buat Kuis";
  const assessment_id = props.match.params.id;
  const isMobileView = useMediaQuery("(max-width:780px)");
  const {
    getOneAssessment,
    getAllClass,
    getAllSubjects,
    deleteAssessment,
    getFileAssessment
  } = props;
  const { all_classes_map } = props.classesCollection;
  const { all_subjects_map } = props.subjectsCollection;
  const { selectedAssessments } = props.assessmentsCollection;
  const { questions, type } = selectedAssessments;
  const [copySnackbarOpen, setOpenCopySnackBar] = React.useState(null);

  const [openDeleteDialog, setOpenDeleteDialog] = React.useState(null);
  const [selectedAssessmentId, setSelectedAssessmentId] = React.useState(null);
  const [selectedAssessmentName, setSelectedAssessmentName] = React.useState(
    null
  );
  const [lampiranUrls, setLampiranUrls] = React.useState(new Map());

  console.log(selectedAssessments);
  React.useEffect(() => {
    getOneAssessment(assessment_id);
    getAllClass("map");
    getAllSubjects("map");
    getFileAssessment(assessment_id).then((result) => setLampiranUrls(result))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  console.log(lampiranUrls);
  
  const onDeleteAssessment = (id) => {
    deleteAssessment(id);
  };

  // Delete Dialog
  const handleOpenDeleteDialog = (e, id, name) => {
    e.stopPropagation();
    setOpenDeleteDialog(true);
    setSelectedAssessmentId(id);
    setSelectedAssessmentName(name);
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
        />
      );
      iterator++;
    }

    return (
      <Typography variant="body1" gutterButtom>
        <form>{splitResult}</form>
      </Typography>
    );
  };

  const handleOpenCopySnackBar = (type) => {
    setOpenCopySnackBar(true);
  };

  const handleCloseCopySnackBar = () => {
    setOpenCopySnackBar(false);
  };

  const copyToClipboardButton = (e, linkToShare, type) => {
    e.stopPropagation();
    let textArea = document.createElement("textarea");
    textArea.value = linkToShare;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand("copy");
    e.target.focus();
    document.body.removeChild(textArea);
    handleOpenCopySnackBar(type);
  };

  let linkToShare =
    selectedAssessments.type === "Kuis"
      ? `http://${window.location.host}/kuis-murid/${assessment_id}`
      : `http://${window.location.host}/ujian-murid/${assessment_id}`;
  console.log(questions);
  return (
    <div className={classes.root}>
      {/* Ini Delete Dialog yang untuk delete Item yang udah ada */}
      <DeleteDialog
        openDeleteDialog={openDeleteDialog}
        handleCloseDeleteDialog={handleCloseDeleteDialog}
        itemType={selectedAssessments.type}
        // deleteItem=""
        itemName={selectedAssessments.name}
        deleteItem={() => {
          onDeleteAssessment(selectedAssessmentId);
        }}
        isWarning={true}
      />
      <Grid container direction="column" spacing={3}>
        <Grid item style={{ marginBottom: "20px" }}>
          <Paper className={classes.paperBox}>
            {/* <Grid container spacing={6} className={classes.content}> */}
            {/* <Grid container spacing={2} className={classes.content}> */}
            <Grid container spacing={2}>
              <Hidden smDown>
                <Grid item xs={12} style={{ paddingBottom: "0" }}>
                  <Typography variant="h4">
                    {selectedAssessments.name}
                  </Typography>
                </Grid>

                <Grid
                  item
                  xs={12}
                  md={7}
                  spacing={8}
                  style={{ paddingTop: "0" }}
                >
                  <Typography variant="caption" color="textSecondary">
                    <h6>{all_subjects_map.get(selectedAssessments.subject)}</h6>
                  </Typography>
                </Grid>

                <Grid
                  item
                  xs={12}
                  md={5}
                  spacing={8}
                  style={{ paddingTop: "0" }}
                >
                  <h6 style={{ marginBottom: "0" }}>
                    <Typography
                      align="right"
                      variant="body2"
                      color="textSecondary"
                    >
                      Mulai:{" "}
                      {moment(selectedAssessments.start_date)
                        .locale("id")
                        .format("DD MMM YYYY, HH:mm")}
                    </Typography>
                  </h6>
                  <Typography
                    align="right"
                    variant="body2"
                    color="textSecondary"
                  >
                    Selesai:{" "}
                    {moment(selectedAssessments.end_date)
                      .locale("id")
                      .format("DD MMM YYYY, HH:mm")}
                  </Typography>
                </Grid>
              </Hidden>

              <Hidden mdUp>
                <Grid item xs={12}>
                  <Typography variant="h4">
                    {selectedAssessments.name}
                  </Typography>
                  <Typography variant="caption" color="textSecondary">
                    <h6>{all_subjects_map.get(selectedAssessments.subject)}</h6>
                  </Typography>
                </Grid>

                <Grid item xs={12} md={7} spacing={8}>
                  <Typography variant="body2" color="textSecondary">
                    Mulai:{" "}
                    {moment(selectedAssessments.start_date)
                      .locale("id")
                      .format("DD MMM YYYY, HH:mm")}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Selesai:{" "}
                    {moment(selectedAssessments.end_date)
                      .locale("id")
                      .format("DD MMM YYYY, HH:mm")}
                  </Typography>
                </Grid>
              </Hidden>

              <Grid item xs={12}>
                <Divider className={classes.dividerColor} />
              </Grid>

              <Grid item xs={12} style={{ marginTop: "30px" }}>
                <Typography color="primary" gutterBottom>
                  Kelas yang Diberikan:
                </Typography>
                <Typography>
                  {!selectedAssessments.class_assigned || !all_classes_map.size
                    ? null
                    : selectedAssessments.class_assigned.map((kelas, i) => {
                        if (all_classes_map.get(kelas)) {
                          if (
                            i ===
                            selectedAssessments.class_assigned.length - 1
                          )
                            return `${all_classes_map.get(kelas).name}`;
                          return `${all_classes_map.get(kelas).name}, `;
                        }
                        return null;
                      })}
                </Typography>
              </Grid>

              <Grid item xs={12} style={{ marginTop: "30px" }}>
                <Typography color="primary" gutterBottom>
                  Deskripsi Kuis/Ujian:
                </Typography>
                <Typography>{selectedAssessments.description}</Typography>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {!Array.isArray(questions)
          ? null
          : questions.map((question, i) => (
              <Grid item>
                <Paper>
                  <Grid
                    container
                    direction="column"
                    spacing={2}
                    className={classes.content}
                  >
                    <Grid item>
                      <Typography variant="h6" gutterBottom color="primary">
                        Soal {i + 1}
                      </Typography>
                      <GridList
                        cols={3}
                        cellHeight={300}
                        style={{ margin: "10px 0px 10px 0px" }}
                      >
                        {question.lampiran.map((img, i) => {
                        let image = img;
                        if(lampiranUrls.has(image.toString())){
                          return (
                            <GridListTile key={image} cols={1}>
                              <img
                                alt="current img"
                                // src={`/api/upload/att_assessment/${image}`}
                                src={lampiranUrls.get(image.toString())}
                              />
                              <GridListTileBar
                                title={`Gambar ${i + 1}`}
                                titlePosition="top"
                                actionPosition="right"
                              />
                            </GridListTile>
                          )}
                          return null
                        }
                        )}
                      </GridList>
                      <Typography variant="h6">
                        {question.type === "shorttext" ? (
                          generateSoalShortTextTeacher(question, i)
                        ) : question.type === "longtext" ? (
                          <Typography gutterButtom>{question.name}</Typography>
                        ) : (
                          <Typography gutterButtom>{question.name}</Typography>
                        )}
                      </Typography>
                    </Grid>
                    <Grid item>
                      {question.type === "radio"
                        ? question.options.map((option, i) => (
                            // <Typography className={question.answer[0] === String.fromCharCode(97 + i).toUpperCase() ? classes.answerText : classes.optionText}>
                            <Typography className={classes.optionText}>
                              {option + " "}
                              {question.answer[0] ===
                              String.fromCharCode(97 + i).toUpperCase() ? (
                                <CheckCircleIcon
                                  style={{
                                    fontSize: "1rem",
                                    verticalAlign: "middle",
                                  }}
                                  className={classes.answerText}
                                />
                              ) : null}
                            </Typography>
                          ))
                        : question.type === "checkbox"
                        ? question.options.map((option, i) => (
                            // <Typography className={question.answer.includes(String.fromCharCode(97 + i).toUpperCase()) ? classes.answerText : classes.optionText}>
                            <Typography className={classes.optionText}>
                              {option + " "}
                              {question.answer.includes(
                                String.fromCharCode(97 + i).toUpperCase()
                              ) ? (
                                <CheckCircleIcon
                                  style={{
                                    fontSize: "1rem",
                                    verticalAlign: "middle",
                                  }}
                                  className={classes.answerText}
                                />
                              ) : null}
                            </Typography>
                          ))
                        : // question.type === "shorttext" || question.type === "shorttext"
                          null}
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>
            ))}
        <Grid item container spacing={2} justify="flex-end" alignItems="center">
          <Grid item>
            <Link
              to={
                selectedAssessments.type === "Kuis"
                  ? `/daftar-kuis-terkumpul/${assessment_id}`
                  : `/daftar-ujian-terkumpul/${assessment_id}`
              }
            >
              <Fab
                variant="extended"
                className={classes.seeAllAssessmentButton}
              >
                <AssignmentIcon style={{ marginRight: "10px" }} />
                Lihat Hasil
              </Fab>
            </Link>
          </Grid>
          <Grid item>
            <LightTooltip title="Copy Link">
              <Fab
                className={classes.copyToClipboardButton}
                onClick={(e) => copyToClipboardButton(e, linkToShare, type)}
              >
                <LinkIcon />
              </Fab>
            </LightTooltip>
          </Grid>
          <Grid item>
            <Link to={`/sunting-kuis/${assessment_id}`}>
              <LightTooltip title="Sunting" placement="bottom">
                <Fab className={classes.editAssessmentButton}>
                  <EditIcon />
                </Fab>
              </LightTooltip>
            </Link>
          </Grid>
          <Grid item>
            <LightTooltip title="Hapus" placement="bottom">
              <Fab
                className={classes.deleteAssessmentButton}
                onClick={(e) => {
                  handleOpenDeleteDialog(e, assessment_id);
                }}
              >
                <DeleteIcon />
              </Fab>
            </LightTooltip>
          </Grid>
        </Grid>
      </Grid>
      <Snackbar
        open={copySnackbarOpen}
        autoHideDuration={3000}
        onClose={handleCloseCopySnackBar}
      >
        <MuiAlert onClose={handleCloseCopySnackBar} severity="success">
          Link {type} berhasil disalin ke Clipboard Anda!
        </MuiAlert>
      </Snackbar>
    </div>
  );
}

ViewAssessmentTeacher.propTypes = {
  auth: PropTypes.object.isRequired,
  assessmentsCollection: PropTypes.object.isRequired,
  subjectsCollection: PropTypes.object.isRequired,
  getOneAssessment: PropTypes.func.isRequired,
  getAllClass: PropTypes.func.isRequired,
  getAllSubjects: PropTypes.func.isRequired,
  deleteAssessment: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  assessmentsCollection: state.assessmentsCollection,
  subjectsCollection: state.subjectsCollection,
  classesCollection: state.classesCollection,
});

export default connect(mapStateToProps, {
  getOneAssessment,
  deleteAssessment,
  getAllClass,
  getAllSubjects,
  getFileAssessment
})(ViewAssessmentTeacher);
