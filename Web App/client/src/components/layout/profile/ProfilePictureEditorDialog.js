import React from "react";
import LightTooltip from "../../misc/light-tooltip/LightTooltip"
import { Avatar, Button, Dialog, DialogActions, DialogTitle, DialogContent, DialogContentText,
   Grid, IconButton, Snackbar, Typography } from "@material-ui/core";
import MuiAlert from "@material-ui/lab/Alert";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import AddAPhotoIcon from '@material-ui/icons/AddAPhoto';
import CameraAltIcon from "@material-ui/icons/CameraAlt";
import CloseIcon from '@material-ui/icons/Close';
import CloudUploadIcon from "@material-ui/icons/CloudUpload";

const useStyles = makeStyles((theme) => ({
  root: {
    padding: "10px",
  },
  avatar: {
    width: theme.spacing(25),
    height: theme.spacing(25),
    margin: "auto"
  },
  addPhotoIconButton: {
    color: "#2196f3",
    backgroundColor: "#DCDCDC",
    "&:focus": {
      backgroundColor: "#DCDCDC",
    },
    "&:hover": {
      backgroundColor: "#C0C0C0",
    },
  },
  closeIconButton: {
    backgroundColor: "transparent",
    "&:focus": {
      backgroundColor: "transparent",
    },
  },
  uploadPhotoIconButton: {
    color: "#2196f3",
    "&:focus": {
      backgroundColor: "transparent",
    },
    "&:hover": {
      backgroundColor: "transparent",
    },
  },
}));

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

function ProfilePictureEditorDialog(props) {
  const classes = useStyles();

  //Snackbar
  const [openAlert, setOpenAlert] = React.useState(false);
  const handleOpenAlert = () => {
    setOpenAlert(true);
  }
  const handleCloseAlert = (e, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenAlert(false);
  }

  //Dialog
  const [openDialog, setOpenDialog] = React.useState(false);
  const handleOpenDialog = () => {
    setOpenDialog(true);
  };
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  //Image Upload
  var uploadedImage = React.useRef(null);
  const imageUploader = React.useRef(null);
  const [profileImg, setProfileImg] = React.useState(null);

  const {user} = props;
  const {updateUser} = props;

  const handleImageUpload = e => {
    const [file] = e.target.files;
    setProfileImg(e.target.files[0])
    if (file) {
      const reader = new FileReader();
      const { current } = uploadedImage;
      current.file = file;
      reader.onload = e => {
        current.src = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  };

  const clear = () => {
     setProfileImg(false)
  }

  const onSubmitForm = (e) => {
    e.preventDefault()
    console.log("AAA")
    let formData = new FormData()
    console.log(profileImg)

    formData.append("avatar", profileImg)

    let userData = user
    let userId = user.id;

    updateUser(userData, userId, formData)
    setProfileImg(null)
    handleOpenAlert()
  }

  return (
    <div>
      <Snackbar
        open={openAlert}
        autoHideDuration={4000}
        onClose={handleCloseAlert}
        anchorOrigin={{vertical : "top", horizontal: "center"}}
      >
        <Alert onClose={handleCloseAlert} severity="success">
          Foto profil berhasil diganti!
        </Alert>
      </Snackbar>
      <LightTooltip title="Ganti Foto Profil">
        <IconButton
          disableRipple
          onClick={handleOpenDialog}
          className={classes.addPhotoIconButton}
        >
          <CameraAltIcon
            style={{
              color: "#2196f3",
              height: "35px",
              width: "35px",
            }}
          />
        </IconButton>
      </LightTooltip>
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        className={classes.root}
      >
        <DialogTitle>
          <Grid
            container
            justify="flex-end"
            alignItems="flex-start"
            style={{width:"300px", marginBottom: "10px"}}
          >
            <IconButton
              edge="end"
              size="small"
              disableRipple
              onClick={handleCloseDialog}
              className={classes.closeIconButton}
            >
              <CloseIcon />
            </IconButton>
          </Grid>
          <Grid container justify="center">
            <Typography variant="h5">
              <b>Perbarui Foto Profil</b>
            </Typography>
          </Grid>
        </DialogTitle>
        <DialogContent>
          <Grid style={{padding: "20px"}}>
            <form onSubmit={onSubmitForm}>
              <input
                accept="image/*"
                type="file"
                name="avatar"
                onChange={handleImageUpload}
                ref={imageUploader}
                style={{
                  display: "none"
                }}
              />
              <Grid
                container
                direction="column"
                justify="center"
                alignItems="center"
                spacing={2}
              >
                <Grid item style={{marginBottom: "30px"}}>
                  {!profileImg ?
                    <Avatar className={classes.avatar}>
                      <img src={`/api/uploads/image/${user.avatar}`}
                        ref={uploadedImage}
                        className={classes.avatar}
                      />
                    </Avatar>
                    :
                    <Avatar className={classes.avatar}>
                      <img ref={uploadedImage} className={classes.avatar} />
                    </Avatar>
                  }
                </Grid>
                <Grid item>
                  <Button
                    startIcon={<AddAPhotoIcon />}
                    onClick={() => {imageUploader.current.click()}}
                    style={{
                      backgroundColor: "#2196f3",
                      color: "white",
                      width: "150px",
                    }}
                  >
                    Unggah Foto
                  </Button>
                </Grid>
                <Grid item>
                  <Button
                    type="submit"
                    startIcon={<CloudUploadIcon />}
                    onClick={handleCloseDialog}
                    style={{
                      backgroundColor: "#61bd4f",
                      color: "white",
                      width: "150px",
                    }}
                  >
                    Simpan
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Grid>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default ProfilePictureEditorDialog;
