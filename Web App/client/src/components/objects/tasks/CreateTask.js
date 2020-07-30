import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import DateFnsUtils from "@date-io/date-fns";
import "date-fns";
import lokal from "date-fns/locale/id";
import classnames from "classnames";
import { createTask } from "../../../actions/TaskActions"
import { viewClass } from "../../../actions/ClassActions";
import { getAllSubjects } from "../../../actions/SubjectActions"
import { getOneUser } from "../../../actions/UserActions";
import { clearErrors } from "../../../actions/ErrorActions"
import LightTooltip from "../../misc/light-tooltip/LightTooltip";
import { Avatar, Button, CircularProgress, Chip, Dialog, Divider, FormControl, FormHelperText, Grid, IconButton,
   ListItem, ListItemAvatar, ListItemText, MenuItem, Paper, Select, TextField, Typography } from "@material-ui/core";
import { MuiPickersUtilsProvider, KeyboardDateTimePicker } from "@material-ui/pickers";
import { withStyles } from "@material-ui/core/styles";
import AttachFileIcon from "@material-ui/icons/AttachFile";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import DeleteIcon from "@material-ui/icons/Delete";
import { FaFile, FaFileAlt, FaFileExcel, FaFileImage, FaFilePdf, FaFilePowerpoint, FaFileWord } from "react-icons/fa";

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
  createTaskButton: {
    backgroundColor: theme.palette.create.main,
    color: "white",
    "&:focus, &:hover": {
      backgroundColor: theme.palette.create.main,
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

class CreateTask extends Component {
  constructor() {
    super();
    this.state = {
      name: "",
      subject: "",
      deadline: new Date(),
      focused: false,
      class_assigned: [],
      description: "",
      errors: {},
      fileLampiran: [],
      openUploadDialog: null,
      anchorEl: null
    }
  }

  lampiranUploader = React.createRef(null)
  uploadedLampiran = React.createRef(null)

  handleClickMenu = (event) => {
    //Needed so it will not be run when filetugas = null or filetugas array is empty
    if (this.state.fileLampiran.length > 0 && !Boolean(this.state.anchorEl))
      this.setState({ anchorEl: event.currentTarget})
  }

  handleCloseMenu = () => {
    this.setState({ anchorEl: null})
  }

  handleOpenUploadDialog = () => {
    this.setState({ openUploadDialog: true})
  };

  onChange = (e, otherfield) => {
    console.log(this.state.class_assigned, e.target.value)
    // if (Object.keys(this.props.errors).length !== 0)
    //   this.props.clearErrors()
    if (otherfield === "kelas") {
      this.setState({ class_assigned: e.target.value})
    }
    else if (otherfield === "deadline") {
      this.setState({ deadline: e}) // e is the date value itself.
    }
    else if (otherfield === "description") {
      this.setState({ description : e.target.value})
    }
    else if (otherfield === "subject") {
      this.setState({ subject: e.target.value})
    }
    else
      this.setState({ [e.target.id]: e.target.value});
      console.log(this.state.fileLampiran)
  }

  onDateChange = (date) => {
    console.log(date)
    this.setState({ deadline: date})
  }

  onSubmit = (e, id) => {
    e.preventDefault();
    let formData = new FormData()
    const taskData = {
      name: this.state.name,
      deadline: this.state.deadline,
      subject: this.state.subject,
      class_assigned: this.state.class_assigned,
      person_in_charge_id: id,
      description: this.state.description,
      errors: {},
    };

    //Check if there is any lampiran_tugas uploaded or not.
    if (this.state.fileLampiran)
      for(var i = 0; i < this.state.fileLampiran.length; i++) {
        console.log(this.state.fileLampiran[i])
        formData.append("lampiran_tugas", this.state.fileLampiran[i])
      }
      console.log(formData.getAll("lampiran_tugas"), this.state.fileLampiran)
      console.log(taskData)
      this.props.createTask(formData, taskData, this.props.history);
  }

  // UNSAFE_componentWillReceiveProps() is invoked before
  // a mounted component receives new props. If you need
  // update the state in response to prop changes (for example, to reset it),
  // you may compare this.props and nextProps and perform state transitions
  // using this.setState() in this method.

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (!nextProps.errors) {
        this.handleOpenUploadDialog()
    }
  }

  componentDidMount() {
    const { clearErrors, viewClass, getAllSubjects} = this.props;
    clearErrors()
    viewClass()
    getAllSubjects()
  }

  handleLampiranUpload = (e) => {
    const files = e.target.files;
    if (this.state.fileLampiran.length === 0)
      this.setState({fileLampiran: files})
    else {
      if (files.length !== 0) {
        let temp = [...Array.from(this.state.fileLampiran), ...Array.from(files)]
        this.setState({ fileLampiran: temp})
      }
    }
  }

  handleLampiranDelete = (e, i) => {
    e.preventDefault()
    console.log("Index is: ", i)
    let temp = Array.from(this.state.fileLampiran);
    temp.splice(i,1);
    if (temp.length === 0) //If it is empty.
      this.handleCloseMenu()
    this.setState({ fileLampiran: temp})
  }

  render() {
    const { classes, errors, success}  = this.props;
    const { class_assigned, fileLampiran}  = this.state;
    const { all_classes } = this.props.classesCollection;
    const { all_subjects } = this.props.subjectsCollection;
    const { user } = this.props.auth
    console.log(errors)

    const UploadDialog = () => {
      return (
        <Dialog open={this.state.openUploadDialog}>
          <Grid container direction="column" justify="space-between" alignItems="center" className={classes.uploadDialogGrid}>
            <Grid item justify="center">
              <Typography variant="h6" align="center" gutterBottom>
                {!success ? "Tugas sedang dibuat" : "Tugas berhasil dibuat"}
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
              <Link to="/daftar-tugas">
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
          console.log(i)
          temp.push(
            <LampiranFile
              classes={classes}
              name={fileLampiran[i].name}
              filetype={fileType(fileLampiran[i].name)}
              handleLampiranDelete={this.handleLampiranDelete}
              i={i}
            />
          )
        }
      }
      return temp;
    }

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

    document.title = "Schooly | Buat Tugas";

    if (user.role === "Teacher") {
      return (
        <div className={classes.root}>
          {UploadDialog()}
          <Paper>
            <div className={classes.content}>
              <Typography variant="h5" gutterBottom>
                <b>Buat Tugas</b>
              </Typography>
              <Typography color="textSecondary">
                Tambahkan keterangan tugas untuk membuat tugas.
              </Typography>
            </div>
            <Divider />
            <form noValidate onSubmit={(e) =>this.onSubmit(e,user.id)}>
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
                            onChange={(date) => this.onDateChange(date)}
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
                          {all_classes.map((kelas) => { console.log(kelas, class_assigned)
                            return (
                              <MenuItem value={kelas._id} key={kelas._id} selected>{kelas.name}</MenuItem>
                          )})}
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
                        ref={this.lampiranUploader}
                        accept="file/*"
                        style={{display: "none"}}
                      />
                      <input
                        type="file"
                        multiple={true}
                        name="file"
                        id="file"
                        ref={this.uploadedLampiran}
                        style={{display: "none"}}
                      />
                      <Button
                        variant="contained"
                        startIcon={<AttachFileIcon />}
                        onClick={() => {this.lampiranUploader.current.click()}}
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
                <Button
                  variant="contained"
                  type="submit"
                  className={classes.createTaskButton}
                >
                  Buat Tugas
                </Button>
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
      )
    }
  }
}

CreateTask.propTypes = {
  createTask: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired,
  success: PropTypes.object.isRequired,
  viewClass: PropTypes.func.isRequired,
  getAllSubjects: PropTypes.func.isRequired,
  getOneUser: PropTypes.func.isRequired,
  clearErrors: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors,
  success: state.success,
  subjectsCollection: state.subjectsCollection,
  classesCollection: state.classesCollection,
})

export default connect(
  mapStateToProps, { createTask, viewClass, getAllSubjects, getOneUser, clearErrors }
) (withStyles(styles)(CreateTask))
