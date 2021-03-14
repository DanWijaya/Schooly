import React, { Component } from "react";
import { connect } from "react-redux";
import DateFnsUtils from "@date-io/date-fns";
import PropTypes from "prop-types";
import lokal from "date-fns/locale/id";
import "date-fns";
import {
  getOneAssessment,
  updateAssessment,
} from "../../../actions/AssessmentActions";
import { getAllClass } from "../../../actions/ClassActions";
import { getAllSubjects } from "../../../actions/SubjectActions";
import { clearErrors } from "../../../actions/ErrorActions";
import DeleteDialog from "../../misc/dialog/DeleteDialog";
import UploadDialog from "../../misc/dialog/UploadDialog";
import LightTooltip from "../../misc/light-tooltip/LightTooltip";
import QuestionItem from "./QuestionItem";
import {
  Button,
  Chip,
  Divider,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Grid,
  MenuItem,
  IconButton,
  Paper,
  Select,
  Snackbar,
  Switch,
  TextField,
  TablePagination,
  Typography,
  Hidden,
  Fab,
  ListItemIcon,
  ListItemText,
  Menu,
} from "@material-ui/core";
import {
  MuiPickersUtilsProvider,
  KeyboardDateTimePicker,
} from "@material-ui/pickers";
import { withStyles } from "@material-ui/core/styles";
import SettingsIcon from "@material-ui/icons/Settings";
import VisibilityIcon from "@material-ui/icons/Visibility";
import VisibilityOffIcon from "@material-ui/icons/VisibilityOff";
import LinkIcon from "@material-ui/icons/Link";
import CancelIcon from "@material-ui/icons/Cancel";
import SendIcon from "@material-ui/icons/Send";
import FiberManualRecordIcon from "@material-ui/icons/FiberManualRecord";
import MuiAlert from "@material-ui/lab/Alert";
import {
  RadioButtonChecked,
  CheckBox,
  TextFormat,
  Subject,
} from "@material-ui/icons";
import InfoIcon from "@material-ui/icons/Info";

const styles = (theme) => ({
  root: {
    margin: "auto",
    maxWidth: "80%",
    [theme.breakpoints.down("md")]: {
        maxWidth: "100%",
    },
    padding: "10px",
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
    backgroundColor: theme.palette.radio.main,
    "&:focus, &:hover": {
      color: theme.palette.radio.main,
    },
  },
  CheckboxQst: {
    backgroundColor: theme.palette.checkbox.main,
    "&:focus, &:hover": {
      color: theme.palette.checkbox.main,
    },
  },
  ShorttextQst: {
    backgroundColor: theme.palette.shorttext.main,
    "&:focus, &:hover": {
      color: theme.palette.shorttext.main,
    },
  },
  LongtextQst: {
    backgroundColor: theme.palette.longtext.main,
    "&:focus, &:hover": {
      color: theme.palette.longtext.main,
    },
  },
  content: {
    padding: "20px 20px 30px 20px",
  },
  pageNavigatorContent: {
    padding: "20px 20px 30px",
    [theme.breakpoints.down("xs")]: {
      padding: "20px 10px 30px",
    }
  },
  settingsButton: {
    // backgroundColor: "white",
    // color: theme.palette.text.secondary,
    // "&:focus, &:hover": {
    //   backgroundColor: theme.palette.text.secondary,
    //   color: "white",
    // },
    [theme.breakpoints.down("xs")]: {
      paddingRight: "0", 
      paddingLeft: "0"
    }
  },
  divider: {
    [theme.breakpoints.down("md")]: {
      width: "100%",
      height: "1px",
    },
  },
  pageNavigator: {
    justifyContent: "flex-start",
    [theme.breakpoints.down("sm")]: {
      justifyContent: "center",
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
  copyToClipboardButton: {
    marginLeft: "24px",
    color: theme.palette.copylink.main,
    // color: theme.palette.primary.main,
  },
  assessmentSettings: {
    justifyContent: "flex-end",
    alignItems: "center",
    [theme.breakpoints.down("md")]: {
      justifyContent: "center",
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
  // settingsButton: {
  //   backgroundColor: "grey",
  //   color: "white",
  //   "&:focus, &:hover": {
  //     backgroundColor: "#555555",
  //     color: "white",
  //   },
  //   marginInlineEnd: "2em",
  // },
  menuVisible: {
    "& .MuiListItemIcon-root": {
      color: theme.palette.warning.main,
    },
    "&:hover, &:focus": {
      backgroundColor: theme.palette.warning.main,
      "& .MuiListItemIcon-root, & .MuiListItemText-primary": {
        color: "white",
      },
    },
  },
  menuCopy: {
    "& .MuiListItemIcon-root": {
      // color: theme.palette.primary.main
      color: theme.palette.copylink.main,
    },
    "&:hover, &:focus": {
      // backgroundColor: theme.palette.primary.main,
      backgroundColor: theme.palette.copylink.main,
      "& .MuiListItemIcon-root, & .MuiListItemText-primary": {
        color: "white",
      },
    },
  },
  menuCancel: {
    "& .MuiListItemIcon-root": {
      color: theme.palette.error.main,
    },
    "&:hover, &:focus": {
      backgroundColor: theme.palette.error.main,
      "& .MuiListItemIcon-root, & .MuiListItemText-primary": {
        color: "white",
      },
    },
  },
  menuSubmit: {
    "& .MuiListItemIcon-root": {
      color: theme.palette.success.main,
    },
    "&:hover, &:focus": {
      backgroundColor: theme.palette.success.main,
      "& .MuiListItemIcon-root, & .MuiListItemText-primary": {
        color: "white",
      },
    },
  },
  customMargin: {
    margin: "24px 0",
    [theme.breakpoints.down("xs")]: {
      margin: "18px 0",
    },
  },
});

class EditAssessment extends Component {
  constructor() {
    super();
    this.state = {
      num_qns: 1,
      // questions: [<QuestionItem number={1} deleteQuestion={this.deleteQuestion}/>],
      questions: [
        {
          // mau ganti questions ini dalam Hashmap mungkin.
          name: "",
          options: ["Opsi 1", ""],
          answer: ["A"],
          lampiran: [],
          type: "radio",
        },
      ],
      lampiranToDelete: [],
      name: "",
      description: "",
      subject: "",
      class_assigned: [],
      start_date: new Date(),
      end_date: new Date(),
      openDeleteDialog: false,
      openUploadDialog: false,
      posted: null,
      success: false,
      page: 0,
      rowsPerPage: 10,
      qnsListitem: [],
      type: "",
      snackbarOpen: false,
      snackbarMessage: "",
      anchorEl: null,
      checkboxSnackbarOpen: false,
      radioSnackbarOpen: false,
      copySnackbarOpen: false,
      weights: {
        radio: undefined,
        checkbox: undefined,
        shorttext: undefined,
      }, // weight radio, checkbox, shorttext akan diset null ketika masih bernilai undefined saat tombol create assessment ditekan 
      longtextWeight: [null],
      // array longtextWeight akan memiliki elemen sebanyak pertanyaan di assessment
      // longtextWeight[0] = 10 -> berarti pertanyaan nomor 1 adalah soal uraian dan memiliki bobot 10
      // longtextWeight[1] = -1 -> berarti pertanyaan nomor 2 adalah soal non uraian
      // longtextWeight[2] = undefined -> berarti pertanyaan nomor 3 adalah soal uraian yang bobotnya belum diubah
      // sejak pertama kali soal tersebut ditambahkan
      // longtextWeight[2] = null -> berarti bobot soal uraian ini masih undefined saat tombol create assessment ditekan 
      backtickErrors: [],
      // array backtickErrors akan memiliki elemen sebanyak pertanyaan di assessment
      // backtickErrors[0] = false -> berarti pertanyaan nomor 1 sudah valid
      // backtickErrors[1] = true -> berarti terdapat jawaban kosong (``) atau jumlah backtick ganjil pada pertanyaan nomor 2  
      // backtickErrors[2] = -1 -> berarti pertanyaan nomor 2 adalah soal non isian. Nilai "-1" dapat diabaikan, ini dapat diganti dengan nilai lain selain true false
      renderbtErrors: false, // abaikan nilainya, ini hanya dipakai agar QuestionItem dirender ulang saat submit dan ada soal yang dihapus
      ready: false,
    };
  }

  imageUploader = React.createRef(null) // untuk ngerefer html object yang lain

  componentDidMount(){
    window.scrollTo(0, 0);
    const { getOneAssessment, getAllClass, getAllSubjects, handleSideDrawerExist} = this.props;
    handleSideDrawerExist(false)
    getAllClass()
    getOneAssessment(this.props.match.params.id)
    getAllSubjects()
  }

  componentWillUnmount() {
    this.props.clearErrors();
    this.props.handleSideDrawerExist(true);
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { selectedAssessments } = nextProps.assessmentsCollection;

    if (!nextProps.errors) {
      this.handleOpenUploadDialog();
    }
    if (Boolean(selectedAssessments) && nextProps.errors) {
      if (Object.keys(selectedAssessments).length !== 0) {
        let weights = {
          radio: selectedAssessments.question_weight.radio,
          checkbox: selectedAssessments.question_weight.checkbox,
          shorttext: selectedAssessments.question_weight.shorttext,
        };

        let longtextWeight = [];
        for (let i = 0; i <= selectedAssessments.questions.length - 1; i++) {
          longtextWeight.push(null);
        }

        if (selectedAssessments.question_weight.longtext) {
          for (let [key, value] of Object.entries(
            selectedAssessments.question_weight.longtext
          )) {
            longtextWeight[key] = value;
          }
        }

        this.setState({
          name: selectedAssessments.name,
          subject: selectedAssessments.subject,
          deadline: selectedAssessments.deadline,
          start_date: selectedAssessments.start_date,
          end_date: selectedAssessments.end_date,
          questions: Array.isArray(selectedAssessments.questions)
            ? selectedAssessments.questions
            : [],
          description: selectedAssessments.description,
          class_assigned: Boolean(selectedAssessments.class_assigned)
            ? selectedAssessments.class_assigned
            : [],
          posted: selectedAssessments.posted,
          type: selectedAssessments.type,
          weights: weights,
          longtextWeight: longtextWeight,
          ready: true,
          // fileLampiran must made like above soalnya because maybe selectedMaterials is still a plain object.
          // so need to check if selectedMaterials is undefined or not because when calling fileLAmpiran.length, there will be an error.
        });
      }
    }
  }

  handleCloseErrorSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    this.setState({ snackbarOpen: false });
  };

  handleOpenErrorSnackbar = () => {
    this.setState({ snackbarOpen: true });
  };

  handleOpenCheckboxErrorSnackBar = () => {
    this.setState({ checkboxSnackbarOpen: true });
  };

  handleCloseCheckboxErrorSnackBar = () => {
    this.setState({ checkboxSnackbarOpen: false });
  };

  handleOpenRadioErrorSnackBar = () => {
    this.setState({ radioSnackbarOpen: true });
  };

  handleCloseRadioErrorSnackBar = () => {
    this.setState({ radioSnackbarOpen: false });
  };

  handleOpenCopySnackBar = () => {
    this.setState({ copySnackbarOpen: true });
  };

  handleCloseCopySnackBar = () => {
    this.setState({ copySnackbarOpen: false });
  };

  onSubmit = (e) => {
    e.preventDefault();
    let formData = new FormData();
    let invalidQuestionIndex = [];
    let completeWeight = true;
    let newBtErrors = [];

    const { questions, lampiranToDelete } = this.state;
    const { updateAssessment, history } = this.props;

    // mencatat jumlah soal untuk tiap jenis soal
    let typeCount = {
      radio: 0,
      checkbox: 0,
      shorttext: 0,
      longtext: 0,
    };
    for (let question of this.state.questions) {
      typeCount[question.type]++;
    }

    if (this.state.posted) {
      // pengecekan isi soal
      for (var i = 0; i < questions.length; i++) {
        let qns = questions[i];
        if (!qns.name) {
          invalidQuestionIndex.push(i);
        } else {
          if (qns.type === "shorttext") {
            if (qns.answer.length === 0) {
              invalidQuestionIndex.push(i);
              newBtErrors[i] = true;
            } else {
              if (qns.answer.includes("")) {
                invalidQuestionIndex.push(i);
                newBtErrors[i] = true;
              } else {
                newBtErrors[i] = false;
              }
            }
          } else if (qns.type === "radio" || qns.type === "checkbox") {
            if (qns.options.includes("")) {
              invalidQuestionIndex.push(i);
            }
          }
        }
      }
      this.setState({ backtickErrors: newBtErrors, renderbtErrors: !this.state.renderbtErrors });

      // pengecekan bobot
      let filteredtypeCount = Object.entries(typeCount).filter(
        (pair) => pair[1] > 0
      );
      if (filteredtypeCount.length !== 0) {
        let newWeights = {...this.state.weights};
        let newLongtextWeight = [...this.state.longtextWeight];

        for (let pair of filteredtypeCount) {
          let type = pair[0];

          if (type === "longtext") {
            // menghapus elemen bobot soal non uraian pada array bobot soal uraian
            let longtextCount = this.state.longtextWeight.filter((value) => (value !== -1));

            for (let i = 0; i <= longtextCount.length; i++) {
              let weight = longtextCount[i];

              // agar error di textfield bobot muncul ketika textfield masih kosong saat create assessment
              if (weight === undefined) {
                newLongtextWeight[i] = null;
              }

              // agar data assessment tidak disubmit ketika ada bobot yang tidak valid
              if (isNaN(Number(weight)) || Number(weight) <= 0) {
                completeWeight = false;
              }
            }
          } else {
            // agar error di textfield bobot muncul ketika textfield masih kosong saat create assessment
            if (this.state.weights[type] === undefined) {
              newWeights[type] = null;
            }

            // agar data assessment tidak disubmit ketika ada bobot yang tidak valid
            if (
              isNaN(Number(this.state.weights[type])) ||
              Number(this.state.weights[type]) <= 0
            ) {
              completeWeight = false;
            }
          }
        }
        // agar error di textfield bobot muncul ketika textfield masih kosong saat create assessment
        this.setState({ weights: newWeights, longtextWeight: newLongtextWeight });
      } else {
        completeWeight = false;
      }
    }

    // jika soal dan bobot sudah lengkap dan benar, submit
    if (invalidQuestionIndex.length === 0 && completeWeight) {
      let longtext;
      if (typeCount.longtext === 0) {
        longtext = null;
      } else {
        // mengonversi bobot soal uraian dari string menjadi bilangan
        longtext = {};
        this.state.longtextWeight.forEach((val, idx) => {
          if (val !== null) {
            longtext[idx] = Number(val);
          }
        });
      }
      let question_weight = {
        radio: typeCount.radio === 0 ? null : Number(this.state.weights.radio),
        checkbox: typeCount.checkbox === 0 ? null : Number(this.state.weights.checkbox),
        shorttext:
          typeCount.shorttext === 0 ? null : Number(this.state.weights.shorttext),
        longtext: longtext,
      };

      questions.forEach((qns) => {
        let lampiran = qns.lampiran.filter((x) => typeof x !== "string");
        lampiran.forEach((img, i) =>
          formData.append(`lampiran_assessment`, img)
        );
      });

      const assessmentData = {
        name: this.state.name,
        start_date: this.state.start_date,
        end_date: this.state.end_date,
        subject: this.state.subject,
        class_assigned: this.state.class_assigned,
        description: this.state.description,
        questions: this.state.questions,
        posted: this.state.posted,
        type: this.state.type,
        question_weight: question_weight,
      };
      const assessmentId = this.props.match.params.id;
      console.log(assessmentData);

      updateAssessment(
        formData,
        assessmentData,
        assessmentId,
        lampiranToDelete,
        history
      )
        .then((res) => {
          console.log("Assessment is updated successfully");
        })
        .catch(() => this.handleOpenErrorSnackbar());
    } else {
      this.handleOpenErrorSnackbar();
    }
  };

  handleOpenUploadDialog = () => {
    this.setState({ openUploadDialog: true });
  };

  handleOpenDeleteDialog = () => {
    this.setState({ openDeleteDialog: true });
  };

  handleCloseDeleteDialog = () => {
    this.setState({ openDeleteDialog: false });
  };

  onChange = (e, otherfield = null) => {
    if (otherfield) {
      if (otherfield === "end_date" || otherfield === "start_date") {
        this.setState({ [otherfield]: e });
      } else {
        this.setState({ [otherfield]: e.target.value });
      }
    } else {
      this.setState({ [e.target.id]: e.target.value });
    }
  };

  onDateChange = (date) => {
    this.setState({ end_date: date });
  };

  handleClickMenuTambah = (event) => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleCloseMenuTambah = (option) => {
    this.setState({ anchorEl: null });
    this.setState({ currentQuestionOption: option });
    // console.log(option)
    // console.log(this.state.currentQuestionOption)
    this.handleAddQuestion(option);
  };

  handleAddQuestion = (option) => {
    console.log("Add questionnnn");

    let questions = this.state.questions;
    if (option === "radio") {
      questions.push({
        name: "",
        options: ["Opsi 1", ""],
        answer: ["A"],
        lampiran: [],
        type: option,
      });
    } else if (option === "checkbox") {
      questions.push({
        name: "",
        options: ["Opsi 1", ""],
        answer: ["A"],
        lampiran: [],
        type: option,
      });
    } else if (option === "shorttext") {
      questions.push({
        name: "",
        options: null,
        answer: [],
        lampiran: [],
        type: option,
      });
    } else if (option === "longtext") {
      questions.push({
        name: "",
        options: null,
        answer: [],
        lampiran: [],
        type: option,
      });
    }
    this.setState((state) => {
      let value = [...state.longtextWeight];
      let btErrors = [...state.backtickErrors];
      value.push(option === "longtext" ? undefined : -1);
      btErrors.push(option === "shorttext" ? false : -1);
      return { longtextWeight: value, backtickErrors: btErrors };
    });
    this.setState({ questions: questions });
    this.setState({ currentQuestionOption: null });
  };

  handleChangeQuestion = (
    e,
    i,
    name = null,
    otherfield = null,
    type = null
  ) => {
    var questions = this.state.questions;

    if (otherfield === "answer") {
      if (type === "radio") {
        questions[i]["answer"] = [e.target.value];
      } else if (type === "checkbox") {
        if (typeof questions[i]["answer"] === "string") {
          questions[i]["answer"] = [];
        }
        if (
          !e.target.checked ||
          questions[i]["answer"].includes(e.target.value)
        ) {
          if (questions[i]["answer"].length === 1) {
            this.handleOpenCheckboxErrorSnackBar();
          } else {
            questions[i]["answer"] = questions[i]["answer"].filter(function (
              value,
              index
            ) {
              return value !== e.target.value;
            });
          }
        } else if (
          e.target.checked &&
          !questions[i]["answer"].includes(e.target.value)
        ) {
          questions[i]["answer"].push(e.target.value);
        }
      } else if (type === "longtext") {
        questions[i]["answer"] = [e];
      }
    } else {
      questions[i][e.target.id] = name ? name : e.target.value;
    }

    this.setState({ questions: questions });
  };

  parseAnswer = (txtFieldVal, qstIndex) => {
    let qst = this.state.questions;
    let splitResult = txtFieldVal.split("`");
    if (splitResult.length !== 1 && splitResult.length % 2 !== 0) {
      let answerArray = [];
      for (let i = 1; i <= splitResult.length - 2; i += 2) {
        answerArray.push(splitResult[i]);
      }
      qst[qstIndex]["answer"] = answerArray;
    } else {
      qst[qstIndex]["answer"] = [];
    }
    this.setState({ questions: qst });
  };

  copyToClipboard = (e, linkToShare) => {
    let textArea = document.createElement("textarea");

    textArea.value = linkToShare;
    textArea.style.position = "fixed";
    textArea.style.top = 0;
    textArea.style.left = 0;
    textArea.style.width = "2em";
    textArea.style.height = "2em";
    textArea.style.padding = 0;
    textArea.style.border = "none";
    textArea.style.outline = "none";
    textArea.style.boxShadow = "none";
    textArea.style.background = "transparent";

    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand("copy");
    e.target.focus();
    document.body.removeChild(textArea);
    this.handleOpenCopySnackBar();
  };

  handleQuestionOptions = (e, optionIndex, qnsIndex, action) => {
    let questions = this.state.questions;
    if (action === "Delete") {
      if (questions[qnsIndex].type === "checkbox") {
        if (questions[qnsIndex].options.length === 1) {
          questions[qnsIndex].options[0] = "";
          this.handleOpenCheckboxErrorSnackBar();
        } else {
          // mencegah adanya soal pg yang tidak memiliki opsi
          if (questions[qnsIndex].answer.length === 1) {
            // jika hanya ada satu kunci jawaban (misal ["E"])
            if (
              questions[qnsIndex].answer[0].charCodeAt(0) - 65 ===
              optionIndex
            ) {
              // jika opsi yang dihapus adalah opsi kunci jawaban, set kunci jawaban ke opsi pertama
              questions[qnsIndex].answer[0] = "A";
            } else {
              //jika opsi yang dihapus bukan opsi kunci jawaban,
              if (
                questions[qnsIndex].answer[0].charCodeAt(0) - 65 >
                optionIndex
              ) {
                // nilai kunci jawaban akan dikurangi 1.
                // misal: jika opsi "C" dihapus, kunci jawaban "E" akan diubah jadi "D",
                // tapi kunci jawaban "B" tidak akan diubah jadi "A"
                questions[qnsIndex].answer[0] = String.fromCharCode(
                  97 + questions[qnsIndex].answer[0].charCodeAt(0) - 65 - 1
                ).toUpperCase();
              }
            }
          } else {
            // jika ada lebih dari satu kunci jawaban (misal ["E", "B", "Z"])
            // hapus kunci jawaban
            questions[qnsIndex].answer = questions[qnsIndex].answer.filter(
              (value) => {
                return value.charCodeAt(0) - 65 !== optionIndex;
              }
            );
            // semua nilai kunci jawaban lain akan dikurangi 1.
            // misal: jika opsi "C" dihapus, kunci jawaban "E" akan diubah jadi "D", kunci jawaban "Z" akan diubah jadi "Y",
            // tapi kunci jawaban "B" tidak diubah jadi "A"
            for (let i = 0; i < questions[qnsIndex].answer.length; i++) {
              if (
                questions[qnsIndex].answer[i].charCodeAt(0) - 65 >
                optionIndex
              ) {
                questions[qnsIndex].answer[i] = String.fromCharCode(
                  97 + questions[qnsIndex].answer[i].charCodeAt(0) - 65 - 1
                ).toUpperCase();
              }
            }
          }
          questions[qnsIndex].options.splice(optionIndex, 1);
        }
      } else {
        if (questions[qnsIndex].options.length === 1) {
          questions[qnsIndex].options[0] = "";
          this.handleOpenRadioErrorSnackBar();
        } else {
          if (
            questions[qnsIndex].answer[0].charCodeAt(0) - 65 ===
            optionIndex
          ) {
            // jika opsi yang dihapus adalah opsi kunci jawaban, set kunci jawaban ke opsi pertama
            questions[qnsIndex].answer[0] = "A";
          } else {
            //jika opsi yang dihapus bukan opsi kunci jawaban,
            if (
              questions[qnsIndex].answer[0].charCodeAt(0) - 65 >
              optionIndex
            ) {
              // nilai kunci jawaban akan dikurangi 1.
              // misal: jika opsi "C" dihapus, kunci jawaban "E" akan diubah jadi "D",
              // tapi kunci jawaban "B" tidak akan diubah jadi "A"
              questions[qnsIndex].answer[0] = String.fromCharCode(
                97 + questions[qnsIndex].answer[0].charCodeAt(0) - 65 - 1
              ).toUpperCase();
            }
          }
          questions[qnsIndex].options.splice(optionIndex, 1);
        }
      }
    } else if (action === "Add") {
      questions[qnsIndex].options.push("");
    } else if (action === "Edit") {
      questions[qnsIndex].options[optionIndex] = e.target.value;
    } else {
      console.log("No action is specified");
    }
    this.setState({ questions: questions });
  };

  handleDuplicateQuestion = (i) => {
    let questions = this.state.questions;
    // kalau masukkin question langsung gitu, somehow dia akan ikut berubah kalo yang duplicated yg lain berubah nilainya.
    // Mungkin karena kalau assign question langsung itu object jadi sama persis? kalau aku destructure masing" lalu buat new object, jadi beda beda?
    // questions.splice(i+1, 0, question)

    if (questions[i].type === "shorttext" || questions[i].type === "longtext") {
      questions.splice(i + 1, 0, {
        name: questions[i].name,
        options: null,
        answer: [...questions[i].answer],
        lampiran: [...questions[i].lampiran],
        type: questions[i].type,
      });
    }
    else {
      questions.splice(i + 1, 0, {
        name: questions[i].name,
        options: [...questions[i].options],
        answer: [...questions[i].answer],
        lampiran: [...questions[i].lampiran],
        type: questions[i].type,
      });
    }
    this.setState({ questions: questions });
    this.setState((state) => {
      let value = [...state.longtextWeight];
      let btErrors = [...state.backtickErrors];
      value.splice(i + 1, 0, state.longtextWeight[i]);
      btErrors.splice(i + 1, 0, state.backtickErrors[i]);
      return { longtextWeight: value, backtickErrors: btErrors, renderbtErrors: !this.state.renderbtErrors };
    });
  };

  deleteQuestion = (index) => {
    console.log(index);
    let questions = this.state.questions;
    questions.splice(index, 1);
    this.setState({ questions: questions });

    let newBtErrors = [];
    for (var i = 0; i < questions.length; i++) {
      let qns = questions[i];
        if (qns.type === "shorttext") {
          if (qns.answer.length === 0) {
            newBtErrors[i] = true;
          } else {
            if (qns.answer.includes("")) {
              newBtErrors[i] = true;
            } else {
              newBtErrors[i] = false;
            }
          }
        }
    }
    
    this.setState((state) => {
      let value = [...state.longtextWeight];
      value.splice(index, 1);
      return { longtextWeight: value, backtickErrors: newBtErrors, renderbtErrors: !this.state.renderbtErrors };
    });
  };

  handleQuestionImage = (e, qnsIndex, indexToDelete = null) => {
    let questions = this.state.questions;
    if (Number.isInteger(indexToDelete)) {
      let item = questions[qnsIndex].lampiran[indexToDelete];
      // delete question lampiran nya dari list
      questions[qnsIndex].lampiran.splice(indexToDelete, 1);
      // lalu setelah itu kita simpan semua lampiran di dalam list untuk mengecek.
      let all_lampiran_list = [];
      questions.forEach((qns) => {
        if (qns.lampiran.length) {
          all_lampiran_list = [...all_lampiran_list, ...qns.lampiran];
        }
      });

      // dipakai untuk handle kalau imagenya dari duplicate, tapi ada satu soal yang imagenya didelete lah.
      if (typeof item === "string") {
        let temp = this.state.lampiranToDelete;
        if (all_lampiran_list.indexOf(item) === -1) {
          // kalau ngak ada, bakal dibuang.
          temp.push(item);
        }
        this.setState({ lampiranToDelete: temp, questions: questions });
      } else {
        this.setState({ questions: questions });
      }
    } else {
      if (e.target.files) {
        const files = Array.from(e.target.files);
        let temp = questions[qnsIndex].lampiran.concat(files);
        questions[qnsIndex].lampiran = temp;
        this.setState({ questions: questions });
      }
    }
  };

  handlePostToggle = () => {
    this.setState((prevState) => ({
      posted: !prevState.posted,
    }));
  };

  handleMenuOpen = (event) => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleMenuClose = () => {
    this.setState({ anchorEl: null });
  };

  listQuestion = () => {
    let { questions } = this.state;
    const { page, rowsPerPage } = this.state;
    let questionList = [];
    questionList = questions
      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
      .map((question, i) => {
        let lampiranToAdd = question.lampiran.filter(
          (l) => typeof l !== "string"
        );
        console.log(lampiranToAdd);
        let currentLampiran = question.lampiran.filter(
          (l) => typeof l === "string"
        );

        let booleanArray = [];
        if (question.type === "checkbox") {
          let tempArray = [];
          if (typeof question.answer === "object") {
            question.answer.forEach(function (value, index) {
              tempArray.push(Number(value.charCodeAt(0)) - 65);
            });
          }
          console.log(tempArray);
          for (let j = 0; j < this.state.questions[i].options.length; j++) {
            if (tempArray.includes(j)) {
              booleanArray[j] = true;
            } else {
              booleanArray[j] = false;
            }
          }
        }

        let questionIdx = i + page * rowsPerPage;
        return (
          <QuestionItem
            isEdit={true}
            index={questionIdx}
            name={question.name}
            options={JSON.stringify(question.options)}
            answer={question.answer}
            lampiran={question.lampiran}
            lampiran_length={question.lampiran.length}
            lampiranToAdd={lampiranToAdd}
            currentLampiran={currentLampiran}
            deleteQuestion={this.deleteQuestion}
            handleDuplicateQuestion={this.handleDuplicateQuestion}
            handleQuestionOptions={this.handleQuestionOptions}
            handleChangeQuestion={this.handleChangeQuestion}
            handleQuestionImage={this.handleQuestionImage}
            parseAnswer={this.parseAnswer}
            type={question.type}
            check_data={booleanArray}
            handleLongtextWeight={this.handleLongtextWeight}
            longtextWeight={this.state.longtextWeight[questionIdx]}
            backtickError={this.state.backtickErrors[questionIdx]}
            renderbtErrors={this.state.renderbtErrors}
          />
        );
      });

    return questionList;
  };

  componentDidUpdate(prevProps, prevState) {
    if (!this.props.errors && this.props.errors !== prevProps.errors) {
      this.handleOpenUploadDialog();
    }
  }

  handleChangePage = (event, newPage) => {
    // setPage(newPage);
    this.setState({ page: newPage });
  };

  handleChangeRowsPerPage = (event) => {
    this.setState({ page: 0, rowsPerPage: +event.target.value });
  };

  handleLongtextWeight = (e, questionIdx) => {
    let value = e.target.value;
    this.setState((state) => {
      let newValue = state.longtextWeight;
      newValue[questionIdx] = value;
      return { longtextWeight: newValue };
    });
  };

  handleWeight = (e, type) => {
    // e.target entah kenapa jadi undefined pas di dalam setState
    let value = e.target.value;
    this.setState((state) => {
      return { weights: { ...state.weights, [type]: value } };
    });
  };

  weightInput = (classes) => {
    const columnTemplate = {
      radio: {
        // root: classes.RadioQst,
        text: <b>Pilihan Ganda</b>,
        icon: <RadioButtonChecked />,
      },
      checkbox: {
        // root: classes.CheckboxQst,
        text: <b>Kotak Centang</b>,
        icon: <CheckBox />,
      },
      shorttext: {
        // root: classes.ShorttextQst,
        text: <b>Isian Pendek</b>,
        icon: <TextFormat />,
      },
      longtext: {
        // root: classes.LongtextQst,
        text: <b>Uraian</b>,
        icon: <Subject />,
      },
    };

    let typeCount = {
      radio: 0,
      checkbox: 0,
      shorttext: 0,
      longtext: 0,
    };

    for (let question of this.state.questions) {
      typeCount[question.type]++;
    }

    let columnsDesktopView = [];
    let gridItemMobileView = [];
    let c = 0;
    let filteredtypeCount = Object.entries(typeCount).filter(
      (pair) => pair[1] > 0
    );

    if (filteredtypeCount.length !== 0) {
      // mobile view
      gridItemMobileView.push(
        <Typography variant="h6">Bobot Per Soal:</Typography>
      );
      gridItemMobileView.push(<Divider className={classes.customMargin} />);

      for (let pair of filteredtypeCount) {
        let type = pair[0];
        let weight = this.state.weights[type];
        let showError = (weight !==  undefined && (Number(weight) <= 0 || weight === null));

        gridItemMobileView.push(
          <Grid container>
            <Grid
              item
              style={{
                display: "flex",
                flexDirection: "column",
                marginRight: "20px",
              }}
              justify="center"
            >
              {columnTemplate[type].icon}
            </Grid>
            <Grid
              item
              style={{
                display: "flex",
                flexDirection: "column",
                flexGrow: "1",
              }}
              justify="center"
            >
              <Hidden xsDown>
                <Typography align="left">
                  {columnTemplate[type].text}
                </Typography>
              </Hidden>
              <Hidden smUp>
                <Typography align="left" style={{ fontSize: "0.8rem" }}>
                  {columnTemplate[type].text}
                </Typography>
              </Hidden>
            </Grid>
            {type !== "longtext" ? (
              <Grid
                item
                style={{
                  display: "flex",
                  flexDirection: "column",
                  height: "34px",
                }}
              >
                <Hidden xsDown>
                  <TextField
                    defaultValue={this.state.weights[type]}
                    variant="outlined"
                    key={type}
                    fullWidth
                    onChange={(e) => {
                      this.handleWeight(e, type);
                    }}
                    error={showError}
                    helperText={showError ? "Periksa Kembali!" : null}
                    FormHelperTextProps={{
                      style: {
                        margin: "0px",
                      },
                    }}
                    InputProps={{
                      style: {
                        width: "100px",
                      },
                      endAdornment: (
                        <Typography color="textSecondary">{` Poin`}</Typography>
                      ),
                    }}
                  />
                </Hidden>
                <Hidden smUp>
                  <TextField
                    defaultValue={this.state.weights[type]}
                    variant="outlined"
                    key={type}
                    fullWidth
                    onChange={(e) => {
                      this.handleWeight(e, type);
                    }}
                    error={showError}
                    helperText={showError ? "Periksa Kembali!" : null}
                    FormHelperTextProps={{
                      style: {
                        margin: "0px",
                      },
                    }}
                    InputProps={{
                      style: {
                        height: "34px",
                        width: "85px",
                      },
                      endAdornment: (
                        <Typography
                          color="textSecondary"
                          style={{ fontSize: "0.8rem" }}
                        >{` Poin`}</Typography>
                      ),
                    }}
                    inputProps={{
                      style: {
                        fontSize: "0.8rem",

                        // ini dapet dari dev console inline style elemen input pada Textfield
                        // kalau ini ga disertakan, isi input akan jadi aneh
                        borderBottom: "none",
                        boxShadow: "white 0px 0px 0px 1000px inset",
                        margin: "0px 15px",
                      },
                    }}
                  />
                </Hidden>
              </Grid>
            ) : (
              <Grid item>
                <Hidden xsDown>
                  <Grid
                    item
                    style={{ display: "flex", width: "100px", height: "42px" }}
                    justify="center"
                    alignItems="center"
                  >
                    <LightTooltip title="Bobot soal jenis uraian dapat ditentukan pada masing-masing soal">
                      <IconButton>
                        <InfoIcon />
                      </IconButton>
                    </LightTooltip>
                  </Grid>
                </Hidden>
                <Hidden smUp>
                  <Grid
                    item
                    style={{ display: "flex", width: "85px", height: "34px" }}
                    justify="center"
                    alignItems="center"
                  >
                    <LightTooltip title="Bobot soal jenis uraian dapat ditentukan pada masing-masing soal">
                      <IconButton>
                        <InfoIcon />
                      </IconButton>
                    </LightTooltip>
                  </Grid>
                </Hidden>
              </Grid>
            )}
          </Grid>
        );

        columnsDesktopView.push(
          <Grid
            container
            item
            xs={12 / filteredtypeCount.length}
            spacing="1"
            direction="column"
            justify="space-between"
            alignItems="center"
          >
            <Grid item>{columnTemplate[type].icon}</Grid>
            <Grid item>
              <Typography align="center">
                {columnTemplate[type].text}
              </Typography>
            </Grid>
            <Grid item>
              <Typography component="label" for="weight" color="primary">
                Bobot Per Soal:
              </Typography>
            </Grid>
            {type !== "longtext" ? (
              <Grid item style={{ height: "65px" }}>
                <TextField
                  defaultValue={this.state.weights[type]}
                  variant="outlined"
                  key={type}
                  fullWidth
                  onChange={(e) => {
                    this.handleWeight(e, type);
                  }}
                  error={showError}
                  helperText={showError ? "Periksa Kembali!" : null}
                  FormHelperTextProps={{
                    style: {
                      margin: "0px",
                    },
                  }}
                  InputProps={{
                    style: {
                      width: "100px",
                    },
                    endAdornment: (
                      <Typography color="textSecondary">{` Poin`}</Typography>
                    ),
                  }}
                />
              </Grid>
            ) : (
              <Grid item style={{ height: "65px" }}>
                <LightTooltip title="Bobot soal jenis uraian dapat ditentukan pada masing-masing soal">
                  <IconButton>
                    <InfoIcon />
                  </IconButton>
                </LightTooltip>
              </Grid>
            )}
          </Grid>
        );
        // jika elemen ini bukan elemen terakhir, tambahkan divider
        if (c + 1 < filteredtypeCount.length) {
          columnsDesktopView.push(<Divider orientation="vertical" flexItem />);
          gridItemMobileView.push(<Divider className={classes.customMargin} />);
        }
        c++;
      }
      return (
        <Paper>
          <Hidden smDown>
            <Grid
              container
              style={{ padding: "20px", height: "240px" }}
              justify="center"
            >
              {columnsDesktopView}
            </Grid>
          </Hidden>
          <Hidden mdUp>
            {/* {gridMobileView} */}
            <Grid
              container
              style={{ padding: "20px" }}
              wrap="nowrap"
              direction="column"
            >
              {gridItemMobileView}
            </Grid>
          </Hidden>
        </Paper>
      );
    } else {
      return null;
    }
  };

  render() {
    const { class_assigned } = this.state;
    const { classes, errors, success } = this.props;
    const { all_classes } = this.props.classesCollection;
    const { all_subjects } = this.props.subjectsCollection;

    const linkToShare =
      this.state.type === "Kuis"
        ? `http://${window.location.host}/kuis-murid/${this.props.match.params.id}`
        : `http://${window.location.host}/ujian-murid/${this.props.match.params.id}`;
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

    // const ToggleViewQuizMobile = withStyles((theme) => ({
    //   root: {
    //     width: 0,
    //     height: 0,
    //     padding: 0,
    //     margin: theme.spacing(1),
    //   },
    //   checked: {},
    // }))(Switch);

    console.log("QUESTIONS : ", this.state.questions);
    document.title = "Schooly | Sunting Kuis/Ujian";

    return (
      <div className={classes.root}>
        <DeleteDialog
          openDeleteDialog={this.state.openDeleteDialog}
          handleCloseDeleteDialog={this.handleCloseDeleteDialog}
          itemType={
            this.state.type
              ? `Perubahan ${this.state.type}`
              : "Perubahan Penilaian"
          }
          itemName={this.state.name}
          // itemType="Kuis"
          // itemName={this.state.name}
          customMessage="Hapus perubahan"
          // redirectLink="/daftar-kuis"
          redirectLink={
            this.state.type === "Kuis"
              ? `/daftar-kuis`
              : `/daftar-ujian`
          }
          // customConfirm="Ya"
          customDecline="Tidak"
          deleteItem=""
          isLink={true}
          isWarning={false}
        />
        <UploadDialog
          openUploadDialog={this.state.openUploadDialog}
          success={success}
          // messageUploading="Kuis/Ujian sedang disunting"
          messageUploading={`${this.state.type} sedang disunting`}
          // messageSuccess="Kuis/Ujian telah disunting"
          messageSuccess={`${this.state.type} telah disunting`}
          // redirectLink="/daftar-kuis"
          // redirectLink={(this.state.type === "Kuis") ? `/daftar-kuis` : `/daftar-ujian`}
          redirectLink={
            this.state.type === "Kuis"
              ? `/kuis-guru/${success}`
              : `/ujian-guru/${success}`
          }
        />
        <form onSubmit={(e) => this.onSubmit(e)}>
          <Grid container direction="column" spacing={3}>
            <Grid item>
              <Paper>
                <div className={classes.content}>
                  <Typography variant="h5" gutterBottom>
                    <b>Sunting Kuis/Ujian</b>
                  </Typography>
                  <Typography color="textSecondary">
                    Tambahkan keterangan untuk menyunting Kuis/Ujian.
                  </Typography>
                </div>
                <Divider />
                <Grid container>
                  <Grid item xs={12} md className={classes.content}>
                    <Grid container direction="column" spacing={4}>
                      <Grid item>
                        <Typography
                          component="label"
                          for="name"
                          color="primary"
                        >
                          Judul
                        </Typography>
                        <TextField
                          value={this.state.name}
                          fullWidth
                          variant="outlined"
                          id="name"
                          error={errors.name}
                          helperText={errors.name}
                          onChange={this.onChange}
                        />
                      </Grid>
                      <Grid item>
                        <Typography
                          component="label"
                          for="description"
                          color="primary"
                        >
                          Deskripsi
                        </Typography>
                        <TextField
                          value={this.state.description}
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
                        <Typography
                          component="label"
                          for="class_assigned"
                          color="primary"
                        >
                          Tipe Penilaian
                        </Typography>
                        <FormControl
                          id="role"
                          variant="outlined"
                          color="primary"
                          fullWidth
                          error={Boolean(errors.type)}
                        >
                          <Select
                            value={this.state.type}
                            onChange={(event) => {
                              this.onChange(event, "type");
                            }}
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
                  <Divider
                    flexItem
                    orientation="vertical"
                    className={classes.divider}
                  />
                  <Grid item xs={12} md className={classes.content}>
                    <Grid container direction="column" spacing={4}>
                      <Grid item container spacing={2}>
                        <Grid item xs={12} md={6}>
                          <Typography
                            component="label"
                            for="workTime"
                            color="primary"
                          >
                            Waktu Mulai Pengerjaan
                          </Typography>
                          <MuiPickersUtilsProvider
                            locale={lokal}
                            utils={DateFnsUtils}
                          >
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
                              onChange={(date) =>
                                this.onChange(date, "start_date")
                              }
                            />
                          </MuiPickersUtilsProvider>
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <Typography
                            component="label"
                            for="workTime"
                            color="primary"
                          >
                            Waktu Selesai Pengerjaan
                          </Typography>
                          <MuiPickersUtilsProvider
                            locale={lokal}
                            utils={DateFnsUtils}
                          >
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
                              minDateMessage="Batas waktu harus setelah Waktu Mulai Pengerjaan"
                              onChange={(date) =>
                                this.onChange(date, "end_date")
                              }
                            />
                          </MuiPickersUtilsProvider>
                        </Grid>
                      </Grid>
                      <Grid item>
                        <Typography
                          component="label"
                          for="subject"
                          color="primary"
                        >
                          Mata Pelajaran
                        </Typography>
                        <FormControl
                          id="subject"
                          variant="outlined"
                          color="primary"
                          fullWidth
                          error={Boolean(errors.subject) && !this.state.subject}
                        >
                          <Select
                            value={this.state.subject}
                            onChange={(event) => {
                              this.onChange(event, "subject");
                            }}
                          >
                            {all_subjects.map((subject) => (
                              <MenuItem value={subject._id}>
                                {subject.name}
                              </MenuItem>
                            ))}
                          </Select>
                          <FormHelperText>
                            {Boolean(errors.subject) && !this.state.subject
                              ? errors.subject
                              : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid>
                      <Grid item>
                        <Typography
                          component="label"
                          for="class_assigned"
                          color="primary"
                        >
                          Kelas yang Ditugaskan
                        </Typography>
                        <FormControl
                          variant="outlined"
                          fullWidth
                          error={
                            Boolean(errors.class_assigned) &&
                            class_assigned.length === 0
                          }
                        >
                          <Select
                            multiple
                            fullWidth
                            variant="outlined"
                            color="primary"
                            id="class_assigned"
                            value={class_assigned}
                            onChange={(event) =>
                              this.onChange(event, "class_assigned")
                            }
                            renderValue={(selected) => (
                              <div className={classes.chips}>
                                {selected.map((id) => {
                                  let name;
                                  for (let i in all_classes) {
                                    if (all_classes[i]._id === id) {
                                      name = all_classes[i].name;
                                      break;
                                    }
                                  }
                                  return (
                                    <Chip
                                      key={id}
                                      label={name}
                                      className={classes.chip}
                                    />
                                  );
                                })}
                              </div>
                            )}
                          >
                            {all_classes.map((kelas) => (
                              <MenuItem value={kelas._id}>
                                {kelas.name}
                              </MenuItem>
                            ))}
                          </Select>
                          <FormHelperText>
                            {Boolean(errors.class_assigned) &&
                            class_assigned.length === 0
                              ? errors.class_assigned
                              : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>

            <Grid item>
              {this.state.ready ? this.weightInput(classes) : null}
            </Grid>

            {this.listQuestion()}
            <Grid item container justify="center">
              <Grid item>
                <LightTooltip title="Tambah soal pilihan ganda">
                  <IconButton
                    className={`${classes.addQuestionButton} ${classes.RadioQst}`}
                    onClick={() => this.handleCloseMenuTambah("radio")}
                  >
                    <RadioButtonChecked />
                  </IconButton>
                </LightTooltip>
              </Grid>
              <Grid item>
                <LightTooltip title="Tambah soal kotak centang">
                  <IconButton
                    className={`${classes.addQuestionButton} ${classes.CheckboxQst}`}
                    onClick={() => this.handleCloseMenuTambah("checkbox")}
                  >
                    <CheckBox />
                  </IconButton>
                </LightTooltip>
              </Grid>
              <Grid item>
                <LightTooltip title="Tambah soal isian pendek">
                  <IconButton
                    className={`${classes.addQuestionButton} ${classes.ShorttextQst}`}
                    onClick={() => this.handleCloseMenuTambah("shorttext")}
                  >
                    <TextFormat />
                  </IconButton>
                </LightTooltip>
              </Grid>
              <Grid item>
                <LightTooltip title="Tambah soal uraian">
                  <IconButton
                    className={`${classes.addQuestionButton} ${classes.LongtextQst}`}
                    onClick={() => this.handleCloseMenuTambah("longtext")}
                  >
                    <Subject />
                  </IconButton>
                </LightTooltip>
              </Grid>
            </Grid>
            <Grid item container justify="center">
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
            <Grid item>
              <Paper>
                <Grid
                  container
                  // spacing={2}
                  justify="space-between"
                  alignItems="center"
                  className={classes.pageNavigatorContent}
                >
                  <Grid
                    item
                    className={classes.pageNavigator}
                  >
                    <Grid item>
                      <LightTooltip title={`Pengaturan`}>
                        <IconButton
                          disableRipple
                          className={classes.settingsButton}
                          onClick={(event) => this.handleMenuOpen(event)}
                        >
                          <SettingsIcon />
                        </IconButton>
                      </LightTooltip>
                      <Menu
                        keepMounted
                        anchorEl={this.state.anchorEl}
                        open={Boolean(this.state.anchorEl)}
                        onClose={this.handleMenuClose}
                        getContentAnchorEl={null}
                        style={{ marginTop: "10px" }}
                        anchorOrigin={{
                          vertical: "top",
                          horizontal: "center",
                        }}
                        transformOrigin={{
                          vertical: "bottom",
                          horizontal: "center",
                        }}
                      >
                        <MenuItem
                          button
                          component="a"
                          className={classes.menuVisible}
                          onClick={this.handlePostToggle}
                        >
                          <ListItemIcon>
                            {!this.state.posted ? (
                              <VisibilityIcon />
                            ) : (
                              <VisibilityOffIcon />
                            )}
                          </ListItemIcon>
                          <ListItemText
                            primary={
                              !this.state.posted
                                ? "Tampilkan ke Murid"
                                : "Sembunyikan dari Murid"
                            }
                          />
                        </MenuItem>
                        <MenuItem
                          button
                          component="a"
                          className={classes.menuCopy}
                          onClick={() => {
                            navigator.clipboard.writeText(linkToShare);
                            this.handleOpenCopySnackBar();
                          }}
                        >
                          <ListItemIcon>
                            <LinkIcon />
                          </ListItemIcon>
                          <ListItemText primary={`Salin Tautan ${this.state.type}`} />
                        </MenuItem>
                      </Menu>
                    </Grid>
                  </Grid>
                  <Grid
                    item
                    className={classes.assessmentSettings}
                  >
                    <Grid
                      container
                      spacing={1}
                    >
                      <Grid item>
                        <Button
                          variant="contained"
                          className={classes.cancelButton}
                          onClick={this.handleOpenDeleteDialog}
                        >
                          Batal
                        </Button>
                      </Grid>
                      <Grid item>
                        <Button
                          variant="contained"
                          type="submit"
                          className={classes.editAssessmentButton}
                        >
                          Sunting Kuis/Ujian
                        </Button>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>              
          </Grid>
        </form>
        <Snackbar
          open={this.state.checkboxSnackbarOpen}
          autoHideDuration={6000}
          onClose={this.handleCloseCheckboxErrorSnackBar}
        >
          <MuiAlert
            onClose={this.handleCloseCheckboxErrorSnackBar}
            severity="error"
          >
            Soal Dalam Bentuk Checkbox Minimal Memiliki Satu Jawaban.
          </MuiAlert>
        </Snackbar>
        <Snackbar
          open={this.state.radioSnackbarOpen}
          autoHideDuration={6000}
          onClose={this.handleCloseRadioErrorSnackBar}
        >
          <MuiAlert
            onClose={this.handleCloseRadioErrorSnackBar}
            severity="error"
          >
            Soal Dalam Bentuk Pilihan Ganda Minimal Memiliki Satu Jawaban.
          </MuiAlert>
        </Snackbar>
        <Snackbar
          open={this.state.copySnackbarOpen}
          autoHideDuration={6000}
          onClose={this.handleCloseCopySnackBar}
        >
          <MuiAlert onClose={this.handleCloseCopySnackBar} severity="success">
            Link {this.state.type} berhasil disalin ke Clipboard Anda!
          </MuiAlert>
        </Snackbar>
        <Snackbar
          open={this.state.snackbarOpen}
          autoHideDuration={4000}
          onClose={this.handleCloseErrorSnackbar}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <MuiAlert
            elevation={6}
            variant="filled"
            onClose={this.handleCloseSnackbar}
            severity="error"
          >
            Masih ada bagian yang belum diisi atau salah, silahkan diperiksa
            kembali!
          </MuiAlert>
        </Snackbar>
      </div>
    );
  }
}

EditAssessment.propTypes = {
  updateAssessment: PropTypes.func.isRequired,
  getAllClass: PropTypes.func.isRequired,
  getAllSubjects: PropTypes.func.isRequired,
  clearErrors: PropTypes.func.isRequired,
  getOneAssessment: PropTypes.func.isRequired,
  assessmentsCollection: PropTypes.object.isRequired,
  classesCollection: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  success: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  errors: state.errors,
  success: state.success,
  classesCollection: state.classesCollection,
  subjectsCollection: state.subjectsCollection,
  assessmentsCollection: state.assessmentsCollection,
});

export default connect(mapStateToProps, {
  getOneAssessment,
  getAllClass,
  getAllSubjects,
  updateAssessment,
  clearErrors,
})(withStyles(styles)(React.memo(EditAssessment)));
