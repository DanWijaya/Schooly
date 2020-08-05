import React, { Component } from "react";
import DateFnsUtils from "@date-io/date-fns";
import "date-fns";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import lokal from "date-fns/locale/id";
import LightTooltip from "../../misc/light-tooltip/LightTooltip";
import { Avatar, Badge, Button, Chip, Divider, FormControl, FormControlLabel, Grid, MenuItem, IconButton, Paper, Radio, RadioGroup, TextField, Typography, Select } from "@material-ui/core";
import { MuiPickersUtilsProvider, KeyboardDateTimePicker } from "@material-ui/pickers";
import { createQuiz } from "../../../actions/QuizActions";
import { withStyles } from "@material-ui/core/styles";
import AddIcon from "@material-ui/icons/Add";
import AttachFileIcon from "@material-ui/icons/AttachFile";
import DeleteIcon from "@material-ui/icons/Delete";
import DoneOutlineIcon from "@material-ui/icons/DoneOutline";
import FilterNoneIcon from "@material-ui/icons/FilterNone";
import SaveIcon from "@material-ui/icons/Save";
import { getAllClass } from "../../../actions/ClassActions";

const styles = (theme) => ({
  root: {
    margin: "auto",
    maxWidth: "1000px",
    padding: "10px",
  },
  content: {
    padding: "20px",
  },
  addQuestionButton: {
    width: "35px",
    height: "35px",
    padding: "0px",
    backgroundColor: theme.palette.primary.main,
    color: "white",
    "&:focus, &:hover": {
      backgroundColor: "white",
      color: theme.palette.primary.main,
    },
  },
  draftAssessmentButton: {
    width: "35px",
    height: "35px",
    padding: "0px",
    backgroundColor: theme.palette.warning.main,
    color: "white",
    "&:focus, &:hover": {
      backgroundColor: "white",
      color: theme.palette.warning.main,
    },
  },
  createAssessmentButton: {
    backgroundColor: theme.palette.create.main,
    color: "white",
    "&:focus, &:hover": {
      backgroundColor: "white",
      color: theme.palette.create.main,
    },
  },
  chips: {
    display: "flex",
    flexWrap: "wrap",
  },
  chip: {
    marginRight: 2,
  },
});

class CreateAssessment extends Component {
  constructor() {
    super();
    this.state = {
      num_qns: 1,
      questions: [{
        name: "",
        options: new Map(),
        answerIndex: "A",
      }],
      name: "",
      description: "",
      subject: "",
      class_assigned: [],
    }
  }

  handleRadioValue = (e) => {
    this.setState(e.target.value);
  };


  onChange = (e, otherfield=null) => {
    if(otherfield === "kelas"){
      this.setState({ class_assigned: e.target.value})
    } else if(otherfield === "subject"){
      this.setState({ subject: e.target.value})
    } else{
      this.setState({ [e.target.id]: e.target.value})
    }
  }

  addQuestion = () => {
    let questions = this.state.questions
    questions.push({name: "", options: new Map(),answerIndex: "B"})
    this.setState({questions: questions})
  }

  handleChangeQuestion = (e, i, otherfield=null) => {
    console.log(i)
    console.log(e.target.id)
    let questions = this.state.questions
    questions[i][e.target.id] = e.target.value
    if(otherfield === "answerIndex"){
      questions[i]["answerIndex"] = e.target.value
    }
    this.setState({ questions: questions})
  }

  deleteQuestion = (index) => {
    console.log(index)
    let questions = this.state.questions
    questions.splice(index, 1)
    this.setState({ questions: questions})
  }

  listQuestion = (classes) => {
    let questionList = []
    let questions = this.state.questions;
    let length = questions.length

    for( let i = 0; i < length; i++){
      let question = questions[i]

      questionList.push(
        <Grid item>
          <Paper>
            <Grid container>
              <Grid item xs sm md container direction="column" spacing={2} className={classes.content}>
                <Grid item>
                  <Typography variant="h6" gutterBottom>
                    Soal {i+1}
                  </Typography>
                  <TextField multiline id="name" fullWidth variant="filled" value={question.name} onChange={(e) => this.handleChangeQuestion(e, i)}/>
                </Grid>
                <Grid item>
                  <FormControl component="fieldset" id="answerIndex">
                    <RadioGroup value={question.answerIndex} id="answerIndex" onChange={(e) => this.handleChangeQuestion(e,i, "answerIndex")}>
                      <FormControlLabel value="A" control={<Radio />} label="Female" />
                      <FormControlLabel value="B" control={<Radio />} label="Male" />
                      <FormControlLabel value="C" control={<Radio />} label="Other" />
                      <FormControlLabel value="D" disabled control={<Radio />} label="(Disabled option)" />
                      <FormControlLabel disabled control={<Radio />} label={<TextField />} />
                    </RadioGroup>
                  </FormControl>
                </Grid>
              </Grid>
              <Divider flexItem orientation="vertical" />
              <Grid item xs={3} sm={2} md={1} container direction="column" alignItems="center" className={classes.content}>
                <Grid item>
                  <LightTooltip title="Tambahkan Berkas" placement="right">
                    <IconButton>
                      <AttachFileIcon />
                    </IconButton>
                  </LightTooltip>
                </Grid>
                <Grid item>
                  <LightTooltip title="Duplikat Soal" placement="right">
                    <IconButton>
                      <FilterNoneIcon />
                    </IconButton>
                  </LightTooltip>
                </Grid>
                <Grid item>
                  <LightTooltip title="Hapus Soal" placement="right">
                    <IconButton onClick={(index=i)=> { console.log(index) 
                      this.deleteQuestion(index)}}>
                      <DeleteIcon />
                    </IconButton>
                  </LightTooltip>
                </Grid>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
        )
    }
    return questionList
  }

  componentDidMount(){
    const { createQuiz, getAllClass } = this.props
    getAllClass()
  }

  render() {
    const { name, description, subject, class_assigned} = this.state;
    const { num_qns, radioValue } = this.state;
    const { classes, getAllClass } = this.props;
    const { all_classes } = this.props.classesCollection;

    console.log(this.state.description)
    console.log(all_classes)
    document.title = "Schooly | Buat Kuis";
    console.log(this.state.questions)
    return (
      <div className={classes.root}>
        <form>
          <Grid container direction="column" spacing={3}>
            <Grid item>
              <Paper>
                <div className={classes.content}>
                  <Typography variant="h5" gutterBottom>
                    <b>Buat Kuis</b>
                  </Typography>
                  <Typography color="textSecondary">
                    Tambahkan keterangan kuis untuk membuat kuis.
                  </Typography>
                </div>
                <Divider />
                <Grid container direction="column" spacing={3} justify="center" className={classes.content}>
                  <Grid item>
                    <Typography component="label" for="name" color="primary">
                      Judul
                    </Typography>
                    <TextField
                      fullWidth
                      variant="outlined"
                      id="name"
                    />
                  </Grid>
                  
                  <Grid item>
                    <Typography component="label" for="class_assigned" color="primary">
                      Kelas yang Ditugaskan
                    </Typography>
                    <Select
                      multiple
                      fullWidth
                      variant="outlined"
                      color="primary"
                      id="class_assigned"
                      value={class_assigned}
                      onChange={(event) => this.onChange(event, "kelas")}
                      renderValue={(selected) => (
                        <div className={classes.chips}>
                          {selected.map((id) => {
                            let name
                            for (var i in all_classes) {
                              if(all_classes[i]._id === id) {
                                name = all_classes[i].name
                                break;
                              }
                            }
                            return (
                              <Chip key={id} label={name} className={classes.chip}/>
                            )
                          })}
                        </div>
                      )}>
                      {all_classes.map((kelas) => (<MenuItem value={kelas._id}>{kelas.name}</MenuItem>))}
                    </Select>
                  </Grid> 

                  <Grid item>
                    <Typography component="label" for="description" color="primary">
                      Deskripsi
                    </Typography>
                    <TextField
                      multiline
                      rowsMax={10}
                      fullWidth
                      onChange={this.onChange}
                      variant="outlined"
                      id="description"
                    />
                  </Grid>
                  <Grid item>
                    <Typography component="label" for="workTime" color="primary">
                      Jadwal Pengerjaan
                    </Typography>
                    <MuiPickersUtilsProvider locale={lokal} utils={DateFnsUtils}>
                      <KeyboardDateTimePicker
                        fullWidth
                        disablePast
                        inputVariant="outlined"
                        format="dd/MM/yyyy - HH:mm"
                        ampm={false}
                        okLabel="Simpan"
                        cancelLabel="Batal"
                        minDateMessage="Batas waktu harus waktu yang akan datang"
                        invalidDateMessage="Format tanggal tidak benar"
                        id="workTime"
                        value={new Date()}
                        onChange=""
                      />
                    </MuiPickersUtilsProvider>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
              {this.listQuestion(classes)}
            <Grid item>
              <Paper>
                <Grid container justify="flex-end" spacing={2} className={classes.content}>
                  <Grid item>
                    <LightTooltip title="Tambah Soal">
                      <IconButton onClick={this.addQuestion} className={classes.addQuestionButton}>
                        <AddIcon/>
                      </IconButton>
                    </LightTooltip>
                  </Grid>
                  <Grid item>
                    <LightTooltip title="Simpan Kuis">
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
                        <IconButton className={classes.draftAssessmentButton}>
                          <SaveIcon />
                        </IconButton>
                      </Badge>
                    </LightTooltip>
                  </Grid>
                  <Grid item>
                    <Button variant="contained" className={classes.createAssessmentButton}>
                      Buat Kuis
                    </Button>
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

CreateAssessment.propTypes = {
  createQuiz: PropTypes.func.isRequired,
  getAllClass: PropTypes.func.isRequired,
  classesCollection: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
  classesCollection: state.classesCollection
})

export default connect(
  mapStateToProps, { createQuiz, getAllClass }
)(withStyles(styles)(CreateAssessment));
