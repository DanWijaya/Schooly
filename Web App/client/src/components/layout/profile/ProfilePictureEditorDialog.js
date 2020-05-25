import React from "react";
import LightTooltip from "../../misc/light-tooltip/LightTooltip"
import { Avatar, Button, Dialog, Grid, IconButton, Typography } from "@material-ui/core";
import MuiAlert from "@material-ui/lab/Alert";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import AddAPhotoIcon from "@material-ui/icons/AddAPhoto";
import CameraAltIcon from "@material-ui/icons/CameraAlt";
import CloseIcon from "@material-ui/icons/Close";
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
  avatarImg: {
    width: theme.spacing(25),
    margin: "auto"
  },
  dialogRoot: {
    width: "350px",
    padding: "10px",
  },
  uploadCaution: {
    color: "#A9A9A9",
    display: "flex",
    textAlign: "center",
  },
  iconButtonAddPhoto: {
    color: "#2196f3",
    backgroundColor: "#DCDCDC",
    boxShadow: "0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)",
    transition: "all 0.3s cubic-bezier(.25,.8,.25,1)",
    "&:focus": {
      backgroundColor: "#DCDCDC",
    },
    "&:hover": {
      backgroundColor: "#DCDCDC",
      boxShadow: "0 14px 28px rgba(0,0,0,0.15), 0 10px 10px rgba(0,0,0,0.15)",
    },
  },
  iconButtonClose: {
    backgroundColor: "transparent",
    "&:focus": {
      backgroundColor: "transparent",
    },
  },
  iconButtonUploadPhoto: {
    color: "#2196f3",
    "&:focus": {
      backgroundColor: "transparent",
    },
    "&:hover": {
      backgroundColor: "transparent",
    },
  },
}));

function ProfilePictureEditorDialog(props) {
  const classes = useStyles();
  const theme = useTheme();

  //Dialog
  const [openDialog, setOpenDialog] = React.useState(false);
  const handleOpenDialog = () => {
    setOpenDialog(true);
  };
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setProfileImg(null)
  };

  //Image Upload
  var uploadedImage = React.useRef(null);
  const imageUploader = React.useRef(null);

  const [profileImg, setProfileImg] = React.useState(null);

  const {user} = props;
  const {updateAvatar} = props;

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

    updateAvatar(userData, userId, formData)
    props.handleOpenAlert() 

    handleCloseDialog()
  }


  return (
    <div className={classes.root}>
      <LightTooltip title="Ganti Foto Profil">
        <IconButton
          disableRipple
          onClick={handleOpenDialog}
          className={classes.iconButtonAddPhoto}
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
        <Grid container justify="center" className={classes.dialogRoot}>
          <Grid item
            container
            justify="flex-end"
            alignItems="flex-start"
            style={{marginBottom: "10px"}}
          >
            <IconButton
              size="small"
              disableRipple
              onClick={handleCloseDialog}
              className={classes.iconButtonClose}
            >
              <CloseIcon />
            </IconButton>
          </Grid>
          <Grid item container justify="center" style={{marginBottom: "20px"}}>
            <Typography variant="h5" gutterBottom>
              <b>Perbarui Foto Profil</b>
            </Typography>
          </Grid>
          <Grid item style={{marginBottom: "40px"}}>
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
                <Grid item style={{marginBottom: "20px"}}>
                  {!profileImg ?
                    <Avatar className={classes.avatar}>
                      <img
                        src={`/api/uploads/image/${user.avatar}`}
                        ref={uploadedImage}
                        className={classes.avatarImg}
                      />
                    </Avatar>
                    :
                    <Avatar className={classes.avatar}>
                      <img
                        ref={uploadedImage}
                        className={classes.avatarImg}
                      />
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
                  {profileImg == null ? 
                  <Button
                  disabled
                    type="submit"
                    startIcon={<CloudUploadIcon />}
                    style={{
                      backgroundColor: "#61bd4f",
                      color: "white",
                      width: "150px",
                      opacity: "50%"
                    }}
                  >
                    Simpan
                  </Button> : 
                  <Button
                    type="submit"
                    startIcon={<CloudUploadIcon />}
                    style={{
                      backgroundColor: "#61bd4f",
                      color: "white",
                      width: "150px",
                    }}
                  >
                    Simpan
                  </Button>
                  }

                </Grid>
              </Grid>
            </form>
          </Grid>
          <Typography variant="subtitle2" className={classes.uploadCaution}>
            Foto profil Anda dapat dilihat oleh semua orang yang menggunakan layanan Schooly.
          </Typography>
        </Grid>
      </Dialog>
    </div>
  )
}

export default ProfilePictureEditorDialog;
