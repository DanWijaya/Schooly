// FILE BACKUP
// Waktu pembuatan: 11/11/2020
// Tujuan pembuatan: menyimpan progress terakhir error snackbar

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
import DeleteDialog from "../../misc/dialog/DeleteDialog";
import UploadDialog from "../../misc/dialog/UploadDialog";
import QuestionItem from "./QuestionItem";
import { Button, Chip, Divider,
  FormControl, FormControlLabel, FormHelperText, Grid, Menu,
  MenuItem, Paper, Select, Snackbar, Switch, TextField, 
  TablePagination, Typography, Tooltip, IconButton, Hidden, Fab, ListItemIcon, ListItemText } from "@material-ui/core";
import { MuiPickersUtilsProvider, KeyboardDateTimePicker } from "@material-ui/pickers";
import { withStyles } from "@material-ui/core/styles";
import SpeedDial from '@material-ui/lab/SpeedDial';
import SettingsIcon from '@material-ui/icons/Settings';
import SpeedDialAction from '@material-ui/lab/SpeedDialAction';
import AddIcon from "@material-ui/icons/Add";
import FiberManualRecordIcon from "@material-ui/icons/FiberManualRecord";
import MuiAlert from "@material-ui/lab/Alert";
import VisibilityIcon from '@material-ui/icons/Visibility';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';
import LinkIcon from '@material-ui/icons/Link';
import CancelIcon from '@material-ui/icons/Cancel';
import SendIcon from '@material-ui/icons/Send';
import { RadioButtonChecked, CheckBox, TextFormat, Subject, Assignment, Send } from '@material-ui/icons';

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
  addQuestionButton: {
    boxShadow: theme.shadows[2],
    margin: "16px",
    color: "white",
    "&:focus, &:hover": {
      backgroundColor: "white",
    },
  },
  RadioQst: {
    backgroundColor: "#02AFF8",
    "&:focus, &:hover": {
      color: "#02AFF8"
    },
  },
  CheckboxQst: {
    backgroundColor: "#049F90",
    "&:focus, &:hover": {
      color: "#049F90"
    },
  },
  ShorttextQst: {
    backgroundColor: "#FD7D2E",
    "&:focus, &:hover": {
      color: "#FD7D2E"
    },
  },
  LongtextQst: {
    backgroundColor: "#B2417C",
    "&:focus, &:hover": {
      color: "#B2417C"
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
    backgroundColor: theme.palette.success.main,
    color: "white",
    "&:focus, &:hover": {
      backgroundColor: "white",
      color: theme.palette.success.main,
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
  settingsButton: {
    backgroundColor: "grey",
    color: "white",
    "&:focus, &:hover": {
      backgroundColor: "#333333",
      color: "white",
    },
    marginInlineEnd: "2em"
  },
  menuVisible: {
    "& .MuiListItemIcon-root" : {
      color: theme.palette.warning.main
    },
    "&:hover, &:focus": {
      backgroundColor: theme.palette.warning.main,
      "& .MuiListItemIcon-root, & .MuiListItemText-primary": {
        color: "white",
      },
    },
  },
  menuCancel: {
    "& .MuiListItemIcon-root" : {
      color: theme.palette.error.main
    },
    "&:hover, &:focus": {
      backgroundColor: theme.palette.error.main,
      "& .MuiListItemIcon-root, & .MuiListItemText-primary": {
        color: "white",
      },
    },
  },
  menuSubmit: {
    "& .MuiListItemIcon-root" : {
      color: theme.palette.success.main
    },
    "&:hover, &:focus": {
      backgroundColor: theme.palette.success.main,
      "& .MuiListItemIcon-root, & .MuiListItemText-primary": {
        color: "white",
      },
    },
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
        answer: ["A"],
        lampiran: [],
        type: "radio"
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
      posted: false,
      type: "",
      snackbarOpen: false,
      snackbarMessage: "",
      anchorEl: null,
      checkboxSnackbarOpen: false,
      radioSnackbarOpen: false,
    }
  }

  // ref itu untuk ngerefer html yang ada di render.
  imageUploader = React.createRef(null) // untuk ngerefer html object yang lain

  componentWillUnmount(){
    console.log(this.state.subject)
    this.props.clearErrors()
    this.props.handleSideDrawerExist(true)
  }

  handleCloseErrorSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    this.setState({snackbarOpen: false});
  }

  handleOpenErrorSnackbar = (message) => {
    this.setState({ snackbarOpen: true, snackbarMessage: message});
  }

  handleCloseInvalidQstSnackbar = () => {
    this.setState({ invalidQstOpen: false });
  }

  handleOpenInvalidQstSnackbar = (message) => {
    this.setState({ invalidQstOpen: true, invalidQstMessage: message });
  }

  handleOpenCheckboxErrorSnackBar = () => {
    this.setState({ checkboxSnackbarOpen: true });
  }

  handleCloseCheckboxErrorSnackBar = () => {
    this.setState({ checkboxSnackbarOpen: false });
  }

  handleOpenRadioErrorSnackBar = () => {
    this.setState({ radioSnackbarOpen: true });
  }

  handleCloseRadioErrorSnackBar = () => {
    this.setState({ radioSnackbarOpen: false });
  }

  formatQstNumber = (numberIndexArray) => {
    let qstNumbers = "";
    if (numberIndexArray.length === 1) {
      qstNumbers += (numberIndexArray[0] + 1);
    } else if (numberIndexArray.length === 2) {
      qstNumbers += ((numberIndexArray[0] + 1) + " dan " + (numberIndexArray[1] + 1));
    } else {
      numberIndexArray.forEach((val, idx) => {
        if (idx === numberIndexArray.length - 2) {
          qstNumbers += ((val + 1) + ", dan ");
        } else if (idx === numberIndexArray.length - 1) {
          qstNumbers += (val + 1);
        } else {
          qstNumbers += ((val + 1) + ", ");
        }
      });
    }
    return qstNumbers;
  }

  onSubmit = (e, id) => {
    e.preventDefault()
    let formData = new FormData();
    let invalidQuestionIndex = [];

    const { questions } = this.state;
    const { createAssessment , history} = this.props

    if (this.state.posted) {
      for(var i = 0; i < questions.length; i++){
        let qns = questions[i];
        if (!qns.name) {
          invalidQuestionIndex.push(i);
        } else {
          if (qns.type === "shorttext") {
            if (qns.answer.length === 0) {
              invalidQuestionIndex.push(i);
            } else {
              if (qns.answer.includes("")) {
                invalidQuestionIndex.push(i);
              }
            }
          } else if ((qns.type === "radio") || (qns.type === "checkbox")) {
            if (qns.options.includes("")) {
              invalidQuestionIndex.push(i);
            }
          }
        }
      }
    }
    
    if (invalidQuestionIndex.length === 0) {
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
        posted: this.state.posted,
        type: this.state.type
      }

      createAssessment(formData, assessmentData, history)
        .then(res => {
          console.log("Assessment is created successfully")
        })
        .catch(err => this.handleOpenErrorSnackbar(`Keterangan ${this.state.type} masih kosong!`))
    }
    else{
      this.handleOpenInvalidQstSnackbar(`Soal nomor ${this.formatQstNumber(invalidQuestionIndex)} masih belum lengkap!`);
    }
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

  handleClickMenuTambah = (event) => {
    this.setState({anchorEl: event.currentTarget}); 
  };

  handleCloseMenuTambah = (option) => {
    this.setState({ anchorEl: null });
    this.setState({ currentQuestionOption: option })
    // console.log(option)
    // console.log(this.state.currentQuestionOption)
    this.handleAddQuestion(option);
  };

  handleAddQuestion = (option) => {
    console.log("Add questionnnn")
    // let questions = this.state.questions
    // questions.push({name: "", options: ["Opsi 1", ""], answer: "A"})
    // this.setState({questions: questions})

    let questions = this.state.questions;
    if(option === "radio"){
      questions.push({
        name: "",
        options: ["Opsi 1", ""],
        answer: ["A"],
        lampiran: [],
        type: option
      })
    }
    else if(option === "checkbox"){
      questions.push({
        name: "",
        options: ["Opsi 1", ""],
        answer: ["A"],
        lampiran: [],
        type: option
      })
    }
    else if(option === "shorttext"){
      questions.push({
        name: "",
        options: null,
        answer: [],
        lampiran: [],
        type: option
      })
    }
    else if(option === "longtext"){
      questions.push({
        name: "",
        options: null,
        answer: null,
        lampiran: [],
        type: option
      })
    }
    this.setState({ questions: questions })
    this.setState({ currentQuestionOption: null })
  }

  handleChangeQuestion = (e, i, name=null, otherfield=null, type=null) => {
    var questions = this.state.questions;

    if(otherfield === "answer"){
      if(type === "radio"){
        questions[i]["answer"] = [e.target.value]
      }
      else if(type === "checkbox"){
        if(typeof questions[i]["answer"] === "string"){
          questions[i]["answer"] = []
        }
        if(!e.target.checked || questions[i]["answer"].includes(e.target.value)){
          if(questions[i]["answer"].length === 1){
            this.handleOpenCheckboxErrorSnackBar()
          }
          else{
            questions[i]["answer"] = questions[i]["answer"].filter(function(value,index){
              return value != e.target.value
            })
          }
        }
        else if(e.target.checked && !questions[i]["answer"].includes(e.target.value)){
          questions[i]["answer"].push(e.target.value)
        }
      }
    }else {
      questions[i][e.target.id] = (name ? name : e.target.value);
    }
    this.setState({ questions: questions})
  }

  // -untuk tipe soal shorttext, agar string soal tidak ditraversal secara menyeluruh (untuk mencari 
  // kunci jawaban) setiap kali guru mengetik huruf, string soal akan disimpan sebagai ref di komponen soal tersebut.
  // string ini baru akan diproses hanya ketika guru mengklik elemen lain selain textfield tersebut.
  parseAnswer = (txtFieldVal, qstIndex) => {
    let qst = this.state.questions;
    let splitResult = txtFieldVal.split("`"); // length hasil split ini pasti >= 1
    if ((splitResult.length !== 1) && (splitResult.length % 2 !== 0)) {
      let answerArray = [];
      for (let i=1; i<=splitResult.length-2; i+=2) {
        answerArray.push(splitResult[i]);
      }
      qst[qstIndex]["answer"] = answerArray;
    } else {
      qst[qstIndex]["answer"] = [];
    }
    this.setState({questions: qst})
  }

  handleQuestionOptions = (e, optionIndex, qnsIndex, action) => {
    // console.log(optionIndex)
    // console.log(qnsIndex)
    let questions = this.state.questions
    if(action === "Delete"){
      if(questions[qnsIndex].type === "checkbox"){
        if(questions[qnsIndex].answer.length === 1){
          let i = 0
          let found = false
          while(i<questions[qnsIndex].answer.length && !found){
            if(questions[qnsIndex].answer[i].charCodeAt(0)-65 === optionIndex){
              found = true
            }
            i = i + 1
          }
          if(found){
            questions[qnsIndex].answer[0] = "A"
          }
        }
         // mencegah adanya soal radio yang tidak memiliki opsi 
        if (questions[qnsIndex].options.length === 1) { 
          questions[qnsIndex].options[0] = ""
          this.handleOpenCheckboxErrorSnackBar()
        } else {
          questions[qnsIndex].answer = questions[qnsIndex].answer.filter((value) => {
            if(value.charCodeAt(0)-65 !== optionIndex){
              return value
            }
          })
          questions[qnsIndex].options.splice(optionIndex, 1)
        }
      }
      else{
        if (questions[qnsIndex].options.length === 1) { 
          questions[qnsIndex].options[0] = ""
          this.handleOpenRadioErrorSnackBar()
        } else {
          questions[qnsIndex].options.splice(optionIndex, 1)
        }
      }
    }else if(action === "Add"){
      questions[qnsIndex].options.push("")
    }else if(action === "Edit"){
      questions[qnsIndex].options[optionIndex] = e.target.value
    }else{
      console.log("No action is specified")
    }
    // console.log(questions)
    this.setState({ questions: questions})
  }

  handleDuplicateQuestion = (i) => {
    console.log(i)
    let questions = this.state.questions
    // kalau masukkin question langsung gitu, somehow dia akan ikut berubah kalo yang duplicated yg lain berubah nilainya.
    // Mungkin karena kalau assign question langsung itu object jadi sama persis? kalau aku destructure masing" lalu buat new object, jadi beda beda?
    // questions.splice(i+1, 0, question)

    if (questions[i].type === "shorttext") {
      questions.splice(i+1, 0, {
        name: questions[i].name,
        options: null,
        answer: [...questions[i].answer],
        lampiran: [...questions[i].lampiran],
        type: questions[i].type
      })
    } else if (questions[i].type === "longtext") {
      questions.splice(i+1, 0, {
        name: questions[i].name,
        options: null,
        answer: null,
        lampiran: [...questions[i].lampiran],
        type: questions[i].type
      })
    } else {
      questions.splice(i+1, 0, {
        name: questions[i].name,
        options: [...questions[i].options],
        answer: questions[i].answer,
        lampiran: [...questions[i].lampiran],
        type: questions[i].type
      })
    }
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
    
    // let answerListArray = []
    // this.state.questions.forEach(function(value,index){
    //   answerListArray.push(value.answer)
    // })


    let questionList = questions.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((question, i) => {
      
      // Fitur 2 -- Untuk Memastikan Bahwa Checkbox yang tercentang (ditampilkan ke layar) sinkron dengan value "answer" yang tersimpan
      let booleanArray = [];
      if (question.type === "checkbox") {
        let tempArray = [];
        if(typeof question.answer === "object"){
          question.answer.forEach(function(value,index){
            tempArray.push(Number(value.charCodeAt(0))-65)           
          })
        }
        // console.log(tempArray)
        for(let j=0;j<this.state.questions[i].options.length;j++){
          if(tempArray.includes(j)){
            booleanArray[j] = true;
          }
          else{
            booleanArray[j] = false;
          }
        }
        // console.log(booleanArray)
      }
      // console.log(booleanArray)

      return(
        <QuestionItem
          isEdit={false}
          index={i + page * rowsPerPage}
          name={question.name}
          options={JSON.stringify(question.options)}
          answer={question.answer}
          lampiran={question.lampiran}
          lampiran_length={question.lampiran.length}
          lampiranToAdd={[]} // dipakai untuk edit assessment, jadi pass array kosong aja.
          currentLampiran={[]} // dipakai untuk edit assessment, jadi pass array kosong aja.
          deleteQuestion={this.deleteQuestion}
          handleDuplicateQuestion={this.handleDuplicateQuestion}
          handleQuestionOptions={this.handleQuestionOptions}
          handleChangeQuestion={this.handleChangeQuestion}
          handleQuestionImage={this.handleQuestionImage}
          parseAnswer={this.parseAnswer}
          type={question.type}
          check_data={booleanArray}
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

  handleMenuOpen = (event) => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleMenuClose = () => {
    this.setState({ anchorEl: null });
  };

  submitForm = () => {
    document.getElementById("submitForm").submit();
  }

  render() {
    console.log(this.state.questions)
    const { class_assigned } = this.state;
    const { classes, errors, success } = this.props;
    const { all_classes } = this.props.classesCollection;
    const { all_subjects } = this.props.subjectsCollection;
    const { user } = this.props.auth;
    const actions = [
      { icon: <VisibilityIcon />, name: 'Tampilkan Ke Murid' },
      { icon: <LinkIcon />, name: 'Copy Ke Clipboard' },
      { icon: <CancelIcon />, name: 'Batal' },
      { icon: <SendIcon />, name: 'Buat Kuis/Ujian' },
    ];

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
        borderRadius: 24 / 2,
        border: `1px solid ${theme.palette.grey[400]}`,
        backgroundColor: theme.palette.grey[50],
        opacity: 1,
        transition: theme.transitions.create(["background-color", "border"]),
      },
      checked: {},
    }))(Switch);

    const ToggleViewQuizMobile = withStyles((theme) => ({
      root: {
        width: 0,
        height: 0,
        padding: 0,
        margin: theme.spacing(1),
      },
      checked: {},
    }))(Switch);

    document.title = "Schooly | Buat Kuis/Ujian";

    console.log(this.state.questions)

    return (
      <div className={classes.root}>
        <Snackbar open={this.state.checkboxSnackbarOpen} autoHideDuration={6000} onClose={this.handleCloseCheckboxErrorSnackBar}>
          <MuiAlert onClose={this.handleCloseCheckboxErrorSnackBar} severity="error">
            Soal Dalam Bentuk Checkbox Minimal Memiliki Satu Jawaban.
          </MuiAlert>
        </Snackbar>
        <Snackbar open={this.state.radioSnackbarOpen} autoHideDuration={6000} onClose={this.handleCloseRadioErrorSnackBar}>
          <MuiAlert onClose={this.handleCloseRadioErrorSnackBar} severity="error">
            Soal Dalam Bentuk Pilihan Ganda Minimal Memiliki Satu Jawaban.
          </MuiAlert>
        </Snackbar>
        {/* Ini Delete Dialog yang untuk cancel action saja, blm ada di DB*/}
        <DeleteDialog
          openDeleteDialog={this.state.openDeleteDialog}
          handleCloseDeleteDialog={this.handleCloseDeleteDialog}
          itemType="Kuis"
          deleteItem=""
          itemName={this.state.name}
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
        <form onSubmit={(e) => this.onSubmit(e, user._id)} id="submitForm">
          <Grid container direction="column" spacing={3}>
            <Grid item>
              <Paper>
                <div className={classes.content}>
                  <Typography variant="h5" gutterBottom>
                    <b>Buat Kuis/Ujian</b>
                  </Typography>
                  <Typography color="textSecondary">
                    Tambahkan keterangan kuis untuk membuat kuis/ujian.
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
                      <Grid item>
                        <Typography component="label" for="class_assigned" color="primary">
                          Tipe Penilaian
                        </Typography>
                        <FormControl id="role" variant="outlined" color="primary" fullWidth error={Boolean(errors.type)}>
                          <Select
                            value={this.state.type}
                            onChange={(event) => {this.onChange(event, "type")}}
                            >
                            <MenuItem value="Kuis">Kuis</MenuItem>
                            <MenuItem value="Ujian">Ujian</MenuItem>
                          </Select>
                          <FormHelperText>
                            {Boolean(errors.type) ? errors.type : null}
                          </FormHelperText>
                        </FormControl>
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
              <Grid item>
                <Tooltip title="Tambah soal pilihan ganda (dengan satu pilihan)">
                  <IconButton className={`${classes.addQuestionButton} ${classes.RadioQst}`} onClick={() => this.handleCloseMenuTambah("radio")}>
                    <RadioButtonChecked />
                  </IconButton>
                </Tooltip>
              </Grid>
              <Grid item>
                <Tooltip title="Tambah soal pilihan ganda (dengan banyak pilihan)">
                  <IconButton className={`${classes.addQuestionButton} ${classes.CheckboxQst}`} onClick={() => this.handleCloseMenuTambah("checkbox")}>
                    <CheckBox />
                  </IconButton>
                </Tooltip>
              </Grid>
              <Grid item>
                <Tooltip title="Tambah soal isian pendek">
                  <IconButton className={`${classes.addQuestionButton} ${classes.ShorttextQst}`} onClick={() => this.handleCloseMenuTambah("shorttext")}>
                    <TextFormat />
                  </IconButton>
                </Tooltip>
              </Grid>
              <Grid item>
                <Tooltip title="Tambah soal uraian">
                  <IconButton className={`${classes.addQuestionButton} ${classes.LongtextQst}`} onClick={() => this.handleCloseMenuTambah("longtext")}>
                    <Subject />
                  </IconButton>
                </Tooltip>
              </Grid>
            </Grid>
            <Hidden xsDown implementation="css">
              <Grid item>
                <Paper>
                  <Grid container spacing={2} justify="space-between" alignItems="center" className={classes.content}>
                    <Grid item container md={9} alignItems="center" className={classes.pageNavigator}>
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
                        <Tooltip title={!this.state.posted ? `Murid dapat melihat deskripsi ${this.state.type} (Muncul Pada Layar Murid)` : `Murid tidak dapat melihat deskripsi ${this.state.type} (Tidak Muncul Pada Layar Murid)`}>
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
                        </Tooltip>
                      </Grid>
                    </Grid>
                    <Grid item container md={3} spacing={1} className={classes.assessmentSettings}>
                      <Grid item>
                        <Button variant="contained" className={classes.cancelButton} onClick={this.handleOpenDeleteDialog}>
                          Batal
                        </Button>
                      </Grid>
                      <Grid item>
                        <Button variant="contained" type="submit" className={classes.createAssessmentButton}>
                          Buat Kuis/Ujian
                        </Button>
                      </Grid>
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>
            </Hidden>
            <Hidden smUp implementation="css">
              <Grid item>
                <Paper>
                  <Grid container spacing={2} justify="space-between" alignItems="center" className={classes.content}>
                    <Grid item container md={9} alignItems="center" className={classes.pageNavigator}>
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
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>
              <Grid container justify="flex-end" style={{marginTop: "20px"}} spacing={5}>
                <Grid item>
                  <Fab className={classes.settingsButton} onClick={(event) => this.handleMenuOpen(event)}>
                    <SettingsIcon/>
                  </Fab>
                  <Menu
                      keepMounted
                      anchorEl={this.state.anchorEl}
                      open={Boolean(this.state.anchorEl)}
                      onClose={this.handleMenuClose}
                      getContentAnchorEl={null}
                      style={{marginTop: "10px"}}
                      anchorOrigin={{
                        vertical: "top",
                        horizontal: "center",
                      }}
                      transformOrigin={{
                        vertical: "bottom",
                        horizontal: "center",
                      }}
                  >
                    <MenuItem button component="a" className={classes.menuVisible} onClick={this.handlePostToggle}>
                      <ListItemIcon >
                        {!this.state.posted ?
                          <VisibilityIcon  />
                        :
                          <VisibilityOffIcon  />
                        }
                      </ListItemIcon>
                      <ListItemText primary={!this.state.posted ? "Tampilkan ke Murid" : "Sembunyikan dari Murid"} />
                    </MenuItem>
                    {/*<MenuItem button component="a" className={classes.menuItem}>
                      <ListItemIcon>
                        <LinkIcon />
                      </ListItemIcon>
                      <ListItemText primary="Copy Clipboard" />
                      </MenuItem>*/}
                    <MenuItem button component="a" className={classes.menuCancel} onClick={this.handleOpenDeleteDialog}>
                      <ListItemIcon>
                        <CancelIcon />
                      </ListItemIcon>
                      <ListItemText primary="Batal" />
                      </MenuItem>
                    <MenuItem button type="submit" className={classes.menuSubmit} onClick={(e) => this.onSubmit(e, user._id)}>
                      <ListItemIcon>
                        <SendIcon  />
                      </ListItemIcon>
                      <ListItemText primary="Buat Kuis/Ujian" />
                    </MenuItem>
                  </Menu>
                </Grid>        
              </Grid>
            </Hidden>
          </Grid>
        </form>
        <Snackbar
          open={this.state.snackbarOpen}
          autoHideDuration={4000}
          onClose={this.handleCloseErrorSnackbar}
          anchorOrigin={{vertical : "bottom", horizontal: "center"}}
        >
          <MuiAlert elevation={6} variant="filled" onClose={this.handleCloseSnackbar} severity="error">
            {
              (Object.keys(errors).includes("questions")) ? (
                (Object.keys(errors).length === 1) ? (
                  // kasus: hanya ada error jumlah soal 0 
                  errors.questions
                ) : (
                    // kasus: ada error deskripsi dan error jumlah soal 0 
                    this.state.snackbarMessage + " " + errors.questions
                  )
              ) : (
                  // kasus: hanya ada error deskripsi 
                  this.state.snackbarMessage
                )
            }
          </MuiAlert>
        </Snackbar>
        <Snackbar
          open={this.state.invalidQstOpen}
          autoHideDuration={4000}
          onClose={this.handleCloseInvalidQstSnackbar}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <MuiAlert elevation={6} variant="filled" onClose={this.handleCloseInvalidQstSnackbar} severity="error">
            {this.state.invalidQstMessage}
          </MuiAlert>
        </Snackbar>
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
