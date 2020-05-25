import React from "react";
import { Avatar, Divider, Grid, IconButton, Link, List, ListItem, ListItemAvatar, ListItemText, Paper, Typography } from "@material-ui/core"
import { makeStyles } from "@material-ui/core/styles"
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import SearchIcon from "@material-ui/icons/Search";

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: "800px",
    margin: "auto",
  },
  paperBox: {
    padding: "15px"
  },
  notificationLink: {
    textTransform: "none",
    "&:focus": {
      backgroundColor: "transparent",
    },
  }
}));

function NotificationSearchBar() {
  return(
    <Grid container direction="row">
      <Grid item>
        <input />
      </Grid>
      <Grid item>
        <IconButton>
          <SearchIcon />
        </IconButton>
      </Grid>
    </Grid>
  )
}

function NotificationItemList(props) {
  const classes = useStyles();

  return (
    <ListItem>
      <Grid container direction="row" alignItems="center">
        <Grid item xs={3} container justify="flex-start" alignItems="center">
          <ListItemAvatar>
            <Avatar>
              {props.sender_avatar}
            </Avatar>
          </ListItemAvatar>
          <ListItemText primary={props.sender_name}/>
        </Grid>
        <Grid item xs={8}>
          <Typography>
            <Link href={props.notification_link} className={classes.notificationLink}>
              {props.notification_title}
            </Link>
          </Typography>
        </Grid>
        <Grid item xs={1} container justify="flex-end">
          <Typography variant="subtitle" style={{color: "grey"}}>
            {props.time}
          </Typography>
        </Grid>
      </Grid>
    </ListItem>
  )
}

function NotificationsList(props) {
  const classes = useStyles();

  return(
    <div className={classes.root}>
      <Paper className={classes.paperBox}>
        <Grid
          container
          direction="column"
          justify="space-between"
        >
          <Grid item
            container
            direction="row"
            justify="space-between"
            alignItems="center"
          >
            <Grid item>
              <Typography variant="subtitle2">
                <h5>Notifikasi</h5>
              </Typography>
            </Grid>
            <Grid item>
              <NotificationSearchBar />
            </Grid>
          </Grid>
          <Divider />
          <Grid item>
            <List>
              <NotificationItemList
                sender_icon={<AccountCircleIcon />}
                sender_name="Pak Peler"
                notification_title="Ujian Kimia Besok"
                notification_link="/test"
                time={"20m ago"}
              />
              <NotificationItemList
                sender_icon={<AccountCircleIcon />}
                sender_name="My Nigga"
                notification_title="Ujian Biologi Lusa"
                notification_link="/test"
                time={"20m ago"}
              />
            </List>
          </Grid>
        </Grid>
      </Paper>
    </div>
  )
}

export default NotificationsList;
