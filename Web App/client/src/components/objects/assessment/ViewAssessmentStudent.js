import React from "react";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { getAllClass } from "../../../actions/ClassActions";
import { getAllSubjects } from "../../../actions/SubjectActions";
import { getOneAssessment, submitAssessment } from "../../../actions/AssessmentActions";
import { Avatar, Badge, Button, Box, CircularProgress, Divider, Dialog, FormControl, FormControlLabel, FormGroup,
  Grid, GridListTile, GridListTileBar, GridList, Paper, Radio, Checkbox,
  RadioGroup, TextField, Typography, Input } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import ErrorIcon from '@material-ui/icons/Error';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import moment from "moment";
import "moment/locale/id";
import SubmitDialog from "../../misc/dialog/SubmitDialog";
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';


const useStyles = makeStyles((theme) => ({
  root: {
    margin: "auto",
    maxWidth: "1000px",
    padding: "10px",
  },
  content: {
    padding: "20px",
  },
  startAssessmentButton: {
    backgroundColor: theme.palette.success.main,
    color: "white",
    "&:focus, &:hover": {
      backgroundColor: "white",
      color: theme.palette.success.main,
    },
  },
  submitAssessmentButton: {
    backgroundColor: theme.palette.success.main,
    color: "white",
    "&:focus, &:hover": {
      backgroundColor: "white",
      color: theme.palette.success.main,
    },
  },
  questionPage: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "35px",
    height: "35px",
    "&:focus, &:hover": {
      backgroundColor: theme.palette.primary.main,
      color: "white",
      cursor: "pointer",
    },
  },
  saveAnswerButton: {
    backgroundColor: theme.palette.primary.main,
    color: "white",
    "&:focus, &:hover": {
      backgroundColor: "white",
      color: theme.palette.primary.main,
    },
  },
  previousPageButton: {
    backgroundColor: theme.palette.action.selected,
    color: "black",
    "&:focus": {
      backgroundColor: theme.palette.action.selected,
      color: "black",
    },
    "&:active, &:hover": {
      backgroundColor: "white",
      color: theme.palette.primary.main,
    }
  },
  nextPageButton: {
    backgroundColor: theme.palette.action.selected,
    color: "black",
    "&:focus": {
      backgroundColor: theme.palette.action.selected,
      color: "black",
    },
    "&:active, &:hover": {
      backgroundColor: theme.palette.primary.main,
      color: "white",
    }
  },
  optionText: {
    color: "black"
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
  submittedPaper: {
    display: "flex",
    justifyContent: "center",
    padding: "5px",
    paddingLeft: "10px",
    paddingRight: "10px",
    backgroundColor: theme.palette.success.main,
    color: "white",
  },
  toggleGroupRoot: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    "&:after": {
      content: "''",
      flexGrow: "1"
    }
  },
  toggleGroupChildren: {
    padding: "0px",
    width: "35px",
    height: "35px",
    '&:not(:first-child)': {
      margin: theme.spacing(1),
      borderRadius: theme.shape.borderRadius,
      borderLeft: "1px solid rgba(0,0,0,0.12)"
    },
    '&:first-child': {
      margin: theme.spacing(1),
      borderRadius: theme.shape.borderRadius,
    },
  },
  toggleButtonRoot: {
    color: "unset",
    "&$toggleButtonSelected": {
      backgroundColor: theme.palette.primary.main,
      color: "white",
      cursor: "pointer",
      "&:hover": {
        backgroundColor: theme.palette.primary.main
      }
    }
  },
  toggleButtonSelected: {
    //harus ada meskipun kosong
  }
}));

function TimeoutDialog(props){
  const classes = useStyles();

  const { openTimeoutDialog, handleCloseTimeoutDialog } = props;

  return (
    <Dialog open={openTimeoutDialog}>
      <Grid container direction="column" justify="space-between" alignItems="center" className={classes.timeoutDialog}>
        <Grid>
          <Typography variant="h6" align="center" gutterBottom>
            Waktu pengerjaan sudah selesai, jawaban anda telah terkumpulkan
          </Typography>
        </Grid>
        <Grid item>
          <Button
            startIcon={<CheckCircleOutlineIcon/>}
            onClick={handleCloseTimeoutDialog}
            className={classes.timeoutDialogButton}
          >
            Selesai
          </Button>
        </Grid>
      </Grid>
    </Dialog>
  )
}

function Timer(props) {
  const classes = useStyles();
  let {start_date, end_date, id, onSubmit, setOpenTimeoutDialog } = props;
  console.log(start_date, end_date);
  let startTime = new Date(start_date);
  let finishTime = new Date(end_date);

  let workTime = Math.floor((finishTime - startTime)/1000)
  let remainingTime = localStorage.getItem(`remainingTime_${id}`) ? localStorage.getItem(`remainingTime_${id}`) : Math.floor((finishTime - startTime)/1000)
  // let remainingTime = Math.floor((finishTime - startTime)/1000)
  const [time, setTime] = React.useState(remainingTime);
  var hours = Math.floor(time / 3600) % 24;
  var minutes = Math.floor(time / 60) % 60;
  var seconds = time % 60;

  React.useEffect(() => {
    const timer = setInterval(() => {
      setTime((prevTime) => (prevTime - 1));
    }, 1000);

    if(time <= 0){
      setOpenTimeoutDialog()
      onSubmit()
    }
    return () => {
      if(time <= 0){
        // localStorage.removeItem(`remainingTime_${id}`)
        localStorage.removeItem(`answers_${id}`)
      }
      else {
        localStorage.setItem(`remainingTime_${id}`, time - 2)
      }
      clearInterval(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [time]);

  return (
    <div className={classes.root}>
      <Box position="relative" display="inline-flex">
        <CircularProgress variant="static" value={(time/workTime)*100} size={200} />
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
              ${minutes<10 ? `0${minutes}` : minutes} :
              ${seconds<10 ? `0${seconds}` : seconds}`
            }
          </Typography>
        </Box>
      </Box>
    </div>
  )
}

function questionPage(classes, handleChangeQuestion, qnsIndex, question_number, answer) {

// function QuestionPage(props) {
  // const { classes, handleChangeQuestion, question_number, answer } = props;
  console.log(answer)
  return (
    <ToggleButton
        value={question_number - 1}
        aria-label={question_number - 1}
        classes={{ root: classes.toggleButtonRoot, selected: classes.toggleButtonSelected}}
        selected={qnsIndex === question_number - 1}
      >
    {/* <Grid item> */}
      <Badge
        style={{ width: "35px", height: "35px", display: "flex", alignItems: "center", justifyContent: "center" }}
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
        {/* <Paper
          buttons
          variant="outlined"
          className={classes.questionPage}
          onClick={() => handleChangeQuestion(question_number-1)}
        > */}
          <Typography>
            {question_number}
          </Typography>
        {/* </Paper> */}
      </Badge>
    {/* </Grid> */}
    </ToggleButton >
  )
}

function ViewAssessmentStudent(props) {
  const classes = useStyles();
  const { selectedAssessments } = props.assessmentsCollection;
  const { submissions } = selectedAssessments;
  const { all_subjects_map } = props.subjectsCollection;
  const { getOneAssessment, getAllSubjects, getAllClass, submitAssessment } = props;
  const { user } = props.auth;

  let id = props.match.params.id;

  const [ qnsIndex, setQnsIndex ] = React.useState(0);
  const [ answer, setAnswer] = React.useState([]); // contoh isi answer: [["A"], ["sedang", "menulis"], [null, "harian"]]
  const [ posted, setPosted] = React.useState(null)
  const [ start, setStart ] = React.useState(!localStorage.getItem(`remainingTime_${id}`) ? null : true);
  const [ finish, setFinish ] = React.useState(null);
  const [ openSubmitDialog, setOpenSubmitDialog] = React.useState(null);
  const [ openTimeoutDialog, setOpenTimeoutDialog] = React.useState(null);

  // nanti pas onSubmit, akan ngeclear localStorage.removeItem("remainingTime");
  React.useEffect(() => {
    getAllSubjects("map")
    getAllClass("map")
   new Promise((resolve, reject) => {
      getOneAssessment(id, resolve)
    }).then((res) => {
      setPosted(res.data.posted)
      if(localStorage.getItem(`answers_${id}`)){
        setAnswer(JSON.parse(localStorage.getItem(`answers_${id}`)))
      }
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  let questions = selectedAssessments.questions;
  let questions_length = !questions ? 0 : questions.length
  // console.log(submissions)
  React.useEffect(() => {
    if(questions_length){
      let arr = [];
      for (let i = 1; i <= questions_length; i++) {
        arr.push([]);
      }
      setAnswer(arr)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [questions_length])

  React.useEffect(() => {
    if(finish){
      localStorage.removeItem(`remainingTime_${id}`)
      localStorage.removeItem(`answers_${id}`)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[finish])

  const handleChangeQuestion = (i) => {
    setQnsIndex(i)
  }
  function handleQuestionIndex(event, newIndex) {
    if (newIndex !== null) {
      handleChangeQuestion(newIndex);
    }
  }

  const handleChangeAnswer = (e, type) => {
    if(type === "radio" || type === "longtext"){
      let temp = answer;
      temp[qnsIndex] = [e.target.value];
      localStorage.setItem(`answers_${id}`, JSON.stringify(temp));
      setAnswer([...temp])
    }
    else if(type === "checkbox"){
      if(!answer[qnsIndex]){
        let temp = answer;
        temp[qnsIndex] = [e.target.value]
        setAnswer([...temp])
      }
      else if(!e.target.checked || answer[qnsIndex].includes(e.target.value)){
        let temp = answer;
        temp[qnsIndex] = temp[qnsIndex].filter(function(value,index){
          return value !== e.target.value
        })
        setAnswer([...temp])
      }
      else if(e.target.checked && !answer[qnsIndex].includes(e.target.value)){
        let temp = answer;
        temp[qnsIndex].push(e.target.value)
        setAnswer([...temp])
      }
    }
    else{ // type === "shorttext"
      let temp = answer;
      temp[qnsIndex][e.target.id] = e.target.value;
      localStorage.setItem(`answers_${id}`, JSON.stringify(temp));
      setAnswer([...temp]);
    }
  }

  const generateSoalShortTextStudent = () => {
    let splitResult = questions[qnsIndex].name.split("`");
    let idIterator = 0;

    for (let i=1; i<=splitResult.length-2; i+=2) {
      splitResult[i] = (
      <Input
        type="text"
        key={`${qnsIndex}-${idIterator}`}
        id={idIterator}
        value={answer[qnsIndex][idIterator]}
        onChange={(e) => { handleChangeAnswer(e)}}
      />);
      idIterator++;
    }

    return (
      <Typography variant="body1" gutterButtom>
        <form>
          {splitResult}
        </form>
      </Typography>
    );
  }

  const handleStart = () => {
    /*if(localStorage.getItem(`status`) === "tidak_ujian"){
      localStorage.setItem(`status`, "ujian")
      console.log(localStorage.getItem(`status`))
      window.location.reload(false);
    }
    if(localStorage.getItem(`status`) === "ujian"){
      startTest()
    }*/
    localStorage.setItem(`status`, "ujian")
    window.location.reload(false);
  }

  React.useEffect(() => {
    if(localStorage.getItem(`status`) === "ujian"){
      startTest()
    }
  },[])

  const startTest = () => {
    setStart(true);
  }

  const handleOpenSubmitDialog = () => {
    setOpenSubmitDialog(true);
  }
  const handleCloseSubmitDialog = () => {
    setOpenSubmitDialog(false);
  }

  const onSubmit = (e) => {
    localStorage.setItem(`status`, "tidak_ujian")
    window.location.reload(false);
    setFinish(true)
    setStart(false);
    // console.log(localStorage.getItem(`status`))
    let data = {
      "answers" : answer,
      "classId" : user.kelas,
      "userId" : user.id
    }
    submitAssessment(id, data)
      .then(() => handleCloseSubmitDialog())
      .catch(err => console.log(err))
  }

  console.log(localStorage.getItem(`remainingTime_${id}`));
  const showSubmitButton = () => {
    console.log(localStorage.getItem(`remainingTime_${id}`));
    if(submissions){
      if(submissions[user.id]){
        return null
      }
    }
    if(start){
      return (
        <Grid item>
          <Button variant="contained" className={classes.submitAssessmentButton} onClick={handleOpenSubmitDialog}>
            Kumpulkan
          </Button>
        </Grid>
      )
    }
    return null
  }

  const showTestStatus = () => {
    if(submissions){
      if(submissions[user.id]){
        return(
          <Paper className={classes.submittedPaper}>
            <CheckCircleOutlineIcon/>
            <Typography variant="button" style={{marginLeft: "5px"}}>
              TELAH DIKUMPULKAN
            </Typography>
          </Paper>
        )
      }
    }
    if(!start){
      if(!finish){
      //   return(
      //     <Typography variant="h6" align="center">
      //       TELAH SELESAI
      //     </Typography>
      //   )
      // }
      // else{
        return(
          <Grid item>
            <Button variant="contained" className={classes.startAssessmentButton} onClick={handleStart}>
              Mulai
            </Button>
          </Grid>
        )
      }
    }
    else{
      return(
        <Timer
          start_date={selectedAssessments.start_date}
          end_date={selectedAssessments.end_date}
          id={id}
          finish={finish}
          onSubmit={onSubmit}
          setOpenTimeoutDialog={() => setOpenTimeoutDialog(true)}
        />
      )
    }
  }

  const showQuestions = () => {
    if(submissions){
      if(submissions[user.id]){
        return null
      }
    }
    if(start){
      return [<Grid item>
        <Paper>
          <div className={classes.content}>
            <Typography color="primary" paragraph>
              Pindah ke Soal:
            </Typography>
            {/* <Grid container spacing={2} alignItems="center"> */}
            <Grid container item>
              <ToggleButtonGroup
                value={qnsIndex}
                exclusive
                onChange={(e, newIndex) => { handleQuestionIndex(e, newIndex) }}
                aria-label="question index"
                classes={{ root: classes.toggleGroupRoot, grouped: classes.toggleGroupChildren }}
              >

              {!questions ?
                  null
               :
                  questions.map((qns, i) => {
                    return (
                      questionPage(classes, handleChangeQuestion, qnsIndex, i + 1, answer)
                    )
                    // return (
                    // <QuestionPage
                    //   classes={classes}
                    //   question_number={i + 1}
                    //   handleChangeQuestion={handleChangeQuestion}
                    //   answer={answer}/>
                    // )
                  })
              }
              </ToggleButtonGroup>
            </Grid>
          </div>
        </Paper>
      </Grid>,
      <Grid item>
        <Paper>
          <Grid container>
            <Grid item xs sm className={classes.content}>
              <Grid container direction="column" spacing={2}>
                <Grid item>
                  <Typography variant="h6" gutterBottom>
                    Soal {qnsIndex + 1}
                  </Typography>
                  <GridList cols={3} cellHeight={300} style={{margin: "10px 0px 10px 0px"}}>
                    {!questions ?
                      null
                      :
                      questions[qnsIndex].lampiran.map((image, i) =>
                        <GridListTile key={image} cols={1} >
                        <img alt="current img" src={`/api/upload/att_assessment/${image}`}/>
                        <GridListTileBar
                            title={`Gambar ${i+1}`}
                            titlePosition="top"
                            actionPosition="right"/>
                      </GridListTile>
                    )}
                  </GridList>
                    {(!questions) ? (
                      null
                    ) : (
                      (questions[qnsIndex].type === "shorttext") ? (
                        generateSoalShortTextStudent()
                      ) : (
                        <Typography variant="h6" gutterButtom>
                          {questions[qnsIndex].name}
                        </Typography>
                      )
                    )}
                </Grid>
                <Grid item>
                  <FormControl component="fieldset" id="answer" fullWidth>
                    {(!questions) ? (
                      null
                    ) : ((questions[qnsIndex].type === "radio") ? (
                        <RadioGroup value={answer[qnsIndex][0] ? answer[qnsIndex][0] : ""} id="answer" onChange={(e) => handleChangeAnswer(e, "radio")}>
                          {questions[qnsIndex].options.map((option, i) =>
                          <div style={{display: "flex"}}>
                            <FormControlLabel
                              style={{width: "100%"}}
                              value={String.fromCharCode(97 + i).toUpperCase()}
                              control={<Radio color="primary" />}
                              label={ <Typography className={classes.optionText}>{option}</Typography>}
                            />
                          </div>
                          )}
                        </RadioGroup>
                      ) : (questions[qnsIndex].type === "checkbox") ? (
                        <FormGroup>
                          {questions[qnsIndex].options.map((option, i) => {
                            let val = String.fromCharCode(97 + i).toUpperCase()
                              return(
                                <div style={{display: "flex"}}>
                                  <FormControlLabel
                                    style={{width: "100%"}}
                                    value={String.fromCharCode(97 + i).toUpperCase()}
                                    control={<Checkbox checked={answer[qnsIndex].includes(val)} color="primary" onChange={(e) => handleChangeAnswer(e, "checkbox")}/>}
                                    label={ <Typography className={classes.optionText}>{option}</Typography>}
                                  />
                                </div>
                              )
                            }
                          )}
                        </FormGroup>
                      ) : (questions[qnsIndex].type === "shorttext") ? (
                        null
                      ) : (questions[qnsIndex].type === "longtext") ? (
                        <TextField
                          key={`${user.id}-${qnsIndex}`}
                          id="answer"
                          multiline
                          rowsMax={10}
                          value={answer[qnsIndex][0]}
                          label="Jawaban Anda"
                          variant="outlined"
                          onChange={(e) => { handleChangeAnswer(e, "longtext") }}
                        />
                      ) : (
                        null
                      )
                    )}
                  </FormControl>
                </Grid>
              </Grid>
            </Grid>
            <Divider flexItem orientation="vertical" />
          </Grid>
        </Paper>
      </Grid>,
      <Grid item>
        <Grid container alignItems="center" className={classes.content}>
          {qnsIndex === 0 ? null :
            <Grid item xs container justify="flex-start">
              <Button
                variant="contained"
                startIcon={<ChevronLeftIcon />}
                className={classes.previousPageButton}
                onClick={() => handleChangeQuestion(qnsIndex - 1)}
              >
                Soal Sebelumnya
              </Button>
            </Grid>
          }
          {qnsIndex === questions_length - 1 ?
            null
            :
            <Grid item xs container justify="flex-end">
              <Button
                variant="contained"
                endIcon={<ChevronRightIcon />}
                className={classes.nextPageButton}
                onClick={() => handleChangeQuestion(qnsIndex + 1)}
              >
                Soal Selanjutnya
              </Button>
            </Grid>
          }
        </Grid>
      </Grid>
      ]
    }
    return null
  }

  if(!posted){
    if(posted!== null){
      return <Redirect to="/tidak-ditemukan"/>
    }
    return (<div>{/* None */} </div>)
  }

  if (selectedAssessments) {
    if (!selectedAssessments.class_assigned.includes(user.kelas)) {
      return <Redirect to="/tidak-ditemukan" />
    }
  }

  return (
    <div className={classes.root}>
      <SubmitDialog
        openSubmitDialog={openSubmitDialog}
        handleCloseSubmitDialog={handleCloseSubmitDialog}
        itemType="Ujian"
        itemName={selectedAssessments.name}
        onSubmit={onSubmit}
      />
      <TimeoutDialog
        openTimeoutDialog={openTimeoutDialog}
        handleCloseTimeoutDialog={() => setOpenTimeoutDialog(false)}
      />
      <form>
        <Grid container direction="column" spacing={3}>
          <Grid item>
            <Paper>
              <Grid container direction="column" spacing={5} alignItems="center" className={classes.content}>
                <Grid item>
                  <Typography variant="subtitle1" align="center" color="textSecondary">
                    {selectedAssessments.type}
                  </Typography>
                  <Typography variant="h4" align="center" gutterBottom>
                    {selectedAssessments.name}
                  </Typography>
                  <Typography variant="h6" align="center" color="primary">
                    {all_subjects_map.get(selectedAssessments.subject)}
                  </Typography>
                </Grid>
                <Grid item>
                  <Typography variant="subtitle1" align="center" color="textSecondary">
                    Mulai: {`${moment(selectedAssessments.start_date).locale("id").format("DD MMM YYYY, HH.mm")}`}
                  </Typography>
                  <Typography variant="subtitle1" align="center" color="textSecondary">
                    Selesai: {`${moment(selectedAssessments.end_date).locale("id").format("DD MMM YYYY, HH.mm")}`}
                  </Typography>
                </Grid>
                <Grid item>
                  <Typography variant="subtitle2" align="center">
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
    </div>
  )

};

ViewAssessmentStudent.propTypes = {
  assessmentsCollection: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  getOneAssessment: PropTypes.func.isRequired,
  getAllClass: PropTypes.func.isRequired,
  getAllSubjects: PropTypes.func.isRequired,
  submitAssessment: PropTypes.func.isRequired
}

const mapStateToProps = (state) => ({
  assessmentsCollection: state.assessmentsCollection,
  classesCollection: state.classesCollection,
  subjectsCollection: state.subjectsCollection,
  auth: state.auth
})

export default connect(
  mapStateToProps, { submitAssessment, getOneAssessment, getAllClass, getAllSubjects }
)(ViewAssessmentStudent);
