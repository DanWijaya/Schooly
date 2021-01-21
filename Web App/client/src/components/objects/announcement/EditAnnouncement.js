import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import classnames from "classnames";
import { getFileAnnouncements} from "../../../actions/files/FileAnnouncementActions"
import { getOneAnnouncement, updateAnnouncement } from "../../../actions/AnnouncementActions";
import { getAllClass, setCurrentClass } from "../../../actions/ClassActions";
import { clearErrors } from "../../../actions/ErrorActions";
import { clearSuccess } from "../../../actions/SuccessActions";
import UploadDialog from "../../misc/dialog/UploadDialog";
import LightTooltip from "../../misc/light-tooltip/LightTooltip";
import { Avatar, Button, Chip, Divider, FormControl, FormHelperText, Grid, IconButton,
   ListItem, ListItemAvatar, ListItemText, MenuItem, Paper, Select, Snackbar, TextField, Typography } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import AttachFileIcon from "@material-ui/icons/AttachFile";
import MuiAlert from "@material-ui/lab/Alert";
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
    maxWidth: "1000px",
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
  editAnnouncementButton: {
    width: "100%",
    marginTop: "20px",
    backgroundColor: theme.palette.primary.main,
    color: "white",
    "&:focus, &:hover": {
      backgroundColor: theme.palette.primary.main,
      color: "white",
    },
  },
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
          <IconButton
            size="small"
            className={classes.deleteIconButton}
            onClick={(e) => {
              handleLampiranDelete(e, i);
            }}
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
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
      fileLampiran: [],
      fileLampiranToAdd: [],
      fileLampiranToDelete: [],
      fileLimitSnackbar: false,
      over_limit: [],
      class_assigned: [],
      anchorEl: null,
      openUploadDialog: null,
      errors: {},
    };
  }

  lampiranUploader = React.createRef(null);
  uploadedLampiran = React.createRef(null);

  componentDidMount() {
    const { user } = this.props.auth;
    const { setCurrentClass, getOneAnnouncement, getAllClass, getFileAnnouncements } = this.props;
    const { id } = this.props.match.params

    getOneAnnouncement(id)
    getAllClass()
    getFileAnnouncements(id).then((result) => {
      this.setState({ fileLampiran : result})
    })
    if (user.role ==="Student")
      setCurrentClass(user.kelas)
  }

  componentWillUnmount(){
    this.props.clearErrors()
    this.props.clearSuccess()
  }

  // kurang tau gimana cara ubah.
  UNSAFE_componentWillReceiveProps(nextProps) {
    const { selectedAnnouncements } = nextProps.announcements;

    // console.log(nextProps.tasksCollection.deadline);

    if (!nextProps.errors) {
      this.handleOpenUploadDialog();
    }

    if (nextProps.errors) {
      // if edited, nextProps.errors is false, supaya ndak run ini..
      this.setState({
          title: selectedAnnouncements.title,
          description: selectedAnnouncements.description,
          // fileLampiran: Boolean(selectedAnnouncements.lampiran) ? selectedAnnouncements.lampiran : [],
          class_assigned: Boolean(selectedAnnouncements.class_assigned) ? selectedAnnouncements.class_assigned : []
          // jadi mau dicek kalau nextProps.tasksCollection itu undefined ato ga soalnya nnti pas call fileLAmpiran.length bakal ada error.
      })
    }
  }

  handleLampiranUpload = (e) => {
    const files = Array.from(e.target.files);
    if (this.state.fileLampiran.length === 0){
      let over_limit = files.filter((file) => file.size/Math.pow(10,6) > 10)
      let allowed_file = files.filter((file) => file.size/Math.pow(10,6) <= 10)
      this.setState({fileLampiran: allowed_file, fileLampiranToAdd: allowed_file, over_limit: over_limit,fileLimitSnackbar: over_limit.length > 0})
    }
    else {
      if (files.length !== 0) {
        let allowed_file = files.filter((file) => file.size/Math.pow(10,6) <= 10);
        let over_limit = files.filter((file) => file.size/Math.pow(10,6) > 10);

        let temp = [...this.state.fileLampiran, ...allowed_file];
        let file_to_upload = [...this.state.fileLampiranToAdd, ...allowed_file]
        allowed_file = temp
        this.setState({ fileLampiran: allowed_file, fileLampiranToAdd: file_to_upload, over_limit: over_limit, fileLimitSnackbar: over_limit.length > 0})
      }
    }
    document.getElementById("file_control").value = null;
  };

  handleLampiranDelete = (e, i, name) => {
    e.preventDefault()
    let temp = Array.from(this.state.fileLampiran);
    let tempToDelete = this.state.fileLampiranToDelete;
    let tempToAdd = this.state.fileLampiranToAdd;
    //Kalau yang udah keupload, ada field filename (yang belum adanya name)
    //Untuk yang udah di DB.
    if (this.state.fileLampiran[i].filename !== undefined) {
      //Remove the file in fileLampiranToDelete
      tempToDelete.push(temp[i]);
    } else {
      //Untuk yang belum di DB
      //Remove the file in fileLampiranToAdd
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

  handleCloseErrorSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    this.setState({fileLimitSnackbar: false});
  }

  onChange = (e, otherfield=null) => {
    if (otherfield) {
      this.setState({ [otherfield]: e.target.value });
    } else {
      this.setState({ [e.target.id]: e.target.value });
    }
  };

  onSubmit = (e) => {
    e.preventDefault();

    const { id } = this.props.match.params;
    const {
      fileLampiranToAdd,
      fileLampiranToDelete,
      fileLampiran,
    } = this.state;
    const { user } = this.props.auth;
    const { kelas } = this.props.classesCollection;
    const { selectedAnnouncements } = this.props.announcements;

    const announcementObject = {
      title: this.state.title,
      description: this.state.description,
      class_assigned:
        user.role === "Student" ? [kelas] : this.state.class_assigned,
      errors: {},
    };

    let formData = new FormData()
    for (var i = 0; i< fileLampiranToAdd.length; i++) {
      formData.append("lampiran_announcement", fileLampiranToAdd[i])
    }

    this.props.updateAnnouncement(
      formData,
      fileLampiranToDelete,
      selectedAnnouncements.lampiran,
      announcementObject,
      id,
      this.props.history
    );
    this.setState({ fileLampiranToDelete: [] });
  };

  render() {
    document.title = "Schooly | Sunting Pengumuman";

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
    const { fileLampiran, class_assigned } = this.state;
    const { errors, success } = this.props;
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
    }
    const listFileChosen = () => {
      let temp = []
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

    if (user.role === "Student" && Boolean(kelas.ketua_kelas) && kelas.ketua_kelas !== user._id) {
      console.log(kelas.ketua_kelas, user._id)
      return (
        <Redirect to="/tidak-ditemukan"/>
      )
    }

    return (
      <div className={classes.root}>
        <UploadDialog
          openUploadDialog={this.state.openUploadDialog}
          success={success}
          messageUploading="Pengumuman sedang disunting"
          messageSuccess="Pengumuman telah disunting"
          redirectLink={`/pengumuman/${this.props.match.params.id}`}
        />
        <Paper>
          <div className={classes.content}>
            <Typography variant="h5" gutterBottom>
              <b>Sunting Pengumuman</b>
            </Typography>
          </div>
          <Divider />
          <form noValidate onSubmit={this.onSubmit}>
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
                      helperText={errors.title}
                      className={classnames("", {
                        invalid: errors.title,
                      })}
                    />
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
                      helperText={errors.description}
                      className={classnames("", {
                        invalid: errors.description,
                      })}
                    />
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
                  {user.role === "Student" ? null : (
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
                          renderValue={(selected) => {
                            return (
                              <div className={classes.chips}>
                                {selected.map((id) => {
                                  let name;
                                  if (all_classes.length === 0) return null;
                                  else {
                                    for (var i in all_classes) {
                                      if (all_classes[i]._id === id) {
                                        name = all_classes[i].name;
                                        break;
                                      }
                                    }
                                    return (
                                      <Chip
                                        key={id}
                                        label={name}
                                        className={classes.chip}
                                      />
                                    );
                                  }
                                })}
                              </div>
                            );
                          }}
                        >
                          {all_classes.map((kelas) => {
                            return (
                              <MenuItem value={kelas._id}>
                                {kelas.name}
                              </MenuItem>
                            );
                          })}
                        </Select>
                        <FormHelperText>
                          {Boolean(errors.class_assigned)
                            ? errors.class_assigned
                            : null}
                        </FormHelperText>
                      </FormControl>
                    </Grid>
                  )}
                  <Grid item>
                    <input
                      type="file"
                      multiple={true}
                      name="lampiran"
                      onChange={this.handleLampiranUpload}
                      ref={this.lampiranUploader}
                      id="file_control"
                      accept="file/*"
                      style={{ display: "none" }}
                    />
                    <input
                      type="file"
                      multiple={true}
                      name="file"
                      id="file"
                      ref={this.uploadedLampiran}
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
              <div>
                <Button
                  variant="contained"
                  type="submit"
                  className={classes.editAnnouncementButton}
                >
                  Sunting Pengumuman
                </Button>
              </div>
            </div>
          </form>
        </Paper>
        <Snackbar
          open={this.state.fileLimitSnackbar}
          autoHideDuration={4000}
          onClose={this.handleCloseErrorSnackbar}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}>
            <MuiAlert elevation={6} variant="filled" severity="error">
              {this.state.over_limit.length} file melebihi batas 10MB!
            </MuiAlert>
        </Snackbar> 
      </div>
    );
  }
}

EditAnnouncement.propTypes = {
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  success: PropTypes.object.isRequired,
  announcements: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  errors: state.errors,
  success: state.success,
  announcements: state.announcementsCollection,
  classesCollection: state.classesCollection,
});

export default connect(
  mapStateToProps, { getOneAnnouncement, updateAnnouncement,setCurrentClass, getAllClass, clearErrors, clearSuccess, getFileAnnouncements}
  )(withStyles(styles)(EditAnnouncement))
