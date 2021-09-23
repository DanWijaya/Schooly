import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import DateFnsUtils from "@date-io/date-fns";
import "date-fns";
import lokal from "date-fns/locale/id";
import classnames from "classnames";
import { createTask } from "../../../actions/TaskActions";
import { getAllClass } from "../../../actions/ClassActions";
import { getAllSubjects } from "../../../actions/SubjectActions";
import { getOneUser, refreshTeacher } from "../../../actions/UserActions";
import { clearErrors } from "../../../actions/ErrorActions";
import { clearSuccess } from "../../../actions/SuccessActions";
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
  ListItem,
  ListItemAvatar,
  ListItemText,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
  Snackbar,
} from "@material-ui/core";
import {
  MuiPickersUtilsProvider,
  KeyboardDateTimePicker,
} from "@material-ui/pickers";
import { withStyles } from "@material-ui/core/styles";
import AttachFileIcon from "@material-ui/icons/AttachFile";
import Alert from "@material-ui/lab/Alert";
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
import {getSetting} from "../../../actions/SettingActions";

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
  createTaskButton: {
    backgroundColor: theme.palette.success.main,
    color: "white",
    "&:focus, &:hover": {
      backgroundColor: theme.palette.success.main,
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
  customSpacing: {
    [theme.breakpoints.down("sm")]: {
      marginTop: theme.spacing(2),
    }
  },
  zeroHeightHelperText: {
    height: "0",
    display: "flex" // untuk men-disable "collapsing margin"
  }
});

// name = fileLampiran[i].name
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

class CreateTask extends Component {
  constructor() {
    super();
    this.state = {
      name: "",
      subject: "",
      deadline: null,
      focused: false,
      class_assigned: [],
      description: "",
      errors: {},
      success: null,
      fileLampiran: [],
      openUploadDialog: null,
      openDeleteDialog: null,
      anchorEl: null,
      over_limit: [],
      fileLimitSnackbar: false,
      classOptions: null, // akan ditampilkan sebagai MenuItem pada saat memilih kelas
      subjectOptions: null, // akan ditampilkan sebagai MenuItem pada saat memilih matpel
      allClassObject: null, // digunakan untuk mendapatkan nama kelas dari id kelas tanpa perlu men-traverse array yang berisi semua kelas 
      allSubjectObject: null // digunakan untuk mendapatkan nama matpel dari id matpel tanpa perlu men-traverse array yang berisi semua matpel
    };
  }

  // ref itu untuk ngerefer html yang ada di render.
  lampiranUploader = React.createRef(null); // untuk ngerefer html object yang lain

  handleClickMenu = (event) => {
    //Needed so it will not be run when filetugas = null or filetugas array is empty
    if (this.state.fileLampiran.length > 0 && !Boolean(this.state.anchorEl))
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

  onChange = (e, otherfield = null) => {
    // dipindahkan (kode yg dari merge_fitur_4_cdn ada di bawah dan dikomen) 
    let field = otherfield ? otherfield : e.target.id;
    if (this.state.errors[field]) {
      this.setState({ errors: { ...this.state.errors, [field]: null } });
    }
    // this.setState({ [field]: e.target.value }); // di sini jadi dikomen

    // if (Object.keys(this.props.errors).length !== 0)
    if (otherfield) {
      if (otherfield === "subject") { // jika guru memilih mata pelajaran
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
        // karena e.target.id tidak menerima idnya pas kita define di Select atau KeybaordDatePicker
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
    this.setState({ deadline: date , errors: {...this.state.errors, deadline: ""}});
  };

  onSubmit = (e, id) => {
    e.preventDefault();
    let formData = new FormData();
    const taskData = {
      name: this.state.name,
      deadline: this.state.deadline,
      subject: this.state.subject,
      class_assigned: this.state.class_assigned,
      person_in_charge_id: id,
      description: this.state.description,
      
    };

    //Check if there is any lampiran_tugas uploaded or not.
    if (this.state.fileLampiran)
      for (var i = 0; i < this.state.fileLampiran.length; i++) {
        formData.append("lampiran_tugas", this.state.fileLampiran[i]);
      }

    this.handleOpenUploadDialog();
    this.props
      .createTask(formData, taskData, this.props.history)
      .then((res) => this.setState({success: res}))
      .catch((err) => {
        console.log(err);
        this.handleCloseUploadDialog();
        this.setState({ errors: err })
      });
  };

  componentDidMount() {
    const { getAllClass, getAllSubjects, refreshTeacher, getSetting } = this.props;
    getAllClass();
    getAllSubjects();
    refreshTeacher(this.props.auth.user._id);
    getSetting();
  }

  componentWillUnmount() {
    this.props.clearErrors();
    this.props.clearSuccess();
  }

  // akan selalu dirun kalau ada terima state atau props yang berubah.
  componentDidUpdate(prevProps, prevState) {
    // console.log(this.props.errors);
    // this.props.errors = false, ini berarti kan !this.props.erros itu true

    if (!this.props.errors && this.props.errors !== prevProps.errors) {
      // pertama kali run yang didalam ini, itu this.props.errors = false dan prevProps.errors = { "description": dedwde}, this.state.dialogopen = false, prevState.dialog = false
      // setelah ngerun this.handleOpenUploadDialog(), komponennya dirender lagi. Karena itu jd tuh prevProps.errors = false, this.props.errors = false. maka this.props.errors = false dan prevProps.errors = false. this.state.dialog = true, prevState.dialog = false
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

  handleCloseErrorSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    this.setState({ fileLimitSnackbar: false });
  };

  handleLampiranUpload = (e) => {
    const files = e.target.files;
    const uploadLimit = this.props.settingsCollection.upload_limit;
    let temp = [...Array.from(this.state.fileLampiran), ...Array.from(files)];
    let over_limit = temp.filter((file) => file.size / Math.pow(10, 6) > uploadLimit);
    let file_to_upload = temp.filter(
      (file) => file.size / Math.pow(10, 6) <= uploadLimit
    );
    this.setState({
      fileLampiran: file_to_upload,
      over_limit: over_limit,
      fileLimitSnackbar: over_limit.length > 0,
    });
    document.getElementById("file_control").value = null;
  };

  handleLampiranDelete = (e, i) => {
    e.preventDefault();
    console.log("Index is: ", i);
    let temp = Array.from(this.state.fileLampiran);
    temp.splice(i, 1);
    if (temp.length === 0)
      //If it is empty.
      this.handleCloseMenu();
    this.setState({ fileLampiran: temp });
  };

  render() {
    const { classes } = this.props;
    const { class_assigned, fileLampiran, errors, success } = this.state;
    const { all_classes } = this.props.classesCollection;
    const { all_subjects } = this.props.subjectsCollection;
    const { user } = this.props.auth;
    console.log(errors);

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
          console.log(i);
          temp.push(
            <LampiranFile
              classes={classes}
              name={fileLampiran[i].name}
              filetype={fileType(fileLampiran[i].name)}
              handleLampiranDelete={this.handleLampiranDelete}
              i={i}
            />
          );
        }
      }
      return temp;
    };

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

    document.title = "Schooly | Buat Tugas";
    console.log(errors);
    if (user.role === "Teacher") {
      return (
        <div className={classes.root}>
          <UploadDialog
            openUploadDialog={this.state.openUploadDialog}
            success={success}
            messageUploading="Tugas sedang dibuat"
            messageSuccess="Tugas telah dibuat"
            redirectLink={`/tugas-guru/${success}`}
          />
          <DeleteDialog
            openDeleteDialog={this.state.openDeleteDialog}
            handleCloseDeleteDialog={this.handleCloseDeleteDialog}
            itemType={"Tugas"}
            itemName={this.state.name}
            // isLink={true}
            // redirectLink="/daftar-kuis"
            redirectLink={`/daftar-tugas`}
            isWarning={false}
          />
          <Paper>
            <div className={classes.content}>
              <Typography variant="h5" gutterBottom>
                <b>Buat Tugas</b>
              </Typography>
              <Typography color="textSecondary">
                Tambahkan keterangan tugas untuk membuat tugas.
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
                        // onChange={(event) => this.onChange(event)}
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
                    <Grid item container spacing={2}>
                      <Grid item xs={12} md={6}>
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
                      <Grid item xs={12} md={6} className={classes.customSpacing}>
                        <Typography
                          component="label"
                          for="deadline"
                          color="primary"
                        >
                          Batas Waktu
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
                            id="deadline"
                            value={this.state.deadline}
                            helperText={null}
                            onChange={(date) => this.onDateChange(date)}
                            // onError={(err) => {
                            //   if (errors.deadline !== err) {
                            //     this.setState({errors: { ...errors, deadline: err }});
                            //   }
                            // }}
                            error={Boolean(errors.deadline)}
                          />
                          
                            <div className={classes.zeroHeightHelperText}>
                              <FormHelperText variant="outlined" error>{errors.deadline}</FormHelperText>
                              
                            </div>
                        </MuiPickersUtilsProvider>
                      </Grid>
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
                    <Grid item>
                      <input
                        id="file_control"
                        type="file"
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
                    className={classes.createTaskButton}
                  >
                    Buat Tugas
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
            <Alert
              elevation={6}
              variant="filled"
              onClose={this.handleCloseSnackbar}
              severity="error"
            >
              {this.state.over_limit.length} file melebihi batas {this.props.settingsCollection.upload_limit}MB!
            </Alert>
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

CreateTask.propTypes = {
  errors: PropTypes.object.isRequired,
  success: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  errors: state.errors,
  success: state.success,
  subjectsCollection: state.subjectsCollection,
  classesCollection: state.classesCollection,
  settingsCollection: state.settingsCollection
});

export default connect(mapStateToProps, {
  createTask,
  getAllClass,
  getAllSubjects,
  getOneUser,
  clearErrors,
  clearSuccess,
  refreshTeacher,
  getSetting
})(withStyles(styles)(CreateTask));
