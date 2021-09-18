import React, { Component } from "react";
import { connect } from "react-redux";
import DateFnsUtils from "@date-io/date-fns";
import PropTypes from "prop-types";
import lokal from "date-fns/locale/id";
import "date-fns";
import { createAssessment, validateAssessment } from "../../../actions/AssessmentActions";
import { getAllClass } from "../../../actions/ClassActions";
import { getAllSubjects } from "../../../actions/SubjectActions";
import { refreshTeacher } from "../../../actions/UserActions";
import { clearErrors } from "../../../actions/ErrorActions";
import { clearSuccess } from "../../../actions/SuccessActions";
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
  Menu,
  MenuItem,
  Paper,
  Select,
  Snackbar,
  Switch,
  TextField,
  TablePagination,
  Typography,
  IconButton,
  Hidden,
  Fab,
  ListItemIcon,
  ListItemText,
  FormGroup,
  Checkbox
} from "@material-ui/core";
import {
  MuiPickersUtilsProvider,
  KeyboardDateTimePicker,
} from "@material-ui/pickers";
import { withStyles } from "@material-ui/core/styles";
import SettingsIcon from "@material-ui/icons/Settings";
import FiberManualRecordIcon from "@material-ui/icons/FiberManualRecord";
import MuiAlert from "@material-ui/lab/Alert";
import VisibilityIcon from "@material-ui/icons/Visibility";
import VisibilityOffIcon from "@material-ui/icons/VisibilityOff";
import CancelIcon from "@material-ui/icons/Cancel";
import SendIcon from "@material-ui/icons/Send";
import {
  RadioButtonChecked,
  CheckBox,
  TextFormat,
  Subject,
} from "@material-ui/icons";
import InfoIcon from "@material-ui/icons/Info";
import {getSetting} from "../../../actions/SettingActions";


const styles = (theme) => ({
  root: {
    margin: "auto",
    maxWidth: "80%",
    [theme.breakpoints.down("md")]: {
      maxWidth: "100%",
    },
    padding: "10px",
  },
  content: {
    padding: "20px 20px 30px 20px",
  },
  pageNavigatorContent: {
    padding: "20px 20px 20px",
    [theme.breakpoints.down("xs")]: {
      padding: "20px 10px 20px",
    },
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
      paddingLeft: "0",
    },
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
      backgroundColor: theme.palette.success.main,
      color: "white"
    },
  },
  cancelButton: {
    backgroundColor: theme.palette.error.main,
    color: "white",
    "&:focus, &:hover": {
      backgroundColor: theme.palette.error.main,
      color: "white"
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
  //     backgroundColor: "#333333",
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
  dividerMargin: {
    margin: "4px 0"
  },
  customSpacing: {
    [theme.breakpoints.down("sm")]: {
      marginTop: theme.spacing(2)
    }
  },
  customPaddingBottom: {
    [theme.breakpoints.up("md")]: {
      paddingBottom: "0!important"
    }
  },
  customPaddingTop: {
    [theme.breakpoints.up("md")]: {
      paddingTop: "0!important"
    }
  },
  zeroHeightHelperText: {
    height: "0",
    display: "flex" // untuk men-disable "collapsing margin"
  }
});

class CreateAssessment extends Component {
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
      name: "",
      description: "",
      subject: "",
      class_assigned: [],
      start_date: null,
      end_date: null,
      post_date: new Date(),
      posted: false,
      isScheduled: false,
      type: "",
      openDeleteDialog: false,
      openUploadDialog: false,
      success: false,
      page: 0,
      rowsPerPage: 10,
      qnsListitem: [],
      snackbarOpen: false,
      snackbarMessage: "",
      anchorEl: null,
      checkboxSnackbarOpen: false,
      radioSnackbarOpen: false,
      fileLimitSnackbar: false,
      weights: {
        radio: undefined,
        checkbox: undefined,
        shorttext: undefined,
      }, // weight radio, checkbox, shorttext akan diset null ketika masih bernilai undefined saat tombol create assessment ditekan
      longtextWeight: [-1],
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
      over_limit: [],
      classOptions: null, // akan ditampilkan sebagai MenuItem pada saat memilih kelas
      subjectOptions: null, // akan ditampilkan sebagai MenuItem pada saat memilih matpel
      allClassObject: null, // digunakan untuk mendapatkan nama kelas dari id kelas tanpa perlu men-traverse array yang berisi semua kelas
      allSubjectObject: null, // digunakan untuk mendapatkan nama matpel dari id matpel tanpa perlu men-traverse array yang berisi semua matpel
      inputHeight: null, // menyimpan tinggi textfield
      customHeight: null, // menyimpan tinggi label + textfield
      errors: {},
      success: null
    };
    this.inputHeightRef = React.createRef(); // menyimpan referensi ke div yang berisi textfield
    this.customHeightRef = React.createRef(); // menyimpan referensi ke div yang berisi label "Judul" dan textfield
  }

  // ref itu untuk ngerefer html yang ada di render.
  imageUploader = React.createRef(null); // untuk ngerefer html object yang lain

  componentWillUnmount() {
    this.props.clearErrors();
    this.props.clearSuccess();
    this.props.handleSideDrawerExist(true);
  }

  handleCloseErrorSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    this.setState({ snackbarOpen: false });
  };

  handleFileLimitSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    this.setState({ fileLimitSnackbar: false });
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

  onSubmit = (e, id) => {
    e.preventDefault();
    let formData = new FormData();
    let invalidQuestionIndex = [];
    let completeWeight = true;
    let newBtErrors = [];

    const { questions } = this.state;
    const { createAssessment, validateAssessment, history } = this.props;

    console.log("Muncul lahh")
    // mencatat jumlah soal untuk tiap jenis soal
    let typeCount = new Map([
      ["radio", 0],
      ["checkbox", 0],
      ["shorttext", 0],
      ["longtext", 0],
    ]);
    for (let question of this.state.questions) {
      typeCount.set(question.type, typeCount.get(question.type) + 1);
    }

    if (this.state.posted || this.state.isScheduled) {
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
      this.setState({
        backtickErrors: newBtErrors,
        renderbtErrors: !this.state.renderbtErrors,
      });

      // pengecekan bobot
      let filteredtypeCount = Array.from(typeCount).filter(
        (pair) => pair[1] > 0
      );
      if (filteredtypeCount.length !== 0) {
        for (let [type, count] of filteredtypeCount) {
          if (type === "longtext") {
            for (let weight of this.state.longtextWeight) {
              // agar data assessment tidak disubmit ketika ada bobot soal uraian yang tidak valid
              if (weight !== -1 && (isNaN(Number(weight)) || Number(weight) <= 0)) {
                  completeWeight = false;
              }
            }
          } else {
            // agar data assessment tidak disubmit ketika ada bobot soal non uraian yang tidak valid
            if (
              isNaN(Number(this.state.weights[type])) ||
              Number(this.state.weights[type]) <= 0
            ) {
              completeWeight = false;
            }
          }
        }
      } else {
        completeWeight = false;
      }
    }

    let newWeights = { ...this.state.weights };
    // Untuk kasus dimana tidak ada longtext, tetap perlu diassign value supaya tidak undefined
    let newLongtextWeight = [...this.state.longtextWeight];

    for (let [type, count] of typeCount) {
      if (count === 0) {
        continue;
      }
      if (type === "longtext") {
        newLongtextWeight = newLongtextWeight.map((weight) => {
          if (weight === undefined) {
            return null;
          }
          return weight;
        });
      } else {
        if (this.state.weights[type] === undefined) {
          newWeights[type] = null;
        }
      }
    }

    this.setState({
      weights: newWeights,
      longtextWeight: newLongtextWeight,
    });

    // jika soal dan bobot sudah lengkap dan benar, submit
    if (invalidQuestionIndex.length === 0 && completeWeight ) {
      // sebelumnya ada && Object.values(this.state.errors).every((error) => (!error))
      let longtext;
      if (typeCount.get("longtext") === 0) {
        longtext = null;
      } else {
        // mengonversi bobot soal uraian dari string menjadi bilangan
        longtext = {};
        this.state.longtextWeight.forEach((val, idx) => {
          if (val !== -1) {
            if (val === null || val === "") {
              longtext[idx] = null;
            } else {
              longtext[idx] = Number(val);
            }
          }
        });
      }
      let question_weight = {
        radio: typeCount.get("radio") === 0 ? null : Number(this.state.weights.radio),
        checkbox:
          typeCount.get("checkbox") === 0 ? null : Number(this.state.weights.checkbox),
        shorttext:
          typeCount.get("shorttext") === 0
            ? null
            : Number(this.state.weights.shorttext),
        longtext: longtext,
      };

      questions.forEach((qns) => {
        let lampiran = qns.lampiran;
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
        author_id: id,
        posted: this.state.isScheduled ? null: this.state.posted,
        post_date: this.state.isScheduled ? this.state.post_date: null,
        type: this.state.type,
        question_weight: question_weight,
      };

      this.handleOpenUploadDialog();
      createAssessment(formData, assessmentData, history)
        .then((res) => {
          this.setState({ success: res });
          console.log("Assessment is created successfully");
        })
        .catch((err) => {
          this.setState({ errors: err });
          this.handleCloseUploadDialog();
          this.handleOpenErrorSnackbar();
        });
    } else {
      const assessmentData = {
        name: this.state.name,
        subject: this.state.subject,
        class_assigned: this.state.class_assigned,
        description: this.state.description,
        questions: this.state.questions,
        type: this.state.type,
        start_date: this.state.start_date,
        end_date: this.state.end_date,
      };

      validateAssessment(assessmentData)
      .catch((err) => {
        this.setState({ errors: err });
        // this.handleOpenErrorSnackbar();
      })
      this.handleOpenErrorSnackbar();

      //COba pakai finally kayaknya gak bisa. 
    }
  };

  handleOpenUploadDialog = () => {
    this.setState({ openUploadDialog: true });
  };

  handleCloseUploadDialog = () => {
    this.setState({ openUploadDialog: false})
  }

  handleOpenDeleteDialog = () => {
    this.setState({ openDeleteDialog: true });
  };

  handleCloseDeleteDialog = () => {
    this.setState({ openDeleteDialog: false });
  };

  isValidDateTime = (d) => {
    return d instanceof Date && !isNaN(d);
  };

  // FIXME onchange
  onChange = (e, otherfield = null) => {
    let field = e?.target?.id ? e.target.id : otherfield;
    if (this.state.errors[field]) {
      this.setState({ errors: { ...this.state.errors, [field]: null } });
    }

    if (otherfield) {
      if (otherfield === "end_date" || otherfield === "start_date" || otherfield === "post_date") {

        if (otherfield === "start_date") {
          if (this.isValidDateTime(e) && this.isValidDateTime(this.state.end_date)) {
            if (this.state.end_date.getTime() < e.getTime()) {
              this.setState({ errors: { ...this.state.errors, start_date_custom: "Harus sebelum Waktu Selesai Pengerjaan" } });
            } else {
              this.setState({ errors: { ...this.state.errors, start_date_custom: null, end_date_custom: null } });
            }
          } else {
            this.setState({ errors: { ...this.state.errors, start_date_custom: null } });
          }
        } else if (otherfield === "end_date") {
          if (this.isValidDateTime(e) && this.isValidDateTime(this.state.start_date)) {
            if (e.getTime() < this.state.start_date.getTime()) {
              this.setState({ errors: { ...this.state.errors, end_date_custom: "Harus setelah Waktu Mulai Pengerjaan" } });
            } else {
              this.setState({ errors: { ...this.state.errors, start_date_custom: null, end_date_custom: null } });
            }
          } else {
            this.setState({ errors: { ...this.state.errors, end_date_custom: null } });
          }
        }

        this.setState({ [otherfield]: e });
      } else if (otherfield === "subject") { // jika guru memilih mata pelajaran
        // mencari semua kelas yang diajarkan oleh guru ini untuk matpel yang telah dipilih
        let newClassOptions = [];
        if (this.props.auth.user.class_to_subject) {
          for (let [classId, subjectIdArray] of Object.entries(this.props.auth.user.class_to_subject)) {
            if (subjectIdArray.includes(e.target.value)) {
              newClassOptions.push({ _id: classId, name: this.state.allClassObject[classId] });
            }
          }
        }

        this.setState({ subject: e.target.value, classOptions: newClassOptions });

      } else if (otherfield === "class_assigned") { // jika guru memilih kelas
        let selectedClasses = e.target.value;

        if (selectedClasses.length === 0) { // jika guru membatalkan semua pilihan kelas
          this.setState((prevState, props) => {
            return {
              class_assigned: selectedClasses,
              // reset opsi matpel (tampilkan semua matpel yang diajar guru ini pada opsi matpel)
              subjectOptions: props.auth.user.subject_teached.map((subjectId) => ({ _id: subjectId, name: prevState.allSubjectObject[subjectId] }))
            }
          });
        } else { // jika guru menambahkan atau mengurangi pilihan kelas
          // mencari matpel yang diajarkan ke semua kelas yang sedang dipilih
          let subjectMatrix = [];
          if (this.props.auth.user.class_to_subject) {
            for (let classId of selectedClasses) {
              if (this.props.auth.user.class_to_subject[classId]) {
                subjectMatrix.push(this.props.auth.user.class_to_subject[classId]);
              }
            }
          }
          let subjects = [];
          if (subjectMatrix.length !== 0) {
            subjects = subjectMatrix.reduce((prevIntersectionResult, currentArray) => {
              return currentArray.filter((subjectId) => (prevIntersectionResult.includes(subjectId)));
            });
          }

          // menambahkan matpel tersebut ke opsi matpel
          let newSubjectOptions = [];
          subjects.forEach((subjectId) => {
            newSubjectOptions.push({ _id: subjectId, name: this.state.allSubjectObject[subjectId] });
          })

          this.setState({ subjectOptions: newSubjectOptions, class_assigned: selectedClasses });
        }
      } else {
        this.setState({ [otherfield]: e.target.value });
      }
    } else {
      this.setState({ [e.target.id]: e.target.value });
    }

    console.log("Start date:", this.state.start_date)
    console.log("End date:", this.state.start_date)

  };

  // onDateChange = (date) => {
  //   this.setState({ end_date: date });
  // };

  handleClickMenuTambah = (event) => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleCloseMenuTambah = (option) => {
    this.setState({ anchorEl: null });
    this.setState({ currentQuestionOption: option });
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

  // untuk tipe soal shorttext, agar string soal tidak ditraversal secara menyeluruh (untuk mencari
  // kunci jawaban) setiap kali guru mengetik huruf, string soal akan disimpan sebagai ref di komponen soal tersebut.
  // string ini baru akan diproses hanya ketika guru mengklik elemen lain selain textfield tersebut.
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
    console.log(i);
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
    } else {
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
      return {
        longtextWeight: value,
        backtickErrors: btErrors,
        renderbtErrors: !this.state.renderbtErrors,
      };
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
      return {
        longtextWeight: value,
        backtickErrors: newBtErrors,
        renderbtErrors: !this.state.renderbtErrors,
      };
    });
  };

  handleQuestionImage = (e, qnsIndex, indexToDelete = null) => {
    let questions = this.state.questions;
    const uploadLimit = this.props.settingsCollection.upload_limit;
    if (Number.isInteger(indexToDelete)) {
      // Untuk kasus pas mau nge delete foto
      questions[qnsIndex].lampiran.splice(indexToDelete, 1);
      console.log(questions);
      this.setState({ questions: questions });
    } else {
      if (e.target.files) {
        // Untuk kasus pas mau upload foto
        const files = Array.from(e.target.files);
        let over_limit = files.filter(
          (file) => file.size / Math.pow(10, 6) > uploadLimit
        );
        let file_to_upload = files.filter(
          (file) => file.size / Math.pow(10, 6) <= uploadLimit
        );
        let temp = questions[qnsIndex].lampiran.concat(file_to_upload);
        questions[qnsIndex].lampiran = temp;
        this.setState({
          questions: questions,
          fileLimitSnackbar: over_limit.length > 0,
          over_limit: over_limit,
        });
      }
    }
  };

  listQuestion = () => {
    let questions = this.state.questions;
    const { page, rowsPerPage } = this.state;

    let questionList = questions
      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
      .map((question, i) => {
        // Fitur 2 -- Untuk Memastikan Bahwa Checkbox yang tercentang (ditampilkan ke layar) sinkron dengan value "answer" yang tersimpan
        let booleanArray = [];
        if (question.type === "checkbox") {
          let tempArray = [];
          if (typeof question.answer === "object") {
            question.answer.forEach(function (value, index) {
              tempArray.push(Number(value.charCodeAt(0)) - 65);
            });
          }

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
            isEdit={false}
            index={questionIdx}
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

    // pembandingan info guru (auth.user) dilakukan agar pembaruan info guru oleh admin dapat memperbarui opsi kelas dan mata pelajaran
    if (prevState.classOptions === null || JSON.stringify(prevProps.auth.user) !== JSON.stringify(this.props.auth.user)) {
      if (this.props.classesCollection.all_classes && (this.props.classesCollection.all_classes.length !== 0)) {

        let all_classes_obj = {};
        this.props.classesCollection.all_classes.forEach((classInfo) => {
          all_classes_obj[classInfo._id] = classInfo.name;
        });

        let newClassOptions = [];
        if (this.props.auth.user.class_teached) {
          newClassOptions = this.props.auth.user.class_teached.map((classId) => {
            return { _id: classId, name: all_classes_obj[classId] };
          });
        }

        this.setState({ classOptions: newClassOptions, allClassObject: all_classes_obj });
      } // jika memang belum ada kelas yang tercatat di sistem, opsi kelas akan tetap null
    }

    if (prevState.subjectOptions === null || JSON.stringify(prevProps.auth.user) !== JSON.stringify(this.props.auth.user)) {
      if (this.props.subjectsCollection.all_subjects && (this.props.subjectsCollection.all_subjects.length !== 0)) {

        let all_subjects_obj = {};
        this.props.subjectsCollection.all_subjects.forEach((subjectInfo) => {
          all_subjects_obj[subjectInfo._id] = subjectInfo.name;
        });

        let newSubjectOptions = [];
        if (this.props.auth.user.subject_teached) {
          newSubjectOptions = this.props.auth.user.subject_teached.map((subjectId) => {
            return { _id: subjectId, name: all_subjects_obj[subjectId] };
          });
        }

        this.setState({ subjectOptions: newSubjectOptions, allSubjectObject: all_subjects_obj });
      } // jika memang belum ada matpel yang tercatat di sistem, opsi matpel akan tetap null
    }
  }

  componentDidMount() {
    const { getAllClass, getAllSubjects, handleSideDrawerExist, refreshTeacher, getSetting } = this.props;
    const { pathname } = this.props.location;

    if(pathname === "/buat-kuis"){
      this.setState({ type: "Kuis"})
    } else if (pathname === "/buat-ujian"){
      this.setState({ type: "Ujian"})
    } else {
      console.log("Kuis atau ujian tidak dispecify");
    }

    handleSideDrawerExist(false);
    getAllClass();
    getAllSubjects();
    refreshTeacher(this.props.auth.user._id);
    getSetting();
    if (this.inputHeightRef.current && this.customHeightRef.current) {
      this.setState({
        inputHeight: this.inputHeightRef.current.offsetHeight,
        customHeight: this.customHeightRef.current.offsetHeight + this.inputHeightRef.current.offsetHeight + 32 // tinggi (label + textfield) + (textfield) + (space antara textfield dan label di bawahnya)
        // customHeight: document.getElementById("top").getBoundingClientRect().top - document.getElementById("bottom").getBoundingClientRect().bottom // hasilnya salah
      });
    }
  }

  handleChangePage = (event, newPage) => {
    // setPage(newPage);
    this.setState({ page: newPage });
  };

  handleChangeRowsPerPage = (event) => {
    this.setState({ page: 0, rowsPerPage: +event.target.value });
  };

  handlePostToggle = () => {
    this.setState((prevState) => ({
      posted: !prevState.posted,
    }));
  };

  handleCheckScheduleMode = () => {
    this.setState((prevState) => ({
      isScheduled: !prevState.isScheduled,
    }));
  };

  handleMenuOpen = (event) => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleMenuClose = () => {
    this.setState({ anchorEl: null });
  };

  submitForm = () => {
    document.getElementById("submitForm").submit();
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

    let typeCount = new Set();
    for (let question of this.state.questions) {
      typeCount.add(question.type);
    }
    let filteredtypeCount = ["radio", "checkbox", "shorttext", "longtext"].filter(
      (type) => typeCount.has(type)
    );

    if (filteredtypeCount.length !== 0) {
      let desktopView = [];
      let mobileView = [
        <>
          <Typography variant="h6">Bobot Per Soal:</Typography>
          <FormHelperText>{"\u200B"}</FormHelperText>
          <Divider className={classes.dividerMargin} />
        </>
      ];

      for (let i = 0; i < filteredtypeCount.length; i++) {
        let type = filteredtypeCount[i];
        let weight = this.state.weights[type];
        let showError = 
            weight === null || (weight !== undefined && Number(weight) <= 0);


        mobileView.push(
          <Grid container>
            <Grid container>
              {/* untuk menambahkan margin */}
              <FormHelperText>{"\u200B"}</FormHelperText>
            </Grid>
            <div /* tidak pakai grid container agar widthnya tidak diset 100% */
              style={{
                display: "flex",
                flexDirection: "column",
                flexGrow: "1"
              }}
            >
              <Grid container alignItems="center" style={{ flexGrow: "1"}}>
                <Grid item style={{ marginRight: "20px" }}>
                  {columnTemplate[type].icon}
                </Grid>
                <Grid item>
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
              </Grid>
              {type !== "longtext" ? <FormHelperText>{"\u200B"}</FormHelperText> : null}
            </div>
            {type !== "longtext" ? (
              <Grid
                item
                style={{
                  display: "flex",
                  flexDirection: "column"
                }}
              >
                <Hidden xsDown>
                  <TextField
                    value={this.state.weights[type]}
                    variant="outlined"
                    key={type}
                    fullWidth
                    onChange={(e) => {
                      this.handleWeight(e, type);
                    }}
                    error={showError}
                    helperText={showError ? "Periksa Kembali!" : "\u200B"}
                    FormHelperTextProps={{
                      style: {
                        marginLeft: "0",
                        marginRight: "0"
                      }
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
                    helperText={showError ? "Periksa Kembali!" : "\u200B"}
                    FormHelperTextProps={{
                      style: {
                        marginLeft: "0",
                        marginRight: "0"
                      }
                    }}
                    InputProps={{
                      style: {
                        width: "85px"
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
                    style={{ display: "flex", width: "100px" }}
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
                    style={{ display: "flex", width: "85px" }}
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

        desktopView.push(
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
              <Grid item>
                <TextField
                  defaultValue={this.state.weights[type]}
                  variant="outlined"
                  key={type}
                  fullWidth
                  onChange={(e) => {
                    this.handleWeight(e, type);
                  }}
                  error={showError}
                  helperText={showError ? "Periksa Kembali!" : "\u200B"}
                  FormHelperTextProps={{
                    style: {
                      marginLeft: "0",
                      marginRight: "0"
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
              <Grid item>
                <LightTooltip title="Bobot soal jenis uraian dapat ditentukan pada masing-masing soal">
                  <IconButton>
                    <InfoIcon />
                  </IconButton>
                </LightTooltip>
                <FormHelperText>{"\u200B"}</FormHelperText>
              </Grid>
            )}
          </Grid>
        );
        // jika elemen ini bukan elemen terakhir, tambahkan divider
        if (i !== filteredtypeCount.length - 1) {
          desktopView.push(<Divider orientation="vertical" flexItem />);
          mobileView.push(<Divider className={classes.dividerMargin} />);
        }
      }

      return (
        <Paper>
          <Hidden smDown>
            <Grid
              container
              style={{ padding: "20px", height: "240px" }}
              justify="center"
            >
              {desktopView}
            </Grid>
          </Hidden>
          <Hidden mdUp>
            <Grid
              container
              style={{ padding: "20px" }}
              wrap="nowrap"
              direction="column"
            >
              {mobileView}
            </Grid>
          </Hidden>
        </Paper>
      );
    } else {
      return null;
    }
  };

  render() {
    // const { class_assigned } = this.state;
    // const { classes, errors, success } = this.props;

    const { class_assigned, errors, success } = this.state;
    const { classes } = this.props;
    const { all_classes } = this.props.classesCollection;
    const { all_subjects } = this.props.subjectsCollection;
    const { user } = this.props.auth;
    const { pathname } = this.props.location;

    const ToggleViewQuiz = withStyles((theme) => ({
      root: {
        width: 42,
        height: 26,
        padding: 0,
        margin: theme.spacing(1),
      },
      switchBase: {
        padding: 2,
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
          color: "#52D869",
          border: "6px solid #fff",
        },
      },
      thumb: {
        width: 10,
        height: 10,
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

    document.title = this.state.type === "Kuis" ? "Schooly | Buat Kuis" : "Schooly | Buat Ujian";

    return (
      <div className={classes.root}>
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
        {/* Ini Delete Dialog yang untuk cancel action saja, blm ada di DB*/}
        <DeleteDialog
          openDeleteDialog={this.state.openDeleteDialog}
          handleCloseDeleteDialog={this.handleCloseDeleteDialog}
          itemType={this.state.type ? this.state.type : "Penilaian"}
          deleteItem=""
          // itemName={this.state.name}
          // isLink={true}
          // redirectLink="/daftar-kuis"
          redirectLink={`daftar-${this.state.type.toLowerCase()}`}
          isWarning={false}
        />
        <UploadDialog
          openUploadDialog={this.state.openUploadDialog}
          success={success}
          messageUploading={`${this.state.type} sedang dibuat`}
          messageSuccess={`${this.state.type} telah dibuat`}
          redirectLink={`/${this.state.type.toLowerCase()}-guru/${success}`}
        />
        <form onSubmit={(e) => this.onSubmit(e, user._id)} id="submitForm">
          <Grid container direction="column" spacing={3}>
            <Grid item>
              <Paper>
                <div className={classes.content}>
                  <Typography variant="h5" gutterBottom>
                    <b>Buat {this.state.type}</b>
                  </Typography>
                  <Typography color="textSecondary">
                    Tambahkan keterangan untuk membuat {this.state.type.toLowerCase()}.
                  </Typography>
                </div>
                <Divider />
                <Grid container>
                  <Grid item xs={12} md className={classes.content}>
                    <Grid container direction="column" spacing={4}>
                      <Grid item>
                        <div ref={this.customHeightRef}>
                          <Typography
                            component="label"
                            for="name"
                            color="primary"
                          >
                            Judul
                          </Typography>
                          <div ref={this.inputHeightRef}>
                            <TextField
                              fullWidth
                              variant="outlined"
                              id="name"
                              error={errors.name}
                              // helperText={errors.name}
                              onChange={this.onChange}
                            />
                            {errors.name
                              ?
                              <div className={classes.zeroHeightHelperText}>
                                <FormHelperText variant="outlined" error>{errors.name}</FormHelperText>
                              </div>
                              : null}
                          </div>
                        </div>
                      </Grid>
                      <Grid item className={classes.customPaddingBottom}>
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
                          {Boolean(errors.type)
                            ?
                            <div className={classes.zeroHeightHelperText}>
                              <FormHelperText variant="outlined" error>{errors.type}</FormHelperText>
                            </div>
                            : null}
                        </FormControl>
                      </Grid>
                      <Hidden smDown>
                        {/* dummy checkbox agar kedua kolom form keterangan assessment simetris */}
                        <Grid item style={{ padding: "0", width: "0", visibility: "hidden" }}>
                          <FormHelperText variant="outlined">{"\u200B"}</FormHelperText>
                          <Checkbox size="small" disabled />
                        </Grid>
                      </Hidden>
                      <Grid item className={classes.customPaddingTop}>
                        <Typography
                          component="label"
                          for="description"
                          color="primary"
                        >
                          Deskripsi
                        </Typography>
                        <TextField
                          multiline
                          // 1 row = 17px. ukuran padding (cek dengan devtool) = 37px
                          rows={(this.state.customHeight - 37) / 17}
                          rowsMax="25"
                          fullWidth
                          error={errors.description}
                          // helperText={errors.description}
                          onChange={this.onChange}
                          variant="outlined"
                          id="description"
                          type="text"
                        />
                        {errors.description
                          ?
                          <div className={classes.zeroHeightHelperText}>
                            <FormHelperText variant="outlined" error>{errors.description}</FormHelperText>
                          </div>
                          : null}
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
                            for="workTimeStart"
                            color="primary"
                          >
                            {/* FIXME start date */}
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
                              minDateMessage="Harus waktu yang akan datang"
                              invalidDateMessage="Format tanggal tidak benar"
                              id="workTimeStart"
                              helperText={null}
                              value={this.state.start_date}
                              onChange={(date) =>
                                this.onChange(date, "start_date")
                              }
                              // onError={(err) => {
                              //   if (errors.start_date !== err) {
                              //     this.setState({ errors: { ...errors, start_date: err } });
                              //   }
                              // }}
                              error={errors.start_date_custom || errors.start_date}
                            />
                              <div className={classes.zeroHeightHelperText}>
                                {/* <FormHelperText variant="outlined" error>{errors.start_date}</FormHelperText> */}
                                {errors.start_date_custom
                                  ? <FormHelperText variant="outlined" error>{errors.start_date_custom}</FormHelperText>
                                : errors.start_date
                                  ? <FormHelperText variant="outlined" error>{errors.start_date}</FormHelperText>
                                    : null}
                              </div>
                          </MuiPickersUtilsProvider>
                        </Grid>
                        <Grid item xs={12} md={6} className={classes.customSpacing}>
                          <Typography
                            component="label"
                            for="workTimeEnd"
                            color="primary"
                          >
                            {/* FIXME end date */}
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
                              id="workTimeEnd"
                              helperText={null}
                              value={this.state.end_date}
                              minDate={this.state.start_date}
                              minDateMessage="Harus setelah Waktu Mulai Pengerjaan"
                              onChange={(date) =>
                                this.onChange(date, "end_date")
                              }
                              onError={(err) => {
                                if (errors.end_date !== err) {
                                  this.setState({ errors: { ...errors, end_date: err } });
                                }
                              }}
                              error={errors.end_date_custom || errors.end_date}
                            />
                              <div className={classes.zeroHeightHelperText}>
                                {/* <FormHelperText variant="outlined" error>{errors.end_date}</FormHelperText> */}
                              {errors.end_date_custom
                                ? <FormHelperText variant="outlined" error>{errors.end_date_custom}</FormHelperText>
                                : errors.end_date
                                  ? <FormHelperText variant="outlined" error>{errors.end_date}</FormHelperText>
                                  : null}
                              </div>
                          </MuiPickersUtilsProvider>
                        </Grid>
                      </Grid>
                      <Grid item style={{ paddingBottom: "0" }}>
                        <Typography
                          component="label"
                          for="postDate"
                          color="primary"
                        >
                          Waktu Rilis
                        </Typography>
                        <MuiPickersUtilsProvider
                          locale={lokal}
                          utils={DateFnsUtils}
                        >
                          <KeyboardDateTimePicker
                            disabled={!this.state.isScheduled}
                            fullWidth
                            inputVariant="outlined"
                            format="dd/MM/yyyy - HH:mm"
                            ampm={false}
                            okLabel="Simpan"
                            cancelLabel="Batal"
                            invalidDateMessage="Format tanggal tidak benar"
                            id="postDate"
                            helperText={null}
                            value={this.state.post_date}
                            onChange={(date) =>
                              this.onChange(date, "post_date")
                            }
                            onError={(err) => {
                              if (errors.post_date !== err) {
                                this.setState({ errors: { ...errors, post_date: err } });
                              }
                            }}
                          />
                          <div className={classes.zeroHeightHelperText} style={{ flexDirection: "column" }}>
                            {errors.post_date
                              ? <FormHelperText variant="outlined" error>{errors.post_date}</FormHelperText>
                              : null}
                            {/* checkbox ini dimasukkan ke div zero height ini agar dapat berpindah ke bawah (untuk memberikan ruang
                              untuk menampilkan helper text error) tanpa memindahkan dua item-item di bawahnya*/}
                            <FormGroup style={{ width: "fit-content" }}>
                              <FormControlLabel
                                label={
                                  <Typography color="textPrimary">
                                    Rilis Otomatis
                                  </Typography>
                                }
                                control={
                                  <Checkbox
                                    onChange={() => {
                                      this.handleCheckScheduleMode();
                                    }}
                                    color="primary"
                                    size="small"
                                    checked={this.state.isScheduled}
                                  />
                                }
                              />
                            </FormGroup>
                          </div>
                        </MuiPickersUtilsProvider>
                      </Grid>
                      {/* dummy checkbox untuk memberikan ruang bagi checkbox waktu rilis yang sebenarnya */}
                      <Grid item style={{ padding: "0", width: "0", visibility: "hidden" }}>
                        <FormHelperText variant="outlined">{"\u200B"}</FormHelperText>
                        <Checkbox size="small" disabled />
                      </Grid>
                      <Grid item style={{ paddingTop: "0" }}>
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
                          error={Boolean(errors.subject)}
                        >
                          <Select
                            value={this.state.subject}
                            onChange={(event) => {
                              this.onChange(event, "subject");
                            }}
                          >
                            {(this.state.subjectOptions !== null) ? (
                              this.state.subjectOptions.map((subject) => (
                                <MenuItem key={subject._id} value={subject._id}>
                                  {subject.name}
                                </MenuItem>
                              ))
                            ) : (
                              null
                            )}
                          </Select>
                          {Boolean(errors.subject)
                            ?
                            <div className={classes.zeroHeightHelperText}>
                              <FormHelperText variant="outlined" error>{errors.subject}</FormHelperText>
                            </div>
                            : null}
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
                            Boolean(errors.class_assigned)
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
                                {selected.map((classId) => {
                                  return (
                                    <Chip
                                      key={classId}
                                      label={this.state.allClassObject ? this.state.allClassObject[classId] : null}
                                      className={classes.chip}
                                    />
                                  );
                                })}
                              </div>
                            )}
                          >
                            {(this.state.classOptions !== null) ? (
                              this.state.classOptions.map((classInfo) => (
                                <MenuItem selected={true} key={classInfo._id} value={classInfo._id}>
                                  {classInfo.name}
                                </MenuItem>
                              ))
                            ) : (
                              null
                            )}
                          </Select>
                          {Boolean(errors.class_assigned)
                            ?
                            <div className={classes.zeroHeightHelperText}>
                              <FormHelperText variant="outlined" error>{errors.class_assigned}</FormHelperText>
                            </div>
                            : null}
                        </FormControl>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>

            <Grid item>{this.weightInput(classes)}</Grid>

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
                  justify="space-between"
                  alignItems="center"
                  className={classes.pageNavigatorContent}
                >
                  <Grid item className={classes.pageNavigator}>
                    <Grid item>
                      <LightTooltip title={!this.state.posted ? "Mati" : "Hidup"}>
                        <FormControlLabel
                          control={
                            <ToggleViewQuiz
                              icon={<FiberManualRecordIcon />}
                              checkedIcon={<FiberManualRecordIcon />}
                              disabled={this.state.isScheduled}
                              checked={this.state.posted}
                              onChange={this.handlePostToggle}
                            />
                          }
                          label={
                            <Typography variant="subtitle2">
                              Akses ke murid
                            </Typography>
                          }
                          labelPlacement="bottom"
                        />
                      </LightTooltip>
                      {/*<LightTooltip title={`Pengaturan`}>
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
                          disabled={this.state.isScheduled}
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
                      </Menu>*/}
                    </Grid>
                  </Grid>
                  <Grid item className={classes.assessmentSettings}>
                    <Grid container spacing={1}>
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
                          className={classes.createAssessmentButton}
                        >
                          Buat {this.state.type}
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
            Masih ada bagian yang belum diisi atau salah, silakan diperiksa
            kembali!
          </MuiAlert>
        </Snackbar>
        <Snackbar
          open={this.state.fileLimitSnackbar}
          autoHideDuration={4000}
          onClose={this.handleFileLimitSnackbar}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <MuiAlert elevation={6} variant="filled" severity="error">
            {this.state.over_limit.length} file melebihi batas {this.props.settingsCollection.upload_limit}MB!
          </MuiAlert>
        </Snackbar>
      </div>
    );
  }
}

CreateAssessment.propTypes = {
  createAssessment: PropTypes.func.isRequired,
  getAllClass: PropTypes.func.isRequired,
  getAllSubjects: PropTypes.func.isRequired,
  clearErrors: PropTypes.func.isRequired,
  classesCollection: PropTypes.object.isRequired,
  // errors: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  success: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  errors: state.errors,
  auth: state.auth,
  success: state.success,
  classesCollection: state.classesCollection,
  subjectsCollection: state.subjectsCollection,
  settingsCollection: state.settingsCollection
});

export default connect(mapStateToProps, {
  getAllClass,
  getAllSubjects,
  createAssessment,
  validateAssessment,
  clearErrors,
  clearSuccess,
  refreshTeacher,
  getSetting
})(withStyles(styles)(React.memo(CreateAssessment)));
