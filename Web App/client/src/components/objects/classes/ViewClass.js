import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { viewOneClass } from "../../../actions/ClassActions"
import { Avatar, Box, Button, Divider, ExpansionPanel, ExpansionPanelSummary, Paper,
   List, ListItem, ListItemAvatar, ListItemSecondaryAction, ListItemText,
   Tabs, Tab, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import BallotIcon from "@material-ui/icons/Ballot";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import DesktopWindowsIcon from "@material-ui/icons/DesktopWindows";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
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
  paperBox: {
    padding: "20px",
  },
  lookAllButtonContainer: {
    display: "flex",
    justifyContent: "flex-end",
    padding: "5px",
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

function ViewClass(props) {
  const classes = useStyles();
  const { viewOneClass, classesCollection } = props;

  if(classesCollection.name == undefined){
    viewOneClass(props.match.params.id)
    console.log("A")
  }

  const [value, setValue] = React.useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div className={classes.root}>
      <Paper>
        <Typography variant="h3" style={{textAlign: "center"}} gutterBottom>
          Kelas {classesCollection.name}
        </Typography>
        <Tabs
          value={value}
          onChange={handleChange}
          indicatorColor="primary"
          textColor="primary"
          centered
        >
          <Tab icon={<DesktopWindowsIcon />} label="Pekerjaan Kelas" {...TabIndex(0)} />
          <Tab icon={<BallotIcon />} label="Mata Pelajaran" {...TabIndex(1)} />
          <Tab icon={<SupervisorAccountIcon />} label="Peserta" {...TabIndex(2)} />
        </Tabs>
      </Paper>

      <TabPanel value={value} index={0}>
        <Paper className={classes.paperBox} style={{marginBottom: "40px"}}>
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
        </Paper>
      </TabPanel>

      <TabPanel value={value} index={1}>
        <ExpansionPanel>
          <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h5" className={classes.categoryTitle}>
              Fisika
            </Typography>
          </ExpansionPanelSummary>
          <Divider />
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
          <div className={classes.lookAllButtonContainer}>
            <Button endIcon={<ChevronRightIcon />} href="/viewsubject">
              Lihat Semua
            </Button>
          </div>
        </ExpansionPanel>
      </TabPanel>

      <TabPanel value={value} index={2}>
      <Paper className={classes.paperBox} style={{marginBottom: "40px"}}>
          <Typography variant="h4" gutterBottom>
            Walikelas
          </Typography>
          <Divider style={{backgroundColor: "#2196f3"}} />
          <List className={classes.listContainer}>
            <PersonListItem
              person_avatar=""
              person_profile_link="/test"
              person_name={classesCollection.walikelas ? classesCollection.walikelas.name : null}
              person_role={classesCollection.walikelas ? classesCollection.walikelas.subject_teached : null}
            />
            <PersonListItem
              person_avatar=""
              person_profile_link="/test"
              person_name="Mr Nigga"
              person_role="Racism Teacher"
            />
          </List>
        </Paper>

        <Paper className={classes.paperBox}>
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
        </Paper>
      </TabPanel>
    </div>
  )
};

ViewClass.propTypes = {
  classesCollection: PropTypes.object.isRequired,
  viewOneClass: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired
}

const mapStateToProps = (state) => ({
  auth: state.auth,
  classesCollection: state.classesCollection
});

export default connect(
  mapStateToProps, {viewOneClass} 
) (ViewClass);
