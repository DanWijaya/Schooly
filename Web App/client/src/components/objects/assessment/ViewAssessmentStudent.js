import React from "react";
import { Link, Redirect } from "react-router-dom";
import LightTooltip from "../../misc/light-tooltip/LightTooltip";
import { Avatar, Badge, Button, Divider, FormControl, FormControlLabel, Grid, GridListTile, GridListTileBar, GridList, IconButton, Paper, Radio, RadioGroup, TextField, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import AttachFileIcon from "@material-ui/icons/AttachFile";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import DeleteIcon from "@material-ui/icons/Delete";
import DoneOutlineIcon from "@material-ui/icons/DoneOutline";
import FilterNoneIcon from "@material-ui/icons/FilterNone";
import { getOneAssessment } from "../../../actions/AssessmentActions";
import PropTypes from "prop-types";
import { getAllClass } from "../../../actions/ClassActions";
import { getAllSubjects } from "../../../actions/SubjectActions";
import { connect } from "react-redux";

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

function ViewAssessmentStudent(props) {
  const classes = useStyles();
  const { selectedAssessments } = props.assessmentsCollection;
  const { all_subjects_map } = props.subjectsCollection;
  const { getOneAssessment, getAllSubjects, getAllClass } = props;

  const [ qnsIndex, setQnsIndex ] = React.useState(0);
  const [ answer, setAnswer] = React.useState([]);
  const [ posted, setPosted] = React.useState(null)

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
                  <Typography align="center">
                    {selectedAssessments.description}
                  </Typography>
                </Grid>
                <Grid item>
                  <Button variant="contained" className={classes.startAssessmentButton}>
                    Mulai
                  </Button>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
          <Grid item>
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
          </Grid>
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
          </Grid>
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
