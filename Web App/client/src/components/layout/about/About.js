import React from "react";
import whatIsSchooly from "./WhatIsSchooly.png";
import schoolyFeature1 from "./SchoolyFeature1.png";
import schoolyFeature2 from "./SchoolyFeature2.png";
import schoolyFeature3 from "./SchoolyFeature3.png";
import { Avatar, Button, Grid, Paper, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import BusinessCenterIcon from "@material-ui/icons/BusinessCenter";
import DescriptionIcon from "@material-ui/icons/Description";
import EmailIcon from "@material-ui/icons/Email";
import ForumIcon from "@material-ui/icons/Forum";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
  },
  whatIsSchoolyBackground: {
    backgroundColor: theme.palette.primary.light,
  },
  whatIsSchoolyTitle: {
    fontFamily: "Cambria",
  },
  whatIsSchooly: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "flex-end",
    textAlign: "center",
    margin: "auto",
    width: "1000px",
    height: "475px",
    backgroundImage: `url(${whatIsSchooly})`,
    backgroundPosition: "top",
    backgroundRepeat: "no-repeat",
    backgroundSize: "contain",
  },
  schoolyFeatures: {
    maxWidth: "1000px",
    margin: "auto",
  },
  moreFeaturesBackground: {
    backgroundColor: theme.palette.custombutton.main,
  },
  moreFeaturesTitle: {
    fontFamily: "Cambria",
  },
  moreFeatures: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "flex-end",
    textAlign: "center",
    margin: "auto",
    marginTop: "30px",
    maxWidth: "1000px",
  },
  featurePaper: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    height: "350px",
    padding: "20px",
  },
  featureAvatar: {
    width: theme.spacing(17.5),
    height: theme.spacing(17.5),
    backgroundColor: theme.palette.primary.main,
    marginBottom: "30px",
  },
  featureIcon: {
    width: theme.spacing(10),
    height: theme.spacing(10),
  },
  supportSchooly: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
    margin: "auto",
    marginTop: "30px",
    maxWidth: "1000px",
  },
  supportSchoolyButton: {
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
  }
}));

function About(props) {
  document.title = "Schooly | Tentang Schooly";

  const classes = useStyles();

  const [isFirsttimeRendered, setFirstTime] = React.useState(false)
  const { handleMarginTopValue } = props;
  if(!isFirsttimeRendered) {
    handleMarginTopValue(0);
    setFirstTime(true);
  }

  return (
    <div className={classes.root}>
      <div className={classes.whatIsSchoolyBackground}>
        <div className={classes.whatIsSchooly}>
          <Typography variant="h2" gutterBottom className={classes.whatIsSchoolyTitle}>
            Apa itu Schooly?
          </Typography>
          <Typography variant="h6" paragraph style={{width: "700px"}}>
            Schooly adalah sebuah sistem persekolahan berbasis aplikasi web yang dibuat untuk memudahkan dan membantu kegiatan belajar-mengajar yang terjadi di sekolah.
          </Typography>
          <Typography style={{paddingBottom: "40px"}}>
            "Kami percaya dengan bantuan teknologi pekerjaan apapun termasuk kegiatan persekolahan akan menjadi lebih efektif dan efisien."
          </Typography>
        </div>
      </div>
      <div className={classes.schoolyFeatures}>
        <Grid container direction="column">
          <Grid item container spacing={10} justify="center" alignItems="center">
            <Grid item xs={6}>
              <img src={schoolyFeature1} alt="Schooly Feature 1" />
            </Grid>
            <Grid item xs={6}>
              <Typography variant="h4" color="primary" gutterBottom>
               Semua kegiatan persekolahanmu ada di tanganmu
              </Typography>
              <Typography variant="h6">
               Schooly didesain dengan banyak fitur yang dapat menunjang kegiatan persekolahan yang lebih efektif dan efisien seperti tugas, kuis, hingga ujian.
              </Typography>
            </Grid>
          </Grid>
          <Grid item container spacing={10} justify="center" alignItems="center">
            <Grid item xs={6}>
              <Typography variant="h4" color="primary" gutterBottom>
               Akses dengan mudah
              </Typography>
              <Typography variant="h6">
               Akses merupakan salah satu hal yang paling penting dalam sebuah aplikasi.
               Schooly dibuat sebagai aplikasi web sehingga bisa diakses perangkat apa saja dengan mudah.
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <img src={schoolyFeature2} alt="Schooly Feature 2" />
            </Grid>
          </Grid>
          <Grid item container spacing={10} justify="center" alignItems="center">
            <Grid item xs={6}>
              <img src={schoolyFeature3} alt="Schooly Feature 3" />
            </Grid>
            <Grid item xs={6}>
              <Typography variant="h4" color="primary" gutterBottom>
               Media sosial persekolahan
              </Typography>
              <Typography variant="h6">
               Temukan kontak orang-orang sepersekolahan dengan mudah di Schooly.
               Anda juga tidak akan pernah lupa lagi akan tugas persekolahan anda dengan fitur pengingat baik untuk guru dan murid.
              </Typography>
            </Grid>
          </Grid>
        </Grid>
      </div>
      <div className={classes.moreFeaturesBackground}>
        <div className={classes.moreFeatures}>
          <Typography variant="h4" gutterBottom className={classes.moreFeaturesTitle}>
            Fitur-Fitur Schooly yang Akan Datang
          </Typography>
          <Typography variant="h6" style={{marginBottom: "50px"}}>
            Masih banyak fitur-fitur yang bisa dinantikan dari Schooly seperti:
          </Typography>
          <Grid container spacing={3} style={{marginBottom: "50px"}}>
            <Grid item xs={4}>
              <Paper className={classes.featurePaper}>
                <Avatar className={classes.featureAvatar}>
                  <DescriptionIcon className={classes.featureIcon} />
                </Avatar>
                <Typography>
                  Kuis dan Ujian dengan berbagai jenis pertanyaan dari pilihan ganda, isilah, dan jawaban panjang.
                  Dilengkapi dengan pengecek otomatis dari jenis pertanyaan ini.
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={4}>
              <Paper className={classes.featurePaper}>
                <Avatar className={classes.featureAvatar}>
                  <ForumIcon className={classes.featureIcon} />
                </Avatar>
                <Typography>
                  Diskusi antar guru dan murid mengenai sebuah tugas hingga sistem chatting antar orang dalam suatu lingkup sekolah.
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={4}>
              <Paper className={classes.featurePaper}>
                <Avatar className={classes.featureAvatar}>
                  <BusinessCenterIcon className={classes.featureIcon} />
                </Avatar>
                <Typography>
                  Bertanya langsung dengan alumni sekolah anda mengenai universitas impian hingga karir masa depan.
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </div>
      </div>
      <div className={classes.supportSchooly}>
        <Typography variant="h4" color="primary" gutterBottom >
          Sudah menggunakan Schooly tapi masih belum puas?
        </Typography>
        <Typography paragraph>
          Bantu Schooly berkembang dengan pendapat anda. Saran maupun kritik anda sangat berarti bagi kami.
        </Typography>
        <Button
          variant="contained"
          size="large"
          startIcon={<EmailIcon />}
          className={classes.supportSchoolyButton}
        >
          Kirim Pesan
        </Button>
      </div>
    </div>
  )
};

export default About;
