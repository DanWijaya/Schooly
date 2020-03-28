//IMPORT COMPONENTS
  //Basic Components and Styling Components
  import React, { Component } from "react";
  import SwipeableViews from "react-swipeable-views";
  import "./Profile.css";
  import DefaultAvatar from "./default-avatar.jpg";
  import PropTypes from "prop-types";
  import { AppBar, Typography, Box, Tabs, Tab, Grid, Paper } from "@material-ui/core";
  import { makeStyles, useTheme } from "@material-ui/core/styles";
  import PhoneIcon from '@material-ui/icons/Phone';
  import FavoriteIcon from '@material-ui/icons/Favorite';
  import PersonPinIcon from '@material-ui/icons/PersonPin';
  
  //For working with Reducers
  import { connect } from "react-redux";

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
  
  function Profile(props) {
      const classes = useStyles();
      const theme = useTheme();
      const [value, setValue] = React.useState(0);
      const handleChange = (event, newValue) => {
        setValue(newValue);
      };
      const handleChangeIndex = index => {
        setValue(index);
      };
      
      // Get the user from Reducer. 
      const { user } = props.auth;
      console.log(user)
      return(
          <div className="root">
            <Grid className="profile-grid"
              container
              spacing={1}
            >
                <Grid item xs={5}>
                  <Paper>
                    <img
                      src={DefaultAvatar}
                      alt="avatar"
                      className="avatar"
                    />
                    <br/>
                    Insert Profile Picture Here
                  </Paper>
                </Grid>
                <Grid item xs={7}>
                  <Paper>
                    <h1>{user.name}</h1>
                    <p>
                      High School Student
                        <br/><br/>
                      Class XA
                    </p>
                  </Paper>
                </Grid>
                <Grid item xs={5}>
                  <Paper>
                  <h1>Contacts</h1>
                    Phone Number: 69696969<br/>
                    Email: leonardustot@gmail.com<br/>
                    Instagram: leonardotot<br/>
                    Facebook: Bapak kau<br/>
                  <h1>Address</h1>
                    Jalan biologytot<br/>
                  </Paper>
                </Grid>
                <Grid item xs={7}>
                  <AppBar position="static" color="default">
                    <Tabs
                      value={value}
                      onChange={handleChange}
                      indicatorColor="primary"
                      textColor="primary"
                      variant="fullWidth"
                      aria-label="full width tabs example"
                    >
                      <Tab label="Item One" icon={<PhoneIcon />} {...a11yProps(0)} />
                      <Tab label="Item Two" icon={<FavoriteIcon />} {...a11yProps(1)} />
                      <Tab label="Item Three" icon={<PersonPinIcon />} {...a11yProps(2)} />
                    </Tabs>
                  </AppBar>
                  <SwipeableViews
                    axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
                    index={value}
                    onChangeIndex={handleChangeIndex}
                  >
                    <TabPanel value={value} index={0} dir={theme.direction}>
                      Budi
                    </TabPanel>
                    <TabPanel value={value} index={1} dir={theme.direction}>
                      Sok Tjeng
                    </TabPanel>
                    <TabPanel value={value} index={2} dir={theme.direction}>
                      Daniel Lau cek kong
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