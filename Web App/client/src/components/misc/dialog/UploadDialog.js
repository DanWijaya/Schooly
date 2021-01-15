import React from "react";
import { Link } from "react-router-dom";
import {
  Button,
  CircularProgress,
  Dialog,
  Grid,
  Typography,
} from "@material-ui/core/";
import { makeStyles } from "@material-ui/core/styles";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "300px",
    maxWidth: "100%",
    minHeight: "175px",
    padding: "15px",
  },
  uploadSuccessIcon: {
    color: "green",
    height: "45px",
    width: "45px",
  },
  uploadFinishButton: {
    width: "100%",
    marginTop: "20px",
    backgroundColor: theme.palette.success.main,
    color: "white",
    "&:focus, &:hover": {
      backgroundColor: theme.palette.success.dark,
      color: "white",
    },
  },
}));

function UploadDialog(props) {
  const classes = useStyles();

  const {
    openUploadDialog,
    handleCloseUploadDialog,
    success,
    messageUploading,
    messageSuccess,
    redirectLink,
  } = props;

  return (
    <Dialog open={openUploadDialog} onClose={handleCloseUploadDialog}>
      <Grid
        container
        direction="column"
        justify="space-between"
        alignItems="center"
        className={classes.root}
      >
        <Grid item>
          <Typography variant="h6" align="center" gutterBottom>
            {!success ? messageUploading : messageSuccess}
          </Typography>
        </Grid>
        <Grid item>
          {!success ? (
            <CircularProgress />
          ) : (
            <CheckCircleIcon className={classes.uploadSuccessIcon} />
          )}
        </Grid>
        <Grid item>
          {!success ? (
            <Typography variant="body2" align="center" gutterBottom>
              <b>Mohon tunggu sebentar</b>
            </Typography>
          ) : !redirectLink ? (
            <Button
              variant="contained"
              className={classes.uploadFinishButton}
              onClick={handleCloseUploadDialog}
            >
              Selesai
            </Button>
          ) : (
            <Link to={redirectLink}>
              <Button
                variant="contained"
                className={classes.uploadFinishButton}
              >
                Selesai
              </Button>
            </Link>
          )}
        </Grid>
      </Grid>
    </Dialog>
  );
}

export default UploadDialog;
