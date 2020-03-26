//IMPORT COMPONENTS
  //Basic Components and Styling Components
import React, { Component } from "react";
import classnames from "classnames";
import "./Profile.css"
import DefaultAvatar from "./default-avatar.jpg"

  //Grid Components
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";

  //Tab Components
import PropTypes from "prop-types";
import { AppBar, Tabs, Tab, Paper } from "@material-ui/core";

  //Icons
import PhoneIcon from "@material-ui/icons/Phone";
import FavoriteIcon from '@material-ui/icons/Favorite';
import PersonPinIcon from '@material-ui/icons/PersonPin';

class Profile extends Component {
  render() {
    // document.body.classList.add('profile-grid');

    return(
          <Grid
            className="profile-grid"
            container spacing={1} justify="center"
          >
              <Grid item xs={5}>
                <Paper><div>
                  <img
                    src={DefaultAvatar}
                    alt="avatar"
                    className="avatar"
                  />
                  <br/>
                  Insert Profile Picture Here
                </div></Paper>
              </Grid>
              <Grid item xs={7}><Paper>
                <div>
                  <h1>Leonardus Leonard</h1>
                  <p>
                    High School Student
                      <br/><br/>
                    Class XA
                  </p>
                </div></Paper>
              </Grid>
              <Grid item xs={5}><Paper>
                <h1>Contacts</h1>
                  Phone Number: 69696969<br/>
                  Instagram: leonardtot<br/>
                  Faecbook:Bapak kau<br/>
                  Twitter: XXX<br/>
                <h1>Address</h1>
                  Jalan biologytot<br/></Paper>
              </Grid>
              <Grid item xs={7}><Paper>
                <AppBar position="static">
                  <Tabs
                    indicatorColor="white"
                    textColor="blue"
                    >
                    <Tab icon={<PhoneIcon />} label="School Agenda" />
                    <Tab icon={<FavoriteIcon />} label="Extracurriculum Agenda" />
                    <Tab icon={<PersonPinIcon />} label="Class History" />
                  </Tabs>
                </AppBar></Paper>
              </Grid>
          </Grid>
    )
  }
}

export default Profile;
