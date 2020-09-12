import React from "react";
import { Link } from "react-router-dom";
import { Button, Dialog, Grid, IconButton, Typography } from "@material-ui/core/";
import { makeStyles } from "@material-ui/core/styles";
import CancelIcon from "@material-ui/icons/Cancel";
import DeleteOutlineIcon from "@material-ui/icons/DeleteOutline";

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: "350px",
    minHeight: "175px",
    padding: "15px",
  },
  dialogDeleteButton: {
    width: "150px",
    backgroundColor: "white",
    color: theme.palette.error.main,
    "&:focus, &:hover": {
      backgroundColor: "white",
      color: theme.palette.error.dark,
    },
  },
  dialogCancelButton: {
    width: "150px",
    backgroundColor: theme.palette.error.main,
    color: "white",
    "&:focus, &:hover": {
      backgroundColor: theme.palette.error.dark,
      color: "white",
    },
  },
}));

function DeleteDialog(props) {
  const classes = useStyles();

  const { openDeleteDialog, handleCloseDeleteDialog, itemType, itemName, deleteItem, isLink, redirectLink } = props;

  return (
    <Dialog open={openDeleteDialog}>
      <Grid container direction="column" justify="space-between" alignItems="center" className={classes.root}>
        <Grid item>
          <Typography variant="h5" align="center" gutterBottom>
            Hapus {itemType} berikut?
          </Typography>
        </Grid>
        <Grid item>
          <Typography variant="h6" align="center" gutterBottom>
            <b>{itemName}</b>
          </Typography>
        </Grid>
        <Grid container spacing={2} justify="center" alignItems="center">
          <Grid item>
            <Button
              variant="outlined"
              onClick={deleteItem}
              startIcon={<DeleteOutlineIcon />}
              className={classes.dialogDeleteButton}
            >
              Hapus
            </Button>
          </Grid>
          <Grid item>
            {!isLink ?
              <Button
                onClick={handleCloseDeleteDialog}
                startIcon={<CancelIcon />}
                className={classes.dialogCancelButton}
              >
                Batal
              </Button>
            :
              <Link to={redirectLink}>
                <Button
                  startIcon={<CancelIcon />}
                  className={classes.dialogCancelButton}
                >
                  Batal
                </Button>
              </Link>
            }
          </Grid>
        </Grid>
      </Grid>
    </Dialog>
  )
}

export default DeleteDialog;
