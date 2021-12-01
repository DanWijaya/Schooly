import React from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: "300px",
    width: "100%",
  },
  editButton: {
    width: "125px",
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

  return (
    <Dialog
      open={openFormDialog}
      PaperProps={{ className: classes.root }}
    >
      <DialogActions>
        <IconButton size="small" onClick={handleCloseFormDialog}>
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
          id="name"
          type="text"
          onChange={onChange}
          value={subject.name}
          error={errors.name}
          helperText={errors.name}
        />
        <Button
          onClick={onSubmit}
          className={classes.editButton}
        >
          Sunting
        </Button>
      </DialogContent>
    </Dialog>
  );
}

export default EditSubject;
