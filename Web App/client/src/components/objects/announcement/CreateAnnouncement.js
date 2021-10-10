import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import classnames from "classnames";
import { getAllClass, setCurrentClass } from "../../../actions/ClassActions";
import { refreshTeacher } from "../../../actions/UserActions";
import { createAnnouncement } from "../../../actions/AnnouncementActions";
import { getSetting } from "../../../actions/SettingActions";
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
  Snackbar,
  TextField,
  Typography,
} from "@material-ui/core";
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

const styles = (theme) => ({
  root: {
    margin: "auto",
    padding: "20px",
    paddingTop: "25px",
    maxWidth: "80%",
    [theme.breakpoints.down("md")]: {
      maxWidth: "100%",
    },
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
  createAnnouncementButton: {
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
  zeroHeightHelperText: {
    height: "0",
    display: "flex", // untuk men-disable "collapsing margin"
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
      allClassObject: null, // Will be used to get name of a class from its id without to traverse array that contains all class.
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
    const { user } = this.props.auth;
    const {
      getAllClass,
      setCurrentClass,
      refreshTeacher,
      getSetting,
    } = this.props;
    getAllClass(user.unit);
    getSetting();

    if (user.role === "Student") {
      setCurrentClass(user.kelas);
    } else if (user.role === "Teacher") {
      refreshTeacher(user._id);
    }
  }

  // componentWillUnmount() {
  //   this.props.clearErrors();
  // }

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
    console.log(
      formData.getAll("lampiran_announcement"),
      this.state.fileLampiran
    );
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

    const { classes } = this.props;
    // const { errors } = this.props;
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

    // I the future, this need to be changed if the class president only put id only.
    if (
      user.role === "Student" &&
      Boolean(kelas.ketua_kelas) &&
      kelas.ketua_kelas !== user._id
    ) {
      return <Redirect to="/tidak-ditemukan" />;
    }

    document.title = "Schooly | Buat Pengumuman";

    return (
      <div className={classes.root}>
        <Paper>
          <div className={classes.content}>
            <Typography variant="h5" gutterBottom>
              <b>Buat Pengumuman</b>
            </Typography>
            <Typography color="textSecondary">
              Tambahkan keterangan pengumuman untuk membuat pengumuman.
            </Typography>
          </div>
          <Divider />
          <form noValidate onSubmit={(e) => this.onSubmit(e, user._id)}>
            <Grid container>
              <Grid item xs={12} md className={classes.content}>
                <Grid container direction="column" spacing={4}>
                  <Grid item>
                    <Typography component="label" for="title" color="primary">
                      Judul
                    </Typography>
                    <TextField
                      fullWidth
                      variant="outlined"
                      id="title"
                      onChange={this.onChange}
                      value={this.state.title}
                      error={errors.title}
                      type="text"
                      // helperText={errors.title}
                      className={classnames("", {
                        invalid: errors.title,
                      })}
                    />
                    {errors.title ? (
                      <div className={classes.zeroHeightHelperText}>
                        <FormHelperText variant="outlined" error>
                          {errors.title}
                        </FormHelperText>
                      </div>
                    ) : null}
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
                    {errors.description ? (
                      <div className={classes.zeroHeightHelperText}>
                        <FormHelperText variant="outlined" error>
                          {errors.description}
                        </FormHelperText>
                      </div>
                    ) : null}
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
                  {user.role === "Student" ? null : user.role === "Admin" ? (
                    <Grid item>
                      <Typography
                        component="label"
                        for="target_role"
                        color="primary"
                      >
                        Ditujukan Kepada
                      </Typography>
                      <FormControl
                        variant="outlined"
                        fullWidth
                        error={Boolean(errors.to)}
                      >
                        <Select
                          id="target_role"
                          multiple
                          MenuProps={MenuProps}
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
                          <div className={classes.zeroHeightHelperText}>
                            <FormHelperText variant="outlined" error>
                              {errors.to}
                            </FormHelperText>
                          </div>
                        ) : null}
                      </FormControl>
                    </Grid>
                  ) : (
                    <Grid item>
                      <Typography
                        component="label"
                        for="class_assigned"
                        color="primary"
                      >
                        Kelas yang Diumumkan
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
                                  {classInfo.name}
                                </MenuItem>
                              ))
                            : null}
                        </Select>
                        {Boolean(errors.class_assigned) ? (
                          <div className={classes.zeroHeightHelperText}>
                            <FormHelperText variant="outlined" error>
                              {errors.class_assigned}
                            </FormHelperText>
                          </div>
                        ) : null}
                      </FormControl>
                    </Grid>
                  )}
                  <Grid item>
                    <input
                      type="file"
                      multiple={true}
                      name="lampiran"
                      id="file_control"
                      onChange={this.handleLampiranUpload}
                      ref={this.lampiranUploader}
                      accept="file/*"
                      style={{ display: "none" }}
                    />
                    <Typography variant="body1">{"\u200B"}</Typography>
                    <Button
                      variant="contained"
                      startIcon={<AttachFileIcon />}
                      onClick={() => this.lampiranUploader.current.click()}
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
                  className={classes.createAnnouncementButton}
                >
                  Buat Pengumuman
                </Button>
              </div>
            </div>
          </form>
        </Paper>
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
          itemType={"Pengumuman"}
          itemName={this.state.title}
          // itemName={this.state.name}
          // isLink={true}
          // redirectLink="/daftar-kuis"
          redirectLink={`/daftar-pengumuman`}
          isWarning={false}
        />
        <Snackbar
          open={this.state.fileLimitSnackbar}
          autoHideDuration={4000}
          onClose={this.handleCloseErrorSnackbar}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert elevation={6} variant="filled" severity="error">
            {this.state.over_limit.length} file melebihi batas{" "}
            {this.props.settingsCollection.upload_limit}MB!
          </Alert>
        </Snackbar>
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
