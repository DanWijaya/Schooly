import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { updateUser } from "../../../actions/AuthActions"
import defaultAvatar from "./DefaultAvatar.jpg";
import ProfileDataEditorDialog from "./ProfileDataEditorDialog"
import ProfilePictureEditorDialog from "./ProfilePictureEditorDialog"
import { Avatar, Badge, Grid, List, ListItem, ListItemAvatar, Paper, Typography, Snackbar  } from "@material-ui/core";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import BookIcon from "@material-ui/icons/Book";
import CakeIcon from "@material-ui/icons/Cake";
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
import MuiAlert from "@material-ui/lab/Alert";

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
}));

const StyledBadge = withStyles((theme) => ({
  badge: {
    right: theme.spacing(2),
    top: theme.spacing(16),
  },
}))(Badge);

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

function ProfileDataItem(props) {
  return(
    <ListItem>
        <ListItemAvatar>
          <Avatar style={{backgroundColor: "#2196f3"}}>
            {props.profile_data_icon}
          </Avatar>
        </ListItemAvatar>
        <Grid container>
          <Grid item xs={6}>
            <Typography variant="button">
              {props.profile_data_category}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            {props.profile_data_info}
          </Grid>
        </Grid>
    </ListItem>
  )
}

function Profile(props) {
  const classes = useStyles();

  const { user } = props.auth;
  const updateUser = props.updateUser;

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

  document.title=`Schooly | ${user.name}`
  return(
    <div className={classes.root}>
      <Snackbar
        open={openAlert}
        autoHideDuration={4000}
        onClose={handleCloseAlert}
        anchorOrigin={{vertical : "top", horizontal: "center"}}
      >
        <Alert onClose={handleCloseAlert} severity="success" >
          Foto profil berhasil diganti!
        </Alert>
      </Snackbar>
      <Grid container direction="column" alignItems="center" spacing={5}>
        <Grid item container direction="column" alignItems="center">
          {user.avatar && user.avatar != undefined ?
            <StyledBadge
              badgeContent={
                <ProfilePictureEditorDialog user={user} updateUser={updateUser} handleOpenAlert={handleOpenAlert}/>
              }
            >
              <Avatar
                src={`/api/uploads/image/${user.avatar}`}
                className={classes.avatar}
              />
            </StyledBadge>
            :
            <StyledBadge
              badgeContent={
                <ProfilePictureEditorDialog user={user} updateUser={updateUser} handleOpenAlert={handleOpenAlert}/>
              }
            >
            <Avatar src={defaultAvatar} className={classes.avatar} />
            </StyledBadge>
          }
          <Typography variant="subtitle2">
            <h3>{user.name}</h3>
          </Typography>
          <Typography>
            "School Name" High School {user.role}
          </Typography>
          <Typography style={{marginBottom:"25px"}}>
            Class 
          </Typography>
          <ProfileDataEditorDialog />
        </Grid>
        <Grid item container spacing={4}>
          <Grid item>
            <Paper className={classes.paperBox}>
                <Typography variant="subtitle2" gutterBottom>
                  <h4>Informasi Pribadi</h4>
                </Typography>
                <List>
                  <ProfileDataItem
                    profile_data_icon={<PersonIcon />}
                    profile_data_category="Nama"
                    profile_data_info={user.name}
                  />
                  <ProfileDataItem
                    profile_data_icon={<CakeIcon />}
                    profile_data_category="Tanggal Lahir"
                    profile_data_info="fucker"
                  />
                  <ProfileDataItem
                    profile_data_icon={<WcIcon />}
                    profile_data_category="Jenis Kelamin"
                    profile_data_info="Nigga"
                  />
                  <ProfileDataItem
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
                  <ProfileDataItem
                    profile_data_icon={<EmailIcon />}
                    profile_data_category="Email"
                    profile_data_info={user.email}
                  />
                  <ProfileDataItem
                    profile_data_icon={<PhoneIcon />}
                    profile_data_category="Nomor Telepon"
                    profile_data_info={user.phone}
                  />
                  <ProfileDataItem
                    profile_data_icon={<SupervisorAccountIcon />}
                    profile_data_category="Nomor Telepon Darurat"
                    profile_data_info={user.emergency_phone}
                  />
                  <ProfileDataItem
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
                  <ProfileDataItem
                    profile_data_icon={<GamesIcon />}
                    profile_data_category="Hobi dan Minat"
                    profile_data_info="Killin, fuckin, and rapin"
                  />
                  <ProfileDataItem
                    profile_data_icon={<BookIcon />}
                    profile_data_category="Kemampuan Extrakurikuler"
                    profile_data_info="fuckin"
                  />
                  <ProfileDataItem
                    profile_data_icon={<WorkIcon />}
                    profile_data_category="Cita-Cita"
                    profile_data_info="fucker"
                  />
                  <ProfileDataItem
                    profile_data_icon={<SchoolIcon />}
                    profile_data_category="Perguruan Tinggi Impian"
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
