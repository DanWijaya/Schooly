import React from "react";
import { Link } from "react-router-dom";
import moment from "moment";
import "moment/locale/id";
import PropTypes from "prop-types";
import OptionMenu from "../../misc/menu/OptionMenu";
import {
  Avatar,
  Badge,
  Grid,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Paper,
  Typography,
} from "@material-ui/core";
import {
  Assignment as AssignmentIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
} from "@material-ui/icons";
import { connect } from "react-redux";
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
  listItem: {
    padding: "6px 16px",
  },
}));

function TaskItem(props) {
  const classes = useStyles();
  const {
    data,
    handleOpenDeleteDialog,
    submittedIds,
    isHideOptionMenu,
  } = props;
  const { user } = props.auth;
  const { all_subjects_map } = props.subjectsCollection;

  return data.map((row, index) => {
    let viewpage =
      user.role === "Student"
        ? `/tugas-murid/${row._id}`
        : `/tugas-guru/${row._id}`;

    return (
      <Grid item>
        <Link to={viewpage}>
          <Paper variant="outlined" className={classes.root}>
            <ListItem button disableRipple>
              <ListItemAvatar>
                {user.role === "Student" ? (
                  <Badge
                    overlap="circle"
                    badgeContent={
                      submittedIds.has(row._id) ? (
                        <CheckCircleIcon className={classes.completedIcon} />
                      ) : (
                        <ErrorIcon className={classes.missingIcon} />
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
                ) : (
                  <Avatar className={classes.assignmentIcon}>
                    <AssignmentIcon />
                  </Avatar>
                )}
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
              {user.role !== "Teacher" || isHideOptionMenu ? null : (
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
                      `/sunting-tugas/${row._id}`,
                      handleOpenDeleteDialog,
                    ]}
                  />
                </div>
              )}
            </ListItem>
          </Paper>
        </Link>
      </Grid>
    );
  });
}

TaskItem.propTypes = {
  auth: PropTypes.object.isRequired,
  classesCollection: PropTypes.object.isRequired,
  subjectsCollection: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  classesCollection: state.classesCollection,
  subjectsCollection: state.subjectsCollection,
});

export default connect(mapStateToProps, {})(TaskItem);
