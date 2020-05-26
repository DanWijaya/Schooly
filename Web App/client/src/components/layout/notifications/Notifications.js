import React from "react";
import StandardTextField from "../../misc/text-field/StandardTextField"
import { Avatar, Divider, Grid, IconButton, Link, List, ListItem, Paper, Typography } from "@material-ui/core"
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
  notificationListItem: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between"
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
    <ListItem className={classes.notificationListItem}>
      <Avatar>
        {props.sender_avatar}
      </Avatar>
      <Typography style={{width: "15%"}}>
        {props.sender_name}
      </Typography>
      <Typography style={{width: "60%"}}>
        <Link href={props.notification_link} style={{color: "#DCDCDC"}}>
          {props.notification_title}
        </Link>
      </Typography>
      <Typography variant="subtitle" style={{color: "grey", width: "10%"}}>
        {props.time}
      </Typography>
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
