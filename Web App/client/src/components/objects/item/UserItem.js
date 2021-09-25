import React from 'react'
import { Avatar, Grid, Hidden, IconButton, ListItem, ListItemAvatar, ListItemText, Typography, } from "@material-ui/core"
import LightTooltip from "../../misc/light-tooltip/LightTooltip";
import { Link } from "react-router-dom";
import PageviewIcon from "@material-ui/icons/Pageview";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({

viewMaterialButton: {
  backgroundColor: theme.palette.warning.main,
  color: "white",
  "&:focus, &:hover": {
    backgroundColor: "white",
    color: theme.palette.warning.main,
  },
},
}));

function UserItem(props) {
    const { data, avatar_map} = props;
    const classes = useStyles();

    return (
      data.map((user) => {
        let { name, role, email, _id} = user;
        return (
          <Grid container justify="space-between" alignItems="center">
          <Grid item>
          <ListItem>
        <ListItemAvatar>
          <Avatar src={avatar_map[_id]} />
        </ListItemAvatar>
        <Hidden smUp implementation="css">
          <ListItemText
            primary={
              <Typography variant="subtitle1">{name}</Typography>
            }
            secondary={
              <Typography variant="caption" color="textSecondary">
                {email}
              </Typography>
            }
          />
        </Hidden>
        <Hidden xsDown implementation="css">
          <ListItemText
            primary={<Typography variant="h6">{name}</Typography>}
            secondary={
              <Typography variant="body2" color="textSecondary">
                {email}
              </Typography>
            }
          />
        </Hidden>
      </ListItem>
      </Grid>
      <Grid item xs container justify="flex-end">
      <Grid item>
        <LightTooltip title="Lihat Profil">
          <Link
            to={{
              pathname: `/lihat-profil/${user._id}`,
            }}
          >
            <IconButton
              size="small"
              className={classes.viewMaterialButton}
            >
              <PageviewIcon fontSize="small" />
            </IconButton>
          </Link>
        </LightTooltip>
      </Grid>
    </Grid>
    </Grid>
        )
      })

    )
}

export default UserItem;
