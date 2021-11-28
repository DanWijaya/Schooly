import React from "react"
import { Link } from "react-router-dom";
import { Avatar, ListItem, ListItemAvatar, ListItemText, Typography } from "@material-ui/core"
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    color: "black",
    "&:focus, &:hover": {
      boxShadow: "0px 2px 3px 0px rgba(60,64,67,0.30), 0px 2px 8px 2px rgba(60,64,67,0.15)",
    },
  },
}));

function UserItem(props) {
  const classes = useStyles();
  const { data, avatar_map } = props;

  return data.map((user) => {
    let { name, role, email, _id } = user;

    return (
      <Link to={`/lihat-profil/${user._id}`}>
        <ListItem className={classes.root}>
          <ListItemAvatar>
            <Avatar src={avatar_map[_id]} />
          </ListItemAvatar>
          <ListItemText
            primary={
              <Typography noWrap>{name}</Typography>
            }
            secondary={
              <Typography variant="body2" color="textSecondary" noWrap>
                {email}
              </Typography>
            }
          />
        </ListItem>
      </Link>
    );
  });
}

export default UserItem;
