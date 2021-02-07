import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { useLocation, Redirect } from "react-router-dom";
import PropTypes from "prop-types";
import moment from "moment";
import "moment/locale/id";
import { updateAvatar } from "../../../actions/UserActions";
import { setCurrentClass } from "../../../actions/ClassActions";
import {
  Avatar,
  Badge,
  Divider,
  Grid,
  Hidden,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Paper,
  Typography,
  Button,
} from "@material-ui/core";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import LightTooltip from "../../misc/light-tooltip/LightTooltip";
import AccountBalanceIcon from "@material-ui/icons/AccountBalance";
import AssessmentOutlinedIcon from "@material-ui/icons/AssessmentOutlined";
import CakeIcon from "@material-ui/icons/Cake";
import ColorLensIcon from "@material-ui/icons/ColorLens";
import ContactPhoneIcon from "@material-ui/icons/ContactPhone";
import EmailIcon from "@material-ui/icons/Email";
import HomeIcon from "@material-ui/icons/Home";
import PersonIcon from "@material-ui/icons/Person";
import PhoneIcon from "@material-ui/icons/Phone";
import WcIcon from "@material-ui/icons/Wc";
import SportsEsportsIcon from "@material-ui/icons/SportsEsports";
import WorkIcon from "@material-ui/icons/Work";

const useStyles = makeStyles((theme) => ({
  root: {
    margin: "auto",
    maxWidth: "80%",
    [theme.breakpoints.down("md")]: {
        maxWidth: "100%",
    },
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
    backgroundColor: "white",
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
    backgroundColor: "#00b7ff",
  },
  buttonRapor: {
    backgroundColor: theme.palette.warning.main,
    color: "white",
    "&:focus, &:hover": {
      backgroundColor: theme.palette.warning.dark,
      color: "white",
    },
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
  descriptionText: {
    color: "white",
    marginTop: "10px",
    fontWeight: "300",
  },
  backgroundGradient: {
    padding: "20px",
    backgroundColor: theme.palette.primary.main,
  },
}));

const StyledBadge = withStyles((theme) => ({
  badge: {
    right: theme.spacing(2),
    top: theme.spacing(16),
  },
}))(Badge);

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
              !props.profile_data_info ? (
                <Typography>-</Typography>
              ) : (
                <Typography variant="body1">
                  {props.profile_data_info}
                </Typography>
              )
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
              {!props.profile_data_info ? (
                <Typography>-</Typography>
              ) : (
                <Typography>{props.profile_data_info}</Typography>
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
  const location = useLocation();

  const { user } = props.auth;
  const { setCurrentClass, classesCollection } = props;

  const [namakelas, setNamaKelas] = React.useState("");
  const [firstAssign, setFirstAssign] = React.useState(true);

  React.useEffect(() => {
    if (role === "Student") {
      setCurrentClass(kelas);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    if (firstAssign) {
      setFirstAssign(false);
    } else {
      setNamaKelas(classesCollection.kelas.name);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [classesCollection]);

  if (location.state === undefined) {
    return <Redirect to="/tidak-ditemukan" />;
  }

  const {
    avatar,
    nama,
    role,
    viewable_section,
    jenis_kelamin,
    email,
    phone,
    emergency_phone,
    alamat,
    hobi,
    ket,
    cita,
    uni,
    kelas,
    admin,
    id,
    tanggal_lahir,
  } = location.state;
  document.title = `Schooly | ${nama}`;

  return (
    <div className={classes.root}>
      <Grid container direction="column" spacing={1} alignItems="center">
        <Grid item>
          {avatar ? (
            <StyledBadge>
              <Avatar
                src={`/api/upload/avatar/${avatar}`}
                className={classes.avatar}
              />
            </StyledBadge>
          ) : (
            <StyledBadge>
              <Avatar className={classes.avatar} />
            </StyledBadge>
          )}
        </Grid>
        <Grid item>
          <Typography variant="h4" align="center">
            {nama}
          </Typography>
          <Typography variant="h6" align="center">
            {role === "Student"
              ? "Murid"
              : role === "Teacher"
              ? "Guru"
              : "Pengelola"}
          </Typography>
          <Typography variant="body1" align="center" color="textSecondary">
            {!namakelas ? null : `Kelas ${namakelas}`}
          </Typography>
        </Grid>
      </Grid>
      <Divider className={classes.profileDivider} />
      {role === "Student" && user.role === "Teacher" ? (
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            marginBottom: "20px",
          }}
        >
          <Link
            to={{
              pathname: "/lihat-rapor",
              state: {
                role: user.role,
                nama: nama,
                kelas: classesCollection.kelas,
                id: id,
              },
            }}
          >
            <LightTooltip title="Klik Untuk Melihat Rapor">
              <Button
                variant="contained"
                className={classes.buttonRapor}
                startIcon={<AssessmentOutlinedIcon />}
              >
                Lihat Rapor
              </Button>
            </LightTooltip>
          </Link>
        </div>
      ) : null}
      <Grid container direction="column" spacing={4}>
        {user.role === "Teacher" ||
        user.role === "Student" ||
        user.role === "Admin"
          ? [
              <Grid item>
                <Paper className={classes.informationPaper}>
                  <div className={classes.backgroundGradient}>
                    <Typography
                      variant="h5"
                      gutterBottom
                      style={{ color: "white" }}
                    >
                      Informasi Pengguna
                    </Typography>
                    <Typography
                      variant="h7"
                      color="textSecondary"
                      gutterBottom
                      className={classes.descriptionText}
                    >
                      Berikut adalah informasi pribadi dari pengguna terkait.
                    </Typography>
                  </div>
                  <List style={{ padding: "20px" }}>
                    <ProfileDataItem
                      profile_data_icon={<PersonIcon />}
                      profile_data_category="Nama"
                      profile_data_info={nama}
                    />
                    <Divider variant="inset" />
                    <ProfileDataItem
                      profile_data_icon={<CakeIcon />}
                      profile_data_category="Tanggal Lahir"
                      profile_data_info={moment(tanggal_lahir)
                        .locale("id")
                        .format("DD-MM-YYYY")}
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
                    {admin === true ? (
                      <div>
                        <Divider variant="inset" />
                        <ProfileDataItem
                          profile_data_icon={<HomeIcon />}
                          profile_data_category="Alamat"
                          profile_data_info={alamat}
                        />
                      </div>
                    ) : null}
                  </List>
                </Paper>
              </Grid>,
            ].concat(
              viewable_section === "no_karir" ? null : (
                <Grid item>
                  <Paper className={classes.informationPaper}>
                    <div className={classes.backgroundGradient}>
                      <Typography
                        variant="h5"
                        gutterBottom
                        style={{ color: "white" }}
                      >
                        Karir
                      </Typography>
                      <Typography
                        variant="h7"
                        color="textSecondary"
                        gutterBottom
                        className={classes.descriptionText}
                      >
                        Berikut adalah pilihan karir yang diinginkan dari
                        pengguna terkait.
                      </Typography>
                    </div>
                    <List style={{ padding: "20px", marginBottom: "30px" }}>
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
              )
            )
          : null}
      </Grid>
    </div>
  );
}

ProfileView.propTypes = {
  auth: PropTypes.object.isRequired,
  classesCollection: PropTypes.object.isRequired,
  updateAvatar: PropTypes.func.isRequired,
  setCurrentClass: PropTypes.func.isRequired,
  match: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  classesCollection: state.classesCollection,
});

export default connect(mapStateToProps, { updateAvatar, setCurrentClass })(
  ProfileView
);
