import React from "react";
import { Link } from "react-router-dom";
import {
  Avatar,
  Badge,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Paper,
  Typography,
} from "@material-ui/core";
import {
  Assignment as AssignmentIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon
} from "@material-ui/icons";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    "&:focus, &:hover": {
      backgroundColor: theme.palette.primary.fade,
    },
  },
  assignmentIcon: {
    backgroundColor: theme.palette.primary.main,
  },
  missingIcon: {
    fontSize: "16px",
    borderRadius: "8px",
    backgroundColor: "white",
    color: theme.palette.error.main,
  },
  completedIcon: {
    fontSize: "16px",
    borderRadius: "8px",
    backgroundColor: "white",
    color: theme.palette.success.main,
  },
}));

function AssignmentItem(props) {
  const classes = useStyles();
  const { link, status, missing, primaryText, subPrimaryText, secondaryText, subSecondaryText } = props;

  return (
    <Link to={link}>
      <Paper variant="outlined" className={classes.root}>
        <ListItem button>
          <ListItemAvatar>
            <Badge
              overlap="circle"
              badgeContent={
                status === missing ? (
                  <ErrorIcon className={classes.missingIcon} />
                ) : (
                  <CheckCircleIcon className={classes.completedIcon} />
                )
              }
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "right",
              }}
            >
            <Avatar className={classes.assignmentIcon}>
              <AssignmentIcon />
            </Avatar>
            </Badge>
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

export default AssignmentItem;
