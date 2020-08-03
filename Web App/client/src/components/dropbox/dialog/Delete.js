import React, { useState } from 'react';
import { Dropbox } from 'dropbox';
import { FaFolder } from 'react-icons/fa';
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Alert, Button, Dialog, Grid, Hidden, IconButton, TextField, Typography, CircularProgress } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import CloseIcon from "@material-ui/icons/Close";
import CancelIcon from "@material-ui/icons/Cancel";
import classnames from "classnames";
import path from "path";
import DeleteOutlineIcon from "@material-ui/icons/DeleteOutline";

const useStyles = makeStyles((theme) => ({
  root: {
    margin: "auto",
    maxWidth: "1000px",
    padding: "10px",
  },
  moreIcon: {
    opacity: "50%",
    "&:focus, &:hover": {
      opacity: "100%",
      color: theme.palette.primary.main,
    },
  },
  actionIcon: {
    color: theme.palette.dropbox.main,
    display: "flex",
    alignItems:"center", 
    color:"#2196f3"
  },
  dialogBox: {
    maxWidth: "350px",
    padding: "15px",
  },
  dialogCreateButton: {
    width: "150px",
    backgroundColor: theme.palette.success.main,
    color: "white",
    "&:focus, &:hover": {
      backgroundColor: theme.palette.success.main,
      color: "white",
    },
  },
  dialogDeleteButton: {
    width: "150px",
    backgroundColor: theme.palette.error.dark,
    color: "white",
    "&:focus, &:hover": {
      backgroundColor: theme.palette.error.dark,
      color: "white",
    },
  },
  dialogCancelButton: {
    width: "150px",
    backgroundColor: theme.palette.primary.main,
    color: "white",
    "&:focus, &:hover": {
      backgroundColor: theme.palette.primary.main,
      color: "white",
    },
  },
  dialogTitle: {
    display: "flex",
    alignItems: "center"
  },
  folderIcon: {
    marginRight: "10px", 
    color: "#2196f3"
  }
}));

function Delete(props){

  const { doc, errors, open, handleOpen, renderToUpdate, handleOpenLoadingAlert, setLoadingMessage, setSuccessMessage } = props;
  const {dropbox_token} = props.auth;
  const classes = useStyles()

  const handleCloseDialog = () => {
    handleOpen(false)
  }

  const onSubmit = (e) => {
    e.preventDefault();
      if(doc[".tag"] === "folder"){
        setLoadingMessage("Folder sedang dihapus, mohon tetap menunggu")
      } else {
        setLoadingMessage("File sedang dihapus, mohon tetap menunggu")
      }

      handleOpenLoadingAlert()
			let dropbox = new Dropbox({ fetch: fetch, accessToken: dropbox_token });
      dropbox
        .filesDeleteV2({ path: doc.path_lower })
        .then(function (response) {
          if(response.metadata[".tag"] === "folder"){
            setSuccessMessage("Folder berhasil dihapus")
          } else {
            setSuccessMessage("File berhasil dihapus")
          }
          renderToUpdate("Deleted")
        })
        .catch(function(err) {
          console.log(err);
        });
      handleCloseDialog();
  }

  console.log(doc)
	return (
		<Dialog
        open={open}
        onClose={handleCloseDialog}>
        <Grid container direction="column" alignItems="center" className={classes.dialogBox}>
          <form onSubmit={onSubmit} style={{paddingTop: "20px"}}>
          <Grid item container justify="center" spacing={2}>
            <Grid item container justify="center">
            {!doc? null : doc[".tag"] === "folder" ? 
            <Typography variant="h6" className={classes.dialogTitle} gutterBottom>
              Hapus Folder Berikut?
            </Typography> : 
            <Typography variant="h6" className={classes.dialogTitle} gutterBottom>
              Hapus File Berikut?
            </Typography>
            }
            </Grid>
            <Grid item container justify="center">
              <Typography variant="h6" className={classes.dialogTitle} gutterBottom>
                <b>{doc ? doc.name.length < 25 ? doc.name : `${doc.name.slice(0,19)}..${path.extname(doc.name)}` : null}</b>
              </Typography>
            </Grid>
            <Grid item>
                <Button
                  type="submit"
                  startIcon={<DeleteOutlineIcon />}
                  className={classes.dialogDeleteButton}
                >
                  Hapus
                </Button>
            </Grid>
            <Grid item>
              <Button
                onClick={handleCloseDialog}
                startIcon={< CancelIcon/>}
                className={classes.dialogCancelButton}
              >
                Batal
              </Button>
            </Grid>
          </Grid>
          </form>
          </Grid>
      </Dialog>
	);
};

Delete.propTypes = {
  errors: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
}

const mapStateToProps = (state) => ({
  errors: state.errors,
  auth: state.auth,
})

export default connect(
  mapStateToProps
)(Delete);

