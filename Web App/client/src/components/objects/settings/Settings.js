import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import {
  getSetting,
  createSetting,
  editSetting,
} from "../../../actions/SettingActions";
import DeleteDialog from "../../misc/dialog/DeleteDialog";
import {
  AppBar,
  Grid,
  Paper,
  Typography,
  Button,
  IconButton,
  Drawer,
  ListItem,
  ListItemText,
  Divider,
  TextField,
  InputAdornment,
  Snackbar,
  Hidden,
} from "@material-ui/core/";
import MuiAlert from "@material-ui/lab/Alert";
import { withStyles } from "@material-ui/core/styles";
import ArrowBackIcon from '@material-ui/icons/ArrowBack';

const styles = (theme) => ({
  root: {
    display: "flex",
    margin: "auto",
    padding: "10px",
    paddingTop: "20px",
    maxWidth: "80%",
    [theme.breakpoints.down("md")]: {
      maxWidth: "100%",
    },
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    padding: "10px",
    backgroundColor: "white",
    color: "black",
  },
  toolbar: theme.mixins.toolbar,
  arrowBack: {
    fill: "gray",
    margin: "auto",
    "&:focus, &:hover": {
      backgroundColor: theme.palette.primary.fade,
    },
  },
  buttonSave: {
    textTransform: "none",
    backgroundColor: theme.palette.success.main,
    color: "white",
    "&:focus, &:hover": {
      backgroundColor: theme.palette.success.main,
      color: "white",
    },
  },
  drawer: {
    width: "150px",
    flexShrink: 0,
  },
  drawerPaper: {
    width: "150px",
  },
  drawerItem: {
    width: "150px",
    wordWrap: "break-word",
    "&:active, &:hover": {
      backgroundColor: theme.palette.primary.fade,
    },
  },
  settingContainer: {
    display: "flex",
    flexDirection: "column",
    flexGrow: "1",
  },
  paper: {
    marginBottom: "20px",
    padding: "20px",
  },
  textField: {
    maxWidth: "150px",
    width: "100%",
  },
});

class FileSetting extends Component {
  render() {
    const {classes, fileUploadLimit, setIsChanged, setfileUploadLimit} = this.props;
    return (
      <Paper variant="outlined" className={classes.paper}>
        <Typography variant="h4" color="primary" paragraph>File</Typography>
        <Grid container justify="space-between" alignItems="center">
          <Grid item>
            <Typography>Batas Ukuran 1 File</Typography>
          </Grid>
          <Grid itemv className={classes.textField}>
            <TextField
              type = "number"
              variant = "outlined"
              value = {fileUploadLimit}
              onChange= {(e) => {
                setIsChanged(true)
                setfileUploadLimit(e.target.value);
              }}
              InputProps={{
                endAdornment: <InputAdornment position="end">MB</InputAdornment>,
              }}
            />
          </Grid>
        </Grid>
      </Paper>
    );
  }
}

// *** MAIN PAGE ***
class Setting extends Component {
  constructor(){
    super();
    this.state = {
      isChanged: false,
      isSnackBarOpen: false,
      isBackDialogOpen: false,
      settingView: "file", // when in mobile set to "mobile" thus will view all page at once
      windowWidth: 0,
      fileUploadLimit: 0,
    };
  }

  // *** STATE SETTER ***
  setIsChanged = (newState) => {
    this.setState({ isChanged: newState });
  }
  setIsSnackBarOpen = (newState) => {
    this.setState({ isSnackBarOpen: newState });
  }
  setIsBackDialogOpen = (newState) => {
    this.setState({ isBackDialogOpen: newState });
  }
  setSettingView = (newState) => {
    this.setState({ settingView: newState });
  }
  setWindowWidth = (newState) => {
    this.setState({ WindowWidth: newState });
  }
  setfileUploadLimit = (newState) => {
    this.setState({ fileUploadLimit: newState });
  }

  handleMobileView = () => {
    this.setWindowWidth(window.innerWidth);
    if (window.innerWidth <= 960) this.setSettingView("mobile");
    else this.setSettingView("file");
  }

  componentDidMount() {
    const { getSetting, handleNavbar, handleSideDrawerExist, handleFooter } = this.props;
    getSetting().then(() => {
      this.setfileUploadLimit(this.props.settingsCollection.upload_limit);
    });
    handleNavbar(false);
    handleSideDrawerExist(false);
    handleFooter(false);

    // add listener to update width when window resized
    window.addEventListener('resize', this.handleMobileView);
  }
  componentWillUnmount(){
    const { handleNavbar, handleSideDrawerExist, handleFooter } = this.props;
    handleNavbar(true);
    handleSideDrawerExist(true);
    handleFooter(true);

    // remove window resize listener when out of this page
    window.removeEventListener('resize', () => {this.setWindowWidth(window.innerWidth)});
  }

  // to save every changes
  commitSave = () => {
    const { editSetting } = this.props;
    editSetting(`upload_limit=${this.state.fileUploadLimit}`).then(
      this.setIsSnackBarOpen(true)
    );
    this.setIsChanged(false);
  }

  // back button
  goBack = () => {
    if (this.state.isChanged) this.setIsBackDialogOpen(true);
    else this.props.history.goBack();
  }

  render(){
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        <AppBar position="fixed" className={classes.appBar}>
          <Grid container justify="space-between" alignItems="center">
            <Grid item xs container alignItems="center" spacing={2}>
              <Grid item>
                <IconButton onClick={() => this.goBack()} className={classes.arrowBack}>
                  <ArrowBackIcon/>
                </IconButton>
              </Grid>
              <Grid item>
                <Typography variant="h5" color="textSecondary">Pengaturan</Typography>
              </Grid>
            </Grid>
            <Grid item>
              <Button variant="contained" className={classes.buttonSave} onClick={() => this.commitSave()}>
                <Typography variant="subtitle1">Simpan</Typography>
              </Button>
            </Grid>
          </Grid>
        </AppBar>
        <Hidden smDown>
          <Drawer
            variant="permanent"
            className={classes.drawer}
            classes={{
              paper: classes.drawerPaper,
            }}
          >
            <div className={classes.toolbar}/>
            <ListItem button key="File" className={classes.drawerItem} onClick={() => this.setSettingView("file")}>
              <ListItemText primary="File" />
            </ListItem>
            <Divider/>
          </Drawer>
        </Hidden>
        <div className={classes.settingContainer}>
          <div className={classes.toolbar}/>
          {/* FILE SETTING */}
          {(this.state.settingView == "file") ?
            <FileSetting
              classes = {classes}
              fileUploadLimit = {this.state.fileUploadLimit}
              setIsChanged = {this.setIsChanged}
              setfileUploadLimit = {this.setfileUploadLimit}
            />
          : null}
          {/* MOBILE VIEW */}
          {(this.state.settingView == "mobile") ?
            <div>
              <FileSetting
                classes = {classes}
                fileUploadLimit = {this.state.fileUploadLimit}
                setIsChanged = {this.setIsChanged}
                setfileUploadLimit = {this.setfileUploadLimit}
              />

              <Paper variant="outlined" className={classes.paper}>
                <Typography variant="h4" color="primary">And More</Typography>
                <br></br>
              </Paper>
            </div>
          : null}
        </div>
        <Snackbar
          open={this.state.isSnackBarOpen}
          autoHideDuration={6000}
          onClose={() => this.setIsSnackBarOpen(false)}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        >
          <MuiAlert
            elevation={6}
            variant="filled"
            severity="success"
            onClose={() => this.setIsSnackBarOpen(false)}
          >
            Perubahan Setting berhasil!
          </MuiAlert>
        </Snackbar>
        <DeleteDialog
          openDeleteDialog = {this.state.isBackDialogOpen}
          handleCloseDeleteDialog = {() => this.setIsBackDialogOpen(false)}
          deleteItem = {this.props.history.goBack}
          itemType = {""}
          customMessage = {"Hapus perubahan?"}
        />
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  errors: state.errors,
  success: state.success,
  auth: state.auth,
  settingsCollection: state.settingsCollection,
});


export default withRouter(connect(mapStateToProps, {
  getSetting,
  createSetting,
  editSetting,
})(withStyles(styles)(Setting)));
