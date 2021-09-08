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
      <Grid container>
        <Grid item>
          <Avatar className={iconStyle}>
            {icon}
          </Avatar>
        </Grid>
        <Grid item xs container alignItems="center">
            <Grid item xs={12} sm={5}>
              <Typography>
                <b>{type}</b>
              </Typography>
            </Grid>
            <Grid item xs={12} sm={7}>
              {!value ? (
                <Typography variant="body1">
                  "Kosong"
                </Typography>
              ) : (
                <Typography variant="body2">
                  {value}
                </Typography>
              )}
          </Grid>
        </Grid>
      </Grid>
  );
}

export default ProfileDataItem;
