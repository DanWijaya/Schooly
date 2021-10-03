import React from "react";
import { Link } from "react-router-dom";
import {
  Avatar,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Paper,
  Typography,
} from "@material-ui/core";
import { MenuBook as MenuBookIcon } from "@material-ui/icons";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    "&:focus, &:hover": {
      backgroundColor: theme.palette.primary.fade,
    },
  },
  materialIcon: {
    backgroundColor: theme.palette.primary.main,
  },
}));

function MaterialItem(props) {
  const classes = useStyles();
  const { link, primaryText, subPrimaryText, secondaryText, subSecondaryText } = props;

  return (
    <Link to={link}>
      <Paper variant="outlined" className={classes.root}>
        <ListItem button>
          <ListItemAvatar>
            <Avatar className={classes.materialIcon}>
              <MenuBookIcon />
            </Avatar>
          </ListItemAvatar>
          <ListItemText
            primary={
              <Typography noWrap>
                {primaryText}
              </Typography>
            }
            secondary = {
              <Typography variant="body2" color="textSecondary" noWrap>
                {subPrimaryText}
              </Typography>
            }
          />
          <ListItemText
            align="right"
            primary={
              <Typography variant="body2" color="textSecondary" noWrap>
                {secondaryText}
              </Typography>
            }
            secondary={
              <Typography variant="body2" color="textSecondary" noWrap>
                {subSecondaryText}
              </Typography>
            }
          />
        </ListItem>
      </Paper>
    </Link>
  );
}

export default MaterialItem;