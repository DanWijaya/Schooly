import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { createUnit } from "../../../actions/UnitActions";
import UploadDialog from "../../misc/dialog/UploadDialog";
import DeleteDialog from "../../misc/dialog/DeleteDialog";
import {
  AppBar,
  Button,
  Grid,
  TextField,
  Typography
} from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import {
  ShortText as ShortTextIcon,
  Web as WebIcon
} from "@material-ui/icons";

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
    padding: "15px 20px",
    boxShadow: "0 1px 6px 0px rgba(32,33,36,0.28)",
    backgroundColor: "white",
    color: "black",
  },
  cancelButton: {
    width: "90px",
    backgroundColor: theme.palette.error.main,
    color: "white",
    "&:focus, &:hover": {
      backgroundColor: theme.palette.error.main,
      color: "white",
      boxShadow: "0px 1px 2px 0px rgba(194,100,1,0.3), 0px 2px 6px 2px rgba(194,100,1,0.15)",
    },
    [theme.breakpoints.down("sm")]: {
      width: "100%",
    },
  },
  createUnitButton: {
    width: "90px",
    backgroundColor: theme.palette.success.main,
    color: "white",
    "&:focus, &:hover": {
      backgroundColor: theme.palette.success.main,
      color: "white",
      boxShadow: "0px 1px 2px 0px rgba(194,100,1,0.3), 0px 2px 6px 2px rgba(194,100,1,0.15)",
    },
    [theme.breakpoints.down("sm")]: {
      width: "100%",
    },
  },
  toolbar: theme.mixins.toolbar,
  content: {
    display: "flex",
    flexDirection: "column",
    flexGrow: "1",
  },
  labelIcon: {
    fontSize: "18px",
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
    const { handleNavbar, handleSideDrawerExist, handleFooter } = this.props;
    handleNavbar(false);
    handleSideDrawerExist(false);
    handleFooter(false);
  }

  componentWillUnmount() {
    const { handleNavbar, handleSideDrawerExist, handleFooter } = this.props;
    handleNavbar(true);
    handleSideDrawerExist(true);
    handleFooter(true);
  }

  render() {
    const { classes } = this.props;
    const { user } = this.props.auth;
    const { errors, success } = this.state;

    document.title = "Schooly | Buat Unit";

    return (
      <div className={classes.root}>
        <form noValidate onSubmit={(e) => this.onSubmit(e, user._id)} style={{ width: "100%" }}>
          <AppBar position="fixed" className={classes.menuBar}>
            <Grid container justify="space-between" alignItems="center">
              <Grid item xs>
                <Typography variant="h5" color="textSecondary">
                  Unit
                </Typography>
              </Grid>
              <Grid item>
                <Grid container alignItems="center" spacing={2}>
                  <Grid item>
                    <Button onClick={this.handleOpenDeleteDialog} className={classes.cancelButton}>
                      Batal
                    </Button>
                  </Grid>
                  <Grid item>
                    <Button type="submit" className={classes.createUnitButton}>
                      Buat
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </AppBar>
          <div className={classes.content}>
            <div className={classes.toolbar} />
            <Typography variant="h5">
              Buat Unit
            </Typography>
            <Typography color="textSecondary" style={{ marginBottom: "35px" }}>
              Setelah sebuah unit dibuat, masukkan pengelola aktif ke dalam unit untuk mengatur guru dan murid di unit tersebut.
            </Typography>
            <Grid container direction="column" spacing={4}>
              <Grid item>
                <div style={{ display: "flex", alignItems: "center"}}>
                  <WebIcon className={classes.labelIcon} />
                  <Typography color="primary">
                    Nama Unit
                  </Typography>
                </div>
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
                <div style={{ display: "flex", alignItems: "center"}}>
                  <ShortTextIcon className={classes.labelIcon} />
                  <Typography color="primary">
                    Keterangan
                  </Typography>
                </div>
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
        </form>
        <UploadDialog
          openUploadDialog={this.state.openUploadDialog}
          success={success}
          messageUploading="Unit sedang dibuat"
          messageSuccess="Unit telah dibuat"
          redirectLink={`/daftar-unit`}
        />
        <DeleteDialog
          openDeleteDialog={this.state.openDeleteDialog}
          handleCloseDeleteDialog={this.handleCloseDeleteDialog}
          itemType="Unit"
          itemName={this.state.name}
          redirectLink="/daftar-unit"
          isWarning={false}
        />
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
