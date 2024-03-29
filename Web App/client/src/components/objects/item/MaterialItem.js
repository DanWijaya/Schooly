import React from "react";
import { Link } from "react-router-dom";
import moment from "moment";
import "moment/locale/id";
import PropTypes from "prop-types";
import OptionMenu from "../../utils/option-menu/OptionMenu";
import {
  Avatar,
  Grid,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Paper,
  Typography,
} from "@material-ui/core";
import { MenuBook as MenuBookIcon } from "@material-ui/icons";
import { makeStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";

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
  const { data, handleOpenDeleteDialog } = props;
  const { user } = props.auth;
  const { all_subjects_map } = props.subjectsCollection;

  return data.map((row, index) => {
    let viewpage = `/materi/${row._id}`;
    return (
      <Grid item>
        <Link to={viewpage}>
          <Paper variant="outlined" className={classes.root}>
            <ListItem component="div">
              <ListItemAvatar>
                <Avatar className={classes.materialIcon}>
                  <MenuBookIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={<Typography noWrap>{row.name}</Typography>}
                secondary={
                  <Typography variant="body2" color="textSecondary" noWrap>
                    {all_subjects_map.get(row.subject)}
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
              {user.role === "Teacher" ? (
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
                      `/sunting-materi/${row._id}`,
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

MaterialItem.propTypes = {
  auth: PropTypes.object.isRequired,
  classesCollection: PropTypes.object.isRequired,
  subjectsCollection: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  classesCollection: state.classesCollection,
  subjectsCollection: state.subjectsCollection,
});

export default connect(mapStateToProps, {})(MaterialItem);
