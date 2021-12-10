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
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: "300px",
    width: "100%",
  },
  submitButton: {
    fontSize: "12px",
    color: theme.palette.success.main,
  },
  cancelButton: {
    fontSize: "12px",
    color: theme.palette.grey.A700,
  },
}));

function SubmitDialog(props) {
  const classes = useStyles();

  const [loading, setLoading] = React.useState(false);
  const {
    openSubmitDialog,
    handleCloseSubmitDialog,
    itemType,
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
        <>
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
        </>
      ) : (
        <>
          <DialogTitle>
            <Typography variant="h6">
              Kumpul {itemType} berikut?
            </Typography>
          </DialogTitle>
          <DialogContent>
            <Typography color="textSecondary" paragraph>
              Pastikan semua nomor sudah terjawab.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={handleCloseSubmitDialog}
              className={classes.cancelButton}
            >
              Batal
            </Button>
            <Button
              onClick={handleClick}
              className={classes.submitButton}
            >
              Kumpul
            </Button>
          </DialogActions>
        </>
      )}
    </Dialog>
  );
}

export default SubmitDialog;
