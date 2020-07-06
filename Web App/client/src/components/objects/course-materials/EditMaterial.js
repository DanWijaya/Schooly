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
import { Button, Chip, FormControl, Grid, IconButton, Menu, MenuItem, ListItemIcon, ListItemText, Paper, Select, Typography } from "@material-ui/core";
import { MuiPickersUtilsProvider, KeyboardDatePicker } from "@material-ui/pickers";
import { withStyles } from "@material-ui/core/styles";
import AttachFileIcon from "@material-ui/icons/AttachFile";
import DescriptionIcon from "@material-ui/icons/Description";
import HighlightOffIcon from "@material-ui/icons/HighlightOff";

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

class EditMaterial extends Component {
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
      errors: {},
    }
  }

  tugasUploader = React.createRef(null)
  uploadedTugas = React.createRef(null)

  componentDidMount() {
    const { viewOneTask, viewClass, getAllSubjects, clearErrors } = this.props;

    clearErrors()
    viewOneTask(this.props.match.params.id)
    viewClass()
    getAllSubjects()
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    console.log("Tasks props is received");
    const { name } = this.state;
    // console.log(nextProps.tasksCollection.deadline);
    console.log(nextProps.tasksCollection);
    console.log(nextProps.subjectsCollection);
    console.log(nextProps.classesCollection);
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
    formData.append("lampiran", this.state.fileLampiranToAdd[i])
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

  handleCloseMenu = () => { this.setState({ anchorEl: null}) }

  onChange = (e, otherfield) => {
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
    const { errors , fileLampiran } = this.state;
    const { classes, subjectsCollection, tasksCollection } = this.props;
    const { all_classes, selectedClasses } = this.props.classesCollection;
    const { user } = this.props.auth;

    console.log("FileLampiran:", this.state.fileLampiran)
    console.log("FileLampiran to add:", this.state.fileLampiranToAdd);
    console.log("FileLampiran to delete:", this.state.fileLampiranToDelete);

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

    var classesOptions = []
    var selectedClassOptions = []
    var subjectOptions = []
    if(all_classes.length !== 0) {
      classesOptions = all_classes
      selectedClassOptions = selectedClasses
    }

    if(Object.keys(subjectsCollection.all_subjects).length !== 0) {
      subjectOptions = subjectsCollection.all_subjects
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
          <Paper>
            <div className={classes.mainGrid}>
              <Typography variant="h5" className={classes.formTitle}>
                <b>Sunting Tugas</b>
              </Typography>
              <form noValidate onSubmit={(e) => {this.onSubmit(e, classesOptions)}}>
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
                    <FormControl id="subject" variant="outlined" color="primary" fullWidth>
                      <label id="subject" className={classes.inputLabel}>Mata Pelajaran</label>
                      <Select
                        value={this.state.subject}
                        onChange={(event) => {this.onChange(event, "subject")}}
                      >
                        {subjectOptions.map((subject) => (
                          <MenuItem value={subject.name}>{subject.name}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item className={classes.gridItem}>
                    <FormControl variant="outlined" fullWidth>
                      <label id="class_assigned" className={classes.inputLabel}>Kelas yang dipilih</label>
                      <Select
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
                                for (var i in classesOptions){ // i is the index
                                  if(classesOptions[i]._id === id){
                                    name = classesOptions[i].name
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
                        {classesOptions.map((kelas) => (
                            <MenuItem value={kelas._id} selected>{kelas.name}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item className={classes.gridItem}>
                    <OutlinedTextField
                      on_change={(e) => this.onChange(e, "description")}
                      value={this.state.description}
                      id="descripton"
                      type="textarea"
                      className={classnames("", {
                        invalid: errors.name
                      })}
                      labelname="Deskripsi"
                      html_for="description"
                      label_classname={classes.inputLabel}
                      span_classname={classes.errorInfo}
                      multiline={true}
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
                      <KeyboardDatePicker
                        fullWidth
                        disablePast
                        format="dd/MM/yyyy"
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

EditMaterial.propTypes = {
  errors: PropTypes.object.isRequired,
  viewOneTask : PropTypes.func.isRequired,
  updateTask: PropTypes.func.isRequired,
  getAllSubjects: PropTypes.func.isRequired,
  clearErrors: PropTypes.func.isRequired,
  tasksCollection: PropTypes.object.isRequired,
  classesCollection: PropTypes.object.isRequired,
  subjectsCollection: PropTypes.object.isRequired,
  viewClass: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  errors: state.errors,
  auth: state.auth,
  tasksCollection: state.tasksCollection,
  classesCollection: state.classesCollection,
  subjectsCollection: state.subjectsCollection,
})

export default connect(
    mapStateToProps, { viewOneTask, updateTask, viewClass, getAllSubjects, clearErrors }
) (withStyles(styles)(EditMaterial))
