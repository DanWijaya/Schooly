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
    height: "300px",
    backgroundImage: `url(${notFoundBackground})`,
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    backgroundSize: "contain",
  },
  notFoundText: {
    color: "white",
  },
  buttonContainer: {
    display: "flex",
    justifyContent: "center",
    marginTop: "30px",
  },
}));

function NotFound() {
  const classes = useStyles();

  return(
    <div className={classes.root}>
      <div className={classes.notFoundBackground}>
        <div className={classes.notFoundContainer}>
          <Typography variant="h3" className={classes.notFoundText}>
            ERROR 404
          </Typography>
          <Typography variant="h4" className={classes.notFoundText}>
            TIDAK DITEMUKAN
          </Typography>
        </div>
      </div>
      <div className={classes.buttonContainer}>
        <Button variant="contained">
          Kembali ke Beranda
        </Button>
      </div>
    </div>
  )
};

export default NotFound;
