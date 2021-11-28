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
  CheckCircle as CheckCircleIcon,
} from "@material-ui/icons";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: "300px",
    width: "100%",
  },
  activateButton: {
    fontSize: "12px",
    color: theme.palette.success.main,
  },
  cancelButton: {
    fontSize: "12px",
    color: theme.palette.grey.A700,
  },
}));

function ActivateDialog(props) {
  const classes = useStyles();
  const { open, onClose, itemName, onAction, itemId, itemType } = props;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{ className: classes.root }}
    >
      <DialogTitle>
        <Typography variant="h6">
          Aktifkan {itemType} berikut?
        </Typography>
      </DialogTitle>
      <DialogContent>
        <Typography noWrap gutterBottom>
          {itemName}
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={onClose}
          startIcon={<CancelIcon />}
          className={classes.cancelButton}
        >
          Batal
        </Button>
        <Button
          onClick={() => onAction(itemId)}
          startIcon={<CheckCircleIcon />}
          className={classes.activateButton}
        >
          Aktifkan
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ActivateDialog;
