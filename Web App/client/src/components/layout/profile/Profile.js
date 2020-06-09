import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { updateAvatar } from "../../../actions/AuthActions"
import { viewOneClass} from "../../../actions/ClassActions"
import defaultAvatar from "./DefaultAvatar.jpg";
import ProfileDataEditorDialog from "./ProfileDataEditorDialog";
import ProfilePictureEditorDialog from "./ProfilePictureEditorDialog";
import ProfilePasswordEditorDialog from "./ProfilePasswordEditorDialog";
import { Avatar, Badge, Grid, List, ListItem, ListItemAvatar, Paper, Snackbar, Typography } from "@material-ui/core";
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
  return (
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
  const {updateAvatar, viewOneClass, classesCollection} = props;

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

  // Alert control for ProfilePasswordEditorDialog
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
      return;
    }
    setOpenPasswordEditorAlert(false);
  }

  document.title=`Schooly | ${user.name}`

  if(classesCollection.name == undefined){
    viewOneClass(user.kelas)
  }
  console.log(classesCollection)
  return (
    <div className={classes.root}>

      {/* ProfilePictureEditorDialog punya Snackbar */}
      <Snackbar
        open={openAlert}
        autoHideDuration={4000}
        onClose={handleCloseAlert}
        anchorOrigin={{vertical : "top", horizontal: "center"}}
      >
        <Alert onClose={handleCloseAlert} severity="info" >
          Foto profil berhasil diganti!
        </Alert>
      </Snackbar>

      {/* ProfileDataEditorDialog punya Snackbar */}
      <Snackbar
        open={openDataEditorAlert}
        autoHideDuration={4000}
        onClose={handleCloseDataEditorAlert}
        anchorOrigin={{vertical : "top", horizontal: "center"}}
      >
        <Alert onClose={handleCloseDataEditorAlert} severity="info" >
          Data profil berhasil diganti!
        </Alert>
      </Snackbar>

      {/* ProfilePasswordEditorDialog punya Snackbar */}
      <Snackbar
        open={openPasswordEditorAlert}
        autoHideDuration={4000}
        onClose={handleClosePasswordEditorAlert}
        anchorOrigin={{vertical : "top", horizontal: "center"}}
      >
        <Alert onClose={handleClosePasswordEditorAlert} severity="info" >
          Foto profil berhasil diganti!
        </Alert>
      </Snackbar>

      <Grid container direction="column" alignItems="center" spacing={5}>
        <Grid item container direction="column" alignItems="center">
          {user.avatar && user.avatar !== undefined ?
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
                src={`/api/uploads/image/${user.avatar}`}
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
            Class {classesCollection.name == undefined ?
             null : classesCollection.name}
          </Typography>
          <ProfileDataEditorDialog handleOpenAlert={handleOpenAlert} userData={user}/>
          <ProfilePasswordEditorDialog handleOpenAlert={handleOpenAlert}/>
        </Grid>
        <Grid item container spacing={4}>
          <Grid item>
            <Paper className={classes.paperBox}>
                <Typography variant="subtitle2">
                  <h4>Informasi Pribadi</h4>
                </Typography>
                <Typography variant="subtitle1" gutterBottom>
                  Beberapa informasi profil dapat dilihat oleh orang lain yang juga menggunakan layanan Schooly.
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
                    profile_data_info={user.tanggal_lahir}
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
            </Paper>
          </Grid>
          <Grid item>
            <Paper className={classes.paperBox}>
                <Typography variant="subtitle2" gutterBottom>
                  <h4>Karir</h4>
                </Typography>
                <List>
                  <ProfileDataItem
                    profile_data_icon={<SportsEsportsIcon />}
                    profile_data_category="Hobi dan Minat"
                    profile_data_info={user.hobi_minat}
                  />
                  <ProfileDataItem
                    profile_data_icon={<ColorLensIcon />}
                    profile_data_category="Keterampilan non-teknis"
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
    viewOneClass: PropTypes.func.isRequired
  }

const mapStateToProps = (state) => ({
    auth: state.auth,
    classesCollection: state.classesCollection
  });

export default connect(
    mapStateToProps, {updateAvatar, viewOneClass}
  ) (Profile);
