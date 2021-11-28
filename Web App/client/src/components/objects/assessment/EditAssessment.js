import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import DateFnsUtils from "@date-io/date-fns";
import lokal from "date-fns/locale/id";
import "date-fns";
import { getAllClass } from "../../../actions/ClassActions";
import { getAllSubjects } from "../../../actions/SubjectActions";
import { getOneAssessment, updateAssessment, validateAssessment } from "../../../actions/AssessmentActions";
import { getFileAssessment } from "../../../actions/files/FileAssessmentActions";
import { refreshTeacher } from "../../../actions/UserActions";
import { getSetting } from "../../../actions/SettingActions";
import { clearErrors } from "../../../actions/ErrorActions";
import DeleteDialog from "../../misc/dialog/DeleteDialog";
import UploadDialog from "../../misc/dialog/UploadDialog";
import LightTooltip from "../../misc/light-tooltip/LightTooltip";
import QuestionItem from "./QuestionItem";
import {
  AppBar,
  Avatar,
  Badge,
  Button,
  ButtonGroup,
  Checkbox,
  Chip,
  Divider,
  Drawer,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormHelperText,
  Grid,
  Hidden,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
  Menu,
  MenuItem,
  Paper,
  Select,
  Snackbar,
  TextField,
  TablePagination,
  Tooltip,
  Typography,
} from "@material-ui/core";
import {
  MuiPickersUtilsProvider,
  KeyboardDateTimePicker,
} from "@material-ui/pickers";
import Alert from "@material-ui/lab/Alert";
import {
  Add as AddIcon,
  ArrowDropDown as ArrowDropDownIcon,
  CheckBox as CheckBoxIcon,
  Close as CloseIcon,
  FormatListNumbered as FormatListNumberedIcon,
  Info as InfoIcon,
  LibraryBooks as LibraryBooksIcon,
  Link as LinkIcon,
  RadioButtonChecked as RadioButtonCheckedIcon,
  ShortText as ShortTextIcon,
  Subject as SubjectIcon,
  TextFormat as TextFormatIcon,
  Timer as TimerIcon,
  TimerOff as TimerOffIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon
} from "@material-ui/icons";
import { withStyles } from "@material-ui/core/styles";
import { BsClipboardData } from "react-icons/bs";
import { FaChalkboard, FaClipboardList } from "react-icons/fa";

const styles = (theme) => ({
  root: {
    margin: "auto",
    padding: "20px",
    paddingTop: "25px",
    maxWidth: "85%",
    [theme.breakpoints.down("md")]: {
      maxWidth: "100%",
    },
  },
  background: {
    backgroundColor: "#F9F9F9",
    minHeight: "100%",
  },
  menuBar: {
    zIndex: theme.zIndex.drawer + 1,
    padding: "15px 20px",
    boxShadow: "0 1px 3px 0px rgba(32,33,36,0.28)",
    backgroundColor: "white",
    color: "black",
  },
  editButton: {
    width: "90px",
    backgroundColor: theme.palette.primary.main,
    color: "white",
    "&:focus, &:hover": {
      backgroundColor: theme.palette.primary.main,
      color: "white",
      boxShadow: "0px 1px 2px 0px rgba(194,100,1,0.3), 0px 2px 6px 2px rgba(194,100,1,0.15)",
    },
    [theme.breakpoints.down("sm")]: {
      width: "100%",
    },
  },
  editDropdownButton: {
    backgroundColor: theme.palette.primary.main,
    color: "white",
    "&:focus, &:hover": {
      backgroundColor: theme.palette.primary.main,
      color: "white",
      boxShadow: "0px 1px 2px 0px rgba(194,100,1,0.3), 0px 2px 6px 2px rgba(194,100,1,0.15)",
    },
  },
  closeButton: {
    width: "32px",
    height: "32px",
  },
  toolbar: theme.mixins.toolbar,
  content: {
    display: "flex",
    flexDirection: "column",
    flexGrow: "1",
    marginBottom: "50px",
  },
  contentDetails: {
    padding: "20px 20px 30px 20px",
  },
  labelIcon: {
    fontSize: "18px",
    marginRight: "10px",
    color: "grey",
  },
  assessmentLabelIcon: {
    fontSize: "15.5px",
    marginRight: "10px",
    color: "grey",
  },
  selectPaper: {
    maxHeight: "250px",
  },
  chips: {
    display: "flex",
    flexWrap: "wrap",
  },
  chip: {
    margin: "0px 1px",
  },
  navigationDrawerPaper: {
    width: "250px",
  },
  assessmentMenu: {
    top: "auto",
    bottom: "0",
    padding: "0px 10px",
    display: "flex",
    justify: "center",
    backgroundColor: "transparent",
    boxShadow: "none",
  },
  assessmentMenuPaper: {
    margin: "auto",
    borderRadius: "5px 5px 0px 0px",
    padding: "15px 15px 5px 15px",
    width: "100%",
    maxWidth: "85%",
    [theme.breakpoints.down("md")]: {
      maxWidth: "100%",
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
      post_date: new Date(),
      posted: null,
      isScheduled: null,
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
      copySnackbarOpen: false,
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
      ready: false,
      lampiranUrls: new Map(),
      over_limit: [],
      classOptions: null, // Will be showed as menu item when choosing class.
      subjectOptions: null, // Will be showed as menu item when choosing subject.
      allClassObject: null, // Used to get class name from class id without traversing class array.
      allSubjectObject: null, // Used to get subject name from subject id without traversing subject array.
      success: null,
      errors: {},
    };
  }

  // Ref is used to refer html inside render.
  imageUploader = React.createRef(null); // To refer other html object.

  componentDidMount() {
    const {
      getAllClass,
      getAllSubjects,
      getOneAssessment,
      getFileAssessment,
      refreshTeacher,
      getSetting,
    } = this.props;
    const { pathname } = this.props.location;
    const assessment_id = this.props.match.params.id;
    if (pathname === `/sunting-kuis/${assessment_id}`) {
      this.setState({ type: "Kuis" });
    } else if (pathname === `/sunting-ujian/${assessment_id}`) {
      this.setState({ type: "Ujian" });
    } else {
      console.log("Kuis atau Ujian tidak dispecify");
    }

    getAllClass();
    getAllSubjects();
    getOneAssessment(assessment_id);
    refreshTeacher(this.props.auth.user._id);
    getSetting();
    getFileAssessment(assessment_id)
      .then((result) => {
        this.setState({ lampiranUrls: result });
      })
      .catch((err) => this.setState({ lampiranUrls: new Map() }));

    const { handleNavbar, handleSideDrawerExist, handleFooter } = this.props;
    handleNavbar(false);
    handleSideDrawerExist(false);
    handleFooter(false);
  }

  componentWillUnmount() {
    this.props.clearErrors();

    const { handleNavbar, handleSideDrawerExist, handleFooter } = this.props;
    handleNavbar(true);
    handleSideDrawerExist(true);
    handleFooter(true);
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { selectedAssessments } = nextProps.assessmentsCollection;

    if (Boolean(selectedAssessments) && nextProps.errors) {
      if (Object.keys(selectedAssessments).length !== 0) {
        let weights = {
          radio: selectedAssessments.question_weight.radio,
          checkbox: selectedAssessments.question_weight.checkbox,
          shorttext: selectedAssessments.question_weight.shorttext,
        };

        let longtextWeight = [];
        for (let i = 0; i <= selectedAssessments.questions.length - 1; i++) {
          longtextWeight.push(-1);
        }

        if (selectedAssessments.question_weight.longtext) {
          for (let [key, value] of Object.entries(
            selectedAssessments.question_weight.longtext
          )) {
            if (value === null) {
              longtextWeight[key] = undefined;
            } else {
              longtextWeight[key] = value;
            }
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
          type: selectedAssessments.type,
          weights: weights,
          longtextWeight: longtextWeight,
          ready: true,
          // fileLampiran must made like above soalnya because maybe selectedMaterials is still a plain object.
          // So need to check if selectedMaterials is undefined or not because when calling fileLAmpiran.length, there will be an error.
        });
        if (selectedAssessments.post_date === null) {
          this.setState({
            posted: selectedAssessments.posted,
            isScheduled: false,
          });
        } else {
          console.log(
            "selectedAssessments.posted " + selectedAssessments.posted
          );
          console.log(
            "selectedAssessments.post_date " + selectedAssessments.post_date
          );
          this.setState({
            posted: false,
            post_date: selectedAssessments.post_date,
            isScheduled: true,
          });
        }
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
    const { updateAssessment, validateAssessment, history } = this.props;

    // Write down number of question of each question types.
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
      // Check question's content.
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

      // Check question's maximum score point.
      let filteredtypeCount = Array.from(typeCount).filter(
        (pair) => pair[1] > 0
      );
      if (filteredtypeCount.length === 0) {
        completeWeight = false;
      } else {
        for (let [type, count] of filteredtypeCount) {
          if (type === "longtext") {
            for (let weight of this.state.longtextWeight) {
              // So that assessment data won't be submitted whene there are long answer questions' maximum score point that is not valid.
              if (
                weight !== -1 &&
                (isNaN(Number(weight)) || Number(weight) <= 0)
              ) {
                completeWeight = false;
              }
            }
          } else {
            // So that assessment data won't be submitted whene there are non-long answer questions' maximum score point that is not valid.
            if (
              isNaN(Number(this.state.weights[type])) ||
              Number(this.state.weights[type]) <= 0
            ) {
              completeWeight = false;
            }
          }
        }
      }
    }

    let newWeights = { ...this.state.weights };
    // For the case when there is no long answer question, still need to assign value so that it is not undefined.
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

    // If question and maximum score point is already correct, then submit.
    if (invalidQuestionIndex.length === 0 && completeWeight) {
      // Before there is && Object.values(this.state.errors).every((error) => (!error))
      let longtext;
      if (typeCount.get("longtext") === 0) {
        longtext = null;
      } else {
        // Convert long answer question maximum score point from string to integer.
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
        radio:
          typeCount.get("radio") === 0
            ? null
            : Number(this.state.weights.radio),
        checkbox:
          typeCount.get("checkbox") === 0
            ? null
            : Number(this.state.weights.checkbox),
        shorttext:
          typeCount.get("shorttext") === 0
            ? null
            : Number(this.state.weights.shorttext),
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
        posted: this.state.isScheduled ? null : this.state.posted,
        post_date: this.state.isScheduled ? this.state.post_date : null,
        type: this.state.type,
        question_weight: question_weight,
      };
      const assessmentId = this.props.match.params.id;
      this.handleOpenUploadDialog();
      updateAssessment(
        formData,
        assessmentData,
        assessmentId,
        lampiranToDelete,
        history
      )
        .then((res) => {
          this.setState({ success: res });
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
      validateAssessment(assessmentData).catch((err) => {
        this.setState({ errors: err });
      });
      this.handleOpenErrorSnackbar();
    }
  };

  // Upload Dialog
  handleOpenUploadDialog = () => {
    this.setState({ openUploadDialog: true });
  };

  handleCloseUploadDialog = () => {
    this.setState({ openUploadDialog: false });
  };

  // Delete Dialog
  handleOpenDeleteDialog = () => {
    this.setState({ openDeleteDialog: true });
  };

  handleCloseDeleteDialog = () => {
    this.setState({ openDeleteDialog: false });
  };

  isValidDateTime = (d) => {
    return d instanceof Date && !isNaN(d);
  };

  onChange = (e, otherfield = null) => {
    let field = e?.target?.id ? e.target.id : otherfield;
    if (this.state.errors[field]) {
      this.setState({ errors: { ...this.state.errors, [field]: null } });
    }

    if (otherfield) {
      if (
        otherfield === "end_date" ||
        otherfield === "start_date" ||
        otherfield === "post_date"
      ) {
        if (otherfield === "start_date") {
          if (
            this.isValidDateTime(e) &&
            this.isValidDateTime(this.state.end_date)
          ) {
            if (this.state.end_date.getTime() < e.getTime()) {
              this.setState({
                errors: {
                  ...this.state.errors,
                  start_date_custom: "Harus sebelum Waktu Selesai Pengerjaan",
                },
              });
            } else {
              this.setState({
                errors: {
                  ...this.state.errors,
                  start_date_custom: null,
                  end_date_custom: null,
                },
              });
            }
          } else {
            this.setState({
              errors: { ...this.state.errors, start_date_custom: null },
            });
          }
        } else if (otherfield === "end_date") {
          if (
            this.isValidDateTime(e) &&
            this.isValidDateTime(this.state.start_date)
          ) {
            if (e.getTime() < this.state.start_date.getTime()) {
              this.setState({
                errors: {
                  ...this.state.errors,
                  end_date_custom: "Harus setelah Waktu Mulai Pengerjaan",
                },
              });
            } else {
              this.setState({
                errors: {
                  ...this.state.errors,
                  start_date_custom: null,
                  end_date_custom: null,
                },
              });
            }
          } else {
            this.setState({
              errors: { ...this.state.errors, end_date_custom: null },
            });
          }
        }

        this.setState({ [otherfield]: e });
      } else if (otherfield === "subject") {
        // If teacher choose a subject.
        // Find all class that is taught by this teacher for the subject that has been chosen.
        let newClassOptions = [];
        if (this.props.auth.user.class_to_subject) {
          for (let [classId, subjectIdArray] of Object.entries(
            this.props.auth.user.class_to_subject
          )) {
            if (subjectIdArray.includes(e.target.value)) {
              newClassOptions.push({
                _id: classId,
                name: this.state.allClassObject[classId],
              });
            }
          }
        }

        this.setState({
          subject: e.target.value,
          classOptions: newClassOptions,
        });
      } else if (otherfield === "class_assigned") {
        // If teacher choose a class.
        let selectedClasses = e.target.value;

        if (selectedClasses.length === 0) {
          // If teacher deselect all chosen class.
          this.setState((prevState, props) => {
            return {
              class_assigned: selectedClasses,
              // Reset subject options (show all subjects that this teacher teach)
              subjectOptions: props.auth.user.subject_teached.map(
                (subjectId) => ({
                  _id: subjectId,
                  name: prevState.allSubjectObject[subjectId],
                })
              ),
            };
          });
        } else {
          // If teacher add a class or remove a selected class.
          // Find subject that is taught to every selected class.
          let subjectMatrix = [];
          if (this.props.auth.user.class_to_subject) {
            for (let classId of selectedClasses) {
              subjectMatrix.push(
                this.props.auth.user.class_to_subject[classId]
              );
            }
          }
          let subjects = [];
          if (subjectMatrix.length !== 0) {
            subjects = subjectMatrix.reduce(
              (prevIntersectionResult, currentArray) => {
                return currentArray.filter((subjectId) =>
                  prevIntersectionResult.includes(subjectId)
                );
              }
            );
          }

          // Add the subject to the subject option.
          let newSubjectOptions = [];
          subjects.forEach((subjectId) => {
            newSubjectOptions.push({
              _id: subjectId,
              name: this.state.allSubjectObject[subjectId],
            });
          });

          this.setState({
            subjectOptions: newSubjectOptions,
            class_assigned: selectedClasses,
          });
        }
      } else {
        this.setState({ [otherfield]: e.target.value });
      }
    } else {
      this.setState({ [e.target.id]: e.target.value });
    }
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
    this.setState({ questions: questions, currentQuestionOption: null });
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
          // Prevent there are multiple choice question that has no option.
          if (questions[qnsIndex].answer.length === 1) {
            // If there is only one key anwer (for example ["E"]).
            if (
              questions[qnsIndex].answer[0].charCodeAt(0) - 65 ===
              optionIndex
            ) {
              // If the deleted option is the key answer, then set key answer to the first option.
              questions[qnsIndex].answer[0] = "A";
            } else {
              // If the deleted option is not the key answer.
              if (
                questions[qnsIndex].answer[0].charCodeAt(0) - 65 >
                optionIndex
              ) {
                // Key answer value will be reduced by 1.
                // For example: if option "C" is deleted, key answer "E" will be changed become "D".
                // But key answer "B" will not be changed to "A".
                questions[qnsIndex].answer[0] = String.fromCharCode(
                  97 + questions[qnsIndex].answer[0].charCodeAt(0) - 65 - 1
                ).toUpperCase();
              }
            }
          } else {
            // If there is more than one key answer (for example ["E", "B", "Z"]).
            // Delete key answer.
            questions[qnsIndex].answer = questions[qnsIndex].answer.filter(
              (value) => {
                return value.charCodeAt(0) - 65 !== optionIndex;
              }
            );
            // Every other key answer value will be reduced by 1.
            // For example: if option "C" is deleted, key answer "E" will be changed to "D", key answer "Z" will be changed to "Y",
            // But key answer "B" will not be changed to "A".
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
            // If the deleted option is thee key answer option, set key answer to the first option.
            questions[qnsIndex].answer[0] = "A";
          } else {
            // If the deleted option is not the key answer.
            if (
              questions[qnsIndex].answer[0].charCodeAt(0) - 65 >
              optionIndex
            ) {
              // Key answer value will be reduced by 1.
              // For example: if option "C" is deleted, key answer "E" will be changed become "D".
              // But key answer "B" will not be changed to "A".
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
    // If question is inserted directly, somehow it will also change if the duplicated one value is changed.
    // Maybe if assigning question directly, the object will be identical? if destructure each of them and create a new object, it will be different.
    // questions.splice(i+1, 0, question).

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
      let item = questions[qnsIndex].lampiran[indexToDelete];
      // Delete a question's image from list.
      questions[qnsIndex].lampiran.splice(indexToDelete, 1);
      // Then, save all image in list to check.
      let all_lampiran_list = [];
      questions.forEach((qns) => {
        if (qns.lampiran.length) {
          all_lampiran_list = [...all_lampiran_list, ...qns.lampiran];
        }
      });

      // Use to handle if image is from duplication, but there is one question that its image is deleted.
      if (typeof item === "string") {
        let temp = this.state.lampiranToDelete;
        if (all_lampiran_list.indexOf(item) === -1) {
          // if there is nothing, it will be deleted.
          temp.push(item);
        }
        this.setState({ lampiranToDelete: temp, questions: questions });
      } else {
        this.setState({ questions: questions });
      }
    } else {
      if (e.target.files) {
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
            lampiranUrls={JSON.stringify(
              Array.from(this.state.lampiranUrls.entries())
            )}
          />
        );
      });

    return questionList;
  };

  componentDidUpdate(prevProps, prevState) {
    if (!this.props.errors && this.props.errors !== prevProps.errors) {
      this.handleOpenUploadDialog();
    }

    // Comparing teacher information (auth.user) is done so teacher's information renewal by admin can renew the class and subject option.
    if (
      prevState.classOptions === null ||
      JSON.stringify(prevProps.auth.user) !==
        JSON.stringify(this.props.auth.user)
    ) {
      const selectedAssessmentProps = this.props.assessmentsCollection
        .selectedAssessments;

      if (
        this.props.classesCollection.all_classes &&
        this.props.classesCollection.all_classes.length !== 0 &&
        selectedAssessmentProps &&
        selectedAssessmentProps.constructor === Object &&
        Object.keys(selectedAssessmentProps).length !== 0
      ) {
        let all_classes_obj = {};
        this.props.classesCollection.all_classes.forEach((classInfo) => {
          all_classes_obj[classInfo._id] = classInfo.name;
        });

        // Find all class that is taught by this teacher for the subject that has been chosen.
        let newClassOptions = [];
        if (this.props.auth.user.class_to_subject) {
          for (let [classId, subjectIdArray] of Object.entries(
            this.props.auth.user.class_to_subject
          )) {
            if (subjectIdArray.includes(selectedAssessmentProps.subject)) {
              newClassOptions.push({
                _id: classId,
                name: all_classes_obj[classId],
              });
            }
          }
        }

        this.setState({
          classOptions: newClassOptions,
          allClassObject: all_classes_obj,
        });
      }
    }

    if (
      prevState.subjectOptions === null ||
      JSON.stringify(prevProps.auth.user) !==
        JSON.stringify(this.props.auth.user)
    ) {
      const selectedAssessmentProps = this.props.assessmentsCollection
        .selectedAssessments;

      if (
        this.props.subjectsCollection.all_subjects &&
        this.props.subjectsCollection.all_subjects.length !== 0 &&
        selectedAssessmentProps &&
        selectedAssessmentProps.constructor === Object &&
        Object.keys(selectedAssessmentProps).length !== 0
      ) {
        let all_subjects_obj = {};
        this.props.subjectsCollection.all_subjects.forEach((subjectInfo) => {
          all_subjects_obj[subjectInfo._id] = subjectInfo.name;
        });

        // Find subject that is taught to every selected class.
        let subjectMatrix = [];
        if (this.props.auth.user.class_to_subject) {
          for (let classId of selectedAssessmentProps.class_assigned) {
            if (this.props.auth.user.class_to_subject[classId]) {
              subjectMatrix.push(
                this.props.auth.user.class_to_subject[classId]
              );
            }
          }
        }
        let subjects = [];
        if (subjectMatrix.length !== 0) {
          subjects = subjectMatrix.reduce(
            (prevIntersectionResult, currentArray) => {
              return currentArray.filter((subjectId) =>
                prevIntersectionResult.includes(subjectId)
              );
            }
          );
        }

        // Add the subject to the subject option.
        let newSubjectOptions = [];
        subjects.forEach((subjectId) => {
          newSubjectOptions.push({
            _id: subjectId,
            name: all_subjects_obj[subjectId],
          });
        });

        this.setState({
          subjectOptions: newSubjectOptions,
          allSubjectObject: all_subjects_obj,
        });
      }
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
    // e.target somehow will be undefined inside setState.
    let value = e.target.value;
    this.setState((state) => {
      return { weights: { ...state.weights, [type]: value } };
    });
  };

  weightInput = (classes) => {
    const columnTemplate = {
      radio: {
        text: "Pilihan Ganda",
        icon: <RadioButtonCheckedIcon />,
      },
      checkbox: {
        text: "Kotak Centang",
        icon: <CheckBoxIcon />,
      },
      shorttext: {
        text: "Isian Pendek",
        icon: <TextFormatIcon />,
      },
      longtext: {
        text: "Uraian",
        icon: <SubjectIcon />,
      },
    };

    let typeCount = new Set();
    for (let question of this.state.questions) {
      typeCount.add(question.type);
    }
    let filteredtypeCount = [
      "radio",
      "checkbox",
      "shorttext",
      "longtext",
    ].filter((type) => typeCount.has(type));

    if (filteredtypeCount.length !== 0) {
      let uniformMaxScore = [];

      for (let i = 0; i < filteredtypeCount.length; i++) {
        let type = filteredtypeCount[i];
        let weight = this.state.weights[type];
        let showError =
          weight === null || (weight !== undefined && Number(weight) <= 0);

        uniformMaxScore.push(
          <ListItem>
            <ListItemIcon>
              {columnTemplate[type].icon}
            </ListItemIcon>
            <ListItemText
              primary={
                <Typography noWrap>
                  {columnTemplate[type].text}
                </Typography>
              }
            />
            <div>
              {type !== "longtext" ? (
                <TextField
                  fullWidth
                  variant="outlined"
                  value={this.state.weights[type]}
                  key={type}
                  onChange={(e) => {this.handleWeight(e, type)}}
                  error={showError}
                  InputProps={{
                    style: {
                      maxWidth: "125px",
                      paddingLeft: "5px",
                    },
                    startAdornment: (
                      <Checkbox color="primary" size="small" />
                    ),
                    endAdornment: (
                      <Typography color="textSecondary">{` Poin`}</Typography>
                    ),
                  }}
                  inputProps={{
                    style: {
                      borderBottom: "none",
                      boxShadow: "none",
                      margin: "0px 8px",
                      WebkitBoxShadow: "0 0 0 1000px white inset",
                    },
                  }}
                />
              ) : (
                <LightTooltip title="Bobot soal jenis uraian dapat ditentukan pada masing-masing soal">
                  <InfoIcon style={{ color: "grey" }} />
                </LightTooltip>
              )}
            </div>
          </ListItem>
        );
      }

      return (
        <Paper>
          <div style={{ padding: "20px 20px 0px 20px" }}>
            <Typography variant="h6" color="primary">
              Bobot Per Soal
            </Typography>
            <Typography color="textSecondary" paragraph>
              Seragamkan bobot untuk masing-masing jenis soal dengan mencentang kotak yang tersedia.
            </Typography>
            <Divider />
          </div>
          <List style={{ padding: "8px 4px 20px 4px" }}>
            {uniformMaxScore}
          </List>
        </Paper>
      );
    } else {
      return null;
    }
  };

  render() {
    const { classes } = this.props;
    const { all_classes } = this.props.classesCollection;
    const { all_subjects } = this.props.subjectsCollection;
    const { selectedAssessments } = this.props.assessmentsCollection;
    const { class_assigned, errors, success } = this.state;

    const linkToShare =
      this.state.type === "Kuis"
        ? `https://${window.location.host}/kuis-murid/${this.props.match.params.id}`
        : `https://${window.location.host}/ujian-murid/${this.props.match.params.id}`;

    document.title = `Schooly | Sunting ${this.state.type}`;

    if (Boolean(selectedAssessments.submissions)) {
      return (
        <Typography variant="h5" color="textSecondary" align="center">
          Tidak dapat disunting karena sudah ada yang mengumpulkan
        </Typography>
      );
    } else {
      return (
        <div className={classes.background}>
          <div className={classes.root}>
            <form onSubmit={(e) => this.onSubmit(e)} style={{ width: "100%" }}>
              <AppBar position="fixed" className={classes.menuBar}>
                <Grid container justify="space-between" alignItems="center">
                  <Grid item xs>
                    <Typography variant="h6" color="textSecondary">
                      {this.state.type}
                    </Typography>
                  </Grid>
                  <Grid item>
                    <Grid container alignItems="center" spacing={2}>
                      <Grid item>
                        <ButtonGroup variant="text">
                          <Button type="submit" className={classes.editButton}>
                            Sunting
                          </Button>
                          <Button size="small" onClick={this.handleMenuOpen} className={classes.editDropdownButton}>
                            <ArrowDropDownIcon />
                          </Button>
                        </ButtonGroup>
                        <Menu
                          keepMounted
                          anchorEl={this.state.anchorEl}
                          open={Boolean(this.state.anchorEl)}
                          onClose={this.handleMenuClose}
                        >
                          <MenuItem
                            onClick={() => {
                              navigator.clipboard.writeText(linkToShare);
                              this.handleOpenCopySnackBar();
                            }}
                          >
                            <ListItemIcon>
                              <LinkIcon />
                            </ListItemIcon>
                            <ListItemText
                              primary="Salin Tautan"
                            />
                          </MenuItem>
                          <MenuItem onClick={this.handlePostToggle} disabled={this.state.isScheduled}>
                            <ListItemIcon>
                              {this.state.posted ?
                                <VisibilityIcon />
                              :
                                <VisibilityOffIcon />
                              }
                            </ListItemIcon>
                            <ListItemText
                              primary={this.state.posted ? "Akses Murid (Hidup)" : "Akses Murid (Mati)"}
                            />
                          </MenuItem>
                        </Menu>
                      </Grid>
                      <Grid item>
                        <IconButton onClick={this.handleOpenDeleteDialog} className={classes.closeButton}>
                          <CloseIcon style={{ fontSize: "24px" }} />
                        </IconButton>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </AppBar>
              <div className={classes.content}>
                <div className={classes.toolbar} />
                <Grid container direction="column" spacing={3}>
                  <Grid item>
                    <Paper>
                      <div className={classes.contentDetails}>
                        <Typography variant="h5" gutterBottom>
                          Sunting {this.state.type}
                        </Typography>
                        <Typography color="textSecondary">
                          Pengubahan jawaban setelah ada jawaban yang terkumpul
                          dapat berdampak pada penilaian yang ada.
                        </Typography>
                      </div>
                      <Divider />
                      <Grid container>
                        <Grid item xs={12} md={7} className={classes.contentDetails}>
                          <Grid container direction="column" spacing={4}>
                            <Grid item>
                              <div style={{ display: "flex", alignItems: "center"}}>
                                {this.state.type === "Ujian" ?
                                  <BsClipboardData className={classes.assessmentLabelIcon} />
                                :
                                  <FaClipboardList className={classes.assessmentLabelIcon} />
                                }
                                <Typography color="primary">
                                  Judul {this.state.type}
                                </Typography>
                              </div>
                              <TextField
                                fullWidth
                                type="text"
                                variant="outlined"
                                id="name"
                                value={this.state.name}
                                onChange={this.onChange}
                                error={errors.name}
                                helperText={errors.name}
                              />
                            </Grid>
                            <Grid item>
                            {/* Mau dibuang tipe penilaiannya*/}
                              <Typography
                                component="label"
                                for="class_assigned"
                                color="primary"
                              >
                                Tipe Penilaian
                              </Typography>
                              <FormControl
                                fullWidth
                                variant="outlined"
                                color="primary"
                                id="role"
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
                                {Boolean(errors.type) ? (
                                  <FormHelperText error>
                                    {errors.type}
                                  </FormHelperText>
                                ) : null}
                              </FormControl>
                            </Grid>
                            <Grid item>
                              <div style={{ display: "flex", alignItems: "center"}}>
                                <ShortTextIcon className={classes.labelIcon} />
                                <Typography color="primary">
                                  Deskripsi
                                </Typography>
                              </div>
                              <TextField
                                fullWidth
                                multiline
                                id="description"
                                type="text"
                                rows="5"
                                rowsMax="25"
                                variant="outlined"
                                onChange={this.onChange}
                                value={this.state.description}
                                error={errors.description}
                                helperText={errors.description}
                              />
                            </Grid>
                          </Grid>
                        </Grid>
                        <Hidden smDown>
                          <Grid item>
                            <Divider flexItem orientation="vertical" />
                          </Grid>
                        </Hidden>
                        <Hidden mdUp>
                          <Grid item xs={12}>
                            <Divider flexItem orientation="horizontal" />
                          </Grid>
                        </Hidden>
                        <Grid item xs={12} md className={classes.contentDetails}>
                          <Grid container direction="column" spacing={4}>
                            <Grid item>
                              <div style={{ display: "flex", alignItems: "center"}}>
                                <LibraryBooksIcon className={classes.labelIcon} />
                                <Typography color="primary">
                                  Mata Pelajaran
                                </Typography>
                              </div>
                              <FormControl
                                fullWidth
                                variant="outlined"
                                color="primary"
                                id="subject"
                                error={Boolean(errors.subject)}
                              >
                                <Select
                                  value={this.state.subject}
                                  onChange={(event) => {
                                    this.onChange(event, "subject");
                                  }}
                                >
                                  {this.state.subjectOptions !== null
                                    ? this.state.subjectOptions.map((subject) => (
                                        <MenuItem
                                          key={subject._id}
                                          value={subject._id}
                                        >
                                          {subject.name}
                                        </MenuItem>
                                      ))
                                    : null}
                                </Select>
                                {Boolean(errors.subject) ? (
                                  <FormHelperText error>
                                    {errors.subject}
                                  </FormHelperText>
                                ) : null}
                              </FormControl>
                            </Grid>
                            <Grid item>
                              <div style={{ display: "flex", alignItems: "center"}}>
                                <FaChalkboard className={classes.labelIcon} />
                                <Typography color="primary">
                                  Kelas yang diberikan
                                </Typography>
                              </div>
                              <FormControl
                                fullWidth
                                variant="outlined"
                                color="primary"
                                id="class_assigned"
                                error={Boolean(errors.class_assigned)}
                              >
                                <Select
                                  multiple
                                  value={class_assigned}
                                  onChange={(event) => this.onChange(event, "class_assigned")}
                                  MenuProps={{ classes: { paper: classes.selectPaper } }}
                                  renderValue={(selected) => (
                                    <div className={classes.chips}>
                                      {selected.map((classId) => {
                                        return (
                                          <Chip
                                            key={classId}
                                            label={
                                              this.state.allClassObject
                                                ? this.state.allClassObject[classId]
                                                : null
                                            }
                                            className={classes.chip}
                                          />
                                        );
                                      })}
                                    </div>
                                  )}
                                >
                                  {this.state.classOptions !== null
                                    ? this.state.classOptions.map((classInfo) => (
                                        <MenuItem
                                          selected={true}
                                          key={classInfo._id}
                                          value={classInfo._id}
                                        >
                                          <Checkbox
                                            color="primary"
                                            size="small"
                                            checked={class_assigned.indexOf(classInfo._id) > -1}
                                          />
                                          <ListItemText primary={classInfo.name} style={{ marginLeft: "10px" }} />
                                        </MenuItem>
                                      ))
                                    : null}
                                </Select>
                                {Boolean(errors.class_assigned) ? (
                                  <FormHelperText error>
                                    {errors.class_assigned}
                                  </FormHelperText>
                                ) : null}
                              </FormControl>
                            </Grid>
                            <Grid item>
                              {/*FIXME Start Date*/}
                              <div style={{ display: "flex", alignItems: "center"}}>
                                <TimerIcon className={classes.labelIcon} />
                                <Typography color="primary">
                                  Waktu Mulai
                                </Typography>
                              </div>
                              <MuiPickersUtilsProvider
                                locale={lokal}
                                utils={DateFnsUtils}
                              >
                                <KeyboardDateTimePicker
                                  fullWidth
                                  disablePast
                                  inputVariant="outlined"
                                  id="workTimeStart"
                                  format="dd/MM/yyyy - HH:mm"
                                  ampm={false}
                                  okLabel="Simpan"
                                  cancelLabel="Batal"
                                  minDateMessage="Harus waktu yang akan datang"
                                  invalidDateMessage="Format tanggal tidak benar"
                                  onChange={(date) => this.onChange(date, "start_date")}
                                  value={this.state.start_date}
                                  onError={(err) => {
                                    if (errors.start_date !== err) {
                                      this.setState({
                                        errors: { ...errors, start_date: err },
                                      });
                                    }
                                  }}
                                  error={
                                    errors.start_date_custom || errors.start_date
                                  }
                                  helperText={errors.start_date || errors.start_date_custom}
                                />
                              </MuiPickersUtilsProvider>
                            </Grid>
                            <Grid item>
                              <div style={{ display: "flex", alignItems: "center"}}>
                                <TimerOffIcon className={classes.labelIcon} />
                                <Typography color="primary">
                                  Waktu Selesai
                                </Typography>
                              </div>
                              <MuiPickersUtilsProvider
                                locale={lokal}
                                utils={DateFnsUtils}
                              >
                                <KeyboardDateTimePicker
                                  fullWidth
                                  inputVariant="outlined"
                                  id="workTimeEnd"
                                  format="dd/MM/yyyy - HH:mm"
                                  ampm={false}
                                  okLabel="Simpan"
                                  cancelLabel="Batal"
                                  minDate={this.state.start_date}
                                  minDateMessage="Harus setelah Waktu Mulai Pengerjaan"
                                  invalidDateMessage="Format tanggal tidak benar"
                                  onChange={(date) => this.onChange(date, "end_date")}
                                  value={this.state.end_date}
                                  onError={(err) => {
                                    if (errors.end_date !== err) {
                                      this.setState({
                                        errors: { ...errors, end_date: err },
                                      });
                                    }
                                  }}
                                  error={errors.end_date_custom || errors.end_date}
                                  helperText={errors.end_date || errors.end_date_custom}
                                />
                              </MuiPickersUtilsProvider>
                            </Grid>
                            <Grid item>
                              <FormControlLabel
                                label={
                                  <Typography color="primary">
                                    Jadwalkan Pemberian
                                  </Typography>
                                }
                                control={
                                  <Checkbox
                                    size="small"
                                    color="primary"
                                    checked={this.state.isScheduled}
                                    onChange={() => {
                                      this.handleCheckScheduleMode();
                                    }}
                                  />
                                }
                              />
                              <MuiPickersUtilsProvider
                                locale={lokal}
                                utils={DateFnsUtils}
                              >
                                <KeyboardDateTimePicker
                                  fullWidth
                                  disabled={!this.state.isScheduled}
                                  inputVariant="outlined"
                                  id="postDate"
                                  format="dd/MM/yyyy - HH:mm"
                                  ampm={false}
                                  okLabel="Simpan"
                                  cancelLabel="Batal"
                                  invalidDateMessage="Format tanggal tidak benar"
                                  onChange={(date) => this.onChange(date, "post_date")}
                                  value={this.state.post_date}
                                  onError={(err) => {
                                    if (errors.post_date !== err) {
                                      this.setState({
                                        errors: { ...errors, post_date: err },
                                      });
                                    }
                                  }}
                                  helperText={errors.post_date}
                                />
                              </MuiPickersUtilsProvider>
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
                      <TablePagination
                        component="div"
                        labelRowsPerPage="Soal Per Halaman"
                        rowsPerPageOptions={[5, 10]}
                        count={this.state.questions.length}
                        rowsPerPage={this.state.rowsPerPage}
                        page={this.state.page}
                        onChangePage={this.handleChangePage}
                        onChangeRowsPerPage={this.handleChangeRowsPerPage}
                      />
                    </Grid>
                  </Grid>
                </Grid>
              </div>
              {/* Ini belum dibuat untuk drawernya
              <Drawer
                variant="temporary"
                // anchor={theme.direction === "rtl" ? "right" : "left"}
                open={mobileOpen}
                onClose={handleDrawerMobile}
                classes={{
                  paper: classes.navigationDrawerPaper,
                }}
                ModalProps={{
                  keepMounted: true,
                }}
              >
                <List>
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
                </List>
              </Drawer>*/}
              <AppBar position="fixed" className={classes.assessmentMenu}>
                <Paper elevation={3} className={classes.assessmentMenuPaper}>
                  <Grid container justify="space-around">
                    <Grid item>
                      <Tooltip title="Navigasi Soal" placement="top">
                        <IconButton>
                          <FormatListNumberedIcon />
                        </IconButton>
                      </Tooltip>
                    </Grid>
                    <Grid item>
                      <Tooltip title="Tambah soal pilihan ganda" placement="top">
                        <IconButton onClick={() => this.handleCloseMenuTambah("radio")}>
                          <Badge badgeContent={<AddIcon fontSize="small" />}>
                            <RadioButtonCheckedIcon />
                          </Badge>
                        </IconButton>
                      </Tooltip>
                    </Grid>
                    <Grid item>
                      <Tooltip title="Tambah soal kotak centang" placement="top">
                        <IconButton onClick={() => this.handleCloseMenuTambah("checkbox")}>
                          <Badge badgeContent={<AddIcon fontSize="small" />}>
                            <CheckBoxIcon />
                          </Badge>
                        </IconButton>
                      </Tooltip>
                    </Grid>
                    <Grid item>
                      <Tooltip title="Tambah soal isian pendek" placement="top">
                        <IconButton onClick={() => this.handleCloseMenuTambah("shorttext")}>
                          <Badge badgeContent={<AddIcon fontSize="small" />}>
                            <TextFormatIcon />
                          </Badge>
                        </IconButton>
                      </Tooltip>
                    </Grid>
                    <Grid item>
                      <Tooltip title="Tambah soal uraian" placement="top">
                        <IconButton onClick={() => this.handleCloseMenuTambah("longtext")}>
                          <Badge badgeContent={<AddIcon fontSize="small" />}>
                            <SubjectIcon />
                          </Badge>
                        </IconButton>
                      </Tooltip>
                    </Grid>
                  </Grid>
                </Paper>
              </AppBar>
            </form>
            <UploadDialog
              openUploadDialog={this.state.openUploadDialog}
              success={success}
              messageUploading={`${this.state.type} sedang disunting`}
              messageSuccess={`${this.state.type} telah disunting`}
              redirectLink={
                this.state.type === "Kuis"
                  ? `/kuis-guru/${this.props.match.params.id}`
                  : `/ujian-guru/${this.props.match.params.id}`
              }
            />
            <DeleteDialog
              openDeleteDialog={this.state.openDeleteDialog}
              handleCloseDeleteDialog={this.handleCloseDeleteDialog}
              itemType={
                this.state.type
                  ? `perubahan pada ${this.state.type}`
                  : "perubahan Penilaian"
              }
              redirectLink={
                this.state.type === "Kuis"
                  ? `/kuis-guru/${this.props.match.params.id}`
                  : `/ujian-guru/${this.props.match.params.id}`
              }
            />
            <Snackbar
              open={this.state.checkboxSnackbarOpen}
              autoHideDuration={6000}
              onClose={this.handleCloseCheckboxErrorSnackBar}
            >
              <Alert
                onClose={this.handleCloseCheckboxErrorSnackBar}
                severity="error"
              >
                Soal Dalam Bentuk Checkbox Minimal Memiliki Satu Jawaban.
              </Alert>
            </Snackbar>
            <Snackbar
              open={this.state.radioSnackbarOpen}
              autoHideDuration={6000}
              onClose={this.handleCloseRadioErrorSnackBar}
            >
              <Alert
                onClose={this.handleCloseRadioErrorSnackBar}
                severity="error"
              >
                Soal Dalam Bentuk Pilihan Ganda Minimal Memiliki Satu Jawaban.
              </Alert>
            </Snackbar>
            <Snackbar
              open={this.state.copySnackbarOpen}
              autoHideDuration={6000}
              onClose={this.handleCloseCopySnackBar}
            >
              <Alert onClose={this.handleCloseCopySnackBar} severity="success">
                Tautan {this.state.type} berhasil disalin ke Clipboard Anda!
              </Alert>
            </Snackbar>
            <Snackbar
              open={this.state.snackbarOpen}
              autoHideDuration={4000}
              onClose={this.handleCloseErrorSnackbar}
              anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            >
              <Alert
                elevation={6}
                variant="filled"
                onClose={this.handleCloseSnackbar}
                severity="error"
              >
                Masih ada bagian yang belum diisi atau salah, silakan diperiksa
                kembali!
              </Alert>
            </Snackbar>
            <Snackbar
              open={this.state.fileLimitSnackbar}
              autoHideDuration={4000}
              onClose={this.handleFileLimitSnackbar}
              anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            >
              <Alert elevation={6} variant="filled" severity="error">
                {this.state.over_limit.length} file melebihi batas{" "}
                {this.props.settingsCollection.upload_limit}MB!
              </Alert>
            </Snackbar>
          </div>
        </div>
      );
    }
  }
}

EditAssessment.propTypes = {
  auth: PropTypes.object.isRequired,
  classesCollection: PropTypes.object.isRequired,
  getAllClass: PropTypes.func.isRequired,
  getAllSubjects: PropTypes.func.isRequired,
  assessmentsCollection: PropTypes.object.isRequired,
  getOneAssessment: PropTypes.func.isRequired,
  updateAssessment: PropTypes.func.isRequired,
  success: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  clearErrors: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  classesCollection: state.classesCollection,
  subjectsCollection: state.subjectsCollection,
  assessmentsCollection: state.assessmentsCollection,
  settingsCollection: state.settingsCollection,
  success: state.success,
  errors: state.errors,
});

export default connect(mapStateToProps, {
  getAllClass,
  getAllSubjects,
  getOneAssessment,
  updateAssessment,
  validateAssessment,
  getFileAssessment,
  refreshTeacher,
  getSetting,
  clearErrors,
})(withStyles(styles)(React.memo(EditAssessment)));
