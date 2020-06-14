import React from "react";
import schoolySymbolLogo from "../../../images/SchoolySymbolLogo.png";
import { Divider, Grid, Link, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    position: "fixed",
    bottom: "0",
    width: "100%",
  },
  content: {
    maxWidth: "1000px",
    margin: "auto",
  },
  schoolySymbol: {
    width: "10%",
    height: "10%",
  },
  footerContainer: {
    display: "flex",
    justifyContent: "center",
  },
  footerLeftContent: {
    flex: "1",
    justifyContent: "flex-start",
  },
  footerLeftContent: {
    flex: "1",
    justifyContent: "flex-end",
  },
  contentFont: {
    fontSize: "13px",
  }
}));


function Footer() {
  const classes = useStyles();

  return(
    <div className={classes.root}>
      <div className={classes.content}>
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
          <img src={schoolySymbolLogo} className={classes.schoolySymbol} />
          <Grid container spacing={2} justify="flex-end" className={classes.contentFont}>
            <Grid item>
              <Link href="/tentang-schooly">
                Tentang Schooly
              </Link>
            </Grid>
            <Grid item>
              <Link href="/tentang-schooly">
                Hubungi Kami
              </Link>
            </Grid>
            <Grid item>
              <Link href="/tentang-schooly">
                Media Sosial
              </Link>
            </Grid>
          </Grid>
        </div>
      </div>
    </div>
  )
}

export default Footer;