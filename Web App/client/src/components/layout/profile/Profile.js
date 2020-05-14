import React from "react";
import {Link} from "react-router-dom";
import { connect } from "react-redux";
import {updateUser} from "../../../actions/AuthActions"
import PropTypes from "prop-types";
import defaultAvatar from "./DefaultAvatar.jpg";
import "./Profile.css"
import { AppBar, Avatar, Backdrop, Button, Box, Fade, Grid, IconButton, List, ListItem, ListItemText,
   ListItemIcon, ListItemAvatar, ListItemSecondaryAction, Modal, Paper, Tooltip, Typography } from "@material-ui/core";
import { makeStyles, withStyles, useTheme } from "@material-ui/core/styles";
import AddAPhotoIcon from "@material-ui/icons/AddAPhoto";
import ArrowRightIcon from "@material-ui/icons/ArrowRight";
import BookIcon from "@material-ui/icons/Book";
import CakeIcon from "@material-ui/icons/Cake";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import EmailIcon from "@material-ui/icons/Email";
import GamesIcon from "@material-ui/icons/Games";
import HomeIcon from "@material-ui/icons/Home";
import LockIcon from "@material-ui/icons/Lock";
import PersonIcon from "@material-ui/icons/Person";
import PhoneIcon from "@material-ui/icons/Phone";
import WcIcon from "@material-ui/icons/Wc";
import SchoolIcon from "@material-ui/icons/School";
import SupervisorAccountIcon from "@material-ui/icons/SupervisorAccount";
import WorkIcon from "@material-ui/icons/Work";

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: "750px",
    margin: "auto",
  },
  avatar: {
    width: theme.spacing(20),
    height: theme.spacing(20),
    margin: "auto"
  },
  paperBox: {
    width: "750px",
    paddingTop: "15px",
    paddingBottom: "10px",
    paddingLeft: "17.5px",
    paddingRight: "17.5px",
  },
  profilePictureBox: {
    position: "absolute",
    width: 400,
    border: "2px solid #000",
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(2, 4, 3),
  },
  test: { //idk bro just wtf
    backgroundColor: "transparent",
  },
}));

function getModalStyle() {
  const top = 50
  const left = 50
  const width = 400
  const height = 500

  return {
    top: `${top}%`,
    left: `${left}%`,
    width: `${width}px`,
    height: `${height}px`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

function UploadModal(props) {
  const classes = useStyles();

  var uploadedImage = React.useRef(null);
  const imageUploader = React.useRef(null);
  const [profileImg, setProfileImg] = React.useState(null);

  const {user} = props;
  const {updateUser} = props;

  const [modalStyle] = React.useState(getModalStyle);
  const [open, setOpen] = React.useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

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
  }

  const content = (
    <div className={classes.profilePictureBox} style={modalStyle}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center"
        }}>
      <Typography variant="h4" gutterBottom>
        Unggah Foto Profil
      </Typography>
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
            <Tooltip title="Unggah Foto Profil Baru">
              <IconButton style={{backgroundColor: "transparent"}}>
                <CloudUploadIcon
                  onClick={() => {imageUploader.current.click()}}
                  style={{
                    color: "#2196f3",
                    height: "35px",
                    width: "35px",
                  }}
                />
              </IconButton>
            </Tooltip>
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
      </div>
    </div>
  )

  return (
    <div>
      <Tooltip title="Ganti Foto Profil">
        <IconButton style={{backgroundColor: "transparent"}}>
          <AddAPhotoIcon
            onClick={handleOpen}
            style={{
              color: "#2196f3",
              height: "35px",
              width: "35px",
            }}
          />
        </IconButton>
      </Tooltip>
      <Modal
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
        >
          <Fade in={open}>
          {content}
          </Fade>
      </Modal>
    </div>
  )
}

function ProfileData(props) {
  const classes = useStyles();
  return(
    <ListItem>
        <ListItemAvatar>
          <Avatar>
            {props.profile_data_icon}
          </Avatar>
        </ListItemAvatar>
        <Grid container>
          <Grid item xs={5}>
            <Typography variant="button">
              {props.profile_data_category}
            </Typography>
          </Grid>
          <Grid item xs>
            {props.profile_data_info}
          </Grid>
        </Grid>
        <ListItemSecondaryAction>
          <IconButton edge="end" style={{backgroundColor: "transparent"}}>
            <ArrowRightIcon />
          </IconButton>
        </ListItemSecondaryAction>
    </ListItem>
  )
}

function Profile(props) {

  const classes = useStyles();

  const { user } = props.auth;
  const updateUser = props.updateUser;

  return(
    <div className={classes.root}>
      <Grid container direction="column" alignItems="center" spacing={5}>
        <Grid item container direction="column" alignItems="center">
          {user.avatar ?
            <Avatar src={`/api/uploads/image/${user.avatar}`} className={classes.avatar}/> :
            <Avatar src={defaultAvatar} className={classes.avatar}/>
          }
          <UploadModal user={user} updateUser={updateUser}/>
          <Typography variant="subtitle2">
            <h2>{user.name}</h2>
          </Typography>
          <Typography>
            "School Name" High School {user.role}
          </Typography>
          <Typography>
            Class XA
          </Typography>
        </Grid>
        <Grid item container spacing={4}>
          <Grid item>
            <Paper className={classes.paperBox}>
                <Typography variant="subtitle2" gutterBottom>
                  <h4>Informasi Pribadi</h4>
                </Typography>
                <List>
                  <ProfileData
                    profile_data_icon={<PersonIcon />}
                    profile_data_category="Nama"
                    profile_data_info={user.name}
                  />
                  <ProfileData
                    profile_data_icon={<CakeIcon />}
                    profile_data_category="Tanggal Lahir"
                    profile_data_info="fucker"
                  />
                  <ProfileData
                    profile_data_icon={<WcIcon />}
                    profile_data_category="Jenis Kelamin"
                    profile_data_info="Nigga"
                  />
                  <ProfileData
                    profile_data_icon={<LockIcon />}
                    profile_data_category="Kata Sandi"
                    profile_data_info="Nigga"
                  />
                </List>
            </Paper>
          </Grid>
          <Grid item>
            <Paper className={classes.paperBox}>
                <Typography variant="subtitle2" gutterBottom>
                  <h4>Kontak</h4>
                </Typography>
                <List>
                  <ProfileData
                    profile_data_icon={<EmailIcon />}
                    profile_data_category="Email"
                    profile_data_info={user.email}
                  />
                  <ProfileData
                    profile_data_icon={<PhoneIcon />}
                    profile_data_category="Nomor Telepon"
                    profile_data_info={user.phone}
                  />
                  <ProfileData
                    profile_data_icon={<SupervisorAccountIcon />}
                    profile_data_category="Nomor Telepon Darurat"
                    profile_data_info={user.emergency_phone}
                  />
                  <ProfileData
                    profile_data_icon={<HomeIcon />}
                    profile_data_category="Alamat"
                    profile_data_info={user.address}
                  />
                </List>
            </Paper>
          </Grid>
          <Grid item>
            <Paper className={classes.paperBox}>
                <Typography variant="subtitle2" gutterBottom>
                  <h4>Informasi Lainnya</h4>
                </Typography>
                <List>
                  <ProfileData
                    profile_data_icon={<GamesIcon />}
                    profile_data_category="Hobi dan Minat"
                    profile_data_info="Killin, fuckin, and rapin"
                  />
                  <ProfileData
                    profile_data_icon={<BookIcon />}
                    profile_data_category="Kemampuan Extrakurikuler"
                    profile_data_info="fuckin"
                  />
                  <ProfileData
                    profile_data_icon={<WorkIcon />}
                    profile_data_category="Cita-Cita"
                    profile_data_info="fucker"
                  />
                  <ProfileData
                    profile_data_icon={<SchoolIcon />}
                    profile_data_category="Perguruan Tinggi yang Diinginkan"
                    profile_data_info="fucker university"
                  />
                </List>
            </Paper>
          </Grid>
        </Grid>
      </Grid>
    </div>
  )
}

Profile.propTypes = {
    auth: PropTypes.object.isRequired,
    updateUser: PropTypes.func.isRequired
  }

const mapStateToProps = (state) => ({
    auth: state.auth
  });


export default connect(
    mapStateToProps, {updateUser}
  ) (Profile);
