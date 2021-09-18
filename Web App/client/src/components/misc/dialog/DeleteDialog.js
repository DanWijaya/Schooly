import React from "react";
import { Link } from "react-router-dom";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Typography
} from "@material-ui/core";
import {
  Cancel as CancelIcon,
  DeleteOutline as DeleteOutlineIcon,
  ErrorOutline as ErrorOutlineIcon
} from "@material-ui/icons";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: "500px",
  },
  warning: {
    display: "flex",
    alignItems: "center",
  },
  warningText: {
    color: theme.palette.error.main,
    fontSize: "10px",
  },
  warningIcon: {
    color: theme.palette.error.main,
    width: "15px",
    height: "15px",
  },
  dialogDeleteButton: {
    maxWidth: "125px",
    width: "100%",
    backgroundColor: theme.palette.error.main,
    color: "white",
    "&:focus, &:hover": {
      backgroundColor: theme.palette.error.dark,
      color: "white",
    },
  },
  dialogCancelButton: {
    maxWidth: "125px",
    width: "100%",
    backgroundColor: "white",
    color: theme.palette.error.main,
    "&:focus, &:hover": {
      backgroundColor: "white",
      color: theme.palette.error.dark,
    },
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
      <div className={classes.root}>
        <DialogTitle>
          <Typography variant="h6">
            {customMessage
              ? `${customMessage} ${itemType}`
              : `Hapus ${itemType} berikut?`}
          </Typography>
        </DialogTitle>
        <DialogContent>
          {itemName ? (
            <Typography gutterBottom>
              {itemName}
            </Typography>
          ) : null}
          {isWarning ? (
            <div className={classes.warning}>
              <ErrorOutlineIcon className={classes.warningIcon} />
              <Typography className={classes.warningText}>
                Nilai Murid pada {itemType} ini juga akan dihapus
              </Typography>
            </div>
          ) : null}
        </DialogContent>
        <DialogActions>
          <Button
            variant="outlined"
            color="error"
            onClick={handleCloseDeleteDialog}
            startIcon={<CancelIcon />}
            className={classes.dialogCancelButton}
          >
            {customDecline ? customDecline : "Tidak"}
          </Button>
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
        </DialogActions>
      </div>
      {/*<Grid
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
      </Grid>*/}
    </Dialog>
  );
}

export default DeleteDialog;
