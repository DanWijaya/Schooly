import React, { useEffect } from "react";
import whatIsSchooly from "./WhatIsSchooly.png";
import backpackStudent from "./BackpackStudent-MateseFields.jpg";
import computerClass from "./ComputerClass-MimiThian.jpg";
import discussionWork from "./DiscussionWork-ScottGraham.jpg";
import onlineLearning from "./OnlineLearning-CompareFibre.jpg";
import schoolyFeature1 from "./SchoolyFeature1.png";
import schoolyFeature2 from "./SchoolyFeature2.png";
import schoolyFeature3 from "./SchoolyFeature3.png";
import { Button, Grid, Typography, Hidden, Paper } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import EmailIcon from "@material-ui/icons/Email";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
  },
  whatIsSchoolyBackground: {
    backgroundColor: theme.palette.primary.light,
  },
  whatIsSchooly: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "flex-end",
    margin: "auto",
    padding: "20px",
    color: "white",
    maxWidth: "80%",
    [theme.breakpoints.down("md")]: {
      maxWidth: "100%",
    },
  },
  schoolyDefinition: {
    maxWidth: "70%",
    [theme.breakpoints.down("sm")]: {
      maxWidth: "90%",
    },
  },
  schoolyQuotes: {
    maxWidth: "60%",
    [theme.breakpoints.down("sm")]: {
      maxWidth: "80%",
    },
  },
  whySchooly: {
    margin: "auto",
    marginTop: "10px",
    marginBottom: "10px",
    padding: "20px",
    maxWidth: "80%",
    [theme.breakpoints.down("md")]: {
      maxWidth: "100%",
    },
  },
  whySchooly1: {
    display: "flex",
    alignItems: "center",
    backgroundImage: `url(${backpackStudent})`,
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
    paddingLeft: "10%",
    borderRadius: "7.5px",
    height: "500px",
    [theme.breakpoints.down("sm")]: {
      height: "300px",
    },
  },
  whySchooly2: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundImage: `url(${computerClass})`,
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
    paddingLeft: "10%",
    borderRadius: "7.5px",
    width: "100%",
  },
  whySchooly3: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundImage: `url(${discussionWork})`,
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
    paddingLeft: "10%",
    borderRadius: "7.5px",
    width: "100%",
  },
  whySchooly4: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundImage: `url(${onlineLearning})`,
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
    paddingLeft: "10%",
    borderRadius: "7.5px",
    width: "100%",
  },
  schoolyFeatures: {
    margin: "auto",
    marginTop: "10px",
    marginBottom: "10px",
    padding: "20px",
    maxWidth: "80%",
    [theme.breakpoints.down("md")]: {
      maxWidth: "100%",
    },
  },
  supportSchoolyBackground: {
    backgroundColor: theme.palette.primary.fade,
  },
  supportSchooly: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "flex-end",
    margin: "auto",
    padding: "20px",
    maxWidth: "80%",
    [theme.breakpoints.down("md")]: {
      maxWidth: "100%",
    },
  },
  supportSchoolyButton: {
    backgroundColor: theme.palette.primary.main,
    color: "white",
    "&:focus, &:hover": {
      backgroundColor: theme.palette.primary.main,
      color: "white",
    },
  },
  centerImage: {
    display: "flex",
    justifyContent: "center",
  },
  imageSize: {
    [theme.breakpoints.down("xs")]: {
      maxWidth: "60%",
      maxHeight: "60%",
    },
    [theme.breakpoints.up("sm")]: {
      maxWidth: "100%",
      maxHeight: "100%",
    },
  },
}));

function About(props) {
  const classes = useStyles();

  document.title = "Schooly | Tentang Schooly";

  return (
    <div className={classes.root}>
      <div className={classes.whatIsSchoolyBackground}>
        <div className={classes.whatIsSchooly}>
          <img
            alt="What is Schooly"
            src={whatIsSchooly}
            style={{
              maxWidth: "100%",
              maxHeight: "100%",
              marginBottom: "20px",
            }}
          />
          <Typography style={{ fontFamily: "Caveat-SemiBold" }} variant="h3" align="center" gutterBottom>
            Schooly makes your school work easy!
          </Typography>
          <Typography
            variant="h6"
            align="center"
            paragraph
            className={classes.schoolyDefinition}
          >
            Schooly adalah sebuah sistem persekolahan berbasis aplikasi web yang
            dibuat untuk memudahkan dan membantu kegiatan belajar-mengajar yang
            ada di sekolah.
          </Typography>
          <Typography align="center" className={classes.schoolyQuotes}>
            "Kami percaya dengan bantuan teknologi pekerjaan apapun termasuk
            kegiatan persekolahan akan menjadi lebih efektif dan efisien."
          </Typography>
        </div>
      </div>
      <div className={classes.whySchooly}>
        <Grid container spacing={5}>
          <Grid item container>
          <Grid item xs={6}>
            test
          </Grid>
          <Grid item xs={6}>
            test
          </Grid>
          </Grid>
        </Grid>
      </div>
      <div className={classes.schoolyFeatures}>
        <Grid container spacing={5} direction="column">
          <Grid item container spacing={5} justify="center" alignItems="center">
            <Grid item xs={12} sm={6} className={classes.centerImage}>
              <img
                alt="Schooly Feature 1"
                src={schoolyFeature1}
                className={classes.imageSize}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="h4" color="primary" gutterBottom>
                Semua kegiatan persekolahanmu ada di tanganmu
              </Typography>
              <Typography variant="h6">
                Fitur Schooly yang bermacam-macam membuat kegiatan persekolahan
                lebih efektif dan efisien. Contohnya pengecekkan pekerjaan
                sekolah secara otomatis, pemberian materi tanpa harus mencetak,
                dan masih banyak lagi.
              </Typography>
            </Grid>
          </Grid>
          <Hidden xsDown>
            <Grid
              item
              container
              spacing={5}
              justify="center"
              alignItems="center"
            >
              <Grid item xs={12} sm={6}>
                <Typography variant="h4" color="primary" gutterBottom>
                  Akses dengan mudah
                </Typography>
                <Typography variant="h6">
                  Akses merupakan salah satu hal yang paling penting dalam
                  sebuah aplikasi. Schooly dibuat sebagai aplikasi web sehingga
                  bisa diakses perangkat apa saja dengan mudah.
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6} className={classes.centerImage}>
                <img
                  alt="Schooly Feature 2"
                  src={schoolyFeature2}
                  className={classes.imageSize}
                />
              </Grid>
            </Grid>
          </Hidden>
          <Hidden smUp>
            <Grid
              item
              container
              spacing={5}
              justify="center"
              alignItems="center"
            >
              <Grid item xs={12} sm={6} className={classes.centerImage}>
                <img
                  alt="Schooly Feature 2"
                  src={schoolyFeature2}
                  className={classes.imageSize}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="h4" color="primary" gutterBottom>
                  Akses dengan mudah
                </Typography>
                <Typography variant="h6">
                  Akses merupakan salah satu hal yang paling penting dalam
                  sebuah aplikasi. Schooly dibuat sebagai aplikasi web sehingga
                  bisa diakses perangkat apa saja dengan mudah.
                </Typography>
              </Grid>
            </Grid>
          </Hidden>
          <Grid item container spacing={5} justify="center" alignItems="center">
            <Grid item xs={12} sm={6} className={classes.centerImage}>
              <img
                alt="Schooly Feature 3"
                src={schoolyFeature3}
                className={classes.imageSize}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="h4" color="primary" gutterBottom>
                Media sosial persekolahan
              </Typography>
              <Typography variant="h6">
                Temukan kontak orang-orang sepersekolahan dengan mudah di
                Schooly. Sebarkan informasi mengenai kegiatan sekolah hanya
                dengan beberapa ketuk.
              </Typography>
            </Grid>
          </Grid>
        </Grid>
      </div>
      <div className={classes.supportSchoolyBackground}>
        <div className={classes.supportSchooly}>
          <Typography variant="h4" align="center" color="primary" gutterBottom>
            Ada masukan atau saran?
          </Typography>
          <Typography align="center" paragraph>
            Bantu Schooly berkembang dengan pendapat Anda. Saran maupun kritik
            Anda sangat berarti bagi kami.
          </Typography>
          <Button
            variant="contained"
            size="large"
            href="mailto:schoolysystem@gmail.com"
            startIcon={<EmailIcon />}
            className={classes.supportSchoolyButton}
          >
            Kirim Pesan
          </Button>
        </div>
      </div>
    </div>
  );
}

export default About;
