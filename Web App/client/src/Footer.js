import React from "react";
import { Link } from "react-router-dom";
import schoolySymbolLogo from "./images/SchoolySymbolLogo.png";
import Divider from "@material-ui/core/Divider";
import Grid from "@material-ui/core/Grid";
import Hidden from "@material-ui/core/Hidden";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import { FaLine, FaInstagram } from "react-icons/fa";

const useStyles = makeStyles((theme) => ({
  root: {
    margin: "auto",
    marginTop: "200px",
    padding: "10px",
    paddingBottom: "60px",
    maxWidth: "80%",
    [theme.breakpoints.down("md")]: {
      maxWidth: "100%",
    },
  },
  schoolySymbolLogo: {
    maxWidth: "60px",
    maxHeight: "60px",
    [theme.breakpoints.down("xs")]: {
      maxWidth: "45px",
      maxHeight: "45px",
    },
  },
  schoolyText: {
    fontFamily: "Caveat",
    fontSize: "22.5px",
    [theme.breakpoints.down("xs")]: {
      fontSize: "17.5px",
    },
  },
  socialMediaIcons: {
    width: "30px",
    height: "30px",
    [theme.breakpoints.down("xs")]: {
      width: "25px",
      height: "25px",
    },
    color: "#A9A9A9",
    "&:focus, &:hover": {
      color: "#808080",
    },
  },
}));

function Footer(props) {
  const classes = useStyles();
  return (
    props.assessmentState !== "ujian" ? (
      <div className={classes.root}>
        <Divider style={{ marginBottom: "10px" }} />
        <Grid container justify="space-between" alignItems="center" style={{ marginBottom: "10px" }}>
          <Grid item>
            <Grid container alignItems="center" spacing={1}>
              <Grid item>
                <img
                  src={schoolySymbolLogo}
                  alt="Schooly Symbol Logo"
                  className={classes.schoolySymbolLogo}
                />
              </Grid>
              <Grid item>
                <Typography color="textSecondary" className={classes.schoolyText}>
                  © Schooly System
                </Typography>
              </Grid>
            </Grid>
          </Grid>
          <Grid item>
            <Grid container spacing={2}>
              <Grid item>
                <a href="https://page.line.me/626hckre" target="blank_">
                  <FaLine className={classes.socialMediaIcons} />
                </a>
              </Grid>
              <Grid item>
                <a href="https://instagram.com/schoolysystem" target="blank_">
                  <FaInstagram className={classes.socialMediaIcons} />
                </a>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Hidden smUp>
          <div style={{ paddingLeft: "15px" }}>
            <Typography gutterBottom>
            <Link to="/tentang-schooly">
              Tentang Schooly
              </Link>
            </Typography>
            <Typography gutterBottom>
              <Link to="/bantuan">
                Bantuan
              </Link>
            </Typography>
            <Typography gutterBottom>
              <a href="mailto:schoolysystem@gmail.com">
                Hubungi Kami
              </a>
            </Typography>
            <Typography gutterBottom>
              <Link to="/legal/ketentuan-penggunaan">
                Ketentuan Pengunaan
              </Link>
            </Typography>
            <Typography gutterBottom>
              <Link to="/legal/kebijakan-privasi">
                Kebijakan Privasi
              </Link>
            </Typography>
          </div>
        </Hidden>
        <Hidden xsDown>
          <Grid container justify="space-between">
            <Grid item>
              <Grid container spacing={2} justify="flex-start">
                <Grid item>
                  <Link to="/legal/ketentuan-penggunaan">Ketentuan Pengunaan</Link>
                </Grid>
                <Grid item>
                  <Link to="/legal/kebijakan-privasi">Kebijakan Privasi</Link>
                </Grid>
              </Grid>
            </Grid>
            <Grid item>
              <Grid container spacing={2} justify="flex-end">
                <Grid item>
                  <Link to="/tentang-schooly">Tentang Schooly</Link>
                </Grid>
                <Grid item>
                  <Link to="/bantuan">Bantuan</Link>
                </Grid>
                <Grid item>
                  <a href="mailto:schoolysystem@gmail.com">Hubungi Kami</a>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Hidden>
      </div>
    ) : null
  );
}

export default React.memo(Footer);
