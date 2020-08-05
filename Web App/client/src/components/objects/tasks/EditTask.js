import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import DateFnsUtils from "@date-io/date-fns";
import "date-fns";
import lokal from "date-fns/locale/id";
import classnames from "classnames";
import { getAllClass } from "../../../actions/ClassActions";
import { getOneTask, updateTask } from "../../../actions/TaskActions";
import { getAllSubjects } from "../../../actions/SubjectActions"
import { clearErrors } from "../../../actions/ErrorActions"
import LightTooltip from "../../misc/light-tooltip/LightTooltip";
import { Avatar, Button, Chip, CircularProgress, Dialog, Divider, FormControl, FormHelperText,
  Grid, IconButton, ListItem, ListItemAvatar, ListItemText, MenuItem, Paper, Select, TextField, Typography } from "@material-ui/core";
import { MuiPickersUtilsProvider, KeyboardDateTimePicker } from "@material-ui/pickers";
import { withStyles } from "@material-ui/core/styles";
import AttachFileIcon from "@material-ui/icons/AttachFile";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import DeleteIcon from "@material-ui/icons/Delete";
import { FaFile, FaFileAlt, FaFileExcel, FaFileImage, FaFilePdf, FaFilePowerpoint, FaFileWord } from "react-icons/fa";

const path = require("path");

const styles = (theme) => ({
  root: {
    display: "flex",
    justifyContent: "center",
    margin: "auto",
    maxWidth: "1000px",
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
    backgroundColor: theme.palette.create.main,
    color: "white",
    "&:focus, &:hover": {
      backgroundColor: theme.palette.create.main,
      color: "white",
    },
  },
  editTaskButton: {
    width: "100%",
    marginTop: "20px",
    backgroundColor: theme.palette.primary.main,
    color: "white",
    "&:focus, &:hover": {
      backgroundColor: theme.palette.primary.main,
      color: "white",
    },
  },
  uploadDialogGrid: {
    maxWidth: "300px",
    minHeight: "200px",
    padding: "15px",
  },
  uploadSuccessIcon: {
    color: "green",
    height: "45px",
    width: "45px"
  },
  uploadFinishButton: {
    width: "100%",
    marginTop: "20px",
    backgroundColor: theme.palette.create.main,
    color: "white",
    "&:focus, &:hover": {
      backgroundColor: theme.palette.create.main,
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
            {filetype === "Word" ?
                <Avatar className={classes.wordFileTypeIcon}>
                  <FaFileWord />
                </Avatar>
              :
              filetype === "Excel" ?
                <Avatar className={classes.excelFileTypeIcon}>
                  <FaFileExcel />
                </Avatar>
              :
              filetype === "Gambar" ?
                <Avatar className={classes.imageFileTypeIcon}>
                  <FaFileImage />
                </Avatar>
              :
              filetype === "PDF" ?
                <Avatar className={classes.pdfFileTypeIcon}>
                  <FaFilePdf />
                </Avatar>
              :
              filetype === "Teks" ?
                <Avatar className={classes.textFileTypeIcon}>
                  <FaFileAlt />
                </Avatar>
              :
              filetype === "Presentasi" ?
                <Avatar className={classes.presentationFileTypeIcon}>
                  <FaFilePowerpoint />
                </Avatar>
              :
              filetype === "File Lainnya" ?
                <Avatar className={classes.otherFileTypeIcon}>
                  <FaFile />
                </Avatar>
              : null
            }
          </ListItemAvatar>
          <ListItemText
            primary={
              <LightTooltip title={name} placement="top">
                <Typography>
                  {name.length < 21 ? name : `${name.slice(0,15)}..${path.extname(name)}`}
                </Typography>
              </LightTooltip>
            }
            secondary={filetype}
          />
          <IconButton
            size="small"
            className={classes.deleteIconButton}
            onClick={(e) => {handleLampiranDelete(e, i)}}
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </ListItem>
      </Paper>
    </Grid>
  )
}

class EditTask extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      subject: "",
      deadline: new Date(),
      tasksCollection: [],
      class_assigned: [],
      classChanged: false,
      focused: false,
      description: "",
      fileLampiran: [],
      fileLampiranToAdd: [],
      fileLampiranToDelete: [],
      anchorEl: null,
      openUploadDialog: null,
      errors: {},
    }
  }

  tugasUploader = React.createRef(null)
  uploadedTugas = React.createRef(null)

  componentDidMount() {
    this.props.clearErrors()
    this.props.getOneTask(this.props.match.params.id)
    this.props.getAllClass()
    this.props.getAllSubjects()
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    console.log("Tasks props is received");
    const { tasksCollection, errors } = nextProps;

    // pass errorsnya false makanya berhasil
    if (!nextProps.errors) {
      this.handleOpenUploadDialog()
    }

    console.log(tasksCollection.class_assigned)
    if (Boolean(tasksCollection) && errors) {
      this.setState({
          name: tasksCollection.name,
          subject: tasksCollection.subject,
          deadline: tasksCollection.deadline,
          class_assigned: Boolean(tasksCollection.class_assigned) ? tasksCollection.class_assigned : [],
          description: tasksCollection.description,
          fileLampiran: Boolean(tasksCollection.lampiran) ? tasksCollection.lampiran : []
          // fileLampiran must made like above soalnya because maybe nextProps.tasksCollection is still a plain object.
          // so need to check if nextProps.tasksCollection is undefined or not because when calling fileLAmpiran.length, there will be an error.
      })
    }
  }

  onSubmit = (e, classesOptions) => {
    e.preventDefault();

    const { id } = this.props.match.params;
    const { class_assigned, classChanged, fileLampiranToAdd, fileLampiranToDelete } = this.state;

    let classesSelected = [];
    console.log(class_assigned)

    class_assigned.map((id) => {
      for( var i = 0; i < classesOptions.length; i++) {
        if (classesOptions[i]._id === id) {
          classesSelected.push(classesOptions[i])
          break;
        }
      }
    return classesSelected
  })

  const taskObject = {
    name: this.state.name,
    deadline: this.state.deadline,
    subject: this.state.subject,
    description: this.state.description,
    errors: {}
  }

  if (classChanged)
    taskObject.class_assigned = classesSelected // When the classes is changed
  else
    taskObject.class_assigned = class_assigned // When it has no change

  let formData = new FormData()
  for(var i = 0; i< fileLampiranToAdd.length; i++) {
    console.log(this.state.fileLampiran[i])
    formData.append("lampiran_tugas", this.state.fileLampiranToAdd[i])
  }
  this.props.updateTask(formData, fileLampiranToDelete,
    this.props.tasksCollection.lampiran, taskObject, id, this.props.history);

    this.setState({ fileLampiranToDelete: []})
  }

  handleLampiranUpload = (e) => {
    const files = e.target.files;
    console.log(this.state.fileLampiran)
    let temp;
    let tempToAdd;

    if (this.state.fileLampiran.length === 0)
      this.setState({fileLampiran: files, fileLampiranToAdd: Array.from(files)})
    else {
      console.log(files)
      if (files.length !== 0) {
        temp = [...Array.from(this.state.fileLampiran), ...Array.from(files)];
        tempToAdd = [...Array.from(this.state.fileLampiranToAdd), ...Array.from(files)]
        this.setState({ fileLampiran: temp, fileLampiranToAdd: tempToAdd})
      }
    }
  }

  handleLampiranDelete = (e, i, name) => {
    e.preventDefault()
    console.log("Index is: ", i)
    let temp = Array.from(this.state.fileLampiran);
    let tempToDelete = this.state.fileLampiranToDelete;
    let tempToAdd = this.state.fileLampiranToAdd;
    // For the one that has already been uploaded, there will be a filename field (yang belum adanya name)
    // For the one that has already in DB
    if (this.state.fileLampiran[i].filename !== undefined) {
      // Remove the file in fileLampiranToDelete
      tempToDelete.push(temp[i])
    }
    else { // For the one that"s not yet in DB
      // Remove the file in fileLampiranToAdd
      for(var j = 0; j < tempToAdd.length; j++) {
        console.log(temp[i].name, tempToAdd[j].name)
        if (tempToAdd[j].name === temp[i].name) {
          tempToAdd.splice(j,1)
        }
      }
    }
    temp.splice(i, 1);
    console.log(tempToDelete)
    if (temp.length === 0)
      this.handleCloseMenu()
    this.setState({ fileLampiran: temp, fileLampiranToAdd: tempToAdd,
      fileLampiranToDelete: tempToDelete})
  }

  handleClickMenu = (event) => {
    if (!Boolean(this.state.anchorEl) && this.state.fileLampiran.length > 0)
      this.setState({ anchorEl: event.currentTarget})
  }

  handleCloseMenu = () => {
    this.setState({ anchorEl: null})
  }

  handleOpenUploadDialog = () => {
    this.setState({ openUploadDialog: true})
  };

  onChange = (e, otherfield) => {
    console.log(this.state.class_assigned)
    if (Object.keys(this.props.errors).length !== 0) {
      this.props.clearErrors()
    }
    if (otherfield === "kelas") {
      console.log(this.state.class_assigned, e.target.value)
      this.setState({ class_assigned: e.target.value, classChanged: true})
    }
    else if (otherfield === "deadline") {
      this.setState({ deadline: e}) // e is the date value itself.
    }
    else if (otherfield === "description") {
      this.setState({ description : e.target.value})
    }
    else if (otherfield === "subject") {
      console.log(e.target.value)
      this.setState({subject: e.target.value })
    }
    else
      this.setState({ [e.target.id]: e.target.value});
  }

  onDateChange = (date) => {
    console.log(date)
    this.setState({ deadline: date})
  }

  render() {
    const { fileLampiran, class_assigned } = this.state;
    const { classes, errors, success } = this.props;
    const { all_classes } = this.props.classesCollection;
    const { all_subjects } = this.props.subjectsCollection
    const { user } = this.props.auth;

    const task_id = this.props.match.params.id;

    console.log("FileLampiran:", this.state.fileLampiran)
    console.log("FileLampiran to add:", this.state.fileLampiranToAdd);
    console.log("FileLampiran to delete:", this.state.fileLampiranToDelete);
    console.log(class_assigned)
    const UploadDialog = () => {
      return (
        <Dialog open={this.state.openUploadDialog}>
          <Grid container direction="column" justify="space-between" alignItems="center" className={classes.uploadDialogGrid}>
            <Grid item>
              <Typography variant="h6" align="center" gutterBottom>
                {!success ? "Tugas sedang disunting" : "Tugas berhasil disunting"}
              </Typography>
            </Grid>
            <Grid item>
              {!success ? <CircularProgress /> : <CheckCircleIcon className={classes.uploadSuccessIcon} />}
            </Grid>
            <Grid item>
              {!success ?
                <Typography variant="body1" align="center" gutterBottom>
                  <b>Mohon tetap tunggu di halaman ini.</b>
                </Typography>
              :
              <Link to={`/tugas-guru/${task_id}`}>
                <Button
                  variant="contained"
                  className={classes.uploadFinishButton}
                >
                  Selesai
                </Button>
                </Link>
              }
            </Grid>
          </Grid>
        </Dialog>
      )
  }

    let classIds = []
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

    const fileType = (filename) => {
      let ext_file = path.extname(filename)
      switch(ext_file) {
        case ".docx" : return "Word"
        case ".xlsx" :
        case ".csv"  : return "Excel"

        case ".png" :
        case ".jpg" :
        case ".jpeg" : return "Gambar"

        case ".pdf" : return "PDF"

        case ".txt" :
        case ".rtf" : return "Teks"

        case ".ppt" :
        case ".pptx" : return "Presentasi"

        default: return "File Lainnya"
      }
    }

    const listFileChosen = () => {
      let temp = []
      if (fileLampiran.length > 0) {
        for (var i = 0; i < fileLampiran.length; i++) {
          temp.push(
            <LampiranFile // The one that is being displayed is in DB (filename) and the one that has just been uploaded (name)
              classes={classes}
              name={!fileLampiran[i].filename ? fileLampiran[i].name : fileLampiran[i].filename}
              filetype={!fileLampiran[i].filename ? fileType(fileLampiran[i].name) : fileType(fileLampiran[i].filename)}
              handleLampiranDelete={this.handleLampiranDelete}
              i={i}
            />
          )
        }
      }
      return temp;
    }

    if (class_assigned !== null) //When firstly received.
      class_assigned.map((kelas) => {
        if (kelas._id !== undefined)
          return classIds.push(kelas._id)
        else
          return classIds.push(kelas)
      }
    )

    document.title = "Schooly | Sunting Tugas";

    if (user.role === "Teacher" || user.role === "Admin") {
      return (
        <div className={classes.root}>
          {UploadDialog()}
          <Paper>
            <div className={classes.content}>
              <Typography variant="h5" gutterBottom>
                <b>Sunting Tugas</b>
              </Typography>
            </div>
            <Divider />
            <form noValidate onSubmit={(e) => {this.onSubmit(e, all_classes)}}>
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
                          invalid: errors.name
                        })}
                      />
                    </Grid>
                    <Grid item>
                      <Typography component="label" for="description" color="primary">
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
                          invalid: errors.description
                        })}
                      />
                    </Grid>
                  </Grid>
                </Grid>
                <Divider flexItem orientation="vertical" className={classes.divider} />
                <Grid item xs={12} md className={classes.content}>
                  <Grid container direction="column" spacing={4}>
                    <Grid item container spacing={2}>
                      <Grid item xs={12} md={6}>
                        <Typography component="label" for="subject" color="primary">
                          Mata Pelajaran
                        </Typography>
                        <FormControl id="subject" variant="outlined" color="primary" fullWidth error={Boolean(errors.subject)}>
                          <Select
                            value={this.state.subject}
                            onChange={(event) => {this.onChange(event, "subject")}}
                          >
                            {all_subjects.map((subject) => (
                              <MenuItem value={subject._id}>{subject.name}</MenuItem>
                            ))}
                          </Select>
                          <FormHelperText>
                            {Boolean(errors.subject) ? errors.subject : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Typography component="label" for="deadline" color="primary">
                          Batas Waktu
                        </Typography>
                        <MuiPickersUtilsProvider locale={lokal} utils={DateFnsUtils}>
                          <KeyboardDateTimePicker
                            fullWidth
                            disablePast
                            inputVariant="outlined"
                            format="dd/MM/yyyy - HH:mm"
                            ampm={false}
                            okLabel="Simpan"
                            cancelLabel="Batal"
                            minDateMessage="Batas waktu harus waktu yang akan datang"
                            invalidDateMessage="Format tanggal tidak benar"
                            id="deadline"
                            value={this.state.deadline}
                            onChange={(date) => this.onChange(date, "deadline")}
                          />
                        </MuiPickersUtilsProvider>
                      </Grid>
                    </Grid>
                    <Grid item>
                      <Typography component="label" for="class_assigned" color="primary">
                        Kelas yang Ditugaskan
                      </Typography>
                      <FormControl variant="outlined" fullWidth error={Boolean(errors.class_assigned)}>
                        <Select
                          multiple
                          id="class_assigned"
                          MenuProps={MenuProps}
                          value={class_assigned}
                          onChange={(event) => {this.onChange(event, "kelas")}}
                          renderValue={(selected) => (
                            <div className={classes.chips}>
                              {selected.map((id) => {
                                let name
                                for (var i in all_classes) { // i is the index
                                  if (all_classes[i]._id === id) {
                                    name = all_classes[i].name
                                    break;
                                  }
                                }
                                return (
                                  <Chip key={id} label={name} className={classes.chip} />
                                )
                              })}
                            </div>
                          )}
                        >
                          {!all_classes.length ? null : all_classes.map((kelas) => (
                              <MenuItem value={kelas._id} selected>{kelas.name}</MenuItem>
                          ))}
                        </Select>
                        <FormHelperText>
                          {Boolean(errors.class_assigned) && class_assigned.length === 0 ? errors.class_assigned : null}
                        </FormHelperText>
                      </FormControl>
                    </Grid>
                    <Grid item>
                      <input
                        type="file"
                        multiple={true}
                        name="lampiran"
                        onChange={this.handleLampiranUpload}
                        ref={this.tugasUploader}
                        accept="file/*"
                        style={{display: "none"}}
                      />
                      <input
                        type="file"
                        multiple={true}
                        name="file"
                        id="file"
                        ref={this.uploadedTugas}
                        style={{display: "none"}}
                      />
                      <Button
                        variant="contained"
                        startIcon={<AttachFileIcon />}
                        onClick={() => {this.tugasUploader.current.click()}}
                        className={classes.addFileButton}
                      >
                        Tambah Lampiran Berkas
                       </Button>
                       <Grid container spacing={1} style={{marginTop: "10px"}}>
                         {listFileChosen()}
                       </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            <Divider />
            <div style={{display: "flex", justifyContent: "flex-end"}} className={classes.content}>
              <div>
                <Button
                  variant="contained"
                  type="submit"
                  className={classes.editTaskButton}
                >
                  Sunting Tugas
                </Button>
              </div>
            </div>
            </form>
          </Paper>
        </div>
      );
    }
    else {
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

EditTask.propTypes = {
  errors: PropTypes.object.isRequired,
  success: PropTypes.object.isRequired,
  tasksCollection: PropTypes.object.isRequired,
  classesCollection: PropTypes.object.isRequired,
  subjectsCollection: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  getOneTask : PropTypes.func.isRequired,
  updateTask: PropTypes.func.isRequired,
  getAllSubjects: PropTypes.func.isRequired,
  clearErrors: PropTypes.func.isRequired,
  getAllClass: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  errors: state.errors,
  auth: state.auth,
  success: state.success,
  tasksCollection: state.tasksCollection,
  classesCollection: state.classesCollection,
  subjectsCollection: state.subjectsCollection,
})

export default connect(
    mapStateToProps, { getOneTask, updateTask, getAllClass, getAllSubjects, clearErrors }
) (withStyles(styles)(EditTask))
