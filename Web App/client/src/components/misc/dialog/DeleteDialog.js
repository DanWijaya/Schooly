import React from "react";
import { Link } from "react-router-dom";
import { Button, Dialog, Grid, Typography } from "@material-ui/core";
import {
  Cancel as CancelIcon,
  DeleteOutline as DeleteOutlineIcon,
  ErrorOutline as ErrorOutlineIcon
} from "@material-ui/icons";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "300px",
    maxWidth: "100%",
    minHeight: "175px",
    padding: "15px",
  },
  dialogDeleteButton: {
    width: "125px",
    backgroundColor: theme.palette.error.main,
    color: "white",
    border: `1px solid ${theme.palette.error.main}`,
    "&:focus, &:hover": {
      backgroundColor: theme.palette.error.dark,
      color: "white",
      border: `1px solid ${theme.palette.error.dark}`,
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

function DeleteDialog(props) {
  const classes = useStyles();
  const {
    openDeleteDialog,
    handleCloseDeleteDialog,
    itemType,
    itemName,
    deleteItem,
    redirectLink,
    customMessage,
    // customConfirm,
    customDecline,
    isWarning,
  } = props;

  return (
    <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
      <Grid
        container
        direction="column"
        justify="space-between"
        alignItems="center"
        className={classes.root}
      >
        <Grid item>
          <Typography variant="h6" align="center" gutterBottom>
            {customMessage
              ? `${customMessage} ${itemType}`
              : `Hapus ${itemType} berikut?`}
          </Typography>
        </Grid>
        <Grid item container direction="column" alignItems="center">
          <Grid item>
            {itemName ? (
              <Typography align="center" gutterBottom>
                <b>{itemName}</b>
              </Typography>
            ) : null}
          </Grid>
          <Grid item>
            {isWarning ? (
              <div className={classes.warning}>
                <ErrorOutlineIcon className={classes.warningIcon} />
                <Typography align="center" className={classes.warningText}>
                  Nilai Murid pada {itemType} ini juga akan dihapus
                </Typography>
              </div>
            ) : null}
          </Grid>
        </Grid>
        <Grid container spacing={2} justify="center" alignItems="center">
          <Grid item>
            {!redirectLink ? (
              <Button
                onClick={deleteItem}
                startIcon={<DeleteOutlineIcon />}
                className={classes.dialogDeleteButton}
              >
                Iya
              </Button>
            ) : (
              <Link to={redirectLink}>
                <Button
                  onClick={deleteItem}
                  startIcon={<DeleteOutlineIcon />}
                  className={classes.dialogDeleteButton}
                >
                  Iya
                </Button>
              </Link>
            )}
          </Grid>
          <Grid item>
            <Button
              onClick={handleCloseDeleteDialog}
              startIcon={<CancelIcon />}
              className={classes.dialogCancelButton}
            >
              {customDecline ? customDecline : "Tidak"}
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </Dialog>
  );
}

export default DeleteDialog;
