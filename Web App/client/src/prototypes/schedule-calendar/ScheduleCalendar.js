import React, { Component } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { withStyles } from "@material-ui/core/styles";
import {
  Badge
} from "@material-ui/core";


const styles = (theme) => ({
  root: {
    margin: "auto",
    maxWidth: "80%",
    [theme.breakpoints.down("md")]: {
      maxWidth: "100%",
    },
    display: "flex",
    justifyContent: "center",
  },
  tile: {
    position: "relative",
    height: "64px",
    minWidth: "128px"
  },
  tileDiv: {
    position: "absolute",
    left: "50%",
    top: "50%",
    transform: "translate(-50%, -50%)"
  },
  tileText: {
    margin: "0",
    color: "rgba(0, 0, 0, 0)" // transparan
  },
  dateBadge: {
    right: "-8px",
    top: "-8px",

    minWidth: "10px",
    borderRadius: "5px",
    height: "10px",
    padding: "0"
    /* 
      https://github.com/mui-org/material-ui/issues/14105
      ubah ukuran badge dengan:
      min-width: 2r;
      border-radius: r;
      height: 2r;
      padding: 0; // ini coba2 sendiri, gatau nilai yg dari mui: "0 6px" itu buat apa
    */
  },
  calendar: {
    width: "unset"
  },
  dayName: {
    color: "red"
  }
});

class ScheduleCalendar extends Component {
  constructor(props) {
    super(props);
    this.myRef = React.createRef();
    this.state = {
      date: new Date(),
    };
  }
  
  onChange = (date) => this.setState({ date });

  tileContent = (date, view, classes) => {
    const dates = [1, 11, 19, 24]; // tanggal2 ini akan diberi badge
    return dates.includes(date.getDate()) && view === 'month' ?
      <div className={classes.tileDiv}>
        <Badge
          badgeContent={1}
          color="secondary"
          classes={{ badge: classes.dateBadge }}
          // anchorOrigin={{
          //   vertical: "bottom",
          //   horizontal: "right",
          // }}
        >
          {/* bagian ini fungsinya hanya agar badge dapat ditampilkan di tanggal (angka tanggal di dalem tile2nya) dari React Calendar nya */}
          <p className={classes.tileText}>{date.getDate()}</p>  
        </Badge>
      </div>
      : null
  }

  componentDidMount() {
    const { classes } = this.props;

    // untuk mengubah style teks nama hari yg ada di atas tile2 tanggal
    this.myRef.current.querySelectorAll(".react-calendar__month-view__weekdays__weekday > abbr").forEach(el => el.classList.add(classes.dayName));
  }

  render() {
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        <Calendar 
          className={classes.calendar} 
          onChange={this.onChange} 
          value={this.state.date} 
          tileClassName={classes.tile}
          inputRef={this.myRef}
          // formatShortWeekday={(locale, date) => (String(date.getDay()))} //untuk mengubah "MON", "THURS", dkk menjadi teks yg diinginkan
          tileContent={({ date, view }) => this.tileContent(date, view, classes)} />
      </div>
    );
  }
}
export default withStyles(styles)(ScheduleCalendar);
