import React from "react";
import Avatar from "@material-ui/core/Avatar";
import Grid from "@material-ui/core/Grid";
import Hidden from "@material-ui/core/Hidden";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import TextField from "@material-ui/core/TextField";

function ProfileDataField(props) {
  const { icon, iconStyle, isTextField, nonTextFieldContent,
    id, type, onChange, value, errors } = props;

  return (
    <ListItem>
      <Grid container alignItems="center">
        <Grid item sm={2}>
          <Hidden xsDown>
            <ListItemAvatar>
              <Avatar className={iconStyle}>
                {icon}
              </Avatar>
            </ListItemAvatar>
          </Hidden>
        </Grid>
        <Grid item xs={12} sm={10}>
          {isTextField ? (
            <TextField
              fullWidth
              variant="outlined"
              id={id}
              label={type}
              onChange={onChange}
              value={value}
              error={errors ? errors : null}
              helperText={errors ? errors : null}
            />
          ) : (
            nonTextFieldContent
          )}
        </Grid>
      </Grid>
    </ListItem>
  );
}

export default ProfileDataField;
