import React from "react"
import { Link, useHistory } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import LightTooltip from "../../misc/light-tooltip/LightTooltip";
import { Avatar, Badge, Divider, Grid, IconButton, Paper, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { SupervisorAccount as SupervisorAccountIcon } from "@material-ui/icons";
import { FaChalkboardTeacher } from "react-icons/fa";

const useStyles = makeStyles((theme) => ({
  root: {
    "&:focus, &:hover": {
      boxShadow: "0px 2px 3px 0px rgba(60,64,67,0.30), 0px 2px 10px 2px rgba(60,64,67,0.15)",
    },
  },
  classBackground: {
    width: "100%",
    height: "120px",
    borderRadius: "3px 3px 0px 0px",
  },
  classIcon: {
    width: "50px",
    height: "50px",
  },
  classContent: {
    padding: "20px 20px",
  },
  classPersonIcon: {
    color: theme.palette.text.disabled,
  },
  classButtons: {
    "&:focus, &:hover": {
      backgroundColor: "#F1F1F1",
    },
  },
}));

function ClassItem(props) {
  const classes = useStyles();
  const { data } = props;
  const { user } = props.auth;
  const [colorMap, setColorMap] = React.useState(new Map());

  React.useEffect(() => {
    const colorList = ["#12c2e9", "#c471ed", "#f64f59", "#f5af19", "#6be585"];
    let temp = new Map();

    data.forEach((d, i) => temp.set(d._id, colorList[i % colorList.length]));
    setColorMap(temp);
  }, [data.length])

  if(Array.isArray(data)){
    return (
      data.map((cl, index) => {
          const labelId = `enhanced-table-checkbox-${index}`;
          let viewpage = `/kelas/${cl._id}`;

          return (
            <Grid item xs={12} sm={6} md={4}>
              <Link to={viewpage} onClick={(e) => e.stopPropagation()}>
                <Paper button className={classes.root}>
                  <Avatar
                    variant="square"
                    className={classes.classBackground}
                    style={{ backgroundColor: colorMap.get(row._id) }}
                  >
                    <FaChalkboard className={classes.classIcon} />
                  </Avatar>
                  <Divider />
                  <div className={classes.classContent}>
                    <Typography id={labelId} variant="h5" align="center" noWrap gutterBottom>
                      {row.name}
                    </Typography>
                    <Typography color="textSecondary" align="center" noWrap>
                      Wali Kelas: {row.homeroomTeacher ? (
                        row.homeroomTeacher
                      ) : (
                        "-"
                      )}
                    </Typography>
                  </div>
                  <Divider />
                  <div className={classes.classContent}>
                    {user.role === "Admin" ? (
                      <Grid
                        container
                        spacing={1}
                        justify="flex-end"
                        alignItems="center"
                      >
                        <Grid item>
                          <LightTooltip title="Jumlah Murid">
                            <Badge
                              showZero
                              color={row.size === 0 ? "error" : "primary"}
                              badgeContent={row.size}
                              anchorOrigin={{
                                vertical: "bottom",
                                horizontal: "left",
                              }}
                            >
                              <SupervisorAccountIcon className={classes.classPersonIcon} />
                            </Badge>
                          </LightTooltip>
                        </Grid>
                        <Grid item>
                          <LightTooltip title="Sunting">
                            <Link
                              to={`/sunting-kelas/${row._id}`}
                              onClick={(e) => e.stopPropagation()}
                            >
                              <IconButton size="small" className={classes.classButtons}>
                                <EditIcon fontSize="small" />
                              </IconButton>
                            </Link>
                          </LightTooltip>
                        </Grid>
                        <Grid item>
                          <LightTooltip title="Hapus">
                            <IconButton
                              size="small"
                              className={classes.classButtons}
                              onClick={(e) =>
                                handleOpenDeleteDialog(
                                  e,
                                  row._id,
                                  row.name
                                )
                              }
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </LightTooltip>
                        </Grid>
                      </Grid>
                    ) : (
                      <Grid
                        container
                        justify="flex-end"
                      >
                        <Grid item>
                          <LightTooltip title="Jumlah Murid">
                            <Badge
                              showZero
                              color={row.size === 0 ? "error" : "primary"}
                              badgeContent={row.size}
                              anchorOrigin={{
                                vertical: "bottom",
                                horizontal: "left",
                              }}
                            >
                              <SupervisorAccountIcon className={classes.classPersonIcon} />
                            </Badge>
                          </LightTooltip>
                        </Grid>
                      </Grid>
                    )}
                  </div>
                </Paper>
              </Link>
            </Grid>
          )
        })
    )}
  else {
    return null;
  }
}

ClassItem.propTypes = {
  auth: PropTypes.object.isRequired
}

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, {})(ClassItem);
