import React from "react";
import schoolySymbolLogo from "../../../images/SchoolySymbolLogo.png";
import { Divider, Grid, Link } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    margin: "auto",
    maxWidth: "1000px",
    padding: "10px",
  },
  schoolySymbol: {
    width: "10%",
    height: "10%",
  },
  footerContainer: {
    display: "flex",
    justifyContent: "center",
  },
  contentFont: {
    fontSize: "13px",
  }
}));


function Footer() {
  const classes = useStyles();

  return(
    <div className={classes.root}>
    <Divider style={{marginBottom: "10px"}} />
      <div className={classes.footerContainer}>
        <Grid container spacing={2} justify="flex-start" className={classes.contentFont}>
          <Grid item style={{color: "grey"}}>
            2020 Schooly System
          </Grid>
          <Grid item>
            <Link href="/bantuan">
              Bantuan
            </Link>
          </Grid>
          <Grid item>
            <Link href="/kebijakan-penggunaan">
              Kebijakan Pengunaan
            </Link>
          </Grid>
        </Grid>
        <img src={schoolySymbolLogo} alt="Schooly Symbol Logo" className={classes.schoolySymbol} />
        <Grid container spacing={2} justify="flex-end" className={classes.contentFont}>
          <Grid item>
            <Link href="/tentang-schooly">
              Tentang Schooly
            </Link>
          </Grid>
          <Grid item>
            <Link href="mailto:schoolysystem@gmail.com">
              Hubungi Kami
            </Link>
          </Grid>
          <Grid item>
            <Link href="http://www.instagram.com">
              Instagram
            </Link>
          </Grid>
        </Grid>
      </div>
    </div>
  )
}

export default Footer;
