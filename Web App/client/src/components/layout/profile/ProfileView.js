import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import moment from "moment";
import "moment/locale/id";
import { updateAvatar, getOneUser } from "../../../actions/UserActions";
import { setCurrentClass } from "../../../actions/ClassActions";
import { getUserFileAvatar } from "../../../actions/files/FileAvatarActions";
import DataItem from "./DataItem";
import {
  Avatar,
  Button,
  Divider,
  Grid,
  List,
  ListItem,
  Paper,
  Typography,
} from "@material-ui/core";
import {
  AccountBalance as AccountBalanceIcon,
  AssessmentOutlined as AssessmentOutlinedIcon,
  Cake as CakeIcon,
  ColorLens as ColorLensIcon,
  ContactPhone as ContactPhoneIcon,
  Email as EmailIcon,
  Home as HomeIcon,
  Person as PersonIcon,
  Phone as PhoneIcon,
  SportsEsports as SportsEsportsIcon,
  Wc as WcIcon,
  Work as WorkIcon,
} from "@material-ui/icons";
import { makeStyles } from "@material-ui/core/styles";

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
    padding: "5px 25px 22.5px 25px",
  },
}));

function ProfileView(props) {
  const classes = useStyles();
  const { user, selectedUser } = props.auth;
  const {
    setCurrentClass,
    classesCollection,
    getUserFileAvatar,
    getOneUser,
  } = props;

  const [avatar, setAvatar] = React.useState(null);
  const [namakelas, setNamaKelas] = React.useState("");

  React.useEffect(() => {
    const fetchData = async () => {
      const selectedUser = await getOneUser(props.match.params.id);
      if (selectedUser.role === "Student") {
        const kelas = await setCurrentClass(selectedUser.kelas);
        setNamaKelas(kelas.name);
      }
      const result = await getUserFileAvatar(selectedUser._id);
      setAvatar(result);
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const {
    _id,
    name,
    role,
    jenis_kelamin,
    email,
    phone,
    emergency_phone,
    address,
    hobi_minat,
    ket_non_teknis,
    cita_cita,
    uni_impian,
  } = selectedUser;

  document.title = selectedUser.name
    ? `Schooly | ${selectedUser.name}`
    : "Schooly | Lihat Profil";

  const roleMap = new Map();
  roleMap.set("Student", "Murid");
  roleMap.set("Teacher", "Guru");
  roleMap.set("Admin", "Pengelola Unit");
  roleMap.set("SuperAdmin", "Pengelola Sekolah");

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
            {roleMap.get(role)}
            {!namakelas || role !== "Student" ? null : ` ${namakelas}`}
          </Typography>
        </Grid>
      </Grid>
      <Grid
        container
        justify="flex-end"
        className={classes.profileButtonContainer}
      >
        {role === "Student" && user.role === "Teacher" ? (
          classesCollection.kelas.walikelas ? (
            classesCollection.kelas.walikelas === user._id ? (
              <Grid item>
                <Link to={{ pathname: `/rapor/${_id}` }}>
                  <Button
                    variant="contained"
                    className={classes.reportButton}
                    startIcon={<AssessmentOutlinedIcon />}
                  >
                    Lihat Rapor
                  </Button>
                </Link>
              </Grid>
            ) : user.class_teached.includes(classesCollection.kelas._id) ? (
              <Grid item>
                <Link to={{ pathname: `/rapor/${_id}` }}>
                  <Button
                    variant="contained"
                    startIcon={<AssessmentOutlinedIcon />}
                    className={classes.reportButton}
                  >
                    Lihat Rapor
                  </Button>
                </Link>
              </Grid>
            ) : null
          ) : user.class_teached.includes(classesCollection.kelas._id) ? (
            <Grid item>
              <Link to={{ pathname: `/rapor/${_id}` }}>
                <Button
                  variant="contained"
                  startIcon={<AssessmentOutlinedIcon />}
                  className={classes.reportButton}
                >
                  Lihat Rapor
                </Button>
              </Link>
            </Grid>
          ) : null
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
                <ListItem>
                  <DataItem icon={<PersonIcon />} type="Nama" value={name} />
                </ListItem>
                <Divider variant="inset" />
                <ListItem>
                  <DataItem
                    icon={<CakeIcon />}
                    type="Tanggal Lahir"
                    value={moment(user.tanggal_lahir)
                      .locale("id")
                      .format("DD MMM YYYY")}
                  />
                </ListItem>
                <Divider variant="inset" />
                <ListItem>
                  <DataItem
                    icon={<WcIcon />}
                    type="Jenis Kelamin"
                    value={jenis_kelamin}
                  />
                </ListItem>
                <Divider variant="inset" />
                <ListItem>
                  <DataItem icon={<EmailIcon />} type="Email" value={email} />
                </ListItem>
                <Divider variant="inset" />
                <ListItem>
                  <DataItem
                    icon={<PhoneIcon />}
                    type="Nomor Telepon"
                    value={phone}
                  />
                </ListItem>
                <Divider variant="inset" />
                <ListItem>
                  <DataItem
                    icon={<ContactPhoneIcon />}
                    type="Nomor Telepon Darurat"
                    value={emergency_phone}
                  />
                </ListItem>
                {user.role === "Admin" ? (
                  <div>
                    <Divider variant="inset" />
                    <ListItem>
                      <DataItem
                        icon={<HomeIcon />}
                        type="Alamat"
                        value={address}
                      />
                    </ListItem>
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
                  Berikut adalah pilihan karir dan minat dari murid terkait.
                </Typography>
              </div>
              <div className={classes.dataCategoryContent}>
                <List>
                  <ListItem>
                    <DataItem
                      icon={<SportsEsportsIcon />}
                      type="Hobi dan Minat"
                      value={hobi_minat}
                    />
                  </ListItem>
                  <Divider variant="inset" />
                  <ListItem>
                    <DataItem
                      icon={<ColorLensIcon />}
                      type="Keterampilan Non-Akademik"
                      value={ket_non_teknis}
                    />
                  </ListItem>
                  <Divider variant="inset" />
                  <ListItem>
                    <DataItem
                      icon={<WorkIcon />}
                      type="Cita-Cita"
                      value={cita_cita}
                    />
                  </ListItem>
                  <Divider variant="inset" />
                  <ListItem>
                    <DataItem
                      icon={<AccountBalanceIcon />}
                      type="Perguruan Tinggi Impian"
                      value={uni_impian}
                    />
                  </ListItem>
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
  getUserFileAvatar,
  getOneUser,
})(ProfileView);
