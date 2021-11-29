import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { getFileAnnouncements } from "../../../actions/files/FileAnnouncementActions";
import {
  getOneAnnouncement,
  updateAnnouncement,
} from "../../../actions/AnnouncementActions";
import { getAllClass, setCurrentClass } from "../../../actions/ClassActions";
import { refreshTeacher } from "../../../actions/UserActions";
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
import { withStyles } from "@material-ui/core/styles";
import {
  Announcement as AnnouncementIcon,
  AttachFile as AttachFileIcon,
  Close as CloseIcon,
  Delete as DeleteIcon,
  ShortText as ShortTextIcon,
  SupervisorAccount as SupervisorAccountIcon,
} from "@material-ui/icons";
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

class EditAnnouncement extends Component {
  constructor() {
    super();
    this.state = {
      title: "",
      description: "",
      originalFileLampiran: [],
      fileLampiran: [],
      fileLampiranToAdd: [],
      fileLampiranToDelete: [],
      fileLimitSnackbar: false,
      over_limit: [],
      class_assigned: [],
      anchorEl: null,
      openUploadDialog: null,
      openDeleteDialog: null,
      errors: {},
      success: null,
      target_role: [],
      classOptions: null, // Will be listed in menu.
      allClassObject: null, // Used to get name of a class from its id without to traverse array that contains all class.
    };
  }

  lampiranUploader = React.createRef(null);
  uploadedLampiran = React.createRef(null);

  componentDidMount() {
    const {
      setCurrentClass,
      getOneAnnouncement,
      getAllClass,
      getFileAnnouncements,
      refreshTeacher,
      getSetting,
    } = this.props;
    const { user } = this.props.auth;
    const { id } = this.props.match.params;

    getOneAnnouncement(id);
    getAllClass(user.unit);
    getFileAnnouncements(id).then((result) => {
      this.setState({ fileLampiran: result, originalFileLampiran: result });
    });
    getSetting();

    if (user.role === "Student") {
      setCurrentClass(user.kelas);
    } else if (user.role === "Teacher") {
      refreshTeacher(user._id);
    }

    const { handleNavbar, handleSideDrawerExist, handleFooter } = this.props;
    handleNavbar(false);
    handleSideDrawerExist(false);
    handleFooter(false);
  }

  componentWillUnmount() {
    // this.props.clearErrors();
    this.props.clearSuccess();

    const { handleNavbar, handleSideDrawerExist, handleFooter } = this.props;
    handleNavbar(true);
    handleSideDrawerExist(true);
    handleFooter(true);
  }

  // Don't know how to change this.
  UNSAFE_componentWillReceiveProps(nextProps) {
    const { selectedAnnouncements } = nextProps.announcements;

    // If edited, nextProps.errors is false, so these code below won't be run.
    this.setState({
      title: selectedAnnouncements.title,
      description: selectedAnnouncements.description,
      // fileLampiran: Boolean(selectedAnnouncements.lampiran) ? selectedAnnouncements.lampiran : [],
      class_assigned: Boolean(selectedAnnouncements.class_assigned)
        ? selectedAnnouncements.class_assigned
        : [],
      target_role: Array.isArray(selectedAnnouncements.to)
        ? selectedAnnouncements.to
        : [],
      // yg fileLampiran perlu gitu soalnya awal" mungkin nextProps.tasksCollection nya masih plain object.
      // jadi mau dicek kalau nextProps.tasksCollection itu undefined ato ga soalnya nnti pas call fileLAmpiran.length bakal ada error.
    });
  }

  componentDidUpdate(prevProps, prevState) {
    // Comparing teacher information (auth.user) is done so teacher's information renewal by admin can renew the class and subject option.
    if (
      prevState.classOptions === null ||
      JSON.stringify(prevProps.auth.user) !==
        JSON.stringify(this.props.auth.user)
    ) {
      const selectedAnnouncementProps = this.props.announcements
        .selectedAnnouncements;

      if (
        this.props.classesCollection.all_classes &&
        this.props.classesCollection.all_classes.length !== 0 &&
        selectedAnnouncementProps &&
        selectedAnnouncementProps.constructor === Object &&
        Object.keys(selectedAnnouncementProps).length !== 0
      ) {
        let newClassOptions = [];
        let all_classes_obj = {};

        if (this.props.auth.user.role === "Teacher") {
          // Must be checked because only teacher that has attributes containing classes taught.

          this.props.classesCollection.all_classes.forEach((classInfo) => {
            all_classes_obj[classInfo._id] = classInfo.name;
          });

          if (this.props.auth.user.class_teached) {
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
    // For the one that has already uploaded, there is filed filename (the one without name).
    // For the one that has already in database.
    if (this.state.fileLampiran[i].filename !== undefined) {
      // Remove the file in fileLampiranToDelete.
      tempToDelete.push(temp[i]);
    } else {
      // For the one that is not yet in database.
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

  handleCloseErrorSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    this.setState({ fileLimitSnackbar: false });
  };

  onChange = (e, otherfield = null) => {
    let field = otherfield ? otherfield : e.target.id;
    if (this.state.errors[field]) {
      this.setState({ errors: { ...this.state.errors, [field]: null } });
    }
    this.setState({ [field]: e.target.value });
  };

  onSubmit = (e) => {
    e.preventDefault();

    const { id } = this.props.match.params;
    const {
      fileLampiranToAdd,
      fileLampiranToDelete,
      // fileLampiran,
    } = this.state;
    const { user } = this.props.auth;
    const { kelas } = this.props.classesCollection;
    const { selectedAnnouncements } = this.props.announcements;
    const announcementObject = {
      title: this.state.title,
      description: this.state.description,
      class_assigned:
        user.role === "Student"
          ? [kelas]
          : user.role === "Admin"
          ? [null]
          : this.state.class_assigned,

      to: user.role === "Admin" ? this.state.target_role : ["Student"],
    };

    let formData = new FormData();
    for (var i = 0; i < fileLampiranToAdd.length; i++) {
      formData.append("lampiran_announcement", fileLampiranToAdd[i]);
    }

    this.handleOpenUploadDialog();

    this.props
      .updateAnnouncement(
        formData,
        fileLampiranToDelete,
        selectedAnnouncements.lampiran,
        announcementObject,
        id,
        this.props.history
      )
      .then((res) => {
        this.setState({ success: res });
        // this.handleOpenUploadDialog();
      })
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

  render() {
    document.title = "Schooly | Sunting Pengumuman";

    const { classes } = this.props;
    const { fileLampiran, class_assigned, target_role, errors } = this.state;
    // const { success } = this.props;
    const { success } = this.state;
    const { user } = this.props.auth;
    const { all_classes, kelas } = this.props.classesCollection;

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
      // if (fileLampiran.length > 0) {
      for (var i = 0; i < fileLampiran.length; i++) {
        temp.push(
          <LampiranFile //Yang di displaykan ada di DB (filename) sama yang baru diadd (name)
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
      // }
      return temp;
    };

    if (
      user.role === "Student" &&
      Boolean(kelas.ketua_kelas) &&
      kelas.ketua_kelas !== user._id
    ) {
      return <Redirect to="/tidak-ditemukan" />;
    }
    console.log(target_role);

    const rolesToSend = [
      ["Student", "Murid"],
      ["Teacher", "Guru"],
    ];

    return (
      <div className={classes.background}>
        <div className={classes.root}>
          <form noValidate onSubmit={this.onSubmit} style={{ width: "100%" }}>
            <AppBar position="fixed" className={classes.menuBar}>
              <Grid container justify="space-between" alignItems="center">
                <Grid item xs>
                  <Typography variant="h6" color="textSecondary">
                    Pengumuman
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
                            id="target_role"
                            error={Boolean(errors.to)}
                          >
                            <Select
                              multiple
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
                              {rolesToSend.map((peran, idx) => {
                                return (
                                  <MenuItem key={peran[0]} value={peran[0]}>
                                    <Checkbox
                                      color="primary"
                                      size="small"
                                      checked={
                                        target_role.indexOf(peran[0]) !== -1
                                      }
                                    />
                                    <ListItemText
                                      primary={peran[1]}
                                      style={{ marginLeft: "10px" }}
                                    />
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
                              renderValue={(selected) => {
                                return (
                                  <div className={classes.chips}>
                                    {selected.map((classId) => {
                                      return (
                                        <Chip
                                          key={classId}
                                          label={
                                            this.state.allClassObject
                                              ? this.state.allClassObject[
                                                  classId
                                                ]
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
                <input
                  multiple
                  id="file"
                  type="file"
                  name="file"
                  ref={this.uploadedLampiran}
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
            messageUploading="Pengumuman sedang disunting"
            messageSuccess="Pengumuman telah disunting"
            redirectLink={`/pengumuman/${this.props.match.params.id}`}
          />
          <DeleteDialog
            openDeleteDialog={this.state.openDeleteDialog}
            handleCloseDeleteDialog={this.handleCloseDeleteDialog}
            itemType="perubahan pada Pengumuman"
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

EditAnnouncement.propTypes = {
  auth: PropTypes.object.isRequired,
  announcements: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  success: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  classesCollection: state.classesCollection,
  announcements: state.announcementsCollection,
  settingsCollection: state.settingsCollection,
  success: state.success,
  errors: state.errors,
});

export default connect(mapStateToProps, {
  getAllClass,
  setCurrentClass,
  getOneAnnouncement,
  getFileAnnouncements,
  updateAnnouncement,
  refreshTeacher,
  getSetting,
  clearSuccess,
  clearErrors,
})(withStyles(styles)(EditAnnouncement));
