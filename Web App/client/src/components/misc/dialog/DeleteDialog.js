import React from "react";
import { Link } from "react-router-dom";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography
} from "@material-ui/core";
import {
  Cancel as CancelIcon,
  DeleteOutline as DeleteOutlineIcon,
} from "@material-ui/icons";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: "300px",
    width: "100%",
  },
  deleteButton: {
    maxWidth: "90px",
    width: "100%",
    fontSize: "12px",
    color: theme.palette.error.main,
  },
  cancelButton: {
    maxWidth: "90px",
    width: "100%",
    fontSize: "12px",
    color: theme.palette.text.secondary,
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
    customDecline,
    isWarning,
  } = props;

  return (
    <Dialog
      open={openDeleteDialog}
      onClose={handleCloseDeleteDialog}
      PaperProps={{ className: classes.root }}
    >
      <DialogTitle>
        <Typography variant="h6">
          {customMessage
            ? `${customMessage} ${itemType}`
            : `Hapus ${itemType} berikut?`}
        </Typography>
      </DialogTitle>
      <DialogContent>
        {itemName ? (
          <Typography noWrap gutterBottom>
            {itemName}
          </Typography>
        ) : null}
        {isWarning ? (
          <Typography variant="body2" color="textSecondary" paragraph>
            Nilai Murid pada {itemType} ini juga akan dihapus
          </Typography>
        ) : null}
      </DialogContent>
      <DialogActions>
        <Button
          onClick={handleCloseDeleteDialog}
          startIcon={<CancelIcon />}
          className={classes.cancelButton}
        >
          {customDecline ? customDecline : "Batal"}
        </Button>
        {!redirectLink ? (
          <Button
            onClick={deleteItem}
            startIcon={<DeleteOutlineIcon />}
            className={classes.deleteButton}
          >
            Hapus
          </Button>
        ) : (
          <Link to={redirectLink}>
            <Button
              onClick={deleteItem}
              startIcon={<DeleteOutlineIcon />}
              className={classes.deleteButton}
            >
              Hapus
            </Button>
          </Link>
        )}
      </DialogActions>
    </Dialog>
  );
}

export default DeleteDialog;
