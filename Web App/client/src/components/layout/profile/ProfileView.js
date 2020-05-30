import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { updateAvatar } from "../../../actions/AuthActions"
import defaultAvatar from "./DefaultAvatar.jpg";
import { Avatar, Grid, List, ListItem, ListItemAvatar, Paper, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import AccountBalanceIcon from '@material-ui/icons/AccountBalance';
import BookIcon from "@material-ui/icons/Book";
import CakeIcon from "@material-ui/icons/Cake";
import EmailIcon from "@material-ui/icons/Email";
import GamesIcon from "@material-ui/icons/Games";
import HomeIcon from "@material-ui/icons/Home";
import PersonIcon from "@material-ui/icons/Person";
import PhoneIcon from "@material-ui/icons/Phone";
import WcIcon from "@material-ui/icons/Wc";
import SchoolIcon from "@material-ui/icons/School";
import SupervisorAccountIcon from "@material-ui/icons/SupervisorAccount";
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

function ProfileView(props) {
  const classes = useStyles();

  const { user } = props.auth;
  const updateAvatar = props.updateAvatar;

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
  return(
    <div className={classes.root}>
      <Grid container direction="column" alignItems="center" spacing={5}>
        <Grid item container direction="column" alignItems="center">
          {user.avatar && user.avatar !== undefined ?
            <Avatar
              src={`/api/uploads/image/${user.avatar}`}
              className={classes.avatar}
            />
            :
            <Avatar src={defaultAvatar} className={classes.avatar} />
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
        </Grid>
        <Grid item container spacing={4}>
          <Grid item>
            <Paper className={classes.paperBox}>
                <Typography variant="subtitle2">
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
                  <h4>Karir</h4>
                </Typography>
                <List>
                  <ProfileDataItem
                    profile_data_icon={<GamesIcon />}
                    profile_data_category="Hobi dan Minat"
                    profile_data_info={user.hobi_minat}
                  />
                  <ProfileDataItem
                    profile_data_icon={<BookIcon />}
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

ProfileView.propTypes = {
    auth: PropTypes.object.isRequired,
    updateAvatar: PropTypes.func.isRequired
  }

const mapStateToProps = (state) => ({
    auth: state.auth
  });

export default connect(
    mapStateToProps, {updateAvatar}
  ) (ProfileView);