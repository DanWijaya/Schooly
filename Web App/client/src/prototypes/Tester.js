import React from "react";
import { Button, CircularProgress, Dialog, Grid, IconButton, Snackbar, TextField, Typography } from "@material-ui/core"
import MuiAlert from '@material-ui/lab/Alert';
import OutlinedTextField from "../components/misc/text-field/OutlinedTextField";
import { makeStyles } from "@material-ui/core/styles";
import CancelIcon from "@material-ui/icons/Cancel";
import CloseIcon from "@material-ui/icons/Close";
import DeleteOutlineIcon from "@material-ui/icons/DeleteOutline";
import StandardTextField from "../components/misc/text-field/StandardTextField";

const useStyles = makeStyles((theme) => ({
  root: {
    // margin: "auto",
    // maxWidth: "1000px",
    display: "flex",
    flexDirection: "column",
    // justifyContent: "center",
    // padding: "10px",
  },
}));

export default function Tester(props) {
  const classes = useStyles();

  //Error Snackbar
  const [open, setOpen] = React.useState(false);
  const handleClick = () => {
    setOpen(true);
  };
  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  //Dialog
  const [openDeleteDialog, setOpenDeleteDialog] = React.useState(null);
  const handleOpenDeleteDialog = (fileid, filename) => {
    setOpenDeleteDialog(true);
  };
  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
  };

  return(
    <div style={{display: "flex", flexDirection: "column"}}>
      <Button variant="outlined" onClick={handleClick}>
        Error Snackbar Button
      </Button>
      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <MuiAlert elevation={6} variant="filled" onClose={handleClose} severity="error">
          This is a success message!
        </MuiAlert>
      </Snackbar>

      <Button variant="outlined" onClick={handleOpenDeleteDialog}>
        Dialog Button
      </Button>
      <Dialog
        open={openDeleteDialog}
        className={classes.root}
      >
        <Grid container spacing={2} direction="column" alignItems="center" style={{padding: "20px"}}>
          <Grid item container justify="center">
            <Typography variant="h6" align="center" gutterBottom>
              File sedang diunggah.
            </Typography>
          </Grid>
          <Grid item>
            <CircularProgress />
          </Grid>
          <Grid item container justify="center">
            <Typography variant="body1" align="center" gutterBottom>
              <b>Mohon halaman ini jangan diperbarui.</b>
            </Typography>
          </Grid>
        </Grid>
      </Dialog>
      <div>
      <OutlinedTextField
      />
      </div>
    </div>
  )
}
