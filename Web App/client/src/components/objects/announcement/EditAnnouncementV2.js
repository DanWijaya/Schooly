import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import classnames from "classnames";
import { GET_ERRORS } from "../../../actions/Types";
import { getAllAnnouncements, getAnnouncement, getOneAnnouncement, updateAnnouncement} from "../../../actions/AnnouncementActions"
import { viewClass, setCurrentClass } from "../../../actions/ClassActions";
import { clearErrors } from "../../../actions/ErrorActions"
import LightTooltip from "../../misc/light-tooltip/LightTooltip";
import { Avatar, Button, Chip, CircularProgress, Dialog, Divider, FormControl, FormHelperText,
   Grid, IconButton, ListItem, ListItemAvatar, ListItemIcon, ListItemText, MenuItem, Paper, Select, TextField, Typography } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import AttachFileIcon from "@material-ui/icons/AttachFile";
import DescriptionIcon from "@material-ui/icons/Description";
import DeleteIcon from "@material-ui/icons/Delete";
import HighlightOffIcon from "@material-ui/icons/HighlightOff";
import ErrorIcon from "@material-ui/icons/Error";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
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
  const { classes, name, filetype, i, handleLampiranDelete } = props;

  return(
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

class EditAnnouncementV2 extends Component {
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
    if(Boolean(nextProps.errors)){ // if edited, nextProps.errors is false, supaya ndak run ini..
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
      class_assigned: user.role === "Student" ? [kelas] : this.state.class_assigned,
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
        <Dialog open={this.state.openUploadDialog}>
          <Grid container direction="column" justify="space-between" alignItems="center" className={classes.uploadDialogGrid}>
            <Grid item>
              <Typography variant="h6" align="center" gutterBottom>
                {!success ? "Pengumuman sedang disunting" : "Pengumuman berhasil disunting"}
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
                  href={`/pengumuman/${this.props.match.params.id}`}
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
      if(fileLampiran.length > 0) {
        for (var i = 0; i < fileLampiran.length; i++) {
          temp.push(
            <LampiranFile //Yang di displaykan ada di DB (filename) sama yang baru diadd (name)
              classes={classes}
              name={fileLampiran[i].filename === undefined ?
                fileLampiran[i].name :
                fileLampiran[i].filename
              }
              filetype={fileType(fileLampiran[i].name)}
              handleLampiranDelete={this.handleLampiranDelete}
              i={i}
            />
          )
        }
      }
      return temp;
    }

    if(user.role === "Student" && Boolean(kelas.ketua_kelas) && kelas.ketua_kelas !== user.id){
      console.log(kelas.ketua_kelas, user.id)
      return(
        <Redirect to="/tidak-ditemukan"/>
      )
    }

    return(
      <div className={classes.root}>
        {UploadDialog()}
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
                        invalid: errors.title
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
                  {user.role === "Student" ?
                    null
                  :
                    <Grid item>
                      <Typography component="label" for="class_assigned" color="primary">
                        Kelas yang Diumumkan
                      </Typography>
                      <FormControl variant="outlined" fullWidth error={Boolean(errors.class_assigned)}>
                        <Select
                          multiple
                          id="class_assigned"
                          MenuProps={MenuProps}
                          value={class_assigned}
                          onChange={(event) => {this.onChange(event, "kelas")}}
                          renderValue={(selected) => {
                            return(
                              <div className={classes.chips}>
                                {selected.map((id) => {
                                  let name
                                  if(all_classes.length === 0)
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
                          )}}
                        >
                          {all_classes.map((kelas) => { console.log(kelas, class_assigned)
                            return(
                              <MenuItem value={kelas._id}>{kelas.name}</MenuItem>
                          )})}
                        </Select>
                        <FormHelperText>
                          {Boolean(errors.class_assigned) ? errors.class_assigned : null}
                        </FormHelperText>
                      </FormControl>
                    </Grid>
                  }
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
      </div>
    )
  };
};

EditAnnouncementV2.propTypes = {
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
  )(withStyles(styles)(EditAnnouncementV2))
