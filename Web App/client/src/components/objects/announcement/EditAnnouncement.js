import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import classnames from "classnames";
import LightTooltip from "../../misc/light-tooltip/LightTooltip";
import OutlinedTextField from "../../misc/text-field/OutlinedTextField";
import { Button,Chip, CircularProgress,Dialog, FormControl, FormHelperText, Grid, IconButton, ListItemIcon, ListItemText, Menu, MenuItem, Paper, Select, Typography } from "@material-ui/core";
import { getAllAnnouncements, getAnnouncement, getOneAnnouncement, updateAnnouncement} from "../../../actions/AnnouncementActions"
import { viewClass, setCurrentClass } from "../../../actions/ClassActions";
import { clearErrors } from "../../../actions/ErrorActions"
import { withStyles } from "@material-ui/core/styles";
import AttachFileIcon from "@material-ui/icons/AttachFile";
import DescriptionIcon from "@material-ui/icons/Description";
import HighlightOffIcon from "@material-ui/icons/HighlightOff";
import { GET_ERRORS } from "../../../actions/Types";
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
  inputField: {
    width: "400px",
  },
  inputLabel: {
    color: theme.palette.primary.main,
    fontSize: "15px",
  },
  errorInfo: {
    color: "red",
    fontSize: "10px",
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
      errors: {}
    };
  }

  lampiranUploader = React.createRef(null)
  uploadedLampiran = React.createRef(null)

  componentDidMount(){
    const { user } = this.props.auth;
    const { setCurrentClass, getOneAnnouncement, viewClass, clearErrors } = this.props;

    clearErrors()
    getOneAnnouncement(this.props.match.params.id)
    viewClass()
    if(user.role ==="Student")
      setCurrentClass(user.kelas)

  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    console.log("Tasks props is received");
    const { name } = this.state;
    const { selectedAnnouncements } = nextProps.announcements;
    // console.log(nextProps.tasksCollection.deadline);
    if(!nextProps.errors){
      this.handleOpenUploadDialog()
    }
    if(!name && nextProps.errors){ // if edited, nextProps.errors is false, supaya ndak run ini..
        this.setState({
            title: selectedAnnouncements.title,
            description: selectedAnnouncements.description,
            fileLampiran: Boolean(selectedAnnouncements.lampiran) ? selectedAnnouncements.lampiran : [],
            class_assigned: Boolean(selectedAnnouncements.class_assigned) ? selectedAnnouncements.class_assigned : []
            // yg fileLampiran perlu gitu soalnya awal" mungkin nextProps.tasksCollection nya masih plain object.
            // jadi mau dicek kalau nextProps.tasksCollection itu undefined ato ga soalnya nnti pas call fileLAmpiran.length bakal ada error.
        })
    }
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
    //Kalau yang udah keupload, ada field filename (yang belum adanya name)
    //Untuk yang udah di DB.
    if(this.state.fileLampiran[i].filename !== undefined) {
      //Remove the file in fileLampiranToDelete
      tempToDelete.push(temp[i])
    }
    else { //Untuk yang belum di DB
      //Remove the file in fileLampiranToAdd
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
    if(otherfield === "description") {
      this.setState({ description : e.target.value})
    } else if(otherfield === "kelas") {
      this.setState({ class_assigned: e.target.value})
    }
    else
      this.setState({ [e.target.id]: e.target.value});
  }

  onSubmit = (e) => {
    e.preventDefault();

    const { id } = this.props.match.params;
    const { fileLampiranToAdd, fileLampiranToDelete, fileLampiran } = this.state;
    const { user } = this.props.auth;
    const { kelas } = this.props.classesCollection
    const { selectedAnnouncements } = this.props.announcements;

    const announcementObject = {
      title: this.state.title,
      description: this.state.description,
      class_assigned: user.role == "Student" ? [kelas] : this.state.class_assigned,
      errors: {}
    }

    let formData = new FormData()
    for(var i = 0; i< fileLampiranToAdd.length; i++) {
      console.log(fileLampiran[i])
      formData.append("lampiran_announcement", fileLampiranToAdd[i])
    }

    console.log(fileLampiranToDelete)
    this.props.updateAnnouncement(formData, fileLampiranToDelete,
      selectedAnnouncements.lampiran, announcementObject, id, this.props.history);

  }

  render() {
    document.title = "Schooly | Sunting Pengumuman"

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

    const { classes, updateAnnouncement, getOneAnnouncement } = this.props;
    const { selectedAnnouncements} = this.props.announcements;
    const{ fileLampiran, class_assigned} = this.state
    const { errors, success } = this.props;
    const { user } = this.props.auth;
    const { all_classes, kelas } = this.props.classesCollection;

    const UploadDialog = () => {
      return(
        <Dialog
          open={this.state.openUploadDialog}
          style={{display: "flex", flexDirection: "column"}}
        >
          <Grid container className={classes.uplaodDialogGrid} direction="column" alignItems="center" justify="space-between">
            <Grid item>
              <Typography variant="h6" align="center" gutterBottom>
                {!success ? "Pengumuman sedang disunting" : "Pengumuman berhasil disunting"}
              </Typography>
            </Grid>
            <Grid item>
              {!success ? <CircularProgress /> : <CheckCircleIcon className={classes.successIcon}/>}
            </Grid>
            <Grid item >
              {!success ? 
              <Typography variant="body1" align="center" gutterBottom>
                <b>Mohon tetap tunggu di halaman ini.</b>
              </Typography> : 
                <Button
                href={`/pengumuman/${this.props.match.params.id}`}
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

    const listFileChosen = () => {
      let temp = []
      if(fileLampiran.length > 0) {
        for (var i = 0; i < fileLampiran.length; i++) {
          temp.push(
            <LampiranFile //Yang di displaykan ada di DB (filename) sama yang baru diadd (name)
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

    return(
      <div className={classes.root}>
        {UploadDialog()}
        <Paper>
          <div className={classes.mainGrid}>
            <Typography variant="h5" align="center" gutterBottom>
              <b>Sunting Pengumuman</b>
            </Typography>
            <form noValidate onSubmit={this.onSubmit}>
              <Grid
                container
                direction="column"
                alignItems="center"
                spacing={4}
              >
                <Grid item className={classes.gridItem}>
                  <OutlinedTextField
                    on_change={this.onChange}
                    value={this.state.title}
                    error={errors.title}
                    id="title"
                    type="text"
                    classname={classnames("", {
                        invalid: errors.title
                    })}
                    html_for="title"
                    labelname="Judul"
                    label_classname={classes.inputLabel}
                    span_classname={classes.errorInfo}
                    error1={errors.title}
                  />
                </Grid>
                <Grid item className={classes.gridItem}>
                  <OutlinedTextField
                    multiline={true}
                    on_change={(e) => {this.onChange(e, "description")}}
                    value={this.state.description}
                    error={errors.description}
                    id="description"
                    type="text"
                    classname={classnames("", {
                        invalid: ""
                    })}
                    html_for="description"
                    labelname="Deskripsi"
                    label_classname={classes.inputLabel}
                    span_classname={classes.errorInfo}
                    error1={errors.description}
                  />
                </Grid>
                {user.role === "Student" // berarti dia ketua kelas 
                ? null : 
                <Grid item className={classes.gridItem}>
                    <FormControl variant="outlined" fullWidth error={Boolean(errors.class_assigned)}>
                    <label id="class_assigned" className={classes.inputLabel}>Kelas yang diumumkan</label>
                    <Select
                      id="class_assigned"
                      multiple
                      MenuProps={MenuProps}
                      value={class_assigned}
                      onChange={(event) => {this.onChange(event, "kelas")}}
                      renderValue={(selected) => {
                        return(
                        <div className={classes.chips}>
                          {selected.map((id) => {
                            let name
                            if(all_classes.length == 0)
                              return null;
                            else {
                              for (var i in all_classes){
                                if(all_classes[i]._id === id){
                                  name = all_classes[i].name
                                  break;
                                }
                              }
                              return(
                                <Chip key={id} label={name} className={classes.chip} />
                              )
                            }
                          })}
                        </div>
                      )}}>
                      {all_classes.map((kelas) => { console.log(kelas, class_assigned)
                        return(
                          <MenuItem value={kelas._id}>{kelas.name}</MenuItem>
                      )})}
                    </Select>
                    <FormHelperText style={{marginLeft: 0, paddingLeft: 0, display:"flex", alignItems:"center"}}>
                      {Boolean(errors.class_assigned) ? <ErrorIcon style={{ height: "5%", width:"5%"}} /> : null}
                      {Boolean(errors.class_assigned) ? <Typography variant="h8" style={{marginLeft: "4px"}}>{errors.class_assigned}</Typography> : null}
                    </FormHelperText>
                  </FormControl>
                </Grid>
                }
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
                        <IconButton onClick={() => {this.lampiranUploader.current.click()}}>
                          <AttachFileIcon />
                         </IconButton>
                       </LightTooltip>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item className={classes.gridItem}>
                  <Button
                    type="submit"
                    variant="contained"
                    className={classes.editAnnouncementButton}
                  >
                    Sunting Pengumuman
                  </Button>
                </Grid>
              </Grid>
            </form>
          </div>
        </Paper>
      </div>
    )
  };
};

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
  viewClass: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors,
  success: state.success,
  announcements: state.announcementsCollection,
  classesCollection: state.classesCollection,
})

export default connect(
  mapStateToProps, { getOneAnnouncement, updateAnnouncement,setCurrentClass, viewClass, clearErrors }
  )(withStyles(styles)(EditAnnouncement))
