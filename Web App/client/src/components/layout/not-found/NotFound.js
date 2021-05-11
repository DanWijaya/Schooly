import React from "react";
import notFoundBackground from "./NotFoundBackground.png";
import { Button, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { Link } from "react-router-dom";

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
}));

function NotFound(props) {
  const classes = useStyles();

  const [isFirsttimeRendered, setFirstTime] = React.useState(false);
  const { handleMarginTopValue } = props;
  if (!isFirsttimeRendered) {
    handleMarginTopValue(0);
    setFirstTime(true);
  }

  document.title = "Schooly | Error 404";

  return (
    <div className={classes.root}>
      <div className={classes.notFoundBackground}>
        <div className={classes.notFoundContainer}>
          <Typography variant="h4" className={classes.notFoundText}>
            <b>404 ERROR</b>
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

export default NotFound;
