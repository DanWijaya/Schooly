import React from "react";
import { Link } from "react-router-dom";
import { Button, Dialog, Grid, Typography } from "@material-ui/core/";
import { makeStyles } from "@material-ui/core/styles";
import CancelIcon from "@material-ui/icons/Cancel";

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: "350px",
    minHeight: "175px",
    padding: "15px",
  },
  dialogSubmitButton: {
    width: "150px",
    backgroundColor: theme.palette.create.main,
    color: "white",
    border: `1px solid ${theme.palette.create.main}`,
    "&:focus, &:hover": {
      backgroundColor: theme.palette.create.dark,
      color: "white",
      border: `1px solid ${theme.palette.create.dark}`,
    },
  },
  dialogCancelButton: {
    width: "150px",
    backgroundColor: theme.palette.error.main,
    color: "white",
    border: `1px solid ${theme.palette.error.main}`,
    "&:focus, &:hover": {
      backgroundColor: theme.palette.error.dark,
      color: "white",
      border: `1px solid ${theme.palette.error.dark}`,
    },
  },
}));

function SubmitDialog(props) {
  const classes = useStyles();

  const { openSubmitDialog, handleCloseSubmitDialog, itemType, itemName, onSubmit, isLink, redirectLink } = props;

  return (
    <Dialog open={openSubmitDialog} onClose={handleCloseSubmitDialog}>
      <Grid container direction="column" justify="space-between" alignItems="center" className={classes.root}>
        <Grid item>
          <Typography variant="h5" align="center" gutterBottom>
            Kumpul {itemType} berikut?
          </Typography>
        </Grid>
        <Grid item>
          <Typography variant="h6" align="center" gutterBottom>
            <b>{itemName}</b>
          </Typography>
        </Grid>
        <Grid container spacing={2} justify="center" alignItems="center">
          <Grid item>
            <Button
              onClick={onSubmit}
              className={classes.dialogSubmitButton}
            >
              Kumpul
            </Button>
          </Grid>
          <Grid item>
            <Button
              onClick={handleCloseSubmitDialog}
              startIcon={<CancelIcon />}
              className={classes.dialogCancelButton}
              >
              Batal
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </Dialog>
  )
}

export default SubmitDialog;
