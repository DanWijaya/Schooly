//IMPORT COMPONENTS
  //Basic Components and Styling Components
import React, { Component } from "react";
import SwipeableViews from "react-swipeable-views";
import "./Profile.css";
import DefaultAvatar from "./default-avatar.jpg";
import PropTypes from "prop-types";
import { AppBar, Typography, Box, Tabs, Tab, Grid, Paper } from "@material-ui/core";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Rating from '@material-ui/lab/Rating';
import BusinessCenterIcon from '@material-ui/icons/BusinessCenter';
import DescriptionIcon from '@material-ui/icons/Description';
import AccountBoxIcon from '@material-ui/icons/AccountBox';

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

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.background.paper,
    width: 500,
  },
}));

function Profile() {
    const classes = useStyles();
    const theme = useTheme();
    const [value, setValue] = React.useState(0);
    const handleChange = (event, newValue) => {
      setValue(newValue);
    };
    const handleChangeIndex = index => {
      setValue(index);
    };

    return(
        <div className="root">
          <Grid container spacing={1} className="profile-grid">
              <Grid item xs={4}>
                <Paper>
                  <img src={DefaultAvatar} alt="avatar" className="avatar" />
                  <br/>
                </Paper>
              </Grid>
              <Grid item xs={8} className="right-grid">
                <Paper>
                  <h1>Leonardus Leonard</h1>
                  <h4>High School Student</h4> <br />
                  Class XA <br />
                  <Rating name="read-only" value={5} readOnly /> <br /><br />
                  <button>Edit Profile</button>
                </Paper>
              </Grid>
              <Grid item xs={4}>
                <Paper>
                <h3>Contacts</h3>
                  Email: <br />
                  Phone Number: <br/>
                  Instagram: <br/>
                  Spotify: <br/>
                <h3>Address</h3>
                  Insert Adress Here<br/>
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
                    aria-label="full width tabs example"
                  >
                    <Tab label="Biography" icon={<DescriptionIcon />} {...a11yProps(0)} />
                    <Tab label="Career Path" icon={<BusinessCenterIcon />} {...a11yProps(1)} />
                    <Tab label="About" icon={<AccountBoxIcon />} {...a11yProps(2)} />
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

export default Profile;
