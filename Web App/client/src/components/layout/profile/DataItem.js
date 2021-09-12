import React from "react";
import Avatar from "@material-ui/core/Avatar";
import Grid from "@material-ui/core/Grid";
import Hidden from "@material-ui/core/Hidden";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import ListItemText from "@material-ui/core/ListItemText";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    padding: "8px 16px",
  },
}));


function DataItem(props) {
  const classes = useStyles();
  const { iconStyle, icon, type, value } = props;

  return (
    <Grid container spacing={2} className={classes.root}>
      <Grid item>
        <Avatar className={iconStyle}>
          {icon}
        </Avatar>
      </Grid>
      <Grid item xs container alignItems="center">
        <Grid item xs={12} sm={6}>
          <Typography variant="overline" color="textSecondary" noWrap>
            <b>{type}</b>
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          {!value ? (
            <Typography variant="body2" color="textSecondary">Kosong</Typography>
          ) : (
            <Typography>
              {value}
            </Typography>
          )}
        </Grid>
      </Grid>
    </Grid>
  );
}

export default DataItem;
