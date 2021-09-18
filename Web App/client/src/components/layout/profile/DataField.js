import React from "react";
import {
  Avatar,
  Grid,
  Hidden,
  ListItem,
  ListItemAvatar,
  TextField
} from "@material-ui/core";

function DataField(props) {
  const { icon, iconStyle, isTextField, nonTextFieldContent,
    id, type, onChange, value, errors } = props;

  return (
    <ListItem>
      <Grid container>
        <Grid item>
          <Hidden xsDown>
            <ListItemAvatar>
              <Avatar className={iconStyle}>
                {icon}
              </Avatar>
            </ListItemAvatar>
          </Hidden>
        </Grid>
        <Grid item xs>
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

export default DataField;
