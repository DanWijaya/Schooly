import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import classnames from "classnames";
import {
  getOneAnnouncement,
  updateAnnouncement,
} from "../../../actions/AnnouncementActions";
import { getAllClass, setCurrentClass } from "../../../actions/ClassActions";
import { clearErrors } from "../../../actions/ErrorActions";
import { clearSuccess } from "../../../actions/SuccessActions"
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
} from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
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
  editAnnouncementButton: {
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
    marginRight: "7.5px"
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
      class_assigned: [],
      anchorEl: null,
      openUploadDialog: null,
      openDeleteDialog: null,
      errors: {},
      target_role: ""
    };
  }

  lampiranUploader = React.createRef(null);
  uploadedLampiran = React.createRef(null);

  componentDidMount() {
    window.scrollTo(0, 0);
    const { user } = this.props.auth;
    const { setCurrentClass, getOneAnnouncement, getAllClass } = this.props;

    getOneAnnouncement(this.props.match.params.id);
    getAllClass();
    if (user.role === "Student") setCurrentClass(user.kelas);
  }

  componentWillUnmount(){
    this.props.clearErrors()
    this.props.clearSuccess()
  }

  // kurang tau gimana cara ubah.
  UNSAFE_componentWillReceiveProps(nextProps) {
    const { selectedAnnouncements } = nextProps.announcements;

    if (!nextProps.errors) {
      this.handleOpenUploadDialog();
    }

    if (nextProps.errors) {
      // if edited, nextProps.errors is false, supaya ndak run ini..
      this.setState({
        title: selectedAnnouncements.title,
        description: selectedAnnouncements.description,
        fileLampiran: Boolean(selectedAnnouncements.lampiran)
          ? selectedAnnouncements.lampiran
          : [],
        class_assigned: Boolean(selectedAnnouncements.class_assigned)
          ? selectedAnnouncements.class_assigned
          : [],
        target_role: selectedAnnouncements.to
        // yg fileLampiran perlu gitu soalnya awal" mungkin nextProps.tasksCollection nya masih plain object.
        // jadi mau dicek kalau nextProps.tasksCollection itu undefined ato ga soalnya nnti pas call fileLAmpiran.length bakal ada error.
      });
    }
  }

  handleLampiranUpload = (e) => {
    const files = e.target.files;
    let temp;
    let tempToAdd;
    if (this.state.fileLampiran.length === 0){
      this.setState({fileLampiran: Array.from(files), fileLampiranToAdd: Array.from(files)})
    }
    else {
      if (files.length !== 0) {
        temp = [...this.state.fileLampiran, ...Array.from(files)];
        tempToAdd = [...this.state.fileLampiranToAdd, ...Array.from(files)]
        this.setState({ fileLampiran: temp, fileLampiranToAdd: tempToAdd})
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

  handleOpenDeleteDialog = () => {
    this.setState({ openDeleteDialog: true });
  };

  handleCloseDeleteDialog = () => {
    this.setState({ openDeleteDialog: false });
  };

  onChange = (e, otherfield = null) => {
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
      // fileLampiran,
    } = this.state;
    const { user } = this.props.auth;
    const { kelas } = this.props.classesCollection;
    const { selectedAnnouncements } = this.props.announcements;

    const announcementObject = {
      title: this.state.title,
      description: this.state.description,
      class_assigned: user.role === "Student" ? [kelas] : user.role === "Admin" ? [null] : this.state.class_assigned,      
      errors: {},
      to: user.role === "Admin" ? this.state.target_role : "Student"
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
    const { fileLampiran, class_assigned, target_role } = this.state;
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
        <DeleteDialog
          openDeleteDialog={this.state.openDeleteDialog}
          handleCloseDeleteDialog={this.handleCloseDeleteDialog}
          itemType={"Sunting"}
          itemName={this.state.title}
          // itemName={this.state.name}
          // isLink={true}
          // redirectLink="/daftar-kuis"
          redirectLink={
            `/daftar-pengumuman`
          }
          isWarning={false}
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
                  {user.role === "Student" ? null :
                    user.role === "Admin" ? (
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
                          error={
                            Boolean(errors.to) &&
                            target_role.length === 0
                          }
                        >
                          <Select
                            id="target_role"
                            MenuProps={MenuProps}
                            value={target_role}
                            onChange={(event) => {
                              this.onChange(event, "target_role");
                            }}
                          >
                            {[["Student", "Murid"], ["Teacher", "Guru"], ["Teacher_Student", "Keduanya"]].map((peran) => {
                              return (
                                <MenuItem
                                  key={peran[0]}
                                  value={peran[0]}
                                >
                                  {peran[1]}
                                </MenuItem>
                              );
                            })}
                          </Select>
                          <FormHelperText>
                            {Boolean(errors.to) &&
                              target_role.length === 0
                              ? errors.to
                              : null}
                          </FormHelperText>
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
                  className={classes.editAnnouncementButton}
                >
                  Sunting Pengumuman
                </Button>
              </div>
            </div>
          </form>
        </Paper>
      </div>
    );
  }
}

EditAnnouncement.propTypes = {
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  success: PropTypes.object.isRequired,
  announcements: PropTypes.object.isRequired,
  getAnnouncement: PropTypes.func.isRequired,
  getAllAnnouncements: PropTypes.func.isRequired,
  getOneAnnouncement: PropTypes.func.isRequired,
  updateAnnouncement: PropTypes.func.isRequired,
  setCurrentClass: PropTypes.func.isRequired,
  clearErrors: PropTypes.func.isRequired,
  clearSuccess: PropTypes.func.isRequired,
  getAllClass: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  errors: state.errors,
  success: state.success,
  announcements: state.announcementsCollection,
  classesCollection: state.classesCollection,
});

export default connect(
  mapStateToProps, { getOneAnnouncement, updateAnnouncement,setCurrentClass, getAllClass, clearErrors, clearSuccess }
  )(withStyles(styles)(EditAnnouncement))
