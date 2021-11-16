import React from "react";
import { Link } from "react-router-dom";
import moment from "moment";
import PropTypes from "prop-types";
import {
  Avatar,
  Divider,
  ExpansionPanel,
  ExpansionPanelDetails,
  ExpansionPanelSummary,
  Grid,
  Hidden,
  IconButton,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Paper,
  Typography,
} from "@material-ui/core";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  MenuBook as MenuBookIcon,
  Pageview as PageviewIcon,
} from "@material-ui/icons";
import { makeStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";
import LightTooltip from "../../misc/light-tooltip/LightTooltip";

const useStyles = makeStyles((theme) => ({
  root: {
    "&:focus, &:hover": {
      backgroundColor: theme.palette.primary.fade,
    },
  },
  materialIcon: {
    backgroundColor: theme.palette.primary.main,
  },
  materialIconTeacher: {
    backgroundColor: theme.palette.primary.main,
    marginRight: "10px",
  },
  viewMaterialButton: {
    backgroundColor: theme.palette.warning.main,
    color: "white",
    "&:focus, &:hover": {
      backgroundColor: "white",
      color: theme.palette.warning.main,
    },
  },
  editMaterialButton: {
    backgroundColor: theme.palette.primary.main,
    color: "white",
    "&:focus, &:hover": {
      backgroundColor: "white",
      color: theme.palette.primary.main,
    },
  },
  deleteMaterialButton: {
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

function MaterialItem(props) {
  const classes = useStyles();
  const { data, handleOpenDeleteDialog } = props;
  const { user } = props.auth;
  const { all_classes_map } = props.classesCollection;
  const { all_subjects_map } = props.subjectsCollection;

  return (
    <Grid container direction="column" spacing={2}>
      {data.map((row, index) => {
        const labelId = `enhanced-table-checkbox-${index}`;
        let viewpage = `/materi/${row._id}`;

        return (
          <Grid item>
            {user.role === "Teacher" ? (
              <ExpansionPanel button variant="outlined">
                <ExpansionPanelSummary className={classes.root}>
                  <Grid
                    container
                    spacing={1}
                    justify="space-between"
                    alignItems="center"
                  >
                    <Grid item>
                      <Hidden smUp implementation="css">
                        <Typography variant="subtitle1" id={labelId}>
                          {row.materialtitle}
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
                            <Avatar className={classes.materialIconTeacher}>
                              <MenuBookIcon />
                            </Avatar>
                          </ListItemAvatar>
                          <div>
                            <Typography variant="h6" color="textPrimary">
                              {row.materialtitle}
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
                              className={classes.viewMaterialButton}
                            >
                              <PageviewIcon fontSize="small" />
                            </IconButton>
                          </Link>
                        </LightTooltip>
                      </Grid>
                      <Grid item>
                        <LightTooltip title="Sunting">
                          <Link to={`/sunting-materi/${row._id}`}>
                            <IconButton
                              size="small"
                              className={classes.editMaterialButton}
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
                            className={classes.deleteMaterialButton}
                            onClick={(e) => {
                              handleOpenDeleteDialog(
                                e,
                                row._id,
                                row.materialtitle
                              );
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
                        Kelas yang Diberikan:{" "}
                        {!all_classes_map.size
                          ? null
                          : row.class_assigned.map((kelas, i) => {
                              if (all_classes_map.get(kelas)) {
                                if (i === row.class_assigned.length - 1)
                                  return `${all_classes_map.get(kelas).name}`;
                                return `${all_classes_map.get(kelas).name}, `;
                              }
                              return null;
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
                  </Grid>
                </ExpansionPanelDetails>
              </ExpansionPanel>
            ) : (
              <Link to={viewpage}>
                <Paper variant="outlined">
                  <ListItem className={classes.listItem}>
                    <Hidden smUp implementation="css">
                      <ListItemText
                        primary={
                          <Typography variant="subtitle1" color="textPrimary">
                            {row.materialtitle}
                          </Typography>
                        }
                        secondary={
                          <Typography variant="caption" color="textSecondary">
                            {all_subjects_map.get(row.subject)}
                          </Typography>
                        }
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
                          <Avatar className={classes.materialIcon}>
                            <MenuBookIcon />
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={
                            <Typography variant="h6" color="textPrimary">
                              {row.materialtitle}
                            </Typography>
                          }
                          secondary={
                            <Typography variant="body2" color="textSecondary">
                              {all_subjects_map.get(row.subject)}
                            </Typography>
                          }
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
                </Paper>
              </Link>
            )}
          </Grid>
        );
      })}
    </Grid>
  );
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
