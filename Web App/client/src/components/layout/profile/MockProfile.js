import React from "react";
import { connect } from "react-redux";
import { withRouter, useLocation , Redirect } from "react-router-dom";
import PropTypes from "prop-types";
import moment from "moment";
import "moment/locale/id";
import { updateAvatar } from "../../../actions/UserActions";
import { setCurrentClass } from "../../../actions/ClassActions";
import informationContacts from "./InformationContacts.png";
import informationJob from "./InformationJob.png";
import informationPrivate from "./InformationPrivate.png";
import ProfileDataEditorDialog from "./ProfileDataEditorDialog";
import ProfilePictureEditorDialog from "./ProfilePictureEditorDialog";
import ProfilePasswordEditorDialog from "./ProfilePasswordEditorDialog";
import { Avatar, Badge, Divider, Grid, Hidden, List, ListItem, ListItemAvatar, ListItemText, Paper, Snackbar, Typography } from "@material-ui/core";
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
import { BsUnion } from "react-icons/bs";

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
  profileDivider: {
    backgroundColor: theme.palette.primary.main,
    margin: "15px 0px 15px 0px",
  },
  informationPaper: {
    padding: "22.5px 25px 22.5px 25px",
  },
  informationPictureContainer: {
    display: "flex",
    justifyContent: "center",
    [theme.breakpoints.up("sm")]: {
      justifyContent: "flex-end",
    },
  },
  informationPicture: {
    height: "100px",
    [theme.breakpoints.up("sm")]: {
      height: "125px",
    },
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
              <Typography variant="overline" color="textSecondary">
                <b>{props.profile_data_category}</b>
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
                <Typography variant="body1">
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
            <Grid item xs={5}>
              <Typography variant="overline" color="textSecondary">
                <b>{props.profile_data_category}</b>
              </Typography>
            </Grid>
            <Grid item xs={7}>
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
  const location = useLocation();
  

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

  if(location.state==undefined){
    return(<Redirect to="/tidak-ditemukan"/>)
  }
  const { avatar, nama, role, viewable_section, tanggal_lahir, jenis_kelamin, 
    sekolah, email, phone, emergency_phone, alamat, hobi, ket, cita, uni, kelas, subject_teached } = location.state
    
  // Initially classesCollection.kelas.name === undefined
  if (user.role === "Student" && !classesCollection.kelas.name) {
    setCurrentClass(user.kelas)
  }
  console.log(location.state)

  

  document.title = "Schooly | Profil"
  console.log(classesCollection.kelas)
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
      <Grid container direction="column" spacing={1} alignItems="center">
        <Grid item>
          {avatar ?
          <StyledBadge
            
          >
            <Avatar
              src={`/api/upload/avatar/${avatar}`}
              className={classes.avatar}
            />
          </StyledBadge>
          :
          <StyledBadge
            
          >
            <Avatar className={classes.avatar} />
          </StyledBadge>
          }
        </Grid>
        <Grid item>
          <Typography variant="h4" align="center">
            {nama}
          </Typography>
          <Typography variant="h6" align="center">
            {role === "Student" ?
              "Murid"
            : role === "Teacher" ?
              "Guru"
            :
              "Pengelola"
            }
          </Typography>
          <Typography variant="body1" align="center" color="textSecondary">
            {!classesCollection.kelas.name ? null : `Kelas ${classesCollection.kelas.name}`}
          </Typography>
        </Grid>
      </Grid>
      <Divider className={classes.profileDivider} />
      <Grid container direction="column" alignItems="center" spacing={5}>
        <Grid item container spacing={1} justify="flex-end" alignItems="center">
          <Grid item>
            
          </Grid>
          <Grid item>
            
          </Grid>
        </Grid>
        <Grid item container direction="column" spacing={4}>
          {/* bookmark: section */}
          {
            (role == 'Teacher' ||  role == 'Student') ? [
              <Grid item>
                <Paper className={classes.informationPaper}>
                  <Grid container justify="space-between">
                    <Grid item xs={12} sm={6}>
                      <Typography variant="h4" gutterBottom>
                        Informasi Pengguna
                      </Typography>
                      <Typography variant="subtitle1" color="textSecondary">
                        User Information
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <div className={classes.informationPictureContainer}>
                        {/* <img alt="Private Information" src={informationPrivate} className={classes.informationPicture} /> */}
                        <div className={classes.informationPicture}></div>
                      </div>
                    </Grid>
                  </Grid>
                  <List>
                    <ProfileDataItem
                      profile_data_icon={<PersonIcon />}
                      profile_data_category="Nama"
                      profile_data_info={nama}
                    />
                    <Divider variant="inset" />
                    <ProfileDataItem
                      profile_data_icon={<CakeIcon />}
                      profile_data_category="Role"
                      profile_data_info={role}
                    />
                    <Divider variant="inset" />
                    <ProfileDataItem
                      profile_data_icon={<WcIcon />}
                      profile_data_category="Jenis Kelamin"
                      profile_data_info={jenis_kelamin}
                    />
                    <Divider variant="inset" />
                    <ProfileDataItem
                      profile_data_icon={<EmailIcon />}
                      profile_data_category="Email"
                      profile_data_info={email}
                    />
                    <ProfileDataItem
                      profile_data_icon={<PhoneIcon />}
                      profile_data_category="Nomor Telepon"
                      profile_data_info={phone}
                    />
                    <Divider variant="inset" />
                    <ProfileDataItem
                      profile_data_icon={<ContactPhoneIcon />}
                      profile_data_category="Nomor Telepon Darurat"
                      profile_data_info={emergency_phone}
                    />
                  </List>
                </Paper>
              </Grid>
            ].concat((viewable_section == "no_karir") ? (null) : (
              <Grid item>
                <Paper className={classes.informationPaper}>
                  <Grid container justify="space-between">
                    <Grid item xs={12} sm={6}>
                      <Typography variant="h4" gutterBottom>
                        Karir
                      </Typography>
                      <Typography variant="subtitle1" color="textSecondary">
                        Career & Other Informations
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <div className={classes.informationPictureContainer}>
                        {/* <img alt="Career" src={informationJob} className={classes.informationPicture} /> */}
                        <div className={classes.informationPicture}></div>
                      </div>
                    </Grid>
                  </Grid>
                  <List>
                    <ProfileDataItem
                      profile_data_icon={<SportsEsportsIcon />}
                      profile_data_category="Hobi dan Minat"
                      profile_data_info={hobi}
                    />
                    <Divider variant="inset" />
                    <ProfileDataItem
                      profile_data_icon={<ColorLensIcon />}
                      profile_data_category="Keterampilan Non-Akademik"
                      profile_data_info={ket}
                    />
                    <Divider variant="inset" />
                    <ProfileDataItem
                      profile_data_icon={<WorkIcon />}
                      profile_data_category="Cita-Cita"
                      profile_data_info={cita}
                    />
                    <Divider variant="inset" />
                    <ProfileDataItem
                      profile_data_icon={<AccountBalanceIcon />}
                      profile_data_category="Perguruan Tinggi Impian"
                      profile_data_info={uni}
                    />
                  </List>
                </Paper>
              </Grid>
            )) : (
              <Grid item container direction="column" spacing={4}>

                <Grid item>
                  <Paper className={classes.informationPaper}>
                    <Grid container justify="space-between">
                      <Grid item xs={12} sm={6}>
                        <Typography variant="h4" gutterBottom>
                          Informasi Pribadi
                        </Typography>
                        <Typography variant="subtitle1" color="textSecondary">
                          Jangan lupa untuk mengisi semua informasi profil Anda untuk melengkapi
                          database sekolah Anda.
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <div className={classes.informationPictureContainer}>
                          <img alt="Private Information" src={informationPrivate} className={classes.informationPicture} />
                        </div>
                      </Grid>
                    </Grid>
                    <List>
                      <ProfileDataItem
                        profile_data_icon={<PersonIcon />}
                        profile_data_category="Nama"
                        profile_data_info={nama}
                      />
                      <Divider variant="inset" />
                      <ProfileDataItem
                        profile_data_icon={<CakeIcon />}
                        profile_data_category="Tanggal Lahir"
                        profile_data_info={tanggal_lahir}
                      />
                      <Divider variant="inset" />
                      <ProfileDataItem
                        profile_data_icon={<WcIcon />}
                        profile_data_category="Jenis Kelamin"
                        profile_data_info={jenis_kelamin}
                      />
                      <Divider variant="inset" />
                      <ProfileDataItem
                        profile_data_icon={<SchoolIcon />}
                        profile_data_category="Sekolah"
                        profile_data_info={sekolah}
                      />
                    </List>
                  </Paper>
                </Grid>
                <Grid item>
                  <Paper className={classes.informationPaper}>
                    <Grid container justify="space-between">
                      <Grid item xs={12} sm={6}>
                        <Typography variant="h4" gutterBottom>
                          Kontak
                        </Typography>
                        <Typography variant="subtitle1" color="textSecondary">
                          Pastikan Anda mengecek kembali kontak-kontak yang Anda masukkan.
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <div className={classes.informationPictureContainer}>
                          <img alt="Contacts" src={informationContacts} className={classes.informationPicture} />
                        </div>
                      </Grid>
                    </Grid>
                    <List>
                      <ProfileDataItem
                        profile_data_icon={<EmailIcon />}
                        profile_data_category="Email"
                        profile_data_info={email}
                      />
                      <Divider variant="inset" />
                      <ProfileDataItem
                        profile_data_icon={<PhoneIcon />}
                        profile_data_category="Nomor Telepon"
                        profile_data_info={phone}
                      />
                      <Divider variant="inset" />
                      <ProfileDataItem
                        profile_data_icon={<ContactPhoneIcon />}
                        profile_data_category="Nomor Telepon Darurat"
                        profile_data_info={emergency_phone}
                      />
                      <Divider variant="inset" />
                      <ProfileDataItem
                        profile_data_icon={<HomeIcon />}
                        profile_data_category="Alamat"
                        profile_data_info={alamat}
                      />
                    </List>
                  </Paper>
                </Grid>
                <Grid item>
              <Paper className={classes.informationPaper}>
                <Grid container justify="space-between">
                  <Grid item xs={12} sm={6}>
                    <Typography variant="h4" gutterBottom>
                      Karir
                    </Typography>
                    <Typography variant="subtitle1" color="textSecondary">
                      Kami ke depannya juga berencana untuk membantu Anda menemukan
                      jalur karir terbaik untuk Anda.
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <div className={classes.informationPictureContainer}>
                      <img alt="Career" src={informationJob} className={classes.informationPicture} />
                    </div>
                  </Grid>
                </Grid>
                <List>
                  <ProfileDataItem
                    profile_data_icon={<SportsEsportsIcon />}
                    profile_data_category="Hobi dan Minat"
                    profile_data_info={hobi}
                  />
                  <Divider variant="inset" />
                  <ProfileDataItem
                    profile_data_icon={<ColorLensIcon />}
                    profile_data_category="Keterampilan Non-Akademik"
                    profile_data_info={ket}
                  />
                  <Divider variant="inset" />
                  <ProfileDataItem
                    profile_data_icon={<WorkIcon />}
                    profile_data_category="Cita-Cita"
                    profile_data_info={cita}
                  />
                  <Divider variant="inset" />
                  <ProfileDataItem
                    profile_data_icon={<AccountBalanceIcon />}
                    profile_data_category="Perguruan Tinggi Impian"
                    profile_data_info={uni}
                  />
                </List>
              </Paper>
            </Grid>
            
              </Grid>
            )
            
          }


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
  match: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired
}

const mapStateToProps = (state) => ({
  auth: state.auth,
  classesCollection: state.classesCollection,
});

export default connect(
    mapStateToProps, { updateAvatar, setCurrentClass }
  ) (Profile);