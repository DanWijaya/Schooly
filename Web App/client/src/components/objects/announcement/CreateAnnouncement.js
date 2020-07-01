import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import classnames from "classnames";
import LightTooltip from "../../misc/light-tooltip/LightTooltip";
import OutlinedTextField from "../../misc/text-field/OutlinedTextField";
import { Button, FormControl, Grid, IconButton, ListItemIcon, ListItemText, Menu, MenuItem, Paper, Select, Typography } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import AttachFileIcon from "@material-ui/icons/AttachFile";
import DescriptionIcon from "@material-ui/icons/Description";
import HighlightOffIcon from "@material-ui/icons/HighlightOff";
import { createAnnouncement } from "../../../actions/AnnouncementActions"

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
});

class CreateAnnouncement extends Component {
  constructor() {
    super();
    this.state = {
      title: "",
      description: "",
      fileLampiran: [],
      errors: {}
    };
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

  onChange = (e, otherfield) => {
    if(otherfield === "deadline"){
      this.setState({ description: e.target.value })
    } else { 
      this.setState({ [e.target.id] : e.target.value })
    }
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

    const announcementData = {
      title: this.state.title,
      description: this.state.description,
      author_name: this.props.auth.user.name,
      author_id: this.props.auth.user.id,
      errors: {}
    };

    if(this.state.fileLampiran)
      for(var i = 0; i < this.state.fileLampiran.length; i++) {
        console.log(this.state.fileLampiran[i])
        formData.append("lampiran_announcement", this.state.fileLampiran[i])
      }
      console.log(formData.getAll("lampiran_announcement"), this.state.fileLampiran)
      this.props.createAnnouncement(formData, announcementData, this.props.history)
  }

  render() {
    document.title = "Schooly | Buat Pengumuman"

    const {classesCollection,  classes, viewClass, subjectsCollection} = this.props;
    const{ class_assigned, fileLampiran, errors} = this.state;
    const { user } = this.props.auth

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

    return(
      <div className={classes.root}>
        <Paper>
          <div className={classes.mainGrid}>
            <Typography variant="h5" align="center" gutterBottom>
              <b>Buat Pengumuman</b>
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
  createAnnouncement: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors,
  subjectsCollection: state.subjectsCollection,
  classesCollection: state.classesCollection,
})

export default connect(
  mapStateToProps, { createAnnouncement }
 ) (withStyles(styles)(CreateAnnouncement))
