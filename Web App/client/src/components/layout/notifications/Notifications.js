import React from "react";
import StandardTextField from "../../misc/text-field/StandardTextField"
import { Avatar, Divider, Grid, IconButton, Link, List, ListItem, ListItemAvatar, ListItemSecondaryAction, ListItemText, Paper, Typography } from "@material-ui/core"
import { makeStyles } from "@material-ui/core/styles"
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import SearchIcon from "@material-ui/icons/Search";

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: "800px",
    margin: "auto",
  },
  paperBox: {
    padding: "20px"
  },
  searchButton: {
    "&:focus": {
      backgroundColor: "transparent",
    },
    "&:hover": {
      backgroundColor: "transparent",
    },
  },
}));

function NotificationItemList(props) {
  const classes = useStyles();

  return (
    <ListItem button component="a" href={props.notification_link}>
      <ListItemAvatar>
        <Avatar>
          {props.sender_avatar}
        </Avatar>
      </ListItemAvatar>
      <ListItemText
        primary={
          <Typography style={{color: "#2196f3"}}>
            {props.notification_title}
          </Typography>
        }
        secondary={props.sender_name}
      />
      <ListItemSecondaryAction>
        <Typography variant="subtitle" style={{color: "grey"}}>
          {props.time}
        </Typography>
      </ListItemSecondaryAction>
    </ListItem>
  )
}

function Notifications(props) {
  const classes = useStyles();

  return(
    <div className={classes.root}>
      <Paper className={classes.paperBox}>
          <div style={{display: "flex", justifyContent: "space-between", height: "60px"}}>
            <Typography variant="subtitle2">
              <h5>Notifikasi</h5>
            </Typography>
            <div style={{display: "flex", width: "30%"}}>
              <StandardTextField />
              <IconButton className={classes.searchButton}>
                <SearchIcon />
              </IconButton>
            </div>
          </div>
          <Divider />
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
      </Paper>
    </div>
  )
}

export default Notifications;
