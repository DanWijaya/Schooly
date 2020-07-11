import React, { Component } from "react";
import { connect } from "react-redux";
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
import OutlinedTextField from "../../misc/text-field/OutlinedTextField";
import { Button, CircularProgress, Chip,Dialog, FormControl, FormHelperText, Grid, IconButton,
   ListItemIcon, ListItemText, Menu, MenuItem, Paper, Select, Typography } from "@material-ui/core";
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
  chips: {
    display: "flex",
    flexWrap: "wrap",
  },
  chip: {
    margin: 2,
  },
  uploadButton: {
    width: "5px",
    height: "50%"
  },
  createTaskButton: {
    width: "100%",
    marginTop: "20px",
    backgroundColor: "#61BD4F",
    color: "white",
    "&:focus, &:hover": {
      backgroundColor: "#61BD4F",
      color: "white",
    },
  },
  uploadDialogGrid: {
    width: "300px",
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
    backgroundColor: "#61BD4F",
    color: "white",
    "&:focus, &:hover": {
      backgroundColor: "#61BD4F",
      color: "white",
    },
  },
});

function LampiranFile(props) {
  const {name, i, handleLampiranDelete} = props;

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
        onClick={(e) => {handleLampiranDelete(e, i)}}
      />
    </IconButton>
  </StyledMenuItem>
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
    if(this.state.fileLampiran.length > 0 && !Boolean(this.state.anchorEl))
      this.setState({ anchorEl: event.currentTarget})
  }

  handleCloseMenu = () => {
    this.setState({ anchorEl: null})
  }

  handleOpenUploadDialog = () => {
    this.setState({ openUploadDialog: true})
  };

  onChange = (e, otherfield) => {
    console.log(this.state.deadline)
    if(Object.keys(this.props.errors).length !== 0)
      this.props.clearErrors()
    if(otherfield === "kelas") {
      this.setState({ class_assigned: e.target.value})
    }
    else if(otherfield === "deadline") {
      this.setState({ deadline: e}) // e is the date value itself.
    }
    else if(otherfield === "description") {
      this.setState({ description : e.target.value})
    }
    else if(otherfield === "subject") {
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
    if(this.state.fileLampiran)
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

  UNSAFE_componentWillReceiveProps(nextProps){
    if(!nextProps.errors){
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
    if(this.state.fileLampiran.length === 0)
      this.setState({fileLampiran: files})
    else {
      if(files.length !== 0) {
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
    if(temp.length === 0) //If it is empty.
      this.handleCloseMenu()
    this.setState({ fileLampiran: temp})
  }

  render() {
    const { classesCollection, classes, errors, success, viewClass, subjectsCollection}  = this.props;
    const { class_assigned, fileLampiran}  = this.state;
    const { user } = this.props.auth
    console.log(errors)

    const UploadDialog = () => {
      return(
        <Dialog open={this.state.openUploadDialog}>
          <Grid container direction="column" justify="space-betweeen" alignItems="center" className={classes.uploadDialogGrid}>
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
                <Button
                  variant="contained"
                  href="/daftar-tugas"
                  className={classes.uploadFinishButton}
                >
                  Selesai
                </Button>
              }
            </Grid>
          </Grid>
        </Dialog>
      )
  }

    const listFileChosen = () => {
      let temp = []
      if(fileLampiran.length > 0) {
        for (var i = 0; i < fileLampiran.length; i++){
          console.log(i)
          temp.push(
            <LampiranFile
              name={fileLampiran[i].name}
              handleLampiranDelete={this.handleLampiranDelete}
              i={i}
            />
          )
        }
      }
      return temp;
    }

    var options = []
    var subjectOptions = []

    if(Object.keys(classesCollection).length !== 0) {
      options = classesCollection.all_classes
    }

    if(Object.keys(subjectsCollection).length !== 0) {
      subjectOptions = subjectsCollection.all_subjects
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

    if(user.role === "Teacher") {
      return(
        <div className={classes.root}>
          {UploadDialog()}
          <Paper>
            <div className={classes.mainGrid}>
              <Typography variant="h5" align="center" gutterBottom>
                <b>Buat Tugas</b>
              </Typography>
              <Typography color="textSecondary" align="center" style={{marginBottom: "30px"}}>
                Tambahkan keterangan tugas untuk membuat tugas.
              </Typography>
              <form noValidate onSubmit={(e) =>this.onSubmit(e,user.id)}>
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
                        {subjectOptions.map((subject) => (
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
                      <label id="class_assigned" className={classes.inputLabel}>Kelas yang Ditugaskan</label>
                      <Select
                        multiple
                        id="class_assigned"
                        MenuProps={MenuProps}
                        value={class_assigned}
                        onChange={(event) => {this.onChange(event, "kelas")}}
                        renderValue={(selected) => (
                          <div className={classes.chips}>
                            {selected.map((kelas) => {
                              console.log(selected)
                              console.log(kelas, class_assigned)
                              return(
                                <Chip key={kelas} label={kelas.name} className={classes.chip} />
                              )
                            })}
                          </div>
                        )}
                      >
                        {options.map((kelas) => { console.log(kelas, class_assigned)
                          return(
                            <MenuItem key={kelas} selected={true} value={kelas}>{kelas.name}</MenuItem>
                        )})}
                      </Select>
                      <FormHelperText style={{marginLeft: 0, paddingLeft: 0, display:"flex", alignItems:"center"}}>
                        {Boolean(errors.class_assigned) && class_assigned.length === 0 ? <ErrorIcon style={{ height: "5%", width:"5%"}} /> : null}
                        {Boolean(errors.class_assigned) && class_assigned.length === 0 ? <Typography variant="h8" style={{marginLeft: "4px"}}>{errors.class_assigned}</Typography> : null}
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
                  <Grid item container direction="row" className={classes.gridItem}>
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
                    <Grid item container direction="row" alignItems="center">
                      <Grid item xs={11} onClick={this.handleClickMenu}>
                        <OutlinedTextField
                          disabled={true}
                          value={fileLampiran.length > 0 ? `${fileLampiran.length} berkas (Klik untuk melihat)` : "Kosong"}
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
                          <IconButton onClick={() => {this.lampiranUploader.current.click()}}>
                            <AttachFileIcon />
                           </IconButton>
                         </LightTooltip>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item className={classes.gridItem}>
                    <MuiPickersUtilsProvider locale={lokal} utils={DateFnsUtils}>
                      <KeyboardDateTimePicker
                        fullWidth
                        disablePast
                        format="dd/MM/yyyy HH:mm"
                        margin="normal"
                        okLabel="Simpan"
                        cancelLabel="Batal"
                        id="date-picker-inline"
                        value={this.state.deadline}
                        onChange={(date) => this.onDateChange(date)}
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
                      className={classes.createTaskButton}
                    >
                      Buat Tugas
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
