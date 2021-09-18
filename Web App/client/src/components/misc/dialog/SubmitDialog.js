import React from "react";
import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Typography,
} from "@material-ui/core/";
import {
  Cancel as CancelIcon,
  Publish as PublishIcon
} from "@material-ui/icons";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: "300px",
    width: "100%",
  },
  submitButton: {
    maxWidth: "110px",
    width: "100%",
    border: `1px solid ${theme.palette.success.main}`,
    backgroundColor: theme.palette.success.main,
    color: "white",
    "&:focus, &:hover": {
      border: `1px solid ${theme.palette.success.dark}`,
      backgroundColor: theme.palette.success.dark,
      color: "white",
    },
  },
  cancelButton: {
    maxWidth: "110px",
    width: "100%",
    border: `1px solid ${theme.palette.error.main}`,
    backgroundColor: theme.palette.error.main,
    color: "white",
    "&:focus, &:hover": {
      border: `1px solid ${theme.palette.error.dark}`,
      backgroundColor: theme.palette.error.dark,
      color: "white",
    },
  },
}));

function SubmitDialog(props) {
  const classes = useStyles();

  const [loading, setLoading] = React.useState(false);
  const {
    openSubmitDialog,
    handleCloseSubmitDialog,
    itemType,
    itemName,
    onSubmit,
    messageLoading,
  } = props;

  function handleClick() {
    setLoading(true);
    onSubmit();
  }

  return (
    <Dialog
      open={openSubmitDialog}
      onClose={handleCloseSubmitDialog}
      PaperProps={{ className: classes.root }}
    >
      {loading ? (
        <div>
          <DialogTitle>
            <Typography variant="h6" align="center">
              {messageLoading}
            </Typography>
          </DialogTitle>
          <DialogContent>
            <Grid container direction="column" alignItems="center" spacing={2}>
              <Grid item>
                <CircularProgress />
              </Grid>
              <Grid item>
                <Typography variant="body2" align="center" gutterBottom>
                  Mohon untuk tetap berada di halaman ini.
                </Typography>
              </Grid>
            </Grid>
          </DialogContent>
        </div>
      ) : (
        <div>
          <DialogTitle>
            <Typography variant="h6">
              Kumpul {itemType} berikut?
            </Typography>
          </DialogTitle>
          <DialogContent>
            <Typography noWrap gutterBottom>
              {itemName}
            </Typography>
            <Typography variant="body2" color="textSecondary" paragraph>
              Pastikan semua nomor sudah terjawab.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={handleCloseSubmitDialog}
              startIcon={<CancelIcon />}
              className={classes.cancelButton}
            >
              Batal
            </Button>
            <Button
              onClick={handleClick}
              startIcon={<PublishIcon />}
              className={classes.submitButton}
            >
              Kumpul
            </Button>
          </DialogActions>
        </div>
      )}
    </Dialog>
  );
}

export default SubmitDialog;
