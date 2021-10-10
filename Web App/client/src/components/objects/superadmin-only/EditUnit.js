import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import classnames from "classnames";
import { getOneUnit, updateUnit } from "../../../actions/UnitActions";
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
import { makeStyles } from "@material-ui/core/styles";
import AttachFileIcon from "@material-ui/icons/AttachFile";
import MuiAlert from "@material-ui/lab/Alert";

const path = require("path");

const useStyles = makeStyles((theme) => ({
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
  updateUnitButton: {
    backgroundColor: theme.palette.primary.main,
    color: "white",
    "&:focus, &:hover": {
      backgroundColor: "white",
      color: theme.palette.primary.main,
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
}));

function EditUnit(props) {
  //Props
  const classes = useStyles(); // originally have errors
  const { user } = props.auth;
  const { id } = props.match.params;
  const { getOneUnit, updateUnit } = props;
  const { selectedUnits } = props.unitsCollection;
  const [objData, setObjData] = React.useState({
    name: "",
    description: "",
  });
  const [focused, setFocused] = React.useState(false);
  const [errors, setErrors] = React.useState({});
  const [success, setSuccess] = React.useState(false);
  const [openUploadDialog, setOpenUploadDialog] = React.useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = React.useState(false);
  const [anchorEl, setanchorEl] = React.useState(false);

  //Handlers
  const handleCloseMenu = () => {
    setanchorEl(null);
  };

  const handleOpenUploadDialog = () => {
    setOpenUploadDialog(true);
  };

  const handleCloseUploadDialog = () => {
    setOpenUploadDialog(false);
  };

  const handleOpenDeleteDialog = () => {
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
  };

  const onChange = (e, otherfield = null) => {
    setObjData({
      ...objData,
      [e.target.id]: e.target.value,
    });
  };

  const onSubmit = (e, id) => {
    e.preventDefault();

    const unitData = {
      name: objData.name,
      description: objData.description,
      _id: objData._id,
    };

    handleOpenUploadDialog();

    updateUnit(unitData).then((res) => {
      setSuccess(res);
    });
  };

  // Side Effects
  React.useEffect(() => {
    getOneUnit(id);
  }, []);

  React.useEffect(() => {
    setObjData(selectedUnits);
  }, [selectedUnits]);

  return (
    <div className={classes.root}>
      <UploadDialog
        openUploadDialog={openUploadDialog}
        success={success}
        messageUploading="Unit sedang dibuat"
        messageSuccess="Unit telah dibuat"
        redirectLink="/daftar-unit"
      />
      <DeleteDialog
        openDeleteDialog={openDeleteDialog}
        handleCloseDeleteDialog={handleCloseDeleteDialog}
        itemType="Unit"
        itemName={objData.name}
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
        <form noValidate onSubmit={onSubmit}>
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
                    onChange={onChange}
                    value={objData.name}
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
                    onChange={(e) => onChange(e, "description")}
                    value={objData.description}
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
                onClick={handleOpenDeleteDialog}
              >
                Batal
              </Button>
              <Button
                variant="contained"
                type="submit"
                className={classes.updateUnitButton}
              >
                Sunting Unit
              </Button>
            </div>
          </div>
        </form>
      </Paper>
    </div>
  );
}

EditUnit.propTypes = {
  errors: PropTypes.object.isRequired,
  success: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  getOneUnit: PropTypes.func.isRequired,
  updateUnit: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  errors: state.errors,
  success: state.success,
  unitsCollection: state.unitsCollection,
});

export default connect(mapStateToProps, {
  getOneUnit,
  updateUnit,
})(EditUnit);
