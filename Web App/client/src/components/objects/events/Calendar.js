import React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { Calendar as ReactCalendar } from "react-calendar";
import {
  Button,
  IconButton,
  Fab,
  Grid,
  Hidden,
  Typography,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
} from "@material-ui/core/";
import { makeStyles } from "@material-ui/core/styles";
import LightTooltip from "../../misc/light-tooltip/LightTooltip";

import EventNoteIcon from '@material-ui/icons/EventNote';
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import PageviewIcon from "@material-ui/icons/Pageview";

import {
  getAllEvents,
  deleteEvent
} from "../../../actions/EventActions";

const useStyles = makeStyles((theme) => ({
  root: {
    margin: "auto",
    maxWidth: "80%",
    [theme.breakpoints.down("md")]: {
      maxWidth: "100%"
    },
    padding: "10px",
  },
  newEventButton: {
    marginRight: "10px",
    backgroundColor: theme.palette.success.main,
    color: "white",
    "&:focus, &:hover": {
      backgroundColor: theme.palette.success.main,
      color: "white"
    },
  },
  newEventIconDesktop: {
    width: theme.spacing(3),
    height: theme.spacing(3),
    marginRight: "7.5px",
  },
  newEventIconMobile: {
    width: theme.spacing(3),
    height: theme.spacing(3),
  },
  viewEventButton: {
    backgroundColor: theme.palette.warning.main,
    color: "white",
    "&:focus, &:hover": {
      backgroundColor: "white",
      color: theme.palette.warning.main,
    },
  },
  editEventButton: {
    backgroundColor: theme.palette.primary.main,
    color: "white",
    "&:focus, &:hover": {
      backgroundColor: "white",
      color: theme.palette.primary.main,
    },
  },
  deleteEventButton: {
    backgroundColor: theme.palette.error.dark,
    color: "white",
    "&:focus, &:hover": {
      backgroundColor: "white",
      color: theme.palette.error.dark,
    },
  },
}));


function Calendar(props) {
  document.title = "Schooly | Kalender";

  const classes = useStyles();

  const {
    getAllEvents
  } = props;
  const role = props.auth.user.role;

  // state ini akan bernilai null jika dan hanya jika pengguna belum mengklik tile kalender (belum memilih tanggal)
  const [selectedDate, setSelectedDate] = React.useState(null);
  const [rows, setRows] = React.useState([]);

  React.useEffect(() => {
    getAllEvents();
  }, []);

  React.useEffect(() => {
    // mencari event yang berlangsung hari ini.
    // event yang sudah lewat jamnya, sedang berlangsung, atau belum berlangsung akan ditampilkan.
    let now = (selectedDate === null) ? (new Date()).getDate() : selectedDate.getDate();
    let filteredEvents = props.eventsCollection.allEvents.filter((eventInfo) => {
      let start_date = (new Date(eventInfo.start_date)).getDate();
      let end_date = (new Date(eventInfo.end_date)).getDate();
      return (start_date <= now && now <= end_date);
    });
    setRows(filteredEvents);
  }, [props.eventsCollection.allEvents, selectedDate]);

  return (
    <div className={classes.root}>
      <ReactCalendar
        onChange={setSelectedDate}
        value={selectedDate}
      />

      <Hidden mdUp implementation="css">
        {role !== "Admin" ? null : (
          <LightTooltip title="Buat Kegiatan">
            <Link to="/buat-kegiatan">
              <Fab size="small" className={classes.newEventButton}>
                <EventNoteIcon className={classes.newEventIconMobile} />
              </Fab>
            </Link>
          </LightTooltip>
        )}
      </Hidden>
      <Hidden smDown implementation="css">
        {role !== "Admin" ? null : (
          <Link to="/buat-kegiatan">
            <Fab
              size="medium"
              variant="extended"
              className={classes.newEventButton}
            >
              <EventNoteIcon className={classes.newEventIconDesktop} />
              Buat Kegiatan
          </Fab>
          </Link>
        )}
      </Hidden>

      {
        rows.map((eventInfo) => {
          return (
            <ListItem>
              {/* Isi ListItem Mobile = nama event*/}
              <Hidden smUp implementation="css">
                <ListItemText
                  style={{ margin: "6px 0" }}
                  primary={
                    <Grid container alignItems="center">
                      <Typography variant="subtitle1" color="textPrimary">
                        {eventInfo.name}
                      </Typography>

                      {/* bagian ini ditambahkan agar tinggi listitemnya sama seperti listitem yang ada props secondarynya */}
                      <Grid item style={{ visibility: "hidden" }}>
                        <Typography variant="subtitle1">
                          {"\u200B"}
                        </Typography>
                        <Typography variant="caption">
                          {"\u200B"}
                        </Typography>
                      </Grid>
                    </Grid>
                  }
                />
              </Hidden>

              {/* Isi ListItem Desktop = nama dan icon event*/}
              <Hidden xsDown implementation="css">
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <ListItemAvatar>
                    <Avatar className={classes.listAvatar}>
                      <EventNoteIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    style={{ margin: "6px 0" }}
                    primary={
                      <Grid container alignItems="center">
                        <Typography variant="h6" color="textPrimary">
                          {eventInfo.name}
                        </Typography>

                        {/* bagian ini ditambahkan agar tinggi listitemnya sama seperti listitem yang ada props secondarynya */}
                        <Grid item style={{ visibility: "hidden" }}>
                          <Grid container direction="column">
                            <Typography variant="h6">
                              {"\u200B"}
                            </Typography>
                            <Typography variant="body2">
                              {"\u200B"}
                            </Typography>
                          </Grid>
                        </Grid>
                      </Grid>
                    }
                  />
                </div>
              </Hidden>

              {/* IconButton lihat, sunting, hapus */}
              <ListItemText
                align="right"
                primary={
                  <Grid container spacing={1} justify="flex-end">
                    {/* IconButton - lihat */}
                    <Grid item>
                      <LightTooltip title="Lihat Lebih Lanjut">
                        <Link to={`/kegiatan/${eventInfo._id}`}>
                          <IconButton
                            size="small"
                            className={classes.viewEventButton}
                          >
                            <PageviewIcon fontSize="small" />
                          </IconButton>
                        </Link>
                      </LightTooltip>
                    </Grid>

                    {/* IconButton - sunting */}
                    <Grid item>
                      <LightTooltip title="Sunting">
                        <Link to={`/sunting-kegiatan/${eventInfo._id}`}>
                          <IconButton
                            size="small"
                            className={classes.editEventButton}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Link>
                      </LightTooltip>
                    </Grid>

                    {/* IconButton - hapus */}
                    <Grid item>
                      <LightTooltip title="Hapus">
                        <IconButton
                          size="small"
                          className={classes.deleteEventButton}
                          onClick={() => {
                            deleteEvent(eventInfo._id).then(() => {
                              getAllEvents();
                            })
                          }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </LightTooltip>
                    </Grid>

                  </Grid>
                }
              />
            </ListItem>
          );
        })
      }

    </div>
  );
}

const mapStateToProps = (state) => ({
  auth: state.auth,
  eventsCollection: state.eventsCollection
});

export default connect(mapStateToProps, {
  getAllEvents
})(Calendar)