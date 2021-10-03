import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import classnames from "classnames";
import { createUnit } from "../../../actions/UnitActions";
import UploadDialog from "../../misc/dialog/UploadDialog";
import DeleteDialog from "../../misc/dialog/DeleteDialog";
import {
  Button,
  Divider,
  FormHelperText,
  Grid,
  Paper,
  Select,
  TextField,
  Typography,
} from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import AttachFileIcon from "@material-ui/icons/AttachFile";
import MuiAlert from "@material-ui/lab/Alert";

const path = require("path");

const styles = (theme) => ({
  root: {
    margin: "auto",
    maxWidth: "80%",
    [theme.breakpoints.down("md")]: {
      maxWidth: "100%",
    },
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
  createUnitButton: {
    backgroundColor: theme.palette.success.main,
    color: "white",
    "&:focus, &:hover": {
      backgroundColor: theme.palette.success.main,
      color: "white",
    },
  },
  cancelButton: {
    backgroundColor: theme.palette.error.main,
    color: "white",
    "&:focus, &:hover": {
      backgroundColor: theme.palette.error.main,
      color: "white",
    },
    marginRight: "7.5px",
  },
  zeroHeightHelperText: {
    height: "0",
    display: "flex", // untuk men-disable "collapsing margin"
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
    console.log(unitData);

    this.handleOpenUploadDialog();

    createUnit(unitData).then((res) => {
      this.setState({ success: res });
    });
  };

  render() {
    const { classes } = this.props; // originally have errors
    const { errors, success } = this.state;
    const { user } = this.props.auth;

    // console.log(class_assigned);
    // console.log(errors);

    document.title = "Schooly | Buat Unit";

    return (
      <div className={classes.root}>
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
        <Paper>
          <div className={classes.content}>
            <Typography variant="h5" gutterBottom>
              <b>Buat Unit</b>
            </Typography>
            <Typography color="textSecondary">
              Tambahkan keterangan unit untuk membuat unit.
            </Typography>
          </div>
          <Divider />
          <form noValidate onSubmit={(e) => this.onSubmit(e, user._id)}>
            <Grid container>
              <Grid item xs={12} md className={classes.content}>
                <Grid container direction="column" spacing={4}>
                  <Grid item>
                    <Typography component="label" for="name" color="primary">
                      Nama
                    </Typography>
                    <TextField
                      fullWidth
                      variant="outlined"
                      id="name"
                      onChange={this.onChange}
                      value={this.state.name}
                      error={errors.name}
                      type="text"
                      // helperText={errors.name}
                      className={classnames("", {
                        invalid: errors.name,
                      })}
                    />
                    {errors.name ? (
                      <div className={classes.zeroHeightHelperText}>
                        <FormHelperText variant="outlined" error>
                          {errors.name}
                        </FormHelperText>
                      </div>
                    ) : null}
                  </Grid>
                  <Grid item>
                    <Typography
                      component="label"
                      for="description"
                      color="primary"
                    >
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
                      className={classnames("", {
                        invalid: errors.description,
                      })}
                    />
                    {errors.description ? (
                      <div className={classes.zeroHeightHelperText}>
                        <FormHelperText variant="outlined" error>
                          {errors.description}
                        </FormHelperText>
                      </div>
                    ) : null}
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
            <div
              style={{ display: "flex", justifyContent: "flex-end" }}
              className={classes.content}
            >
              <div style={{ display: "flex", flexDirection: "row" }}>
                <Button
                  variant="contained"
                  className={classes.cancelButton}
                  onClick={this.handleOpenDeleteDialog}
                >
                  Batal
                </Button>
                <Button
                  variant="contained"
                  type="submit"
                  className={classes.createUnitButton}
                >
                  Buat Unit
                </Button>
              </div>
            </div>
          </form>
        </Paper>
      </div>
    );
  }
}

CreateUnit.propTypes = {
  errors: PropTypes.object.isRequired,
  success: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  errors: state.errors,
  success: state.success,
  subjectsCollection: state.subjectsCollection,
  classesCollection: state.classesCollection,
});

export default connect(mapStateToProps, {})(withStyles(styles)(CreateUnit));
