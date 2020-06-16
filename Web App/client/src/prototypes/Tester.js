import React from 'react';
import PropTypes from 'prop-types';
import SwipeableViews from 'react-swipeable-views';
import { makeStyles } from '@material-ui/core/styles';
import { List, ListItem, ListItemText, ListItemIcon } from '@material-ui/core';
import AboutIcon from "@material-ui/icons/Info";

const useStyles = makeStyles((theme) => ({
  listItem: {
    "&:focus, &:hover": {
      backgroundColor: "#2196f3",
      "& $listItemChildren": {
        color: "white",
      },
    },
  },
  listItemChildren: {
    color: theme.palette.text.primary,
  },
}));

export default function Tester() {
  const classes = useStyles();

  return (
    <div style={{display: "flex", justifyContent: "center"}}>
      <List>
        <ListItem button component="a" href="/dashboard" className={classes.listItem}>
          <ListItemIcon className={classes.listItemChildren}>
            <AboutIcon />
          </ListItemIcon>
          <ListItemText primary="test" className={classes.listItemChildren} />
        </ListItem>
        <ListItem button component="a" className={classes.listItem}>
          <ListItemIcon>
            <AboutIcon />
          </ListItemIcon>
          <ListItemText primary="test" />
        </ListItem>
      </List>
    </div>
  );
}
