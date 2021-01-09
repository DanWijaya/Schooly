import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import classnames from "classnames";
import { createAnnouncement } from "../../../actions/AnnouncementActions";
import { getAllClass, setCurrentClass } from "../../../actions/ClassActions";
import { clearErrors } from "../../../actions/ErrorActions";
import { clearSuccess } from "../../../actions/SuccessActions";
import UploadDialog from "../../misc/dialog/UploadDialog";
import LightTooltip from "../../misc/light-tooltip/LightTooltip";
import { Avatar, Button, Chip, Divider, FormControl, FormHelperText, Grid, IconButton,
   ListItem, ListItemAvatar, ListItemText, MenuItem, Paper, Select, TextField, Typography } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import AttachFileIcon from "@material-ui/icons/AttachFile";
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
  createAnnouncementButton: {
    width: "100%",
    marginTop: "20px",
    backgroundColor: theme.palette.success.main,
    color: "white",
    "&:focus, &:hover": {
      backgroundColor: theme.palette.success.main,
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

class CreateAnnouncement extends Component {
  constructor() {
    super();
    this.state = {
      title: "",
      description: "",
      fileLampiran: [],
      class_assigned: [],
      errors: {},
      openUploadDialog: null
    };
  }

  lampiranUploader = React.createRef(null)

  componentDidUpdate(prevProps, prevState){
    if(!this.props.errors && this.props.errors !== prevProps.errors){
      this.handleOpenUploadDialog()
    }
  }

  componentDidMount() {
    const { user } = this.props.auth;
    const { getAllClass, setCurrentClass} = this.props;
    getAllClass()
    if (user.role === "Student")
      setCurrentClass(user.kelas)
  }

  componentWillUnmount(){
    this.props.clearErrors()
  }

  handleClickMenu = (event) => {
    // Needed so it will not be run when filetugas = null or filetugas array is empty
    if (this.state.fileLampiran.length > 0 && !Boolean(this.state.anchorEl))
      this.setState({ anchorEl: event.currentTarget})
  }

  handleCloseMenu = () => {
    this.setState({ anchorEl: null})
  }

  handleOpenUploadDialog = () => {
    this.setState({ openUploadDialog: true})
  };

  handleCloseUploadDialog = () => {
    this.setState({ openUploadDialog: false });
  };


  onChange = (e, otherfield=null) => {
    if (otherfield) {
      this.setState({ [otherfield]: e.target.value})
    }
    else {
      this.setState({ [e.target.id] : e.target.value })
    }
    console.log(this.props.errors)
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

  handleLampiranUpload = (e) => {
    const files = e.target.files;
    let temp = [...Array.from(this.state.fileLampiran), ...Array.from(files)]
    this.setState({ fileLampiran: temp})
    document.getElementById("file_control").value = null
  }

  onSubmit = (e, id) => {
    e.preventDefault()
    let formData = new FormData()
    const { user } = this.props.auth;
    const { kelas } = this.props.classesCollection;

    const announcementData = {
      title: this.state.title,
      description: this.state.description,
      class_assigned: user.role === "Student" ? [kelas] : this.state.class_assigned,
      author_id: user.id,
      errors: {}
    };

    if (this.state.fileLampiran)
      for (var i = 0; i < this.state.fileLampiran.length; i++) {
        console.log(this.state.fileLampiran[i])
        formData.append("lampiran_announcement", this.state.fileLampiran[i])
      }
      console.log(formData.getAll("lampiran_announcement"), this.state.fileLampiran)
      this.props.createAnnouncement(formData, announcementData, this.props.history)
  }

  render() {
    document.title = "Schooly | Buat Pengumuman"

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

    const { classes, success} = this.props;
    const { all_classes, kelas } = this.props.classesCollection
    const { class_assigned, fileLampiran} = this.state;
    const { errors } = this.props;
    const { user } = this.props.auth

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

    console.log(Object.keys(errors).length)
    // Ini kedepannya juga perlu diubah kalau misalnya kerua_kelasnya cuma taruh id aja.
    if (user.role === "Student" && Boolean(kelas.ketua_kelas) && kelas.ketua_kelas !== user.id) {
      console.log(kelas.ketua_kelas, user.id)
      return (<Redirect to="/tidak-ditemukan"/>)
    }

    return (
      <div className={classes.root}>
        <UploadDialog
          openUploadDialog={this.state.openUploadDialog}
          success={success}
          messageUploading="Pengumuman sedang dibuat"
          messageSuccess="Pengumuman telah dibuat"
          redirectLink="/daftar-pengumuman"
        />
        <Paper>
          <div className={classes.content}>
            <Typography variant="h5" gutterBottom>
              <b>Buat Pengumuman</b>
            </Typography>
            <Typography color="textSecondary">
              Tambahkan keterangan pengumuman untuk membuat pengumuman.
            </Typography>
          </div>
          <Divider />
          <form noValidate onSubmit={(e) => this.onSubmit(e, user.id)}>
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
                      <FormControl variant="outlined" fullWidth error={Boolean(errors.class_assigned) && class_assigned.length === 0}>
                        <Select
                          multiple
                          id="class_assigned"
                          MenuProps={MenuProps}
                          value={class_assigned}
                          onChange={(event) => {this.onChange(event, "class_assigned")}}
                          renderValue={(selected) => (
                            <div className={classes.chips}>
                              {selected.map((kelas) => {
                                console.log(selected)
                                console.log(kelas, class_assigned)
                                return (
                                  <Chip key={kelas} label={kelas.name} className={classes.chip} />
                                )
                              })}
                            </div>
                          )}
                        >
                          {all_classes.map((kelas) => { console.log(kelas, class_assigned)
                            return (
                              <MenuItem key={kelas} selected={true} value={kelas}>{kelas.name}</MenuItem>
                          )})}
                        </Select>
                        <FormHelperText>
                          {Boolean(errors.class_assigned) && class_assigned.length === 0 ? errors.class_assigned : null}
                        </FormHelperText>
                      </FormControl>
                    </Grid>
                  }
                  <Grid item>
                    <input
                      type="file"
                      multiple={true}
                      name="lampiran"
                      id="file_control"
                      onChange={this.handleLampiranUpload}
                      ref={this.lampiranUploader}
                      accept="file/*"
                      style={{display: "none"}}
                    />
                    <Button
                      variant="contained"
                      startIcon={<AttachFileIcon />}
                      onClick={() => this.lampiranUploader.current.click()}
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
                  className={classes.createAnnouncementButton}
                >
                  Buat Pengumuman
                </Button>
              </div>
            </div>
          </form>
        </Paper>
      </div>
    )
  };
};

CreateAnnouncement.propTypes = {
  errors: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  success: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors,
  success: state.success,
  subjectsCollection: state.subjectsCollection,
  classesCollection: state.classesCollection,
})

export default connect(
  mapStateToProps, { createAnnouncement, getAllClass , setCurrentClass, clearErrors,clearSuccess }
 ) (withStyles(styles)(CreateAnnouncement))
