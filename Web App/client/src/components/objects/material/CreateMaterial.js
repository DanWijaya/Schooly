import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { getAllClass } from "../../../actions/ClassActions";
import { getAllSubjects } from "../../../actions/SubjectActions";
import { createMaterial } from "../../../actions/MaterialActions";
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
  ListItemText,
  MenuItem,
  Paper,
  Select,
  Snackbar,
  TextField,
  Typography,
} from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";
import { withStyles } from "@material-ui/core/styles";
import {
  AttachFile as AttachFileIcon,
  LibraryBooks as LibraryBooksIcon,
  MenuBook as MenuBookIcon,
  ShortText as ShortTextIcon,
} from "@material-ui/icons";
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
  createButton: {
    width: "90px",
    backgroundColor: theme.palette.success.main,
    color: "white",
    "&:focus, &:hover": {
      backgroundColor: theme.palette.success.main,
      color: "white",
      boxShadow:
        "0px 1px 2px 0px rgba(194,100,1,0.3), 0px 2px 6px 2px rgba(194,100,1,0.15)",
    },
    [theme.breakpoints.down("sm")]: {
      width: "75px",
    },
  },
  deleteButton: {
    width: "90px",
    backgroundColor: theme.palette.error.main,
    color: "white",
    "&:focus, &:hover": {
      backgroundColor: theme.palette.error.main,
      color: "white",
      boxShadow:
        "0px 1px 2px 0px rgba(194,100,1,0.3), 0px 2px 6px 2px rgba(194,100,1,0.15)",
    },
    [theme.breakpoints.down("sm")]: {
      width: "75px",
    },
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

class CreateMaterial extends Component {
  constructor() {
    super();
    this.state = {
      name: "",
      subject: "",
      focused: false,
      class_assigned: [],
      description: "",
      fileLampiran: [],
      openUploadDialog: null,
      openDeleteDialog: null,
      anchorEl: null,
      over_limit: [],
      fileLimitSnackbar: false,
      // sortFlag: false
      classOptions: null, // Will be showed as menu item when choosing class.
      subjectOptions: null, // Will be showed as menu item when choosing subject.
      allClassObject: null, // Used to get class name from class id without traversing class array.
      allSubjectObject: null, // Used to get subject name from subject id without traversing subject array.
      success: null,
      errors: {},
    };
  }

  lampiranUploader = React.createRef(null);

  handleClickMenu = (event) => {
    // Needed so it will not be run when filetugas = null or filetugas array is empty.
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
  };

  handleOpenDeleteDialog = () => {
    this.setState({ openDeleteDialog: true });
  };

  handleCloseDeleteDialog = () => {
    this.setState({ openDeleteDialog: false });
  };

  onChange = (e, otherfield = null) => {
    // merge_fitur_4_cdn codes are below
    let field = otherfield ? otherfield : e.target.id;
    if (this.state.errors[field]) {
      this.setState({ errors: { ...this.state.errors, [field]: null } });
    }
    // this.setState({ [field]: e.target.value }); // di sini jadi dikomen

    if (otherfield) {
      if (otherfield === "deadline") {
        this.setState({ [otherfield]: e });
        // e is the date value itself for KeyboardDatePicker.
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

  onSubmit = (e, id) => {
    const { user } = this.props.auth;
    e.preventDefault();
    let formData = new FormData();

    // Check if there is any lampiran uploaded or not.
    if (this.state.fileLampiran)
      for (var i = 0; i < this.state.fileLampiran.length; i++) {
        console.log(this.state.fileLampiran[i]);
        formData.append("lampiran_materi", this.state.fileLampiran[i]);
      }
    console.log(formData.getAll("lampiran_materi"), this.state.fileLampiran);

    const materialData = {
      name: this.state.name,
      subject: this.state.subject,
      class_assigned: this.state.class_assigned,
      description: this.state.description,
      lampiran: Array.from(this.state.fileLampiran),
      author_id: id,
      unit: user.unit,
    };

    console.log(this.state.fileLampiran);
    // this.props.createMaterial(formData, materialData, this.props.history)

    this.handleOpenUploadDialog();
    this.props
      .createMaterial(formData, materialData, this.props.history)
      .then((res) => {
        this.setState({ success: res });
        // this.handleOpenUploadDialog();
      })
      .catch((err) => {
        this.handleCloseUploadDialog();
        this.setState({ errors: err });
      });
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
      if (
        this.props.classesCollection.all_classes &&
        this.props.classesCollection.all_classes.length !== 0
      ) {
        let all_classes_obj = {};
        this.props.classesCollection.all_classes.forEach((classInfo) => {
          all_classes_obj[classInfo._id] = classInfo.name;
        });

        let newClassOptions = [];
        if (this.props.auth.user.class_teached) {
          newClassOptions = this.props.auth.user.class_teached.map(
            (classId) => {
              return { _id: classId, name: all_classes_obj[classId] };
            }
          );
        }
        this.setState({
          classOptions: newClassOptions,
          allClassObject: all_classes_obj,
        });
      } // If there is no class yet in the database, class option will always be null.
    }

    if (
      prevState.subjectOptions === null ||
      JSON.stringify(prevProps.auth.user) !==
        JSON.stringify(this.props.auth.user)
    ) {
      if (
        this.props.subjectsCollection.all_subjects &&
        this.props.subjectsCollection.all_subjects.length !== 0
      ) {
        let all_subjects_obj = {};
        this.props.subjectsCollection.all_subjects.forEach((subjectInfo) => {
          all_subjects_obj[subjectInfo._id] = subjectInfo.name;
        });

        let newSubjectOptions = [];
        if (this.props.auth.user.subject_teached) {
          newSubjectOptions = this.props.auth.user.subject_teached.map(
            (subjectId) => {
              return { _id: subjectId, name: all_subjects_obj[subjectId] };
            }
          );
        }

        this.setState({
          subjectOptions: newSubjectOptions,
          allSubjectObject: all_subjects_obj,
        });
      } // If there is no subject yet in the database, subject option will always be null.
    }
  }

  componentDidMount() {
    const { user } = this.props.auth;
    this.props.getAllClass(user.unit);
    this.props.getAllSubjects(this.props.auth.user.unit);
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

  handleLampiranDelete = (e, i) => {
    e.preventDefault();
    console.log("Index is: ", i);
    let temp = Array.from(this.state.fileLampiran);
    temp.splice(i, 1);
    if (temp.length === 0)
      // If it is empty.
      this.handleCloseMenu();
    this.setState({ fileLampiran: temp });
  };

  handleCloseErrorSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    this.setState({ fileLimitSnackbar: false });
  };

  handleLampiranUpload = (e) => {
    const files = e.target.files;
    const uploadLimit = this.props.settingsCollection.upload_limit;
    console.log(uploadLimit);
    let temp = [...Array.from(this.state.fileLampiran), ...Array.from(files)];
    let over_limit = temp.filter(
      (file) => file.size / Math.pow(10, 6) > uploadLimit
    ); // 10MB
    let file_to_upload = temp.filter(
      (file) => file.size / Math.pow(10, 6) <= uploadLimit
    );

    if (this.state.errors.lampiran_materi) {
      // Because the error is lampiran_materi
      this.setState({
        errors: { ...this.state.errors, lampiran_materi: null },
      });
    }
    this.setState({
      fileLampiran: file_to_upload,
      over_limit: over_limit,
      fileLimitSnackbar: over_limit.length > 0,
    });
    document.getElementById("file_control").value = null;
  };

  render() {
    const { classes } = this.props;
    const { user } = this.props.auth;
    const { class_assigned, fileLampiran, errors, success } = this.state;

    document.title = "Schooly | Buat Materi";

    return (
      <div className={classes.background}>
        <div className={classes.root}>
          <form
            noValidate
            onSubmit={(e) => this.onSubmit(e, user._id)}
            style={{ width: "100%" }}
          >
            <AppBar position="fixed" className={classes.menuBar}>
              <Grid container justify="space-between" alignItems="center">
                <Grid item xs>
                  <Typography variant="h6" color="textSecondary">
                    Materi
                  </Typography>
                </Grid>
                <Grid item>
                  <Grid container alignItems="center" spacing={1}>
                    <Grid item>
                      <Button type="submit" className={classes.createButton}>
                        Buat
                      </Button>
                    </Grid>
                    <Grid item>
                      <Button
                        onClick={this.handleOpenDeleteDialog}
                        className={classes.deleteButton}
                      >
                        Hapus
                      </Button>
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
                    Buat Materi
                  </Typography>
                  <Typography color="textSecondary">
                    Satu berkas atau lebih harus dilampirkan untuk membuat
                    sebuah materi.
                  </Typography>
                </div>
                <Divider />
                <Grid container>
                  <Grid item xs={12} md={7} className={classes.contentDetails}>
                    <Grid container direction="column" spacing={4}>
                      <Grid item>
                        <Typography color="primary" className={classes.label}>
                          <MenuBookIcon className={classes.labelIcon} />
                          Judul Materi
                        </Typography>
                        <TextField
                          fullWidth
                          variant="outlined"
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
                          variant="outlined"
                          id="description"
                          type="text"
                          rows="5"
                          rowsMax="25"
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
                          variant="outlined"
                          color="primary"
                          id="subject"
                          error={Boolean(errors.subject) && !this.state.subject}
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
                          {Boolean(errors.subject) && !this.state.subject ? (
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
                  ref={this.lampiranUploader}
                  style={{ display: "none" }}
                />
                <Button
                  variant="contained"
                  startIcon={<AttachFileIcon />}
                  onClick={() => this.lampiranUploader.current.click()}
                  className={classes.addFileButton}
                >
                  Tambah Lampiran Berkas
                </Button>
                <FormHelperText error>{errors.lampiran_materi}</FormHelperText>
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
            messageUploading="Materi sedang dibuat"
            messageSuccess="Materi telah dibuat"
            redirectLink={`/materi/${success}`}
          />
          <DeleteDialog
            openDeleteDialog={this.state.openDeleteDialog}
            handleCloseDeleteDialog={this.handleCloseDeleteDialog}
            itemType="Materi"
            redirectLink="/daftar-materi"
          />
          {/* File Size Limit Snackbar */}
          <Snackbar
            open={this.state.fileLimitSnackbar}
            autoHideDuration={4000}
            onClose={this.handleCloseErrorSnackbar}
            anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
          >
            <Alert elevation={6} variant="filled" severity="error">
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

CreateMaterial.propTypes = {
  auth: PropTypes.object.isRequired,
  success: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  subjectsCollection: state.subjectsCollection,
  classesCollection: state.classesCollection,
  settingsCollection: state.settingsCollection,
  success: state.success,
  errors: state.errors,
});

export default connect(mapStateToProps, {
  getAllClass,
  getAllSubjects,
  createMaterial,
  refreshTeacher,
  getSetting,
  clearSuccess,
  clearErrors,
})(withStyles(styles)(CreateMaterial));
