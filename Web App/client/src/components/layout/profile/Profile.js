import React, { Component } from "react";
import SwipeableViews from "react-swipeable-views";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { AppBar, Avatar, Button, Box, Tabs, Tab, Grid, Paper, Typography } from "@material-ui/core";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import AccountBoxIcon from '@material-ui/icons/AccountBox';
import BusinessCenterIcon from '@material-ui/icons/BusinessCenter';
import DescriptionIcon from '@material-ui/icons/Description';
import defaultAvatar from "./DefaultAvatar.jpg";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    maxWidth: "1200px",
    margin: "auto",
    marginTop: "30px", //Should be deleted after theme passing from navbar worked
  },
  paperBox: {
    padding: "5px",
  },
}));

function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && <Box p={3}>{children}</Box>}
    </Typography>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function TabPanelPage(index) {
  return {
    id: `full-width-tab-${index}`,
    'aria-controls': `full-width-tabpanel-${index}`,
  };
}

function Profile(props) {

  const theme = useTheme();
  const [value, setValue] = React.useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const handleChangeIndex = (index) => {
    setValue(index);
  };
  const { user } = props.auth;

  const classes = useStyles();
  return(
    <div className={classes.root}>
      <Grid container spacing={2} className="profile-grid">
          <Grid item xs={4} >
            <Paper className={classes.paperBox}>
              <img src={defaultAvatar} style={{width: "300px", height: "300px" }}/>
            </Paper>
          </Grid>
          <Grid item xs={8} className="right-grid">
            <Paper className={classes.paperBox}>
              <h1>{ user.name }</h1>
              <h4>High School {user.role} </h4> <br />
              Class XA <br />
              {/* <Rating name="read-only" value={4} readOnly /><br /><br />  */}
              <button>Edit Profile</button>
            </Paper>
          </Grid>
          <Grid item xs={4}>
            <Paper className={classes.paperBox}>
            <h3>Contacts</h3>
              Email: {user.email}<br />
              Phone Number: {user.phone} <br/>
              Emergency Phone number: {user.emergency_phone}<br/>
            <h3>Address </h3>
            </Paper>
          </Grid>
          <Grid item xs={8}>
            <AppBar position="static" color="default">
              <Tabs
                value={value}
                onChange={handleChange}
                indicatorColor="primary"
                textColor="primary"
                variant="fullWidth"
              >
                <Tab label="Biography" icon={<DescriptionIcon />} {...TabPanelPage(0)} />
                <Tab label="Career Path" icon={<BusinessCenterIcon />} {...TabPanelPage(1)} />
                <Tab label="About" icon={<AccountBoxIcon />} {...TabPanelPage(2)} />
              </Tabs>
            </AppBar>
            <SwipeableViews
              axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
              index={value}
              onChangeIndex={handleChangeIndex}
            >
              <TabPanel value={value} index={0} dir={theme.direction}>
                My name is Budi bla bla bla bla
              </TabPanel>
              <TabPanel value={value} index={1} dir={theme.direction}>
                Excels at: <br />
                Dream Occupation: <br />
                Universities I'm Interested at: <br />
              </TabPanel>
              <TabPanel value={value} index={2} dir={theme.direction}>
                Gender: <br />
                Birthday: <br />
                Hobbies and Interests: <br />
                Extracurricular Skills: <br />
              </TabPanel>
            </SwipeableViews>
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
