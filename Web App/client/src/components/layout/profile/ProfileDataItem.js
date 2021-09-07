import React from "react";
import Avatar from "@material-ui/core/Avatar";
import Grid from "@material-ui/core/Grid";
import Hidden from "@material-ui/core/Hidden";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import ListItemText from "@material-ui/core/ListItemText";
import Typography from "@material-ui/core/Typography";

function ProfileDataItem(props) {
  const { iconStyle, icon, type, value } = props;

  return (
    <ListItem>
      <ListItemAvatar>
        <Avatar className={iconStyle}>
          {icon}
        </Avatar>
      </ListItemAvatar>
      <Hidden smUp>
        <ListItemText
          primary={
            <Typography variant="overline" color="textSecondary">
              <b>{type}</b>
            </Typography>
          }
          secondary={
            !value ? (
              <Typography variant="body2" color="textSecondary">Kosong</Typography>
            ) : (
              <Typography>{value}</Typography>
            )
          }
        />
      </Hidden>
      <Hidden xsDown>
        <Grid container alignItems="center" spacing={2}>
          <Grid item xs={5}>
            <Typography variant="overline" color="textSecondary">
              <b>{type}</b>
            </Typography>
          </Grid>
          <Grid item xs={7}>
            {!value ? (
              <Typography variant="body2" color="textSecondary">Kosong</Typography>
            ) : (
              <Typography>{value}</Typography>
            )}
          </Grid>
        </Grid>
      </Hidden>
    </ListItem>
  );
}

export default ProfileDataItem;
