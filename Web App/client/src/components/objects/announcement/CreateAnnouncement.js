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

  return(
  <StyledMenuItem disableRipple>
    <ListItemIcon>
      <DescriptionIcon/>
    </ListItemIcon>
    <ListItemText primary="File name"/>
    <IconButton>
      <HighlightOffIcon
        fontSize="small"
        style={{color:"#B22222"}}
        onClick=""
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
    };
  }

  render() {
    document.title = "Schooly | Buat Pengumuman"

    const { classes } = this.props;

    return (
      <div className={classes.root}>
        <Paper>
          <div className={classes.mainGrid}>
            <Typography variant="h5" align="center" gutterBottom>
              <b>Buat Pengumuman</b>
            </Typography>
            <Typography color="textSecondary" align="center" style={{marginBottom: "30px"}}>
              Tambahkan keterangan pengumuman untuk membuat pengumuman.
            </Typography>
            <form noValidate onSubmit="">
              <Grid
                container
                direction="column"
                alignItems="center"
                spacing={4}
              >
                <Grid item className={classes.gridItem}>
                  <OutlinedTextField
                    on_change=""
                    value=""
                    error=""
                    id="name"
                    type="text"
                    classname={classnames("", {
                        invalid: ""
                    })}
                    html_for="name"
                    labelname="Judul"
                    label_classname={classes.inputLabel}
                    span_classname={classes.errorInfo}
                    error1=""
                  />
                </Grid>
                <Grid item className={classes.gridItem}>
                  <OutlinedTextField
                    multiline={true}
                    on_change=""
                    value=""
                    error=""
                    id="ukuran"
                    type="text"
                    classname={classnames("", {
                        invalid: ""
                    })}
                    html_for="ukuran"
                    labelname="Deskripsi"
                    label_classname={classes.inputLabel}
                    span_classname={classes.errorInfo}
                    error1=""
                  />
                </Grid>
                <Grid item container direction="row" className={classes.gridItem}>
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
                        value=""
                        id="file_tugas"
                        type="text"
                        width="100%"
                        labelname="Lampiran Berkas"
                        html_for="Berkas lampiran"
                        label_classname={classes.inputLabel}
                        pointer= ""
                      />
                    </Grid>
                    <StyledMenu
                      id="fade-menu"
                      anchorEl={this.state.anchorEl}
                      keepMounted
                      open={Boolean(this.state.anchorEl)}
                      onClose={this.handleCloseMenu}
                    >
                      <LampiranFile />
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
};

const mapStateToProps = state => ({
})

export default (withStyles(styles)(CreateAnnouncement))
