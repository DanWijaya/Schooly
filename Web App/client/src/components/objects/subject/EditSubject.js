import React from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
  Typography,
} from "@material-ui/core";
import { Close as CloseIcon } from "@material-ui/icons";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: "350px",
    width: "100%",
  },
  editButton: {
    width: "90px",
    backgroundColor: theme.palette.primary.main,
    color: "white",
    "&:focus, &:hover": {
      backgroundColor: theme.palette.primary.main,
      color: "white",
      boxShadow:
        "0px 1px 2px 0px rgba(194,100,1,0.3), 0px 2px 6px 2px rgba(194,100,1,0.15)",
    },
  },
}));


function EditSubject(props) {
  const classes = useStyles();
  const { open, onChange, edit, close, value, error, helperText } = props;

  return (
    <Dialog
      open={open}
      PaperProps={{ className: classes.root }}
    >
      <DialogActions>
        <IconButton size="small" onClick={close}>
          <CloseIcon />
        </IconButton>
      </DialogActions>
      <DialogTitle>
        <Typography variant="h6" align="center" gutterBottom>
          Sunting Mata Pelajaran
        </Typography>
      </DialogTitle>
      <DialogContent>
        <TextField
          fullWidth
          variant="outlined"
          size="small"
          id="name"
          type="text"
          onChange={onChange}
          value={value}
          error={error}
          helperText={helperText}
        />
      </DialogContent>
      <DialogActions style={{ padding: "16px 24px "}}>
        <Button
          onClick={edit}
          className={classes.editButton}
        >
          Sunting
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default EditSubject;
