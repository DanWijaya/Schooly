import React from "react";
import PropTypes from "prop-types";
import { Avatar, Box, Grid, Paper, Link, List, ListItem, Tabs, Tab, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import DesktopWindowsIcon from "@material-ui/icons/DesktopWindows";
import PersonIcon from "@material-ui/icons/Person";
import SupervisorAccountIcon from "@material-ui/icons/SupervisorAccount";

const useStyles = makeStyles({
  tabInfo: {
    "&:focus": {
      backgroundColor: "transparent",
    },
  },
});

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function TabIndex(index) {
  return {
    id: `simple-tab-${index}`,
  };
}

function PersonListItem(props) {
  const classes = useStyles();

  return (
    <ListItem>
      <div>
        <Avatar>
          {props.person_avatar}
        </Avatar>
      </div>
      <Typography>
        <Link href={props.person_profile_link}>
          {props.person_name}
        </Link>
      </Typography>
      <Typography>
        {props.person_role}
      </Typography>
    </ListItem>

  )
}

function NewViewClass(props) {
  const classes = useStyles();

  const [value, setValue] = React.useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return(
    <div>
      <Paper>
        <Typography variant="h2" style={{textAlign: "center"}} gutterBottom>
          Kelas XA
        </Typography>
        <Tabs
          value={value}
          onChange={handleChange}
          indicatorColor="primary"
          textColor="primary"
          centered
        >
          <Tab disableRipple className={classes.tabInfo} icon={<DesktopWindowsIcon />} label="Pekerjaan Kelas" {...TabIndex(0)} />
          <Tab disableRipple className={classes.tabInfo} icon={<PersonIcon />} label="Guru" {...TabIndex(1)} />
          <Tab disableRipple className={classes.tabInfo} icon={<SupervisorAccountIcon />} label="Peserta" {...TabIndex(2)} />
        </Tabs>
      </Paper>
      <TabPanel value={value} index={0}>
        Item One
      </TabPanel>
      <TabPanel value={value} index={1}>
        <List style={{display: "flex", flexDirection: "column", alignItems: "center", width: "1000px"}}>
          <PersonListItem
            person_avatar=""
            person_profile_link="/test"
            person_name="Mr Fucker"
            person_role="student"
          />
          <PersonListItem
            person_avatar=""
            person_profile_link="/test"
            person_name="Mr Fucker"
            person_role="student"
          />
        </List>
      </TabPanel>
      <TabPanel value={value} index={2}>
        Item Three
      </TabPanel>
    </div>
  )
};

export default NewViewClass;
