import React from "react";
import { Link } from "react-router-dom";
import moment from "moment";
import "moment/locale/id";
import PropTypes from "prop-types";
import OptionMenu from "../../misc/menu/OptionMenu";
import {
  Avatar,
  Grid,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Paper,
  Typography,
} from "@material-ui/core";
import { Announcement as AnnouncementIcon } from "@material-ui/icons";
import { connect } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    "&:focus, &:hover": {
      backgroundColor: theme.palette.primary.fade,
    },
  },
  announcementIcon: {
    backgroundColor: theme.palette.primary.main,
  },
  listItem: {
    padding: "6px 16px",
  },
}));

function AnnouncementItem(props) {
  const classes = useStyles();
  const { data, handleOpenDeleteDialog } = props;
  const { user } = props.auth;

  return data.map((row, index) => {
    let viewpage = `/pengumuman/${row._id}`;
    const mine = row.author_id === user._id;
    return (
      <Grid item>
        <Link to={viewpage}>
          <Paper variant="outlined" className={classes.root}>
            <ListItem button disableRipple>
              <ListItemAvatar>
                <Avatar className={classes.announcementIcon}>
                  <AnnouncementIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={<Typography noWrap>{row.name}</Typography>}
                secondary={
                  <Typography variant="body2" color="textSecondary" noWrap>
                    {row.author_name}
                  </Typography>
                }
              />
              <ListItemText
                align="right"
                primary={
                  <Typography variant="body2" color="textSecondary" noWrap>
                    {moment(row.createdAt).locale("id").format("DD MMM YYYY")}
                  </Typography>
                }
                secondary={
                  <Typography variant="body2" color="textSecondary" noWrap>
                    {moment(row.createdAt).locale("id").format("HH.mm")}
                  </Typography>
                }
              />
              {mine ? (
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                  style={{ paddingLeft: "10px" }}
                >
                  <OptionMenu
                    actions={["Sunting", "Hapus"]}
                    row={row}
                    handleActionOnClick={[
                      `/sunting-pengumuman/${row._id}`,
                      handleOpenDeleteDialog,
                    ]}
                  />
                </div>
              ) : null}
            </ListItem>
          </Paper>
        </Link>
      </Grid>
    );
  });
}

AnnouncementItem.propTypes = {
  auth: PropTypes.object.isRequired,
  classesCollection: PropTypes.object.isRequired,
  announcementsCollection: PropTypes.object.isRequired,
};
const mapStateToProps = (state) => ({
  auth: state.auth,
  classesCollection: state.classesCollection,
  announcementsCollection: state.announcementsCollection,
});

export default connect(mapStateToProps, {})(AnnouncementItem);
