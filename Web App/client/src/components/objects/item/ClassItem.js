import React from 'react'
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import { Avatar, Badge, Divider, Grid, IconButton, Paper, Typography} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { FaChalkboardTeacher } from "react-icons/fa";
import LightTooltip from "../../misc/light-tooltip/LightTooltip";
import SupervisorAccountIcon from "@material-ui/icons/SupervisorAccount";

const useStyles = makeStyles((theme) => ({
    classPaper: {
        borderRadius: "3px",
        boxShadow: "0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)",
        transition: "all 0.3s cubic-bezier(.25,.8,.25,1)",
        "&:focus, &:hover": {
          boxShadow: "0 14px 28px rgba(0,0,0,0.15), 0 10px 10px rgba(0,0,0,0.15)",
          cursor: "pointer",
        },
      },
      classActionContainer: {
        padding: "20px 10px 20px 10px",
      },
      classPersonIcon: {
        color: theme.palette.text.disabled,
      },
      editClassButton: {
        backgroundColor: theme.palette.primary.main,
        color: "white",
        "&:focus, &:hover": {
          backgroundColor: "white",
          color: theme.palette.primary.main,
        },
      },
      deleteClassButton: {
        backgroundColor: theme.palette.error.dark,
        color: "white",
        "&:focus, &:hover": {
          backgroundColor: "white",
          color: theme.palette.error.dark,
        },
      },
      emptyClass: {
        display: "flex",
        justifyContent: "center",
        maxWidth: "150px",
        padding: "2px",
        paddingLeft: "6px",
        paddingRight: "6px",
        backgroundColor: theme.palette.error.main,
        color: "white",
        marginLeft: "5px",
      },
}));

    function ClassItem(props) {
    const { data } = props;
    const { user } = props.auth;
    const classes = useStyles();
    const [colorMap, setColorMap] = React.useState(new Map());

    React.useEffect(() => {
        const colorList = ["#12c2e9", "#c471ed", "#f64f59", "#f5af19", "#6be585"];
        let temp = new Map();

        data.forEach((d, i) => temp.set(d._id, colorList[i % colorList.length]));
        setColorMap(temp);
    }, [data.length])

    if(Array.isArray(data)){
    return (
        <>
        {data.map((cl, index) => {
            const labelId = `enhanced-table-checkbox-${index}`;
            let viewpage = `/kelas/${cl._id}`;

        return    (
        <Grid item xs={12} sm={6} md={4}>
        <Link to={viewpage} onClick={(e) => e.stopPropagation()}>
        <Paper button className={classes.classPaper}>
                <Avatar
                  variant="square"
                  style={{
                    backgroundColor: colorMap.get(cl._id),
                    width: "100%",
                    height: "120px",
                    borderRadius: "3px 3px 0px 0px",
                  }}
                >
                  <FaChalkboardTeacher
                    style={{
                      width: "50px",
                      height: "50px",
                    }}
                  />
                </Avatar>
                <Divider />
                <div style={{ padding: "10px 20px 20px 10px" }}>
                  <Typography id={labelId} variant="h5" align="center">
                    {cl.name}
                  </Typography>
                  {cl.homeroomTeacher && cl.homeroomTeacher !== "" ? (
                    <Typography
                      variant="body1"
                      color="textSecondary"
                      align="center"
                      style={{ marginTop: "5px" }}
                    >
                      Wali Kelas: {cl.homeroomTeacher}
                    </Typography>
                  ) : (
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "center",
                        alignItems: "center",
                        marginTop: "5px",
                      }}
                    >
                      <Typography
                        variant="body1"
                        color="textSecondary"
                        align="center"
                      >
                        Wali Kelas:
                      </Typography>
                      <Paper className={classes.emptyClass}>
                        <Typography variant="body2">KOSONG</Typography>
                      </Paper>
                    </div>
                  )}
                </div>
                <Divider />
                <Grid
                  container
                  direction="row"
                  justify="space-between"
                  alignItems="center"
                  className={classes.classActionContainer}
                >
                  {user.role === "Admin" ? (
                    <Grid
                      item
                      xs
                      container
                      spacing={1}
                      justify="flex-end"
                      alignItems="center"
                    >
                      <Grid item>
                        <LightTooltip title="Jumlah Murid">
                          <Badge
                            badgeContent={cl.size}
                            color="secondary"
                            anchorOrigin={{
                              vertical: "bottom",
                              horizontal: "left",
                            }}
                            showZero
                          >
                            <IconButton size="small" disabled>
                              <SupervisorAccountIcon
                                className={classes.classPersonIcon}
                              />
                            </IconButton>
                          </Badge>
                        </LightTooltip>
                      </Grid>
                    </Grid>
                  ) : (
                    <Grid
                      container
                      direction="row"
                      justify="flex-end"g31
                      alignItems="center"
                    >
                      <Grid item>
                        <LightTooltip title="Jumlah Murid">
                          <Badge
                            badgeContent={cl.size}
                            color="secondary"
                            anchorOrigin={{
                              vertical: "bottom",
                              horizontal: "left",
                            }}
                            showZero
                          >
                            <IconButton size="small" disabled>
                              <SupervisorAccountIcon
                                className={classes.classPersonIcon}
                              />
                            </IconButton>
                          </Badge>
                        </LightTooltip>
                      </Grid>
                    </Grid>
                  )}
                </Grid>
              </Paper>
              </Link>
              </Grid>
        )
    })}
    </>
    )}
    else{
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
