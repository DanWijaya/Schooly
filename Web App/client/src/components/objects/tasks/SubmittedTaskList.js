import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { viewOneClass } from "../../../actions/ClassActions"
import { viewOneTask } from "../../../actions/TaskActions"
import { getTaskFilesByUser } from "../../../actions/UploadActions"
import { getStudentsByClass } from "../../../actions/UserActions"
import { Avatar, Box, Button, Divider, ExpansionPanel, ExpansionPanelSummary, IconButton, Paper,
   List, ListItem, ListItemAvatar, ListItemIcon, ListItemText, Tabs, Tab, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import CloudDownloadIcon from "@material-ui/icons/CloudDownload";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import GetAppIcon from "@material-ui/icons/GetApp";

const useStyles = makeStyles((theme) => ({
  root: {
    margin: "auto",
    maxWidth: "1000px",
    padding: "10px",
  },
  studentFileListContainer: {
    margin: "20px",
  },
  personListContainer: {
    display: "flex",
    alignItems: "center",
    padding: "5px",
  },
  listItemPaper: {
    marginBottom: "10px"
  },
  listItem: {
    "&:focus, &:hover": {
      backgroundColor: theme.palette.button.main,
    },
  },
  downloadAllButton: {
    backgroundColor: "white",
    color: theme.palette.primary.main,
    "&:focus, &:hover": {
      backgroundColor: theme.palette.primary.main,
      color: "white",
    }
  },
}));

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
  const classes = useStyles();

  return (
    <Paper variant="outlined" className={classes.listItemPaper}>
      <ListItem button className={classes.listItem}>
        <ListItemAvatar>
          <Avatar>
            {props.work_fileicon}
          </Avatar>
        </ListItemAvatar>
        <ListItemText
          primary={
            <Typography>
              {props.work_filename}
            </Typography>
          }
          secondary={
            <Typography variant="caption" color="textSecondary">
              {props.work_filetype}
            </Typography>
          }
        />
        <ListItemIcon>
          <IconButton>
            <CloudDownloadIcon />
          </IconButton>
        </ListItemIcon>
      </ListItem>
    </Paper>
  )
}

function SubmittedTaskList(props) {
  document.title = "Schooly | Daftar Tugas Terkumpul"
  const classes = useStyles();
  const { viewOneClass, viewOneTask, tasksCollection, classesCollection, getStudentsByClass} = props;
  const {all_students} = props.auth;
  const task_id = props.match.params.id;

  React.useEffect(() => {
    viewOneTask(task_id)
    console.log(tasksCollection)
  }, [tasksCollection._id])

  const [value, setValue] = React.useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const listClassAssigned = () => {
    let class_assigned = []
    if(!tasksCollection.class_assigned){
      return null;
    }else {
      for (var i = 0; i < tasksCollection.class_assigned.length; i++){
        class_assigned.push(<Tab label={tasksCollection.class_assigned[i].name} {...TabIndex(i)}/>)
      }
      return class_assigned;
    }
  }
  return (
    <div className={classes.root}>
      <Paper>
        <Typography variant="h4" style={{textAlign: "center"}} gutterBottom>
        <b>{tasksCollection.name}</b>
        </Typography>
        <Tabs
          value={value}
          onChange={handleChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
        >
          {listClassAssigned()}
        </Tabs>
      </Paper>
      <TabPanel value={value} index={0}>
          <ExpansionPanel>
            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
              <div className={classes.personListContainer}>
                <Avatar style={{marginRight: "10px"}} />
                <Typography variant="h6">
                  Orang 1
                </Typography>
              </div>
            </ExpansionPanelSummary>
            <Divider />
            <div className={classes.studentFileListContainer}>
              <List>
                <WorkListItem
                  work_filename="Tugas Fisika"
                  work_fileicon=""
                  work_filetype="PDF"
                />
                <WorkListItem
                  work_filename="Tugas Biologi"
                  work_fileicon=""
                  work_filetype="WORD"
                />
              </List>
              <div style={{display: "flex", justifyContent: "flex-end"}}>
                <Button
                  variant="outlined"
                  startIcon={<GetAppIcon />}
                  className={classes.downloadAllButton}
                >
                  Unduh Semua
                </Button>
              </div>
            </div>
          </ExpansionPanel>
      </TabPanel>
      <TabPanel value={value} index={1}>
      </TabPanel>
      <TabPanel value={value} index={2}>
      </TabPanel>
    </div>
  )
};

SubmittedTaskList.propTypes = {
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
) (SubmittedTaskList);
