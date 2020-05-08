import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { AppBar, Avatar, Button, Box, Tabs, Tab, Grid, IconButton, List, ListItem, ListItemText,
   ListItemIcon, ListItemAvatar, ListItemSecondaryAction, Paper, Typography } from "@material-ui/core";
import { makeStyles, withStyles, useTheme } from "@material-ui/core/styles";
import ArrowRightIcon from '@material-ui/icons/ArrowRight';
import BookIcon from '@material-ui/icons/Book';
import CakeIcon from '@material-ui/icons/Cake';
import EmailIcon from '@material-ui/icons/Email';
import GamesIcon from '@material-ui/icons/Games';
import HomeIcon from '@material-ui/icons/Home';
import LockIcon from '@material-ui/icons/Lock';
import PersonIcon from '@material-ui/icons/Person';
import PhoneIcon from '@material-ui/icons/Phone';
import WcIcon from '@material-ui/icons/Wc';
import SchoolIcon from '@material-ui/icons/School';
import SupervisorAccountIcon from '@material-ui/icons/SupervisorAccount';
import WorkIcon from '@material-ui/icons/Work';
import defaultAvatar from "./DefaultAvatar.jpg";
import AddAPhotoIcon from '@material-ui/icons/AddAPhoto';
import './Profile.css'
import {Link} from 'react-router-dom';
import Modal from '@material-ui/core/Modal';
import {updateUser} from "../../../actions/AuthActions"
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: "750px",
    margin: "auto",
    marginTop: "30px", //Should be deleted after theme passing from navbar worked
  },
  avatar: {
    width: theme.spacing(20),
    height: theme.spacing(20),
    margin: 'auto'
  },
  paperBox: {
    width: "750px",
    paddingTop: "20px",
    paddingBottom: "10px",
    paddingLeft: "17.5px",
    paddingRight: "17.5px",
  },
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
  arrowEditButton: {
    color: "#2196f3",
    "&:focus": {
      outline: "none",
      backgroundColor: "none",
    }
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
    <div style={modalStyle} className={classes.paper}>
      <div
      style={{
        display: "flex",
        flexDirection: 'column',
        alignItems: "center",
        justifyContent: "center"
      }}>
      <h2 id="simple-modal-title">Unggah profil foto</h2>
      <br/>
      <form onSubmit={onSubmitForm} >
      <input
        type="file"
        name="avatar"
        id="avatar1"
        class="custom-file-input"
        onChange={handleImageUpload}
        ref={imageUploader}
        style={{
          display: "none"
        }}
      />
      {!profileImg ?
      <Avatar className={classes.avatar}>
        <img  src={`/api/uploads/image/${user.avatar}`}
        ref={uploadedImage}
        className={classes.avatar}/>
      </Avatar> :

      <Avatar className={classes.avatar}>
        <img  ref={uploadedImage}
        className={classes.avatar}/>
      </Avatar>
      }


      <div style={{display: 'flex', justifyContent: 'center'}}>
      <CloudUploadIcon onClick={() => {
        imageUploader.current.click()}}/>

        </div>
      {/* <input type="button" class="btn btn-block" value="Klik untuk upload foto" type="button" onClick={() => {
        imageUploader.current.click()}}/> */}
      <br/>
      <input type="submit" value="Jadikan profil foto" class="btn btn-primary btn-block"/>
      <input type="button" onClick={clear} value="Buang" className="my-button" class="btn btn-block"/>
      </form>


      </div>
    </div>
  )

  return (
    <div>
      <AddAPhotoIcon style={{color: '#2196f3' }}type="button" onClick={handleOpen}/>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
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
          <Grid item xs={4}>
            <Typography variant="button">
              {props.profile_data_category}
            </Typography>
          </Grid>
          <Grid item xs>
            {props.profile_data_info}
          </Grid>
        </Grid>
        <ListItemSecondaryAction>
          <IconButton edge="end">
            <ArrowRightIcon className="arrowBtn" />
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
          <Avatar src={defaultAvatar} className={classes.avatar}/>}

          {/* <Link to="/image-upload"><AddAPhotoIcon type="button"/></Link> */}
          <UploadModal user = {user} updateUser = {updateUser}/>
          <br/>

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
