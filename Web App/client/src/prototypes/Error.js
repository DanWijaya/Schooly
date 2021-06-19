import React from "react";
import { Component } from "react";
import notFoundBackground from "./NotFoundBackground.png";
import { Button, Typography } from "@material-ui/core";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import { Link, withRouter } from "react-router-dom";

const styles = (theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
  },
  notFoundBackground: {
    backgroundColor: "#0d2330",
  },
  notFoundContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    margin: "auto",
    maxWidth: "80%",
    [theme.breakpoints.down("md")]: {
      maxWidth: "100%",
    },
    height: "350px",
    backgroundImage: `url(${notFoundBackground})`,
    backgroundPosition: "bottom",
    backgroundRepeat: "no-repeat",
    backgroundSize: "contain",
  },
  notFoundText: {
    color: "white",
    fontFamily: "Arial",
  },
  buttonContainer: {
    display: "flex",
    justifyContent: "center",
    marginTop: "30px",
  },
  backButton: {
    backgroundColor: theme.palette.primary.main,
    color: "white",
    "&:focus, &:hover": {
      backgroundColor: theme.palette.primary.main,
      color: "white",
    },
  },
});

class Error extends Component {
  constructor(props) {
    super(props);
  }

  //   document.title = "Schooly | Error 404";
  // static getDerivedStateFromError(error){
  //     this.props.handleProblemEncountered(true)
  // }
  componentDidUpdate(prevProps) {
    if (prevProps.location != this.props.location) {
      this.props.handleProblemEncountered(false);
    }
  }

  componentWillUnmount() {
    this.props.handleProblemEncountered(false);
  }
  render() {
    const {
      classes,
      problemEncountered,
      handleProblemEncountered,
    } = this.props;
    return (
      <div className={classes.root}>
        <div className={classes.notFoundBackground}>
          <div className={classes.notFoundContainer}>
            <Typography variant="h4" className={classes.notFoundText}>
              <b>Terjadi Kesalahan dengan sistem</b>
            </Typography>
            <Typography variant="h5" className={classes.notFoundText}>
              Maaf, halaman ini tidak ditemukan
            </Typography>
          </div>
        </div>
        <div className={classes.buttonContainer}>
          <Link to="/beranda">
            <Button
              variant="contained"
              size="large"
              className={classes.backButton}
            >
              Kembali ke Beranda
            </Button>
          </Link>
        </div>
      </div>
    );
  }
}

export default withRouter(withStyles(styles)(React.memo(Error)));
