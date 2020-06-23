import React, { Component } from "react";
import schoolyIntroduction from "./SchoolyIntroduction.png";
import schoolyAccess from "./SchoolyAccess.png";
import { Avatar, Button, Grid, Paper, Typography } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import AssignmentIcon from "@material-ui/icons/Assignment";
import BusinessCenterIcon from "@material-ui/icons/BusinessCenter";
import ContactlessIcon from "@material-ui/icons/Contactless";
import ContactMailIcon from "@material-ui/icons/ContactMail";
import DescriptionIcon from "@material-ui/icons/Description";
import FilterNoneIcon from "@material-ui/icons/FilterNone";
import ForumIcon from "@material-ui/icons/Forum";
import PeopleIcon from "@material-ui/icons/People";
import WatchLaterIcon from "@material-ui/icons/WatchLater";

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
    maxWidth: "1000px",
    color: "white",
    margin: "auto",
  },
  schoolyIntroductionTitle: {
    fontFamily: "Cambria",
    color: "white"
  },
  schoolyAccessBackground: {
    backgroundColor: "#F5F5F5",
  },
  schoolyAccess: {
    maxWidth: "1000px",
    margin: "auto",
    marginTop: "30px",
    marginBottom: "30px",
    textAlign: "center",
  },
  schoolyFeaturesBackground: {
    backgroundColor: theme.palette.custombutton.main,
  },
  schoolyFeatures: {
    textAlign: "center",
    maxWidth: "1000px",
    margin: "auto",
    marginTop: "75px",
    marginBottom: "75px",
  },
  schoolyFeaturesTitle: {
    color: "grey"
  },
  featuresPaper: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    height: "350px",
    padding: "20px",
  },
  featuresAvatar: {
    width: theme.spacing(15),
    height: theme.spacing(15),
    marginBottom: "30px",
    backgroundColor: "white",
    color: theme.palette.primary.main,
  },
  featuresIcon: {
    width: theme.spacing(10),
    height: theme.spacing(10),
    color: theme.palette.primary.main,
  },
  useSchooly: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
    margin: "auto",
    marginTop: "30px",
    maxWidth: "1000px",
  },
  useSchoolyButtonContainer: {
    display: "flex",
    justifyContent: "space-between"
  },
  sendMessageButton: {
    width: "200px",
    marginRight: "30px",
    backgroundColor: theme.palette.primary.main,
    color: "white",
    "&:focus": {
      backgroundColor: theme.palette.primary.main,
      color: "white",
    },
    "&:hover": {
      backgroundColor: theme.palette.primary.main,
      color: "white",
    },
  },
  copyLinkButton: {
    width: "200px",
    backgroundColor: "white",
    color: theme.palette.primary.main,
    "&:focus": {
      backgroundColor: "white",
      color: theme.palette.primary.main,
    },
    "&:hover": {
      backgroundColor: "white",
      color: theme.palette.primary.main,
    },
  }
});

class Landing extends Component {

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.handleMarginTopValue(0);
  }

  copyToClipboard(text) {
    var dummy = document.createElement("textarea");
    // to avoid breaking orgain page when copying more words
    // cant copy when adding below this code
    // dummy.style.display = 'none'
    document.body.appendChild(dummy);
    //Be careful if you use texarea. setAttribute('value', value), which works with "input" does not work with "textarea". – Eduard
    dummy.value = text;
    dummy.select();
    document.execCommand("copy");
    document.body.removeChild(dummy);
  }

  render() {
    document.title = "Schooly | Sistem Persekolahan Pertama di Indonesia";

    const { classes } = this.props;

    return (
    <div className={classes.root}>
      <div className={classes.schoolyIntroductionBackground}>
        <div className={classes.schoolyIntroduction}>
          <Grid container spacing={10} justify="center" alignItems="center">
            <Grid item xs={6}>
              <Typography
                className={classes.schoolyIntroductionTitle}
                variant="h4"
                color="primary"
                gutterBottom
              >
               Schooly membuat pekerjaan sekolahmu lebih mudah.
              </Typography>
              <Typography variant="h6">
               Berikan pekerjaan sekolah dengan mudah. Rangkum hasil pengecekkan dengan mudah.
               Tidak pernah lupa dengan tugas persekolahanmu.
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <img src={schoolyIntroduction} alt="Schooly Introduction" />
            </Grid>
          </Grid>
        </div>
      </div>
      <div className={classes.schoolyAccessBackground}>
        <div className={classes.schoolyAccess}>
          <Grid item container direction="column" alignItems="center">
            <Grid item>
              <img src={schoolyAccess} alt="Schooly Access" />
            </Grid>
            <Grid item>
              <Typography variant="h4" color="primary" gutterBottom>
               Akses dengan mudah di mana saja.
              </Typography>
              <Typography variant="h6">
               Buka dan gunakan Schooly dengan mudah pada browser anda di perangkat apa saja,
               dimana saja, dan kapan saja.
              </Typography>
            </Grid>
          </Grid>
        </div>
      </div>
      <div className={classes.schoolyFeaturesBackground}>
        <div className={classes.schoolyFeatures}>
          <Grid container spacing={3} justify="center" alignItems="center">
            <Grid item xs={12}>
              <Typography variant="h4" gutterBottom className={classes.schoolyFeaturesTitle}>
               Fitur-Fitur Schooly
              </Typography>
            </Grid>
            <Grid item xs={3}>
              <Paper variant="outlined" className={classes.featuresPaper}>
                <Avatar className={classes.featuresAvatar}>
                  <AssignmentIcon className={classes.featuresIcon} />
                </Avatar>
                <Typography>
                  Publikasi pekerjaan sekolah dengan mudah dan tidak pernah takut kehilangan data.
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={3}>
              <Paper variant="outlined" className={classes.featuresPaper}>
                <Avatar className={classes.featuresAvatar}>
                  <PeopleIcon className={classes.featuresIcon} />
                </Avatar>
                <Typography>
                  Sistem yang terstruktur dengan jenis akun yang berbeda-beda mulai dari pengelola, guru, hingga murid.
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={3}>
              <Paper variant="outlined" className={classes.featuresPaper}>
                <Avatar className={classes.featuresAvatar}>
                  <WatchLaterIcon className={classes.featuresIcon} />
                </Avatar>
                <Typography>
                  Tidak pernah lupa untuk mengumpulkan atau memeriksa pekerjaan sekolah lagi dengan pengingat dari Schooly.
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={3}>
              <Paper variant="outlined" className={classes.featuresPaper}>
                <Avatar className={classes.featuresAvatar}>
                  <ContactlessIcon className={classes.featuresIcon} />
                </Avatar>
                <Typography>
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
          Klik tombol "Kirim Pesan" untuk menghubungi kami atau tombol "Salin Tautan" untuk mengirim tautan ini ke sekolah anda.
        </Typography>
        <div className={classes.useSchoolyButtonContainer}>
          <Button
            variant="contained"
            size="large"
            href="mailto:schoolysystem@gmail.com"
            startIcon={<ContactMailIcon />}
            className={classes.sendMessageButton}
          >
            Kirim Pesan
          </Button>
          <Button
            variant="contained"
            size="large"
            startIcon={<FilterNoneIcon />}
            className={classes.copyLinkButton}
            onClick={() => this.copyToClipboard("http://www.schoolysystem.com")}
          >
            Salin Tautan
          </Button>
        </div>
      </div>
    </div>
  )
  }
};

export default withStyles(styles)(Landing);
