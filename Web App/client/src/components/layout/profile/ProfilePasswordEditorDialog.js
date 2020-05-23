import React from "react";
import { Button, Dialog, DialogContent, DialogTitle } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import LockIcon from '@material-ui/icons/Lock';

const useStyles = makeStyles((theme) => ({
  test: {
    backgroundColor: "white",
  }
}));

function ProfilePasswordEditorDialog() {
  const classes = useStyles();

  const [open, setOpen] = React.useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Button
        variant="contained"
        onClick={handleClickOpen}
        startIcon={<LockIcon />}
        style={{
          backgroundColor: "#DCDCDC",
          color: "black",
          width: "200px",
        }}
      >
        Ganti Kata Sandi
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>
          adasdasdas
        </DialogTitle>
        <DialogContent>
         <form>
         </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default ProfilePasswordEditorDialog;
