import React from "react";
import { Link, useHistory } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import moment from "moment";
import { getAllClass } from "../../../actions/ClassActions";
import { getAllSubjects } from "../../../actions/SubjectActions";
import { getOneAssessment, deleteAssessment } from "../../../actions/AssessmentActions";
import { getFileAssessment } from "../../../actions/files/FileAssessmentActions";
import Latex from "../../misc/latex/Latex";
import CustomLinkify from "../../misc/linkify/Linkify";
import DeleteDialog from "../../misc/dialog/DeleteDialog";
import LightTooltip from "../../misc/light-tooltip/LightTooltip";
import {
  Button,
  Divider,
  Fab,
  Grid,
  GridListTile,
  GridListTileBar,
  GridList,
  Hidden,
  Input,
  Paper,
  Snackbar,
  Tooltip,
  Typography
} from "@material-ui/core";
import SwitchBase from "@material-ui/core/internal/SwitchBase";
import Alert from "@material-ui/lab/Alert";
import {
  Assignment as AssignmentIcon,
  CheckCircle as CheckCircleIcon,
  Create as CreateIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  FiberManualRecord as FiberManualRecordIcon,
  Link as LinkIcon,
  PlaylistAddCheck as PlaylistAddCheckIcon
} from "@material-ui/icons";
import { makeStyles } from "@material-ui/core/styles";

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
  assessmentPaper: {
    padding: "20px",
    [theme.breakpoints.down("xs")]: {
      padding: "15px",
    },
  },
  assessmentDivider: {
    margin: "22.5px 0px",
    backgroundColor: theme.palette.primary.light,
  },
  seeResultsButton: {
    boxShadow: "0px 1px 2px 0px rgba(194,100,1,0.3), 0px 2px 6px 2px rgba(194,100,1,0.15)",
    backgroundColor: theme.palette.success.main,
    color: "white",
    "&:focus, &:hover": {
      backgroundColor: theme.palette.success.main,
      color: "white",
    },
  },
  copyLinkButton: {
    textTransform: "none",
    color: theme.palette.copylink.main,
    "&:hover": {
      backgroundColor: theme.palette.copylink.fade,
    },
  },
  editButton: {
    width: "110px",
    textTransform: "none",
    color: theme.palette.primary.main,
    "&:hover": {
      backgroundColor: theme.palette.primary.fade,
    },
    [theme.breakpoints.down("xs")]: {
      width: "100%",
    },
  },
  deleteButton: {
    width: "110px",
    textTransform: "none",
    color: theme.palette.error.main,
    "&:hover": {
      backgroundColor: theme.palette.error.fade,
    },
    [theme.breakpoints.down("xs")]: {
      width: "100%",
    },
  },
  answerText: {
    color: theme.palette.success.dark,
  },
  optionText: {
    color: "black",
    marginLeft: "8px",
  },
  checkIcon: {
    color: theme.palette.success.dark,
    fontSize: "1rem",
    verticalAlign: "middle",
  },
  fiberIcon: {
    fontSize: "0.5rem",
    verticalAlign: "middle",
  },
  bullets: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "1rem",
  },
  shortAnswerText: {
    color: theme.palette.text.secondary,
  },
}));

function ViewAssessmentTeacher(props) {
  const classes = useStyles();
  const history = useHistory();
  const {
    getOneAssessment,
    getAllClass,
    getAllSubjects,
    deleteAssessment,
    getFileAssessment,
  } = props;

  const { all_classes_map } = props.classesCollection;
  const { all_subjects_map } = props.subjectsCollection;
  const { selectedAssessments } = props.assessmentsCollection;
  const assessment_id = props.match.params.id;
  const { questions, type } = selectedAssessments;

  const [copySnackbarOpen, setOpenCopySnackBar] = React.useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = React.useState(null);
  const [selectedAssessmentId, setSelectedAssessmentId] = React.useState(null);
  const [selectedAssessmentName, setSelectedAssessmentName] = React.useState(null);
  const [lampiranUrls, setLampiranUrls] = React.useState(new Map());

  React.useEffect(() => {
    getOneAssessment(assessment_id);
    getAllClass("map");
    getAllSubjects("map");
    getFileAssessment(assessment_id).then((result) => setLampiranUrls(result));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onDeleteAssessment = (id) => {
    deleteAssessment(id, type, history).then((res) => {
    });
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
        <span
          className={classes.shortAnswerText}
          key={`${qstIndex}-${iterator}`}
        >
          <u>{qst.answer[iterator]}</u>
        </span>
      );
      iterator++;
    };

    return (
      <Typography
        align="justify"
        style={{ wordBreak: "break-word", whiteSpace: "pre-wrap" }}
      >
        {/* <Latex content={splitResult}/> */}
        <CustomLinkify text={splitResult} />
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

  const checkSubmissionExist = () => {
    return (
      selectedAssessments &&
      selectedAssessments.submissions &&
      Object.keys(selectedAssessments.submissions).length !== 0
    );
  };

  let linkToShare =
    selectedAssessments.type === "Kuis"
      ? `https://${window.location.host}/kuis-murid/${assessment_id}`
      : `https://${window.location.host}/ujian-murid/${assessment_id}`;

  document.title = "Schooly | Buat Kuis";

  return (
    <div className={classes.root}>
      <Grid container direction="column" spacing={2}>
        <Grid item >
          <Paper className={classes.assessmentPaper}>
            <Typography variant="h4" style={{ marginBottom: "5px" }}>
              {selectedAssessments.name}
            </Typography>
            <Typography color="primary" paragraph>
              {type} {all_subjects_map.get(selectedAssessments.subject)}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Oleh:
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Waktu Dibuat: {moment(selectedAssessments.createdAt)
                .locale("id")
                .format("DD MMM YYYY, HH.mm")}
            </Typography>
            <Divider className={classes.assessmentDivider} />
            <Grid container spacing={4}>
              <Grid item xs={12}>
                <Typography color="textSecondary" gutterBottom>
                  Diberikan kepada:
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
              <Grid item xs={12}>
                <Typography color="textSecondary" gutterBottom>
                  Waktu Pengerjaan:
                </Typography>
                <Typography>
                  Mulai - {moment(selectedAssessments.start_date)
                    .locale("id")
                    .format("DD MMM YYYY, HH:mm")}
                </Typography>
                <Typography>
                  Selesai - {moment(selectedAssessments.end_date)
                    .locale("id")
                    .format("DD MMM YYYY, HH:mm")}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography color="textSecondary" gutterBottom>
                  Deskripsi {type}:
                </Typography>
                <Typography
                  align="justify"
                  style={{ wordBreak: "break-word", whiteSpace: "pre-wrap" }}
                >
                  <CustomLinkify text={selectedAssessments.description} />
                </Typography>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
        <Grid item container justify="space-between" alignItems="center" spacing={1}>
          <Grid item>
            <Link
              to={selectedAssessments.type === "Kuis"
                ? `/daftar-kuis-terkumpul/${assessment_id}`
                : `/daftar-ujian-terkumpul/${assessment_id}`
              }
              style={{ pointerEvents: !checkSubmissionExist() ? "none" : null }}
            >
              <Hidden smDown>
                <Fab
                  size="large"
                  variant="extended"
                  className={classes.seeResultsButton}
                  disabled={!checkSubmissionExist()}
                >
                  <PlaylistAddCheckIcon style={{ marginRight: "8px" }} />
                  Periksa
                </Fab>
              </Hidden>
              <Hidden mdUp>
                <Tooltip title="Periksa">
                  <Fab
                    size="medium"
                    className={classes.seeResultsButton}
                    disabled={!checkSubmissionExist()}
                  >
                    <PlaylistAddCheckIcon />
                  </Fab>
                </Tooltip>
              </Hidden>
            </Link>
          </Grid>
          <Grid item xs container justify="flex-end" alignItems="center" spacing={1}>
            <Grid item>
              <Tooltip title="Salin Tautan">
                <Button
                  variant="outlined"
                  className={classes.copyLinkButton}
                  onClick={(e) => copyToClipboardButton(e, linkToShare, type)}
                >
                  <LinkIcon />
                </Button>
              </Tooltip>
            </Grid>
            {!checkSubmissionExist() ?
              <Grid item>
                <Link to={type === "Kuis" ? `/sunting-kuis/${assessment_id}` : `/sunting-ujian/${assessment_id}`}>
                  <Hidden xsDown>
                    <Button
                      variant="outlined"
                      className={classes.editButton}
                      startIcon={<EditIcon style={{ color: "grey" }} />}
                    >
                      <Typography>
                        Sunting
                      </Typography>
                    </Button>
                  </Hidden>
                  <Hidden smUp>
                    <Tooltip title="Sunting">
                      <Button
                        variant="outlined"
                        className={classes.editButton}
                      >
                        <EditIcon />
                      </Button>
                    </Tooltip>
                  </Hidden>
                </Link>
              </Grid>
            : null}
            <Grid item>
              <Hidden xsDown>
                <Button
                  variant="outlined"
                  className={classes.deleteButton}
                  startIcon={<DeleteIcon style={{ color: "grey" }} />}
                  onClick={(e) => {
                    handleOpenDeleteDialog(e, assessment_id);
                  }}
                >
                  <Typography>
                    Hapus
                  </Typography>
                </Button>
              </Hidden>
              <Hidden smUp>
                <Tooltip title="Hapus">
                  <Button
                    variant="outlined"
                    className={classes.deleteButton}
                    onClick={(e) => {
                      handleOpenDeleteDialog(e, assessment_id);
                    }}
                  >
                    <DeleteIcon />
                  </Button>
                </Tooltip>
              </Hidden>
            </Grid>
          </Grid>
        </Grid>
        {!Array.isArray(questions)
          ? null
          : questions.map((question, i) => (
              <Grid item>
                <Paper className={classes.assessmentPaper}>
                  <Grid container direction="column" spacing={2}>
                    <Grid item>
                      <Typography variant="h6" color="primary" gutterBottom>
                        Soal {i + 1}
                      </Typography>
                      <GridList
                        cols={3}
                        cellHeight={300}
                        style={{ margin: "10px 0px 10px 0px" }}
                      >
                        {question.lampiran.map((img, i) => {
                          let image = img;
                          if (lampiranUrls.has(image.toString())) {
                            return (
                              <GridListTile key={image} cols={1}>
                                <img
                                  alt="current img"
                                  src={lampiranUrls.get(image.toString())}
                                />
                                <GridListTileBar
                                  title={`Gambar ${i + 1}`}
                                  titlePosition="top"
                                  actionPosition="right"
                                />
                              </GridListTile>
                            );
                          }
                          return null;
                        })}
                      </GridList>
                      {question.type === "shorttext" ? (
                        generateSoalShortTextTeacher(question, i)
                      ) : question.type === "longtext" ? (
                        <Grid container direction="column" spacing={2}>
                          <Grid item>
                            <Typography
                              align="justify"
                              style={{
                                wordBreak: "break-word",
                                whiteSpace: "pre-wrap",
                              }}
                            >
                              <Latex content={question.name}/>
                              {/* <CustomLinkify text={question.name} /> */}
                            </Typography>
                          </Grid>
                          <Grid item>
                            <Typography
                              color="textSecondary"
                              align="justify"
                              style={{
                                wordBreak: "break-word",
                                whiteSpace: "pre-wrap",
                              }}
                            >
                              {/* <Latex content={question.answer}/> */}
                              <CustomLinkify text={question.answer} />
                            </Typography>
                          </Grid>
                        </Grid>
                      ) : (
                        <Typography
                          align="justify"
                          style={{
                            wordBreak: "break-word",
                            whiteSpace: "pre-wrap",
                          }}
                        >
                          <Latex content={question.name}/>
                          {/* <CustomLinkify text={question.name} /> */}
                        </Typography>
                      )}
                      {/* </Typography> */}
                    </Grid>
                    <Grid item>
                      {question.type === "radio"
                        ? question.options.map((option, i) => (
                            <Grid container alignItems="center">
                              <Grid item className={classes.bullets}>
                                {question.answer[0] ===
                                String.fromCharCode(97 + i).toUpperCase() ? (
                                  <CheckCircleIcon
                                    className={classes.checkIcon}
                                  />
                                ) : (
                                  <FiberManualRecordIcon
                                    className={classes.fiberIcon}
                                  />
                                )}
                              </Grid>
                              <Typography className={classes.optionText}>
                                {option}
                              </Typography>
                            </Grid>
                          ))
                        : question.type === "checkbox"
                        ? question.options.map((option, i) => (
                            <Grid container alignItems="center">
                              <Grid item className={classes.bullets}>
                                {question.answer.includes(
                                  String.fromCharCode(97 + i).toUpperCase()
                                ) ? (
                                  <CheckCircleIcon
                                    className={classes.checkIcon}
                                  />
                                ) : (
                                  <FiberManualRecordIcon
                                    className={classes.fiberIcon}
                                  />
                                )}
                              </Grid>
                              <Typography className={classes.optionText}>
                                {option}
                              </Typography>
                            </Grid>
                          ))
                        : // question.type === "shorttext" || question.type === "shorttext"
                          null}
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>
            ))}
      </Grid>
      <DeleteDialog
        isWarning={true}
        openDeleteDialog={openDeleteDialog}
        handleCloseDeleteDialog={handleCloseDeleteDialog}
        itemType={selectedAssessments.type}
        itemName={selectedAssessments.name}
        deleteItem={() => {
          onDeleteAssessment(selectedAssessmentId);
        }}
      />
      <Snackbar
        open={copySnackbarOpen}
        autoHideDuration={3000}
        onClose={handleCloseCopySnackBar}
      >
        <Alert onClose={handleCloseCopySnackBar} severity="success">
          Tautan {type} berhasil disalin ke Clipboard Anda!
        </Alert>
      </Snackbar>
    </div>
  );
}

ViewAssessmentTeacher.propTypes = {
  auth: PropTypes.object.isRequired,
  getAllClass: PropTypes.func.isRequired,
  getAllSubjects: PropTypes.func.isRequired,
  subjectsCollection: PropTypes.object.isRequired,
  assessmentsCollection: PropTypes.object.isRequired,
  getOneAssessment: PropTypes.func.isRequired,
  deleteAssessment: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  classesCollection: state.classesCollection,
  subjectsCollection: state.subjectsCollection,
  assessmentsCollection: state.assessmentsCollection,
});

export default connect(mapStateToProps, {
  getAllClass,
  getAllSubjects,
  getOneAssessment,
  deleteAssessment,
  getFileAssessment,
})(ViewAssessmentTeacher);
