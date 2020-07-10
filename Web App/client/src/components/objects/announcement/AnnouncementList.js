import React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import StandardTextField from "../../misc/text-field/StandardTextField";
import { Avatar, Fab, Grid, IconButton, List, ListItem, ListItemAvatar, ListItemText, Paper, Typography } from "@material-ui/core";
import { makeStyles, ThemeProvider } from "@material-ui/core/styles";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import AnnouncementIcon from "@material-ui/icons/Announcement";
import SearchIcon from "@material-ui/icons/Search";
import { getAllAnnouncements, getAnnouncement} from "../../../actions/AnnouncementActions"
import { getUsers } from "../../../actions/UserActions";
import moment from "moment";
import "moment/locale/id";
import PropTypes from "prop-types";
import { setCurrentClass } from "../../../actions/ClassActions";

const useStyles = makeStyles((theme) => ({
  root: {
    margin: "auto",
    maxWidth: "1000px",
    padding: "10px",
  },
  listItemPaper: {
    marginBottom: "10px",
  },
  listItem: {
    "&:focus, &:hover": {
      backgroundColor: theme.palette.button.main,
    },
  },
  newAnnouncementButton: {
    backgroundColor: "#61BD4F",
    color: "white",
    "&:focus, &:hover": {
      backgroundColor: "#61BD4F",
      color: "white",
    },
  },
  newAnnouncementIcon: {
    width: theme.spacing(3),
    height: theme.spacing(3),
    marginRight: "7.5px",
  }
}));

function AnnouncementItemList(props) {
  const classes = useStyles();

  return(
    <Paper variant="outlined" className={classes.listItemPaper}>
      <ListItem button component="a" href={props.notification_link} className={classes.listItem}>
        <ListItemText
          primary={
            <Typography>
              {props.notification_title}
            </Typography>
          }
          secondary={props.author_name}
        />
        <ListItemText
          align="right"
          primary={
            <Typography variant="subtitle" color="textSecondary">
              {props.date}
            </Typography>
          }
          secondary={`Pukul ${props.time}`}
        />
      </ListItem>
    </Paper>
  )
}

function AnnouncementList(props) {
  document.title = "Schooly | Daftar Pengumuman"

  const classes = useStyles();
  const { selectedAnnouncements, all_announcements } = props.announcements;
  const { getAnnouncement, getAllAnnouncement, getUsers, setCurrentClass } = props;
  const { kelas, selectedClass } = props.classesCollection
  const { user, retrieved_users } = props.auth;
  const [annIsRetrieved, setAnnIsRetrieved] = React.useState(false)


  React.useEffect(() => {
    if(user.role == "Teacher" && !annIsRetrieved){
      getAnnouncement(user.id, "by_author")
      setAnnIsRetrieved(true)
    }
    else if(user.role == "Student" && !annIsRetrieved){
      getAnnouncement(user.kelas, "by_class")
      setCurrentClass(user.kelas)
      setAnnIsRetrieved(true)
    }
  }, props.announcements)

  // ini ntah kenapa kalo masukkin selectedAnnouncements di parameter kedua ada error..

  console.log(selectedAnnouncements)

  const listAnnouncements = () => {
    let annList = [];

    for(var i = 0; i < selectedAnnouncements.length; i++){
      console.log()
      annList.push(
        <AnnouncementItemList
          sender_icon={<AccountCircleIcon />}
          author_name={selectedAnnouncements[i].author_name}
          notification_title={selectedAnnouncements[i].title}
          notification_link={`/pengumuman/${selectedAnnouncements[i]._id}`}
          date={moment(selectedAnnouncements[i].date_announced).locale("id").format("DD-MM-YYYY")}
          time={moment(selectedAnnouncements[i].date_announced).locale("id").format("HH:mm:ss")}
        />
      )
    }
    return annList;
  }

  const canAnnounce = () => {
    console.log(user.role)
    if(Object.keys(kelas).length > 0){
      return user.id === kelas.ketua_kelas._id
    }
    return user.role === "Teacher"
  }

  return(
    <div className={classes.root}>
      <Grid container justify="space-between">
        <Grid item>
          <Typography variant="subtitle2" color="primary">
            <h5>Daftar Pengumuman</h5>
          </Typography>
        </Grid>
        <Grid item>
          {canAnnounce() ?
          <Link to="/buat-pengumuman">
            <Fab variant="Extended" className={classes.newAnnouncementButton}>
              <AnnouncementIcon className={classes.newAnnouncementIcon} />
              Buat Pengumuman
            </Fab>
          </Link> :
          null}
        </Grid>
      </Grid>
      <List>
        {listAnnouncements()}
      </List>
    </div>
  )
}

AnnouncementList.propTypes = {
  auth: PropTypes.object.isRequired,
  announcements: PropTypes.object.isRequired,
  getAnnouncement: PropTypes.func.isRequired,
  getAllAnnouncements: PropTypes.func.isRequired,
  setCurrentClass: PropTypes.func.isRequired,
  getUsers: PropTypes.func.isRequired,
}

const mapStateToProps = (state) => ({
  auth: state.auth,
  announcements: state.announcementsCollection,
  classesCollection: state.classesCollection,
});

export default connect(
  mapStateToProps, { getAnnouncement, getAllAnnouncements, getUsers, setCurrentClass }
) (AnnouncementList);
