import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { viewOneClass } from "../../../actions/ClassActions"
import { viewOneTask } from "../../../actions/TaskActions"
import { getTaskFilesByUser } from "../../../actions/UploadActions"
import { getStudentsByClass } from "../../../actions/UserActions"
import { Avatar, Box, Button, Divider, ExpansionPanel, ExpansionPanelSummary, Paper,
   List, ListItem, ListItemAvatar, ListItemSecondaryAction, ListItemText,
   Tabs, Tab, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

const useStyles = makeStyles({
  root: {
    margin: "auto",
    maxWidth: "750px",
  },
  categoryTitle: {
    color: "#2196F3"
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
        <Avatar src={props.person_avatar}/>
          {/* {props.person_avatar} */}
        {/* </Avatar> */}
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

function ViewTaskListTeacher(props) {
  const classes = useStyles();
  const { viewOneClass, tasksCollection, classesCollection, getStudentsByClass} = props;
  const {all_students} = props.auth;
  const {id} = props.match.params;

  React.useEffect(() => {
    viewOneTask(id)
  })
  console.log(tasksCollection)
  // COba pakai React.useEffect
  // if(classesCollection.name == undefined){
  //   viewOneClass(props.match.params.id)
  // }

  // if(all_students.length == 0){
  //   getStudentsByClass(props.match.params.id)
  // }

  console.log(all_students)
  const [value, setValue] = React.useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div className={classes.root}>
      <Paper>
        <Typography variant="h3" style={{textAlign: "center"}} gutterBottom>
          Tugas bla bla bla
        </Typography>
        <Tabs
          value={value}
          onChange={handleChange}
          indicatorColor="primary"
          textColor="primary"
          centered
        >
          <Tab label="Kelas 1" {...TabIndex(0)} />
          <Tab label="Kelas 2" {...TabIndex(1)} />
          <Tab label="Kelas 3" {...TabIndex(2)} />
        </Tabs>
      </Paper>

      <TabPanel value={value} index={0}>
          <ExpansionPanel>
            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
              <Avatar />
              <Typography>
                Orang 1
              </Typography>
            </ExpansionPanelSummary>
            <Divider />
            <List className={classes.expansionPanelList}>
              <WorkListItem
                work_title="Tugas Fisika"
                work_category_avatar=""
                work_status="PDF"
                work_link="/test"
              />
              <WorkListItem
                work_title="Tugas Biologi"
                work_category_avatar=""
                work_status="WORD"
                work_link="/test"
              />
            </List>
          </ExpansionPanel>
      </TabPanel>

      <TabPanel value={value} index={1}>
      </TabPanel>

      <TabPanel value={value} index={2}>
      </TabPanel>
    </div>
  )
};

ViewTaskListTeacher.propTypes = {
  classesCollection: PropTypes.object.isRequired,
  getStudentsByClass: PropTypes.object.isRequired,
  tasksCollection: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,

  viewOneClass: PropTypes.func.isRequired,
  getStudentsByClass: PropTypes.func.isRequired,
  getTaskFilesByUser:PropTypes.func.isRequired,
  viewOneTask: PropTypes.func.isRequired
}

const mapStateToProps = (state) => ({
  auth: state.auth,
  tasksCollection: state.tasksCollection,
  classesCollection: state.classesCollection
});

export default connect(
  mapStateToProps, {viewOneClass, getStudentsByClass, 
    getTaskFilesByUser, viewOneTask}
) (ViewTaskListTeacher);
