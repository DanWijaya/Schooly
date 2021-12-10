import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import "date-fns";
import { getAllClass } from "../../../actions/ClassActions";
import { getAllSubjects } from "../../../actions/SubjectActions";
import { getOneMaterial } from "../../../actions/MaterialActions";
import { updateMaterial } from "../../../actions/MaterialActions";
import { refreshTeacher } from "../../../actions/UserActions";
import { getSetting } from "../../../actions/SettingActions";
import { clearSuccess } from "../../../actions/SuccessActions";
import { clearErrors } from "../../../actions/ErrorActions";
import { getFileMaterials } from "../../../actions/files/FileMaterialActions";
import UploadDialog from "../../misc/dialog/UploadDialog";
import DeleteDialog from "../../misc/dialog/DeleteDialog";
import FloatingHelp from "../../misc/floating-help/FloatingHelp";
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
  MenuItem,
  ListItemText,
  Paper,
  Select,
  Snackbar,
  TextField,
  Typography,
} from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import Alert from "@material-ui/lab/Alert";
import {
  AttachFile as AttachFileIcon,
  Close as CloseIcon,
  LibraryBooks as LibraryBooksIcon,
  MenuBook as MenuBookIcon,
  ShortText as ShortTextIcon,
} from "@material-ui/icons";
import { FaChalkboard } from "react-icons/fa";
import FileAttachment from "../file/FileAttachment";

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
  labelIcon: {
    fontSize: "18px",
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
    marginTop: "20px",
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

class EditMaterial extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
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
      classOptions: null, // Will be showed as menu item when choosing class.
      subjectOptions: null, // Will be showed as menu item when choosing subject.
      allClassObject: null, // Used to get class name from class id without traversing class array.
      allSubjectObject: null, // Used to get subject name from subject id without traversing subject array.
    };
  }

  lampiranUploader = React.createRef(null);

  componentDidMount() {
    const {
      getAllClass,
      getAllSubjects,
      getOneMaterial,
      getFileMaterials,
      refreshTeacher,
      getSetting,
    } = this.props;
    const { user } = this.props.auth;
    const { id } = this.props.match.params;

    getAllClass(user.unit);
    getOneMaterial(id);
    getAllSubjects(this.props.auth.user.unit);
    getFileMaterials(id).then((result) => {
      this.setState({ fileLampiran: result, originalFileLampiran: result });
    });
    refreshTeacher(this.props.auth.user._id);
    getSetting();

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
    const { selectedMaterials } = nextProps.materialsCollection;

    this.setState({
      name: selectedMaterials.name,
      subject: selectedMaterials.subject,
      deadline: selectedMaterials.deadline,
      class_assigned: Boolean(selectedMaterials.class_assigned)
        ? selectedMaterials.class_assigned
        : [],
      description: selectedMaterials.description,
      // Need to check if selectedMaterials is undefined or not because when calling fileLAmpiran.length, there will be an error.
    });
  }

  componentDidUpdate(prevProps, prevState) {
    // Comparing teacher information (auth.user) is done so teacher's information renewal by admin can renew the class and subject option.
    if (
      prevState.classOptions === null ||
      JSON.stringify(prevProps.auth.user) !==
        JSON.stringify(this.props.auth.user)
    ) {
      const selectedMaterialProps = this.props.materialsCollection
        .selectedMaterials;

      if (
        this.props.classesCollection.all_classes &&
        this.props.classesCollection.all_classes.length !== 0 &&
        selectedMaterialProps &&
        selectedMaterialProps.constructor === Object &&
        Object.keys(selectedMaterialProps).length !== 0
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
            if (subjectIdArray.includes(selectedMaterialProps.subject)) {
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
      const selectedMaterialProps = this.props.materialsCollection
        .selectedMaterials;

      if (
        this.props.subjectsCollection.all_subjects &&
        this.props.subjectsCollection.all_subjects.length !== 0 &&
        selectedMaterialProps &&
        selectedMaterialProps.constructor === Object &&
        Object.keys(selectedMaterialProps).length !== 0
      ) {
        let all_subjects_obj = {};
        this.props.subjectsCollection.all_subjects.forEach((subjectInfo) => {
          all_subjects_obj[subjectInfo._id] = subjectInfo.name;
        });

        // Find subject that is taught to every selected class.
        let subjectMatrix = [];
        if (this.props.auth.user.class_to_subject) {
          for (let classId of selectedMaterialProps.class_assigned) {
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

  onSubmit = (e, classesOptions) => {
    e.preventDefault();

    const { id } = this.props.match.params;
    const { fileLampiranToAdd, fileLampiranToDelete } = this.state;
    const materialObject = {
      name: this.state.name,
      deadline: this.state.deadline,
      subject: this.state.subject,
      description: this.state.description,
      class_assigned: this.state.class_assigned,
      lampiran: Array.from(this.state.fileLampiran),
    };

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
    // this.setState({ fileLampiranToDelete: [] });
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
      // For the one that"s not yet in database.
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
    // Moved (kode yg dari merge_fitur_4_cdn ada di bawah dan dikomen)
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
  };

  onDateChange = (date) => {
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
    const { user } = this.props.auth;
    const { class_assigned, fileLampiran, success, errors } = this.state;

    let classIds = [];

    if (this.state.class_assigned !== null)
      // When firstly received.
      this.state.class_assigned.map((kelas) => {
        if (kelas._id !== undefined) return classIds.push(kelas._id);
        else return classIds.push(kelas);
      });

    document.title = "Schooly | Sunting Materi";

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
                    Sunting Materi
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
                        <div style={{ display: "flex", alignItems: "center" }}>
                          <MenuBookIcon className={classes.labelIcon} />
                          <Typography color="primary">Judul Materi</Typography>
                        </div>
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
                        <div style={{ display: "flex", alignItems: "center" }}>
                          <ShortTextIcon className={classes.labelIcon} />
                          <Typography color="primary">Deskripsi</Typography>
                        </div>
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
                        <div style={{ display: "flex", alignItems: "center" }}>
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
                        <div style={{ display: "flex", alignItems: "center" }}>
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
                            onChange={(event) =>
                              this.onChange(event, "class_assigned")
                            }
                            MenuProps={{
                              classes: { paper: classes.selectPaper },
                            }}
                            renderValue={(selected) => {
                              return (
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
                              );
                            }}
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
                  onClick={() => {
                    this.lampiranUploader.current.click();
                  }}
                  className={classes.addFileButton}
                >
                  Tambah Lampiran Berkas
                </Button>
                {errors.lampiran_materi ? (
                  <FormHelperText error>
                    {errors.lampiran_materi}
                  </FormHelperText>
                ) : null}
                <Grid container spacing={1} style={{ marginTop: "20px" }}>
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
            handleCloseUploadDialog={this.handleCloseUploadDialog}
            success={success}
            messageUploading="Materi sedang disunting"
            messageSuccess="Materi telah disunting"
            redirectLink={`/materi/${this.props.match.params.id}`}
          />
          <DeleteDialog
            openDeleteDialog={this.state.openDeleteDialog}
            handleCloseDeleteDialog={this.handleCloseDeleteDialog}
            itemType="perubahan pada Materi"
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
EditMaterial.propTypes = {
  auth: PropTypes.object.isRequired,
  classesCollection: PropTypes.object.isRequired,
  subjectsCollection: PropTypes.object.isRequired,
  materialsCollection: PropTypes.object.isRequired,
  success: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  classesCollection: state.classesCollection,
  subjectsCollection: state.subjectsCollection,
  materialsCollection: state.materialsCollection,
  settingsCollection: state.settingsCollection,
  success: state.success,
  errors: state.errors,
});

export default connect(mapStateToProps, {
  getAllClass,
  getAllSubjects,
  refreshTeacher,
  getOneMaterial,
  updateMaterial,
  getFileMaterials,
  getSetting,
  clearSuccess,
  clearErrors,
})(withStyles(styles)(EditMaterial));
