import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { createUnit } from "../../../actions/UnitActions";
import UploadDialog from "../../misc/dialog/UploadDialog";
import DeleteDialog from "../../misc/dialog/DeleteDialog";
import FloatingHelp from "../../misc/floating-help/FloatingHelp";
import {
  AppBar,
  Button,
  Divider,
  Grid,
  Paper,
  TextField,
  Typography,
} from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import { ShortText as ShortTextIcon, Web as WebIcon } from "@material-ui/icons";

const styles = (theme) => ({
  root: {
    margin: "auto",
    padding: "20px",
    paddingTop: "25px",
    maxWidth: "85%",
    [theme.breakpoints.down("md")]: {
      maxWidth: "100%",
    },
  },
  background: {
    backgroundColor: "#F9F9F9",
    minHeight: "100%",
  },
  menuBar: {
    zIndex: theme.zIndex.drawer + 1,
    padding: "15px 20px",
    boxShadow: "0 1px 6px 0px rgba(32,33,36,0.28)",
    backgroundColor: "white",
    color: "black",
  },
  createButton: {
    width: "90px",
    backgroundColor: theme.palette.success.main,
    color: "white",
    "&:focus, &:hover": {
      backgroundColor: theme.palette.success.main,
      color: "white",
      boxShadow:
        "0px 1px 2px 0px rgba(194,100,1,0.3), 0px 2px 6px 2px rgba(194,100,1,0.15)",
    },
    [theme.breakpoints.down("sm")]: {
      width: "75px",
    },
  },
  deleteButton: {
    width: "90px",
    backgroundColor: theme.palette.error.main,
    color: "white",
    "&:focus, &:hover": {
      backgroundColor: theme.palette.error.main,
      color: "white",
      boxShadow:
        "0px 1px 2px 0px rgba(194,100,1,0.3), 0px 2px 6px 2px rgba(194,100,1,0.15)",
    },
    [theme.breakpoints.down("sm")]: {
      width: "75px",
    },
  },
  toolbar: theme.mixins.toolbar,
  content: {
    display: "flex",
    flexDirection: "column",
    flexGrow: "1",
  },
  contentDetails: {
    padding: "20px 20px 25px 20px",
  },
  label: {
    display: "flex",
    alignItems: "center",
  },
  labelIcon: {
    width: "1rem",
    height: "1rem",
    marginRight: "10px",
    color: "grey",
  },
});

class CreateUnit extends Component {
  constructor() {
    super();
    this.state = {
      name: "",
      subject: "",
      focused: false,
      description: "",
      errors: {},
      success: null,
      openUploadDialog: null,
      openDeleteDialog: null,
      anchorEl: null,
    };
  }

  handleCloseMenu = () => {
    this.setState({ anchorEl: null });
  };

  handleOpenUploadDialog = () => {
    this.setState({ openUploadDialog: true });
  };

  handleCloseUploadDialog = () => {
    this.setState({ openUploadDialog: false });
  };

  handleOpenDeleteDialog = () => {
    this.setState({ openDeleteDialog: true });
  };

  handleCloseDeleteDialog = () => {
    this.setState({ openDeleteDialog: false });
  };

  onChange = (e, otherfield = null) => {
    this.setState({ [e.target.id]: e.target.value });
  };

  onSubmit = (e, id) => {
    e.preventDefault();
    const unitData = {
      name: this.state.name,
      description: this.state.description,
    };

    this.handleOpenUploadDialog();
    createUnit(unitData).then((res) => {
      this.setState({ success: res });
    });
  };

  componentDidMount() {
    const { handleNavbar, handleSideDrawer, handleFooter } = this.props;
    handleNavbar(false);
    handleSideDrawer(false);
    handleFooter(false);
  }

  componentWillUnmount() {
    const { handleNavbar, handleSideDrawer, handleFooter } = this.props;
    handleNavbar(true);
    handleSideDrawer(true);
    handleFooter(true);
  }

  render() {
    const { classes } = this.props;
    const { user } = this.props.auth;
    const { errors, success } = this.state;

    document.title = "Schooly | Buat Unit";

    return (
      <div className={classes.background}>
        <div className={classes.root}>
          <form
            noValidate
            onSubmit={(e) => this.onSubmit(e, user._id)}
            style={{ width: "100%" }}
          >
            <AppBar position="fixed" className={classes.menuBar}>
              <Grid container justify="space-between" alignItems="center">
                <Grid item xs>
                  <Typography variant="h6" color="textSecondary">
                    Unit
                  </Typography>
                </Grid>
                <Grid item>
                  <Grid container alignItems="center" spacing={1}>
                    <Grid item>
                      <Button type="submit" className={classes.createButton}>
                        Buat
                      </Button>
                    </Grid>
                    <Grid item>
                      <Button
                        onClick={this.handleOpenDeleteDialog}
                        className={classes.deleteButton}
                      >
                        Hapus
                      </Button>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </AppBar>
            <div className={classes.content}>
              <div className={classes.toolbar} />
              <Paper>
                <div className={classes.contentDetails}>
                  <Typography variant="h5" gutterBottom>
                    Buat Unit
                  </Typography>
                  <Typography color="textSecondary">
                    Setelah sebuah Unit dibuat, masukkan pengelola aktif ke
                    dalam unit untuk mengatur guru dan murid di Unit tersebut.
                  </Typography>
                </div>
                <Divider />
                <div className={classes.contentDetails}>
                  <Grid container direction="column" spacing={4}>
                    <Grid item>
                      <Typography color="primary" className={classes.label}>
                        <WebIcon className={classes.labelIcon} />
                        Nama Unit
                      </Typography>
                      <TextField
                        fullWidth
                        variant="outlined"
                        id="name"
                        type="text"
                        onChange={this.onChange}
                        value={this.state.name}
                        error={errors.name}
                        helperText={errors.name}
                      />
                    </Grid>
                    <Grid item>
                      <Typography color="primary" className={classes.label}>
                        <ShortTextIcon className={classes.labelIcon} />
                        Keterangan
                      </Typography>
                      <TextField
                        fullWidth
                        multiline
                        variant="outlined"
                        id="description"
                        type="text"
                        rows="5"
                        rowsMax="25"
                        onChange={(e) => this.onChange(e, "description")}
                        value={this.state.description}
                        error={errors.description}
                        helperText={errors.description}
                      />
                    </Grid>
                  </Grid>
                </div>
              </Paper>
            </div>
          </form>
          <UploadDialog
            openUploadDialog={this.state.openUploadDialog}
            success={success}
            messageUploading="Unit sedang dibuat"
            messageSuccess="Unit telah dibuat"
            redirectLink="/daftar-unit"
          />
          <DeleteDialog
            openDeleteDialog={this.state.openDeleteDialog}
            handleCloseDeleteDialog={this.handleCloseDeleteDialog}
            itemType="Unit"
            redirectLink="/daftar-unit"
          />
        </div>
        <FloatingHelp />
      </div>
    );
  }
}

CreateUnit.propTypes = {
  auth: PropTypes.object.isRequired,
  success: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  classesCollection: state.classesCollection,
  subjectsCollection: state.subjectsCollection,
  success: state.success,
  errors: state.errors,
});

export default connect(mapStateToProps, {})(withStyles(styles)(CreateUnit));
