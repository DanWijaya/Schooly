import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import LightTooltip from "../../misc/light-tooltip/LightTooltip"
import { Avatar, Divider, Grid, IconButton, Link, List, ListItem, Paper, Typography } from "@material-ui/core";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";

const styles = (theme) => ({
  root: {
    margin: "auto",
    maxWidth: "800px",
    textAlign: "center",
  },
  paperTitle: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    height: "60px"
  },
  iconButton: {
    "&:focus": {
      backgroundColor: "transparent",
    },
    "&:hover": {
      backgroundColor: "transparent",
    },
  },
  notificationPaper: {
    marginBottom: "50px",
    padding: "20px",
  },
  workPaper: {
    padding: "20px",
  },
});

const useStyles = makeStyles((theme) => ({
  notificationSenderAvatar: {
    display: "flex",
    justifyContent: "flex-start",
    width: "7.5%"
  },
  notificationSender: {
    display: "flex",
    justifyContent: "flex-start",
    width: "17.5%"
  },
  notificationTitle: {
    display: "flex",
    justifyContent: "space-between",
    width: "65%",
  },
  notificationTime: {
    display: "flex",
    justifyContent: "flex-end",
    color: "grey",
    width: "10%"
  },
  workTitle: {
    display: "flex",
    justifyContent: "flex-start",
    width: "60%",
  },
  workCategory: {
    display: "flex",
    justifyContent: "center",
    width: "30%"
  },
  workDueTime: {
    display: "flex",
    justifyContent: "flex-end",
    color: "grey",
    width: "10%",
  }
}));

function NotificationItemList(props) {
  const classes = useStyles();

  return (
    <ListItem>
      <div className={classes.notificationSenderAvatar}>
        <Avatar>
          {props.sender_avatar}
        </Avatar>
      </div>
      <Typography className={classes.notificationSender}>
        {props.sender_name}
      </Typography>
      <Typography className={classes.notificationTitle}>
        <Link href={props.notification_link}>
          {props.notification_title}
        </Link>
      </Typography>
      <Typography variant="subtitle" className={classes.notificationTime}>
        {props.time}
      </Typography>
    </ListItem>
  )
}

function WorkItemList(props) {
  const classes = useStyles();

  return (
    <ListItem>
      <Typography className={classes.workTitle}>
        <Link href={props.work_link}>
          {props.work_title}
        </Link>
      </Typography>
      <Typography className={classes.workCategory}>
        {props.work_category}
      </Typography>
      <Typography variant="subtitle" className={classes.workDueTime}>
        {props.work_duetime}
      </Typography>
    </ListItem>
  )
}

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      time: new Date().toLocaleString()
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
      time: new Date().toLocaleString()
    });
  }

  render() {
    document.title="Dashboard | Schooly"
    document.body.style.background = "#DCDCDC"

    const { classes } = this.props;
    const { user } = this.props.auth;

    return (
      <div className={classes.root}>
        <Typography variant="h3">
          <b>Selamat Datang {user.name.split(" ")[0]}</b>
        </Typography>
        <Typography variant="h4" style={{marginBottom: "40px"}}>
          Sekarang tanggal {this.state.time}
        </Typography>
        <Typography variant="h5" style={{marginBottom: "60px"}}>
          Apa yang ingin kamu lakukan hari ini?
        </Typography>
        <Paper className={classes.notificationPaper}>
          <div className={classes.paperTitle}>
            <Typography variant="h5">
              Notifikasi Terkini Anda
            </Typography>
            <LightTooltip title="Semua Notifikasi" placement="right">
              <IconButton className={classes.iconButton}>
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
              Pekerjaan Anda
            </Typography>
            <LightTooltip title="Semua Pekerjaan" placement="right">
              <IconButton className={classes.iconButton}>
                <ChevronRightIcon />
              </IconButton>
            </LightTooltip>
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
