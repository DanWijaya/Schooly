import React from "react";
import LightTooltip from "../../misc/light-tooltip/LightTooltip"
import { Avatar, Button, Dialog, DialogTitle, DialogContent, DialogContentText,
   Grid, IconButton, Snackbar } from "@material-ui/core";
import MuiAlert from "@material-ui/lab/Alert";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import CameraAltIcon from "@material-ui/icons/CameraAlt";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";

const useStyles = makeStyles((theme) => ({
  avatar: {
    width: theme.spacing(20),
    height: theme.spacing(20),
    margin: "auto"
  },
  addPhotoIconButton: {
    color: "#2196f3",
    backgroundColor: "#DCDCDC",
    "&:focus": {
      backgroundColor: "#DCDCDC"
    },
    "&:hover": {
      backgroundColor: "#DCDCDC"
    },
  },
  uploadPhotoIconButton: {
    color: "#2196f3",
    "&:focus": {
      backgroundColor: "transparent"
    },
    "&:hover": {
      backgroundColor: "transparent"
    },
  },
}));


function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

function ProfilePictureEditorDialog(props) {
  const classes = useStyles();

  const [openDialog, setOpenDialog] = React.useState(false);
  const [openAlert, setOpenAlert] = React.useState(false);

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleOpenAlert = () => {
    setOpenAlert(true);
  }

  const handleCloseAlert = (e, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenAlert(false);
  }

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
        <IconButton disableRipple onClick={handleOpenDialog} className={classes.addPhotoIconButton}>
          <CameraAltIcon
            style={{
              color: "#2196f3",
              height: "35px",
              width: "35px",
            }}
          />
        </IconButton>
      </LightTooltip>
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>
          Unggah Foto Profil
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            "Mungkin mau nambahin sesuatu disini"
          </DialogContentText>
        </DialogContent>
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
            {!profileImg ?
              <Avatar className={classes.avatar}>
                <img src={`/api/uploads/image/${user.avatar}`}
                ref={uploadedImage}
                className={classes.avatar}/>
              </Avatar>
              :
              <Avatar className={classes.avatar}>
                <img ref={uploadedImage}
                className={classes.avatar}/>
              </Avatar>
            }
            <Grid container direction="column" justify="center" alignItems="center">
              <Grid item>
                <LightTooltip title="Pilih Foto Profil">
                  <IconButton className={classes.uploadPhotoIconButton}>
                    <CloudUploadIcon
                      onClick={() => {imageUploader.current.click()}}
                      style={{
                        color: "#2196f3",
                        height: "35px",
                        width: "35px",
                      }}
                    />
                  </IconButton>
                </LightTooltip>
              </Grid>
              <Button
                type="submit"
                style={{
                  backgroundColor: "#2196f3",
                  color: "white",
                  width: "100px",
                }}
              >
                Simpan
              </Button>
              <Button
                type="button"
                onClick={clear}
                style={{
                  backgroundColor: "black",
                  color: "white",
                  width: "100px",
                }}
              >
                Buang
              </Button>
            </Grid>
          </form>
      </Dialog>
    </div>
  )
}

export default ProfilePictureEditorDialog;
