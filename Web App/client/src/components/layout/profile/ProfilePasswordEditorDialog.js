import React from "react";
import { Button, Dialog, Grid, IconButton, List, ListItem, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import CloseIcon from "@material-ui/icons/Close";
import LockIcon from "@material-ui/icons/Lock";

const useStyles = makeStyles((theme) => ({
  dialogRoot: {
    padding: "15px",
  },
  changePasswordCaution: {
    color: "#A9A9A9",
    display: "flex",
    textAlign: "center",
  },
  iconButtonClose: {
    backgroundColor: "transparent",
    "&:focus": {
      backgroundColor: "transparent",
    },
  },
}));

function EditPasswordField(props) {
  return(
    <ListItem>
        <Grid container alignItems="center">
          <Grid item xs={6}>
            <Typography variant="subtitle2">
              {props.edit_password_requirement}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <input
              style={{
                 width: "100%",
                 padding: "10px 10px",
                 margin: "8px 0",
                 display: "inline-block",
                 border: "1px solid #ccc",
                 borderRadius: "4px",
                 boxSizing: "border-box",
                 "&:focus": {
                   backgroundColor: "#2196f3",
                 },
              }}
            />
          </Grid>
        </Grid>
    </ListItem>
  )
}

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
        <Grid container direction="column" alignItems="center" className={classes.dialogRoot}>
          <Grid item container justify="flex-end" alignItems="flex-start">
            <IconButton
              size="small"
              disableRipple
              onClick={handleClose}
              className={classes.iconButtonClose}
            >
                <CloseIcon />
            </IconButton>
          </Grid>
          <Grid item style={{marginBottom: "30px"}}>
            <Typography variant="h6" gutterBottom>
              <b>Ganti Kata Sandi</b>
            </Typography>
            <Typography variant="subtitle2" className={classes.changePasswordCaution}>
               Kata sandi adalah informasi pribadi yang tidak boleh diketahui oleh orang lain.
            </Typography>
          </Grid>
          <form>
            <List>
              <EditPasswordField
                edit_password_requirement="Masukkan Kata Sandi Lama"
              />
              <EditPasswordField
                edit_password_requirement="Masukkan Kata Sandi Baru"
              />
              <EditPasswordField
                edit_password_requirement="Konfirmasi Kata Sandi Baru"
              />
            </List>
            <Grid container justify="flex-end" alignItems="center" style={{marginTop: "15px"}}>
              <Button
                type="submit"
                style={{backgroundColor: "#2196f3", color: "white"}}
                onClick={handleClose}
              >
                Simpan
              </Button>
            </Grid>
          </form>
        </Grid>
      </Dialog>
    </div>
  )
}

export default ProfilePasswordEditorDialog;
