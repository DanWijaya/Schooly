import React from "react";
import schoolySymbolLogo from "./images/SchoolySymbolLogo.png";
import { Divider, Grid, Hidden, Typography } from "@material-ui/core";
import { Link } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: "80%",
    [theme.breakpoints.down("md")]: {
      maxWidth: "100%",
    },
    margin: "auto",
    marginTop: "100px",
    padding: "10px",
  },
  schoolySymbolDesktop: {
    width: "10%",
    height: "10%",
  },
  schoolySymbolDesktopAssessment: {
    width: "20%",
    height: "20%",
    objectFit: "contain",
  },
  schoolySymbolMobile: {
    width: "50px",
    height: "50px",
  },
  footerDesktopContainer: {
    display: "flex",
    justifyContent: "center",
  },
  footerMobileContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
  },
  mobileFont: {
    fontSize: "11px",
    [theme.breakpoints.up("sm")]: {
      fontSize: "13.5px",
    },
  },
}));

function Footer(props) {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <Hidden mdUp implementation="css">
        {/* Mobile = Column View */}
        {props.assessmentState !== "ujian" ? (
          <div>
            <Divider style={{ marginBottom: "10px" }} />
            <Grid container justify="space-between">
              <Grid item>
                <div className={classes.footerMobileContainer}>
                  <Typography
                    color="textSecondary"
                    className={classes.mobileFont}
                  >
                    Schooly System
                  </Typography>
                  <img
                    src={schoolySymbolLogo}
                    alt="Schooly Symbol Logo"
                    className={classes.schoolySymbolMobile}
                  />
                </div>
              </Grid>
              <Grid item>
                <div className={classes.footerMobileContainer}>
                  <Typography gutterBottom className={classes.mobileFont}>
                    <Link to="/bantuan">Bantuan</Link>
                  </Typography>
                  <Typography gutterBottom className={classes.mobileFont}>
                    <Link to="/tentang-schooly">Tentang Schooly</Link>
                  </Typography>
                  <Typography gutterBottom className={classes.mobileFont}>
                    <Link to="/legal/ketentuan-penggunaan">Ketentuan Pengunaan</Link>
                  </Typography>
                </div>
              </Grid>
              <Grid item>
                <div className={classes.footerMobileContainer}>
                  <Typography gutterBottom className={classes.mobileFont}>
                    <Link to="mailto:schoolysystem@gmail.com">
                      Hubungi Kami
                    </Link>
                  </Typography>
                  <Typography gutterBottom className={classes.mobileFont}>
                    <Link to="https://instagram.com/schoolysystem">
                      Media Sosial
                    </Link>
                  </Typography>
                </div>
              </Grid>
            </Grid>
          </div>
        ) : null}
      </Hidden>
      <Hidden smDown implementation="css">
        {/* Desktop = Row View */}
        {props.assessmentState !== "ujian" ? (
          <div>
            <Divider style={{ marginBottom: "10px" }} />
            <div className={classes.footerDesktopContainer}>
              <Grid item container spacing={2} justify="flex-start">
                <Grid item style={{ color: "grey" }}>
                  Schooly System
                </Grid>
                <Grid item>
                  <Link to="/bantuan">Bantuan</Link>
                </Grid>
                <Grid item>
                  <Link to="/legal/ketentuan-penggunaan">Ketentuan Pengunaan</Link>
                </Grid>
              </Grid>
              <img
                src={schoolySymbolLogo}
                alt="Schooly Symbol Logo"
                className={classes.schoolySymbolDesktop}
              />
              <Grid container spacing={2} justify="flex-end">
                <Grid item>
                  <Link to="/tentang-schooly">Tentang Schooly</Link>
                </Grid>
                <Grid item>
                  <a href="mailto:schoolysystem@gmail.com">Hubungi Kami</a>
                </Grid>
                <Grid item>
                  <a href="https://instagram.com/schoolysystem" target="blank_">Media Sosial</a>
                </Grid>
              </Grid>
            </div>
          </div>
        ) : null}
      </Hidden>
    </div>
  );
}

export default React.memo(Footer);
