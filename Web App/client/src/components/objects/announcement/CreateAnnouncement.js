import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import classnames from "classnames";
import { Redirect } from "react-router-dom";
import LightTooltip from "../../misc/light-tooltip/LightTooltip";
import OutlinedTextField from "../../misc/text-field/OutlinedTextField";
import { Button, Chip, CircularProgress, Dialog, FormControl, FormHelperText, Grid, IconButton, ListItemIcon, ListItemText, Menu, MenuItem, Paper, Select, Typography } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import AttachFileIcon from "@material-ui/icons/AttachFile";
import DescriptionIcon from "@material-ui/icons/Description";
import HighlightOffIcon from "@material-ui/icons/HighlightOff";
import { createAnnouncement } from "../../../actions/AnnouncementActions"
import { viewClass, setCurrentClass } from "../../../actions/ClassActions";
import { clearErrors } from "../../../actions/ErrorActions"
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
        onClick={(e) => {handleLampiranDelete(e, i)}}
      />
    </IconButton>
  </StyledMenuItem>
  )
}

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
  createAnnouncementButton: {
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
  uploadedLampiran = React.createRef(null)

  UNSAFE_componentWillReceiveProps(nextProps){
    console.log(nextProps.errors)
    if(!nextProps.errors){ // kalau success bakal return false nextProps.errorsnya.
      this.handleOpenUploadDialog()
      // this.setState({
      //   // errors: nextProps.errors,
      //   openUploadDialog: false
      // });
    }
  }

  componentDidMount() {
    const { user } = this.props.auth;
    const { viewClass, setCurrentClass, clearErrors} = this.props;

    clearErrors()
    viewClass()
    if(user.role === "Student")
      setCurrentClass(user.kelas)
  }

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

  handleCloseUploadDialog = () => {
    this.setState({ openUploadDialog: false });
  };


  onChange = (e, otherfield) => {
    if(otherfield === "deadline"){
      this.setState({ description: e.target.value })
    } else if(otherfield === "kelas") {
      console.log(e.target.value)
      this.setState({ class_assigned: e.target.value})
    } else {
      this.setState({ [e.target.id] : e.target.value })
    }
    console.log(this.props.errors)
  }

  handleLampiranUpload = (e) => {
    const files = e.target.files;
    if(this.state.fileLampiran.length === 0)
      this.setState({fileLampiran: files})
    else {
      if(files.length != 0) {
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

  onSubmit = (e, id) => {
    e.preventDefault()
    let formData = new FormData()
    const { user } = this.props.auth;
    const { kelas } = this.props.classesCollection;

    const announcementData = {
      title: this.state.title,
      description: this.state.description,
      author_name: user.name,
      class_assigned: user.role === "Student" ? [kelas] : this.state.class_assigned,
      author_id: user.id,
      errors: {}
    };

    if(this.state.fileLampiran)
      for(var i = 0; i < this.state.fileLampiran.length; i++) {
        console.log(this.state.fileLampiran[i])
        formData.append("lampiran_announcement", this.state.fileLampiran[i])
      }
      console.log(formData.getAll("lampiran_announcement"), this.state.fileLampiran)
      // this.handleOpenUploadDialog()
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

    const {classesCollection,  classes, setCurrentClass, viewClass, subjectsCollection, success} = this.props;
    const { all_classes, kelas } = this.props.classesCollection
    const{ class_assigned, fileLampiran} = this.state;
    const { errors } = this.props;
    const { user } = this.props.auth

    const UploadDialog = () => {
      
        return(
          <Dialog open={this.state.openUploadDialog}>
            <Grid container direction="column" justify="space-between" alignItems="center" className={classes.uploadDialogGrid}>
              <Grid item>
                <Typography variant="h6" align="center" gutterBottom>
                  {!success ? "Pengumuman sedang dibuat" : "Pengumuman berhasil dibuat"}
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
                    href="/daftar-pengumuman"
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

    console.log(Object.keys(errors).length)
    // Ini kedepannya juga perlu diubah kalau misalnya kerua_kelasnya cuma taruh id aja. 
    if(user.role === "Student" && Boolean(kelas.ketua_kelas) && kelas.ketua_kelas !== user.id){
      console.log(kelas.ketua_kelas, user.id)
      return(<Redirect to="/tidak-ditemukan"/>)
    }

    return(
      <div className={classes.root}>
        {UploadDialog()}
        <Paper>
          <div className={classes.mainGrid}>
            <Typography variant="h5" align="center" gutterBottom>
              <b>Buat Pengumuman {user.role === "Student" ? `untuk kelas ${kelas.name}` : null}</b>
            </Typography>
            <Typography color="textSecondary" align="center" style={{marginBottom: "30px"}}>
              Tambahkan keterangan pengumuman untuk membuat pengumuman.
            </Typography>
            <form noValidate onSubmit={(e) => this.onSubmit(e, user.id)}>
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
                    on_change={(e) => this.onChange(e, "description")}
                    value={this.state.description}
                    error={errors.description}
                    id="description"
                    type="textarea"
                    classname={classnames("", {
                        invalid: errors.description
                    })}
                    html_for="descripton"
                    labelname="Deskripsi"
                    label_classname={classes.inputLabel}
                    span_classname={classes.errorInfo}
                    error1={errors.description}
                  />
                </Grid>
                {user.role === "Student" // berarti dia ketua kelas
                ? null :
                <Grid item className={classes.gridItem}>
                    <FormControl variant="outlined" fullWidth error={Boolean(errors.class_assigned) && class_assigned.length === 0}>
                    <label id="class_assigned" className={classes.inputLabel}>Kelas yang diumumkan</label>
                    <Select
                      id="class_assigned"
                      multiple
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
                      {all_classes.map((kelas) => { console.log(kelas, class_assigned)
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
                  <Button
                    type="submit"
                    variant="contained"
                    className={classes.createAnnouncementButton}
                  >
                    Buat Pengumuman
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

CreateAnnouncement.propTypes = {
  errors: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  success: PropTypes.object.isRequired,
  createAnnouncement: PropTypes.func.isRequired,
  setCurrentClass: PropTypes.func.isRequired,
  clearErrors: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors,
  success: state.success,
  subjectsCollection: state.subjectsCollection,
  classesCollection: state.classesCollection,
})

export default connect(
  mapStateToProps, { createAnnouncement, viewClass , setCurrentClass, clearErrors}
 ) (withStyles(styles)(CreateAnnouncement))
