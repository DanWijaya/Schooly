import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { getOneUnit, updateUnit } from "../../../actions/UnitActions";
import UploadDialog from "../../misc/dialog/UploadDialog";
import DeleteDialog from "../../misc/dialog/DeleteDialog";
import FloatingHelp from "../../misc/floating-help/FloatingHelp";
import {
  AppBar,
  Button,
  Divider,
  Grid,
  IconButton,
  Paper,
  TextField,
  Typography
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import {
  Close as CloseIcon,
  ShortText as ShortTextIcon,
  Web as WebIcon
} from "@material-ui/icons";

const useStyles = makeStyles((theme) => ({
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
  editButton: {
    width: "90px",
    backgroundColor: theme.palette.primary.main,
    color: "white",
    "&:focus, &:hover": {
      backgroundColor: theme.palette.primary.main,
      color: "white",
      boxShadow: "0px 1px 2px 0px rgba(194,100,1,0.3), 0px 2px 6px 2px rgba(194,100,1,0.15)",
    },
  },
  closeButton: {
    width: "32px",
    height: "32px",
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
    <div className={classes.background}>
      <div className={classes.root}>
        <form noValidate onSubmit={onSubmit} style={{ width: "100%" }}>
          <AppBar position="fixed" className={classes.menuBar}>
            <Grid container justify="space-between" alignItems="center">
              <Grid item xs>
                <Typography variant="h6" color="textSecondary">
                  Unit
                </Typography>
              </Grid>
              <Grid item>
                <Grid container alignItems="center" spacing={2}>
                  <Grid item>
                    <Button type="submit" className={classes.editButton}>
                      Sunting
                    </Button>
                  </Grid>
                  <Grid item>
                    <IconButton onClick={handleOpenDeleteDialog} className={classes.closeButton}>
                      <CloseIcon style={{ fontSize: "24px" }} />
                    </IconButton>
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
                  Sunting Unit
                </Typography>
                <Typography color="textSecondary">
                  Ganti nama unit ataupun keterengan Unit.
                </Typography>
              </div>
              <Divider />
              <div className={classes.contentDetails}>
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
                      onChange={onChange}
                      value={objData.name}
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
                      onChange={(e) => onChange(e, "description")}
                      value={objData.description}
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
          openUploadDialog={openUploadDialog}
          success={success}
          messageUploading="Unit sedang disunting"
          messageSuccess="Unit telah disunting"
          redirectLink="/daftar-unit"
        />
        <DeleteDialog
          openDeleteDialog={openDeleteDialog}
          handleCloseDeleteDialog={handleCloseDeleteDialog}
          itemType="perubahan pada Unit"
          redirectLink="/daftar-unit"
        />
      </div>
      <FloatingHelp />
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
