import React from "react";
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
  Block as BlockIcon,
} from "@material-ui/icons";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: "350px",
    width: "100%",
  },
  deactivateButton: {
    fontSize: "12px",
    color: theme.palette.warning.main,
  },
  cancelButton: {
    fontSize: "12px",
    color: theme.palette.grey.A700,
  },
}));

function DeactivateDialog(props) {
  const classes = useStyles();
  const { open, onClose, itemName, onAction, itemType } = props;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{ className: classes.root }}
    >
      <DialogTitle>
        <Typography variant="h6">
          Nonaktifkan {itemType} berikut?
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
          onClick={onAction}
          startIcon={<BlockIcon />}
          className={classes.deactivateButton}
        >
          Nonaktifkan
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default DeactivateDialog;
