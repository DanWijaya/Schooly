import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import DateFnsUtils from "@date-io/date-fns";
import PropTypes from "prop-types";
import lokal from "date-fns/locale/id";
import "date-fns";
import { createAssessment } from "../../../actions/AssessmentActions";
import { getAllClass } from "../../../actions/ClassActions";
import { getAllSubjects } from "../../../actions/SubjectActions";
import { clearErrors } from "../../../actions/ErrorActions";
import DeleteDialog from "../../misc/dialog/DeleteDialog";
import UploadDialog from "../../misc/dialog/UploadDialog";
import LightTooltip from "../../misc/light-tooltip/LightTooltip";
import QuestionItem from "./QuestionItem";
import { Avatar, Badge, Button, Chip, CircularProgress, Divider, Dialog,
   FormControl, FormControlLabel, FormHelperText, Grid, GridList, GridListTile, GridListTileBar,
   MenuItem, IconButton, Paper, Radio, RadioGroup, Select, Switch, TextField, TablePagination, Typography } from "@material-ui/core";
import { MuiPickersUtilsProvider, KeyboardDateTimePicker } from "@material-ui/pickers";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import AddIcon from "@material-ui/icons/Add";
import DoneOutlineIcon from "@material-ui/icons/DoneOutline";
import FiberManualRecordIcon from "@material-ui/icons/FiberManualRecord";
import ToggleOffIcon from "@material-ui/icons/ToggleOff";
import ToggleOnIcon from "@material-ui/icons/ToggleOn";
import DeleteOutlineIcon from "@material-ui/icons/DeleteOutline";
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
  divider: {
    [theme.breakpoints.down("sm")]: {
      width: "100%",
      height: "1px",
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
  addQuestionButton: {
    backgroundColor: theme.palette.primary.main,
    color: "white",
    "&:focus, &:hover": {
      backgroundColor: "white",
      color: theme.palette.primary.main,
    },
  },
  pageNavigator: {
    justifyContent: "flex-start",
    [theme.breakpoints.down("sm")]: {
      justifyContent: "center",
    },
  },
  assessmentSettings: {
    justifyContent: "flex-end",
    alignItems: "center",
    [theme.breakpoints.down("md")]: {
      justifyContent: "center",
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
  cancelButton: {
    backgroundColor: theme.palette.error.main,
    color: "white",
    "&:focus, &:hover": {
      backgroundColor: "white",
      color: theme.palette.error.main,
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
      // questions: [<QuestionItem number={1} deleteQuestion={this.deleteQuestion}/>],
      questions: [{ // mau ganti questions ini dalam Hashmap mungkin.
        name: "",
        options: ["Opsi 1", ""],
        answer: "A",
        lampiran: []
      }],
      name: "",
      description: "",
      subject: "",
      class_assigned: [],
      start_date: new Date(),
      end_date: new Date(),
      openDeleteDialog: false,
      openUploadDialog: false,
      success: false,
      page: 0,
      rowsPerPage: 10,
      qnsListitem: [],
      posted: false
    }
  }

  // ref itu untuk ngerefer html yang ada di render.
  imageUploader = React.createRef(null) // untuk ngerefer html object yang lain

  componentWillUnmount(){
    this.props.clearErrors()
    this.props.handleSideDrawerExist(true)
  }

  onSubmit = (e, id) => {
    e.preventDefault()
    let formData = new FormData();

    const { questions } = this.state;
    const { createAssessment , history} = this.props
    questions.forEach((qns) => {
      let lampiran = qns.lampiran;
      lampiran.forEach((img, i) => formData.append(`lampiran_assessment`, img))
    })

    const assessmentData = {
      name: this.state.name,
      start_date: this.state.start_date,
      end_date: this.state.end_date,
      subject: this.state.subject,
      class_assigned: this.state.class_assigned,
      description: this.state.description,
      questions: this.state.questions,
      author_id: id,
      posted: this.state.posted
    }

    console.log(assessmentData)

    createAssessment(formData, assessmentData, history)

  }

  handleOpenUploadDialog = () => {
    this.setState({ openUploadDialog: true})
  }

  handleOpenDeleteDialog = () => {
    this.setState({ openDeleteDialog: true })
  }

  handleCloseDeleteDialog = () => {
    this.setState({ openDeleteDialog: false })
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
    console.log("Add questionnnn")
    // let questions = this.state.questions
    // questions.push({name: "", options: ["Opsi 1", ""], answer: "A"})
    // this.setState({questions: questions})

    let questions = this.state.questions;
    questions.push({
      name: "",
      options: ["Opsi 1", ""],
      answer: "A",
      lampiran: []
    })
    this.setState({ questions: questions})
  }

  handleChangeQuestion = (e, i, otherfield=null) => {
    var questions = this.state.questions;

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

  handleDuplicateQuestion = (i) => {
    console.log(i)
    let questions = this.state.questions
    // kalau masukkin question langsung gitu, somehow dia akan ikut berubah kalo yang duplicated yg lain berubah nilainya.
    // Mungkin karena kalau assign question langsung itu object jadi sama persis? kalau aku destructure masing" lalu buat new object, jadi beda beda?
    // questions.splice(i+1, 0, question)

    questions.splice(i+1, 0, {
      name: questions[i].name,
      options: [...questions[i].options],
      answer: questions[i].answer,
      lampiran: [...questions[i].lampiran]
    })
    this.setState({ questions: questions})
  }

  deleteQuestion = (index) => {
    console.log(index)
    let questions = this.state.questions
    questions.splice(index, 1)
    this.setState({ questions: questions})
  }


  handleQuestionImage = (e, qnsIndex, indexToDelete=null) => {
    let questions = this.state.questions
    if(Number.isInteger(indexToDelete)){
      questions[qnsIndex].lampiran.splice(indexToDelete, 1);
      console.log(questions)
      this.setState({ questions: questions})
    }
    else{
      if(e.target.files){
          const files = Array.from(e.target.files);
          let temp = questions[qnsIndex].lampiran.concat(files)
          questions[qnsIndex].lampiran = temp;
          this.setState({ questions: questions})
      }
    }
  }

  listQuestion = () => {
    // let questionList = []
    let questions = this.state.questions;
    const { page, rowsPerPage} = this.state;
    const { classes } = this.props;

    let questionList = questions.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((question, i) => {
      console.log(question.lampiran)
      return(
        <QuestionItem
          isEdit={false}
          lampiranToAdd={[]} // dipakai untuk edit assessment, jadi pass array kosong aja.
          currentLampiran={[]} // dipakai untuk edit assessment, jadi pass array kosong aja.
          index={i + page * rowsPerPage}
          name={question.name}
          options={JSON.stringify(question.options)}
          answer={question.answer}
          lampiran={question.lampiran}
          lampiran_length={question.lampiran.length}
          deleteQuestion={this.deleteQuestion}
          handleDuplicateQuestion={this.handleDuplicateQuestion}
          handleQuestionOptions={this.handleQuestionOptions}
          handleChangeQuestion={this.handleChangeQuestion}
          handleQuestionImage={this.handleQuestionImage}
        />
      )
    }
  )

    return questionList
  }

  componentDidUpdate(prevProps, prevState){
    if(!this.props.errors && this.props.errors !== prevProps.errors){
      this.handleOpenUploadDialog()
    }
  }

  componentDidMount(){
    const { getAllClass, getAllSubjects, handleSideDrawerExist } = this.props
    handleSideDrawerExist(false)
    getAllClass()
    getAllSubjects()
  }


  handleChangePage = (event, newPage) => {
    // setPage(newPage);
    this.setState({ page: newPage})
  };

  handleChangeRowsPerPage = (event) => {
    this.setState({ page: 0, rowsPerPage: +event.target.value })
  };

  handlePostToggle = () => {
    this.setState((prevState) => ({
      posted: !prevState.posted
    }))
  }
  render() {
    console.log(this.state.questions)
    const { class_assigned } = this.state;
    const { classes, errors, success } = this.props;
    const { all_classes } = this.props.classesCollection;
    const { all_subjects } = this.props.subjectsCollection;
    const { user } = this.props.auth;

    const ToggleViewQuiz = withStyles((theme) => ({
      root: {
        width: 42,
        height: 26,
        padding: 0,
        margin: theme.spacing(1),
      },
      switchBase: {
        padding: 2.5,
        color: theme.palette.warning.light,
        "&$checked": {
          transform: "translateX(16px)",
          color: theme.palette.common.white,
          "& + $track": {
            backgroundColor: theme.palette.warning.light,
            opacity: 1,
            border: "none",
          },
        },
        "&$focusVisible $thumb": {
          color: "#52d869",
          border: "6px solid #fff",
        },
      },
      thumb: {
        width: 24,
        height: 24,
      },
      track: {
        borderRadius: 26 / 2,
        border: `1px solid ${theme.palette.grey[400]}`,
        backgroundColor: theme.palette.grey[50],
        opacity: 1,
        transition: theme.transitions.create(["background-color", "border"]),
      },
      checked: {},
    }))(Switch);

    document.title = "Schooly | Buat Kuis";

    console.log(this.state.questions)

    return (
      <div className={classes.root}>
        <DeleteDialog
          openDeleteDialog={this.state.openDeleteDialog}
          handleCloseDeleteDialog={this.handleCloseDeleteDialog}
          itemType="Kuis"
          deleteItem=""
          isLink={true}
          redirectLink="/daftar-kuis"
        />
        <UploadDialog
          openUploadDialog={this.state.openUploadDialog}
          success={success}
          messageUploading="Kuis sedang dibuat"
          messageSuccess="Kuis telah dibuat"
          redirectLink="/daftar-kuis"
        />
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
            {this.listQuestion()}
            <Grid item container justify="center">
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={this.handleAddQuestion}
                className={classes.addQuestionButton}
              >
                Tambah Soal
              </Button>
            </Grid>
            <Grid item>
              <Paper>
                <Grid container spacing={2} justify="space-between" alignItems="center" className={classes.content}>
                  <Grid item container md={8} alignItems="center" className={classes.pageNavigator}>
                    <Grid item>
                      <TablePagination
                        labelRowsPerPage="Soal Per Halaman"
                        rowsPerPageOptions={[5, 10]}
                        component="div"
                        count={this.state.questions.length}
                        rowsPerPage={this.state.rowsPerPage}
                        page={this.state.page}
                        onChangePage={this.handleChangePage}
                        onChangeRowsPerPage={this.handleChangeRowsPerPage}
                      />
                    </Grid>
                    <Grid item>
                      <FormControlLabel
                        label={!this.state.posted ? "Tampilkan ke Murid" : "Sembunyikan dari Murid"}
                        labelPlacement="start"
                        control={
                          <ToggleViewQuiz
                            checked={this.state.posted}
                            onChange={this.handlePostToggle}
                            checkedIcon={<FiberManualRecordIcon />}
                            icon={<FiberManualRecordIcon />}
                          />
                        }
                      />
                    </Grid>
                    <Grid item>
                      <FormHelperText error>
                        {errors.questions}
                      </FormHelperText>
                    </Grid>
                  </Grid>
                  <Grid item container md={4} spacing={2} className={classes.assessmentSettings}>
                    <Grid item>
                      <Button variant="contained" className={classes.cancelButton} onClick={this.handleOpenDeleteDialog}>
                        Batal
                      </Button>
                    </Grid>
                    <Grid item>
                      <Button variant="contained" type="submit" className={classes.createAssessmentButton}>
                        Buat Kuis
                      </Button>
                    </Grid>
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
  auth: PropTypes.object.isRequired,
  success: PropTypes.object.isRequired,
}

const mapStateToProps = state => ({
  errors:state.errors,
  auth: state.auth,
  success: state.success,
  classesCollection: state.classesCollection,
  subjectsCollection: state.subjectsCollection,
})

export default connect(
  mapStateToProps, { getAllClass, getAllSubjects, createAssessment, clearErrors }
)(withStyles(styles)(React.memo(CreateAssessment)));
