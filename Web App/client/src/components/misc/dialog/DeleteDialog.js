import React from "react";
import { Link } from "react-router-dom";
import { Button, Dialog, Grid, Typography } from "@material-ui/core/";
import { makeStyles } from "@material-ui/core/styles";
import CancelIcon from "@material-ui/icons/Cancel";
import DeleteOutlineIcon from "@material-ui/icons/DeleteOutline";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "300px",
    maxWidth: "100%",
    minHeight: "175px",
    padding: "15px",
  },
  dialogDeleteButton: {
    width: "125px",
    backgroundColor: theme.palette.error.main,
    color: "white",
    border: `1px solid ${theme.palette.error.main}`,
    "&:focus, &:hover": {
      backgroundColor: theme.palette.error.dark,
      color: "white",
      border: `1px solid ${theme.palette.error.dark}`,
    },
  },
  dialogCancelButton: {
    width: "125px",
    backgroundColor: "white",
    color: theme.palette.error.main,
    border: `1px solid ${theme.palette.error.main}`,
    "&:focus, &:hover": {
      backgroundColor: "white",
      color: theme.palette.error.dark,
      border: `1px solid ${theme.palette.error.dark}`,
    },
  },
}));

function DeleteDialog(props) {
  const classes = useStyles();

  const { openDeleteDialog, handleCloseDeleteDialog, itemType, itemName, deleteItem, isLink, redirectLink } = props;

  return (
    <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
      <Grid container direction="column" justify="space-between" alignItems="center" className={classes.root}>
        <Grid item>
          <Typography variant="h5" align="center" gutterBottom>
            Hapus {itemType} berikut?
          </Typography>
        </Grid>
        <Grid item>
          <Typography align="center" gutterBottom>
            <b>{itemName}</b>
          </Typography>
        </Grid>
        <Grid container spacing={2} justify="center" alignItems="center">
          <Grid item>
            <Button
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
