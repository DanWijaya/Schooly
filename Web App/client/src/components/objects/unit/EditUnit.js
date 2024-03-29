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
  Typography,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import {
  Close as CloseIcon,
  ShortText as ShortTextIcon,
  Web as WebIcon,
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
      boxShadow:
        "0px 1px 2px 0px rgba(194,100,1,0.3), 0px 2px 6px 2px rgba(194,100,1,0.15)",
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
}));

function EditUnit(props) {
  const classes = useStyles();
  const {
    getOneUnit,
    updateUnit,
    handleSideDrawer,
    handleNavbar,
    handleFooter,
  } = props;
  const { id } = props.match.params;
  const { selectedUnits } = props.unitsCollection;

  const [objData, setObjData] = React.useState({
    name: "",
    description: "",
  });
  const [errors, setErrors] = React.useState({});
  const [success, setSuccess] = React.useState(false);
  const [openUploadDialog, setOpenUploadDialog] = React.useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = React.useState(false);

  const handleOpenUploadDialog = () => {
    setOpenUploadDialog(true);
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
    handleNavbar(false);
    handleSideDrawer(false);
    handleFooter(false);
    return () => {
      handleNavbar(true);
      handleSideDrawer(true);
      handleFooter(true);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    setObjData(selectedUnits);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedUnits]);

  document.title = "Schooly | Sunting Unit";

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
                    <IconButton
                      onClick={handleOpenDeleteDialog}
                      className={classes.closeButton}
                    >
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
                    <Typography color="primary" className={classes.label}>
                      <WebIcon className={classes.labelIcon} />
                      Nama Unit
                    </Typography>
                    <TextField
                      fullWidth
                      variant="outlined"
                      size="small"
                      id="name"
                      type="text"
                      onChange={onChange}
                      value={objData.name}
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
                      size="small"
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
