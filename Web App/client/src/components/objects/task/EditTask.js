import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import DateFnsUtils from "@date-io/date-fns";
import lokal from "date-fns/locale/id";
import "date-fns";
import { getAllClass } from "../../../actions/ClassActions";
import { getOneTask, updateTask } from "../../../actions/TaskActions";
import { getAllSubjects } from "../../../actions/SubjectActions";
import { getFileTasks } from "../../../actions/files/FileTaskActions";
import { refreshTeacher } from "../../../actions/UserActions";
import { getSetting } from "../../../actions/SettingActions";
import { clearSuccess } from "../../../actions/SuccessActions";
import { clearErrors } from "../../../actions/ErrorActions";
import FileAttachment from "../file/FileAttachment";
import FloatingHelp from "../../misc/floating-help/FloatingHelp";
import UploadDialog from "../../misc/dialog/UploadDialog";
import DeleteDialog from "../../misc/dialog/DeleteDialog";
import {
  AppBar,
  Button,
  Checkbox,
  Chip,
  Divider,
  FormControl,
  FormHelperText,
  Grid,
  Hidden,
  IconButton,
  ListItemText,
  MenuItem,
  Paper,
  Select,
  Snackbar,
  TextField,
  Typography,
} from "@material-ui/core";
import {
  MuiPickersUtilsProvider,
  KeyboardDateTimePicker,
} from "@material-ui/pickers";
import Alert from "@material-ui/lab/Alert";
import {
  AssignmentOutlined as AssignmentIcon,
  AttachFile as AttachFileIcon,
  Close as CloseIcon,
  LibraryBooks as LibraryBooksIcon,
  ShortText as ShortTextIcon,
  TimerOff as TimerOffIcon,
} from "@material-ui/icons";
import { withStyles } from "@material-ui/core/styles";
import { FaChalkboard } from "react-icons/fa";

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
    boxShadow: "0 1px 6px 0px rgba(32,33,36,0.28)",
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
      boxShadow:
        "0px 1px 2px 0px rgba(194,100,1,0.3), 0px 2px 6px 2px rgba(194,100,1,0.15)",
    },
    [theme.breakpoints.down("sm")]: {
      width: "100%",
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
  },
  contentDetails: {
    padding: "20px 20px 25px 20px",
  },
  label: {
    display: "flex",
    alignItems: "center",
  },
  labelIcon: {
    width: "1rem",
    height: "1rem",
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
  addFileButton: {
    margin: "20px 0px",
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
});

class EditTask extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      subject: "",
      deadline: new Date(),
      class_assigned: [],
      classChanged: false,
      focused: false,
      description: "",
      originalFileLampiran: [],
      fileLampiran: [],
      fileLampiranToAdd: [],
      fileLampiranToDelete: [],
      fileLimitSnackbar: false,
      over_limit: [],
      anchorEl: null,
      openUploadDialog: null,
      openDeleteDialog: null,
      classOptions: null, // Will be showed as menu item when choosing class.
      subjectOptions: null, // Will be showed as menu item when choosing subject.
      allClassObject: null, // Used to get class name from class id without traversing class array.
      allSubjectObject: null, // Used to get subject name from subject id without traversing subject array.
      success: null,
      errors: {},
    };
  }

  tugasUploader = React.createRef(null);

  componentDidMount() {
    const { user } = this.props.auth;
    const { id } = this.props.match.params;
    this.props.getOneTask(id);
    this.props.getAllClass(user.unit);
    this.props.getAllSubjects(this.props.auth.user.unit);
    this.props.getFileTasks(id).then((res) => {
      this.setState({
        fileLampiran: res,
        originalFileLampiran: res,
      });
    });
    this.props.refreshTeacher(this.props.auth.user._id);
    this.props.getSetting();

    const { handleNavbar, handleSideDrawer, handleFooter } = this.props;
    handleNavbar(false);
    handleSideDrawer(false);
    handleFooter(false);
  }

  componentWillUnmount() {
    this.props.clearErrors();
    this.props.clearSuccess();

    const { handleNavbar, handleSideDrawer, handleFooter } = this.props;
    handleNavbar(true);
    handleSideDrawer(true);
    handleFooter(true);
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { selectedTasks } = nextProps.tasksCollection;

    if (Boolean(selectedTasks)) {
      this.setState({
        name: selectedTasks.name,
        subject: selectedTasks.subject,
        deadline: selectedTasks.deadline,
        class_assigned: Boolean(selectedTasks.class_assigned)
          ? selectedTasks.class_assigned
          : [],
        description: selectedTasks.description,
        // fileLampiran: Boolean(selectedTasks.lampiran) ? selectedTasks.lampiran : []
        // fileLampiran must made like above soalnya because maybe nextProps.selectedTasks is still a plain object.
        // so need to check if nextProps.selectedTasks is undefined or not because when calling fileLAmpiran.length, there will be an error.
      });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    // Comparing teacher information (auth.user) is done so teacher's information renewal by admin can renew the class and subject option.
    const { selectedTasks } = this.props.tasksCollection;
    if (
      prevState.classOptions === null ||
      JSON.stringify(prevProps.auth.user) !==
        JSON.stringify(this.props.auth.user)
    ) {
      if (
        this.props.classesCollection.all_classes &&
        this.props.classesCollection.all_classes.length !== 0 &&
        selectedTasks &&
        selectedTasks.constructor === Object &&
        Object.keys(selectedTasks).length !== 0
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
            if (subjectIdArray.includes(selectedTasks.subject)) {
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
      if (
        this.props.subjectsCollection.all_subjects &&
        this.props.subjectsCollection.all_subjects.length !== 0 &&
        selectedTasks &&
        selectedTasks.constructor === Object &&
        Object.keys(selectedTasks).length !== 0
      ) {
        let all_subjects_obj = {};
        this.props.subjectsCollection.all_subjects.forEach((subjectInfo) => {
          all_subjects_obj[subjectInfo._id] = subjectInfo.name;
        });

        // Find subject that is taught to every selected class.
        let subjectMatrix = [];
        if (this.props.auth.user.class_to_subject) {
          for (let classId of selectedTasks.class_assigned) {
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

  onDateChange = (date) => {
    this.setState({ deadline: date });
  };

  onSubmit = (e, classesOptions) => {
    e.preventDefault();
    const { id } = this.props.match.params;
    const { selectedTasks } = this.props.tasksCollection;
    const {
      class_assigned,
      fileLampiranToAdd,
      fileLampiranToDelete,
    } = this.state;

    let classesSelected = [];

    class_assigned.map((id) => {
      for (var i = 0; i < classesOptions.length; i++) {
        if (classesOptions[i]._id === id) {
          classesSelected.push(classesOptions[i]);
          break;
        }
      }
      return classesSelected;
    });

    const taskObject = {
      name: this.state.name,
      deadline: this.state.deadline,
      subject: this.state.subject,
      description: this.state.description,
      class_assigned: this.state.class_assigned,
      lampiran: Array.from(this.state.fileLampiran),
    };

    let formData = new FormData();
    for (var i = 0; i < fileLampiranToAdd.length; i++) {
      formData.append("lampiran_tugas", this.state.fileLampiranToAdd[i]);
    }
    this.handleOpenUploadDialog();
    this.props
      .updateTask(
        formData,
        fileLampiranToDelete,
        selectedTasks.lampiran,
        taskObject,
        id,
        this.props.history
      )
      .then((res) => this.setState({ success: res }))
      .catch((err) => {
        this.handleCloseUploadDialog();
        this.setState({
          errors: err,
          fileLampiran: [
            ...this.state.originalFileLampiran,
            ...this.state.fileLampiranToAdd,
          ],
          fileLampiranToDelete: [],
        });
      });
  };

  handleLampiranUpload = (e) => {
    const files = Array.from(e.target.files);
    const uploadLimit = this.props.settingsCollection.upload_limit;
    if (this.state.fileLampiran.length === 0) {
      let over_limit = files.filter(
        (file) => file.size / Math.pow(10, 6) > uploadLimit
      );
      let allowed_file = files.filter(
        (file) => file.size / Math.pow(10, 6) <= uploadLimit
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
          (file) => file.size / Math.pow(10, 6) <= uploadLimit
        );
        let over_limit = files.filter(
          (file) => file.size / Math.pow(10, 6) > uploadLimit
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
    let temp = Array.from(this.state.fileLampiran);
    let tempToDelete = this.state.fileLampiranToDelete;
    let tempToAdd = this.state.fileLampiranToAdd;
    // For the one that has already been uploaded, there will be a filename field (the one without name).
    // For the one that has already in database.
    if (this.state.fileLampiran[i].filename !== undefined) {
      // Remove the file in fileLampiranToDelete
      tempToDelete.push(temp[i]);
    } else {
      // For the one that is not in database yet.
      // Remove the file in fileLampiranToAdd.
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

  handleCloseErrorSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    this.setState({ fileLimitSnackbar: false });
  };

  handleOpenUploadDialog = () => {
    this.setState({ openUploadDialog: true });
  };

  handleCloseUploadDialog = () => {
    this.setState({ openUploadDialog: false });
  };

  handleOpenDeleteDialog = () => {
    this.setState({ openDeleteDialog: true });
  };

  handleCloseDeleteDialog = () => {
    this.setState({ openDeleteDialog: false });
  };

  onChange = (e, otherfield = null) => {
    let field = otherfield ? otherfield : e.target.id;
    if (this.state.errors[field]) {
      this.setState({ errors: { ...this.state.errors, [field]: null } });
    }

    if (otherfield) {
      if (otherfield === "subject") {
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
              // reset subject options (show all subjects that this teacher teach)
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
              name: this.state.allSubjectObject[subjectId],
            });
          });

          this.setState({
            subjectOptions: newSubjectOptions,
            class_assigned: selectedClasses,
          });
        }
      } else {
        // Because e.target.id doesn't accept the id when we define it in Select atau KeybaordDatePicker.
        this.setState({ [otherfield]: e.target.value });
      }
    } else {
      // let field = e.target.id ? e.target.id : otherfield;
      // if (this.state.errors[field]) {
      //   this.setState({ errors: { ...this.state.errors, [field]: null } });
      // }
      // this.setState({ [field]: e.target.value });

      this.setState({ [e.target.id]: e.target.value });
    }
  };

  render() {
    const { classes } = this.props;
    const { all_classes } = this.props.classesCollection;
    const { fileLampiran, class_assigned, success, errors } = this.state;

    let classIds = [];

    if (class_assigned !== null)
      // When firstly received.
      class_assigned.map((kelas) => {
        if (kelas._id !== undefined) return classIds.push(kelas._id);
        else return classIds.push(kelas);
      });

    document.title = "Schooly | Sunting Tugas";

    return (
      <div className={classes.background}>
        <div className={classes.root}>
          <form
            noValidate
            onSubmit={(e) => {
              this.onSubmit(e, all_classes);
            }}
            style={{ width: "100%" }}
          >
            <AppBar position="fixed" className={classes.menuBar}>
              <Grid container justify="space-between" alignItems="center">
                <Grid item xs>
                  <Typography variant="h6" color="textSecondary">
                    Tugas
                  </Typography>
                </Grid>
                <Grid item>
                  <Grid container alignItems="center" spacing={2}>
                    <Grid item>
                      <Button type="submit" className={classes.editButton}>
                        Sunting
                      </Button>
                    </Grid>
                    <Grid item>
                      <IconButton
                        onClick={this.handleOpenDeleteDialog}
                        className={classes.closeButton}
                      >
                        <CloseIcon style={{ fontSize: "24px" }} />
                      </IconButton>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </AppBar>
            <div className={classes.content}>
              <div className={classes.toolbar} />
              <Paper>
                <div className={classes.contentDetails}>
                  <Typography variant="h5" gutterBottom>
                    Sunting Tugas
                  </Typography>
                  <Typography color="textSecondary">
                    Ganti keterangan tugas beserta lampiran berkas yang
                    diberikan.
                  </Typography>
                </div>
                <Divider />
                <Grid container>
                  <Grid item xs={12} md={7} className={classes.contentDetails}>
                    <Grid container direction="column" spacing={4}>
                      <Grid item>
                        <Typography color="primary" className={classes.label}>
                          <AssignmentIcon className={classes.labelIcon} />
                          Judul Tugas
                        </Typography>
                        <TextField
                          fullWidth
                          variant="outlined"
                          size="small"
                          id="name"
                          type="text"
                          onChange={this.onChange}
                          value={this.state.name}
                          error={errors.name}
                          helperText={errors.name}
                        />
                      </Grid>
                      <Grid item>
                        <Typography color="primary" className={classes.label}>
                          <ShortTextIcon className={classes.labelIcon} />
                          Deskripsi
                        </Typography>
                        <TextField
                          fullWidth
                          multiline
                          rows="5"
                          rowsMax="25"
                          variant="outlined"
                          size="small"
                          id="description"
                          type="text"
                          onChange={(e) => this.onChange(e, "description")}
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
                        <Typography color="primary" className={classes.label}>
                          <LibraryBooksIcon className={classes.labelIcon} />
                          Mata Pelajaran
                        </Typography>
                        <FormControl
                          fullWidth
                          id="subject"
                          variant="outlined"
                          size="small"
                          color="primary"
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
                        <Typography color="primary" className={classes.label}>
                          <FaChalkboard className={classes.labelIcon} />
                          Kelas yang diberikan
                        </Typography>
                        <FormControl
                          fullWidth
                          variant="outlined"
                          size="small"
                          color="primary"
                          id="class_assigned"
                          error={Boolean(errors.class_assigned)}
                        >
                          <Select
                            multiple
                            value={class_assigned}
                            onChange={(event) =>
                              this.onChange(event, "class_assigned")
                            }
                            MenuProps={{
                              classes: { paper: classes.selectPaper },
                            }}
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
                                      checked={
                                        class_assigned.indexOf(classInfo._id) >
                                        -1
                                      }
                                    />
                                    <ListItemText
                                      primary={classInfo.name}
                                      style={{ marginLeft: "10px" }}
                                    />
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
                        <Typography color="primary" className={classes.label}>
                          <TimerOffIcon className={classes.labelIcon} />
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
                            size="small"
                            id="deadline"
                            format="dd/MM/yyyy - HH:mm"
                            ampm={false}
                            okLabel="Simpan"
                            cancelLabel="Batal"
                            minDateMessage="Harus waktu yang akan datang"
                            invalidDateMessage="Format tanggal tidak benar"
                            onChange={(date) => this.onDateChange(date)}
                            value={this.state.deadline}
                            onError={(err) => {
                              if (errors.deadline !== err) {
                                this.setState({
                                  errors: { ...errors, deadline: err },
                                });
                              }
                            }}
                            error={errors.deadline}
                            helperText={errors.deadline}
                          />
                        </MuiPickersUtilsProvider>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Paper>
              <div>
                <input
                  multiple
                  id="file_control"
                  type="file"
                  accept="file/*"
                  name="lampiran"
                  onChange={this.handleLampiranUpload}
                  ref={this.tugasUploader}
                  style={{ display: "none" }}
                />
                <Button
                  variant="contained"
                  startIcon={<AttachFileIcon />}
                  onClick={() => {
                    this.tugasUploader.current.click();
                  }}
                  className={classes.addFileButton}
                >
                  Tambah Lampiran Berkas
                </Button>
                <Grid container spacing={1}>
                  <FileAttachment
                    data={fileLampiran}
                    handleLampiranDelete={this.handleLampiranDelete}
                  />
                </Grid>
              </div>
            </div>
          </form>
          <UploadDialog
            openUploadDialog={this.state.openUploadDialog}
            success={success}
            messageUploading="Tugas sedang disunting"
            messageSuccess="Tugas telah disunting"
            redirectLink={`/tugas-guru/${this.props.match.params.id}`}
          />
          <DeleteDialog
            openDeleteDialog={this.state.openDeleteDialog}
            handleCloseDeleteDialog={this.handleCloseDeleteDialog}
            itemType="perubahan pada Tugas"
            redirectLink="/daftar-tugas"
          />
          {/* File Size Limit Snackbar */}
          <Snackbar
            open={this.state.fileLimitSnackbar}
            autoHideDuration={4000}
            onClose={this.handleCloseErrorSnackbar}
            anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
          >
            <Alert
              elevation={6}
              variant="filled"
              severity="error"
              onClose={this.handleCloseSnackbar}
            >
              {this.state.over_limit.length} file melebihi batas{" "}
              {this.props.settingsCollection.upload_limit}MB
            </Alert>
          </Snackbar>
        </div>
        <FloatingHelp />
      </div>
    );
  }
}

EditTask.propTypes = {
  auth: PropTypes.object.isRequired,
  classesCollection: PropTypes.object.isRequired,
  subjectsCollection: PropTypes.object.isRequired,
  tasksCollection: PropTypes.object.isRequired,
  success: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  classesCollection: state.classesCollection,
  subjectsCollection: state.subjectsCollection,
  tasksCollection: state.tasksCollection,
  settingsCollection: state.settingsCollection,
  success: state.success,
  errors: state.errors,
});

export default connect(mapStateToProps, {
  getAllClass,
  getAllSubjects,
  refreshTeacher,
  getOneTask,
  updateTask,
  getFileTasks,
  getSetting,
  clearSuccess,
  clearErrors,
})(withStyles(styles)(EditTask));
