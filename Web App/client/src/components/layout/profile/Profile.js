import React, { Component } from "react";
import SwipeableViews from "react-swipeable-views";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { AppBar, Avatar, Button, Box, Tabs, Tab, Grid, IconButton, List, ListItem, ListItemText,
   ListItemIcon, ListItemAvatar, ListItemSecondaryAction, Paper, Typography } from "@material-ui/core";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import AccountBoxIcon from '@material-ui/icons/AccountBox';
import ArrowRightIcon from '@material-ui/icons/ArrowRight';
import BusinessCenterIcon from '@material-ui/icons/BusinessCenter';
import BookIcon from '@material-ui/icons/Book';
import CakeIcon from '@material-ui/icons/Cake';
import DescriptionIcon from '@material-ui/icons/Description';
import EmailIcon from '@material-ui/icons/Email';
import GamesIcon from '@material-ui/icons/Games';
import HomeIcon from '@material-ui/icons/Home';
import LockIcon from '@material-ui/icons/Lock';
import PersonIcon from '@material-ui/icons/Person';
import PhoneIcon from '@material-ui/icons/Phone';
import WcIcon from '@material-ui/icons/Wc';
import SchoolIcon from '@material-ui/icons/School';
import SupervisorAccountIcon from '@material-ui/icons/SupervisorAccount';
import WorkIcon from '@material-ui/icons/Work';
import defaultAvatar from "./DefaultAvatar.jpg";
import AddAPhotoIcon from '@material-ui/icons/AddAPhoto';
import './Profile.css'
import {Link} from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: "750px",
    margin: "auto",
    marginTop: "30px", //Should be deleted after theme passing from navbar worked
  },
  avatar: {
    width: theme.spacing(20),
    height: theme.spacing(20),
  },
  paperBox: {
    width: "750px",
    paddingTop: "20px",
    paddingBottom: "10px",
    paddingLeft: "17.5px",
    paddingRight: "17.5px",
  }

}));

function ProfileData(props) {
  return(
    <ListItem>
        <ListItemAvatar>
          <Avatar>
            {props.profile_data_icon}
          </Avatar>
        </ListItemAvatar>
          <Grid container>
            <Grid item xs={4}>
              <Typography variant="button">
                {props.profile_data_category}
              </Typography>
            </Grid>
            <Grid item xs>
              {props.profile_data_info}
            </Grid>
          </Grid>
        <ListItemSecondaryAction>
          <IconButton edge="end">
            <ArrowRightIcon  className="arrowBtn" style={{color: "#2196f3"}} />
          </IconButton>
        </ListItemSecondaryAction>
    </ListItem>
  )
}

function Profile(props) {

  const { user } = props.auth;
  const classes = useStyles();

  return(
    <div className={classes.root}>
      <Grid container direction="column" alignItems="center" spacing={5}>
        <Grid item container direction="column" alignItems="center">
          {user.avatar ? 
          <Avatar src={`/api/uploads/image/${user.avatar}`} className={classes.avatar}/> : 
          <Avatar src={defaultAvatar} className={classes.avatar}/>}

          <Link to="/image-upload"><AddAPhotoIcon type="button"/></Link>
          <br/>

          <Typography variant="subtitle2">
            <h2>{user.name}</h2>
          </Typography>
          <Typography>
            "School Name" High School {user.role}
          </Typography>
          <Typography>
            Class XA
          </Typography>
        </Grid>
        <Grid item container spacing={4}>
          <Grid item>
            <Paper className={classes.paperBox}>
                <Typography variant="subtitle2" gutterBottom>
                  <h4>Informasi Pribadi</h4>
                </Typography>
                <List>
                  <ProfileData
                    profile_data_icon={<PersonIcon />}
                    profile_data_category="Nama"
                    profile_data_info={user.name}
                  />
                  <ProfileData
                    profile_data_icon={<CakeIcon />}
                    profile_data_category="Tanggal Lahir"
                    profile_data_info="fucker"
                  />
                  <ProfileData
                    profile_data_icon={<WcIcon />}
                    profile_data_category="Jenis Kelamin"
                    profile_data_info="Nigga"
                  />
                  <ProfileData
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
                  <ProfileData
                    profile_data_icon={<EmailIcon />}
                    profile_data_category="Email"
                    profile_data_info={user.email}
                  />
                  <ProfileData
                    profile_data_icon={<PhoneIcon />}
                    profile_data_category="Nomor Telp."
                    profile_data_info={user.phone}
                  />
                  <ProfileData
                    profile_data_icon={<SupervisorAccountIcon />}
                    profile_data_category="Nomor Telp. Darurat"
                    profile_data_info={user.emergency_phone}
                  />
                  <ProfileData
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
                  <h4>Informasi lainnya</h4>
                </Typography>
                <List>
                  <ProfileData
                    profile_data_icon={<GamesIcon />}
                    profile_data_category="Hobi dan minat"
                    profile_data_info="Killin, fuckin, and rapin"
                  />
                  <ProfileData
                    profile_data_icon={<BookIcon />}
                    profile_data_category="Skill Extrakurikuler"
                    profile_data_info="fuckin"
                  />
                  <ProfileData
                    profile_data_icon={<WorkIcon />}
                    profile_data_category="Cita Cita"
                    profile_data_info="fucker"
                  />
                  <ProfileData
                    profile_data_icon={<SchoolIcon />}
                    profile_data_category="Perguruan Tinggi yang saya minati"
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

  }

const mapStateToProps = (state) => ({
    auth: state.auth
  });

export default connect(
    mapStateToProps, 
  ) (Profile);