//IMPORT COMPONENTS
  //Basic Components and Styling Components
import React, { Component } from "react";
import classnames from "classnames";
import './Profile.css'

 //Third Function Components

//Grid Components
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';

class Profile extends Component {
  render() {
    document.body.classList.add('profile-grid');
    return(
      <div>
        <br/><br/><br/><br/>
        <div>
        <Grid>
          <Grid item xc={12}>
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/7/7e/Circle-icons-profile.svg"
                alt="avatar"
                className="avatar-img"
              />
          </Grid>
          <Grid item xs={6}>
            xs=6
          </Grid>
          <Grid item xs={6}>
            <Paper>xs=6</Paper>
          </Grid>
          <Grid item xs={3}>
            <Paper>xs=3</Paper>
          </Grid>
          <Grid item xs={3}>
            <Paper>xs=3</Paper>
          </Grid>
          <Grid item xs={3}>
            <Paper>xs=3</Paper>
          </Grid>
          <Grid item xs={3}>
            <Paper>xs=3</Paper>
          </Grid>
        </Grid>
        </div>
      </div>
    )
  }
}

export default Profile;
