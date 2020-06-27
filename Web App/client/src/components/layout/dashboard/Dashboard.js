import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import dashboardStudentBackground from "./DashboardStudentBackground.png";
import LightTooltip from "../../misc/light-tooltip/LightTooltip";
import { Avatar, Grid, IconButton, List, ListItem, ListItemAvatar, ListItemText, Paper, Typography } from "@material-ui/core";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";

const useStyles = makeStyles((theme) => ({
  listItemPaper: {
    marginBottom: "10px"
  },
  listItem: {
    "&:focus, &:hover": {
      backgroundColor: theme.palette.button.main,
    },
  },
}));

function NotificationItemList(props) {
  const classes = useStyles();

  return (
    <Paper variant="outlined" className={classes.listItemPaper}>
      <ListItem button component="a" href={props.notification_link} className={classes.listItem}>
        <ListItemAvatar>
          <Avatar>
            {props.sender_avatar}
          </Avatar>
        </ListItemAvatar>
        <ListItemText
          primary={props.notification_title}
          secondary={props.sender_name}
        />
        <ListItemText
          align="right"
          primary={
            <Typography variant="subtitle" color="textSecondary">
              {props.time}
            </Typography>}
        />
      </ListItem>
    </Paper>
  )
}

function WorkItemList(props) {
  const classes = useStyles();

  return (
    <Paper variant="outlined" className={classes.listItemPaper}>
      <ListItem button component="a" href={props.work_link} className={classes.listItem}>
        <ListItemText
          primary={
            <Typography>
              {props.work_title}
            </Typography>
          }
          secondary={props.work_category}
        />
        <ListItemText
          align="right"
          primary={
            <Typography variant="subtitle" color="textSecondary">
              {props.work_duetime}
            </Typography>
          }
        />
      </ListItem>
    </Paper>
  )
}

const styles = (theme) => ({
  root: {
    margin: "auto",
    maxWidth: "1000px",
    padding: "10px"
  },
  paperTitle: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    height: "60px"
  },
  timePaper: {
    height: "250px",
    padding: "20px",
    color: "white",
    backgroundColor: theme.palette.primary.light,
    backgroundImage: `url(${dashboardStudentBackground})`,
    backgroundPosition: "bottom",
    backgroundRepeat: "no-repeat",
    backgroundSize: "contain",
  },
  notificationPaper: {
    padding: "20px",
  },
  workPaper: {
    padding: "20px",
  },
});

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      time: new Date()
    };
  }

  componentDidMount() {
    this.intervalID = setInterval(
      () => this.tick(),
      1000
    );
  }

  componentWillUnmount() {
    clearInterval(this.intervalID);
  }

  tick() {
    this.setState({
      time: new Date()
    });
  }

  render() {
    document.body.style = "background: #FFFFFF";
    document.title = "Schooly | Dashboard";

    const { classes } = this.props;
    const { user } = this.props.auth;

    return (
      <div className={classes.root}>
        <Grid container direction="column" spacing={3}>
          <Grid item>
            <Paper elevation={0} className={classes.timePaper}>
              <Typography variant="h3">
                <b>Selamat Datang, {user.name}</b>
              </Typography>
              <Typography variant="h5" style={{marginBottom: "40px"}}>
                Sekarang pukul {this.state.time.toLocaleTimeString("id-ID")}, tanggal {this.state.time.toLocaleDateString("id-ID")}.
              </Typography>
              <Typography variant="h6">
                Apa yang ingin kamu lakukan hari ini?
              </Typography>
            </Paper>
          </Grid>
          <Grid item container spacing={3}>
            <Grid item sm={7} xs={12}>
              <Paper className={classes.notificationPaper}>
                <div className={classes.paperTitle}>
                  <Typography variant="h5" color="primary">
                    Notifikasi Terkini
                  </Typography>
                  <LightTooltip title="Lihat Semua" placement="top">
                    <IconButton href="/notifikasi">
                      <ChevronRightIcon />
                    </IconButton>
                  </LightTooltip>
                </div>
                <List>
                  <NotificationItemList
                    sender_icon={<AccountCircleIcon />}
                    sender_name="Pak Peler"
                    notification_title="Ujian Kimia Besok"
                    notification_link="/test"
                    time={"20m ago"}
                  />
                  <NotificationItemList
                    sender_icon={<AccountCircleIcon />}
                    sender_name="My Nigga"
                    notification_title="Ujian Biologi Lusa"
                    notification_link="/test"
                    time={"20m ago"}
                  />
                </List>
              </Paper>
            </Grid>
            <Grid item sm={5} xs={12}>
              <Paper className={classes.workPaper}>
                <div className={classes.paperTitle}>
                  <Typography variant="h5" color="primary">
                    Pekerjaan Mendatang
                  </Typography>
                  <div style={{display: "flex", justifyContent: "flex-end"}}>
                  <LightTooltip title="Lihat Semua" placement="top">
                    <IconButton>
                      <ChevronRightIcon />
                    </IconButton>
                  </LightTooltip>
                  </div>
                </div>
                <List>
                  <WorkItemList
                    work_title="Tugas 1"
                    work_link="/test"
                    work_category="Fisika"
                    work_duetime="5 jam lagi"
                  />
                  <WorkItemList
                    work_title="Tugas 2: hisap peler"
                    work_link="/test"
                    work_category="Biologi"
                    work_duetime="1 jam lagi"
                  />
                </List>
              </Paper>
            </Grid>
          </Grid>
        </Grid>
      </div>
    )
  };
}

Dashboard.propTypes = {
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default withRouter(
  connect(mapStateToProps)
  (withStyles(styles)(Dashboard))
  )
