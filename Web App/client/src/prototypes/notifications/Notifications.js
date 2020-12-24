import React from "react";
import StandardTextField from "../../misc/text-field/StandardTextField"
import { Avatar, Grid, IconButton, List, ListItem, ListItemAvatar, ListItemText, Paper, Typography } from "@material-ui/core"
import { makeStyles } from "@material-ui/core/styles"
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import SearchIcon from "@material-ui/icons/Search";
import StarIcon from "@material-ui/icons/Star";

const useStyles = makeStyles((theme) => ({
  root: {
    margin: "auto",
    maxWidth: "1000px",
    padding: "10px",
  },
  paperBox: {
    padding: "20px"
  },
  listItemPaper: {
    marginBottom: "10px"
  },
  listItem: {
    "&:focus, &:hover": {
      backgroundColor: theme.palette.button.main,
    },
  },
}));

function NotificationItemList(props) {
  const classes = useStyles();

  document.title="Schooly | Notifikasi";

  return (
    <Paper variant="outlined" className={classes.listItemPaper}>
      <Link to={props.notification_link}>
      <ListItem button component="a" className={classes.listItem}>
        <IconButton>
          <StarIcon />
        </IconButton>
        <ListItemAvatar>
          <Avatar>
            {props.sender_avatar}
          </Avatar>
        </ListItemAvatar>
        <ListItemText
          primary={
            <Typography>
              {props.notification_title}
            </Typography>
          }
          secondary={props.sender_name}
        />
        <ListItemText
          align="right"
          primary={
            <Typography variant="subtitle" color="textSecondary">
              {props.time}
            </Typography>
          }
        />
      </ListItem>
      </Link>
    </Paper>
  )
}

function Notifications(props) {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Paper className={classes.paperBox}>
        <Grid container justify="space-between">
          <Grid item xs={4}>
            <Typography variant="subtitle2" color="primary">
              <h5>Notifikasi</h5>
            </Typography>
          </Grid>
          <Grid item xs={8} container justify="flex-end">
            <StandardTextField />
            <IconButton>
              <SearchIcon />
            </IconButton>
          </Grid>
        </Grid>
        <List>
          <NotificationItemList
            sender_icon={<AccountCircleIcon />}
            sender_name="User 1"
            notification_title="Ujian Kimia Besok"
            notification_link="/test"
            time={"20m ago"}
          />
          <NotificationItemList
            sender_icon={<AccountCircleIcon />}
            sender_name="User 2"
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
