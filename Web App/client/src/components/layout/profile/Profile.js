import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import moment from "moment";
import "moment/locale/id";
import { uploadFileAvatar, getFileAvatar } from "../../../actions/files/FileAvatarActions";
import { updateAvatar } from "../../../actions/UserActions";
import { setCurrentClass } from "../../../actions/ClassActions";
import informationContacts from "./InformationContacts.png";
import informationJob from "./InformationJob.png";
import informationPrivate from "./InformationPrivate.png";
import EditPassword from "./edit-password/EditPassword";
import EditProfileData from "./edit-profile-data/EditProfileData";
import EditProfilePicture from "./edit-profile-picture/EditProfilePicture";
import DataItem from "./DataItem";
import Avatar from "@material-ui/core/Avatar";
import Badge from "@material-ui/core/Badge";
import Divider from "@material-ui/core/Divider";
import Grid from "@material-ui/core/Grid";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Paper from "@material-ui/core/Paper";
import Snackbar from "@material-ui/core/Snackbar";
import Typography from "@material-ui/core/Typography";
import MuiAlert from "@material-ui/lab/Alert";
import { makeStyles } from "@material-ui/core/styles";
import AccountBalanceIcon from "@material-ui/icons/AccountBalance";
import CakeIcon from "@material-ui/icons/Cake";
import ColorLensIcon from "@material-ui/icons/ColorLens";
import ContactPhoneIcon from "@material-ui/icons/ContactPhone";
import EmailIcon from "@material-ui/icons/Email";
import HomeIcon from "@material-ui/icons/Home";
import PersonIcon from "@material-ui/icons/Person";
import PhoneIcon from "@material-ui/icons/Phone";
import SportsEsportsIcon from "@material-ui/icons/SportsEsports";
import WorkIcon from "@material-ui/icons/Work";
import WcIcon from "@material-ui/icons/Wc";

const useStyles = makeStyles((theme) => ({
  root: {
    margin: "auto",
    padding: "10px",
    paddingTop: "20px",
    maxWidth: "80%",
    [theme.breakpoints.down("md")]: {
      maxWidth: "100%",
    },
  },
  avatar: {
    width: "150px",
    height: "150px",
  },
  profileButtonContainer: {
    paddingTop: "25px",
    paddingBottom: "15px",
  },
  informationPaper: {
    padding: "22.5px 25px 22.5px 25px",
  },
  informationCategoryPictureContainer: {
    display: "flex",
    justifyContent: "center",
    [theme.breakpoints.up("md")]: {
      justifyContent: "flex-end",
    },
  },
  informationCategoryPicture: {
    height: "100px",
    [theme.breakpoints.up("md")]: {
      height: "125px",
    },
  },
  dataIcon: {
    backgroundColor: theme.palette.primary.main,
  },
}));

function Profile(props) {
  const classes = useStyles();
  const { user } = props.auth;
  const {
    updateAvatar,
    setCurrentClass,
    classesCollection,
    uploadFileAvatar,
    getFileAvatar,
  } = props;

  const [avatar, setAvatar] = React.useState(null);
  const [fileLimitSnackbar, setFileLimitSnackbar] = React.useState(false);

  React.useEffect(() => {
    getFileAvatar(user._id)
      .then((result) => setAvatar(result))
  }, [user._id]);

  // Initially classesCollection.kelas.name === undefined
  if (user.role === "Student" && !classesCollection.kelas.name) {
    setCurrentClass(user.kelas);
  }

  // Alert control for EditProfilePicture
  const [openAlert, setOpenAlert] = React.useState(false);
  const handleOpenAlert = () => {
    setOpenAlert(true);
  };
  const handleCloseAlert = (e, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenAlert(false);
  };

  // Alert control for EditProfileData
  const [openDataEditorAlert, setOpenDataEditorAlert] = React.useState(false);
  const handleOpenDataEditorAlert = () => {
    setOpenDataEditorAlert(true);
  };
  const handleCloseDataEditorAlert = (e, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenDataEditorAlert(false);
  };

  // Alert control for EditPassword
  const [openPasswordEditorAlert, setOpenPasswordEditorAlert] = React.useState(
    false
  );
  const handleOpenPasswordEditorAlert = () => {
    setOpenPasswordEditorAlert(true);
  };
  const handleClosePasswordEditorAlert = (e, reason) => {
    if (reason === "clickaway") {
      window.location.reload();
      return;
    }
    setOpenPasswordEditorAlert(false);
    window.location.reload();
  };

  const handleCloseErrorSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setFileLimitSnackbar(false);
  };

  document.title = "Schooly | Profil Saya";

  return (
    <div className={classes.root}>
      <Grid container direction="column" alignItems="center" spacing={2}>
        <Grid item>
          {user.avatar ? (
            <Badge
              overlap="circle"
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "right",
              }}
              badgeContent={
                <EditProfilePicture
                  user={user}
                  avatar={avatar}
                  // updateAvatar={uploadFileAvatar}
                  setFileLimitSnackbar={setFileLimitSnackbar}
                  fileLimitSnackbar={fileLimitSnackbar}
                  handleOpenAlert={handleOpenAlert}
                />
              }
            >
              <Avatar src={avatar} className={classes.avatar} />
            </Badge>
          ) : (
            <Badge
              overlap="circle"
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "right",
              }}
              badgeContent={
                <EditProfilePicture
                  user={user}
                  // updateAvatar={uploadFileAvatar}
                  setFileLimitSnackbar={setFileLimitSnackbar}
                  fileLimitSnackbar={fileLimitSnackbar}
                  handleOpenAlert={handleOpenAlert}
                />
              }
            >
              <Avatar className={classes.avatar} />
            </Badge>
          )}
        </Grid>
        <Grid item>
          <Typography variant="h4" align="center">
            {user.name}
          </Typography>
          <Typography variant="h6" color="textSecondary" align="center">
            {user.role === "Student" ? "Murid"
              : user.role === "Teacher" ? "Guru"
              : user.role === "Admin" ? "Pengelola"
              : null}
            {!classesCollection.kelas.name
              ? null
              : ` ${classesCollection.kelas.name}`}
          </Typography>
        </Grid>
      </Grid>
      <Grid container justify="flex-end" spacing={1} className={classes.profileButtonContainer}>
        <Grid item>
          <EditProfileData
            handleOpenAlert={handleOpenDataEditorAlert}
            userData={user}
          />
        </Grid>
        <Grid item>
          <EditPassword
            handleOpenAlert={handleOpenPasswordEditorAlert}
          />
        </Grid>
      </Grid>
      <Grid container direction="column" spacing={4}>
        <Grid item>
          <Paper elevation={2} className={classes.informationPaper}>
            <Grid container justify="space-between">
              <Grid item xs={12} md={6}>
                <Typography variant="h4" gutterBottom>
                  Informasi Pribadi
                </Typography>
                <Typography variant="subtitle1" color="textSecondary">
                  Lengkapi informasi pribadi Anda dengan data terkini untuk
                  mendata diri Anda ke sekolah Anda.
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <div className={classes.informationCategoryPictureContainer}>
                  <img
                    alt="Private Data"
                    src={informationPrivate}
                    className={classes.informationCategoryPicture}
                  />
                </div>
              </Grid>
            </Grid>
            <List>
              <ListItem>
                <DataItem
                  icon={<PersonIcon />}
                  iconStyle={classes.dataIcon}
                  type="Nama"
                  value={user.name}
                />
              </ListItem>
              <Divider variant="inset" />
              <ListItem>
                <DataItem
                  icon={<CakeIcon />}
                  iconStyle={classes.dataIcon}
                  type="Tanggal Lahir"
                  value={
                    moment(user.tanggal_lahir)
                      .locale("id")
                      .format("DD MMM YYYY")
                  }
                />
              </ListItem>
              <Divider variant="inset" />
              <ListItem>
                <DataItem
                  icon={<WcIcon />}
                  iconStyle={classes.dataIcon}
                  type="Jenis Kelamin"
                  value={user.jenis_kelamin}
                />
              </ListItem>
              {/* <Divider variant="inset" />
              <ListItem>
                <DataItem
                  icon={<SchoolIcon />}
                  iconStyle={classes.dataIcon}
                  type="Sekolah"
                  value={user.sekolah}
                />
              </ListItem>*/}
            </List>
          </Paper>
        </Grid>
        <Grid item>
          <Paper elevation={2} className={classes.informationPaper}>
            <Grid container justify="space-between">
              <Grid item xs={12} md={6}>
                <Typography variant="h4" gutterBottom>
                  Kontak
                </Typography>
                <Typography variant="subtitle1" color="textSecondary">
                  Pastikan kontak-kontak yang Anda masukkan di bawah ini benar
                  dan dapat dihubungi.
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <div className={classes.informationCategoryPictureContainer}>
                  <img
                    alt="Contacts"
                    src={informationContacts}
                    className={classes.informationCategoryPicture}
                  />
                </div>
              </Grid>
            </Grid>
            <List>
              <ListItem>
                <DataItem
                  icon={<EmailIcon />}
                  iconStyle={classes.dataIcon}
                  type="Email"
                  value={user.email}
                />
              </ListItem>
              <Divider variant="inset" />
              <ListItem>
                <DataItem
                  icon={<PhoneIcon />}
                  iconStyle={classes.dataIcon}
                  type="Nomor Telepon"
                  value={user.phone}
                />
              </ListItem>
              <Divider variant="inset" />
              <ListItem>
                <DataItem
                  icon={<ContactPhoneIcon />}
                  iconStyle={classes.dataIcon}
                  type="Nomor Telepon Darurat"
                  value={user.emergency_phone}
                />
              </ListItem>
              <Divider variant="inset" />
              <ListItem>
                <DataItem
                  icon={<HomeIcon />}
                  iconStyle={classes.dataIcon}
                  type="Alamat"
                  value={user.address}
                />
              </ListItem>
            </List>
          </Paper>
        </Grid>
        {user.role === "Student" ? (
          <Grid item>
            <Paper elevation={2} className={classes.informationPaper}>
              <Grid container justify="space-between">
                <Grid item xs={12} md={6}>
                  <Typography variant="h4" gutterBottom>
                    Karir
                  </Typography>
                  <Typography variant="subtitle1" color="textSecondary">
                    Bantu kami dan sekolah Anda untuk merekomendasikan jalur karir terbaik untuk Anda.
                  </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <div className={classes.informationCategoryPictureContainer}>
                    <img
                      alt="Career"
                      src={informationJob}
                      className={classes.informationCategoryPicture}
                    />
                  </div>
                </Grid>
              </Grid>
              <List>
                <ListItem>
                  <DataItem
                    icon={<SportsEsportsIcon />}
                    iconStyle={classes.dataIcon}
                    type="Hobi dan Minat"
                    value={user.hobi_minat}
                  />
                </ListItem>
                <Divider variant="inset" />
                <ListItem>
                  <DataItem
                    icon={<ColorLensIcon />}
                    iconStyle={classes.dataIcon}
                    type="Keterampilan Non-Akademik"
                    value={user.ket_non_teknis}
                  />
                </ListItem>
                <Divider variant="inset" />
                <ListItem>
                  <DataItem
                    icon={<WorkIcon />}
                    iconStyle={classes.dataIcon}
                    type="Cita-Cita"
                    value={user.cita_cita}
                  />
                </ListItem>
                <Divider variant="inset" />
                <ListItem>
                  <DataItem
                    icon={<AccountBalanceIcon />}
                    iconStyle={classes.dataIcon}
                    type="Perguruan Tinggi Impian"
                    value={user.uni_impian}
                  />
                </ListItem>
              </List>
            </Paper>
          </Grid>
        ) : null}
      </Grid>
      {/* EditProfilePicture Snackbar */}
      <Snackbar
        open={openAlert}
        autoHideDuration={4000}
        onClose={handleCloseAlert}
        anchorOrigin={{ vertical: "center", horizontal: "center" }}
      >
        <MuiAlert
          elevation={6}
          variant="filled"
          onClose={handleCloseAlert}
          severity="success"
        >
          Foto profil berhasil diganti!
        </MuiAlert>
      </Snackbar>
      {/* EditProfileData Snackbar */}
      <Snackbar
        open={openDataEditorAlert}
        autoHideDuration={4000}
        onClose={handleCloseDataEditorAlert}
        anchorOrigin={{ vertical: "center", horizontal: "center" }}
      >
        <MuiAlert
          elevation={6}
          variant="filled"
          onClose={handleCloseDataEditorAlert}
          severity="success"
        >
          Data profil berhasil diganti!
        </MuiAlert>
      </Snackbar>
      {/* EditPassword Snackbar */}
      <Snackbar
        open={openPasswordEditorAlert}
        autoHideDuration={4000}
        onClose={handleClosePasswordEditorAlert}
        anchorOrigin={{ vertical: "center", horizontal: "center" }}
      >
        <MuiAlert
          elevation={6}
          variant="filled"
          onClose={handleClosePasswordEditorAlert}
          severity="success"
        >
          Kata sandi berhasil diganti!
        </MuiAlert>
      </Snackbar>
      {/* Profile Pict Size Limit Snackbar */}
      <Snackbar
        open={fileLimitSnackbar}
        autoHideDuration={2000}
        onClose={handleCloseErrorSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <MuiAlert elevation={6} variant="filled" severity="error">
          Foto profil melebihi batas 5MB!
        </MuiAlert>
      </Snackbar>
    </div>
  );
}

Profile.propTypes = {
  auth: PropTypes.object.isRequired,
  classesCollection: PropTypes.object.isRequired,
  setCurrentClass: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  classesCollection: state.classesCollection,
});

export default connect(mapStateToProps, {
  updateAvatar,
  setCurrentClass,
  uploadFileAvatar,
  getFileAvatar,
})(Profile);
