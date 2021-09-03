import React from "react";
import { connect } from "react-redux";
import { uploadFileAvatar, getFileAvatar } from "../../../actions/files/FileAvatarActions";
import defaultAvatar from "./DefaultAvatar.svg";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import Fab from "@material-ui/core/Fab";
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import AddAPhotoIcon from "@material-ui/icons/AddAPhoto";
import CameraAltIcon from "@material-ui/icons/CameraAlt";
import CloseIcon from "@material-ui/icons/Close";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import PersonIcon from "@material-ui/icons/Person";

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: "350px",
    padding: "20px",
  },
  editProfilePictureButton: {
    backgroundColor: "#F1F1F1",
    color: theme.palette.primary.main,
    "&:focus, &:hover": {
      backgroundColor: "#EDEDED",
      color: theme.palette.primary.main,
    },
  },
  avatar: {
    width: "200px",
    height: "200px",
  },
  avatarSizeWidth: {
    width: "200px",
  },
  avatarSizeHeight: {
    height: "200px",
  },
  uploadButton: {
    width: "160px",
    backgroundColor: "white",
    color: theme.palette.primary.main,
    "&:focus, &:hover": {
      backgroundColor: "white",
      color: theme.palette.primary.main,
    },
  },
  submitPhotoButton: {
    width: "160px",
    backgroundColor: theme.palette.primary.main,
    color: "white",
    "&:focus, &:hover": {
      backgroundColor: theme.palette.primary.main,
      color: "white",
    },
  },
}));

function EditProfilePicture(props) {
  const classes = useStyles();
  const uploadedImage = React.useRef(null);
  const imageUploader = React.useRef(null);
  const [profileImg, setProfileImg] = React.useState(null);
  const [openDialog, setOpenDialog] = React.useState(false);
  const [avatarDimensions, setAvatarDimensions] = React.useState({
    height: null,
    width: null,
  });

  const {
    user,
    updateAvatar,
    uploadFileAvatar,
    avatar,
    setFileLimitSnackbar,
  } = props;

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setProfileImg(null);
  };

  const handleImageUpload = (e) => {
    const [file] = e.target.files;
    if (file) {
      if (file.size / Math.pow(10, 6) > 5) {
        imageUploader.current.value = null;
        setFileLimitSnackbar(true);
      } else {
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
    e.preventDefault();
    let formData = new FormData();
    formData.append("avatar", profileImg);

    let userId = user._id;
    uploadFileAvatar(userId, formData).then((res) => {
      props.handleOpenAlert();
      handleCloseDialog();
    });
    // Fitur_4 punya:
    // updateAvatar(userData, userId, formData);
  };

  function onImgLoad({ target: img }) {
    setAvatarDimensions({ height: img.offsetHeight, width: img.offsetWidth });
  }

  const imageUploadPreview = () => {
    let avatarImgClass;

    if (avatarDimensions.width < avatarDimensions.height) {
      avatarImgClass = classes.avatarSizeWidth;
    } else {
      avatarImgClass = classes.avatarSizeHeight;
    }

    if (!profileImg) {
      if (avatar) {
        return (
          <Avatar className={classes.avatar}>
            <img
              alt="Profile"
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
              alt="Profile"
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
            alt="Current Profile"
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
      <Fab onClick={handleOpenDialog} className={classes.editProfilePictureButton}>
        <CameraAltIcon fontSize="large" />
      </Fab>
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <Grid container direction="column" alignItems="center" className={classes.root}>
          <Grid item container justify="flex-end" alignItems="flex-start" style={{ marginBottom: "10px" }}>
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
              <Grid container direction="column" alignItems="center" spacing={2}>
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
                    Pilih Foto
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
                    Unggah
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

export default connect(mapStateToProps, { uploadFileAvatar, getFileAvatar })(
  EditProfilePicture
);
