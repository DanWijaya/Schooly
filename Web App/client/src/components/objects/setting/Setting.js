import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { getSetting, createSetting, editSetting } from "../../../actions/SettingActions";
import DeleteDialog from "../../misc/dialog/DeleteDialog";
import AppBar from "@material-ui/core/AppBar";
import Button from "@material-ui/core/Button";
import Divider from "@material-ui/core/Divider";
import Drawer from "@material-ui/core/Drawer";
import Grid from "@material-ui/core/Grid";
import Hidden from "@material-ui/core/Hidden";
import IconButton from "@material-ui/core/IconButton";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import InputAdornment from "@material-ui/core/InputAdornment";
import Paper from "@material-ui/core/Paper";
import Snackbar from "@material-ui/core/Snackbar";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import { useMediaQuery } from "@material-ui/core";
import MuiAlert from "@material-ui/lab/Alert";
import { withStyles } from "@material-ui/core/styles";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";

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
  arrowBack: {
    fill: "gray",
    margin: "auto",
    "&:focus, &:hover": {
      backgroundColor: theme.palette.primary.fade,
    },
  },
  buttonSave: {
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
  toolbar: theme.mixins.toolbar,
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

// Media Query
const withMediaQuery = (...args) => Component => props => {
  const mediaQuery = useMediaQuery(...args);
  return <Component isMobileView={mediaQuery} {...props} />;
}

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

class Setting extends Component {
  constructor(){
    super();
    this.state = {
      isChanged: false,
      isSnackBarOpen: false,
      isBackDialogOpen: false,
      settingView: "file", // When in mobile set to "mobile" thus will view all page at once
      fileUploadLimit: 0,
    };
  }

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

  componentDidMount() {
    const { getSetting, handleNavbar, handleSideDrawerExist, handleFooter } = this.props;
    getSetting().then(() => {
      this.setfileUploadLimit(this.props.settingsCollection.upload_limit);
    });
    handleNavbar(false);
    handleSideDrawerExist(false);
    handleFooter(false);
  }
  componentWillUnmount(){
    const { handleNavbar, handleSideDrawerExist, handleFooter } = this.props;
    handleNavbar(true);
    handleSideDrawerExist(true);
    handleFooter(true);
  }

  // To save every changes
  commitSave = () => {
    const { editSetting } = this.props;
    editSetting(`upload_limit=${this.state.fileUploadLimit}`).then(
      this.setIsSnackBarOpen(true)
    );
    this.setIsChanged(false);
  }

  // Back button
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
                <IconButton onClick={this.goBack} className={classes.arrowBack}>
                  <ArrowBackIcon/>
                </IconButton>
              </Grid>
              <Grid item>
                <Typography variant="h5" color="textSecondary">Pengaturan</Typography>
              </Grid>
            </Grid>
            <Grid item>
              <Button variant="contained" className={classes.buttonSave} onClick={this.commitSave}>
                Simpan
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
            {!this.props.isMobileView ?
              (
                (this.state.settingView == "file") ?
                <FileSetting
                  classes = {classes}
                  fileUploadLimit = {this.state.fileUploadLimit}
                  setIsChanged = {this.setIsChanged}
                  setfileUploadLimit = {this.setfileUploadLimit}
                />
                : null
              )
            :
              (
                <div>
                  <FileSetting
                    classes = {classes}
                    fileUploadLimit = {this.state.fileUploadLimit}
                    setIsChanged = {this.setIsChanged}
                    setfileUploadLimit = {this.setfileUploadLimit}
                  />
                </div>
              )
            }
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
            Pengaturan disimpan!
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
})(withStyles(styles)(withMediaQuery("(max-width:960px)")(Setting))));
