import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { getAllClass, setCurrentClass } from "../../../actions/ClassActions";
import { refreshTeacher } from "../../../actions/UserActions";
import { createAnnouncement } from "../../../actions/AnnouncementActions";
import { getSetting } from "../../../actions/SettingActions";
import { clearErrors } from "../../../actions/ErrorActions";
import { clearSuccess } from "../../../actions/SuccessActions";
import UploadDialog from "../../misc/dialog/UploadDialog";
import DeleteDialog from "../../misc/dialog/DeleteDialog";
import FloatingHelp from "../../misc/floating-help/FloatingHelp";
import LightTooltip from "../../misc/light-tooltip/LightTooltip";
import {
  AppBar,
  Avatar,
  Button,
  Checkbox,
  Chip,
  Divider,
  FormControl,
  FormHelperText,
  Grid,
  Hidden,
  IconButton,
  ListItem,
  ListItemAvatar,
  ListItemText,
  MenuItem,
  Paper,
  Select,
  Snackbar,
  TextField,
  Typography,
} from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";
import {
  Announcement as AnnouncementIcon,
  AttachFile as AttachFileIcon,
  Delete as DeleteIcon,
  ShortText as ShortTextIcon,
  SupervisorAccount as SupervisorAccountIcon,
} from "@material-ui/icons";
import { withStyles } from "@material-ui/core/styles";
import {
  FaChalkboard,
  FaFile,
  FaFileAlt,
  FaFileExcel,
  FaFileImage,
  FaFilePdf,
  FaFilePowerpoint,
  FaFileWord,
} from "react-icons/fa";

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
    marginRight: 2,
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
});

const path = require("path");

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

class CreateAnnouncement extends Component {
  constructor() {
    super();
    this.state = {
      title: "",
      description: "",
      fileLampiran: [],
      class_assigned: [],
      errors: {},
      success: null,
      openUploadDialog: null,
      openDeleteDialog: null,
      target_role: [],
      fileLimitSnackbar: false,
      over_limit: [],
      classOptions: null, // Will be listed in menu.
      allClassObject: null, // Used to get name of a class from its id without to traverse array that contains all class.
    };
  }

  lampiranUploader = React.createRef(null);

  componentDidUpdate(prevProps, prevState) {
    if (!this.props.errors && this.props.errors !== prevProps.errors) {
      this.handleOpenUploadDialog();
    }

    // Comparing teacher's information (auth.user) is done to renew teacher's information by administrator,
    // that will indirectly renew class options.
    if (
      prevState.classOptions === null ||
      JSON.stringify(prevProps.auth.user) !==
        JSON.stringify(this.props.auth.user)
    ) {
      if (
        this.props.classesCollection.all_classes &&
        this.props.classesCollection.all_classes.length !== 0
      ) {
        let newClassOptions = [];
        let all_classes_obj = {};

        if (this.props.auth.user.role === "Teacher") {
          // Must be checked because only teacher that has attribute class teached.
          this.props.classesCollection.all_classes.forEach((classInfo) => {
            all_classes_obj[classInfo._id] = classInfo.name;
          });

          if (this.props.auth.user.class_teached) {
            // With this, if a teacher doesn't teach class of his/her homeroom class,
            // That teacher will not be able to create his/her homeroom class.
            newClassOptions = this.props.auth.user.class_teached.map(
              (classId) => {
                return { _id: classId, name: all_classes_obj[classId] };
              }
            );
          }
        } else {
          this.props.classesCollection.all_classes.forEach((classInfo) => {
            all_classes_obj[classInfo._id] = classInfo.name;
            newClassOptions.push({ _id: classInfo._id, name: classInfo.name });
          });
        }
        this.setState({
          classOptions: newClassOptions,
          allClassObject: all_classes_obj,
        });
      }
    }
  }

  componentDidMount() {
    const {
      getAllClass,
      setCurrentClass,
      refreshTeacher,
      getSetting,
    } = this.props;
    const { user } = this.props.auth;
    getAllClass(user.unit);
    getSetting();

    if (user.role === "Student") {
      setCurrentClass(user.kelas);
    } else if (user.role === "Teacher") {
      refreshTeacher(user._id);
    }

    const { handleNavbar, handleSideDrawer, handleFooter } = this.props;
    handleNavbar(false);
    handleSideDrawer(false);
    handleFooter(false);
  }

  componentWillUnmount() {
    //   this.props.clearErrors();

    const { handleNavbar, handleSideDrawer, handleFooter } = this.props;
    handleNavbar(true);
    handleSideDrawer(true);
    handleFooter(true);
  }

  handleClickMenu = (event) => {
    // Needed so it will not be run when filetugas = null or filetugas array is empty
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
    let field = otherfield ? otherfield : e.target.id;
    if (this.state.errors[field]) {
      this.setState({ errors: { ...this.state.errors, [field]: null } });
    }
    this.setState({ [field]: e.target.value });
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
    let over_limit = temp.filter(
      (file) => file.size / Math.pow(10, 6) > uploadLimit
    );
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

  onSubmit = (e, id) => {
    e.preventDefault();
    let formData = new FormData();
    const { user } = this.props.auth;
    const { kelas } = this.props.classesCollection;

    const announcementData = {
      title: this.state.title,
      description: this.state.description,
      class_assigned:
        user.role === "Student"
          ? [kelas]
          : user.role === "Admin"
          ? [null]
          : this.state.class_assigned,
      author_id: user._id,
      to: user.role === "Admin" ? this.state.target_role : ["Student"],
      unit: user.unit,
    };

    if (this.state.fileLampiran)
      for (var i = 0; i < this.state.fileLampiran.length; i++) {
        console.log(this.state.fileLampiran[i]);
        formData.append("lampiran_announcement", this.state.fileLampiran[i]);
      }
    this.handleOpenUploadDialog();
    this.props
      .createAnnouncement(formData, announcementData, this.props.history)
      .then((res) => {
        this.setState({ success: res });
        // this.handleOpenUploadDialog();
      })
      .catch((err) => {
        this.handleCloseUploadDialog();
        this.setState({ errors: err });
      });
  };

  render() {
    const { classes } = this.props;
    const { user } = this.props.auth;
    const { all_classes, kelas } = this.props.classesCollection;
    const {
      class_assigned,
      fileLampiran,
      target_role,
      errors,
      success,
    } = this.state;

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

    // In the future, this need to be changed if the class president only put id only.
    if (user.role === "Student" && kelas.ketua_kelas !== user._id) {
      console.log("HELLO");
      return <Redirect to="/tidak-ditemukan" />;
    }

    document.title = "Schooly | Buat Pengumuman";

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
                    Pengumuman
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
                    Buat Pengumuman
                  </Typography>
                  <Typography color="textSecondary">
                    Sebarkan informasi secara satu arah, lampirkan berkas jika
                    diperlukan.
                  </Typography>
                </div>
                <Divider />
                <Grid container>
                  <Grid item xs={12} md={7} className={classes.contentDetails}>
                    <Grid container direction="column" spacing={4}>
                      <Grid item>
                        <div style={{ display: "flex", alignItems: "center" }}>
                          <AnnouncementIcon className={classes.labelIcon} />
                          <Typography color="primary">
                            Judul Pengumuman
                          </Typography>
                        </div>
                        <TextField
                          fullWidth
                          variant="outlined"
                          id="title"
                          type="text"
                          onChange={this.onChange}
                          value={this.state.title}
                          error={errors.title}
                          helperText={errors.title}
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
                      {user.role === "Student" ? null : user.role ===
                        "Admin" ? (
                        <Grid item>
                          <div
                            style={{ display: "flex", alignItems: "center" }}
                          >
                            <SupervisorAccountIcon
                              className={classes.labelIcon}
                            />
                            <Typography color="primary">
                              Ditujukan kepada
                            </Typography>
                          </div>
                          <FormControl
                            fullWidth
                            variant="outlined"
                            color="primary"
                            error={Boolean(errors.to)}
                          >
                            <Select
                              multiple
                              id="target_role"
                              value={target_role}
                              onChange={(event) => {
                                this.onChange(event, "target_role");
                              }}
                              renderValue={(selected) => {
                                return (
                                  <div className={classes.chips}>
                                    {selected.map((role) => {
                                      return (
                                        <Chip
                                          key={role}
                                          label={
                                            role === "Student"
                                              ? "Murid"
                                              : role === "Teacher"
                                              ? "Guru"
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
                              {[
                                ["Student", "Murid"],
                                ["Teacher", "Guru"],
                              ].map((peran) => {
                                return (
                                  <MenuItem key={peran[0]} value={peran[0]}>
                                    {peran[1]}
                                  </MenuItem>
                                );
                              })}
                            </Select>
                            {Boolean(errors.to) ? (
                              <FormHelperText error>{errors.to}</FormHelperText>
                            ) : null}
                          </FormControl>
                        </Grid>
                      ) : (
                        <Grid item>
                          <div
                            style={{ display: "flex", alignItems: "center" }}
                          >
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
                                          class_assigned.indexOf(
                                            classInfo._id
                                          ) > -1
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
                      )}
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
                <Grid container spacing={1}>
                  {listFileChosen()}
                </Grid>
              </div>
            </div>
          </form>
          <UploadDialog
            openUploadDialog={this.state.openUploadDialog}
            success={success}
            messageUploading="Pengumuman sedang dibuat"
            messageSuccess="Pengumuman telah dibuat"
            redirectLink={`/pengumuman/${success}`}
          />
          <DeleteDialog
            openDeleteDialog={this.state.openDeleteDialog}
            handleCloseDeleteDialog={this.handleCloseDeleteDialog}
            itemType="Pengumuman"
            redirectLink="/daftar-pengumuman"
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

CreateAnnouncement.propTypes = {
  auth: PropTypes.object.isRequired,
  success: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  classesCollection: state.classesCollection,
  subjectsCollection: state.subjectsCollection,
  settingsCollection: state.settingsCollection,
  errors: state.errors,
  success: state.success,
});

export default connect(mapStateToProps, {
  getAllClass,
  setCurrentClass,
  createAnnouncement,
  getSetting,
  clearErrors,
  clearSuccess,
  refreshTeacher,
})(withStyles(styles)(CreateAnnouncement));
