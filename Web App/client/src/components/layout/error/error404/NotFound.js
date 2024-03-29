import React from "react";
import { Link } from "react-router-dom";
import {
  Button,
  Typography
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
  },
  notFoundBackground: {
    backgroundColor: "#0D2330",
  },
  notFound: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    backgroundImage: "url(/images/backgrounds/NotFoundBackground.svg)",
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
  notFoundText: {
    paddingLeft: "20px",
    paddingRight: "20px",
    color: "white",
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

  document.title = "Schooly | Error 404";

  return (
    <div className={classes.root}>
      <div className={classes.notFoundBackground}>
        <div className={classes.notFound}>
          <Typography variant="h4" className={classes.notFoundText}>
            <b>ERROR 404</b>
          </Typography>
          <Typography variant="h5" className={classes.notFoundText}>
            Halaman ini tidak ditemukan
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
