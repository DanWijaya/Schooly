import React, { Component } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { withStyles } from "@material-ui/core/styles";

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
});

class ScheduleCalendar extends Component {
  state = {
    date: new Date(),
  };

  onChange = (date) => this.setState({ date });

  render() {
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        <Calendar onChange={this.onChange} value={this.state.date} />
      </div>
    );
  }
}
export default withStyles(styles)(ScheduleCalendar);
