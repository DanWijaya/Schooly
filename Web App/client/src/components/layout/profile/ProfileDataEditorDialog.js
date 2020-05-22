import React from "react";
import { Button, Dialog, DialogContent, DialogTitle } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles"
import EditIcon from '@material-ui/icons/Edit';

const useStyles = makeStyles((theme) => ({
  test: {
    backgroundColor: "white",
  }
}));

function ProfileDataEditorDialog() {
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
        startIcon={<EditIcon />}
        style={{
          backgroundColor: "#DCDCDC",
          color: "black",
        }}
      >
        Sunting Profil
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>
          adasdasdas
        </DialogTitle>
        <DialogContent>
         <form>
         <input     style={{
               width: "100%",
               padding: "12px 20px",
               margin: "8px 0",
               display: "inline-block",
               border: "1px solid #ccc",
               borderRadius: "4px",
               boxSizing: "border-box",
             }}
/>

         </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default ProfileDataEditorDialog;
