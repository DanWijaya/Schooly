import React from "react";
import { Link, useHistory } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import moment from "moment";
import CustomLinkify from "../../misc/linkify/Linkify";
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
  useMediaQuery,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import AssignmentIcon from "@material-ui/icons/Assignment";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import DeleteDialog from "../../misc/dialog/DeleteDialog";
import LinkIcon from "@material-ui/icons/Link";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import FiberManualRecordIcon from "@material-ui/icons/FiberManualRecord";
import MuiAlert from "@material-ui/lab/Alert";
import SwitchBase from "@material-ui/core/internal/SwitchBase";

const useStyles = makeStyles((theme) => ({
  root: {
    margin: "auto",
    maxWidth: "80%",
    [theme.breakpoints.down("md")]: {
      maxWidth: "100%",
    },
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    padding: "10px",
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
    marginLeft: "8px",
  },
  paperBox: {
    padding: "20px",
    // marginBottom: "10px",
  },
  dividerColor: {
    backgroundColor: theme.palette.primary.main,
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
  document.title = "Schooly | Buat Kuis";
  const assessment_id = props.match.params.id;
  const isMobileView = useMediaQuery("(max-width:780px)");
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
    getFileAssessment(assessment_id).then((result) => setLampiranUrls(result));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  console.log(lampiranUrls);

  const onDeleteAssessment = (id) => {
    deleteAssessment(id, type, history).then((res) => {
      console.log(res);
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
    }

    return (
      <Typography
        align="justify"
        style={{ wordBreak: "break-word", whiteSpace: "pre-wrap" }}
      >
        <form>
          <CustomLinkify text={splitResult} />
        </form>
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

              <Grid item xs={12}>
                <Typography color="textSecondary" gutterBottom>
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

              <Grid item xs={12} style={{ marginTop: "15px" }}>
                <Typography color="textSecondary" gutterBottom>
                  Deskripsi Kuis/Ujian:
                </Typography>
                <Typography
                  variant="body1"
                  align="justify"
                  style={{ wordBreak: "break-word", whiteSpace: "pre-wrap" }}
                >
                  <CustomLinkify text={selectedAssessments.description} />
                </Typography>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {!Array.isArray(questions)
          ? null
          : questions.map((question, i) => (
              <Grid item>
                <Paper className={classes.paperBox}>
                  <Grid
                    container
                    direction="column"
                    spacing={2}
                    className={classes.content}
                  >
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
                      {/* <Typography variant="h6"> */}
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
                              <CustomLinkify text={question.name} />
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
                          <CustomLinkify text={question.name} />
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
        <Grid
          item
          container
          justify="flex-end"
          alignItems="center"
          style={{ paddingTop: "4px" }}
        >
          <Grid item style={{ paddingRight: "10px" }}>
            {selectedAssessments &&
            selectedAssessments.submissions &&
            Object.keys(selectedAssessments.submissions).length !== 0 ? (
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
                  <AssignmentIcon style={{ marginRight: "7.5px" }} />
                  Lihat Hasil
                </Fab>
              </Link>
            ) : (
              <>
                <Fab
                  variant="extended"
                  className={classes.seeAllAssessmentButton}
                  disabled
                >
                  <AssignmentIcon style={{ marginRight: "7.5px" }} />
                  Lihat Hasil
                </Fab>
              </>
            )}
          </Grid>
          <Grid item style={{ paddingRight: "10px" }}>
            <LightTooltip title="Salin Tautan">
              <Fab
                className={classes.copyToClipboardButton}
                onClick={(e) => copyToClipboardButton(e, linkToShare, type)}
              >
                <LinkIcon />
              </Fab>
            </LightTooltip>
          </Grid>
          <Grid item style={{ paddingRight: "10px" }}>
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
          Tautan {type} berhasil disalin ke Clipboard Anda!
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
  getFileAssessment,
})(ViewAssessmentTeacher);
