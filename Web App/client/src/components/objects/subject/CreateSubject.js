import React from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: "350px",
    width: "100%",
  },
  createButton: {
    width: "90px",
    backgroundColor: theme.palette.success.main,
    color: "white",
    "&:focus, &:hover": {
      backgroundColor: theme.palette.success.main,
      color: "white",
      boxShadow:
        "0px 1px 2px 0px rgba(194,100,1,0.3), 0px 2px 6px 2px rgba(194,100,1,0.15)",
    },
    [theme.breakpoints.down("sm")]: {
      width: "75px",
    },
  },
  deleteButton: {
    width: "90px",
    backgroundColor: theme.palette.error.main,
    color: "white",
    "&:focus, &:hover": {
      backgroundColor: theme.palette.error.main,
      color: "white",
      boxShadow:
        "0px 1px 2px 0px rgba(194,100,1,0.3), 0px 2px 6px 2px rgba(194,100,1,0.15)",
    },
    [theme.breakpoints.down("sm")]: {
      width: "75px",
    },
  },
}));


function CreateSubject(props) {
  const classes = useStyles();
  const { open, onChange, create, cancel, value, error, helperText } = props;

  return (
    <Dialog
      open={open}
      PaperProps={{ className: classes.root }}
    >
      <DialogTitle>
        <Typography variant="h6" align="center" gutterBottom>
          Buat Mata Pelajaran
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
          onClick={create}
          className={classes.createButton}
        >
          Buat
        </Button>
        <Button
          onClick={cancel}
          className={classes.deleteButton}
        >
          Hapus
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default CreateSubject;
