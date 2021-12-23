import React from "react";
import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: "300px",
    width: "100%",
  },
  createButton: {
    width: "125px",
    backgroundColor: theme.palette.success.main,
    color: "white",
    "&:focus, &:hover": {
      backgroundColor: theme.palette.success.main,
      color: "white",
      boxShadow:
        "0px 1px 2px 0px rgba(194,100,1,0.3), 0px 2px 6px 2px rgba(194,100,1,0.15)",
    },
  },
  deleteButton: {
    width: "125px",
    backgroundColor: theme.palette.error.main,
    color: "white",
    "&:focus, &:hover": {
      backgroundColor: theme.palette.error.main,
      color: "white",
      boxShadow:
        "0px 1px 2px 0px rgba(194,100,1,0.3), 0px 2px 6px 2px rgba(194,100,1,0.15)",
    },
  },
}));


function CreateSubject(props) {
  const classes = useStyles();

  return (
    <Dialog
      open={openFormDialog}
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
          value={subject.name}
          error={errors.name}
          helperText={errors.name}
        />
        <Grid item container justify="center" spacing={2}>
          <Grid item>
            <Button
              onClick={onSubmit}
              className={classes.createButton}
            >
              Buat
            </Button>
          </Grid>
          <Grid item>
            <Button
              onClick={handleCloseFormDialog}
              className={classes.deleteButton}
            >
              Hapus
            </Button>
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
}

export default CreateSubject;
