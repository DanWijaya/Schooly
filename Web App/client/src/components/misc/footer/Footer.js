import React from "react";
import schoolySymbolLogo from "../../../images/SchoolySymbolLogo.png";
import { Divider, Grid, Hidden, Typography } from "@material-ui/core";
import { Link } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: "1000px",
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
    objectFit: "contain"
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
}));

function Footer(props) {
  const classes = useStyles();
  const { hideLink } = props;
  return (
    <div className={classes.root}>
      <Divider style={{marginBottom: "10px"}} />
      <Hidden mdUp implementation="css">
        {/* Mobile = Column View */}
        {(props.assessmentState !== "ujian") ?
          <Grid container justify="space-between">
            <Grid item>
              <div className={classes.footerMobileContainer}>
                <Typography variant="caption" color="textSecondary">
                  Schooly System
                </Typography>
                <img src={schoolySymbolLogo} alt="Schooly Symbol Logo" className={classes.schoolySymbolMobile} />
              </div>
            </Grid>
            <Grid item>
              <div className={classes.footerMobileContainer}>
                <Typography variant="caption">
                  <Link to="/bantuan">
                    {/* {(hideLink) ? null : "Bantuan"} */}
                    Bantuan
                  </Link>
                </Typography>
                <Typography variant="caption">
                  <Link to="/tentang-schooly">
                    {/* {(hideLink) ? null : "Tentang Schooly"} */}
                    Tentang Schooly
                  </Link>
                </Typography>
                <Typography variant="caption">
                  <Link to="/kebijakan-penggunaan">
                    {/* {(hideLink) ? null : "Kebijakan Pengunaan"} */}
                    Kebijakan Pengunaan
                  </Link>
                </Typography>
              </div>
            </Grid>
            <Grid item>
              <div className={classes.footerMobileContainer}>
                <Typography variant="caption">
                  <Link to="mailto:schoolysystem@gmail.com">
                    {/* {(hideLink) ? null : "Hubungi Kami"} */}
                    Hubungi Kami
                  </Link>
                </Typography>
                <Typography variant="caption">
                  <Link to="http://www.instagram.com">
                    {/* {(hideLink) ? null : "Instagram"} */}
                    Instagram
                  </Link>
                </Typography>
              </div>
            </Grid>
          </Grid>
        :
          null
        }
      </Hidden>
      <Hidden smDown implementation="css">
        {/* Desktop = Row View */}
        <div className={classes.footerDesktopContainer}>
          {(props.assessmentState !== "ujian") ?
            <>
              <Grid container spacing={2} justify="flex-start">
                <Grid item style={{color: "grey"}}>
                  Schooly System
                </Grid>
                <Grid item>
                  <Link to="/bantuan">
                    {/* {(hideLink) ? null : "Bantuan"} */}
                    Bantuan
                  </Link>
                </Grid>
                <Grid item>
                  <Link to="/kebijakan-penggunaan">
                    {/* {(hideLink) ? null : "Kebijakan Pengunaan"} */}
                    Kebijakan Pengunaan
                  </Link>
                </Grid>
              </Grid>
              <img src={schoolySymbolLogo} alt="Schooly Symbol Logo" className={classes.schoolySymbolDesktop} />
              <Grid container spacing={2} justify="flex-end">
                <Grid item>
                  <Link to="/tentang-schooly">
                    {/* {(hideLink) ? null : "Tentang Schooly"} */}
                    Tentang Schooly
                  </Link>
                </Grid>
                <Grid item>
                  <a href="mailto:schoolysystem@gmail.com">
                    {/* {(hideLink) ? null : "Hubungi Kami"} */}
                    Hubungi Kami
                  </a>
                </Grid>
                <Grid item>
                  <a href="http://www.instagram.com">
                    {/* {(hideLink) ? null : "Instagram"} */}
                    Instagram
                  </a>
                </Grid>
              </Grid>
            </>
          :
            null
          }
        </div>
      </Hidden>
    </div>
  )
}

export default React.memo(Footer);
