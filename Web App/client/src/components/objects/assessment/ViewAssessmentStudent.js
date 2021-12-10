import React from "react";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import moment from "moment";
import "moment/locale/id";
import { getAllClass } from "../../../actions/ClassActions";
import { getAllSubjects } from "../../../actions/SubjectActions";
import {
  getOneAssessment,
  submitAssessment,
  getStatus,
} from "../../../actions/AssessmentActions";
import { getFileAssessment } from "../../../actions/files/FileAssessmentActions";
import SubmitDialog from "../../misc/dialog/SubmitDialog";
import CustomLinkify from "../../misc/linkify/Linkify";
import Latex from "../../misc/latex/Latex";
import {
  Badge,
  Button,
  Box,
  Checkbox,
  CircularProgress,
  Dialog,
  DialogContent,
  FormControl,
  FormControlLabel,
  FormGroup,
  Grid,
  Hidden,
  Input,
  MobileStepper,
  Paper,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from "@material-ui/core";
import { ToggleButton, ToggleButtonGroup } from "@material-ui/lab";
import {
  CheckCircle as CheckCircleIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  Error as ErrorIcon,
  KeyboardArrowLeft as KeyboardArrowLeftIcon,
  KeyboardArrowRight as KeyboardArrowRightIcon,
} from "@material-ui/icons";
import { makeStyles, useTheme } from "@material-ui/core/styles";

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
  content: {
    padding: "20px",
  },
  startAssessmentButton: {
    width: "100px",
    backgroundColor: theme.palette.success.main,
    color: "white",
    "&:focus, &:hover": {
      backgroundColor: theme.palette.success.main,
      color: "white",
    },
  },
  submitAssessmentButton: {
    width: "120px",
    backgroundColor: theme.palette.success.main,
    color: "white",
    "&:focus, &:hover": {
      backgroundColor: theme.palette.success.main,
      color: "white",
    },
  },
  questionNumberGroup: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    "&:after": {
      content: "''",
      flexGrow: "1",
    },
  },
  questionNumberGroupChildren: {
    padding: "0px",
    width: "35px",
    height: "35px",
    "&:not(:first-child)": {
      margin: "8px",
      borderRadius: theme.shape.borderRadius,
      border: "1px solid rgba(0,0,0,0.12)",
    },
    "&:first-child": {
      margin: "8px",
      borderRadius: theme.shape.borderRadius,
    },
  },
  questionNumberRoot: {
    color: "unset",
    "&$questionNumberSelected": {
      backgroundColor: theme.palette.primary.main,
      color: "white",
      "&:focus, &:hover": {
        backgroundColor: theme.palette.primary.main,
        color: "white",
      },
    },
  },
  questionNumberSelected: {
    backgroundColor: theme.palette.primary.main,
    color: "white",
    "&:focus, &:hover": {
      backgroundColor: theme.palette.primary.main,
      color: "white",
    },
  },
  answeredquestionNumber: {
    width: "20px",
    height: "20px",
    borderRadius: "10px",
    fontSize: "15px",
    backgroundColor: "white",
    color: theme.palette.success.main,
  },
  unansweredquestionNumber: {
    width: "20px",
    height: "20px",
    borderRadius: "10px",
    fontSize: "15px",
    backgroundColor: "white",
    color: theme.palette.error.main,
  },
  optionText: {
    color: "black",
  },
  timeoutDialog: {
    width: "300px",
    maxWidth: "100%",
    minHeight: "175px",
    padding: "15px",
  },
  timeoutDialogButton: {
    width: "125px",
    backgroundColor: theme.palette.success.main,
    color: "white",
    "&:focus, &:hover": {
      backgroundColor: theme.palette.success.dark,
      color: "white",
    },
  },
  submittedStatus: {
    display: "flex",
    justifyContent: "center",
    padding: "5px 10px",
    backgroundColor: theme.palette.success.main,
    color: "white",
  },
  lateStatus: {
    display: "flex",
    justifyContent: "center",
    padding: "5px 10px",
    backgroundColor: theme.palette.primary.main,
    color: "white",
  },
  imageContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  imageLabel: {
    padding: "10px 0px",
  },
  imageAttachment: {
    maxWidth: "100%",
    maxHeight: "400px",
    minHeight: "400px",
  },
  imageStepper: {
    width: "100%",
    borderRadius: "0px 0px 4px 4px",
  },
  previousPageButton: {
    backgroundColor: "white",
    color: theme.palette.primary.main,
    "&:focus, &:hover": {
      backgroundColor: "white",
      color: theme.palette.primary.main,
    },
  },
  nextPageButton: {
    backgroundColor: theme.palette.primary.main,
    color: "white",
    "&:focus, &:hover": {
      backgroundColor: theme.palette.primary.main,
      color: "white",
    },
  },
}));

function TimeoutDialog(props) {
  const classes = useStyles();
  const { openTimeoutDialog, handleCloseTimeoutDialog } = props;

  return (
    <Dialog
      open={openTimeoutDialog}
      PaperProps={{ className: classes.timeoutDialog }}
    >
      <DialogContent>
        <Typography variant="h6" align="center" gutterBottom>
          Waktu pengerjaan sudah selesai, jawaban Anda telah dikumpulkan
        </Typography>
        <div>
          <Button
            startIcon={<CheckCircleIcon />}
            onClick={handleCloseTimeoutDialog}
            className={classes.timeoutDialogButton}
          >
            Selesai
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function Timer(props) {
  let { start_date, end_date, id, onSubmit, setOpenTimeoutDialog } = props;

  let startTime = new Date(start_date);
  let finishTime = new Date(end_date);

  let workTime = Math.floor((finishTime - startTime) / 1000);

  const [time, setTime] = React.useState(workTime);
  var hours = Math.floor(time / 3600) % 24;
  var minutes = Math.floor(time / 60) % 60;
  var seconds = time % 60;

  React.useEffect(() => {
    const timer = setInterval(() => {
      setTime((prevTime) => prevTime - 1);
    }, 1000);

    if (time <= 0) {
      setOpenTimeoutDialog();
      onSubmit();
    }
    return () => {
      if (time <= 0) {
        localStorage.removeItem(`answers_${id}`);
      } else {
        localStorage.setItem(`remainingTime_${id}`, time - 2);
      }
      clearInterval(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [time]);

  return (
    <div style={{ margin: "10px 0px" }}>
      <Box position="relative" display="inline-flex">
        <CircularProgress
          variant="static"
          value={(time / workTime) * 100}
          size={200}
        />
        <Box
          top={0}
          left={0}
          bottom={0}
          right={0}
          position="absolute"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Typography variant="h5" component="div" color="textSecondary">
            {`${hours} :
              ${minutes < 10 ? `0${minutes}` : minutes} :
              ${seconds < 10 ? `0${seconds}` : seconds}`}
          </Typography>
        </Box>
      </Box>
    </div>
  );
}

function StartTimer(props) {
  let { start_date, end_date, setShowStartButton } = props;

  let startTime = new Date(start_date);
  let finishTime = new Date(end_date);
  let workTime = Math.floor((finishTime - startTime) / 1000);

  const [time, setTime] = React.useState(workTime);

  let hours = Math.floor(time / 3600) % 24;
  let minutes = Math.floor(time / 60) % 60;
  let seconds = time % 60;

  React.useEffect(() => {
    const timer = setInterval(() => {
      setTime((prevTime) => prevTime - 1);
    }, 1000);

    if (time <= 0) {
      setShowStartButton(true);
    }

    return () => {
      clearInterval(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [time]);

  return (
    <div style={{ margin: "10px 0px" }}>
      <Box position="relative" display="inline-flex">
        <CircularProgress
          variant="static"
          value={(time / workTime) * 100}
          size={200}
        />
        <Box
          top={0}
          left={0}
          bottom={0}
          right={0}
          position="absolute"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Typography variant="h5" component="div" color="textSecondary">
            {`${hours} :
              ${minutes < 10 ? `0${minutes}` : minutes} :
              ${seconds < 10 ? `0${seconds}` : seconds}`}
          </Typography>
        </Box>
      </Box>
    </div>
  );
}

function QuestionNumber(
  classes,
  handleChangeQuestion,
  qnsIndex,
  question_number,
  answer
) {
  return (
    <ToggleButton
      value={question_number - 1}
      selected={qnsIndex === question_number - 1}
      classes={{
        root: classes.questionNumberRoot,
        selected: classes.questionNumberSelected,
      }}
    >
      <Badge
        style={{
          width: "35px",
          height: "35px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        badgeContent={
          answer[question_number - 1].length > 0 &&
          answer[question_number - 1].some((elm) => {
            return elm !== "";
          }) ? (
            <CheckCircleIcon className={classes.answeredquestionNumber} />
          ) : (
            <ErrorIcon className={classes.unansweredquestionNumber} />
          )
        }
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
      >
        <Typography>{question_number}</Typography>
      </Badge>
    </ToggleButton>
  );
}

function QuestionImage(props) {
  const classes = useStyles();
  const theme = useTheme();

  const [activeStep, setActiveStep] = React.useState(0);
  const { maxSteps, label, image, lampiranUrls, qnsIndex } = props;

  React.useEffect(() => {
    setActiveStep(0);
  }, [qnsIndex]);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  return (
    <div className={classes.imageContainer}>
      <Typography align="center" className={classes.imageLabel}>
        {label}
      </Typography>
      <img
        alt={label}
        src={lampiranUrls.get(image[activeStep])}
        className={classes.imageAttachment}
      />
      <MobileStepper
        variant="text"
        position="static"
        steps={maxSteps}
        activeStep={activeStep}
        className={classes.imageStepper}
        nextButton={
          <Button
            size="small"
            onClick={handleNext}
            disabled={activeStep === maxSteps - 1}
          >
            {theme.direction === "rtl" ? (
              <KeyboardArrowLeftIcon />
            ) : (
              <KeyboardArrowRightIcon />
            )}
          </Button>
        }
        backButton={
          <Button size="small" onClick={handleBack} disabled={activeStep === 0}>
            {theme.direction === "rtl" ? (
              <KeyboardArrowRightIcon />
            ) : (
              <KeyboardArrowLeftIcon />
            )}
          </Button>
        }
      />
    </div>
  );
}

function ViewAssessmentStudent(props) {
  const classes = useStyles();
  const {
    getOneAssessment,
    getAllSubjects,
    getAllClass,
    submitAssessment,
    getFileAssessment,
    handleSideDrawer,
  } = props;
  const { user } = props.auth;
  const { all_subjects_map } = props.subjectsCollection;
  const { selectedAssessments } = props.assessmentsCollection;
  const { submissions } = selectedAssessments;

  let id = props.match.params.id;

  const [qnsIndex, setQnsIndex] = React.useState(0);
  const [answer, setAnswer] = React.useState([]); // Answer content example: [["A"], ["sedang", "menulis"], [null, "harian"]].
  const [posted, setPosted] = React.useState(null);
  const [start, setStart] = React.useState(
    !localStorage.getItem(`remainingTime_${id}`) ? null : true
  );
  const [finish, setFinish] = React.useState(null);
  const [openSubmitDialog, setOpenSubmitDialog] = React.useState(null);
  const [openTimeoutDialog, setOpenTimeoutDialog] = React.useState(null);
  const [lampiranUrls, setLampiranUrls] = React.useState(new Map());
  const [currentTime, setCurrentTime] = React.useState(null);
  const [showStartButton, setShowStartButton] = React.useState(false);
  const [showClosedMessage, setShowClosedMessage] = React.useState(false);

  // When onSubmit is triggered, will clear localStorage.removeItem("remainingTime").
  React.useEffect(() => {
    getStatus(id).then((res) => {
      if (res.data.status === -1) {
        setCurrentTime(res.data.now);
      } else if (res.data.status === 0) {
        setCurrentTime(res.data.now);
        setShowStartButton(true);
      } else {
        // (res.data.status === 1)
        setShowClosedMessage(true);
      }
    });
    getAllSubjects(user.unit, "map");
    getAllClass(user.unit, "map");
    getFileAssessment(id).then((result) => setLampiranUrls(result));
    getOneAssessment(id).then((assessment) => {
      setPosted(assessment.posted);
      if (localStorage.getItem(`answers_${id}`)) {
        setAnswer(JSON.parse(localStorage.getItem(`answers_${id}`)));
      }
    });

    if (localStorage.getItem(`status`) === "ujian") {
      startTest();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  let questions = selectedAssessments.questions;
  let questions_length = !questions ? 0 : questions.length;
  React.useEffect(() => {
    if (questions_length) {
      let arr = [];
      for (let i = 1; i <= questions_length; i++) {
        arr.push([]);
      }
      setAnswer(arr);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [questions_length]);

  React.useEffect(() => {
    if (finish) {
      localStorage.removeItem(`remainingTime_${id}`);
      localStorage.removeItem(`answers_${id}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [finish]);

  const handleChangeQuestion = (i) => {
    setQnsIndex(i);
  };
  function handleQuestionIndex(event, newIndex) {
    if (newIndex !== null) {
      handleChangeQuestion(newIndex);
    }
  }

  const handleChangeAnswer = (e, type) => {
    if (type === "radio" || type === "longtext") {
      let temp = answer;
      temp[qnsIndex] = [e.target.value];
      localStorage.setItem(`answers_${id}`, JSON.stringify(temp));
      setAnswer([...temp]);
    } else if (type === "checkbox") {
      if (!answer[qnsIndex]) {
        let temp = answer;
        temp[qnsIndex] = [e.target.value];
        setAnswer([...temp]);
      } else if (
        !e.target.checked ||
        answer[qnsIndex].includes(e.target.value)
      ) {
        let temp = answer;
        temp[qnsIndex] = temp[qnsIndex].filter(function (value, index) {
          return value !== e.target.value;
        });
        setAnswer([...temp]);
      } else if (
        e.target.checked &&
        !answer[qnsIndex].includes(e.target.value)
      ) {
        let temp = answer;
        temp[qnsIndex].push(e.target.value);
        setAnswer([...temp]);
      }
    } else {
      // type === "shorttext"
      let temp = answer;
      temp[qnsIndex][e.target.id] = e.target.value;
      localStorage.setItem(`answers_${id}`, JSON.stringify(temp));
      setAnswer([...temp]);
    }
  };

  const generateSoalShortTextStudent = () => {
    let splitResult = questions[qnsIndex].name.split("`");
    let idIterator = 0;

    for (let i = 1; i <= splitResult.length - 2; i += 2) {
      splitResult[i] = (
        <Input
          type="text"
          id={idIterator}
          key={`${qnsIndex}-${idIterator}`}
          value={answer[qnsIndex][idIterator]}
          onChange={(e) => handleChangeAnswer(e)}
        />
      );
      idIterator++;
    }

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

  const handleStart = () => {
    getStatus(id).then((res) => {
      if (res.data.status === -1) {
        setCurrentTime(res.data.now);
      } else if (res.data.status === 0) {
        setCurrentTime(res.data.now);
        localStorage.setItem(`status`, "ujian");
        handleSideDrawer(false);
        startTest();
      } else {
        setShowClosedMessage(true);
      }
    });
  };

  const startTest = () => {
    setStart(true);
  };

  const handleOpenSubmitDialog = () => {
    setOpenSubmitDialog(true);
  };
  const handleCloseSubmitDialog = () => {
    setOpenSubmitDialog(false);
  };

  const onSubmit = (e) => {
    localStorage.setItem(`status`, "tidak_ujian");
    window.location.reload(false);
    setFinish(true);
    setStart(false);
    let data = {
      answers: answer,
      classId: user.kelas,
      userId: user._id,
    };
    submitAssessment(id, data).then(() => {
      handleCloseSubmitDialog();
      handleSideDrawer(false);
    });
  };

  const showSubmitButton = () => {
    if (submissions) {
      if (submissions[user._id]) {
        return null;
      }
    }
    if (start) {
      return (
        <Grid item>
          <Button
            variant="contained"
            className={classes.submitAssessmentButton}
            onClick={handleOpenSubmitDialog}
          >
            Kumpulkan
          </Button>
        </Grid>
      );
    }
    return null;
  };

  const showTestStatus = () => {
    if (!start) {
      if (submissions && submissions[user._id]) {
        return (
          <Grid item>
            <Paper className={classes.submittedStatus}>
              <CheckCircleIcon />
              <Typography variant="button" style={{ marginLeft: "5px" }}>
                Telah dikumpulkan
              </Typography>
            </Paper>
          </Grid>
        );
      } else if (showClosedMessage) {
        return (
          <Grid item>
            <Paper className={classes.lateStatus}>
              <ErrorIcon />
              <Typography variant="button" style={{ marginLeft: "5px" }}>
                Telah Selesai
              </Typography>
            </Paper>
          </Grid>
        );
      } else if (showStartButton) {
        return (
          <Grid item>
            <Button
              variant="contained"
              onClick={handleStart}
              className={classes.startAssessmentButton}
            >
              Mulai
            </Button>
          </Grid>
        );
      } else if (currentTime !== null) {
        return (
          <StartTimer
            start_date={currentTime}
            end_date={selectedAssessments.start_date}
            setShowStartButton={setShowStartButton}
          />
        );
      } else {
        return null;
      }
    } else {
      return (
        <Timer
          id={id}
          start_date={currentTime}
          end_date={selectedAssessments.end_date}
          finish={finish}
          onSubmit={onSubmit}
          setOpenTimeoutDialog={() => setOpenTimeoutDialog(true)}
        />
      );
    }
  };

  const showQuestions = () => {
    if (submissions) {
      if (submissions[user._id]) {
        return null;
      }
    }
    if (start) {
      return [
        <Grid item>
          <Paper className={classes.content}>
            <Typography color="textSecondary" paragraph>
              Pindah ke Soal:
            </Typography>
            <ToggleButtonGroup
              exclusive
              value={qnsIndex}
              onChange={(e, newIndex) => handleQuestionIndex(e, newIndex)}
              classes={{
                root: classes.questionNumberGroup,
                grouped: classes.questionNumberGroupChildren,
              }}
            >
              {!questions
                ? null
                : questions.map((qns, i) => {
                    return QuestionNumber(
                      classes,
                      handleChangeQuestion,
                      qnsIndex,
                      i + 1,
                      answer
                    );
                  })}
            </ToggleButtonGroup>
          </Paper>
        </Grid>,
        <>
          {!questions || questions[qnsIndex].lampiran.length === 0 ? null : (
            <Grid item>
              <Paper>
                <QuestionImage
                  label={`Gambar ${qnsIndex + 1}`}
                  qnsIndex={qnsIndex}
                  maxSteps={questions[qnsIndex].lampiran.length}
                  lampiranUrls={lampiranUrls}
                  image={
                    !questions[qnsIndex].lampiran
                      ? []
                      : questions[qnsIndex].lampiran
                  }
                />
              </Paper>
            </Grid>
          )}
        </>,
        <Grid item>
          <Paper>
            <Grid container>
              <Grid item xs sm className={classes.content}>
                <Grid container direction="column" spacing={2}>
                  <Grid item>
                    <Typography variant="h6" color="primary" gutterBottom>
                      Soal {qnsIndex + 1}
                    </Typography>
                    {!questions ? null : questions[qnsIndex].type ===
                      "shorttext" ? (
                      generateSoalShortTextStudent()
                    ) : (
                      <Typography
                        align="justify"
                        style={{
                          wordBreak: "break-word",
                          whiteSpace: "pre-wrap",
                        }}
                        gutterBottom
                      >
                        <Latex content={questions[qnsIndex].name} />
                        {/* <CustomLinkify text={questions[qnsIndex].name} /> */}
                      </Typography>
                    )}
                  </Grid>
                  <Grid item>
                    <FormControl fullWidth component="fieldset" id="answer">
                      {!questions ? null : questions[qnsIndex].type ===
                        "radio" ? (
                        <RadioGroup
                          id="answer"
                          value={answer[qnsIndex][0] ? answer[qnsIndex][0] : ""}
                          onChange={(e) => handleChangeAnswer(e, "radio")}
                        >
                          {questions[qnsIndex].options.map((option, i) => (
                            <div style={{ display: "flex" }}>
                              <FormControlLabel
                                style={{ width: "100%" }}
                                value={String.fromCharCode(
                                  97 + i
                                ).toUpperCase()}
                                control={<Radio color="primary" />}
                                label={
                                  <Typography className={classes.optionText}>
                                    {option}
                                  </Typography>
                                }
                              />
                            </div>
                          ))}
                        </RadioGroup>
                      ) : questions[qnsIndex].type === "checkbox" ? (
                        <FormGroup>
                          {questions[qnsIndex].options.map((option, i) => {
                            let val = String.fromCharCode(97 + i).toUpperCase();
                            return (
                              <div style={{ display: "flex" }}>
                                <FormControlLabel
                                  style={{ width: "100%" }}
                                  value={String.fromCharCode(
                                    97 + i
                                  ).toUpperCase()}
                                  control={
                                    <Checkbox
                                      checked={answer[qnsIndex].includes(val)}
                                      color="primary"
                                      onChange={(e) =>
                                        handleChangeAnswer(e, "checkbox")
                                      }
                                    />
                                  }
                                  label={
                                    <Typography className={classes.optionText}>
                                      {option}
                                    </Typography>
                                  }
                                />
                              </div>
                            );
                          })}
                        </FormGroup>
                      ) : questions[qnsIndex].type ===
                        "shorttext" ? null : questions[qnsIndex].type ===
                        "longtext" ? (
                        <TextField
                          key={`${user._id}-${qnsIndex}`}
                          id="answer"
                          multiline
                          rowsMax={10}
                          value={answer[qnsIndex][0]}
                          variant="outlined"
                          onChange={(e) => {
                            handleChangeAnswer(e, "longtext");
                          }}
                        />
                      ) : null}
                    </FormControl>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Paper>
        </Grid>,
        <Grid item>
          <Grid container alignItems="center">
            {qnsIndex === 0 ? null : (
              <Grid item xs container justify="flex-start">
                <Hidden smDown>
                  <Button
                    variant="contained"
                    startIcon={<ChevronLeftIcon />}
                    className={classes.previousPageButton}
                    onClick={() => handleChangeQuestion(qnsIndex - 1)}
                  >
                    Soal Sebelumnya
                  </Button>
                </Hidden>
                <Hidden mdUp>
                  <Button
                    variant="contained"
                    className={classes.previousPageButton}
                    onClick={() => handleChangeQuestion(qnsIndex - 1)}
                  >
                    <ChevronLeftIcon />
                  </Button>
                </Hidden>
              </Grid>
            )}
            {qnsIndex === questions_length - 1 ? null : (
              <Grid item xs container justify="flex-end">
                <Hidden smDown>
                  <Button
                    variant="contained"
                    endIcon={<ChevronRightIcon />}
                    className={classes.nextPageButton}
                    onClick={() => handleChangeQuestion(qnsIndex + 1)}
                  >
                    Soal Selanjutnya
                  </Button>
                </Hidden>
                <Hidden mdUp>
                  <Button
                    variant="contained"
                    className={classes.nextPageButton}
                    onClick={() => handleChangeQuestion(qnsIndex + 1)}
                  >
                    <ChevronRightIcon />
                  </Button>
                </Hidden>
              </Grid>
            )}
          </Grid>
        </Grid>,
      ];
    }
    return null;
  };

  if (!posted) {
    if (posted !== null) {
      return <Redirect to="/tidak-ditemukan" />;
    }
    return null;
  }

  if (selectedAssessments) {
    if (!selectedAssessments.class_assigned.includes(user.kelas)) {
      return <Redirect to="/tidak-ditemukan" />;
    }
  }

  document.title = `Schooly | ${selectedAssessments.name}`;

  return (
    <div className={classes.root}>
      <form>
        <Grid container direction="column" spacing={3}>
          <Grid item>
            <Paper className={classes.content}>
              <Grid
                container
                direction="column"
                alignItems="center"
                spacing={4}
              >
                <Grid item>
                  <Typography
                    variant="h4"
                    align="center"
                    style={{ marginBottom: "5px" }}
                  >
                    {selectedAssessments.name}
                  </Typography>
                  <Typography color="primary" align="center">
                    {selectedAssessments.type}{" "}
                    {all_subjects_map.get(selectedAssessments.subject)}
                  </Typography>
                </Grid>
                <Grid item>
                  <Typography align="center">
                    Mulai -{" "}
                    {`${moment(selectedAssessments.start_date)
                      .locale("id")
                      .format("DD MMM YYYY, HH.mm")}`}
                  </Typography>
                  <Typography align="center">
                    Selesai -{" "}
                    {`${moment(selectedAssessments.end_date)
                      .locale("id")
                      .format("DD MMM YYYY, HH.mm")}`}
                  </Typography>
                </Grid>
                <Grid item>
                  <Typography align="center">
                    {selectedAssessments.description}
                  </Typography>
                </Grid>
                {showTestStatus()}
                {showSubmitButton()}
              </Grid>
            </Paper>
          </Grid>
          {showQuestions()}
        </Grid>
      </form>
      <SubmitDialog
        openSubmitDialog={openSubmitDialog}
        handleCloseSubmitDialog={handleCloseSubmitDialog}
        itemType="Ujian"
        itemName={selectedAssessments.name}
        onSubmit={onSubmit}
        messageLoading="Jawaban Anda sedang diunggah"
      />
      <TimeoutDialog
        openTimeoutDialog={openTimeoutDialog}
        handleCloseTimeoutDialog={() => setOpenTimeoutDialog(false)}
      />
    </div>
  );
}

ViewAssessmentStudent.propTypes = {
  auth: PropTypes.object.isRequired,
  getAllClass: PropTypes.func.isRequired,
  getAllSubjects: PropTypes.func.isRequired,
  assessmentsCollection: PropTypes.object.isRequired,
  getOneAssessment: PropTypes.func.isRequired,
  submitAssessment: PropTypes.func.isRequired,
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
  getFileAssessment,
  submitAssessment,
})(ViewAssessmentStudent);
