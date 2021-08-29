import React, { Component } from "react";
import problemEncounteredBackground from "./ProblemEncounteredBackground.svg";
import { Button, Typography } from "@material-ui/core";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import { Link, withRouter } from "react-router-dom";
import EmailIcon from "@material-ui/icons/Email";

const styles = (theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
  },
  problemEncounteredBackground: {
    backgroundColor: "#242528",
  },
  problemEncountered: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    backgroundImage: `url(${problemEncounteredBackground})`,
    backgroundPosition: "bottom",
    backgroundOrigin: "content-box",
    backgroundRepeat: "no-repeat",
    backgroundSize: "contain",
    margin: "auto",
    padding: "0px 5px 0px 5px",
    height: "350px",
    maxWidth: "80%",
    [theme.breakpoints.down("md")]: {
      maxWidth: "100%",
    },
  },
  problemEncounteredText: {
    paddingLeft: "20px",
    paddingRight: "20px",
    color: "white",
  },
  buttonContainer: {
    display: "flex",
    justifyContent: "center",
    marginTop: "30px",
  },
  reportButton: {
    backgroundColor: theme.palette.primary.main,
    color: "white",
    "&:focus, &:hover": {
      backgroundColor: theme.palette.primary.main,
      color: "white",
    },
  },
});

class ProblemEncountered extends Component {
  constructor(props) {
    super(props);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.location != this.props.location) {
      this.props.handleProblemEncountered(false);
    }
  }

  render() {
    const {
      classes,
      problemEncountered,
      handleProblemEncountered,
    } = this.props;

    document.title = "Schooly | Error 500";

    return (
      <div className={classes.root}>
        <div className={classes.problemEncounteredBackground}>
          <div className={classes.problemEncountered}>
            <Typography variant="h4" className={classes.problemEncounteredText}>
              <b>ERROR 500</b>
            </Typography>
            <Typography variant="h6" className={classes.problemEncounteredText}>
              Terdapat masalah dalam memproses permintaan Anda.
            </Typography>
          </div>
        </div>
        <div className={classes.buttonContainer}>
          <Button
            variant="contained"
            size="large"
            href="mailto:schoolysystem@gmail.com"
            startIcon={<EmailIcon />}
            className={classes.reportButton}
          >
            Laporkan Masalah
          </Button>
        </div>
      </div>
    );
  }
}

export default withRouter(withStyles(styles)(React.memo(ProblemEncountered)));
