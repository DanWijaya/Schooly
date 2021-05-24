import React, {Component} from "react";
import problemEncounteredBackground from "./ProblemEncounteredBackground.png";
import { Button, Typography } from "@material-ui/core";
import { makeStyles, withStyles  } from "@material-ui/core/styles";
import { Link, withRouter } from "react-router-dom";
import EmailIcon from "@material-ui/icons/Email";

const styles = (theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
  },
  problemEncounteredBackground: {
    backgroundColor: theme.palette.primary.main,
  },
  problemEncounteredContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    margin: "auto",
    maxWidth: "100%",
    height: "350px",
    backgroundImage: `url(${problemEncounteredBackground})`,
    backgroundPosition: "bottom",
    backgroundRepeat: "no-repeat",
    backgroundSize: "contain",
  },
  problemEncounteredText: {
    color: "white",
    fontFamily: "Arial",
    paddingLeft: "20px",
    paddingRight: "20px",
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
      backgroundColor: theme.palette.primary.dark,
      color: "white",
    },
  },
});

class ProblemEncountered extends Component {
  constructor(props){
    super(props)
  }

  componentDidUpdate(prevProps){
    if(prevProps.location != this.props.location){
        this.props.handleProblemEncountered(false)
    }
  }

  componentWillUnmount(){
    this.props.handleProblemEncountered(false)
  }

  render(){

  const { classes, problemEncountered, handleProblemEncountered } = this.props;
  

  document.title = "Schooly | Problem Encountered";

  return (
    <div className={classes.root}>
      <div className={classes.problemEncounteredBackground}>
        <div className={classes.problemEncounteredContainer}>
          <Typography variant="h2" gutterBottom className={classes.problemEncounteredText}>
            <b>:(</b>
          </Typography>
          <Typography variant="h6" className={classes.problemEncounteredText}>
            Maaf, terdapat masalah dalam memproses permintaan Anda.
          </Typography>
        </div>
      </div>
      <div className={classes.buttonContainer}>
        <Button
          variant="contained"
          size="large"
          href="mailto:schoolysystem@gmail.com"
          startIcon={<EmailIcon />}
          className={classes.backButton}
        >
          Laporkan Masalah
        </Button>
      </div>
    </div>
  );
  }
}

export default withRouter(withStyles(styles)(React.memo(ProblemEncountered)));
