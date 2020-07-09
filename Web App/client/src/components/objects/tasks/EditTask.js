import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import DateFnsUtils from "@date-io/date-fns";
import "date-fns";
import lokal from "date-fns/locale/id";
import classnames from "classnames";
import { viewClass } from "../../../actions/ClassActions";
import { viewOneTask, updateTask } from "../../../actions/TaskActions";
import { getAllSubjects } from "../../../actions/SubjectActions"
import { clearErrors } from "../../../actions/ErrorActions"
import LightTooltip from "../../misc/light-tooltip/LightTooltip";
import OutlinedTextField from "../../misc/text-field/OutlinedTextField";
import { Button, Chip, CircularProgress, Dialog, FormControl,FormHelperText, Grid, IconButton, Menu, MenuItem, ListItemIcon, ListItemText, Paper, Select, Typography } from "@material-ui/core";
import { MuiPickersUtilsProvider, KeyboardDateTimePicker } from "@material-ui/pickers";
import { withStyles } from "@material-ui/core/styles";
import AttachFileIcon from "@material-ui/icons/AttachFile";
import DescriptionIcon from "@material-ui/icons/Description";
import HighlightOffIcon from "@material-ui/icons/HighlightOff";
import ErrorIcon from "@material-ui/icons/Error";
import CheckCircleIcon from '@material-ui/icons/CheckCircle';

const path = require("path");

const StyledMenu = withStyles({
  paper: {
    border: "1px solid #D3D4D5",
  },
})((props) => (
  <Menu
    elevation={0}
    getContentAnchorEl={null}
    anchorOrigin={{
      vertical: "bottom",
      horizontal: "center",
    }}
    transformOrigin={{
      vertical: "top",
      horizontal: "center",
    }}
    {...props}
  />
));

const StyledMenuItem = withStyles((theme) => ({
  root: {
    cursor: "default",
    width: "300px",
    "&:focus, &:hover": {
      backgroundColor: "transparent",
    },
  },
}))(MenuItem);

const styles = (theme) => ({
  root: {
    display: "flex",
    justifyContent: "center",
    margin: "auto",
    maxWidth: "1000px",
  },
  mainGrid: {
    width: "450px",
    padding: "30px",
  },
  gridItem: {
    width: "350px",
  },
  formTitle: {
    textAlign: "center",
    marginBottom: "30px",
  },
  inputField: {
    width: "400px",
  },
  inputLabel: {
    color: theme.palette.primary.main,
    fontSize: "15px",
  },
  errorInfo: {
    color: "red",
    fontSize: "10px"
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
    maxWidth: 300,
  },
  chips: {
    display: "flex",
    flexWrap: "wrap",
  },
  chip: {
    margin: 2,
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
  finishButton: {
    width: "100%",
    marginTop: "20px",
    backgroundColor: "#61BD4F",
    color: "white",
    "&:focus, &:hover": {
      backgroundColor: "#61BD4F",
      color: "white",
    },
  },
  successIcon: {
    color: "green",
    padding: 0,
    margin: 0,
    height: "45px",
    width: "45px"
  },
  uplaodDialogGrid: {
    padding: "10px",
    width: "275px", 
    height: "175px"
  }
});

function LampiranFile(props) {
  const { name, i, handleLampiranDelete} = props;

  return(
    <StyledMenuItem disableRipple>
      <ListItemIcon>
        <DescriptionIcon/>
      </ListItemIcon>
      <ListItemText primary={name.length < 21 ? name : `${name.slice(0,15)}..${path.extname(name)}`}/>
      <IconButton>
        <HighlightOffIcon
          fontSize="small"
          style={{color:"#B22222"}}
          onClick={(e) => {handleLampiranDelete(e, i, name)}}
        />
      </IconButton>
    </StyledMenuItem>
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
      class_assigned: null,
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
    this.props.viewOneTask(this.props.match.params.id)
    this.props.viewClass()
    this.props.getAllSubjects()
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    console.log("Tasks props is received");
    const { name } = this.state;

    if(!nextProps.errors){
      this.handleOpenUploadDialog()
    }

    if(!name){
      this.setState({
          name: nextProps.tasksCollection.name,
          subject: nextProps.tasksCollection.subject,
          deadline: nextProps.tasksCollection.deadline,
          class_assigned: nextProps.tasksCollection.class_assigned,
          description: nextProps.tasksCollection.description,
          fileLampiran: Boolean(nextProps.tasksCollection.lampiran) ? nextProps.tasksCollection.lampiran : []
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
      if(classesOptions[i]._id === id) {
        classesSelected.push(classesOptions[i])
        break;
      }
    }
  })

  const taskObject = {
    name: this.state.name,
    deadline: this.state.deadline,
    subject: this.state.subject,
    description: this.state.description,
    errors: {}
  }

  if(classChanged)
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
  }

  handleLampiranUpload = (e) => {
    const files = e.target.files;
    console.log(this.state.fileLampiran)
    let temp;
    let tempToAdd;

    if(this.state.fileLampiran.length === 0)
      this.setState({fileLampiran: files, fileLampiranToAdd: Array.from(files)})
    else{
      console.log(files)
      if(files.length !== 0) {
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
    if(this.state.fileLampiran[i].filename !== undefined) {
      // Remove the file in fileLampiranToDelete
      tempToDelete.push(temp[i])
    }
    else { // For the one that's not yet in DB
      // Remove the file in fileLampiranToAdd
      for(var j = 0; j < tempToAdd.length; j++) {
        console.log(temp[i].name, tempToAdd[j].name)
        if(tempToAdd[j].name === temp[i].name){
          tempToAdd.splice(j,1)
        }
      }
    }
    temp.splice(i, 1);
    console.log(tempToDelete)
    if(temp.length === 0)
      this.handleCloseMenu()
    this.setState({ fileLampiran: temp, fileLampiranToAdd: tempToAdd,
      fileLampiranToDelete: tempToDelete})
  }

  handleClickMenu = (event) => {
    if(!Boolean(this.state.anchorEl) && this.state.fileLampiran.length > 0)
      this.setState({ anchorEl: event.currentTarget})
  }

  handleCloseMenu = () => { 
    this.setState({ anchorEl: null}) 
  }

  handleOpenUploadDialog = () => {
    this.setState({ openUploadDialog: true})
  };

  onChange = (e, otherfield) => {
    if(Object.keys(this.props.errors).length !== 0){
      this.props.clearErrors()
    }
    if(otherfield === "kelas"){
      console.log(this.state.class_assigned, e.target.value)
      this.setState({ class_assigned: e.target.value, classChanged: true})
    }
    else if(otherfield === "deadline") {
      this.setState({ deadline: e}) // e is the date value itself.
    }
    else if(otherfield === "description") {
      this.setState({ description : e.target.value})
    }
    else if(otherfield === "subject") {
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
    const { fileLampiran } = this.state;
    const { classes, errors, success } = this.props;
    const { all_classes, selectedClasses } = this.props.classesCollection;
    const { all_subjects } = this.props.subjectsCollection
    const { user } = this.props.auth;

    const task_id = this.props.match.params.id;

    console.log("FileLampiran:", this.state.fileLampiran)
    console.log("FileLampiran to add:", this.state.fileLampiranToAdd);
    console.log("FileLampiran to delete:", this.state.fileLampiranToDelete);

    const UploadDialog = () => {
      return(
        <Dialog
          open={this.state.openUploadDialog}
          style={{display: "flex", flexDirection: "column"}}
        >
          <Grid container className={classes.uplaodDialogGrid} direction="column" alignItems="center" justify="space-betweeen">
            <Grid item justify="center">
              <Typography variant="h6" align="center" gutterBottom>
                {!success ? "Tugas sedang disunting" : "Tugas berhasil disunting"}
              </Typography>
            </Grid>
            <Grid item>
              {!success ? <CircularProgress /> : <CheckCircleIcon className={classes.successIcon}/>}
            </Grid>
            <Grid item justify="center">
              {!success ? 
              <Typography variant="body1" align="center" gutterBottom>
                <b>Mohon tetap tunggu di halaman ini.</b>
              </Typography> : 
                <Button
                href={`/tugas-guru/${task_id}`}
                variant="contained"
                className={classes.finishButton}>
                OKE
              </Button>
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

    const listFileChosen = () => {
      let temp = []
      if(fileLampiran.length > 0) {
        for (var i = 0; i < fileLampiran.length; i++) {
          temp.push(
            <LampiranFile // The one that is being displayed is in DB (filename) and the one that has just been uploaded (name)
              name={fileLampiran[i].filename === undefined?
                fileLampiran[i].name :
                fileLampiran[i].filename
              }
              handleLampiranDelete={this.handleLampiranDelete}
              i={i}
            />
          )
        }
      }
      return temp;
    }

    if(this.state.class_assigned != null) //When firstly received.
      this.state.class_assigned.map((kelas) => {
        if(kelas._id != undefined)
          classIds.push(kelas._id)
        else
          classIds.push(kelas)
      }
    )

    document.title = "Schooly | Sunting Tugas";

    if(user.role === "Teacher" || user.role === "Admin") {
      return(
        <div className={classes.root}>
          {UploadDialog()}
          <Paper>
            <div className={classes.mainGrid}>
              <Typography variant="h5" className={classes.formTitle}>
                <b>Sunting Tugas</b>
              </Typography>
              <form noValidate onSubmit={(e) => {this.onSubmit(e, all_classes)}}>
                <Grid
                  container
                  direction="column"
                  alignItems="center"
                  spacing={4}
                >
                  <Grid item className={classes.gridItem}>
                    <OutlinedTextField
                      on_change={this.onChange}
                      value={this.state.name}
                      error={errors.name}
                      id="name"
                      type="text"
                      className={classnames("", {
                        invalid: errors.name
                      })}
                      labelname="Nama Tugas"
                      html_for="tugas"
                      label_classname={classes.inputLabel}
                      span_classname={classes.errorInfo}
                      error1={errors.name}
                    />
                  </Grid>
                  <Grid item className={classes.gridItem}>
                    <FormControl id="subject" variant="outlined" color="primary" fullWidth error={Boolean(errors.subject)}>
                      <label id="subject" className={classes.inputLabel}>Mata Pelajaran</label>
                      <Select
                        value={this.state.subject}
                        onChange={(event) => {this.onChange(event, "subject")}}
                      >
                        {all_subjects.map((subject) => (
                          <MenuItem value={subject.name}>{subject.name}</MenuItem>
                        ))}
                      </Select>
                      <FormHelperText style={{marginLeft: 0, paddingLeft: 0, display:"flex", alignItems:"center"}}>
                      {Boolean(errors.subject) ? <ErrorIcon style={{ height: "5%", width:"5%"}} /> : null}
                      {Boolean(errors.subject) ? <Typography variant="h8" style={{marginLeft: "4px"}}>{errors.subject}</Typography> : null}
                    </FormHelperText>
                    </FormControl>
                  </Grid>
                  <Grid item className={classes.gridItem}>
                    <FormControl variant="outlined" fullWidth error={Boolean(errors.class_assigned)}>
                      <label id="class_assigned" className={classes.inputLabel}>Kelas yang dipilih</label>
                      <Select
                        error={errors.class_assigned !== undefined}
                        id="class_assigned"
                        multiple
                        MenuProps={MenuProps}
                        value={classIds}
                        onChange={(event) => {this.onChange(event, "kelas")}}
                        renderValue={(selected) => {
                          return(
                            <div className={classes.chips}>
                              {selected.map((id) => {
                                let name
                                for (var i in all_classes){ // i is the index
                                  if(all_classes[i]._id === id){
                                    name = all_classes[i].name
                                    break;
                                  }
                                }
                                return(
                                  <Chip key={id} label={name} className={classes.chip} />
                                )
                              })}
                            </div>
                        )}}
                      >
                        {all_classes.map((kelas) => (
                            <MenuItem value={kelas._id} selected>{kelas.name}</MenuItem>
                        ))}
                      </Select>
                      <FormHelperText style={{marginLeft: 0, paddingLeft: 0, display:"flex", alignItems:"center"}}>
                        {Boolean(errors.class_assigned)? <ErrorIcon style={{ height: "5%", width:"5%"}} /> : null}
                        {Boolean(errors.class_assigned)? <Typography variant="h8" style={{marginLeft: "4px"}}>{errors.class_assigned}</Typography> : null}
                      </FormHelperText>
                    </FormControl>
                  </Grid>
                  <Grid item className={classes.gridItem}>
                    <OutlinedTextField
                      on_change={(e) => this.onChange(e, "description")}
                      value={this.state.description}
                      error={errors.description}
                      id="descripton"
                      type="textarea"
                      className={classnames("", {
                        invalid: errors.description
                      })}
                      labelname="Deskripsi"
                      html_for="description"
                      label_classname={classes.inputLabel}
                      span_classname={classes.errorInfo}
                      multiline={true}
                      error1={errors.description}
                    />
                  </Grid>
                  <Grid item container direction="row" className={classes.gridItem} alignItems="center">
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
                    <Grid item container direction="row" alignItems="center">
                      <Grid item xs={11} onClick={this.handleClickMenu}>
                        <OutlinedTextField
                          disabled={true}
                          value={fileLampiran && fileLampiran.length > 0 ? `${fileLampiran.length} berkas (Klik untuk melihat)` : "Kosong"}
                          id="file_tugas"
                          type="text"
                          width="100%"
                          labelname="Lampiran Berkas"
                          html_for="Berkas lampiran"
                          label_classname={classes.inputLabel}
                          pointer= {fileLampiran.length > 0}
                        />
                      </Grid>
                      <StyledMenu
                        id="fade-menu"
                        anchorEl={this.state.anchorEl}
                        keepMounted
                        open={Boolean(this.state.anchorEl)}
                        onClose={this.handleCloseMenu}
                      >
                        {listFileChosen()}
                      </StyledMenu>
                      <Grid item xs={1}>
                        <LightTooltip title="Tambahkan Lampiran Berkas">
                          <IconButton onClick={() => {this.tugasUploader.current.click()}}>
                            <AttachFileIcon />
                          </IconButton>
                        </LightTooltip>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item className={classes.gridItem}>
                    <label id="class_assigned" className={classes.inputLabel}>Batas Waktu</label>
                    <MuiPickersUtilsProvider locale={lokal} utils={DateFnsUtils}>
                      <KeyboardDateTimePicker
                        fullWidth
                        // disablePast
                        format="dd/MM/yyyy HH:mm"
                        margin="normal"
                        okLabel="Simpan"
                        cancelLabel="Batal"
                        id="date-picker-inline"
                        value={this.state.deadline}
                        onChange={(date) => this.onChange(date, "deadline")}
                        inputProps={{
                          style: {
                            borderBottom: "none",
                            boxShadow: "none",
                          },
                        }}
                      />
                    </MuiPickersUtilsProvider>
                  </Grid>
                  <Grid item className={classes.gridItem}>
                    <Button
                      type="submit"
                      variant="contained"
                      className={classes.editTaskButton}
                    >
                      Sunting Tugas
                    </Button>
                  </Grid>
                </Grid>
              </form>
            </div>
          </Paper>
        </div>
      );
    }
    else {
      return(
        <div className={classes.root}>
          <Typography variant="h5" className={classes.formTitle}>
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
  viewOneTask : PropTypes.func.isRequired,
  updateTask: PropTypes.func.isRequired,
  getAllSubjects: PropTypes.func.isRequired,
  clearErrors: PropTypes.func.isRequired,
  viewClass: PropTypes.func.isRequired,
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
    mapStateToProps, { viewOneTask, updateTask, viewClass, getAllSubjects, clearErrors }
) (withStyles(styles)(EditTask))
