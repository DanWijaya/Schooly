import React from "react";
import { Link } from "react-router-dom";
import { Button, Dialog, Grid, Typography } from "@material-ui/core/";
import { makeStyles } from "@material-ui/core/styles";
import CancelIcon from "@material-ui/icons/Cancel";
import BlockIcon from "@material-ui/icons/Block";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "300px",
    maxWidth: "100%",
    minHeight: "175px",
    padding: "15px",
  },
  dialogConfirmButton: {
    width: "125px",
    backgroundColor: theme.palette.success.main,
    color: "white",
    border: `1px solid ${theme.palette.success.main}`,
    "&:focus, &:hover": {
      backgroundColor: theme.palette.success.dark,
      color: "white",
      border: `1px solid ${theme.palette.success.dark}`,
    },
  },
  dialogCancelButton: {
    width: "125px",
    backgroundColor: "white",
    color: theme.palette.error.main,
    border: `1px solid ${theme.palette.error.main}`,
    "&:focus, &:hover": {
      backgroundColor: "white",
      color: theme.palette.error.dark,
      border: `1px solid ${theme.palette.error.dark}`,
    },
  },
  warningText: {
    color: theme.palette.error.main,
    marginLeft: "3px",
    fontSize: "10px",
  },
  warningIcon: {
    color: theme.palette.error.main,
    width: "15px",
    height: "15px",
  },
  warning: {
    display: "flex",
    alignItems: "center",
  },
}));

function ActivateDialog(props) {
  const classes = useStyles();
  const { open, onClose, itemName, onAction, itemId, itemType } = props;

  return (
    <Dialog open={open} onClose={onClose}>
      <Grid
        container
        direction="column"
        justify="space-between"
        alignItems="center"
        className={classes.root}
      >
        <Grid item>
          <Typography variant="h6" gutterBottom>
            Aktifkan {itemType} berikut?
          </Typography>
        </Grid>
        <Grid item>
          <Typography align="center" gutterBottom>
            <b>{itemName}</b>
          </Typography>
        </Grid>
        <Grid container spacing={2} justify="center" alignItems="center">
          <Grid item>
            <Button
              onClick={() => {
                onAction(itemId);
              }}
              startIcon={<CheckCircleIcon />}
              className={classes.dialogConfirmButton}
            >
              Iya
            </Button>
          </Grid>
          <Grid item>
            <Button
              onClick={onClose}
              startIcon={<CancelIcon />}
              className={classes.dialogCancelButton}
            >
              Tidak
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </Dialog>
  );
}

export default ActivateDialog;
