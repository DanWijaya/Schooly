import React from "react";
import schoolySymbolLogo from "../../../images/SchoolySymbolLogo.png";
import { Divider, Grid, Hidden, Link } from "@material-ui/core";
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
  content: {
    fontSize: "12px",
  }
}));


function Footer() {
  const classes = useStyles();

  return(
    <div className={classes.root}>
    <Divider style={{marginBottom: "10px"}} />
      <Hidden smUp implementation="css">
        {/* Mobile = Column View */}
        <div className={classes.footerContainer}>
          <Grid container direction="column" spacing={2} alignItems="flex-start" className={classes.content}>
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
          <Grid container direction="column" spacing={2} alignItems="flex-end" className={classes.content}>
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
      </Hidden>
      <Hidden xsDown implementation="css">
        {/* Desktop = Row View */}
        <div className={classes.footerContainer}>
          <Grid container spacing={2} justify="flex-start" className={classes.content}>
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
          <Grid container spacing={2} justify="flex-end" className={classes.content}>
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
              <Link href="http://www.instagram.com" target="_blank">
                Instagram
              </Link>
            </Grid>
          </Grid>
        </div>
      </Hidden>
    </div>
  )
}

export default Footer;
