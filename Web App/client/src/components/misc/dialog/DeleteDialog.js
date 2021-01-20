import React from "react";
import { Link } from "react-router-dom";
import { Button, Dialog, Grid, Typography } from "@material-ui/core/";
import { makeStyles } from "@material-ui/core/styles";
import CancelIcon from "@material-ui/icons/Cancel";
import DeleteOutlineIcon from "@material-ui/icons/DeleteOutline";
import ErrorOutlineIcon from "@material-ui/icons/ErrorOutline";

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
  warningText: {
    color: theme.palette.error.main,
    marginLeft: "3px",
  },
  warningIcon: {
    color: theme.palette.error.main,
  },
  warning: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    marginBottom: "5px",
  },
}));

function DeleteDialog(props) {

  // const {
  //   openDeleteDialog,
  //   handleCloseDeleteDialog,
  //   itemType,
  //   itemName,
  //   deleteItem,
  //   isLink,
  //   redirectLink,
  //   isWarning,
  // } = props;
  const classes = useStyles();
  const { openDeleteDialog, handleCloseDeleteDialog, itemType, itemName, deleteItem, 
    redirectLink, customMessage, customConfirm, customDecline, isWarning } = props;

  return (
    <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
      <Grid
        container
        direction="column"
        justify="space-between"
        alignItems="center"
        className={classes.root}
      >
        <Grid item>
          {/* <Typography variant="h5" align="center">
            Hapus {itemType} berikut? */}
          <Typography variant="h5" align="center" gutterBottom>
            {customMessage ? `${customMessage} ${itemType}` : `Hapus ${itemType} berikut`}
          </Typography>
        </Grid>
        {itemName ? (
          <Grid item>
            <Typography
              align="center"
              gutterBottom
              style={{ marginTop: "10px" }}
            >
              <b>{itemName}</b>
            </Typography>
            {isWarning ? (
              <div className={classes.warning}>
                <ErrorOutlineIcon
                  className={classes.warningIcon}
                  fontSize="small"
                />
                <Typography
                  variant="caption"
                  align="center"
                  className={classes.warningText}
                >
                  Nilai Murid pada {itemType} ini juga akan dihapus
                </Typography>
              </div>
            ) : null}
          </Grid>
        ) : null}
        <Grid container spacing={2} justify="center" alignItems="center">
          <Grid item>
          {!redirectLink ?
            <Button
              onClick={deleteItem}
              startIcon={<DeleteOutlineIcon />}
              className={classes.dialogDeleteButton}
            >
              Hapus
            </Button>
          : 
          <Link to={redirectLink}>
              <Button
              onClick={deleteItem}
              startIcon={<DeleteOutlineIcon />}
              className={classes.dialogDeleteButton}
            >
              Hapus
            </Button>
          </Link>
          }
          </Grid>
          <Grid item>
            {/* {!isLink ? ( */}
            {/* {!redirectLink ? */}
              <Button
                onClick={handleCloseDeleteDialog}
                startIcon={<CancelIcon />}
                className={classes.dialogCancelButton}
              >
                {customDecline ? customDecline : "Batal"}
              </Button>
            {/* ) : ( */}
            {/* :
              <Link to={redirectLink}>
                <Button
                  startIcon={<CancelIcon />}
                  className={classes.dialogCancelButton}
                >
                  {customDecline ? customDecline : "Batal"}
                </Button>
              </Link>
            )}
            } */}
          </Grid>
        </Grid>
      </Grid>
    </Dialog>
  );
}

export default DeleteDialog;
