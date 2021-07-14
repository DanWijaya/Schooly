import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import classnames from "classnames";
import "date-fns";
import {
  getFileMaterials,
  downloadFileMaterial,
  viewFileMaterial,
  getAllS3,
} from "../../../actions/files/FileMaterialActions";
import { getAllClass } from "../../../actions/ClassActions";
import { getAllSubjects } from "../../../actions/SubjectActions";
import { getOneMaterial } from "../../../actions/MaterialActions";
import { updateMaterial} from "../../../actions/MaterialActions"
import { clearErrors } from "../../../actions/ErrorActions"
import { clearSuccess } from "../../../actions/SuccessActions"
import { refreshTeacher } from "../../../actions/UserActions";
import UploadDialog from "../../misc/dialog/UploadDialog";
import DeleteDialog from "../../misc/dialog/DeleteDialog";
import LightTooltip from "../../misc/light-tooltip/LightTooltip";
import {
  Avatar,
  Button,
  Chip,
  Divider,
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  MenuItem,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Paper,
  Select,
  Snackbar,
  TextField,
  Typography,
} from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import MuiAlert from "@material-ui/lab/Alert";
import AttachFileIcon from "@material-ui/icons/AttachFile";
import DeleteIcon from "@material-ui/icons/Delete";
import {
  FaFile,
  FaFileAlt,
  FaFileExcel,
  FaFileImage,
  FaFilePdf,
  FaFilePowerpoint,
  FaFileWord,
} from "react-icons/fa";

const path = require("path");
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
    padding: "20px",
  },
  divider: {
    [theme.breakpoints.down("md")]: {
      width: "100%",
      height: "1px",
    },
  },
  chips: {
    display: "flex",
    flexWrap: "wrap",
  },
  chip: {
    marginRight: 2,
  },
  addFileButton: {
    backgroundColor: theme.palette.primary.main,
    color: "white",
    "&:focus, &:hover": {
      backgroundColor: theme.palette.primary.main,
      color: "white",
    },
  },
  deleteIconButton: {
    marginLeft: "7.5px",
    backgroundColor: theme.palette.error.dark,
    color: "white",
    "&:focus, &:hover": {
      backgroundColor: "white",
      color: theme.palette.error.dark,
    },
  },
  wordFileTypeIcon: {
    backgroundColor: "#16B0DD",
  },
  excelFileTypeIcon: {
    backgroundColor: "#68C74F",
  },
  imageFileTypeIcon: {
    backgroundColor: "#974994",
  },
  pdfFileTypeIcon: {
    backgroundColor: "#E43B37",
  },
  textFileTypeIcon: {
    backgroundColor: "#F7BC24",
  },
  presentationFileTypeIcon: {
    backgroundColor: "#FD931D",
  },
  otherFileTypeIcon: {
    backgroundColor: "#808080",
  },
  editMaterialButton: {
    backgroundColor: theme.palette.primary.main,
    color: "white",
    "&:focus, &:hover": {
      backgroundColor: theme.palette.primary.main,
      color: "white",
    },
  },
  cancelButton: {
    backgroundColor: theme.palette.error.main,
    color: "white",
    "&:focus, &:hover": {
      backgroundColor: theme.palette.error.main,
      color: "white",
    },
    marginRight: "7.5px",
  },
  zeroHeightHelperText: {
    height: "0",
    display: "flex" // untuk men-disable "collapsing margin"
  }
});

function LampiranFile(props) {
  const { classes, name, filetype, i, handleLampiranDelete } = props;

  return (
    <Grid item xs={12}>
      <Paper variant="outlined">
        <ListItem disableRipple>
          <ListItemAvatar>
            {filetype === "Word" ? (
              <Avatar className={classes.wordFileTypeIcon}>
                <FaFileWord />
              </Avatar>
            ) : filetype === "Excel" ? (
              <Avatar className={classes.excelFileTypeIcon}>
                <FaFileExcel />
              </Avatar>
            ) : filetype === "Gambar" ? (
              <Avatar className={classes.imageFileTypeIcon}>
                <FaFileImage />
              </Avatar>
            ) : filetype === "PDF" ? (
              <Avatar className={classes.pdfFileTypeIcon}>
                <FaFilePdf />
              </Avatar>
            ) : filetype === "Teks" ? (
              <Avatar className={classes.textFileTypeIcon}>
                <FaFileAlt />
              </Avatar>
            ) : filetype === "Presentasi" ? (
              <Avatar className={classes.presentationFileTypeIcon}>
                <FaFilePowerpoint />
              </Avatar>
            ) : filetype === "File Lainnya" ? (
              <Avatar className={classes.otherFileTypeIcon}>
                <FaFile />
              </Avatar>
            ) : null}
          </ListItemAvatar>
          <ListItemText
            primary={
              <LightTooltip title={name} placement="top">
                <Typography>
                  {name.length < 21
                    ? name
                    : `${name.slice(0, 15)}..${path.extname(name)}`}
                </Typography>
              </LightTooltip>
            }
            secondary={filetype}
          />
          <LightTooltip title="Hapus Lampiran">
            <IconButton
              size="small"
              className={classes.deleteIconButton}
              onClick={(e) => {
                handleLampiranDelete(e, i);
              }}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </LightTooltip>
        </ListItem>
      </Paper>
    </Grid>
  );
}

class EditMaterial extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      // name1: "",
      subject: "",
      focused: false,
      class_assigned: [],
      description: "",
      errors: {},
      success: null,
      anchorEl: null,
      classChanged: false,
      originalFileLampiran: [],
      fileLampiran: [],
      fileLampiranToAdd: [],
      fileLampiranToDelete: [],
      openDeleteDialog: null,
      over_limit: [],
      fileLimitSnackbar: false,
      classOptions: null, // akan ditampilkan sebagai MenuItem pada saat memilih kelas
      subjectOptions: null, // akan ditampilkan sebagai MenuItem pada saat memilih matpel
      allClassObject: null, // digunakan untuk mendapatkan nama kelas dari id kelas tanpa perlu men-traverse array yang berisi semua kelas 
      allSubjectObject: null // digunakan untuk mendapatkan nama matpel dari id matpel tanpa perlu men-traverse array yang berisi semua matpel
    };
  }

  lampiranUploader = React.createRef(null);

  componentDidMount() {
    const {
      getAllClass,
      getAllSubjects,
      getOneMaterial,
      getFileMaterials,
      refreshTeacher
    } = this.props;
    const { id } = this.props.match.params;

    getAllClass();
    getOneMaterial(id);
    getAllSubjects();
    getFileMaterials(id).then((result) => {
      this.setState({ fileLampiran: result, originalFileLampiran: result });
    });
    refreshTeacher(this.props.auth.user._id);
  }

  componentWillUnmount() {
    this.props.clearErrors();
    this.props.clearSuccess();
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    console.log("Materials props is");
    const { selectedMaterials } = nextProps.materialsCollection;
    // console.log(selectedMaterials.deadline);

    this.setState({
      name: selectedMaterials.name,
      subject: selectedMaterials.subject,
      deadline: selectedMaterials.deadline,
      class_assigned: Boolean(selectedMaterials.class_assigned)
        ? selectedMaterials.class_assigned
        : [],
      description: selectedMaterials.description,
      // so need to check if selectedMaterials is undefined or not because when calling fileLAmpiran.length, there will be an error.
    });
  }

  componentDidUpdate(prevProps, prevState) {
    // pembandingan info guru (auth.user) dilakukan agar pembaruan info guru oleh admin dapat memperbarui opsi kelas dan mata pelajaran
    if (prevState.classOptions === null || JSON.stringify(prevProps.auth.user) !== JSON.stringify(this.props.auth.user)) {
      const selectedMaterialProps = this.props.materialsCollection.selectedMaterials;

      if (this.props.classesCollection.all_classes && (this.props.classesCollection.all_classes.length !== 0) && 
      selectedMaterialProps && selectedMaterialProps.constructor === Object && (Object.keys(selectedMaterialProps).length !== 0)) {
        
        let all_classes_obj = {};
        this.props.classesCollection.all_classes.forEach((classInfo) => {
          all_classes_obj[classInfo._id] = classInfo.name; 
        });

        // mencari semua kelas yang diajarkan oleh guru ini untuk matpel yang telah dipilih
        let newClassOptions = [];
        if (this.props.auth.user.class_to_subject) {
          for (let [classId, subjectIdArray] of Object.entries(this.props.auth.user.class_to_subject)) {
            if (subjectIdArray.includes(selectedMaterialProps.subject)) {
              newClassOptions.push({ _id: classId, name: all_classes_obj[classId] });
            }
          }
        }

        this.setState({ classOptions: newClassOptions, allClassObject: all_classes_obj });
      }
    }

    if (prevState.subjectOptions === null || JSON.stringify(prevProps.auth.user) !== JSON.stringify(this.props.auth.user)) {
      const selectedMaterialProps = this.props.materialsCollection.selectedMaterials;

      if ( this.props.subjectsCollection.all_subjects && ( this.props.subjectsCollection.all_subjects.length !== 0) &&
      selectedMaterialProps && selectedMaterialProps.constructor === Object && (Object.keys(selectedMaterialProps).length !== 0)) {
        
        let all_subjects_obj = {};
         this.props.subjectsCollection.all_subjects.forEach((subjectInfo) => {
          all_subjects_obj[subjectInfo._id] = subjectInfo.name; 
        });
  
        // mencari matpel yang diajarkan ke semua kelas yang sedang dipilih
        let subjectMatrix = [];
        if (this.props.auth.user.class_to_subject) {
          for (let classId of selectedMaterialProps.class_assigned) {
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
          newSubjectOptions.push({ _id: subjectId, name: all_subjects_obj[subjectId] });
        })

        this.setState({ subjectOptions: newSubjectOptions, allSubjectObject: all_subjects_obj });
      }
    }
  }

  onSubmit = (e, classesOptions) => {
    e.preventDefault();

    const { id } = this.props.match.params;
    const {
      class_assigned,
      fileLampiranToAdd,
      fileLampiranToDelete,
    } = this.state;
    const materialObject = {
      name: this.state.name,
      deadline: this.state.deadline,
      subject: this.state.subject,
      description: this.state.description,
      class_assigned: this.state.class_assigned,
      lampiran: Array.from(this.state.fileLampiran),
      errors: {},
    };

    // if (classChanged)
    //   materialObject.class_assigned = classesSelected // When the classes is changed
    // else
    //   materialObject.class_assigned = class_assigned // When it has no change

    let formData = new FormData();
    for (var i = 0; i < fileLampiranToAdd.length; i++) {
      console.log(this.state.fileLampiran[i]);
      formData.append("lampiran_materi", this.state.fileLampiranToAdd[i]);
    }

    const { selectedMaterials } = this.props.materialsCollection;
    this.handleOpenUploadDialog();
    this.props
      .updateMaterial(
        formData,
        fileLampiranToDelete,
        selectedMaterials.lampiran,
        materialObject,
        id,
        this.props.history
      )
      .then((res) => this.setState({ success: res }))
      .catch((err) => {
        this.handleCloseUploadDialog()
        this.setState({
          errors: err,
          fileLampiran: [
            ...this.state.originalFileLampiran,
            ...this.state.fileLampiranToAdd,
          ],
          fileLampiranToDelete: [],
        })
      }
      );
    // this.setState({ fileLampiranToDelete: [] });
  };

  handleLampiranUpload = (e) => {
    const files = Array.from(e.target.files);
    if (this.state.fileLampiran.length === 0) {
      let over_limit = files.filter((file) => file.size / Math.pow(10, 6) > 10);
      let allowed_file = files.filter(
        (file) => file.size / Math.pow(10, 6) <= 10
      );
      this.setState({
        fileLampiran: allowed_file,
        fileLampiranToAdd: allowed_file,
        over_limit: over_limit,
        fileLimitSnackbar: over_limit.length > 0,
      });
    } else {
      if (files.length !== 0) {
        let allowed_file = files.filter(
          (file) => file.size / Math.pow(10, 6) <= 10
        );
        let over_limit = files.filter(
          (file) => file.size / Math.pow(10, 6) > 10
        );

        let temp = [...this.state.fileLampiran, ...allowed_file];
        let file_to_upload = [...this.state.fileLampiranToAdd, ...allowed_file];
        allowed_file = temp;
        this.setState({
          fileLampiran: allowed_file,
          fileLampiranToAdd: file_to_upload,
          over_limit: over_limit,
          fileLimitSnackbar: over_limit.length > 0,
        });
      }
    }
    document.getElementById("file_control").value = null;
  };

  handleLampiranDelete = (e, i, name) => {
    e.preventDefault();
    console.log("Index is: ", i);
    let temp = Array.from(this.state.fileLampiran);
    let tempToDelete = this.state.fileLampiranToDelete;
    let tempToAdd = this.state.fileLampiranToAdd;
    // For the one that has already been uploaded, there will be a filename field (yang belum adanya name)
    // For the one that has already in DB
    if (this.state.fileLampiran[i].filename !== undefined) {
      // Remove the file in fileLampiranToDelete
      tempToDelete.push(temp[i]);
    } else {
      // For the one that"s not yet in DB
      // Remove the file in fileLampiranToAdd
      for (var j = 0; j < tempToAdd.length; j++) {
        if (tempToAdd[j].name === temp[i].name) {
          tempToAdd.splice(j, 1);
        }
      }
    }
    temp.splice(i, 1);
    if (temp.length === 0) this.handleCloseMenu();
    this.setState({
      fileLampiran: temp,
      fileLampiranToAdd: tempToAdd,
      fileLampiranToDelete: tempToDelete,
    });
  };

  handleClickMenu = (event) => {
    if (!Boolean(this.state.anchorEl) && this.state.fileLampiran.length > 0)
      this.setState({ anchorEl: event.currentTarget });
  };

  handleCloseMenu = () => {
    this.setState({ anchorEl: null });
  };

  handleOpenUploadDialog = () => {
    this.setState({ openUploadDialog: true });
  };

  handleCloseUploadDialog = () => {
    this.setState({ openUploadDialog: false });
  }

  handleOpenDeleteDialog = () => {
    this.setState({ openDeleteDialog: true });
  };

  handleCloseDeleteDialog = () => {
    this.setState({ openDeleteDialog: false });
  };

  onChange = (e, otherfield=null) => {
    // dipindahkan (kode yg dari merge_fitur_4_cdn ada di bawah dan dikomen) 
    let field = otherfield ? otherfield : e.target.id;
    if (this.state.errors[field]) {
      this.setState({ errors: { ...this.state.errors, [field]: null } });
    }
    // this.setState({ [field]: e.target.value }); // di sini jadi dikomen

    if (otherfield) {
      if (otherfield === "deadline") {
        this.setState({ [otherfield]: e });
        // e is the date value itself for KeyboardDatePicker
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
          let subjects= []; 
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

    // dari merge_fitur_4_cdn
    // let field = e.target.id ? e.target.id : otherfield;
    // if (this.state.errors[field]) {
    //   this.setState({ errors: { ...this.state.errors, [field]: null } });
    // }
    // this.setState({ [field]: e.target.value });
  };

  onDateChange = (date) => {
    // console.log(date);
    this.setState({ deadline: date });
  };

  handleCloseErrorSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    this.setState({ fileLimitSnackbar: false });
  };

  render() {
    const { classes } = this.props;
    const { all_classes } = this.props.classesCollection;
    const { all_subjects } = this.props.subjectsCollection;
    const { selectedMaterials } = this.props.materialsCollection;
    const { class_assigned, fileLampiran, errors, success } = this.state;
    const { user } = this.props.auth;

    // console.log("FileLampiran:", this.state.fileLampiran)
    // console.log("FileLampiran to add:", this.state.fileLampiranToAdd);
    // console.log("FileLampiran to delete:", this.state.fileLampiranToDelete);

    console.log(all_classes);
    console.log(selectedMaterials);

    let classIds = [];
    const ITEM_HEIGHT = 48;
    const ITEM_PADDING_TOP = 8;
    const MenuProps = {
      PaperProps: {
        style: {
          maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
          width: 250,
        },
      },
    };

    const fileType = (filename) => {
      let ext_file = path.extname(filename);
      switch (ext_file) {
        case ".docx":
          return "Word";
        case ".xlsx":
        case ".csv":
          return "Excel";

        case ".png":
        case ".jpg":
        case ".jpeg":
          return "Gambar";

        case ".pdf":
          return "PDF";

        case ".txt":
        case ".rtf":
          return "Teks";

        case ".ppt":
        case ".pptx":
          return "Presentasi";

        default:
          return "File Lainnya";
      }
    };

    const listFileChosen = () => {
      let temp = [];
      if (fileLampiran.length > 0) {
        for (var i = 0; i < fileLampiran.length; i++) {
          temp.push(
            <LampiranFile // The one that is being displayed is in DB (filename) and the one that has just been uploaded (name)
              classes={classes}
              name={
                !fileLampiran[i].filename
                  ? fileLampiran[i].name
                  : fileLampiran[i].filename
              }
              filetype={
                !fileLampiran[i].filename
                  ? fileType(fileLampiran[i].name)
                  : fileType(fileLampiran[i].filename)
              }
              handleLampiranDelete={this.handleLampiranDelete}
              i={i}
            />
          );
        }
      }
      return temp;
    };

    if (this.state.class_assigned !== null)
      //When firstly received.
      this.state.class_assigned.map((kelas) => {
        if (kelas._id !== undefined) return classIds.push(kelas._id);
        else return classIds.push(kelas);
      });

    document.title = "Schooly | Sunting Materi";

    if (user.role === "Teacher" || user.role === "Admin") {
      return (
        <div className={classes.root}>
          <UploadDialog
            openUploadDialog={this.state.openUploadDialog}
            handleCloseUploadDialog={this.handleCloseUploadDialog}
            success={success}
            messageUploading="Materi sedang disunting"
            messageSuccess="Materi telah disunting"
            redirectLink={`/materi/${this.props.match.params.id}`}
          />
          <DeleteDialog
            openDeleteDialog={this.state.openDeleteDialog}
            handleCloseDeleteDialog={this.handleCloseDeleteDialog}
            itemType={"Sunting"}
            itemName={this.state.name}
            // isLink={true}
            // redirectLink="/daftar-kuis"
            redirectLink={`/daftar-materi`}
            isWarning={false}
          />
          <Paper>
            <div className={classes.content}>
              <Typography variant="h5" gutterBottom>
                <b>Sunting Materi</b>
              </Typography>
            </div>
            <Divider />
            <form noValidate onSubmit={(e) => this.onSubmit(e, user._id)}>
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
                        onChange={this.onChange}
                        value={this.state.name}
                        error={errors.name}
                        type="text"
                        // helperText={errors.name}
                        className={classnames("", {
                          invalid: errors.name,
                        })}
                      />
                      {errors.name
                        ?
                        <div className={classes.zeroHeightHelperText}>
                          <FormHelperText variant="outlined" error>{errors.name}</FormHelperText>
                        </div>
                        : null}
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
                        fullWidth
                        multiline
                        rows="5"
                        rowsMax="25"
                        variant="outlined"
                        id="description"
                        onChange={(e) => this.onChange(e, "description")}
                        value={this.state.description}
                        error={errors.description}
                        type="text"
                        // helperText={errors.description}
                        className={classnames("", {
                          invalid: errors.description,
                        })}
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
                        Kelas yang Diberikan
                      </Typography>
                      <FormControl
                        variant="outlined"
                        fullWidth
                        error={Boolean(errors.class_assigned)}
                      >
                        <Select
                          multiple
                          id="class_assigned"
                          MenuProps={MenuProps}
                          value={class_assigned}
                          onChange={(event) => {
                            this.onChange(event, "class_assigned");
                          }}
                          renderValue={(selected) => {
                            return (
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
                            );
                          }}
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
                    <Grid item>
                      <input
                        type="file"
                        id="file_control"
                        multiple={true}
                        name="lampiran"
                        onChange={this.handleLampiranUpload}
                        ref={this.lampiranUploader}
                        accept="file/*"
                        style={{ display: "none" }}
                      />
                      <Button
                        variant="contained"
                        startIcon={<AttachFileIcon />}
                        onClick={() => {
                          this.lampiranUploader.current.click();
                        }}
                        className={classes.addFileButton}
                      >
                        Tambah Lampiran Berkas
                      </Button>
                      <FormHelperText error>
                        {errors.lampiran_materi ?? "\u200B"}
                      </FormHelperText>
                      <Grid container spacing={1} style={{ marginTop: "10px" }}>
                        {listFileChosen()}
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
              <Divider />
              <div
                style={{ display: "flex", justifyContent: "flex-end" }}
                className={classes.content}
              >
                <div style={{ display: "flex", flexDirection: "row" }}>
                  <Button
                    variant="contained"
                    className={classes.cancelButton}
                    onClick={this.handleOpenDeleteDialog}
                  >
                    Batal
                  </Button>
                  <Button
                    variant="contained"
                    type="submit"
                    className={classes.editMaterialButton}
                  >
                    Sunting Materi
                  </Button>
                </div>
              </div>
            </form>
          </Paper>
          <Snackbar
            open={this.state.fileLimitSnackbar}
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
              {this.state.over_limit.length} file melebihi batas 10MB!
            </MuiAlert>
          </Snackbar>
        </div>
      );
    } else {
      return (
        <div className={classes.root}>
          <Typography variant="h5" align="center">
            <b>Anda tidak mempunyai izin akses halaman ini.</b>
          </Typography>
        </div>
      );
    }
  }
}
EditMaterial.propTypes = {
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  success: PropTypes.object.isRequired,
  classesCollection: PropTypes.object.isRequired,
  subjectsCollection: PropTypes.object.isRequired,
  materialsCollection: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  errors: state.errors,
  auth: state.auth,
  success: state.success,
  materialsCollection: state.materialsCollection,
  classesCollection: state.classesCollection,
  subjectsCollection: state.subjectsCollection,
});

export default connect(mapStateToProps, {
  getAllClass,
  getAllSubjects,
  clearErrors,
  clearSuccess,
  getOneMaterial,
  updateMaterial,
  getFileMaterials,
  refreshTeacher
})(withStyles(styles)(EditMaterial));
