import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import classnames from "classnames";
import { getAllClass } from "../../../actions/ClassActions";
import { clearErrors } from "../../../actions/ErrorActions";
import { clearSuccess } from "../../../actions/SuccessActions";
import { getAllSubjects } from "../../../actions/SubjectActions";
import { createMaterial } from "../../../actions/MaterialActions";
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
  createMaterialButton: {
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

class CreateMaterial extends Component {
  constructor() {
    super();
    this.state = {
      name: "",
      subject: "",
      focused: false,
      class_assigned: [],
      description: "",
      errors: {},
      fileLampiran: [],
      openUploadDialog: null,
      openDeleteDialog: null,
      anchorEl: null,
      over_limit: [],
      fileLimitSnackbar: false,
      // sortFlag: false
    };
  }

  lampiranUploader = React.createRef(null);

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
  };

  handleOpenDeleteDialog = () => {
    this.setState({ openDeleteDialog: true });
  };

  handleCloseDeleteDialog = () => {
    this.setState({ openDeleteDialog: false });
  };

  onChange = (e, otherfield) => {
    let field = e.target.id ? e.target.id : otherfield;
    if (this.state.errors[field]) {
      this.setState({ errors: { ...this.state.errors, [field]: null } });
    }
    this.setState({ [field]: e.target.value });
  };

  onSubmit = (e, id) => {
    e.preventDefault();
    let formData = new FormData();

    //Check if there is any lampiran uploaded or not.
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
      errors: {},
    };

    console.log(this.state.fileLampiran);
    // this.props.createMaterial(formData, materialData, this.props.history)
    this.props
      .createMaterial(formData, materialData, this.props.history)
      .then((res) => this.handleOpenUploadDialog())
      .catch((err) => {
        this.setState({ errors: err });
      });
  };

  // componentDidUpdate(prevProps, prevState) {
  //   if (!this.props.errors && this.props.errors !== prevProps.errors) {
  //     this.handleOpenUploadDialog();
  //   }
  // }

  componentDidMount() {
    this.props.getAllClass();
    this.props.getAllSubjects();
  }

  componentWillUnmount() {
    this.props.clearErrors();
    this.props.clearSuccess();
  }

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
    let temp = [...Array.from(this.state.fileLampiran), ...Array.from(files)];
    let over_limit = temp.filter((file) => file.size / Math.pow(10, 6) > 10);
    let file_to_upload = temp.filter(
      (file) => file.size / Math.pow(10, 6) <= 10
    );

    if (this.state.errors.lampiran_materi) {
      // karena errornya ini berupa lampiran_materi
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
    const { classes, success } = this.props; // originally have errors
    const { all_classes } = this.props.classesCollection;
    const { all_subjects } = this.props.subjectsCollection;
    const { class_assigned, fileLampiran, errors } = this.state;
    const { user } = this.props.auth;

    console.log(class_assigned);
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

    document.title = "Schooly | Buat Materi";

    if (user.role === "Teacher") {
      return (
        <div className={classes.root}>
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
            itemType={"Materi"}
            itemName={this.state.name}
            // isLink={true}
            // redirectLink="/daftar-kuis"
            redirectLink={`/daftar-materi`}
            isWarning={false}
          />
          <Paper>
            <div className={classes.content}>
              <Typography variant="h5" gutterBottom>
                <b>Buat Materi</b>
              </Typography>
              <Typography color="textSecondary">
                Tambahkan keterangan materi untuk membuat materi.
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
                        helperText={errors.name}
                        className={classnames("", {
                          invalid: errors.name,
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
                        error={Boolean(errors.subject) && !this.state.subject}
                      >
                        <Select
                          value={this.state.subject}
                          onChange={(event) => {
                            this.onChange(event, "subject");
                          }}
                        >
                          {all_subjects.map((subject) => (
                            <MenuItem value={subject._id}>
                              {subject.name}
                            </MenuItem>
                          ))}
                        </Select>
                        <FormHelperText>
                          {Boolean(errors.subject) && !this.state.subject
                            ? errors.subject
                            : null}
                        </FormHelperText>
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
                          renderValue={(selected) => (
                            <div className={classes.chips}>
                              {selected.map((kelas) => {
                                console.log(selected);
                                console.log(kelas, class_assigned);
                                return (
                                  <Chip
                                    key={kelas}
                                    label={kelas.name}
                                    className={classes.chip}
                                  />
                                );
                              })}
                            </div>
                          )}
                        >
                          {all_classes.map((kelas) => {
                            return (
                              <MenuItem
                                key={kelas}
                                selected={true}
                                value={kelas}
                              >
                                {kelas.name}
                              </MenuItem>
                            );
                          })}
                        </Select>
                        <FormHelperText>
                          {Boolean(errors.class_assigned) &&
                          class_assigned.length === 0
                            ? errors.class_assigned
                            : null}
                        </FormHelperText>
                      </FormControl>
                    </Grid>
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
                      <Button
                        variant="contained"
                        startIcon={<AttachFileIcon />}
                        onClick={() => this.lampiranUploader.current.click()}
                        className={classes.addFileButton}
                      >
                        Tambah Lampiran Berkas
                      </Button>
                      <FormHelperText error>
                        {errors.lampiran_materi}
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
                    className={classes.createMaterialButton}
                  >
                    Buat Materi
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

CreateMaterial.propTypes = {
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
});

export default connect(mapStateToProps, {
  getAllClass,
  getAllSubjects,
  createMaterial,
  clearErrors,
  clearSuccess,
})(withStyles(styles)(CreateMaterial));
