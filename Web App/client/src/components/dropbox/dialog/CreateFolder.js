import React, { useState } from 'react';
import { Dropbox } from 'dropbox';
import { FaFolder } from 'react-icons/fa';
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Button, Dialog, Grid, TextField, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import CancelIcon from "@material-ui/icons/Cancel";
import classnames from "classnames";

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
    display: "flex",
    alignItems: "center",
    color: theme.palette.dropbox.main,
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

function CreateFolder(props){
  const classes = useStyles();
  const [folderName, updateFolderName] = useState('');
  const { errors, open, handleOpen, path, renderToUpdate, handleOpenLoadingAlert, setLoadingMessage, setSuccessMessage } = props;
  const { dropbox_token } = props.auth;

  const onChange = (e) => {
    updateFolderName(e.target.value)
  }

  const handleCloseDialog = () => {
    handleOpen(false)
    updateFolderName("")
  }

  const onSubmit = (e) => {
    e.preventDefault();
    setLoadingMessage("Folder baru sedang dibuat, mohon tetap menunggu")
    handleOpenLoadingAlert()
		//console.log(pathName);

		let dropbox = new Dropbox({ fetch: fetch, accessToken: dropbox_token });
		dropbox
			.filesCreateFolderV2({ path: path + `/${folderName}`, autorename: true })
			.then(function (response) {
        console.log(response.metadata)
        // renderToUpdate(response.metadata.path_display)
        setSuccessMessage("Folder baru berhasil dibuat")
        renderToUpdate("Folder Created")
			})
			.catch(function (error) {
				console.error(error);
			});
    handleCloseDialog()
  }

  return (
    <Dialog open={open} onClose={handleCloseDialog}>
      <Grid container direction="column" alignItems="center" className={classes.dialogBox}>
        <form onSubmit={onSubmit} style={{paddingTop: "20px"}}>
          <Typography variant="h6" className={classes.dialogTitle} gutterBottom>
            <FaFolder className={classes.folderIcon}/>Folder Baru
          </Typography>
          <TextField
            style={{margin: "20px 10px"}}
            fullWidth
            variant="outlined"
            placeholder="Nama Folder"
            id="name"
            onChange={onChange}
            value={folderName}
            error={errors.name}
            type="text"
            helperText={errors.name}
            className={classnames("", {
                invalid: errors.name
            })}
          />
          <Grid container justify="center" spacing={2}>
            <Grid item>
              <Button
                type="submit"
                startIcon={<FaFolder />}
                className={classes.dialogCreateButton}
              >
                Buat
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
  )
}

CreateFolder.propTypes = {
  errors: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
}

const mapStateToProps = (state) => ({
  errors: state.errors,
  auth: state.auth,
})

export default connect(
  mapStateToProps
)(CreateFolder);
