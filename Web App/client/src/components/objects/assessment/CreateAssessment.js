import React, { Component } from "react";
import { connect } from "react-redux";
import DateFnsUtils from "@date-io/date-fns";
import PropTypes from "prop-types";
import lokal from "date-fns/locale/id";
import "date-fns";
import { createAssessment } from "../../../actions/AssessmentActions";
import { getAllClass } from "../../../actions/ClassActions";
import { getAllSubjects } from "../../../actions/SubjectActions";
import { clearErrors } from "../../../actions/ErrorActions";
import LightTooltip from "../../misc/light-tooltip/LightTooltip";
import { Avatar, Badge, Button, Chip, Divider, FormControl, FormControlLabel, FormHelperText, Grid, GridList, GridListTile, GridListTileBar, MenuItem, IconButton, Paper, Radio, RadioGroup, TextField, Typography, Select } from "@material-ui/core";
import { MuiPickersUtilsProvider, KeyboardDateTimePicker } from "@material-ui/pickers";
import { withStyles } from "@material-ui/core/styles";
import AddIcon from "@material-ui/icons/Add";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import AddPhotoAlternateIcon from "@material-ui/icons/AddPhotoAlternate";
import ClearIcon from "@material-ui/icons/Clear";
import CloseIcon from "@material-ui/icons/Close";
import DeleteIcon from "@material-ui/icons/Delete";
import DoneOutlineIcon from "@material-ui/icons/DoneOutline";
import FilterNoneIcon from "@material-ui/icons/FilterNone";
import SaveIcon from "@material-ui/icons/Save";


const styles = (theme) => ({
  root: {
    margin: "auto",
    maxWidth: "1000px",
    padding: "10px",
  },
  content: {
    padding: "20px 20px 30px 20px",
  },
  gridList: {
    maxHeight: "250px",
  },
  divider: {
    [theme.breakpoints.down("md")]: {
      width: "100%",
      height: "1px",
    },
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
  addOptionButton: {
    backgroundColor: "white",
    color: theme.palette.primary.main,
    marginTop: "20px",
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
  avatarImg1: { // If width is smaller than height
    width: theme.spacing(25),
  },
  avatarImg2: { //If height is smaller than width
    height: theme.spacing(25),
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
      questions: [{ // mau ganti questions ini dalam Hashmap mungkin.
        name: "",
        options: ["Opsi 1", ""],
        answer: "A",
        images: []
      }],
      name: "",
      description: "",
      subject: "",
      class_assigned: [],
      start_date: new Date(),
      end_date: new Date(),
    }
  }

  // ref itu untuk ngerefer html yang ada di render.
  imageUploader = React.createRef(null) // untuk ngerefer html object yang lain
  uploadedImage = React.createRef(null)

  componentWillUnmount(){
    this.props.clearErrors()
  }

  onSubmit = (e, id) => {
    e.preventDefault()
    const { createAssessment , history} = this.props
    const assessmentData = {
      name: this.state.name,
      start_date: this.state.start_date,
      end_date: this.state.end_date,
      subject: this.state.subject,
      class_assigned: this.state.class_assigned,
      description: this.state.description,
      questions: this.state.questions,
      author_id: id,
    }

    createAssessment(assessmentData, history)
  }

  onChange = (e, otherfield=null) => {
    if(otherfield){
      if(otherfield === "end_date" || otherfield === "start_date"){
        this.setState({ [otherfield]: e })
      }else{
        this.setState({ [otherfield]: e.target.value})
      }
    }
    else{
      this.setState({ [e.target.id]: e.target.value})
    }
  }

  onDateChange = (date) => {
    this.setState({ end_date: date })
  }

  handleAddQuestion = () => {
    let questions = this.state.questions
    questions.push({name: "", options: ["Opsi 1", ""], answer: "A"})
    this.setState({questions: questions})
  }

  handleChangeQuestion = (e, i, otherfield=null) => {
    console.log("BUDI")
    var questions = this.state.questions

    if(otherfield === "answer"){
      questions[i]["answer"] = e.target.value
      console.log(e.target.value)
    }else {
      questions[i][e.target.id] = e.target.value
    }

    this.setState({ questions: questions})
  }

  handleQuestionOptions = (e, optionIndex, qnsIndex, action) => {
    console.log("AAAA")
    let questions = this.state.questions
    if(action === "Delete"){
      questions[qnsIndex].options.splice(optionIndex, 1)
    }else if(action === "Add"){
      questions[qnsIndex].options.push("")
    }else if(action === "Edit"){
      questions[qnsIndex].options[optionIndex] = e.target.value
    }else{
      console.log("No action is specified")
    }
    console.log(questions)
    this.setState({ questions: questions})
  }

  handleDuplicateQueston = (i, question) => {
    console.log(i)
    let questions = this.state.questions
    // kalau masukkin question langsung gitu, somehow dia akan ikut berubah kalo yang duplicated yg lain berubah nilainya.
    // Mungkin karena kalau assign question langsung itu object jadi sama persis? kalau aku destructure masing" lalu buat new object, jadi beda beda?
    // questions.splice(i+1, 0, question)

    questions.splice(i+1, 0, {
      name: question.name,
      options: [...question.options],
      answer: question.answer,
      images: question.images
    })
    this.setState({ questions: questions})
  }

  deleteQuestion = (index) => {
    console.log(index)
    let questions = this.state.questions
    questions.splice(index, 1)
    this.setState({ questions: questions})
  }

  // readImageURI = (e, qnsIndex) => {

  // }

  handleQuestionImage = (e, qnsIndex) => {
    if(e.target.files){
      const files = Array.from(e.target.files);

      Promise.all(files.map(file => {
        return (new Promise((resolve, reject) => {
          let reader = new FileReader();
          reader.onload = e => {
            resolve(e.target.result);
          }
          reader.addEventListener('error', reject);
          reader.readAsDataURL(file);
        }))
      }))
      .then(images => {
        console.log("hdwdwendjw")
        let questions = this.state.questions
        let temp = questions[qnsIndex].images.concat(images);
        questions[qnsIndex].images = temp

        this.setState({ questions: questions})
      })
      .catch(err => console.log(err))
    }
    // this.readImageURI(e, qnsIndex)
  }

  buildImgTag = (images) => {
    if(!images)
      return null;
    else {
      let result = images.map((image, i) =>
        <GridListTile cellHeight={image.height} key={image} cols={1} >
          <img alt="current image" src={image}/>
          <GridListTileBar
              title={"HAHHA"}
              titlePosition="top"
              actionIcon={
                <IconButton style={{color: "white"}}>
                  <CloseIcon />
                </IconButton>
              }
              actionPosition="right"
            />
        </GridListTile>
      )

      return result;
    }

  }

  listQuestion = (classes) => {
    let questionList = []
    let questions = this.state.questions;
    // const { errors } = this.props
    let length = questions.length

    for( let i = 0; i < length; i++){
      let question = questions[i]
      let images = question.images;
      let options = question.options;

      questionList.push(
        <Grid item>
          <Paper>
            <Grid container>
              <Grid item xs sm md container direction="column" spacing={2} className={classes.content}>
                <Grid item>
                  <Typography variant="h6" gutterBottom>
                    Soal {i+1}
                  </Typography>
                  <GridList style={{margin: "10px 0px 10px 0px"}}>
                    {this.buildImgTag(images)}
                  </GridList>
                  <TextField
                    multiline
                    rowsMax={10}
                    id="name"
                    fullWidth
                    variant="filled"
                    value={question.name}
                    onChange={(e) => this.handleChangeQuestion(e, i)}
                  />
                </Grid>
                <Grid item>
                  <FormControl component="fieldset" id="answer" fullWidth>
                    <RadioGroup value={question.answer.toUpperCase()} id="answer" onChange={(e) => this.handleChangeQuestion(e, i, "answer")}>
                      {options.map((option, index) =>
                        <div style={{display: "flex"}}>
                          {/*{console.log(question.answer.toUpperCase() === String.fromCharCode(97 + index).toUpperCase())}
                          <Radio
                            checked={question.answer.toUpperCase() === String.fromCharCode(97 + index).toUpperCase()}
                            value={String.fromCharCode(97 + index).toUpperCase()}
                            onChange={(e) => {console.log("AAA"); this.handleChangeQuestion(e, i, "answer")}}
                          />
                          <TextField
                            fullWidth
                            value={option}
                            onChange={(e) => this.handleQuestionOptions(e, index, i, "Edit" )}
                            placeholder="Isi Pilihan"
                          />*/}
                          <FormControlLabel
                            style={{width: "100%"}}
                            value={String.fromCharCode(97 + index).toUpperCase()}
                            control={<Radio />}
                            label={
                              <TextField
                                style={{flexGrow: 1}}
                                value={option}
                                onChange={(e) => this.handleQuestionOptions(e, index, i, "Edit" )}
                                placeholder="Isi Pilihan"
                              />
                            }
                          />
                          <IconButton onClick={(e) => this.handleQuestionOptions(e, index, i, "Delete" )}>
                            <ClearIcon/>
                          </IconButton>
                        </div>
                      )}
                      <div>
                        <Button className={classes.addOptionButton} startIcon={<AddCircleIcon/>} onClick={(e) => this.handleQuestionOptions(e, null, i, "Add")}>
                          Tambah  pilihan
                        </Button>
                      </div>
                    </RadioGroup>
                  </FormControl>
                </Grid>
              </Grid>
              <Divider flexItem orientation="vertical" />
              <Grid item xs={3} sm={2} md={1} container direction="column" alignItems="center" className={classes.content}>
                <Grid item>
                  <input
                    accept="image/*"
                    multiple
                    type="file"
                    name="avatar"
                    onChange={(e) => this.handleQuestionImage(e, i)}
                    ref={this.imageUploader}
                    style={{
                      display: "none",
                      visibility: "hidden",
                    }}
                  />
                  <LightTooltip title="Tambahkan " placement="right">
                    <IconButton onClick={() => this.imageUploader.current.click()}>
                      <AddPhotoAlternateIcon/>
                    </IconButton>
                  </LightTooltip>
                </Grid>
                <Grid item>
                  <LightTooltip title="Duplikat Soal" placement="right">
                    <IconButton onClick={() => this.handleDuplicateQueston(i, question)}>
                      <FilterNoneIcon />
                    </IconButton>
                  </LightTooltip>
                </Grid>
                <Grid item>
                  <LightTooltip title="Hapus Soal" placement="right">
                    <IconButton onClick={() => { console.log(i); this.deleteQuestion(i)}}>
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
    const { getAllClass, getAllSubjects } = this.props
    getAllClass()
    getAllSubjects()
  }

  render() {
    console.log(this.state.questions)
    const { class_assigned } = this.state;
    const { classes, errors } = this.props;
    const { all_classes } = this.props.classesCollection;
    const { all_subjects } = this.props.subjectsCollection;
    const { user } = this.props.auth;

    document.title = "Schooly | Buat Kuis";
    console.log(this.state.questions)
    return (
      <div className={classes.root}>
        <form onSubmit={(e) => this.onSubmit(e, user.id)}>
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
                <Grid container>
                  <Grid item xs={12} md className={classes.content}>
                    <Grid container direction="column" spacing={4}>
                      <Grid item>
                        <Typography component="label" for="name" color="primary">
                          Judul
                        </Typography>
                        <TextField
                          fullWidth
                          variant="outlined"
                          id="name"
                          error={errors.name}
                          helperText={errors.name}
                          onChange={this.onChange}
                        />
                      </Grid>
                      <Grid item>
                        <Typography component="label" for="description" color="primary">
                          Deskripsi
                        </Typography>
                        <TextField
                          multiline
                          rowsMax={10}
                          fullWidth
                          error={errors.description}
                          helperText={errors.description}
                          onChange={this.onChange}
                          variant="outlined"
                          id="description"
                        />
                      </Grid>
                    </Grid>
                  </Grid>
                  <Divider flexItem orientation="vertical" className={classes.divider} />
                  <Grid item xs={12} md className={classes.content}>
                    <Grid container direction="column" spacing={4}>
                      <Grid item container spacing={2}>
                        <Grid item xs={12} md={6}>
                          <Typography component="label" for="workTime" color="primary">
                            Waktu Mulai Pengerjaan
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
                              value={this.state.start_date}
                              onChange={(date) => this.onChange(date, "start_date")}
                            />
                          </MuiPickersUtilsProvider>
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <Typography component="label" for="workTime" color="primary">
                            Waktu Selesai Pengerjaan
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
                              invalidDateMessage="Format tanggal tidak benar"
                              id="workTime"
                              value={this.state.end_date}
                              minDate={this.state.start_date}
                              minDateMessage="Batas waktu harus setelah Mulai waktu pengerjaan"
                              onChange={(date) => this.onChange(date, "end_date")}
                            />
                          </MuiPickersUtilsProvider>
                        </Grid>
                      </Grid>
                      <Grid item>
                        <Typography component="label" for="subject" color="primary">
                          Mata Pelajaran
                        </Typography>
                        <FormControl id="subject" variant="outlined" color="primary" fullWidth error={Boolean(errors.subject) && !this.state.subject}>
                          <Select
                            value={this.state.subject}
                            onChange={(event) => {this.onChange(event, "subject")}}
                          >
                            {all_subjects.map((subject) => (
                              <MenuItem value={subject._id}>{subject.name}</MenuItem>
                            ))}
                          </Select>
                          <FormHelperText>
                            {Boolean(errors.subject) && !this.state.subject ? errors.subject : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid>
                      <Grid item>
                        <Typography component="label" for="class_assigned" color="primary">
                          Kelas yang Ditugaskan
                        </Typography>
                        <FormControl variant="outlined" fullWidth error={Boolean(errors.class_assigned) && class_assigned.length === 0}>
                        <Select
                          multiple
                          fullWidth
                          variant="outlined"
                          color="primary"
                          id="class_assigned"
                          value={class_assigned}
                          onChange={(event) => this.onChange(event, "class_assigned")}
                          renderValue={(selected) => (
                            <div className={classes.chips}>
                              {selected.map((id) => {
                                let name
                                for (let i in all_classes) {
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
                          <FormHelperText>
                            {Boolean(errors.class_assigned) && class_assigned.length === 0 ? errors.class_assigned : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
              {this.listQuestion(classes)}
            <Grid item>
              <Paper>
                <Grid container justify="flex-end" spacing={2} className={classes.content}>
                  <Grid item>
                    <FormHelperText error>
                      {errors.questions}
                    </FormHelperText>
                  </Grid>
                  <Grid item>
                    <LightTooltip title="Tambah Soal">
                      <IconButton onClick={this.handleAddQuestion} className={classes.addQuestionButton}>
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
                    <Button variant="contained" type="submit" className={classes.createAssessmentButton}>
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
  createAssessment: PropTypes.func.isRequired,
  getAllClass: PropTypes.func.isRequired,
  getAllSubjects: PropTypes.func.isRequired,
  clearErrors: PropTypes.func.isRequired,
  classesCollection: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
  errors:state.errors,
  auth: state.auth,
  classesCollection: state.classesCollection,
  subjectsCollection: state.subjectsCollection,
})

export default connect(
  mapStateToProps, { getAllClass, getAllSubjects, createAssessment, clearErrors }
)(withStyles(styles)(CreateAssessment));
