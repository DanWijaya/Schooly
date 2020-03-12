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
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";

  //Icons
import PhoneIcon from "@material-ui/icons/Phone";
import FavoriteIcon from '@material-ui/icons/Favorite';
import PersonPinIcon from '@material-ui/icons/PersonPin';

class Profile extends Component {
  render() {
    // document.body.classList.add('profile-grid');

    return(
        <div style={{width: "100%", margin: "auto"}}>
          <Grid
            className="profile-grid"
            container
              spacing={4}
              justify="center"
          >
              <Grid item xs={5}>
                <img
                  src={DefaultAvatar}
                  alt="avatar"
                  className="avatar"
                />
                <br/>
                Insert Profile Picture Here
              </Grid>
              <Grid item xs={7}>
                <div>
                  <h1>Leonardus Leonard</h1>
                  <p>
                    High School Student
                      <br/><br/>
                    Class XA
                  </p>
                </div>
              </Grid>
              <Grid item xs={5}>
                <h1>Contacts</h1>
                  Phone Number: 69696969
                  Instagram: leonardtot
                  Faecbook:Bapak kau
                  Twitter: XXX
                <h1>Adress</h1>
                  Jalan biologytot
              </Grid>
              <Grid item xs={7}>
                <AppBar position="static">
                  <Tabs
                    variant="auto"
                    indicatorColor="white"
                    textColor="blue"
                    >
                    <Tab icon={<PhoneIcon />} label="School Agenda" />
                    <Tab icon={<FavoriteIcon />} label="Extracurriculum Agenda" />
                    <Tab icon={<PersonPinIcon />} label="Class History" />
                  </Tabs>
                </AppBar>
              </Grid>
          </Grid>
        </div>
    )
  }
}

export default Profile;
