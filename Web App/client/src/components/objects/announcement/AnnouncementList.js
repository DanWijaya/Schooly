import React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import moment from "moment";
import "moment/locale/id";
import { setCurrentClass } from "../../../actions/ClassActions";
import { getAllAnnouncements, getAnnouncement} from "../../../actions/AnnouncementActions"
import { getUsers } from "../../../actions/UserActions";
import LightTooltip from "../../misc/light-tooltip/LightTooltip";
import { Fab, Grid, Hidden, ListItem, ListItemText, Paper, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import AnnouncementIcon from "@material-ui/icons/Announcement";

const useStyles = makeStyles((theme) => ({
  root: {
    margin: "auto",
    maxWidth: "1000px",
    padding: "10px",
  },
  toolbar: {
    display: "flex",
    justifyContent: "space-between",
    padding: "15px",
  },
  newAnnouncementButton: {
    backgroundColor: "#61BD4F",
    color: "white",
    "&:focus, &:hover": {
      backgroundColor: "#61BD4F",
      color: "white",
    },
  },
  newAnnouncementIconDesktop: {
    width: theme.spacing(3),
    height: theme.spacing(3),
    marginRight: "7.5px",
  },
  newAnnouncementIconMobile: {
    width: theme.spacing(3),
    height: theme.spacing(3),
  },
  listItem: {
    "&:focus, &:hover": {
      backgroundColor: theme.palette.button.main,
    },
  },
}));

function AnnouncementItemList(props) {
  const classes = useStyles();

  return(
    <Grid item>
      <Paper variant="outlined">
        <Link to={props.notification_link}>
        <ListItem button component="a" className={classes.listItem}>
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
        </Link>
      </Paper>
    </Grid>
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

  // retrieved users ini bulk request, dapat data user"nya satu"
  React.useEffect(() => {
    if (user.role === "Teacher" && !annIsRetrieved) {
      getAnnouncement(user.id, "by_author")
      setAnnIsRetrieved(true)
    }
    else if (user.role === "Student" && !annIsRetrieved) {
      getAnnouncement(user.kelas, "by_class")
      setCurrentClass(user.kelas)
      setAnnIsRetrieved(true)
    }
    console.log(selectedAnnouncements.length)
    if (selectedAnnouncements.length) {
      let author_id_set = new Set();
      selectedAnnouncements.map((ann) => {
        author_id_set.add(ann.author_id)
      })
      getUsers(Array.from(author_id_set))
    }
  }, [selectedAnnouncements.length, retrieved_users.size])

  // ini ntah kenapa kalo masukkin selectedAnnouncements di parameter kedua ada error..

  console.log(selectedAnnouncements)

  const listAnnouncements = () => {
    let annList = [];
    console.log(selectedAnnouncements, retrieved_users)
    if(selectedAnnouncements.length && retrieved_users.size){
      
      for(var i = selectedAnnouncements.length-1; i >= 0; i--){
        // retrieved users ini bulk request, dapat data user"nya satu"
        if(retrieved_users.get(selectedAnnouncements[i].author_id)){
          annList.push(
            <AnnouncementItemList
              sender_icon={<AccountCircleIcon />}
              author_name={!retrieved_users.get(selectedAnnouncements[i].author_id) ? null: retrieved_users.get(selectedAnnouncements[i].author_id).name}
              notification_title={selectedAnnouncements[i].title}
              notification_link={`/pengumuman/${selectedAnnouncements[i]._id}`}
              date={moment(selectedAnnouncements[i].date_announced).locale("id").format("DD-MMMM-YYYY")}
              time={moment(selectedAnnouncements[i].date_announced).locale("id").format("HH:mm:ss")}
            />
          )
        }
    }
  }
    return annList;
  }

  const canAnnounce = () => {
    console.log(user.role)
    if (Object.keys(kelas).length > 0) {
      return user.id === kelas.ketua_kelas
    }
    return user.role === "Teacher"
  }

  return(
    <div className={classes.root}>
      <div className={classes.toolbar}>
        <Typography variant="h4" color="primary">
          <b>Daftar Pengumuman</b>
        </Typography>
        {canAnnounce() ?
            <div>
              <Hidden smUp implementation="css">
                <LightTooltip title="Buat Pengumuman">
                  <Link to="/buat-pengumuman">
                    <Fab size="small" className={classes.newAnnouncementButton}>
                      <AnnouncementIcon className={classes.newAnnouncementIconMobile} />
                    </Fab>
                  </Link>
                </LightTooltip>
              </Hidden>
              <Hidden xsDown implementation="css">
                <Link to="/buat-pengumuman">
                  <Fab variant="extended" size="medium" className={classes.newAnnouncementButton}>
                    <AnnouncementIcon className={classes.newAnnouncementIconDesktop} />
                    Buat Pengumuman
                  </Fab>
                </Link>
              </Hidden>
            </div>
          :
            null
          }
      </div>
      <Grid container direction="column" spacing={2}>
        {listAnnouncements()}
      </Grid>
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
