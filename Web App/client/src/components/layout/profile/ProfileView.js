import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import moment from "moment";
import "moment/locale/id";
import { updateAvatar, getOneUser } from "../../../actions/UserActions";
import { setCurrentClass } from "../../../actions/ClassActions";
import { getFileAvatar } from "../../../actions/files/FileAvatarActions";
import DataItem from "./DataItem";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import Divider from "@material-ui/core/Divider";
import Grid from "@material-ui/core/Grid";
import List from "@material-ui/core/List";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
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
    padding: "12.5px 25px 22.5px 25px",
  },
  dataItem: {
    padding: "8px 16px 8px 16px",
  },
}));

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
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    setCurrentClass(selectedUser.kelas)
  }, [selectedUser]);

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
    : "Schooly | Lihat Profil";

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
            {!namakelas || !role !== "Student"? null : ` ${namakelas}`}
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
              <Grid container direction="column">
                <Grid item container spacing={2} className={classes.dataItem}>
                  <Grid item>
                    <Avatar>
                      <PersonIcon />
                    </Avatar>
                  </Grid>
                  <Grid item xs container alignItems="center">
                    <Grid item xs={12} sm={5}>
                      <Typography variant="overline" color="textSecondary" noWrap>
                        <b>Nama</b>
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={7}>
                      {!name ? (
                        <Typography variant="body2" color="textSecondary">Kosong</Typography>
                      ) : (
                        <Typography>
                          {name}
                        </Typography>
                      )}
                    </Grid>
                  </Grid>
                </Grid>
                <Divider variant="inset" />
                <Grid item container spacing={2} className={classes.dataItem}>
                  <Grid item>
                    <Avatar>
                      <CakeIcon />
                    </Avatar>
                  </Grid>
                  <Grid item xs container alignItems="center">
                    <Grid item xs={12} sm={5}>
                      <Typography variant="overline" color="textSecondary" noWrap>
                        <b>Tanggal Lahir</b>
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={7}>
                      {!tanggal_lahir ? (
                        <Typography variant="body2" color="textSecondary">Kosong</Typography>
                      ) : (
                        <Typography>
                          {moment(tanggal_lahir)
                            .locale("id")
                            .format("DD MMM YYYY")
                          }
                        </Typography>
                      )}
                    </Grid>
                  </Grid>
                </Grid>
                <Divider variant="inset" />
                <Grid item container spacing={2} className={classes.dataItem}>
                  <Grid item>
                    <Avatar>
                      <WcIcon />
                    </Avatar>
                  </Grid>
                  <Grid item xs container alignItems="center">
                    <Grid item xs={12} sm={5}>
                      <Typography variant="overline" color="textSecondary" noWrap>
                        <b>Jenis Kelamin</b>
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={7}>
                      {!jenis_kelamin ? (
                        <Typography variant="body2" color="textSecondary">Kosong</Typography>
                      ) : (
                        <Typography>
                          {jenis_kelamin}
                        </Typography>
                      )}
                    </Grid>
                  </Grid>
                </Grid>
                <Divider variant="inset" />
                <Grid item container spacing={2} className={classes.dataItem}>
                  <Grid item>
                    <Avatar>
                      <EmailIcon />
                    </Avatar>
                  </Grid>
                  <Grid item xs container alignItems="center">
                    <Grid item xs={12} sm={5}>
                      <Typography variant="overline" color="textSecondary" noWrap>
                        <b>Email</b>
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={7}>
                      {!email ? (
                        <Typography variant="body2" color="textSecondary">Kosong</Typography>
                      ) : (
                        <Typography>
                          {email}
                        </Typography>
                      )}
                    </Grid>
                  </Grid>
                </Grid>
                <Divider variant="inset" />
                <Grid item container spacing={2} className={classes.dataItem}>
                  <Grid item>
                    <Avatar>
                      <PhoneIcon />
                    </Avatar>
                  </Grid>
                  <Grid item xs container alignItems="center">
                    <Grid item xs={12} sm={5}>
                      <Typography variant="overline" color="textSecondary" noWrap>
                        <b>Nomor Telepon</b>
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={7}>
                      {!phone ? (
                        <Typography variant="body2" color="textSecondary">Kosong</Typography>
                      ) : (
                        <Typography>
                          {phone}
                        </Typography>
                      )}
                    </Grid>
                  </Grid>
                </Grid>
                <Divider variant="inset" />
                <Grid item container spacing={2} className={classes.dataItem}>
                  <Grid item>
                    <Avatar>
                      <ContactPhoneIcon />
                    </Avatar>
                  </Grid>
                  <Grid item xs container alignItems="center">
                    <Grid item xs={12} sm={5}>
                      <Typography variant="overline" color="textSecondary" noWrap>
                        <b>Nomor Telepon Darurat</b>
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={7}>
                      {!emergency_phone ? (
                        <Typography variant="body2" color="textSecondary">Kosong</Typography>
                      ) : (
                        <Typography>
                          {emergency_phone}
                        </Typography>
                      )}
                    </Grid>
                  </Grid>
                </Grid>
                {user.role === "Admin" ? (
                  <div>
                    <Divider variant="inset" />
                    <Grid item container spacing={2} className={classes.dataItem}>
                      <Grid item>
                        <Avatar>
                          <HomeIcon />
                        </Avatar>
                      </Grid>
                      <Grid item xs container alignItems="center">
                        <Grid item xs={12} sm={5}>
                          <Typography variant="overline" color="textSecondary" noWrap>
                            <b>Alamat</b>
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={7}>
                          {!address ? (
                            <Typography variant="body2" color="textSecondary">Kosong</Typography>
                          ) : (
                            <Typography>
                              {address}
                            </Typography>
                          )}
                        </Grid>
                      </Grid>
                    </Grid>
                  </div>
                ) : null}
              </Grid>
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
                    <DataItem
                      icon={<SportsEsportsIcon />}
                      type="Hobi dan Minat"
                      value={hobi_minat}
                    />
                    <Divider variant="inset" />
                    <DataItem
                      icon={<ColorLensIcon />}
                      type="Keterampilan Non-Akademik"
                      value={ket_non_teknis}
                    />
                    <Divider variant="inset" />
                    <DataItem
                      icon={<WorkIcon />}
                      type="Cita-Cita"
                      value={cita_cita}
                    />
                    <Divider variant="inset" />
                    <DataItem
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
