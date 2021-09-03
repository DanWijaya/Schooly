import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { useLocation, Redirect } from "react-router-dom";
import PropTypes from "prop-types";
import moment from "moment";
import "moment/locale/id";
import { updateAvatar, getOneUser } from "../../../actions/UserActions";
import { setCurrentClass } from "../../../actions/ClassActions";
import { getFileAvatar } from "../../../actions/files/FileAvatarActions";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import Divider from "@material-ui/core/Divider";
import Grid from "@material-ui/core/Grid";
import Hidden from "@material-ui/core/Hidden";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import ListItemText from "@material-ui/core/ListItemText";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import AccountBalanceIcon from "@material-ui/icons/AccountBalance";
import AssessmentOutlinedIcon from "@material-ui/icons/AssessmentOutlined";
import CakeIcon from "@material-ui/icons/Cake";
import ColorLensIcon from "@material-ui/icons/ColorLens";
import ContactPhoneIcon from "@material-ui/icons/ContactPhone";
import EmailIcon from "@material-ui/icons/Email";
import HomeIcon from "@material-ui/icons/Home";
import PersonIcon from "@material-ui/icons/Person";
import PhoneIcon from "@material-ui/icons/Phone";
import SportsEsportsIcon from "@material-ui/icons/SportsEsports";
import WcIcon from "@material-ui/icons/Wc";
import WorkIcon from "@material-ui/icons/Work";

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
  reportButton: {
    backgroundColor: theme.palette.action.selected,
    color: "black",
    "&:focus, &:hover": {
      backgroundColor: theme.palette.divider,
      color: "black",
    },
  },
  dataCategoryHeader: {
    padding: "25px",
    backgroundColor: theme.palette.primary.main,
    color: "white",
  },
  dataCategoryContent: {
    padding: "0px 25px 22.5px 25px",
  },
}));

function ProfileDataItem(props) {
  const classes = useStyles();

  return (
    <div>
      <Hidden smUp>
        <ListItem>
          <ListItemAvatar>
            <Avatar>
              {props.icon}
            </Avatar>
          </ListItemAvatar>
          <ListItemText
            primary={
              <Typography variant="overline" color="textSecondary">
                <b>{props.type}</b>
              </Typography>
            }
            secondary={
              !props.value ? (
                <Typography variant="body2" color="textSecondary">Kosong</Typography>
              ) : (
                <Typography>{props.value}</Typography>
              )
            }
          />
        </ListItem>
      </Hidden>
      <Hidden xsDown>
        <ListItem>
          <ListItemAvatar>
            <Avatar>
              {props.icon}
            </Avatar>
          </ListItemAvatar>
          <Grid container alignItems="center" spacing={2}>
            <Grid item xs={5}>
              <Typography variant="overline" color="textSecondary">
                <b>{props.type}</b>
              </Typography>
            </Grid>
            <Grid item xs={7}>
              {!props.value ? (
                <Typography variant="body2" color="textSecondary">Kosong</Typography>
              ) : (
                <Typography>{props.value}</Typography>
              )}
            </Grid>
          </Grid>
        </ListItem>
      </Hidden>
    </div>
  );
}

function ProfileView(props) {
  const classes = useStyles();
  const { user, selectedUser } = props.auth;
  const {
    setCurrentClass,
    classesCollection,
    getFileAvatar,
    getOneUser,
  } = props;
  const [avatar, setAvatar] = React.useState(null);
  const [namakelas, setNamaKelas] = React.useState("");

  React.useEffect(() => {
    getOneUser(props.match.params.id).then((selectedUser) => {
      if (selectedUser.role === "Student") {
        setCurrentClass(selectedUser.kelas);
      }
      getFileAvatar(selectedUser._id)
        .then((result) => setAvatar(result))
        .catch((err) => console.log(err));
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    setCurrentClass(selectedUser.kelas)
  }, [selectedUser]);

  console.log(selectedUser)

  React.useEffect(() => {
    setNamaKelas(classesCollection.kelas.name);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [classesCollection]);

  const {
    name,
    role,
    viewable_section,
    jenis_kelamin,
    email,
    phone,
    emergency_phone,
    address,
    hobi_minat,
    ket_non_teknis,
    cita_cita,
    uni_impian,
    kelas,
    admin,
    _id,
    tanggal_lahir,
  } = selectedUser;

  document.title = selectedUser.name
    ? `Schooly | ${selectedUser.name}`
    : "Schooly";

  return (
    <div className={classes.root}>
      <Grid container direction="column" alignItems="center" spacing={2}>
        <Grid item>
          {avatar ? (
            <Avatar src={avatar} className={classes.avatar} />
          ) : (
            <Avatar className={classes.avatar} />
          )}
        </Grid>
        <Grid item>
          <Typography variant="h4" align="center">
            {name}
          </Typography>
          <Typography variant="h6" color="textSecondary" align="center">
            {role === "Student"  ? "Murid"
              : role === "Teacher" ? "Guru"
              : role === "Admin" ? "Pengelola"
              : null}
            {!namakelas ? null : ` ${namakelas}`}
          </Typography>
        </Grid>
      </Grid>
      <Grid container justify="flex-end" className={classes.profileButtonContainer}>
        {role === "Student" && user.role === "Teacher" ? (
          (classesCollection.kelas.walikelas) ?
          (classesCollection.kelas.walikelas === user._id) ? (
              <Grid item>
                <Link to={{pathname: `/rapor/${_id}`}}>
                  <Button
                    variant="contained"
                    className={classes.reportButton}
                    startIcon={<AssessmentOutlinedIcon />}
                  >
                    Lihat Rapor
                  </Button>
                </Link>
              </Grid>
          ) : (user.class_teached).includes(classesCollection.kelas._id) ? (
                <Grid item>
                  <Link to={{pathname: `/rapor/${_id}`}}>
                    <Button
                      variant="contained"
                      startIcon={<AssessmentOutlinedIcon />}
                      className={classes.reportButton}
                    >
                      Lihat Rapor
                    </Button>
                  </Link>
                </Grid>
              )
            : null
          : (user.class_teached).includes(classesCollection.kelas._id) ? (
              <Grid item>
                <Link to={{pathname: `/rapor/${_id}`}}>
                  <Button
                    variant="contained"
                    startIcon={<AssessmentOutlinedIcon />}
                    className={classes.reportButton}
                  >
                    Lihat Rapor
                  </Button>
                </Link>
              </Grid>
            )
            : null
        ) : null}
      </Grid>
      <Grid container direction="column" spacing={4}>
        <Grid item>
          <Paper elevation={2}>
            <div className={classes.dataCategoryHeader}>
              <Typography variant="h5" gutterBottom>
                Informasi Pengguna
              </Typography>
              <Typography gutterBottom>
                Berikut adalah informasi dari pengguna terkait.
              </Typography>
            </div>
            <div className={classes.dataCategoryContent}>
              <List>
                <ProfileDataItem
                  icon={<PersonIcon />}
                  type="Nama"
                  value={name}
                />
                <Divider variant="inset" />
                <ProfileDataItem
                  icon={<CakeIcon />}
                  type="Tanggal Lahir"
                  value={moment(tanggal_lahir)
                    .locale("id")
                    .format("DD-MM-YYYY")}
                />
                <Divider variant="inset" />
                <ProfileDataItem
                  icon={<WcIcon />}
                  type="Jenis Kelamin"
                  value={jenis_kelamin}
                />
                <Divider variant="inset" />
                <ProfileDataItem
                  icon={<EmailIcon />}
                  type="Email"
                  value={email}
                />
                <Divider variant="inset" />
                <ProfileDataItem
                  icon={<PhoneIcon />}
                  type="Nomor Telepon"
                  value={phone}
                />
                <Divider variant="inset" />
                <ProfileDataItem
                  icon={<ContactPhoneIcon />}
                  type="Nomor Telepon Darurat"
                  value={emergency_phone}
                />
                {admin === true ? (
                  <div>
                    <Divider variant="inset" />
                    <ProfileDataItem
                      icon={<HomeIcon />}
                      type="Alamat"
                      value={address}
                    />
                  </div>
                ) : null}
              </List>
            </div>
          </Paper>
        </Grid>
        {!(role === "Student") ? null : (
            <Grid item>
              <Paper elevation={2}>
                <div className={classes.dataCategoryHeader}>
                  <Typography variant="h5" gutterBottom>
                    Karir
                  </Typography>
                  <Typography gutterBottom>
                    Berikut adalah pilihan karir yang diinginkan dari
                    murid terkait.
                  </Typography>
                </div>
                <div className={classes.dataCategoryContent}>
                  <List>
                    <ProfileDataItem
                      icon={<SportsEsportsIcon />}
                      type="Hobi dan Minat"
                      value={hobi_minat}
                    />
                    <Divider variant="inset" />
                    <ProfileDataItem
                      icon={<ColorLensIcon />}
                      type="Keterampilan Non-Akademik"
                      value={ket_non_teknis}
                    />
                    <Divider variant="inset" />
                    <ProfileDataItem
                      icon={<WorkIcon />}
                      type="Cita-Cita"
                      value={cita_cita}
                    />
                    <Divider variant="inset" />
                    <ProfileDataItem
                      icon={<AccountBalanceIcon />}
                      type="Perguruan Tinggi Impian"
                      value={uni_impian}
                    />
                  </List>
                </div>
              </Paper>
            </Grid>
          )}
      </Grid>
    </div>
  );
}

ProfileView.propTypes = {
  auth: PropTypes.object.isRequired,
  classesCollection: PropTypes.object.isRequired,
  updateAvatar: PropTypes.func.isRequired,
  getOneUser: PropTypes.func.isRequired,
  setCurrentClass: PropTypes.func.isRequired,
  match: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  classesCollection: state.classesCollection,
});

export default connect(mapStateToProps, {
  updateAvatar,
  setCurrentClass,
  getFileAvatar,
  getOneUser,
  getFileAvatar,
})(ProfileView);
