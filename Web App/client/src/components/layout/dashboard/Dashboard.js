import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { Avatar, Divider, Grid, Link, List, ListItem, Paper, Typography } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";

const styles = (theme) => ({
  root: {
    margin: "auto",
    maxWidth: "1000px",
    textAlign: "center",
  },
});

function NotificationItemList(props) {
  return (
    <ListItem style={{display: "flex", justifyContent: "center", alignItems: "center"}}>
      <Avatar>
        {props.sender_avatar}
      </Avatar>
      <Typography style={{width: "15%"}}>
        {props.sender_name}
      </Typography>
      <Typography style={{width: "60%"}}>
        <Link href={props.notification_link} style={{color: "#2196f3"}}>
          {props.notification_title}
        </Link>
      </Typography>
      <Typography variant="subtitle" style={{color: "grey", width: "10%"}}>
        {props.time}
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
    document.body.style.background = "white"

    const { classes } = this.props;
    const { user } = this.props.auth;

    return (
      <div className={classes.root}>
        <Typography variant="h2">
          <b>Selamat Datang {user.name.split(" ")[0]}</b>
        </Typography>
        <Typography variant="h3" style={{marginBottom: "40px"}}>
          Sekarang tanggal {this.state.time}
        </Typography>
        <Typography variant="h4" style={{marginBottom: "60px"}}>
          Apa yang ingin kamu lakukan hari ini?
        </Typography>
        <Paper style={{marginBottom: "50px"}}>
          <Typography variant="h5">
            Notifikasi Terkini
          </Typography>
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
        <Paper>
          <Typography variant="h5">
            Pekerjaan Anda
          </Typography>
          <Divider />
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
