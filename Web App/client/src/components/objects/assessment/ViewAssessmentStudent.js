import React from "react";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { getAllClass } from "../../../actions/ClassActions";
import { getAllSubjects } from "../../../actions/SubjectActions";
import { getOneAssessment } from "../../../actions/AssessmentActions";
import LightTooltip from "../../misc/light-tooltip/LightTooltip";
import { Avatar, Badge, Button, Box, CircularProgress, Divider, FormControl, FormControlLabel, Grid, GridListTile, GridListTileBar, GridList, IconButton, Paper, Radio, RadioGroup, TextField, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import DoneOutlineIcon from "@material-ui/icons/DoneOutline";
import FilterNoneIcon from "@material-ui/icons/FilterNone";
import { getOneAssessment } from "../../../actions/AssessmentActions";
import PropTypes from "prop-types";
import { getAllClass } from "../../../actions/ClassActions";
import { getAllSubjects } from "../../../actions/SubjectActions";
import { connect } from "react-redux";
import moment from "moment";
import "moment/locale/id";

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
    backgroundColor: theme.palette.create.main,
    color: "white",
    "&:focus, &:hover": {
      backgroundColor: "white",
      color: theme.palette.create.main,
    },
  },
  questionPaper: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "35px",
    height: "35px",
    "&:focus, &:hover": {
      backgroundColor: theme.palette.primary.main,
      color: "white",
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
  pageButton: {
    width: "35px",
    height: "35px",
    padding: "0px",
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
  }
}));

function QuestionPage(props) {
  const { classes, handleChangeQuestion, question_number } = props;


  return (
    <Grid item>
      <Paper variant="outlined" button className={classes.questionPaper} onClick={() => handleChangeQuestion(question_number-1)}>
        <Typography>
          {question_number}
        </Typography>
      </Paper>
    </Grid>
  )
}

function Timer(props) {
  const classes = useStyles();
  let {start_date, end_date } = props;
  console.log(start_date, end_date)
  let startTime = new Date(start_date);
  let finishTime = new Date(end_date);

  let workTime = Math.floor((finishTime - startTime)/1000)
  let res = Math.floor((finishTime - new Date())/1000)

  const [time, setTime] = React.useState(res);
  var hours = Math.floor(time / 3600) % 24;
  var minutes = Math.floor(time / 60) % 60;
  var seconds = time % 60;

  React.useEffect(() => {
    const timer = setInterval(() => {
      setTime((prevTime) => (prevTime - 1));
    }, 1000);
    return () => {
      clearInterval(timer);
    };
  }, []);

  return (
    <div className={classes.root}>
      {/* <Typography variant="h5" component="div" color="textSecondary" style={{marginBottom: "20px"}}>
        Waktu Ujian: {`${moment(startTime).locale("id").format("HH:mm")} - ${moment(finishTime).locale("id").format("HH:mm")}`}
      </Typography> */}
      <Box position="relative" display="inline-flex">
        <CircularProgress variant="static" value={(res/workTime)*100} size={200} />
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

function ViewAssessmentStudent(props) {
  const classes = useStyles();
  const { selectedAssessments } = props.assessmentsCollection;
  const { all_subjects_map } = props.subjectsCollection;
  const { getOneAssessment, getAllSubjects, getAllClass } = props;

  const [ qnsIndex, setQnsIndex ] = React.useState(0);
  const [ answer, setAnswer] = React.useState([]);
  const [ posted, setPosted] = React.useState(null)
  const [ start, setStart ] = React.useState(null);

  let id = props.match.params.id;

  React.useEffect(() => {
    getAllSubjects("map")
    getAllClass("map")

   new Promise((resolve, reject) => {
      getOneAssessment(id, resolve)
    }).then((res) => {
      console.log(res.data.posted)
      setPosted(res.data.posted)
    })
  }, [])

  let questions = selectedAssessments.questions;
  let questions_length = !questions ? 0 : questions.length
  
  React.useEffect(() => {
    if(questions_length){
      let arr = Array.apply(null, Array(questions_length))
      setAnswer(arr)
    }
  }, [questions_length])

  const handleChangeQuestion = (i) => {
    setQnsIndex(i)
  }
  const handleChangeAnswer = (e) => {
    let temp = answer;
    temp[qnsIndex] = e.target.value;
    setAnswer([...temp])
  }

  const handleStart = () => {
    setStart(true);
  }

  console.log(posted)
  if(!posted){
    if(posted!== null){
      return <Redirect to="/tidak-ditemukan"/>
    }
    return (<div>{/* None */} </div>)
  }

  else {
  return (
    <div className={classes.root}>
      <form>
        <Grid container direction="column" spacing={3}>
          <Grid item>
            <Paper>
              <Grid container direction="column" spacing={5} alignItems="center" className={classes.content}>
                <Grid item>
                  <Typography variant="h6" align="center">
                    {all_subjects_map.get(selectedAssessments.subject)}
                  </Typography>
                  <Typography variant="h4" align="center" gutterBottom>
                    {selectedAssessments.name}
                  </Typography>
                  <Typography variant="h6" align="center">
                    {selectedAssessments.description}
                  </Typography>
                </Grid>
                {!start ? 
                  <Grid item>
                    <Button variant="contained" className={classes.startAssessmentButton} onClick={handleStart}>
                      Mulai
                    </Button>
                  </Grid> 
                  : 
                  <Timer 
                    start_date={selectedAssessments.start_date}
                    end_date={selectedAssessments.end_date}/>
                }
                <Grid item>
                  <Typography variant="h6" align="center" color="textSecondary">
                    Waktu Ujian: {`${moment(selectedAssessments.start_date).locale("id").format("HH:mm")} - ${moment(selectedAssessments.end_date).locale("id").format("HH:mm")}`}
                  </Typography>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
          {!start ? 
          null :
          [<Grid item>
            <Paper>
              <div className={classes.content}>
                <Typography color="primary" style={{marginBottom: "20px"}}>
                  Pindah ke Soal:
                </Typography>
                <Grid container spacing={2} alignItems="center">
                  {!questions ?
                    null
                    :
                    questions.map((qns, i) => { return (<QuestionPage classes={classes} question_number={i + 1} handleChangeQuestion={handleChangeQuestion}/>)})
                  }
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
                            <img alt="current image" src={`/api/upload/att_assessment/${image}`}/>
                            <GridListTileBar
                                title={`Gambar ${i+1}`}
                                titlePosition="top"
                                actionPosition="right"/>
                          </GridListTile>
                        )}
                      </GridList>
                      <Typography variant="h5" gutterButtom>
                        <b>{!questions ? null : questions[qnsIndex].name}</b>
                      </Typography>
                    </Grid>
                    <Grid item>
                      <FormControl component="fieldset" id="answer" fullWidth>
                        <RadioGroup value={answer[qnsIndex] ? answer[qnsIndex] : ""} id="answer" onChange={handleChangeAnswer}>
                          {!questions ?
                          null
                          :
                          questions[qnsIndex].options.map((option, i) =>
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
                      </FormControl>
                    </Grid>
                  </Grid>
                </Grid>
                <Divider flexItem orientation="vertical" />
              </Grid>
            </Paper>
          </Grid>,
          <Grid item>
            <Paper>
              <Grid container>
              <Divider flexItem orientation="vertical" />
              <Grid item container spacing={2} justify="flex-end" alignItems="center" className={classes.content}>
                {qnsIndex === 0 ? null :
                <Grid item>
                  <LightTooltip title="Soal Sebelumnya">
                    <IconButton className={classes.pageButton} onClick={() => handleChangeQuestion(qnsIndex - 1)}>
                      <ChevronLeftIcon />
                    </IconButton>
                  </LightTooltip>
                </Grid>
                }
                <Grid item>
                  <Badge
                    badgeContent={
                      <Avatar style={{backgroundColor: "green", color: "white", width: "20px", height: "20px"}}>
                        <DoneOutlineIcon style={{width: "15px", height: "15px"}} />
                      </Avatar>
                    }
                    anchorOrigin={{
                      vertical: "bottom",
                      horizontal: "right",
                    }}
                  >
                    <Button variant="contained" className={classes.saveAnswerButton}>
                      Simpan Jawaban
                    </Button>
                  </Badge>
                </Grid>
                {qnsIndex === questions_length - 1 ?
                  null
                  :
                  <Grid item>
                    <LightTooltip title="Soal Selanjutnya">
                      <IconButton className={classes.pageButton} onClick={() => handleChangeQuestion(qnsIndex + 1)}>
                        <ChevronRightIcon />
                      </IconButton>
                    </LightTooltip>
                  </Grid>
                }
              </Grid>
              </Grid>
            </Paper>
          </Grid>
          ]
        }
        </Grid>
      </form>
    </div>
  )
}

};

ViewAssessmentStudent.propTypes = {
  assessmentsCollection: PropTypes.object.isRequired,
  getOneAssessment: PropTypes.func.isRequired,
  getAllClass: PropTypes.func.isRequired,
  getAllSubjects: PropTypes.func.isRequired,
}

const mapStateToProps = (state) => ({
  assessmentsCollection: state.assessmentsCollection,
  classesCollection: state.classesCollection,
  subjectsCollection: state.subjectsCollection,
})

export default connect(
  mapStateToProps, { getOneAssessment, getAllClass, getAllSubjects }
)(ViewAssessmentStudent);
