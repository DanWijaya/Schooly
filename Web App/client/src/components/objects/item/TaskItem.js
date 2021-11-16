import React from "react";
import { Link } from "react-router-dom";
import moment from "moment";
import "moment/locale/id";
import PropTypes from "prop-types";
import LightTooltip from "../../misc/light-tooltip/LightTooltip";
import {
  Avatar,
  Badge,
  IconButton,
  Divider,
  ExpansionPanel,
  ExpansionPanelDetails,
  ExpansionPanelSummary,
  Grid,
  Hidden,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Paper,
  Typography,
} from "@material-ui/core";
import {
  Assignment as AssignmentIcon,
  CheckCircle as CheckCircleIcon,
  Edit as EditIcon,
  Error as ErrorIcon,
  Delete as DeleteIcon,
  Pageview as PageviewIcon,
} from "@material-ui/icons";
import { connect } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    "&:focus, &:hover": {
      backgroundColor: theme.palette.primary.fade,
    },
  },
  taskPaper: {
    display: "flex",
    flexDirection: "column",
    alignItems: "stretch",
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
  assignmentLateTeacher: {
    backgroundColor: theme.palette.primary.main,
    marginRight: "10px",
  },
  assignmentLate: {
    backgroundColor: theme.palette.primary.main,
  },
  viewTaskButton: {
    backgroundColor: theme.palette.warning.main,
    color: "white",
    "&:focus, &:hover": {
      backgroundColor: "white",
      color: theme.palette.warning.main,
    },
  },
  editTaskButton: {
    backgroundColor: theme.palette.primary.main,
    color: "white",
    "&:focus, &:hover": {
      backgroundColor: "white",
      color: theme.palette.primary.main,
    },
  },
  deleteTaskButton: {
    backgroundColor: theme.palette.error.dark,
    color: "white",
    "&:focus, &:hover": {
      backgroundColor: "white",
      color: theme.palette.error.dark,
    },
  },
  listItem: {
    padding: "6px 16px",
  },
}));

function TaskItem(props) {
  const classes = useStyles();
  const { data, handleOpenDeleteDialog } = props;
  const { user } = props.auth;
  const { all_classes_map } = props.classesCollection;
  const { all_subjects_map } = props.subjectsCollection;

  return (
    <Grid container direction="column" spacing={2}>
      {data.map((row, index) => {
        const labelId = `enhanced-table-checkbox-${index}`;
        let viewpage =
          user.role === "Student"
            ? `/tugas-murid/${row._id}`
            : `/tugas-guru/${row._id}`;
        return (
          <Grid item>
            {user.role === "Teacher" ? (
              <ExpansionPanel button variant="outlined">
                <ExpansionPanelSummary className={classes.taskPanelSummary}>
                  <Grid
                    container
                    spacing={1}
                    justify="space-between"
                    alignItems="center"
                  >
                    <Grid item>
                      <Hidden smUp implementation="css">
                        <Typography variant="h6" id={labelId}>
                          {row.tasktitle}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          {all_subjects_map.get(row.subject)}
                        </Typography>
                      </Hidden>
                      <Hidden xsDown implementation="css">
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <ListItemAvatar>
                            <Avatar className={classes.assignmentLateTeacher}>
                              <AssignmentIcon />
                            </Avatar>
                          </ListItemAvatar>
                          <div>
                            <Typography variant="h6" id={labelId}>
                              {row.tasktitle}
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                              {all_subjects_map.get(row.subject)}
                            </Typography>
                          </div>
                        </div>
                      </Hidden>
                    </Grid>
                    <Grid item xs container spacing={1} justify="flex-end">
                      <Grid item>
                        <LightTooltip title="Lihat Lebih Lanjut">
                          <Link to={viewpage}>
                            <IconButton
                              size="small"
                              className={classes.viewTaskButton}
                            >
                              <PageviewIcon fontSize="small" />
                            </IconButton>
                          </Link>
                        </LightTooltip>
                      </Grid>
                      <Grid item>
                        <LightTooltip title="Sunting">
                          <Link to={`/sunting-tugas/${row._id}`}>
                            <IconButton
                              size="small"
                              className={classes.editTaskButton}
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                          </Link>
                        </LightTooltip>
                      </Grid>
                      <Grid item>
                        <LightTooltip title="Hapus">
                          <IconButton
                            size="small"
                            className={classes.deleteTaskButton}
                            onClick={(e) => {
                              handleOpenDeleteDialog(e, row._id, row.tasktitle);
                            }}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </LightTooltip>
                      </Grid>
                    </Grid>
                  </Grid>
                </ExpansionPanelSummary>
                <Divider />
                <ExpansionPanelDetails style={{ paddingTop: "20px" }}>
                  <Grid container>
                    <Grid item xs={12}>
                      <Typography variant="body1">
                        Kelas yang Ditugaskan:{" "}
                        {!all_classes_map.size
                          ? null
                          : row.class_assigned.map((id, i) => {
                              if (all_classes_map.get(id)) {
                                if (i === row.class_assigned.length - 1)
                                  return `${all_classes_map.get(id).name}`;
                                return `${all_classes_map.get(id).name}, `;
                              } else {
                                return undefined;
                              }
                            })}
                      </Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="body1" color="textSecondary">
                        Waktu Dibuat:{" "}
                        {moment(row.createdAt)
                          .locale("id")
                          .format("DD MMM YYYY, HH.mm")}
                      </Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="body1" color="textSecondary">
                        Batas Waktu:{" "}
                        {moment(row.deadline)
                          .locale("id")
                          .format("DD MMM YYYY, HH.mm")}
                      </Typography>
                    </Grid>
                  </Grid>
                </ExpansionPanelDetails>
              </ExpansionPanel>
            ) : (
              <Link to={viewpage}>
                <Paper
                  button
                  component="a"
                  variant="outlined"
                  className={classes.taskPaper}
                >
                  <Badge
                    style={{ display: "flex", flexDirection: "row" }}
                    badgeContent={
                      row.submissionStatus === false ? (
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
                    <ListItem
                      // button
                      // component="a"
                      className={classes.listItem}
                    >
                      <Hidden smUp implementation="css">
                        <ListItemText
                          primary={
                            <Typography variant="h6">
                              {row.tasktitle}
                            </Typography>
                          }
                          secondary={all_subjects_map.get(row.subject)}
                        />
                      </Hidden>
                      <Hidden xsDown implementation="css">
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <ListItemAvatar>
                            <Avatar className={classes.assignmentLate}>
                              <AssignmentIcon />
                            </Avatar>
                          </ListItemAvatar>
                          <ListItemText
                            primary={
                              <Typography variant="h6">
                                {row.tasktitle}
                              </Typography>
                            }
                            secondary={all_subjects_map.get(row.subject)}
                          />
                        </div>
                      </Hidden>
                      <ListItemText
                        align="right"
                        primary={
                          <Typography variant="body2" color="textSecondary">
                            {moment(row.createdAt)
                              .locale("id")
                              .format("DD MMM YYYY")}
                          </Typography>
                        }
                        secondary={moment(row.createdAt)
                          .locale("id")
                          .format("HH.mm")}
                      />
                    </ListItem>
                  </Badge>
                </Paper>
              </Link>
            )}
          </Grid>
        );
      })}
    </Grid>
  );
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
