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
    <List>
      <ListItem>
          <ListItemAvatar>
            <Avatar>
              {props.profileDataIcon}
            </Avatar>
          </ListItemAvatar>
            <Grid container>
              <Grid item xs={4}>
                <Typography variant="button">
                  {props.profileDataCategory}
                </Typography>
              </Grid>
              <Grid item xs>
                {props.profileDataInfo}
              </Grid>
            </Grid>
          <ListItemSecondaryAction>
            <IconButton edge="end">
              <ArrowRightIcon style={{color: "#2196f3"}} />
            </IconButton>
          </ListItemSecondaryAction>
      </ListItem>
    </List>
  )
}

function Profile(props) {

  const { user } = props.auth;
  const classes = useStyles();

  return(
    <div className={classes.root}>
      <Grid container direction="column" alignItems="center" spacing={5}>
        <Grid item container direction="column" alignItems="center">
          <Avatar src={defaultAvatar} className={classes.avatar} />
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
                  <h4>Personal Info</h4>
                </Typography>
                <ProfileData
                  profileDataIcon={<PersonIcon />}
                  profileDataCategory="Name"
                  profileDataInfo={user.name}
                />
                <ProfileData
                  profileDataIcon={<CakeIcon />}
                  profileDataCategory="Birthday"
                  profileDataInfo="fucker"
                />
                <ProfileData
                  profileDataIcon={<WcIcon />}
                  profileDataCategory="Gender"
                  profileDataInfo="Nigga"
                />
                <ProfileData
                  profileDataIcon={<LockIcon />}
                  profileDataCategory="Password"
                  profileDataInfo="Nigga"
                />
            </Paper>
          </Grid>
          <Grid item>
            <Paper className={classes.paperBox}>
                <Typography variant="subtitle2" gutterBottom>
                  <h4>Contact Info</h4>
                </Typography>
                <ProfileData
                  profileDataIcon={<EmailIcon />}
                  profileDataCategory="Email"
                  profileDataInfo={user.email}
                />
                <ProfileData
                  profileDataIcon={<PhoneIcon />}
                  profileDataCategory="Phone Number"
                  profileDataInfo={user.phone}
                />
                <ProfileData
                  profileDataIcon={<SupervisorAccountIcon />}
                  profileDataCategory="Emergency Phone Number"
                  profileDataInfo={user.emergency_phone}
                />
                <ProfileData
                  profileDataIcon={<HomeIcon />}
                  profileDataCategory="Address"
                  profileDataInfo={user.address}
                />
            </Paper>
          </Grid>
          <Grid item>
            <Paper className={classes.paperBox}>
                <Typography variant="subtitle2" gutterBottom>
                  <h4>Other Info</h4>
                </Typography>
                <ProfileData
                  profileDataIcon={<GamesIcon />}
                  profileDataCategory="Hobbies and Interest"
                  profileDataInfo="Killin, fuckin, and rapin"
                />
                <ProfileData
                  profileDataIcon={<BookIcon />}
                  profileDataCategory="Extracurricular Skills"
                  profileDataInfo="fuckin"
                />
                <ProfileData
                  profileDataIcon={<WorkIcon />}
                  profileDataCategory="Dream Job"
                  profileDataInfo="fucker"
                />
                <ProfileData
                  profileDataIcon={<SchoolIcon />}
                  profileDataCategory="Universities I'm Interested at"
                  profileDataInfo="fucker university"
                />
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
    mapStateToProps
  ) (Profile);
