import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import classnames from "classnames";
import { getOneUnit, updateUnit } from "../../../actions/UnitActions";
import UploadDialog from "../../misc/dialog/UploadDialog";
import DeleteDialog from "../../misc/dialog/DeleteDialog";
import {
  AppBar,
  Button,
  Grid,
  TextField,
  Typography
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import {
  ShortText as ShortTextIcon,
  Web as WebIcon
} from "@material-ui/icons";

const useStyles = makeStyles((theme) => ({
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
  editUnitButton: {
    width: "90px",
    backgroundColor: theme.palette.primary.main,
    color: "white",
    "&:focus, &:hover": {
      backgroundColor: theme.palette.primary.main,
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
}));

function EditUnit(props) {
  const classes = useStyles();
  const { getOneUnit, updateUnit } = props;
  const { user } = props.auth;
  const { id } = props.match.params;
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
      <form noValidate onSubmit={onSubmit} style={{ width: "100%" }}>
        <div className={classes.content}>
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
                    <Button onClick={handleOpenDeleteDialog} className={classes.cancelButton}>
                      Batal
                    </Button>
                  </Grid>
                  <Grid item>
                    <Button type="submit" className={classes.editUnitButton}>
                      Sunting
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </AppBar>
          <div className={classes.toolbar} />
          <Typography variant="h5">
            Sunting Unit
          </Typography>
          <Typography color="textSecondary" style={{ marginBottom: "35px" }}>
            Ganti nama unit ataupun keterengan unit.
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
                type="text"
                variant="outlined"
                id="name"
                onChange={onChange}
                value={objData.name}
                error={errors.name}
                helperText={errors.name}
                className={classnames("", {
                  invalid: errors.name,
                })}
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
                type="text"
                rows="5"
                rowsMax="25"
                variant="outlined"
                id="description"
                onChange={(e) => onChange(e, "description")}
                value={objData.description}
                error={errors.description}
                helperText={errors.description}
                className={classnames("", {
                  invalid: errors.description,
                })}
              />
            </Grid>
          </Grid>
        </div>
      </form>
      <UploadDialog
        openUploadDialog={openUploadDialog}
        success={success}
        messageUploading="Unit sedang disunting"
        messageSuccess="Unit telah disunting"
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
    </div>
  );
}

EditUnit.propTypes = {
  auth: PropTypes.object.isRequired,
  getOneUnit: PropTypes.func.isRequired,
  updateUnit: PropTypes.func.isRequired,
  success: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  unitsCollection: state.unitsCollection,
  success: state.success,
  errors: state.errors,
});

export default connect(mapStateToProps, {
  getOneUnit,
  updateUnit,
})(EditUnit);
