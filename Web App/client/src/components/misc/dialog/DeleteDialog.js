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
    fontSize: "12px",
    color: theme.palette.error.main,
  },
  cancelButton: {
    fontSize: "12px",
    color: theme.palette.grey.A700,
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
    warningText,
  } = props;

  return (
    <Dialog
      open={openDeleteDialog}
      onClose={handleCloseDeleteDialog}
      PaperProps={{ className: classes.root }}
    >
      <DialogTitle>
        <Typography variant="h6">
          Hapus {itemType} berikut?
        </Typography>
      </DialogTitle>
      <DialogContent>
        {itemName ? (
          <Typography noWrap>
            {itemName}
          </Typography>
        ) : null}
        {warningText ? (
          <Typography variant="body2" color="textSecondary" gutterBottom>
            {warningText}
          </Typography>
        ) : null}
      </DialogContent>
      <DialogActions>
        <Button
          onClick={handleCloseDeleteDialog}
          startIcon={<CancelIcon />}
          className={classes.cancelButton}
        >
          Batal
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
