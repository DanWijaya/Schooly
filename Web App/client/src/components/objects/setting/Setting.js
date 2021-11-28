import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { getSetting, createSetting, editSetting } from "../../../actions/SettingActions";
import FileSetting from "./FileSetting";
import DeleteDialog from "../../misc/dialog/DeleteDialog";
import {
  AppBar,
  Button,
  Drawer,
  Fade,
  Grid,
  Hidden,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Snackbar,
  Typography,
  useMediaQuery
} from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";
import { ArrowBack as ArrowBackIcon } from "@material-ui/icons";
import { withStyles } from "@material-ui/core/styles";

const styles = (theme) => ({
  root: {
    display: "flex",
    margin: "auto",
    padding: "20px",
    paddingTop: "25px",
    maxWidth: "80%",
    [theme.breakpoints.down("md")]: {
      maxWidth: "100%",
    },
  },
  menuBar: {
    zIndex: theme.zIndex.drawer + 1,
    padding: "7.5px",
    paddingRight: "20px",
    boxShadow: "0 1px 6px 0px rgba(32,33,36,0.28)",
    backgroundColor: "white",
    color: "black",
  },
  saveButton: {
    paddingLeft: "17.5px",
    paddingRight: "17.5px",
    backgroundColor: theme.palette.success.main,
    color: "white",
    "&:focus, &:hover": {
      backgroundColor: theme.palette.success.main,
      color: "white",
    },
  },
  drawer: {
    width: "225px",
    flexShrink: 0,
  },
  drawerPaper: {
    width: "225px",
    backgroundColor: "#F1F1F1",
    border: "none",
  },
  drawerItem: {
    "&:focus, &:hover": {
      backgroundColor: "#D8D8D8",
    },
  },
  toolbar: theme.mixins.toolbar,
  content: {
    display: "flex",
    flexDirection: "column",
    flexGrow: "1",
  },
});

const withMediaQuery = (...args) => Component => props => {
  const mediaQuery = useMediaQuery(...args);
  return <Component isMobileView={mediaQuery} {...props} />;
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
      <Fade in={true} timeout={200}>
        <div className={classes.root}>
          <AppBar position="fixed" className={classes.menuBar}>
            <Grid container justify="space-between" alignItems="center">
              <Grid item xs container alignItems="center" spacing={2}>
                <Grid item>
                  <IconButton onClick={this.goBack}>
                    <ArrowBackIcon/>
                  </IconButton>
                </Grid>
                <Grid item>
                  <Typography variant="h5" color="textSecondary">
                    Pengaturan
                  </Typography>
                </Grid>
              </Grid>
              <Grid item>
                <Button className={classes.saveButton} onClick={this.commitSave}>
                  Simpan
                </Button>
              </Grid>
            </Grid>
          </AppBar>
          <Hidden mdDown>
            <Drawer
              variant="permanent"
              className={classes.drawer}
              classes={{ paper: classes.drawerPaper }}
            >
              <div className={classes.toolbar} />
              <List>
                <ListItem button key="File" className={classes.drawerItem} onClick={() => this.setSettingView("file")}>
                  <ListItemText primary="Berkas" />
                </ListItem>
              </List>
            </Drawer>
          </Hidden>
          <div className={classes.content}>
            <div className={classes.toolbar}/>
              {!this.props.isMobileView ?
                (
                  (this.state.settingView === "file") ?
                    <FileSetting
                      classes={classes}
                      fileUploadLimit={this.state.fileUploadLimit}
                      setIsChanged={this.setIsChanged}
                      setfileUploadLimit={this.setfileUploadLimit}
                    />
                  : null
                )
              :
                (
                  <div>
                    <FileSetting
                      classes={classes}
                      fileUploadLimit={this.state.fileUploadLimit}
                      setIsChanged={this.setIsChanged}
                      setfileUploadLimit={this.setfileUploadLimit}
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
            <Alert
              elevation={6}
              variant="filled"
              severity="success"
              onClose={() => this.setIsSnackBarOpen(false)}
            >
              Pengaturan disimpan
            </Alert>
          </Snackbar>
          <DeleteDialog
            openDeleteDialog={this.state.isBackDialogOpen}
            handleCloseDeleteDialog={() => this.setIsBackDialogOpen(false)}
            itemType="perubahan Pengaturan"
            deleteItem={this.props.history.goBack}
          />
        </div>
      </Fade>
    );
  }
}

const mapStateToProps = (state) => ({
  auth: state.auth,
  settingsCollection: state.settingsCollection,
  success: state.success,
  errors: state.errors,
});


export default withRouter(connect(mapStateToProps, {
  getSetting,
  createSetting,
  editSetting,
})(withStyles(styles)(withMediaQuery("(max-width:960px)")(Setting))));
