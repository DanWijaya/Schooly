import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import LightTooltip from "../../misc/light-tooltip/LightTooltip";
import { Avatar, Divider, IconButton, List, ListItem, ListItemAvatar, ListItemSecondaryAction, ListItemText, Paper, Typography } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";

const styles = (theme) => ({
  root: {
    margin: "auto",
    maxWidth: "1000px",
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
    marginBottom: "60px",
  },
  notificationPaper: {
    marginBottom: "50px",
    padding: "20px",
  },
  workPaper: {
    padding: "20px",
  },
});

function NotificationItemList(props) {
  return (
    <ListItem button component="a" href={props.notification_link}>
      <ListItemAvatar>
        <Avatar>
          {props.sender_avatar}
        </Avatar>
      </ListItemAvatar>
      <ListItemText
        primary={
          <Typography>
            {props.notification_title}
          </Typography>
        }
        secondary={props.sender_name}
      />
      <ListItemSecondaryAction>
        <Typography variant="subtitle" style={{color: "grey"}}>
          {props.time}
        </Typography>
      </ListItemSecondaryAction>
    </ListItem>
  )
}

function WorkItemList(props) {
  return (
    <ListItem button component="a" href={props.work_link}>
      <ListItemText
        primary={
          <Typography style={{color: "#2196f3"}}>
            {props.work_title}
          </Typography>
        }
        secondary={props.work_category}
      />
      <ListItemSecondaryAction>
        <Typography variant="subtitle" style={{color: "grey"}}>
          {props.work_duetime}
        </Typography>
      </ListItemSecondaryAction>
    </ListItem>
  )
}

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
    document.title="Schooly | Beranda";

    const { classes } = this.props;
    const { user } = this.props.auth;

    return (
      <div className={classes.root}>
        <Paper variant="outlined" className={classes.timePaper}>
          <Typography variant="h3">
            <b>Selamat Datang, {user.name}</b>
          </Typography>
          <Typography variant="h4" style={{marginBottom: "40px"}}>
            Sekarang pukul {this.state.time.toLocaleTimeString("id-ID")}, tanggal {this.state.time.toLocaleDateString("id-ID")}
          </Typography>
          <Typography variant="h5">
            Apa yang ingin kamu lakukan hari ini?
          </Typography>
        </Paper>
        <Paper className={classes.notificationPaper}>
          <div className={classes.paperTitle}>
            <Typography variant="h5">
              Notifikasi Terkini
            </Typography>
            <LightTooltip title="Semua Notifikasi" placement="right">
              <IconButton href="/notifikasi">
                <ChevronRightIcon />
              </IconButton>
            </LightTooltip>
          </div>
          <Divider />
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
        <Paper className={classes.workPaper}>
          <div className={classes.paperTitle}>
            <Typography variant="h5">
              Pekerjaan Mendatang
            </Typography>
            <div style={{display: "flex", justifyContent: "flex-end"}}>
            <LightTooltip title="Semua Pekerjaan" placement="right">
              <IconButton>
                <ChevronRightIcon />
              </IconButton>
            </LightTooltip>
            </div>
          </div>
          <Divider />
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
