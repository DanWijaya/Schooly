import React from "react";
import notFoundBackground from "./NotFoundBackground.png";
import { Button, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
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
    width: "1000px",
    height: "350px",
    backgroundImage: `url(${notFoundBackground})`,
    backgroundPosition: "bottom",
    backgroundRepeat: "no-repeat",
    backgroundSize: "contain",
  },
  notFoundText: {
    color: "white",
    fontFamily: "Arial"
  },
  buttonContainer: {
    display: "flex",
    justifyContent: "center",
    marginTop: "30px",
  },
  backButton: {
    backgroundColor: theme.palette.primary.main,
    color: "white",
    "&:focus": {
      backgroundColor: theme.palette.primary.main,
      color: "white",
    },
    "&:hover": {
      backgroundColor: theme.palette.primary.main,
      color: "white",
    },
  },
}));

function NotFound(props) {
  document.title="Schooly | Error 404: Tautan tidak Ditemukan";

  const classes = useStyles();

  const [isFirsttimeRendered, setFirstTime] = React.useState(false)
  const { handleMarginTopValue } = props;
  if(!isFirsttimeRendered) {
    handleMarginTopValue(0);
    setFirstTime(true);
  }

  return(
    <div className={classes.root}>
      <div className={classes.notFoundBackground}>
        <div className={classes.notFoundContainer}>
          <Typography variant="h4" className={classes.notFoundText}>
            <b>ERROR 404</b>
          </Typography>
          <Typography variant="h5" className={classes.notFoundText}>
            TAUTAN TIDAK DITEMUKAN
          </Typography>
        </div>
      </div>
      <div className={classes.buttonContainer}>
        <Button
          variant="contained"
          size="large"
          className={classes.backButton}
          href="/dashboard"
        >
          Kembali ke Beranda
        </Button>
      </div>
    </div>
  )
};

export default NotFound;
