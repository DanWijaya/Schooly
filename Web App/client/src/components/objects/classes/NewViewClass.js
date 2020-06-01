import React from "react";
import PropTypes from "prop-types";
import { Avatar, Box, Divider, ExpansionPanel, ExpansionPanelSummary, ExpansionPanelDetails,
   Grid, Paper, Link, List, ListItem, ListItemAvatar, ListItemSecondaryAction, ListItemText,
   Tabs, Tab, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import BallotIcon from "@material-ui/icons/Ballot";
import DesktopWindowsIcon from "@material-ui/icons/DesktopWindows";
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import SupervisorAccountIcon from "@material-ui/icons/SupervisorAccount";

const useStyles = makeStyles({
  root: {
    margin: "auto",
    maxWidth: "750px",
  },
  categoryTitle: {
    color: "#2196f3"
  },
  expansionPanelList: {
    marginLeft: "20px",
    marginRight: "15px",
    marginBottom: "10px",
  },
  tabInfo: {
    "&:focus": {
      backgroundColor: "transparent",
    },
  },
  personList: {
    marginBottom: "40px"
  }
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

function WorkListItem(props) {
  return (
    <ListItem button component="a" href={props.work_link}>
      <ListItemAvatar>
        <Avatar>
          {props.work_category_avatar}
        </Avatar>
      </ListItemAvatar>
      <ListItemText
        primary={
          <Typography variant="h6">
            {props.work_title}
          </Typography>
        }
        secondary={props.work_sender}
      />
      <ListItemSecondaryAction>
        <Typography>
          {props.work_status}
        </Typography>
      </ListItemSecondaryAction>
    </ListItem>
  )
}

function PersonListItem(props) {
  return (
    <ListItem button component="a" href={props.person_profile_link}>
      <ListItemAvatar>
        <Avatar>
          {props.person_avatar}
        </Avatar>
      </ListItemAvatar>
      <ListItemText
        primary={
          <Typography variant="h6">
            {props.person_name}
          </Typography>
        }
      />
      <ListItemSecondaryAction>
        <Typography>
          {props.person_role}
        </Typography>
      </ListItemSecondaryAction>
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
    <div className={classes.root}>
      <Paper>
        <Typography variant="h3" style={{textAlign: "center"}} gutterBottom>
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
          <Tab disableRipple className={classes.tabInfo} icon={<BallotIcon />} label="Mata Pelajaran" {...TabIndex(1)} />
          <Tab disableRipple className={classes.tabInfo} icon={<SupervisorAccountIcon />} label="Peserta" {...TabIndex(2)} />
        </Tabs>
      </Paper>

      <TabPanel value={value} index={0}>
        <List>
          <WorkListItem
            work_title="Tugas Fisika"
            work_category_avatar=""
            work_sender="Mr Jenggot"
            work_status="Telah Dikumpulkan"
            work_link="/test"
          />
          <WorkListItem
            work_title="Tugas Biologi"
            work_category_avatar=""
            work_sender="Mr Jenggot"
            work_status="Belum Dikumpulkan"
            work_link="/test"
          />
        </List>
      </TabPanel>

      <TabPanel value={value} index={1}>
        <ExpansionPanel>
          <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h5" className={classes.categoryTitle}>
              Fisika
            </Typography>
          </ExpansionPanelSummary>
            <List className={classes.expansionPanelList}>
              <WorkListItem
                work_title="Tugas Fisika"
                work_category_avatar=""
                work_sender="Mr Jenggot"
                work_status="Telah Dikumpulkan"
                work_link="/test"
              />
              <WorkListItem
                work_title="Tugas Biologi"
                work_category_avatar=""
                work_sender="Mr Jenggot"
                work_status="Belum Dikumpulkan"
                work_link="/test"
              />
            </List>
        </ExpansionPanel>
      </TabPanel>

      <TabPanel value={value} index={2}>
        <div className={classes.personList}>
          <Typography variant="h4" gutterBottom>
            Murid
          </Typography>
          <Divider style={{backgroundColor: "#2196f3"}} />
          <List className={classes.listContainer}>
            <PersonListItem
              person_avatar=""
              person_profile_link="/test"
              person_name="Mr Fucker"
              person_role="Student"
            />
            <PersonListItem
              person_avatar=""
              person_profile_link="/test"
              person_name="Mr Fucker"
              person_role="Student"
            />
          </List>
        </div>
        <div className={classes.personList}>
          <Typography variant="h4" gutterBottom>
            Guru
          </Typography>
          <Divider style={{backgroundColor: "#2196f3"}} />
          <List className={classes.listContainer}>
            <PersonListItem
              person_avatar=""
              person_profile_link="/test"
              person_name="Mr Fucker"
              person_role="Fucking Teacher"
            />
            <PersonListItem
              person_avatar=""
              person_profile_link="/test"
              person_name="Mr Nigga"
              person_role="Racism Teacher"
            />
          </List>
        </div>
      </TabPanel>
    </div>
  )
};

export default NewViewClass;
