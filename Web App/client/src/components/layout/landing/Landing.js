import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import schoolyIntroduction from "./SchoolyIntroduction.png";
import schoolyAccess from "./SchoolyAccess.png";
import { Avatar, Button, Grid, Paper, Typography } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import AssignmentIcon from "@material-ui/icons/Assignment";
import ContactlessIcon from "@material-ui/icons/Contactless";
import ContactMailIcon from "@material-ui/icons/ContactMail";
import FilterNoneIcon from "@material-ui/icons/FilterNone";
import PeopleIcon from "@material-ui/icons/People";
import WatchLaterIcon from "@material-ui/icons/WatchLater";
import PropTypes from "prop-types";

const styles = (theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
  },
  schoolyIntroductionBackground: {
    backgroundColor: theme.palette.primary.light,
  },
  schoolyIntroduction: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "flex-end",
    margin: "auto",
    maxWidth: "1000px",
    padding: "20px",
    color: "white",
  },
  schoolyAccessBackground: {
    backgroundColor: "#F5F5F5",
  },
  schoolyAccess: {
    textAlign: "center",
    margin: "auto",
    maxWidth: "1000px",
    marginTop: "30px",
    marginBottom: "30px",
    padding: "10px",
  },
  schoolyFeaturesBackground: {
    backgroundColor: theme.palette.button.main,
  },
  schoolyFeatures: {
    textAlign: "center",
    margin: "auto",
    maxWidth: "1000px",
    marginTop: "75px",
    marginBottom: "75px",
    padding: "20px",
  },
  schoolyFeaturesTitle: {
    color: "grey",
  },
  featuresPaper: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    height: "100%",
    padding: "20px",
  },
  featuresAvatar: {
    width: theme.spacing(15),
    height: theme.spacing(15),
    marginBottom: "10px",
    backgroundColor: "white",
    color: theme.palette.primary.main,
  },
  featuresIcon: {
    width: theme.spacing(10),
    height: theme.spacing(10),
    color: theme.palette.primary.main,
  },
  featuresText: {
    fontSize: "14px",
    [theme.breakpoints.down("sm")]: {
      fontSize: "12.5px",
    },
  },
  useSchooly: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
    margin: "auto",
    marginTop: "30px",
    padding: "10px",
    maxWidth: "1000px",
  },
  sendMessageButton: {
    width: "160px",
    marginRight: "30px",
    backgroundColor: theme.palette.primary.main,
    color: "white",
    "&:focus, &:hover": {
      backgroundColor: theme.palette.primary.main,
      color: "white",
    },
  },
  copyLinkButton: {
    width: "160px",
    backgroundColor: "white",
    color: theme.palette.primary.main,
    "&:focus, &:hover": {
      backgroundColor: "white",
      color: theme.palette.primary.main,
    },
  }
});

class Landing extends Component {
  componentDidMount() {
    if (this.props.auth.isAuthenticated) {
      this.props.handleMarginTopValue(20)
      this.props.history.push("/beranda");
    }
    else
      this.props.handleMarginTopValue(0);
  }

  copyToClipboard(text) {
    var dummy = document.createElement("textarea");
    // To avoid breaking orgain page when copying more words
    // Cant copy when adding below this code
    // Dummy.style.display = "none"
    document.body.appendChild(dummy);
    // Be careful if you use texarea. setAttribute("value", value), which works with "input" does not work with "textarea".
    dummy.value = text;
    dummy.select();
    document.execCommand("copy");
    document.body.removeChild(dummy);
  }

  render() {
    const { classes } = this.props;

    document.title = "Schooly | Sistem Persekolahan Terbaik di Indonesia";

    return (
    <div className={classes.root}>
      <div className={classes.schoolyIntroductionBackground}>
        <div className={classes.schoolyIntroduction}>
          <Grid container justify="center" alignItems="center">
            <Grid item xs={12} sm={6}>
              <Typography variant="h4" gutterBottom>
                Schooly membuat pekerjaan sekolahmu lebih mudah.
              </Typography>
              <Typography variant="h6">
                Berikan pekerjaan sekolah dengan mudah. <br />
                Rangkum hasil pengecekkan dengan mudah. <br />
                Tidak pernah lupa dengan tugas sekolahmu.
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <img
                alt="Schooly Introduction"
                src={schoolyIntroduction}
                style={{maxWidth: "100%", maxHeight: "100%"}}
              />
            </Grid>
          </Grid>
        </div>
      </div>
      <div className={classes.schoolyAccessBackground}>
        <div className={classes.schoolyAccess}>
          <Grid item container direction="column" alignItems="center">
            <Grid item>
              <img
                alt="Schooly Access"
                src={schoolyAccess}
                style={{maxWidth: "100%", maxHeight: "100%"}}
              />
            </Grid>
            <Grid item>
              <Typography variant="h4" color="primary" gutterBottom>
                Akses dengan mudah di mana saja.
              </Typography>
              <Typography>
                Buka dan gunakan Schooly dengan mudah pada browser Anda di perangkat apa saja,
                dimana saja, dan kapan saja.
              </Typography>
            </Grid>
          </Grid>
        </div>
      </div>
      <div className={classes.schoolyFeaturesBackground}>
        <div className={classes.schoolyFeatures}>
          <Grid container spacing={3} justify="center" alignItems="stretch">
            <Grid item xs={12}>
              <Typography variant="h4" gutterBottom className={classes.schoolyFeaturesTitle}>
                Fitur-Fitur Schooly
              </Typography>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Paper variant="outlined" className={classes.featuresPaper}>
                <Avatar className={classes.featuresAvatar}>
                  <AssignmentIcon className={classes.featuresIcon} />
                </Avatar>
                <Typography className={classes.featuresText}>
                  Publikasi pekerjaan sekolah dengan mudah dan tidak pernah takut kehilangan data.
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Paper variant="outlined" className={classes.featuresPaper}>
                <Avatar className={classes.featuresAvatar}>
                  <PeopleIcon className={classes.featuresIcon} />
                </Avatar>
                <Typography className={classes.featuresText}>
                  Sistem yang terstruktur dengan jenis akun yang berbeda-beda mulai dari murid, guru, hingga pengelola.
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Paper variant="outlined" className={classes.featuresPaper}>
                <Avatar className={classes.featuresAvatar}>
                  <WatchLaterIcon className={classes.featuresIcon} />
                </Avatar>
                <Typography className={classes.featuresText}>
                  Tidak pernah lupa untuk mengumpulkan atau memeriksa pekerjaan sekolah lagi dengan pengingat dari Schooly.
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Paper variant="outlined" className={classes.featuresPaper}>
                <Avatar className={classes.featuresAvatar}>
                  <ContactlessIcon className={classes.featuresIcon} />
                </Avatar>
                <Typography className={classes.featuresText}>
                  Temukan kontak orang-orang sepersekolahanmu dengan mudah.
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </div>
      </div>
      <div className={classes.useSchooly}>
        <Typography variant="h4" color="primary" gutterBottom >
          Siap untuk Schooly?
        </Typography>
        <Typography paragraph>
          Klik tombol "Kirim Pesan" untuk menghubungi kami atau tombol "Salin Tautan" untuk mengirim tautan ini ke sekolah Anda.
        </Typography>
        <div style={{display: "flex", justifyContent: "space-between"}}>
          <Button
            variant="contained"
            href="mailto:schoolysystem@gmail.com"
            startIcon={<ContactMailIcon />}
            className={classes.sendMessageButton}
          >
            KIRIM PESAN
          </Button>
          <Button
            variant="contained"
            startIcon={<FilterNoneIcon />}
            className={classes.copyLinkButton}
            onClick={() => this.copyToClipboard("http://www.schoolysystem.com")}
          >
            SALIN TAUTAN
          </Button>
        </div>
      </div>
    </div>
  )
  }
};

Landing.propTypes = {
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  auth: state.auth,
});

export default withRouter(
  connect(mapStateToProps)
  (withStyles(styles)(Landing))
)
