import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import moment from "moment";
import "moment/locale/id";
import { updateAvatar } from "../../../actions/UserActions"
import { setCurrentClass} from "../../../actions/ClassActions"
import ProfileDataEditorDialog from "./ProfileDataEditorDialog";
import ProfilePictureEditorDialog from "./ProfilePictureEditorDialog";
import ProfilePasswordEditorDialog from "./ProfilePasswordEditorDialog";
import { Avatar, Badge, Grid, Hidden, List, ListItem, ListItemAvatar, ListItemText, Paper, Snackbar, Typography } from "@material-ui/core";
import MuiAlert from "@material-ui/lab/Alert";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import AccountBalanceIcon from "@material-ui/icons/AccountBalance";
import CakeIcon from "@material-ui/icons/Cake";
import ColorLensIcon from "@material-ui/icons/ColorLens";
import ContactPhoneIcon from "@material-ui/icons/ContactPhone";
import EmailIcon from "@material-ui/icons/Email";
import HomeIcon from "@material-ui/icons/Home";
import PersonIcon from "@material-ui/icons/Person";
import PhoneIcon from "@material-ui/icons/Phone";
import WcIcon from "@material-ui/icons/Wc";
import SchoolIcon from "@material-ui/icons/School";
import SportsEsportsIcon from "@material-ui/icons/SportsEsports";
import WorkIcon from "@material-ui/icons/Work";

const useStyles = makeStyles((theme) => ({
  root: {
    margin: "auto",
    maxWidth: "1000px",
    padding: "10px",
  },
  avatar: {
    margin: "auto",
    width: theme.spacing(20),
    height: theme.spacing(20),
  },
  paperBox: {
    padding: "15px",
    paddingTop: "20px",
  },
  profileDataItemAvatar: {
    backgroundColor: theme.palette.primary.main,
  },
  emptyProfileData: {
    display: "flex",
    justifyContent: "center",
    maxWidth: "150px",
    padding: "5px",
    paddingLeft: "10px",
    paddingRight: "10px",
    backgroundColor: theme.palette.error.main,
    color: "white",
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
  const classes = useStyles();

  return (
    <div>
      <Hidden smUp implementation="css">
        <ListItem>
          <ListItemAvatar>
            <Avatar className={classes.profileDataItemAvatar}>
              {props.profile_data_icon}
            </Avatar>
          </ListItemAvatar>
          <ListItemText
            primary={
              <Typography variant="overline">
                {props.profile_data_category}
              </Typography>
            }
            secondary={
              !props.profile_data_info ?
                <Paper className={classes.emptyProfileData}>
                  <Typography variant="button">
                    Kosong
                  </Typography>
                </Paper>
              :
                <Typography>
                  {props.profile_data_info}
                </Typography>
            }
          />
        </ListItem>
      </Hidden>
      <Hidden xsDown implementation="css">
        <ListItem>
          <ListItemAvatar>
            <Avatar className={classes.profileDataItemAvatar}>
              {props.profile_data_icon}
            </Avatar>
          </ListItemAvatar>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Typography variant="overline">
                {props.profile_data_category}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              {!props.profile_data_info ?
                <Paper className={classes.emptyProfileData}>
                  <Typography variant="button">
                    Kosong
                  </Typography>
                </Paper>
                :
                <Typography>
                  {props.profile_data_info}
                </Typography>
              }
            </Grid>
          </Grid>
        </ListItem>
      </Hidden>
    </div>
  )
}

function Profile(props) {
  const classes = useStyles();

  const { user } = props.auth;
  const { updateAvatar, setCurrentClass, classesCollection } = props;
  // const { kelas } = props.classesCollection;
  // Alert control for ProfilePictureEditorDialog

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
  console.log(user.avatar)

  // Alert control for ProfileDataEditorDialog
  const [openDataEditorAlert, setOpenDataEditorAlert] = React.useState(false);
  const handleOpenDataEditorAlert = () => {
    setOpenDataEditorAlert(true);
  }
  const handleCloseDataEditorAlert = (e, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenDataEditorAlert(false);
  }

  // Alert control for ProfilePasswordEditorDialog
  const [openPasswordEditorAlert, setOpenPasswordEditorAlert] = React.useState(false);
  const handleOpenPasswordEditorAlert = () => {
    setOpenPasswordEditorAlert(true);
    
  }
  const handleClosePasswordEditorAlert = (e, reason) => {
    if (reason === "clickaway") {
      window.location.reload()
      return;
    }
    setOpenPasswordEditorAlert(false);
    window.location.reload()
  }

  // Initially classesCollection.kelas.name === undefined
  if (user.role === "Student" && !classesCollection.kelas.name) {
    setCurrentClass(user.kelas)
  }

  document.title = "Schooly | Profil"

  return (
    <div className={classes.root}>
      {/* ProfilePictureEditorDialog Snackbar */}
      <Snackbar
        open={openAlert}
        autoHideDuration={4000}
        onClose={handleCloseAlert}
        anchorOrigin={{vertical : "center", horizontal: "center"}}
      >
        <Alert onClose={handleCloseAlert} severity="success" >
          Foto profil berhasil diganti!
        </Alert>
      </Snackbar>
      {/* ProfileDataEditorDialog Snackbar */}
      <Snackbar
        open={openDataEditorAlert}
        autoHideDuration={4000}
        onClose={handleCloseDataEditorAlert}
        anchorOrigin={{vertical : "center", horizontal: "center"}}
      >
        <Alert onClose={handleCloseDataEditorAlert} severity="success" >
          Data profil berhasil diganti!
        </Alert>
      </Snackbar>
      {/* ProfilePasswordEditorDialog Snackbar */}
      <Snackbar
        open={openPasswordEditorAlert}
        autoHideDuration={4000}
        onClose={handleClosePasswordEditorAlert}
        anchorOrigin={{vertical : "center", horizontal: "center"}}
      >
        <Alert onClose={handleClosePasswordEditorAlert} severity="success" >
          Kata sandi berhasil diganti!
        </Alert>
      </Snackbar>
      <Grid container direction="column" alignItems="center" spacing={5}>
        <Grid item container direction="column" alignItems="center">
          {user.avatar
          ?
            <StyledBadge
              badgeContent={
                <ProfilePictureEditorDialog
                  user={user}
                  updateAvatar={updateAvatar}
                  handleOpenAlert={handleOpenAlert}
                />
              }
            >
              <Avatar
                src={`/api/upload/avatar/${user.avatar}`}
                className={classes.avatar}
              />
            </StyledBadge>
            :
            <StyledBadge
              badgeContent={
                <ProfilePictureEditorDialog
                  user={user}
                  updateAvatar={updateAvatar}
                  handleOpenAlert={handleOpenAlert}
                />
              }
            >
              <Avatar className={classes.avatar} />
            </StyledBadge>
          }
          <Typography variant="h3" align="center" style={{padding: "10px"}}>
            {user.name}
          </Typography>
          <Typography variant="h6" align="center">
            {user.sekolah}
          </Typography>
          <Typography variant="h6" align="center" gutterBottom>
            {user.role === "Student" ?
              "Murid"
            : user.role === "Teacher" ?
              "Guru"
            :
              "Pengelola"
            } SMA
          </Typography>
          <Typography style={{marginBottom:"25px"}}>
            {!classesCollection.kelas.name ? 
            null : `Kelas ${classesCollection.kelas.name}`}
          </Typography>
          <ProfileDataEditorDialog handleOpenAlert={handleOpenDataEditorAlert} userData={user}/>
          <ProfilePasswordEditorDialog handleOpenAlert={handleOpenPasswordEditorAlert}/>
        </Grid>
        <Grid item container direction="column" spacing={4}>
          <Grid item>
            <Paper>
              <div className={classes.paperBox}>
                <Typography variant="h4" gutterBottom>
                  Informasi Pribadi
                </Typography>
                <Typography variant="subtitle1">
                  Beberapa informasi profil dapat dilihat oleh pengelola sekolah anda.
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
                    profile_data_info={moment(user.tanggal_lahir).locale("id").format("DD-MM-YYYY")}
                  />
                  <ProfileDataItem
                    profile_data_icon={<WcIcon />}
                    profile_data_category="Jenis Kelamin"
                    profile_data_info={user.jenis_kelamin}
                  />
                  <ProfileDataItem
                    profile_data_icon={<SchoolIcon />}
                    profile_data_category="Sekolah"
                    profile_data_info={user.sekolah}
                  />
                </List>
              </div>
            </Paper>
          </Grid>
          <Grid item>
            <Paper>
              <div className={classes.paperBox}>
                <Typography variant="h4">
                  Kontak
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
                    profile_data_icon={<ContactPhoneIcon />}
                    profile_data_category="Nomor Telepon Darurat"
                    profile_data_info={user.emergency_phone}
                  />
                  <ProfileDataItem
                    profile_data_icon={<HomeIcon />}
                    profile_data_category="Alamat"
                    profile_data_info={user.address}
                  />
                </List>
              </div>
            </Paper>
          </Grid>
          <Grid item>
            <Paper>
              <div className={classes.paperBox}>
                <Typography variant="h4">
                  Karir
                </Typography>
                <List>
                  <ProfileDataItem
                    profile_data_icon={<SportsEsportsIcon />}
                    profile_data_category="Hobi dan Minat"
                    profile_data_info={user.hobi_minat}
                  />
                  <ProfileDataItem
                    profile_data_icon={<ColorLensIcon />}
                    profile_data_category="Keterampilan Non-Akademik"
                    profile_data_info={user.ket_non_teknis}
                  />
                  <ProfileDataItem
                    profile_data_icon={<WorkIcon />}
                    profile_data_category="Cita-Cita"
                    profile_data_info={user.cita_cita}
                  />
                  <ProfileDataItem
                    profile_data_icon={<AccountBalanceIcon />}
                    profile_data_category="Perguruan Tinggi Impian"
                    profile_data_info={user.uni_impian}
                  />
                </List>
              </div>
            </Paper>
          </Grid>
        </Grid>
      </Grid>
    </div>
  )
}

Profile.propTypes = {
  auth: PropTypes.object.isRequired,
  classesCollection: PropTypes.object.isRequired,
  updateAvatar: PropTypes.func.isRequired,
  setCurrentClass: PropTypes.func.isRequired,
}

const mapStateToProps = (state) => ({
  auth: state.auth,
  classesCollection: state.classesCollection,
});

export default connect(
  mapStateToProps, { updateAvatar, setCurrentClass }
) (Profile);
