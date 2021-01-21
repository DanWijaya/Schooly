import React from "react";
import LightTooltip from "../../misc/light-tooltip/LightTooltip";
import defaultAvatar from "./DefaultAvatar.svg";
import {
  Avatar,
  Button,
  Dialog,
  Grid,
  IconButton,
  Typography,
  Snackbar
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import AddAPhotoIcon from "@material-ui/icons/AddAPhoto";
import CameraAltIcon from "@material-ui/icons/CameraAlt";
import CloseIcon from "@material-ui/icons/Close";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import { uploadFileAvatar, getFileAvatar  } from "../../../actions/files/FileAvatarActions"
import { connect } from "react-redux";
import MuiAlert from "@material-ui/lab/Alert";
const useStyles = makeStyles((theme) => ({
  avatar: {
    width: theme.spacing(25),
    height: theme.spacing(25),
  },
  avatarImg1: {
    // If width is smaller than height
    width: theme.spacing(25),
  },
  avatarImg2: {
    //If height is smaller than width
    height: theme.spacing(25),
  },
  profilePictureGrid: {
    maxWidth: "350px",
    padding: "10px",
  },
  addPhotoIconButton: {
    color: theme.palette.primary.main,
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
  uploadButton: {
    width: "160px",
    backgroundColor: theme.palette.primary.main,
    color: "white",
    "&:focus, &:hover": {
      backgroundColor: theme.palette.primary.main,
      color: "white",
    },
  },
  submitPhotoButton: {
    width: "160px",
    backgroundColor: theme.palette.success.main,
    color: "white",
    "&:focus, &:hover": {
      backgroundColor: theme.palette.success.main,
      color: "white",
    },
  },
}));

function ProfilePictureEditorDialog(props) {
  const classes = useStyles();

  // Function Hooks and Ref Declaration
  const uploadedImage = React.useRef(null);
  const imageUploader = React.useRef(null);
  const [profileImg, setProfileImg] = React.useState(null);
  const [openDialog, setOpenDialog] = React.useState(false);
  const [avatarDimensions, setAvatarDimensions] = React.useState({
    height: null,
    width: null,
  });

  // Dialog
  const handleOpenDialog = () => {
    setOpenDialog(true);
  };
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setProfileImg(null);
  };

  const { user, updateAvatar, uploadFileAvatar, avatar, setFileLimitSnackbar } = props;

  const handleImageUpload = (e) => {
    console.log(e.target.files)
    const [file] = e.target.files;
    if(file){
      if(file.size/Math.pow(10,6) > 5){
        console.log("file size is over 5MB")
        imageUploader.current.value = null
        setFileLimitSnackbar(true)
      }
      else{
        const reader = new FileReader();
        const { current } = uploadedImage;
        current.file = file;
        reader.onload = (e) => {
          current.src = e.target.result;
        };
        reader.readAsDataURL(file);
        setProfileImg(file);
      }
    }
  };

  const onSubmitForm = (e) => {
    e.preventDefault()
    let formData = new FormData()
    formData.append("avatar", profileImg)
    // let userId = user._id ? user._id : user._id
    let userId = user._id
    // updateAvatar(userData, userId, formData)
    uploadFileAvatar(userId, formData)
    props.handleOpenAlert()

    handleCloseDialog();
  };

  function onImgLoad({ target: img }) {
    setAvatarDimensions({ height: img.offsetHeight, width: img.offsetWidth });
  }

  const imageUploadPreview = () => {
    let avatarImgClass;

    if (avatarDimensions.width < avatarDimensions.height) {
      avatarImgClass = classes.avatarImg1;
    } else {
      avatarImgClass = classes.avatarImg2;
    }

    if (!profileImg) {
      if (avatar) {
        return (
          <Avatar className={classes.avatar}>
            <img
              alt="profile"
              onLoad={onImgLoad}
              src={avatar}
              // src={`/api/upload/avatar/${user.avatar}`}
              ref={uploadedImage}
              className={avatarImgClass}
            />
          </Avatar>
        );
      } else {
        return (
          <Avatar className={classes.avatar}>
            <img
              alt="profile"
              onLoad={onImgLoad}
              src={defaultAvatar}
              ref={uploadedImage}
              className={avatarImgClass}
            />
          </Avatar>
        );
      }
    } else {
      return (
        <Avatar className={classes.avatar}>
          <img
            alt="current profile"
            onLoad={onImgLoad}
            ref={uploadedImage}
            className={avatarImgClass}
          />
        </Avatar>
      );
    }
  };

  return (
    <div>
      <LightTooltip title="Ganti Foto Profil">
        <IconButton
          disableRipple
          onClick={handleOpenDialog}
          className={classes.addPhotoIconButton}
        >
          <CameraAltIcon
            style={{
              height: "35px",
              width: "35px",
            }}
          />
        </IconButton>
      </LightTooltip>
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <Grid
          container
          direction="column"
          alignItems="center"
          className={classes.profilePictureGrid}
        >
          <Grid
            item
            container
            justify="flex-end"
            alignItems="flex-start"
            style={{ marginBottom: "10px" }}
          >
            <IconButton size="small" onClick={handleCloseDialog}>
              <CloseIcon />
            </IconButton>
          </Grid>
          <Grid item style={{ marginBottom: "20px" }}>
            <Typography variant="h5" align="center">
              <b>Perbarui Foto Profil</b>
            </Typography>
          </Grid>
          <Grid item style={{ marginBottom: "40px" }}>
            <form onSubmit={onSubmitForm}>
              <input
                accept="image/*"
                type="file"
                name="avatar"
                onChange={handleImageUpload}
                ref={imageUploader}
                style={{
                  display: "none",
                }}
              />
              <Grid
                container
                direction="column"
                spacing={2}
                alignItems="center"
              >
                <Grid item style={{ marginBottom: "20px" }}>
                  {imageUploadPreview()}
                </Grid>
                <Grid item>
                  <Button
                    variant="contained"
                    startIcon={<AddAPhotoIcon />}
                    onClick={() => {
                      imageUploader.current.click();
                    }}
                    className={classes.uploadButton}
                  >
                    Unggah Foto
                  </Button>
                </Grid>
                <Grid item>
                  <Button
                    variant="contained"
                    type="submit"
                    startIcon={<CloudUploadIcon />}
                    disabled={!profileImg}
                    className={classes.submitPhotoButton}
                  >
                    Simpan
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Grid>
          <Grid item>
            <Typography
              variant="subtitle2"
              align="center"
              color="textSecondary"
            >
              Foto profil Anda dapat dilihat oleh semua orang yang menggunakan
              layanan Schooly.
            </Typography>
          </Grid>
        </Grid>
      </Dialog> 
    </div>
  );
}

const mapStateToProps = (state) => ({
  auth: state.auth,
  classesCollection: state.classesCollection,
});

export default connect( 
  mapStateToProps, { uploadFileAvatar, getFileAvatar }
)( ProfilePictureEditorDialog)
