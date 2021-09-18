import React from "react";
import { Link } from "react-router-dom";
import {
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  Typography
} from "@material-ui/core/";
import { CheckCircle as CheckCircleIcon } from "@material-ui/icons";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: "300px",
    width: "100%",
  },
  successIcon: {
    color: "green",
    height: "45px",
    width: "45px",
  },
  finishButton: {
    width: "100%",
    marginTop: "10px",
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
    <Dialog
      open={openUploadDialog}
      onClose={handleCloseUploadDialog}
      PaperProps={{ className: classes.root }}
    >
      <DialogTitle>
        <Typography variant="h6" align="center">
          {!success ? messageUploading : messageSuccess}
        </Typography>
      </DialogTitle>
      <DialogContent>
        <Grid container direction="column" alignItems="center" spacing={2}>
          <Grid item>
            {!success ? (
              <CircularProgress />
            ) : (
              <CheckCircleIcon className={classes.successIcon} />
            )}
          </Grid>
          <Grid item>
            {!success ? (
              <Typography variant="body2" align="center" gutterBottom>
                Mohon untuk tetap berada di halaman ini.
              </Typography>
            ) : !redirectLink ? (
              <Button
                className={classes.finishButton}
                onClick={handleCloseUploadDialog}
              >
                Selesai
              </Button>
            ) : (
              <Link to={redirectLink}>
                <Button className={classes.finishButton}>
                  Selesai
                </Button>
              </Link>
            )}
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
}

export default UploadDialog;
